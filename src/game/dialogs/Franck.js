
export function franck(save) {
    if (!save.hasMetFranck) return franckMeeting(save)
    if (!save.hasDiscoveredTindalos) return franckRappel1(save)

    if (save.hasDiscoveredTindalos) return franckTindalos(save)
}


function franckMeeting(save) {
    save.hasMetFranck = true;
    return [
        "Ah, vous voilà !",
        "Merci d'être passé me voir aussi vite, mon jeune ami.",
        "J'ai besoin de vos talents d'enquêteur pour une affaire délicate.",
        "Je m'inquiète au sujet d'un de mes étudiants, Therled.",
        {
            "Therled ?": () => [
                "Oui, l'un de mes étudiants les plus brillants. Il est très respecté",
                "ici, peut-être dans un sens où je ne l'avais pas imaginé..."
            ],
            "Où sont les étudiants ? ": () => [
                "Je l'ignore, c'est bien là le problème.",
                "Je sais qu'une partie a quitté l'université pour rentrer",
                "chez eux, par peur de quelque-chose."
            ],
            "Quelle est cette école ?": () => [
                "C'est une université privée, financée par quelques bienfaiteurs qui",
                "s'intéressent à certains domaines, disons... oubliés par la science",
                "moderne: astrologie, mentalisme, alchimie, médecine alternative...",
                "Rien de sorcier, mais nous gardons un esprit assez ouvert."
            ]
        },
        "Il semblerait que Therled ait mené quelques expériences extrascolaires",
        "plutôt douteuses. Je le suspecte de fabriquer en secret des psychotropes",
        "et de les avoir utilisés sur d'autres étudiants.",
        {
            "Un dealer ?": () => [
                "Mes étudiants ne sont pas des camés!",
                "Ils ne sont pas stupides au point de céder à des addictions chimiques.",
                "Il doit y avoir des effets secondaires qui les intéressent..."
            ],
            "Des psychoquoi ?": () => [
                "Des drogues, si vous préférez...",
                "Nous expérimentons certains composés chimiques à l'université",
                "pour nos recherches. Therled peut accéder librement au",
                "laboratoire, cela faisait partie de ses travaux."
            ]
        },
        "Quoiqu'il en soit, il complote quelque-chose, et des étudiants",
        "manquent à l'appel. J'ai reçu des témoignages selon lesquels des",
        "étudiants auraient été aperçus près de la forêt derrière l'université.",
        "Il n'y a rien là-bas, à part des ruines d'un ancien sanctuaire païen",
        "qui attirent quelques illuminés de temps en temps.",
        {

            "Je vais aller y enquêter": () => [
                "Merci, et faites bien attention."
            ]
        }
    ]
}


function franckRappel1(save) {
    return [
        "Avez vous réussi à stopper Therled ?",
        {
            "Oui": () => "Menteur !",
            "C'était quoi déjà?": () => ["Vous allez dans ma réserve,", "prendre la drogue Liao etc..."],
            "Je m'en fous": () => ["Comment ça tu t'en fous ?", "Mais il faut bien tester les dialogues !"]
        },
    ]
}

function franckTindalos(save) {
    return [
        "Tindalos ? Ça ne peut pas être vrai...",
        {
            "Expliquez moi": () => [
                "Oui pardon, j'étais dans mes pensées...",
                "Je vais tout vous expliquer."
            ],
            "Et pourtant...": () => [
                "Oui, c'est bien l'écriture de Therled.",
                "Laissez-moi vous expliquer."
            ]
        },
        "Therled était jadis assistant au laboratoire d'astronomie. Il travaillait sur",
        "les lunettes de télescope, mais aussi sur l'oeil humain.",
        "D'après ses dires, il aurait perçu au delà des étoiles qu'il observait dans le",
        "cadre de ses études, les clés permettant de déchiffrer l'un des parchemins",
        "inintelligibles enfouis dans les réserves de la bibliothèque.",
        "On l'a pris pour un fou, mais sa methode de traduction s'est avérée exacte.",
        "Le parchemin parlait de l'espace et du temps, et de légendes autour de",
        "chiens démoniaques qui traqueraient quiconque se risquerait à vouloir",
        "fuir l'espace ou le temps... On les appelle les chiens de Tindalos.",
        {
            "Assez de bêtises": () => [
                "Ces démons proviennent sans aucun doute de l'imagination de fanatiques.",
            ],
            "Ils existent ?": () => [
                "Pour ceux qui y croient, sans aucun doute."
            ]
        },
        "Dans les temps anciens, certains prêtres consommaient une drogue, le Liao,",
        "qui donnait l'impression de quitter l'espace et le temps. Bien des hommes",
        "furent envoutés par les charmes de la connaissance offerts par le Liao...",
        "Mais combien aujourd'hui peuvent se vanter d'avoir admiré les angles du",
        "temps et de l'espace, sans avoir complètement perdu la tête ?",
        {
            "Et Therled ?": () => [
                "Therled est devenu assoiffé de connaissance depuis la traduction du parchemin.",
                "Il a commencé à expérimenter avec le Liao au laboratoire."
            ],
            "Liao...": () => [
                "Oui, vous l'avez deviné, c'est le psychotrope que je suspecte Therled d'avoir",
                "utilisé sur d'autres étudiants."
            ]
        },
        "S'il espère voir un chien de Tindalos, cet inconscient sous-estime les risques",
        "de sa folie. Je veux que vous l'arrêter avant qu'il ne soit trop tard."
    ]

}
