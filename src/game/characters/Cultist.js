import { Character } from "./Character"

export class Cultist extends Character {
	constructor(position, verticalMove) {
		super(game, position, "cultist");
		this.type = "cultist"
		this.anchor.setTo(0.5)
		game.physics.arcade.enable(this)
		this.body.setSize(16, 14, 7, 18)
		this.body.moves = true;
		this.body.bounce.x = 1
		this.body.bounce.y = 1

		this.speed = 60
		if (verticalMove) {
			this.body.velocity.y = this.speed
		} else {
			this.body.velocity.x = this.speed
		}
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
