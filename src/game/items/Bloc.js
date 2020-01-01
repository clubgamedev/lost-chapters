import { talkToMyself } from "../utils/dialog";
import { findObjectByName } from "../utils/map";
import { sounds } from "../audio";

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

export function destroyMurSecret(alreadyDiscovered, tilemap = game.level.tilemap) {
    let murSecret = findObjectByName("mur_secret", "bloc", tilemap, "Object Layer")
    if (murSecret && murSecret.sprite) {
        murSecret.sprite.destroy();
        murSecret.sprite = null;
        if (!alreadyDiscovered) {
            sounds.HALLUCINATION.play();
            game.save.hasDiscoveredSecretPassage = true;
        }
    } else if (!alreadyDiscovered) {
        return talkToMyself(['Rien ne se passe...'])
    }
}