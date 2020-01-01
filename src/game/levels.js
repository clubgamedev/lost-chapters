import { Rat } from "./characters/Rat"
import { Spider } from "./characters/Spider"
import { Cultist } from "./characters/Cultist"
import { Character, CHARACTER_STATE } from "./characters/Character"
import { Runes, Chaudron, Book, Page, Description, EscapeTable, Loot, Bloc } from "./items/"
import { Fire } from "./effects/Fire";
import { AmbientLight } from "./effects/AmbientLight";
import { Hallucination } from "./effects/Hallucination";
import RenderGroup from "./utils/RenderGroup";
import { findObjectsByType } from "./utils/map";
import { initLights, updateLights, clearLights } from "./utils/Light";
import { showMiddleText } from "./utils/message"
import { lockedExits } from "./dialogs/descriptions";
import { startMusic } from "./audio";
import { destroyMurSecret } from "./items/Bloc"

export const schoolLevel = {
	title: "L'Université",
	tilemap: "map_school",
	tilesets: ["tileset_inside"],
	music: "music_school",
	lightRadius: 100,
	obscurity: 1,
	footstepSounds: "FOOTSTEPS_WOOD"
}

export const sanctuaireLevel = {
	title: "Le Sanctuaire",
	tilemap: "map_sanctuary",
	tilesets: ["tileset_forest", "tileset_outside"],
	music: "music_sanctuary",
	lightRadius: 150,
	obscurity: 1,
	fog: true,
	tint: 0xC0A8D0,
	footstepSounds: "FOOTSTEPS_EARTH"
}

export const forestLevel = {
	title: "La forêt",
	tilemap: "map_forest",
	tilesets: ["tileset_forest", "tileset_outside"],
	music: "music_forest",
	lightRadius: 120,
	fog: true,
	tint: 0xB090C0,
	footstepSounds: "FOOTSTEPS_EARTH"
}

export const caveLevel = {
	title: "Le Terrier",
	tilemap: "map_cave",
	tilesets: ["tileset_cave"],
	music: "music_cave",
	lightRadius: 80,
	obscurity: 0.75,
	tint: 0xD0B090,
	footstepSounds: "FOOTSTEPS_MUD"
}

export const autelLevel = {
	title: "L'autel",
	tilemap: "map_autel",
	tilesets: ["tileset_cave", "tileset_dungeon"],
	music: "music_autel",
	lightRadius: 85,
	obscurity: 1,
	tint: 0xFFE0C0,
	footstepSounds: "FOOTSTEPS_MUD"
}

export const levels = {
	school: schoolLevel,
	sanctuaire: sanctuaireLevel,
	forest: forestLevel,
	cave: caveLevel,
	autel: autelLevel
}

export class Level {
	constructor(technicalName) {
		Object.assign(this, levels[technicalName]);
		this.name = technicalName;
		this.createTileMap(this.tilemap, this.tilesets)
		this.createGroups()
		this.createEnemies()
		this.createCharacters();
		this.createObjects();
		this.createTriggers();
		this.createLights()

		if (game.save.level !== technicalName) { // si on a changé de level
			showMiddleText(this.title);
		}
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

		game.groups.lightSources = game.add.group(game.groups.render, "lightSources");

		game.groups.characters = game.add.group(game.groups.render, "characters");
		game.groups.characters.enableBody = true
		game.groups.characters.add(game.player)

		game.groups.enemies = game.add.group(game.groups.characters, "enemies")
		game.groups.pnj = game.add.group(game.groups.characters, "pnj")

		game.groups.objects = game.add.group(game.groups.render, "objects")
		game.groups.objects.enableBody = true
		game.groups.nonCollidableObjects = game.add.group(game.groups.render, "nonCollidableObjects")

		game.groups.triggers = game.add.group(game.groups.render, "triggers");
		game.groups.triggers.enableBody = true

		this.layerFront.bringToTop();

		game.groups.lights = game.add.group(undefined, "lights");

		game.groups.fx = game.add.group(undefined, "effects");
		game.groups.fx.add(game.player.interactionSprite);

		game.groups.hud = game.add.group(undefined, "hud");
	}

	createEnemies() {
		const enemies = { rat: Rat, spider: Spider, cultist: Cultist };
		Object.entries(enemies).forEach(([enemyType, Constructor]) => {
			findObjectsByType(enemyType, this.tilemap, "Object Layer").forEach(enemy => {
				let verticalMove = enemy.properties && enemy.properties.vertical === true
				game.groups.enemies.add(
					new Constructor({ x: enemy.x / 16, y: (enemy.y - 8) / 16 }, verticalMove)
				)
			})
		})
	}

	createCharacters() {
		findObjectsByType("character", this.tilemap, "Object Layer").forEach(character => {
			let characterName = character.name;
			let state = character.properties.state;
			let pnj = new Character(game, { x: character.x / 16, y: character.y / 16 }, characterName, CHARACTER_STATE[state])
			pnj.properties = character.properties;
			pnj.body.setSize(18, 14, 6, 18);
			game.groups.pnj.add(pnj)
		})
	}

