import { talkToMyself } from "../utils/dialog"
import { sounds } from "../audio"

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
    },

    cireBougieNoire() {
        return talkToMyself([
            `C'est une vieille bougie dont la cire noire a coulé et s'est figée.`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeForce && !game.save.loot.recetteAntidote) {
                return talkToMyself([`Je me demande avec quoi est faite cette cire pour avoir cette couleur si noire ?`]).then(() => false)
            } else {
                game.save.loot.cireBougieNoire = true;
                return talkToMyself([
                    `Il était mentionné de la cire noire sur la recette d'une potion.`,
                    `Je devrais emporter cette bougie avec moi.`
                ]).then(() => true)
            }
        })
    },

    epineDePoissonDiable() {
        return talkToMyself([
            `C'est un pot contenant de drôles d'aiguilles oranges. Il est étiqueté "Poisson diable".`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeForce) {
                return talkToMyself([`Ces aiguilles doivent venir des poissons de la rivière, je suppose.`]).then(() => false)
            } else {
                game.save.loot.epineDePoissonDiable = true;
                return talkToMyself([
                    `Ces aiguilles contiennent un venin qui attaque le système nerveux des proies.`,
                    `Mais à petite dose, on peut s'en servir pour préparer un psycho-stimulant.`,
                    `Je vais prendre ce bocal, mais je ne devrais pas trop jouer avec...`
                ]).then(() => true)
            }
        })
    },

    sangLibellule() {
        return talkToMyself([
            `Quelqu'un s'amuse à capturer les libellules de la rivière ici.`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeForce) {
                return talkToMyself([`Mais pourquoi faire ?`]).then(() => false)
            } else {
                game.save.loot.sangLibellule = true;
                return talkToMyself([
                    `Le sang de libellule est dans la liste des ingrédients du psycho-stimulant`,
                    `Ça me ragoûte un peu, mais je vais devoir emporter ces libellules mortes.`
                ]).then(() => true)
            }
        })

    },

    parchemin() {
        return talkToMyself([
            `C'est une copie quasi identique du parchemin caché dans l'établi.`,
            `Il doit s'agit du rituel d'invocation dont parlait Marie.`
        ]).then(() => {
            game.save.inventory.items.parchemin.nombre++
            return true;
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
                game.groups.nonCollidableObjects.remove(object)
                object.destroy()
            }
        })
    }
}