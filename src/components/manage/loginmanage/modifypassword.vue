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
      </div>
    </div>

  </div>
</template>

<script>
  import {modifyPassword,} from "../../../api/ApiList";
  import * as md5 from "md5";
  import confirmModal from "../../utils/modal/confirmModal";
  import {checkEmpty} from "../../../tools";

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
        if (checkEmpty(this.oldPassword)) {
          this.$Message.info("原密码不能为空");
          return;
        }
        if (checkEmpty(this.newPassword)) {
          this.$Message.info("新密码不能为空");
          return;
        }
        if (checkEmpty(this.newPasswordSecond)) {
          this.$Message.info("第二次输入的新密码不能为空");
          return;
        }
        if (this.newPassword!==this.newPasswordSecond) {
          this.$Message.info("两次输入的新密码不一样");
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
