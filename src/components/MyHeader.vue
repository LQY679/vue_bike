<template>
    <el-container>
        <el-header>
            <div class="header-left">
                <div class="logo">小罗骑行</div>
                <div class="menu">
                        <el-menu
                        :router="true"
                        :default-active="activeIndex"
                        class="el-menu"
                        mode="horizontal"
                        @select="handleSelect"
                        text-color="#fff"
                        :background-color= "menu_BgColor"
                        active-text-color="#F15B49">
                            <el-menu-item index="/home">首页</el-menu-item>
                            <el-menu-item index="/publicInformation">公告消息</el-menu-item>
                            <el-menu-item index="/about">关于</el-menu-item>
                            <el-menu-item index="/UserCenter">用户中心</el-menu-item>
                            <el-menu-item index="/start">开始使用</el-menu-item>
                    </el-menu>
                </div>    
            </div>

            <div class="header-right">
                <template v-if="isLogin">
                    用户:<span style="color: #F15B49;">{{loginUserInfo.uid}}</span>
                    <span @click="logout" class="link">注销登陆</span>
                </template>
                <span><router-link to="/login" v-if="!isLogin" class="link">登陆</router-link></span>
            </div>      
        </el-header>
    </el-container>
</template>

<script>
    
import {mapState,mapMutations,mapAction } from 'vuex'  // 简写形式需要引入
    export default {
        name: 'MyHeader',

        mounted(){
            this.header_dom = document.querySelector('.el-container');
            
            window.addEventListener('wheel', this.scrollFunc)         
        },
 
        data() {
            return {
                header_dom: null,  // 头部导航栏挂载以后初始化,获取头部容器的dom对象
                menu_BgColor: "#455E7A",
                activeIndex:'1'  // 选中的菜单项 索引路径
            }
        },
        computed: {
            // loginUserInfo(){
            //     console.log(this.$store.loginUserInfo);
            //     return this.$store.state.loginUserInfo
            // },
            // isLogin(){
            //     return this.$store.state.isLogin
            // },
            // 简写形式
            ...mapState(['loginUserInfo','isLogin'])
        },
        methods: {

            /****  这里存在一个显示bug    ******/
                
            handleSelect(){   // 选中菜单项的回调函数
                console.log("菜单项回调");
                if (this.$route.name != 'home'){
                    console.log("移除滚轮事件");
                    window.removeEventListener('wheel', this.scrollFunc) 
                    this.header_dom.style.backgroundColor = "#455E7A"
                    this.menu_BgColor = "#455E7A"
                } 
                else {
                    console.log("添加滚轮事件!");
                    window.addEventListener('wheel', this.scrollFunc) 
                }
            },

            // 注销功能
            logout(){
                this.$confirm('此操作会退出登陆状态, 是否继续?', '提示', {
                confirmButtonText: '确定注销',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$message({type: 'success',message: '注销成功!',duration: 500});
                    this.$store.commit("LOGOUT");
                    // 注销后回到首页
                    this.$router.replace({path:'/home'})
                }).catch(() => {
                    this.$message({type: 'info',message: '已取消删除'});          
                });
            },

            // 滚动事件,为了兼容火狐滚轮事件标准
            scrollFunc(e){
                var e = e || window.event;
                
                if(e.wheelDelta) {
                    if (e.wheelDelta > 50){  
                        this.header_dom.style.backgroundColor = "#455E7A"
                        this.menu_BgColor = "#455E7A"
                    } 
                    else {   // 鼠标滚轮向下滚动, 将导航栏背景 设置为透明色
                        this.header_dom.style.backgroundColor = "transparent"
                        this.menu_BgColor = "#ffffff00"
                    }
                }
                else if(e.detail) {
                    if (e.detail > 50){  
                        this.header_dom.style.backgroundColor = "#455E7A"
                        this.menu_BgColor = "#455E7A"
                    } 
                    else {  // 鼠标滚轮向下滚动, 将导航栏背景 设置为透明色     
                        this.header_dom.style.backgroundColor = "transparent"
                        this.menu_BgColor = "#ffffff00"
                    }
                
                } 
                else {
                    console.log("滚轮值获取失败", e);
                }
            }
        },
    }
</script>

<style scoped>
    .el-container {
        height: 100%;
        position: sticky;
        top: 0;
        z-index: 1; /* 确保元素在顶部 */ 
        background-color: #455E7A;
    }

    .el-header{
        padding: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .header-right span{
        margin: 5px;
    }

    .header-left{
        display: flex;
        align-items: center;
    }

    .logo {
        margin: 8px;
        font-weight: bold;
        color: #F15B49;
    }

    .link{
        text-decoration: none;
        color: #fff;
        font-weight: bold;
    }

    .link:hover{
        color: #F15B49;
    }


</style>