<template>
  <div class="login_container">
    <div class="login_box" @keyup.enter="submitLogin()">
      <div class="login_logo">
        <img src="../assets/img/login_logo.png" alt="">

        <div class="login_from">

          <el-form label-width="100px" size="small">
            <el-form-item>
              <el-input v-model="userInfo.uid" ref="uidInput" placeholder="请输入用户名" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>

            <el-form-item>
              <el-input v-model="userInfo.pwd" type="password" placeholder="请输入密码" prefix-icon="el-icon-key"></el-input>
            </el-form-item>

            <el-form-item>
              <el-select v-model="userInfo.type" placeholder="请选择用户类型">
                <el-option label="用户" value="user"></el-option>
                <el-option label="管理员" value="admin"></el-option>
              </el-select>
            </el-form-item>

            <div class="btn">
              <el-button @click="submitLogin()" type="danger" plain>登陆</el-button>
              <el-button @click="submitLogon()" type="info" plain>注册</el-button>
            </div>
          </el-form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'UserLogin',
    data() {
      return {
        userInfo: {
          uid: '',
          pwd: "",
          type: ""
        },
      }
    },

    mounted() {
      //输入框自动获取焦点
      this.$refs.uidInput.focus();
      
      // this.$nextTick(()=>{
      //   this.$refs.uidInput.focus();
      // })
    },

    methods: {
      // 校验是否输入了用户信息, 没有输入完全会返回false,并且出现弹窗提醒
      isEnterUserInfo() {
        if (!this.userInfo.type || !this.userInfo.uid || !this.userInfo.pwd) {
          this.$message({
            message: '请确认用户名,密码,用户类型均已输入!',
            type: 'warning'
          });
          return false
        }
        return true
      },

      //  提交登陆按钮事件
      submitLogin() {
        // console.log("登陆!",this.userInfo)
        if (this.isEnterUserInfo()) {  // 如果已经选择了用户类型
          this.$store.dispatch("login", this.userInfo)
            .then((isSuccess) => {  // 如果用户名和密码都正确返回true, 否则返回false
              if (isSuccess) {
                this.$message({ message: '登陆成功!', type: 'success',duration: 500 })
                switch (this.userInfo.type) {  // 根据登陆成功的用户类型跳转至对应的界面
                  case 'user': {
                    this.$router.replace({
                      path: '/home',
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
                this.$message.error('登陆失败,请检查输入信息后重试!')
              }
            });
        }
      },
      //  提交注册按钮事件
      submitLogon() {
        if (this.isEnterUserInfo()) {  // 如果已经选择了用户类型
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
      }
    },
  }
</script>

<style scoped>
  .login_container {
    background-color: aquamarine;
    height: 43vw;
  }

  .login_box {
    background-color: rgb(241, 91, 73);
    width: 450px;
    height: 300px;
    border-radius: 4px;

    position: absolute;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);

    border: 1px solid rgb(235, 110, 110);
    box-shadow: 0 0 10px rgb(15, 15, 15);

  }

  .login_box img {
    width: 20%;
    border: 1px solid rgb(245, 153, 153);
    border-radius: 40%;

    position: absolute;
    left: 40%;
    top: -10%;
  }

  .btn {
    display: flex;
    justify-content: center;
  }

  .login_from {
    width: 90%;
    position: absolute;
    top: 20%;
  }
</style>