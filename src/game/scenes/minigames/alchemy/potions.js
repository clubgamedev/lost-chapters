import { Potion } from "./Potion";

export const allPotions = [
    new Potion("Psycho-stimulant", "potionDeForce", [
        "cireBougieNoir",
        "crochetsDeSerpent",
        "ecorceDeBouleau",
        ],
        ["Ce stimulant psychotique devrait me permettre d'avoir des réflexes" , "et une agilité plus performantes, ","cela pourrait être utile pour certaines épreuves."]),
    new Potion("Tranquilisant", "potionDeLucidite", [
        "oeufDeCorbeau",
        "epineDePoissonDiable",
        "vieilleGnole"
        ],
        ["Ce tranquilisant augmente sensiblement ma lucidité ","mais est-ce une bonne idée ?"]
    ),
    new Potion("Potion du dévot", "potionDeProtection", [
        "foieDeCerf",
        "jusDeSauterelle",
        "plumeDeCorneille"
        ],
        ["Le potion du dévot dégage un sentiment de sureté palpable,","si je souhaite être mieux protégé, je pourrais peut être la boire..."]
    ),
    new Potion("Fiole de sang", "fioleDeSang", [
        "crochetsDeSerpent",
        "foieDeCerf",
        "jusDeSauterelle"
        ],
        ["La fiole de sang est toujours aussi étrange ","et son odeur toujours aussi dérangeante...", "Mais je n'ai pas le choix..."]
    )
];