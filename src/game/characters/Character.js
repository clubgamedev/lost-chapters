export const CHARACTER_STATE = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
	WALKING_LEFT: 4,
	WALKING_RIGHT: 5,
	WALKING_UP: 6,
	WALKING_DOWN: 7,
	RUNNING_LEFT: 8,
	RUNNING_RIGHT: 9,
	RUNNING_UP: 10,
	RUNNING_DOWN: 11
}

const ANIM_BY_STATE = {
	[CHARACTER_STATE.DOWN]: "idle-front",
	[CHARACTER_STATE.UP]: "idle-back",
	[CHARACTER_STATE.LEFT]: "idle-side",
	[CHARACTER_STATE.RIGHT]: "idle-side",
	[CHARACTER_STATE.WALKING_DOWN]: "walk-front",
	[CHARACTER_STATE.WALKING_UP]: "walk-back",
	[CHARACTER_STATE.WALKING_LEFT]: "walk-side",
	[CHARACTER_STATE.WALKING_RIGHT]: "walk-side",
	[CHARACTER_STATE.RUNNING_DOWN]: "run-front",
	[CHARACTER_STATE.RUNNING_UP]: "run-back",
	[CHARACTER_STATE.RUNNING_LEFT]: "run-side",
	[CHARACTER_STATE.RUNNING_RIGHT]: "run-side"
}

export class Character extends Phaser.Sprite {

	constructor(game, position, sprite, startState = CHARACTER_STATE.DOWN) {
		super(game, position.x * 16, position.y * 16, sprite, startState)
		this.type = "character"
		this.state = startState;
		this.x += 8;
		this.y += 8;
		this.anchor.setTo(0.5)
		game.physics.arcade.enable(this)
		this.body.setSize(10, 10, 10, 20)
		this.body.moves = false;
		this.size = 1
		this.scale.setTo(this.size)

		this.addAnimations()
	}

	update() {
		this.animations.play(ANIM_BY_STATE[this.state])
		if ([
			CHARACTER_STATE.RUNNING_RIGHT,
			CHARACTER_STATE.WALKING_RIGHT,
			CHARACTER_STATE.RIGHT,
		].includes(this.state)) {
			this.scale.x = -1 * this.size
		} else {
			this.scale.x = 1 * this.size
		}
	}

	addAnimations() {
		this.animations.add("idle-front", [3], 0, true)
		this.animations.add("idle-back", [0], 0, true)
		this.animations.add("idle-side", [6], 0, true)
		const WALK_ANIM_SPEED = 8;
		this.animations.add("walk-front", [4, 3, 5, 3], WALK_ANIM_SPEED, true)
		this.animations.add("walk-back", [1, 0, 2, 0], WALK_ANIM_SPEED, true)
		this.animations.add("walk-side", [7, 6, 8, 6], WALK_ANIM_SPEED, true)
		const RUN_ANIM_SPEED = 10;
		this.animations.add("run-front", [13, 3, 14, 3], RUN_ANIM_SPEED, true)
		this.animations.add("run-back", [10, 0, 11, 0], RUN_ANIM_SPEED, true)
		this.animations.add("run-side", [9, 6, 12, 6], RUN_ANIM_SPEED, true)
	}

	move(direction, speed) {
		if (direction === "DOWN") {
			this.state = this.isRunning ? CHARACTER_STATE.RUNNING_DOWN : CHARACTER_STATE.WALKING_DOWN
			this.body.velocity.y = speed
		} else if (direction === "RIGHT") {
			this.state = this.isRunning ? CHARACTER_STATE.RUNNING_RIGHT : CHARACTER_STATE.WALKING_RIGHT
			this.body.velocity.x = speed
		} else if (direction === "TOP") {
			this.state = this.isRunning ? CHARACTER_STATE.RUNNING_TOP : CHARACTER_STATE.WALKING_TOP
			this.body.velocity.y = -speed
		} else if (direction === "RIGHT") {
			this.state = this.isRunning ? CHARACTER_STATE.RUNNING_LEFT : CHARACTER_STATE.WALKING_LEFT
			this.body.velocity.x = -speed
		}
	}

	stopMoving() {
		this.body.velocity.y = 0
		this.body.velocity.x = 0
		// idle

		switch (this.state) {
			case CHARACTER_STATE.WALKING_LEFT:
			case CHARACTER_STATE.RUNNING_LEFT:
				this.animations.play("idle-side")
				this.state = CHARACTER_STATE.LEFT
				break;
			case CHARACTER_STATE.WALKING_RIGHT:
			case CHARACTER_STATE.RUNNING_RIGHT:
				this.animations.play("idle-side")
				this.state = CHARACTER_STATE.RIGHT
				break;
			case CHARACTER_STATE.WALKING_UP:
			case CHARACTER_STATE.RUNNING_UP:
				this.animations.play("idle-back")
				this.state = CHARACTER_STATE.UP
				break;
			case CHARACTER_STATE.WALKING_DOWN:
			case CHARACTER_STATE.RUNNING_DOWN:
				this.animations.play("idle-front")
				this.state = CHARACTER_STATE.DOWN
				break;
		}
	}
}
