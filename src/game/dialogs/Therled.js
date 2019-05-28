export function Therled(save) {
		if(save.hasBetrayedTherled){
			return [
				"Tu penses pouvoir empêcher la science d'avancer ?",
				"Assez. Saisissez-le !"
			]
		}
        if (save.hasMetTherled) {
            return "Je ne souhaite pas être dérangé, retourne à ton poste !" ;
        }
        save.hasMetTherled = true;
		return [
			"Ahhh mais voiçi un candidat idéal pour être mon fidèle",
			"Donne moi la drogue que l'on commence tout de suite",
			{
				"Donner la drogue": () => "Bien. Préparez le rituel.",
				"Refuser": () => "Ben va te faire voir et meurs!"
			}
		]
}