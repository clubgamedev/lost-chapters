import { shuffleArray } from "../../utils/array";
import { startDialog } from "../../utils/dialogs";

let countDown;
let timerText;

let keyAction;

let elementsToFind = [];
let MAX_NB_BUTTONS = 8;
let actionArray = ["u", "d", "l", "r", "1", "2", "3", "4"];
let zodiacsArray = ["aquarius", "aries", "cancer", "capricorn", "gemini", "leo", "libra", "pisces", "sagittarius", "scorpio", "taurus", "virgo"];
let mapActionSprite = {
    "u" : "arrowUp.png",
    "d" : "arrowDown.png",
    "l" : "arrowLeft.png",
    "r" : "arrowRight.png",
    "1" : "buttonA.png",
    "2" : "buttonB.png",
    "3" : "buttonX.png",
    "4" : "buttonY.png",
    "lt" : "upLeft.png",
    "rt" : "upRight.png",
    "lb" : "downLeft.png",
    "rb" : "downRight.png"
};
let tricksArray = ["lt", "rt", "lb", "rb"];

let downScreenHeight;

let gameState = {
    elementIndex: 0,
    state: "BEGINNING"
};
let mapActionZodiacs = new Map();
let screenTips = [];
let sprites = [];
let bottomBar;

let DecryptorConfig = {
    BLINK: "blink",
    ALEA_BLINK: "alea_blink",
    SCREEN_SHUFFLE: "screen_shuffle",
    ACTION_SHUFFLE: "action_shuffle"
};

export class DecryptorScene {
    preload() {
        loadActions();
        loadZodiacs();
        keyAction = {
            "u": [Phaser.Keyboard.UP, Phaser.Gamepad.XBOX360_DPAD_UP],
            "d": [Phaser.Keyboard.DOWN, Phaser.Gamepad.XBOX360_DPAD_UP],
            "l": [Phaser.Keyboard.LEFT, Phaser.Gamepad.XBOX360_DPAD_UP],
            "r": [Phaser.Keyboard.RIGHT, Phaser.Gamepad.XBOX360_DPAD_UP],
            "1": [Phaser.Keyboard.ONE, Phaser.Keyboard.A, Phaser.Gamepad.XBOX360_A],
            "2": [Phaser.Keyboard.TWO, Phaser.Keyboard.B, Phaser.Gamepad.XBOX360_B],
            "3": [Phaser.Keyboard.THREE, Phaser.Keyboard.X, Phaser.Gamepad.XBOX360_X],
            "4": [Phaser.Keyboard.FOUR, Phaser.Keyboard.Y, Phaser.Gamepad.XBOX360_Y]
        }
    }

    create() {
        game.scale.setGameSize(800, 450);

        downScreenHeight = game.height / 5;
        constructMapActionZodiacs();
        createElements();
        createScreenTips();

        countDown = game.time.create(false);

        countDown.add(Phaser.Timer.SECOND * (game.duration ? game.duration : 30), gameOver, this);

        countDown.start();

        game.input.gamepad.start();
        game.input.gamepad.onDownCallback = function (e) {
            testKeyPressWithElement(e.keyCode, elementsToFind[gameState.elementIndex]);
        };
        game.input.gamepad.onAxisCallback = function (e) {
            testKeyPressWithElement(e.keyCode, elementsToFind[gameState.elementIndex]);
        };

        game.input.keyboard.addKeyCapture([Phaser.Keyboard.A, Phaser.Keyboard.B, Phaser.Keyboard.X, Phaser.Keyboard.Y, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE, Phaser.Keyboard.FOUR, Phaser.Keyboard.CONTROL, Phaser.Keyboard.ALT, Phaser.Keyboard.ENTER, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT])
        game.input.keyboard.onDownCallback = function (e) {
            testKeyPressWithElement(e.keyCode, elementsToFind[gameState.elementIndex]);
        };
    }

    update() {
        if (gameState.elementIndex === 8) {
            gameOver(true);
        }
    }

    render() {
        timerText && timerText.destroy();
        timerText = game.add.text(8, 8, `Time is bleeding: ${(countDown.duration / 1000).toFixed(0)}s`, {
            font: "14px Alagard",
            fill: "white",
            boundsAlignH: "left",
            boundsAlignV: "bottom",
            wordWrap: true,
            wordWrapWidth: 245
        });
    }

