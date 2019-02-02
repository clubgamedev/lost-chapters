import { Mole } from "./characters/Mole"
import { Treant } from "./characters/Treant"
import { Cultist } from "./characters/Cultist"
import { Character, CHARACTER_STATE } from "./characters/Character"
import { Runes } from "./items/Runes";
import { Chaudron } from "./items/Chaudron";
import { Fire } from "./effects/Fire";
import RenderGroup from "./utils/RenderGroup";
import { initLights, updateLights } from "./utils/Light";

export const schoolLevel = {
	name: "L'Université",
	tilemap: "map_school",
	tilesets: ["tileset_inside"],
	startPosition: { x: 84, y: 98 },
	exitPosition: { x: 0, y: 0 },
	lightRadius: 100,
	obscurity: 1
}

export const forestLevel = {
	name: "La forêt",
	tilemap: "map_forest",
	tilesets: ["tileset_forest"],
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
	autel: autelLevel,
	school: schoolLevel
}

export class Level {
	constructor({
		name,
		tilemap,
		tilesets,
		startPosition,
		lightRadius,
		obscurity
	}) {
		this.name = name
		this.startPosition = startPosition
		this.createTileMap(tilemap, tilesets)
		this.createGroups()
		this.createEnemies()
		this.createPNJ();
		this.createObjects();
		this.createTriggers();
		this.createLights(lightRadius, obscurity)
	}

	createTileMap(tilemap, tilesets) {
		//tilemap
		this.tilemap = game.add.tilemap(tilemap)
		this.tilemap.addTilesetImage("collisions")
		tilesets.forEach(tileset => { this.tilemap.addTilesetImage(tileset) });

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
		game.groups.characters.add(game.player)

		game.groups.enemies = game.add.group(game.groups.characters)
		game.groups.pnj = game.add.group(game.groups.characters)

		game.groups.loot = game.add.group(game.groups.render)
		game.groups.loot.enableBody = true

		game.groups.objects = game.add.group(game.groups.render)
		game.groups.objects.enableBody = true

		game.groups.lights = game.add.group(game.groups.render);

		game.groups.triggers = game.add.group(game.groups.render);
		game.groups.triggers.enableBody = true
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
				let pnj = new Character(game, { x: character.x / 16, y: character.y / 16 }, characterName, CHARACTER_STATE[state])
				pnj.body.setSize(18, 14, 6, 18);
				game.groups.pnj.add(pnj)
			})
		})
	}

	createObjects() {
		const objects = { runes: Runes, chaudron: Chaudron };
		Object.entries(objects).forEach(([objectType, Constructor]) => {
			findObjectsByType(objectType, this.tilemap, "Object Layer").forEach(object => {
				let sprite = new Constructor({ x: object.x / 16, y: object.y / 16 }, object.properties)
				game.groups.objects.add(sprite)
			})
		})
	}

	createTriggers() {
		const tps = findObjectsByType("teleport", this.tilemap, "Object Layer")
		tps.forEach(tp => {
			let trigger = game.add.sprite(tp.x, tp.y, "exit")
			trigger.alpha = 0;
			trigger.width = tp.width;
			trigger.height = tp.height;
			game.groups.triggers.add(trigger)
			trigger.action = () => {
				if (game.player.movesBeforeTp > 0) return;
				let destinationId = tp.properties.find(prop => prop.name === "to").value;
				let destination = tps.find(x => x.properties.find(prop => prop.name === "from").value === destinationId);
				if (destination) {
					game.player.movesBeforeTp = 50;
					game.camera.flash("black")
					game.player.position.x = destination.x + destination.width / 2;
					game.player.position.y = destination.y + destination.height / 2 - 8;
				}
			}
		})

		const exits = findObjectsByType("exit", this.tilemap, "Object Layer")
		exits.forEach(exit => {
			let exitSprite = game.add.sprite(exit.x, exit.y, "exit")
			exitSprite.alpha = 0;
			exitSprite.width = exit.width;
			exitSprite.height = exit.height;
			game.groups.triggers.add(exitSprite)
			exitSprite.action = () => {
				let levelName = exit.properties.find(prop => prop.name === "level").value;
				exitSprite.destroy(); // to avoid infinite loop during camera fade
				game.camera.fade(0x000000, 390)
				setTimeout(() => {
					goToLevel(levelName)
					positionPlayerAtStartOfLevel();
				}, 390);
				setTimeout(() => game.camera.flash(0x000000, 400, true), 400);
			}
		})
	}

	createLights(lightRadius, obscurity) {
		initLights(lightRadius, obscurity);
		const lightSources = { fire: Fire };

		Object.entries(lightSources).forEach(([objectType, Constructor]) => {
			findObjectsByType(objectType, this.tilemap, "Object Layer").forEach(lightSource => {
				let sprite = new Constructor({ x: lightSource.x / 16, y: lightSource.y / 16 }, lightSource.properties)
				game.groups.lights.add(sprite);
			})
		})
	}

	update() {
		updateLights();
		if (game.music && game.music._sound) {
			let t = game.time.totalElapsedSeconds();
			game.music._sound.playbackRate.value = 1 + Math.sin(t) * (16 - game.player.lucidity) * 0.1;
		}
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
			//element.y -= map.tileHeight
			element.y -= element.height;
			return element
		}
	})
}

export function goToLevel(levelName) {
	game.level = new Level(levels[levelName])
}

export function positionPlayerAtStartOfLevel() {
	Object.assign(game.player.position, {
		x: game.level.startPosition.x * 16 + 8,
		y: game.level.startPosition.y * 16 + 8,
	});
}