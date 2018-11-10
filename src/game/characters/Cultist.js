export class Cultist extends Phaser.Sprite {
	constructor(x, y, verticalMove) {
		super(game, x * 16, y * 16, "cultist", 3)
		this.addAnimations()

		this.anchor.setTo(0.5)
		game.physics.arcade.enable(this)
		this.body.setSize(18, 14, 6, 18)
		this.speed = 60
		if (verticalMove) {
			this.body.velocity.y = this.speed
		} else {
			this.body.velocity.x = this.speed
		}
		this.body.bounce.x = 1
		this.body.bounce.y = 1
		this.type = "cultist"
	}

	addAnimations() {
		const animSpeed = 8
		this.animations.add("idle-front", [3], 0, true)
		this.animations.add("idle-back", [0], 0, true)
		this.animations.add("idle-side", [6], 0, true)
		this.animations.add("walk-front", [4, 3, 5, 3], animSpeed, true)
		this.animations.add("walk-back", [1, 0, 2, 0], animSpeed, true)
		this.animations.add("walk-side", [7, 6, 8, 6], animSpeed, true)
	}

	update() {
		if (this.body.velocity.y > 0) {
			this.animations.play("walk-front")
		} else if (this.body.velocity.y < 0) {
			this.animations.play("walk-back")
		} else if (this.body.velocity.y == 0) {
			this.animations.play("walk-side")
			if (this.body.velocity.x > 0) {
				this.scale.x = -1
			} else {
				this.scale.x = 1
			}
		}
	}
}
