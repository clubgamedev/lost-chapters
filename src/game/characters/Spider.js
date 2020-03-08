import { Character } from "./Character"

export class Spider extends Character {

	constructor({ properties, x, y }) {
		super(game, { x, y }, "spider");
		this.properties = properties;
		this.type = "spider"
		this.anchor.setTo(0.5)
		game.physics.arcade.enable(this)
		this.body.setSize(17, 15, 8, 8)
		this.body.moves = true;
		this.body.bounce.x = 1
		this.body.bounce.y = 1

		this.speed = 60;
		this.addAnimations();

		if (properties.vertical) {
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

	addAnimations() {
		let animSpeed = 12;
		this.animations.add("idle-front", [4], 0, true)
		this.animations.add("idle-back", [1], 0, true)
		this.animations.add("idle-side", [7], 0, true)
		this.animations.add("walk-front", [3, 4, 5, 4], animSpeed, true)
		this.animations.add("walk-back", [0, 1, 2, 1], animSpeed, true)
		this.animations.add("walk-side", [6, 7, 8, 7], animSpeed, true)
	}
}
