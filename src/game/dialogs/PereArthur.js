import { talkToMyself, exhaustDialog } from "../utils/dialog.js"
import { startFight } from "../scenes/minigames/Decryptor.js"
import { sounds } from "../audio.js"

export function arthur(save) {
	if (!save.hasBeatenArthur) return arthurMeeting(save)
	else if (save.hasFinishedTalkingToArthur) return arthurEnding(save)
	else if (save.hasTalkedToArthur) return arthurRappel(save)
	else
		return [
			"Comment ? Tu maîtrises les runes ?",
			"Mais j'ai lu en toi. Tu n'es pas de l'Université !",
			"Qui es-tu ?!",
			{
				"Inspecteur Howard...": () =>
					talkToMyself([
						"Je lui explique, sans trop de détails, l'objet de mon enquête."
					]).then(() => {
						save.hasTalkedToArthur = true
						return arthurRappel(save)
					})
			}
		]
}

export function arthurRappel(save) {
	return [
		"Alors ainsi, tu en as après Therled...",
		"Peut-être que nos objectifs concordent finalement...",
		arthurQuestions(save),
		{
			"Où est Marie ?": () => {
				return [
					`Soeur Marie a désobéi aux règles de notre Ordre.`,
					`Elle a manipulé des écritures interdites et les a mises entre les`,
					`mains d'un étranger... Vous ! Son sort est maintenant scellé...`
				]
			}
		},
		{
			"Qu'avez-vous fait d'elle ?": () => {
				return [`Cela ne te regarde pas !`]
			},
			"Laissez-la tranquille !": () => {
				return [`Tu n'es pas en position de me donner des ordres !`]
			}
		},
		() => arthurEnding(save)
	]
}

export function arthurEnding(save) {
	game.save.hasFinishedTalkingToArthur = true
	return [
		"Ne penses-tu pas avoir déjà causé assez de mal comme ça ?",
		"Mets-toi au travail, inspecteur. Retrouve la trace de Therled !",
		"Et peut-être alors que je pardonnerais Soeur Marie..."
	]
}

export function arthurMeeting(save) {
	return [
		`Toi ! Tu es celui qui a corrompu soeur Marie !`,
		`Tu possèdes des écritures interdites, et tu vas me les donner !`,
		() =>
			talkToMyself([
				`L'homme remue les lèvres sans produire aucun son.`,
				`Que se passe-t-il ? Ma vision se trouble...`,
				`Je vois... des runes ?`
			]).then(() => {
				save.hasBeatenArthur = true
				//startFight("arthur") //TEMP
			})
	]
}

export function arthurQuestions(save) {
	const questions = {
		"Qui êtes-vous ?": () => {
			Object.assign(questions, {
				"Une frontière ?": () => frontiere(questions),
				"Quelles erreurs ?": () => erreurs(questions)
			})

			return [
				"Je suis le père Arthur.",
				"Je fais partie d'un ordre ancien, dont le nom ne t'évoquera sans doute rien.",
				"Nous avons pour mission de protéger... disons, une frontière.",
				"Empêcher quiconque de s'y aventurer.",
				"Ne pas reproduire les erreurs du passé."
			]
		},
		"Ces runes...": () => {
			return [
				"Tu ne sais pas ce qu'elles sont, n'est-ce pas ?",
				"Elles sont marquées dans ton esprit, comme une idée fixe.",
				"Et pourtant, tu ne saurais pas les dessiner clairement.",
				"Ces runes sont des charnières entre les deux mondes...",
				"Nul ne devrait les connaître en dehors de notre ordre !",
				"Mais quand les universitaires les ont découvertes... quand ils ont vu",
				"qu'elles pouvaient plier les esprits tout comme elles plient la lumière",
				"et l'espace... Alors il était déjà trop tard.",
				"Le démon de la curiosité s'était déjà emparé d'eux..."
			]
		},
		Therled: () => {
			if (!game.save.loot.recetteAntidote) {
				questions["Recette du Liao"] = () => liao(questions)
			}

			questions["Des chapitres ?"] = () => chapitres(questions)
			return [
				`Therled nous a tous trompés ! Il nous a menti efrontément !`,
				`Il disait que l'ermite de la forêt fabriquait du Liao et en donnait`,
				`à ses élèves pour l'aider à étudier les runes.`,
				`Nous devions l'arrêter, mais les élèves connaissaient déjà les runes,`,
				`et ils étaient plus nombreux que nous !`,
				`Therled a proposé de travailler sur un antidote au Liao`,
				`qui neutraliserait les universitaires et nous permettrait de mettre fin`,
				`à leurs agissements. Il avait accès à un laboratoire...`,
				`Alors je lui ai donné la recette du Liao...`,
				`Il le fallait ! Comment tester l'antidote sinon ? De toute façon,`,
				`l'ermite possédait déjà la recette ! Encore un mensonge, sans doute...`,
				`Quelques jours plus tard, notre autel a été visité et des chapitres`,
				`du livre de notre Ordre ont été volés.`,
				`Je suis certain que c'est également de son fait...`
			]
		}
	}

	return [exhaustDialog(questions)]
}

