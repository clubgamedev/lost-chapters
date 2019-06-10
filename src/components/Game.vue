<template>
  <div id="game"></div>
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
      this.game = module.startGame();
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
  max-width: 1020px;
  max-height: 620px;
}
/*
#game canvas {
  display: block;
  margin: 0 auto;
} */
</style>
