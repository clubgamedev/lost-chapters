<template>
  <div id="game"></div>
</template>

<script>
export default {
  name: "Game",
  props: {
    importGame: Function
  },
  mounted() {
    this.importGame().then(module => module.startGame());
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
