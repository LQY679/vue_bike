<template>
    <div id="root">
        <!-- 用户管理列表 -->
        <el-table height="88vh" style="width: 100%" :stripe="true" :border="true" ref="table"
            :data="userList.filter(data => !search || data.uid.includes(search))">
            <el-table-column label="用户名" prop="uid">
            </el-table-column>

            <el-table-column label="密码" prop="pwd">
            </el-table-column>

            <el-table-column label="用户类型" prop="type">
            </el-table-column>

            <el-table-column label="绑定邮箱" prop="email">
            </el-table-column>

            <el-table-column>
                <template slot="header" slot-scope="scope" ref="searchBox">
                    <el-input v-model="search" size="mini" placeholder="输入用户名搜索" />
                </template>

                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        Delete
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 用户 编辑按钮 的对话框表单 -->
        <el-dialog title="请填写修改信息" center :visible.sync="isShowForm">
            <el-form :model="userForm">
                <!-- 编辑用户信息的输入框 -->
                <template>
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                        <el-input :value="userForm.uid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth">
                        <el-input v-model="userForm.pwd" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" :label-width="formLabelWidth">
                        <el-select v-model="userForm.type" placeholder="请选择用户类型" :disabled="userForm.type=='admin'">
                            <el-option label="管理员" value="admin"></el-option>
                            <el-option label="普通用户" value="user"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input v-model="userForm.email"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowForm = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'UserTable',

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

            this.$axios.get('/getAllUser')
                .then((response) => {
                    let result = response.data
                    if (response.status == 200 && result.code == 1000) {
                        this.userList = result.data
                        setTimeout(()=>{
                            loading.close();  // 关闭等待
                        },500)
                    }
                    else {
                        this.$message({ message: '用户信息列表获取失败!', type: 'waring' })
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
                userList: [],
                isShowForm: false,
                userForm: {
                    uid: '',
                    pwd: '',
                    type: '',
                    email: ''
                },
            }
        },
        methods: {

            deleteWaring(index, uid) {
                this.$confirm(`是否永久删除用户:${uid}`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sendDelteRequest(index, uid)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            sendDelteRequest(index, uid) {
                this.$axios.get(`/deleteUser/${uid}`)
                    .then((response) => {
                        let result = response.data
                        let messageType = 'error'
                        if (response.status == 200 && result.code == 1000) {
                            messageType = 'success'
                            this.userList.splice(index,1)
                        }
                        this.$message({ message: result.msg, type: messageType })
                    }).catch((error) => {
                        alert("网络请求失败!")
                        console.log(error);
                    })
                    
            },

            handleDelete(index, selectObj) {
                this.deleteWaring(index, selectObj.uid)
            },

            handleEdit(index, selectObj) {
                // 将选中的数据对象浅拷贝给 表单对象
                this.userForm = Object.assign({}, selectObj)  
                this.isShowForm = true
            },

            submitForm() {
                this.$axios({
                    method: 'put',
                    url: '/updateUser',
                    data: this.userForm
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

            dialogColse(){
                console.log("关闭对话框的回调!");
                this.userForm = this.userList[this.index]
            },

        }
    }
</script>

<style>

</style>