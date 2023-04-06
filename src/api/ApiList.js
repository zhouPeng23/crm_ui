// 所有界面的跨站请求在此统一管理，统一为POST异步请求
import {POST} from './POST'
const baseUrl = '/crmWebApi';

//登录
export const login = (params) => POST(baseUrl+'/user/login',params);
export const logout = (params) => POST(baseUrl+'/user/logout',params);

//店铺
export const queryShopList = (params) => POST(baseUrl+'/shop/queryShopList',params);
export const addShop = (params) => POST(baseUrl+'/shop/addShop',params);
export const deleteShop = (params) => POST(baseUrl+'/shop/deleteShop',params);
export const updateShop = (params) => POST(baseUrl+'/shop/updateShop',params);
export const querySelectedShop = (params) => POST(baseUrl+'/shop/querySelectedShop',params);
export const selectThisShop = (params) => POST(baseUrl+'/shop/selectThisShop',params);

//员工
export const queryEmployeeList = (params) => POST(baseUrl+'/employee/queryEmployeeList',params);
export const addEmployee = (params) => POST(baseUrl+'/employee/addEmployee',params);
export const updateEmployee = (params) => POST(baseUrl+'/employee/updateEmployee',params);
export const deleteEmployee = (params) => POST(baseUrl+'/employee/deleteEmployee',params);

//角色
export const queryRoleList = (params) => POST(baseUrl+'/role/queryRoleList',params);

//顾客
export const queryCustomerList = (params) => POST(baseUrl+'/customer/queryCustomerList',params);
export const addCustomer = (params) => POST(baseUrl+'/customer/addCustomer',params);
export const updateCustomer = (params) => POST(baseUrl+'/customer/updateCustomer',params);
export const deleteCustomer = (params) => POST(baseUrl+'/customer/deleteCustomer',params);
export const getAllCustomerMassLevelList = (params) => POST(baseUrl+'/customer/getAllCustomerMassLevelList',params);



