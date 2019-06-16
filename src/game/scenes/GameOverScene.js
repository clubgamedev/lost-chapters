import { blinkText } from "../effects/blinkText";

export class GameOverScene {
    create() {
        game.add.tileSprite(0, 0, game.width, game.height, "title-bg");
        this.title = game.add.image(game.width / 2, game.height / 2, "gameover");
        this.title.anchor.setTo(0.5);

        this.pressEnter = game.add.image(game.width / 2, game.height - 20, "enter");
        this.pressEnter.anchor.setTo(0.5);
        blinkText(this.pressEnter);

        game.controls.ACTION.onPress(this.startGame, this, true);
    }

    startGame() {
        this.game.state.start("MainGame");
    }
}