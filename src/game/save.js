export function loadSave() {
    if (localStorage.getItem("save") != null) {
        game.save = JSON.parse(localStorage.getItem("save"));
    } else newGame();
}

export function save() {
    game.save.playerPosition = {
        x: ((game.player.position.x - 8) / 16),
        y: ((game.player.position.y - 8) / 16)
    };
    game.save.playerState = game.player.state;
    localStorage.setItem("save", JSON.stringify(game.save));
}

export function newGame() {
    game.save = {
        level: "cave",
        inventory: {
            potionDeForce: {
                nombre:0,
                actif:false
            },
            potionDeProtection: {
                nombre:0,
                actif:false
            },
            potionDeLucidite: {
                nombre:0,
                actif:false
            },
            fioleDeSang: {
                nombre:0,
                actif:false
            },
            parchemin: {
                nombre:0
            },
            cape: {
                nombre:0
            },
        },
        loot: {
            recettePotionDeForce: false,
            recettePotionDeProtection: false,
            recettePotionDeLucidite: false,
            cireBougieNoir: false,
            crochetsDeSerpent: false,
            ecorceDeBouleau: false,
            oeufDeCorbeau: false,
            epineDePoissonDiable: false,
            vieilleGnole: false,
            foieDeCerf: false,
            jusDeSauterelle: false,
            plumeDeCorneille: false,
        },
        hasReadIntro: false,
        hasMetFranck: false,
        hasDiscoveredTindalos: false,
        hasDiscoveredAlphabet: false,
        hasDiscoveredSecretPassage: false,
        hasDiscoveredCodeEtabli: false,
        hasFalsifiedScroll: false,
        planquesFound: [],
        translationsFound: [],
        unlockedExits: []
    }
}