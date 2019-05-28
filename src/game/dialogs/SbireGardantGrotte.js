export function SbireGardantGrotte(save) {
    return [
        "Halte ! Personne ne passe sans l'autorisation du chef",
        {
            "Je suis venu apporter ça à Therled": () => [
                "Ohh du Liao ? Le chef sera sûrement interessé...",
                "Mais on va lui ramener nous même.",
                "fct(combat)"
            ],
			"Votre chef m'a demandé de venir":() => [
                "Ah bon? Pas de souvenirs de ta tête..."
            ],
            "Je passe où je veux": () => "fct(combat)",
            "Partir": () => ""
        }
    ]
}