    shutdown() {
        clearSprites();
        countDown.removeAll();
        gameState.elementIndex = 0;
        elementsToFind = [];
        game.input.keyboard.onDownCallback = null;
        game.input.gamepad.onDownCallback = null;
        game.input.gamepad.onAxisCallback = null;
    }
}

function loadActions() {
    game.load.atlasXML('game_buttons', 'assets/decryptor/game_buttons.png', 'assets/decryptor/game_buttons.xml');
}

function loadZodiacs() {
    game.load.image("aquarius", "assets/decryptor/aquarius.png");
    game.load.image("aries", "assets/decryptor/aries.png");
    game.load.image("cancer", "assets/decryptor/cancer.png");
    game.load.image("capricorn", "assets/decryptor/capricorn.png");
    game.load.image("gemini", "assets/decryptor/gemini.png");
    game.load.image("leo", "assets/decryptor/leo.png");
    game.load.image("libra", "assets/decryptor/libra.png");
    game.load.image("pisces", "assets/decryptor/pisces.png");
    game.load.image("sagittarius", "assets/decryptor/sagittarius.png");
    game.load.image("scorpio", "assets/decryptor/scorpio.png");
    game.load.image("taurus", "assets/decryptor/taurus.png");
    game.load.image("virgo", "assets/decryptor/virgo.png");
    game.load.image("bottomBar", "assets/decryptor/bottom_bar.png");
    game.load.image("backgroundTipsCave", "assets/decryptor/background_tips_cave.png")

}

function constructMapActionZodiacs() {
    let actionArrayRemained = actionArray.slice();
    let zodiacsArrayRemained = zodiacsArray.slice();
    let tricksArrayRemained = tricksArray.slice();
    while (zodiacsArrayRemained.length > 0) {
        let indexZodiac = Math.floor(Math.random() * zodiacsArrayRemained.length);
        let indexAction = Math.floor(Math.random() * actionArrayRemained.length);
        let indexTrick = Math.floor(Math.random() * tricksArrayRemained.length);
        if (actionArrayRemained.length > 0) {
            mapActionZodiacs.set(actionArrayRemained[indexAction], zodiacsArrayRemained[indexZodiac]);
            actionArrayRemained.splice(indexAction, 1);
        } else {
            mapActionZodiacs.set(tricksArrayRemained[indexTrick], zodiacsArrayRemained[indexZodiac]);
            tricksArrayRemained.splice(indexTrick, 1);
        }
        zodiacsArrayRemained.splice(indexZodiac, 1);
    }
}

function shuffleMapActionZodiacs() {
    let actionArrayRemained = actionArray.slice();
    let tricksArrayRemained = tricksArray.slice();
    let oldMapActionZodiacs = new Map(mapActionZodiacs);
    oldMapActionZodiacs.forEach((zodiac, action) => {
        let indexAction = Math.floor(Math.random() * actionArrayRemained.length);
        let indexTrick = Math.floor(Math.random() * tricksArrayRemained.length);
        if (actionArray.indexOf(action) > -1) {
            mapActionZodiacs.set(actionArrayRemained[indexAction], zodiac);
            actionArrayRemained.splice(indexAction, 1);
        } else {
            mapActionZodiacs.set(tricksArrayRemained[indexTrick], zodiac);
            tricksArrayRemained.splice(indexTrick, 1);
        }
    });
}

function createElements() {
    bottomBar = game.add.image(0, game.height - downScreenHeight, "bottomBar");
    sprites.push(bottomBar);

    for (let i = 0; i < MAX_NB_BUTTONS; i++) {
        let action = actionArray[Math.floor(Math.random() * MAX_NB_BUTTONS)];
        let elementPlace = new Phaser.Graphics(game, 0, game.height - downScreenHeight);
        elementPlace.drawRect(i * game.width / 8 + 15, (downScreenHeight - 60) / 2, 70, 60);
        let zodiacImage = game.add.image(i * game.width / 8 + 20, (downScreenHeight - 50) / 2, mapActionZodiacs.get(action));
        sprites.push(zodiacImage);
        //console.log(mapActionZodiacs.get(action) + " / " + action);
        elementPlace.addChild(zodiacImage);

        let element = {
            display: elementPlace,
            zodiac: mapActionZodiacs.get(action),
            action: action
        };
        elementsToFind.push(element);
        game.world.addChild(element.display);
    }
}

function refreshActionsElements() {
    elementsToFind.forEach((element) => {
        element.action = findActionForZodiac(element.zodiac);
    })
}

