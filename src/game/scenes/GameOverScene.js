import { blinkText } from "../effects/blinkText";
import { sounds } from "../audio";
import { openBook, nextPage } from "../utils/book"

export class GameOverScene {
    create() {
        game.scale.setGameSize(255, 144);
        game.add.tileSprite(0, 0, game.width, game.height, "title-bg");
        const hasWon = (game.save.gameOver === "win")
        game.music.stop()
        openBook(`book_${game.save.gameOver}`).then(() => {
            this.title = game.add.image(game.width / 2, game.height / 2, hasWon ? "gameover-win" : "gameover");
            this.title.anchor.setTo(0.5);
            if (hasWon) sounds.GAME_WIN.play();
            else sounds.GAME_OVER.play();
            setTimeout(() => {
                this.pressEnter = game.add.image(game.width / 2, game.height - 20, "enter");
                this.pressEnter.anchor.setTo(0.5);
                blinkText(this.pressEnter);
                game.controls.ACTION.onPress(this.backToMenu, this, true)
                game.controls.SECONDARY.onPress(this.backToMenu, this, true)
                game.controls.ENTER.onPress(this.backToMenu, this, true)
            }, 2000);
        })
        game.controls.ACTION.onPress(() => nextPage())
    }

    backToMenu() {
        this.game.state.start("TitleScreen");
    }
}