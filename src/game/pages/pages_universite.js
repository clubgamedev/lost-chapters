import { talkToMyself } from "../utils/dialog"

export const page_astro_tindalos = {
    text: `... lorsque la lumière sera pliée sur elle-même ... Tindalos s'ouvrira à l'Eclipse ... à qui regarde dans la bonne direction ... les yeux rouges, le sang dans la bouche... verra la Bête dans son reflet`,
    before() {
        return talkToMyself([
            `Celui qui a écrit ça tremblait beaucoup. C'est à peine déchiffrable.`,
        ])
    },
    after() {
        game.save.hasDiscoveredTindalos = true;
        talkToMyself([
            `L'éclipse a lieu cette nuit. Qu'est-ce que ce cinglé va faire ?`,
            `Je ferais mieux d'interroger Franck sur ce "Tindalos"...`
        ])
    }
}

export const page_augustin_runes = {
    text: `Apprends les runes, bon sang, Augustin ! Communiquer sur papier n'est pas sûr !`
}

export const indice_1 = {
    before() {
        return talkToMyself([
            `C'est un dessin d'un labyrinthe avec un schéma technique.`,
            `Il y a des flèches indiquant que les éléments peuvent pivoter.`,
            `Quelqu'un a griffonné un message au verso.`
        ])
    },
    text: `Approuvé par Therled. Je commence la fabrication dès que j'ai les engrenages et les fils conducteurs.`
}

export const indice_2 = {
    text: `Augustin, Therled a besoin de toi pour la confection de son établi. Ramène de l'huile pour dégripper le mécanisme du panneau arrière. Il a dû forcer la dernière fois et ça a fait un sacré vacarme. Tu sais qu'il souhaite rester discret !`
}

export const indice_3 = {
    text: `Heures de passage:

Lundi noir: 07:17
Mardi noir: 11:33
Mercredi rouge: 04:04`,
    after() {
        game.save.hasReadSecretHours = true;
    }
}