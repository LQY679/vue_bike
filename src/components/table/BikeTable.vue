<template>
    <div id="root">
        <!-- 车辆管理列表 -->
        <el-table height="88vh" style="width: 100%" :stripe="true" :border="true" v-loading="loading"
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
            this.$axios.get('/getAllBike')
                .then((response) => {
                    let result = response.data
                    if (response.status == 200 && result.code == 1000) {
                        this.BikeList = result.data
                    }
                    else{
                        this.$message({ message: result.msg, type: 'waring' })
                    }
                    this.loading = false
                }).catch((error) => {
                    alert("网络请求失败!")
                    console.log(error);
                })
        },
        data() {
            return {
                loading: true,
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