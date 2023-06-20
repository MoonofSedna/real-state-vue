import { createApp } from "vue";
import { createPinia } from "pinia";
import { aliases, mdi } from "vuetify/iconsets/mdi";
// components
import App from "./App.vue";
import router from "./router";
// vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// firebase
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./config/firebase";
// styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const app = createApp(App);
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme: {
        colors: {
          "white": "#ffffff",
          "black": "#000000",
          "gray": "#2F4858",
          "ligth-gray": "#546E7A",
          "primary": "#8CA3A0",
          "secondary": "#A7BEA9",
        },
      },
    },
  },
});

app.use(createPinia());

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.use(vuetify);
app.use(router);
app.mount("#app");
