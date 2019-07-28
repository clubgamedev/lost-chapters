export const croquis_astro = save => ([
    `C'est une pile de croquis astronomiques incompréhensibles.`,
    `Il semble que les étudiants se soient beaucoup intéressés à la Lune.`
])

export const telescope = save => ([
    `Ce téléscope est dirigé vers la Lune.`,
    `La lune est rouge ce soir à cause de l'Eclipse.`
])

export const book_alphabet = save => {
    if (!save.hasDiscoveredAlphabet) {
        save.hasDiscoveredAlphabet = true;
        return [
            `Ce livre contient la transcription des runes aux tableau.`,
            `Je vais noter ça pour essayer de les déchiffrer...`
        ]
    }

    return [
        `J'ai noté la transcription des runes dans mon calepin.`,
        `Je devrais pouvoir déchiffrer les runes maintenant.`
    ]
}

export const runes_inconnues = save => ([
    `De drôles de runes sont tracées ici.`,
    `Elles changent selon l'angle sous lequel on les regarde.`,
    `Je n'y comprends rien...`
])

export const traduction_tableau = save => ([
    `Que tout le monde se rassemble au terrier`
])

export const panneau_sanctuaire = save => ([
    `Le chemin ne sera ouvert qu'à ceux qui ont bravé leurs peurs`
])

export const panneau_entree_universite = save => ([
    `🠈 Université Miskatonic`
])

export const lockedExits = {
    sanctuaire: {
        backDirection: "UP",
        backDuration: 500,
        message: [
            `Je ne peux pas partir maintenant, il faut que je parle à Franck.`
        ]
    }
}