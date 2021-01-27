import Vue from "vue";
import Router from "vue-router";
import DashboardLayout from "@/layout/DashboardLayout";
Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      redirect: "dashboard",
      component: DashboardLayout,
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Dashboard.vue")
        },
        {
          path: "/erc20",
          name: "erc20",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/ERC20.vue")
        },
        {
          path: "/erc20-interact/:address",
          name: "erc20-interact",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/ERC20Interact.vue")
        },
        {
          path: "/otc-markets",
          name: "otc-markets",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/OTCMarkets.vue")
        },
        {
          path: "/otc-trading",
          name: "otc-trading",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/OTCTrading.vue")
        },
        {
          path: "/lending",
          name: "lending",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Lending.vue")
        },
        {
          path: "/quickstart",
          name: "quickstart",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/GettingStarted.vue")
        }
      ]
    },
  ]
});
