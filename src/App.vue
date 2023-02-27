<template>
  <div>
    <MyHeader v-if="loginUserInfo.type!='admin'"></MyHeader>
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
    MyHeader
  },
  created() {
    // 刷新完毕后 将sessionStorage中的登陆状态数据放入Vuex,随后清空sessionStorage的缓存状态
    if (sessionStorage.getItem("loginState") ) {
      let loginState = JSON.parse(sessionStorage.getItem("loginState")  )
      this.$store.state.sessionID  = loginState.sessionID
      this.$store.state.isLogin =  loginState.isLogin
      this.$store.state.loginUserInfo = loginState.loginUserInfo
      sessionStorage.removeItem("loginState")
    } 
    //  在刷新时将 Vuex 中的数据保存在 sessionStore中, 避免丢失
    window.addEventListener("beforeunload",()=>{
        let loginState = {    // 临时变量,封装一个Vuex中的对象登陆状态数据
          sessionID: this.$store.state.sessionID,
          isLogin: this.$store.state.isLogin,
          loginUserInfo: this.$store.state.loginUserInfo
        }     
        sessionStorage.setItem("loginState",JSON.stringify(loginState))
    })
  },
  computed: {
    loginUserInfo(){
      return this.$store.state.loginUserInfo
    }
  }
}
</script>

<style scoped>

</style>
