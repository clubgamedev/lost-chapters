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
		game.load.image("book-bg", "assets/ui/book.png");
		game.load.image("page-bg", "assets/ui/page.png");

		// tileset
		game.load.image("tileset_forest", "assets/environment/forest_tileset.png");
		game.load.image("tileset_inside", "assets/environment/inside_tileset.png");
		game.load.image("tileset_outside", "assets/environment/outside_tileset.png");
		game.load.image("tileset_cave", "assets/environment/cave_tileset.png");
		game.load.image("tileset_dungeon", "assets/environment/dungeon_tileset.png");
		game.load.image("collisions", "assets/environment/collisions.png");
		game.load.tilemap("map_forest", "assets/maps/forest.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_cave", "assets/maps/terrier.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_autel", "assets/maps/autel.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_school", "assets/maps/universite.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_sanctuary", "assets/maps/sanctuaire.json", null, Phaser.Tilemap.TILED_JSON);

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
		game.load.spritesheet('howard', 'assets/characters/howard.png', 32, 32, 9);
		game.load.spritesheet('michelle', 'assets/characters/michelle.png', 32, 32, 9);
		game.load.spritesheet('franck', 'assets/characters/franck.png', 32, 32, 9);
		game.load.spritesheet('therled', 'assets/characters/therled.png', 32, 32, 9);
		game.load.spritesheet('marie', 'assets/characters/marie.png', 32, 32, 9);
		game.load.spritesheet('augustin', 'assets/characters/augustin.png', 32, 32, 9);
		game.load.spritesheet('cultist', 'assets/characters/cultist.png', 32, 32, 9);
		game.load.spritesheet('ramsey', 'assets/characters/ramsey.png', 32, 32, 9);
		game.load.spritesheet('etudiant', 'assets/characters/etudiant.png', 32, 32, 9);
		game.load.spritesheet('sbire', 'assets/characters/sbire.png', 32, 32, 9);

		game.load.spritesheet("runes", 'assets/decryptor/runes.png', 16, 16, 8);
		game.load.spritesheet("chaudron", 'assets/alchemy/chaudron.png', 32, 32, 2);
		game.load.spritesheet("fire", 'assets/environment/fireplace.png', 16, 20, 12);

		game.load.spritesheet("lucidity-bar", 'assets/ui/lucidity-bar.png', 24, 8, 16);
		game.load.spritesheet("interactions", 'assets/ui/interactions.png', 24, 24, 8);

		// images
		game.load.image("exit", "assets/environment/exit-open.png");
		game.load.image("chalet", "assets/escape/chalet.png");

		// audio
		loadAudio();
	}

	create() {
		// this.game.state.start('EscapeGame');

		this.game.state.start("TitleScreen");
	}
}