export function Therled(save) {
		if(save.hasBetrayedTherled){
			return [
				"tu te crois malin à vouloir empecher la science d'avancer??",
				"Allez les mecs donné lui une bonne leçon!"
				]
		}
        if (save.hasMetTherled) {
            return "Me dérange pas et va à ta place" ;
        }
        save.hasMetTherled = true;
		return [
			"ahhh mais voiçi un candidat idéal pour être mon fidèle",
			"Donne moi la drogue qu'on commence tout de suite",        
			{
				"Donner la drogue": () => "Merci tous à votre place",
				"Refuser": () => "Ben va te faire voir et meurs!"
			}
		]
}