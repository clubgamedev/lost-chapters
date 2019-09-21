import { pickRandomIn } from "../utils/array"

export function SbireMinable(save) {
    return [
        "Quuee faites vous ici !?",
        "Partez tout de suite où je vais encore y passer !",
        "Vous avez pas compris ? Dégagez!",
        "s'il vous plaît... partez...",
        {
            "Le frapper": () => "combat()",
            "Partir": () => ""
        }
    ]
}

export function ennemy_cultist(save) {
    return pickRandomIn([
        [`Hein ? Vous êtes qui ? Intrus !`],
        [`C'est toi Michel ? Mais qui êtes vous !?`],
        [`Therled t'attend. Mais... une minute, tu n'es pas Augustin !`],
        [`Quoi ? Vous n'avez rien à faire ici !`]
    ])
}