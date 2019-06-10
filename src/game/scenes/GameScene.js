import { addSounds, startMusic, sounds } from "../utils/audio"
import { startDialog } from "../utils/dialog"
import { Player } from "../characters/Player"
import { goToLevel } from "../levels"
import { save } from "../save";
import { initControls } from "../utils/controls";

let hurtFlag

export class GameScene {
	create() {
		game.scale.setGameSize(255, 144);

		this.spawnPlayer()
		initControls()

		goToLevel(game.save.level)
		startMusic();
		addSounds()

		this.createHud()

        /*game.input.keyboard.addKey(Phaser.Keyboard.K).onDown.add(()=> {
            game.variants = ["action_shuffle", "battle"];
            game.duration = "30";
            save();
            game.state.start("Decryptor");
		})*/
	}

	createHud() {
		game.lucidityBar = game.add.sprite(10, 5, "lucidity-bar");
		game.lucidityBar.fixedToCamera = true
	}

	spawnPlayer() {
		game.player = new Player(game, game.save.playerPosition)
		game.camera.follow(game.player)
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
			game.physics.arcade.overlap(game.player, game.groups.triggers, this.onTrigger, null, this)
		}

		game.player.updateControls()

		//this.debugGame();
		this.hurtManager()

		game.level.update()

		game.groups.render.sort('y', Phaser.Group.SORT_ASCENDING); // depth sort
	}

	onExitReached() {
		game.state.start("GameOver")
		game.music.stop()
	}

	onTrigger(player, trigger) {
		trigger.action();
	}

	lootManager(player, loot) {
		switch (loot.type) {
			case "gem":
				if (player.lucidity < 16) {
					player.lucidity++
					this.updateHud()
				}
				startDialog([
					"Vous avez trouvé une gemme"
				])
			case "coin":
				break;

		}

		sounds.ITEM.play()
		loot.kill()
	}

	hurtPlayer() {
		if (hurtFlag) {
			return
		}
		hurtFlag = true
		this.game.time.reset()

		game.player.alpha = 0.5
		game.player.lucidity--
		this.updateHud()

		sounds.HURT.play()
		if (game.player.lucidity < 1) {
			this.gameOver()
		}
	}

	gameOver() {
		game.music.stop()
		game.state.start("GameOver")
	}

	updateHud() {
		game.lucidityBar.frame = 16 - game.player.lucidity;
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
		game.groups.enemies.forEachAlive(this.renderGroup, this)
		game.groups.pnj.forEachAlive(this.renderGroup, this)
		game.groups.objects.forEachAlive(this.renderGroup, this)
		game.groups.loot.forEachAlive(this.renderGroup, this)
		game.groups.triggers.forEachAlive(this.renderGroup, this)
	}

	renderGroup(member) {
		game.debug.body(member)
	}
}

