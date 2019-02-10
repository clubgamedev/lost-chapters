export class EscapeTable extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, "chalet");
        game.physics.arcade.enable(this);
        this.body.setSize(20, 20, 0, 0);
        this.body.moves = false;
        this.type = "chalet";
        this.properties = properties;
    }
}