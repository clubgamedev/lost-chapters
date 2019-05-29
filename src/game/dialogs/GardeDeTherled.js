export function GardeDeTherled(save) {

	if(save.hasCapturedAfterBetrayedTherled){
		return "Toi là je vais t'exploser!! fct(combat)"
	}

	if(save.hasBetrayedTherled){
		return "On va lui régler son compte boss"
	}
	if(save.EndRituelAndDialog){
		return [
			"Le boss nous as dis de partir",
			"Tu fais partis des nôtres à présent",
			"Va te reposer, le chef aura besoin de nous très vite."
				]
	}

    if (save.hasMetTherled) {
		return "Fais pas de zéle et obéis au boss"
	}
    return [
        "Depêche toi de servir le boss!"
    ]
}