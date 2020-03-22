import { talkToMyself, startDialog, exhaustDialog } from "../utils/dialog"
import { initLights } from "../utils/Light"
import { Tindalos } from "../characters/Tindalos"

let tindalos = null
let parcheminFalsifie = false

export function therled(save) {
	if (tindalos) return [`Enfin, le moment est venu !`, rituel4]

	if (
		game.save.inventory.items.parchemin.nombre === 0 &&
		game.save.inventory.items.parcheminFalsifie.nombre === 0
	) {
		return [
			`J'ai dit que je ne voulais pas être dérangé !`,
			`Je termine les préparatifs du rituel !`,
			`Rends-toi plutôt utile et amène-moi le parchemin !`
		]
	}

	let choices = {
		Refuser: () => [
			"Quoi !? Tu abandonnes si près de notre but ?",
			"As-tu oublié ce pourquoi nous sommes là ?",
			"Tu sais le sort que l'on réserve aux traîtres...",
			"Je te le redemande une dernière fois. Le parchemin."
		]
	}

	if (game.save.inventory.items.parchemin.nombre > 0) {
		choices["Donner l'original"] = () => {
			parcheminFalsifie = false
			return []
		}
	}

	if (game.save.inventory.items.parcheminFalsifie.nombre > 0) {
		choices["Donner le faux"] = () => {
			parcheminFalsifie = true
			return []
		}
	}

	return [
		`J'ai dit que je ne voulais pas être dérangé !`,
		`Ah, tu as le parchemin ! Donne-le moi, il est presque trop tard !`,
		choices,
		rituel1
	]
}

function rituel1() {
	return talkToMyself([`Vous donnez le parchemin à Therled.`]).then(() =>
		startDialog(
			[
				`Bien, bien, nous allons pouvoir commencer...`,
				`D'abord, le sang pour appeler la bête...`,
				`puis le Liao pour voir à travers le voile...`,
				rituel2
			],
			{ speaker: "therled" }
		)
	)
}

function rituel2() {
	return talkToMyself([
		`Therled mélange la drogue dans de petites fioles rouge sombre.`,
		`On dirait du sang... Il distribue les fioles à ses compères, et vous en`,
		`tend une, puis boit la dernière d'un cul sec. Les autres l'imitent.`
	])
		.then(() =>
			exhaustDialog(
				[
					{
						"Boire la fiole"() {
							game.save.lucidity = 1
						},
						"Boire l'antidote"() { },
						"Boire une potion"() { }
					}
				],
				{ speaker: "therled" }
			)
		)
		.then(rituel3)
}

function rituel3() {
	initLights({
		lightRadius: 125,
		obscurity: 0.75,
		hueVariationSpeed: 1.0,
		fog: true
	})

	startDialog([`Et que maintant que le chien de Tindalos se MONTRE!`], {
		speaker: "therled"
	}).then(() => {
		tindalos = new Tindalos({
			x: 13,
			y: 14
		})
	})
}

function rituel4() {
	return talkToMyself([
		`Therled déplie le parchemin et se lance dans une litanie incantatoire.`,
		`La grotte semble se plier sous le son de sa voix...`
	]).then(() => {
		if (parcheminFalsifie) {
			tindalos.die()
			game.camera.shake(0.01, 250)
			game.camera.flash(0xcc0000, 500)
			return startDialog(
				[
					"Comment est-ce possible???",
					"Me serais-je trompé ?",
					"Non ! non ! C'est le parchemin qui n'est pas correct !"
				],
				{ speaker: "therled" }
			)
				.then(() => talkToMyself([
					`Ce monstre semble affaibli ! C'est le moment de le bannir pour de bon !`
				]))
				.then(() => startFight({
					name: "Chien de Tindalos",
					type: "tindalos",
					duration: 20,
					nbPlayerHitsToWin: 16
				}))
				.then(() => startDialog(
					[
						"Noooon ! Qu'avez-vous fait !? Aargh...."
					],
					{ speaker: "therled" }
				))
				.then(() => tindalos.fadeOut())
				.then(() =>
					startDialog(
						[
							"C'est fini Therled ! Vous n'invoquerez pas ce monstre !",
							"Therled, vous m'entendez ?"
						],
						{ speaker: "howard" }
					)
				)
				.then(() => {
					game.save.gameOver = "win"
					game.state.start("GameOver")
				})
		} else {
			game.camera.shake(0.01, 250)
			game.camera.flash(0xcc0000, 500)
			return startDialog(
				[
					"OUI ! Viens à moi !",
					"Tu es à moi désormais ! Sois sous mon côntrole !",
					"Non ! comment est-ce possible !? Il me résiste à MOI, THERLED !",
					"Non non non le sort va être rom.... ARGGGH !"
				],
				{ speaker: "therled" }
			).then(() => {
				game.save.gameOver = "lose_battle"
				game.state.start("GameOver")
			})
		}
	})
}
