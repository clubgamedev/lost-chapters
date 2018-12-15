/* global Phaser */
import { Light } from "../utils/Light"


export class Fire extends Phaser.Sprite {
    constructor(position, properties = {}) {
        super(game, position.x * 16 + 8, position.y * 16 + 8, "fire", game.rnd.integerInRange(0, 11));
        this.anchor.setTo(0.5);
        this.animations.add("fire", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 15, true);
        this.animations.play("fire");
        properties = Object.assign({ radius: 50, color: "rgba(255, 220, 150, 1.0)" }, properties)

        this.light = new Light({ x: position.x * 16, y: position.y * 16 }, properties.radius, properties.color, 2);
    }
}