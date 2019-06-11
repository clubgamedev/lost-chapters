export class Wheel {

    _sprite;
    _clicked = false;
    _lastAngle = 0;
    rectangle;
    spriteToMove;
    spriteToMoveInitialeWidth;
    minX;
    maxX;

    constructor() {
        // game.load.image('roue', 'assets/escape/wheel.png');
        game.load.spritesheet('roue', 'assets/escape/wheel.png', 18, 18, 2);
    }

    create(x, y, spriteToMove) {
        this._sprite = game.add.image(x, y, 'roue', 1);
        this._sprite.anchor.setTo(0.5, 0.5);
        this._sprite.x += this._sprite.width / 2;
        this._sprite.y += this._sprite.height / 2;

        this._sprite.inputEnabled = true;
        this._sprite.events.onInputDown.add(() => this._clicked = true);
        this._sprite.events.onInputUp.add(() => this._clicked = false);

        this.spriteToMove = spriteToMove;
        this.spriteToMoveInitialeWidth = spriteToMove.width;
        this.minX = spriteToMove.x;
        this.maxX = spriteToMove.width + spriteToMove.x;

        this.rectangle = new Phaser.Rectangle(0, 0, this.spriteToMove.width, this.spriteToMove.height);
        this.spriteToMove.crop(this.rectangle);
    }

    update() {
        if (!this._sprite) return;
        if (!this._clicked) return;

        let distanceX = game.input.x - this._sprite.x;
        let distanceY = game.input.y - this._sprite.y;
        let angle = Math.atan2(distanceY, distanceX) * 180 / Math.PI;

        if (distanceY < 0) angle += 360;

        // Permet d'éviter les comportements bizarres lorsque l'ancien angle est par ex à -3XX alors que le nouveau est à moins de 10
        if (Math.abs(angle - this._lastAngle) < 30) {
            let diffx = (angle - this._lastAngle) / 3;

            this.spriteToMove.x += diffx;
            if (this.spriteToMove.x < this.minX) this.spriteToMove.x = this.minX;
            if (this.spriteToMove.x > this.maxX) this.spriteToMove.x = this.maxX;

            this.rectangle.width -= diffx;
            if (this.rectangle.width < 0) this.rectangle.width = 0;
            if (this.rectangle.width > this.spriteToMoveInitialeWidth) this.rectangle.width = this.spriteToMoveInitialeWidth;

            this.spriteToMove.updateCrop();
            this._sprite.angle = angle;
        }

        this._lastAngle = angle;
    }

}