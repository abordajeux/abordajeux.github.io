import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import {appRouter} from './router/router.js';
import store from './store/general.js'
createApp(App).use(appRouter).use(store).mount('#app')
