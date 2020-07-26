declare namespace math {
    export function random(this: void, min?: number, max?: number): number;
}

declare namespace string {
    export function format(this: void, str: string, ...args: any[]): string;
}

declare namespace table {
    export function remove(this: void, table: any[], index: number): any;
}

declare namespace os {
    export function time(this: void): number;
}

declare namespace tfm {
    export namespace get {
        export const misc: any;

        export namespace room {
            export const playerList: any;
            export const community: string;
            export const currentMap: number;
            export const maxPlayers: number;
            export const mirroredMap: boolean;
            export const name: string;
            export const objectList: any;
            export const passwordProtected: boolean;
            export const uniquePlayers: number;
            export namespace xmlMapInfo {
                export const author: string;
                export const mapCode: number;
                export const permCode: number;
                export const xml: string;
            }
        }
    }

    export namespace exec {
        export function respawnPlayer(this: void, player: string): void;
        export function giveCheese(this: void, player: string): void;
        export function removeCheese(this: void, player: string): void;
        export function addConjuration(this: void, x: number, y: number, duration?: number): void;
        export function addImage(this: void, id: string, type: string, x?: number, y?: number, player?: string): number;
        export function addJoint(this: void, id: number, floor1: number, floor2: number, properties: Object): void;
        export function addPhysicObject(this: void, id: number, x: number, y: number, properties: Object): void;
        export function addShamanObject(this: void, type: number, x: number, y: number, angle?: number, velocityX?: number, velocityY?: number, transparent?: boolean): number;
        export function changePlayerSize(this: void, player: string, size?: number): void;
        export function chatMessage(this: void, message: string|number, player?: string): void;
        export function disableAfkDeath(this: void, disable?: boolean): void;
        export function disableAllShamanSkills(this: void, disable?: boolean): void;
        export function disableAutoNewGame(this: void, disable?: boolean): void;
        export function disableAutoScore(this: void, disable?: boolean): void;
        export function disableAutoShaman(this: void, disable?: boolean): void;
        export function disableAutoTimeLeft(this: void, disable?: boolean): void;
        export function disableDebugCommand(this: void, disable?: boolean): void;
        export function disableMinimalistMode(this: void, disable?: boolean): void;
        export function disableMortCommand(this: void, disable?: boolean): void;
        export function disablePhysicalConsumables(this: void, disable?: boolean): void;
        export function disableWatchCommand(this: void, disable?: boolean): void;
        export function disablePrespawnPreview(this: void, show?: boolean): void;
        export function displayParticle(this: void, type: number, x: number, y: number, velocityX?: number, velocityY?: number, acelerationX? :number, acelerationY?: number, player?: string): void;
        export function explosion(this: void, x: number, y: number, power: number, radio: number, affectObjects?: boolean): void;
        export function giveConsumables(this: void, player: string, id: string, amount?: string): void;
        export function giveMeep(this: void, player: string, enabled?: boolean): void;
        export function giveTransformations(this: void, player: string, enabled?: boolean): void;
        export function killPlayer(this: void, player: string): void;
        export function linkMice(this: void, player1: string, player2: string, enabled?: boolean): void;
        export function lowerSyncDelay(this: void, player: string): void;
        export function moveObject(this: void, id: number, x: number, y: number, sumPosition?: boolean, velocityX?: number, velocityY?: number, sumVelocity?: boolean, angle?: number, sumAngle?: boolean): void;
        export function movePlayer(this: void, player: string, x: number, y: number, sumPosition?: boolean, velocityX?: number, velocityY?: number, sumVelocity?: boolean): void;
        export function newGame(this: void, code?: (string | number), reflected?: boolean): void;
        export function playEmote(this: void, player: string, type: number, flag?: string): void;
        export function playerVictory(this: void, player: string): void;
        export function removeImage(this: void, id: number): void;
        export function removeObject(this: void, id: number): void;
        export function removeJoint(this: void, id: number): void;
        export function removePhysicObject(this: void, id: number): void;
        export function setAutoMapFlipMode(this: void, reflected?: boolean): void;
        export function setGameTime(this: void, time: number, control?: boolean): void;
        export function setNameColor(this: void, player: string, color: number): void;
        export function setPlayerScore(this: void, player: string, points: number, sum?: boolean): void;
        export function setRoomMaxPlayers(this: void, max: number): void;
        export function setRoomPassword(this: void, password: string): void;
        export function setShaman(this: void, player: string, enabled?: boolean): void;
        export function setShamanMode(this: void, player: string, mode?: number): void;
        export function setVampirePlayer(this: void, player: string, mode?: number): void;
        export function snow(this: void, time?: number, power?: number): void;
    }
}

declare namespace ui {
    export function addPopup(this: void, id: number, type: number, text: string, player: string, x?:  number, y?: number, width?: number, fixed?: boolean): void;
    export function addTextArea(this: void, id: number, text: string, player?: string, x?: number, y?: number, width?: number, height?: number, colorBackground?: number, colorBorder?: number, opacity?: number, fixed?: boolean): void;
    export function removeTextArea(this: void, id: number, player?: string): void;
    export function setMapName(this: void, text: string): void;
    export function setShamanName(this: void, text: string): void;
    export function showColorPicker(this: void, id: number, player?: string, defaultColor?: number, title?: string): void;
    export function updateTextArea (this: void, id: number, text: string, player?: string): void;
}

declare namespace debug {
    export function disableEventLog(this: void, enabled?: boolean): void;
}

declare namespace system {
    export function bindKeyboard(this: void, player: string, key: number, press: boolean, enabled?: boolean): void;
    export function bindMouse(this: void, player: string, enabled?: boolean): void;
    export function disableChatCommandDisplay(this: void, command?: string, hide?: boolean): void;
    export function exit(this: void): void;
    export function giveEventGift(this: void, player: string, id: string): void;
    export function loadFile(this: void, id?: number): boolean;
    export function loadPlayerData(this: void, player: string): boolean;
    export function newTimer(this: void, callback: VoidFunction, time: number, loop?: boolean, arg1?: any, arg2?: any, arg3?: any, arg4?: any): number;
    export function removeTimer(this: void, id: number): void;
    export function saveFile(this: void, file: string, id?: number): boolean;
    export function savePlayerData(this: void, player: string, id: string): void;
}

declare namespace _G {
    export function _(this: void): void;
}

declare function print(this: void, text: any): void;
declare function tonumber(this: void, text: any): number;

type GameObject = {
    id?: number,
    x?: number,
    y?: number
}

type PlayerList = {
    x: number,
    y: number,
    isDead: boolean,
    movingLeft: boolean,
    movingRight: boolean,
    isJumping: boolean
}

type PrivLevel = {
    [key: string]: {
        rank: string,
        priv: number
    }
}

type PlayerObject = {
    [key: string]: Player
}