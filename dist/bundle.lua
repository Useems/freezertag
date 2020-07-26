-- Lua Library inline imports
function __TS__Index(classProto)
    return function(tbl, key)
        local proto = classProto
        while true do
            local val = rawget(proto, key)
            if val ~= nil then
                return val
            end
            local getters = rawget(proto, "____getters")
            if getters then
                local getter
                getter = getters[key]
                if getter then
                    return getter(tbl)
                end
            end
            local base = rawget(
                rawget(proto, "constructor"),
                "____super"
            )
            if not base then
                break
            end
            proto = rawget(base, "prototype")
        end
    end
end

function __TS__StringSplit(source, separator, limit)
    if limit == nil then
        limit = 4294967295
    end
    if limit == 0 then
        return {}
    end
    local out = {}
    local index = 0
    local count = 0
    if separator == nil or separator == "" then
        while index < #source - 1 and count < limit do
            out[count + 1] = string.sub(source, index + 1, index + 1)
            count = count + 1
            index = index + 1
        end
    else
        local separatorLength = #separator
        local nextIndex = ((string.find(source, separator, nil, true) or 0) - 1)
        while nextIndex >= 0 and count < limit do
            out[count + 1] = string.sub(source, index + 1, nextIndex)
            count = count + 1
            index = nextIndex + separatorLength
            nextIndex = ((string.find(source, separator, index + 1, true) or 0) - 1)
        end
    end
    if count < limit then
        out[count + 1] = string.sub(source, index + 1)
    end
    return out
end

local game
unpack = table.unpack
local staff = {["Nettoork#0000"] = 4, ["Star#8558"] = 2, ["Maarrieh#0000"] = 2}
local community = tfm.get.room.community
local translate_messages = {en = {done = "Done", welcome = "<VP>Welcome to #freezertag!</VP>", welcome_back = "<VP>Welcome back to #freezertag!</VP>", no_permission = "<R>You haven\'t permission to do it.</R>", banned = "<R>You\'ve been banned from the room.</R>", unbanned = "<VP>You can now return to play normally.</VP>", player_banned = "Player punished.", player_unbanned = "Player absolved.", freezerswon = "<D>Alive freezers won!</D>", unfreezerswon = "<D>Alive players won!</D>", noonewon = "<D>No one won!</D>", frozen = "<BV>Wooww, so cold... You are frozen!</BV>", unfreezed = "<BV>Yep! %s unfreezed you!</BV>", frozen_life = "If you are unfreezed, you will only have more <R>%d life</R>!", unfreezedsomeone = "<BV>You unfreezed %s!</BV>", are_freezer = "You are a <R>freezer</R>! Press <R>SPACE</R> on players to freeze them.", now_popsicle = "<VP>%s became popscicle!</VP>", gotLife = "<VP>You were lucky to gain <R>+1 health</R> by unfreeze %s!</VP>", are_unfreezer = "Escape from the mice with the color of the name <BV>blue</BV>! Press <BV>SPACE</BV> on the players to unfreeze them. You can only be unfreezed %d times!<br>Unfreeze mice to get more health!"}, br = {done = "Feito", welcome = "<VP>Seja bem-vindo(a) ao #freezertag!</VP>", welcome_back = "<VP>Seja bem-vindo(a) de volta ao #freezertag!</VP>", no_permission = "<R>Você não tem permissão para fazer isso.</R>", banned = "<R>Você foi proibido(a) de jogar nessa sala.</R>", unbanned = "<VP>Você já pode voltar a jogar normalmente.</VP>", player_banned = "Jogador(a) punido(a).", player_unbanned = "Jogador(a) perdoado(a).", freezerswon = "<D>Os congeladores vivos venceram!</D>", unfreezerswon = "<D>Os jogadores vivos venceram!</D>", noonewon = "<D>Ninguém venceu!</D>", frozen = "<BV>Uuuii, que frio... Parece que você foi congelado!</BV>", unfreezed = "<BV>Oba! %s descongelou você!</BV>", frozen_life = "Caso seja descongelado, você só terá mais <R>%d vida(s)</R>!", unfreezedsomeone = "<BV>Você descongelou %s!</BV>", are_freezer = "Você é um <R>congelador</R>! Pressione <R>ESPAÇO</R> nos jogadores para congela-los.", now_popsicle = "<VP>%s virou picolé!</VP>", gotLife = "<VP>Você teve a sorte de ganhar <R>+1 vida</R> por ter descongelado %s!</VP>", are_unfreezer = "Fuja do(s) ratinho(s) com a cor do nome <BV>azul</BV>! Pressione <BV>ESPAÇO</BV> nos jogadores para descongela-los. Você só pode ser descongelado <B>%d vezes</B>!<br>Descongele ratinhos para conseguir mais vidas!"}}
function translate(text)
    local commu = translate_messages[community] and community or "en"
    return translate_messages[commu][text] or "Text Not Found"
