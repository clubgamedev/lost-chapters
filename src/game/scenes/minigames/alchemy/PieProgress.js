export class PieProgress extends Phaser.Graphics {
    graphics;
    lineWidth = 5;
    radius = 34;
    color;

    constructor(_game, _x, _y, _size, _color) {
        super(_game, _x ,_y);
        this.graphics = this.game.add.graphics(_x, _y);
        //  Our first arc will be a line only
        this.color = _color;
        this.graphics.lineStyle(this.lineWidth, _color);
        // graphics.arc(0, 0, 135, game.math.degToRad(0), game.math.degToRad(90), false);
        this.updateProgress(1);
        this.graphics.alpha = 0.5;
        this.radius = _size * 8 ;
        //this.graphics.scale.x = -1;
    }

    updateProgress(_progress) {
        let _progressVal = Phaser.Math.clamp(_progress, 0, 1);
        _progressVal = Phaser.Math.clamp(_progressVal, 0.00001, 0.99999);
        this.graphics.clear();
        this.graphics.lineStyle(this.lineWidth, this.color);
        this.graphics.arc(0, 0, this.radius, Phaser.Math.degToRad(270), Phaser.Math.degToRad(Math.round(_progressVal * 360 + 270)%360), false);
    }

    preUpdate() {
        super.preUpdate();
    }

    destroy() {
        this.graphics.alpha = 0;
        super.destroy();
    }
}