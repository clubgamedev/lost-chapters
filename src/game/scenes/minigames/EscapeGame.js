import { Game } from "phaser-ce";


export class EscapeGameScene {
    preload() {
        game.load.image('etablie', 'assets/escape_game/etablie.png');
    }

    create() {
        game.scale.setGameSize(800, 450);
        // game.add.sprite(0, 0, 'etablie');
    }

    update() {

    }
}