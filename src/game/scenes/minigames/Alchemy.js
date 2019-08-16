import { allPotions } from "./alchemy/potions.js";
import { BookRecipes } from "./alchemy/BookRecipes";
import { PieProgress } from "./alchemy/PieProgress";
import { showMiddleText } from "../../utils/message"
import { sounds } from "../../audio"
import { controls } from "../../utils/controls";
import { shuffleArray } from "../../utils/array";
import { AlchemyLights } from "./alchemy/lights"

const GAME_DURATION = 30; // seconds
const MAX_INGREDIENTS = 3;

const ingredientsNames = [
    'crochetsDeSerpent', 'cireBougieNoir', 'ecorceDeBouleau',
    'oeufDeCorbeau', 'epineDePoissonDiable', 'vieilleGnole',
    'foieDeCerf', 'jusDeSauterelle', 'plumeDeCorneille'
];
const ingredientsPositions = [
    { x: 20, y: 396 }, { x: 130, y: 396 }, { x: 365, y: 325 },
    { x: 560, y: 285 }, { x: 660, y: 285 }, { x: 845, y: 325 },
    { x: 1115, y: 396 }, { x: 1180, y: 565 }, { x: 1220, y: 396 }
];


export class AlchemyScene {
    preload() {
        game.load.image('bg1', 'assets/alchemy/bg1.png');
        game.load.image('bg2', 'assets/alchemy/bg2.png');
        game.load.image('moon', 'assets/alchemy/moon.png');
        game.load.image('footer', 'assets/alchemy/footer2.png');
        game.load.image('smallSuspend', 'assets/alchemy/smallSuspend.png');
        game.load.image('bigSuspend', 'assets/alchemy/bigSuspend.png');
        game.load.image('stockage', 'assets/alchemy/stockage_bis.png');

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
        window.alchemy = this;
        game.scale.setGameSize(1280, 720);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.groups = {
            background: game.add.group(),
            platforms: game.add.group(),
            objects: game.add.group(),
            ingredients: game.add.group(),
            player: game.add.group(),
            book: game.add.group(),
            lights: game.add.group(),
            hud: game.add.group(),
            pickedIngredients: game.add.group()
        };

        this.createLevel();
        this.spawnPlayer();
        this.spawnIngredients();
        this.lights = new AlchemyLights(this.groups.lights);

        let clockSprite = this.groups.hud.create(game.width - 70, 10, 'clock');
        clockSprite.scale.set(2, 2);
        this.clockPieProgress = new PieProgress(game, game.width - 70 + (clockSprite.width / 2), 10 + clockSprite.height / 2, 3, "#cf3723");
        this.groups.hud.add(this.clockPieProgress.sprite);

        this.timer = game.time.create(true);
        this.timer.add(Phaser.Timer.SECOND * GAME_DURATION, this.gameOver, this);
        this.timer.start();

        this.bookRecipes = new BookRecipes(this.groups.book);
        controls.ACTION.onPress(() => this.bookRecipes.openOrClose());

        this.potionsCreated = [];
        this.pickedIngredients = [];
    }

    update() {
        game.physics.arcade.collide(this.player, this.groups.platforms);
        game.physics.arcade.collide(this.groups.ingredients, this.groups.platforms);
        this.handleControls();
        let timeProgress = this.timer.seconds / GAME_DURATION
        this.lights.update(this.player, this.moon, timeProgress);
        this.moon.position.y = timeProgress * 230;
        this.clockPieProgress.updateProgress(timeProgress);
    }

    handleControls() {
        const
            MAX_HORIZONTAL_SPEED = 500,
            GROUND_H_ACCEL = 150,
            AIR_H_ACCEL = 20,
            JUMP_SPEED = 1600;

        if (this.player.body.touching.down) {
            // on the floor
            if (controls.UP.isPressed()) {
                this.player.body.velocity.y = -1 * JUMP_SPEED;
                this.player.animations.play('move');
            } else if (controls.LEFT.isPressed()) {
                this.player.body.velocity.x = Math.max(-1 * MAX_HORIZONTAL_SPEED, this.player.body.velocity.x - GROUND_H_ACCEL);
                this.player.animations.play('move');
            } else if (controls.RIGHT.isPressed()) {
                this.player.body.velocity.x = Math.min(MAX_HORIZONTAL_SPEED, this.player.body.velocity.x + GROUND_H_ACCEL);
                this.player.animations.play('move');
            } else {
                this.player.animations.stop();
                this.player.animations.play('idle');
                this.player.body.velocity.x = 0;
            }

            if (controls.DOWN.isPressed()) {
                game.physics.arcade.overlap(this.player, this.groups.ingredients, this.pickIngredient, null, this);
                game.physics.arcade.overlap(this.player, this.marmite, this.putInMarmite, null, this);
                game.physics.arcade.overlap(this.player, this.corbeille, this.resetIngredients, null, this);
            }
        } else {
            // jumping
            if (controls.LEFT.isPressed()) {
                this.player.body.velocity.x -= AIR_H_ACCEL;
            } else if (controls.RIGHT.isPressed()) {
                this.player.body.velocity.x += AIR_H_ACCEL;
            }
        }
        this.player.scale.x = this.player.body.velocity.x < 0 ? 4 : -4;
    }

