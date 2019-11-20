import { initControls } from "../utils/controls";
import { newGame, loadSave, save } from "../save";

export class MenuScene {
    create() {
        game.add.tileSprite(0, 0, game.width, game.height, "title-bg");

        initControls()
        this.showMenu()
    }

    showMenu() {
        let menu = {
            "Nouvelle partie": () => {
                newGame();
                requestAnimationFrame(() => this.game.state.start("MainGame"));
            },
            "Contrôles": () => {
                this.instructions = game.add.image(game.width / 2, game.height / 2, "instructions");
                this.instructions.anchor.setTo(0.5);
                game.controls.ACTION.onPress(() => this.backToMenu(), this, true)
                game.controls.ENTER.onPress(() => this.backToMenu(), this, true)
            },
            "Crédits": () => {
                this.credits = game.add.image(game.width / 2, game.height / 2, "credits");
                this.credits.anchor.setTo(0.5);
                game.controls.ACTION.onPress(() => this.backToMenu(), this, true)
                game.controls.ENTER.onPress(() => this.backToMenu(), this, true)
            },
            "Escape (temporaire)": () => {
                newGame();
                game.save.level = 'school';
                // this.game.state.start('MainGame');
                this.game.state.start('EscapeGame');
            },
            "Alchemy (temporaire)": () => {
                this.game.state.start('Alchemy');
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

        game.controls.UP.onPress(this.selectChoice, this)
        game.controls.DOWN.onPress(this.selectChoice, this)
        game.controls.ACTION.onPress(this.validateChoice, this)
        game.controls.ENTER.onPress(this.validateChoice, this)

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
        game.controls.UP.resetEvents()
        game.controls.DOWN.resetEvents()
        game.controls.ACTION.resetEvents()
        game.controls.ENTER.resetEvents()
        delete this.menu;
        selectedChoice()
    }

    backToMenu() {
        this.credits && this.credits.destroy()
        this.instructions && this.instructions.destroy()
        this.showMenu()
    }
}