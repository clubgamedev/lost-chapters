import {loadAudio} from "../audio"

export class LoadingScene {
    preload() {
        const loadingBar = this.add.sprite(0, game.height / 2 - 10, "loading");
        game.load.setPreloadSprite(loadingBar);
        // load title screen
        game.load.image("title-bg", "assets/sprites/title-screen.png");
        game.load.image("enter", "assets/sprites/press-enter-text.png");
        game.load.image("instructions", "assets/sprites/instructions.png");
        game.load.image("gameover", "assets/sprites/game-over.png");

        // tileset
        game.load.image("tileset", "assets/environment/tileset.png");
        game.load.image("objects", "assets/environment/objects.png");
        game.load.image("collisions", "assets/environment/collisions.png");
        game.load.tilemap(
            "map",
            "assets/maps/map.json",
            null,
            Phaser.Tilemap.TILED_JSON
        );
        // atlas
        game.load.atlasJSONArray(
            "atlas",
            "assets/atlas/atlas.png",
            "assets/atlas/atlas.json"
        );
        game.load.atlasJSONArray(
            "atlas-props",
            "assets/atlas/atlas-props.png",
            "assets/atlas/atlas-props.json"
        );

        game.load.spritesheet('michel', 'assets/characters/michel.png', 32, 32, 9);
        game.load.spritesheet('michelle', 'assets/characters/michelle.png', 32, 32, 9);
        game.load.spritesheet('franck', 'assets/characters/franck.png', 32, 32, 9);
        game.load.spritesheet('augustin', 'assets/characters/augustin.png', 32, 32, 9);

        // images
        game.load.image("exit", "assets/environment/exit-open.png");

        // audio
        loadAudio();
    }

    create() {
        //this.game.state.start('PlayGame');
        this.game.state.start("TitleScreen");
    }
}