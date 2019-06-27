import { levels } from "./levels";

export function loadSave() {
    if (localStorage.getItem("save") != null) {
        game.save = JSON.parse(localStorage.getItem("save"));
    } else newGame();
}

export function save() {
    game.save.playerPosition = {
        x: ((game.player.worldPosition.x - 8) / 16),
        y: ((game.player.worldPosition.y + 8) / 16)
    };
    game.save.playerState = game.player.state;
    localStorage.setItem("save", JSON.stringify(game.save));
}

export function newGame() {
    game.save = {
        level: "school",
        inventory: {
            "potionDeForce": 1,
            "potionDeProtection": 2,
            "potionDeLucidite": 3,
            "fioleDeSang": 1,
            "parchemin": 1,
            "cape": 1
        }
    }
    game.save.playerPosition = levels[game.save.level].startPosition;
    localStorage.setItem("save", JSON.stringify(game.save));
}