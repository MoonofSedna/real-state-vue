import { useFirebaseAuth } from "vuefire";
import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged, type Auth } from "@firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/properties/:id",
      name: "property",
      component: () => import("../views/PropertyView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/admin/AdminLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "properties",
          name: "admin-properties",
          component: () => import("../views/admin/AdminView.vue"),
        },
        {
          path: "new-property",
          name: "new-property",
          component: () => import("../views/admin/NewPropertyView.vue"),
        },
        {
          path: "edit/:id",
          name: "edit-property",
          component: () => import("../views/admin/NewPropertyView.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/404.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth);
  if (requiresAuth) {
    try {
      await auntheticateUser();
      next();
    } catch (e) {
      next({ name: "login" });
    }
  } else {
    if (to.matched.some(url => url.name === "login" || url.name === "signup")) {
      try {
        await auntheticateUser();
        next({ name: "home" });
      } catch (e) {
        next();
      }
    } else {
      next();
    }
  }
});

const auntheticateUser = async () => {
  const auth = useFirebaseAuth() as Auth;
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      if (!user) {
        reject();
      }
      resolve(user);
    });
  });
};

export default router;
