export class PieProgress {
    graphics;
    radius = 34;
    anchor;
    sprite;

    constructor(_game, _x, _y, _size, _color = "#fff", _alpha = 0.6) {
        this.radius = _size;
        this.color = _color;
        this.bmp = game.add.bitmapData(this.radius * 2, this.radius * 2);
        this.sprite = game.add.sprite(_x, _y, this.bmp);

        //Phaser.Sprite.call(this, _game, _x, _y, this.bmp);
        this.sprite.anchor.set(0.5);
        this.sprite.angle = -90;
        //this.sprite.size = _size;
        this.sprite.alpha = 0.6;
        this.updateProgress(0);
    }

    updateProgress(_progress) {
        this.bmp.clear();
        this.bmp.ctx.fillStyle = this.color;
        this.bmp.ctx.beginPath();
        this.bmp.ctx.arc(this.radius, this.radius, this.radius, 0, (Math.PI * 2) * Phaser.Math.clamp(_progress, 0.00001, 0.99999));
        this.bmp.ctx.lineTo(this.radius, this.radius);
        this.bmp.ctx.closePath();
        this.bmp.ctx.fill();
        this.bmp.dirty = true;
    }

    destroy() {
        this.bmp.alpha = 0;
        this.bmp.destroy();
        this.sprite.destroy();
    }
}