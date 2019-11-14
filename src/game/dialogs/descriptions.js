import { sounds } from "../audio";
import { talkToMyself } from "../utils/dialog";

export function readDescription(name) {
    let description = descriptions[name]
    if (!description) return console.error(`Description not found: ${name}`)

    if (typeof description === "function") description = { action: description }

    description.before = description.before || (() => Promise.resolve())
    description.after = description.after || (() => Promise.resolve())

    description.before()
        .then(() => talkToMyself(description.action(game.save)))
        .then(() => description.after())
}

export const descriptions = {
    croquis_astro: save => ([
        `C'est une pile de croquis astronomiques incompréhensibles.`,
        `Il semble que les étudiants se soient beaucoup intéressés à la Lune.`
    ]),

    telescope: save => ([
        `Ce téléscope est dirigé vers la Lune.`,
        `La lune est rouge ce soir à cause de l'Eclipse.`
    ]),

    book_alphabet: save => {
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
    },

    runes_inconnues: save => ([
        `De drôles de runes sont tracées ici.`,
        `Elles changent selon l'angle sous lequel on les regarde.`,
        `Je n'y comprends rien...`
    ]),

    traduction_tableau: save => ([
        `Que tout le monde se rassemble au terrier`
    ]),

    panneau_sanctuaire: save => ([
        `Le chemin ne sera ouvert qu'à ceux qui ont bravé leurs peurs`
    ]),

    panneau_entree_universite: save => ([
        `Université Miskatonic`
    ]),

    charnier: save => ([
        `Un charnier, ici ? L'odeur est atroce...`
    ]),

    charnier2: save => ([
        `Parmi les cadavres d'animaux, je crois voir des ossements humains !`,
        `Mon esprit doit me jouer des tours...`
    ]),

    precipice: save => ([
        `L'éboulement est récent. Je ne passerais pas par là...`
    ]),

    trou_grotte: {
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
            game.inventory.items.potionDeLucidite += 2;
            sounds.ITEM.play();
            game.save.planquesFound.push("trou_grotte");
        }
    },

    mare_grotte: {
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
            game.inventory.items.potionDeForce += 1;
            sounds.ITEM.play();
            game.save.planquesFound.push("mare_grotte");
        }
    },

    tombe_grotte: {
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
            game.inventory.items.potionDeProtection += 1;
            sounds.ITEM.play();
            game.save.planquesFound.push("tombe_grotte");
        }
    },

    cape_cachee: {
        action() {
            if (game.save.planquesFound.includes("cape_cachee")) {
                return [
                    `Il y a le nom de l'université brodé sur cette cape.`,
                    `Pas de doutes, elle appartient à un étudiant.`
                ]
            } else {
                return [
                    `Quelqu'un a caché une vieille cape noire ici.`,
                    `Je pourrais peut-être m'en servir...`
                ]
            }
        },
        after() {
            if (game.save.planquesFound.includes("cape_cachee")) return;
            if (game.inventory.items.cape.nombre === 0) {
                game.inventory.items.cape.nombre++;
                sounds.ITEM.play();
                game.save.planquesFound.push("cape_cachee");
            }
        }
    }
}

export const lockedExits = {
    sortie_universite() {
        if (game.save.hasMetFranck) {
            game.save.unlockedExits.push("sortie_universite")
            return talkToMyself([
                `Je devrais aller enquêter dans la forêt pour voir`,
                `ce que trame ce Therled et ses compères.`
            ])
        } else {
            return talkToMyself([
                `Je ne peux pas partir maintenant, il faut que je parle à Franck.`
            ]).then(() => {
                game.player.forceMove("UP", 500)
            })
        }
    },
    entree_cave() {
        if (game.inventory.items.cape.nombre > 0) {
            game.save.unlockedExits.push("entree_cave")
            return talkToMyself([
                `Je vais enfiler cette cape noire pour tenter de m'infiltrer.`,
                `Ça devrait marcher tant qu'on ne me regarde pas de trop près.`
            ])
        } else {
            return talkToMyself([
                `J'entends du bruit à l'intérieur. Ça doit être le repaire des cultistes.`,
                `Je dois trouver un moyen de m'infiltrer discrètement là-dedans`
            ]).then(() => {
                game.player.forceMove("DOWN", 500)
            })
        }
    }
}