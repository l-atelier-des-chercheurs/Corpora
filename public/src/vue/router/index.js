import Vue from "vue";
import VueRouter from "vue-router";
import List from "../views/List.vue";
import Corpus from "../views/Corpus.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Accueil",
    title: "Corpora",
    component: List,
  },
  {
    path: "/:slugFolderName",
    name: "Corpus",
    title: "Corpora",
    component: Corpus,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.NODE_ENV === "production" ? "/2021-sdtr/front/" : "/",
  routes,
  scrollBehavior(to, from, savedPosition) {
    let position = { x: 0, y: 0 };
    // Keep scroll position when using browser buttons
    if (savedPosition) {
      position = savedPosition;
    }
    // Workaround for transitions scrolling to the top of the page
    // However, there are still some problems being fixed by the vue team
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(position);
      }, 250);
    });
  }, //   scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { x: 0, y: 0 };
  //   }
  // },
});

export default router;
