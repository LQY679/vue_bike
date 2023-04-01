   /****路由配置*****/
//引入VueRouer插件
import VueRouter from 'vue-router'

//引入页面组件
import UserLogin from '../pages/UserLogin.vue'
import AdminPanle from '../pages/AdminPanle.vue'
import About from '../pages/About'
import Home from '../pages/Home'
import Start from '../pages/Start'
import UserCenter from '../pages/UserCenter'
import MobileUserLogin from '../pages/MobileUserLogin'
import PublicInformation from '../pages/PublicInformation'

import Store from '../store'  // 引入Vuex状态,获取数据

// 配置路由插件并且暴露模块
const router = new VueRouter({
    routes:[
      {
        path: "/",redirect: "/home"
      },
      {
        name: "mobileLogin",
        path: "/login",
        component: MobileUserLogin,
        meta:{titel:"登陆",isAuth:false} 
      },
      {
        name: "login",
        path: "/oldLogin",
        component: UserLogin,
        meta:{titel:"登陆",isAuth:false}   
      },
      {   
        path :'/adminPanle',
        name :'adminPanle',
        component: AdminPanle,
        meta:{titel:"管理面板",isAuth:true} // titel: 页面标题 , isAuth: 布尔值, 判断该路由是否需要登陆授权后才能进入
      },
      {   
        path :'/about',
        name :'about',
        component: About,
        meta:{titel:"关于",isAuth:false}
      },
      {   
        path :'/home',
        name :'home',
        component: Home,
        meta:{titel:"首页",isAuth:false}
      },
      {   
        path :'/start',
        name :'start',
        component: Start,
        meta:{titel:"开始使用",isAuth:true}
      },
      {   
        path :'/UserCenter',
        name :'UserCenter',
        component: UserCenter,
        meta:{titel:"用户中心",isAuth:true}
      },
      {   
        path :'/publicInformation',
        name :'publicInformation',
        component: PublicInformation,
        meta:{titel:"公告信息",isAuth:false}
      },
      
    ]
});

router.beforeEach((to, from, next) => {
  
  // console.log("全局前置路由守卫:",Store.state);

  /*
   包定时器是为了解决刷新登陆授权页面时,由于App组件中的Create钩子还没有把sessStore的数据拷贝到Vuex
   路由守卫读取到的state为空的bug
  */ 
  setTimeout(()=>{
    if (!to.meta.isAuth){  // 如果页面不需要授权,直接放行
        next()
    }
    else{  // 需要授权则校验登陆状态
        if (Store.state.sessionID && Store.state.isLogin){
          next()
        }
        else{
          alert("权限不足,请先登陆!")
        }
    }
  },0);
})

// 页面标题随着路由的改变而改变
router.afterEach((to, from) => {
	document.title = to.meta.titel || '小罗骑行'

})

export default router