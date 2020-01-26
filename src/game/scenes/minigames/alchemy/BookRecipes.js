import { ALL_POTIONS } from "./potions"
import { sounds } from "@/game/audio"

export class BookRecipes {
	constructor(group) {
		this.isOpened = false
		this.group = group

		this.commandText = game.add.text(5, 5, "", {
			font: "16px Alagard",
			fill: "#E5E5E5",
			//boundsAlignH: "center",
			//boundsAlignV: "middle",
			align: "center"
		})
		group.add(this.commandText)
		this.updateCommands()
		this.bookContent = []
	}

	updateCommands() {
		this.commandText.text = this.isOpened
			? "Fermer (Action)"
			: "Recettes (Action)"
		this.commandText.bringToTop()
	}

	open() {
		this.isOpened = true
		sounds.OPEN_BOOK.play()
		this.drawBook()
		this.updateCommands()
	}

	close() {
		this.isOpened = false
		sounds.CLOSE_BOOK.play()
		this.bookContent.forEach(sprite => sprite.destroy())
		this.updateCommands()
	}

	openOrClose() {
		this.isOpened ? this.close() : this.open()
	}

	drawBook() {
		this.bookContent = []
		const book = game.add.image(2, 2, "book-bg")
		book.width = ((game.height - 5) * 186) / 140
		book.height = game.height - 10
		book.x = game.width / 2 - book.width / 2
		book.tint = 0xc1c1c1
		this.group.add(book)
		this.bookContent.push(book)

		ALL_POTIONS.forEach((potion, index) => {
			let x = 180 + 225 * Math.floor(index / 2),
				y = 60 + 150 * (index % 2)

			let textPotion = game.add.text(x - 25, y - 8, potion.displayName, {
				font: "20px Alagard",
				fill: "#333"
			})
			this.group.add(textPotion)

			let potionSprite = this.group.create(x - 75, y - 22, potion.name)

			let ingredient1 = this.group.create(
				x - 50,
				y + 25,
				potion.ingredients[0]
			)
			let ingredient2 = this.group.create(
				x,
				y + 25,
				potion.ingredients[1]
			)
			let ingredient3 = this.group.create(
				x + 50,
				y + 25,
				potion.ingredients[2]
			)

			this.bookContent.push(
				ingredient1,
				ingredient2,
				ingredient3,
				potionSprite,
				textPotion
			)
		})
	}
}
