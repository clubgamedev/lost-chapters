export const dialogs = {

    franck(save) {
        if (save.hasMetFranck) {
            return [
                "Reste pas planté là !"
            ]
        }
        save.hasMetFranck = true;
        return [
            "Salut, moi c'est Franck",
            "Va voir là bas si j'y suis"
        ]
    },

    augustin(save) {
        return [
            "Je suis le méchant et je m'appelle Augustin. Je suis très méchant.",
            "Tout a commencé quand on m'a volé mon sandwich à la confiture au CM2.",
            "Déjà à l'époque on me trouvait bavard et peu charismatique...",
            "Eh tu m'écoutes ?",
            {
                choice: {
                    "Oui": () => ["Menteur !"],
                    "Non": () => ["Ben va te faire voir !"],
                    "Je m'en fous": () => ["Comment ça tu t'en fous ? Mais il faut bien tester les dialogues !"],
                }
            },
            "Ayé j'ai fini de parler"
        ]
    }

}