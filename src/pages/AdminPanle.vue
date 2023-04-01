<template>
    <el-container id="container">
        <el-header>
            <div>
                <img src="../assets/img/login_logo.png" alt="">
                <span>管理面板</span>
            </div>
            <div>
                <span>管理员:{{loginUserInfo.uid}}</span> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                <el-button @click="logout" type="info" plain size="mini">退出登陆</el-button>
            </div>

        </el-header>

        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <!-- 左侧导航栏 -->
                <el-menu :default-openeds="['1', '3']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-user-solid"></i>用户信息管理</template>
                        <el-menu-item @click="switchTable('userTable')" index="1-1">用户信息列表</el-menu-item>
                    </el-submenu>
                    </el-submenu>

                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-bicycle"></i>车辆信息管理</template>
                        <el-menu-item @click="switchTable('bikeTable')" index="2-1">车辆信息列表</el-menu-item>
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-shopping-cart-1"></i>工单管理</template>
                        <el-menu-item @click="switchTable('ridingOrderTable')" index="3-1">骑行订单列表</el-menu-item>
                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title"><i class="el-icon-map-location"></i>服务区管理</template>
                        <el-menu-item @click="" index="4-1">列表1</el-menu-item>
                    </el-submenu>


                </el-menu>
            </el-aside>

            <el-main>
                <!-- 用户管理列表 -->
                <el-table v-if="checkTableType === 'userTable'" height="100%" style="width: 100%" :stripe="true" :border="true"
                    ref="table"
                    :data="userInfos.filter(data => !search || data.uid.includes(search))">
                    <el-table-column label="用户名" prop="uid">
                    </el-table-column>

                    <el-table-column label="密码" prop="pwd">
                    </el-table-column>

                    <el-table-column label="用户类型" prop="type">
                    </el-table-column>

                    <el-table-column>
                        <template slot="header" slot-scope="scope" ref="searchBox">
                            <el-input v-model="search" size="mini" placeholder="输入用户名搜索" />
                        </template>

                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row,'user')">Edit</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row,'user')">
                                Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 用户 编辑按钮 的对话框表单 -->
                <el-dialog title="请填写修改信息" :visible.sync="dialogFormVisible">
                    <el-form :model="formData">
                        <!-- 编辑用户信息的输入框 -->
                        <template>
                            <el-form-item label="用户名" :label-width="formLabelWidth">
                                <el-input :value="formData.user.uid" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" :label-width="formLabelWidth">
                                <el-input v-model="formData.user.pwd" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="用户类型" :label-width="formLabelWidth">
                                <el-select v-model="formData.user.type"
                                    :disabled="userInfos[selectedIndex].type === 'admin'" placeholder="请选择用户类型">
                                    <el-option label="管理员" value="admin"></el-option>
                                    <el-option label="普通用户" value="user"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitDialogForm">确 定</el-button>
                    </div>
                </el-dialog>

                <!-- 车辆列表 -->
                <el-table v-if="checkTableType === 'bikeTable'" height="100%" style="width: 100%" :stripe="true" :border="true" 
                    ref="table"    
                    :data="bikeInfos.filter(data => !search || data.id.includes(search))" >
                    <el-table-column label="车辆编号" prop="id" />
                    
                    <el-table-column label="车辆电量" prop="battery_Capacity" />

                    <el-table-column label="车辆状态" prop="state" />

                    <el-table-column label="所处位置" prop="position"/>

                    <el-table-column >
                        <template  slot="header" slot-scope="scope" ref="searchBox">
                            <el-input v-if="checkTableType === 'bikeTable'" v-model="search" size="mini" placeholder="输入车辆编号搜索" />
                            <!-- 解决 渲染缓存问题 -->
                            <span v-else>订单状态</span>
                        </template>

                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row,'bike')">
                                Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 骑行订单列表 -->
                <el-table v-if="checkTableType === 'ridingOrderTable'" height="100%" style="width: 100%" :stripe="true" :border="true"
                    size="mini" ref="table"
                    :data="ridingOrderList.filter(data => !search || data.order_id.includes(search))">
                    <el-table-column label="订单编号" prop="order_id" />

                    <el-table-column label="第三方交易号" prop="trade_no" />

                    <el-table-column label="交易类型" prop="trade_type" />

                    <el-table-column label="交易金额" prop="amount" />

                    <el-table-column label="订单状态" prop="order_status" />

                    <el-table-column label="订单创建时间" prop="start_time" />

                    <el-table-column label="订单完成时间" prop="end_time" />

                    <el-table-column>
                        <template slot="header" slot-scope="scope" >
                            <el-input v-model="search" size="mini" placeholder="输入骑行订单编号搜索" />
                        </template>

                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row,'ridingOrder')">
                                Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>

        </el-container>

    </el-container>
