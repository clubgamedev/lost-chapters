export class Wheel {

    _sprite;
    _clicked = false;
    _lastAngle = 0;
    rectangle;
    spriteCacheMurale;
    spriteCacheMuraleInitialeWidth;
    minX;
    maxX;

    constructor() {
        // game.load.image('roue', 'assets/escape/wheel.png');
        game.load.spritesheet('roue', 'assets/escape/wheel.png', 18, 18, 2);
    }

    create(x, y, spriteCacheMurale) {
        this._sprite = game.add.image(x, y, 'roue', 1);
        this._sprite.anchor.setTo(0.5, 0.5);
        this._sprite.x += this._sprite.width / 2;
        this._sprite.y += this._sprite.height / 2;

        this._sprite.inputEnabled = true;
        this._sprite.events.onInputDown.add(() => this._clicked = true);
        this._sprite.events.onInputUp.add(() => this._clicked = false);

        this.spriteCacheMurale = spriteCacheMurale;
        this.spriteCacheMuraleInitialeWidth = spriteCacheMurale.width;
        this.minX = spriteCacheMurale.x;
        this.maxX = spriteCacheMurale.width + spriteCacheMurale.x;

        this.rectangle = new Phaser.Rectangle(0, 0, this.spriteCacheMurale.width, this.spriteCacheMurale.height);
        this.spriteCacheMurale.crop(this.rectangle);
    }

    update() {
        if (!this._sprite) return;
        if (!this._clicked) return;

        let abscisse = game.input.x - this._sprite.x;
        let ordonnee = game.input.y - this._sprite.y;
        let angle = Math.atan2(ordonnee, abscisse) * 180 / Math.PI;

        if (ordonnee < 0) angle += 360;

        // Permet d'éviter les comportements bizarres lorsque l'ancien angle est par ex à -3XX alors que le nouveau est à moins de 10
        if (Math.abs(angle - this._lastAngle) < 50) {
            this._updateCacheMurale(angle);
            this._updateWheel(angle);
        }

        this._lastAngle = angle;
    }

    _updateCacheMurale(angle) {
        let diffx = (angle - this._lastAngle) / 3;
        if (diffx >= 0 && this.spriteCacheMurale.x == this.maxX ||
            diffx <= 0 && this.spriteCacheMurale.x == this.minX) return;

        this.spriteCacheMurale.x += diffx;
        if (this.spriteCacheMurale.x <= this.minX) this.spriteCacheMurale.x = this.minX;
        if (this.spriteCacheMurale.x >= this.maxX) {
            this.spriteCacheMurale.x = this.maxX;
            this._checkPower(angle);
        }

        this.rectangle.width -= diffx;
        if (this.rectangle.width < 0) this.rectangle.width = 0;
        if (this.rectangle.width > this.spriteCacheMuraleInitialeWidth) this.rectangle.width = this.spriteCacheMuraleInitialeWidth;

        this.spriteCacheMurale.updateCrop();
    }

    _updateWheel(angle) {
        let diffx = angle - this._lastAngle;
        if (diffx >= 0 && this.spriteCacheMurale.x == this.maxX ||
            diffx <= 0 && this.spriteCacheMurale.x == this.minX) return;

        if ((angle >= 0 && angle <= 45) || 
            (angle >= 90 && angle <= 135) || 
            (angle >= 180 && angle <= 225) ||
            (angle >= 270 && angle <= 315)
            )  {
            this._sprite.frame = 1;
        } else {
            this._sprite.frame = 0;
        }
    }

    _checkPower(angle) {
        if (angle - this._lastAngle > 15) {
            console.log('shake ! Faire tomber la plante');
        }
    }

}