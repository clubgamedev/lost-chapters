import { talkToMyself } from "../utils/dialog"


export const recette_force = {
	text: `Psycho-stimulant`,
	after() {
		if (!game.save.loot.recettePotionDeForce) {
			game.save.loot.recettePotionDeForce = true
			talkToMyself([
				"TODO: dialogue"
			])
		} else {
			talkToMyself(["Il faut du courage pour avaler ça... "])
		}
	}
}


export const recette_protection = {
	text: `Elixir du dévot
L'analyse du labo a révélé 3 ingrédients:
- Foie de cerf
- Sang de sauterelle
- Plume de corneille

Cette potion aurait des vertus apaisantes, mais le goût est atroce.`,
	after() {
		if (!game.save.loot.recettePotionDeProtection) {
			game.save.loot.recettePotionDeProtection = true
			talkToMyself([
				"Pourquoi les dévots buvaient ce remède de sorcière ?",
				"Je vais noter les ingrédients au cas où ça serait important."
			])
		} else {
			talkToMyself(["Il faut du courage pour avaler ça... "])
		}
	}
}

export const recette_tranquilisant = {
	text: `Pour vos troubles du sommeil, voilà la recette d'un tranquilisant de ma conception:
mélanger un oeuf de corbeau et de la poudre de racine d'héllébore dans un alcool fort.
N'importe quelle gnole fera l'affaire, mais l'oeuf doit être frais !
Veillez à ne pas en abuser si vous voulez garder les idées claires.
Ramsey`,
	after() {
		if (!game.save.loot.recettePotionDeLucidite) {
			game.save.loot.recettePotionDeLucidite = true
			talkToMyself([
				"Après cette affaire, je risque moi aussi de mal dormir...",
				"Je vais noter la recette dans mon calepin."
			])
		} else {
			talkToMyself(["N'importe quelle gnole, hein ? Ça doit être là juste pour le goût."])
		}
	}
}
