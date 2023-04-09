<template>
    <div id="root">
        <!-- 订单管理列表 -->
        <el-table height="88vh" style="width: 100%" :stripe="true" :border="true" ref="table"
            :data="orderList.filter(data => !search || data.order_id.includes(search))">
            <el-table-column label="订单编号" prop="order_id">
            </el-table-column>

            <el-table-column label="第三方交易号" prop="trade_no">
            </el-table-column>

            <el-table-column label="交易类型" prop="trade_type">
            </el-table-column>

            <el-table-column label="金额(元)" prop="amount">
            </el-table-column>

            <el-table-column label="订单状态" prop="order_status">
            </el-table-column>

            <el-table-column label="创建时间" prop="start_time">
            </el-table-column>

            <el-table-column label="结束时间" prop="end_time">
            </el-table-column>

            <el-table-column>
                <template slot="header" slot-scope="scope" ref="searchBox">
                    <el-input v-model="search" size="mini" placeholder="输入车辆编号搜索" />
                </template>

                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        Delete
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

       
    </div>
</template>

<script>

    export default {
        name: 'OrderTable',

        mounted() {
            // 加载等待...
            const loading = this.$loading({
                lock: true,
                text: '尊敬的大爹类型用户管理员,正在加载中ing请耐心等待...'
                    + '或者您掏钱优化立马嘎嘎变快',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.9)'
            });
            setTimeout(()=>{loading.close()}, 5000);  // 5秒后还没得到响应数据, 则超时关闭加载界面

            this.$axios.get('/getAllOrder')
                .then((response) => {
                    let result = response.data
                    if (response.status == 200 && result.code == 1000) {
                        this.orderList = result.data
                        setTimeout(()=>{
                            loading.close();  // 关闭等待
                        },500)
                    }
                    else{
                        this.$message({ message: result.msg, type: 'waring' })
                    }
                    
                }).catch((error) => {
                    alert("网络请求失败!")
                    console.log(error);
                })
        },
        data() {
            return {
                formLabelWidth: '70px',
                search: '',
                orderList: [],
                isShowForm: false,
                OrderForm: {
                    order_id: '',
                    trade_no: '',
                    trade_type: '',
                    amount: 0,
                    order_status: '',
                    start_time: '',
                    end_time: ''
                },
            }
        },
        methods: {

            deleteWaring(index, order_id) {
                this.$confirm(`是否永久删除订单:${order_id}`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sendDelteRequest(index, order_id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            sendDelteRequest(index, order_id) {
                this.$axios.get(`/deleteOrder/${order_id}`)
                    .then((response) => {
                        let result = response.data
                        let messageType = 'error'
                        if (response.status == 200 && result.code == 1000) {
                            messageType = 'success'
                            this.orderList.splice(index,1)
                        }
                        this.$message({ message: result.msg, type: messageType })
                    }).catch((error) => {
                        alert("网络请求失败!")
                        console.log(error);
                    })
                    
            },

            handleDelete(index, selectObj) {
                this.deleteWaring(index, selectObj.order_id)
            },
        }
    }
</script>

<style>

</style>