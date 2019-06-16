export class BootScene {
    preload() {
        this.game.load.image("loading", "assets/sprites/loading.png");
    }

    create() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        Phaser.Canvas.setImageRenderingCrisp(game.canvas);
        game.renderer.renderSession.roundPixels = true; // blurring off

        //game.renderer.renderSession.scaleMode =  PIXI.scaleModes.DEFAULT;

        this.game.state.start("Preload");
    }
}