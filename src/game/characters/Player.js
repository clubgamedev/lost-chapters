import { shootArrow } from "../items/Arrow"

const PLAYER_STATE = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
	WALKING_LEFT: 4,
	WALKING_RIGHT: 5,
	WALKING_UP: 6,
	WALKING_DOWN: 7
}

const PLAYER_ACTION = {
	IDLE: 0,
	PREPARE_ATTACK: 1,
	ATTACK_READY: 2
}

export class Player extends Phaser.Sprite {
	constructor(game, x, y) {
		super(
			game,
			x * 16,
			y * 16,
			"atlas",
			"idle/hero-idle-back/hero-idle-back"
		)
		this.type = "player"
		this.initX = x * 16
		this.initY = y * 16
		this.health = 3
		this.action = PLAYER_ACTION.IDLE
		this.anchor.setTo(0.5)
		game.physics.arcade.enable(this)
		this.body.setSize(10, 10, 10, 20)
		this.size = 1
		this.scale.setTo(this.size)

		this.addAnimations()
	}

	update() {
		// player attack animation
		if (this.action == PLAYER_ACTION.ATTACK_READY) return

		// player attack animation
		if (this.action == PLAYER_ACTION.PREPARE_ATTACK) {
			if (
				this.state == PLAYER_STATE.WALKING_DOWN ||
				this.state == PLAYER_STATE.DOWN
			) {
				this.animations.play("attack-front")
			} else if (
				this.state == PLAYER_STATE.WALKING_UP ||
				this.state == PLAYER_STATE.UP
			) {
				this.animations.play("attack-back")
			} else if (
				this.state == PLAYER_STATE.WALKING_LEFT ||
				this.state == PLAYER_STATE.LEFT
			) {
				this.animations.play("attack-side")
			} else if (
				this.state == PLAYER_STATE.WALKING_RIGHT ||
				this.state == PLAYER_STATE.RIGHT
			) {
				this.animations.play("attack-side")
			}
			return
		}

		// player walk animation
		if (this.state == PLAYER_STATE.WALKING_DOWN) {
			this.animations.play("walk-front")
			this.scale.x = 1 * this.size
		} else if (this.state == PLAYER_STATE.WALKING_UP) {
			this.animations.play("walk-back")
			this.scale.x = 1 * this.size
		} else if (this.state == PLAYER_STATE.WALKING_LEFT) {
			this.animations.play("walk-side")
			this.scale.x = -1 * this.size
		} else if (this.state == PLAYER_STATE.WALKING_RIGHT) {
			this.animations.play("walk-side")
			this.scale.x = 1 * this.size
		} else if (this.state == PLAYER_STATE.DOWN) {
			this.animations.play("idle-front")
			this.scale.x = 1 * this.size
		} else if (this.state == PLAYER_STATE.UP) {
			this.animations.play("idle-back")
			this.scale.x = 1 * this.size
		} else if (this.state == PLAYER_STATE.LEFT) {
			this.animations.play("idle-side")
		} else if (this.state == PLAYER_STATE.RIGHT) {
			this.animations.play("idle-side")
		}
	}

