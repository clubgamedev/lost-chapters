import Vue from "vue";
import Router from "vue-router";
import Breakout from "./views/Breakout.vue";
import TinyRPG from "./views/TinyRPG.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/tinyrpg"
    },
    {
      path: "/breakout",
      name: "breakout",
      component: Breakout
    },
    {
      path: "/tinyrpg",
      name: "tiynrpg",
      component: TinyRPG
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