	createObjects() {
		const objects = {
			runes: Runes,
			chaudron: Chaudron,
			escapeTable: EscapeTable,
			book: Book,
			page: Page,
			description: Description,
			loot: Loot,
			bloc: Bloc,
			hallucination: Hallucination
		};

		const NON_COLLIDABLE_OBJECTS = [Runes, Book, Page, Description, Loot];

		Object.entries(objects).forEach(([objectType, Constructor]) => {
			findObjectsByType(objectType, this.tilemap, "Object Layer").forEach(object => {
				let sprite = new Constructor({
					x: object.x / 16,
					y: object.y / 16
				}, {
					width: object.width,
					height: object.height,
					name: object.name,
					...(object.properties || {})
				})
				object.sprite = sprite;
				if (NON_COLLIDABLE_OBJECTS.includes(Constructor)) {
					game.groups.nonCollidableObjects.add(sprite)
				} else {
					game.groups.objects.add(sprite)
				}
			})
		})

		if (this.name === "school" && game.save.hasDiscoveredSecretPassage) {
			destroyMurSecret(true, this.tilemap);
		}
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
					game.camera.setPosition(
						destination.x + destination.width / 2 + (destination.properties.camera_dx || 0) - game.camera.view.width / 2,
						destination.y + destination.height / 2 - 8 + (destination.properties.camera_dy || 0) - game.camera.view.height / 2
					);
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
			exitSprite.action = async () => {
				if (exit.properties.lock in lockedExits) {
					if (!game.save.unlockedExits.includes(exit.properties.lock)) {
						game.disableTriggers = true;
						await lockedExits[exit.properties.lock]();
						game.disableTriggers = false;
						if (!game.save.unlockedExits.includes(exit.properties.lock)) return;
					}
				}

				game.disableTriggers = true;  // to avoid triggers while changing level
				let levelName = exit.properties.level;
				game.camera.fade(0x000000, 400)
				setTimeout(() => {
					const startPosition = goToLevel(levelName, exit.properties.start)
					setTimeout(() => {
						game.camera.follow(game.player);
						game.camera.flash(0x000000, 400, true)
						game.disableTriggers = false;
						game.player.state = CHARACTER_STATE[startPosition.properties?.lookdir] || "DOWN"
					}, 10);
				}, 400);
			}
		})

		const triggers = findObjectsByType("trigger", this.tilemap, "Object Layer")
		triggers.forEach(trigger => {
			let sprite = game.add.sprite(trigger.x, trigger.y, "collisions")
			sprite.alpha = 0;
			sprite.width = trigger.width;
			sprite.height = trigger.height;
			game.groups.triggers.add(sprite)
			sprite.action = () => {
				switch (trigger.properties.action) {
					case "camera_follow": game.camera.follow(game.player); break;
					case "camera_unfollow": game.camera.unfollow(); break;
				}
			}
		})
	}

	createLights(enableMapLights = true) {
		initLights(this.lightRadius, this.obscurity, this.hue, this.fog);
		game.player.tint = this.tint || 0xFFFFFF;
		game.groups.pnj.forEach(pnj => { pnj.tint = this.tint || 0xFFFFFF })
		const lightSources = { fire: Fire, light: AmbientLight };

		if (enableMapLights) {
			Object.entries(lightSources).forEach(([objectType, Constructor]) => {
				findObjectsByType(objectType, this.tilemap, "Object Layer").forEach(lightSource => {
					let sprite = new Constructor({ x: lightSource.x / 16, y: lightSource.y / 16 }, lightSource.properties)
					game.groups.lightSources.add(sprite);
				})
			})
		}
	}

	update() {
		updateLights();
		//TODO: faire un setInterval 500ms plutot que de fr ça à chaque frame
		if (game.music && game.music._sound) {
			let t = game.time.totalElapsedSeconds();
			game.music._sound.playbackRate.value = 1 + Math.sin(t) * (16 - game.player.lucidity) * 0.0026;
		}
	}

	exit() {
		this.clearTileMap();
		clearLights();
	}


}

export function goToLevel(levelName, startId) {
	if (game.level) {
		game.level.exit();
	}
	game.level = new Level(levelName)
	startMusic(game.level.music);

	game.player.loadTexture(["cave", "autel"].includes(levelName) ? "cultist" : "howard", 0);
	if (game.save.playerPosition && game.save.level === levelName) {
		return Object.assign(game.player.position, game.save.playerPosition);
	} else {
		return positionPlayerAtStartOfLevel(startId);
	}
}

export function positionPlayerAtStartOfLevel(id = 1) {
	let startPosition = findObjectsByType("start", game.level.tilemap, "Object Layer").find(el => el.properties.id === id)
	return Object.assign(game.player.position, {
		x: startPosition.x + 8,
		y: startPosition.y,
	});
}