function findActionForZodiac(zodiacToFind) {
    let result = "";
    mapActionZodiacs.forEach((zodiac, action) => {
        if (zodiacToFind === zodiac) {
            result = action;
        }
    });
    return result;
}

function createScreenTips() {
    game.add.image(0,0,'backgroundTipsCave');
    let tipsPlaces = createPlaces();

    let i = 0;
    mapActionZodiacs.forEach((zodiac, action) => {
        let scaleButtonImage = 0.75;
        let place = tipsPlaces[i];
        let TmpImg = game.cache.getImage(zodiac);
        let zodiacImage = game.add.sprite(place.width / 2 - TmpImg.width / 2, place.height / 2 - (TmpImg.height / 2 + ((50 * scaleButtonImage) / 2)), zodiac);
        game.add.tween(zodiacImage)
            .to( { y: zodiacImage.y + 10 }, 1500, Phaser.Easing.Linear.None)
            .yoyo(true)
            .loop()
            .start();
        sprites.push(zodiacImage);
        let actionImage = game.add.sprite(place.width / 2 - (50*0.75/2), place.height - (50*scaleButtonImage), 'game_buttons');
        actionImage.frameName = mapActionSprite[action];
        actionImage.scale.setTo(scaleButtonImage, scaleButtonImage);
        place.addChild(actionImage);
        if (game.variants.indexOf(DecryptorConfig.BLINK) > -1 || game.variants.indexOf(DecryptorConfig.ALEA_BLINK) > -1) {
            let duration = game.variants.indexOf(DecryptorConfig.ALEA_BLINK) > -1 ? Math.random() * 800 + 100 : 800;
            zodiacImage.alpha = 1;
            game.add.tween(zodiacImage)
                .to({ alpha: 0 }, duration, Phaser.Easing.Cubic.InOut)
                .yoyo(true)
                .loop()
                .start()
        }
        place.addChild(zodiacImage);
        screenTips.push(place);
        game.world.addChild(place);
        i++;
    });
}

function createPlaces() {
    let widthPlace = game.width / 4;
    let heightPlace = (game.height - downScreenHeight) / 3;
    let x = 0;
    let y = 0;
    let tipsPlaces = [];
    for (let i = 0; i < zodiacsArray.length; i++) {
        let graphicsPlace = new Phaser.Graphics(game, x, y);
        graphicsPlace.drawRect(0, 0, widthPlace, heightPlace);
        tipsPlaces[i] = graphicsPlace;
        x = (x + widthPlace) % game.width;
        if (x === 0 && i !== 0) {
            y = (y + heightPlace) % (game.height - downScreenHeight);
        }
    }
    shuffleArray(tipsPlaces);
    return tipsPlaces;
}

function gameOver(youWon) {
    game.state.start('MainGame');
    setTimeout(() => {
        if (youWon) {
            startDialog(["More knowledge !"], "lightblue");
        } else {
            startDialog(["Too late..."], "#aaa");
        }

    }, 500);
}

function clearScreenTips() {
    screenTips.forEach((screenTip) => {
        screenTip.destroy();
    });
    screenTips = [];
}

function clearSprites() {
    clearScreenTips();
    sprites.forEach(sprite => sprite.destroy());
    sprites = [];
    timerText && timerText.destroy();
    bottomBar.destroy();
}

function testKeyPressWithElement(keyPress, element) {
    console.log("keyPress : " , keyPress);
    console.log("keyActionForElement : " , keyAction[element.action]);
    if (keyAction[element.action].indexOf(keyPress) > -1) {
        let tween = game.add.tween(element.display)
            .to( { y : element.display.y + 10, alpha : 0 }, 500, Phaser.Easing.Linear.None);
            tween.onComplete.add(()=>{element.display.destroy()}, this);
            tween.start();
        gameState.elementIndex++;
        if (game.variants.indexOf(DecryptorConfig.SCREEN_SHUFFLE) > -1) {
            clearScreenTips();
            createScreenTips();
        } else if (game.variants.indexOf(DecryptorConfig.ACTION_SHUFFLE) > -1) {
            clearScreenTips();
            shuffleMapActionZodiacs();
            refreshActionsElements();
            createScreenTips();
        }
    }else{
        let duration = countDown.duration;
        game.camera.shake(0.01, 250);
        game.camera.flash(0xcc0000, 500);
        if(duration>5000){
            countDown.removeAll();
            countDown.add(duration - (Phaser.Timer.SECOND * 5), gameOver, this);
            console.log('Lose 5 seconds');
        }else{
            gameOver();
        }
    }
}