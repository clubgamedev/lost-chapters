import { loadSave } from "../../save";
import { Digicode } from "../../items/escape/Digicode";
import { PushButton } from "../../items/escape/PushButton";
import { Wheel } from "../../items/escape/Wheel";
import { gameWidth, gameHeight } from "../../lostchapters";
import { Plant } from "../../items/escape/Plant";

export class EscapeGameScene {

    digicode;
    pushButton;
    wheel;
    coverSprite;
    plant;

    preload() {
        game.load.image('etablie', 'assets/escape/etablie.png');
        game.load.image('cover', 'assets/escape/cover.png');
        game.load.image('feuilles', 'assets/escape/feuilles.png');

        this.plant = new Plant();
        this.pushButton = new PushButton();
        this.digicode = new Digicode();
        this.wheel = new Wheel();
    }

    create() {
        game.scale.setGameSize(gameWidth, gameHeight);

        let etablie = game.add.image(0, 0, 'etablie');
        etablie.inputEnabled = true;
        etablie.events.onInputDown.add(() => this.digicode.clickOut());

        game.add.image(65, 85, 'feuilles');
        this.coverSprite = game.add.image(44, 27, 'cover');
        this.plant.create(130, 8);
        this.pushButton.create(105, 98, (count) => this.onPushButtonClicked(count));
        
        this.wheel.create(151, 85, this);
        this.enableLeaveSceneAction();
    }

    update() {
        this.wheel.update();
        this.plant.update();
    }

    onPushButtonClicked(count) {
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