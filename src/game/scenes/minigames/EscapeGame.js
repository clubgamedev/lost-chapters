import { Game } from "phaser-ce";
import { loadSave } from "../../save";

export class EscapeGameScene {
    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
    }

    create() {
        game.scale.setGameSize(800, 450);
        game.add.image(0, 0, "etablie");

        const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(this.quitGame, this);
        // game.add.sprite(0, 0, 'etablie');
    }

    quitGame() {
        loadSave();
        game.state.start('MainGame');
    }

    update() {

    }
}