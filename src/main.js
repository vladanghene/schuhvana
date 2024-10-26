import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/styles/style.css';  // Importing global styles
import { createVuetify } from 'vuetify';
import 'vuetify/lib/styles/main.sass'; // Correct import for Vuetify styles
import '@mdi/font/css/materialdesignicons.css'; // Material Design Icons
import * as components from 'vuetify/lib/components'; // Correct import for Vuetify components
import * as directives from 'vuetify/lib/directives'; // Correct import for Vuetify directives

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app');