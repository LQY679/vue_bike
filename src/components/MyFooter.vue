<template>
    <div id="root">
        <div class="logo">
            <span class="iconfont icon-qihang"></span> &nbsp;
            <span>小罗骑行</span>
        </div>
        <div class="copyright">
            <span>
                小罗骑行-电单车租赁平台系统V1.0  &copy;2023 
                <a href="https://lqy679.github.io/" target="_blank">LuoQianyou</a>
            </span>
            <span>
                
            </span>
            <span>本项目仅作为学习交流使用,使用素材均来源网络,如有侵权,请联系开发者删除</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'MyFooter',
  components: {
  }
 
}
</script>

<style scoped>
    #root {
        margin: 0;
        background-color: rgb(213, 199, 199);
        height: 25vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 1.5rem;
    }
    .logo > *{
        font-weight: bold;
        color: #F15B49;
        font-size: 1.8rem;
    }

    .copyright {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .copyright *{
        font-style: "黑体";
        color: #000;
        margin-top: 0.3rem;
    }
</style>
