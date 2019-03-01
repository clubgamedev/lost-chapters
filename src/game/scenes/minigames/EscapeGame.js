import { Game } from "phaser-ce";
import { loadSave } from "../../save";

export class EscapeGameScene {

    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.image('potfleur', 'assets/escape/potfleur.png');
        game.load.image('potfleur_casse', 'assets/escape/potfleur_casse.png');
        game.load.image('digicode', 'assets/escape/digicode/digicode.png');
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
        
        let etablie = game.add.image(0, 0, 'etablie');
        etablie.inputEnabled = true;
        etablie.events.onInputDown.add(() => {
            if (this.isDigicodePointerOut) {
                this.digicodeGroup.visible = false;
            }
        });

        game.add.image(200, 11, 'potfleur');

        let digicode = game.add.image(495, 342, 'digicode');
        digicode.inputEnabled = true;
        digicode.events.onInputDown.add(() => this.digicodeGroup.visible = true);
        this.createDigicode();

        const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(this.quitGame, this);
    }

    digicodeGroup;
    isDigicodePointerOut = false;

    createDigicode() {
        let digicodeX = 450;
        let digicodeY = 250;
        let scale = 4;

        this.digicodeGroup = game.add.group()
        this.digicodeGroup.inputEnableChildren = true;
        this.digicodeGroup.onChildInputOut.add(() => this.isDigicodePointerOut = true);
        this.digicodeGroup.onChildInputOver.add(() => this.isDigicodePointerOut = false);

        this.digicodeGroup.create(digicodeX, digicodeY, "digicode_boite").scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 3 * scale, digicodeY + 17 * scale, "digicode_cable", 0);
        // image.scale.setTo(scale, scale);
        // image.events.onInputDown.add(() => {console.log("click on image")});
        this.digicodeGroup.create(digicodeX + 3 * scale, digicodeY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 11 * scale, digicodeY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 19 * scale, digicodeY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 27 * scale, digicodeY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 3 * scale, digicodeY + 8 * scale, "digicode_ledonoff", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 10 * scale, digicodeY + 8 * scale, "digicode_btn1", 0).scale.setTo(scale, scale);

        // let btn1 = this.digicodeGroup.create(DIGICODE_X + 10, DIGICODE_Y + 8, "digicode_btn1", 0);
        // let btn1 = this.digicodeGroup.create(DIGICODE_X - 50, DIGICODE_Y - 50, "digicode_btn1", 0);
        // btn1.scale.setTo(4, 4);
        // btn1.inputEnabled = true;
        // btn1.events.onInputDown.add(() => {btn1.frame = 1;});
        // btn1.events.onInputUp.add(() => {btn1.frame = 0;});

        this.digicodeGroup.create(digicodeX + 17 * scale, digicodeY + 8 * scale, "digicode_btn2", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 24 * scale, digicodeY + 8 * scale, "digicode_btn3", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 10 * scale, digicodeY + 19 * scale, "digicode_btn4", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 17 * scale, digicodeY + 19 * scale, "digicode_btn5", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 24 * scale, digicodeY + 19 * scale, "digicode_btn6", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 10 * scale, digicodeY + 30 * scale, "digicode_btn7", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 17 * scale, digicodeY + 30 * scale, "digicode_btn8", 0).scale.setTo(scale, scale);
        this.digicodeGroup.create(digicodeX + 24 * scale, digicodeY + 30 * scale, "digicode_btn9", 0).scale.setTo(scale, scale);
        this.digicodeGroup.visible = false;
    }

    quitGame() {
        loadSave();
        game.state.start('MainGame');
    }
}