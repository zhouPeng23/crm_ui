<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <MenuItem name="1" style="color: #fdfffd;text-align: center;float: left">
            <Icon type="md-cloud-outline" />
            当前门店:
            <span v-if="selectedShopId" style="font-size: 25px;margin-left:10px; font-weight: bold;color: #fdfffd">{{selectedShopName}}</span>
            <span v-else style="font-size: 25px;margin-left:10px; font-weight: bold;color: #f22b2b">未选择</span>
          </MenuItem>
          <MenuItem name="2" style="color: #fdfffd;text-align: center;float: right">
            <Avatar style="background-color: #87d068" icon="ios-person" />
            <span style="font-size: 13px;font-weight: bold">{{loginUserName}}</span>
          </MenuItem>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-home" size="15"/>
                {{mainMenu1}}
              </template>
              <MenuItem name="1-1"><router-link to="/manage/shopmanage/shopList">{{mainMenu1_01}}</router-link></MenuItem>
              <MenuItem name="1-2"><router-link to="/manage/shopmanage/projectList">{{mainMenu1_02}}</router-link></MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="md-person" size="15"/>
                {{mainMenu2}}
              </template>
              <MenuItem name="2-1"><router-link to="/manage/employeemanage/shiftList">{{mainMenu2_01}}</router-link></MenuItem>
              <MenuItem name="2-2"><router-link to="/manage/employeemanage/employeeList">{{mainMenu2_02}}</router-link></MenuItem>
              <MenuItem name="2-3"><router-link to="/manage/employeemanage/employeeOverTimeList">{{mainMenu2_03}}</router-link></MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-people" size="15" />
                {{mainMenu3}}
              </template>
              <MenuItem name="3-1"><router-link to="/manage/customermanage/appointmentList">{{mainMenu3_01}}</router-link></MenuItem>
              <MenuItem name="3-2"><router-link to="/manage/customermanage/customerList">{{mainMenu3_02}}</router-link></MenuItem>
              <MenuItem name="3-3"><router-link to="/manage/customermanage/customerRechargeList">{{mainMenu3_03}}</router-link></MenuItem>
              <MenuItem name="3-4"><router-link to="/manage/customermanage/customerIncomeList">{{mainMenu3_04}}</router-link></MenuItem>
            </Submenu>
            <Submenu name="4">
              <template slot="title">
                <Icon type="md-lock" size="15"/>
                {{mainMenu4}}
              </template>
              <MenuItem name="4-1"><router-link to="/manage/loginmanage/modifypassword">{{mainMenu4_01}}</router-link></MenuItem>
              <MenuItem name="4-2"><router-link to=""><span @click="logout">{{mainMenu4_02}}</span></router-link></MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '0px', minHeight: '100vh', background: '#f5f7f9'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>

    <!--提示选择门店弹框-->
    <confirmModal ref="tipSelectShopModalRef" modal-title="提示:" :modal-width="300">
      <div style="font-size: 20px;;">欢迎您:{{loginUserName}}, 请选择门店^_^</div>
    </confirmModal>
  </div>
</template>

<script>
  import {validateEmpty} from "../../tools";
  import {logout} from "../../api/ApiList";
  import confirmModal from "../utils/modal/confirmModal";

  export default {
    name:"baseLayout",
    components: {confirmModal},
    data() {
      return {
        //菜单
        mainMenu1:'门店管理',
          mainMenu1_01:'门店列表',
          mainMenu1_02:'店内项目',
        mainMenu2:'员工管理',
          mainMenu2_01:'班次列表',
          mainMenu2_02:'员工列表',
          mainMenu2_03:'加班记录',
        mainMenu3:'顾客管理',
          mainMenu3_01:'预约列表',
          mainMenu3_02:'顾客列表',
          mainMenu3_03:'顾客充值',
          mainMenu3_04:'顾客收益',
        mainMenu4:'登录管理',
          mainMenu4_01:'修改密码',
          mainMenu4_02:'安全退出',

        //已选择的应用
        selectedShopId:"",
        selectedShopName:"",

        //登录人信息
        loginUserName:"",
      }
    },
    methods:{
      logout: async function () {
        this.$router.push({path:'/login'});
        //清除所有缓存
        localStorage.clear();
        let res = await logout();
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //设置登录人姓名
      this.loginUserName = localStorage.getItem("loginUserName");

      if (!validateEmpty(this.selectedShopId)){
        this.$refs.tipSelectShopModalRef.showModal();
      }
    }
  }
</script>

<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 135px;
    height: 55px;
    background: #cdb5f9;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 5px;
    left: -20px;
  }
  .layout-nav{
    width: 20%;
    margin: 0 auto;
    margin-right: 20px;
  }
</style>
