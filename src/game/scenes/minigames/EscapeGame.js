import { Digicode } from "../../items/escape/Digicode";
import { PushButton } from "../../items/escape/PushButton";
import { Wheel } from "../../items/escape/Wheel";
import { gameWidth, gameHeight } from "../../lostchapters";
import { Plant } from "../../items/escape/Plant"
import { Tool } from "../../items/escape/Tool"
import { ButtonGrid } from "../../items/escape/ButtonGrid";
import { Scie } from "../../items/escape/Scie";
import { Cable } from "../../items/escape/Cable";
import { Feuilles } from "../../items/escape/Feuilles";
import { Labyrinthe } from '../../items/escape/Labyrinthe';
import { parcheminUnlock } from "../../utils/inventory";

export class EscapeGameScene {

    plant;
    pushButton;
    digicode;
    wheel;
    tool;
    buttonGrid;
    scie;
    feuilles;
    cable;
    coverSprite;
    circuitSprite;
    etablieSprite;
    tableau;
    labyrinthe;
    labyrintheDone = false;
    buttonGridDone = false;
    digicodeEnabled = false;

    preload() {
        this.tool = new Tool(() => this.onToolActivate());
        this.plant = new Plant(this.tool);
        this.pushButton = new PushButton((count) => this.onPushButtonClicked(count));
        this.digicode = new Digicode(() => this.onDigicodeCodeValid());
        this.wheel = new Wheel();
        this.buttonGrid = new ButtonGrid(() => this.onButtonGridCodeValid());
        this.cable = new Cable(this.digicode);
        this.scie = new Scie(this.cable);
        this.feuilles = new Feuilles();
        this.labyrinthe = new Labyrinthe(() => this.onLabyrintheValid());
    }

    create() {
        game.scale.setGameSize(gameWidth, gameHeight);
        this.etablieSprite = game.add.image(0, 0, 'escape_etablie');

        this.digicode.create(197, 34);
        this.plant.create(130, 8);
        this.pushButton.create(105, 98);
        this.buttonGrid.create(151, 63);
        this.scie.create(52, 82);
        this.feuilles.create(58, 104);
        this.labyrinthe.create(87, 31);

        this.circuitSprite = game.add.image(45, 27, 'escape_circuit', 0);
        this.coverSprite = game.add.image(44, 27, 'escape_cover');
        this.tableau = game.add.image(189, 28, 'escape_tableau');
        this.tableau.animations.add('open');

        this.enableLeaveSceneAction();
        // this.onDigicodeCodeValid();
    }

    update() {
        this.wheel.update();
        this.plant.update();
        this.tool.update();
        this.cable.update();
        this.labyrinthe.update();
    }

    onPushButtonClicked(count) {
        switch (count) {
            case 1:
                this.wheel.create(151, 85, this);
                this.feuilles.nextPage();
                break;
            case 2:
                this.tableau.animations.play('open', 10, false);
                break;
            case 4:
                this.scie.openScie();
                break;
            case 8:
                this.digicodeEnabled = true;
                this.scie.activate();
                break;
        }
    }

    onToolActivate() {
        this.circuitEnabled = true;
        this.circuitSprite.frame = 1;
        this.feuilles.nextPage();
        game.add.image(95, 58, 'escape_screen9');
    }

    onButtonGridCodeValid() {
        if (this.circuitEnabled) {
            game.add.image(113, 58, 'escape_screen2');
            this.buttonGridDone = true;
            this._nextPage(this.labyrintheDone);
        }
        return this.circuitEnabled;
    }

    onLabyrintheValid() {
        if (this.circuitEnabled) {
            game.add.image(107, 58, 'escape_screen4');
            this.labyrintheDone = true;
            this._nextPage(this.buttonGridDone);
        }
    }

    onDigicodeCodeValid() {
        const emitter = game.add.emitter(200, 108, 400);
        emitter.width = 12;
        emitter.height = 12;
        emitter.makeParticles('particle_yellow');
        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.4;
        emitter.setYSpeed(-50, 50);
        emitter.setXSpeed(-50, 50);
        emitter.start(false, 350, 2, 0);

        let parchemin = game.add.image(190, 100, 'escape_parchemin', 0);
        parchemin.animations.add('levitation', [0, 1, 2, 3, 4, 4, 3, 2, 1, 0], 7, true);
        parchemin.animations.play('levitation');

        parchemin.inputEnabled = true;
        parchemin.events.onInputDown.add(() => {
            parchemin.visible = false;
            emitter.destroy();
            game.save.inventory.items.parchemin.nombre = 1;
        });
    }

    enableLeaveSceneAction() {
        let startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(() => game.state.start('MainGame'));

        let textSprite = game.add.text(215, 123, "Exit", {
            font: "14px Alagard",
            fill: "red",
            stroke: "#FFFFFF",
            strokeThickness: 0
        });

        textSprite.inputEnabled = true;
        textSprite.events.onInputOver.add(() => {
            textSprite.strokeThickness = 4;
            textSprite.x -= 2;
            textSprite.y -= 2;
        });
        textSprite.events.onInputOut.add(() => {
            textSprite.strokeThickness = 0
            textSprite.x += 2;
            textSprite.y += 2;
        });
        textSprite.events.onInputDown.add(() => game.state.start('MainGame'));
    }

    _nextPage(isDone) {
        if (isDone) {
            this.feuilles.nextPage();
            if (this.digicodeEnabled) {
                this.feuilles.nextPage();
            }
        }
    }
}