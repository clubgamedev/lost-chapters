export class Potion {
	displayName
	name
	ingredients = []
	description

	constructor(props) {
		Object.assign(this, props)
	}

	cookPotion(ingredientsInMarmite) {
		if (ingredientsInMarmite && ingredientsInMarmite.length > 0) {
			let ingredientsFound = []

			ingredientsInMarmite.forEach(ingredient => {
				if (
					this.ingredients.indexOf(ingredient) !== -1 &&
					ingredientsFound.indexOf(ingredient) === -1
				) {
					ingredientsFound.push(ingredient)
				}
			})
			return ingredientsFound.length === this.ingredients.length
		}
	}
}
