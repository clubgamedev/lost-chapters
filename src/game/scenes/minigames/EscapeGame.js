import { loadSave } from "../../save";
import { Digicode } from "../../items/escape/Digicode";
import { PushButton } from "../../items/escape/PushButton";
import { Wheel } from "../../items/escape/Wheel";
import { gameWidth, gameHeight } from "../../lostchapters";
import { Plant } from "../../items/escape/Plant"
import { Tool } from "../../items/escape/Tool"
import { ButtonGrid } from "../../items/escape/ButtonGrid";
import { Scie } from "../../items/escape/Scie";
import { Cable } from "../../items/escape/Cable";

export class EscapeGameScene {

    plant;
    pushButton;
    digicode;
    wheel;
    tool;
    buttonGrid;
    scie;
    cable;
    coverSprite;
    circuitSprite;
    feuilleSprite;
    tableau;

    preload() {
        this.tool = new Tool(() => this.onToolActivate());
        this.plant = new Plant(this.tool);
        this.pushButton = new PushButton((count) => this.onPushButtonClicked(count));
        this.digicode = new Digicode(() => this.onDigicodeCodeValid());
        this.wheel = new Wheel();
        this.buttonGrid = new ButtonGrid(() => this.onButtonGridCodeValid());
        this.cable = new Cable(this.digicode);
        this.scie = new Scie(this.cable);
    }
    
    create() {
        game.scale.setGameSize(gameWidth, gameHeight);
        game.add.image(0, 0, 'escape_etablie');

        this.digicode.create(197, 34);
        this.plant.create(130, 8);
        this.pushButton.create(105, 98);
        this.buttonGrid.create(99, 59);
        this.scie.create(52, 82);

        this.circuitSprite = game.add.image(48, 39, 'escape_circuit', 0);
        this.feuilleSprite = game.add.image(120, 90, 'escape_feuilles');
        this.coverSprite = game.add.image(44, 27, 'escape_cover');
        this.tableau = game.add.image(189, 28, 'escape_tableau');
        this.tableau.animations.add('open');

        this.enableLeaveSceneAction();
    }

    update() {
        this.wheel.update();
        this.plant.update();
        this.tool.update();
        this.cable.update();
    }

    onPushButtonClicked(count) {
        switch (count) {
            case 1:
                this.wheel.create(151, 85, this);
                // TODO Supprimer
                this.scie.openScie();
                // TODO Supprimer
                this.scie.activate();
                break;

            case 2:
                this.tableau.animations.play('open', 10, false);
                break;

            case 5:
                this.scie.openScie();
                break;

            case 10:
                this.scie.activate();
                break;
        }
    }

    onToolActivate() {
        this.circuitEnabled = true;
        this.circuitSprite.frame = 1;
        game.add.image(72, 57, 'escape_screen9');
    }

    onButtonGridCodeValid() {
        if (this.circuitEnabled) game.add.image(78, 57, 'escape_screen3');
        return this.circuitEnabled;
    }

    onDigicodeCodeValid() {
        let parchemin = game.add.image(203, 82, 'parchemin');
        parchemin.inputEnabled = true;
        parchemin.events.onInputDown.add(() => {
            parchemin.visible = false;
            game.save.inventory.parchemin = 1;
        });
    }

    enableLeaveSceneAction() {
        let startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(() => {
            loadSave();
            game.state.start('MainGame');
        });
    }
}