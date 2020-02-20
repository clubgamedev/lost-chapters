export class ButtonGrid {

    code = [];
    callbackCodeValid;
    activated = false;
    jaune = 0;
    rouge = 1;
    bleu = 2;
    vert = 3;

    constructor(callbackCodeValid) {
        this.callbackCodeValid = callbackCodeValid;
    }

    create(x, y) {
        game.add.image(x, y, 'escape_buttonGrid_socle');
        this.initButton('escape_buttonGrid_bouton_vert', x+2, y+3, this.vert);
        this.initButton('escape_buttonGrid_bouton_jaune', x+8, y+3, this.jaune);
        this.initButton('escape_buttonGrid_bouton_rouge', x+14, y+3, this.rouge);
        this.initButton('escape_buttonGrid_bouton_bleu', x+20, y+3, this.bleu);
    }

    initButton(spriteName, x, y, couleur) {
        const buttonSprite = game.add.image(x, y, spriteName);
        const outline = game.add.sprite(x-1, y-1, this.createSillhouette(buttonSprite.width, buttonSprite.height));
        outline.visible = false;
        outline.moveDown();

        buttonSprite.inputEnabled = true;
        buttonSprite.events.onInputOver.add(() => outline.visible = true);
        buttonSprite.events.onInputOut.add(() => outline.visible = false);
        buttonSprite.events.onInputDown.add(() => {
            buttonSprite.frame = 1;
            this.addToCode(couleur);
        });
        buttonSprite.events.onInputUp.add(() => buttonSprite.frame = 0);
    }

    addToCode(couleur) {
        this.code.push(couleur);
        if (this.code.length > 5) this.code.shift();
        if (this.code.length === 5
            && this.code[0] === this.rouge
            && this.code[1] === this.jaune
            && this.code[2] === this.bleu
            && this.code[3] === this.rouge
            && this.code[4] === this.vert)
            {
                this.activated = this.callbackCodeValid();
            }
    }

    createSillhouette(width, height) {
        var bmd = game.add.bitmapData();
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width+2, height+2);
        bmd.ctx.fillStyle = '#ffffff';
        bmd.ctx.fill();
        return bmd;
    }
}
