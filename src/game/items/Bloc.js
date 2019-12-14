import { talkToMyself } from "../utils/dialog";

export class Bloc extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, properties.name);
        game.physics.arcade.enable(this);
        this.body.setSize(properties.width, properties.height, 0, 0);
        this.body.moves = false;
        this.type = "bloc";
        this.properties = properties;
    }
}

export const blocs = {
    mur_secret(sprite) {
        talkToMyself([
            `Il y a quelque-chose qui cloche avec ce mur...`
        ])
    }
}