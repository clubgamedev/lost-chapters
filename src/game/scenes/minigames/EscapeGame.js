import { Game } from "phaser-ce";
import { loadSave } from "../../save";

export class EscapeGameScene {

    boutonPoussoir;
    digicodeBigGroup;
    isDigicodePointerOut = true;
    boutonPoussoirClickCount = 0;

    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.image('potfleur', 'assets/escape/potfleur.png');
        game.load.image('roue', 'assets/escape/roue.png');
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
        game.load.spritesheet('bouton_poussoir', 'assets/escape/bouton_poussoir.png', 24, 27, 2);
    }

    create() {
        game.scale.setGameSize(800, 450);
        
        this.createEtablie();
        this.createPotFleur();
        this.createBoutonPoussoir();
        this.enableLeaveSceneAction();
    }

    createEtablie() {
        let etablie = game.add.image(0, 0, 'etablie');
        etablie.inputEnabled = true;
        etablie.events.onInputDown.add(() => {
            if (this.isDigicodePointerOut && this.digicodeBigGroup) {
                this.digicodeBigGroup.visible = false;
            }
        });
    }

    createPotFleur() {
        game.add.image(200, 11, 'potfleur');
    }

    createBoutonPoussoir() {
        this.boutonPoussoir = game.add.image(125, 340, 'bouton_poussoir', 0);
        this.boutonPoussoir.inputEnabled = true;
        this.boutonPoussoir.events.onInputDown.add(() => this.onBoutonPoussoirClicked());
        this.boutonPoussoir.events.onInputUp.add(() => this.boutonPoussoir.frame = 0);
    }

    onBoutonPoussoirClicked() {
        this.boutonPoussoir.frame = 1;
        this.boutonPoussoirClickCount++;

        switch (this.boutonPoussoirClickCount) {
            case 1 :
            this.createDigicode();
            break;

            case 3:
            this.createRoue();
            break;
        }
    }

    createDigicode() {
        let digicode = game.add.image(495, 342, 'digicode');
        digicode.inputEnabled = true;
        digicode.events.onInputDown.add(() => this.digicodeBigGroup.visible = true);

        let digicodeBigX = 450;
        let digicodeBigY = 250;
        let scale = 4;

        this.digicodeBigGroup = game.add.group()
        this.digicodeBigGroup.visible = false;
        this.digicodeBigGroup.inputEnableChildren = true;
        this.digicodeBigGroup.onChildInputOut.add(() => this.isDigicodePointerOut = true);
        this.digicodeBigGroup.onChildInputOver.add(() => this.isDigicodePointerOut = false);

        this.digicodeBigGroup.create(digicodeBigX, digicodeBigY, "digicode_boite").scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 3 * scale, digicodeBigY + 17 * scale, "digicode_cable", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 3 * scale, digicodeBigY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 11 * scale, digicodeBigY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 19 * scale, digicodeBigY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 27 * scale, digicodeBigY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 3 * scale, digicodeBigY + 8 * scale, "digicode_ledonoff", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 10 * scale, digicodeBigY + 8 * scale, "digicode_btn1", 0).scale.setTo(scale, scale);

        // let btn1 = this.digicodeGroup.create(DIGICODE_X + 10, DIGICODE_Y + 8, "digicode_btn1", 0);
        // let btn1 = this.digicodeGroup.create(DIGICODE_X - 50, DIGICODE_Y - 50, "digicode_btn1", 0);
        // btn1.scale.setTo(4, 4);
        // btn1.inputEnabled = true;
        // btn1.events.onInputDown.add(() => {btn1.frame = 1;});
        // btn1.events.onInputUp.add(() => {btn1.frame = 0;});

        this.digicodeBigGroup.create(digicodeBigX + 17 * scale, digicodeBigY + 8 * scale, "digicode_btn2", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 24 * scale, digicodeBigY + 8 * scale, "digicode_btn3", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 10 * scale, digicodeBigY + 19 * scale, "digicode_btn4", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 17 * scale, digicodeBigY + 19 * scale, "digicode_btn5", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 24 * scale, digicodeBigY + 19 * scale, "digicode_btn6", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 10 * scale, digicodeBigY + 30 * scale, "digicode_btn7", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 17 * scale, digicodeBigY + 30 * scale, "digicode_btn8", 0).scale.setTo(scale, scale);
        this.digicodeBigGroup.create(digicodeBigX + 24 * scale, digicodeBigY + 30 * scale, "digicode_btn9", 0).scale.setTo(scale, scale);
    }

    createRoue() {
        this.roue = game.add.image(568, 102, 'roue');
    }

    enableLeaveSceneAction() {
        let startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(() => {
            loadSave();
            game.state.start('MainGame');
        });
    }
}