export class Coin extends Phaser.Sprite {

    constructor(x, y) {
        super(game, x * 16, y * 16, "atlas", "coin/coin-1");
        this.animations.add(
            "coin",
            Phaser.Animation.generateFrameNames("coin/coin-", 1, 4, "", 0),
            10,
            true
        );
        this.anchor.setTo(0.5);
        game.physics.arcade.enable(this);
        this.animations.play("coin");
        this.type = "coin";
    }
}

export function spawnCoin(x, y) {
    const coin = new Coin(x, y);
    game.add.existing(coin);
    game.groups.loot.add(coin);
}