end
Players = {}
Players.name = "Players"
Players.__index = Players
Players.prototype = {}
Players.prototype.__index = Players.prototype
Players.prototype.constructor = Players
function Players.new(...)
    local self = setmetatable({}, Players.prototype)
    self:____constructor(...)
    return self
end
function Players.prototype.____constructor(self)
    self.list = {}
end
function Players.prototype.set(self, player)
    self.list[player.playerName] = player
    return player
end
function Players.prototype.get(self, playerName)
    return self.list[playerName] or false
end
function Players.prototype.call(self, func, playerName, ...)
    local args = ({...})
    local player = players:get(playerName)
    if player and type(player[func]) == "function" then
        (function()
            local ____self = player
            return ____self[func](
                ____self,
                unpack(args)
            )
        end)()
    end
end
players = Players.new()
PlayerEntity = {}
PlayerEntity.name = "PlayerEntity"
PlayerEntity.__index = PlayerEntity
PlayerEntity.prototype = {}
PlayerEntity.prototype.____getters = {}
PlayerEntity.prototype.__index = __TS__Index(PlayerEntity.prototype)
PlayerEntity.prototype.constructor = PlayerEntity
function PlayerEntity.new(...)
    local self = setmetatable({}, PlayerEntity.prototype)
    self:____constructor(...)
    return self
end
function PlayerEntity.prototype.____constructor(self, playerName)
    self.playerName = playerName
end
function PlayerEntity.prototype.____getters.data(self)
    return tfm.get.room.playerList[self.playerName]
end
function PlayerEntity.prototype.kill(self)
    tfm.exec.killPlayer(self.playerName)
end
function PlayerEntity.prototype.respawn(self)
    tfm.exec.respawnPlayer(self.playerName)
end
function PlayerEntity.prototype.move(self, x, y)
    tfm.exec.movePlayer(self.playerName, x, y)
end
function PlayerEntity.prototype.cheese(self, set)
    if set == nil then
        set = true
    end
    if set then
        tfm.exec.giveCheese(self.playerName)
    else
        tfm.exec.removeCheese(self.playerName)
    end
end
function PlayerEntity.prototype.bindKeyboard(self, key, press, enable)
    system.bindKeyboard(self.playerName, key, press, enable)
end
function PlayerEntity.prototype.bindMouse(self, enabled)
    system.bindMouse(self.playerName, enabled)
end
function PlayerEntity.prototype.lowerSyncDelay(self)
    tfm.exec.lowerSyncDelay(self.playerName)
end
function PlayerEntity.prototype.chatMessage(self, message)
    tfm.exec.chatMessage(message, self.playerName)
end
Player = {}
Player.name = "Player"
Player.__index = Player
Player.prototype = {}
Player.prototype.____getters = {}
Player.prototype.__index = __TS__Index(Player.prototype)
Player.prototype.constructor = Player
Player.____super = PlayerEntity
setmetatable(Player, Player.____super)
setmetatable(Player.prototype, Player.____super.prototype)
function Player.new(...)
    local self = setmetatable({}, Player.prototype)
    self:____constructor(...)
    return self
end
function Player.prototype.____constructor(self, playerName)
    PlayerEntity.prototype.____constructor(self, playerName)
    self.priv = 0
    self.canDoCache = {}
    self.life_images = {}
    self.banned = false
    self.chance = 1
    self.lifes = 0
    self.canPlay = false
    self.isFreezer = false
    self.imortal = false
    self.iceObject = {}
    players:set(self)
    self.id = self.data.id
    self:bindKeyboard(32, true, true)
    self:lowerSyncDelay()
    if staff[playerName] then
        self.priv = staff[playerName]
    end
    self:chatMessage(
        translate("welcome")
    )
