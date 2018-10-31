<template>
  <main>
    <Game :importGame="importGame" />
  </main>
</template>

<script>
import Game from "@/components/Game.vue";

export default {
  name: "game",
  components: {
    Game
  },
  data() {
    return {
      importGame: () =>
        import(/* webpackChunkName: "breakout" */ "@/game/breakout.js")
    };
  }
};
</script>
