<template>
  <div>
    <div id="videoContainer">
          <!-- 静音属性 muted -->
      <div class="videoMsg">骑行共赴未来<br>
        &emsp; &emsp;小罗与你相伴
      </div>
      <video src="../assets/index.mp4" autoplay="true" loop="true" muted="true"></video>
    </div>
    
    <MyFooter></MyFooter>
  </div>
</template>

<script>
import MyFooter from '../components/MyFooter.vue'

export default {
  name: 'Home',

  beforeCreated(){
    // 如果是移动端设备访问, 直接跳转至登陆界面而不是首页
    if (this.isMobile) {
        this.$router.replace({
          path: '/login',
        })
      }
  },

  mounted(){
    this.$bus.$emit("changeHeaderEffect",true)
    // console.log("挂载首页组件...此时应该添加滚轮监听特效");
  },

  activated(){
    this.$bus.$emit("changeHeaderEffect",true)
    // console.log("首页组件路由激活..此时应该添加滚轮监听特效");
  },

  deactivated(){
    this.$bus.$emit("changeHeaderEffect",false)
    // console.log("首页组件切走..此时应该移除滚轮监听特效");
  },

  components: {
    MyFooter
  },
}


</script>

<style scoped>
  #videoContainer {
    height: 100vh;
    position: relative;
  }

  .videoMsg {
    font-weight: bold;
    color: #F15B49;
    font-size: 3rem;
  
    position: absolute;
    top: 26%;
    left: 4%;
  }

  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  
</style>
