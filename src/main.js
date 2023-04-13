import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VueRouter from 'vue-router'
import router from './router'
Vue.use(VueRouter);

import store from './store'

// import axios from 'axios'
import axios from './request/axiosConfig' 
Vue.prototype.$axios = axios

import './assets/css/global.css'

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router:router,
  store,
  beforeCreate(){
    // 添加 全局事件总线
    Vue.prototype.$bus = this
  }
}).$mount('#app')
