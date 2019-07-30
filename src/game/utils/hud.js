
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

export function drawInventory() {

    Object.entries(game.save.inventory)
        .reverse()
        .filter(([item, quantity]) => quantity > 0)
        .forEach(([item, quantity], i) => {

            let itemSprite = game.add.sprite(game.width - 16 * (i + 1), 1, item)
            itemSprite.fixedToCamera = true;
            itemSprite.width = 16
            itemSprite.height = 16
            itemSprite.alpha = 0.75;
            game.groups.hud.add(itemSprite)

            if (quantity > 1) {
                let quantitySprite = game.add.text(game.width - 16 * (i + 1) + 10, 10, quantity, {
                    font: "8px Arial",
                    fill: "white",
                    boundsAlignH: "right",
                    boundsAlignV: "top"
                })
                quantitySprite.fixedToCamera = true;
                quantitySprite.alpha = 0.8;
                quantitySprite.stroke = '#000000';
                quantitySprite.strokeThickness = 2;

                game.groups.hud.add(quantitySprite)
            }
        })

}
