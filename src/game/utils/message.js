export function showMiddleText(textToDisplay, backgroundColor = 0x000000, textColor = "#FFFFFF", duration = 1500, textSize = "16px") {
    if (game.middleTextTweens) {
        Object.values(game.middleTextTweens).forEach(tween => tween.stop(true))
    }

    let middleText = game.add.graphics(0, game.height / 3);
    middleText.fixedToCamera = true;
    middleText.beginFill(backgroundColor, 0.75);
    middleText.drawRect(0, 0, game.width, game.height / 3);
    middleText.endFill();
    middleText.alpha = 0;

    let textSprite = game.add.text(-game.width, 0, textToDisplay, {
        font: textSize + " Alagard",
        fill: textColor,
        boundsAlignH: "center",
        boundsAlignV: "middle"
    });
    textSprite.setTextBounds(0, 0, middleText.width, middleText.height);
    middleText.addChild(textSprite);

    let fadeIn = game.add.tween(middleText).to({ alpha: 0.8 }, 400, Phaser.Easing.Linear.None)
    let textIn = game.add.tween(textSprite).to({ x: 0 }, 400, Phaser.Easing.Quadratic.InOut)
    fadeIn.chain(textIn)
    fadeIn.start();

    let textOut = game.add.tween(textSprite).to({ x: game.width }, 400, Phaser.Easing.Quadratic.InOut)
    let fadeOut = game.add.tween(middleText).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None)
    textOut.chain(fadeOut)
    game.middleTextTweens = { fadeIn, textIn, fadeOut, textOut };
    fadeOut.onComplete.addOnce(() => {
        middleText.destroy();
        delete game.middleTextTweens;
    })

    textIn.onComplete.addOnce(() => {
        setTimeout(() => textOut.start(), duration)
    })
}