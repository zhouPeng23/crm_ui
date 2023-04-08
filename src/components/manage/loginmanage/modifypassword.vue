<template>
  <div>

    <div id="modify_password_area">
      <div style="font-size:20px; margin: 20px 0 0 0;text-align: center">
        修改密码
      </div>
      <div>
        <Input v-model="oldPassword" size="large" placeholder="请输原密码" type="text" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
        <Input v-model="newPassword" size="large" placeholder="请输入新密码" type="password" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
        <Input v-model="newPasswordSecond" size="large" placeholder="请再次输入新密码" type="password" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
        <Button type="warning" size="large" long @click="modifyPassword()" style="width: 260px;height: 40px;margin: 15px 0 0 20px;">提    交</Button>
        <div style="margin: 20px 0 0 0;color: #ffb97c;text-align: center">
          <span>密码格式:长度6-20, 纯数字、纯字母或两者组合</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {modifyPassword,} from "../../../api/ApiList";
  import * as md5 from "md5";
  import confirmModal from "../../utils/modal/confirmModal";
  import {validateEmpty,validatePassword} from "../../../tools";

  export default {
    name: "modifypassword",
    components: {confirmModal},
    data () {
      return {
        oldPassword:'',
        newPassword:'',
        newPasswordSecond:'',
      }
    },
    methods:{
      //修改密码
      modifyPassword:async function () {
        if (!validatePassword(this.oldPassword)) {
          this.$Message.warning("原密码格式不正确");
          return;
        }

        if (!validatePassword(this.newPassword)) {
          this.$Message.warning("新密码格式不正确");
          return;
        }
        if (!validatePassword(this.newPasswordSecond)) {
          this.$Message.warning("第二次输入的新密码格式不正确");
          return;
        }
        if (this.newPassword!==this.newPasswordSecond) {
          this.$Message.warning("两次输入的新密码不一样");
          return;
        }
        let params = {
          'employeeId':localStorage.getItem("loginUserId"),
          'oldPassword':md5(this.oldPassword),
          'newPassword':md5(this.newPassword),
          'newPasswordSecond':md5(this.newPasswordSecond),
        };
        let res = await modifyPassword(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.$router.push({path:'/login'});
          //清除所有缓存
          localStorage.clear();
        }else {
          this.$Message.error(res.msg);
        }
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //本页面没有其他请求，防止浏览器返回上一页面，所以做个特殊处理，回到登录页面
      if (!validateEmpty(localStorage.getItem('token'))) {
        this.$router.push({path:'/login'});
      }
    }
  }
</script>

<style scoped>
  #modify_password_area {
    width: 300px;
    height: 320px;
    background: #fdfffd;
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translate(-50%);
  }
</style>
