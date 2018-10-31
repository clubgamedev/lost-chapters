/* global Phaser game */

import { BootScene } from "./scenes/BootScene"
import { LoadingScene } from "./scenes/LoadingScene"
import { MenuScene } from "./scenes/MenuScene"
import { GameScene } from "./scenes/GameScene"
import { GameOverScene } from "./scenes/GameOverScene"

const gameWidth = 272;
const gameHeight = 192;

export function startGame() {
  let game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "game");
  game.state.add("Boot", BootScene);
  game.state.add("Preload", LoadingScene);
  game.state.add("TitleScreen", MenuScene);
  game.state.add("PlayGame", GameScene);
  game.state.add("GameOver", GameOverScene);

  game.state.start("Boot");
  window.game = game; //global
  return game;
}
