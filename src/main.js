import Vue from "vue";
import App from "./App.vue";

window.game = {};

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
