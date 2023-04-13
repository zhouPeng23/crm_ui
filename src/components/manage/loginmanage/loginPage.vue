<template>
    <div id="login_bg">

      <div id="login_area">
        <div style="font-size:20px; margin: 20px 0 0 0;text-align: center">
          <!--宛央科技美肤中心-->
        </div>
        <div>
          <Input v-model="phoneNumber" size="large" placeholder="请输入手机号" :maxlength="20" type="text" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
          <Input v-model="password" size="large" placeholder="请输入密码" :maxlength="20" type="password" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
          <Button type="primary" size="large" long @click="login" style="width: 260px;height: 40px;margin: 15px 0 0 20px;">登   录</Button>
        </div>
      </div>

    </div>
</template>

<script>
  import {login} from "../../../api/ApiList";
  import * as md5 from "md5";

  export default {
    name: "loginPage",
    data() {
      return {
        phoneNumber:'',
        password:'',
      }
    },
    methods: {
      login: async function () {
        //非空校验
        if (this.phoneNumber.trim() === "") {
          this.phoneNumber = "";
          this.$Message.warning("手机号不能为空");
          return;
        }
        if (this.password.trim() === "") {
          this.password = "";
          this.$Message.warning("密码不能为空");
          return;
        }

        let params = {
          'phoneNumber':this.phoneNumber,
          'password':md5(this.password)
        };
        let res = await login(params);
        if (res.code === '0000') {
          localStorage.setItem("loginUserPhoneNumber",res.data.loginUserPhoneNumber);
          localStorage.setItem("loginUserName",res.data.loginUserName);
          localStorage.setItem('loginUserCanSearchShopIds',res.data.loginUserCanSearchShopIds);
          localStorage.setItem('loginUserCanSearchAuthMenu',res.data.loginUserCanSearchAuthMenu);
          this.$router.push({path: '/manage/shopmanage/shopList'});
        }else {
          this.$Message.error(res.msg);
        }
      },
    },
    async mounted () {

    }
  }
</script>

<style scoped>
  #login_bg {
    height: 100vh;
    width: 100%;
    background: url("../../../../static/img/login/lijiang.jpg")  0px 0px no-repeat;
    background-size: 100%;
  }
  #login_area {
    width: 300px;
    height: 250px;
    background: #fdfffd;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-70%);
  }
</style>
