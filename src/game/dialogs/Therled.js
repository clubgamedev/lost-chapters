export function Therled(save) {
		if(save.EndRituelAndDialog){
			return [
				"Tu n'as pas ENTENDU ??",
				"VA T-EN je dois me concentrer pour tout recommencer"
				]
		}

		if(save.hasBetrayedTherled){
			return [
				"Tu te crois malin à vouloir empecher la science d'avancer??",
				"Allez les mecs donné lui une bonne leçon!"
				]
		}
		
		if(save.EndRituel){
			save.EndRituelAndDialog =true;
			if(save.SuccesRituel){
				return[
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
		}
		
		if(save.StartRituel){
			return [
				"Toi là bas va me chercher le parchemin d'incantation.",
				"Oui Chef!",
				" et toi rapporte moi la fiole de sang de tindalos.",
				"A vos ordres patron",
				"Maintenant le dernier ingrédient pour le rituel,",
				"(mélange la drogue de Liao à la fiole de sang)",
				" toi qui veut nous rejoindre prête nous allégence en buvant ça.",
				{
					"Boire la fiole": () => ["Bien Bien, ça va commencer",
											 "(Vous poignarde)",
											 "Ne t'inquiete pas tu va survivre à ce coup",
											 "Et que maintant que le chien de tindalos se MONTRE!",
											 "fct(ResultOfRituel)"
											 ],
					"Refuser": () => "fct(BetrayedTherled) Ben va te faire voir et meurs!"
				}
				]
		}
        if (save.hasMetTherled) {
			save.Rituel=true;
            return [
					"Me dérange pas et va à ta place.",
					"Que le rituel commence."
					]
        }
        save.hasMetTherled = true;
		return [
			"ahhh mais voiçi un candidat idéal pour être mon fidèle",
			"Donne moi la drogue qu'on commence tout de suite",        
			{
				"Donner la drogue": () => "Merci tous à votre place",
				"Refuser": () => "fct(BetrayedTherled) Ben va te faire voir et meurs!"
			}
		]
}