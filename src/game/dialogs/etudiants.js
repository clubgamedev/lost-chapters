import { pickRandomIn } from "../utils/array"


export function etudiant_salle_a_manger(save) {
    return pickRandomIn([
        [`Ne m'approchez pas !`],
        [
            `Ce monde est si plat...`,
            `Je ne vois plus les angles...`
        ],
        [
            `Laissez-moi !`,
            `Sans Liao, nous sommes aveugles...`
        ]
    ])
}

export function etudiant_dortoir(save) {
    return [
        `Vous savez qu'ils peuvent nous voir...`,
        `Dans nos rêves...`,
        `Vous les voyez aussi ?`
    ]
}

export function etudiant_salle_astonomie(save) {
    return [
        `C'est ce soir, la lune rouge, l'appel du sang.`,
        `Je ne prendrais pas part à cette folie.`,
        `Therled pense être prêt. Il ne l'est pas`,
        `L'esprit humain n'est pas prêt pour le voir.`
    ]
}