<template>
  <div id="root">
    <h4 style="text-align: center;">基本信息</h4>
    <el-descriptions class="margin-top" title="" direction="vertical"  :column="3" border style="text-align: center;">
      <el-descriptions-item label="用户名">
        <template slot="label">
          <i class="el-icon-user"></i>
          用户名
        </template>
        <el-tag size="small">u100010100</el-tag>
      </el-descriptions-item>

      <el-descriptions-item label="密码">
        <template slot="label">
          <i class="el-icon-user"></i>
          显示密码<input type="checkbox" name="" id="">
        </template>
        <el-tag size="small">********</el-tag> &nbsp;&nbsp;&nbsp;修改密码
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
      </el-descriptions-item>

      <el-descriptions-item label="电子邮箱">
        <template slot="label">
          <i class="el-icon-user"></i>
          电子邮箱
        </template>
        <el-tag size="small">xxxx@xxxx.com</el-tag>  &nbsp;&nbsp;&nbsp;修改绑定邮箱
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
      </el-descriptions-item>
    </el-descriptions>

    <h4 style="text-align: center;">骑行数据</h4>
    <div class="data-table">
      <el-table :data="orderList" max-height="300" border style="width: 100%">
        <el-table-column prop="order_id" label="骑行订单编号" width="180">
        </el-table-column>
        
        <el-table-column prop="start_time" label="骑行开始时间">
        </el-table-column>

        <el-table-column prop="order_time" label="骑行时长(分钟)">
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
    data(){
      return {
        orderList:[
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
          {
            order_id: 'u1001-b1001-1677466478843',
            start_time: '2023-02-27 10:54:52',
            order_time: 40,
            amount: 10,
          },
        ]
      }
    },

  }
</script>

<style scoped>
  #root {
    padding: 10px;
  }

  .block-container{
    display: flex;
    justify-content: center;
  }
  .block-container > div{
    margin: auto;
  }
</style>