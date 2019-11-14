import {allPotions} from "../scenes/minigames/alchemy/potions";
import {drinkPotion} from "../utils/inventory";

export function potionDeForce(inventory) {
    return [
        allPotions.filter((potion) => potion.name === "potionDeForce")[0].description,
        {
            "La boire": () => {
                inventory.items.potionDeForce.actif = true;
                inventory.items.potionDeForce.nombre--;
                drinkPotion(["Psycho-stimulant consommée", "Vous vous sentez plus fort" ]);
            },
            "La ranger": () => {

            }
        }
    ]
}

export function potionDeLucidite(inventory) {
    return [
        allPotions.filter((potion) => potion.name === "potionDeLucidite")[0].description,
        {
            "La boire": () => {
                inventory.items.potionDeLucidite.actif = true;
                inventory.items.potionDeLucidite.nombre--;
                drinkPotion(["Tranquilisant consommée", "Votre lucidité a augmentée"]);
            },
            "La ranger": () => {

            }
        }
    ]
}

export function potionDeProtection(inventory) {
    return [
        allPotions.filter((potion) => potion.name === "potionDeProtection")[0].description,
        {
            "La boire": () => {
                inventory.items.potionDeProtection.actif = true;
                inventory.items.potionDeProtection.nombre--;
                drinkPotion(["Potion du dévot consommée", "Vous vous sentez protégé"]);
            },
            "La ranger": () => {

            }
        }
    ]
}

export function fioleDeSang(inventory) {
    return [
        allPotions.filter((potion) => potion.name === "fioleDeSang")[0].description,
        {
            "La boire": () => {
                inventory.items.fioleDeSang.actif = true;
                inventory.items.fioleDeSang.nombre--;
                drinkPotion(["Fiole de sang consommée", "Etait-ce une bonne idée?"]);
            },
            "La ranger": () => {

            }
        }
    ]
}

export function cape(inventory) {
    return [
        "Cette cape que m'a donné Jean Louis me permet de me cacher",
        "pour entrer dans les douches des sbires sans être vu :D",
    ]
}

export function parchemin(inventory) {
    return [
        "Ce parchemin que m'a confié Billou ne ressemble à rien, ",
        "on dirait du papier toilettes en toile de jute",
    ]
}