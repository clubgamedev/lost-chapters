import baragouin from "baragouin"
import { dialogs } from "../dialogs"

export function startDialog(lines, params = {}) {
    if (game.dialog) endDialog();

    let { color, speaker } = params = Object.assign({
        color: "#CC1C00",
        bg: "dialog-box"
    }, params)

    let voice = Object.assign({}, voicesByActor[speaker], params)
    voice.emotion = (voice.emotion || 30) + (16 - game.player.lucidity) * 4

    game.player && game.player.stopMoving();

    let bgSprite = game.add.sprite(0, game.height - 40, params.bg);
    bgSprite.fixedToCamera = true;

    let textSprite = game.add.text(8, game.height - 36, "", {
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

    game.dialog = { lines: [...lines], speaker, voice, color, textSprite, bgSprite };

    nextLine();
    return new Promise(resolve => {
        game.dialog.onEnd = resolve;
    })
}

export function nextLine() {
    if (!game.dialog) return;
    if (game.dialog.speech) {
        game.dialog.speech.stop();
        delete game.dialog.speech;
        return;
    }

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

    if (line instanceof Promise) return;
    if (!line) return endDialog();

    if (Object.getPrototypeOf(line) === Object.prototype) {
        startChoice(line)
    } else {
        sayLine(line)
    }
}

export function talkTo(name) {
    return startDialog(dialogs[name](game.save), { speaker: name });
}

export function talkToMyself(lines) {
    return startDialog(lines, {
        speaker: "myself",
        color: "#629CBC",
        skipSpeech: true,
        bg: "dialog-myself-box"
    });
}

export function endDialog() {
    if (game.dialog) {
        game.dialog.textSprite.destroy();
        game.dialog.bgSprite.destroy();
        game.dialog.onEnd && game.dialog.onEnd();
        delete game.dialog;
    }
}

export function startChoice(choice) {
    let options = Object.values(choice);
    const dialogWidth = 178;
    let topY = game.height - 44 - 14 * options.length

    let bgSprite = game.add.sprite(game.width - dialogWidth - 4, topY, "dialog-choice-box");
    bgSprite.width = 178;
    bgSprite.height = 12 + 14 * options.length;
    bgSprite.fixedToCamera = true;

    let textSprite = game.add.text(game.width - dialogWidth + 12, topY + 4, Object.keys(choice).join("\n"), {
        font: "14px Alagard",
        fill: "#B23535",
        boundsAlignH: "left",
        boundsAlignV: "bottom"
    });
    textSprite.fixedToCamera = true
    textSprite.lineSpacing = -9;
    textSprite.stroke = '#000000';
    textSprite.strokeThickness = 1;

    let selectionSprite = game.add.text(game.width - dialogWidth, topY + 4, "►", {
        font: "12px Alagard",
        fill: "#B23535",
        boundsAlignH: "left",
        boundsAlignV: "bottom"
    })
    selectionSprite.fixedToCamera = true
    selectionSprite.stroke = '#000000';
    selectionSprite.strokeThickness = 1;

    game.controls.UP.onPress(selectChoice)
    game.controls.DOWN.onPress(selectChoice)

    game.dialog.choice = { options, textSprite, bgSprite, selectionSprite }
    game.dialog.selectedChoice = 0;
}

export function selectChoice() {
    let upOrDown = game.controls.UP.isPressed() ? -1 : +1
    let nbOptions = game.dialog.choice.options.length
    game.dialog.selectedChoice = (game.dialog.selectedChoice + nbOptions + upOrDown) % nbOptions
    game.dialog.choice.selectionSprite.cameraOffset.y = game.height - 40 - 14 * (nbOptions - game.dialog.selectedChoice);
}

export function endChoice() {
    let selectedChoice = game.dialog.choice.options[game.dialog.selectedChoice]
    game.dialog.choice.selectionSprite.destroy();
    game.dialog.choice.textSprite.destroy();
    game.dialog.choice.bgSprite.destroy();
    game.controls.UP.resetEvents()
    game.controls.DOWN.resetEvents()
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

export function sayLine(line) {
    if (game.dialog.voice.skipSpeech) {
        game.dialog.textSprite.text = line;
        return;
    }

    game.dialog.speech = baragouin(line, Object.assign({
        onNote(text) {
            game.dialog.textSprite.text = text;
        },
        onEnd(text) {
            game.dialog.textSprite.text = text;
            delete game.dialog.speech
        }
    }, game.dialog.voice));
}

export const voicesByActor = {
    franck: {
        emotion: 25,
        pitch: 25,
        speed: 35,
        resonance: 10
    },
    marie: {
        emotion: 50,
        pitch: 60,
        speed: 40,
        resonance: 15
    },
    myself: {
        volume: 0 //intense thinking
    },
    afraid: {
        emotion: 90,
        pitch: 40,
        speed: 10,
        resonance: 50
    }
}