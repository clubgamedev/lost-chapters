import { talkToMyself, startDialog } from "../utils/dialog"
import { initLights } from "../utils/Light"
import { Tindalos } from "../characters/Tindalos"

let tindalos;

export function therled(save) {
	if (tindalos) return [
		`Enfin, le moment est venu !`,
		rituel4
	];

	return [
		"Ah enfin ! Donne-moi le parchemin, il est presque trop tard !",
		{
			"Donner le parchemin": () => [
				"Bien, bien, nous allons pouvoir commencer..."
			],
			"Refuser": () => [
				"Qu'y a-t-il ? Tu abandonnes si près de notre but ?",
				"Tu penses pouvoir empêcher la science d'avancer ?",
				"Tu sais le sort que l'on réserve aux traîtres...",
				"Je te le redemande une dernière fois. Le parchemin."
			]
		},
		rituel1
	]
}

function rituel1() {
	return talkToMyself([
		`Vous donnez le parchemin à Therled.`
	]).then(() => startDialog([
		`Maintenant, le sang pour appeler la bête...`,
		`et le Liao pour voir à travers le voile...`,
		rituel2
	], { speaker: "therled" }))
}

function rituel2() {
	return talkToMyself([
		`Therled mélange la drogue de Liao dans de petites fioles rouge sombre.`,
		`On dirait du sang... Il distribue les fioles à ses compères, et vous en`,
		`tend une, puis boit la dernière d'un cul sec. Les autres l'imitent.`
	]).then(() => startDialog([
		{
			"Boire la fiole"() {
				game.player.lucidity = 1;
			},
			"Boire la fausse fiole"() { },
		}
	], { speaker: "therled" })
	).then(rituel3)
}

function rituel3() {
	initLights(125, 0.75, true, true, false);

	startDialog([
		`Et que maintant que le chien de Tindalos se MONTRE!`
	], { speaker: "therled" }
	).then(() => {
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
		if (game.save.hasFalsifiedScroll) {
			tindalos.die();
			game.camera.shake(0.01, 250);
			game.camera.flash(0xcc0000, 500);
			return startDialog([
				"Comment est-ce possible???",
				"Me serais-je trompé ?",
				"Non ! non ! C'est le parchemin qui n'est pas correct !",
			], { speaker: "therled" })
				.then(() => tindalos.fadeOut())
				.then(() => startDialog([
					"C'est fini Therled ! Vous n'invoquerez pas ce monstre !"
				], { speaker: "howard" }))
				.then(() => {
					game.save.gameOver = "lose";
					game.state.start("GameOver")
				})
		} else {
			game.camera.shake(0.01, 250);
			game.camera.flash(0xcc0000, 500);
			return startDialog([
				"OUI ! Viens à moi !",
				"Tu es à moi désormais ! Sois sous mon côntrole !",
				"Non ! comment est-ce possible !? Il me résiste à MOI, THERLED !",
				"Non non non le sort va être rom.... ARGGGH !",
			], { speaker: "therled" })
				.then(() => {
					game.save.gameOver = "win";
					game.state.start("GameOver")
				})
		}
	})
}