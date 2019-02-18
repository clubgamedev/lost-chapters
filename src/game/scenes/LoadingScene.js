import { loadAudio } from "../utils/audio"

export class LoadingScene {
	preload() {
		const loadingBar = this.add.sprite(0, game.height / 2 - 10, "loading");
		game.load.setPreloadSprite(loadingBar);
		// load title screen
		game.load.image("title-bg", "assets/sprites/title-screen.png");
		game.load.image("enter", "assets/sprites/press-enter-text.png");
		game.load.image("instructions", "assets/sprites/instructions.png");
		game.load.image("gameover", "assets/sprites/game-over.png");
		game.load.image("dialog-box", "assets/ui/dialog-box.png");
		game.load.image("dialog-choice-box", "assets/ui/dialog-choice-box.png");

		// tileset
		game.load.image("tileset_forest", "assets/environment/forest_tileset.png");
		game.load.image("tileset_inside", "assets/environment/inside_tileset.png");
		game.load.image("tileset_cave", "assets/environment/cave_tileset.png");
		game.load.image("tileset_dungeon", "assets/environment/dungeon_tileset.png");
		game.load.image("objects", "assets/environment/objects.png");
		game.load.image("collisions", "assets/environment/collisions.png");
		game.load.tilemap("map_forest", "assets/maps/forest.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_cave", "assets/maps/terrier.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_autel", "assets/maps/autel.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_school", "assets/maps/universite.json", null, Phaser.Tilemap.TILED_JSON);

		// atlas
		game.load.atlasJSONArray(
			"atlas",
			"assets/atlas/atlas.png",
			"assets/atlas/atlas.json"
		);
		game.load.atlasJSONArray(
			"atlas-props",
			"assets/atlas/atlas-props.png",
			"assets/atlas/atlas-props.json"
		);

		// spritesheets
		game.load.spritesheet('michel', 'assets/characters/michel.png', 32, 32, 9);
		game.load.spritesheet('michelle', 'assets/characters/michelle.png', 32, 32, 9);
		game.load.spritesheet('indiana', 'assets/characters/indiana.png', 32, 32, 9);
		game.load.spritesheet('anna', 'assets/characters/anna.png', 32, 32, 9);
		game.load.spritesheet('franck', 'assets/characters/franck.png', 32, 32, 9);
		game.load.spritesheet('augustin', 'assets/characters/augustin.png', 32, 32, 9);
		game.load.spritesheet('cultist', 'assets/characters/cultist.png', 32, 32, 9);

		game.load.spritesheet("runes", 'assets/decryptor/runes.png', 16, 16, 8);
		game.load.spritesheet("chaudron", 'assets/alchemy/chaudron.png', 32, 32, 2);
		game.load.spritesheet("fire", 'assets/environment/fireplace.png', 16, 20, 12);

		game.load.spritesheet("lucidity-bar", 'assets/ui/lucidity-bar.png', 24, 8, 16);

		// images
		game.load.image("exit", "assets/environment/exit-open.png");
		game.load.image("chalet", "assets/escape/chalet.png");

		// audio
		loadAudio();
	}

	create() {
		this.game.state.start('EscapeGame');
		
		// this.game.state.start("TitleScreen");
	}
}