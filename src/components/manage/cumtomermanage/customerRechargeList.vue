<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="6" >
        <Button type="warning" @click="showAddModal">添加充值</Button>
      </Col>
      <Col span="18">
        <Input v-model="searchCustomerName" placeholder="姓名" clearable style="width: 150px" />
        <Input v-model="searchPhoneNumber" placeholder="手机号" clearable style="width: 150px" :maxlength="11"/>
        <Button type="primary" shape="circle" icon="ios-search" @click="queryCustomerRechargeList">查询</Button>
        <Button shape="circle" @click="resetQuery">重置</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
          </template>
        </Table>

        <Page :total="total" :page-size="pageSize" show-total show-sizer :styles="{'text-align': 'center','margin-top': '10px'}" @on-change="handleChange" @on-page-size-change="handlePageSizeChange"/>

      </Col>
    </Row>

    <!--添加充值弹框-->
    <confirmModal ref="addCustomerRechargeModalRef" modal-title="添加充值:" :modal-width="600" @handleSubmit="addCustomerRecharge()">
      <Form ref="addCustomerRechargeFormRef" :model="addCustomerRechargeForm" :label-width="100" @submit.native.prevent>
        <FormItem label="顾客手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="addCustomerRechargeForm.phoneNumber" :maxlength="11" style="width: 200px"></Input>
          <Button type="primary" ghost @click="queryCustomerByPhoneNumber">查询</Button>
        </FormItem>
        <FormItem label="顾客姓名" prop="customerName" required>
          <Input type="text" v-model="addCustomerRechargeForm.customerName" style="width: 200px" disabled></Input>
        </FormItem>
        <FormItem label="性别" prop="sex" required>
          <Select v-model="addCustomerRechargeForm.sex" style="width:100px" disabled>
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="充值金额" prop="rechargeAmount" required>
          <Input type="text" v-model="addCustomerRechargeForm.rechargeAmount" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark" required>
          <Select v-model="addCustomerRechargeForm.remark" style="width:400px">
            <Option value="仅充值">仅充值</Option>
            <Option value="仅购买项目">仅购买项目</Option>
            <Option value="仅购买产品">仅购买产品</Option>
            <Option value="购买项目+产品">购买项目+产品</Option>
          </Select>
        </FormItem>
        <FormItem label="购买的项目" prop="rechargeForProject">
          <Input type="text" v-model="addCustomerRechargeForm.rechargeForProject" style="width: 400px"></Input>
        </FormItem>
        <FormItem label="购买的产品" prop="rechargeForProduct">
          <Input type="text" v-model="addCustomerRechargeForm.rechargeForProduct" style="width: 400px"></Input>
        </FormItem>
        <FormItem label="操作员密码" prop="password" required>
          <Input v-model="addCustomerRechargeForm.password" size="large" placeholder="您的登录密码" :maxlength="20" style="width: 200px" type="password"/>
        </FormItem>
      </Form>
    </confirmModal>

  </div>
</template>

