export class Tindalos extends Phaser.Sprite {

    constructor(position) {
        super(game, position.x * 16 + 8, position.y * 16 + 8, "tindalos")
        this.type = "hallucination"
        this.x += 8;
        this.y += 8;
        this.anchor.setTo(0.5)
        this.size = 1
        this.scale.setTo(this.size)
        this.addAnimations()
        this.animations.play("alive")
        game.groups.fx.add(this)
        this.alpha = 0;
        this.tween = game.add.tween(this).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }

    addAnimations() {
        let animSpeed = 8;
        this.animations.add("alive", [0, 1], animSpeed, true)
        this.animations.add("dead", [2], animSpeed, true)
    }

    die() {
        this.animations.play("dead")
        this.tween.stop();
        this.alpha = 1;
        this.tween = game.add.tween(this).to({
            x: this.position.x - 2
        }, 100, Phaser.Easing.Bounce.InOut, true, 0, 1000, true);
    }

    fadeOut() {
        this.tween.stop();
        this.alpha = 1;
        this.tween = game.add.tween(this).to({
            angle: 270,
            alpha: 0
        }, 1000, Phaser.Easing.Linear.None, true);
    }
}