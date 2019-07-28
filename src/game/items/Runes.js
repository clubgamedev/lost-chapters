export class Runes extends Phaser.Sprite {

    constructor(position, properties) {
        super(game, position.x * 16, position.y * 16, "runes");
        this.type = "runes";
        this.properties = properties;

        this.animations.add("runes", [0, 1, 2, 3, 4, 5, 6, 7], 3, true);
        this.animations.play("runes");
    }
}