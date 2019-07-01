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
        let length = ingredientsInMarmite.length;
        let found = 0;

        ingredientsInMarmite.forEach(ingredient => {
            if(this.ingredients.indexOf(ingredient) !== -1){
                found++;
            }
        });
        return found === length;
    }
}