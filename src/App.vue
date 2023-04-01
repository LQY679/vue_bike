<template>
  <div>
    <MyHeader v-if="this.headerShowRule"></MyHeader>
    <keep-alive include="Start">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

  import MyHeader from './components/MyHeader.vue'



  export default {

    name: 'App',
    components: {
      MyHeader,
    },
    created() {
      this.synchState();  // 刷新时同步Vuex数据
      this.registerMobileListener()  // 注册媒体设备监听事件
    },
    mounted() {
    },

    data() {
      return {
        isMobile: window.matchMedia("(max-width: 550px)").matches ? true : false
      }
    },

    methods: {
      // 通过sessionStorage临时存储状态数据解决Vuex刷新页面丢重置数据问题
      synchState() {
        // 刷新完毕后 将sessionStorage中的登陆状态数据放入Vuex,随后清空sessionStorage的缓存状态
        if (sessionStorage.getItem("loginState")) {
          let loginState = JSON.parse(sessionStorage.getItem("loginState"))
          this.$store.state.sessionID = loginState.sessionID
          this.$store.state.isLogin = loginState.isLogin
          this.$store.state.loginUserInfo = loginState.loginUserInfo
          sessionStorage.removeItem("loginState")
        }
        //  在刷新时将 Vuex 中的数据保存在 sessionStore中, 避免丢失
        window.addEventListener("beforeunload", () => {
          let loginState = {    // 临时变量,封装一个Vuex中的对象登陆状态数据
            sessionID: this.$store.state.sessionID,
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
          // console.log("媒体设备发生改变! isMobile", event.matches);
          this.isMobile = Boolean(event.matches)
          this.$bus.$emit("checkMobile", this.isMobile)
        });
      }
    },

    computed: {
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