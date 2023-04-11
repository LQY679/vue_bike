<template>
    <div id="root">
        <el-table height="88vh" style="width: 100%" :stripe="true" :border="true" ref="table"
            :data="repairList.filter(data => !search || data.repair_id.includes(search))">
            <el-table-column label="维修工单号" prop="repair_id">
            </el-table-column>

            <el-table-column label="车辆编号" prop="bike_id">
            </el-table-column>

            <el-table-column label="上报用户" prop="uid">
            </el-table-column>

            <el-table-column label="上报时间" prop="create_time">
            </el-table-column>

            <el-table-column label="处理完成时间" prop="finish_time">
            </el-table-column>

            <el-table-column>
                <template slot="header" slot-scope="scope" ref="searchBox">
                    <el-input v-model="search" size="mini" placeholder="输入工单序号搜索" />
                </template>

                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="handleEdit(scope.$index, scope.row)">处理工单</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="请填写工单处理时间" center :visible.sync="isShowForm">
            <el-form :model="repairForm">
                <template>
                    <el-form-item label="工单编号" :label-width="formLabelWidth">
                        <el-input :value="repairForm.repair_id" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="故障车辆编号" :label-width="formLabelWidth">
                        <el-input :value="repairForm.bike_id" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="上报用户" :label-width="formLabelWidth">
                        <el-input :value="repairForm.bike_id" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="处理时间" :label-width="formLabelWidth">
                        <el-date-picker v-model="repairForm.finish_time" type="datetime" placeholder="选择日期时间" align="right"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="上报时间" :label-width="formLabelWidth">
                        <el-input :value="repairForm.create_time" disabled></el-input>
                    </el-form-item>

                    

                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowForm = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确定提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'RepairTable',

        mounted() {
            this.$axios.get('/getAllBikeRepair')
                .then((response) => {
                    let result = response.data
                    if (response.status == 200 && result.code == 1000) {
                        this.repairList = result.data
                    }
                    else {
                        this.$message({ message: result.msg, tyrepair_idpe: 'waring' })
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
                formLabelWidth: '100px',
                search: '',
                repairList: [],
                isShowForm: false,
                repairForm: {
                    repair_id: '',
                    bike_id: '',
                    uid: '',
                    create_time: '',
                    finish_time: ''
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },]
                },
            }
        },
        methods: {
            handleEdit(index, selectObj) {
                // 将选中的数据对象浅拷贝给 表单对象
                this.repairForm = Object.assign({}, selectObj)  
                this.isShowForm = true
            },

            submitForm() {
                
                // ElementUI 时间选择器的值是 Date对象,需要转换一下格式
                let strFormar_finish_time = this.repairForm.finish_time.toLocaleString().replaceAll('/', '-')
                this.repairForm.finish_time = strFormar_finish_time
                this.$axios({
                    method: 'post',
                    url: '/editBikeRepair',
                    data: this.repairForm
                }).then((response) => {
                    let result = response.data
                    let messageType = 'error'
                    if (response.status == 200 && result.code == 1000) {
                        messageType = 'success'
                        this.isShowForm = false
                    }
                    this.$message({ message: result.msg, type: messageType })
                }).catch((error) => {
                    alert("网络请求失败!")
                    console.log(error);
                })
            },

        }
    }
</script>

<style>

</style>