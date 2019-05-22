export function SbireGardantGrotte(save) {
    return [
        "Halte personne ne passe sans l'autorisation du chef",        
        {
            "Je suis venu apporter ça à Therled": () => ["Ohh la drogue de Liao, le chef sera surement interesse.","Par contre on va te le prendre fct(combat)"],
			"Votre chef m'a demandé":() => "A bon? pas souvenir de ta tête",
            "Je passe où je veux": () => "fct(combat)",
            "Partir": () => ""
        }
    ]
}