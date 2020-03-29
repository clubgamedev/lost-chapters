import { exhaustDialog } from "@/game/utils/dialog"
import { talkToMyself } from "../utils/dialog"

export function ramsey(save) {
	if (!save.hasMetRamsey) return ramseyMeeting(save)
	else return ["Quoi ?", ramseyQuestions(save)]
}

function ramseyMeeting(save) {
	save.hasMetRamsey = true

	return [
		"Qui êtes vous !?",
		"Vous ne semblez pas être un de mes étudiants...",
		{
			"Ramsey ?": [
				`Ouais, c'est moi... Que voulez-vous ?`,
				ramseyQuestions(save)
			]
		}
	]
}

function ramseyQuestions(save) {
	const questions = {
		"Franck m'envoie": () => {
			Object.assign(questions, {
				"Les robes blanches ?": () => robesBlanches(questions),
				"Des capes noires ?": () => capesNoires(save, questions),
				"A propos du Liao": () => liao(questions)
			})

			return [
				"Ce vieil hibou ! Il ne m'écoute pas !",
				"Je lui ai dit qu'il y avait des ombres dans la forêt au crépuscule.",
				"Pas les robes blanches qui passent le jour ! Des capes noires !",
				"Il m'a dit que j'avais goûté au mauvais champignon !",
				"Mais qu'est-ce qu'il y connaît ?"
			]
		}
	}

	if (game.save.hasRamseyTalkedAboutIngredients) {
		questions["Les ingrédients"] = () => infosIngredients(questions)
	} else {
		questions["Que faites vous ?"] = () => {
			questions["Quelles décoctions ?"] = () => preparerPotion(questions)
			return [
				"J'étudie les plantes, et les champignons. J'en fais des décoctions.",
				"Et j'essaie de transmettre mon savoir à ces idiots de l'école.",
				"Mais je ne dors plus là-bas. A l'Université, je veux dire.",
				"Ça pue, là-bas."
			]
		}
	}

	return [exhaustDialog(questions, "Heu... Je vous laisse...")]
}

function capesNoires(save, questions) {
	save.hasDiscoveredCapeRamsey = true
	return [
		`Ouais... Ils se cachent de moi, mais je les vois !`,
		`J'ai même trouvé une de ces capes déchirée dans des buissons.`,
		`Elle est dans ma tente, allez voir si vous ne me croyez pas !`,
		`C'est bien la preuve que je ne suis pas fou !`
	]
}

function robesBlanches(questions) {
	return [
		`Ces fichus hippies ! Le vieux barbu m'a chassé des grottes quand j'ai`,
		`voulu y étudier les champignons qui y poussent.`,
		`Soi-disant que ces champignons doivent être "protégés"...`,
		`Protégés de quoi d'abord ?`,
		`Je suspecte que ces champignons soient à la base de la recette`,
		`du Liao antique. Ces illuminés doivent se défoncer avec ça...`,
		`Heureusement qu'il y a la gamine. Elle est gentille, elle.`,
		`Elle me ramène des mûres sauvages parfois. Une brave petite.`,
		`C'est la seule qui daigne me parler d'ailleurs...`
	]
}

function liao(questions) {
	questions["Un antidote"] = () => antidote(questions)
	return [
		`Ah, le Liao vous intéresse, hein ?`,
		`Vous n'êtes pas comme tous ces abrutis d'étudiants qui pensent`,
		`avoir trouvé une recette de potion magique, j'espère...`,
		`C'est un puissant stimulant... mais avec des effets secondaires!`,
		`Hyper-sensibilité, déréglement émotionnel, hallucinations...`,
		`Des étudiants m'ont demandé d'en fabriquer le mois dernier,`,
		`mais c'est trop dangereux. J'ai refusé, et ils se sont énervés.`,
		`Ils sont exclus de mon cours depuis.`
	]
}

function antidote() {
	return [
		`Un antidote au Liao ? Et comment je fais ça, moi ?`,
		`Pour ça, il faudrait déjà que je puisse étudier le Liao !`,
		`Il se peut que les dévots en fabriquent, mais ils ne me laissent`,
		`pas approcher de leurs maudites grottes.`,
		`Sinon, demandez aux étudiants que j'ai viré de mon cours !`,
		`Leur meneur voulait à tout prix en fabriquer, il a peut-être trouvé`,
		`un moyen depuis. Je crois qu'il s'appelait...`,
		{
			"Therled ?": () => ["Oui c'est ça ! Vous le connaissez ?"]
		},
		() => {
			return talkToMyself([
				`Je commence à le connaître, en effet...`
			])
		}
	]
}

