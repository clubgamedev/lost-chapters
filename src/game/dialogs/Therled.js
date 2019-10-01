import { talkToMyself } from "../utils/dialog"

export function therled(save) {
	return [
		"Ah enfin ! Donne-moi le parchemin, il est presque trop tard !",
		{
			"Donner le parchemin": () => [
				"Bien, bien, nous allons pouvoir commencer...",
				rituel1
			],
			"Refuser": () => [
				"Qu'y a-t-il ? Tu abandonnes si près de notre but ?",
				"Tu penses pouvoir empêcher la science d'avancer ?",
				"Tu sais le sort que l'on réserve aux traîtres...",
				"Je te le redemande une dernière fois. Le parchemin.",
				rituel1
			]
		}
	]

}

function rituel1() {
	return talkToMyself([
		`Vous donnez le parchemin à Therled.`
	]).then(() => [
		`Maintenant, le sang pour appeler la bête...`,
		`et le Liao pour voir à travers le voile...`,
		rituel2
	])
}

function rituel2() {
	return talkToMyself([
		`Therled mélange la drogue de Liao dans de petites fioles`,
		`au contenu rouge sombre. On dirait du sang...`,
		`Il distribue les fioles à ses compères, et vous en tend une,`,
		`puis boit la dernière d'un cul sec. Les autres l'imitent.`
	]).then(() => {
		return {
			"Boire la fiole": () => ["Et que maintant que le chien de tindalos se MONTRE!"],
			"Boire la fausse fiole": () => ["Et que maintant que le chien de tindalos se MONTRE!"],
		}
	})
}

/*
if (save.EndRituel) {
	save.EndRituelAndDialog = true;
	if (save.SuccesRituel) {
		return [
			"OUI OUI VIENS à moi mon chien",
			"Tu es à moi désormais sois sous mon côntrole",
			"Non comment est-ce possible, il me résiste à MOI, THERLED!",
			"Non non non le sort va être rom....",
			"ARGGG",
			"fct(combatBossTindalos)"
		]
	}
	return [
		"Comment est-ce possible???",
		"Me serais-je tromper.",
		"Non non c'est ces livres qui ne sont pas correct!",
		"Je vais devoir tout recommencer depuis le départ.",
		"Faisss chier!",
		".....",
		"Les gars laisser moi seul."
	]

}*/