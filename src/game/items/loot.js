import { talkToMyself } from "../utils/dialog"
import { sounds } from "../utils/audio"

const loots = {
    foieDeCerf() {
        return talkToMyself([
            `Un pot scellé contenant des morceaux de viande rouge`,
            `Sur le fond est écrit: "Foie de cervidé"`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeLucidite) {
                return talkToMyself([`Qui voudrait manger ça ?`]).then(() => false)
            } else {
                game.save.loot.foieDeCerf = true;
                return talkToMyself([
                    `La recette de la potion des dévots mentionnait du foie de cerf.`,
                    `Je devrais l'emporter avec moi.`
                ]).then(() => true)
            }
        })
    }
}

export class Loot extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, properties.name);
        game.physics.arcade.enable(this);
        this.body.setSize(32, 32, 0, 0);
        this.body.moves = false;
        this.type = "loot";
        this.properties = properties;
    }
}

export const pickLoot = object => {
    if (object.properties.name in loots) {
        loots[object.properties.name]().then(hasLooted => {
            if (hasLooted) {
                sounds.ITEM.play()
                game.groups.objects.remove(object)
                object.destroy()
            }
        })
    }
}