import { readDescription } from "../dialogs/descriptions";

export class Inventory {
    constructor() {
        this.items = {
            potionDeForce: {
                nombre: 0,
                actif: false
            },
            potionDeProtection: {
                nombre: 0,
                actif: false
            },
            potionDeLucidite: {
                nombre: 0,
                actif: false
            },
            fioleDeSang: {
                nombre: 0,
                actif: false
            },
            parchemin: {
                nombre: 0
            },
            parcheminFalsifie: {
                nombre: 0
            },
            cape: {
                nombre: 0
            },
        };
    }
}

export function drinkPotion(textsToDisplay) {
    if (textsToDisplay.length > 0) {
        let drinkPotionText = game.add.text(game.player.position.x, game.player.position.y - 20, textsToDisplay[0], {
            font: "8px Arial",
            fill: "white",
            boundsAlignH: "right",
            boundsAlignV: "top"
        });
        //drinkPotionText.visible = false;
        drinkPotionText.alpha = 0.8;
        drinkPotionText.stroke = '#000000';
        drinkPotionText.strokeThickness = 2;
        drinkPotionText.position.x = game.player.position.x - drinkPotionText.width / 2;
        //drinkPotionText.fixedToCamera = true;
        console.log(drinkPotionText.position.x);
        //drinkPotionText.visible = true;
        let tween = game.add.tween(drinkPotionText)
            .to({ y: drinkPotionText.position.y - 20, alpha: 0.1 }, 2000, Phaser.Easing.Linear.None)
            .start();

        tween.onComplete.add(() => {
            drinkPotionText.destroy();
            textsToDisplay.shift();
            drinkPotion(textsToDisplay);
        }, this)
    }
}

export function getItemsFound() {
    return Object.entries(game.save.inventory.items)
        .map(([itemName, itemProps]) => ({ ...itemProps, name: itemName }))
        .reverse()
        .filter(item => item.nombre > 0)
}

export function toggleItemSelection() {
    let itemsInInventory = getItemsFound();
    if (itemsInInventory.length > 0 && !game.dialog && !game.book && !game.page) {
        if (game.selectedItem != null) {
            game.selectedItem = null // deactivate item selection
            game.controls.LEFT.resetEvents();
            game.controls.RIGHT.resetEvents();
        } else {
            game.selectedItem = itemsInInventory.length - 1; // activate item selection
            game.controls.LEFT.onPress(() => selectNextItem(-1))
            game.controls.RIGHT.onPress(() => selectNextItem(+1))
        }
    }
}

export function selectNextItem(step = +1) {
    let itemsFound = getItemsFound();
    game.selectedItem = (game.selectedItem + step + itemsFound.length) % itemsFound.length;
}


export function describeSelectedItem() {
    let selectedItem = getItemsFound()[game.selectedItem];
    readDescription(selectedItem.name);
}

export function createSillhouette(srcKey) {
    var bmd = game.make.bitmapData()
    // load our texture into the bitmap
    bmd.load(srcKey)
    bmd.processPixelRGB(forEachPixel, game.save.inventory)
    return bmd
}

export function forEachPixel(pixel) {
    // processPixelRGB won't take an argument, so we've set our sillhouetteColor globally
    pixel.r = 255;
    pixel.g = 255;
    pixel.b = 255;
    return pixel
}

export function drawInventory() {
    getItemsFound().forEach((item, i) => {
        if (i === game.selectedItem) {
            let sillhouetteBMD = createSillhouette(item.name);
            sillhouetteBMD.width = 16;
            sillhouetteBMD.height = 16;
            let border = game.add.sprite(game.width - 16 * (i + 1), 1, sillhouetteBMD);
            border.scale.setTo(1.12);
            border.anchor.setTo(0.02);
            border.tint = 0xBF0000;
            border.fixedToCamera = true;
            game.groups.hud.add(border);

            let selectionItem = game.add.text(game.width - 16 * (i + 1) + 3, 15, "^", {
                font: "12px Alagard",
                fill: "red",
                boundsAlignH: "left",
                boundsAlignV: "bottom"
            });
            selectionItem.fixedToCamera = true;
            selectionItem.stroke = '#000000';
            selectionItem.strokeThickness = 2;
            game.groups.hud.add(selectionItem);
        }

        let itemSprite = game.add.sprite(game.width - 16 * (i + 1), 1, item.name);
        itemSprite.fixedToCamera = true;
        itemSprite.width = 16
        itemSprite.height = 16
        itemSprite.alpha = 0.75;
        game.groups.hud.add(itemSprite)

        if (item.nombre > 1) {
            let quantitySprite = game.add.text(game.width - 16 * (i + 1) + 10, 10, item.nombre, {
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
