import { createRouter, createWebHistory } from "vue-router";
// stores
import { useAuthStore } from "@/stores/auth";

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
  const auth = useAuthStore();
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth);

  await auth
    .auntheticateUser()
    .then(() => {
      if (requiresAuth) {
        next();
      } else {
        if (to.matched.some(url => url.name === "login")) {
          next({ name: "home" });
        } else {
          next();
        }
      }
    })
    .catch(() => {
      if (requiresAuth) {
        next({ name: "login" });
      } else {
        next();
      }
    });
});

export default router;
