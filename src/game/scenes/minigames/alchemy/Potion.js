export class Potion{
    displayName;
    name;
    ingredients = [];


    constructor(displayName, name, ingredients) {
        this.displayName = displayName;
        this.name = name;
        this.ingredients = ingredients;
    }

    cookPotion(ingredientsInMarmite) {
        if(ingredientsInMarmite && ingredientsInMarmite.length>0) {
            let ingredientsFound = [];

            ingredientsInMarmite.forEach(ingredient => {
                if (this.ingredients.indexOf(ingredient) !== -1 && ingredientsFound.indexOf(ingredient) === -1) {
                    ingredientsFound.push(ingredient);
                }
            });
            return ingredientsFound.length === ingredientsInMarmite.length;
        }
    }
}