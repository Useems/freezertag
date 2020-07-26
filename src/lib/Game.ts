const maps = [6166453, 7647541, 7647591, 7647776, 7659238, 7659320, 7659325, 7659444, 7659329, 7659330, 7659334, 7659340, 7659429, 7659433, 7664195, 7671633, 7686423, 7743425, 7664262, 7104048, 7659341, 7647524, 7647519, 7647472, 7647551, 4743573, 7659441, 7659336, 7647598, 7647557, 7647498, 4360147];

class Game {
    private maps: number[] = maps;
    private maps_cache: number[] = [];

    public freezers_alive: number = 0;
    public participants_alive: number = 0;

    public frozen: PlayerObject = {};
    private participants: PlayerObject = {};
    
    public started: boolean = false;
    public ended: boolean = false;
    public changing_map: boolean = false;
    public next_map: number = -1;

    next() {
        if (this.next_map != -1) {
            tfm.exec.newGame(this.next_map);

            this.next_map = -1;
        } else if (!this.changing_map) {
            this.changing_map = true;

            if (this.maps_cache.length === 0) {
                for (let i = 0; i < this.maps.length; i++) {
                    this.maps_cache[this.maps_cache.length] = this.maps[i];
                }
            }

            tfm.exec.newGame(table.remove(this.maps_cache, math.random(this.maps_cache.length)));
        }
    }

    nextMap(map: number) : boolean {
        if (this.next_map === -1) {
            this.next_map = map;

            return true;
        }

        return false;
    }

    reset() {
        this.freezers_alive = 0;
        this.participants_alive = 0;

        this.frozen = {};
        this.participants = {};

        this.started = false;
        this.ended = false;
        this.changing_map = false;
    }

    addFrezer(player: Player) {
        if (!player.isFreezer) {
            this.freezers_alive++;

            player.isFreezer = true;
            player.chance = 1;
            player.chatMessage(translate("are_freezer"));
            tfm.exec.setNameColor(player.playerName, 0x009DFF);
        }
    }

    removeFreezer(player: Player) {
        if (player.isFreezer) {
            player.isFreezer = false;
            this.freezers_alive--;
        }
    }

    addParticipant(player: Player) {
        if (!this.participants[player.playerName]) {
            this.participants[player.playerName] = player;
            this.participants_alive++;

            player.isFreezer = false;
            player.chatMessage(string.format(translate("are_unfreezer"), player.lifes));
        }
    }

    removeParticipant(playerName: string) {
        if (this.participants[playerName]) {
            delete this.participants[playerName];
            this.participants_alive--;
        }
    }

    freezePlayer(player: Player) : boolean {
        if (!player.isFrozen && !player.isFreezer && player.data && !player.data.isDead && !this.ended && !player.imortal) {
            player.lifes--;

            if (player.lifes > 0)
                this.frozen[player.playerName] = player;
            else
                tfm.exec.chatMessage(string.format(translate("now_popsicle"), player.playerName));

            player.kill();
            player.iceObject = tfm.get.room.objectList[tfm.exec.addShamanObject(54, player.data.x, player.data.y, 0, 0, 0, false)];
 
            return true;
        }

        return false;
    }

    unfreezePlayer(player: Player) : boolean {
        if (player.isFrozen && player.data) {
            delete this.frozen[player.playerName];
            ui.removeTextArea(player.data.id);

            if (player.iceObject.id)
                tfm.exec.removeObject(player.iceObject.id);

            player.respawn();
            return true;
        }

        return false;
    }

    check() {
        // print(`${this.freezers_alive}, ${this.participants_alive}`);

        if (this.freezers_alive === 0 && this.participants_alive === 0) {
            if (!this.ended)
                tfm.exec.chatMessage(translate("noonewon"));

            this.end();
        } else if (this.freezers_alive === 0) {
            tfm.exec.chatMessage(translate("unfreezerswon"));
            this.end("participants");
        } else if (this.participants_alive === 0) {
            tfm.exec.chatMessage(translate("freezerswon"));
            this.end("freezers");
        }
    }

    end(whoWon?: string) {
        if (!this.ended) {
            if (whoWon) {       
                for (let playerName in tfm.get.room.playerList) {
                    let player = players.get(playerName);

                    if (player.data && !player.data.isDead) {
                        if (whoWon == "freezers") {
                            if (player.isFreezer) {
                                player.cheese();
                            }
                        } else if (!player.isFreezer) {
                            player.cheese();
                        }
                    }
                }

                let ids = [];

                for (let i in tfm.get.room.objectList)
                    ids[ids.length] = tfm.get.room.objectList[i].id;

                for (let i = 0; i < ids.length; i++)
                    tfm.exec.removeObject(ids[i]);

                for (let playerName in this.frozen)
                    if (this.frozen[playerName].data)
                        ui.removeTextArea(this.frozen[playerName].data.id);

                this.frozen = {};

                tfm.exec.setGameTime(30);
            } else {
                tfm.exec.setGameTime(10);
            }

            this.ended = true;
        } else {
            this.next();
        }
    }
}

const game = new Game();