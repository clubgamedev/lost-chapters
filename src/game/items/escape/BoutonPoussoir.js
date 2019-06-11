export class BoutonPoussoir {

    boutonPoussoirClickCount = 0;
    boutonPoussoir;

    constructor() {
        game.load.spritesheet('bouton_poussoir', 'assets/escape/bouton_poussoir.png', 16, 16, 2);
    }

    create(x, y, callback) {
        this.boutonPoussoir = game.add.image(x, y, 'bouton_poussoir', 0);
        this.boutonPoussoir.inputEnabled = true;

        this.boutonPoussoir.events.onInputDown.add(() => {
            this.boutonPoussoir.frame = 1;
            this.boutonPoussoirClickCount++;
            callback(this.boutonPoussoirClickCount);
        });

        this.boutonPoussoir.events.onInputUp.add(() => this.boutonPoussoir.frame = 0);
    }
}