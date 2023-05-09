<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="6" >
        <Button type="warning" @click="showRechargeModal">卡充值</Button>
        <Button type="success" @click="showConsumeModal">卡消费</Button>
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
            <Row>
              <Col span="8"><Button type="warning" icon="logo-usd" @click="showRechargeListModal(index)">充值记录</Button></Col>
            </Row>
          </template>
        </Table>

        <Page :total="total" :page-size="pageSize" show-total show-sizer :styles="{'text-align': 'center','margin-top': '10px'}" @on-change="handleChange" @on-page-size-change="handlePageSizeChange"/>

      </Col>
    </Row>

    <!--添加充值弹框-->
    <confirmModal ref="addCustomerRechargeModalRef" modal-title="添加充值:" :modal-width="600" @handleSubmit="addCustomerRecharge()">
      <Form ref="addCustomerRechargeFormRef" :model="addCustomerRechargeForm" :label-width="120" @submit.native.prevent>
        <FormItem label="顾客手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="addCustomerRechargeForm.phoneNumber" :maxlength="11" style="width: 200px"></Input>
          <Button type="primary" ghost @click="queryCustomerByPhoneNumber_recharge">查询</Button>
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
        <FormItem label="代金券金额" prop="rechargeCoupon">
          <Input type="text" v-model="addCustomerRechargeForm.rechargeCoupon" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="操作员密码" prop="password" required>
          <Input v-model="addCustomerRechargeForm.password" size="large" placeholder="您的登录密码" :maxlength="20" style="width: 200px" type="password"/>
        </FormItem>
      </Form>
    </confirmModal>

    <!--添加消费弹框-->
    <confirmModal ref="addCustomerConsumeModalRef" modal-title="添加消费:" :modal-width="600" @handleSubmit="addCustomerConsume()">
      <Form ref="addCustomerConsumeFormRef" :model="addCustomerConsumeForm" :label-width="120" @submit.native.prevent>
        <FormItem label="顾客手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="addCustomerConsumeForm.phoneNumber" :maxlength="11" style="width: 200px"></Input>
          <Button type="primary" ghost @click="queryCustomerByPhoneNumber_consume">查询</Button>
        </FormItem>
        <FormItem label="顾客姓名" prop="customerName" required>
          <Input type="text" v-model="addCustomerConsumeForm.customerName" style="width: 200px" disabled></Input>
        </FormItem>
        <FormItem label="性别" prop="sex" required>
          <Select v-model="addCustomerConsumeForm.sex" style="width:100px" disabled>
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="消费金额" prop="consumeAmount" required>
          <Input type="text" v-model="addCustomerConsumeForm.consumeAmount" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="购买的项目" prop="rechargeCoupon">
          <Input type="text" v-model="addCustomerConsumeForm.consumeForProject" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="购买的产品" prop="rechargeCoupon">
          <Input type="text" v-model="addCustomerConsumeForm.consumeForProduct" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="操作员密码" prop="password" required>
          <Input v-model="addCustomerConsumeForm.password" size="large" placeholder="您的登录密码" :maxlength="20" style="width: 200px" type="password"/>
        </FormItem>
      </Form>
    </confirmModal>

    <!--顾客卡里余额弹框-->
    <confirmModal ref="customerRechargeListModalRef" modal-title="充值记录" :modal-width="1500">
      <span style="color: blue;font-size: 15px">当前卡里总金额:<span style="color: orange;font-size: 25px">{{totalAmount}}</span></span>
      <span style="margin-left: 20px;font-size: 15px">现金总金额:{{totalCashAmount}}</span>
      <span style="margin-left: 20px;font-size: 15px">代金券总金额:{{totalCouponAmount}}</span>
      <Table border :columns="recharge_columns" :data="recharge_data"></Table>
      <Page :total="recharge_total" :page-size="recharge_pageSize" show-total show-sizer :styles="{'text-align': 'center','margin-top': '10px'}" @on-change="recharge_handleChange" @on-page-size-change="recharge_handlePageSizeChange"/>
    </confirmModal>

  </div>
</template>

