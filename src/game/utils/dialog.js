import { dialogs } from "../dialogs"

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

    let line;
    if (game.dialog.choice) {
        line = endChoice()
    } else {
        line = game.dialog.lines.shift()
    }

    if (!line) return endDialog();

    if (typeof line === "function") {
        line = line(game.save)
    }

    if (Array.isArray(line)) {
        game.dialog.lines.unshift(...line)
        line = game.dialog.lines.shift()
    }

    if (Object.getPrototypeOf(line) === Object.prototype) {
        startChoice(line)
    } else {
        game.dialog.textSprite.text = line;
    }
}

export function talkTo(name) {
    startDialog(dialogs[name](game.save));
}

export function endDialog() {
    if (game.dialog) {
        game.dialog.textSprite.destroy();
        game.dialog.bgSprite.destroy();
        delete game.dialog;
    }
}

export function startChoice(choice) {
    let options = Object.values(choice);

    let bgSprite = game.add.sprite(game.width - 132, game.height - 86, "dialog-choice-box");
    bgSprite.width = 128;
    bgSprite.height = 8 + 16 * options.length;
    bgSprite.fixedToCamera = true;

    let textSprite = game.add.text(game.width - 116, game.height - 80, Object.keys(choice).join("\n"), {
        font: "14px Alagard",
        fill: "#994C4C",
        boundsAlignH: "left",
        boundsAlignV: "bottom"
    });
    textSprite.fixedToCamera = true
    textSprite.lineSpacing = -8

    let selectionSprite = game.add.text(game.width - 128, game.height - 80, "►", {
        font: "12px Alagard",
        fill: "#994c4c",
        boundsAlignH: "left",
        boundsAlignV: "bottom"
    })
    selectionSprite.fixedToCamera = true
    window.selectionSprite = selectionSprite

    function onUp() {
        game.dialog.selectedChoice = (game.dialog.selectedChoice + options.length - 1) % options.length
        selectionSprite.cameraOffset.y = game.height - 80 + 15 * game.dialog.selectedChoice;
    }

    function onDown() {
        game.dialog.selectedChoice = (game.dialog.selectedChoice + 1) % options.length
        selectionSprite.cameraOffset.y = game.height - 80 + 15 * game.dialog.selectedChoice;
    }

    game.input.keyboard.keys.up.onDown.add(onUp)
    game.input.keyboard.keys.down.onDown.add(onDown)

    game.dialog.choice = { options, textSprite, bgSprite, selectionSprite, onUp, onDown }
    game.dialog.selectedChoice = 0;
}

export function endChoice() {
    let selectedChoice = game.dialog.choice.options[game.dialog.selectedChoice]
    game.dialog.choice.selectionSprite.destroy();
    game.dialog.choice.textSprite.destroy();
    game.dialog.choice.bgSprite.destroy();
    game.input.keyboard.keys.up.onDown.remove(game.dialog.choice.onUp)
    game.input.keyboard.keys.down.onDown.remove(game.dialog.choice.onDown)
    delete game.dialog.choice;
    return selectedChoice
}