import { talkToMyself } from "../utils/dialog"

export const traductions = {
    traduction_tableau: {
        lines: [`Que tout le monde se rassemble au terrier`],
        after(save) {
            save.hasDiscoveredTerrier = true
        }
    },

    traduction_souche: {
        lines: [
            `Ne passez plus par le pont de la rivière.`,
            `Le vieux Ramsey devient un peu trop curieux...`
        ]
    },

    traduction_camp_ramsey: {
        lines: [
            `Nous nous sommes occupés de Ramsey.`,
            `Rassemblez-vous au terrier pour le rituel.`
        ],
        after(save) {
            save.canUseChaudron = true;
            return talkToMyself([
                `Qui a pu kidnapper Ramsey ? Les dévots ? Les étudiants ?`,
                save.hasMetRamsey
                    ? `Ramsey avait parlé de capes noires qui rodaient autour du camp...`
                    : `Je le saurais une fois que je serais rentré dans ce "terrier".`,
                `Heureusement, ils n'ont pas touché au reste du camp.`,
                `Je vais devoir me débrouiller seul pour préparer l'antidote au Liao.`,
            ])
        }
    },

    traduction_aide_foret: {
        lines: [
            `Si vous ne retrouvez pas le chemin du terrier,`,
            `suivez les traces de nos capes dans la boue.`
        ]
    },

    traduction_entree_grotte: {
        lines: [
            `Ne laissez personne pénétrer dans le Terrier.`,
            `Utilisez les runes pour les neutraliser si nécessaire.`
        ],
        after(save) {
            if (save.hasBeatenArthur) {
                return talkToMyself([
                    `Utiliser les runes... Comme ce que le père Arthur m'a fait ?`,
                    `C'est plus qu'une langue, c'est un moyen de manipuler les esprits !`,
                    `Je ferais bien d'avancer discrètement ici...`
                ])
            } else {
                return talkToMyself([
                    `Utiliser les runes ? Qu'est-ce que ça peut vouloir dire ?`,
                    `Je ferais bien d'avancer discrètement ici...`
                ])
            }
        }
    }
}