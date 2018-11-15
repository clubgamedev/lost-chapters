/* global Phaser */

let game;

export function startGame() {
    game = new Phaser.Game(800, 450, Phaser.AUTO, "game", {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

    return game;
}

export function preload() {
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
let gameState = {
    elementIndex: 0
}
let winningText;
let mapActionZodiacs = {};

//TODO refaire cette init
function constructMapActionZodiacs() {
    let actionArrayRemained = actionArray.slice();
    let zodiacsArrayRemained = zodiacsArray.slice();
    while (zodiacsArrayRemained.length > 0) {
        let indexZodiac = Math.floor(Math.random() * zodiacsArrayRemained.length);
        let indexAction = Math.floor(Math.random() * actionArrayRemained.length);
        if (actionArrayRemained.length > 0) {
            mapActionZodiacs[actionArrayRemained[indexAction]] = zodiacsArrayRemained[indexZodiac];
        } else {
            mapActionZodiacs[zodiacsArrayRemained[indexZodiac]] = "";
        }
        actionArrayRemained.splice(indexAction, 1);
        zodiacsArrayRemained.splice(indexZodiac, 1);
    }
}

export function create() {
    constructMapActionZodiacs();
    let textStyle = {
        font: "normal 24px Arial",
        fill: '#000000',
        align: 'center',
        boundsAlignH: "center", // bounds center align horizontally
        boundsAlignV: "middle" // bounds center align vertically
    };

    let graphics = game.add.graphics(0, 0);
    graphics.lineStyle(0);

    let downScreenHeight = game.height / 5;
    graphics.beginFill(0xDDDDDD, 1);
    graphics.drawRect(0, game.height - downScreenHeight, game.width, downScreenHeight);
    graphics.endFill();

    let actionImageMap = [];

    for (let i = 0; i < MAX_NB_BUTTONS; i++) {
        let action = actionArray[Math.floor(Math.random() * MAX_NB_BUTTONS)];
        let zodiacAction = zodiacsArray[Math.floor(Math.random() * zodiacsArray.length)];
        let graphicsElement = new Phaser.Graphics(game, 0, game.height - downScreenHeight);
        graphicsElement.beginFill(0xFFFFFF, 1);
        graphicsElement.drawRect(i * game.width / 8 + 15, (downScreenHeight - 60) / 2, 70, 60);
        graphicsElement.endFill();
        //let textElement = new Phaser.Text(game, 0, 0, action, textStyle);
        //textElement.setTextBounds(i * game.width / 8 + 25, (downScreenHeight - 50) / 2, 50, 50);
        let zodiacImage = game.add.image(i * game.width / 8 + 20, (downScreenHeight - 50) / 2, zodiacAction);
        graphicsElement.addChild(zodiacImage);

        let element = {
            display: graphicsElement,
            action: action
        };
        elementsToFind.push(element);
        game.world.addChild(graphics);
    }
    timer = game.time.create(false);
    timer.loop(2000, updateCounter, this);
    timer.start();

    game.input.keyboard.onDownCallback = function(e) {
        console.log("", e.key);
        testKeyPressWithElement(e.key);
    }
    let textStyleWin = {
        font: "normal 50px Arial",
        fill: '#2FB90A',
        align: 'center',
        boundsAlignH: "center", // bounds center align horizontally
        boundsAlignV: "middle" // bounds center align vertically
    };

    winningText = new Phaser.Text(game, 0, 0, "YOU WIN", textStyleWin);
    winningText.setTextBounds(0, 0, game.width, game.height);
}

function updateCounter() {
    total++;
}

function testKeyPressWithElement(keyPress) {
    let elementToFind = elementsToFind[gameState.elementIndex];
    switch (keyPress) {
        case "ArrowUp":
            if (elementToFind.action == "u") {
                elementToFind.display.destroy();
                gameState.elementIndex++;
            }
            break;
        case "ArrowDown":
            if (elementToFind.action == "d") {
                elementToFind.display.destroy();
                gameState.elementIndex++;
            }
            break;
        case "ArrowLeft":
            if (elementToFind.action == "l") {
                elementToFind.display.destroy();
                gameState.elementIndex++;
            }
            break;
        case "ArrowRight":
            if (elementToFind.action == "r") {
                elementToFind.display.destroy();
                gameState.elementIndex++;
            }
            break;
        case "1":
            if (elementToFind.action == "1") {
                elementToFind.display.destroy();
                gameState.elementIndex++;
            }
            break;
        case "2":
            if (elementToFind.action == "2") {
                elementToFind.display.destroy();
                gameState.elementIndex++;
            }
            break;
        case "3":
            if (elementToFind.action == "3") {
                elementToFind.display.destroy();
                gameState.elementIndex++;
            }
            break;
        case "4":
            if (elementToFind.action == "4") {
                elementToFind.display.destroy();
                gameState.elementIndex++;
            }
            break;
        default:

            break;
    }
}

export function update() {
    if (gameState.elementIndex == 8) {
        let graphics = game.add.graphics(0, 0);
        graphics.addChild(winningText);
    }
}

export function render() {
    game.debug.text('Time until event: ' + timer.duration.toFixed(0), 32, 32);
    game.debug.text('Loop Count: ' + total, 32, 64);
}