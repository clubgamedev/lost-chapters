import { ALL_POTIONS } from "./potions"
import { sounds } from "@/game/audio"
import { toggleItemSelection } from "../../../utils/inventory";

export function openBookRecipes() {
	sounds.OPEN_BOOK.play()
	game.book = {
		page: 1,
		pages: [],
		sprites: [],
		group: game.add.group(undefined, "book"),
		onClose: closeBookRecipes
	};
	drawBookRecipes()
}

export function closeBookRecipes() {
	game.book.group.destroy()
	if (game.state.current === "MainGame") {
		setTimeout(() => toggleItemSelection(), 0)
	}
}

function drawBookRecipes() {
	const scaleFactor = game.state.current === "MainGame" ? 255 / 640 : 1;
	game.book.sprites.forEach(sprite => sprite.destroy())
	game.book.sprites = [];

	const book = game.add.image(2, 2, "book-bg")
	book.width = ((game.height - 5) * 186) / 140
	book.height = game.height - 10
	book.x = game.width / 2 - book.width / 2
	book.tint = 0xc1c1c1
	book.fixedToCamera = true;
	game.book.group.add(book)
	game.book.sprites.push(book)

	ALL_POTIONS
		.forEach((potion, index) => {
			if (!game.save.loot[potion.recette]) return;

			let x = scaleFactor * (180 + 225 * Math.floor(index / 2)),
				y = scaleFactor * (60 + 150 * (index % 2))

			let textPotion = game.add.text(x - scaleFactor * 25, y - scaleFactor * 8, potion.displayName, {
				font: `${scaleFactor * 20}px Alagard`,
				fill: "#333"
			})
			textPotion.fixedToCamera = true;
			game.book.group.add(textPotion)
			game.book.sprites.push(textPotion)

			let potionSprite = game.book.group.create(
				x - scaleFactor * 70,
				y - scaleFactor * 22,
				"alchemy_" + potion.name
			)
			potionSprite.fixedToCamera = true;
			potionSprite.scale.setTo(scaleFactor);
			game.book.sprites.push(potionSprite)

			potion.ingredients.forEach((ingredient, i) => {
				let sprite = game.book.group.create(
					x + scaleFactor * (10 + 50 * (i - 1)),
					y + scaleFactor * 25,
					"alchemy_" + ingredient
				)
				sprite.fixedToCamera = true;
				sprite.scale.setTo(scaleFactor);
				game.book.sprites.push(sprite)
			})
		})
}
