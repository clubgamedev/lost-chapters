export function showDialog(text) {
    let textSprite = game.add.text(8, game.height - 14, text, {
        font: "bold 8px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "bottom"
    });
    textSprite.fixedToCamera = true;

    game.dialog = { text, sprite: textSprite };
}

export function talkTo(name) {
    switch (name) {
        case "franck":
            showDialog("Vas-y Francky c bon !")
            break;
        case "augustin":
            showDialog("Je suis le méchant je m'appelle Augustin")
            break;
    }
}

export function hideDialog() {
    if (game.dialog) {
        game.dialog.sprite.destroy();
        delete game.dialog;
    }
}