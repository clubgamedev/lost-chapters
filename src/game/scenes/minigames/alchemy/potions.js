import {Potion} from "./Potion";

export const allPotions = [
    new Potion("Potion de force", "potionDeForce",[
        "cireBougieNoir",
        "crochetsDeSerpent",
        "cuirDeBumslangWikiputer"
    ]),
    new Potion("Potion de lucidité", "potionDeLucidite",[
        "oeufDeDragon",
        "epineDePoissonDiable",
        "herbicide"
    ]),
    new Potion("Potion de protection", "potionDeProtection",[
        "foieDeDragon",
        "jusDeSauterelle",
        "plumeJobarbille"
    ]),
    new Potion("Fiole de sang", "fioleDeSang",[
        "crochetsDeSerpent",
        "foieDeDragon",
        "jusDeSauterelle"
    ])
];