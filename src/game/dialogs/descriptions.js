import { sounds } from "../audio";
import { talkToMyself } from "../utils/dialog";
import { dialogs } from "../dialogs/";

export function readDescription(name) {
    let description = dialogs[name]

    if (typeof description === "function") description = { action: description }

    description.before = description.before || (() => Promise.resolve())
    description.after = description.after || (() => Promise.resolve())

    description.before()
        .then(() => talkToMyself(description.action(game.save)))
        .then(() => description.after())
}

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
    `Université Miskatonic`
])

export const charnier = save => ([
    `Un charnier, ici ? L'odeur est atroce...`
])

export const charnier2 = save => ([
    `Parmi les cadavres d'animaux, je crois voir des ossements humains !`,
    `Mon esprit doit me jouer des tours...`
])

export const precipice = save => ([
    `L'éboulement est récent. Je ne passerais pas par là...`
])

export const trou_grotte = {
    action() {
        if (game.save.planquesFound.includes("trou_grotte")) {
            return [
                `Ces planques doivent servir à cacher la drogue des cultistes...`
            ]
        } else {
            return [
                `Il y a un seau suspendu dans ce trou... Je peux le remonter.`,
                `Il contient quelques potions au contenu verdâtre.`
            ]
        }
    },
    after() {
        if (game.save.planquesFound.includes("trou_grotte")) return;
        game.save.inventory.potionDeLucidite += 2;
        sounds.ITEM.play();
        game.save.planquesFound.push("trou_grotte");
    }
}

export const mare_grotte = {
    action() {
        if (game.save.planquesFound.includes("mare_grotte")) {
            return [
                `Les cultistes utilisent ces stimulants pour mieux percevoir les signes runiques.`
            ]
        } else {
            return [
                `Une potion bleutée est à moitié ensevelie au fond de l'eau.`,
                `Elle porte une étiquette délavée: "Psycho-stimulant"`
            ]
        }
    },
    after() {
        if (game.save.planquesFound.includes("mare_grotte")) return;
        game.save.inventory.potionDeForce += 1;
        sounds.ITEM.play();
        game.save.planquesFound.push("mare_grotte");
    }
}

export const tombe_grotte = {
    action() {
        if (game.save.planquesFound.includes("tombe_grotte")) {
            return [
                `D'après ce que m'a dit soeur Marie, cette potion des dévots`,
                `sert à sceller les signes runiques pour éloigner le mal.`,
                `On dirait que ça n'a pas marché pour cette pauvre femme.`
            ]
        } else {
            return [
                `Quelle horreur ! C'est une tombe fraîchement creusée !`,
                `Une victime gît au fond. Elle porte les vêtements des dévots à l'orée`,
                `de la forêt, ainsi qu'une fiole rosée autour du cou.`,
                `Je vais la récupérer. Elle n'en aura plus besoin...`
            ]
        }
    },
    after() {
        if (game.save.planquesFound.includes("tombe_grotte")) return;
        game.save.inventory.potionDeProtection += 1;
        sounds.ITEM.play();
        game.save.planquesFound.push("tombe_grotte");
    }
}

export const lockedExits = {
    sanctuaire: {
        backDirection: "UP",
        backDuration: 500,
        message: [
            `Je ne peux pas partir maintenant, il faut que je parle à Franck.`
        ]
    }
}