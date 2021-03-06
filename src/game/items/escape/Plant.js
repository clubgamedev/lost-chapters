import { sounds } from "../../audio";

export class Plant {

    sprite;
    velocity = 1;
    countVelocity = 0;
    isFalling = false;

    create(x, y) {
        this.sprite = game.add.image(x, y, 'escape_potfleur', 0);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = this.sprite.x + this.sprite.width / 2;
        this.sprite.y = this.sprite.y + this.sprite.height / 2;
    }

    update() {
        if (this.isFalling) {
            this.sprite.y = this.sprite.y + 1 * this.velocity;
            this.sprite.angle = this.sprite.angle + 3;
            this.countVelocity++;
            if (this.countVelocity >= 8 && this.velocity < 20) {
                this.velocity++;
                this.countVelocity = 0;
            }

            if (this.sprite.y >= 85) {
                this.isFalling = false;
                this.sprite.angle = 0;
                this.sprite.frame = 1;

                sounds.FALL_BREAK.play();
                this.onBreak(); // defined in parent
            }
        }
    }
}
