import { exhaustDialog } from "@/game/utils/dialog"

export function franck(save) {
    if (!save.hasMetFranck) return franckMeeting(save)
    else if (save.hasDiscoveredTindalos && !save.hasFranckTalkedAboutTindalos) return franckTindalos(save)
    else return franckRappel(save);
}


function franckMeeting(save) {
    save.hasMetFranck = true;
    return [
        "Ah, vous voilà !",
        "Je suis si content de voir votre visage, mon jeune ami.",
        "J'ai besoin de vos talents d'enquêteur pour comprendre ce qui se passe ici.",
        "Vous devez retrouver l'un de mes apprentis, Therled.",
        exhaustDialog({
            "Therled ?": () => [
                "Oui, mon élève le plus brillant. Il est très respecté ici,",
                "peut-être dans un sens où je ne l'avais pas imaginé..."
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
        }, "Qu'y a-t-il ?"),
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
                "pour nos recherches. Therled peut accéder librement au laboratoire,",
                "cela faisait partie de ses travaux..."
            ]
        },
        "Quoiqu'il en soit, il complote quelque-chose, et des étudiants",
        "manquent à l'appel. J'ai reçu des témoignages selon lesquels des",
        "étudiants auraient été aperçus près de la forêt derrière l'Université.",
        "J'espère que les dévots n'ont rien à voir là dedans...",
        rappelQuestions(),
        "Merci mon ami, et faites bien attention."
    ]
}

function franckRappel(save) {
    return [
        "Vous devez faire vite, mon ami.",
        {
            "Rappelez-moi...": () => rappelQuestions(save),
            "Comptez sur moi": () => []
        }
    ]
}

function franckTindalos(save) {
    save.hasFranckTalkedAboutTindalos = true;
    return [
        "Tindalos ? Ça ne peut pas être vrai...",
        {
            "Expliquez moi": () => [
                "Oui pardon, j'étais perdu dans mes pensées...",
                "Je vais tout vous expliquer."
            ],
            "Et pourtant...": () => [
                "Oui, c'est bien l'écriture de Therled.",
                "Laissez-moi vous expliquer."
            ]
        },
        "Therled était jadis assistant au laboratoire d'astronomie. Il travaillait",
        "sur les lunettes de télescope, mais aussi sur l'oeil humain.",
        "D'après ses dires, il aurait perçu au delà des étoiles qu'il observait",
        "les clés permettant de déchiffrer un des parchemins inintelligibles",
        "enfouis dans les réserves de la bibliothèque. On l'a pris pour",
        "un fou, mais sa methode de traduction s'est avérée exacte.",
        "Le parchemin parlait de l'espace et du temps, et de légendes autour de",
        "chiens démoniaques qui traquent quiconque se risquerait à vouloir",
        "fuir l'espace ou le temps... On les appelle les chiens de Tindalos.",
        {
            "Assez de bêtises": () => [
                "C'est sans aucun doute l'imagination de fanatiques.",
            ],
            "Ils existent ?": () => [
                "Pour tous ceux qui veulent bien y croire, bien sûr."
            ]
        },
        "Jadis, certains prêtres consommaient une drogue, le Liao, qui donnait",
        "l'impression de quitter l'espace et le temps. Bien des hommes furent",
        "envoutés par les charmes de la connaissance offerte par le Liao...",
        "Mais combien aujourd'hui peuvent se vanter d'avoir admiré les angles du",
        "temps et de l'espace, sans avoir complètement perdu la tête ?",
        {
            "Et Therled ?": () => [
                "Therled est devenu assoiffé de connaissance depuis la traduction du",
                "parchemin. Il a fait des expériences avec le Liao au laboratoire."
            ],
            "Liao...": () => [
                "Oui, vous l'avez deviné, c'est le psychotrope que je suspecte Therled",
                "d'avoir utilisé sur d'autres étudiants."
            ]
        },
        "S'il espère voir un chien de Tindalos, cet inconscient a sombré dans",
        "la folie. Je veux que vous l'arrêter avant qu'il ne soit trop tard."
    ]

}


const rappelQuestions = (save) => {
    const questions = {
        "La forêt ?": () => [
            "Oui, la forêt à l'Est en sortant de l'Université.",
            "Il n'y a rien là-bas, à part des ruines d'un ancien sanctuaire païen",
            "qui attirent quelques illuminés de temps en temps.",
        ],
        "Des témoignages ?": () => [
            "Il reste quelques élèves dans l'Université.",
            "Libre à vous de les interroger vous-même."
        ],
        "Les dévots ?": () => [
            "Des religieux qui ont un camp à l'orée du bois.",
            "Ils se disent membres de l'Eglise, mais cela a tout l'air d'une secte.",
            "Leur représentant est un vieil homme qu'ils appellent Père Arthur.",
            "Il voit d'un très mauvais oeil l'Université, qu'il accuse",
            "de pervertir les esprits. Un comble, vous ne trouvez pas ?"
        ],
    }

    if (save.hasFranckTalkedAboutTindalos) {
        questions["Un quoi de Tindalos ?"] = () => [
            `Un chien de Tindalos, une entité démoniaque qui traquerait`,
            `quiconque se risquerait à vouloir fuir l'espace ou le temps...`,
            `Therled doit vouloir invoquer un de ces monstres imaginaires.`,
            `J'ignore comment il compte s'y prendre mais ça a l'air dangereux`,
            `et cela a sûrement un lien avec les disparitions des élèves.`,
            `Vous devez le trouver et l'arrêter, Howard.`
        ]
    }

    const ramsey = [
        `C'est un de nos professeurs qui vit en ermite dans la forêt.`,
        `Ramsey est un drôle d'hurluberlu, mais c'est un mycologue et`,
        `phytothérapeute de génie. De plus, il connait la forêt comme sa poche.`,
        `Vous connaissez peut-être son père, Herbert, le célèbre neurologue`,
        `qui était un des fondateurs de l'université.`
    ]

    if (save.hasDiscoveredTerrier) {
        questions["Le terrier ?"] = () => {
            save.hasFranckTalkedAboutRamsey = true;
            return [
                `"Rendez-vous au terrier" vous dites ?`,
                `Ce nom me dit quelque-chose, je crois qu'il s'agit d'un endroit`,
                `caché dans la forêt. Ramsey doit pouvoir vous en dire plus.`,
                ...ramsey
            ]
        }
    }

    if (save.hasFranckTalkedAboutRamsey) {
        questions["Ramsey ?"] = () => ramsey
    }

    return exhaustDialog(questions, "Je vais y enquêter")
}