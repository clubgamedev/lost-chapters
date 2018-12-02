import { Mole } from "./characters/Mole"
import { Treant } from "./characters/Treant"
import { Cultist } from "./characters/Cultist"
import { Character, CHARACTER_STATE } from "./characters/Character"
import { Runes } from "./items/Runes";
import { Fire } from "./effects/Fire";
import RenderGroup from "./utils/RenderGroup";
import { initLights, updateLights } from "./utils/Light";

export const forestLevel = {
	name: "La forêt",
	tilemap: "map",
	tilesets: ["tileset"],
	startPosition: { x: 47, y: 31 },
	exitPosition: { x: 46, y: 27 },
	lightRadius: 120
}

export const caveLevel = {
	name: "Le Terrier",
	tilemap: "map_cave",
	tilesets: ["tileset_cave"],
	startPosition: { x: 10, y: 8 },
	exitPosition: { x: 50, y: 24 },
	lightRadius: 80,
	obscurity: 0.75
}

export const autelLevel = {
	name: "L'autel",
	tilemap: "map_autel",
	tilesets: ["tileset_cave", "tileset_dungeon"],
	startPosition: { x: 14, y: 29 },
	exitPosition: { x: 14, y: 8 },
	lightRadius: 85,
	obscurity: 1
}

export const levels = {
	forest: forestLevel,
	cave: caveLevel,
	autel: autelLevel
}

export class Level {
	constructor({
		name,
		tilemap,
		tilesets,
		startPosition,
		exitPosition,
		lightRadius,
		obscurity
	}) {
		this.name = name
		this.startPosition = startPosition
		this.createTileMap(tilemap, tilesets)
		this.createGroups()
		this.createExit(exitPosition)
		this.createEnemies()
		this.createPNJ();
		this.createObjects();
		this.createLights(lightRadius, obscurity)
	}

	createTileMap(tilemap, tilesets) {
		//tilemap
		this.tilemap = game.add.tilemap(tilemap)
		this.tilemap.addTilesetImage("collisions")
		tilesets.forEach(tileset => { this.tilemap.addTilesetImage(tileset) });
		this.tilemap.addTilesetImage("objects")

		game.stage.backgroundColor = game.cache.getTilemapData(tilemap).data.backgroundcolor;

		this.layer_collisions = this.tilemap.createLayer("Collisions Layer")
		this.layer_collisions.visible = false;
		this.layer = this.tilemap.createLayer("Tile Layer")
		this.layer2 = this.tilemap.createLayer("Tile Layer 2")
		this.layer3 = this.tilemap.createLayer("Tile Layer 3")

		// collisions
		this.tilemap.setCollision(1, true, this.layer_collisions)

		this.layer.resizeWorld()
		this.layer2.resizeWorld()
		this.layer3.resizeWorld()
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
		const characters = ["franck", "augustin", "michel", "michelle", "indiana", "anna"];
		characters.forEach((characterName) => {
			findObjectsByType(characterName, this.tilemap, "Object Layer").forEach(character => {
				let state = character.properties.find(prop => prop.name === "state").value;
				console.log(state, CHARACTER_STATE[state]);
				let pnj = new Character(game, { x: character.x / 16, y: character.y / 16 }, characterName, CHARACTER_STATE[state])
				pnj.body.setSize(18, 14, 6, 18);
				game.groups.pnj.add(pnj)
			})
		})
	}

	createObjects() {
		const objects = { runes: Runes };
		Object.entries(objects).forEach(([objectType, Constructor]) => {
			findObjectsByType(objectType, this.tilemap, "Object Layer").forEach(object => {
				let sprite = new Constructor({ x: object.x / 16, y: object.y / 16 }, object.properties)
				game.groups.objects.add(sprite)
			})
		})
	}

	createExit({ x, y }) {
		this.exit = game.add.sprite(x * 16, y * 16, "exit")
		this.exit.alpha = 0
		game.physics.arcade.enable(this.exit)
	}

	createLights(lightRadius, obscurity) {
		initLights(lightRadius, obscurity);
		const lightSources = { fire: Fire };

		Object.entries(lightSources).forEach(([objectType, Constructor]) => {
			findObjectsByType(objectType, this.tilemap, "Object Layer").forEach(lightSource => {
				let sprite = new Constructor({ x: lightSource.x / 16, y: lightSource.y / 16 }, lightSource.properties)
				game.groups.objects.add(sprite);
			})
		})
	}

	update() {
		updateLights();
	}


}
// find objects in a Tiled layer that containt a property called "type" equal to a certain value
function findObjectsByType(type, map, layer) {
	return map.objects[layer].filter(element => {
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
