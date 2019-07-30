// sprite invisible auquel le personnage peut répondre
export class Description extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, "collisions");
        this.width = properties.width;
        this.height = properties.height;
        game.physics.arcade.enable(this);
        this.alpha = 0;
        this.body.setSize(properties.width, properties.height, 0, 0);
        this.body.moves = false;
        this.type = "description";
        this.properties = properties;
    }
}