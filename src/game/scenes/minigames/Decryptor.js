import { shuffleArray } from "../../utils/array";
import { talkToMyself } from "../../utils/dialog";
import { dialogs } from "../../dialogs"
import { save, loadSave } from "../../save"
import { createParticlesEmitter } from "../../effects/particles";

let countDown;
let timerText;
let keyAction;
let duration, variants;

let elementsToFind = [];
let MAX_NB_BUTTONS = 8;
let actionArray = ["u", "d", "l", "r", "1", "2", "3", "4"];
let zodiacsArray = ["aquarius", "aries", "cancer", "capricorn", "gemini", "leo", "libra", "pisces", "sagittarius", "scorpio", "taurus", "virgo"];
let mapActionSprite = {
    "u": "arrowUp.png",
    "d": "arrowDown.png",
    "l": "arrowLeft.png",
    "r": "arrowRight.png",
    "1": "buttonA.png",
    "2": "buttonB.png",
    "3": "buttonX.png",
    "4": "buttonY.png",
    "lt": "upLeft.png",
    "rt": "upRight.png",
    "lb": "downLeft.png",
    "rb": "downRight.png"
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
let foundSounds = [],
    foundSoundEnd;
let playbackRateValue;

let MAX_HEALTH = 100;
let health;
let ennemyHealth;
let healthInfoText = {};
let nbPlayerHitsToWin = 4;
let nbEnemyHitsToWin = 4;

let DecryptorConfig = {
    BLINK: "blink",
    ALEA_BLINK: "alea_blink",
    SCREEN_SHUFFLE: "screen_shuffle",
    ACTION_SHUFFLE: "action_shuffle",
    BATTLE: "battle"
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
    game.load.image("backgroundTipsStars", "assets/decryptor/star_background.png");
    game.load.image("backgroundCave", "assets/decryptor/cave_background.png");
    game.load.image("backgroundForest", "assets/decryptor/forest_background.png");
    game.load.image("backgroundScroll", "assets/decryptor/scroll_background.png");
    game.load.image("backgroundTipsBook", "assets/decryptor/book_background.png");
    game.load.image("particle_blue", "assets/decryptor/particle_blue.png");
    game.load.spritesheet("sunburn", "assets/decryptor/sunburn_spritesheet.png", 100, 100, 61);
    game.load.image("skull", "assets/decryptor/skull.png");
}

function loadSounds() {
    game.load.audio('element_found', 'assets/decryptor/collect_item_hurry_out_of_time_01.wav');

    game.load.audio('element_found_1', 'assets/decryptor/sound/FA_Scale_6.wav');
    game.load.audio('element_found_2', 'assets/decryptor/sound/FA_Scale_7.wav');
    game.load.audio('element_found_3', 'assets/decryptor/sound/FA_Scale_8.wav');
    game.load.audio('element_found_4', 'assets/decryptor/sound/FA_Scale_9.wav');
    game.load.audio('element_found_5', 'assets/decryptor/sound/FA_Scale_10.wav');
    game.load.audio('element_found_6', 'assets/decryptor/sound/FA_Scale_11.wav');
    game.load.audio('element_found_7', 'assets/decryptor/sound/FA_Scale_12.wav');
    game.load.audio('element_found_8', 'assets/decryptor/sound/FA_Scale_13.wav');
    game.load.audio('element_found_end', 'assets/decryptor/sound/FA_Scale_End.wav');

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
        duration = game.decryptor.duration || 30;
        variants = game.decryptor.variants || [];

        game.scale.setGameSize(800, 450);

        downScreenHeight = game.height / 5;
        constructMapActionZodiacs();

        tipsPlaces = createPlaces();

        this.createBackground();

        this.createCountdownBar();

        particleInitialized = false;

        foundSounds[0] = game.sound.add('element_found_1');
        foundSounds[1] = game.sound.add('element_found_2');
        foundSounds[2] = game.sound.add('element_found_3');
        foundSounds[3] = game.sound.add('element_found_4');
        foundSounds[4] = game.sound.add('element_found_5');
        foundSounds[5] = game.sound.add('element_found_6');
        foundSounds[6] = game.sound.add('element_found_7');
        foundSounds[7] = game.sound.add('element_found_7');
        foundSoundEnd = game.sound.add('element_found_end');
        errorSound = game.sound.add('element_error');

        createElementsWithButtons();
        createElementsToDecryptBackground();
        createElementsToDecrypt();

        if (isVariant(DecryptorConfig.BATTLE)) {
            createHealthInfo();
        }

        activeElement(elementsToFind[gameState.elementIndex].display);

        countDown = game.time.create(false);
        countDown.add(Phaser.Timer.SECOND * duration, timerOver, this);
        countDown.start();

        activePotions();

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

    createBackground() {
        let background;
        switch (game.save.level) {
            case "forest":
            case "sanctuaire":
                background = game.add.sprite(0, 0, 'backgroundTipsStars');
                background.scale.set(1.5);
                break;
            case "school":
                background = game.add.sprite(0, 0, 'backgroundTipsBook');
                background.tint = 0x696969;
                background.scale.set(4.8);
                break;
            case "cave":
                background = game.add.sprite(0, 0, 'backgroundTipsStars');
                background.scale.set(1.5);
                break;
            default:
                background = game.add.sprite(0, 0, 'backgroundTipsBook');
                background.tint = 0x696969;
                background.scale.set(4.8);
                break;


        }
        gameObjects.push(background);
    }

    createCountdownBar() {
        if (!isVariant(DecryptorConfig.BATTLE)) {
            countdownBar = game.add.graphics(0, game.height - downScreenHeight + 20);
            countdownBar.beginFill(0xcc0000, 0.2);
            countdownBar.drawRect(0, 0, game.width, 1);
            countdownBar.endFill();
            gameObjects.push(countdownBar);
        }
    }

    update() {

    }

    render() {
        if (!isVariant(DecryptorConfig.BATTLE)) {
            countdownBar.y = (countDown.duration / 1000 / duration) * (game.height - downScreenHeight + 20);
            countdownBar.height = (game.height - downScreenHeight + 20) - countdownBar.y;
        }
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

function activePotions() {
    if (game.save.inventory.items.potionDeProtection && game.save.inventory.items.potionDeProtection.actif) {
        nbPlayerHitsToWin = nbPlayerHitsToWin + 2;
    }

    if (game.save.inventory.items.potionDeForce && game.save.inventory.items.potionDeForce.actif) {
        nbEnemyHitsToWin = nbEnemyHitsToWin - 2;
    }
    displayActivePotions();
}

function displayActivePotions() {
    let i = 0;
    for (var item in game.save.inventory) {
        if (Object.prototype.hasOwnProperty.call(game.save.inventory, item)) {
            if (game.save.inventory[item] && game.save.inventory[item].actif) {
                let potion = game.add.image(10, i * 50, item);
                potion.scale.set(0.8, 0.8);
                i++;
                game.save.inventory[item].actif = false;
            }
        }
    }
}

function createHealthInfo() {
    let bgBarGroup = game.add.group();
    bgBarGroup.z = 1;

    let barGroup = game.add.group();
    barGroup.z = 2;

    let textBarGroup = game.add.group();
    textBarGroup.z = 0;

    //  battle: commencer avec malus de lucidité si barre de lucidité faible avant combat
    health = Math.round(MAX_HEALTH * (0.5 + 0.5 * game.player.lucidity / 16));
    ennemyHealth = MAX_HEALTH;

    let textStyle = { fill: 'white', font: '14px Alagard', boundsAlignV: 'center' };

    textStyle.boundsAlignH = "left";
    let textHealth = game.add.text(55, 0, "You", textStyle);
    textHealth.setTextBounds(0, 0, game.width / 2 - 50, 15);
    textBarGroup.add(textHealth);
    gameObjects.push(textHealth);

    let bgHealthBar = game.add.graphics(50, 0);
    bgHealthBar.beginFill(0xE3CA45, 1);
    bgHealthBar.drawRect(0, 0, game.width / 2 - 50, 15);
    bgHealthBar.endFill();
    bgBarGroup.add(bgHealthBar);
    gameObjects.push(bgHealthBar);

    let healthBar = game.add.graphics(50, 0);
    healthBar.beginFill(0xe32020, 1);
    healthBar.drawRect(0, 0, game.width / 2 - 50, 15);
    healthBar.endFill();
    barGroup.add(healthBar);
    gameObjects.push(healthBar);

    textStyle.boundsAlignH = "right";
    let textEnnemyHealth = game.add.text(game.width / 2, 0, "Him", textStyle);
    textEnnemyHealth.setTextBounds(0, 0, game.width / 2 - 55, 15);
    textBarGroup.add(textEnnemyHealth);
    gameObjects.push(textEnnemyHealth);

    let bgEnnemyHealthBar = game.add.graphics(game.width / 2, 0);
    bgEnnemyHealthBar.beginFill(0xE3CA45, 1);
    bgEnnemyHealthBar.drawRect(0, 0, game.width / 2 - 50, 15);
    bgEnnemyHealthBar.endFill();
    bgBarGroup.add(bgEnnemyHealthBar);
    gameObjects.push(bgEnnemyHealthBar);

    let ennemyHealthBar = game.add.graphics(game.width / 2, 0);
    ennemyHealthBar.beginFill(0xe32020, 1);
    ennemyHealthBar.drawRect(0, 0, game.width / 2 - 50, 15);
    ennemyHealthBar.endFill();
    barGroup.add(ennemyHealthBar);
    gameObjects.push(ennemyHealthBar);


    let skullScale = 2;
    let skull = game.add.image(game.width / 2 - skullScale * 6, 0, 'skull');
    skull.scale.set(skullScale);
    gameObjects.push(skull);

    healthInfoText = {
        'health': healthBar,
        'bgHealth': bgHealthBar,
        'textHealth': textHealth,
        'ennemyHealth': ennemyHealthBar,
        'bgEnnemyHealth': bgEnnemyHealthBar,
        'textEnnemyHealth': textEnnemyHealth
    };
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

function createElementsToDecryptBackground() {
    switch (game.save.level) {
        case "cave":
            bottomBar = game.add.image(0, game.height - downScreenHeight, "backgroundCave");
            break;
        case "forest":
        case "sanctuaire":
            bottomBar = game.add.image(0, game.height - downScreenHeight - 21, "backgroundForest");
            break;
        case "school":
            bottomBar = game.add.sprite(0, game.height - downScreenHeight - 10, "backgroundScroll");
            bottomBar.tint = 0xD8D8D8;
            break;
        default:
            bottomBar = game.add.sprite(0, game.height - downScreenHeight - 10, "backgroundScroll");
            bottomBar.tint = 0xD8D8D8;
            break;
    }
    bottomBar.scale.set(4);
    gameObjects.push(bottomBar);
}

function createElementsToDecrypt() {
    elementsToFind = [];
    let sunburnScale = 1.5;

    for (let i = 0; i < MAX_NB_BUTTONS; i++) {
        let action = actionArray[Math.floor(Math.random() * MAX_NB_BUTTONS)];
        let elementPlace = new Phaser.Graphics(game, 0, game.height - downScreenHeight);
        elementPlace.drawRect(i * game.width / 10 + (game.width / 10), (downScreenHeight - 60) / 2, 70, 60);

        let zodiacImage = game.add.image(i * game.width / 10 + (game.width / 10), (downScreenHeight - 25) / 2, mapActionZodiacs.get(action));

        let sunburn = game.add.sprite(zodiacImage.x - zodiacImage.width + 15, zodiacImage.y - zodiacImage.height, "sunburn");
        sunburn.scale.set(sunburnScale);
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

function isVariant(variantName) {
    return variants.includes(variantName);
}

function createElementsWithButtons() {
    let i = 0;
    mapActionZodiacs.forEach((zodiac, action) => {
        let scaleButtonImage = 0.75;
        let place = tipsPlaces[i];

        let TmpImg = game.cache.getImage(zodiac);
        if (!particleInitialized) {
            let position = {
                x: place.x + place.width / 2,
                y: place.y + place.height / 2 - ((50 * scaleButtonImage) / 2) + 10
            };
            gameObjects.push(createParticlesEmitter(position, TmpImg.width - 10, 'particle_blue'));
        }

        let actionImage = game.add.sprite(place.width / 2 - (50 * 0.75 / 2), place.height - (50 * scaleButtonImage), 'game_buttons');
        actionImage.frameName = mapActionSprite[action];
        actionImage.scale.setTo(scaleButtonImage, scaleButtonImage);
        place.addChild(actionImage);

        let zodiacImage = game.add.sprite(place.width / 2 - TmpImg.width / 2, place.height / 2 - (TmpImg.height / 2 + ((50 * scaleButtonImage) / 2)), zodiac);
        game.add.tween(zodiacImage)
            .to({ y: zodiacImage.y + 15 }, 1000, Phaser.Easing.Linear.None)
            .yoyo(true)
            .loop()
            .start();
        gameObjects.push(zodiacImage);
        if (isVariant(DecryptorConfig.BLINK) || isVariant(DecryptorConfig.ALEA_BLINK)) {
            let duration = isVariant(DecryptorConfig.ALEA_BLINK) > -1 ? Math.random() * 800 + 100 : 800;
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

function gameOver(youWon, message) {
    countDown.stop();
    if (youWon) {
        createWinningScreen(message);
    } else {
        createLosingScreen(message);
    }
    game.input.gamepad.onDownCallback = function () {
        quitGame(youWon)
    };
    game.input.keyboard.onDownCallback = function () {
        quitGame(youWon)
    };
}

function decryptOver() {
    //playbackRateValue = 1;
    foundSoundEnd.play();
    if (isVariant(DecryptorConfig.BATTLE)) {
        gameState.elementIndex = 0;
        //TODO : l'ennemi perd plus de vie si le joueur a une potion d'attaque
        ennemyHealth -= MAX_HEALTH / nbEnemyHitsToWin;
        updateEnnemyHealthBar();
        if (ennemyHealth <= 0) {
            gameOver(true, "Requiescat in pace");
        } else {
            emptyScreenTips();
            constructMapActionZodiacs();
            refreshActionsElements();
            createElementsWithButtons();
            createElementsToDecrypt();
            activeElement(elementsToFind[gameState.elementIndex].display);
        }
    } else {
        gameOver(true);
    }
}

function updatePlayerHealthBar() {
    healthInfoText.health.width = health / MAX_HEALTH * (game.width / 2 - 50);
    healthInfoText.health.x = 50 + ((MAX_HEALTH - health) / 100 * (game.width / 2 - 50));
    if (health > 0) {
        healthInfoText.textHealth.x = healthInfoText.health.x + 5;
        healthInfoText.textHealth.textBounds.width = healthInfoText.health.width;
    } else {
        healthInfoText.textHealth.destroy();
    }

    let tween = game.add.tween(healthInfoText.bgHealth)
        .to({
            width: healthInfoText.health.width,
            x: healthInfoText.health.x
        }, 1500, Phaser.Easing.Linear.None);
    tween.start();
}

function updateEnnemyHealthBar() {
    let diffWidth = healthInfoText.ennemyHealth.width - ennemyHealth / MAX_HEALTH * (game.width / 2 - 50);
    healthInfoText.ennemyHealth.width = ennemyHealth / MAX_HEALTH * (game.width / 2 - 50);
    if (ennemyHealth > 0) {
        healthInfoText.textEnnemyHealth.x -= diffWidth;
        healthInfoText.textEnnemyHealth.textBounds.width -= diffWidth;
    } else {
        healthInfoText.textEnnemyHealth.destroy();
    }

    let tweenEnnemy = game.add.tween(healthInfoText.bgEnnemyHealth)
        .to({
            width: healthInfoText.ennemyHealth.width
        }, 1500, Phaser.Easing.Linear.None);
    tweenEnnemy.start();
}

function timerOver() {
    if (isVariant(DecryptorConfig.BATTLE)) {
        //TODO : le joueur perd moins de vie si le joueur a une potion de défense
        game.camera.shake(0.01, 250);
        game.camera.flash(0xcc0000, 500);
        health -= MAX_HEALTH / nbPlayerHitsToWin;
        updatePlayerHealthBar();
        if (health <= 0) {
            gameOver(false, "La fin est proche");
        } else {
            countDown.removeAll();
            countDown.add(Phaser.Timer.SECOND * duration, timerOver, this);
        }
    } else {
        gameOver(false);
    }
}

function quitGame(youWon) {
    if (youWon) {
        game.save.translationsFound.push(game.decryptor.translation)
        save();
    }
    loadSave();
    game.state.start('MainGame');

    setTimeout(() => {
        if (youWon) {
            let translation = dialogs[game.decryptor.translation](game.save)
            talkToMyself(["Ça y est, j'ai trouvé !", ...translation.map(part => `"${part}"`), "Intéressant..."]);
        } else {
            talkToMyself(["Je me suis encore trompé...", "Bon, recommençons depuis le début !"]);
        }
        delete game.decryptor;
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
    if (keyAction[element.action].indexOf(keyPress) > -1) {
        foundSounds[gameState.elementIndex].play();
        gameState.elementIndex++;
        //foundSound._sound.playbackRate.value = playbackRateValue;
        //playbackRateValue += 0.1;
        zoomAndDeleteElementToFind(element);

        if (gameState.elementIndex === MAX_NB_BUTTONS) {
            decryptOver();
        } else {
            activeElement(elementsToFind[gameState.elementIndex].display);

            if (isVariant(DecryptorConfig.SCREEN_SHUFFLE)) {
                emptyScreenTips();
                createElementsWithButtons();
            } else if (isVariant(DecryptorConfig.ACTION_SHUFFLE)) {
                emptyScreenTips();
                shuffleMapActionZodiacs();
                refreshActionsElements();
                createElementsWithButtons();
            }
        }
    } else {
        let duration = countDown.duration;
        game.camera.shake(0.01, 250);
        game.camera.flash(0xcc0000, 500);
        if (duration > 5000) {
            errorSound.play();
            countDown.removeAll();
            countDown.add(duration - (Phaser.Timer.SECOND * 5), timerOver, this);
        } else {
            timerOver();
        }
    }
}

function activeElement(elementDisplay) {
    var percentZoom = 0.30;
    elementDisplay.children[0].alpha = 1;

    let widthDiff = elementDisplay.width * percentZoom / 2;
    let heightDiff = elementDisplay.height * percentZoom / 2;
    elementDisplay.children[1].scale.set(1 + (percentZoom), 1 + percentZoom);
    elementDisplay.children[1].x -= widthDiff;
    elementDisplay.children[1].y -= heightDiff;
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
    tween.onComplete.add(() => {
        element.display.destroy()
    }, this);
    tween.start();
    element.display.children[0].destroy();
}

function createWinningScreen(message) {
    createMiddleText(message ? message : "Hum, je vois...", 0xFFFFFF, 0x000000);
}

function createLosingScreen(message) {
    createMiddleText(message ? message : "Incompréhensible...", 0x000000, "#e32020");
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

    game.add.tween(middleText).to({ x: 0 }, 750, Phaser.Easing.Linear.None).start();
}