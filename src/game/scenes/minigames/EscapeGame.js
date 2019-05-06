import { Game } from "phaser-ce";
import { loadSave } from "../../save";
import { Digicode } from "../../items/escape/Digicode";
import { BoutonPoussoir } from "../../items/escape/BoutonPoussoir";
import { Wheel } from "../../items/escape/Wheel";

export class EscapeGameScene {

    digicode;
    boutonPoussoir;
    wheel;
    coverSprite;

    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.image('potfleur', 'assets/escape/potfleur.png');
        game.load.image('cover', 'assets/escape/cover.png');
        game.load.image('outils1', 'assets/escape/outils_1.png');
        game.load.image('outils2', 'assets/escape/outils_2.png');

        this.boutonPoussoir = new BoutonPoussoir();
        this.digicode = new Digicode();
        this.wheel = new Wheel();
    }

    create() {
        game.scale.setGameSize(800, 450);
        
        let etablie = game.add.image(0, 0, 'etablie');
        etablie.inputEnabled = true;
        etablie.events.onInputDown.add(() => this.digicode.clickOut());
        
        // outils
        // game.add.image(104, 70, 'outils1');
        // game.add.image(180, 150, 'outils2');

        game.add.image(200, 11, 'potfleur');
        this.coverSprite = game.add.image(94, 63, 'cover');
        this.boutonPoussoir.create(125, 340, (count) => this.onBoutonPoussoirCLicked(count));
        this.wheel.create(568, 102, this.coverSprite);

        this.enableLeaveSceneAction();
    }

    update() {
        this.wheel.update();
    }
 
    onBoutonPoussoirCLicked(count) {
        switch (count) {
            case 1 :
            this.digicode.create(495, 342);
            break;

            case 3:
            this.wheel.create(568, 102, this.coverSprite);
            break;
        }
    }

    // createDigicode() {
    //     let digicode = game.add.image(495, 342, 'digicode');
    //     digicode.inputEnabled = true;
    //     digicode.events.onInputDown.add(() => this.digicodeBigGroup.visible = true);

    //     let digicodeBigX = 450;
    //     let digicodeBigY = 250;
    //     let scale = 4;

    //     this.digicodeBigGroup = game.add.group()
    //     this.digicodeBigGroup.visible = false;
    //     this.digicodeBigGroup.inputEnableChildren = true;
    //     this.digicodeBigGroup.onChildInputOut.add(() => this.isDigicodePointerOut = true);
    //     this.digicodeBigGroup.onChildInputOver.add(() => this.isDigicodePointerOut = false);

    //     this.digicodeBigGroup.create(digicodeBigX, digicodeBigY, "digicode_boite").scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 3 * scale, digicodeBigY + 17 * scale, "digicode_cable", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 3 * scale, digicodeBigY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 11 * scale, digicodeBigY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 19 * scale, digicodeBigY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 27 * scale, digicodeBigY + 41 * scale, "digicode_ledbot", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 3 * scale, digicodeBigY + 8 * scale, "digicode_ledonoff", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 10 * scale, digicodeBigY + 8 * scale, "digicode_btn1", 0).scale.setTo(scale, scale);

    //     // let btn1 = this.digicodeGroup.create(DIGICODE_X + 10, DIGICODE_Y + 8, "digicode_btn1", 0);
    //     // let btn1 = this.digicodeGroup.create(DIGICODE_X - 50, DIGICODE_Y - 50, "digicode_btn1", 0);
    //     // btn1.scale.setTo(4, 4);
    //     // btn1.inputEnabled = true;
    //     // btn1.events.onInputDown.add(() => {btn1.frame = 1;});
    //     // btn1.events.onInputUp.add(() => {btn1.frame = 0;});

    //     this.digicodeBigGroup.create(digicodeBigX + 17 * scale, digicodeBigY + 8 * scale, "digicode_btn2", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 24 * scale, digicodeBigY + 8 * scale, "digicode_btn3", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 10 * scale, digicodeBigY + 19 * scale, "digicode_btn4", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 17 * scale, digicodeBigY + 19 * scale, "digicode_btn5", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 24 * scale, digicodeBigY + 19 * scale, "digicode_btn6", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 10 * scale, digicodeBigY + 30 * scale, "digicode_btn7", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 17 * scale, digicodeBigY + 30 * scale, "digicode_btn8", 0).scale.setTo(scale, scale);
    //     this.digicodeBigGroup.create(digicodeBigX + 24 * scale, digicodeBigY + 30 * scale, "digicode_btn9", 0).scale.setTo(scale, scale);
    // }

    // createRoue() {
    //     this.roue = game.add.image(568, 102, 'roue');
    // }

    enableLeaveSceneAction() {
        let startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(() => {
            loadSave();
            game.state.start('MainGame');
        });
    }
}