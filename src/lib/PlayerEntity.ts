abstract class PlayerEntity {
    playerName: string;

    constructor(playerName: string) {
        this.playerName = playerName;
    }

    kill() {
        tfm.exec.killPlayer(this.playerName);
    }

    respawn() {
        tfm.exec.respawnPlayer(this.playerName);
    }

    move(x: number, y: number) {
        tfm.exec.movePlayer(this.playerName, x, y)
    }

    cheese(set: boolean = true) {
        if (set) {
            tfm.exec.giveCheese(this.playerName);
        } else {
            tfm.exec.removeCheese(this.playerName);
        }
    }

    bindKeyboard(key: number, press: boolean, enable?: boolean) {
        system.bindKeyboard(this.playerName, key, press, enable);
    }

    bindMouse(enabled?: boolean) {
        system.bindMouse(this.playerName, enabled);
    }

    lowerSyncDelay() {
        tfm.exec.lowerSyncDelay(this.playerName);
    }

    chatMessage(message: string) {
        tfm.exec.chatMessage(message, this.playerName);
    }

    get data() {
        return tfm.get.room.playerList[this.playerName];
    }
}