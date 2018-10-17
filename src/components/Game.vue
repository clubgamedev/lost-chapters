<template>
  <div id='game'></div>
</template>

<script>
import { startGame } from "@/game/breakout.js";

export default {
  name: "Game",
  data() {
    return {
      game: null
    };
  },
  created() {
    this.game = startGame();
  }
};
</script>

<style>
#game {
  margin: 0 auto;
}
#game canvas {
  display: block;
  margin: 0 auto;
}
</style>
