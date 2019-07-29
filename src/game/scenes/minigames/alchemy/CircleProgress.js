export class CircleProgress extends Phaser.Graphics {
    graphics;
    radius = 34;
    color;

    constructor(_game, _x, _y, _size, _color, _lineWidth = 5) {
        super(_game, _x, _y);
        this.graphics = this.game.add.graphics(_x, _y);
        this.color = _color;
        this.graphics.lineStyle(this.lineWidth, _color);
        this.updateProgress(1);
        this.graphics.alpha = 0.5;
        this.radius = _size * 8;
        this.lineWidth = _lineWidth;
    }

    updateProgress(_progress) {
        let _progressVal = Phaser.Math.clamp(_progress, 0, 1);
        _progressVal = Phaser.Math.clamp(_progressVal, 0.00001, 0.99999);
        this.graphics.clear();
        this.graphics.lineStyle(this.lineWidth, this.color);
        this.graphics.arc(0, 0, this.radius, Phaser.Math.degToRad(280), Phaser.Math.degToRad(Math.round(_progressVal * 360 + 280)%360), false);
    }

    preUpdate() {
        super.preUpdate();
    }

    destroy() {
        this.graphics.alpha = 0;
        this.graphics.destroy();
        super.destroy();
    }
}