/* global Phaser */

/*
 * TINY RPG Forest Demo Code
 * @copyright    2018 Ansimuz
 * @license      {@link https://opensource.org/licenses/MIT | MIT License}
 * Get free assets and code at: www.pixelgameart.org
 * */

const audioFlag = true;
let attackFlag = 0;
let game;
let player;
const gameWidth = 272;
const gameHeight = 192;
let globalMap;
let enemies_group;
let loot_group;
let objects_group;
let projectiles_group;
let player_state;
const PLAYER_STATE = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
  WALKING_LEFT: 4,
  WALKING_RIGHT: 5,
  WALKING_UP: 6,
  WALKING_DOWN: 7
};
let hurtFlag;
let exit;
let kills = 5;

export function startGame() {
  game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "game");
  game.state.add("Boot", boot);
  game.state.add("Preload", preload);
  game.state.add("TitleScreen", titleScreen);
  game.state.add("PlayGame", playGame);
  game.state.add("GameOver", gameOver);
  //
  game.state.start("Boot");
  return game;
}

class boot {
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

class preload {
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

    // images
    game.load.image("exit", "assets/environment/exit-open.png");

    // audio
    game.load.audio("music", [
      "assets/sound/ancient_path.ogg",
      "assets/sound/ancient_path.mp3"
    ]);
    game.load.audio("hurt", ["assets/sound/hurt.ogg", "assets/sound/hurt.mp3"]);
    game.load.audio("slash", [
      "assets/sound/slash.ogg",
      "assets/sound/slash.mp3"
    ]);
    game.load.audio("item", ["assets/sound/item.ogg", "assets/sound/item.mp3"]);
    game.load.audio("enemy-death", [
      "assets/sound/enemy-death.ogg",
      "assets/sound/enemy-death.mp3"
    ]);
  }

  create() {
    //this.game.state.start('PlayGame');
    this.game.state.start("TitleScreen");
  }
}

class titleScreen {
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

class gameOver {
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

class playGame {
  create() {
    this.addAudios();
    this.createTileMap(1);
    this.createGroups();
    this.createExit(46, 27);
    this.populate();
    this.createPlayer(47, 31);

    this.bindKeys();
    this.createCamera();
    this.createHud();

    this.startMusic();

    const attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    attackKey.onDown.add(this.prepareAttack, this);
    attackKey.onUp.add(this.releaseAttack, this);
  }

  createExit(x, y) {
    exit = game.add.sprite(x * 16, y * 16, "exit");
    exit.alpha = 0;
    game.physics.arcade.enable(exit);
  }

  startMusic() {
    if (!audioFlag) {
      return;
    }

    this.music = game.add.audio("music");
    this.music.loop = true;

    this.music.play();

    this.game.onExit = () => this.music.stop();
  }

  addAudios() {
    this.audioHurt = game.add.audio("hurt");
    this.audioItem = game.add.audio("item");
    this.audioEnemyDeath = game.add.audio("enemy-death");
    this.audioSlash = game.add.audio("slash");
  }

  prepareAttack() {
    if (attackFlag == 0) {
      attackFlag = 1;
    }
  }

