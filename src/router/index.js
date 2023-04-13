/****路由配置*****/
//引入VueRouer插件
import VueRouter from 'vue-router'

import routeList from '@/router/routeList'

import Store from '../store'  // 引入Vuex状态,获取数据



// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


// 配置路由插件并且暴露模块
const router = new VueRouter({
  routes: routeList
});


import { getCookie } from '../tool/toolFunction' // 自定义工具函数, 获取cookie
import axios from '../request/axiosConfig'



router.beforeEach((to, from, next) => {
  /*
  包定时器是为了解决刷新登陆授权页面时,由于App组件中的Create钩子还没有把sessStore的数据拷贝到Vuex
  路由守卫读取到的state为空的bug
*/
  // 如果页面不需要授权,直接放行
  setTimeout(async () => {
    let response = ''
    // 当不处于登陆状态, 并且 token 还没过期时, 携带token请求自动登陆
    if (!Store.state.isLogin && getCookie("token")) {
      console.log("路由守卫正在发起自动登陆...");
      response = await axios.get('/autoLogin');
      
    }
    let result = response.data
    // console.log("log...",response);
    if (response.status == 200 && result.code == 1000) {
      Store.commit('LOGIN', result.data)
      console.log("路由守卫自动登陆成功!");
    }
    
    // 不是需要授权的页面直接放行
    if (!to.meta.isAuth) {
      next()
    }
    // 需要授权则校验登陆状态,如果是登陆状态则放行
    else if (Store.state.isLogin) next()

    else alert("权限不足,请先登陆!")  // 访问需要授权页面并且没有登陆  
  }, 1);

})

// 页面标题随着路由的改变而改变
router.afterEach((to, from) => {
  document.title = to.meta.titel || '小罗骑行'

})

export default router