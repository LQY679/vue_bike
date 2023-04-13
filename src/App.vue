<template>
  <div>
    <MyHeader v-if="this.headerShowRule"></MyHeader>
    <!-- 注意!! 首页主键必须是缓存路由组件, 因为导航条滚轮透明效果依赖这个 -->
    <router-view></router-view>
  </div>
</template>

<script>

  import MyHeader from './components/MyHeader.vue'

  import Store from './store'  // 引入Vuex状态,获取数据
  import { getCookie } from './tool/toolFunction' // 自定义工具函数, 获取cookie

  export default {

    name: 'App',
    components: {
      MyHeader,
    },
    created() {
      this.autoLogin_routeSwitch()
      this.synchState();  // 刷新时触发,同步Vuex数据
      this.registerMobileListener()  // 注册媒体设备监听事件

    },
    mounted() {
    },

    data() {
      return {
        isFirstCome: true,
        isMobile: window.matchMedia("(max-width: 550px)").matches ? true : false
      }
    },
    watch: {
      '$route'(to, from) {
        if (to != 'home'){
          this.$bus.$emit("changeHeaderEffect", false)
          console.log("去的不是首页路由...此时应该移除滚轮监听特效");
        } 
        else {
          console.log("去的是首页路由...");
          this.$bus.$emit("changeHeaderEffect",true)
        }
          
      }
    },

    methods: {
      autoLogin_routeSwitch() {
        // 如果不是登陆状态, 并且 cookie 里有token, 发送自动登陆请求,在进行路由跳转校验
        if (!sessionStorage.getItem("loginState") && !Store.state.loginUserInfo.uid && getCookie("token")) {
          this.$axios.get('/autoLogin').then((response) => {
            let result = response.data
            if (response.status == 200 && result.code == 1000) {
              Store.commit('LOGIN', result.data)
              this.routeSwitching()
            }
          })
        }
        /*
         否则直接路由跳转校验, 
         这里判断 !sessionStorage.getItem("loginState") 是避免与synchState()函数起冲突重复跳转路由
         */
        else {
          this.routeSwitching()
        }
      },

      // 根据登陆状态和访问的设备类型决定首页路由跳转
      routeSwitching() {

        // 登陆状态下, 管理员跳转到 后台系统, 普通用户并且是移动端设备跳转到 使用界面
        if (this.loginUserInfo.uid) {
          console.log("存在登陆状态...");
          if (this.loginUserInfo.type == 'admin') {
            this.$router.replace('adminPanle/userTable')
            return
          }
          else if (this.isMobile) {
            this.$router.replace('/start')
            return
          }
        }

        // 没有登陆的情况下, 移动端设备跳转到登陆界面
        if (this.isMobile) {
          this.$router.replace({ path: '/login' })
          return
        }
        // 没有登陆情况下, 非移动端设备跳转到首页
        this.$router.replace('/home')
      },

      // 通过sessionStorage临时存储状态数据解决Vuex刷新页面丢重置数据问题
      synchState() {

        // 刷新完毕后 将sessionStorage中的登陆状态数据放入Vuex,随后清空sessionStorage的缓存状态
        if (sessionStorage.getItem("loginState")) {
          let loginState = JSON.parse(sessionStorage.getItem("loginState"))
          this.$store.state.isLogin = loginState.isLogin
          console.log("正在同步vuex状态...");

          if (loginState.loginUserInfo.uid) {   // 如果是登陆状态, 重新从服务器更新一下用户信息
            this.$axios.get(`/getUserById/${loginState.loginUserInfo.uid}`)
              .then((response) => {
                let result = response.data
                if (result && result.code == 1000) {
                  // 登陆用户信息获取成功后.. 触发全局事件总线, UserCenter 和 Start 页面 依赖这个加载数据
                  Store.commit('LOGIN', result.data)
                  this.$bus.$emit("loginInfoLoaded", result.data)
                  // 管理员处于登陆状态时, 跳转到管理面板
                  if (result.data.type == 'admin') {
                    this.$router.replace('adminPanle/userTable')
                    return
                  }
                  else if (this.isMobile) {
                    this.$router.replace('/start')
                    return
                  }
                }
              })
          }
          // 如果不是登陆状态, 并且是移动端设备访问,自动跳转至登陆界面
          else if (this.isMobile) this.$router.replace({ path: '/login', })

          sessionStorage.removeItem("loginState")
        }


        //  在刷新时将 Vuex 中的数据保存在 sessionStore中, 避免丢失
        window.addEventListener("beforeunload", () => {
          let loginState = {    // 临时变量,封装一个Vuex中的对象登陆状态数据
            isLogin: this.$store.state.isLogin,
            loginUserInfo: this.$store.state.loginUserInfo
          }
          sessionStorage.setItem("loginState", JSON.stringify(loginState))
        })
      },

      /*
        注册移动设备媒体监听器, 添加一个媒体改变监听事件
          当媒体状态变成移动设备时, 触发该事件回调函数,这个回调函数的功能是:
          当检测到当前媒体是移动端设备时, 设置 this.isMobile = true,反之false
      */
      registerMobileListener() {
        const mediaQueryList = window.matchMedia("(max-width: 550px)");
        mediaQueryList.addListener((event) => {
          this.isMobile = Boolean(event.matches)
          this.$bus.$emit("checkMobile", this.isMobile)
        });
      }
    },

    computed: {
      // 提供给导航条展示使用
      loginUserInfo() {
        return this.$store.state.loginUserInfo
      },

      // 导航条的展示规则: 当管理员登陆或者移动端设备登陆时不展示,其他情况均展示
      headerShowRule() {
        let flag = !this.isMobile && this.loginUserInfo.type != 'admin'
        return flag
      }
    }
  }
</script>

<style>
</style>