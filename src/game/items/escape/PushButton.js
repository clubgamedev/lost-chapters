export class PushButton {

    _pushButtonClickCount = 0;
    _sprite;

    constructor() {
        game.load.spritesheet('bouton_poussoir', 'assets/escape/bouton_poussoir.png', 16, 16, 2);
    }

    create(x, y, callback) {
        this._sprite = game.add.image(x, y, 'bouton_poussoir', 0);
        this._sprite.inputEnabled = true;

        this._sprite.events.onInputDown.add(() => {
            this._sprite.frame = 1;
            this._pushButtonClickCount++;
            callback(this._pushButtonClickCount);
        });

        this._sprite.events.onInputUp.add(() => this._sprite.frame = 0);
    }
}