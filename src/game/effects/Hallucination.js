import { talkToMyself, startDialog } from "../utils/dialog";
import { sounds } from "../audio";

export class Hallucination extends Phaser.Sprite {
    constructor(position, properties = {}) {
        super(game, position.x * 16 + 8, position.y * 16 + 8, properties.name, game.player.lucidity > 8 ? 0 : 1);
        this.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this);
        this.alpha = 1 - 0.5 * (16 - game.player.lucidity) / 16;
        this.body.setSize(96, 120, 0, 0);
        this.body.moves = false;
        this.type = "hallucination"
        this.properties = properties;
    }
}

export const hallucinations = {
    fake_tree(sprite) {
        if (game.player.lucidity <= 8) {
            talkToMyself([
                `Ces écorchures sur la souche... elles forment un visage...`,
                `MON visage...`
            ]).then(() => {
                return startDialog([
                    `CE... N'EST... PAS... REEL !`
                ], {
                        speaker: "afraid",
                        color: "#82ACDC"
                    });
            }).then(() => {
                sounds.HALLUCINATION.play();
                sprite.destroy();
            })
        } else {
            talkToMyself([
                `Cet arbre ne ressemble à aucun autre de ses voisins...`
            ])
        }
    }
}