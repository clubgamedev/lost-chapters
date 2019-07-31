export class Digicode {

    digicodeLed;
    group;
    ledValidation = [];
    code = [];
    isEnable = false;

    constructor() {
        game.load.image('digicode_boite', 'assets/escape/digicode/digicode_boite.png');
        game.load.spritesheet('digicode_leds', 'assets/escape/digicode/digicode_leds.png', 4, 5, 4);
        game.load.spritesheet('digicode_cable', 'assets/escape/digicode/digicode_cable.png', 3, 19, 2);
        game.load.spritesheet('digicode_btn1', 'assets/escape/digicode/digicode_btn1.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn2', 'assets/escape/digicode/digicode_btn2.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn3', 'assets/escape/digicode/digicode_btn3.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn4', 'assets/escape/digicode/digicode_btn4.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn5', 'assets/escape/digicode/digicode_btn5.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn6', 'assets/escape/digicode/digicode_btn6.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn7', 'assets/escape/digicode/digicode_btn7.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn8', 'assets/escape/digicode/digicode_btn8.png', 5, 8, 2);
        game.load.spritesheet('digicode_btn9', 'assets/escape/digicode/digicode_btn9.png', 5, 8, 2);
    }

    create(x, y) {
        this.group = game.add.group();
        this.group.visible = true;
        this.group.inputEnableChildren = true;

        this.group.create(x, y, "digicode_boite");
        this.group.create(x + 2, y + 9, "digicode_cable", 0);
        this.digicodeLed = this.group.create(x + 2, y + 2, "digicode_leds", 2);

        this.createButton(1, x + 7, y + 2);
        this.createButton(2, x + 13, y + 2);
        this.createButton(3, x + 19, y + 2);
        this.createButton(4, x + 7, y + 11);
        this.createButton(5, x + 13, y + 11);
        this.createButton(6, x + 19, y + 11);
        this.createButton(7, x + 7, y + 20);
        this.createButton(8, x + 13, y + 20);
        this.createButton(9, x + 19, y + 20);

        this.ledValidation.push(this.group.create(x + 25, y + 3, "digicode_leds", 0));
        this.ledValidation.push(this.group.create(x + 25, y + 10, "digicode_leds", 0));
        this.ledValidation.push(this.group.create(x + 25, y + 17, "digicode_leds", 0));
        this.ledValidation.push(this.group.create(x + 25, y + 24, "digicode_leds", 0));
    }

    createButton(buttonNumber, x, y) {
        let btn = this.group.create(x, y, "digicode_btn" + buttonNumber, 0);
        btn.inputEnabled = true;
        btn.events.onInputDown.add(() => {
            this.addToCode(buttonNumber);
            btn.frame = 1;
        });
        btn.events.onInputUp.add(() => btn.frame = 0);
    }

    addToCode(buttonNumber) {
        if (!this.isEnable) return;

        this.code.push(buttonNumber);
        this.ledValidation[this.code.length - 1].frame = 1;

        if (this.code.length >= 4) {
            if (this.checkCode()) {
                this.onCodeSuccess();
            } else {
                this.onCodeError();
            }

        }
    }

    /**
     * Code : ?793
     */
    checkCode() {
        return this.code.indexOf(7) != -1
        && this.code.indexOf(9) != -1
        && this.code.indexOf(3) != -1;
    }

    onCodeSuccess() {
        this.code = [];
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
        this.isEnable = true;
        this.digicodeLed.frame = 3;
    }
}