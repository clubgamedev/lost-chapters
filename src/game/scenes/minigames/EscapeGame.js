import { Game } from "phaser-ce";
import { loadSave } from "../../save";

export class EscapeGameScene {

    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.image('potfleur', 'assets/escape/potfleur.png');
        game.load.image('potfleur_casse', 'assets/escape/potfleur_casse.png');
        game.load.image('digicode_boite', 'assets/escape/digicode/digicode_boite.png');
        game.load.spritesheet('digicode_cable', 'assets/escape/digicode/digicode_cable.png', 3, 19, 2);
        game.load.spritesheet('digicode_ledbot', 'assets/escape/digicode/digicode_ledbot.png', 4, 5, 2);
        game.load.spritesheet('digicode_ledonoff', 'assets/escape/digicode/digicode_ledonoff.png', 4, 5, 2);
        game.load.spritesheet('digicode_btn1', 'assets/escape/digicode/digicode_btn1.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn2', 'assets/escape/digicode/digicode_btn2.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn3', 'assets/escape/digicode/digicode_btn3.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn4', 'assets/escape/digicode/digicode_btn4.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn5', 'assets/escape/digicode/digicode_btn5.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn6', 'assets/escape/digicode/digicode_btn6.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn7', 'assets/escape/digicode/digicode_btn7.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn8', 'assets/escape/digicode/digicode_btn8.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn9', 'assets/escape/digicode/digicode_btn9.png', 5, 8, 2);
    }

    create() {
        game.scale.setGameSize(800, 450);
        
        game.add.image(0, 0, "etablie");
        game.add.image(200, 11, "potfleur");

        this._createDigicode();
        
        const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(this._quitGame, this);
    }

    update() {

    }

    _click(image) {
        debugger;

    }

    _createDigicode() {
        let DIGICODE_X = 495;
        let DIGICODE_Y = 342;

        game.add.image(DIGICODE_X, DIGICODE_Y, "digicode_boite");
        game.add.image(DIGICODE_X + 3, DIGICODE_Y + 17, "digicode_cable", 0);
        game.add.image(DIGICODE_X + 3, DIGICODE_Y + 41, "digicode_ledbot", 0);
        game.add.image(DIGICODE_X + 11, DIGICODE_Y + 41, "digicode_ledbot", 0);
        game.add.image(DIGICODE_X + 19, DIGICODE_Y + 41, "digicode_ledbot", 0);
        game.add.image(DIGICODE_X + 27, DIGICODE_Y + 41, "digicode_ledbot", 0);
        game.add.image(DIGICODE_X + 3, DIGICODE_Y + 8, "digicode_ledonoff", 0);

        // let btn1 = game.add.image(DIGICODE_X + 10, DIGICODE_Y + 8, "digicode_btn1", 0);
        let btn1 = game.add.image(DIGICODE_X - 50, DIGICODE_Y - 50, "digicode_btn1", 0);
        btn1.scale.setTo(10, 10);
        btn1.inputEnabled = true;
        btn1.events.onInputDown.add(() => {btn1.frame = 1;});
        btn1.events.onInputUp.add(() => {btn1.frame = 0;});

        game.add.image(DIGICODE_X + 17, DIGICODE_Y + 8, "digicode_btn2", 0);
        game.add.image(DIGICODE_X + 24, DIGICODE_Y + 8, "digicode_btn3", 0);
        game.add.image(DIGICODE_X + 10, DIGICODE_Y + 19, "digicode_btn4", 0);
        game.add.image(DIGICODE_X + 17, DIGICODE_Y + 19, "digicode_btn5", 0);
        game.add.image(DIGICODE_X + 24, DIGICODE_Y + 19, "digicode_btn6", 0);
        game.add.image(DIGICODE_X + 10, DIGICODE_Y + 30, "digicode_btn7", 0);
        game.add.image(DIGICODE_X + 17, DIGICODE_Y + 30, "digicode_btn8", 0);
        game.add.image(DIGICODE_X + 24, DIGICODE_Y + 30, "digicode_btn9", 0);
    }

    _quitGame() {
        loadSave();
        game.state.start('MainGame');
    }
}