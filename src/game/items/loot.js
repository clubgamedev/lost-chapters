import { talkToMyself } from "../utils/dialog"
import { sounds } from "../audio"

const loots = {
    foieDeCerf() {
        return talkToMyself([
            `Un pot scellé contenant des morceaux de viande rouge`,
            `Sur le fond est écrit: "Foie de cervidé"`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeProtection) {
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
            if (!game.save.loot.recettePotionDeForce) {
                return talkToMyself([`Je me demande avec quoi est faite cette cire pour avoir cette couleur ?`]).then(() => false)
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
            `C'est un pot contenant de drôles d'aiguilles oranges.`,
            `Il est étiqueté "Poisson diable".`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeForce && !game.save.loot.recetteAntidote) {
                return talkToMyself([`Ces aiguilles doivent venir des poissons de la rivière, je suppose.`]).then(() => false)
            } else {
                game.save.loot.epineDePoissonDiable = true;
                return talkToMyself([
                    `Ces aiguilles contiennent un venin qui attaque le système nerveux des proies.`,
                    `Mais à petite dose, on peut s'en servir pour inhiber les psychotropes.`,
                    `Je vais prendre ce bocal, mais je ne devrais pas trop jouer avec...`
                ]).then(() => true)
            }
        })
    },

    sangLibellule() {
        return talkToMyself([
            `Quelqu'un s'amuse à capturer les libellules de la rivière ici.`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeProtection && !game.save.loot.recetteAntidote) {
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

    alcoolPsylocibe() {
        return talkToMyself([
            `C'est une bouteille d'alcool dans laquelle macèrent des champignons.`,
            `Il y a des pieds coupés autour de ces souches.`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeForce) {
                return talkToMyself([
                    `Il doit s'agir de champignons hallucinogènes, consommés ici-même.`
                ]).then(() => false)
            } else {
                game.save.loot.sangLibellule = true;
                return talkToMyself([
                    `Ce sont des psycholibes, tels que dessinés sur la recette du psycho-stimulant.`,
                    `Parfait, j'ai l'ingrédient principal !`
                ]).then(() => true)
            }
        })
    },

    plumeDeGeai() {
        return talkToMyself([
            `C'est une très belle plume de geai bleu des chênes.`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeProtection) {
                return talkToMyself([
                    `Ce genre d'oiseau doit être assez courant dans cette forêt.`
                ]).then(() => false)
            } else {
                game.save.loot.sangLibellule = true;
                return talkToMyself([
                    `C'est sur la liste d'ingrédients de l'élixir des dévots.`,
                    `Décidément, ils y ont mis tous les animaux de la forêt !`,
                    `Bien, je vais l'emporter avec moi...`
                ]).then(() => true)
            }
        })
    },

    oeufDeCorbeau() {
        return talkToMyself([
            `C'est un oeuf d'oiseau. De corbeau, vu la taille et la couleur.`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeLucidite) {
                return talkToMyself([
                    `Ce genre d'oiseau doit être assez courant dans cette forêt.`
                ]).then(() => false)
            } else {
                game.save.loot.sangLibellule = true;
                return talkToMyself([
                    `C'est sur la liste d'ingrédients du tranquilisant prescrit par Ramsey.`,
                    `Hop, un ingrédient de plus !`
                ]).then(() => true)
            }
        })
    },

    racineHellebore() {
        return talkToMyself([
            `Le Père Arthur a laissé ce sac de fines racines ici.`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeLucidite && !game.save.loot.recetteAntidote) {
                return talkToMyself([`J'ignore à quoi elles peuvent servir ?`]).then(() => false)
            } else {
                game.save.loot.sangLibellule = true;
                return talkToMyself([
                    `Il doit s'agir des racines d'héllébore dont parlait Ramsey.`,
                    `Cela semble être un ingrédient important aussi pour les dévots.`
                ]).then(() => true)
            }
        })
    },

    vieilleGnole() {
        return talkToMyself([
            `C'est une bouteille de vieille gnôle.`
        ]).then(() => {
            if (!game.save.loot.recettePotionDeLucidite) {
                return talkToMyself([`Ils n'ont pas tous perdu le nord ici...`]).then(() => false)
            } else {
                game.save.loot.sangLibellule = true;
                return talkToMyself([
                    `Je peux m'en servir comme base du tranquilisant prescrit par Ramsey.`
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