end
function Player.prototype.____getters.isFrozen(self)
    return (game.frozen[self.playerName] and function() return true end or function() return false end)()
end
function Player.prototype.rejoin(self, playerName)
    self:bindKeyboard(32, true, true)
    self:lowerSyncDelay()
    self:chatMessage(
        translate("welcome_back")
    )
end
function Player.prototype.onCommand(self, command)
    local cmd = __TS__StringSplit(command, " ")
    if self:hasPriv(2) then
        if cmd[1] == "ban" and cmd[2] then
            local player = players:get(cmd[2])
            if player then
                if player.priv < 2 or (player.priv >= 2 and self:hasPriv(player.priv)) then
                    if player:ban() then
                        self:chatMessage(
                            translate("player_banned")
                        )
                    end
                end
            end
        elseif cmd[1] == "unban" and cmd[2] then
            local player = players:get(cmd[2])
            if player then
                if player.priv < 2 or (player.priv >= 2 and self:hasPriv(player.priv)) then
                    if player:unban() then
                        self:chatMessage(
                            translate("player_unbanned")
                        )
                    end
                end
            end
        elseif cmd[1] == "next" then
            game:next()
        elseif cmd[1] == "npp" and type(
            tonumber(cmd[2])
        ) == "number" then
            if game:nextMap(
                tonumber(cmd[2])
            ) then
                self:chatMessage(
                    "<VP>" .. tostring(
                        translate("done")
                    ) .. "</VP>"
                )
            end
        end
        if self:hasPriv(4, false) then
            if cmd[1] == "imortal" then
                if self then
                    self.imortal = not self.imortal
                    self:chatMessage(
                        tostring(self.imortal)
                    )
                end
            end
        end
    end
end
function Player.prototype.onDied(self)
    if game.started then
        if not self.isFrozen then
            if self.isFreezer then
                game:removeFreezer(self)
            else
                game:removeParticipant(self.playerName)
            end
        else
            if not self.isFreezer then
                game.participants_alive = game.participants_alive - 1
            else
                game.freezers_alive = game.freezers_alive + 1
            end
        end
        if not game.ended or (game.freezers_alive == 0 and game.participants_alive == 0) then
            game:check()
        end
    end
    self:showLifes()
end
function Player.prototype.onWin(self)
    self:onDied()
end
function Player.prototype.onRespawn(self)
    if game.started then
        if not self.isFreezer and self.iceObject.x and self.iceObject.y then
            self:move(self.iceObject.x, self.iceObject.y)
            self.iceObject = {}
            game.participants_alive = game.participants_alive + 1
        end
    end
    self:showLifes()
end
function Player.prototype.onLeft(self)
    ui.removeTextArea(self.id)
end
function Player.prototype.onKeyboard(self, key, pressed, x, y)
    if key == 32 and not self.data.isDead and self:canDo("key_space_min_delay", 500, false) then
        local radius = self.isFreezer and 50 or 70
        local players_target = (self.isFreezer and function() return tfm.get.room.playerList end or function() return game.frozen end)()
        for target_playerName in pairs(players_target) do
            local target = self.isFreezer and players:get(target_playerName) or players_target[target_playerName]
            if not target.isFreezer and target.data then
                local object = (self.isFreezer and function() return target.data end or function() return tfm.get.room.objectList[target.iceObject.id] end)()
                if object and math.abs(object.x - self.data.x) <= radius and math.abs(object.y - self.data.y) <= radius then
                    if self.isFreezer then
                        if not target.isFrozen and self:canDo("key_space", 3000, false) then
                            if game:freezePlayer(target) then
                                target:chatMessage(
                                    translate("frozen")
                                )
                                if target.lifes > 0 then
                                    target:chatMessage(
                                        string.format(
                                            translate("frozen_life"),
                                            target.lifes
                                        )
                                    )
                                end
                            end
                        end
                    elseif target.isFrozen and target.data.isDead and self:canDo("key_space", 5000, false) then
                        if game:unfreezePlayer(target) then
                            target:chatMessage(
                                string.format(
                                    translate("unfreezed"),
                                    self.playerName
                                )
                            )
                            local lucky = math.random(100)
                            if lucky <= 15 then
                                self.lifes = self.lifes + 1
                                self:showLifes()
                            end
                            self:chatMessage(
                                string.format(
                                    translate((lucky <= 15) and "gotLife" or "unfreezedsomeone"),
                                    target.playerName
                                )
                            )
                        end
                    end
                    break
                end
            end
        end
    end
