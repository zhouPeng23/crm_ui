<template>
    <div id="login_bg">

      <div id="login_area">
        <div>
          <Input v-model="username" size="large" placeholder="请输入账号" type="text" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
          <Input v-model="password" size="large" placeholder="请输入密码" type="password" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
          <Button type="primary" size="large" long @click="login" style="width: 260px;height: 40px;margin: 15px 0 0 20px;">登   录</Button>
        </div>
      </div>

    </div>
</template>

<script>
  import {userLogin} from "../../api/ApiList";

  export default {
    name: "loginPage",
    data() {
      return {
        username:'',
        password:'',
      }
    },
    methods: {
      login: async function () {
        let params = {
          'username':this.username,
          'password':this.password
        };
        let res = await userLogin(params);
        if (res.code === '0000') {
            this.$Message.success("登录成功");
            this.$router.push({path: '/manage/shopmanage/shopList'});
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
    background: url("../../../static/img/login/lijiang.png")  0px 0px no-repeat;
    background-size: 100%;
  }
  #login_area {
    width: 300px;
    height: 200px;
    background: #fdfffd;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-70%);
  }
</style>
