import axios from "axios"

import { getCookie } from '../tool/toolFunction'



// 创建实例
let axiosService = axios.create({
    // baseURL: 'localhost:8081',
    withCredentials: true,
    timeout: 15000  // 毫秒
})

//请求拦截器
axiosService.interceptors.request.use((config) => {
    // 在发送请求前要做的事儿
    if (getCookie('token')) {
        // 如果后台要token, 自定义一个http 请求头字段token
        // 从cookie中拿token, 因为登陆成功后后台会往cookie中 放 token
        config.headers.token = getCookie('token')
        config.headers.Cookie = document.cookie
        // 如果后台要Authorization 这么写：config.headers.Authorization = `Bearer ` + localStorage.getItem('token')
      }    
    return config;
},
    (err) => {
        // 请求错误拦截处理...
    }
);

export default axiosService;