<script>
  import { validateAmount,formatStrDate_yymmddHHmmss,validateEmpty,validatePhoneNumber,formatAmount,formatHumanSexByNumber} from "../../../tools";
  import {queryCustomerRechargeList,queryShopAllCustomer,queryCustomerByPhoneNumber,addCustomerRecharge} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";
  import * as md5 from "md5";

  export default {
    name: "customerRechargeList",
    components: {confirmModal},
    data () {
      return {
        selectedShopId:"",
        selectedShopName:"",
        data: [],
        // 总数
        total:0,
        // 每页记录数
        pageSize:20,
        // 当前页
        currentPageNo:1,
        searchCustomerName:"",
        searchPhoneNumber:"",
        allCustomerList: [],
        addCustomerRechargeForm:{
          phoneNumber:"",
          customerName:"",
          sex:"",
          rechargeAmount:"",
          rechargeForProject:"",
          rechargeForProduct:"",
          remark:"",
          password:"",
        },
        sexList: [
          {
            value: 1,
            label: '男'
          },
          {
            value: 0,
            label: '女'
          },
        ],
        columns: [
          {
            title: '姓名',
            key: 'customerId',
            width: 100,
            fixed: 'left',
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:"black"
                  }},
                [ h('strong',this.renderCustomerNameByCustomerId(params.row.customerId))]
              )
            }
          },
          {
            title: '性别',
            key: 'customerId',
            width: 80,
            render: (h,params)=>{
              return h('div',
                this.renderSexByCustomerId(params.row.customerId)
              )
            }
          },
          {
            title: '手机号',
            key: 'customerId',
            width: 120,
            render: (h,params)=>{
              return h('div',
                this.renderPhoneNumberByCustomerId(params.row.customerId)
              )
            }
          },
          {
            title: '充值金额',
            key: 'rechargeAmount',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatAmount(params.row.rechargeAmount)
              )
            }
          },
          {
            title: '备注',
            key: 'remark',
            width: 150,
          },
          {
            title: '购买的项目',
            key: 'rechargeForProject',
            width: 258,
          },
          {
            title: '购买的产品',
            key: 'rechargeForProduct',
            width: 258,
          },
          {
            title: '操作员',
            key: 'createBy',
            width: 100,
          },
          {
            title: '添加时间',
            key: 'createTime',
            width: 200,
            render: (h,params)=>{
              return h('div',
                formatStrDate_yymmddHHmmss(params.row.createTime)
              )
            }
          },
        ],
      }
    },
    methods:{
      // 查询顾客充值集合
      queryCustomerRechargeList :async function () {
        let params = {
          //门店id - 少不了的参数
          'shopId':this.selectedShopId,
          //查询条件
          'customerName':this.searchCustomerName,
          'phoneNumber':this.searchPhoneNumber,
          //页码
          'pageNo':this.currentPageNo,
          'pageSize':this.pageSize,
        };
        let res = await queryCustomerRechargeList(params);
        if (res.code === '0000') {
          this.data = res.data.records;
          this.total = res.data.total;
        }else {
          this.$Message.error(res.msg);
        }
      },
      // 显示添加充值弹框
      showAddModal:function(){
        this.$refs.addCustomerRechargeModalRef.showModal();
      },
      queryShopAllCustomer:async function(){
        let params = {
          'shopId':this.selectedShopId,
        };
        let res = await queryShopAllCustomer(params);
        this.allCustomerList = res.data;
      },
      resetQuery: function(){
        //查询条件设置为空
        this.searchCustomerName = "";
        this.searchPhoneNumber = "";
        //页码设置为默认值
        this.currentPageNo = 1;
        //重置后，重新查询
        this.queryCustomerRechargeList();
      },
      /**
       * 渲染顾客姓名
       * @param str
       * @returns {string}
       */
      renderCustomerNameByCustomerId : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].customerName;
          }
        }
      },
      /**
       * 渲染顾客性别
       * @param str
       * @returns {string}
       */
      renderSexByCustomerId : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return formatHumanSexByNumber(this.allCustomerList[i].sex);
          }
        }
      },
      /**
       * 渲染顾客手机号
       * @param str
       * @returns {string}
       */
      renderPhoneNumberByCustomerId : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].phoneNumber;
          }
        }
      },
      /**
       * 根据手机号查询顾客，如果能查到则补充姓名、性别
       */
      queryCustomerByPhoneNumber: async function(){
        if (!validatePhoneNumber(this.addCustomerRechargeForm.phoneNumber)) {
          this.$Message.warning("手机号格式错误");
          return;
        }
        let params = {
          'phoneNumber':this.addCustomerRechargeForm.phoneNumber,
        };
        let res = await queryCustomerByPhoneNumber(params);
        if (!validateEmpty(res.data)) {
          this.$Message.success("未查询到记录");
          this.addCustomerRechargeForm.customerName = "";
          this.addCustomerRechargeForm.sex = "";
        }else{
          this.$Message.success("老顾客");
          //设置顾客名称、性别
          this.addCustomerRechargeForm.customerName = res.data.customerName;
          this.addCustomerRechargeForm.sex = res.data.sex;
        }
      },
      /**
       * 添加充值
       */
      addCustomerRecharge:async function(){
        if (!validateAmount(this.addCustomerRechargeForm.rechargeAmount)) {
          this.$Message.warning("金额格式错误，请重新输入");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'phoneNumber':this.addCustomerRechargeForm.phoneNumber,
          'customerName':this.addCustomerRechargeForm.customerName,
          'sex':this.addCustomerRechargeForm.sex,
          'rechargeAmount':this.addCustomerRechargeForm.rechargeAmount,
          'remark':this.addCustomerRechargeForm.remark,
          'rechargeForProject':this.addCustomerRechargeForm.rechargeForProject,
          'rechargeForProduct':this.addCustomerRechargeForm.rechargeForProduct,
          //操作员手机号和密码
          'loginUserPhoneNumber':localStorage.getItem("loginUserPhoneNumber"),
          'password':md5(this.addCustomerRechargeForm.password),
        };
        let res = await addCustomerRecharge(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.$refs.addCustomerRechargeFormRef.resetFields();
          this.queryCustomerRechargeList();
        }else{
          this.$Message.error(res.msg);
        }
      },
      handleChange(pageNo){
        this.currentPageNo = pageNo;
        this.queryCustomerRechargeList();
      },
      handlePageSizeChange(pageSize){
        this.pageSize = pageSize;
        this.queryCustomerRechargeList();
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查询所有顾客
      this.queryShopAllCustomer();

      //查顾客充值
      this.queryCustomerRechargeList();

    }
  }
</script>

<style scoped>

</style>
