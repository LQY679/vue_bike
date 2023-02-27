<template>
        <!-- 地图容器,依赖于js渲染 -->
        <div id="map-container">
        </div>
      
</template>

<script>

export default {
  name: 'LocationMap',

  mounted() {
    var map = new AMap.Map('map-container', {
        zoom: 20,    //地图级别
        viewMode:'3D'//使用3D视图
    })
    // 配置订单插件
    AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 20000,          //超过10秒后停止定位，默认：5s
            buttonPosition:'RB',    //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(0, 0),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status,result){
            // 判断是否定位成功
            if(status=='complete'){  
                // console.log('定位成功:',{
                //   '定位结果': result.position,
                //   '定位类型': result.location_type,
                //   '精度(米)': result.accuracy,
                //   '是否偏移': result.isConverted
                // });
            }else{
                console.log('定位失败:',{
                  '错误信息': result.message
                });
            }
        });
    });
  },
}
</script>

<style scoped>

</style>
