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