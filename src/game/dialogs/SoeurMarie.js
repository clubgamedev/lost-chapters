import { exhaustDialog, talkToMyself, startDialog } from "@/game/utils/dialog"

export function marie(save) {
    if (!save.hasMetMarie) return marieMeeting(save)
    else return marieRappel(save);
}

function marieMeeting(save) {
    save.hasMetMarie = true;
    return [
        `Vous venez de l'Université n'est-ce pas ?`,
        `Je n'ai pas le droit de parler aux élèves.`,
        {
            "Pourquoi ça ?": () => [
                `Les universitaires posent des questions interdites !`,
                `Ils veulent découvrir ce qui doit rester secret.`
            ],
            "Je suis inspecteur": () => [
                `Inspecteur ? Vous aussi vous voulez fouiller dans les écrits interdits ?`,
                `Vous n'avez pas le droit !`
            ]
        },
        {
            "Parler de Therled": () => [
                `Vous cherchez un étudiant ?`
            ],
            "Les élèves disparus": () => [
                `Je ne sais pas de quels élèves vous voulez parler.`,
            ]
        },
        `On en voit passer beaucoup dans la forêt ces temps-ci.`,
        `Ils empiètent même sur nos lieux de culte !`,
        {
            "Quel culte ?": () => [
                `Notre Ordre. Nous n'en parlons pas aux étrangers.`,
                `Père Arthur nous l'a interdit. Il a déjà fait l'erreur de parler aux`,
                `universitaires, et ils l'ont trahi en volant ses secrets.`
            ]
        },
        exhaustDialog({
            "Père Arthur ?": () => [
                `C'est le chef de notre Ordre.`,
                `S'il me voit vous parler, je serais punie !`
            ],
            "Et vous êtes ?": () => [
                `Je suis Soeur Marie.`,
                `Je veille sur le sanctuaire.`
            ],
            "Que faites-vous ici ?": () => [
                `J'entretiens le sanctuaire, et j'étudie les écrits de l'autel.`,
                `Père Arthur m'a aussi demandé de surveiller les élèves.`
            ]
        }, "Merci. J'en sais assez."),
        `Laissez-moi alors.`,
        `Si vous cherchez des élèves disparus, allez dans la forêt.`,
        `Il y en a plein qui rôdent comme des voleurs !`
    ]
}

function marieRappel(save) {
    if (save.hasFalsifiedScroll) {
        return [
            `Pas de temps à perdre !`,
            `Trouvez Therled et faites échouer le rituel !`
        ]
    }
    const choices = Object.assign({},
        save.inventory.items.parchemin.nombre > 0 && {
            "Montrer le parchemin": () => marieParchemin(save)
        }, {
        "J'ai une question...": () => rappelQuestions(save),
        "Je vous laisse": () => []
    });

    return [
        `Je ne suis pas censée vous parler !`,
        choices
    ]
}

function rappelQuestions(save) {

    const questions = {
        "Les élèves": () => [
            `Si vous cherchez des élèves disparus, allez dans la forêt.`
        ],
        "Votre Ordre": () => [
            "Nous n'en parlons pas aux étrangers. N'insistez pas !"
        ]
    }

    if (save.hasDiscoveredTerrier) {
        questions["Le Terrier ?"] = () => [
            `J'ai entendu des étudiants parler de ce "Terrier".`,
            `Je ne sais pas où c'est, mais ils sont toujours en train de fouiller dans`,
            `les ruines interdites ! Père Arthur est furieux après eux.`
        ]
    }

    return exhaustDialog(questions, "Merci pour votre aide.")
}

function marieParchemin(save) {
    return [
        `Où avez-vous trouvé ça !? C'est un écrit interdit !`,
        `Brûlez-le tout de suite !`,
        {
            "C'est une copie": () => [
                `Il est interdit de recopier les runes ! Vous ne respectez donc rien...`,
                `Où est l'original ?`
            ],
            "Ce n'est pas à moi": () => [
                `Où l'avez-vous trouvé alors ?`
            ]
        },
        {
            "C'est Therled...": () => [
                `Encore lui ! Ça doit être lui qui posait toutes ces questions au père.`,
                `Et vous dites qu'il en a fait des copies ? C'est terrible !`
            ]
        },
        {
            "Pouvez-vous le lire ?": () => [
                `C'est un rituel interdit. Je ne dois surtout pas le lire !`,
                `Il doit être détruit ainsi que l'original.`
            ]
        },
        exhaustDialog({
            "Therled a l'original": () => [
                `Alors il faut le récupérer ! S'il accomplit le rituel,`,
                `il pourrait causer un grand malheur...`
            ],
            "S'il y a d'autres copies ?": () => [
                `Nous n'avons pas le choix, il faut toutes les trouver et les détruire !`
            ],
            "Le temps presse !": () => [
                `Oui, vous avez raison... le parchemin mentionne un ciel de sang,`,
                `et la lune est rouge ce soir...`
            ]
        }, "Il y a un autre moyen ?"),
        "Eh bien, je vois bien un autre moyen...",
        "Je pourrais falsifier le parchemin, changer quelques runes pour saboter",
        "le rituel. Ainsi, il deviendrait inoffensif. J'ai assez étudié les runes",
        "pour ça, mais Père Arthur nous a interdit de tracer les runes.",
        {
            "La convaincre": () => [
                `Oui, c'est notre meilleure chance...`,
                `On ne peut pas prendre le risque que Therled ait d'autres copies.`,
                `Le rituel doit échouer !`
            ]
        },
        {
            "Donner le parchemin": () => {
                return talkToMyself([
                    `Soeur Marie modifie précautionneusement des glyphes`,
                    `sur le parchemin. Ses mains tremblent, et elle s'y reprend`,
                    `à plusieurs fois avant de poser la plume.`
                ]).then(() => {
                    save.hasFalsifiedScroll = true;
                    return startDialog([
                        `Voilà, c'est fait.`,
                        `Si vous parvenez à substituer le parchemin avec l'original,`,
                        `le rituel échouera pour de bon.`
                    ], { speaker: "marie" })
                })
            }
        },
        `Allez trouver votre Therled maintenant !`,
        `Moi, je dois avertir le père Arthur de tout ceci.`
    ]
}