	addAnimations() {
		const animVel = 12
		this.animations.add(
			"idle-front",
			["idle/hero-idle-front/hero-idle-front"],
			0,
			true
		)
		this.animations.add(
			"idle-back",
			["idle/hero-idle-back/hero-idle-back"],
			0,
			true
		)
		this.animations.add(
			"idle-side",
			["idle/hero-idle-side/hero-idle-side"],
			0,
			true
		)

		this.animations.add(
			"walk-front",
			Phaser.Animation.generateFrameNames(
				"walk/hero-walk-front/hero-walk-front-",
				1,
				6,
				"",
				0
			),
			animVel,
			true
		)
		this.animations.add(
			"walk-back",
			Phaser.Animation.generateFrameNames(
				"walk/hero-walk-back/hero-walk-back-",
				1,
				6,
				"",
				0
			),
			animVel,
			true
		)
		this.animations.add(
			"walk-side",
			Phaser.Animation.generateFrameNames(
				"walk/hero-walk-side/hero-walk-side-",
				1,
				6,
				"",
				0
			),
			animVel,
			true
		)

		const attack_front = this.animations.add(
			"attack-front",
			Phaser.Animation.generateFrameNames(
				"attack-weapon/hero-attack-front/hero-attack-front-weapon-",
				1,
				3,
				"",
				0
			),
			animVel,
			false
		)
		const attack_back = this.animations.add(
			"attack-back",
			Phaser.Animation.generateFrameNames(
				"attack-weapon/hero-attack-back/hero-attack-back-weapon-",
				1,
				3,
				"",
				0
			),
			animVel,
			false
		)
		const attack_side = this.animations.add(
			"attack-side",
			Phaser.Animation.generateFrameNames(
				"attack-weapon/hero-attack-side/hero-attack-side-weapon-",
				1,
				3,
				"",
				0
			),
			animVel,
			false
		)

		// set flag to false on complete
		const onAttackReady = () => {
			this.action = PLAYER_ACTION.ATTACK_READY
		}
		attack_front.onComplete.add(onAttackReady, this)
		attack_back.onComplete.add(onAttackReady, this)
		attack_side.onComplete.add(onAttackReady, this)
	}

	move(keys) {
		const vel = 50

		// attack animations
		if (this.action != PLAYER_ACTION.IDLE) {
			this.body.velocity.x = 0
			this.body.velocity.y = 0
			return
		}

		// capture input
		if (keys.down.isDown) {
			this.state = PLAYER_STATE.WALKING_DOWN
			this.body.velocity.y = vel
			this.body.velocity.x = 0
		} else if (keys.up.isDown) {
			this.state = PLAYER_STATE.WALKING_UP
			this.body.velocity.y = -vel
			this.body.velocity.x = 0
		} else if (keys.left.isDown) {
			this.state = PLAYER_STATE.WALKING_LEFT
			this.body.velocity.x = -vel
			this.body.velocity.y = 0
		} else if (keys.right.isDown) {
			this.state = PLAYER_STATE.WALKING_RIGHT
			this.body.velocity.x = vel
			this.body.velocity.y = 0
		} else {
			this.body.velocity.y = 0
			this.body.velocity.x = 0
		}

		// idle
		if (
			this.state == PLAYER_STATE.WALKING_DOWN &&
			this.body.velocity.y == 0
		) {
			this.state = PLAYER_STATE.DOWN
		} else if (
			this.state == PLAYER_STATE.WALKING_UP &&
			this.body.velocity.y == 0
		) {
			this.state = PLAYER_STATE.UP
		} else if (
			this.state == PLAYER_STATE.WALKING_LEFT &&
			this.body.velocity.x == 0
		) {
			this.state = PLAYER_STATE.LEFT
		} else if (
			this.state == PLAYER_STATE.WALKING_RIGHT &&
			this.body.velocity.x == 0
		) {
			this.state = PLAYER_STATE.RIGHT
		}
	}

	prepareAttack() {
		if (this.action == PLAYER_ACTION.IDLE) {
			this.action = PLAYER_ACTION.PREPARE_ATTACK
		}
	}

	releaseAttack() {
		if (this.action == PLAYER_ACTION.ATTACK_READY) {
			switch (this.state) {
				case PLAYER_STATE.WALKING_UP:
				case PLAYER_STATE.UP:
					shootArrow(this.x, this.y, "n")
					break

				case PLAYER_STATE.WALKING_DOWN:
				case PLAYER_STATE.DOWN:
					shootArrow(this.x, this.y, "s")
					break

				case PLAYER_STATE.WALKING_LEFT:
				case PLAYER_STATE.LEFT:
					shootArrow(this.x, this.y + 4, "w")
					break

				case PLAYER_STATE.WALKING_RIGHT:
				case PLAYER_STATE.RIGHT:
				default:
					shootArrow(this.x, this.y + 4, "e")
					break
			}
		}
		this.action = PLAYER_ACTION.IDLE
	}
}
