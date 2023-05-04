//==============================================开始引入组件============================================================
import Vue from 'vue'
import Router from 'vue-router'
const baseLayout = () => import('../components/layout/baseLayout');

//门店管理
const shopList  = () => import('../components/manage/shopmanage/shopList');
const projectList  = () => import('../components/manage/shopmanage/projectList');
const shopCustomerIncomeSettertList  = () => import('../components/manage/shopmanage/shopCustomerIncomeSettertList');

//员工管理
const shiftList  = () => import('../components/manage/employeemanage/shiftList');
const employeeList  = () => import('../components/manage/employeemanage/employeeList');
const employeeOverTimeList  = () => import('../components/manage/employeemanage/employeeOverTimeList');

//顾客管理
const appointmentList  = () => import('../components/manage/cumtomermanage/appointmentList');
const customerList  = () => import('../components/manage/cumtomermanage/customerList');
const customerRechargeList  = () => import('../components/manage/cumtomermanage/customerRechargeList');
const customerIncomeList  = () => import('../components/manage/cumtomermanage/customerIncomeList');

//登录管理
const loginPage  = () => import('../components/manage/loginmanage/loginPage');
const modifypassword  = () => import('../components/manage/loginmanage/modifypassword');

Vue.use(Router);

//==============================================引入二级模块============================================================
//门店管理
const shopManageRouters = [
  {path:'shopList',component:shopList},
  {path:'projectList',component:projectList},
  {path:'shopCustomerIncomeSettertList',component:shopCustomerIncomeSettertList},
];

//员工管理
const employeeManageRouters = [
  {path:'shiftList',component:shiftList},
  {path:'employeeList',component:employeeList},
  {path:'employeeOverTimeList',component:employeeOverTimeList},
];

//顾客管理
const customerManageRouters = [
  {path:'appointmentList',component:appointmentList},
  {path:'customerList',component:customerList},
  {path:'customerRechargeList',component:customerRechargeList},
  {path:'customerIncomeList',component:customerIncomeList},
];

//登录管理
const loginManageRouters = [
  {path:'modifypassword',component:modifypassword},
];


//==============================================引入一级模块============================================================
export default new Router({
  //去掉#号
  mode:'history',
  base:'crm_ui',
  routes: [
    {path:'/manage/shopmanage',component:baseLayout,children:shopManageRouters},//门店管理
    {path:'/manage/employeemanage',component:baseLayout,children:employeeManageRouters},//员工管理
    {path:'/manage/customermanage',component:baseLayout,children:customerManageRouters},//顾客管理
    {path:'/manage/loginmanage',component:baseLayout,children:loginManageRouters},//登录管理
    {path: '/login', component:loginPage },
    {path: '*', component:loginPage },
  ]
})
