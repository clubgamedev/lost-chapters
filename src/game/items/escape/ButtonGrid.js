import { sounds } from "../../audio";

const JAUNE = 'J', ROUGE = 'R', BLEU = 'B', VERT = 'V';

export class ButtonGrid {

    code = [];
    callbackCodeValid;
    buttonSprites = []

    constructor(callbackCodeValid) {
        this.callbackCodeValid = callbackCodeValid;
    }

    create(x, y) {
        game.add.image(x, y, 'escape_buttonGrid_socle');
        this.buttonSprites = [
            this.initButton('escape_buttonGrid_bouton_vert', x + 2, y + 3, VERT),
            this.initButton('escape_buttonGrid_bouton_jaune', x + 8, y + 3, JAUNE),
            this.initButton('escape_buttonGrid_bouton_rouge', x + 14, y + 3, ROUGE),
            this.initButton('escape_buttonGrid_bouton_bleu', x + 20, y + 3, BLEU),
        ]
    }

    initButton(spriteName, x, y, couleur) {
        const buttonSprite = game.add.image(x, y, spriteName);
        const outline = game.add.sprite(x - 1, y - 1, this.createSillhouette(buttonSprite.width, buttonSprite.height));
        outline.visible = false;
        outline.moveDown();

        buttonSprite.inputEnabled = true;
        buttonSprite.onOver = () => { outline.visible = true }
        buttonSprite.onOut = () => { outline.visible = false }
        buttonSprite.events.onInputDown.add(() => {
            sounds.SWITCH_BUTTON.play();
            buttonSprite.frame = 1;
            this.addToCode(couleur);
        });
        buttonSprite.events.onInputUp.add(() => buttonSprite.frame = 0);
        return buttonSprite
    }

    addToCode(couleur) {
        this.code.push(couleur);
        if (this.code.length > 5) this.code.shift();
        if (this.code.join('') === 'RJBRV') {
            this.onCodeValid(); // defined in parent
        }
    }

    createSillhouette(width, height) {
        var bmd = game.add.bitmapData();
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width + 2, height + 2);
        bmd.ctx.fillStyle = '#ffffff';
        bmd.ctx.fill();
        return bmd;
    }
}
