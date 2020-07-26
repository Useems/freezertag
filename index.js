const tstl = require('typescript-to-lua');
const fs = require('fs');
const chokidar = require('chokidar');
const chalk = require('chalk');
const path = require('path');
const tsconfig = require('./tsconfig.json');
const luamin = require('luamin');
const files = tsconfig['tstl-watch'] ? tsconfig['tstl-watch'].files || [] : [];
const outFile = tsconfig.tstl.outFile || tsconfig.compilerOptions.outFile || './index.lua';

tsconfig.tstl = {...tsconfig.tstl, ...tsconfig.compilerOptions};
tsconfig.tstl.outFile = undefined;

async function reload(_path) {
	if (_path) {
		if (_path.replace(__dirname, '').indexOf('\\src\\') != 0)
			return
	}

	console.clear();
	console.log(chalk.gray('Reloading...'));
	
	let project = {};
	let final_data = `
		unpack = table.unpack;
	`;

	for (let file in files) {
		let dir = './src/' + files[file];

		let data = await new Promise((resolve, reject) => {
			fs.readFile(dir, 'utf8', (err, data) => {
				if (err)
					return reject(err);
				
				resolve(data);
			});
		});

		final_data += '\n' + data;
		project[`file_${file}.ts`] = data;
	}

	let result = tstl.transpileVirtualProject(project, tsconfig.tstl);
	let data = '';

	for (let i in result.transpiledFiles) {
		data += '\n' + result.transpiledFiles[i].lua;
	}

	// data = luamin.minify(data);

	if (result.diagnostics.length > 0) {
		for (let i in result.diagnostics) {
			let error = result.diagnostics[i];
			console.log(`[TS${error.code}] ${error.file ? error.file.fileName : ''}(${error.start}, ${error.length}) `, error.messageText);
		}
	} else {
		let final_result = tstl.transpileVirtualProject({'main.ts': final_data}, tsconfig.tstl);

		fs.writeFile(outFile, final_result.transpiledFiles[0].lua, function(err) {
			if (err)
				return console.log('Error on save file: ', err);

			console.log(chalk.green('Built!'));
		});
	}
}

reload();

chokidar.watch(path.join(__dirname, '/src/'), {persistent: true})
.on('change', reload)
.on('error', function(error) {console.error('Error happened', error);})