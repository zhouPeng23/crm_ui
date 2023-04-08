//==============================================开始引入组件============================================================
import Vue from 'vue'
import Router from 'vue-router'
const baseLayout = () => import('../components/layout/baseLayout');

//店铺管理
const shopList  = () => import('../components/manage/shopmanage/shopList');
const projectList  = () => import('../components/manage/shopmanage/projectList');

//员工管理
const employeeList  = () => import('../components/manage/employeemanage/employeeList');

//顾客管理
const customerList  = () => import('../components/manage/cumtomermanage/customerList');

//登录管理
const loginPage  = () => import('../components/manage/loginmanage/loginPage');
const modifypassword  = () => import('../components/manage/loginmanage/modifypassword');

Vue.use(Router);

//==============================================引入二级模块============================================================
//店铺管理
const shopManageRouters = [
  {path:'shopList',component:shopList},
  {path:'projectList',component:projectList},
];

//员工管理
const employeeManageRouters = [
  {path:'employeeList',component:employeeList},
];

//客户管理
const customerManageRouters = [
  {path:'customerList',component:customerList},
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
    {path:'/manage/shopmanage',component:baseLayout,children:shopManageRouters},//店铺管理
    {path:'/manage/employeemanage',component:baseLayout,children:employeeManageRouters},//员工管理
    {path:'/manage/customermanage',component:baseLayout,children:customerManageRouters},//客户管理
    {path:'/manage/loginmanage',component:baseLayout,children:loginManageRouters},//登录管理
    {path: '/login', component:loginPage },
    {path: '*', component:loginPage },
  ]
})
