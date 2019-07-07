import { Potion } from "./Potion";

export const allPotions = [
    new Potion("Psycho-stimulant", "potionDeForce", [
        "cireBougieNoir",
        "crochetsDeSerpent",
        "ecorceDeBouleau"
    ]),
    new Potion("Tranquilisant", "potionDeLucidite", [
        "oeufDeCorbeau",
        "epineDePoissonDiable",
        "vieilleGnole"
    ]),
    new Potion("Potion du dévot", "potionDeProtection", [
        "foieDeCerf",
        "jusDeSauterelle",
        "plumeDeCorneille"
    ]),
    new Potion("Fiole de sang", "fioleDeSang", [
        "crochetsDeSerpent",
        "foieDeCerf",
        "jusDeSauterelle"
    ])
];