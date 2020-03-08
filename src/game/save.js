import { Inventory } from "./utils/inventory";

const SAVE_KEY = "lostchapters_save"

export function loadSave() {
    resetSaveToNewGame();
    if (localStorage.getItem(SAVE_KEY) != null) {
        Object.assign(game.save, JSON.parse(localStorage.getItem(SAVE_KEY)));
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
            plumeDeCorneille: false
        },
        canUseChaudron: false,
        hasReadIntro: false,
        hasMetFranck: false,
        hasMetRamsey: false,
        hasDiscoveredTindalos: false,
        hasDiscoveredAlphabet: false,
        hasDiscoveredSecretPassage: false,
        hasDiscoveredCodeEtabli: false,
        hasDiscoveredCapeRamsey: false,
        hasFalsifiedScroll: false,
        hasReadSecretHours: false,
        isNightTime: false,
        planquesFound: [],
        translationsFound: [],
        unlockedExits: [],
        unlockedHallucinations: [],
        enemiesDefeated: [],
        lucidity: 16
    }
}