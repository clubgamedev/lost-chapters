import { createSillhouette } from '../../utils/inventory';

export class Wheel {

    sprite;
    rotateSpeed = 0;
    rectangle;
    cacheMuraleSprite;
    cacheMuraleSpriteInitialeWidth;
    minX;
    maxX;
    stuck = false;

    create(x, y, escapeGame) {
        this.sprite = game.add.image(x, y, 'escape_roue', 1);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.x += this.sprite.width / 2;
        this.sprite.y += this.sprite.height / 2;

        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(() => {
            this.rotateSpeed += 4
        })

        this.cacheMuraleSprite = escapeGame.coverSprite;
        this.cacheMuraleSpriteInitialeWidth = this.cacheMuraleSprite.width;
        this.minX = this.cacheMuraleSprite.x;
        this.maxX = this.cacheMuraleSprite.width + this.cacheMuraleSprite.x;

        this.rectangle = new Phaser.Rectangle(0, 0, this.cacheMuraleSprite.width, this.cacheMuraleSprite.height);
        this.cacheMuraleSprite.crop(this.rectangle);
    }

    update() {
        if (!this.sprite || this.stuck) return;

        this._updateCacheMurale();
        this.sprite.angle += this.rotateSpeed * 0.5
        if (this.cacheMuraleSprite.x > this.minX) {
            this.rotateSpeed = Math.max(-8, this.rotateSpeed - 0.25);
        } else {
            this.rotateSpeed = 0;
        }
    }

    _updateCacheMurale() {
        let dx = this.rotateSpeed * 0.1
        this.cacheMuraleSprite.x += dx;
        if (this.cacheMuraleSprite.x < this.minX) this.cacheMuraleSprite.x = this.minX;
        else if (this.cacheMuraleSprite.x >= this.maxX) {
            this.cacheMuraleSprite.x = this.maxX;
            this.checkPower();
            this.rotateSpeed = 0;
        }

        this.rectangle.width -= dx;
        if (this.rectangle.width < 0) this.rectangle.width = 0;
        if (this.rectangle.width > this.cacheMuraleSpriteInitialeWidth) this.rectangle.width = this.cacheMuraleSpriteInitialeWidth;

        this.cacheMuraleSprite.updateCrop();
    }

    checkPower() {
        if (this.rotateSpeed >= 10) {
            game.camera.shake(0.02, 500);
            this.stuck = true;
            this.onWheelStuck(); // defined in parent
        }
    }

}