export class Gem extends Phaser.Sprite {

    constructor(x, y) {
        super(game, x * 16, y * 16, "atlas", "gem/gem-1");
        this.animations.add(
            "gem",
            Phaser.Animation.generateFrameNames("gem/gem-", 1, 4, "", 0),
            10,
            true
        );
        this.anchor.setTo(0.5);
        game.physics.arcade.enable(this);
        this.animations.play("gem");
        this.type = "gem";
    }
}

export function spawnGem(x, y) {
    const gem = new Gem(x, y);
    game.add.existing(gem);
    game.groups.loot.add(gem);
}