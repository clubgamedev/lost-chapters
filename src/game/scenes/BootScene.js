export class BootScene {
    preload() {
        this.game.load.image("loading", "assets/sprites/loading.png");
    }

    create() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.renderer.renderSession.roundPixels = true; // blurring off
        this.game.state.start("Preload");
    }
}