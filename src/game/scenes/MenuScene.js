import { initControls } from "../utils/controls";
import { newGame } from "../save";

export class MenuScene {
    create() {
        game.add.tileSprite(0, 0, game.width, game.height, "title-bg");

        /*this.pressEnter = game.add.image(game.width / 2, game.height - 20, "enter");
        this.pressEnter.anchor.setTo(0.5);
        blinkText(this.pressEnter);

        const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startKey.onDown.add(this.startGame, this);
        this.state = 1;*/

        initControls()
        this.showMenu()
    }

    showMenu() {
        let menu = {
            "New game": () => {
                newGame();
                requestAnimationFrame(() => this.game.state.start("MainGame"));
            },
            "Controls": () => {
                this.instructions = game.add.image(game.width / 2, game.height / 2, "instructions");
                this.instructions.anchor.setTo(0.5);
                game.controls.ACTION.onceDown(() => {
                    this.instructions.destroy()
                    this.showMenu()
                })
            },
            "Credits": () => {
                this.credits = game.add.image(game.width / 2, game.height / 2, "credits");
                this.credits.anchor.setTo(0.5);
                game.controls.ACTION.onceDown(() => {
                    this.credits.destroy()
                    this.showMenu()
                })
            }
        }

        let options = Object.values(menu);

        let textSprite = game.add.text(20, 50, Object.keys(menu).join("\n"), {
            font: "14px Alagard",
            fill: "red",
            boundsAlignH: "left",
            boundsAlignV: "bottom"
        });
        textSprite.fixedToCamera = true
        textSprite.lineSpacing = -8
        textSprite.stroke = '#000000';
        textSprite.strokeThickness = 2;

        let selectionSprite = game.add.text(5, 51, "►", {
            font: "12px Alagard",
            fill: "red",
            boundsAlignH: "left",
            boundsAlignV: "bottom"
        })
        selectionSprite.fixedToCamera = true
        selectionSprite.stroke = '#000000';
        selectionSprite.strokeThickness = 2;

        game.controls.UP.onDown(this.selectChoice, this)
        game.controls.DOWN.onDown(this.selectChoice, this)
        game.controls.ACTION.onDown(this.validateChoice, this)

        this.menu = { options, textSprite, selectionSprite }
        this.selectedChoice = 0;
    }

    selectChoice() {
        let upOrDown = game.controls.UP.isPressed() ? -1 : +1
        let nbOptions = this.menu.options.length
        this.selectedChoice = (this.selectedChoice + nbOptions + upOrDown) % nbOptions
        this.menu.selectionSprite.cameraOffset.y = 51 + 16 * this.selectedChoice;
    }

    validateChoice() {
        let selectedChoice = this.menu.options[this.selectedChoice]
        this.menu.selectionSprite.destroy();
        this.menu.textSprite.destroy();
        game.controls.UP.stopListeningOnDown(this.selectChoice, this)
        game.controls.DOWN.stopListeningOnDown(this.selectChoice, this)
        game.controls.ACTION.stopListeningOnDown(this.validateChoice, this)
        delete this.menu;
        selectedChoice()
    }
}