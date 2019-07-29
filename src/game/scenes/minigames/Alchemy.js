import { positionIngredientInventory1, positionIngredientInventory2, positionIngredientInventory3, arrayPositionIngredientOnTheMap } from "./alchemy/positions.js";
import { allPotions } from "./alchemy/potions.js";
import { BookRecipes } from "./alchemy/BookRecipes";
import { CircleProgress } from "./alchemy/CircleProgress";
import { showMiddleText } from "../../utils/message"
import {loadSave} from "../../save";
import {PieProgress} from "./alchemy/PieProgress";

let platforms, ingredients, materials,
    marmite, corbeille,
    arrayItemSelected = [],
    potions,
    itemSelected,
    player,
    pointerPotion,
    keys = {},
    repopTiming,
    countDownRepop,
    repopTimeInSeconds = 5,
    ingredientsSpawned = new Map(),
    potionsCreated = [],
    gameOverCooldown,
    gameOverPieProgress,
    gameOverTimeInSeconds = 20;

var arrayNameIngredients = ['crochetsDeSerpent', 'cireBougieNoir', 'ecorceDeBouleau', 'oeufDeCorbeau',
    'epineDePoissonDiable', 'vieilleGnole', 'foieDeCerf', 'jusDeSauterelle', 'plumeDeCorneille'];

let ingredientsOnThMap = arrayNameIngredients.slice();
let ingredientsGenerationInterval;
let bookRecipes;
let isTabDown = false;


export class AlchemyScene {
    preload() {
        game.load.image('background', 'assets/alchemy/header2.png');
        game.load.image('footer', 'assets/alchemy/footer2.png');
        game.load.image('smallSuspend', 'assets/alchemy/smallSuspend.png');
        game.load.image('bigSuspend', 'assets/alchemy/bigSuspend.png');
        game.load.image('stockage', 'assets/alchemy/stockage.png');

        game.load.image('cireBougieNoir', 'assets/alchemy/ingredients/CireBougieNoir.png');
        game.load.image('crochetsDeSerpent', 'assets/alchemy/ingredients/CrochetsDeSerpent.png');
        game.load.image('ecorceDeBouleau', 'assets/alchemy/ingredients/EcorceDeBouleau.png');

        game.load.image('oeufDeCorbeau', 'assets/alchemy/ingredients/OeufDeCorbeau.png');
        game.load.image('epineDePoissonDiable', 'assets/alchemy/ingredients/epineDePoissonDiable.png');
        game.load.image('vieilleGnole', 'assets/alchemy/ingredients/VieilleGnole.png');

        game.load.image('foieDeCerf', 'assets/alchemy/ingredients/foieDeCerf.png');
        game.load.image('jusDeSauterelle', 'assets/alchemy/ingredients/jusDeSauterelle.png');
        game.load.image('plumeDeCorneille', 'assets/alchemy/ingredients/plumeDeCorneille.png');

        game.load.image('potionDeForce', 'assets/alchemy/potions/potionDeForce.png');
        game.load.image('fioleDeSang', 'assets/alchemy/potions/fioleDeSang.png');
        game.load.image('potionDeLucidite', 'assets/alchemy/potions/potionDeLucidite.png');
        game.load.image('potionDeProtection', 'assets/alchemy/potions/potionDeProtection.png');

        game.load.image('corbeille', 'assets/alchemy/corbeille.png');
        game.load.image('book', 'assets/ui/book.png');
        game.load.image('clock', 'assets/alchemy/clock_bis.png');
        game.load.spritesheet('marmite', 'assets/alchemy/marmiteGreenSprite.png', 77, 100, 3);
    }

