import { addSounds, sounds } from "../audio"
import { Player } from "../characters/Player"
import { goToLevel, levels } from "../levels"
import { openBook } from "../utils/book"
import { updateHud } from "../utils/hud"
import { save } from "../save"
import { talkTo } from "../utils/dialog"
import { toggleItemSelection } from "../utils/inventory"
import { showMiddleText } from "../utils/message"
import { startFight } from "../scenes/minigames/Decryptor"

export class GameScene {
    inventory;
    hurtInvincibility = true;

    create() {
        game.scale.setGameSize(255, 144);
        addSounds()
        this.spawnPlayer()
        game.controls.ACTION.onPress(() => game.player && game.player.doAction());
        game.controls.SELECT.onPress(toggleItemSelection);

        if (!game.save.hasReadIntro) {
            game.paused = true;
            openBook("book_intro").then(() => {
                game.paused = false;
                game.save.hasReadIntro = true;
                this.startGame();
                game.player.forceMove("UP", 1500)
                showMiddleText(levels.school.title)
            })
        } else {
            this.startGame();
        }
    }

    startGame() {
        goToLevel(game.save.level)
        updateHud();
        save()
        setInterval(() => save(), 5000); // AUTOSAVE TOUTES LES 5 SECONDES
        setTimeout(() => { this.hurtInvincibility = false }, 1000);
    }

    spawnPlayer() {
        game.player = new Player(game)
        game.camera.follow(game.player)
    }

    update() {
        if (!game.level) return;

        // physics
        game.physics.arcade.collide(game.player, game.level.layer_collisions)
        game.physics.arcade.collide(game.player, game.groups.pnj)
        game.physics.arcade.collide(game.player, game.groups.objects)
        game.physics.arcade.collide(game.groups.enemies, game.level.layer_collisions)

        if (game.player.alive && !game.disableTriggers) {
            //overlaps
            game.physics.arcade.overlap(game.player, game.groups.enemies, this.hurtPlayer, null, this)
            game.physics.arcade.overlap(game.player, game.groups.triggers, this.onTrigger, null, this)
        }

        game.player.updateControls()

        //this.debugGame();

        game.level.update()

        game.groups.render.sort('y', Phaser.Group.SORT_ASCENDING); // depth sort
        updateHud();

    }

    onTrigger(player, trigger) {
        trigger.action();
    }

    hurtPlayer(player, ennemy) {
        if (this.hurtInvincibility) {
            return
        }

        this.hurtInvincibility = true

        if (ennemy.type === "cultist") {
            ennemy.stopMoving();
            return talkTo("ennemy_cultist")
                .then(() => {
                    ennemy.name = "Cultiste"
                    startFight(ennemy)
                })
        }

        game.player.alpha = 0.5
        game.player.lucidity--

        sounds.HURT.play()
        if (game.player.lucidity < 1) {
            this.gameOver()
        } else {
            setTimeout(() => {
                this.hurtInvincibility = false
                game.player.alpha = 1
            }, 2000)
        }
    }


    gameOver() {
        game.music.stop()
        game.state.start("GameOver")
    }

    debugGame() {
        // return;
        //game.debug.spriteInfo(this.player, 30, 30);

        game.debug.body(game.player)
        game.debug.pixel(game.player.watchingPoint.x, game.player.watchingPoint.y, "rgba(0,255,0,1)", 1);
        game.groups.enemies.forEachAlive(this.renderGroup, this)
        game.groups.pnj.forEachAlive(this.renderGroup, this)
        game.groups.objects.forEachAlive(this.renderGroup, this)
        game.groups.nonCollidableObjects.forEachAlive(this.renderGroup, this)
        game.groups.triggers.forEachAlive(this.renderGroup, this)
    }

    renderGroup(member) {
        game.debug.body(member)
    }
}
