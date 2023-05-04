<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="2">
        <!--添加顾客收益设置按钮-->
        <Button type="success" @click="showAddModal">添加顾客收益设置</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Row>
              <Col span="9">&nbsp;</Col>
              <Col span="6"><Button type="primary" @click="showUpdateModal(index)">修改</Button></Col>
              <Col span="6"><Button type="error" @click="showDeleteModal(index)">删除</Button></Col>
            </Row>
          </template>
        </Table>
      </Col>
    </Row>

    <!--添加顾客收益设置弹框-->
    <confirmModal ref="addShopCustomerIncomeSetterModalRef" modal-title="添加顾客收益设置:" :modal-width="400" @handleSubmit="addShopCustomerIncomeSetter()">
      <Form ref="addShopCustomerIncomeSetterFormRef" :model="addShopCustomerIncomeSetterForm" :label-width="120" @submit.native.prevent>
        <FormItem label="首单收益点数" prop="firstIncomePoint" required>
          <Input type="text" v-model="addShopCustomerIncomeSetterForm.firstIncomePoint" style="width: 50px"></Input><span style="font-size: 15px">%</span>
        </FormItem>
        <FormItem label="永久收益点数" prop="foreverIncomePoint" required>
          <Input type="text" v-model="addShopCustomerIncomeSetterForm.foreverIncomePoint" style="width: 50px"></Input><span style="font-size: 15px">%</span>
        </FormItem>
        <FormItem label="操作员密码" prop="password" required>
          <Input v-model="addShopCustomerIncomeSetterForm.password" size="large" placeholder="您的登录密码" :maxlength="20" style="width: 200px" type="password"/>
        </FormItem>
      </Form>
    </confirmModal>

    <!--修改顾客收益设置弹框-->
    <confirmModal ref="updateShopCustomerIncomeSetterModalRef" modal-title="修改顾客收益设置:" :modal-width="400" @handleSubmit="updateShopCustomerIncomeSetter()">
      <Form ref="updateShopCustomerIncomeSetterFormRef" :model="updateShopCustomerIncomeSetterForm" :label-width="120" @submit.native.prevent>
        <FormItem label="首单收益点数" prop="firstIncomePoint" required>
          <Input type="text" v-model="updateShopCustomerIncomeSetterForm.firstIncomePoint" style="width: 50px"></Input><span style="font-size: 15px">%</span>
        </FormItem>
        <FormItem label="永久收益点数" prop="foreverIncomePoint" required>
          <Input type="text" v-model="updateShopCustomerIncomeSetterForm.foreverIncomePoint" style="width: 50px"></Input><span style="font-size: 15px">%</span>
        </FormItem>
        <FormItem label="操作员密码" prop="password" required>
          <Input v-model="updateShopCustomerIncomeSetterForm.password" size="large" placeholder="您的登录密码" :maxlength="20" style="width: 200px" type="password"/>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除顾客收益设置弹框-->
    <confirmModal ref="deleteShopCustomerIncomeSetterModalRef" modal-title="提示:" :modal-width="400" @handleSubmit="deleteShopCustomerIncomeSetter()">
      <Form ref="deleteShopCustomerIncomeSetterFormRef" :model="deleteShopCustomerIncomeSetterForm" :label-width="120" @submit.native.prevent>
        <FormItem label="操作员密码" prop="password" required>
          <Input v-model="deleteShopCustomerIncomeSetterForm.password" size="large" placeholder="您的登录密码" :maxlength="20" style="width: 200px" type="password"/>
        </FormItem>
      </Form>
    </confirmModal>

  </div>
</template>

