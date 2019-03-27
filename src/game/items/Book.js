export class Book extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, "runes");
        game.physics.arcade.enable(this);
        this.alpha = 0;
        this.body.setSize(20, 20, -2, -2);
        this.body.moves = false;
        this.type = "book";
        this.properties = properties;
    }
}