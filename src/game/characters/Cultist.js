import { Character, CHARACTER_STATE } from "./Character"

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
		this.move(verticalMove ? "DOWN" : "RIGHT", this.speed);
	}

	update() {
		if (this.body.velocity.y > 0) {
			this.state = CHARACTER_STATE.WALKING_DOWN
		} else if (this.body.velocity.y < 0) {
			this.state = CHARACTER_STATE.WALKING_UP
		} else if (this.body.velocity.x > 0) {
			this.state = CHARACTER_STATE.WALKING_RIGHT
		} else if (this.body.velocity.x < 0) {
			this.state = CHARACTER_STATE.WALKING_LEFT
		}
		super.update()
	}
}
