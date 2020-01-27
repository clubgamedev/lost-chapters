import { Potion } from "./Potion"

export const potionDeForce = new Potion({
	name: "potionDeForce",
	displayName: "Psycho-stimulant",
	ingredients: ["cireBougieNoir", "crochetsDeSerpent", "ecorceDeBouleau"],
	description: [
		"Ce stimulant psychotique devrait me permettre d'avoir des réflexes",
		"et une agilité plus performantes, ",
		"cela pourrait être utile pour certaines épreuves."
	]
})

export const potionDeProtection = new Potion({
	name: "potionDeProtection",
	displayName: "Potion du dévot",
	ingredients: ["foieDeCerf", "jusDeSauterelle", "plumeDeCorneille"],
	description: [
		"Le potion du dévot dégage un sentiment de sureté palpable,",
		"si je souhaite être mieux protégé, je pourrais peut être la boire..."
	]
})

export const potionDeLucidite = new Potion({
	name: "potionDeLucidite",
	displayName: "Tranquilisant",
	ingredients: ["oeufDeCorbeau", "epineDePoissonDiable", "vieilleGnole"],
	description: [
		"Ce tranquilisant augmente sensiblement ma lucidité ",
		"mais est-ce une bonne idée ?"
	]
})

export const antidote = new Potion({
	name: "antidote",
	displayName: "Antidote",
	ingredients: ["crochetsDeSerpent", "foieDeCerf", "jusDeSauterelle"],
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