</template>

<script>
    export default {
        name: 'AdminPanle',
        mounted() {
            // 加载等待...
            const loading = this.$loading({
                lock: true,
                text: '尊敬的大爹类型用户管理员,正在加载中ing请耐心等待...'
                    + '或者您掏钱优化立马嘎嘎变快',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.9)'
            });

            // 可以设置加载得慢一点,用来骗用户优化性能,哈哈哈哈哈
            setTimeout(() => {
                if (this.isLoaded) {
                    loading.close();
                }
            }, 1300);
            this.getAllUser();
        },
        
        beforeUpdate(){
            
        },

        data() {
            return {
                isLoaded: false,   // 加载动画判断标志,用户列表或车辆列表加载成功为true
                checkTableType: 'userTable',
                search: '',
                selectedIndex: 0,
                userInfos: [ // 死数据
                    {
                        uid: '1000',
                        pwd: '0000',
                        type: 'user'
                    }
                ],
                bikeInfos: [
                    {
                        id: '1000',
                        batteryCapacity: 100,  //电池电量
                        state: 'useing',           // useing, unuesed, fault : 正在使用,未被使用, 故障
                        position: '暂不支持'
                    },

                ],

                ridingOrderList: [
                    {
                        order_id: "",
                        trade_no: "",
                        trade_type: "",
                        amount: 0,
                        order_status: "",
                        start_time: "",
                        end_time: ""
                    },
                ],

                dialogFormVisible: false,  // 对话框表单可见性
                formData: {
                    user: {               //  选中的用户对象结构       
                    },
                    bike: {               // 选中的车辆对象结构
                    }
                },
                formLabelWidth: '120px'
            }
        },
        methods: {
            // 发送请求获取用户列表
            getAllUser() {
                this.$axios.get('/getAllUser')
                .then((response) => {
                    let jsonDate = response.data
                    // console.log('getAllUser请求:',response.data);
                    if (jsonDate.msg == 'true') {
                        this.userInfos = jsonDate.data
                        this.isLoaded = true
                    } else {
                        this.$message.error('用户列表信息加载失败');
                    }

                })
                .catch((error) => {
                    alert("网络请求失败!")
                    console.log('getAllUser请求:', error);
                });
            },

            // 发送请求获取车辆信息
            getAllBike() {
                this.$axios.get('/getAllBike')
                .then((response) => {
                    let jsonDate = response.data
                    // console.log('getAllBike请求:',response.data);
                    if (jsonDate.msg == 'true') {
                        this.bikeInfos = jsonDate.data
                        this.isLoaded = true
                    } else {
                        this.$message.error('车辆信息列表加载失败');
                    }
                })
                .catch((error) => {
                    alert("网络请求有错误!")
                    console.log('getAllBike请求:', error);
                });
            },

            getAllRidingOrder(){
                this.$axios.get('/getAllOrder')
                    .then((response) => {
                        let result = response.data 
                        if (result.code == 1000) {
                            this.ridingOrderList = result.data
                            this.isLoaded = true
                        } else {
                            this.$message.error(result.msg);
                        }
                    })
                    .catch((error) => {
                        alert("网络请求有错误!")
                        console.log('getAllOrder请求:', error);
                    });
            },


            switchTable(checkTableType) {  //用于切换展示列表
                this.checkTableType = checkTableType
                switch (checkTableType) {
                    case 'bikeTable': {
                        // console.log("点击车辆列表",this.checkTableType);
                        this.getAllBike();
                        break
                    }
                    case 'ridingOrderTable': {
                        this.getAllRidingOrder();
                        break
                    }
                }
            },

            handleEdit(index, row, handleType) {
                this.selectedIndex = index
                this.dialogFormVisible = true
                switch (handleType) {
                    case 'user': {
                        // 表单数据为被选中的数据
                        this.formData.user = {
                            uid: this.userInfos[index].uid,
                            pwd: this.userInfos[index].pwd,
                            type: this.userInfos[index].type
                        }
                        break
                    }
                    case 'bike': {
                        // .... 暂未开发
                        break
                    }
                    case 'ridingOrder': {
                        break
                    }
                }
            },

            //  提交了对话框表单后
            submitDialogForm(selectType) {
                switch (selectType) {
                    // 当提交的表单是 user 类型
                    case 'user': {
                        // 发送修改请求
                        this.$axios({
                            method: 'put',
                            url: '/updateUser',
                            data: {
                                uid: this.formData.user.uid,
                                pwd: this.formData.user.pwd,
                                type: this.formData.user.type
                            }
                        }).then((response) => {
                            let jsonDate = response.data
                            if (jsonDate.msg == 'true') {   //提交成功!
                                this.userInfos[this.selectedIndex] = this.formData.user
                                this.$message({ message: '修改成功', type: 'success', });
                                this.dialogFormVisible = false  // 关闭弹窗表单
                            } else {
                                this.$message.error('提交失败,请检查后重试!');
                            }
                        }).catch((error) => {
                            alert("网络请求失败!")
                            console.log("updateUser请求失败:", error);
                        });
                    }
                }

            },

            // 根据handleType参数 执行对应类型列表的删除操作
            handleDelete(index, row, handleType) {
                switch (handleType) {
                    case 'user': {
                        this.$confirm(`是否删除用户:${this.userInfos[index].uid}`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$axios({
                                method: 'delete',
                                url: `/deleteUser/${this.userInfos[index].uid}`,
                            })
                                .then((response) => {
                                    let return_data = response.data
                                    if (return_data.msg == 'true') {
                                        this.$message({ type: 'success', message: '删除成功!' });
                                        this.userInfos.splice(index, 1)   // 删除组件中的 数组元素
                                    }
                                    else {
                                        this.$message.error('删除失败,请检查刷新后重试!');
                                        console.log(return_data.msg);
                                    }
                                })
                                .catch((error) => {
                                    alert("网络请求失败!")
                                    console.log("删除用户请求失败", error);
                                });
                        }).catch(() => {
                            this.$message({ type: 'info', message: '已取消删除' });
                        });
                        break
                    }
                    case 'bike': {
                        this.$confirm(`是否删除车辆:${this.bikeInfos[index].id}`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$axios({
                                method: 'delete',
                                url: `/deleteBike/${this.bikeInfos[index].id}`,
                            })
                                .then((response) => {
                                    let return_data = response.data
                                    if (return_data.msg == 'true') {
                                        this.$message({ type: 'success', message: '删除成功!' });
                                        this.bikeInfos.splice(index, 1)   // 删除组件中的 数组元素
                                    }
                                    else {
                                        this.$message.error('删除失败,请检查刷新后重试!');
                                        console.log(return_data.msg);
                                    }
                                })
                                .catch((error) => {
                                    alert("网络请求失败!")
                                    console.log("删除车辆请求失败", error);
                                });
                        }).catch((error) => {
                            this.$message({ type: 'info', message: '已取消删除' });
                        });
                        break
                    }
                    case 'ridingOrder': {
                        this.$confirm(`是否删除订单:${this.ridingOrderList[index].order_id}`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$axios({
                                method: 'get',
                                url: `/deleteBike/${this.ridingOrderList[index].order_id}`,
                            })
                            .then((response) => {
                                let result= response.data
                                if (result.code == 1000) {
                                    this.$message({ type: 'success', message: '删除成功!' });
                                    this.ridingOrderList.splice(index, 1)   // 删除组件中的 数组元素
                                }
                                else {
                                    this.$message.error(result.msg);
                                }
                            })
                            .catch((error) => {
                                alert("网络请求失败!")
                                console.log("删除订单网络请求失败!", error);
                            });
                        }).catch((error) => {
                            this.$message({ type: 'info', message: '已取消删除' });
                        });
                        break
                    }
                }
            },

            // 注销功能
            logout() {
                this.$confirm('此操作会退出登陆状态, 是否继续?', '提示', {
                    confirmButtonText: '确定注销',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({ type: 'success', message: '删除成功!' });
                    this.$store.commit("LOGOUT");
                    // 注销后回到首页
                    this.$router.replace({ path: '/home' })
                }).catch(() => {
                    this.$message({ type: 'info', message: '已取消删除' });
                });
            }

        },
        computed: {
            loginUserInfo() {
                return this.$store.state.loginUserInfo
            }
        }
    }
</script>

<style scoped>
    #container {
        height: 100vh;
    }

    .el-header {
        background-color: rgb(241, 91, 73);
        display: flex;
        justify-content: space-between;
        padding: 0;
        align-items: center;
        color: white;
    }

    .el-header img {
        width: 10%;
    }

    .el-header div {
        display: flex;
        align-items: center;
    }

    .el-aside {
        background-color: rgb(63, 89, 86);
    }

    .el-main {
        background-color: rgb(206, 226, 233);
        padding: 10px;
    }

    .el-table {
        border-radius: 5px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>