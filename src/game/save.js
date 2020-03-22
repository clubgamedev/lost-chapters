import { Inventory } from "./utils/inventory";

const SAVE_KEY = "lostchapters_save"

export function loadSave() {
    resetSaveToNewGame();
    if (localStorage.getItem(SAVE_KEY) != null) {
        Object.assign(game.save, JSON.parse(localStorage.getItem(SAVE_KEY)));
    }
    game.save.lucidity = Math.max(3, game.save.lucidity); // min 3 hp in case loading save on a monster
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
            recetteAntidote: false,
            cireBougieNoire: false,
            racineHellebore: false,
            sangLibellule: false,
            oeufDeCorbeau: false,
            epineDePoissonDiable: false,
            vieilleGnole: false,
            foieDeCerf: false,
            alcoolPsylocibe: false,
            plumeDeGeai: false
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
        lucidity: 16,
        gameOver: null
    }
}