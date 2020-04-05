export class Digicode {

    digicodeCable;
    digicodeLed;
    group;
    ledValidation = [];
    buttonSprites = [];
    code = [];
    _isEnabled = false;

    create(x, y) {
        this.x = x;
        this.y = y;
        this.group = game.add.group();
        this.group.visible = true;
        this.group.inputEnableChildren = true;

        this.group.create(x, y, "escape_digicode_boite");
        this.digicodeCable = this.group.create(x + 2, y + 9, "escape_digicode_cable", 0);
        this.digicodeLed = this.group.create(x + 2, y + 2, "escape_digicode_leds", 2);

        this.buttonSprites = [
            this.createButton(1, x + 7, y + 2),
            this.createButton(2, x + 13, y + 2),
            this.createButton(3, x + 19, y + 2),
            this.createButton(4, x + 7, y + 11),
            this.createButton(5, x + 13, y + 11),
            this.createButton(6, x + 19, y + 11),
            this.createButton(7, x + 7, y + 20),
            this.createButton(8, x + 13, y + 20),
            this.createButton(9, x + 19, y + 20)
        ]

        this.ledValidation.push(this.group.create(x + 25, y + 3, "escape_digicode_leds", 0));
        this.ledValidation.push(this.group.create(x + 25, y + 10, "escape_digicode_leds", 0));
        this.ledValidation.push(this.group.create(x + 25, y + 17, "escape_digicode_leds", 0));
        this.ledValidation.push(this.group.create(x + 25, y + 24, "escape_digicode_leds", 0));
    }

    createButton(buttonNumber, x, y) {
        let btn = this.group.create(x, y, "escape_digicode_btn" + buttonNumber, 0);
        btn.inputEnabled = true;
        btn.events.onInputDown.add(() => {
            this.addToCode(buttonNumber);
            btn.frame = 1;
        });
        btn.events.onInputUp.add(() => btn.frame = 0);
        return btn
    }

    addToCode(buttonNumber) {
        if (!this._isEnabled) return;

        this.code.push(buttonNumber);
        this.ledValidation[this.code.length - 1].frame = 1;

        if (this.code.length >= 4) {
            if (this.code.join('') === '9342') {
                this.onCodeSuccess();
            } else {
                this.onCodeError();
            }
        }
    }

    onCodeSuccess() {
        this.code = [];
        this.onCodeFound(); // defined in parent
        setTimeout(() => {
            this.ledValidation.forEach(led => led.frame = 3);
        }, 300);
    }

    onCodeError() {
        this.code = [];
        setTimeout(() => {
            this.ledValidation.forEach(led => led.frame = 2);
        }, 300);
        setTimeout(() => {
            this.ledValidation.forEach(led => led.frame = 0);
        }, 400);
        setTimeout(() => {
            this.ledValidation.forEach(led => led.frame = 2);
        }, 500);
        setTimeout(() => {
            this.ledValidation.forEach(led => led.frame = 0);
        }, 600);
        setTimeout(() => {
            this.ledValidation.forEach(led => led.frame = 2);
        }, 700);
        setTimeout(() => {
            this.ledValidation.forEach(led => led.frame = 0);
        }, 800);
    }

    enable() {
        this._isEnabled = true;
        this.digicodeLed.frame = 3;
    }

    getCableX() {
        return this.digicodeCable.x;
    }

    getCableY() {
        return this.digicodeCable.y;
    }

    isEnabled() {
        return this._isEnabled;
    }
}