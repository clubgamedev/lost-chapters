import { Game } from "phaser-ce";
import { loadSave } from "../../save";

export class EscapeGameScene {
    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.image('potfleur', 'assets/escape/potfleur1.png');
        game.load.image('digicode_boite', 'assets/escape/digicode_boite.png');
        game.load.spritesheet('digicode_ledbot', 'assets/escape/digicode_ledbot.png', 4, 5, 2);
    }

    create() {
        game.scale.setGameSize(800, 450);
        
        game.add.image(0, 0, "etablie");
        game.add.image(100, 200, "potfleur");
        game.add.image(495, 342, "digicode_boite");
        game.add.image(498, 383, "digicode_ledbot", 1);

        const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(this.quitGame, this);
    }

    update() {

    }

    quitGame() {
        loadSave();
        game.state.start('MainGame');
    }
}