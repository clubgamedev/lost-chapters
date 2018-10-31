export function blinkText(sprite) {
    sprite.alpha = 0.95;
    game.add.tween(sprite)
        .to({ alpha: 0.3 }, 800, Phaser.Easing.Quadratic.InOut)
        .yoyo(true)
        .loop()
        .start()
}