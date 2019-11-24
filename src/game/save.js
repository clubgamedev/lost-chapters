import { Inventory } from "./utils/inventory";

export function loadSave() {
    if (localStorage.getItem("save") != null) {
        game.save = JSON.parse(localStorage.getItem("save"));
    } else newGame();
}

export function save() {
    game.save.level = game.level.name;
    game.save.playerPosition = {
        x: game.player.position.x,
        y: game.player.position.y
    };
    game.save.playerState = game.player.state;
    localStorage.setItem("save", JSON.stringify(game.save));
}

export function newGame() {
    game.save = {
        inventory: new Inventory(),
        level: null,
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
        unlockedExits: [],
        selectedItem: undefined
    }
}