  releaseAttack() {
    if (attackFlag == 1) {
      // reset if not pulled all the way
      attackFlag = 0;
    }

    if (attackFlag == 2) {
      attackFlag = 0;
      this.shoot();
    }
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
    this.wasd = {
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

  createPlayer(x, y) {
    const temp = new Player(game, x, y);
    game.add.existing(temp);
  }

  createGroups() {
    enemies_group = game.add.group();
    enemies_group.enableBody = true;
    //
    loot_group = game.add.group();
    loot_group.enableBody = true;
    //
    objects_group = game.add.group();
    objects_group.enableBody = true;
    //
    projectiles_group = game.add.group();
    projectiles_group.enableBody = true;
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
      enemies_group.add(
        new Mole(
          game,
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
      enemies_group.add(
        new Treant(game, enemies_array[i].x / 16, enemies_array[i].y / 16)
      ); // create prefab
    }
  }

  shoot() {
    let shot;
    let dir = "s";
    if (
      player_state == PLAYER_STATE.WALKING_UP ||
      player_state == PLAYER_STATE.UP
    ) {
      dir = "n";
      shot = new Arrow(game, player.x, player.y, dir);
    } else if (
      player_state == PLAYER_STATE.WALKING_DOWN ||
      player_state == PLAYER_STATE.DOWN
    ) {
      dir = "s";
      shot = new Arrow(game, player.x, player.y, dir);
    } else if (
      player_state == PLAYER_STATE.WALKING_LEFT ||
      player_state == PLAYER_STATE.LEFT
    ) {
      dir = "w";
      shot = new Arrow(game, player.x, player.y + 4, dir);
    } else if (
      player_state == PLAYER_STATE.WALKING_RIGHT ||
      player_state == PLAYER_STATE.RIGHT
    ) {
      dir = "e";
      shot = new Arrow(game, player.x, player.y + 4, dir);
    }

    projectiles_group.add(shot);
    this.audioSlash.play();
  }

  update() {
    // physics
    game.physics.arcade.collide(player, this.layer_collisions);
    game.physics.arcade.collide(enemies_group, this.layer_collisions);
    //
    game.physics.arcade.overlap(
      enemies_group,
      projectiles_group,
      this.shotImpact,
      null,
      this
    );

    if (player.alive) {
      //overlaps
      game.physics.arcade.overlap(
        player,
        enemies_group,
        this.hurtPlayer,
        null,
        this
      );
      game.physics.arcade.overlap(
        player,
        loot_group,
        this.lootManager,
        null,
        this
      );

      // exit game if key is obtained
      game.physics.arcade.overlap(player, exit, this.exitManager, null, this);
    }

    this.movePlayer();

    //this.debugGame();
    this.hurtManager();
  }

  exitManager() {
    if (kills <= 0) {
      this.game.state.start("GameOver");
      this.music.stop();
    }
  }

  lootManager(player, loot) {
    if (loot.type == "gem") {
      this.audioItem.play();
      loot.kill();
      if (player.health < 3) {
        player.health++;
        this.updateHealthHud();
      }
    }
    if (loot.type == "coin") {
      this.audioItem.play();
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

    this.audioHurt.play();
    if (player.health < 1) {
      this.gameOver();
    }
  }

  gameOver() {
    this.music.stop();
    this.game.state.start("GameOver");
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
    this.audioEnemyDeath.play();
    this.spawnCoin(enemy.x / 16, enemy.y / 16);
    this.spawnEnemyDeath(enemy.position.x, enemy.position.y);
    // sometimes drop gems or coins
    if (game.rnd.integerInRange(0, 2) == 0) {
      if (game.rnd.integerInRange(0, 1) == 0) {
        this.spawnCoin(enemy.x / 16, enemy.y / 16);
      } else {
        this.spawnGem(enemy.x / 16, enemy.y / 16);
      }
    }

    if (kills <= 0) {
      exit.alpha = 1;
    }
  }

  spawnEnemyDeath(x, y) {
    const temp = new EnemyDeath(game, x, y);
    game.add.existing(temp);
  }

  movePlayer() {
    const vel = 50;

    // attack animations
    if (attackFlag != 0) {
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;
      return;
    }

    // capture input
    if (this.wasd.down.isDown) {
      player_state = PLAYER_STATE.WALKING_DOWN;
      player.body.velocity.y = vel;
      player.body.velocity.x = 0;
    } else if (this.wasd.up.isDown) {
      player_state = PLAYER_STATE.WALKING_UP;
      player.body.velocity.y = -vel;
      player.body.velocity.x = 0;
    } else if (this.wasd.left.isDown) {
      player_state = PLAYER_STATE.WALKING_LEFT;
      player.body.velocity.x = -vel;
      player.body.velocity.y = 0;
    } else if (this.wasd.right.isDown) {
      player_state = PLAYER_STATE.WALKING_RIGHT;
      player.body.velocity.x = vel;
      player.body.velocity.y = 0;
    } else {
      player.body.velocity.y = 0;
      player.body.velocity.x = 0;
    }

    // idle
    if (
      player_state == PLAYER_STATE.WALKING_DOWN &&
      player.body.velocity.y == 0
    ) {
      player_state = PLAYER_STATE.DOWN;
    } else if (
      player_state == PLAYER_STATE.WALKING_UP &&
      player.body.velocity.y == 0
    ) {
      player_state = PLAYER_STATE.UP;
    } else if (
      player_state == PLAYER_STATE.WALKING_LEFT &&
      player.body.velocity.x == 0
    ) {
      player_state = PLAYER_STATE.LEFT;
    } else if (
      player_state == PLAYER_STATE.WALKING_RIGHT &&
      player.body.velocity.x == 0
    ) {
      player_state = PLAYER_STATE.RIGHT;
    }
  }

  spawnGem(x, y) {
    const temp = new Gem(game, x, y);
    game.add.existing(temp);
    loot_group.add(temp);
  }

  spawnCoin(x, y) {
    const temp = new Coin(game, x, y);
    game.add.existing(temp);
    loot_group.add(temp);
  }

  debugGame() {
    // return;
    //game.debug.spriteInfo(this.player, 30, 30);

    game.debug.body(player);
    enemies_group.forEachAlive(this.renderGroup, this);
    projectiles_group.forEachAlive(this.renderGroup, this);
    loot_group.forEachAlive(this.renderGroup, this);
  }

  renderGroup(member) {
    game.debug.body(member);
  }
}


// entities

// player

function Player(game, x, y) {
  x *= 16;
  y *= 16;
  this.initX = x;
  this.initY = y;
  this.health = 3;
  Phaser.Sprite.call(
    this,
    game,
    x,
    y,
    "atlas",
    "idle/hero-idle-back/hero-idle-back"
  );
  this.anchor.setTo(0.5);
  game.physics.arcade.enable(this);
  this.body.setSize(6, 10, 13, 20);
  //add animations
  const animVel = 12;
  this.animations.add(
    "idle-front",
    ["idle/hero-idle-front/hero-idle-front"],
    0,
    true
  );
  this.animations.add(
    "idle-back",
    ["idle/hero-idle-back/hero-idle-back"],
    0,
    true
  );
  this.animations.add(
    "idle-side",
    ["idle/hero-idle-side/hero-idle-side"],
    0,
    true
  );
  //
  this.animations.add(
    "walk-front",
    Phaser.Animation.generateFrameNames(
      "walk/hero-walk-front/hero-walk-front-",
      1,
      6,
      "",
      0
    ),
    animVel,
    true
  );
  this.animations.add(
    "walk-back",
    Phaser.Animation.generateFrameNames(
      "walk/hero-walk-back/hero-walk-back-",
      1,
      6,
      "",
      0
    ),
    animVel,
    true
  );
  this.animations.add(
    "walk-side",
    Phaser.Animation.generateFrameNames(
      "walk/hero-walk-side/hero-walk-side-",
      1,
      6,
      "",
      0
    ),
    animVel,
    true
  );
  //
  const attack_front = this.animations.add(
    "attack-front",
    Phaser.Animation.generateFrameNames(
      "attack-weapon/hero-attack-front/hero-attack-front-weapon-",
      1,
      3,
      "",
      0
    ),
    animVel,
    false
  );
  const attack_back = this.animations.add(
    "attack-back",
    Phaser.Animation.generateFrameNames(
      "attack-weapon/hero-attack-back/hero-attack-back-weapon-",
      1,
      3,
      "",
      0
    ),
    animVel,
    false
  );
  const attack_side = this.animations.add(
    "attack-side",
    Phaser.Animation.generateFrameNames(
      "attack-weapon/hero-attack-side/hero-attack-side-weapon-",
      1,
      3,
      "",
      0
    ),
    animVel,
    false
  );
  // set flag to false on complete
  attack_front.onComplete.add(resetAttackFlag, this);
  attack_back.onComplete.add(resetAttackFlag, this);
  attack_side.onComplete.add(resetAttackFlag, this);

  function resetAttackFlag() {
    attackFlag = 2;
  }

  this.animations.play("coin");
  this.type = "player";
  player = this;
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function () {
  // player attack animation
  if (attackFlag == 2) {
    return;
  }

  // player attack animation
  if (attackFlag == 1) {
    if (
      player_state == PLAYER_STATE.WALKING_DOWN ||
      player_state == PLAYER_STATE.DOWN
    ) {
      this.animations.play("attack-front");
    } else if (
      player_state == PLAYER_STATE.WALKING_UP ||
      player_state == PLAYER_STATE.UP
    ) {
      this.animations.play("attack-back");
    } else if (
      player_state == PLAYER_STATE.WALKING_LEFT ||
      player_state == PLAYER_STATE.LEFT
    ) {
      this.animations.play("attack-side");
    } else if (
      player_state == PLAYER_STATE.WALKING_RIGHT ||
      player_state == PLAYER_STATE.RIGHT
    ) {
      this.animations.play("attack-side");
    }
    return;
  }

  // player walk animation
  if (player_state == PLAYER_STATE.WALKING_DOWN) {
    this.animations.play("walk-front");
    this.scale.x = 1;
  } else if (player_state == PLAYER_STATE.WALKING_UP) {
    this.animations.play("walk-back");
    this.scale.x = 1;
  } else if (player_state == PLAYER_STATE.WALKING_LEFT) {
    this.animations.play("walk-side");
    this.scale.x = -1;
  } else if (player_state == PLAYER_STATE.WALKING_RIGHT) {
    this.animations.play("walk-side");
    this.scale.x = 1;
  } else if (player_state == PLAYER_STATE.DOWN) {
    this.animations.play("idle-front");
    this.scale.x = 1;
  } else if (player_state == PLAYER_STATE.UP) {
    this.animations.play("idle-back");
    this.scale.x = 1;
  } else if (player_state == PLAYER_STATE.LEFT) {
    this.animations.play("idle-side");
  } else if (player_state == PLAYER_STATE.RIGHT) {
    this.animations.play("idle-side");
  }
};

// Mole

function Mole(game, x, y, verticalMove) {
  x *= 16;
  y *= 16;
  const vel = 8;
  Phaser.Sprite.call(this, game, x, y, "atlas", "idle/mole-idle-front");
  this.animations.add(
    "walk-front",
    Phaser.Animation.generateFrameNames(
      "walk/mole-walk-front/mole-walk-front-",
      1,
      4,
      "",
      0
    ),
    vel,
    true
  );
  this.animations.add(
    "walk-back",
    Phaser.Animation.generateFrameNames(
      "walk/mole-walk-back/mole-walk-back-",
      1,
      4,
      "",
      0
    ),
    vel,
    true
  );
  this.animations.add(
    "walk-side",
    Phaser.Animation.generateFrameNames(
      "walk/mole-walk-side/mole-walk-side-",
      1,
      4,
      "",
      0
    ),
    vel,
    true
  );
  this.animations.play("walk-front");
  this.anchor.setTo(0.5);
  game.physics.arcade.enable(this);
  this.body.setSize(10, 10, 7, 12);
  this.speed = 60;
  if (verticalMove) {
    this.body.velocity.y = this.speed;
  } else {
    this.body.velocity.x = this.speed;
  }
  this.body.bounce.x = 1;
  this.body.bounce.y = 1;
  this.type = "mole";
}
Mole.prototype = Object.create(Phaser.Sprite.prototype);
Mole.prototype.constructor = Mole;
Mole.prototype.update = function () {
  if (this.body.velocity.y > 0) {
    this.animations.play("walk-front");
  } else if (this.body.velocity.y < 0) {
    this.animations.play("walk-back");
  } else if (this.body.velocity.y == 0) {
    this.animations.play("walk-side");
    if (this.body.velocity.x > 0) {
      this.scale.x = 1;
    } else {
      this.scale.x = -1;
    }
  }
};

// Treant

function Treant(game, x, y) {
  x *= 16;
  y *= 16;
  const vel = 8;
  Phaser.Sprite.call(this, game, x, y, "atlas", "idle/treant-idle-front");
  this.animations.add(
    "walk-front",
    Phaser.Animation.generateFrameNames(
      "walk/treant-walk-front/treant-walk-front-",
      1,
      4,
      "",
      0
    ),
    vel,
    true
  );
  this.animations.add(
    "walk-back",
    Phaser.Animation.generateFrameNames(
      "walk/treant-walk-back/treant-walk-back-",
      1,
      4,
      "",
      0
    ),
    vel,
    true
  );
  this.animations.add(
    "walk-side",
    Phaser.Animation.generateFrameNames(
      "walk/treant-walk-side/treant-walk-side-",
      1,
      4,
      "",
      0
    ),
    vel,
    true
  );
  this.animations.play("walk-front");
  this.anchor.setTo(0.5);
  game.physics.arcade.enable(this);
  this.body.setSize(11, 12, 10, 20);
  this.speed = 40;
  this.moveCounter = 0;
  this.direction = "up";
  this.directionsArray = ["up", "down", "left", "right"];
  this.type = "treant";
}
Treant.prototype = Object.create(Phaser.Sprite.prototype);
Treant.prototype.constructor = Treant;
Treant.prototype.update = function () {
  this.moveCounter++;
  // move around
  if (this.moveCounter == 50) {
    this.direction = this.directionsArray[
      game.rnd.between(0, this.directionsArray.length - 1)
    ];
  } else if (this.moveCounter > 50) {
    this.move();
  }

  if (this.moveCounter > 70) {
    this.moveCounter = 0;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }
};
Treant.prototype.move = function () {
  if (this.direction == "left") {
    this.body.velocity.x = -this.speed;
    this.animations.play("walk-side");
    this.scale.x = -1;
  } else if (this.direction == "right") {
    this.body.velocity.x = this.speed;
    this.animations.play("walk-side");
    this.scale.x = 1;
  }
  if (this.direction == "up") {
    this.body.velocity.y = -this.speed;
    this.animations.play("walk-back");
  }
  if (this.direction == "down") {
    this.body.velocity.y = this.speed;
    this.animations.play("walk-front");
  }
};

// arrow

function Arrow(game, x, y, dir) {
  Phaser.Sprite.call(this, game, x, y, "atlas", "arrow");
  this.anchor.setTo(0.5);
  game.physics.arcade.enable(this);
  this.body.setSize(5, 8, 0, 7);
  const vel = 270;
  switch (dir) {
    case "n":
      this.body.velocity.y = -vel;
      break;
    case "s":
      this.body.velocity.y = vel;
      this.scale.y = -1;
      break;
    case "e":
      this.body.velocity.x = vel;
      this.angle = 90;
      break;
    case "w":
      this.body.velocity.x = -vel;
      this.angle = 270;
      break;
  }
}
Arrow.prototype = Object.create(Phaser.Sprite.prototype);
Arrow.prototype.constructor = Arrow;
Arrow.prototype.update = function () {
  if (!this.inWorld) {
    this.destroy();
  }
};

// enemy death

function EnemyDeath(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, "atlas", "enemy-death/enemy-death-1");
  this.anchor.setTo(0.5);
  const anim = this.animations.add(
    "death",
    Phaser.Animation.generateFrameNames(
      "enemy-death/enemy-death-",
      1,
      6,
      "",
      0
    ),
    18,
    false
  );
  this.animations.play("death");
  anim.onComplete.add(function () {
    this.kill();
  }, this);
}

EnemyDeath.prototype = Object.create(Phaser.Sprite.prototype);
EnemyDeath.prototype.constructor = EnemyDeath;

// Gem

function Gem(game, x, y) {
  x *= 16;
  y *= 16;
  Phaser.Sprite.call(this, game, x, y, "atlas", "gem/gem-1");
  this.animations.add(
    "gem",
    Phaser.Animation.generateFrameNames("gem/gem-", 1, 4, "", 0),
    10,
    true
  );
  this.anchor.setTo(0.5);
  game.physics.arcade.enable(this);
  this.animations.play("gem");
  this.type = "gem";
}
Gem.prototype = Object.create(Phaser.Sprite.prototype);
Gem.prototype.constructor = Gem;

// COIN

function Coin(game, x, y) {
  x *= 16;
  y *= 16;
  Phaser.Sprite.call(this, game, x, y, "atlas", "coin/coin-1");
  this.animations.add(
    "coin",
    Phaser.Animation.generateFrameNames("coin/coin-", 1, 4, "", 0),
    10,
    true
  );
  this.anchor.setTo(0.5);
  game.physics.arcade.enable(this);
  this.animations.play("coin");
  this.type = "coin";
}
Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;
