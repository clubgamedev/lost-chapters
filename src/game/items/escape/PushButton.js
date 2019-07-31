export class PushButton {

    callback;
    pushButtonClickCount = 0;
    sprite;

    constructor(callback) {
        game.load.spritesheet('bouton_poussoir', 'assets/escape/bouton_poussoir.png', 16, 16, 2);
        this.callback = callback;
    }

    create(x, y) {
        this.sprite = game.add.image(x, y, 'bouton_poussoir', 0);
        this.sprite.inputEnabled = true;

        this.sprite.events.onInputDown.add(() => {
            this.sprite.frame = 1;
            this.pushButtonClickCount++;
            this.callback(this.pushButtonClickCount);
        });

        this.sprite.events.onInputUp.add(() => this.sprite.frame = 0);
    }
}