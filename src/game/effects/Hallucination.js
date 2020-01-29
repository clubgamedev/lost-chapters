import { talkToMyself, startDialog } from "../utils/dialog";
import { sounds } from "../audio";

export class Hallucination extends Phaser.Sprite {
    constructor(position, properties = {}) {
        super(game, position.x * 16 + 8, position.y * 16 + 8, properties.name, game.player.lucidity > 8 ? 0 : 1);
        this.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this);
        this.alpha = 1 - 0.5 * (16 - game.player.lucidity) / 16;
        this.body.setSize(properties.body_w, properties.body_h, 0, 0);
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
                game.camera.flash(0x009999, 500)
                sprite.destroy();
            })
        } else {
            talkToMyself([
                `Cet arbre ne ressemble à aucun autre de ses voisins...`
            ])
        }
    },

    marie_body(sprite){
        talkToMyself([
            `C'est Soeur Marie !`,
            `Ses lèvres sont blèmes et son corps est froid... Elle ne respire plus...`,
        ]).then(() => {
            return startDialog([
                `C'est le père Arthur qui a fait ça ! C'est forcément lui ! ARTHUR !`
            ], {
                speaker: "afraid",
                color: "#82ACDC"
            });
        }).then(() => {
            if(game.player.lucidity > 3){
                game.player.lucidity = Math.max(3, game.player.lucidity - 8)
            }
            sounds.HALLUCINATION.play();
            game.camera.flash(0x009999, 500)
            sprite.destroy();
            return talkToMyself([
                `Je.... je ne me sens pas bien. Que se passe-t-il dans cette forêt ?`
            ])
        })
    }
}