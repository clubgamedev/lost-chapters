import { allPotions } from "./potions";
import { sounds } from "../../../audio"

export class BookRecipes {

    constructor(group) {
        this.isOpened = false;
        this.group = group;

        this.commandText = game.add.text(10, 10, "", {
            font: "24px Alagard",
            fill: "#E5E5E5",
            //boundsAlignH: "center",
            //boundsAlignV: "middle",
            align: "center"
        });
        group.add(this.commandText);
        this.updateCommands();
        this.bookContent = [];
    }

    updateCommands() {
        this.commandText.text = this.isOpened ? "Fermer (Action)" : "Recettes (Action)";
        this.commandText.bringToTop();
    }

    open() {
        this.isOpened = true;
        sounds.OPEN_BOOK.play();
        this.drawBook();
        this.updateCommands();
    }

    close() {
        this.isOpened = false;
        sounds.CLOSE_BOOK.play();
        this.bookContent.forEach(sprite => sprite.destroy());
        this.updateCommands();
    }

    openOrClose() {
        this.isOpened ? this.close() : this.open();
    }

    drawBook() {
        this.bookContent = [];
        const book = game.add.image(5, 5, 'book-bg');
        book.width = (game.height - 20) * 186 / 140;
        book.height = game.height - 20;
        book.x = game.width / 2 - book.width / 2;
        book.tint = 0xC1C1C1;
        this.group.add(book);
        this.bookContent.push(book);

        allPotions.forEach((potion, index) => {
            let x = 360 + 450 * Math.floor(index / 2),
                y = 120 + 300 * (index % 2);

            let textPotion = game.add.text(x - 25, y - 10, potion.displayName, {
                font: "30px Alagard",
                fill: "#333"
            });
            this.group.add(textPotion)

            let potionSprite = this.group.create(x - 120, y - 30, potion.name);
            potionSprite.scale.setTo(1.75);

            let ingredient1 = this.group.create(x - 100, y + 50, potion.ingredients[0]);
            ingredient1.scale.setTo(1.75);
            let ingredient2 = this.group.create(x, y + 50, potion.ingredients[1]);
            ingredient2.scale.setTo(1.75);
            let ingredient3 = this.group.create(x + 100, y + 50, potion.ingredients[2]);
            ingredient3.scale.setTo(1.75);

            this.bookContent.push(ingredient1, ingredient2, ingredient3, potionSprite, textPotion);
        })
    }
}