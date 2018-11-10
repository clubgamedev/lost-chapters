const CHARACTER_STATE = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
	WALKING_LEFT: 4,
	WALKING_RIGHT: 5,
	WALKING_UP: 6,
	WALKING_DOWN: 7
}

export class Character extends Phaser.Sprite {
	constructor(game, startPosition, sprite = "michel") {
		super(
			game,
			startPosition.x * 16 + 10,
			startPosition.y * 16 + 10,
			sprite,
			3
		)

		this.type = "character"
		this.state = CHARACTER_STATE.DOWN
		this.anchor.setTo(0.5)
		game.physics.arcade.enable(this)
		this.body.setSize(10, 10, 10, 20)
		this.size = 1
		this.scale.setTo(this.size)

		this.addAnimations()
	}

	update() {
		// player walk animation
		if (this.state == CHARACTER_STATE.WALKING_DOWN) {
			this.animations.play("walk-front")
			this.scale.x = 1 * this.size
		} else if (this.state == CHARACTER_STATE.WALKING_UP) {
			this.animations.play("walk-back")
			this.scale.x = 1 * this.size
		} else if (this.state == CHARACTER_STATE.WALKING_LEFT) {
			this.animations.play("walk-side")
			this.scale.x = 1 * this.size
		} else if (this.state == CHARACTER_STATE.WALKING_RIGHT) {
			this.animations.play("walk-side")
			this.scale.x = -1 * this.size
		} else if (this.state == CHARACTER_STATE.DOWN) {
			this.animations.play("idle-front")
			this.scale.x = 1 * this.size
		} else if (this.state == CHARACTER_STATE.UP) {
			this.animations.play("idle-back")
			this.scale.x = 1 * this.size
		} else if (this.state == CHARACTER_STATE.LEFT) {
			this.animations.play("idle-side")
		} else if (this.state == CHARACTER_STATE.RIGHT) {
			this.animations.play("idle-side")
		}
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

	move(keys) {
		const vel = 50

		// capture input
		if (keys.down.isDown) {
			this.state = CHARACTER_STATE.WALKING_DOWN
			this.body.velocity.y = vel
			this.body.velocity.x = 0
		} else if (keys.up.isDown) {
			this.state = CHARACTER_STATE.WALKING_UP
			this.body.velocity.y = -vel
			this.body.velocity.x = 0
		} else if (keys.left.isDown) {
			this.state = CHARACTER_STATE.WALKING_LEFT
			this.body.velocity.x = -vel
			this.body.velocity.y = 0
		} else if (keys.right.isDown) {
			this.state = CHARACTER_STATE.WALKING_RIGHT
			this.body.velocity.x = vel
			this.body.velocity.y = 0
		} else {
			this.body.velocity.y = 0
			this.body.velocity.x = 0
		}

		// idle
		if (
			this.state == CHARACTER_STATE.WALKING_DOWN &&
			this.body.velocity.y == 0
		) {
			this.state = CHARACTER_STATE.DOWN
		} else if (
			this.state == CHARACTER_STATE.WALKING_UP &&
			this.body.velocity.y == 0
		) {
			this.state = CHARACTER_STATE.UP
		} else if (
			this.state == CHARACTER_STATE.WALKING_LEFT &&
			this.body.velocity.x == 0
		) {
			this.state = CHARACTER_STATE.LEFT
		} else if (
			this.state == CHARACTER_STATE.WALKING_RIGHT &&
			this.body.velocity.x == 0
		) {
			this.state = CHARACTER_STATE.RIGHT
		}

		if (game.lamp) {
			game.lamp.x = this.x
			game.lamp.y = this.y
		}
	}
}
