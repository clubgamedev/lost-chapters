export class Digicode {

    digicodeZoomGroup;
    digicodeZoomPositionX;
    digicodeZoomPositionY;
    digicodeZoomScale = 4;
    ledbots = [];
    isDigicodePointerOut = true;
    code = [];

    constructor() {
        game.load.image('digicode', 'assets/escape/digicode/digicode.png');
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
        let digicode = game.add.image(x, y, 'digicode');
        digicode.inputEnabled = true;
        digicode.events.onInputDown.add(() => this.digicodeZoomGroup.visible = true);

        this.digicodeZoomPositionX = x - 11 * this.digicodeZoomScale;
        this.digicodeZoomPositionY = y - 22 * this.digicodeZoomScale;

        this.digicodeZoomGroup = game.add.group();
        this.digicodeZoomGroup.visible = false;
        this.digicodeZoomGroup.inputEnableChildren = true;
        this.digicodeZoomGroup.onChildInputOut.add(() => this.isDigicodePointerOut = true);
        this.digicodeZoomGroup.onChildInputOver.add(() => this.isDigicodePointerOut = false);

        this.digicodeZoomGroup.create(this.digicodeZoomPositionX, this.digicodeZoomPositionY, "digicode_boite").scale.setTo(this.digicodeZoomScale, this.digicodeZoomScale);
        this.digicodeZoomGroup.create(this.digicodeZoomPositionX + 3 * this.digicodeZoomScale, this.digicodeZoomPositionY + 17 * this.digicodeZoomScale, "digicode_cable", 0).scale.setTo(this.digicodeZoomScale, this.digicodeZoomScale);
        this.digicodeZoomGroup.create(this.digicodeZoomPositionX + 3 * this.digicodeZoomScale, this.digicodeZoomPositionY + 8 * this.digicodeZoomScale, "digicode_leds", 2).scale.setTo(this.digicodeZoomScale, this.digicodeZoomScale);

        this.ledbots.push(this.digicodeZoomGroup.create(this.digicodeZoomPositionX + 3 * this.digicodeZoomScale, this.digicodeZoomPositionY + 41 * this.digicodeZoomScale, "digicode_leds", 0));
        this.ledbots[0].scale.setTo(this.digicodeZoomScale, this.digicodeZoomScale);
        this.ledbots.push(this.digicodeZoomGroup.create(this.digicodeZoomPositionX + 11 * this.digicodeZoomScale, this.digicodeZoomPositionY + 41 * this.digicodeZoomScale, "digicode_leds", 0));
        this.ledbots[1].scale.setTo(this.digicodeZoomScale, this.digicodeZoomScale);
        this.ledbots.push(this.digicodeZoomGroup.create(this.digicodeZoomPositionX + 19 * this.digicodeZoomScale, this.digicodeZoomPositionY + 41 * this.digicodeZoomScale, "digicode_leds", 0));
        this.ledbots[2].scale.setTo(this.digicodeZoomScale, this.digicodeZoomScale);
        this.ledbots.push(this.digicodeZoomGroup.create(this.digicodeZoomPositionX + 27 * this.digicodeZoomScale, this.digicodeZoomPositionY + 41 * this.digicodeZoomScale, "digicode_leds", 0));
        this.ledbots[3].scale.setTo(this.digicodeZoomScale, this.digicodeZoomScale);

        this.createButton(1, 10, 8);
        this.createButton(2, 17, 8);
        this.createButton(3, 24, 8);
        this.createButton(4, 10, 19);
        this.createButton(5, 17, 19);
        this.createButton(6, 24, 19);
        this.createButton(7, 10, 30);
        this.createButton(8, 17, 30);
        this.createButton(9, 24, 30);
    }

    createButton(buttonNumber, x, y) {
        let btn = this.digicodeZoomGroup.create(this.digicodeZoomPositionX + x * this.digicodeZoomScale, this.digicodeZoomPositionY + y * this.digicodeZoomScale, "digicode_btn" + buttonNumber, 0);
        btn.scale.setTo(this.digicodeZoomScale, this.digicodeZoomScale);
        btn.inputEnabled = true;
        btn.events.onInputDown.add(() => {
            this.addToCode(buttonNumber);
            btn.frame = 1;
        });
        btn.events.onInputUp.add(() => btn.frame = 0);
    }

    addToCode(buttonNumber) {
        this.code.push(buttonNumber);
        this.ledbots[this.code.length - 1].frame = 1;

        if (this.code.length >= 4) {
         
                this.code = [];
                this.ledbots.forEach(led => led.frame = 2);
                setTimeout(() => {
                    this.ledbots.forEach(led => led.frame = 0);
                }, 100);
                setTimeout(() => {
                    this.ledbots.forEach(led => led.frame = 2);
                }, 200);
                setTimeout(() => {
                    this.ledbots.forEach(led => led.frame = 0);
                }, 300);
                setTimeout(() => {
                    this.ledbots.forEach(led => led.frame = 2);
                }, 400);
                setTimeout(() => {
                    this.ledbots.forEach(led => led.frame = 0);
                }, 500);
        }
    }



    clickOut() {
        if (this.isDigicodePointerOut) {
            this.digicodeZoomGroup.visible = false;
        }
    }
}