<template>
  <div class="container">
    <!-- 引入高德地图组件 -->
    <LocationMap></LocationMap>
    <!-- 底部容器 -->
    <div class="footer">
      <!-- 左下角容器 -->
      <div class="footer-left">
        <el-tooltip effect="light" :visible-arrow="false" placement="top">
          <div slot="content" v-html="priceRuls"></div>
          <el-link :underline="false">计费规则</el-link>
        </el-tooltip>
        <el-button @click="enterQRcode_Start('start')" class="btn" type="danger" round>扫码骑行</el-button>
        <el-link @click.prevent="enterID_Start('start')" class="ckick-link" :underline="false">无法扫码?点击输入编号</el-link>
      </div>

      <!-- 右下角容器 -->
      <div class="footer-right">
        <el-button @click="enterQRcode_Start('upload-bike-fault')" class="btn" type="info" round>故障上报</el-button>
        <el-link @click.prevent="enterID_Start('upload-bike-fault')" class="ckick-link" :underline="false">无法扫码?点击输入编号
        </el-link>
      </div>
    </div>

    <!-- 扫码组件对话框 -->
    <el-dialog title="请扫描车辆编号二维码" :visible.sync="QRcodeScannerVisible" top="35vh" width="45vh">

      <!-- <div v-if="QRcode.data">扫描结果:{{QRcode.data}}</div>
      <div v-if="QRcode.error">扫描错误:{{QRcode.error}}</div> -->
      <QRcodeScan @getQRcode="getQRcode" v-if="QRcodeScannerVisible"></QRcodeScan>
    </el-dialog>

    <!-- 订单计时计费对话框 -->
    <el-dialog title="订单正在进行ing" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"
      :modal="true" custom-class="time-window" top="32vh" width="85%" center
      :visible.sync="orderState.order_status =='Be_Ing'|| orderState.order_status =='Wait_Pay'">
      <div class="timeWindow-bodys">
        <div class="timer-container">
          {{timerUnits.minutes}}分钟
          {{timerUnits.seconds}}秒
          {{timerUnits.ms}}ms
          <!-- <i style="font-size: 1rem; font-weight: normal;">(计时玩具方便测试,没啥吊用)</i> -->
        </div>
        <!-- 订单完成后展示费用,可用orderObj.order_id来判断 -->
        <div class="order-msg">
          <el-tooltip effect="light" :visible-arrow="false" placement="top">
            <div slot="content" v-html="priceRuls"></div>
            <el-link :underline="false">计费规则(点此查看)</el-link>
          </el-tooltip>
          <span>骑行费用:{{payStatement.cost}}元</span>
          <span>使用时长:{{payStatement.useTime}}分钟</span>
          <span>订单编号:{{orderObj.order_id}}</span>
        </div>
      </div>
      <span slot="footer" class="timeWindow-footer">
        <div v-if="orderState.order_status =='Be_Ing'">
          <el-button @click="closeOrder" type="danger">结束骑行</el-button>
          <el-link icon="el-icon-question" :underline="false">骑行过程有问题?</el-link>
        </div>
        <div v-if="orderState.order_status =='Wait_Pay'">
          <!--支付请求表单,隐藏输入框  -->
          <form action="/goPay" method="post" target="_blank" id="payForm">
            <input type="hidden" name="order_id" :value=orderObj.order_id>
            <input type="hidden" name="amount" :value=orderObj.amount>
          </form>
          <el-button @click="payOrder" type="primary">支付</el-button>
          <el-link icon="el-icon-question" :underline="false" @click="reviewPayOrder()">该订单已支付?点我申诉复查</el-link>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import LocationMap from '../components/LocationMap.vue'
  import QRcodeScan from '../components/QRcodeScan'
  import axios from 'axios'
  import { mapState, mapMutations, mapAction } from 'vuex'  // 简写形式需要引入

  export default {
    name: 'Start',
    components: {
      LocationMap,
      QRcodeScan,
    },
    data() {
      return {
        QRcodeScannerVisible: false, // 二维码扫描对话框的可见性
        QRcode: {  // 扫描二维码的状态
          data: '',
          error: null
        },

        // 定价规则: 计算属性payStatement依赖于这个对象进行计算
        priceObj: {
          start: 2,  // 起步价
          startTime: 5, // 起步价包含时长
          step: 1,    // 超过起步价后的 单位时间单价
          stepTime: 2,  // 超过起步价后的, 计价单位时间 
        },
        // 订单状态数据模型
        orderObj: {
          order_id: '',
          trade_no: '',
          trade_type: '',
          amount: 0.0,
          order_status: '',
          start_time: '',
          end_time: '',
        },

        timer: null,  // 定时器对象
        // 展示区的计时单位
        timerUnits: {
          minutes: 0,
          seconds: 0,
          ms: 0
        },
        operation: '',
        repair: {
          repair_id: '',
          bike_id: '',
          uid: '',
          create_time: '',
          finish_time: ''
        }
      }
    },
  
    mounted() {
      console.log("挂载完毕!!!", this.$store.state.loginUserInfo);
      // 发送请求查询是否未完成的订单状态:
      axios.get('/getUnFinishOrderByUid', {
        params: {
          uid: this.loginUserInfo.uid
        }
      })
        .then((response) => {
          // console.log(response);
          if (response.status == 200 && response.data.code == 1000) {
            // 将未完成的订单状态同步至Vuex
            let res_order = response.data.data
            this.$store.state.orderObj = res_order
            this.orderObj = res_order

            if (res_order.order_status == "Wait_Pay") {
              let hasStarted_time = (new Date(res_order.end_time) - new Date(res_order.start_time)) / 1000 / 60
              hasStarted_time = Math.ceil(hasStarted_time)
              this.timerUnits.minutes = hasStarted_time

              this.payStatement.cost = res_order.amount // 解决刷新会导致支付清单的费用为0 的问题
            }
            else {   // 订单还正在进行
              let hasStarted_time = (new Date() - new Date(res_order.start_time)) / 1000 / 60
              hasStarted_time = Math.ceil(hasStarted_time)
              this.timerUnits.minutes = hasStarted_time
              this.startTimer()  // 开始计时
            }

          }
          else {
            //  重置 计时器
            this.timerUnits.minutes = 0
            this.timerUnits.seconds = 0
            this.ms = 0
          }
        })
        .catch((error) => {
          alert("网络请求失败!")
          console.log(error);
        });
    },

    computed: {
      // 返回用于展示的 计价规则 字符串
      priceRuls() {
        let start = this.priceObj.start
        let startTime = this.priceObj.startTime
        let step = this.priceObj.step
        let stepTime = this.priceObj.stepTime
        let str = `起步价${start}元(${startTime}分钟内)此后<br>超过部分每${stepTime}分钟${step}元,不足${stepTime}分钟按算`
        return str
      },

      // 用于展示 计时计费的清单对象
      payStatement() {
        /*
        有两种计算时长方案: 
          (1) 记录从开锁成功后开启一个计时器,直到点击结束获取计时器的读数  
          (2) 分别获取开锁时和关锁时的时间戳, 随后进行相减
      */
        // 计时方案(1):
        let timerUnits = this.timerUnits
        let useTime = timerUnits.seconds > 0 ? timerUnits.minutes + 1 : timerUnits.minutes // 使用时长 单位(分钟)

        //计时方案(2):  如果点击结束骑行触发,进行最后的计时计算(基于时间戳)
        if (this.orderObj.end_date) { // 如果订单存在结束时间
          let start_timestamp = new Date(this.orderObj.start_time).getTime()
          let end_timestamp = new Date(this.orderObj.end_time).getTime()
          useTime = (end_timestamp - end_timestamp) / 1000 / 60  // 单位(分钟)
          useTime = Math.ceil(useTime);   //分钟数向上取整(即5分钟多一秒按6分钟算)
        }
        // 计价:
        let cost = this.priceObj.start
        /*
         价钱为 如果时长小于起步价时长,则为起步价
                否则为 起步价 + 超过起步时间的那部分时间 / 计价单位时间 (向上取整) 在乘 单位时间单价
        */
        cost = useTime <= this.priceObj.startTime ? cost : cost + Math.ceil((useTime - this.priceObj.startTime) / this.priceObj.stepTime) * this.priceObj.step
        let obj = { useTime, cost }
        return obj
      },

      // Vuex中的订单状态对象映射: 用于控制dom渲染和vc中的data(支付完成时和页面加载时)
      ...mapState({
        orderState: 'orderObj',
        loginUserInfo: 'loginUserInfo'
      }),
    },

    methods: {

      startTimer() {
        this.timer = setInterval(() => {
          this.timerUnits.ms++
          switch (true) {
            case this.timerUnits.ms >= 60: {
              this.timerUnits.ms = 0
              this.timerUnits.seconds += 1
              break
            }
            case this.timerUnits.seconds >= 60: {
              this.timerUnits.seconds = 0
              this.timerUnits.minutes += 1
              break
            }
          }
        }, 1);
      },

      /* 开锁成功计时计费: 
        同时初始化订单数据,并发送到后台
      */
      startOrder(uid, bikeId) {
        let datetime = new Date();
        // 初始化订单数据,
        this.orderObj.order_id = `${uid}-${bikeId}-${new Date().getTime().toString()}` // 订单编号 uid-bik
        this.orderObj.start_time = datetime.toLocaleString().replaceAll('/', '-') // 订单开始时间
        this.orderObj.order_status = 'Be_Ing'

        // 将初始化的订单状态提交到 Vuex
        this.$store.dispatch("submitOrder", this.orderObj)
          .then((isSubmit) => {
            // 如果订单提交没有异常(比如网络请求失败)
            if (isSubmit) {
              // 开始计时, 计时器玩具,不可靠
              this.startTimer()
            }
            else {
              alert("提交订单请求失败!")
            }
          });
      },

      // 用户点击 结束骑行 后触发
      closeOrder() {
        // 停止计时, 关闭定时器
        clearInterval(this.timer)
        let datetime = new Date()
        // 补全初始化订单缺失的数据项: 结束时间, 费用
        this.orderObj.end_time = datetime.toLocaleString().replaceAll('/', '-')
        this.orderObj.amount = this.payStatement.cost
        this.orderObj.order_status = 'Wait_Pay'
        // 修改Vuex的订单数据
        this.$store.dispatch("closeOrder", this.orderObj)
          .then((isAlter) => {
            if (isAlter) {
              // console.log("展示支付按钮...");
            }
            else {
              alert("修改订单数据请求失败!")
            }
          });
      },

      payOrder() {
        document.querySelector("#payForm").submit()
      },

      /* 发送请求判断车辆是否能开锁:
          返回一个对象,属性result为布尔值,当车辆可用时返回true,否则为false; 
          msg属性值:返回车辆状态提示信息
      */
      isUsable(bikeId) {
        return new Promise((resolve) => {
          this.$axios({
            method: 'get',
            url: `/getBikeById/${bikeId}`,
          })
            .then((response) => {
              let bikeInfo = response.data.data  // 根据bikeId查询到的车辆信息,如果车辆信息不存在则为 空
              //  后端返回的查询状态,查询到车辆信息 msg 为 'true', 否则均为 'false'
              if (bikeInfo) {
                // 判断车辆可用条件: 处于无人使用状态 并且电量高于 10
                if (bikeInfo.state == 'unused' && bikeInfo.battery_Capacity > 10) {
                  resolve({ result: true, msg: "满足开锁条件" })
                }
                else {
                  let obj = { result: false, msg: '' }
                  switch (true) {
                    case bikeInfo.state == 'fault': {
                      obj.msg = '车辆存在故障!'
                      break
                    }
                    case bikeInfo.state == 'useing': {
                      obj.msg = '车辆已经被使用!'
                      break
                    }
                    case bikeInfo.battery_Capacity < 10: {
                      obj.msg = '车辆电量不足!'
                      break
                    }
                  }
                  resolve(obj)
                }
              }
              else {
                resolve({ result: false, msg: "车辆不存在!" })
              }
            })
            .catch((error) => {
              console.log("根据bikeId查询车辆信息网络请求失败", error);
            });
        })
      },

      //上报车辆故障功能
      uploadBikeFault(bike_id) {
        this.repair.bike_id = bike_id
        this.repair.uid = this.loginUserInfo.uid
        this.create_time = new Date().toLocaleString().replaceAll('/', '-')

        this.$axios.post('/uploadBikeRepair', this.repair)
          .then((response) => {
            let result = response.data
            let messageType = 'error'
            if (response.status == 200 && result.code == 1000) {
              messageType = 'success'
              this.QRcodeScannerVisible = false
            }
            this.$message({ message: result.msg, type: messageType })
          }).catch((error) => {
            alert("网络请求失败!")
          })
      },

      // 输入编号的回调事件, 根据参数operation执行对应操作
      enterID_Start(operation) {
        // 弹出输入框用于输入车辆id
        this.$prompt('请输入车辆编号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {  // value为输入框输入的车辆id
          switch (operation) {
            // 输入编号开锁启动车辆
            case 'start': {
              this.isUsable(value).then((resObj) => {
                if (resObj.result) {
                  this.startOrder(this.loginUserInfo.uid, value)
                  this.$message({ message: '开锁成功!', type: 'success', duration: 1500 })
                } else {
                  this.$message.error(`开锁失败,${resObj.msg}`);
                }
              })
              break
            }
            // 输入编号申报故障
            case 'upload-bike-fault': {
              this.uploadBikeFault(value)
              break
            }
          }
        }
        );

      },

      // 扫描功能事件函数, 根据参数执行对应操作
      enterQRcode_Start(operation) {
        this.QRcodeScannerVisible = true
        this.operation = operation
      },

      // 组件事件回调函数,当扫描到二维码时触发,扫码组件将传递扫描到数据作为参数传递过来
      getQRcode(QRcode) {
        this.QRcode = QRcode  // 测试时展示识别结果用, QRcode.data 代表扫描到的结果(车辆编号)
        switch (this.operation) {
          case "start": {
            this.isUsable(QRcode.data).then((resObj) => {
              if (resObj.result) {
                this.startOrder(this.loginUserInfo.uid, this.QRcode.data)
                this.$message({ message: '开锁成功!', type: 'success', duration: 1500 })
                this.QRcodeScannerVisible = false
              } else {
                this.$message.error(`开锁失败,${resObj.msg}`);
              }
              this.QRcode = {} // 扫描完毕后清空组件的二维码数据缓存
            });
            break
          }
          case 'upload-bike-fault': {
            this.uploadBikeFault(QRcode.data)
          }
        }

      },

      reviewPayOrder() {
        axios({
          url: '/reviewAliPayOrder',
          method: "post",
          params: {
            "order_id": this.orderObj.order_id
          }
        }
        ).then((response) => {
          let result = response.data
          if (result.code == 1000) {
            this.$message({ message: `${result.msg}`, type: 'success', duration: 1500 })
            this.$router.replace({
              path: '/start',
            })
          }
          else {
            this.$message.error(`${result.msg}`);
          }
        })
          .catch((error) => {
            alert("网络请求失败!")
            console.log(error);
          });
      }

    },
  }
</script>

<style scoped>
  .info {
    z-index: 2;
  }

  .container {
    height: 90vh;
  }

  #map-container {
    height: 60%;
    margin: 0;
  }

  .footer {
    height: 30vh;
    background-color: rgb(222, 235, 231);
    display: flex;

  }

  .footer-left,
  .footer-right {
    background-color: rgb(208, 223, 245);
    width: 50%;
    height: 94%;
    border: 1px slategrey solid;
    border-radius: 10px;
    margin: 8px 8px 8px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center
  }

  .footer-left>*,
  .footer-right>* {
    margin: 12px 18%;
  }

  .timeWindow-footer div {
    display: flex;
    flex-direction: column
  }

  .timeWindow-footer div>* {
    margin: 5px;
  }

  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .order-msg {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 5%;
  }
</style>