export class Feuilles {

    sprite;

    constructor() {

    }

    create(x, y) {
        this.sprite = game.add.image(x, y, 'escape_feuilles', 0);

        this.sprite.inputEnabled = true;
        this.sprite.events.onInputOver.add(() => this.sprite.frame = 1);
        this.sprite.events.onInputOut.add(() => this.sprite.frame = 0);
        this.sprite.events.onInputDown.add(() => this.onClick());
    }

    onClick() {
        //TODO
    }
}