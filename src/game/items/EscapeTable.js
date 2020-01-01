export class EscapeTable extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, "runes");
        game.physics.arcade.enable(this);
        this.body.setSize(properties.width, properties.height, 0, 0);
        this.body.moves = false;
        this.alpha = 0;
        this.type = "escapeTable";
        this.properties = properties;
        this.width = properties.width;
        this.height = properties.height;
    }
}