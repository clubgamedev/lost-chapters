/* global Phaser */

export class EnemyDeath extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, "atlas", "enemy-death/enemy-death-1");
        this.anchor.setTo(0.5);
        const anim = this.animations.add(
            "death",
            Phaser.Animation.generateFrameNames("enemy-death/enemy-death-", 1, 6, "", 0),
            18,
            false
        );
        this.animations.play("death");
        anim.onComplete.add(function () {
            this.kill();
        }, this);
    }
}

export function spawnEnemyDeath(x, y) {
    game.add.existing(new EnemyDeath(game, x, y));
}