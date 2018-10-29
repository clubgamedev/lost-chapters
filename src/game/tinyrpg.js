/* global Phaser game */

/*
 * TINY RPG Forest Demo Code
 * @copyright    2018 Ansimuz
 * @license      {@link https://opensource.org/licenses/MIT | MIT License}
 * Get free assets and code at: www.pixelgameart.org
 * */

import { addSounds, loadAudio, startMusic, sounds } from "./audio";

import { Player } from "./characters/Player";
import { Character } from "./characters/Character";
import { Mole } from "./characters/Mole"
import { Treant } from "./characters/Treant"

import { spawnCoin } from "./items/Coin";
import { spawnGem } from "./items/Gem";

let game;
let player;
const gameWidth = 272;
const gameHeight = 192;
let globalMap;
let hurtFlag;
let exit;
let kills = 5;

export function startGame() {
  game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "game");
  game.state.add("Boot", BootScene);
  game.state.add("Preload", LoadingScene);
  game.state.add("TitleScreen", MenuScene);
  game.state.add("PlayGame", GameScene);
  game.state.add("GameOver", GameOverScene);

  game.state.start("Boot");
  window.game = game; // make it global
  return game;
}

class BootScene {
  preload() {
    this.game.load.image("loading", "assets/sprites/loading.png");
  }

  create() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.renderer.renderSession.roundPixels = true; // blurring off
    this.game.state.start("Preload");
  }
}

class LoadingScene {
  preload() {
    const loadingBar = this.add.sprite(
      game.width / 2,
      game.height / 2,
      "loading"
    );
    loadingBar.anchor.setTo(0.5);
    game.load.setPreloadSprite(loadingBar);
    // load title screen
    game.load.image("title-bg", "assets/sprites/title-screen-bg.png");
    game.load.image("title", "assets/sprites/title-screen.png");
    game.load.image("enter", "assets/sprites/press-enter-text.png");
    game.load.image("credits", "assets/sprites/credits-text.png");
    game.load.image("instructions", "assets/sprites/instructions.png");
    game.load.image("gameover", "assets/sprites/game-over.png");

    // tileset
    game.load.image("tileset", "assets/environment/tileset.png");
    game.load.image("objects", "assets/environment/objects.png");
    game.load.image("collisions", "assets/environment/collisions.png");
    game.load.tilemap(
      "map",
      "assets/maps/map.json",
      null,
      Phaser.Tilemap.TILED_JSON
    );
    // atlas
    game.load.atlasJSONArray(
      "atlas",
      "assets/atlas/atlas.png",
      "assets/atlas/atlas.json"
    );
    game.load.atlasJSONArray(
      "atlas-props",
      "assets/atlas/atlas-props.png",
      "assets/atlas/atlas-props.json"
    );

    game.load.spritesheet('michel', 'assets/characters/michel.png', 32, 32, 9);
    game.load.spritesheet('michelle', 'assets/characters/michelle.png', 32, 32, 9);
    game.load.spritesheet('franck', 'assets/characters/franck.png', 32, 32, 9);
    game.load.spritesheet('augustin', 'assets/characters/augustin.png', 32, 32, 9);

    // images
    game.load.image("exit", "assets/environment/exit-open.png");

    // audio
    loadAudio();
  }

  create() {
    //this.game.state.start('PlayGame');
    this.game.state.start("TitleScreen");
  }
}

class MenuScene {
  create() {
    game.add.tileSprite(0, 0, gameWidth, gameHeight, "title-bg");
    this.title = game.add.image(game.width / 2, 130, "title");
    this.title.anchor.setTo(0.5, 1);
    const tween = game.add.tween(this.title);
    tween
      .to({ y: 130 + 10 }, 800, Phaser.Easing.Linear.In)
      .yoyo(true)
      .loop();

    tween.start();
    //
    this.pressEnter = game.add.image(game.width / 2, game.height - 35, "enter");
    this.pressEnter.anchor.setTo(0.5);
    //
    const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    startKey.onDown.add(this.startGame, this);
    this.state = 1;
    //
    game.time.events.loop(900, this.blinkText, this);
    //
    const credits = game.add.image(game.width / 2, game.height - 15, "credits");
    credits.anchor.setTo(0.5);
  }

  startGame() {
    if (this.state == 1) {
      this.state = 2;
      this.title2 = game.add.image(
        game.width / 2,
        game.height / 2,
        "instructions"
      );
      this.title2.anchor.setTo(0.5);
      this.title.destroy();
    } else {
      this.game.state.start("PlayGame");
    }
  }

  blinkText() {
    if (this.pressEnter.alpha) {
      this.pressEnter.alpha = 0;
    } else {
      this.pressEnter.alpha = 1;
    }
  }
}

