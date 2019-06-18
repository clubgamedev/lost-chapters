export class Wheel {

    _sprite;
    _clicked = false;
    _lastAngle = 0;
    rectangle;
    cacheMuraleSprite;
    _plant;
    cacheMuraleSpriteInitialeWidth;
    minX;
    maxX;

    constructor() {
        game.load.spritesheet('roue', 'assets/escape/wheel.png', 18, 18, 2);
    }

    create(x, y, escapeGame) {
        this._sprite = game.add.image(x, y, 'roue', 1);
        this._sprite.anchor.setTo(0.5, 0.5);
        this._sprite.x += this._sprite.width / 2;
        this._sprite.y += this._sprite.height / 2;

        this._sprite.inputEnabled = true;
        this._sprite.events.onInputDown.add(() => this._clicked = true);
        this._sprite.events.onInputUp.add(() => this._clicked = false);

        this._plant = escapeGame.plant;
        this.cacheMuraleSprite = escapeGame.coverSprite;
        this.cacheMuraleSpriteInitialeWidth = this.cacheMuraleSprite.width;
        this.minX = this.cacheMuraleSprite.x;
        this.maxX = this.cacheMuraleSprite.width + this.cacheMuraleSprite.x;

        this.rectangle = new Phaser.Rectangle(0, 0, this.cacheMuraleSprite.width, this.cacheMuraleSprite.height);
        this.cacheMuraleSprite.crop(this.rectangle);
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
        if (diffx >= 0 && this.cacheMuraleSprite.x == this.maxX ||
            diffx <= 0 && this.cacheMuraleSprite.x == this.minX) return;

        this.cacheMuraleSprite.x += diffx;
        if (this.cacheMuraleSprite.x <= this.minX) this.cacheMuraleSprite.x = this.minX;
        if (this.cacheMuraleSprite.x >= this.maxX) {
            this.cacheMuraleSprite.x = this.maxX;
            this._checkPower(angle);
        }

        this.rectangle.width -= diffx;
        if (this.rectangle.width < 0) this.rectangle.width = 0;
        if (this.rectangle.width > this.cacheMuraleSpriteInitialeWidth) this.rectangle.width = this.cacheMuraleSpriteInitialeWidth;

        this.cacheMuraleSprite.updateCrop();
    }

    _updateWheel(angle) {
        let diffx = angle - this._lastAngle;
        if (diffx >= 0 && this.cacheMuraleSprite.x == this.maxX ||
            diffx <= 0 && this.cacheMuraleSprite.x == this.minX) return;

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

    countShake = 0;

    _checkPower(angle) {
        if (angle - this._lastAngle > 15) {
            game.camera.shake(0.02, 500);
            this.countShake++;
            
            if (this.countShake == 2) {
                this._plant.fall();
            }
        }
    }

}