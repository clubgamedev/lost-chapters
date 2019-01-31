import { shuffleArray } from "../../utils/array";
import { startDialog } from "../../utils/dialog";

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
let gameObjects = [];
let bottomBar;
let countdownBar;
let tipsPlaces;
let particleInitialized;
let errorSound;
let foundSound;
let playbackRateValue;

let DecryptorConfig = {
    BLINK: "blink",
    ALEA_BLINK: "alea_blink",
    SCREEN_SHUFFLE: "screen_shuffle",
    ACTION_SHUFFLE: "action_shuffle"
};

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
    game.load.image("backgroundTipsCave", "assets/decryptor/background_tips_cave.png");
    game.load.image("particle_blue", "assets/decryptor/particle_blue.png");
    game.load.spritesheet("sunburn", "assets/decryptor/sunburn_spritesheet.png", 100, 100, 61);
}

function loadSounds() {
    game.load.audio('element_found', 'assets/decryptor/collect_item_hurry_out_of_time_01.wav');
    game.load.audio('element_error', 'assets/decryptor/voice_male_b_effort_quick_action_05.wav');

}

export class DecryptorScene {
    preload() {
        loadActions();
        loadZodiacs();
        loadSounds();

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

        tipsPlaces = createPlaces();
        this.createCountdownBar();
        particleInitialized = false;
        playbackRateValue=1;
        foundSound = game.sound.add('element_found');
        //gameObjects.push(foundSound);
        errorSound = game.sound.add('element_error');
        //gameObjects.push(errorSound);


        createElementsWithButtons();
        createElementsToDecrypt();
        activeElement(elementsToFind[gameState.elementIndex].display);

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

    createCountdownBar() {
        let backgroupCave = game.add.image(0, 0, 'backgroundTipsCave');
        gameObjects.push(backgroupCave);
        countdownBar = game.add.graphics(0, game.height - downScreenHeight);
        countdownBar.beginFill(0xcc0000, 0.2);
        countdownBar.drawRect(0, 0, game.width, 1);
        countdownBar.endFill();
        gameObjects.push(countdownBar);
    }

    update() {

    }

    render() {
        countdownBar.y = (countDown.duration / 1000 / game.duration) * (game.height - downScreenHeight);
        countdownBar.height = (game.height - downScreenHeight) - countdownBar.y;
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

function createElementsToDecrypt() {
    bottomBar = game.add.image(0, game.height - downScreenHeight, "bottomBar");
    gameObjects.push(bottomBar);

    for (let i = 0; i < MAX_NB_BUTTONS; i++) {
        let action = actionArray[Math.floor(Math.random() * MAX_NB_BUTTONS)];
        let elementPlace = new Phaser.Graphics(game, 0, game.height - downScreenHeight);
        elementPlace.drawRect(i * game.width / 8 + 15, (downScreenHeight - 60) / 2, 70, 60);

        let zodiacImage = game.add.image(i * game.width / 8 + 20, (downScreenHeight - 50) / 2, mapActionZodiacs.get(action));

        let sunburn = game.add.sprite(zodiacImage.x - zodiacImage.width*80/100, zodiacImage.y - zodiacImage.height, "sunburn");
        sunburn.scale.set(1.5);
        sunburn.alpha = 0;
        let anim = sunburn.animations.add('burn');
        anim.play(60, true);
        elementPlace.addChild(sunburn);

        gameObjects.push(zodiacImage);
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

function addParticlesToElement(place, scaleButtonImage, imageWidth) {
    let emitter = game.add.emitter(place.x + place.width / 2, place.y + place.height / 2 - ((50 * scaleButtonImage) / 2) + 10);
    emitter.width = imageWidth - 10;
    emitter.makeParticles('particle_blue');
    emitter.setRotation(0, 0);
    emitter.setAlpha(0, 1);
    emitter.setScale(0.5, 1, 0.5, 1);
    emitter.setXSpeed(0, 0);
    emitter.setYSpeed(50, 100);
    emitter.start(false, 300, 100, 0);
    gameObjects.push(emitter);
}

function createElementsWithButtons() {
    let i = 0;
    mapActionZodiacs.forEach((zodiac, action) => {
        let scaleButtonImage = 0.75;
        let place = tipsPlaces[i];

        let TmpImg = game.cache.getImage(zodiac);
        if(!particleInitialized) {
            addParticlesToElement(place, scaleButtonImage, TmpImg.width);
        }

        let actionImage = game.add.sprite(place.width / 2 - (50*0.75/2), place.height - (50*scaleButtonImage), 'game_buttons');
        actionImage.frameName = mapActionSprite[action];
        actionImage.scale.setTo(scaleButtonImage, scaleButtonImage);
        place.addChild(actionImage);

        let zodiacImage = game.add.sprite(place.width / 2 - TmpImg.width / 2, place.height / 2 - (TmpImg.height / 2 + ((50 * scaleButtonImage) / 2)), zodiac);
        game.add.tween(zodiacImage)
            .to( { y: zodiacImage.y + 15 }, 1000, Phaser.Easing.Linear.None)
            .yoyo(true)
            .loop()
            .start();
        gameObjects.push(zodiacImage);
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
    particleInitialized = true;
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
    countDown.stop();
    if (youWon) {
        createWinningScreen();
    }else{
        createLosingScreen();
    }
    game.input.gamepad.onDownCallback = function(){quitGame(youWon)};
    game.input.keyboard.onDownCallback = function(){quitGame(youWon)};
}

function quitGame(youWon){
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

function emptyScreenTips() {
    screenTips.forEach((screenTip) => {
        screenTip.removeChildren();
    });
}

function clearSprites() {
    clearScreenTips();
    gameObjects.forEach(sprite => sprite.destroy());
    gameObjects = [];
    timerText && timerText.destroy();
    bottomBar.destroy();
}

function testKeyPressWithElement(keyPress, element) {
    console.log("keyPress : " , keyPress);
    console.log("keyActionForElement : " , keyAction[element.action]);
    if (keyAction[element.action].indexOf(keyPress) > -1) {
        foundSound.play();
        foundSound._sound.playbackRate.value = playbackRateValue;
        playbackRateValue += 0.1;
        zoomAndDeleteElementToFind(element);
        gameState.elementIndex++;
        if(gameState.elementIndex === MAX_NB_BUTTONS){
            gameOver(true);
        }else {
            activeElement(elementsToFind[gameState.elementIndex].display);

            if (game.variants.indexOf(DecryptorConfig.SCREEN_SHUFFLE) > -1) {
                emptyScreenTips();
                createElementsWithButtons();
            } else if (game.variants.indexOf(DecryptorConfig.ACTION_SHUFFLE) > -1) {
                emptyScreenTips();
                shuffleMapActionZodiacs();
                refreshActionsElements();
                createElementsWithButtons();
            }
        }
    }else{
        let duration = countDown.duration;
        game.camera.shake(0.01, 250);
        game.camera.flash(0xcc0000, 500);
        if(duration>5000){
            errorSound.play();
            countDown.removeAll();
            countDown.add(duration - (Phaser.Timer.SECOND * 5), gameOver, this);
            console.log('Lose 5 seconds');
        }else{
            gameOver();
        }
    }
}

function activeElement(elementDisplay) {
    var percentZoom = 20;
    elementDisplay.children[0].alpha = 1;
    elementDisplay.children[1].scale.set(1+(percentZoom/100), 1+(percentZoom/100));
    elementDisplay.children[1].x -= (elementDisplay.children[1].width * percentZoom / 200);
    elementDisplay.children[1].y -= (elementDisplay.children[1].height * percentZoom / 200);

}

function zoomAndDeleteElementToFind(element) {

    let tween = game.add.tween(element.display.children[1])
        .to({
            alpha: 0,
            x: 0,
            y: -game.height,
            z: 1000,
            width: element.display.children[1].width * 10,
            height: element.display.children[1].height * 10
        }, 500, Phaser.Easing.Linear.None);
    tween.onComplete.add(()=>{element.display.destroy()}, this);
    tween.start();
    element.display.children[0].destroy();
}

function createWinningScreen() {
    createMiddleText("Hum, je vois...", 0xFFFFFF, 0x000000);
}

function createLosingScreen() {
    createMiddleText("Incompréhensible...", 0x000000, "#e32020");
}

function createMiddleText(textToDisplay, backgroundColor, textColor) {
    let middleText = game.add.graphics(-game.width, game.height / 3);
    middleText.beginFill(backgroundColor, 0.75);
    middleText.drawRect(0, 0, game.width, game.height / 3);
    middleText.endFill();
    gameObjects.push(middleText);

    let textSprite = game.add.text(0, 0, textToDisplay, {
        font: "60px Alagard",
        fill: textColor,
        boundsAlignH: "center",
        boundsAlignV: "middle"
    });
    textSprite.setTextBounds(0, 0, middleText.width, middleText.height);
    middleText.addChild(textSprite);
    gameObjects.push(textSprite);

    game.add.tween(middleText).to({x : 0}, 750, Phaser.Easing.Linear.None).start();
}