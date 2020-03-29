import { ALL_POTIONS } from "./alchemy/potions.js"
import { openBookRecipes } from "./alchemy/BookRecipes"
import { PieProgress } from "./alchemy/PieProgress"
import { showMiddleText } from "../../utils/message"
import { sounds } from "../../audio"
import { controls, stick } from "../../utils/controls"
import { shuffleArray } from "../../utils/array"
import { talkToMyself } from "../../utils/dialog"
import { closeBook } from "../../utils/book"
import { AlchemyLights } from "./alchemy/lights"

const GAME_DURATION = 120 // seconds
const MAX_INGREDIENTS = 3

const ingredientsNames = [
	"racineHellebore",
	"cireBougieNoire",
	"sangLibellule",
	"oeufDeCorbeau",
	"epineDePoissonDiable",
	"vieilleGnole",
	"foieDeCerf",
	"alcoolPsylocibe",
	"plumeDeGeai"
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
		game.load.image("alchemy_bg1", "assets/alchemy/bg1.png")
		game.load.image("alchemy_bg2", "assets/alchemy/bg2.png")
		game.load.image("alchemy_moon", "assets/alchemy/moon.png")
		game.load.image("alchemy_footer", "assets/alchemy/footer2.png")
		game.load.image("alchemy_smallSuspend", "assets/alchemy/smallSuspend.png")
		game.load.image("alchemy_bigSuspend", "assets/alchemy/bigSuspend.png")
		game.load.image("alchemy_stockage", "assets/alchemy/stockage.png")

		game.load.image("alchemy_clock", "assets/alchemy/clock_bis.png")
		game.load.spritesheet(
			"alchemy_marmite",
			"assets/alchemy/marmite.png",
			48,
			64,
			4
		)
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
			lights: game.add.group(),
			hud: game.add.group(),
			pickedIngredients: game.add.group()
		}

		this.createLevel()
		this.spawnPlayer()
		this.spawnIngredients()
		this.lights = new AlchemyLights(this.groups.lights)

		game.paused = true;
		this.instructions = game.add.image(game.width / 2, game.height / 2, "instructions_alchemy");
		this.instructions.anchor.setTo(0.5);
		controls.ACTION.onPress(() => this.start(), this, true)
		controls.ENTER.onPress(() => this.start(), this, true)
	}

	start() {
		this.instructions.destroy()

		let clockSprite = this.groups.hud.create(game.width - 35, 5, "alchemy_clock")
		this.clockPieProgress = new PieProgress(
			game,
			game.width - 35 + clockSprite.width / 2,
			5 + clockSprite.height / 2,
			12,
			"#cf3723"
		)
		this.groups.hud.add(this.clockPieProgress.sprite)

		this.commandText = game.add.text(5, 5, "Recettes\n(Action)", {
			font: "16px Alagard",
			fill: "#E5E5E5",
			//boundsAlignH: "center",
			//boundsAlignV: "middle",
			align: "center"
		})
		this.groups.hud.add(this.commandText)

		this.timer = game.time.create(true)
		this.timer.add(Phaser.Timer.SECOND * GAME_DURATION, this.gameOver, this)
		this.timer.start()

		controls.ACTION.resetEvents()
		controls.ENTER.resetEvents()
		controls.SELECT.onPress(() => this.toggleRecipesBook())
		controls.ENTER.onPress(() => this.toggleRecipesBook())
		controls.ACTION.onPress(() => this.jump())
		controls.UP.onPress(() => this.jump())
		controls.DOWN.onPress(() => this.pickOrDrop())
		controls.SECONDARY.onPress(() => this.pickOrDrop())

		this.potionsCreated = []
		this.pickedIngredients = []
		game.paused = false;
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

	toggleRecipesBook() {
		if (game.book) {
			closeBook()
			this.commandText.text = ""
			this.commandText.bringToTop()

		} else {
			openBookRecipes()
			this.groups.book = game.book.group;
			this.commandText.text = "Fermer\n(Action)"
			this.commandText.bringToTop()
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
			if (Math.abs(stick.getAxisX()) > 0.05) {
				this.player.body.velocity.x = MAX_HORIZONTAL_SPEED * stick.getAxisX()
				this.player.animations.play("move")
			} else if (controls.LEFT.isPressed()) {
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

		background.create(0, 0, "alchemy_bg2")
		this.moon = background.create(0, 0, "alchemy_moon")
		background.create(0, 0, "alchemy_bg1")

		platforms.enableBody = true
		platforms.create(0, 302, "alchemy_footer")
		platforms.create(175, 185, "alchemy_smallSuspend")
		platforms.create(0, 220, "alchemy_bigSuspend")
		platforms.create(270, 165, "alchemy_bigSuspend")
		platforms.create(415, 185, "alchemy_smallSuspend")
		platforms.create(545, 220, "alchemy_bigSuspend")
		platforms.forEach(platform => {
			platform.body.immovable = true
		})

		const stockage = hud.create(game.width / 2, 322, "alchemy_stockage")
		stockage.anchor.setTo(0.5, 0)

		objects.enableBody = true

		this.marmite = game.add.sprite(295, 240, "alchemy_marmite")
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
		this.pickedIngredients.push(ingredient.name)
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
			potion.ingredients.every(ingredient => this.pickedIngredients.includes(ingredient))
		)

		if (potionCreated) {
			showMiddleText(
				potionCreated.displayName + " créé !",
				0x000000,
				"#FFFFFF",
				1500,
				"36px"
			)
			this.potionsCreated.push(potionCreated)
			let potionSprite = this.groups.hud.create(
				5 + 25 * (this.potionsCreated.length - 1),
				25,
				"alchemy_" + potionCreated.name
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
			let sprite = this.groups.ingredients.create(x, y, "alchemy_" + name)
			sprite.name = name;
			sprite.scale.setTo(0.6, 0.6)
		})
	}

	gameOver() {
		showMiddleText("Temps écoulé")

		controls.SELECT.resetEvents();
		controls.ACTION.resetEvents();
		controls.UP.resetEvents();
		controls.DOWN.resetEvents();
		controls.SECONDARY.resetEvents();
		game.save.isNightTime = true;

		setTimeout(() => {
			talkToMyself([
				`La nuit est tombée. Je n'y vois plus rien...`,
				this.potionsCreated.length
					? `Voyons les potions que j'ai réussi à obtenir...`
					: `Je ne suis pas parvenu à préparer la moindre potion...`
			]).then(() => {
				this.potionsCreated.forEach(potion => {
					game.save.inventory.items[potion.name].nombre++
					sounds.ITEM.play()
				})
			})
		}, 500)

		game.state.start("MainGame")
	}
}
