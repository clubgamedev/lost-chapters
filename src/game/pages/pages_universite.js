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