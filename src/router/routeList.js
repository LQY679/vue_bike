//引入页面组件
import AdminPanle from '../pages/AdminPanle.vue'
import About from '../pages/About'
import Home from '../pages/Home'
import Start from '../pages/Start'
import UserCenter from '../pages/UserCenter'
import MobileUserLogin from '../pages/MobileUserLogin'
import PublicInformation from '../pages/PublicInformation'

import UserTable from '@/components/table/UserTable'
import BikeTable from '@/components/table/BikeTable'
import OrderTable from '@/components/table/OrderTable'
import RepairTable from '@/components/table/RepairTable'

export default [
    // {
    //     path: "/", redirect: "/home"
    // },
    {
        name: "mobileLogin",
        path: "/login",
        component: MobileUserLogin,
        meta: { titel: "登陆", isAuth: false }  // titel: 页面标题 , isAuth: 布尔值, 判断该路由是否需要登陆授权后才能进入
    },
    {
        path: '/adminPanle',
        name: 'adminPanle',
        component: AdminPanle,
        meta: { titel: "管理面板", isAuth: true },
        children: [
            {
                path: 'userTable',
                component: UserTable,
                meta: { titel: "用户信息列表", isAuth: true },
            },
            {
                path: 'bikeTable',
                component: BikeTable,
                meta: { titel: "车辆信息列表", isAuth: true },
            },
            {
                path: 'orderTable',
                component: OrderTable,
                meta: { titel: "骑行订单信息列表", isAuth: true },
            },
            {
                path: 'repairTable',
                component: RepairTable,
                meta: { titel: "车辆维修工单列表", isAuth: true },
            }
        ]
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: { titel: "关于", isAuth: false }
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: { titel: "首页", isAuth: false }
    },
    {
        path: '/start',
        name: 'start',
        component: Start,
        meta: { titel: "开始使用", isAuth: true }
    },
    {
        path: '/UserCenter',
        name: 'UserCenter',
        component: UserCenter,
        meta: { titel: "用户中心", isAuth: true }
    },
    {
        path: '/publicInformation',
        name: 'publicInformation',
        component: PublicInformation,
        meta: { titel: "公告信息", isAuth: false }
    }
]
