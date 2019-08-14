export class Plant {

    sprite;
    velocity = 1;
    countVelocity = 0;
    tool;
    isFalling = false;

    constructor(tool) {
        game.load.spritesheet('potfleur', 'assets/escape/potfleur.png', 16, 16, 2);
        this.tool = tool;
    }

    create(x, y) {
        this.sprite = game.add.image(x, y, 'potfleur', 0);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = this.sprite.x + this.sprite.width/2;
        this.sprite.y = this.sprite.y + this.sprite.height/2;
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

                this.tool.create(this.sprite.x, this.sprite.y);
            }
        }
    }
}
