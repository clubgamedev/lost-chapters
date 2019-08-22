export class PushButton {

    callback;
    pushButtonClickCount = 0;
    sprite;

    constructor(callback) {
        this.callback = callback;
    }

    create(x, y) {
        this.sprite = game.add.image(x, y, 'escape_bouton_poussoir', 0);
        this.sprite.inputEnabled = true;

        this.sprite.events.onInputDown.add(() => {
            this.sprite.frame = 1;
            this.pushButtonClickCount++;
            if (this.pushButtonClickCount >= 10) {
                this.sprite.inputEnabled = false;
                this.sprite.frame = 1;
            }
            this.callback(this.pushButtonClickCount);
        });

        this.sprite.events.onInputUp.add(() => this.sprite.frame = 0);
    }
}