class GameOverScene {
  create() {
    game.add.tileSprite(0, 0, gameWidth, gameHeight, "title-bg");
    this.title = game.add.image(game.width / 2, game.height / 2, "gameover");
    this.title.anchor.setTo(0.5);

    //
    this.pressEnter = game.add.image(game.width / 2, game.height - 35, "enter");
    this.pressEnter.anchor.setTo(0.5);
    //
    const startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    startKey.onDown.add(this.startGame, this);
    this.state = 1;
    //
    game.time.events.loop(900, this.blinkText, this);
    //
    const credits = game.add.image(game.width / 2, game.height - 15, "credits");
    credits.anchor.setTo(0.5);
  }

  startGame() {
    this.game.state.start("PlayGame");
  }

  blinkText() {
    if (this.pressEnter.alpha) {
      this.pressEnter.alpha = 0;
    } else {
      this.pressEnter.alpha = 1;
    }
  }
}

class GameScene {
  create() {

    this.createTileMap(1);
    this.createGroups();
    this.createExit(46, 27);
    this.populate();

    addSounds();
    startMusic();

    //player = new Player(game, 47, 31)

    /* TEST */
    let sprites = ["michelle", "franck", "augustin", "michel"]
    player = new Character(game, 47, 31);
    player.prepareAttack = () => {
      let sprite = sprites.shift();
      player.loadTexture(sprite);
      sprites.push(sprite);
    };
    player.releaseAttack = () => { }
    /* /TEST */

    game.add.existing(player);

    this.bindKeys();
    this.createCamera();
    this.createHud();

    const attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    attackKey.onDown.add(() => { player.prepareAttack() });
    attackKey.onUp.add(() => { player.releaseAttack() });
  }

  createExit(x, y) {
    exit = game.add.sprite(x * 16, y * 16, "exit");
    exit.alpha = 0;
    game.physics.arcade.enable(exit);
  }

  createHud() {
    this.hud_1 = game.add.sprite(10, 5, "atlas", "hearts/hearts-1");
    this.hud_2 = game.add.sprite(18, 5, "atlas", "hearts/hearts-1");
    this.hud_3 = game.add.sprite(26, 5, "atlas", "hearts/hearts-1");
    this.hud_1.fixedToCamera = true;
    this.hud_2.fixedToCamera = true;
    this.hud_3.fixedToCamera = true;
  }

  createCamera() {
    game.camera.follow(player);
  }

