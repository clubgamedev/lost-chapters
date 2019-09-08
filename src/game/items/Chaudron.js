export class Chaudron extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16 - 2, position.y * 16 - 4, "chaudron");
        game.physics.arcade.enable(this);
        this.scale.setTo(0.6, 0.6)
        this.body.setSize(48, 38, 0, 26);
        this.body.moves = false;
        this.type = "chaudron";
        this.properties = properties;
    }
}