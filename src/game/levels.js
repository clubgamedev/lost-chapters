import { Mole } from "./characters/Mole"
import { Treant } from "./characters/Treant"
import { Cultist } from "./characters/Cultist"
import { Character, CHARACTER_STATE } from "./characters/Character"
import { Runes, Chaudron, Book, Page, Description, EscapeTable } from "./items/"
import { Fire } from "./effects/Fire";
import { AmbientLight } from "./effects/AmbientLight";
import RenderGroup from "./utils/RenderGroup";
import { initLights, updateLights, clearLights } from "./utils/Light";
import { showMiddleText } from "./utils/message"

export const schoolLevel = {
	name: "L'Université",
	tilemap: "map_school",
	tilesets: ["tileset_inside"],
	startPosition: { x: 84, y: 97 },
	lightRadius: 100,
	obscurity: 1
}

export const forestLevel = {
	name: "La forêt",
	tilemap: "map_forest",
	tilesets: ["tileset_forest", "tileset_outside"],
	startPosition: { x: 4, y: 22 },
	lightRadius: 120,
	fog: true
}

export const caveLevel = {
	name: "Le Terrier",
	tilemap: "map_cave",
	tilesets: ["tileset_cave"],
	startPosition: { x: 10, y: 8 },
	lightRadius: 80,
	obscurity: 0.75
}

export const autelLevel = {
	name: "L'autel",
	tilemap: "map_autel",
	tilesets: ["tileset_cave", "tileset_dungeon"],
	startPosition: { x: 14, y: 29 },
	lightRadius: 85,
	obscurity: 1
}

export const sanctuaireLevel = {
	name: "Le Sanctuaire",
	tilemap: "map_sanctuary",
	tilesets: ["tileset_forest", "tileset_outside"],
	startPosition: { x: 3, y: 21 },
	lightRadius: 150,
	obscurity: 1,
	fog: true
}

export const levels = {
	forest: forestLevel,
	cave: caveLevel,
	autel: autelLevel,
	school: schoolLevel,
	sanctuaire: sanctuaireLevel
}

export class Level {
	constructor({
		name,
		tilemap,
		tilesets,
		startPosition,
		lightRadius,
		obscurity,
		hue,
		fog
	}) {
		this.name = name
		this.startPosition = startPosition
		this.createTileMap(tilemap, tilesets)
		this.createGroups()
		this.createEnemies()
		this.createPNJ();
		this.createObjects();
		this.createTriggers();
		this.createLights(lightRadius, obscurity, hue, fog)

		showMiddleText(name);
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
		this.layerFront = this.tilemap.createLayer("Front Tile Layer")

		// collisions
		this.tilemap.setCollision(1, true, this.layer_collisions)

		this.layer.resizeWorld()
		this.layer2.resizeWorld()
		this.layer3.resizeWorld()
		this.layerFront.resizeWorld()
		this.layer_collisions.resizeWorld()

		// this.layer_collisions.visible = true;
		// this.layer_collisions.debug = true;
		// this.layer.visible = false;
	}

	clearTileMap() {
		this.tilemap.destroy()
		this.layer.destroy()
		this.layer2.destroy()
		this.layer3.destroy()
		this.layerFront.destroy()
		this.layer_collisions.destroy()
	}

	createGroups() {
		if (game.groups && game.groups.render) {
			let toRemove = game.groups.render;
			setTimeout(() => toRemove.destroy(), 100); // good enough
		}

		game.groups = {}

		game.groups.render = new RenderGroup(game);

		game.groups.lights = game.add.group(game.groups.render, "lights");

		game.groups.characters = game.add.group(game.groups.render, "characters");
		game.groups.characters.enableBody = true
		game.groups.characters.add(game.player)

		game.groups.enemies = game.add.group(game.groups.characters, "enemies")
		game.groups.pnj = game.add.group(game.groups.characters, "pnj")

		game.groups.loot = game.add.group(game.groups.render, "loot")
		game.groups.loot.enableBody = true

		game.groups.objects = game.add.group(game.groups.render, "objects")
		game.groups.objects.enableBody = true

		game.groups.triggers = game.add.group(game.groups.render, "triggers");
		game.groups.triggers.enableBody = true

		this.layerFront.bringToTop();

		game.groups.lights = game.add.group(undefined, "lights");

		game.groups.fx = game.add.group(undefined, "effects");
		game.groups.fx.add(game.player.interactionSprite);

		game.groups.hud = game.add.group(undefined, "hud");
	}

	createEnemies() {
		const enemies = { mole: Mole, treant: Treant, cultist: Cultist };
		Object.entries(enemies).forEach(([enemyType, Constructor]) => {
			findObjectsByType(enemyType, this.tilemap, "Object Layer").forEach(enemy => {
				let verticalMove = enemy.properties && enemy.properties.vertical === true
				game.groups.enemies.add(
					new Constructor({ x: enemy.x / 16, y: enemy.y / 16 }, verticalMove)
				)
			})
		})
	}

	createPNJ() {
		const characters = ["howard", "franck", "marie", "etudiant", "ramsey", "sbire", "therled"];
		characters.forEach((characterName) => {
			findObjectsByType(characterName, this.tilemap, "Object Layer").forEach(character => {
				let state = character.properties.state;
				let pnj = new Character(game, { x: character.x / 16, y: character.y / 16 }, characterName, CHARACTER_STATE[state])
				pnj.properties = character.properties;
				pnj.body.setSize(18, 14, 6, 18);
				game.groups.pnj.add(pnj)
			})
		})
	}

	createObjects() {
		const objects = { runes: Runes, chaudron: Chaudron, book: Book, escapeTable: EscapeTable, page: Page, description: Description };
		Object.entries(objects).forEach(([objectType, Constructor]) => {
			findObjectsByType(objectType, this.tilemap, "Object Layer").forEach(object => {
				let sprite = new Constructor({ x: object.x / 16, y: object.y / 16 }, { name: object.name, ...(object.properties || {}) })
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
				let destinationId = tp.properties.to;
				let destination = tps.find(x => x.properties.from === destinationId);
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
				let levelName = exit.properties.level;
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

	createLights(lightRadius, obscurity, hue, fog) {
		initLights(lightRadius, obscurity, hue, fog);
		const lightSources = { fire: Fire, light: AmbientLight };

		Object.entries(lightSources).forEach(([objectType, Constructor]) => {
			findObjectsByType(objectType, this.tilemap, "Object Layer").forEach(lightSource => {
				let sprite = new Constructor({ x: lightSource.x / 16, y: lightSource.y / 16 }, lightSource.properties)
				game.groups.lights.add(sprite);
			})
		})
	}

	update() {
		updateLights();
		//TODO: faire un setInterval 500ms plutot que de fr ça à chaque frame
		if (game.music && game.music._sound) {
			let t = game.time.totalElapsedSeconds();
			game.music._sound.playbackRate.value = 1 + Math.sin(t) * (16 - game.player.lucidity) * 0.1;
		}
	}

	exit() {
		this.clearTileMap();
		clearLights();
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
			if (element.properties) {
				Object.values(element.properties).forEach(prop => {
					if (prop && prop.name) element.properties[prop.name] = prop.value
				})
			}
			return element
		}
	})
}

export function goToLevel(levelName) {
	if (game.level) game.level.exit();
	game.level = new Level(levels[levelName])
}

export function positionPlayerAtStartOfLevel() {
	Object.assign(game.player.position, {
		x: game.level.startPosition.x * 16 + 8,
		y: game.level.startPosition.y * 16 + 8,
	});
}