export function SoeurMarie(save){

    if (save.hasOneBreloque) {
        return [
            "Oh ? Qu'as tu trouvé mon enfant !",
            {
            "Où en suis-je dans cette enquête ?": () => "fct(rapellemoi)",
            "Prier": () => "fct sauvegarde",
            "Donner la breloque": () => "fct enleve1breloque et + gain santemental",
            "Partir": () => "Que la paix soit avec toi"
            }
        ]
    }
    return [
    "Bonjour mon enfant, que veux-tu ?",
    {
        "Où en suis-je dans cette enquête ?": () => "fct(rapellemoi)",
        "Prier": () => "fct sauvegarde",
        "Partir": () => "Que la paix soit avec toi"
    }

]
}