const PLAYER_STATE = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
    WALKING_LEFT: 4,
    WALKING_RIGHT: 5,
    WALKING_UP: 6,
    WALKING_DOWN: 7
};

export class Michel extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x * 16, y * 16, "michelle", 3);
        this.type = "player";
        this.initX = x * 16;
        this.initY = y * 16;
        this.health = 3;
        this.anchor.setTo(0.5);
        game.physics.arcade.enable(this);
        this.body.setSize(6, 10, 13, 20);

        this.addAnimations();
    }

    update() {
        // player walk animation
        if (this.state == PLAYER_STATE.WALKING_DOWN) {
            this.animations.play("walk-front");
            this.scale.x = 1;
        } else if (this.state == PLAYER_STATE.WALKING_UP) {
            this.animations.play("walk-back");
            this.scale.x = 1;
        } else if (this.state == PLAYER_STATE.WALKING_LEFT) {
            this.animations.play("walk-side");
            this.scale.x = 1;
        } else if (this.state == PLAYER_STATE.WALKING_RIGHT) {
            this.animations.play("walk-side");
            this.scale.x = -1;
        } else if (this.state == PLAYER_STATE.DOWN) {
            this.animations.play("idle-front");
            this.scale.x = 1;
        } else if (this.state == PLAYER_STATE.UP) {
            this.animations.play("idle-back");
            this.scale.x = 1;
        } else if (this.state == PLAYER_STATE.LEFT) {
            this.animations.play("idle-side");
        } else if (this.state == PLAYER_STATE.RIGHT) {
            this.animations.play("idle-side");
        }
    }

    addAnimations() {
        const animSpeed = 8;
        this.animations.add("idle-front", [3], 0, true);
        this.animations.add("idle-back", [0], 0, true);
        this.animations.add("idle-side", [6], 0, true);
        this.animations.add("walk-front", [4, 3, 5, 3], animSpeed, true);
        this.animations.add("walk-back", [1, 0, 2, 0], animSpeed, true);
        this.animations.add("walk-side", [7, 6, 8, 6], animSpeed, true);
    }

    move(keys) {
        const vel = 50;

        // capture input
        if (keys.down.isDown) {
            this.state = PLAYER_STATE.WALKING_DOWN;
            this.body.velocity.y = vel;
            this.body.velocity.x = 0;
        } else if (keys.up.isDown) {
            this.state = PLAYER_STATE.WALKING_UP;
            this.body.velocity.y = -vel;
            this.body.velocity.x = 0;
        } else if (keys.left.isDown) {
            this.state = PLAYER_STATE.WALKING_LEFT;
            this.body.velocity.x = -vel;
            this.body.velocity.y = 0;
        } else if (keys.right.isDown) {
            this.state = PLAYER_STATE.WALKING_RIGHT;
            this.body.velocity.x = vel;
            this.body.velocity.y = 0;
        } else {
            this.body.velocity.y = 0;
            this.body.velocity.x = 0;
        }

        // idle
        if (this.state == PLAYER_STATE.WALKING_DOWN && this.body.velocity.y == 0) {
            this.state = PLAYER_STATE.DOWN;
        } else if (this.state == PLAYER_STATE.WALKING_UP && this.body.velocity.y == 0) {
            this.state = PLAYER_STATE.UP;
        } else if (this.state == PLAYER_STATE.WALKING_LEFT && this.body.velocity.x == 0) {
            this.state = PLAYER_STATE.LEFT;
        } else if (this.state == PLAYER_STATE.WALKING_RIGHT && this.body.velocity.x == 0) {
            this.state = PLAYER_STATE.RIGHT;
        }
    }

    prepareAttack() {
        if (this.key === "michel")
            this.loadTexture("michelle");
        else
            this.loadTexture("michel");
    }

    releaseAttack() { }
}
