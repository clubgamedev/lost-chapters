<template>
  <div id="app">
    <div id="nav">
      <router-link to="/breakout">Breakout</router-link> |
      <router-link to="/reigns">Reigns</router-link> |
      <router-link to="/game">Lost Chapters</router-link> |
      <router-link to="/about">About</router-link>
    </div>
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
