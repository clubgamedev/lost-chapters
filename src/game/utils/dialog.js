import { dialogs } from "../dialogs"

export function startDialog(lines, color = "#CC1C00") {
    game.player && game.player.stopMoving();

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
    textSprite.lineSpacing = -10;
    textSprite.fixedToCamera = true;
    textSprite.stroke = '#000000';
    textSprite.strokeThickness = 1;

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

    while (typeof line === "function" || Array.isArray(line)) {
        if (typeof line === "function") line = line(game.save)
        if (Array.isArray(line)) {
            game.dialog.lines.unshift(...line)
            line = game.dialog.lines.shift()
        }
    }

    if (!line) return endDialog();

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
    const dialogWidth = 178;

    let bgSprite = game.add.sprite(game.width - dialogWidth - 4, game.height - 86, "dialog-choice-box");
    bgSprite.width = 178;
    bgSprite.height = 8 + 16 * options.length;
    bgSprite.fixedToCamera = true;

    let textSprite = game.add.text(game.width - dialogWidth + 12, game.height - 80, Object.keys(choice).join("\n"), {
        font: "14px Alagard",
        fill: "#B23535",
        boundsAlignH: "left",
        boundsAlignV: "bottom"
    });
    textSprite.fixedToCamera = true
    textSprite.lineSpacing = -9;
    textSprite.stroke = '#000000';
    textSprite.strokeThickness = 1;

    let selectionSprite = game.add.text(game.width - dialogWidth, game.height - 80, "►", {
        font: "12px Alagard",
        fill: "#B23535",
        boundsAlignH: "left",
        boundsAlignV: "bottom"
    })
    selectionSprite.fixedToCamera = true
    selectionSprite.stroke = '#000000';
    selectionSprite.strokeThickness = 1;

    game.controls.UP.onDown(selectChoice)
    game.controls.DOWN.onDown(selectChoice)

    game.dialog.choice = { options, textSprite, bgSprite, selectionSprite }
    game.dialog.selectedChoice = 0;
}

export function selectChoice() {
    let upOrDown = game.controls.UP.isPressed() ? -1 : +1
    let nbOptions = game.dialog.choice.options.length
    game.dialog.selectedChoice = (game.dialog.selectedChoice + nbOptions + upOrDown) % nbOptions
    game.dialog.choice.selectionSprite.cameraOffset.y = game.height - 80 + 14 * game.dialog.selectedChoice;
}

export function endChoice() {
    let selectedChoice = game.dialog.choice.options[game.dialog.selectedChoice]
    game.dialog.choice.selectionSprite.destroy();
    game.dialog.choice.textSprite.destroy();
    game.dialog.choice.bgSprite.destroy();
    game.controls.UP.stopListeningOnDown(selectChoice)
    game.controls.DOWN.stopListeningOnDown(selectChoice)
    delete game.dialog.choice;
    return selectedChoice
}

export function exhaustDialog(questions, endDialogChoice) {
    let choice = {};
    for (let question in questions) {
        let remainingQuestions = Object.assign({}, questions)
        delete remainingQuestions[question];
        choice[question] = () => [].concat(questions[question]).concat(exhaustDialog(remainingQuestions, endDialogChoice))
    }
    choice[endDialogChoice] = () => []; // pass to next line
    return choice;
}