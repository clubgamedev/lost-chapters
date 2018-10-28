export class Treant extends Phaser.Sprite {
    constructor(x, y) {

        super(game, x * 16, y * 16, "atlas", "idle/treant-idle-front");

        const animSpeed = 8;

        this.animations.add(
            "walk-front",
            Phaser.Animation.generateFrameNames("walk/treant-walk-front/treant-walk-front-", 1, 4, "", 0),
            animSpeed,
            true
        );
        this.animations.add(
            "walk-back",
            Phaser.Animation.generateFrameNames("walk/treant-walk-back/treant-walk-back-", 1, 4, "", 0),
            animSpeed,
            true
        );
        this.animations.add(
            "walk-side",
            Phaser.Animation.generateFrameNames("walk/treant-walk-side/treant-walk-side-", 1, 4, "", 0),
            animSpeed,
            true
        );
        this.animations.play("walk-front");
        this.anchor.setTo(0.5);
        game.physics.arcade.enable(this);
        this.body.setSize(11, 12, 10, 20);
        this.speed = 40;
        this.moveCounter = 0;
        this.direction = "up";
        this.directionsArray = ["up", "down", "left", "right"];
        this.type = "treant";
    }

    update() {
        this.moveCounter++;
        // move around
        if (this.moveCounter == 50) {
            this.direction = this.directionsArray[
                game.rnd.between(0, this.directionsArray.length - 1)
            ];
        } else if (this.moveCounter > 50) {
            this.move();
        }

        if (this.moveCounter > 70) {
            this.moveCounter = 0;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
    }

    move() {
        if (this.direction == "left") {
            this.body.velocity.x = -this.speed;
            this.animations.play("walk-side");
            this.scale.x = -1;
        } else if (this.direction == "right") {
            this.body.velocity.x = this.speed;
            this.animations.play("walk-side");
            this.scale.x = 1;
        }
        if (this.direction == "up") {
            this.body.velocity.y = -this.speed;
            this.animations.play("walk-back");
        }
        if (this.direction == "down") {
            this.body.velocity.y = this.speed;
            this.animations.play("walk-front");
        }
    }
};
