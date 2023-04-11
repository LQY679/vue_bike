import Vue from "vue"
import Vuex from "vuex"

// 使用Vuex之前必须先引入Vuex
Vue.use(Vuex)

import axios from 'axios'

const actions = {
    // 此方法, 登陆成功返回 true, 登陆失败(用户名,密码,用户类型输入有误)返回false 
    /*
        async 方法会默认返回一个 Promise对象, 可以通过 await 关键字 进行同步等待发送
        同步请求
     */
    async login(context, userInfo) {
         let response = await axios({
            method: 'post',
            url: "/login",
            data: userInfo
        }).catch(function (error) {
            alert("登陆网络请求失败!")
            console.log(error);
        });

        let result = response.data 
        if (response.status &&result.code == 1000) {   // 登陆成功
            context.commit('LOGIN', result.data.userInfo)
        }
        // console.log("更新用户信息成功!");
        return result
    },

    // 当开始骑行时调用,提交订单请求(插入一条订单数据对象) , 成功返回 true, 失败返回false
    submitOrder(context, orderObj) {
        return new Promise((resolve) => {
            // console.log("发送请求插入订单数据...", orderObj);
            axios.post('/createOrder', orderObj)
                .then(function (response) {
                    if (response.status == 200 && response.data.code == 1000) {
                        context.commit("SUBMIT_ORDER", orderObj)
                        resolve(true)
                    }
                    else {
                        console.log("创建订单请求失败!", response);
                        resolve(false)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    resolve(false)
                });

        })
    },

    // 当结束骑行后调用,修改订单状态
    closeOrder(context, orderObj) {
        return new Promise((resolve) => {
            // console.log("发送请求修改订单状态...", orderObj);
            axios.post('/stopOrder', orderObj)
                .then(function (response) {
                    if (response.status == 200 && response.data.code == 1000) {
                        context.commit("SUBMIT_ORDER", orderObj)
                        resolve(true)
                    }
                    else {
                        console.log("停止订单请求失败!", response);
                        resolve(false)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    resolve(false)
                });
        })
    }
}

const mutations = {
    // 将登陆状态信息保存到State中
    LOGIN(state, userInfo) {
        state.loginUserInfo = userInfo
        // state.sessionID = resData.sessionID
        state.isLogin = true
    },
    // 注销登陆: 将登陆状态数据置空
    LOGOUT(state) {
        state.loginUserInfo = {}
        state.isLogin = false
    },

    // 保存订单状态
    SUBMIT_ORDER(state, orderObj) {
        state.orderObj = orderObj
    },

    // 支付成功将订单状态清空
    CLEAR_ORDER(state) {
        state.orderObj = {
            order_id: '',
            uid: '',
            start_date: '',
            end_date: '',
            cost: 0.0,
            order_state: ''
        }
    }
}


const state = {
    // 登陆状态数据: 若登陆成功, 将SessionID 保存到 SessionStorage中,并且将 State中的loginState 设置为 true
    // sessionID: '',  // 用于与后端校验控制状态
    isLogin: false,   // 用于控制 "登陆" "注销" "用户名"相关dom的渲染 
    loginUserInfo: {   // 用户在头部导航条展示用户信息, 并且当前登陆的用户type属性还用于控制MyHeader是否渲染
        uid: '',
        pwd: '',
        type: '',
        email: ''
    },

    orderObj: {
        order_id: '',
        trade_no: '',
        trade_type: '',
        amount: 0.0,
        order_status: '',
        start_time: '',
        end_time: '',
    },
}

export default new Vuex.Store({
    actions,
    mutations,
    state
})