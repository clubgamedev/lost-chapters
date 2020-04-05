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
import { stick, controls } from "../../utils/controls";
import { removeInArray } from "../../utils/array";

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
    cursor;
    interactiveSprites = [];
    spriteOver;

    preload() {
        this.tool = new Tool(() => this.onToolActivate());
        this.plant = new Plant();
        this.pushButton = new PushButton((count) => this.onPushButtonClicked(count));
        this.digicode = new Digicode(() => this.onDigicodeCodeValid());
        this.wheel = new Wheel();
        this.buttonGrid = new ButtonGrid(() => this.onButtonGridCodeValid());
        this.cable = new Cable(this.digicode);
        this.scie = new Scie(this.cable);
        this.feuilles = new Feuilles();
        this.labyrinthe = new Labyrinthe();
    }

    create() {
        game.scale.setGameSize(gameWidth, gameHeight);
        this.etablieSprite = game.add.image(0, 0, 'escape_etablie');

        this.digicode.create(197, 34);
        this.plant.create(130, 8);
        this.pushButton.create(105, 98);
        this.buttonGrid.create(147, 61);
        this.scie.create(52, 82);
        this.feuilles.create(58, 104);
        this.labyrinthe.create(87, 31);

        this.circuitSprite = game.add.image(45, 27, 'escape_circuit', 0);
        this.coverSprite = game.add.image(44, 27, 'escape_cover');
        this.tableau = game.add.image(189, 28, 'escape_tableau');
        this.tableau.animations.add('open');

        this.plant.onBreak = () => this.onPlantBreak();
        this.tool.onActivate = () => this.onToolActivate();
        this.feuilles.onBookOpen = () => {
            this.cursor.visible = false;
            game.paused = true;
        }
        this.feuilles.onBookClose = () => {
            this.cursor.visible = true;
            game.paused = false;
        }
        this.labyrinthe.onResolve = () => this.onLabyrintheValid();

        this.interactiveSprites = [
            this.pushButton.sprite,
            this.feuilles.sprite
        ]

        this.enableLeaveSceneAction();
        // this.onDigicodeCodeValid();

        this.cursor = game.add.image(gameWidth / 2, gameHeight / 2, 'cursor', 0)
        this.cursor.scale.setTo(0.5)

        game.input.addMoveCallback(pointerEvent => {
            this.cursor.position.x = pointerEvent.x + 2
            this.cursor.position.y = pointerEvent.y + 2
        });

        controls.ACTION.onPress(() => {
            // emulate mouse click with gamepad action button
            if (this.spriteOver && !game.book) {
                this.spriteOver.events.onInputDown.dispatch();
                setTimeout(() => {
                    this.spriteOver && this.spriteOver.events.onInputUp.dispatch()
                }, 150)
            }
        })
    }

    update() {
        this.wheel.update();
        this.plant.update();
        this.tool.update();
        this.cable.update();
        this.labyrinthe.update();

        if (!game.book) {
            let [sx, sy] = [stick.getAxisX(), stick.getAxisY()];
            let dx = (sx ? sx * Math.abs(sx) : controls.LEFT.isPressed() ? -1 : controls.RIGHT.isPressed() ? 1 : 0)
            let dy = (sy ? sy * Math.abs(sy) : controls.UP.isPressed() ? -1 : controls.DOWN.isPressed() ? 1 : 0)
            this.cursor.position.x += dx;
            this.cursor.position.y += dy;
            this.cursor.bringToTop();
        }

        //game.debug.pixel(this.cursor.x, this.cursor.y, "rgba(255,0,0,1)", 1);
        let spriteOver = this.interactiveSprites.find(sprite => sprite.getBounds().contains(this.cursor.x - 2, this.cursor.y - 2))
        if (this.spriteOver && (!spriteOver || spriteOver !== this.spriteOver)) {
            this.spriteOver.onOut && this.spriteOver.onOut();
            this.spriteOver = null;
            this.cursor.frame = 0
        }
        if (spriteOver && (!this.spriteOver || this.spriteOver !== spriteOver)) {
            this.spriteOver = spriteOver;
            this.spriteOver.onOver && this.spriteOver.onOver();
            this.cursor.frame = 1
        }
    }

    onPushButtonClicked(count) {
        switch (count) {
            case 1:
                this.wheel.create(151, 85, this);
                this.wheel.onWheelStuck = () => {
                    removeInArray(this.interactiveSprites, this.wheel.sprite)
                    this.plant.isFalling = true;
                }
                this.interactiveSprites.push(this.wheel.sprite)
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

    onPlantBreak() {
        this.tool.create(this.plant.sprite.x, this.plant.sprite.y);
        this.interactiveSprites.push(this.tool.sprite);
    }

    onToolActivate() {
        this.circuitEnabled = true;
        this.circuitSprite.frame = 1;
        this.interactiveSprites.push(...this.labyrinthe.tuiles.flatMap(line => line.map(t => t.sprite)))
        this.feuilles.nextPage();
        this.labyrinthe.checkSolution();
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
            this.interactiveSprites = this.interactiveSprites.filter(
                sprite => !(sprite && typeof sprite.key === "string" && sprite.key.startsWith("escape_labyrinthe"))
            )
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

        let textSprite = game.add.text(196, 126, "Quitter", {
            font: "14px Alagard",
            fill: "red",
            stroke: "black",
            strokeThickness: 1
        });
        this.interactiveSprites.push(textSprite)

        textSprite.inputEnabled = true;
        textSprite.onOver = () => {
            textSprite.stroke = "white";
        };
        textSprite.onOut = () => {
            textSprite.stroke = "black";
        };
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