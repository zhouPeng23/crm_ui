// 所有界面的跨站请求在此统一管理，统一为POST异步请求
import {POST} from './POST'
const baseUrl = '/crmWebApi';

//登录
export const login = (params) => POST(baseUrl+'/user/login',params);
export const logout = (params) => POST(baseUrl+'/user/logout',params);
export const modifyPassword = (params) => POST(baseUrl+'/user/modifyPassword',params);

//门店
export const queryShopList = (params) => POST(baseUrl+'/shop/queryShopList',params);
export const addShop = (params) => POST(baseUrl+'/shop/addShop',params);
export const deleteShop = (params) => POST(baseUrl+'/shop/deleteShop',params);
export const updateShop = (params) => POST(baseUrl+'/shop/updateShop',params);

//项目
export const queryProjectList = (params) => POST(baseUrl+'/project/queryProjectList',params);
export const addProject = (params) => POST(baseUrl+'/project/addProject',params);
export const updateProject = (params) => POST(baseUrl+'/project/updateProject',params);
export const deleteProject = (params) => POST(baseUrl+'/project/deleteProject',params);

//员工
export const queryShopAllEmployeeList = (params) => POST(baseUrl+'/employee/queryShopAllEmployeeList',params);
export const queryShopNormalEmployeeList = (params) => POST(baseUrl+'/employee/queryShopNormalEmployeeList',params);
export const addEmployee = (params) => POST(baseUrl+'/employee/addEmployee',params);
export const updateEmployee = (params) => POST(baseUrl+'/employee/updateEmployee',params);
export const deleteEmployee = (params) => POST(baseUrl+'/employee/deleteEmployee',params);

//班次和时间
export const queryShiftList = (params) => POST(baseUrl+'/shift/queryShiftList',params);
export const addShift = (params) => POST(baseUrl+'/shift/addShift',params);
export const deleteShift = (params) => POST(baseUrl+'/shift/deleteShift',params);
export const queryShiftTimeList = (params) => POST(baseUrl+'/shift/queryShiftTimeList',params);
export const addShiftTime = (params) => POST(baseUrl+'/shift/addShiftTime',params);

//员工加班记录
export const queryEmployeeOverTimeList = (params) => POST(baseUrl+'/employeeOverTime/queryEmployeeOverTimeList',params);

//角色
export const queryRoleList = (params) => POST(baseUrl+'/role/queryRoleList',params);

//顾客
export const queryCustomerList = (params) => POST(baseUrl+'/customer/queryCustomerList',params);
export const queryShopAllCustomer = (params) => POST(baseUrl+'/customer/queryShopAllCustomer',params);
export const addCustomer = (params) => POST(baseUrl+'/customer/addCustomer',params);
export const updateCustomer = (params) => POST(baseUrl+'/customer/updateCustomer',params);
export const deleteCustomer = (params) => POST(baseUrl+'/customer/deleteCustomer',params);
export const getAllCustomerMassLevelList = (params) => POST(baseUrl+'/customer/getAllCustomerMassLevelList',params);
export const queryCustomerByPhoneNumber = (params) => POST(baseUrl+'/customer/queryCustomerByPhoneNumber',params);

//顾客充值
export const queryCustomerRechargeList = (params) => POST(baseUrl+'/customerRecharge/queryCustomerRechargeList',params);
export const addCustomerRecharge = (params) => POST(baseUrl+'/customerRecharge/addCustomerRecharge',params);

//顾客收益
export const queryCustomerIncomeList = (params) => POST(baseUrl+'/customerIncome/queryCustomerIncomeList',params);

//预约
export const queryAppointmentList = (params) => POST(baseUrl+'/appointment/queryAppointmentList',params);
export const addAppointment = (params) => POST(baseUrl+'/appointment/addAppointment',params);
export const updateAppointment = (params) => POST(baseUrl+'/appointment/updateAppointment',params);
export const zuofeiAppointment = (params) => POST(baseUrl+'/appointment/zuofeiAppointment',params);
export const queryAppointmentStatusList = (params) => POST(baseUrl+'/appointment/queryAppointmentStatusList',params);
export const queryAppointmentByIds = (params) => POST(baseUrl+'/appointment/queryAppointmentByIds',params);





