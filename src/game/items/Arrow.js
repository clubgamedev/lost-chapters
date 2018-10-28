/* global game */
import { sounds } from "../audio";

export class Arrow extends Phaser.Sprite {

    constructor(x, y, dir) {
        super(game, x, y, "atlas", "arrow");
        this.anchor.setTo(0.5);
        game.physics.arcade.enable(this);
        this.body.setSize(5, 8, 0, 7);
        const vel = 270;
        switch (dir) {
            case "n":
                this.body.velocity.y = -vel;
                break;
            case "s":
                this.body.velocity.y = vel;
                this.scale.y = -1;
                break;
            case "e":
                this.body.velocity.x = vel;
                this.angle = 90;
                break;
            case "w":
                this.body.velocity.x = -vel;
                this.angle = 270;
                break;
        }
    }

    update() {
        if (!this.inWorld) {
            this.destroy();
        }
    };
}

export const shootArrow = (x, y, direction) => {
    let arrow = new Arrow(x, y, direction);
    game.groups.projectiles.add(arrow);
    sounds.SLASH.play();
}