class Player extends PlayerEntity {
    public id: number;
    private priv: number = 0;
    private canDoCache: { [key: string] : number} = {};
    private life_images: number[] = [];
    
    public banned: boolean = false;

    public chance: number = 1;
    public lifes: number = 0;

    public canPlay: boolean = false;
    public isFreezer: boolean = false;
    public imortal: boolean = false;

    public iceObject: GameObject = {};

    constructor(playerName: string) {
        super(playerName);
        players.set(this);

        this.id = this.data.id;

        this.bindKeyboard(32, true, true);
        this.lowerSyncDelay();

        if (staff[playerName])
            this.priv = staff[playerName];

        this.chatMessage(translate("welcome"));
    }

    rejoin(playerName: string) {
        this.bindKeyboard(32, true, true);
        this.lowerSyncDelay();

        this.chatMessage(translate("welcome_back"));
    }

    onCommand(command: string) : void {
        let cmd = command.split(' ');

        if (this.hasPriv(2)) {
            if (cmd[0] == "ban" && cmd[1]) {
                let player = players.get(cmd[1]);

                if (player)
                    if (player.priv < 2 || (player.priv >= 2 && this.hasPriv(player.priv)))
                        if (player.ban())
                            this.chatMessage(translate("player_banned"));
            } else if (cmd[0] == "unban" && cmd[1]) {
                let player = players.get(cmd[1]);

                if (player)
                    if (player.priv < 2 || (player.priv >= 2 && this.hasPriv(player.priv)))
                        if (player.unban())
                            this.chatMessage(translate("player_unbanned"));
            } else if (cmd[0] == "next") {
                game.next();
            } else if (cmd[0] == "npp" && typeof(tonumber(cmd[1])) == "number") {
                if (game.nextMap(tonumber(cmd[1])))
                    this.chatMessage(`<VP>${translate("done")}</VP>`);
            }

            if (this.hasPriv(4, false)) {
                if (cmd[0] == "imortal") {
                    if (this) {
                        this.imortal = !this.imortal;
                        this.chatMessage(this.imortal.toString());
                    }
                }
            }
        }
    }

    onDied() {
        if (game.started) {
            if (!this.isFrozen) {
                if (this.isFreezer) {
                    game.removeFreezer(this);
                } else {
                    game.removeParticipant(this.playerName);
                }
            } else {
                if (!this.isFreezer) {
					game.participants_alive--;
                } else
                    game.freezers_alive++;
            }

            if (!game.ended || (game.freezers_alive === 0 && game.participants_alive === 0))
                game.check();
        } else {
			this.lifes = 0;
		}

        this.showLifes();
    }

    onWin() {
        this.onDied();
    }

    onRespawn() {
        if (game.started) {
            if (!this.isFreezer && this.iceObject.x && this.iceObject.y) {
                this.move(this.iceObject.x, this.iceObject.y);
                this.iceObject = {};

                game.participants_alive++;
            }
        }

        this.showLifes();
    }

    onLeft() {
        ui.removeTextArea(this.id);
    }

    onKeyboard(key: number, pressed: boolean, x: number, y: number) {
        if (key === 32 && !this.data.isDead && this.canDo("key_space_min_delay", 500, false)) {
            let radius = this.isFreezer ? 50 : 70;
            let players_target = this.isFreezer ? tfm.get.room.playerList : game.frozen;

            for (let target_playerName in players_target) {
                let target = this.isFreezer ? players.get(target_playerName) : players_target[target_playerName];

                if (!target.isFreezer && target.data) {
                    let object = this.isFreezer ? target.data : tfm.get.room.objectList[target.iceObject.id];

                    if (object && Math.abs(object.x - this.data.x) <= radius && Math.abs(object.y - this.data.y) <= radius) {
                        if (this.isFreezer) {
                            if (!target.isFrozen && this.canDo("key_space", 3000, false))
                                if (game.freezePlayer(target)) {
                                    target.chatMessage(translate("frozen"));

                                    if (target.lifes > 0)
                                        target.chatMessage(string.format(translate("frozen_life"), target.lifes));
                                }
                        } else if (target.isFrozen && target.data.isDead && this.canDo("key_space", 6000, false)) {
                            if (game.unfreezePlayer(target)) {
                                target.chatMessage(string.format(translate("unfreezed"), this.playerName));

                                let lucky = math.random(100);

                                if (lucky <= 15) {
                                    this.lifes++;
                                    this.showLifes();
                                }

                                this.chatMessage(string.format(translate(lucky <= 15 ? "gotLife" : "unfreezedsomeone"), target.playerName));
                            }
                        }

                        break
                    }
                }
            }
        }
    }

    showLifes() {
        tfm.exec.setPlayerScore(this.playerName, this.lifes, false);

        for (let i = 0; i < this.life_images.length; i++) {
            tfm.exec.removeImage(this.life_images[i]);
        }

        this.life_images = [];

        for (let i = 0; i < this.lifes; i++) {
            this.life_images[this.life_images.length] = tfm.exec.addImage('1674802a592.png', ':1', 5 + (28 * i), 23, this.playerName);
        }
    }

    hasPriv(priv: number, message: boolean = true) : Boolean {
        if (this.priv >= priv) {
            return true;
        }

        if (message)
            this.chatMessage(translate("no_permission"));

        return false;
    }

    ban() : boolean {
        if (!this.banned) {
			game.unfreezePlayer(this);
            this.banned = true;
            this.kill();
			this.lifes = 0;
			this.showLifes();
            this.chatMessage(translate("banned"));

            return true;
        }

        return false;
    }

    unban() : boolean {
        if (this.banned) {
            this.banned = false;
            this.chatMessage(translate("unbanned"));

            return true;
        }

        return false;
    }

    canDo(type: string, time: number, start: boolean) : boolean {
        var firstLoad = false;

        if (!this.canDoCache[type]) {
            this.canDoCache[type] = os.time() + time;

            if (!start)
                firstLoad = true;
        }

        if (firstLoad || this.canDoCache[type] <= os.time()) {
            this.canDoCache[type] = os.time() + time;
            return true;
        } else {
            return false;
        }
    }

    get isFrozen() : boolean {
        return game.frozen[this.playerName] ? true : false;
    }

    reset() {
        this.canPlay = false;
        this.isFreezer = false;
        this.imortal = false;
        this.iceObject = {};
        this.canDoCache = {};
        this.lifes = 0;
        this.showLifes();
    }
}