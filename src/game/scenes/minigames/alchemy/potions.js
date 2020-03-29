export class Potion {
	displayName
	name
	ingredients = []
	description

	constructor(props) {
		Object.assign(this, props)
	}
}

export const potionDeForce = new Potion({
	name: "potionDeForce",
	displayName: "Psycho-stimulant",
	recette: "recettePotionDeForce",
	ingredients: ["cireBougieNoire", "epineDePoissonDiable", "alcoolPsylocibe"],
	description: [
		"Ce stimulant psychotique devrait me permettre d'accroître mes réflexes",
		"Cela pourrait m'être utile pour les épreuves qui m'attendent."
	]
})

export const potionDeProtection = new Potion({
	name: "potionDeProtection",
	displayName: "Elixir du dévot",
	recette: "recettePotionDeProtection",
	ingredients: ["foieDeCerf", "sangLibellule", "plumeDeGeai"],
	description: [
		"L'élixir du dévot dégage une odeur curieusement réconfortante.",
		"Peut-être que si je le buvais, je me sentirais-je mieux protégé ?"
	]
})

export const potionDeLucidite = new Potion({
	name: "potionDeLucidite",
	displayName: "Tranquilisant",
	recette: "recettePotionDeLucidite",
	ingredients: ["oeufDeCorbeau", "racineHellebore", "vieilleGnole"],
	description: [
		"Ce tranquilisant pourrait m'aider à retrouver ma lucidité",
		"ou me la faire perdre au contraire ? Je n'en suis plus sûr..."
	]
})

export const antidote = new Potion({
	name: "antidote",
	displayName: "Antidote",
	recette: "recetteAntidote",
	ingredients: ["racineHellebore", "sangLibellule", "epineDePoissonDiable"],
	description: [
		"C'est l'antidote conçu par Therled pour neutraliser les effets",
		"du Liao. C'est peut-être encore un autre de ses pièges...",
		"Je n'ai pas le choix... Je le saurais le moment venu."
	]
})

export const ALL_POTIONS = [
	potionDeForce,
	potionDeProtection,
	potionDeLucidite,
	antidote
]
