import { Inventory } from "./utils/inventory";

const SAVE_KEY = "lostchapters_save"

export function loadSave() {
    if (localStorage.getItem(SAVE_KEY) != null) {
        game.save = JSON.parse(localStorage.getItem(SAVE_KEY));
    }
}

export function save() {
    if (game.level) game.save.level = game.level.name;
    game.save.playerPosition = {
        x: game.player.position.x,
        y: game.player.position.y
    };
    game.save.playerState = game.player.state;
    localStorage.setItem(SAVE_KEY, JSON.stringify(game.save));
}

export function resetSaveToNewGame() {
    game.save = {
        inventory: new Inventory(),
        level: "school",
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