export class Book extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, "runes");
        this.alpha = 0;
        this.type = "book";
        this.properties = properties;
        this.width = properties.width;
        this.height = properties.height;
    }
}