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

        let btnVert = game.add.image(x+2, y+2, 'escape_buttonGrid_bouton_vert');
        this.initButton(btnVert, this.vert);
        let btnJaune = game.add.image(x+7, y+2, 'escape_buttonGrid_bouton_jaune');
        this.initButton(btnJaune, this.jaune);
        let btnRouge = game.add.image(x+12, y+2, 'escape_buttonGrid_bouton_rouge');
        this.initButton(btnRouge, this.rouge);
        let btnBleu = game.add.image(x+17, y+2, 'escape_buttonGrid_bouton_bleu');
        this.initButton(btnBleu, this.bleu);
    }

    initButton(buttonSprite, couleur) {
        buttonSprite.inputEnabled = true;
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
}