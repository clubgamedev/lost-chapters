import { positionIngredientInventory1, positionIngredientInventory2, positionIngredientInventory3, arrayPositionIngredientOnTheMap, positionPotions, positionPointer } from "./alchemy/positions.js";
import { allPotions } from "./alchemy/potions.js";

let platforms, ingredients, materials,
    marmite, corbeille,
    arrayItemSelected = [],
    potionsRandom = [],
    potions,
    itemSelected,
    player,
    pointerPotion,
    moreOrLess,
    keys = {};

var arrayNameIngredients = ['CrochetsDeSerpent', 'CireBougieNoir', 'CuirDeBumslangWikiputer', 'OeufDeDragon',
    'epineDePoissonDiable', 'Herbicide', 'foieDeDragon', 'jusDeSauterelle',
    'plumeJobarbille'];

var arrayNamePotions = ["potionContreMauvaisOeil", "PotionDeBeaute", "potionDeGuerison", "potionDePoison",
    "potionDePuissance", "PotionDeVieillessement", "PotionSommeilSansReve", "potionVision"];

let ingredientsOnThMap = arrayNameIngredients.slice();
let ingredientsGenerationInterval;
let pointerPoitionInterval;


export class AlchemyScene {
    preload () {
        game.load.image('pointerPotion', 'assets/alchemy/potions/pointerPotion.png');
        game.load.image('background', 'assets/alchemy/header2.png');
        game.load.image('footer', 'assets/alchemy/footer2.png');
        game.load.image('smallSuspend', 'assets/alchemy/smallSuspend.png');
        game.load.image('bigSuspend', 'assets/alchemy/bigSuspend.png');
        game.load.image('stockage', 'assets/alchemy/stockage.png');
        game.load.image('CireBougieNoir', 'assets/alchemy/ingredients/CireBougieNoir.png');
        game.load.image('CrochetsDeSerpent', 'assets/alchemy/ingredients/CrochetsDeSerpent.png');
        game.load.image('CuirDeBumslangWikiputer', 'assets/alchemy/ingredients/CuirDeBumslangWikiputer.png');
        game.load.image('potionContreMauvaisOeil', 'assets/alchemy/potions/potionContreMauvaisOeil.png');
        game.load.image('PotionDeBeaute', 'assets/alchemy/potions/PotionDeBeaute.png');
        game.load.image('potionDeGuerison', 'assets/alchemy/potions/potionDeGuerison.png');
        game.load.image('potionDePoison', 'assets/alchemy/potions/potionDePoison.png');
        game.load.image('potionDePuissance', 'assets/alchemy/potions/potionDePuissance.png');
        game.load.image('PotionDeVieillessement', 'assets/alchemy/potions/PotionDeVieillessement.png');
        game.load.image('PotionSommeilSansReve', 'assets/alchemy/potions/PotionSommeilSansReve.png');
        game.load.image('potionVision', 'assets/alchemy/potions/potionVision.png');
        game.load.image('corbeille', 'assets/alchemy/corbeille.png');
        game.load.image('OeufDeDragon', 'assets/alchemy/ingredients/OeufDeDragon.png');
        game.load.image('epineDePoissonDiable', 'assets/alchemy/ingredients/epineDePoissonDiable.png');
        game.load.image('Herbicide', 'assets/alchemy/ingredients/Herbicide.png');
        game.load.image('foieDeDragon', 'assets/alchemy/ingredients/foieDeDragon.png');
        game.load.image('jusDeSauterelle', 'assets/alchemy/ingredients/jusDeSauterelle.png');
        game.load.image('plumeJobarbille', 'assets/alchemy/ingredients/plumeJobarbille.png');
        game.load.spritesheet('dude', 'assets/alchemy/dude.png', 32, 48);
        game.load.spritesheet('marmite', 'assets/alchemy/marmiteGreenSprite.png', 77, 100);
    }

    create () {
        game.scale.setGameSize(1280, 720);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 0, 'background');
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
        materials.add(corbeille)

        marmite = game.add.sprite(600, 520, 'marmite');
        materials.add(marmite)

        ingredients = game.add.group();
        ingredients.enableBody = true;

        potions = game.add.group();
        potions.enableBody = true;

        itemSelected = game.add.group();

        pointerPotion = game.add.group();
        pointerPotion.create(15, 90, "pointerPotion");

        spawnElements(ingredients, arrayPositionIngredientOnTheMap, arrayNameIngredients);

        player = game.add.sprite(32, game.world.height - 500, 'michel');

        game.physics.arcade.enable(player);

        player.anchor.setTo(0.5)
        player.body.setSize(16, 26, 8, 5)
        player.body.gravity.y = 1400;
        player.body.collideWorldBounds = true;

        player.width = 128;
        player.height = 128;

        player.animations.add("idle", [3], 0, true)
        player.animations.add('left', [7, 6, 8, 6], 10, true);
        player.animations.add('right', [7, 6, 8, 6], 10, true);
        player.animations.play('idle');

        marmite.animations.add('enter', [0, 1, 2], 10, true);

        ingredientsGenerationInterval = setInterval(function () {
            generateOtherPositionIngredient(ingredients);
        }, 5000);

        pointerPoitionInterval = setInterval(() => {
            displayPointerPotion(pointerPotion, moreOrLess)
            if(!moreOrLess){
                pointerPotion.alpha -= 0.7;
            }else{
                pointerPotion.alpha += 0.7;
            }
        }, 500)

        potionsRandom = generatePotions();

        spawnElements(potions, positionPotions, potionsRandom);