    create() {
        game.scale.setGameSize(1280, 720);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        let background = game.add.sprite(0, 0, 'background');

        platforms = game.add.group();
        platforms.enableBody = true;

        var footer = platforms.create(0, 605, 'footer');
        footer.body.immovable = true;

        var smallSuspend = platforms.create(350, 370, 'smallSuspend');
        smallSuspend.body.immovable = true;

        var bigSuspend1 = platforms.create(0, 440, 'bigSuspend');
        bigSuspend1.body.immovable = true;

        var bigSuspend2 = platforms.create(540, 330, 'bigSuspend');
        bigSuspend2.body.immovable = true;

        var smallSuspend2 = platforms.create(830, 370, 'smallSuspend');
        smallSuspend2.body.immovable = true;

        var bigSuspend3 = platforms.create(1090, 440, 'bigSuspend');
        bigSuspend3.body.immovable = true;

        game.add.sprite(500, 660, 'stockage');

        materials = game.add.group();
        materials.enableBody = true;

        corbeille = game.add.sprite(500, 570, 'corbeille');
        corbeille.scale = 2;
        materials.add(corbeille);

        marmite = game.add.sprite(600, 520, 'marmite');
        materials.add(marmite);

        ingredients = game.add.group();
        ingredients.enableBody = true;

        potions = game.add.group();
        potions.enableBody = true;

        itemSelected = game.add.group();

        player = game.add.sprite(500, 530, 'howard');

        game.physics.arcade.enable(player);

        player.anchor.setTo(0.5);
        player.body.setSize(10, 26, 11, 5);
        player.body.gravity.y = 3000;
        player.body.collideWorldBounds = true;

        player.width = 128;
        player.height = 128;

        player.animations.add("idle", [3], 0, true);
        player.animations.add('left', [7, 6, 8, 6], 10, true);
        player.animations.add('right', [7, 6, 8, 6], 10, true);
        player.animations.play('idle');

        countDownRepop = game.time.create(false);
        countDownRepop.add(Phaser.Timer.SECOND * repopTimeInSeconds, generateOtherPositionIngredient, this);
        countDownRepop.start();

        let clockSprite = game.add.sprite(game.width - 70, 10, 'clock');
        clockSprite.scale.set(2, 2);
        gameOverCooldown = game.time.create(true);
        gameOverCooldown.add(Phaser.Timer.SECOND * gameOverTimeInSeconds, gameOver, this);
        gameOverCooldown.start();
        gameOverPieProgress = new PieProgress(game, game.width - 70 + (clockSprite.width/2), 10 + clockSprite.height/2, 3, "#37cf23");

        spawnElements(ingredients, arrayPositionIngredientOnTheMap, arrayNameIngredients);

        marmite.animations.add('enter', [0, 1, 2], 10, true);

        this.bookRecipes = new BookRecipes();
        this.bookRecipes.create(10, 10);



        game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.TAB]);

        keys.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keys.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keys.jump = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keys.pick = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        keys.openBook = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    }

    update() {

        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(ingredients, platforms);

        player.body.velocity.x = 0;
        player.scale.x = Math.abs(player.scale.x);

        if (keys.left.isDown) {
            player.body.velocity.x = -300;
            player.animations.play('left');
        } else if (keys.right.isDown) {
            player.body.velocity.x = 300;
            player.scale.x *= -1;
            player.animations.play('right');
        } else if (player.body.velocity.y === 0) {
            player.animations.stop();
            player.animations.play('idle');
        }

        if (keys.jump.justDown && player.body.touching.down) {
            player.body.velocity.y = -1100;
        }

        if (keys.pick.isDown) {
            game.physics.arcade.overlap(player, ingredients, pickIngredient, null, this);
            game.physics.arcade.overlap(player, marmite, putInMarmite, null, this);
            game.physics.arcade.overlap(player, corbeille, putInCorbeille, null, this);
        }

        if (keys.openBook.isDown && !isTabDown) {
            isTabDown = true;
            console.log("open book of recipes");
            this.bookRecipes.openOrClose();
        }
        if (keys.openBook.isUp) {
            isTabDown = false;
        }
    }

    shutdown() {
        itemSelected.callAll('kill');
        arrayItemSelected = [];
        ingredientsOnThMap = arrayNameIngredients.slice();
        ingredients.callAll('kill');
        clearSpawnedIngredients();
        countDownRepop.destroy();
        gameOverCooldown.destroy();
        potionsCreated = [];
    }

    render() {
        for (const ingredient of ingredientsSpawned.values()) {
            ingredient.repopTimer.updateProgress(countDownRepop.duration / (repopTimeInSeconds * 1000));
        }
        gameOverPieProgress.updateProgress(1 - gameOverCooldown.duration / (gameOverTimeInSeconds * 1000));
    }
}


function putInCorbeille() {
    itemSelected.callAll('kill');
    arrayItemSelected = [];
    ingredientsOnThMap = arrayNameIngredients.slice();
    ingredients.callAll('kill');
    clearSpawnedIngredients();
    spawnElements(ingredients, arrayPositionIngredientOnTheMap, arrayNameIngredients);
}


function pickIngredient(player, item) {
    if (!inventoryIsFull()) {
        addItemInInventory(item.key);
        item.kill();
    }
}

function addItemInInventory(item) {
    if (arrayItemSelected.length === 0) {
        itemSelected.create(positionIngredientInventory1.x, positionIngredientInventory1.y, item);
        arrayItemSelected[0] = item;
        deleteItemOnTheMap(item);
    }
    else if (arrayItemSelected.length === 1) {
        itemSelected.create(positionIngredientInventory2.x, positionIngredientInventory2.y, item);
        arrayItemSelected[1] = item;
        deleteItemOnTheMap(item);
    } else if (arrayItemSelected.length === 2) {
        itemSelected.create(positionIngredientInventory3.x, positionIngredientInventory3.y, item);
        arrayItemSelected[2] = item;
        deleteItemOnTheMap(item);
    } else {
        console.log("Inventory full");
    }
}

function putInMarmite() {
    marmite.animations.play('enter');
    setTimeout(() => {
        marmite.animations.stop();
        marmite.frame = 0;
    }, 1000)

    if (arrayItemSelected !== null && arrayItemSelected.length > 0) {
        createPotionWithIngredients();
        putInCorbeille();
    }
}