    shutdown() {
        for (let groupName in this.groups) this.groups[groupName].destroy();
        this.timer.destroy();
    }

    render() {
    }

    createLevel() {
        const { background, platforms, objects, ingredients, hud } = this.groups;

        background.create(0, 0, 'bg2');
        this.moon = background.create(0, 0, "moon");
        background.create(0, 0, 'bg1');

        platforms.enableBody = true;
        platforms.create(0, 605, 'footer');
        platforms.create(350, 370, 'smallSuspend');
        platforms.create(0, 440, 'bigSuspend');
        platforms.create(540, 330, 'bigSuspend');
        platforms.create(830, 370, 'smallSuspend');
        platforms.create(1090, 440, 'bigSuspend');
        platforms.forEach(platform => { platform.body.immovable = true })

        const stockage = hud.create(game.width / 2, 645, 'stockage');
        stockage.anchor.setTo(0.5, 0);
        stockage.scale.set(1.2);

        objects.enableBody = true;

        this.corbeille = game.add.sprite(500, 570, 'corbeille');
        this.corbeille.scale = 2;
        objects.add(this.corbeille);

        this.marmite = game.add.sprite(600, 520, 'marmite');
        this.marmite.animations.add('enter', [0, 1, 2], 10, true);
        objects.add(this.marmite);

        ingredients.enableBody = true;
    }

    spawnPlayer() {
        this.player = game.add.sprite(500, 530, 'howard');
        this.groups.player.add(this.player);
        game.physics.arcade.enable(this.player);

        this.player.anchor.setTo(0.5);
        this.player.body.setSize(10, 26, 11, 5);
        this.player.body.gravity.y = 6500;
        this.player.body.collideWorldBounds = true;

        this.player.scale.setTo(4, 4);

        this.player.animations.add("idle", [3], 0, true);
        this.player.animations.add('move', [7, 6, 8, 6], 10, true);
        this.player.animations.play('idle');
    }

    resetIngredients() {
        this.pickedIngredients = [];
        this.groups.pickedIngredients.removeAll(true);
        this.spawnIngredients();
    }

    pickIngredient(player, ingredient) {
        if (this.pickedIngredients.length >= MAX_INGREDIENTS) return;

        sounds.PICK.play();
        this.groups.pickedIngredients.create(545 + this.pickedIngredients.length * 70, 655, ingredient.key);
        this.pickedIngredients.push(ingredient.key);
        ingredient.destroy();

    }

    putInMarmite() {
        this.marmite.animations.play('enter');
        setTimeout(() => {
            this.marmite.animations.stop();
            this.marmite.frame = 0;
        }, 1000)

        if (this.pickedIngredients.length > 0) {
            this.createPotionWithIngredients();
            this.resetIngredients();
        }
    }

    createPotionWithIngredients() {
        let potionCreated = allPotions.find(potion => potion.cookPotion(this.pickedIngredients))

        if (potionCreated) {
            showMiddleText(potionCreated.displayName + " créée !", 0x000000, "#FFFFFF", 1500, "50px");
            this.potionsCreated.push(potionCreated);
            let potionSprite = this.groups.hud.create(10 + 70 * (this.potionsCreated.length - 1), 50, potionCreated.name);
            potionSprite.scale.setTo(1.5);
            sounds.COOK_SUCCESS.play();
        } else {
            showMiddleText("Recette inconnue !", 0xe30027, "#FFFFFF", 1500, "40px");
            sounds.COOK_FAIL.play();
        }
    }

    spawnIngredients() {
        this.groups.ingredients.removeAll(true);

        shuffleArray(ingredientsPositions);
        ingredientsNames.forEach((name, i) => {
            let { x, y } = ingredientsPositions[i]
            this.groups.ingredients.create(x, y, name);
        });
    }

    gameOver() {
        showMiddleText("Le temps est écoulé");
        this.potionsCreated.forEach(potion => {
            game.save.inventory[potion.name]++;
        });
        game.state.start('MainGame');
    }
}