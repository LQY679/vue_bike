<template>
  <div id="root">
    <h4 style="text-align: center;">基本信息</h4>
    <el-descriptions class="margin-top" title="" direction="vertical" :column="3" border style="text-align: center;">
      <el-descriptions-item label="用户名">
        <template slot="label">
          <i class="el-icon-user"></i>
          用户名
        </template>
        <el-tag size="small">{{showUid}}</el-tag>
      </el-descriptions-item>

      <el-descriptions-item label="密码">
        <template slot="label">
          <i class="el-icon-user"></i>
          显示密码<input type="checkbox" v-model="isShowPwd">
        </template>
        <el-tag size="small">{{showPwd}}</el-tag> &nbsp;&nbsp;&nbsp;修改密码
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo('pwd')"></el-button>
      </el-descriptions-item>

      <el-descriptions-item label="电子邮箱">
        <template slot="label">
          <i class="el-icon-user"></i>
          电子邮箱
        </template>
        <el-tag size="small">{{showEmail}}</el-tag> &nbsp;&nbsp;&nbsp;修改绑定邮箱
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo('email')"></el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-dialog title="修改用户信息" :visible.sync="isShowUserEditForm"  
      :close-on-click-moda="false" width="60vw" center>
      <!-- 用户信息表单 -->
      <el-form label-position="'right'" label-width="80px" :model="userForm" :validate-on-rule-change="false">
        <el-form-item label="uid">
          <el-input disabled v-model="userForm.uid"></el-input>
        </el-form-item>

        <el-form-item label="密码" v-if="this.editSelect=='pwd'">
          <el-input v-model="userForm.pwd"></el-input>
        </el-form-item>

        <div v-if="this.editSelect=='email'">
          <el-form-item label="邮箱" prop="email" :rules="[
              { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
              { type: 'email', message: '邮箱格式错误! 请输入正确的邮箱地址', trigger: ['blur', 'change'] } ]">
            <el-input v-model="userForm.email"></el-input>

            <el-button type="primary" size="mini" v-if="showVerifyCode_btn" @click="getVerifyCode()"
              :disabled="isDisabledVerifyCode_btn" v-text="verifyCode_btn.text">
            </el-button>
          </el-form-item>

          <el-form-item label="验证码" v-if="isShowVerifyCodeInput" prop="verifyCode" :rules="{
              required: true, message: '验证码不能为空', trigger: 'blur'}">
            <el-input v-model="verifyCode"></el-input>

          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditUserForm()" :disabled="isDisabledSubmitUserForm_btn">提交修改
        </el-button>
      </span>
    </el-dialog>

    <h4 style="text-align: center;">骑行数据</h4>
    <div class="data-table">
      <el-table :data="orderList" max-height="300" border style="width: 100%">
        <el-table-column prop="order_id" label="骑行订单编号" width="180">
        </el-table-column>

        <el-table-column prop="start_time" label="骑行开始时间">
        </el-table-column>

        <el-table-column prop="end_time" label="骑行结束时间">
        </el-table-column>

        <el-table-column prop="amount" label="骑行费用" width="180">
        </el-table-column>
      </el-table>
    </div>

    <h4 style="text-align: center;">骑行优惠套餐</h4>
    <div class="block-container">
      <div>套餐一</div>
      <div>套餐二</div>
      <div>套餐三</div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'UserCenter',

    mounted() {

      if (this.user.uid){
        this.getUserOrder()
      }

      // 登陆信息加载完后触发, 解决刷新信息不同步问题
      this.$bus.$on("loginInfoLoaded", ()=>{
        this.user = this.$store.state.loginUserInfo
        this.getUserOrder()
      })
    },

    data() {
      return {
        user: this.$store.state.loginUserInfo,
        userForm: {},
        verifyCode: '',
        editSelect: '',  // 选择编辑的类型 可选: 'pwd' , 'email'
        orderList: [],
        isShowPwd: false,

        isShowUserEditForm: false,
        isShowVerifyCodeInput: false,
        isDisabledVerifyCode_btn: false, // 是否禁用 发送验证码按钮规则: 已经发送过验证码并且倒计时结束前会禁用

        verifyCode_btn: {
          text: '发送验证码',
          second: 60
        },
      }
    },

    computed: {

      showUid() {
        return this.user.uid
      },
      showPwd() {
        if (this.isShowPwd) {
          return this.user.pwd
        }
        else {
          // 生成与密码长度相同的 星号
          let s = '*'
          for (let i = 1; i < this.user.pwd.length; i++) s += '*'
          return s
        }

      },
      showEmail() {
        if (this.user.email) {
          return this.user.email
        }
        else {
          return "您还未绑定邮箱哦"
        }
      },
      showVerifyCode_btn() {
        if (Boolean(this.userForm.email)) {
          return true
        }
        else {
          return false
        }
      },

      // 是否禁用 提交按钮 规则: 当编辑的是邮箱时并且邮箱未输入或者验证码未输入时会禁用
      isDisabledSubmitUserForm_btn() {
        console.log((this.userForm.email == '' || this.verifyCode == ''));
        if (this.editSelect == 'email' && (this.userForm.email == '' || this.verifyCode == '')) {
          return true
        }
        else if (this.editSelect == 'pwd' && this.userForm.pwd == '') {
          return true
        }
        return false
      },
    },

    methods: {

      getUserOrder() {
        this.$axios({
          method: 'get',
          url: 'getOrdersByUid',
          params: {
            uid: this.user.uid
          }
        }).then((response) => {
          let result = response.data
          if (response.status == 200 && result.code == 1000) {
            this.orderList = result.data
          }
          else {
            this.$message({ message: `${result.msg}`, type: 'warning', duration: 500 })
          }

        }).catch((error) => {
          alert("网络请求失败!")
          console.log(error);
        })
      },

      // 点击按钮, 更新 '编辑选择' 的状态, 同时展示 用户信息表单
      editUserInfo(editSelect) {
        this.userForm = Object.assign({}, this.$store.state.loginUserInfo)  
        this.verifyCode = ''
        this.editSelect = editSelect
        this.isShowUserEditForm = true

      },

      // 发送修改用户密码请求
      postUserPwd() {
        this.$axios({
          method: 'put',
          url: '/updateUser',
          data: this.userForm
        }).then((response) => {
          let result = response.data
          // let messageType = 'success'
          if (response.status == 200 && result.code == 1000) {
            this.user = this.userForm
            
            this.isShowUserEditForm = false
            this.$message({ message: '修改成功!', type: 'success' })
          }
          else {
            this.$message({ message: '修改失败!', type: 'error' })
          }
          // this.$message({ message: result.msg, type: messageType })
        }).catch((error) => {
          alert("网络请求失败!")
          console.log(error);
        })
      },

      // 修改 '发送验证码' 按钮样式为倒计时状态
      modifVerifyCode_btn(initSecond) {
        // 展示按钮倒计时
        let countDownTime = setInterval(() => {
          this.verifyCode_btn.text = `${this.verifyCode_btn.second}S`
          this.verifyCode_btn.second -= 1
        }, 1000)

        // 倒计时结束, 清除 倒计时的定时器, 并且将按钮重新初始化状态
        setTimeout(() => {
          clearInterval(countDownTime)
          this.verifyCode_btn.text = '重新发送验证码'
          this.verifyCode_btn.second = initSecond
          this.isDisabledVerifyCode_btn = false
        }, 1000 * initSecond)
      },

      // 发送获取验证码请求
      getVerifyCode() {
        this.$axios({
          method: 'post',
          url: '/sendBindMailVerifyCode',
          data: this.userForm
        }).then((response) => {
          let result = response.data
          let messageType = 'success'

          if (response.status == 200 && result.code == 1000) {
            this.isShowVerifyCodeInput = true  // 展示 验证码输入框
            this.isDisabledVerifyCode_btn = true  // 60秒内禁用发送验证码按钮 
            let initSecond = this.verifyCode_btn.second  // 最初始时的预设秒数
            this.modifVerifyCode_btn(initSecond)  // 修改按钮为倒计时样式
          }
          else {
            messageType = 'error'
          }
          this.$message({ message: result.msg, type: messageType })
        }).catch((error) => {
          alert("网络请求失败!")
          console.log(error);
        })
      },

      // 发送绑定邮箱请求
      postUserEmail() {
        this.$axios({
          method: 'post',
          url: '/bindMail',
          params: {
            code: this.verifyCode
          },
          data: this.userForm
        }).then((response) => {
          let result = response.data
          let messageType = 'success'
          if (response.status == 200 && result.code == 1000) {
            this.user = this.userForm
            this.$store.state.loginUserInfo = this.userForm
            this.isShowUserEditForm = false
          }
          else {
            messageType = 'error'
          }
          this.$message({ message: result.msg, type: messageType })
        }).catch((error) => {
          alert("网络请求失败!")
          console.log(error);
        })
      },

      submitEditUserForm() {
        switch (this.editSelect) {
          case 'pwd': {
            this.postUserPwd()
            break
          }

          case 'email': {
            this.postUserEmail()
            break
          }
        }
      },
    }
  }
</script>

<style scoped>
  #root {
    padding: 10px;
  }

  .block-container {
    display: flex;
    justify-content: center;
  }

  .block-container>div {
    margin: auto;
  }
</style>