<script>
  import { validateAmount,formatStrDate_yymmddHHmmss,validateEmpty,validatePhoneNumber,formatAmount,formatAmount_add,formatAmount_sub,formatHumanSexByNumber,formatOperateType} from "../../../tools";
  import {queryCustomerRechargeList,queryCustomerByPhoneNumber,addCustomerRecharge,queryCustomerListByIds,addCustomerConsume} from "../../../api/ApiList";
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
        customerList: [],
        addCustomerRechargeForm:{
          phoneNumber:"",
          customerName:"",
          sex:"",
          rechargeAmount:"",
          rechargeCoupon:"",
          password:"",
        },
        addCustomerConsumeForm:{
          phoneNumber:"",
          customerName:"",
          sex:"",
          consumeAmount:"",
          consumeForProject:"",
          consumeForProduct:"",
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
            title: '操作类型',
            key: 'operateType',
            width: 100,
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:params.row.operateType===1?"orange":"green"
                  }},
                formatOperateType(params.row.operateType)
              )
            }
          },
          {
            title: '充值金额',
            key: 'rechargeAmount',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatAmount_add(params.row.rechargeAmount)
              )
            }
          },
          {
            title: '代金券金额',
            key: 'rechargeCoupon',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatAmount_add(params.row.rechargeCoupon)
              )
            }
          },
          {
            title: '消费金额',
            key: 'consumeAmount',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatAmount_sub(params.row.consumeAmount)
              )
            }
          },
          {
            title: '购买的项目',
            key: 'consumeForProject',
            width: 180,
          },
          {
            title: '购买的产品',
            key: 'consumeForProduct',
            width: 180,
          },
          {
            title: '当前卡里总金额',
            key: 'currentCardTotalAmount',
            width: 150,
            render: (h,params)=>{
              return h('div',
                formatAmount(params.row.currentCardTotalAmount)
              )
            }
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
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center',
            fixed: 'right'
          }
        ],
        //以下是顾客卡里余额记录
        recharge_phoneNumber:"",
        totalAmount:"",
        totalCashAmount:"",
        totalCouponAmount:"",
        //充值记录
        recharge_data: [],
        // 总数
        recharge_total:0,
        // 每页记录数
        recharge_pageSize:10,
        // 当前页
        recharge_currentPageNo:1,
        recharge_columns: [
          {
            title: '顾客姓名',
            key: 'customerId',
            width: 100,
            render: (h, params) => {
              return h('div', [
                this.renderCustomerNameByCustomerId(params.row.customerId)
              ]);
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
            title: '操作类型',
            key: 'operateType',
            width: 100,
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:params.row.operateType===1?"orange":"green"
                  }},
                formatOperateType(params.row.operateType)
              )
            }
          },
          {
            title: '充值金额',
            key: 'rechargeAmount',
            width: 100,
            render: (h, params) => {
              return h('div', [
                formatAmount_add(params.row.rechargeAmount)
              ]);
            }
          },
          {
            title: '代金券金额',
            key: 'rechargeCoupon',
            width: 100,
            render: (h, params) => {
              return h('div', [
                formatAmount_add(params.row.rechargeCoupon)
              ]);
            }
          },
          {
            title: '消费金额',
            key: 'consumeAmount',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatAmount_sub(params.row.consumeAmount)
              )
            }
          },
          {
            title: '购买的项目',
            key: 'consumeForProject',
            width: 180,
          },
          {
            title: '购买的产品',
            key: 'consumeForProduct',
            width: 180,
          },
          {
            title: '当前卡里总金额',
            key: 'currentCardTotalAmount',
            width: 125,
            render: (h,params)=>{
              return h('div',
                formatAmount(params.row.currentCardTotalAmount)
              )
            }
          },
          {
            title: '操作员',
            key: 'createBy',
            width: 100,
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 160,
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

          //根据顾客ids查询顾客集合
          let customerIds = "";
          for(let i = 0; i < this.data.length; i++){
            customerIds += this.data[i].customerId+",";
          }
          let params = {
            'customerIds':customerIds.slice(0,-1),
          };
          let customerListRes = await queryCustomerListByIds(params);
          this.customerList = customerListRes.data;

        }else {
          this.$Message.error(res.msg);
        }
      },
      //根据手机号查顾客充值记录
      queryRechargeList_byPhoneNumber:async function(){
        //组织入参
        let params = {
          //门店id - 少不了的参数
          'shopId':this.selectedShopId,
          //查询条件
          'phoneNumber':this.recharge_phoneNumber,
          //页码
          'pageNo':this.recharge_currentPageNo,
          'pageSize':this.recharge_pageSize,
        };

        //查询
        let res = await queryCustomerRechargeList(params);
        this.recharge_data = res.data.records;
        this.recharge_total = res.data.total;
      },
      // 显示添加充值弹框
      showRechargeModal:function(){
        this.$refs.addCustomerRechargeModalRef.showModal();
      },
      // 显示添加消费弹框
      showConsumeModal:function(){
        this.$refs.addCustomerConsumeModalRef.showModal();
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
        for(let i = 0; i < this.customerList.length; i++){
          if (str === this.customerList[i].customerId) {
            return this.customerList[i].customerName;
          }
        }
      },
      /**
       * 渲染顾客性别
       * @param str
       * @returns {string}
       */
      renderSexByCustomerId : function(str){
        for(let i = 0; i < this.customerList.length; i++){
          if (str === this.customerList[i].customerId) {
            return formatHumanSexByNumber(this.customerList[i].sex);
          }
        }
      },
      /**
       * 渲染顾客手机号
       * @param str
       * @returns {string}
       */
      renderPhoneNumberByCustomerId : function(str){
        for(let i = 0; i < this.customerList.length; i++){
          if (str === this.customerList[i].customerId) {
            return this.customerList[i].phoneNumber;
          }
        }
      },
      /**
       * 根据手机号查询顾客，如果能查到则补充姓名、性别
       */
      queryCustomerByPhoneNumber_recharge: async function(){
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
       * 根据手机号查询顾客，如果能查到则补充姓名、性别
       */
      queryCustomerByPhoneNumber_consume: async function(){
        if (!validatePhoneNumber(this.addCustomerConsumeForm.phoneNumber)) {
          this.$Message.warning("手机号格式错误");
          return;
        }
        let params = {
          'phoneNumber':this.addCustomerConsumeForm.phoneNumber,
        };
        let res = await queryCustomerByPhoneNumber(params);
        if (!validateEmpty(res.data)) {
          this.$Message.success("未查询到记录");
          this.addCustomerConsumeForm.customerName = "";
          this.addCustomerConsumeForm.sex = "";
        }else{
          this.$Message.success("老顾客");
          //设置顾客名称、性别
          this.addCustomerConsumeForm.customerName = res.data.customerName;
          this.addCustomerConsumeForm.sex = res.data.sex;
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
          'rechargeCoupon':this.addCustomerRechargeForm.rechargeCoupon,
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
      /**
       * 添加消费
       */
      addCustomerConsume:async function(){
        if (!validateAmount(this.addCustomerConsumeForm.consumeAmount)) {
          this.$Message.warning("金额格式错误，请重新输入");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'phoneNumber':this.addCustomerConsumeForm.phoneNumber,
          'customerName':this.addCustomerConsumeForm.customerName,
          'sex':this.addCustomerConsumeForm.sex,
          'consumeAmount':this.addCustomerConsumeForm.consumeAmount,
          'consumeForProject':this.addCustomerConsumeForm.consumeForProject,
          'consumeForProduct':this.addCustomerConsumeForm.consumeForProduct,
          //操作员手机号和密码
          'loginUserPhoneNumber':localStorage.getItem("loginUserPhoneNumber"),
          'password':md5(this.addCustomerConsumeForm.password),
        };
        let res = await addCustomerConsume(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.$refs.addCustomerConsumeFormRef.resetFields();
          this.queryCustomerRechargeList();
        }else{
          this.$Message.error(res.msg);
        }
      },
      //显示充值记录弹框
      showRechargeListModal:function(index){
        let customerId = this.data[index].customerId;
        let customer = "";
        //查询到手机号
        for(let i = 0; i < this.customerList.length; i++){
          if (customerId === this.customerList[i].customerId) {
            customer = this.customerList[i];
          }
        }
        //弹框
        this.recharge_phoneNumber = customer.phoneNumber;
        this.totalCashAmount = formatAmount(customer.totalCashAmount);
        this.totalCouponAmount = formatAmount(customer.totalCouponAmount);
        this.totalAmount = formatAmount(customer.totalCashAmount + customer.totalCouponAmount);
        this.queryRechargeList_byPhoneNumber();
        this.$refs.customerRechargeListModalRef.showModal();
      },
      handleChange(pageNo){
        this.currentPageNo = pageNo;
        this.queryCustomerRechargeList();
      },
      handlePageSizeChange(pageSize){
        this.pageSize = pageSize;
        this.queryCustomerRechargeList();
      },
      recharge_handleChange(pageNo){
        this.recharge_currentPageNo = pageNo;
        this.queryRechargeList_byPhoneNumber();
      },
      recharge_handlePageSizeChange(pageSize){
        this.recharge_pageSize = pageSize;
        this.queryRechargeList_byPhoneNumber();
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查顾客充值
      this.queryCustomerRechargeList();

    }
  }
</script>

<style scoped>

</style>