        keys.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keys.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keys.jump = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keys.pick = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    }

    update () {

        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(ingredients, platforms);

        player.body.velocity.x = 0;
        player.scale.x = Math.abs(player.scale.x)

        if (keys.left.isDown) {
            player.body.velocity.x = -300;
            player.animations.play('left');
        } else if (keys.right.isDown) {
            player.body.velocity.x = 300;
            player.scale.x *= -1
            player.animations.play('right');
        } else if(player.body.velocity.y === 0){
            player.animations.stop();
            player.animations.play('idle');
        }

        if(keys.jump.isDown && player.body.velocity.y === 0){
            player.body.velocity.y = -750;
        }

        if(keys.pick.isDown){
            game.physics.arcade.overlap(player, ingredients, pickIngredient, null, this);
            game.physics.arcade.overlap(player, marmite, putInMarmite, null, this);
            game.physics.arcade.overlap(player, corbeille, putInCorbeille, null, this);
        }
    }

    render () {

    }

    shutdown () {
        clearInterval(ingredientsGenerationInterval)
    }
}


function displayPointerPotion(pointerPotion){
    if(Math.floor(pointerPotion.alpha) == 1){
        moreOrLess = false
        return moreOrLess;
    }else{
        if(Math.floor(pointerPotion.alpha) == 0){
            moreOrLess = true
            return moreOrLess;
        }
    }
}



function putInCorbeille(){
    itemSelected.callAll('kill');
    arrayItemSelected = [];
    ingredientsOnThMap = arrayNameIngredients.slice();
    ingredients.callAll('kill');
    spawnElements(ingredients, arrayPositionIngredientOnTheMap, arrayNameIngredients);
}


function pickIngredient (player, item) {
    switch (item.key) {
        case 'CrochetsDeSerpent':
            actionOnItem('CrochetsDeSerpent', item)
            break;
        case 'CireBougieNoir':
            actionOnItem('CireBougieNoir', item)
            break;
        case 'CuirDeBumslangWikiputer':
            actionOnItem('CuirDeBumslangWikiputer', item)
            break;
        case 'OeufDeDragon':
            actionOnItem('OeufDeDragon', item)
            break;
        case 'epineDePoissonDiable':
            actionOnItem('epineDePoissonDiable', item)
            break;
        case 'Herbicide':
            actionOnItem('Herbicide', item)
            break;
        case 'foieDeDragon':
            actionOnItem('foieDeDragon', item)
            break;
        case 'jusDeSauterelle':
            actionOnItem('jusDeSauterelle', item)
            break;
        case 'plumeJobarbille':
            actionOnItem('plumeJobarbille', item)
            break;
    }
}

function actionOnItem(itemName, item){
    if(!inventoryIsFull()){
        addItemInInventory(itemName);
        item.kill();
    }
}

function addItemInInventory (item) {
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

function putInMarmite () {
    marmite.animations.play('enter');
    setTimeout(() => {
        marmite.animations.stop();
        marmite.frame = 0;
    }, 1000)
}

function spawnElements (groupIngredients, arrayPositionIngredientOnTheMap, arrayNameIngredients) {

    for (let i = 0; i < arrayPositionIngredientOnTheMap.length; i++) {
        groupIngredients.create(arrayPositionIngredientOnTheMap[i].x, arrayPositionIngredientOnTheMap[i].y, arrayNameIngredients[i]);
    }

}

function generateOtherPositionIngredient (groupIngredients) {

    var limit = 8;
    var arrayPositionIngredientOnTheMapTmp = arrayPositionIngredientOnTheMap.slice();
    var arrayNameIngredientsTmp = ingredientsOnThMap.slice();

    groupIngredients.callAll('kill');

    for (let i = 0; i <= 8; i++) {
        let  randomNumberPosition = 0,
            randomNumberIngredient = 0;
        if (limit > 0) {
            randomNumberPosition = Math.floor(Math.random() * (limit - 0 + 1));
            randomNumberIngredient = Math.floor(Math.random() * (limit - 0 + 1));
        }

        groupIngredients.create(arrayPositionIngredientOnTheMapTmp[randomNumberPosition].x, arrayPositionIngredientOnTheMapTmp[randomNumberPosition].y, arrayNameIngredientsTmp[randomNumberIngredient]);
        arrayPositionIngredientOnTheMapTmp[randomNumberPosition] = undefined;
        arrayNameIngredientsTmp[randomNumberIngredient] = undefined;

        arrayPositionIngredientOnTheMapTmp = arrayFilterElement(arrayPositionIngredientOnTheMapTmp);
        arrayNameIngredientsTmp = arrayFilterElement(arrayNameIngredientsTmp);
        limit--;
    }

}

function arrayFilterElement (array) {
    array = array.filter(function (element) {
        return element !== undefined;
    })

    return array;
}

function deleteItemOnTheMap (item) {

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

function generatePotions () {
    var limit = 7;
    var potionsRandom = [];
    var allPotionsTmp = allPotions.slice();
    for (let i = 0; i < 3; i++) {
        let randomNumberPotions = Math.floor(Math.random() * (limit - 0 + 1));
        allPotionsTmp = arrayFilterElement(allPotionsTmp);
        potionsRandom.push(allPotionsTmp[randomNumberPotions].name);
        allPotionsTmp[randomNumberPotions] = undefined;
        limit--;
    }
    return potionsRandom;
}



function inventoryIsFull () {
    console.log("[DEBUG] taille : " + arrayItemSelected.length);
    if (arrayItemSelected.length >= 3) {
        console.log("true");
        return true;
    }
    console.log("false");
    return false;
}

function deleteItemSelected (item) {
    if (!inventoryIsFull()) {
        deleteItemOnTheMap(item.key);
        item.kill();
    }
}
