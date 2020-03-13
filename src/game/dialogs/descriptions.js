import { sounds } from "../audio"
import { talkToMyself, startDialog } from "../utils/dialog"
import { save } from "../save"
import { drinkPotion } from "../utils/inventory"
import {
	potionDeForce,
	potionDeProtection,
	potionDeLucidite,
	antidote
} from "../scenes/minigames/alchemy/potions"
import { destroyMurSecret } from "../items/Bloc"

export function readDescription(name) {
	let description = descriptions[name]
	if (!description) return console.error(`Description not found: ${name}`)

	if (typeof description === "function") description = { action: description }

	description.before = description.before || (() => Promise.resolve())
	description.after = description.after || (() => Promise.resolve())

	return description
		.before()
		.then(() => talkToMyself(description.action(game.save)))
		.then(() => description.after())
}

export const descriptions = {
	croquis_astro: save => [
		`C'est une pile de croquis astronomiques incompréhensibles.`,
		`Il semble que les étudiants se soient beaucoup intéressés à la Lune.`
	],

	telescope: save => [
		`Ce téléscope est dirigé vers la Lune.`,
		`La lune est rouge ce soir à cause de l'Eclipse.`
	],

	book_alphabet: save => {
		if (!save.hasDiscoveredAlphabet) {
			save.hasDiscoveredAlphabet = true
			return [
				`Ce livre contient la transcription des runes aux tableau.`,
				`Je vais noter ça pour essayer de les déchiffrer...`
			]
		}

		return [
			`J'ai noté la transcription des runes dans mon calepin.`,
			`Je devrais pouvoir déchiffrer les runes maintenant.`
		]
	},

	runes_inconnues: save => [
		`De drôles de runes sont tracées ici.`,
		`Elles changent selon l'angle sous lequel on les regarde.`,
		`Je n'y comprends rien...`
	],

	desc_lore_1: save => [
		`C'est un vieux bouquin poussiéreux.`,
		`Sur la couverture est écrit:
"Les rats dans les murs"`
	],

	room_runes: save => [`Salle d'études des runes`],

	room_astro: save => [`→ Salle d'astrologie`],

	room_library: save => [`← Bibliothèque et Dortoirs`],

	room_franck: save => [`Bureau de Franck Belknap`],

	horloge: {
		action() {
			return [`Cette horloge n'est pas à l'heure...`]
		},
		after() {
			const choices = {
				"Régler avec sa montre": () =>
					talkToMyself(["Rien ne se passe..."])
			}
			if (game.save.hasReadSecretHours) {
				Object.assign(choices, {
					"Régler à 07:17": () =>
						talkToMyself(["Rien ne se passe..."]),
					"Régler à 11:33": () =>
						talkToMyself(["Rien ne se passe..."]),
					"Régler à 04:04": () => {
						destroyMurSecret()
					}
				})
			}

			startDialog([choices])
		}
	},

	panneau_direction_sanctuaire: save => [`← Sanctuaire`],

	panneau_sanctuaire: save => [
		`Le chemin ne sera ouvert qu'à ceux qui ont bravé leurs peurs`
	],

	panneau_entree_universite: save => [`Université Miskatonic`],

	panneau_direction_ramsey: save => [`← Colline aux bolets`],

	panneau_champignons: save => [
		`Des illustrations de divers champignons avec leurs noms`,
		`et propriétés. Ramsey s'en sert sûrement pour ses cours.`
	],

	tente: {
		action() {
			if (
				game.save.hasDiscoveredCapeRamsey &&
				!game.save.planquesFound.includes("cape_tente")
			) {
				return [
					`Il y a une vieille cape noire déchirée en boule dans un coin.`,
					`Je vais la prendre pour mon enquête.`
				]
			} else {
				return [
					`Pouah ! Cette tente dégage une odeur fétide.`,
					`Des champignons poussent même à l'intérieur !`
				]
			}
		},

		after() {
			if (game.save.planquesFound.includes("cape_tente")) return
			if (game.save.inventory.items.cape.nombre === 0) {
				game.save.inventory.items.cape.nombre++
				sounds.ITEM.play()
				game.save.planquesFound.push("cape_tente")
			}
		}
	},

	chaudron: {
		action() {
			if (game.save.canUseChaudron) {
				return [
					`Arthur a dit que j'aurais besoin de l'antidote si je compte pénétrer`,
					`dans le Terrier... Mais Ramsey n'est plus là pour m'en préparer.`,
					`Je vais devoir me débrouiller seul pour faire ces potions.`,
					`L'Eclipse a lieu bientôt, il fera bientôt nuit noire.`,
					`Je devrais me dépêcher d'en préparer le plus possible d'ici là.`,
					`Ça ne doit pas être si compliqué ?`
				]
			} else {
				return [
					`Ce doit être le chaudron qu'utilise Ramsey pour préparer ses potions.`,
					`Je ferais mieux de ne pas y toucher pour le moment.`
				]
			}
		},

		after() {
			if (game.save.canUseChaudron) {
				save()
				game.state.start("Alchemy")
			}
		}
	},

	tombe_sanctuaire: save => [
		`TODO: lore`
	],

	charnier: save => [`Un charnier, ici ? L'odeur est atroce...`],

	charnier2: save => [
		`Parmi les cadavres d'animaux, je crois voir des ossements humains !`,
		`Mon esprit doit me jouer des tours...`
	],

	precipice: save => [
		`L'éboulement est récent. Je ne passerais pas par là...`
	],

	trou_grotte: {
		action() {
			if (game.save.planquesFound.includes("trou_grotte")) {
				return [
					`Ces planques doivent servir à cacher la drogue des cultistes...`
				]
			} else {
				return [
					`Il y a un seau suspendu dans ce trou... Je peux le remonter.`,
					`Il contient quelques potions au contenu verdâtre.`
				]
			}
		},
		after() {
			if (game.save.planquesFound.includes("trou_grotte")) return
			game.save.inventory.items.potionDeLucidite.nombre += 2
			sounds.ITEM.play()
			game.save.planquesFound.push("trou_grotte")
		}
	},

	mare_grotte: {
		action() {
			if (game.save.planquesFound.includes("mare_grotte")) {
				return [
					`Les cultistes utilisent ces stimulants pour mieux percevoir les signes runiques.`
				]
			} else {
				return [
					`Une potion bleutée est à moitié ensevelie au fond de l'eau.`,
					`Elle porte une étiquette délavée: "Psycho-stimulant"`
				]
			}
		},
		after() {
			if (game.save.planquesFound.includes("mare_grotte")) return
			game.save.inventory.items.potionDeForce.nombre += 1
			sounds.ITEM.play()
			game.save.planquesFound.push("mare_grotte")
		}
	},

	tombe_grotte: {
		action() {
			if (game.save.planquesFound.includes("tombe_grotte")) {
				return [
					`D'après ce que m'a dit soeur Marie, cette potion des dévots`,
					`sert à sceller les signes runiques pour éloigner le mal.`,
					`On dirait que ça n'a pas marché pour cette pauvre femme.`
				]
			} else {
				return [
					`Quelle horreur ! C'est une tombe fraîchement creusée !`,
					`Une victime gît au fond. Elle porte les vêtements des dévots à l'orée`,
					`de la forêt, ainsi qu'une fiole rosée autour du cou.`,
					`Je vais la récupérer. Elle n'en aura plus besoin...`
				]
			}
		},
		after() {
			if (game.save.planquesFound.includes("tombe_grotte")) return
			game.save.inventory.items.potionDeProtection.nombre += 1
			sounds.ITEM.play()
			game.save.planquesFound.push("tombe_grotte")
		}
	},

	cape_cachee: {
		action() {
			if (game.save.planquesFound.includes("cape_cachee")) {
				return [
					`Il y a le nom de l'université brodé sur cette cape.`,
					`Pas de doutes, elle appartient à un étudiant.`
				]
			} else {
				return [
					`Quelqu'un a caché une vieille cape noire ici.`,
					`Je pourrais peut-être m'en servir...`
				]
			}
		},
		after() {
			if (game.save.planquesFound.includes("cape_cachee")) return
			if (game.save.inventory.items.cape.nombre === 0) {
				game.save.inventory.items.cape.nombre++
				sounds.ITEM.play()
				game.save.planquesFound.push("cape_cachee")
			}
		}
	},
	potionDeForce: save => {
		return [
			potionDeForce.description,
			{
				"La boire": () => {
					save.inventory.items.potionDeForce.actif = true
					save.inventory.items.potionDeForce.nombre--
					drinkPotion([
						"Psycho-stimulant consommé",
						"Vous vous sentez plus fort"
					])
				},
				"La ranger": () => { }
			}
		]
	},

	potionDeLucidite: save => {
		return [
			potionDeLucidite.description,
			{
				"La boire": () => {
					save.inventory.items.potionDeLucidite.actif = true
					save.inventory.items.potionDeLucidite.nombre--
					drinkPotion([
						"Tranquilisant consommé",
						"Vous vous sentez plus calme et lucide"
					])
				},
				"La ranger": () => { }
			}
		]
	},

	potionDeProtection: save => {
		return [
			potionDeProtection.description,
			{
				"La boire": () => {
					save.inventory.items.potionDeProtection.actif = true
					save.inventory.items.potionDeProtection.nombre--
					drinkPotion([
						"Potion du dévot consommée",
						"Vous vous sentez en sécurité"
					])
				},
				"La ranger": () => { }
			}
		]
	},

	antidote: save => {
		return [antidote.description, "Ça pourrait me servir plus tard..."]
	},

	cape: save => {
		return [
			"C'est une cape d'étudiant noire et crasseuse.",
			"Je pourrais m'en servir pour m'infiltrer dans leur repaire..."
		]
	},

	parchemin: save => {
		return [
			`Un vieux parchemin trouvé dans l'établi à l'Université.`,
			save.hasDiscoveredAlphabet
				? `Les runes tracées dessus ne figurent pas dans le livre que j'ai trouvé...`
				: `De drôles de runes sont tracées dessus...`
		]
	},

	parcheminFalsifie: save => {
		return [
			`La soeur Marie dit que ce parchemin décrit un rituel lié à Tindalos.`,
			`Elle a falsifié le parchemin pour corrompre le rituel.`,
			`Je dois maintenant le substituer à l'original que possède Therled...`
		]
	}
}

export const lockedExits = {
	sortie_universite() {
		if (game.save.hasMetFranck) {
			game.save.unlockedExits.push("sortie_universite")
			return talkToMyself([
				`Je devrais aller enquêter dans la forêt pour voir ce que trament`,
				`ce Therled et ses compères.`
			])
		} else {
			return talkToMyself([
				`Je ne peux pas partir maintenant, il faut que je parle à Franck.`
			]).then(() => {
				game.player.forceMove("UP", 500)
			})
		}
	},
	entree_cave() {
		if (game.save.inventory.items.cape.nombre > 0) {
			game.save.unlockedExits.push("entree_cave")
			return talkToMyself([
				`Je vais enfiler cette cape noire pour tenter de m'infiltrer.`,
				`Ça devrait marcher tant qu'on ne me regarde pas de trop près.`
			])
		} else {
			return talkToMyself([
				`J'entends du bruit à l'intérieur. Ça doit être le repaire des cultistes.`,
				`Je dois trouver un moyen de m'infiltrer discrètement là-dedans`
			]).then(() => {
				game.player.forceMove("DOWN", 500)
			})
		}
	}
}
