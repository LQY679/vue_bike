<template>
    <el-container id="container">
        <el-header>
            <div>
                <img src="../assets/img/login_logo.png" alt="">
                <span>管理面板</span>
            </div>
            <div>
                <span>管理员: {{loginUserInfo.uid}}</span> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                <el-button @click="logout" type="info" plain size="mini">退出登陆</el-button>
            </div>

        </el-header>

        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <!-- 左侧导航栏 -->
                <el-menu :default-openeds="['1', '3']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-user-solid"></i>用户信息管理</template>
                        <el-menu-item @click="" index="1-1">
                            <router-link replace  class="router-link" to="/adminPanle/userTable">用户信息列表</router-link>
                        </el-menu-item>
                    </el-submenu>
                    </el-submenu>

                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-bicycle"></i>车辆信息管理</template>
                        <el-menu-item @click="" index="2-1">
                            <router-link replace  class="router-link" to="/adminPanle/bikeTable">
                                车辆信息列表
                            </router-link>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-c-scale-to-original"></i>工单管理</template>
                        <el-menu-item @click="" index="3-1">
                            <router-link  replace class="router-link" to="/adminPanle/orderTable">
                                骑行订单列表
                            </router-link>
                        </el-menu-item>

                        <el-menu-item @click="" index="3-2">
                            <router-link replace class="router-link" to="/adminPanle/repairTable">
                                车辆故障上报单列表
                            </router-link>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title"><i class="el-icon-map-location"></i>服务区管理</template>
                        <el-menu-item @click="" index="4-1">列表1</el-menu-item>
                    </el-submenu>


                </el-menu>
            </el-aside>

            <el-main>
                <!-- 列表路由展示区 -->
                <router-view></router-view>
            </el-main>

        </el-container>

    </el-container>
</template>

<script>
    export default {
        name: 'AdminPanle',
        mounted() {
            // 加载等待...
            // const loading = this.$loading({
            //     lock: true,
            //     text: '尊敬的大爹类型用户管理员,正在加载中ing请耐心等待...'
            //         + '或者您掏钱优化立马嘎嘎变快',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(255, 255, 255, 0.9)'
            // });

            // // 可以设置加载得慢一点,用来骗用户优化性能,哈哈哈哈哈
            // setTimeout(() => {
            //     if (this.isLoaded) {
            //         loading.close();
            //     }
            // }, 1300);

            this.$router.replace({
                path: '/adminPanle/userTable'
            })
        },
        data() {
            return {
                isLoaded: false,   // 加载动画判断标志,用户列表或车辆列表加载成功为true
            }
        },
        methods: {
            // 注销功能
            logout() {
                this.$confirm('此操作会清除登陆状态, 是否继续?', '提示', {
                    confirmButtonText: '确定注销',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.$store.dispatch("logout", this.loginUserInfo)
                        .then((result) => {
                            // 如果 请求响应的结果集 不为空, 即 http响应码200
                            if (result) {
                                this.$message({ type: 'warning', message: result.msg });
                            }
                            // 注销后回到首页    
                            this.$router.replace({ path: '/home' }) 
                        })

                })
            },

        },
        computed: {
            loginUserInfo() {
                return this.$store.state.loginUserInfo
            }
        }
    }
</script>

<style scoped>
    #container {
        height: 100vh;
    }

    .el-header {
        background-color: rgb(241, 91, 73);
        display: flex;
        justify-content: space-between;
        padding: 0;
        align-items: center;
        color: white;
    }

    .el-header img {
        width: 10%;
    }

    .el-header div {
        display: flex;
        align-items: center;
    }

    .el-aside {
        background-color: rgb(63, 89, 86);
    }

    .el-main {
        background-color: rgb(206, 226, 233);
        padding: 10px;
    }
    
    .router-link {
        text-decoration: none; /* 去除下划线 */
        color: inherit; /* 继承父元素的颜色 */
    }
</style>