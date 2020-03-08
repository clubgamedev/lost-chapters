<template>
  <main id="game"></main>
</template>

<script>
export default {
  name: "App",
  mounted() {
    import(
      /* webpackChunkName: "game" */ "@/game/lostchapters.js"
    ).then(module => module.startGame());
  }
};
</script>


<style>
html,
body {
  height: 100%;
  margin: 0;
}

body {
  background: black;
  color: goldenrod;
}

@font-face {
  font-family: "Alagard";
  font-style: normal;
  font-weight: 400;
  src: url("../public/assets/fonts/alagard.ttf");
}
/*
@font-face {
  font-family: "Pixellari";
  font-style: normal;
  font-weight: normal;
  src: url("../public/assets/fonts/Pixellari.ttf");
}

@font-face {
  font-family: "GrapeSoda";
  font-style: normal;
  font-weight: normal;
  src: url("../public/assets/fonts/GrapeSoda.ttf");
}

@font-face {
  font-family: "pf_easta_seven";
  font-style: normal;
  font-weight: normal;
  src: url("../public/assets/fonts/PFEastaSevenCondensed.woff2") format("woff2"),
    url("../public/assets/fonts/PFEastaSevenCondensed.woff") format("woff");
}

@font-face {
  font-family: "Comicoro";
  font-style: normal;
  font-weight: normal;
  src: url("../public/assets/fonts/Comicoro.ttf");
}*/

#game {
  font-family: "Alagard", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  border: 2px groove #201505;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
}
</style>
