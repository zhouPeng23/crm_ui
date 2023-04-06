//==============================================开始引入组件============================================================
import Vue from 'vue'
import Router from 'vue-router'
const baseLayout = () => import('../components/layout/baseLayout');
const loginPage  = () => import('../components/login/loginPage');
//店铺管理
const shopList  = () => import('../components/manage/shopmanage/shopList');
//员工管理
const employeeList  = () => import('../components/manage/employeemanage/employeeList');
//顾客管理
const customerList  = () => import('../components/manage/cumtomermanage/customerList');

Vue.use(Router);

//==============================================引入二级模块============================================================
//店铺管理
const shopManageRouters = [
  {path:'shopList',component:shopList},
];
//员工管理
const employeeManageRouters = [
  {path:'employeeList',component:employeeList},
];
//客户管理
const customerManageRouters = [
  {path:'customerList',component:customerList},
];


//==============================================引入一级模块============================================================
export default new Router({
  //去掉#号
  mode:'history',
  base:'crm_ui',
  routes: [
    {path:'/manage/shopmanage',component:baseLayout,children:shopManageRouters},//店铺管理
    {path:'/manage/employeemanage',component:baseLayout,children:employeeManageRouters},//员工管理
    {path:'/manage/customermanage',component:baseLayout,children:customerManageRouters},//客户管理
    {path: '/login', component:loginPage },
    {path: '*', component:loginPage },
  ]
})