function createPotionWithIngredients() {
    let potionCreated;
    allPotions.forEach(potion => {
        if (potion.cookPotion(arrayItemSelected)) {
            potionCreated = potion;
        }
    });
    if (potionCreated) {
        console.log("Potion " + potionCreated.displayName + " created !");
        showMiddleText(potionCreated.displayName + " créée !", 0x000000, "#FFFFFF", 1500, "50px");
        displayPotionCreated(potionCreated);
    } else {
        showMiddleText("Recette inconnue !", 0xe30027, "#FFFFFF", 1500, "40px");
    }
}

function displayPotionCreated(potionCreated) {
    potionsCreated.push(potionCreated);
    let potionSprite = game.add.sprite(120 + 70 * potionsCreated.length, 10, potionCreated.name);
    potionSprite.scale.setTo(1.5);
}

function spawnElements(groupIngredients, arrayPositionIngredientOnTheMap, arrayNameIngredients) {
    for (let i = 0; i < arrayPositionIngredientOnTheMap.length; i++) {
        ingredientsSpawned.set(arrayNameIngredients[i], {
            sprite: groupIngredients.create(arrayPositionIngredientOnTheMap[i].x, arrayPositionIngredientOnTheMap[i].y, arrayNameIngredients[i]),
            repopTimer: new CircleProgress(game, arrayPositionIngredientOnTheMap[i].x + 30, arrayPositionIngredientOnTheMap[i].y + 50, 1, 0xFFFFFF)
        });
    }
}

function clearSpawnedIngredients() {
    for (const [key, ingredient] of ingredientsSpawned) {
        ingredient.repopTimer.destroy();
        ingredient.sprite.destroy();
        ingredientsSpawned.delete(key);
    }
}

function generateOtherPositionIngredient() {

    var limit = 8;
    var arrayPositionIngredientOnTheMapTmp = arrayPositionIngredientOnTheMap.slice();
    var arrayNameIngredientsTmp = ingredientsOnThMap.slice();

    ingredients.callAll('kill');
    clearSpawnedIngredients();

    for (let i = 0; i <= 8; i++) {
        let randomNumberPosition = 0,
            randomNumberIngredient = 0;
        if (limit > 0) {
            randomNumberPosition = Math.floor(Math.random() * (limit - 0 + 1));
            randomNumberIngredient = Math.floor(Math.random() * (limit - 0 + 1));
        }

        if (arrayNameIngredientsTmp[randomNumberIngredient]) {
            ingredientsSpawned.set(arrayNameIngredientsTmp[randomNumberIngredient], {
                sprite: ingredients.create(arrayPositionIngredientOnTheMapTmp[randomNumberPosition].x, arrayPositionIngredientOnTheMapTmp[randomNumberPosition].y, arrayNameIngredientsTmp[randomNumberIngredient]),
                repopTimer: new CircleProgress(game, arrayPositionIngredientOnTheMapTmp[randomNumberPosition].x + 30, arrayPositionIngredientOnTheMapTmp[randomNumberPosition].y + 50, 1, 0xFFFFFF)
            });
        }
        arrayPositionIngredientOnTheMapTmp[randomNumberPosition] = undefined;
        arrayNameIngredientsTmp[randomNumberIngredient] = undefined;

        arrayPositionIngredientOnTheMapTmp = arrayFilterElement(arrayPositionIngredientOnTheMapTmp);
        arrayNameIngredientsTmp = arrayFilterElement(arrayNameIngredientsTmp);
        limit--;
    }

    countDownRepop.removeAll();
    countDownRepop.add(Phaser.Timer.SECOND * repopTimeInSeconds, generateOtherPositionIngredient, this);
    for (const ingredient of ingredientsSpawned.values()) {
        ingredient.repopTimer.updateProgress(100);
    }
    this.bookRecipes.bringToTop();
}

function arrayFilterElement(array) {
    array = array.filter(function (element) {
        return element !== undefined;
    })

    return array;
}

function deleteItemOnTheMap(item) {
    for (let i = 0; i < ingredientsOnThMap.length; i++) {
        console.log("delete : " + item);
        if (ingredientsOnThMap[i] === item) {
            ingredientsOnThMap[i] = undefined;
            ingredientsSpawned.get(item).repopTimer.destroy();
            i = ingredientsOnThMap.length;
            console.log(item);
        }
    }
    ingredientsOnThMap = arrayFilterElement(ingredientsOnThMap);
}


function inventoryIsFull() {
    console.log("[DEBUG] taille : " + arrayItemSelected.length);
    if (arrayItemSelected.length >= 3) {
        console.log("true");
        return true;
    }
    console.log("false");
    return false;
}

function gameOver() {
    showMiddleText("Le temps est écoulé");
    potionsCreated.forEach(potion => {
        if(game.save.inventory[potion.name]) {
            game.save.inventory[potion.name]++;
        }else{
            game.save.inventory[potion.name] = 1;
        }
    });
    game.state.start('MainGame');
}