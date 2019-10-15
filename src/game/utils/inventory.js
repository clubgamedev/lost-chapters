import {readDescription} from "../dialogs/descriptions";

export class Inventory{

    constructor(){
        console.log("Inventory constructed")
    }

    activeItemSelection() {
        game.controls.TAB.onPress(() => this.deactiveItemSelection(),this, true);
        game.controls.LEFT.onPress(() => this.selectPreviousItem(),this);
        game.controls.RIGHT.onPress(() => this.selectNextItem(),this);
        game.controls.ACTION.onPress(() => this.useItem(),this);
        game.save.inventory.inventoryHighlight = true;
        this.selectFirstItem();
    }

    selectPreviousItem() {
        let {indexSelected, objectsInInventory} = this.getIndexOfSelectedItem();
        if (objectsInInventory[indexSelected + 1]) {
            game.save.selectedItem = objectsInInventory[indexSelected + 1][0];
        }
    }

    selectNextItem() {
        let {indexSelected, objectsInInventory} = this.getIndexOfSelectedItem();
        if (objectsInInventory[indexSelected - 1]) {
            objectsInInventory[indexSelected][1].selected = false;
            game.save.selectedItem = objectsInInventory[indexSelected - 1][0];
        }
    }

    getInventoryEntries() {
        return Object.entries(game.save.inventory)
            .reverse()
            .filter(([elemName, elem]) => elem.nombre > 0);
    }

    getIndexOfSelectedItem() {
        let indexSelected;
        let objectsInInventory = this.getInventoryEntries();
        objectsInInventory.forEach(([elemName, elem], index) => {
            if (elemName === game.save.selectedItem) {
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
        let itemsInInventory = Object.entries(game.save.inventory)
            .reverse()
            .filter(([elemName, elem]) => elem.nombre > 0);
        if (itemsInInventory && itemsInInventory.length > 0) {
            game.save.selectedItem = itemsInInventory[0][0];
        }
    }

    deactiveItemSelection() {
        game.controls.RIGHT.resetEvents()
        game.controls.LEFT.resetEvents()
        game.controls.ACTION.resetEvents()
        game.controls.TAB.resetEvents()

        game.controls.TAB.onPress(() => this.activeItemSelection(), this, true);
        Object.entries(game.save.inventory)
            .reverse()
            .filter(([itemName, itemObject]) => {
                return itemObject.nombre > 0
            })
            .forEach(([itemName, itemObject], i) => itemObject.selected = false);
        game.save.selectedItem = undefined;
    }

    drawInventory() {
        Object.entries(game.save.inventory)
            .reverse()
            .filter(([itemName, itemObject]) => {
                return itemObject.nombre > 0
            })
            .forEach(([itemName, itemObject], i) => {

                let itemSprite = game.add.sprite(game.width - 16 * (i + 1), 1, itemName)
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

                if (itemName === game.save.selectedItem) {
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
            })

    }


}