export function startDialog(lines, color = "#994C4C") {
    game.player.stopMoving();

    let bgSprite = game.add.sprite(0, game.height - 40, "dialog-box");
    bgSprite.fixedToCamera = true;

    let textSprite = game.add.text(8, game.height - 34, "", {
        font: "14px Alagard",
        fill: color,
        boundsAlignH: "left",
        boundsAlignV: "bottom",
        wordWrap: true,
        wordWrapWidth: 245
    });
    //textSprite.setShadow(1, 1, '#280900', 0);
    textSprite.lineSpacing = -9;
    textSprite.fixedToCamera = true;

    game.dialog = { lines: [...lines], color, textSprite, bgSprite };

    nextLine();
}

export function nextLine() {
    if (!game.dialog) return;
    if (game.dialog.lines.length === 0) return endDialog();

    game.dialog.textSprite.text = game.dialog.lines.shift();
}

export function talkTo(name) {
    switch (name) {
        case "franck":
            startDialog([
                "Vas-y Francky c bon !"
            ])
            break;
        case "augustin":
            startDialog([
                "Je suis le méchant et je m'appelle Augustin. Je suis très méchant.",
                "Tout a commencé quand on m'a volé mon sandwich à la confiture au CM2.",
                "Déjà à l'époque on me trouvait bavard et peu charismatique...",
                "Comment ça tu t'en fous ? Mais il faut bien tester les dialogues ! #@$&!"
            ])
            break;
    }
}

export function endDialog() {
    if (game.dialog) {
        game.dialog.textSprite.destroy();
        game.dialog.bgSprite.destroy();
        delete game.dialog;
    }
}