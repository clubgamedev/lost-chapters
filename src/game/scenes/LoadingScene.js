import { loadAudio } from "../audio"

export class LoadingScene {
	preload() {

		const loadingText = game.add.text(game.world.centerX, game.world.height - 20, "Chargement...", {
			font: "16px Alagard",
			fill: "white",
			align: "center"
		})
		loadingText.anchor.set(0.5);

		const loadingBar = this.add.sprite(0, game.height / 2 - 10, "loading");
		game.load.setPreloadSprite(loadingBar);
		// load title screen
		game.load.image("title-bg", "assets/sprites/title-screen.png");
		game.load.image("enter", "assets/sprites/press-enter-text.png");
		game.load.image("instructions", "assets/sprites/instructions.png");
		game.load.image("credits", "assets/sprites/credits.png");
		game.load.image("gameover", "assets/sprites/game-over.png");

		// tileset
		game.load.image("tileset_forest", "assets/environment/forest_tileset.png");
		game.load.image("tileset_inside", "assets/environment/inside_tileset.png");
		game.load.image("tileset_outside", "assets/environment/outside_tileset.png");
		game.load.image("tileset_cave", "assets/environment/cave_tileset.png");
		game.load.image("tileset_dungeon", "assets/environment/dungeon_tileset.png");
		game.load.tilemap("map_forest", "assets/maps/forest.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_cave", "assets/maps/terrier.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_autel", "assets/maps/autel.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_school", "assets/maps/universite.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap("map_sanctuary", "assets/maps/sanctuaire.json", null, Phaser.Tilemap.TILED_JSON);

		// spritesheets
		game.load.spritesheet('howard', 'assets/characters/howard.png', 32, 32, 9);
		game.load.spritesheet('michelle', 'assets/characters/michelle.png', 32, 32, 9);
		game.load.spritesheet('franck', 'assets/characters/franck.png', 32, 32, 9);
		game.load.spritesheet('therled', 'assets/characters/therled.png', 32, 32, 9);
		game.load.spritesheet('marie', 'assets/characters/marie.png', 32, 32, 9);
		game.load.spritesheet('arthur', 'assets/characters/arthur.png', 32, 32, 9);
		game.load.spritesheet('cultist', 'assets/characters/cultist.png', 32, 32, 9);
		game.load.spritesheet('ramsey', 'assets/characters/ramsey.png', 32, 32, 9);
		game.load.spritesheet('etudiant', 'assets/characters/etudiant.png', 32, 32, 9);
		game.load.spritesheet('sbire', 'assets/characters/sbire.png', 32, 32, 9);
		game.load.spritesheet('rat', 'assets/characters/rat.png', 32, 32, 9);
		game.load.spritesheet('spider', 'assets/characters/spider.png', 32, 32, 9);

		game.load.spritesheet("runes", 'assets/decryptor/runes.png', 16, 16, 8);
		game.load.spritesheet("chaudron", 'assets/alchemy/marmite.png', 32, 32, 4);
		game.load.spritesheet("fire", 'assets/environment/fireplace.png', 16, 20, 12);

		game.load.spritesheet("lucidity-bar", 'assets/ui/lucidity-bar.png', 24, 8, 16);
		game.load.spritesheet("interactions", 'assets/ui/interactions.png', 24, 24, 8);
		game.load.spritesheet("fake_tree", "assets/environment/fake_tree.png", 96, 128, 2);

		game.load.spritesheet("collisions", "assets/environment/collisions.png", 16, 16, 8);

		// images
		game.load.image("dialog-box", "assets/ui/dialog-box2.png");
		game.load.image("dialog-choice-box", "assets/ui/dialog-choice-box.png");
		game.load.image("dialog-myself-box", "assets/ui/dialog-myself-box.png");
		game.load.image("book-bg", "assets/ui/book.png");
		game.load.image("page-bg", "assets/ui/page.png");
		game.load.image("exit", "assets/environment/exit-open.png");
		game.load.image("chalet", "assets/escape/chalet.png");

		// items
		game.load.image('potionDueForce', 'assets/items/potionDeForce.png');
		game.load.image('fioleDeSang', 'assets/items/fioleDeSang.png');
		game.load.image('potionDeLucidite', 'assets/items/potionDeLucidite.png');
		game.load.image('potionDeProtection', 'assets/items/potionDeProtection.png');
		game.load.image('parchemin', 'assets/items/parchemin.png');
		game.load.image('cape', 'assets/items/cape.png');
		game.load.image('foieDeCerf', 'assets/items/foieDeCerf.png');

		// audio
		loadAudio();
		this.loadEscape();
	}

	create() {
		this.game.state.start("TitleScreen");
	}

	loadEscape() {
		game.load.image('escape_etablie', 'assets/escape/etablie.png');
        game.load.image('escape_cover', 'assets/escape/cover.png');
		game.load.image('escape_feuilles', 'assets/escape/feuilles.png');
		game.load.image('escape_screen2', 'assets/escape/ecran_2.png');
        game.load.image('escape_screen3', 'assets/escape/ecran_3.png');
		game.load.image('escape_screen9', 'assets/escape/ecran_9.png');
		game.load.image('escape_buttonGrid_socle', 'assets/escape/buttonGrid/socle.png');
		game.load.image('escape_digicode_boite', 'assets/escape/digicode/digicode_boite.png');
		game.load.image('escape_outil', 'assets/escape/outil.png');
        game.load.image('escape_outil_outline', 'assets/escape/outil_outline.png');
		
		game.load.spritesheet('escape_scie', 'assets/escape/scie.png', 52, 15, 16);
		game.load.spritesheet('escape_bouton_poussoir', 'assets/escape/bouton_poussoir.png', 16, 16, 2);
		game.load.spritesheet('escape_roue', 'assets/escape/wheel.png', 18, 18, 2);
		game.load.spritesheet('escape_potfleur', 'assets/escape/potfleur.png', 16, 16, 2);
		game.load.spritesheet('escape_digicode_leds', 'assets/escape/digicode/digicode_leds.png', 4, 5, 4);
        game.load.spritesheet('escape_digicode_cable', 'assets/escape/digicode/digicode_cable.png', 3, 19, 3);
        game.load.spritesheet('escape_digicode_btn1', 'assets/escape/digicode/digicode_btn1.png', 5, 8, 2);
        game.load.spritesheet('escape_digicode_btn2', 'assets/escape/digicode/digicode_btn2.png', 5, 8, 2);
        game.load.spritesheet('escape_digicode_btn3', 'assets/escape/digicode/digicode_btn3.png', 5, 8, 2);
        game.load.spritesheet('escape_digicode_btn4', 'assets/escape/digicode/digicode_btn4.png', 5, 8, 2);
        game.load.spritesheet('escape_digicode_btn5', 'assets/escape/digicode/digicode_btn5.png', 5, 8, 2);
        game.load.spritesheet('escape_digicode_btn6', 'assets/escape/digicode/digicode_btn6.png', 5, 8, 2);
        game.load.spritesheet('escape_digicode_btn7', 'assets/escape/digicode/digicode_btn7.png', 5, 8, 2);
        game.load.spritesheet('escape_digicode_btn8', 'assets/escape/digicode/digicode_btn8.png', 5, 8, 2);
        game.load.spritesheet('escape_digicode_btn9', 'assets/escape/digicode/digicode_btn9.png', 5, 8, 2);
		game.load.spritesheet('escape_digicode_cable', 'assets/escape/digicode/digicode_cable.png', 3, 19, 3);
		game.load.spritesheet('escape_circuit', 'assets/escape/circuit.png', 51, 36, 2);
        game.load.spritesheet('escape_tableau', 'assets/escape/tableau.png', 48, 42, 5);
        game.load.spritesheet('escape_buttonGrid_bouton1', 'assets/escape/buttonGrid/bouton1.png', 3, 4, 2);
        game.load.spritesheet('escape_buttonGrid_bouton2', 'assets/escape/buttonGrid/bouton2.png', 3, 4, 2);
        game.load.spritesheet('escape_buttonGrid_bouton3', 'assets/escape/buttonGrid/bouton3.png', 3, 4, 2);
        game.load.spritesheet('escape_buttonGrid_bouton4', 'assets/escape/buttonGrid/bouton4.png', 3, 4, 2);
        game.load.spritesheet('escape_buttonGrid_bouton5', 'assets/escape/buttonGrid/bouton5.png', 3, 4, 2);
        game.load.spritesheet('escape_buttonGrid_bouton6', 'assets/escape/buttonGrid/bouton6.png', 3, 4, 2);
        game.load.spritesheet('escape_buttonGrid_bouton7', 'assets/escape/buttonGrid/bouton7.png', 3, 4, 2);
        game.load.spritesheet('escape_buttonGrid_bouton8', 'assets/escape/buttonGrid/bouton8.png', 3, 4, 2);
	}
}