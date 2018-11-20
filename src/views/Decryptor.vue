<template>
  <div class="home">
    <Game :importGame="importGame" />
  </div>
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
                    import(/* webpackChunkName: "breakout" */ "@/minigames/decryptor/decryptor.js")
            };
        }
    };
</script>
