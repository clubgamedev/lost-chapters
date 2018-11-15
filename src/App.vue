<template>
  <div id="app">
    <div id="nav">
      <router-link to="/breakout">Breakout</router-link> |
      <router-link to="/reigns">Reigns</router-link> |
      <router-link to="/game">Lost Chapters</router-link> |
      <router-link to="/decryptor">Decryptor</router-link> |
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

#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
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
