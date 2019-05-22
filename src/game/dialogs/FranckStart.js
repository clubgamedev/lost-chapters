
 export function franck(save) {
        if (save.hasMetFranck) {
            return franckChapitre1(save) ;
        }
        save.hasMetFranck = true;
        return [
            "Salut, moi c'est Franck",
            "Va voir l� bas si j'y suis"
        ]
    }

  
 function  franckChapitre1(save) {
        if (save.hasMetFranckChapitre1) {
            return [
                "Avez vous réussi à stopper Therled ?",
                {
                    "Oui": () => "Menteur !",
                    "C'était quoi déjà?": () => ["Vous allez dans ma réserve,","prendre la drogue Liao et "],
                    "Je m'en fous": () => ["Comment ça tu t'en fous ?", "Mais il faut bien tester les dialogues !"]
                },
            ]           
        }
        save.hasMetFranckChapitre1 = true;
         return [
            "Merci d'être passé me voir aussi vite mon jeune ami,",
            "Je m'inquiète pour un de mes étudiants Therled.",
            {
            "Expliquez moi": () => ["Therled souhaite captuer un chien de Tindalos,","cet inconscient sous estime les risques de sa folie.",
                                    "Je veux que vous l'arrêter avant qu'il ne soit trop tard",""],
            "N'en dites pas plus": () => "Merci et prenez soin de vous."
            },
        ]
    }

