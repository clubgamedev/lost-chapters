export class Wheel {

    _sprite;
    _clicked = false;
    // _currentRotation = 0;
    _lastAngle = 0;


    constructor() {
        game.load.image('roue', 'assets/escape/wheel.png');
    }

    create(x, y, spriteToMove) {
        this._sprite = game.add.image(x, y, 'roue');
        this._sprite.anchor.setTo(0.5, 0.5);
        this._sprite.x += this._sprite.width / 2;
        this._sprite.y += this._sprite.height / 2;

        this._sprite.inputEnabled = true;
        this._sprite.events.onInputDown.add(() => this._clicked = true);
        this._sprite.events.onInputUp.add(() => this._clicked = false);

        this.spriteToMove = spriteToMove;
        this.spriteWidth = spriteToMove.width;

        this.rectangle = new Phaser.Rectangle(0, 0, this.spriteToMove.width, this.spriteToMove.height);
        this.spriteToMove.crop(this.rectangle);
    }

    rectangle;
    spriteToMove;
    spriteWidth;
    minX = 94;
    maxX = 560;

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
            if (this.rectangle.width > this.spriteWidth) this.rectangle.width = this.spriteWidth;

            this.spriteToMove.updateCrop();
            this._sprite.angle = angle;
        }

        this._lastAngle = angle;
    }

}