function preparerPotion(questions) {
	questions["Les ingrédients"] = () => infosIngredients(questions)
	game.save.hasRamseyTalkedAboutIngredients = true;
	return [
		`Les potions stimulent l'esprit de ceux qui les boivent.`,
		`Elles pourraient vous servir si vous êtes inspecteur !`,
		`Tenez, j'ai par exemple un psycho-stimulant fait-maison`,
		`qui améliorera votre concentration et votre acuité mentale.`,
		`La recette est écrite sur ce parchemin derrière moi.`
	]
}

function infosIngredients(questions) {
	const potions = {};
	const ingredients = {
		cireNoire: () => [
			`Les dévots l'utilisent dans leurs grottes et sanctuaires.`,
			`Ils la fabriquent eux-mêmes à partir de graisses végétales.`,
			`Mélangée à de la cendre, elle prend cette couleur noire.`
		],
		psycholibe: () => [
			`Ce sont des champignons qui poussent dans la forêt.`,
			`Ils peuvent être utilisés à des fins... récréatives.`,
			`Et il se trouve que je n'en ai plus en stock !`
		],
		epineDeDiable: () => [
			`Les poissons du diable, on en trouve plein la rivière !`,
			`Je viens d'en pêcher justement, il y en a sur le séchoir.`
		],
		foieDeCerf: () => [
			`Vous allez devoir chasser le cerf !`,
			`Vous n'avez pas le profil d'un bon chasseur, je me trompe ?`,
			`Essayez les cuisines de l'Université alors.`
		],
		plumeDeGeai: () => [
			`De magnifiques oiseaux, hein ? J'ai vu un superbe spécimen se poser`,
			`tous les matins sur un arbre mort, pas loin du camp.`
		],
		sangLibellule: () => [
			`J'ai vu des dévots qui piégeaient les libellules près du pont de la rivière.`,
			`Mais je n'ai aucune idée de ce qu'ils peuvent en faire ! Soyez prudents...`
		],
		oeufCorbeau: () => [
			`Un oeuf de corbeau ? Ça se mange ?`,
			`Cherchez sous un arbre de la forêt, je suppose ?`,
			`Des corbeaux, il y en a plein parmi ces bois.`
		],
		alcool: () => [
			`Vous cherchez de la gnôle ? Ce n'est pas vraiment le moment...`,
			`Franck doit sûrement en avoir dans ses appartements.`,
			`Il est un peu trop porté sur la bouteille à mon goût...`
		],
		racineHellebore: () => [
			`L'héllébore calme les nerfs et peut servir d'antidouleur de fortune,`,
			`mais attention au risque d'addiction.`,
			`Le vieux chef à la tête des dévots du sanctuaire cueille tous les pieds`,
			`qu'il trouve. Depuis, on en trouve de moins en moins dans la forêt.`,
			`Je voudrais bien l'en empêcher, mais je ne suis pas en bons termes avec...`,
		]
	}

	if (game.save.loot.recettePotionDeForce) {
		potions['Psycho-stimulant'] = () => [
			exhaustDialog({
				['Cire noire']: ingredients.cireNoire,
				['Psycholibe']: ingredients.psycholibe,
				['Epine de diable']: ingredients.epineDeDiable
			}, "Autre chose...")
		]
	}

	if (game.save.loot.recettePotionDeProtection) {
		potions["Elixir du dévot"] = () => [
			exhaustDialog({
				['Foie de cerf']: ingredients.foieDeCerf,
				['Plume de geai']: ingredients.plumeDeGeai,
				['Sang de libellule']: ingredients.sangLibellule
			}, "Autre chose...")
		]
	}

	if (game.save.loot.recettePotionDeLucidite) {
		potions["Tranquilisant"] = () => [
			exhaustDialog({
				['Oeuf de corbeau']: ingredients.oeufCorbeau,
				['Alcool']: ingredients.alcool,
				[`Racine d'hellebore`]: ingredients.racineHellebore
			}, "Autre chose...")
		]
	}

	if (game.save.loot.recetteAntidote) {
		potions["Antidote au liao"] = () => [
			exhaustDialog({
				['Epine de diable']: ingredients.epineDeDiable,
				['Sang de libellule']: ingredients.sangLibellule,
				[`Racine d'hellebore`]: ingredients.racineHellebore
			}, "Autre chose...")
		]
	}

	return [
		`Quel ingrédient cherchez-vous ?`,
		exhaustDialog(potions, "C'est bon, j'ai tout noté !")
	]
}