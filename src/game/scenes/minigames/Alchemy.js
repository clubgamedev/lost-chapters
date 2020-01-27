import { ALL_POTIONS } from "./alchemy/potions.js"
import { BookRecipes } from "./alchemy/BookRecipes"
import { PieProgress } from "./alchemy/PieProgress"
import { showMiddleText } from "../../utils/message"
import { sounds, addSounds } from "../../audio"
import { controls } from "../../utils/controls"
import { shuffleArray } from "../../utils/array"
import { AlchemyLights } from "./alchemy/lights"

const GAME_DURATION = 120 // seconds
const MAX_INGREDIENTS = 3

const ingredientsNames = [
	"crochetsDeSerpent",
	"cireBougieNoir",
	"ecorceDeBouleau",
	"oeufDeCorbeau",
	"epineDePoissonDiable",
	"vieilleGnole",
	"foieDeCerf",
	"jusDeSauterelle",
	"plumeDeCorneille"
]
const ingredientsPositions = [
	{ x: 10, y: 196 },
	{ x: 60, y: 196 },
	{ x: 180, y: 160 },
	{ x: 280, y: 140 },
	{ x: 330, y: 140 },
	{ x: 420, y: 160 },
	{ x: 557, y: 196 },
	{ x: 586, y: 280 },
	{ x: 605, y: 196 }
]

export class AlchemyScene {
	preload() {
		game.load.image("bg1", "assets/alchemy/bg1.png")
		game.load.image("bg2", "assets/alchemy/bg2.png")
		game.load.image("moon", "assets/alchemy/moon.png")
		game.load.image("footer", "assets/alchemy/footer2.png")
		game.load.image("smallSuspend", "assets/alchemy/smallSuspend.png")
		game.load.image("bigSuspend", "assets/alchemy/bigSuspend.png")
		game.load.image("stockage", "assets/alchemy/stockage.png")

		game.load.image(
			"cireBougieNoir",
			"assets/alchemy/ingredients/CireBougieNoir.png"
		)
		game.load.image(
			"crochetsDeSerpent",
			"assets/alchemy/ingredients/CrochetsDeSerpent.png"
		)
		game.load.image(
			"ecorceDeBouleau",
			"assets/alchemy/ingredients/EcorceDeBouleau.png"
		)

		game.load.image(
			"oeufDeCorbeau",
			"assets/alchemy/ingredients/OeufDeCorbeau.png"
		)
		game.load.image(
			"epineDePoissonDiable",
			"assets/alchemy/ingredients/epineDePoissonDiable.png"
		)
		game.load.image(
			"vieilleGnole",
			"assets/alchemy/ingredients/VieilleGnole.png"
		)

		game.load.image(
			"foieDeCerf",
			"assets/alchemy/ingredients/foieDeCerf.png"
		)
		game.load.image(
			"jusDeSauterelle",
			"assets/alchemy/ingredients/jusDeSauterelle.png"
		)
		game.load.image(
			"plumeDeCorneille",
			"assets/alchemy/ingredients/plumeDeCorneille.png"
		)

		game.load.image(
			"potionDeForce",
			"assets/alchemy/potions/potionDeForce.png"
		)
		game.load.image("antidote", "assets/alchemy/potions/antidote.png")
		game.load.image(
			"potionDeLucidite",
			"assets/alchemy/potions/potionDeLucidite.png"
		)
		game.load.image(
			"potionDeProtection",
			"assets/alchemy/potions/potionDeProtection.png"
		)

		game.load.image("book", "assets/ui/book.png")
		game.load.image("clock", "assets/alchemy/clock_bis.png")
		game.load.spritesheet(
			"marmite",
			"assets/alchemy/marmite.png",
			48,
			64,
			4
		)

		addSounds()
	}

	create() {
		window.alchemy = this
		game.scale.setGameSize(640, 360)
		game.world.setBounds(0, 0, 640, 360)

		this.groups = {
			background: game.add.group(),
			platforms: game.add.group(),
			objects: game.add.group(),
			ingredients: game.add.group(),
			player: game.add.group(),
			book: game.add.group(),
			lights: game.add.group(),
			hud: game.add.group(),
			pickedIngredients: game.add.group()
		}

		this.createLevel()
		this.spawnPlayer()
		this.spawnIngredients()
		this.lights = new AlchemyLights(this.groups.lights)

		let clockSprite = this.groups.hud.create(game.width - 35, 5, "clock")
		this.clockPieProgress = new PieProgress(
			game,
			game.width - 35 + clockSprite.width / 2,
			5 + clockSprite.height / 2,
			12,
			"#cf3723"
		)
		this.groups.hud.add(this.clockPieProgress.sprite)

		this.timer = game.time.create(true)
		this.timer.add(Phaser.Timer.SECOND * GAME_DURATION, this.gameOver, this)
		this.timer.start()

		this.bookRecipes = new BookRecipes(this.groups.book)
		controls.ACTION.onPress(() => this.bookRecipes.openOrClose())
		controls.UP.onPress(() => this.jump())
		controls.DOWN.onPress(() => this.pickOrDrop())

		this.potionsCreated = []
		this.pickedIngredients = []
	}

	update() {
		game.physics.arcade.collide(this.player, this.groups.platforms)

		this.updateControls()
		let timeProgress = this.timer.seconds / GAME_DURATION
		this.lights.update(this.player, this.moon, timeProgress)
		this.moon.position.y = timeProgress * 115
		this.clockPieProgress.updateProgress(timeProgress)
	}

	jump() {
		const JUMP_SPEED = 600
		if (this.player.body.touching.down) {
			this.player.body.velocity.y = -1 * JUMP_SPEED
			this.player.animations.play("move")
		}
	}

