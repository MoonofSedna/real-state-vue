<script setup lang="ts">
  import { ref } from "vue";
  import { RouterView } from "vue-router";
  // stores
  import { useAuthStore } from "./stores/auth";

  const drawer = ref(false);
  const auth = useAuthStore();

  const privNavigation = [
    { icon: "mdi-home", title: "Home", value: "home" },
    { icon: "mdi-account", title: "Admin", value: "admin-properties" },
  ];

  const pubNavigation = [
    { icon: "mdi-home", title: "Home", value: "home" },
    { icon: "mdi-login", title: "Login", value: "login" },
  ];
</script>

<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" temporary class="mb-nav">
      <v-list nav>
        <v-list-item
          v-for="(item, index) in auth.isAuth ? privNavigation : pubNavigation"
          :key="item.title + index"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="{ name: item.value }" />
        <v-divider class="my-6" v-if="auth.isAuth" />
        <v-btn
          v-if="auth.isAuth"
          class="text-center bg-gray w-100"
          title="Logout"
          size="large"
          @click="auth.logout">
          Logout
        </v-btn>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="gray" class="nav-bar">
      <template v-slot:prepend class="d-md-block">
        <v-btn :to="{ name: 'home' }" variant="plain"> Real State Vue </v-btn>
      </template>

      <template v-slot:append>
        <v-btn icon @click="drawer = !drawer" class="mb-nav" aria-label="menu">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <div class="dk-nav">
          <v-btn
            v-for="(item, index) in auth.isAuth
              ? privNavigation
              : pubNavigation"
            :key="item.title + index"
            class="ml-2"
            :to="{ name: item.value }"
            :prepend-icon="item.icon">
            {{ item.title }}
          </v-btn>
          <v-divider class="ml-2" vertical v-if="auth.isAuth" />
          <v-btn
            v-if="auth.isAuth"
            class="ml-2"
            @click="auth.logout"
            append-icon="mdi-logout">
            Logout
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-main class="w-100">
      <div class="d-flex flex-column justify-center align-center w-100">
        <div class="header-img">
          <h1 class="px-2 text-white font-weight-black text-md-h3">
            Real State - VUE
          </h1>
        </div>

        <v-card
          max-width="1200"
          flat
          color="transparent"
          class="d-flex justify-center align-center flex-column w-100 px-4 pt-2 pb-16 mt-16">
          <RouterView />
        </v-card>
      </div>
    </v-main>
  </v-layout>
</template>

<style>
  * {
    box-sizing: border-box;
    font-display: swap;
  }
  body {
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
  }

  .v-field__input--is-focused .v-input__slot {
    background-color: #f9f9f9 !important;
  }

  .mb-nav {
    display: none !important;
  }

  .mb-nav.v-navigation-drawer {
    padding-top: 1rem;
    margin-top: 4rem;
  }

  .nav-bar {
    z-index: 2000 !important;
  }

  .dk-nav {
    display: flex;
  }

  .header-img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    width: 100%;
    background-image: url("/public/header-img.webp");
    background-size: cover;
    background-position: center;
  }

  @media screen and (max-width: 768px) {
    .mb-nav {
      display: block !important;
    }

    .dk-nav {
      display: none;
    }
  }
</style>
