import { talkToMyself } from "../utils/dialog"

export const recette_protection = {
    text: `Potion des dévots
L'analyse du labo a révélé 3 ingrédients:
- Foie de cerf
- Sang de sauterelle
- Plume de corneille

Cette potion aurait des vertus apaisantes, mais le goût est atroce.`,
    after() {
        if (!game.save.recetteProtection) {
            game.save.recetteProtection = true;
            talkToMyself([
                "Pourquoi les dévots buvaient ce remède de sorcière ?",
                "Je vais noter les ingrédients au cas où ça serait important."
            ])
        } else {
            talkToMyself([
                "Il faut du courage pour avaler ça... "
            ])
        }
    }
}