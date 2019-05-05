import { Game } from "phaser-ce";
import { loadSave } from "../../save";
import { Digicode } from "../../items/escape/Digicode";
import { BoutonPoussoir } from "../../items/escape/BoutonPoussoir";
import { Wheel } from "../../items/escape/Wheel";

export class EscapeGameScene {

    digicode;
    boutonPoussoir;
    wheel;
    coverSprite;

    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.image('potfleur', 'assets/escape/potfleur.png');
        game.load.image('cover', 'assets/escape/cover.png');
        game.load.image('outils1', 'assets/escape/outils_1.png');
        game.load.image('outils2', 'assets/escape/outils_2.png');

        this.boutonPoussoir = new BoutonPoussoir();
        this.digicode = new Digicode();
        this.wheel = new Wheel();
    }

    create() {
        game.scale.setGameSize(800, 450);
        
        let etablie = game.add.image(0, 0, 'etablie');
        etablie.inputEnabled = true;
        etablie.events.onInputDown.add(() => this.digicode.clickOut());
        
        // outils
        game.add.image(104, 70, 'outils1');
        game.add.image(180, 150, 'outils2');

        this.coverSprite = game.add.image(94, 63, 'cover');
        game.add.image(200, 11, 'potfleur');

        this.boutonPoussoir.create(125, 340, (count) => this.onBoutonPoussoirCLicked(count));

        const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        startKey.onDown.add(this.quitGame, this);

        this.wheel.create(568, 102, this.coverSprite);
    }

    countWheel = 0;

    update() {
        this.wheel.update();
    }

    onBoutonPoussoirCLicked(count) {
        switch (count) {
            case 1 :
            this.digicode.create(495, 342);
            break;

            case 3:
            this.wheel.create(568, 102, this.coverSprite);
            break;
        }
    }

    quitGame() {
        loadSave();
        game.state.start('MainGame');
    }
}