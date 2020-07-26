const events = {
    eventPlayerRespawn: "onRespawn",
    eventPlayerDied: "onDied",
    eventChatMessage: "onMessage",
    eventChatCommand: "onCommand",
    eventKeyboard: "onKeyboard",
    eventMouse: "onClick",
    eventPlayerWon: "onWin",
    eventPlayerLeft: "onLeft"
}

for (let i in events) {
    (_G as any)[i] = (playerName: string, ...args: any[]) => {
        players.call((events as any)[i], playerName, ...args);
    }
}

function eventLoop(current: number, remaining: number) {
    if (!game.ended) {
        if (!game.started) {
            if (current >= 10000) {
                let participants: Player[] = [];
                let total_chance = 0;

                for (let playerName in tfm.get.room.playerList) {
                    let player = players.get(playerName);

                    if (player.data)
                        if (!player.data.isDead && player.canPlay) {
                            total_chance += player.chance;
                            participants[participants.length] = player;
                            player.lifes = 3;
                        } else {
                            tfm.exec.killPlayer(playerName);
                            player.lifes = 0;
                        }

                    player.showLifes();
                }

                if (participants.length > 0) {
                    let p = Math.floor(participants.length/10) + 1;

                    for (let _ = 0; _ < p; _++) {
                        let rand = math.random() * total_chance;
                        let found = false;

                        while (!found) {
                            for (let i = 0; i < participants.length; i++) {
                                let player = participants[i];
        
                                if (rand < player.chance) {
                                    total_chance -= player.chance;
                                    player.chance = 1;
                                    player.lifes = 0;
                                    player.showLifes();

                                    table.remove(participants, i);
                                    game.addFrezer(player);

                                    found = true;
                                    break;
                                } else {
                                    rand -= player.chance;
                                }
                            }
                        }
                    }

                    for (let playerName in tfm.get.room.playerList) {
                        let player = players.get(playerName)

                        if (player.data && !player.data.isDead && !player.isFreezer) {
                            game.addParticipant(player);
                            total_chance++;
                            player.chance++;
                        }
                    }
                }

                game.started = true;
                game.check();
            } else if (current >= 1000) {
                for (let playerName in tfm.get.room.playerList) {
                    let player = players.get(playerName);

                    if (player.data && !player.canPlay && !player.data.isDead) {
                        if (player.data.movingLeft || player.data.movingRight || player.data.isJumping) {
                            player.canPlay = true;
                        }
                    }
                }
            }
        } else {
            if (remaining <= 30000) {
                game.end("participants");
            }

            for (let playerName in game.frozen) {
                let player = game.frozen[playerName];

                if (player.iceObject.id && player.iceObject.x && player.iceObject.y) {
                    let object = tfm.get.room.objectList[player.iceObject.id];

                    if (player.data)
                        ui.addTextArea(player.data.id, `<B><font color="#000000">${playerName}</font></B>\n<p align="center"><B><R>${player.lifes} HP</R></B></p>`, undefined, object.x - (playerName.length * 4), object.y - 10, 0, 0, 1, 1, 0, false);
                }
            }
        }
    } else {
        for (let playerName in tfm.get.room.playerList) {
            if (staff[playerName]) {
                let player = players.get(playerName);

                if (player.data && !player.data.isDead) {
                    if (staff[playerName] == 4) {
                        tfm.exec.setNameColor(playerName, math.random(0x000000, 0xFFFFFF))
                    } else if (staff[playerName] == 3) {
                        tfm.exec.setNameColor(playerName, 0x31FEEF)
                    } else if (staff[playerName] == 2) {
                        tfm.exec.setNameColor(playerName, 0xFFBCD8)
                    }
                }
            }
        }
    }

    if (remaining <= 0) {
        game.end("participants");
    }
}

function eventNewPlayer(playerName: string) {
    let player = players.get(playerName);

    if (!player)
        player = players.set(new Player(playerName));
    else
        players.call("rejoin", playerName);
}

function eventNewGame() {
    tfm.exec.setGameTime(170);
    game.reset();

    for (let playerName in tfm.get.room.playerList) {
        let player = players.get(playerName);
        player.reset();

        if (player.banned)
            player.kill();
        else {
            tfm.exec.setNameColor(playerName, 0xB5B5B5);
        }
    }
}

for (let playerName in tfm.get.room.playerList)
    eventNewPlayer(playerName);

tfm.exec.setRoomMaxPlayers(25);
system.disableChatCommandDisplay();

tfm.exec.disableAutoShaman();
tfm.exec.disableAutoNewGame();
tfm.exec.disableAutoTimeLeft();
tfm.exec.disableAutoScore();
tfm.exec.disablePhysicalConsumables();
tfm.exec.disableDebugCommand();
tfm.exec.disableMinimalistMode();

game.next();