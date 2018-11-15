/* global Phaser */

let game;

export function startGame(variants, difficulty) {
    game = new Phaser.Game(800, 450, Phaser.AUTO, "game", {
        preload: preload,
        create: create,
        update: update,
        render: render
    });
    game.variants = variants;

    return game;
}

let keyAction;

export function preload() {
    loadZodiacs();
    loadActions();
    keyAction = { "u": ["ArrowUp"], "d": ["ArrowDown"], "l": ["ArrowLeft"], "r": ["ArrowRight"], "1": ["1"], "2": ["2"], "3": ["3"], "4": ["4"] }
}

function loadActions() {
    game.load.image("1", "assets/decryptor/1_button.png");
    game.load.image("2", "assets/decryptor/2_button.png");
    game.load.image("3", "assets/decryptor/3_button.png");
    game.load.image("4", "assets/decryptor/4_button.png");
    game.load.image("u", "assets/decryptor/u_button.png");
    game.load.image("d", "assets/decryptor/d_button.png");
    game.load.image("l", "assets/decryptor/l_button.png");
    game.load.image("r", "assets/decryptor/r_button.png");
    game.load.image("lt", "assets/decryptor/lt_button.png");
    game.load.image("rt", "assets/decryptor/rt_button.png");
    game.load.image("-", "assets/decryptor/-_button.png");
    game.load.image("+", "assets/decryptor/+_button.png");
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
}

let timer;
let total = 0;
let elementsToFind = [];
let MAX_NB_BUTTONS = 8;
let actionArray = ["u", "d", "l", "r", "1", "2", "3", "4"];
let zodiacsArray = ["aquarius", "aries", "cancer", "capricorn", "gemini", "leo", "libra", "pisces", "sagittarius", "scorpio", "taurus", "virgo"];
let duration = 20;
let tricksArray = ["lt", "rt", "+", "-"];

let downScreenHeight;

let gameState = {
    elementIndex: 0,
    state: "BEGINNING"
};
let winningText;
let mapActionZodiacs = new Map();

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

function createElements() {
    let graphics = game.add.graphics(0, 0);
    graphics.lineStyle(0);

    graphics.beginFill(0xDDDDDD, 1);
    graphics.drawRect(0, game.height - downScreenHeight, game.width, downScreenHeight);
    graphics.endFill();
    for (let i = 0; i < MAX_NB_BUTTONS; i++) {
        let action = actionArray[Math.floor(Math.random() * MAX_NB_BUTTONS)];
        let graphicsElement = new Phaser.Graphics(game, 0, game.height - downScreenHeight);
        graphicsElement.beginFill(0xFFFFFF, 1);
        graphicsElement.drawRect(i * game.width / 8 + 15, (downScreenHeight - 60) / 2, 70, 60);
        graphicsElement.endFill();
        let zodiacImage = game.add.image(i * game.width / 8 + 20, (downScreenHeight - 50) / 2, mapActionZodiacs.get(action));
        console.log(mapActionZodiacs.get(action) + " / " + action);
        graphicsElement.addChild(zodiacImage);

        let element = {
            display: graphicsElement,
            action: action
        };
        elementsToFind.push(element);
        game.world.addChild(element.display);
    }
}

function createScreenTips() {
    let tipsPlaces = createPlaces();

    let i = 0;
    mapActionZodiacs.forEach((zodiac, action) => {
        let place = tipsPlaces[i];
        let TmpImg = game.cache.getImage(zodiac);
        let zodiacImage = game.add.sprite(place.width / 2 - TmpImg.width / 2, place.height / 2 - TmpImg.height / 2, zodiac);
        TmpImg = game.cache.getImage(action);
        let actionImage = game.add.sprite(place.width / 2 - TmpImg.width, place.height - TmpImg.height * 2, action);
        actionImage.scale.setTo(2, 2);
        place.addChild(actionImage);
        place.addChild(zodiacImage);
        game.world.addChild(place);
        i++;
    });
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
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

export function create() {
    downScreenHeight = game.height / 5;
    constructMapActionZodiacs();

    createElements();

    createScreenTips();

    manageTimer();

    game.input.keyboard.onDownCallback = function(e) {
        console.log("", e.key);
        testKeyPressWithElement(e.key, elementsToFind[gameState.elementIndex]);
    };
}

function displayLosingScreen() {
    game.time.events.remove(timer);
    let textStyleLose = {
        font: "60px 'Press Start 2P'",
        fill: '#CC0000',
        align: 'center',
        boundsAlignH: "center", // bounds center align horizontally
        boundsAlignV: "middle" // bounds center align vertically
    };

    let losingText = new Phaser.Text(game, 0, 0, "Am I Dead ?", textStyleLose);
    losingText.setTextBounds(0, 0, game.width, game.height);
    let graphics = game.add.graphics(0, 0);

    graphics.addChild(losingText);
    game.input.keyboard.onDownCallback = function(e) {
        console.log("", e.key);
        enterKeyWhenLose();
    };
}

function enterKeyWhenLose() {
    let textStyleTooLate = {
        font: "25px  'Press Start 2P'",
        fill: '#999999',
        align: 'center',
    };

    let tooLateText = new Phaser.Text(game, 0, 0, "Too Late...", textStyleTooLate);
    tooLateText.setTextBounds(0, 0, game.width, game.height);
    let graphics = game.add.graphics(Math.floor(Math.random() * game.width), Math.floor(Math.random() * game.height));
    graphics.addChild(tooLateText);
}

function manageTimer() {
    timer = game.time.events.add(Phaser.Timer.SECOND * duration, displayLosingScreen, this);
}

function testKeyPressWithElement(keyPress, element) {
    if (keyAction[element.action].indexOf(keyPress) > -1) {
        element.display.destroy();
        gameState.elementIndex++;
    }
}

export function update() {
    if (gameState.elementIndex === 8) {
        game.time.events.remove(timer);
        displayWinningText();
    }
}

export function render() {
    game.debug.text("Time until event: " + game.time.events.duration, 32, 32);
}

function displayWinningText() {
    let textStyleWin = {
        font: "40px 'Press Start 2P'",
        fill: '#2FB90A',
        align: 'center',
        boundsAlignH: "center", // bounds center align horizontally
        boundsAlignV: "middle" // bounds center align vertically
    };

    winningText = new Phaser.Text(game, 0, 0, "More knowledge !", textStyleWin);
    winningText.setTextBounds(0, 0, game.width, game.height);

    let graphics = game.add.graphics(0, 0);
    graphics.addChild(winningText);
}