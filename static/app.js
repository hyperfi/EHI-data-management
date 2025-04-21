import Navbar from './components/Navbar.js';
import store from './utils/store.js';
import router from './utils/router.js';

const { createApp, ref } = Vue
const app = createApp({
  components: { Navbar },
  template: `
    <div>
      <Navbar />
      <router-view />
    </div>
  `,
});

app.use(store);
app.use(router);
app.mount('#app');