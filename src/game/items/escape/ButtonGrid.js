export class ButtonGrid {

    code = [];
    buttons = [];
    callbackCodeValid;

    constructor(callbackCodeValid) {
        this.callbackCodeValid = callbackCodeValid;
    }

    create(x, y) {
        game.add.image(x, y, 'escape_buttonGrid_socle');
        this.createButton(1, x + 2, y + 2);
        this.createButton(2, x + 7, y + 2);
        this.createButton(3, x + 12, y + 2);
        this.createButton(4, x + 17, y + 2);
        this.createButton(5, x + 2, y + 8);
        this.createButton(6, x + 7, y + 8);
        this.createButton(7, x + 12, y + 8);
        this.createButton(8, x + 17, y + 8);
    }

    createButton(buttonNumber, x, y) {
        let btn = game.add.image(x, y, 'escape_buttonGrid_bouton' + buttonNumber, 0);
        btn.inputEnabled = true;
        btn.events.onInputDown.add(() => {
            if (btn.frame !== 1) this.addToCode(buttonNumber);
        });
        this.buttons.push(btn);
    }

    addToCode(buttonNumber) {
        this.code.push(buttonNumber);
        this.buttons[buttonNumber - 1].frame = 1;
        if (this.code.length === 4) this.checkCode();
    }

    /**
     * Code 3457 in any order
     * @param {} buttonNumber 
     */
    checkCode() {
        if (this.code.indexOf(3) != -1
            && this.code.indexOf(4) != -1
            && this.code.indexOf(5) != -1
            && this.code.indexOf(7) != -1) {
                let activated = this.callbackCodeValid();
                if (activated) this.disableButtons();
        }

        this.resetButtons();
    }

    resetButtons() {
        setTimeout(() => {
            this.buttons.forEach(button => button.frame = 0);
            this.code = [];
        }, 300);
    }

    disableButtons() {
        setTimeout(() => {
            this.buttons.forEach(button => button.inputEnabled = false);
            this.code = [];
        }, 300);
    }
}