	pickOrDrop() {
		if (this.player.body.touching.down) {
			game.physics.arcade.overlap(
				this.player,
				this.groups.ingredients,
				this.pickIngredient,
				null,
				this
			)
			game.physics.arcade.overlap(
				this.player,
				this.marmite,
				this.putInMarmite,
				null,
				this
			)
		}
	}

	updateControls() {
		const MAX_HORIZONTAL_SPEED = 200,
			GROUND_H_ACCEL = 50,
			AIR_H_ACCEL = 25

		if (this.player.body.touching.down) {
			if (controls.LEFT.isPressed()) {
				this.player.body.velocity.x = Math.max(
					-1 * MAX_HORIZONTAL_SPEED,
					this.player.body.velocity.x - GROUND_H_ACCEL
				)
				this.player.animations.play("move")
			} else if (controls.RIGHT.isPressed()) {
				this.player.body.velocity.x = Math.min(
					MAX_HORIZONTAL_SPEED,
					this.player.body.velocity.x + GROUND_H_ACCEL
				)
				this.player.animations.play("move")
			} else {
				this.player.animations.stop()
				this.player.animations.play("idle")
				this.player.body.velocity.x = 0
			}
		} else {
			// jumping
			if (controls.LEFT.isPressed()) {
				this.player.body.velocity.x = Math.max(
					-1 * MAX_HORIZONTAL_SPEED,
					this.player.body.velocity.x - AIR_H_ACCEL
				)
			} else if (controls.RIGHT.isPressed()) {
				this.player.body.velocity.x = Math.min(
					+1 * MAX_HORIZONTAL_SPEED,
					this.player.body.velocity.x + AIR_H_ACCEL
				)
			}
		}
		this.player.scale.x = this.player.body.velocity.x < 0 ? 2 : -2
	}

	shutdown() {
		for (let groupName in this.groups) this.groups[groupName].destroy()
		this.timer.destroy()
	}

	createLevel() {
		const { background, platforms, objects, ingredients, hud } = this.groups

		background.create(0, 0, "bg2")
		this.moon = background.create(0, 0, "moon")
		background.create(0, 0, "bg1")

		platforms.enableBody = true
		platforms.create(0, 302, "footer")
		platforms.create(175, 185, "smallSuspend")
		platforms.create(0, 220, "bigSuspend")
		platforms.create(270, 165, "bigSuspend")
		platforms.create(415, 185, "smallSuspend")
		platforms.create(545, 220, "bigSuspend")
		platforms.forEach(platform => {
			platform.body.immovable = true
		})

		const stockage = hud.create(game.width / 2, 322, "stockage")
		stockage.anchor.setTo(0.5, 0)

		objects.enableBody = true

		this.marmite = game.add.sprite(295, 240, "marmite")
		this.marmite.animations.add("enter", [1, 2, 3, 0], 8, false)
		objects.add(this.marmite)

		ingredients.enableBody = true
	}

	spawnPlayer() {
		this.player = game.add.sprite(250, 265, "howard")
		this.groups.player.add(this.player)
		game.physics.arcade.enable(this.player)

		this.player.anchor.setTo(0.5)
		this.player.body.setSize(10, 26, 11, 5)
		this.player.body.gravity.y = 2000
		this.player.body.collideWorldBounds = true

		this.player.scale.setTo(2, 2)

		this.player.animations.add("idle", [3], 0, true)
		this.player.animations.add("move", [7, 6, 8, 6], 10, true)
		this.player.animations.play("idle")
	}

	resetIngredients() {
		this.pickedIngredients = []
		this.groups.pickedIngredients.removeAll(true)
		this.spawnIngredients()
	}

	pickIngredient(player, ingredient) {
		if (this.pickedIngredients.length >= MAX_INGREDIENTS) return

		sounds.PICK.play()
		let sprite = this.groups.pickedIngredients.create(
			270 + this.pickedIngredients.length * 35,
			328,
			ingredient.key
		)
		sprite.scale.setTo(0.6, 0.6)
		this.pickedIngredients.push(ingredient.key)
		ingredient.destroy()
	}

	putInMarmite() {
		this.marmite.animations.play("enter")
		setTimeout(() => {
			this.marmite.animations.stop()
			this.marmite.frame = 0
		}, 1000)

		if (this.pickedIngredients.length > 0) {
			this.createPotionWithIngredients()
			this.resetIngredients()
		}
	}

	createPotionWithIngredients() {
		let potionCreated = ALL_POTIONS.find(potion =>
			potion.cookPotion(this.pickedIngredients)
		)

		if (potionCreated) {
			showMiddleText(
				potionCreated.displayName + " créée !",
				0x000000,
				"#FFFFFF",
				1500,
				"36px"
			)
			this.potionsCreated.push(potionCreated)
			let potionSprite = this.groups.hud.create(
				5 + 25 * (this.potionsCreated.length - 1),
				25,
				potionCreated.name
			)
			potionSprite.scale.setTo(0.5, 0.5)
			sounds.COOK_SUCCESS.play()
		} else {
			showMiddleText(
				"Recette inconnue !",
				0xe30027,
				"#FFFFFF",
				1000,
				"36px"
			)
			sounds.COOK_FAIL.play()
		}
	}

	spawnIngredients() {
		this.groups.ingredients.removeAll(true)

		shuffleArray(ingredientsPositions)
		ingredientsNames.forEach((name, i) => {
			let { x, y } = ingredientsPositions[i]
			let sprite = this.groups.ingredients.create(x, y, name)
			sprite.scale.setTo(0.6, 0.6)
		})
	}

	gameOver() {
		showMiddleText("Le temps est écoulé")
		this.potionsCreated.forEach(potion => {
			game.save.inventory[potion.name].nombre++
		})
		game.state.start("MainGame")
	}
}
