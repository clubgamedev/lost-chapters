import { loadSave } from "../../save";
import { Digicode } from "../../items/escape/Digicode";
import { BoutonPoussoir } from "../../items/escape/BoutonPoussoir";
import { Wheel } from "../../items/escape/Wheel";
import { gameWidth, gameHeight } from "../../lostchapters";

export class EscapeGameScene {

    digicode;
    boutonPoussoir;
    wheel;
    coverSprite;

    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.spritesheet('potfleur', 'assets/escape/potfleur.png', 16, 16, 2);
        game.load.image('cover', 'assets/escape/cover.png');
        game.load.image('feuilles', 'assets/escape/feuilles.png');

        this.boutonPoussoir = new BoutonPoussoir();
        this.digicode = new Digicode();
        this.wheel = new Wheel();
    }

    create() {
        game.scale.setGameSize(gameWidth, gameHeight);

        let etablie = game.add.image(0, 0, 'etablie');
        etablie.inputEnabled = true;
        etablie.events.onInputDown.add(() => this.digicode.clickOut());

        game.add.image(65, 85, 'feuilles');
        game.add.image(130, 8, 'potfleur', 0);
        this.coverSprite = game.add.image(44, 27, 'cover');
        this.boutonPoussoir.create(105, 98, (count) => this.onBoutonPoussoirCLicked(count));
        // this.wheel.create(151, 85, this.coverSprite);

        this.enableLeaveSceneAction();
    }

    update() {
        this.wheel.update();
    }

    onBoutonPoussoirCLicked(count) {
        switch (count) {
            case 1:
                this.digicode.create(495, 342);
                break;

            case 3:
                this.wheel.create(151, 85, this.coverSprite);
                break;
        }
    }

    enableLeaveSceneAction() {
        let startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(() => {
            loadSave();
            game.state.start('MainGame');
        });
    }
}