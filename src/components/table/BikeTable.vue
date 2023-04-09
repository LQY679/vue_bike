<template>
    <div id="root">
        <!-- 车辆管理列表 -->
        <el-table height="88vh" style="width: 100%" :stripe="true" :border="true" ref="table"
            :data="BikeList.filter(data => !search || data.id.includes(search))">
            <el-table-column label="车辆编号" prop="id">
            </el-table-column>

            <el-table-column label="电量" prop="battery_Capacity">
            </el-table-column>

            <el-table-column label="状态" prop="state">
            </el-table-column>

            <el-table-column label="定位" prop="position">
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
        name: 'BikeTable',

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

            this.$axios.get('/getAllBike')
                .then((response) => {
                    let result = response.data
                    if (response.status == 200 && result.code == 1000) {
                        this.BikeList = result.data
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
                isLoaded: false,   // 加载动画判断标志,用户列表或车辆列表加载成功为true
                formLabelWidth: '70px',
                search: '',
                BikeList: [],
                isShowForm: false,
                BikeForm: {
                    id: '',
                    battery_Capacity: '',
                    state: '',
                    position: ''
                },
            }
        },
        methods: {

            deleteWaring(index, id) {
                this.$confirm(`是否永久删除车辆:${id}`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sendDelteRequest(index, id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            sendDelteRequest(index, id) {
                this.$axios.get(`/deleteBike/${id}`)
                    .then((response) => {
                        let result = response.data
                        let messageType = 'error'
                        if (response.status == 200 && result.code == 1000) {
                            messageType = 'success'
                            this.BikeList.splice(index,1)
                        }
                        this.$message({ message: result.msg, type: messageType })
                    }).catch((error) => {
                        alert("网络请求失败!")
                        console.log(error);
                    })
                    
            },

            handleDelete(index, selectObj) {
                this.deleteWaring(index, selectObj.id)
            },
        }
    }
</script>

<style>

</style>