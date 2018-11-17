import { Mole } from "./characters/Mole"
import { Treant } from "./characters/Treant"
import { Cultist } from "./characters/Cultist"
import { Character } from "./characters/Character"
import RenderGroup from "./utils/RenderGroup";

export const forestLevel = {
	name: "La forêt",
	tilemap: "map",
	tileset: "tileset",
	startPosition: { x: 47, y: 31 },
	exitPosition: { x: 46, y: 27 },
	lightRadius: 120
}

export const caveLevel = {
	name: "Le Terrier",
	tilemap: "map_cave",
	tileset: "tileset_cave",
	startPosition: { x: 10, y: 8 },
	exitPosition: { x: 50, y: 24 },
	lightRadius: 80
}

export class Level {
	constructor({
		name,
		tilemap,
		tileset,
		startPosition,
		exitPosition,
		lightRadius
	}) {
		this.name = name
		this.startPosition = startPosition
		this.createTileMap(tilemap, tileset)
		this.createGroups()
		this.createExit(exitPosition)
		this.createEnemies()
		this.createPNJ();
		this.createLights(lightRadius)
	}

	createTileMap(tilemap, tileset) {
		//tilemap
		this.tilemap = game.add.tilemap(tilemap)
		this.tilemap.addTilesetImage("collisions")
		this.tilemap.addTilesetImage(tileset)
		this.tilemap.addTilesetImage("objects")

		this.layer_collisions = this.tilemap.createLayer("Collisions Layer")
		this.layer = this.tilemap.createLayer("Tile Layer")
		this.layer2 = this.tilemap.createLayer("Tile Layer 2")

		// collisions
		this.tilemap.setCollision(1, true, this.layer_collisions)

		this.layer.resizeWorld()
		this.layer2.resizeWorld()
		this.layer_collisions.resizeWorld()

		// this.layer_collisions.visible = true;
		// this.layer_collisions.debug = true;
		// this.layer.visible = false;
	}

	createGroups() {
		game.groups = {}

		game.groups.render = new RenderGroup(game);

		game.groups.characters = game.add.group(game.groups.render);
		game.groups.characters.enableBody = true

		game.groups.enemies = game.add.group(game.groups.characters)
		game.groups.pnj = game.add.group(game.groups.characters)

		game.groups.loot = game.add.group(game.groups.render)
		game.groups.loot.enableBody = true

		game.groups.objects = game.add.group(game.groups.render)
		game.groups.objects.enableBody = true
	}

	createEnemies() {
		const enemies = { mole: Mole, treant: Treant, cultist: Cultist };
		Object.entries(enemies).forEach(([enemyType, Constructor]) => {
			findObjectsByType(enemyType, this.tilemap, "Object Layer").forEach(enemy => {
				let verticalMove = enemy.properties && enemy.properties.some(
					prop => prop.name === "vertical" && prop.value === true
				)
				game.groups.enemies.add(
					new Constructor({ x: enemy.x / 16, y: enemy.y / 16 }, verticalMove)
				)
			})
		})
	}

	createPNJ() {
		const characters = ["franck", "augustin"];
		characters.forEach((characterName) => {
			findObjectsByType(characterName, this.tilemap, "Object Layer").forEach(character => {
				let state = character.properties.find(prop => prop.name === "state").value;
				let pnj = new Character(game, { x: character.x / 16, y: character.y / 16 }, characterName, state)
				pnj.body.setSize(18, 14, 6, 18);
				game.groups.pnj.add(pnj)
			})
		})
	}

	createExit({ x, y }) {
		this.exit = game.add.sprite(x * 16, y * 16, "exit")
		this.exit.alpha = 0
		game.physics.arcade.enable(this.exit)
	}

	createLights(lightRadius) {
		this.lightRadius = lightRadius
		this.shadowTexture = game.add.bitmapData(game.width, game.height)
		this.shadowTexture.radius = 90
		this.lightSprite = game.add.image(
			game.camera.x,
			game.camera.y,
			this.shadowTexture
		)
		this.lightSprite.width = game.width + 10
		this.lightSprite.height = game.height + 10

		this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY
	}

	update() {
		this.lightSprite.reset(game.camera.x - 5, game.camera.y - 5)
		this.updateShadowTexture()
	}

	updateShadowTexture() {
		this.shadowTexture.context.fillStyle = "rgb(10, 10, 10)"
		this.shadowTexture.context.fillRect(
			-10,
			-10,
			game.width + 10,
			game.height + 10
		)

		var radius = this.lightRadius + game.rnd.integerInRange(-1, 1),
			heroX = game.player.x - game.camera.x,
			heroY = game.player.y - game.camera.y

		var gradient = this.shadowTexture.context.createRadialGradient(
			heroX,
			heroY,
			this.lightRadius * 0.75,
			heroX,
			heroY,
			radius
		)
		gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)")
		gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)")

		this.shadowTexture.context.beginPath()
		this.shadowTexture.context.fillStyle = gradient
		this.shadowTexture.context.arc(
			heroX,
			heroY,
			radius,
			0,
			Math.PI * 2,
			false
		)
		this.shadowTexture.context.fill()

		this.shadowTexture.dirty = true
	}
}
// find objects in a Tiled layer that containt a property called "type" equal to a certain value
function findObjectsByType(type, map, layer) {
	return map.objects[layer].filter(element => {
		//console.log(element);
		if (element.type === type) {
			//Phaser uses top left, Tiled bottom left so we have to adjust the y position
			//also keep in mind that the cup images are a bit smaller than the tile which is 16x16
			//so they might not be placed in the exact pixel position as in Tiled
			//console.log("Found " + element.type);
			element.y -= map.tileHeight
			return element
		}
	})
}
