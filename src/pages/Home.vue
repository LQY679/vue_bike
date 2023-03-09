<template>
  <div>
    <div id="videoContainer">
          <!-- 静音属性 muted -->
      <div class="videoMsg">骑行共赴未来<br>
        &emsp; &emsp;小罗与你相伴
      </div>
      <video src="../assets/index.mp4" autoplay="true" loop="true" muted="true"></video>
    </div>    
  </div>
    
</template>

<script>

export default {
  name: 'Home',
}


</script>

<style scoped>
  #videoContainer {
    height: 100vh;
    position: relative;
  }

  .videoMsg {
    font-weight: bold;
    color: #F15B49;
    font-size: 3rem;
  
    position: absolute;
    top: 26%;
    left: 4%;
  }

  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  
</style>
