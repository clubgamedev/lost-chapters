export class EscapeTable extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, "runes");
        game.physics.arcade.enable(this);
        this.body.setSize(20, 20, 0, 0);
        this.body.moves = false;
        this.type = "escapeTable";
        this.properties = properties;
    }
}