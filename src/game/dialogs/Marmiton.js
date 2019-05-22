
 export function Marmiton(save) {
 
     if (save.hasHelpMarmiton) {
		return ["Utiliser cette potion a bon escient",
				"L'experience vous as plus, tu veux recommencer ?",
				{
					"Oui" :() => ["fct(minijeu)"],
					"Non" : () => ""
				}
		]
	 }
    return [
		"Bonjour qui êtes vous?",
		"Vous ne semblez ne pas être un de mes étudiants",
		{
			"Donner le message de Franck" :() => ["Je vois pourquoi vous êtes là.","Si vous préparez mes potions à ma place, je préparerais la vôtre"," marché conclu fct(minijeu)"],
			"Que faites vous ?" :() => "Je prépare des potions on est en manque",
			"Partir" : () => ""
		}

    ]
}