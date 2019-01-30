export class Chaudron extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, "chaudron");
        game.physics.arcade.enable(this);
        this.body.setSize(20, 20, 0, 0);
        this.body.moves = false;
        this.type = "chaudron";
        this.properties = properties;

        this.animations.add("bouillonnement", [0, 1], 8, true);
        this.animations.play("bouillonnement");
    }
}