export function frontiere(questions) {
	questions["Où est ce mur ?"] = () => terrier(questions)
	return [
		`Une frontière, un passage... Tu n'as pas besoin d'en savoir davantage.`,
		`Sache juste que Therled souhaite franchir ce mur interdit et que nous`,
		`devons l'en empêcher. Beaucoup de gens risquent de mourir autrement.`
	]
}

export function erreurs(questions) {
	questions["Les Chiens ?"] = () => chien(questions)
	questions["Tindalos"] = () => tindalos(questions)
	return [
		`Nombreux sont ceux qui ont voulu explorer l'autre côté.`,
		`Des rois en quête de pouvoir et de trésors...`,
		`Des religieux désireux de communier avec leurs dieux...`,
		`Des érudits qui cherchaient des réponses...`,
		`Ils n'ont rien trouvé d'autre que ruine et folie !`,
		`Et leurs pérénigrations ont fini par appâter les Chiens.`
	]
}

export function chien(questions) {
	return [
		`Humpf ! Peux-tu seulement le concevoir !?`,
		`On a longtemps cherché le lien entre esprit et matière...`,
		`Voilà une vérité que je peux te donner :`,
		`Les deux sont une nourriture délectable pour les Chiens...`,
		`Tu comprends, à présent, pourquoi Therled doit être arrêté ?`
	]
}

export function tindalos(questions) {
	return [
		`Tu connais le nom du monde qui se cache dans la courbe de la Lune ?`,
		`Ces universitaires en savent décidément beaucoup trop !`
	]
}

export function terrier(questions) {
	return [
		`Ce n'est pas aussi simple...`,
		`Il ne s'agit pas d'un endroit, au sens où tu peux l'entendre.`,
		`On peut y accéder de partout... Mais seulement sous un certain angle.`,
		`Considère ça comme une barrière... spirituelle ?`,
		`En tout cas, j'ignore où peut se cacher Therled et ses compères.`
	]
}

export function chapitres(questions) {
	return [
		`Ces chapitres perdus...`,
		`Ils décrivent comment faire une brèche dans le mur...`,
		`Comme une porte... Qui s'ouvrirait dans les deux sens...`,
		`C'est le plus grand danger auquel a été confronté mon Ordre.`,
		`Therled connaît les runes. Il a la serrure et la clé qui l'ouvre !`,
		`Qui sait ce qu'il compte faire ?`
	]
}

export function liao(questions) {
	return [
		`Hors de question que je te donne cette recette !`,
		`C'est ce qui est à l'origine de tous nos problèmes !`,
		`Toutefois, Therled ne nous a pas menti sur un point.`,
		`Il a bel et bien trouvé un antidote au Liao. Peut-être pour couvrir`,
		`son mensonge... Ou par peur des effets secondaires qu'il s'infligerait.`,
		`Cet antidote, je veux bien t'en donner la recette.`,
		() =>
			talkToMyself([
				"Arthur me tend un bout de papier avec des ingrédients griffonés."
			]).then(() => {
				game.save.loot.recetteAntidote = true
				sounds.ITEM.play()
			}),
		`Si tu comptes arrêter Therled, il te faut cet antidote.`,
		`Autrement tu risques de perdre l'esprit, comme les autres...`
	]
}
