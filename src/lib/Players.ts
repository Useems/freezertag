class Players {
    list: PlayerObject = {};

    constructor() {

    }

    set(player: Player) {
        this.list[player.playerName] = player;

        return player;
    }

    get(playerName: string) {
        return this.list[playerName] || false;
    }

    call(func: string, playerName: string, ...args: any[]) {
        let player = players.get(playerName);

        if (player && typeof (player as any)[func] === 'function')
            (player as any)[func](...args);
    }
}

var players: Players = new Players();