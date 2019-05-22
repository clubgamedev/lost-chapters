export function Marchand(save) {
    return [
        "Bonjour pouvez vous m’aider a concevoir des potions",
        "-	Quels potions voulez vous cree ",
        "	 4 compos",
        "	Voila ",
        "Voulez vous m’aider a nouveau",
        
        {
            "Oui": () => "Menteur !",
            "Non": () => "Ben va te faire voir !",
            "Je m'en fous": () => ["Comment ça tu t'en fous ?", "Mais il faut bien tester les dialogues !"]
        },
        "Ayé j'ai fini de parler"
    ]
}