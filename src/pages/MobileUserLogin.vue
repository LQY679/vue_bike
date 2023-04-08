<template>
    <div id="root">
        <div id="logo-container">
            <!-- <Logo></Logo> -->
            <span class="iconfont icon-qihang" style="font-size: 2rem;"></span>&nbsp;
            <span>小罗骑行</span>
        </div>
        <div class="bottom-container">
            <div id="input-container">
                <div class="inputBox">
                    <input type="text" v-model="userInfo.uid" required>
                    <span>用户名</span>
                    <i></i>
                </div>
                <div class="inputBox">
                    <input type="password" v-model="userInfo.pwd" required>
                    <span>密码</span>
                    <i></i>
                </div>
            </div>
        </div>

        <div class="check-admin" v-if="!this.isMobile">
            <input type="checkbox" @change="checkBoxChange">
            <span>
                是否以管理员身份执行操作
            </span>
        </div>

        <div class="btn-container">
            <el-button @click="submitLogin()" type="danger" round>登陆</el-button>

            <el-button @click="submitLogon()" type="info" round>注册</el-button>
        </div>
    </div>
</template>

<script>
    import Logo from '../components/Logo.vue'
    export default {
        name: 'MobileUserLogin',
        components: {
            Logo
        },

        mounted() {
            this.$bus.$on("checkMobile", (isMobile) => {
                // console.log("登陆界面检测到媒体设备改变", this, isMobile);
                this.isMobile = isMobile
            })
        },

        data() {
            return {
                isMobile: window.matchMedia("(max-width: 550px)").matches ? true : false,
                userInfo: {
                    uid: '',
                    pwd: "",
                    type: 'user',
                },
            }
        },

        computed: {

        },
        methods: {

            checkBoxChange() {
                // 切换用户类型
                this.userInfo.type = this.userInfo.type == 'user' ? 'admin' : 'user'
                // console.log("复选框改变!",this.userInfo.type);
            },

            // 提交登陆事件
            submitLogin() {
                if (!Boolean(this.userInfo.uid) || !Boolean(this.userInfo.pwd)) {
                    this.$message({ message: '用户名或密码未填写!', type: 'warning' });
                    return
                }
                this.$store.dispatch("login", this.userInfo)
                    .then((result) => {  // 如果用户名和密码都正确返回true, 否则返回false
                        if (result.code == 1000) {
                            this.$message({ message: '登陆成功!', type: 'success', duration: 500 })
                            /*
                                redirectPath: 普通用户根据使用的设备不同跳转到不同的页面
                                普通用户使用移动端设备登陆后跳转至 开始使用页面
                                使用PC端跳转至首页
                             */
                            let redirectPath = this.isMobile ? "/start" : "/home"
                            switch (this.userInfo.type) {  // 根据登陆成功的用户类型跳转至对应的界面
                                case 'user': {
                                    this.$router.replace({
                                        path: redirectPath,
                                    })
                                    break
                                }
                                case 'admin': {
                                    // console.log("管理员用户登陆,跳转至管理面板")
                                    this.$router.replace({
                                        path: '/adminPanle',
                                    })
                                    break
                                }
                            }
                        }
                        else {
                            this.$message.error(result.msg)
                        }
                    });
            },
            //  提交注册按钮事件
            submitLogon() {
                if (!Boolean(this.userInfo.uid) || !Boolean(this.userInfo.pwd)) {
                    this.$message({ message: '用户名或密码未填写!', type: 'warning' });
                    return
                }
                this.$axios({
                    method: 'post',
                    url: '/addUser',
                    data: {
                        uid: this.userInfo.uid,
                        pwd: this.userInfo.pwd,
                        type: this.userInfo.type
                    }
                })
                    .then((response) => {
                        let return_data = response.data
                        if (return_data.msg == 'true') {
                            this.$message({ message: '注册成功!', type: 'success' });
                        }
                        else {
                            this.$message.error('注册失败,用户已存在或者提交信息有误!');
                        }
                    })
                    .catch((error) => {
                        alert("注册网络请求失败!")
                        console.log(error);
                    });
            }
        },



    }
</script>

<style scoped>
    #root {
        background-color: #455E7A;
        height: 100vh;
        max-height: 100vh;
        /* overflow: hidden; */

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1.2rem;
    }

    #logo-container>span {
        font-weight: bold;
        color: #F15B49;
        font-size: 2rem;
    }

    #input-container {
        /* position: relative; */
        /* top: 45%; */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2.1rem;
    }


    .inputBox {
        position: relative;
        width: 60vw;
        font-size: 1.5rem;
    }

    .inputBox input {
        width: 100%;
        padding: 10px 0 5px;
        background: transparent;
        outline: none;
        /* box-shadow: none; */
        border: none;
        color: #fff;
        font-size: 1.25rem;
    }

    .inputBox span {
        position: absolute;
        left: 0;
        padding: 10px 0 5px;
        pointer-events: none;
        color: rgba(255, 255, 255, 0.5);
        transition: 0.5s;
    }

    /* 表单元素的值需要根据指定条件验证时设置指定样式 */
    .inputBox input:valid~span,
    /* 选择具有焦点的时候 */
    .inputBox input:focus~span {
        color: #F15B49;
        transform: translateY(-1.6rem);
        /* 将文字向Y轴（向上）平移16px */
        font-size: 1.25rem;
    }

    /* 可见的一个线 */
    .inputBox i {
        position: absolute;
        left: 0;
        bottom: -0.25rem;
        width: 100%;
        height: 2px;
        background: #fff;
        overflow: hidden;
    }

    /* 在i标签的左边创建（伪元素）一个跟i等大的一条线，加上炫彩颜色 */
    .inputBox i::before {
        content: '';
        position: absolute;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #EEBD89, #D13ABD, #C973FF, #6CC6CB, #9FA5D5, #EAD6EE);
        animation: runing 1s linear infinite;
        transition: 0.5s;
    }

    .inputBox input:valid~i::before,
    .inputBox input:focus~i::before {
        left: 0;
    }

    /* 创建动画 */
    @keyframes runing {
        0% {
            background-position-x: 0;
        }

        100% {
            background-position-x: 250px;
        }
    }

    .btn-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /* gap: 2rem; */
    }

    .btn-container button {
        margin: 0 0 1rem 0;
        width: 60vw;
        left: 0;
    }

    .check-admin>* {
        color: white;
    }

    .check-admin>input:checked~span {
        color: #F15B49;
    }
</style>