end
function Player.prototype.showLifes(self)
    tfm.exec.setPlayerScore(self.playerName, self.lifes, false)
    do
        local i = 0
        while i < #self.life_images do
            tfm.exec.removeImage(self.life_images[i + 1])
            i = i + 1
        end
    end
    self.life_images = {}
    do
        local i = 0
        while i < self.lifes do
            self.life_images[#self.life_images + 1] = tfm.exec.addImage("1674802a592.png", ":1", 5 + (28 * i), 23, self.playerName)
            i = i + 1
        end
    end
end
function Player.prototype.hasPriv(self, priv, message)
    if message == nil then
        message = true
    end
    if self.priv >= priv then
        return true
    end
    if message then
        self:chatMessage(
            translate("no_permission")
        )
    end
    return false
end
function Player.prototype.ban(self)
    if not self.banned then
        self.banned = true
        self:kill()
        self:chatMessage(
            translate("banned")
        )
        return true
    end
    return false
end
function Player.prototype.unban(self)
    if self.banned then
        self.banned = false
        self:chatMessage(
            translate("unbanned")
        )
        return true
    end
    return false
end
function Player.prototype.canDo(self, ____type, time, start)
    local firstLoad = false
    if not self.canDoCache[____type] then
        self.canDoCache[____type] = os.time() + time
        if not start then
            firstLoad = true
        end
    end
    if firstLoad or self.canDoCache[____type] <= os.time() then
        self.canDoCache[____type] = os.time() + time
        return true
    else
        return false
    end
end
function Player.prototype.reset(self)
    self.canPlay = false
    self.isFreezer = false
    self.imortal = false
    self.iceObject = {}
    self.canDoCache = {}
    self.lifes = 0
    self:showLifes()
end
local maps = {6166453, 7647541, 7647591, 7647776, 7659238, 7659320, 7659325, 7659444, 7659329, 7659330, 7659334, 7659340, 7659429, 7659433, 7664195, 7671633, 7686423, 7743425, 7664262, 7104048, 7659341, 7647524, 7647519, 7647472, 7647551, 4743573, 7659441, 7659336, 7647598, 7647557, 7647498, 4360147}
Game = {}
Game.name = "Game"
Game.__index = Game
Game.prototype = {}
Game.prototype.__index = Game.prototype
Game.prototype.constructor = Game
function Game.new(...)
    local self = setmetatable({}, Game.prototype)
    self:____constructor(...)
    return self
end
function Game.prototype.____constructor(self)
    self.maps = maps
    self.maps_cache = {}
    self.freezers_alive = 0
    self.participants_alive = 0
    self.frozen = {}
    self.participants = {}
    self.started = false
    self.ended = false
    self.changing_map = false
    self.next_map = -1
end
function Game.prototype.next(self)
    if self.next_map ~= -1 then
        tfm.exec.newGame(self.next_map)
        self.next_map = -1
    elseif not self.changing_map then
        self.changing_map = true
        if #self.maps_cache == 0 then
            do
                local i = 0
                while i < #self.maps do
                    self.maps_cache[#self.maps_cache + 1] = self.maps[i + 1]
                    i = i + 1
                end
            end
        end
        tfm.exec.newGame(
            table.remove(
                self.maps_cache,
                math.random(#self.maps_cache)
            )
        )
    end
end
function Game.prototype.nextMap(self, map)
    if self.next_map == -1 then
        self.next_map = map
        return true
    end
    return false
end
function Game.prototype.reset(self)
    self.freezers_alive = 0
    self.participants_alive = 0
    self.frozen = {}
    self.participants = {}
    self.started = false
    self.ended = false
    self.changing_map = false
end
function Game.prototype.addFrezer(self, player)
    if not player.isFreezer then
        self.freezers_alive = self.freezers_alive + 1
        player.isFreezer = true
        player.chance = 1
        player:chatMessage(
            translate("are_freezer")
        )
        tfm.exec.setNameColor(player.playerName, 40447)
    end
end
function Game.prototype.removeFreezer(self, player)
    if player.isFreezer then
        player.isFreezer = false
        self.freezers_alive = self.freezers_alive - 1
    end
end
function Game.prototype.addParticipant(self, player)
    if not self.participants[player.playerName] then
        self.participants[player.playerName] = player
        self.participants_alive = self.participants_alive + 1
        player.isFreezer = false
        player:chatMessage(
            string.format(
                translate("are_unfreezer"),
                player.lifes
            )
        )
    end
end
function Game.prototype.removeParticipant(self, playerName)
    if self.participants[playerName] then
        self.participants[playerName] = nil
        self.participants_alive = self.participants_alive - 1
    end
end
function Game.prototype.freezePlayer(self, player)
    if not player.isFrozen and not player.isFreezer and player.data and not player.data.isDead and not self.ended and not player.imortal then
        player.lifes = player.lifes - 1
        if player.lifes > 0 then
            self.frozen[player.playerName] = player
        else
            tfm.exec.chatMessage(
                string.format(
                    translate("now_popsicle"),
                    player.playerName
                )
            )
        end
        player:kill()
        player.iceObject = tfm.get.room.objectList[tfm.exec.addShamanObject(54, player.data.x, player.data.y, 0, 0, 0, false)]
        return true
    end
    return false
end
function Game.prototype.unfreezePlayer(self, player)
    if player.isFrozen and player.data then
        self.frozen[player.playerName] = nil
        ui.removeTextArea(player.data.id)
        if player.iceObject.id then
            tfm.exec.removeObject(player.iceObject.id)
        end
        player:respawn()
        return true
    end
    return false
end
function Game.prototype.check(self)
    if self.freezers_alive == 0 and self.participants_alive == 0 then
        if not self.ended then
            tfm.exec.chatMessage(
                translate("noonewon")
            )
        end
        self["end"](self)
    elseif self.freezers_alive == 0 then
        tfm.exec.chatMessage(
            translate("unfreezerswon")
        )
        self["end"](self, "participants")
    elseif self.participants_alive == 0 then
        tfm.exec.chatMessage(
            translate("freezerswon")
        )
        self["end"](self, "freezers")
    end
end
Game.prototype["end"] = function(self, whoWon)
    if not self.ended then
        if whoWon then
            for playerName in pairs(tfm.get.room.playerList) do
                local player = players:get(playerName)
                if player.data and not player.data.isDead then
                    if whoWon == "freezers" then
                        if player.isFreezer then
                            player:cheese()
                        end
                    elseif not player.isFreezer then
                        player:cheese()
                    end
                end
            end
            local ids = {}
            for i in pairs(tfm.get.room.objectList) do
                ids[#ids + 1] = tfm.get.room.objectList[i].id
            end
            do
                local i = 0
                while i < #ids do
                    tfm.exec.removeObject(ids[i + 1])
                    i = i + 1
                end
            end
            for playerName in pairs(self.frozen) do
                if self.frozen[playerName].data then
                    ui.removeTextArea(self.frozen[playerName].data.id)
                end
            end
            self.frozen = {}
            tfm.exec.setGameTime(30)
        else
            tfm.exec.setGameTime(10)
        end
        self.ended = true
    else
        self:next()
    end
end
game = Game.new()
local events = {eventPlayerRespawn = "onRespawn", eventPlayerDied = "onDied", eventChatMessage = "onMessage", eventChatCommand = "onCommand", eventKeyboard = "onKeyboard", eventMouse = "onClick", eventPlayerWon = "onWin", eventPlayerLeft = "onLeft"}
for i in pairs(events) do
    _G[i] = function(playerName, ...)
        local args = ({...})
        players:call(
            events[i],
            playerName,
            unpack(args)
        )
    end
end
function eventLoop(current, remaining)
    if not game.ended then
        if not game.started then
            if current >= 10000 then
                local participants = {}
                local total_chance = 0
                for playerName in pairs(tfm.get.room.playerList) do
                    local player = players:get(playerName)
                    if player.data then
                        if not player.data.isDead and player.canPlay then
                            total_chance = total_chance + player.chance
                            participants[#participants + 1] = player
                            player.lifes = 3
                        else
                            tfm.exec.killPlayer(playerName)
                            player.lifes = 0
                        end
                    end
                    player:showLifes()
                end
                if #participants > 0 then
                    local p = math.floor(#participants / 10) + 1
                    do
                        local _ = 0
                        while _ < p do
                            local rand = math.random() * total_chance
                            local found = false
                            while not found do
                                do
                                    local i = 0
                                    while i < #participants do
                                        local player = participants[i + 1]
                                        if rand < player.chance then
                                            total_chance = total_chance - player.chance
                                            player.chance = 1
                                            player.lifes = 0
                                            player:showLifes()
                                            table.remove(participants, i)
                                            game:addFrezer(player)
                                            found = true
                                            break
                                        else
                                            rand = rand - player.chance
                                        end
                                        i = i + 1
                                    end
                                end
                            end
                            _ = _ + 1
                        end
                    end
                    for playerName in pairs(tfm.get.room.playerList) do
                        local player = players:get(playerName)
                        if player.data and not player.data.isDead and not player.isFreezer then
                            game:addParticipant(player)
                            total_chance = total_chance + 1
                            player.chance = player.chance + 1
                        end
                    end
                end
                game.started = true
                game:check()
            elseif current >= 1000 then
                for playerName in pairs(tfm.get.room.playerList) do
                    local player = players:get(playerName)
                    if player.data and not player.canPlay and not player.data.isDead then
                        if player.data.movingLeft or player.data.movingRight or player.data.isJumping then
                            player.canPlay = true
                        end
                    end
                end
            end
        else
            if remaining <= 30000 then
                game["end"](game, "participants")
            end
            for playerName in pairs(game.frozen) do
                local player = game.frozen[playerName]
                if player.iceObject.id and player.iceObject.x and player.iceObject.y then
                    local object = tfm.get.room.objectList[player.iceObject.id]
                    if player.data then
                        ui.addTextArea(
                            player.data.id,
                            "<B><font color=\"#000000\">" .. tostring(playerName) .. "</font></B>\n<p align=\"center\"><B><R>" .. tostring(player.lifes) .. " HP</R></B></p>",
                            nil,
                            object.x - (#playerName * 4),
                            object.y - 10,
                            0,
                            0,
                            1,
                            1,
                            0,
                            false
                        )
                    end
                end
            end
        end
    else
        for playerName in pairs(tfm.get.room.playerList) do
            if staff[playerName] then
                local player = players:get(playerName)
                if player.data and not player.data.isDead then
                    if staff[playerName] == 4 then
                        tfm.exec.setNameColor(
                            playerName,
                            math.random(0, 16777215)
                        )
                    elseif staff[playerName] == 3 then
                        tfm.exec.setNameColor(playerName, 3276527)
                    elseif staff[playerName] == 2 then
                        tfm.exec.setNameColor(playerName, 16760024)
                    end
                end
            end
        end
    end
    if remaining <= 0 then
        game["end"](game, "participants")
    end
end
function eventNewPlayer(playerName)
    local player = players:get(playerName)
    if not player then
        player = players:set(
            Player.new(playerName)
        )
    else
        players:call("rejoin", playerName)
    end
end
function eventNewGame()
    tfm.exec.setGameTime(170)
    game:reset()
    for playerName in pairs(tfm.get.room.playerList) do
        local player = players:get(playerName)
        player:reset()
        if player.banned then
            player:kill()
        else
            tfm.exec.setNameColor(playerName, 11908533)
        end
    end
end
for playerName in pairs(tfm.get.room.playerList) do
    eventNewPlayer(playerName)
end
tfm.exec.setRoomMaxPlayers(25)
system.disableChatCommandDisplay()
tfm.exec.disableAutoShaman()
tfm.exec.disableAutoNewGame()
tfm.exec.disableAutoTimeLeft()
tfm.exec.disableAutoScore()
tfm.exec.disablePhysicalConsumables()
tfm.exec.disableDebugCommand()
tfm.exec.disableMinimalistMode()
game:next()
