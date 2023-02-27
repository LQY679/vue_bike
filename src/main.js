import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VueRouter from 'vue-router'
import router from './router'
Vue.use(VueRouter);

import store from './store'

import axios from 'axios' 
Vue.prototype.$axios = axios

import './assets/css/global.css'

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router:router,
  store,
}).$mount('#app')
