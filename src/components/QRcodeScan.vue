<template>
    <div>
      <!-- qrcode-stream扫描框组件说明:
            track属性: 值为一个函数:用于绘制追踪二维码位置样式
            camera属性: 值为:auto(默认),off,  设置相机的开启和关闭状态(相当于快门键)
            decode事件: 绑定一个回调函数,该回调函数的参数是扫描成功的二维码数据
      -->
      <slot name="QRcodeResult" :QRcode="QRCode"></slot>
      <qrcode-stream 
       :track="trackFunction"
       :camera="camera"
       @decode="setQRcodeData" 
       @init="onInit">
          <!-- 扫描成功加载界面 -->
          <div v-show="isScanned" class="scanned-loading">
              <img id="myIcoon" src="../assets/img/myIcoon.jpg">
              <h4 id="load-msg">神里家大小姐提醒你,扫码成功了哦~</h4>
              <img id="center-Icon" src="../assets/img/凌华奶茶.jpg" alt="">
              <img id="right-bottom-Icon" src="../assets/img/凌华可爱蹲.jpg">
          </div>
      </qrcode-stream>
    </div> 
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader' 

export default {
  name: 'QRcodeScan',
  components: { QrcodeStream },
  data () {
   return{
    isScanned: false,
    camera: 'auto',
    QRCode:{
      data:'', //二维码扫描结果
      error: ''  // 扫描失败
    },
   } 
  },

  methods: {
    async setQRcodeData(data){
      this.QRCode.data = data
      // console.log('识别到二维码...',this.QRCode);
      /*
        说明: 当有父组件给此组件绑定了名为getQRcode的组件事件时,
        捕获到二维码信息就会触发该事件:发送捕获到的二维码数据,包括错误信息
      */
      this.$emit("getQRcode",this.QRCode)

      this.camera = 'off'  // 暂停扫描
      await setTimeout(()=>{   //同步等待实现 扫描间隔
        this.camera = 'auto'
      },1500)
       
    },
    // 追踪功能绘制
    trackFunction (detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [ firstPoint, ...otherPoints ] = detectedCode.cornerPoints
        // 追踪框样式
        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
      }
    },

    // 报错日志
    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.QRCode.error = "ERROR: you need to grant camera access permission"
        } else if (error.name === 'NotFoundError') {
          this.QRCode.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.QRCode.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.QRCode.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.QRCode.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.QRCode.error = "ERROR: Stream API is not supported in this browser"
        } else if (error.name === 'InsecureContextError') {
          this.QRCode.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
        } else {
          this.QRCode.error = `ERROR: Camera error (${error.name})`;
        }
        console.log('调用相机模组出现错误:',this.QRCode.error);
      } finally {
        this.isScanned = this.camera === "off" 
      }
    },
  }
 
}
</script>

<style scoped>
  .scanned-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}

  #load-msg{
    position: absolute;
    left: 10%;
    top: 6%;
    color: red;
    font-weight: bold;
  }

  #myIcoon{
    width: 8%;
    position: absolute;
    top: 0;
    left: 0;
  }

  #center-Icon{
    width: 34%;
    position: absolute;
    top: 33%;
    left: 33%;
  }

  #right-bottom-Icon{
    width: 26%;
    position: absolute;
    right: 0;
    bottom: 0;
  }
</style>
