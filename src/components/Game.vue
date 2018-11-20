<template>
  <div id='game'></div>
</template>

<script>
export default {
  name: "Game",
  props: {
    importGame: Function
  },
  data() {
    return {
      game: null
    };
  },
  mounted() {
    this.importGame().then(module => {
      this.game = module.startGame(["action_shuffle"]);
    });
  },
  destroyed() {
    this.game.onExit && this.game.onExit();
  }
};
</script>

<style>
#game {
  margin: 0 auto;
  max-width: 120vh;
}
#game canvas {
  display: block;
  margin: 0 auto;
}
</style>
