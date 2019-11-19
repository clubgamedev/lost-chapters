import {readDescription} from "../dialogs/descriptions";

export class Inventory{

    selectedItem;

    items;

    constructor(){
        this.items = {
            potionDeForce: {
                nombre:2,
                actif:false
            },
            potionDeProtection: {
                nombre:1,
                actif:false
            },
            potionDeLucidite: {
                nombre:1,
                actif:false
            },
            fioleDeSang: {
                nombre:1,
                actif:false
            },
            parchemin: {
                nombre:0
            },
            cape: {
                nombre:1
            },
        };
    }
}

export function drinkPotion(textsToDisplay) {
    if(textsToDisplay.length > 0) {
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
            .to({y: drinkPotionText.position.y - 20, alpha: 0.1}, 2000, Phaser.Easing.Linear.None)
            .start();

        tween.onComplete.add(() => {
            drinkPotionText.destroy();
            textsToDisplay.shift();
            drinkPotion(textsToDisplay);
        }, this)
    }
}

export function activeItemSelection() {
    game.controls.TAB.onPress(() => deactiveItemSelection(),game.save.inventory, true);
    game.controls.LEFT.onPress(() => selectPreviousItem(),game.save.inventory);
    game.controls.RIGHT.onPress(() => selectNextItem(),game.save.inventory);
    game.controls.ACTION.onPress(() => useItem(),game.save.inventory);
    selectFirstItem();
}

export function selectPreviousItem() {
    let {indexSelected, objectsInInventory} = getIndexOfSelectedItem();
    if (objectsInInventory[indexSelected + 1]) {
        game.save.inventory.selectedItem = objectsInInventory[indexSelected + 1][0];
    }
}

export function selectNextItem() {
    let {indexSelected, objectsInInventory} = getIndexOfSelectedItem();
    if (objectsInInventory[indexSelected - 1]) {
        objectsInInventory[indexSelected][1].selected = false;
        game.save.inventory.selectedItem = objectsInInventory[indexSelected - 1][0];
    }
}

export function getInventoryEntries() {
    return Object.entries(game.save.inventory.items)
        .reverse()
        .filter(([elemName, elem]) => elem.nombre > 0);
}

export function getIndexOfSelectedItem() {
    let indexSelected;
    let objectsInInventory = getInventoryEntries();
    objectsInInventory.forEach(([elemName, elem], index) => {
        if (elemName === game.save.inventory.selectedItem) {
            indexSelected = index;
        }
    });
    return {indexSelected, objectsInInventory};
}

export function useItem() {
    let {indexSelected, objectsInInventory} = getIndexOfSelectedItem();
    readDescription(objectsInInventory[indexSelected][0]);
    deactiveItemSelection();
}

export function selectFirstItem() {
    let itemsInInventory = Object.entries(game.save.inventory.items)
        .reverse()
        .filter(([elemName, elem]) => elem.nombre > 0);
    if (itemsInInventory && itemsInInventory.length > 0) {
        game.save.inventory.selectedItem = itemsInInventory[0][0];
    }
}

export function deactiveItemSelection() {
    game.controls.RIGHT.resetEvents()
    game.controls.LEFT.resetEvents()
    game.controls.ACTION.resetEvents()
    game.controls.TAB.resetEvents()

    game.controls.TAB.onPress(() => activeItemSelection(), game.save.inventory, true);
    Object.entries(game.save.inventory.items)
        .reverse()
        .filter(([itemName, itemObject]) => {
            return itemObject.nombre > 0
        })
        .forEach(([itemName, itemObject], i) => itemObject.selected = false);
    game.save.inventory.selectedItem = undefined;
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

export function drawInventory(inventory) {
    Object.entries(game.save.inventory.items)
        .reverse()
        .filter(([itemName, itemObject]) => {
            return itemObject.nombre > 0
        })
        .forEach(([itemName, itemObject], i) => {

            if (itemName === game.save.inventory.selectedItem) {
                //first create the border
                let sillhouetteBMD = createSillhouette(itemName);
                sillhouetteBMD.width = 16;
                sillhouetteBMD.height = 16;
                let border = game.add.sprite(game.width - 16 * (i + 1), 1, sillhouetteBMD);
                border.scale.setTo(1.12);
                border.anchor.setTo(0.02);
                border.tint=0xBF0000;
                border.fixedToCamera = true;
                game.groups.hud.add(border);

                let selectionItem = game.add.text(game.width - 16 * (i + 1) + 5, 15, "^", {
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
            let itemSprite = game.add.sprite(game.width - 16 * (i + 1), 1, itemName);
            itemSprite.fixedToCamera = true;
            itemSprite.width = 16
            itemSprite.height = 16
            itemSprite.alpha = 0.75;
            game.groups.hud.add(itemSprite)

            if (itemObject.nombre > 1) {
                let quantitySprite = game.add.text(game.width - 16 * (i + 1) + 10, 10, itemObject.nombre, {
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

export function parcheminUnlock() {
    game.save.inventory.items.parchemin.nombre = 1;
}