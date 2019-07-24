export function arthur(save) {
    if (save.haspere_Arthur) {
        return [
            "MEEERRCCIIIIIIII de m'avoir ramené mes ....",
            "précieuses breloques.",
            "A part si tu es la pour les récupérer,",
            "HAHAHA bonne chance",
            {
                "TU VAS PAYER": () => "fct combat",
                "Non non je suis la pour ...": () => "Dans ce cas BIENVENUE HAHAHA"
            }
        ]
    }
    save.haspere_Arthur = true;

    if (game.player.lucidity < 5) {
        return [
            "AHHHHHH je te sens prêt à libérer ta condition maudite",
            "Dans ce monde je me suis libéré de ma condition de simple pion",
            "Viens et ne laisse plus ce monstre te diriger",
            {
                "Rejoindre": () => "OUI s'il vous plaît que ce joueur arrête de me contrôler !",
                "Rejoindre": () => "De tout mon être que la folie me sauve de ce joueur",
                "Rejoindre": () => ".... ...."
            }
        ]
    }
    return [
        "Bonjour brebis égarée, que me veux-tu?",
        {
            "Où en suis-je dans cette enquête ?": () => "Et tu penses que je m'interesse à cela ?",
            "Prier": () => "Bien sur, mais à MON prix",
            "Partir": () => "Que la folie te guette"
        }
    ]


}