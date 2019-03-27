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
                "Oui": () => "Menteur !",
                "Non": () => "Ben va te faire voir !",
                "Je m'en fous": () => ["Comment ça tu t'en fous ?", "Mais il faut bien tester les dialogues !"]
            },
            "Ayé j'ai fini de parler"
        ]
    }

}

export const books = {
    book_franck: [
        `Recette de la potion spéciale du professeur Franck:
- Bourbon
- Triple sec
- Cognac
- Valium`,
        `Trois flasques par jour et le métier de professeur vous paraîtra presque agréable.
     Franck`
    ],
    book_library: [
        `Il était une fois un game developper qui devait tester le screen du bouquin`,
        `Il lui fallait plusieurs pages pour tester quoi.`,
        `Tant qu'à faire il testait aussi les accents et caractères bizarres`,
        `genre @#{] [*% ù^^ £µ! §]}`,
        `tiens on va mettre une 3ème page pour voir`
    ]
}

export const pages = {
    secret: `Ceci est un parchemin secret, sans roulés sur les bords`
}