<template>
  <div id="root">
    <div class="block">
      <h2 class="title">开发者简介</h2>
      <div class="block-content">
        <div id="logo">
          <img src="../assets/img/myIcoon.jpg" alt="">
        </div>
        <div class="text-container">
          <h2>罗乾有</h2>
          <h4>小罗骑行 开发者</h4>
          <p>广西科技师范学院数学与计算机科学学院软件工程专业2020级学生</p>
        </div>
      </div>
    </div>

    <div class="block">
      <h2 class="title">项目技术栈</h2>
        <ul class="logo-list">
            <a href="https://cn.vuejs.org/"><img src="../assets/img/about_page/vue_logo.jpg" target="_blank"></a>
            <a href="https://element.eleme.cn/#/zh-CN"><img src="../assets/img/about_page/elementUI_logo.jpg" target="_blank"></a>
            <a href="https://spring.io/"><img src="../assets/img/about_page/spring_logo.jpg" target="_blank"></a>
            <a href="https://www.mysql.com/"><img src="../assets/img/about_page/MySQL_logo.jpg" target="_blank"></a>
            <a href="https://redis.io/"><img src="../assets/img/about_page/redis_logo.jpg" target="_blank" style="height: 10rem; width: auto;"></a>
        </ul>
    </div>

    <div class="block" id="share-block">
      <h2>合作学习交流</h2>
      <h5>本项目的前端代码已开源到GitHub, Gitee等主流仓库,如果您对本项目有何疑问或者您的好的想法,欢迎提交issue</h5>
      <div class="text-container">
        <a href="" target="_blank">
          <span class="iconfont icon-gitee"></span> Github仓库
        </a>
        &nbsp;
        <a href="" target="_blank">
          <span class="iconfont icon-github"></span> Gitee仓库
        </a>
      </div>
      <h5>开发者个人博客如下所示, 欢迎访问交流</h5>
      <div class="text-container">
        <a href="https://www.cnblogs.com/lqy-blogs/" target="_blank">
          <span class="iconfont icon-bokeyuan"></span> 博客园个人主页
        </a>
        <br>
        <a href="https://lqy679.github.io/" target="_blank">
          <span class="iconfont icon-wangzhan"></span> 个人博客站点: https://lqy679.github.io/
        </a>
        <br>
        <a href="https://lqy679.gitee.io/" target="_blank">
          <span class="iconfont icon-wangzhan"></span> 个人博客站点: https://lqy679.gitee.io/
        </a>
      </div>
    </div>

    <MyFooter></MyFooter>
  </div>
</template>

<script>
import MyFooter from '../components/MyFooter.vue'

export default {
  name: 'About',
  components: {
    MyFooter
  },
}
</script>

<style scoped>
  /* 引入阿里巴巴图标库项目样式表 */
@import '../assets/icon/iconfont.css';

#root > .block{
  margin: 20px;
  font-family: "微软雅黑";
}
.title {
  margin: 0;
}

.block-content {
  display: flex;
}

.block-content > * {
  margin: 50px;
}

#logo {
  height: 230px;
  width: 230px;
  
  border-radius: 50%;
  overflow: hidden;
}

#logo img{
  height: 230px;
  width: 230px;
}

.logo-list {
  list-style-type: none;
}

.logo-list img{
  margin: 20px;
}

.logo-list img:hover {
  border: 2px outset #F15B49;
}

.text-container *{
  text-decoration: none;
  font-size: 1rem;
  color: black;
}

.text-container a:hover{
  font-size: 1.05rem;
  color: #F15B49;
} 
</style>
