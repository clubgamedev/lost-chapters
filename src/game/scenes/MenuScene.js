import { blinkText } from "../effects/blinkText";

import { newGame } from "../save";

export class MenuScene {
    create() {
        game.add.tileSprite(0, 0, game.width, game.height, "title-bg");

        this.pressEnter = game.add.image(game.width / 2, game.height - 20, "enter");
        this.pressEnter.anchor.setTo(0.5);
        blinkText(this.pressEnter);

        const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startKey.onDown.add(this.startGame, this);
        this.state = 1;
    }

    startGame() {
        if (this.state == 1) {
            this.state = 2;
            this.title2 = game.add.image(game.width / 2, game.height / 2, "instructions");
            this.title2.anchor.setTo(0.5);
        } else {
            newGame();
            this.game.state.start("MainGame");
        }
    }
}