<script>
  import {selectShopCustomerIncomeSetterList,addShopCustomerIncomeSetter,updateShopCustomerIncomeSetter,deleteShopCustomerIncomeSetter} from "../../../api/ApiList";
  import {formatStrDate_yymmddHHmmss,validatePercent} from "../../../tools/index";
  import confirmModal from "../../utils/modal/confirmModal";
  import * as md5 from "md5";

  export default {
    name: "shopCustomerIncomeSettertList",
    components: {confirmModal},
    data () {
      return {
        selectedShopId:"",
        selectedShopName:"",
        data: [],
        addShopCustomerIncomeSetterForm:{
          firstIncomePoint:"",
          foreverIncomePoint:"",
          password:"",
        },
        updateShopCustomerIncomeSetterForm:{
          setterId:"",
          firstIncomePoint:"",
          foreverIncomePoint:"",
          password:"",
        },
        deleteShopCustomerIncomeSetterForm:{
          setterId:"",
          password:"",
        },
        columns: [
          {
            title: '首单收益点数',
            key: 'firstIncomePoint',
            width: 120,
          },
          {
            title: '永久收益点数',
            key: 'foreverIncomePoint',
            width: 120,
          },
          {
            title: '创建人',
            key: 'createBy',
            width: 100,
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 150,
            render: (h,params)=>{
              return h('div',
                formatStrDate_yymmddHHmmss(params.row.createTime)
              )
            }
          },
          {
            title: '修改人',
            key: 'updateBy',
            width: 100,
          },
          {
            title: '修改时间',
            key: 'updateTime',
            width: 150,
            render: (h,params)=>{
              return h('div',
                formatStrDate_yymmddHHmmss(params.row.updateTime)
              )
            }
          },
          {
            title: '操作',
            slot: 'action',
            width: 300,
            align: 'center',
          }
        ],
      }
    },
    methods:{
      // 查询顾客收益设置集合
      selectShopCustomerIncomeSetterList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await selectShopCustomerIncomeSetterList(params);
        this.data = res.data;
      },
      // 显示添加顾客收益设置弹框
      showAddModal:function(){
        this.$refs.addShopCustomerIncomeSetterModalRef.showModal();
      },
      // 显示修改顾客收益设置弹框
      showUpdateModal:function(index){
        this.updateShopCustomerIncomeSetterForm.setterId = this.data[index].setterId;
        this.updateShopCustomerIncomeSetterForm.firstIncomePoint = this.data[index].firstIncomePoint;
        this.updateShopCustomerIncomeSetterForm.foreverIncomePoint = this.data[index].foreverIncomePoint;
        this.$refs.updateShopCustomerIncomeSetterModalRef.showModal();
      },
      // 显示删除顾客收益设置弹框
      showDeleteModal:function(index){
        this.deleteShopCustomerIncomeSetterForm.setterId = this.data[index].setterId;
        this.$refs.deleteShopCustomerIncomeSetterModalRef.showModal();
      },
      //添加顾客收益设置
      addShopCustomerIncomeSetter:async function(){
        if (!validatePercent(this.addShopCustomerIncomeSetterForm.firstIncomePoint)) {
          this.$Message.warning("首单收益点数错误");
          return;
        }
        if (!validatePercent(this.addShopCustomerIncomeSetterForm.foreverIncomePoint)) {
          this.$Message.warning("永久收益点数错误");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'firstIncomePoint':this.addShopCustomerIncomeSetterForm.firstIncomePoint,
          'foreverIncomePoint':this.addShopCustomerIncomeSetterForm.foreverIncomePoint,
          //操作员手机号和密码
          'loginUserPhoneNumber':localStorage.getItem("loginUserPhoneNumber"),
          'password':md5(this.addShopCustomerIncomeSetterForm.password),
        };
        let res = await addShopCustomerIncomeSetter(params);
        if (res.code === '0000') {
          this.$refs.addShopCustomerIncomeSetterFormRef.resetFields();
          this.$Message.success(res.msg);
          this.selectShopCustomerIncomeSetterList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //修改顾客收益设置
      updateShopCustomerIncomeSetter:async function () {
        if (!validatePercent(this.updateShopCustomerIncomeSetterForm.firstIncomePoint)) {
          this.$Message.warning("首单收益点数错误");
          return;
        }
        if (!validatePercent(this.updateShopCustomerIncomeSetterForm.foreverIncomePoint)) {
          this.$Message.warning("永久收益点数错误");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'setterId':this.updateShopCustomerIncomeSetterForm.setterId,
          'firstIncomePoint':this.updateShopCustomerIncomeSetterForm.firstIncomePoint,
          'foreverIncomePoint':this.updateShopCustomerIncomeSetterForm.foreverIncomePoint,
          //操作员手机号和密码
          'loginUserPhoneNumber':localStorage.getItem("loginUserPhoneNumber"),
          'password':md5(this.updateShopCustomerIncomeSetterForm.password),
        };
        let res = await updateShopCustomerIncomeSetter(params);
        if (res.code === '0000') {
          this.$refs.updateShopCustomerIncomeSetterFormRef.resetFields();
          this.$Message.success(res.msg);
          this.selectShopCustomerIncomeSetterList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除顾客收益设置
      deleteShopCustomerIncomeSetter:async function () {
        let params = {
          'shopId':this.selectedShopId,
          'setterId':this.deleteShopCustomerIncomeSetterForm.setterId,
          //操作员手机号和密码
          'loginUserPhoneNumber':localStorage.getItem("loginUserPhoneNumber"),
          'password':md5(this.deleteShopCustomerIncomeSetterForm.password),
        };
        let res = await deleteShopCustomerIncomeSetter(params);
        if (res.code === '0000') {
          this.$refs.deleteShopCustomerIncomeSetterFormRef.resetFields();
          this.$Message.success(res.msg);
          this.selectShopCustomerIncomeSetterList();
        }else {
          this.$Message.error(res.msg);
        }
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查顾客收益设置
      this.selectShopCustomerIncomeSetterList();
    }
  }
</script>

<style scoped>

</style>
