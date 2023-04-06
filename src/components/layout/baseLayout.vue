<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <MenuItem name="1" style="color: chartreuse;text-align: center">
            <Icon type="md-cloud-outline" />
            当前店铺:<span style="font-size: 25px;margin-left:10px; font-weight: bold;color: chartreuse">{{selectedShopName}}</span>
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
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="md-person" size="15"/>
                {{mainMenu2}}
              </template>
              <MenuItem name="2-1"><router-link to="/manage/employeemanage/employeeList">{{mainMenu2_01}}</router-link></MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-people" size="15" />
                {{mainMenu3}}
              </template>
              <MenuItem name="3-1"><router-link to="/manage/customermanage/customerList">{{mainMenu3_01}}</router-link></MenuItem>
            </Submenu>
            <Submenu name="4">
              <template slot="title">
                <Icon type="md-lock" size="15"/>
                {{mainMenu4}}
              </template>
              <MenuItem name="4-1"><router-link to="/manage/loginmanage/logout">{{mainMenu4_01}}</router-link></MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '0px', minHeight: '1200px', background: '#f5f7f9'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import {querySelectedShop} from "../../api/ApiList";

  export default {
    name:"baseLayout",
    data() {
      return {
        //菜单
        mainMenu1:'店铺管理',
          mainMenu1_01:'店铺列表',
        mainMenu2:'员工管理',
          mainMenu2_01:'员工列表',
        mainMenu3:'顾客管理',
          mainMenu3_01:'顾客列表',
        mainMenu4:'登录管理',
          mainMenu4_01:'退出系统',

        //已选择的应用
        selectedShopId:"",
        selectedShopName:"",
      }
    },
    methods:{
      logout:function () {
        this.$router.push({path:'/login'});
      },
    },
    mounted:async function () {
      let res = await querySelectedShop();
      if (res.code === '0000' && res.data!=null) {
        this.selectedShopId = res.data.shopId;
        this.selectedShopName = res.data.shopName;
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
