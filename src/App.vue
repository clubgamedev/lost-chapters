<template>
  <div id="app">
    <h1>Lost Chapters</h1>
    <router-view/>
  </div>
</template>

<style>
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

#app {
  font-family: "Alagard", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: goldenrod;
}

canvas {
  border: 2px groove #201505;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

main {
  max-height: 90vh;
  margin: auto;
}
</style>
