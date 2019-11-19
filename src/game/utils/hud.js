import {drawInventory} from "./inventory";

export function updateHud() {
    game.groups.hud.removeAll(true);
    drawLucidityBar()
    drawInventory();
}

export function drawLucidityBar() {
    let lucidityBar = game.add.sprite(10, 5, "lucidity-bar");
    lucidityBar.fixedToCamera = true
    lucidityBar.alpha = 0.75;
    lucidityBar.frame = 16 - game.player.lucidity;
    game.groups.hud.add(lucidityBar);
}


