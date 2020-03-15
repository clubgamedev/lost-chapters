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
		},
		"Que faites vous ?": () => {
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
