import { loadSave } from "../../save";
import { Digicode } from "../../items/escape/Digicode";
import { PushButton } from "../../items/escape/PushButton";
import { Wheel } from "../../items/escape/Wheel";
import { gameWidth, gameHeight } from "../../lostchapters";
import { Plant } from "../../items/escape/Plant"
import { Tool } from "../../items/escape/Tool"
import { ButtonGrid } from "../../items/escape/ButtonGrid";
import { Scie } from "../../items/escape/Scie";

export class EscapeGameScene {

    plant;
    pushButton;
    digicode;
    wheel;
    tool;
    buttonGrid;
    scie;
    coverSprite;
    circuitSprite;
    feuilleSprite;
    tableau;

    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.image('cover', 'assets/escape/cover.png');
        game.load.image('feuilles', 'assets/escape/feuilles.png');
        game.load.spritesheet('circuit', 'assets/escape/circuit.png', 51, 36, 2);
        game.load.spritesheet('tableau', 'assets/escape/tableau.png', 48, 42, 5);
        game.load.image('screen2', 'assets/escape/ecran_2.png');
        game.load.image('screen3', 'assets/escape/ecran_3.png');
        game.load.image('screen9', 'assets/escape/ecran_9.png');

        this.tool = new Tool(() => this.onToolActivate());
        this.plant = new Plant(this.tool);
        this.pushButton = new PushButton((count) => this.onPushButtonClicked(count));
        this.digicode = new Digicode();
        this.wheel = new Wheel();
        this.buttonGrid = new ButtonGrid(() => this.onButtonGridCodeValid());
        this.scie = new Scie();
    }
    
    create() {
        game.scale.setGameSize(gameWidth, gameHeight);
        game.add.image(0, 0, 'etablie');

        this.digicode.create(197, 34);
        this.plant.create(130, 8);
        this.pushButton.create(105, 98);
        this.buttonGrid.create(99, 59);
        this.scie.create(52, 82);

        this.circuitSprite = game.add.image(48, 39, 'circuit', 0);
        this.feuilleSprite = game.add.image(120, 90, 'feuilles');
        this.coverSprite = game.add.image(44, 27, 'cover');
        this.tableau = game.add.image(189, 28, 'tableau');
        this.tableau.animations.add('open');

        this.enableLeaveSceneAction();
    }

    update() {
        this.wheel.update();
        this.plant.update();
        this.tool.update();
    }

    onPushButtonClicked(count) {
        switch (count) {
            case 1:
                this.wheel.create(151, 85, this);
                break;

            case 2:
                this.tableau.animations.play('open', 10, false);
                break;

            case 3:
                this.scie.openScie();
                break;
// TODO a supprimer
            case 4:
                this.scie.activate();
                break;
        }
    }

    onToolActivate() {
        this.circuitEnabled = true;
        this.circuitSprite.frame = 1;
        game.add.image(72, 57, 'screen9');
    }

    onButtonGridCodeValid() {
        if (this.circuitEnabled) game.add.image(78, 57, 'screen3');
        return this.circuitEnabled;
    }

    enableLeaveSceneAction() {
        let startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(() => {
            loadSave();
            game.state.start('MainGame');
        });
    }
}