const community: string = tfm.get.room.community;

const translate_messages: any = {
    en: {
        done: "Done",
        welcome: "<VP>Welcome to #freezertag!</VP>",
        welcome_back: "<VP>Welcome back to #freezertag!</VP>",
        no_permission: "<R>You haven't permission to do it.</R>",
        banned: "<R>You've been banned from the room.</R>",
        unbanned: "<VP>You can now return to play normally.</VP>",
        player_banned: "Player punished.",
        player_unbanned: "Player absolved.",
        freezerswon: "<D>Alive freezers won!</D>",
        unfreezerswon: "<D>Alive players won!</D>",
        noonewon: "<D>No one won!</D>",
        frozen: "<BV>Wooww, so cold... You are frozen!</BV>",
        unfreezed: "<BV>Yep! %s unfreezed you!</BV>",
        frozen_life: "If you are unfreezed, you will only have more <R>%d life</R>!",
        unfreezedsomeone: "<BV>You unfreezed %s!</BV>",
        are_freezer: "You are a <R>freezer</R>! Press <R>SPACE</R> on players to freeze them.",
        now_popsicle: "<VP>%s became popscicle!</VP>",
        gotLife: "<VP>You were lucky to gain <R>+1 health</R> by unfreeze %s!</VP>",
        are_unfreezer: "Escape from the mice with the color of the name <BV>blue</BV>! Press <BV>SPACE</BV> on the players to unfreeze them. You can only be unfreezed %d times!<br>Unfreeze mice to get more health!"
    },
    br: {
        done: "Feito",
        welcome: "<VP>Seja bem-vindo(a) ao #freezertag!</VP>",
        welcome_back: "<VP>Seja bem-vindo(a) de volta ao #freezertag!</VP>",
        no_permission: "<R>Você não tem permissão para fazer isso.</R>",
        banned: "<R>Você foi proibido(a) de jogar nessa sala.</R>",
        unbanned: "<VP>Você já pode voltar a jogar normalmente.</VP>",
        player_banned: "Jogador(a) punido(a).",
        player_unbanned: "Jogador(a) perdoado(a).",
        freezerswon: "<D>Os congeladores vivos venceram!</D>",
        unfreezerswon: "<D>Os jogadores vivos venceram!</D>",
        noonewon: "<D>Ninguém venceu!</D>",
        frozen: "<BV>Uuuii, que frio... Parece que você foi congelado!</BV>",
        unfreezed: "<BV>Oba! %s descongelou você!</BV>",
        frozen_life: "Caso seja descongelado, você só terá mais <R>%d vida(s)</R>!",
        unfreezedsomeone: "<BV>Você descongelou %s!</BV>",
        are_freezer: "Você é um <R>congelador</R>! Pressione <R>ESPAÇO</R> nos jogadores para congela-los.",
        now_popsicle: "<VP>%s virou picolé!</VP>",
        gotLife: "<VP>Você teve a sorte de ganhar <R>+1 vida</R> por ter descongelado %s!</VP>",
        are_unfreezer: "Fuja do(s) ratinho(s) com a cor do nome <BV>azul</BV>! Pressione <BV>ESPAÇO</BV> nos jogadores para descongela-los. Você só pode ser descongelado <B>%d vezes</B>!<br>Descongele ratinhos para conseguir mais vidas!"
    }
}

function translate(text: string) {
    let commu = translate_messages[community] ? community : "en";

    return translate_messages[commu][text] || "Text Not Found";
}