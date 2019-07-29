import { allPotions} from "./potions";

export class BookRecipes {

    bookRecipes;
    isOpened = false;
    thumbWidth;
    thumbHeight;
    originalX;

    thumbText;
    recipesList=[];


    constructor(){
        game.load.image("book-bg", "assets/ui/book.png");
    }

    create(x, y) {
        this.originalX = x;
        this.bookRecipes = game.add.image(x, y, 'book-bg');

        this.bookRecipes.width = this.bookRecipes.width / 2;
        this.bookRecipes.height = this.bookRecipes.height / 2;
        this.thumbHeight = this.bookRecipes.height;
        this.thumbWidth =this.bookRecipes.width;
        this.bookRecipes.tint = 0xC1C1C1;

        this.thumbText = game.add.text(0, 0, "Recettes\n(Tab)", {
            font: "40px Alagard",
            fill: "#E5E5E5",
            //boundsAlignH: "center",
            //boundsAlignV: "middle",
            align:"center"
        });
        //thumbText.setTextBounds(this.bookRecipes.x, this.bookRecipes.y, this.bookRecipes.width, this.bookRecipes.height);
        this.thumbText.x = Math.floor(this.bookRecipes.width / 4);
        this.thumbText.y = Math.floor(this.bookRecipes.height / 4);
        this.bookRecipes.addChild(this.thumbText);
    }

    open() {
        this.bookRecipes.children[0].x = 5;
        this.bookRecipes.children[0].y = 5;
        this.bookRecipes.children[0].scale.setTo(0.1,0.1);
        this.bookRecipes.children[0].text = "Fermer\n(Tab)";

        this.bookRecipes.width = this.thumbWidth * (game.height / this.bookRecipes.height);
        this.bookRecipes.height = game.height - this.bookRecipes.y;
        this.bookRecipes.x = game.width / 2 - this.bookRecipes.width / 2;
        this.bookRecipes.bringToTop();
        this.isOpened = true;

        this.displayPotionsList();
    }

    close() {
        this.bookRecipes.width = this.thumbWidth;
        this.bookRecipes.height = this.thumbHeight;
        this.bookRecipes.x = this.originalX;
        this.isOpened = false;

        this.hidePotionsList();

        this.bookRecipes.children[0].x = Math.floor(this.bookRecipes.width / 4);
        this.bookRecipes.children[0].y = Math.floor(this.bookRecipes.height / 4);
        this.bookRecipes.children[0].scale.setTo(1);
        this.bookRecipes.children[0].text = "Recettes\n(Tab)";
    }

    openOrClose() {
        this.isOpened ? this.close() : this.open();
    }

    displayPotionsList() {
        allPotions.forEach((potion, index) => this.displayRecipe(220, 135 * (index + 1), potion));
    }

    displayRecipe(x, y, potion) {
        let textPotion = game.add.text(x, y - 35, potion.displayName, {
            font: "30px Alagard",
            fill: "#E5E5E5"
        });
        this.recipesList.push(textPotion);

        let potionSprite = game.add.sprite(x, y, potion.name);
        potionSprite.scale.setTo(1.75);
        this.recipesList.push(potionSprite);

        let textEquality =  game.add.text(x + 75, y, "=", {
            font: "80px Alagard",
            fill: "#E5E5E5"
        });
        this.recipesList.push(textEquality);

        let ingredient1 = game.add.sprite(textEquality.x + textEquality.width + 15, y, potion.ingredients[0]);
        ingredient1.scale.setTo(1.75);
        this.recipesList.push(ingredient1);
        let ingredient2 = game.add.sprite(ingredient1.x + ingredient1.width + 15, y, potion.ingredients[1]);
        ingredient2.scale.setTo(1.75);
        this.recipesList.push(ingredient2);
        let ingredient3 = game.add.sprite(ingredient2.x + ingredient2.width + 15, y, potion.ingredients[2]);
        ingredient3.scale.setTo(1.75);
        this.recipesList.push(ingredient3);
    }

    hidePotionsList() {
        this.recipesList.forEach(potionSprite => potionSprite.destroy());
    }

    bringToTop() {
        this.bookRecipes.bringToTop();
        this.recipesList.forEach(sprite => sprite.bringToTop());
    }
}