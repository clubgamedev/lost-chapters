import { positionIngredientInventory1, positionIngredientInventory2, positionIngredientInventory3, arrayPositionIngredientOnTheMap } from "./alchemy/positions.js";
import { allPotions } from "./alchemy/potions.js";
import {BookRecipes} from "./alchemy/BookRecipes";
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
    repopTimersBar;

var arrayNameIngredients = ['crochetsDeSerpent', 'cireBougieNoir', 'cuirDeBumslangWikiputer', 'oeufDeDragon',
    'epineDePoissonDiable', 'herbicide', 'foieDeDragon', 'jusDeSauterelle',
    'plumeJobarbille'];

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
        game.load.image('cuirDeBumslangWikiputer', 'assets/alchemy/ingredients/CuirDeBumslangWikiputer.png');

        game.load.image('oeufDeDragon', 'assets/alchemy/ingredients/OeufDeDragon.png');
        game.load.image('epineDePoissonDiable', 'assets/alchemy/ingredients/epineDePoissonDiable.png');
        game.load.image('herbicide', 'assets/alchemy/ingredients/Herbicide.png');

        game.load.image('foieDeDragon', 'assets/alchemy/ingredients/foieDeDragon.png');
        game.load.image('jusDeSauterelle', 'assets/alchemy/ingredients/jusDeSauterelle.png');
        game.load.image('plumeJobarbille', 'assets/alchemy/ingredients/plumeJobarbille.png');

        game.load.image('potionDeForce', 'assets/alchemy/potions/potionDeForce.png');
        game.load.image('fioleDeSang', 'assets/alchemy/potions/fioleDeSang.png');
        game.load.image('potionDeLucidite', 'assets/alchemy/potions/potionDeLucidite.png');
        game.load.image('potionDeProtection', 'assets/alchemy/potions/potionDeProtection.png');

        game.load.image('corbeille', 'assets/alchemy/corbeille.png');
        game.load.image('book', 'assets/ui/book.png');
        game.load.spritesheet('marmite', 'assets/alchemy/marmiteGreenSprite.png', 77, 100);
    }

    create() {
        game.scale.setGameSize(1280, 720);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        let background = game.add.sprite(0, 0, 'background');

        platforms = game.add.group();
        platforms.enableBody = true;

        var footer = platforms.create(0, 610, 'footer');
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

        player.animations.add("idle", [3], 0, true)
        player.animations.add('left', [7, 6, 8, 6], 10, true);
        player.animations.add('right', [7, 6, 8, 6], 10, true);
        player.animations.play('idle');

        repopTimersBar = game.add.group();

        arrayPositionIngredientOnTheMap.forEach(position => {
            //repopTiming = game.add.graphics(position.x, position.y+50);
            repopTiming = new PieProgress(game, position.x + 30, position.y + 50, 1, 0xFFFFFF);
            repopTimersBar.add(repopTiming);
        });

        countDownRepop = game.time.create(false);
        countDownRepop.add(Phaser.Timer.SECOND * 4, generateOtherPositionIngredient, this);
        countDownRepop.start();


        this.bookRecipes = new BookRecipes();
        this.bookRecipes.create(10, 10);

        spawnElements(ingredients, arrayPositionIngredientOnTheMap, arrayNameIngredients);

        marmite.animations.add('enter', [0, 1, 2], 10, true);


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
        //clearInterval(ingredientsGenerationInterval)
    }

    render() {
        repopTimersBar.children.forEach(bar => {
            bar.updateProgress(countDownRepop.duration / 4000);
        });
    }
}


function putInCorbeille() {
    itemSelected.callAll('kill');
    arrayItemSelected = [];
    ingredientsOnThMap = arrayNameIngredients.slice();
    ingredients.callAll('kill');
    spawnElements(ingredients, arrayPositionIngredientOnTheMap, arrayNameIngredients);
}


function pickIngredient(player, item) {
    if (!inventoryIsFull()) {
        addItemInInventory(item.key);
        item.kill();
    }
}

function addItemInInventory(item) {
    if (arrayItemSelected.length == 0) {
        itemSelected.create(positionIngredientInventory1.x, positionIngredientInventory1.y, item);
        arrayItemSelected.push(item);
        deleteItemOnTheMap(item);
    }
    else if (arrayItemSelected.length == 1) {
        itemSelected.create(positionIngredientInventory2.x, positionIngredientInventory2.y, item);
        arrayItemSelected.push(item);
        deleteItemOnTheMap(item);
    } else if (arrayItemSelected.length == 2) {
        itemSelected.create(positionIngredientInventory3.x, positionIngredientInventory3.y, item);
        arrayItemSelected.push(item);
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
}

function spawnElements(groupIngredients, arrayPositionIngredientOnTheMap, arrayNameIngredients) {
    for (let i = 0; i < arrayPositionIngredientOnTheMap.length; i++) {
        game.add.sprite()
        groupIngredients.create(arrayPositionIngredientOnTheMap[i].x, arrayPositionIngredientOnTheMap[i].y, arrayNameIngredients[i]);
    }
}

function generateOtherPositionIngredient() {

    var limit = 8;
    var arrayPositionIngredientOnTheMapTmp = arrayPositionIngredientOnTheMap.slice();
    var arrayNameIngredientsTmp = ingredientsOnThMap.slice();

    ingredients.callAll('kill');

    for (let i = 0; i <= 8; i++) {
        let randomNumberPosition = 0,
            randomNumberIngredient = 0;
        if (limit > 0) {
            randomNumberPosition = Math.floor(Math.random() * (limit - 0 + 1));
            randomNumberIngredient = Math.floor(Math.random() * (limit - 0 + 1));
        }

        ingredients.create(arrayPositionIngredientOnTheMapTmp[randomNumberPosition].x, arrayPositionIngredientOnTheMapTmp[randomNumberPosition].y, arrayNameIngredientsTmp[randomNumberIngredient]);
        arrayPositionIngredientOnTheMapTmp[randomNumberPosition] = undefined;
        arrayNameIngredientsTmp[randomNumberIngredient] = undefined;

        arrayPositionIngredientOnTheMapTmp = arrayFilterElement(arrayPositionIngredientOnTheMapTmp);
        arrayNameIngredientsTmp = arrayFilterElement(arrayNameIngredientsTmp);
        limit--;
    }

    countDownRepop.removeAll();
    countDownRepop.add(Phaser.Timer.SECOND * 4, generateOtherPositionIngredient, this);
    repopTimersBar.children.forEach(bar => {
        bar.updateProgress(100);
    });
}

function arrayFilterElement(array) {
    array = array.filter(function (element) {
        return element !== undefined;
    })

    return array;
}

function deleteItemOnTheMap(item) {

    console.log("[DEBUG]");
    for (let i = 0; i < ingredientsOnThMap.length; i++) {
        console.log("delete : " + item);
        if (ingredientsOnThMap[i] === item) {
            ingredientsOnThMap[i] = undefined;
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

function deleteItemSelected(item) {
    if (!inventoryIsFull()) {
        deleteItemOnTheMap(item.key);
        item.kill();
    }
}
