export class Cable {

    sprite;
    isDroping = false;
    isClicked = false;
    courbeX = -1.3;
    courbeVelocity = 0.2;
    courbeY = Math.pow(this.courbeX, 2);
    positionInitX;
    positionInitY;
    digicode;
    animationActivateDeltaX;
    animationActivateDeltaY;
    animationActivateDuration = 30;

    constructor(digicode) {
        this.digicode = digicode;
    }

    update() {
        if (this.isDroping) {
            this.sprite.x += 1;
            this.sprite.y += this.courbeX > 0 ? this.courbeY * 2.6 : -this.courbeY;
            this.courbeX += this.courbeVelocity;
            this.courbeY = Math.pow(this.courbeX, 2);

            if (this.courbeX >= 1.6) {
                this.isDroping = false;
                this.animationActivateDeltaX = (this.digicode.getCableX() + 1 - this.sprite.x) / this.animationActivateDuration;
                this.animationActivateDeltaY = (this.sprite.y - this.digicode.getCableY() - 1) / this.animationActivateDuration;
                this.sprite.events.onInputDown.add(() => this.onClick());
            }
        }

        if (this.isClicked) {
            if (this.sprite.x >= this.digicode.getCableX() || this.sprite.y <= this.digicode.getCableY()) {
                this.isClicked = false;
                this.digicode.enable();
                this.onConnect()
            } else {
                this.sprite.x += this.animationActivateDeltaX;
                this.sprite.y -= this.animationActivateDeltaY;
            }
        }
    }

    onClick() {
        this.isClicked = true;
        this.sprite.frame = 1;
        this.sprite.events.onInputDown.removeAll();
    }

    drop(x, y) {
        this.isDroping = true;
        this.positionInitX = x;
        this.positionInitY = y;
        this.sprite = game.add.image(x, y, 'escape_digicode_cable', 1);
        this.sprite.inputEnabled = true;
        this.sprite.onOver = () => { this.sprite.frame = 2 };
        this.sprite.onOut = () => { this.sprite.frame = 1 };
    }
}