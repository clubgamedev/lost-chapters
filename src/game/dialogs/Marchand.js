export function Marchand(save) {

	if(save.hasntSellBreloque){
	    return [
			"Bonjour cher client",
			"Nous avons beaucoup d'article pour vous satisfaire",
			"jetez un oeil et surtout achetez!",        
			{
				"une fiole de combat contre une fiole de vue": () => "fct(givePotionCombat) Merci",
				"une fiole de vue contre une fiole de défense": () => "fct(givePotionCombat) Merci",
				"une fiole de défense contre une fiole de combat": () => "fct(givePotionCombat) Merci",
				"3 trois fiole de chaque contre une breloque?": () => "fct(giveBreloque) C'est un article fort intéressant n'est ce pas?"
			}
		]
	}
    return [
        "Bonjour cher client",
		"Nous avons beaucoup d'article pour vous satisfaire",
		"jetez un oeil et surtout achetez!",        
        {
            "une fiole de combat contre une fiole de vue": () => "fct(givePotionCombat) Merci",
            "une fiole de vue contre une fiole de défense": () => "fct(givePotionCombat) Merci",
            "une fiole de défense contre une fiole de combat": () => "fct(givePotionCombat) Merci"			
        }
    ]
}