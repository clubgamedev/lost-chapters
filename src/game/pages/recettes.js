import { talkToMyself } from "../utils/dialog"


export const recette_force = {
	text: `Psycho-stimulant
La recette est si simple que même Augustin pourrait la faire: de la cire noire, des épines de poisson diable et des psycholibes. Peut-être qu'avec ça, vous aurez assez de neurones pour retenir mes cours !`,
	after() {
		if (!game.save.loot.recettePotionDeForce) {
			game.save.loot.recettePotionDeForce = true
			game.save.inventory.items.livreRecettes.nombre = 1;
			talkToMyself([
				"Cire noire ? Poisson diable ? Psychoquoi ?",
				"Je devrais demander des précisions à Ramsey..."
			])
		} else {
			talkToMyself([
				"Ramsey n'y va pas de main morte avec les étudiants !",
				"Il ne doit pas être très apprécié..."
			])
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
			game.save.inventory.items.livreRecettes.nombre = 1;
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
	text: `Pour vos troubles du sommeil, voilà la recette d'un tranquilisant de ma conception: mélanger un oeuf de corbeau et de la poudre de racine d'héllébore dans un alcool fort. N'importe quelle gnole fera l'affaire. Ramsey`,
	after() {
		if (!game.save.loot.recettePotionDeLucidite) {
			game.save.loot.recettePotionDeLucidite = true;
			game.save.inventory.items.livreRecettes.nombre = 1;
			talkToMyself([
				"Après cette affaire, je risque moi aussi de mal dormir...",
				"Je vais noter la recette dans mon calepin."
			])
		} else {
			talkToMyself(["N'importe quelle gnole, hein ? Ça doit être là juste pour le goût."])
		}
	}
}