  bindKeys() {
    game.input.keyboard.keys = {
      left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
      attack: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };

    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.SPACEBAR,
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.UP
    ]);
  }

  createTileMap() {
    //tilemap
    globalMap = game.add.tilemap("map");
    globalMap.addTilesetImage("collisions");
    globalMap.addTilesetImage("tileset");
    globalMap.addTilesetImage("objects");

    this.layer_collisions = globalMap.createLayer("Collisions Layer");
    this.layer = globalMap.createLayer("Tile Layer");
    this.layer2 = globalMap.createLayer("Tile Layer 2");

    // collisions
    globalMap.setCollision([0, 1]);

    this.layer.resizeWorld();
    this.layer2.resizeWorld();
    this.layer_collisions.resizeWorld();

    // this.layer_collisions.visible = true;
    // this.layer_collisions.debug = true;
    //this.layer.visible = false;
  }

  createGroups() {
    game.groups = {};
    game.groups.enemies = game.add.group();
    game.groups.enemies.enableBody = true;

    game.groups.loot = game.add.group();
    game.groups.loot.enableBody = true;

    game.groups.objects = game.add.group();
    game.groups.objects.enableBody = true;

    game.groups.projectiles = game.add.group();
    game.groups.projectiles.enableBody = true;
  }

  populate() {
    // populate enemies from the tiled map from the objects layer
    this.createMoles();
    this.createTreants();
  }

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType(type, map, layer) {
    const result = new Array();
    map.objects[layer].forEach(element => {
      //console.log(element);
      if (element.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        //console.log("Found " + element.type);
        element.y -= map.tileHeight;

        result.push(element);
      }
    });
    return result;
  }

  createMoles() {
    const enemies_array = this.findObjectsByType(
      "mole",
      globalMap,
      "Object Layer"
    );
    for (let i = 0; i < enemies_array.length; i++) {
      game.groups.enemies.add(
        new Mole(
          enemies_array[i].x / 16,
          enemies_array[i].y / 16,
          enemies_array[i].properties.vertical
        )
      ); // create prefab
    }
  }

  createTreants() {
    const enemies_array = this.findObjectsByType(
      "treant",
      globalMap,
      "Object Layer"
    );
    for (let i = 0; i < enemies_array.length; i++) {
      game.groups.enemies.add(
        new Treant(enemies_array[i].x / 16, enemies_array[i].y / 16)
      ); // create prefab
    }
  }

  update() {
    // physics
    game.physics.arcade.collide(player, this.layer_collisions);
    game.physics.arcade.collide(game.groups.enemies, this.layer_collisions);
    //
    game.physics.arcade.overlap(game.groups.enemies, game.groups.projectiles, this.shotImpact, null, this);

    if (player.alive) {
      //overlaps
      game.physics.arcade.overlap(player, game.groups.enemies, this.hurtPlayer, null, this);
      game.physics.arcade.overlap(player, game.groups.loot, this.lootManager, null, this);

      // exit game if key is obtained
      game.physics.arcade.overlap(player, exit, this.exitManager, null, this);
    }

    player.move(game.input.keyboard.keys);

    //this.debugGame();
    this.hurtManager();
  }

  exitManager() {
    if (kills <= 0) {
      game.state.start("GameOver");
      game.music.stop();
    }
  }

  lootManager(player, loot) {
    if (loot.type == "gem") {
      sounds.ITEM.play();
      loot.kill();
      if (player.health < 3) {
        player.health++;
        this.updateHealthHud();
      }
    }
    if (loot.type == "coin") {
      sounds.ITEM.play();
      loot.kill();
    }
  }

  hurtPlayer() {
    if (hurtFlag) {
      return;
    }
    hurtFlag = true;
    this.game.time.reset();

    player.alpha = 0.5;

    player.health--;
    this.updateHealthHud();

    sounds.HURT.play();
    if (player.health < 1) {
      this.gameOver();
    }
  }

  gameOver() {
    game.music.stop();
    game.state.start("GameOver");
  }

  updateHealthHud() {
    switch (player.health) {
      case 3:
        this.hud_1.loadTexture("atlas", "hearts/hearts-1", false);
        this.hud_2.loadTexture("atlas", "hearts/hearts-1", false);
        this.hud_3.loadTexture("atlas", "hearts/hearts-1", false);
        break;
      case 2:
        this.hud_1.loadTexture("atlas", "hearts/hearts-1", false);
        this.hud_2.loadTexture("atlas", "hearts/hearts-1", false);
        this.hud_3.loadTexture("atlas", "hearts/hearts-2", false);
        break;
      case 1:
        this.hud_1.loadTexture("atlas", "hearts/hearts-1", false);
        this.hud_2.loadTexture("atlas", "hearts/hearts-2", false);
        this.hud_3.loadTexture("atlas", "hearts/hearts-2", false);
        break;
      case 0:
        this.hud_1.loadTexture("atlas", "hearts/hearts-2", false);
        this.hud_2.loadTexture("atlas", "hearts/hearts-2", false);
        this.hud_3.loadTexture("atlas", "hearts/hearts-2", false);

        break;
    }
  }

  hurtManager() {
    if (hurtFlag && this.game.time.totalElapsedSeconds() > 2) {
      hurtFlag = false;
      player.alpha = 1;
    }
  }

  shotImpact(enemy, shot) {
    enemy.kill();
    shot.destroy();
    kills--;
    sounds.ENEMY_DEATH.play();
    spawnCoin(enemy.x / 16, enemy.y / 16);
    this.spawnEnemyDeath(enemy.position.x, enemy.position.y);
    // sometimes drop gems or coins
    if (game.rnd.integerInRange(0, 2) == 0) {
      if (game.rnd.integerInRange(0, 1) == 0) {
        spawnCoin(enemy.x / 16, enemy.y / 16);
      } else {
        spawnGem(enemy.x / 16, enemy.y / 16);
      }
    }

    if (kills <= 0) {
      exit.alpha = 1;
    }
  }

  spawnEnemyDeath(x, y) {
    game.add.existing(new EnemyDeath(game, x, y));
  }

  debugGame() {
    // return;
    //game.debug.spriteInfo(this.player, 30, 30);

    game.debug.body(player);
    game.groups.enemies.forEachAlive(this.renderGroup, this);
    game.groups.projectiles.forEachAlive(this.renderGroup, this);
    game.groups.loot.forEachAlive(this.renderGroup, this);
  }

  renderGroup(member) {
    game.debug.body(member);
  }
}

// enemy death

class EnemyDeath extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, "atlas", "enemy-death/enemy-death-1");
    this.anchor.setTo(0.5);
    const anim = this.animations.add(
      "death",
      Phaser.Animation.generateFrameNames("enemy-death/enemy-death-", 1, 6, "", 0),
      18,
      false
    );
    this.animations.play("death");
    anim.onComplete.add(function () {
      this.kill();
    }, this);
  }
}
