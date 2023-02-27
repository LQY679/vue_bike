<template>
    <el-container>
        <el-header>
            <div class="header-left">
                <div class="logo">小罗骑行</div>
                <div class="menu">
                        <el-menu
                        :router="true"
                        :default-active="activeIndex"
                        class="el-menu-demo"
                        mode="horizontal"
                        @select="handleSelect"
                        background-color="#455E7A"
                        text-color="#fff"
                        active-text-color="#F15B49">
                            <el-menu-item index="/home">首页</el-menu-item>
                            <el-menu-item index="/publicInformation">公告消息</el-menu-item>
                            <el-menu-item index="/payCenter">充值中心</el-menu-item>
                            <el-menu-item index="/about">关于</el-menu-item>
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
        data() {
            return {
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
            handleSelect(){   // 选中菜单项的回调函数
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
            }
        },
    }
</script>

<style scoped>
    .el-container {
        height: 100%;
    }
    .el-header{
        padding: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        background-color: #455E7A;
    }
    
    .header-right span{
        margin: 5px;
        color: #fff;
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
    
    .el-main{
        background-color: aqua;
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