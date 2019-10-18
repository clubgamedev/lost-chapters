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
                nombre:1
            },
            cape: {
                nombre:1
            },
        };
    }

    activeItemSelection() {
        game.controls.TAB.onPress(() => this.deactiveItemSelection(),this, true);
        game.controls.LEFT.onPress(() => this.selectPreviousItem(),this);
        game.controls.RIGHT.onPress(() => this.selectNextItem(),this);
        game.controls.ACTION.onPress(() => this.useItem(),this);
        this.selectFirstItem();
    }

    selectPreviousItem() {
        let {indexSelected, objectsInInventory} = this.getIndexOfSelectedItem();
        if (objectsInInventory[indexSelected + 1]) {
            this.selectedItem = objectsInInventory[indexSelected + 1][0];
        }
    }

    selectNextItem() {
        let {indexSelected, objectsInInventory} = this.getIndexOfSelectedItem();
        if (objectsInInventory[indexSelected - 1]) {
            objectsInInventory[indexSelected][1].selected = false;
            this.selectedItem = objectsInInventory[indexSelected - 1][0];
        }
    }

    getInventoryEntries() {
        return Object.entries(this.items)
            .reverse()
            .filter(([elemName, elem]) => elem.nombre > 0);
    }

    getIndexOfSelectedItem() {
        let indexSelected;
        let objectsInInventory = this.getInventoryEntries();
        objectsInInventory.forEach(([elemName, elem], index) => {
            if (elemName === this.selectedItem) {
                indexSelected = index;
            }
        });
        return {indexSelected, objectsInInventory};
    }

    useItem() {
        let {indexSelected, objectsInInventory} = this.getIndexOfSelectedItem();
        readDescription(objectsInInventory[indexSelected][0]);
        this.deactiveItemSelection();
    }

    selectFirstItem() {
        let itemsInInventory = Object.entries(this.items)
            .reverse()
            .filter(([elemName, elem]) => elem.nombre > 0);
        if (itemsInInventory && itemsInInventory.length > 0) {
            this.selectedItem = itemsInInventory[0][0];
        }
    }

    deactiveItemSelection() {
        game.controls.RIGHT.resetEvents()
        game.controls.LEFT.resetEvents()
        game.controls.ACTION.resetEvents()
        game.controls.TAB.resetEvents()

        game.controls.TAB.onPress(() => this.activeItemSelection(), this, true);
        Object.entries(this.items)
            .reverse()
            .filter(([itemName, itemObject]) => {
                return itemObject.nombre > 0
            })
            .forEach(([itemName, itemObject], i) => itemObject.selected = false);
        this.selectedItem = undefined;
    }

    createSillhouette(srcKey) {
        var bmd = game.make.bitmapData()
        // load our texture into the bitmap
        bmd.load(srcKey)
        bmd.processPixelRGB(this.forEachPixel, this)
        return bmd
    }

    forEachPixel(pixel) {
        // processPixelRGB won't take an argument, so we've set our sillhouetteColor globally
        pixel.r = 255;
        pixel.g = 255;
        pixel.b = 255;
        return pixel
    }

    drawInventory() {
        Object.entries(this.items)
            .reverse()
            .filter(([itemName, itemObject]) => {
                return itemObject.nombre > 0
            })
            .forEach(([itemName, itemObject], i) => {

                if (itemName === this.selectedItem) {
                    //first create the border
                    let sillhouetteBMD = this.createSillhouette(itemName);
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


}