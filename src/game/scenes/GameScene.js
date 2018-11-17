import { addSounds, startMusic, sounds } from "../audio"

import { Player } from "../characters/Player"

import { Level, caveLevel, forestLevel } from "../levels"

let hurtFlag

export class GameScene {
	create() {
		game.level = new Level(caveLevel)

		addSounds()
		startMusic()

		this.spawnPlayer()

		this.bindKeys()
		this.createCamera()
		this.createHud()

		const actionKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		actionKey.onDown.add(() => {
			game.player.doAction()
		})
	}

	createHud() {
		this.hud_1 = game.add.sprite(10, 5, "atlas", "hearts/hearts-1")
		this.hud_2 = game.add.sprite(18, 5, "atlas", "hearts/hearts-1")
		this.hud_3 = game.add.sprite(26, 5, "atlas", "hearts/hearts-1")
		this.hud_1.fixedToCamera = true
		this.hud_2.fixedToCamera = true
		this.hud_3.fixedToCamera = true
	}

	createCamera() {
		game.camera.follow(game.player)
	}

	spawnPlayer() {
		game.player = new Player(game, { x: 10, y: 8 })
		game.groups.characters.add(game.player)
	}

	bindKeys() {
		game.input.keyboard.keys = {
			left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
			down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
			action: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		}

		game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.SPACEBAR,
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.UP
		])
	}

	update() {
		// physics
		game.physics.arcade.collide(game.player, game.level.layer_collisions)
		game.physics.arcade.collide(game.player, game.groups.pnj)
		game.physics.arcade.collide(game.groups.enemies, game.level.layer_collisions)

		if (game.player.alive) {
			//overlaps
			game.physics.arcade.overlap(game.player, game.groups.enemies, this.hurtPlayer, null, this)
			game.physics.arcade.overlap(game.player, game.groups.loot, this.lootManager, null, this)
			game.physics.arcade.overlap(game.player, game.level.exit, this.onExitReached, null, this)
		}

		game.player.move(game.input.keyboard.keys)

		//this.debugGame();
		this.hurtManager()

		game.level.update()

		game.groups.render.sort('y', Phaser.Group.SORT_ASCENDING); // depth sort
	}

	onExitReached() {
		game.state.start("GameOver")
		game.music.stop()
	}

	lootManager(player, loot) {
		if (loot.type == "gem") {
			sounds.ITEM.play()
			loot.kill()
			if (player.health < 3) {
				player.health++
				this.updateHealthHud()
			}
		}
		if (loot.type == "coin") {
			sounds.ITEM.play()
			loot.kill()
		}
	}

	hurtPlayer() {
		if (hurtFlag) {
			return
		}
		hurtFlag = true
		this.game.time.reset()

		game.player.alpha = 0.5
		game.player.health--
		this.updateHealthHud()

		sounds.HURT.play()
		if (game.player.health < 1) {
			this.gameOver()
		}
	}

	gameOver() {
		game.music.stop()
		game.state.start("GameOver")
	}

	updateHealthHud() {
		switch (game.player.health) {
			case 3:
				this.hud_1.loadTexture("atlas", "hearts/hearts-1", false)
				this.hud_2.loadTexture("atlas", "hearts/hearts-1", false)
				this.hud_3.loadTexture("atlas", "hearts/hearts-1", false)
				break
			case 2:
				this.hud_1.loadTexture("atlas", "hearts/hearts-1", false)
				this.hud_2.loadTexture("atlas", "hearts/hearts-1", false)
				this.hud_3.loadTexture("atlas", "hearts/hearts-2", false)
				break
			case 1:
				this.hud_1.loadTexture("atlas", "hearts/hearts-1", false)
				this.hud_2.loadTexture("atlas", "hearts/hearts-2", false)
				this.hud_3.loadTexture("atlas", "hearts/hearts-2", false)
				break
			case 0:
				this.hud_1.loadTexture("atlas", "hearts/hearts-2", false)
				this.hud_2.loadTexture("atlas", "hearts/hearts-2", false)
				this.hud_3.loadTexture("atlas", "hearts/hearts-2", false)

				break
		}
	}

	hurtManager() {
		if (hurtFlag && this.game.time.totalElapsedSeconds() > 2) {
			hurtFlag = false
			game.player.alpha = 1
		}
	}

	debugGame() {
		// return;
		//game.debug.spriteInfo(this.player, 30, 30);

		game.debug.body(game.player)
		game.debug.pixel(game.player.watchingPoint.x, game.player.watchingPoint.y, "rgba(0,255,0,1)", 1);
		game.groups.characters.forEachAlive(this.renderGroup, this)
		game.groups.loot.forEachAlive(this.renderGroup, this)
	}

	renderGroup(member) {
		game.debug.body(member)
	}
}

