/* global Phaser */
import { Light } from "../utils/Light"


export class AmbientLight extends Phaser.Sprite {
    constructor(position, properties = {}) {
        super(game, position.x * 16 + 8, position.y * 16 + 8, "fire", 10);
        this.alpha = 0; // not interested in the sprite, just the light attached
        this.anchor.setTo(0.5, 0);
        properties = Object.assign({ radius: 50, color: "rgba(255, 220, 150, 1.0)" }, properties)

        this.light = new Light({ x: position.x * 16, y: position.y * 16 }, properties.radius, properties.color, 2);
    }
}