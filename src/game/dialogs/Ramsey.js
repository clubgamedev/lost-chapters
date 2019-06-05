
export function Ramsey(save) {

	if (save.hasHelpedRamsey) {
		return ["Utilisez cette potion à bon escient",
			"L'expérience vous a plu, voulez-vous recommencer ?",
			{
				"Oui": () => ["fct(minijeu)"],
				"Non": () => ""
			}
		]
	}
	return [
		"Qui êtes vous !?",
		"Vous ne semblez pas être un de mes étudiants...",
		{
			"Donner le message de Franck": () => [
				"Je vois pourquoi vous êtes là.",
				"Si vous préparez mes potions à ma place, je préparerais la vôtre",
				"Marché conclu fct(minijeu)"
			],
			"Que faites vous ?": () => "Je prépare des potions, on en manque.",
			"Partir": () => ""
		}

	]
}