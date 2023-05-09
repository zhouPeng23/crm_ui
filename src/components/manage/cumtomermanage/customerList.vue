<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="4" >
        <Button type="primary" @click="showAddModal">添加顾客</Button>
      </Col>
      <Col span="20">
        <Input v-model="searchCustomerName" placeholder="顾客姓名" clearable style="width: 150px" />
        <Input v-model="searchPhoneNumber" placeholder="顾客手机号码" clearable style="width: 150px" :maxlength="11"/>
        <Select v-model="searchSex" style="width:100px" clearable placeholder="性别">
          <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="searchCustomerMassLevel" style="width:100px" clearable placeholder="会员等级">
          <Option v-for="item in allCustomerMassLevelList" :value="item.code" :key="item.code">{{ item.msg }}</Option>
        </Select>
        <Select v-model="searchBelongToEmployeeId" style="width:100px" clearable placeholder="所属员工">
          <Option v-for="item in shopNormalemployeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
        </Select>
        <Button type="primary" shape="circle" icon="ios-search" @click="queryCustomerList">查询</Button>
        <Button shape="circle" @click="resetQuery">重置</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Row>
              <Col span="8"><Button type="primary" @click="showUpdateModal(index)">修改</Button></Col>
              <Col span="8"><Button type="success" icon="ios-search" @click="showAppointmentModal(index)">预约记录</Button></Col>
              <Col span="8"><Button type="warning" icon="logo-usd" @click="showRechargeListModal(index)">充值记录</Button></Col>
            </Row>
          </template>
        </Table>

        <Page :total="total" :page-size="pageSize" show-total show-sizer :styles="{'text-align': 'center','margin-top': '10px'}" @on-change="handleChange" @on-page-size-change="handlePageSizeChange"/>

      </Col>
    </Row>

    <!--添加顾客弹框-->
    <confirmModal ref="addCustomerModalRef" modal-title="添加顾客:" :modal-width="600" @handleSubmit="addCustomer()">
      <Form ref="addCustomerFormRef" :model="addCustomerForm" :label-width="120" @submit.native.prevent>
        <FormItem label="顾客姓名" prop="customerName" required>
          <Input type="text" v-model="addCustomerForm.customerName" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="顾客性别" prop="sex" required>
          <Select v-model="addCustomerForm.sex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="顾客手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="addCustomerForm.phoneNumber" :maxlength="11" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="生日日期" prop="birthday">
          <DatePicker type="date" v-model="addCustomerForm.birthday" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="会员等级" prop="customerMassLevel" required>
          <Select v-model="addCustomerForm.customerMassLevel" style="width:100px">
            <Option v-for="item in allCustomerMassLevelList" :value="item.code" :key="item.code">{{ item.msg }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属员工" prop="belongToEmployeeId" required>
          <Select v-model="addCustomerForm.belongToEmployeeId" style="width:100px">
            <Option v-for="item in shopNormalemployeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="被介绍人">
          <Select v-model="addCustomerForm.hasIntroducedByCustomer" style="width:100px" :onchange="hasIntroducedByCustomerChange_add()">
            <Option value="0">无</Option>
            <Option value="1">有</Option>
          </Select>
        </FormItem>
        <FormItem v-if="addCustomerForm.showIntroducedByCustomer" label="被介绍顾客手机号" prop="introducedByCustomerPhoneNumber" required>
          <Input type="text" v-model="addCustomerForm.introducedByCustomerPhoneNumber" :maxlength="11" style="width: 200px"></Input>
          <Button type="primary" ghost @click="queryCustomerByPhoneNumber_add">查询</Button>
        </FormItem>
        <FormItem v-if="addCustomerForm.showIntroducedByCustomer" label="被介绍顾客姓名" prop="introducedByCustomerName" required>
          <Input type="text" v-model="addCustomerForm.introducedByCustomerName" style="width: 200px" disabled></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--修改顾客弹框-->
    <confirmModal ref="updateCustomerModalRef" modal-title="修改顾客:" :modal-width="600" @handleSubmit="updateCustomer()">
      <Form ref="updateCustomerFormRef" :model="updateCustomerForm" :label-width="120" @submit.native.prevent>
        <FormItem label="顾客姓名" prop="customerName" required>
          <Input type="text" v-model="updateCustomerForm.customerName" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="顾客性别" prop="sex" required>
          <Select v-model="updateCustomerForm.sex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="顾客手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="updateCustomerForm.phoneNumber" :maxlength="11" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="生日日期" prop="birthday">
          <DatePicker type="date" v-model="updateCustomerForm.birthday" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="会员等级" prop="customerMassLevel" required>
          <Select v-model="updateCustomerForm.customerMassLevel" style="width:100px">
            <Option v-for="item in allCustomerMassLevelList" :value="item.code" :key="item.code">{{ item.msg }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属员工" prop="belongToEmployeeId" required>
          <Select v-model="updateCustomerForm.belongToEmployeeId" style="width:100px">
            <Option v-for="item in shopNormalemployeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="被介绍人">
          <Select v-model="updateCustomerForm.hasIntroducedByCustomer" style="width:100px" :onchange="hasIntroducedByCustomerChange_update()">
            <Option value="0">无</Option>
            <Option value="1">有</Option>
          </Select>
        </FormItem>
        <FormItem v-if="updateCustomerForm.showIntroducedByCustomer" label="被介绍顾客手机号" prop="introducedByCustomerPhoneNumber" required>
          <Input type="text" v-model="updateCustomerForm.introducedByCustomerPhoneNumber" :maxlength="11" style="width: 200px"></Input>
          <Button type="primary" ghost @click="queryCustomerByPhoneNumber_update">查询</Button>
        </FormItem>
        <FormItem v-if="updateCustomerForm.showIntroducedByCustomer" label="被介绍顾客姓名" prop="introducedByCustomerName" required>
          <Input type="text" v-model="updateCustomerForm.introducedByCustomerName" style="width: 200px" disabled></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--顾客预约记录弹框-->
    <confirmModal ref="customerAppointmentModalRef" modal-title="顾客预约记录:" :modal-width="1000">
      <Table border :columns="appointment_columns" :data="appointment_data"></Table>
      <Page :total="appointment_total" :page-size="appointment_pageSize" show-total show-sizer :styles="{'text-align': 'center','margin-top': '10px'}" @on-change="appointment_handleChange" @on-page-size-change="appointment_handlePageSizeChange"/>
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
  import { formatAmount,formatDate_yyyyMMdd,formatStrDate_yymmddHHmmss,validateEmpty,formatHumanSexByNumber,validatePhoneNumber,getDatePeriod,
    dateIsToday,getTimePeriod,formatOperateType} from "../../../tools";
  import {queryShopAllEmployeeList,queryShopNormalEmployeeList,getAllCustomerMassLevelList,queryCustomerList,addCustomer,queryAppointmentStatusList,
    updateCustomer,queryShopAllCustomer,queryCustomerByPhoneNumber,queryAppointmentList,queryProjectList,queryCustomerRechargeList} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "customerList",
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
        searchSex:"",
        searchCustomerMassLevel:"",
        searchBelongToEmployeeId:"",
        shopAllemployeeList: [],
        shopNormalemployeeList: [],
        allCustomerList: [],
        allCustomerMassLevelList: [],
        addCustomerForm:{
          customerName:"",
          sex:"",
          phoneNumber:"",
          birthday:"",
          customerMassLevel:"",
          belongToEmployeeId:"",
          hasIntroducedByCustomer:"0",
          showIntroducedByCustomer:false,
          introducedByCustomerPhoneNumber:"",
          introducedByCustomerName:"",
        },
        updateCustomerForm:{
          customerId:"",
          customerName:"",
          sex:"",
          phoneNumber:"",
          birthday:"",
          customerMassLevel:"",
          belongToEmployeeId:"",
          hasIntroducedByCustomer:"0",
          showIntroducedByCustomer:false,
          introducedByCustomerPhoneNumber:"",
          introducedByCustomerName:"",
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
        roleList:[],
        columns: [
          {
            title: '顾客姓名',
            key: 'customerName',
            width: 150,
            fixed: 'left',
            render: (h, params) => {
              return h('div', [
                h('strong' ,params.row.customerName)
              ]);
            }
          },
          {
            title: '性别',
            key: 'sex',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatHumanSexByNumber(params.row.sex)
              )
            }
          },
          {
            title: '手机号',
            key: 'phoneNumber',
            width: 150,
          },
          {
            title: '生日日期',
            key: 'birthday',
            width: 150,
            render: (h,params)=>{
              return h('div',
                params.row.birthday
              )
            }
          },
          {
            title: '会员等级',
            key: 'customerMassLevel',
            width: 150,
            render: (h,params)=>{
              return h('div',
                this.renderCustomerMassLevel(params.row.customerMassLevel)
              )
            }
          },
          {
            title: '所属员工姓名',
            key: 'belongToEmployeeName',
            width: 150,
            render: (h,params)=>{
              return h('div',
                this.renderBelongToEmployeeName(params.row.belongToEmployeeId)
              )
            }
          },
          {
            title: '被介绍顾客姓名',
            key: 'introducedByCustomerId',
            width: 150,
            render: (h,params)=>{
              return h('div',
                this.renderIntroducedNameByCustomerName(params.row.introducedByCustomerId)
              )
            }
          },
          {
            title: '创建人',
            key: 'createBy',
            width: 200,
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 200,
            render: (h,params)=>{
              return h('div',
                formatStrDate_yymmddHHmmss(params.row.createTime)
              )
            }
          },
          {
            title: '修改人',
            key: 'updateBy',
            width: 200,
          },
          {
            title: '修改时间',
            key: 'updateTime',
            width: 200,
            render: (h,params)=>{
              return h('div',
                formatStrDate_yymmddHHmmss(params.row.updateTime)
              )
            }
          },
          {
            title: '操作',
            slot: 'action',
            width: 350,
            align: 'center',
            fixed: 'right'
          }
        ],

        appointmentStatusList:[],
        projectList:[],
        //以下是顾客预约记录
        appointment_data: [],
        appointment_phoneNumber:"",
        // 总数
        appointment_total:0,
        // 每页记录数
        appointment_pageSize:10,
        // 当前页
        appointment_currentPageNo:1,
        appointment_columns: [
          {
            title: '预约状态',
            key: 'appointmentStatus',
            width: 100,
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:this.renderColorByAppointmentStatus(params.row.appointmentStatus)
                  }},
                [ h('strong',this.renderAppointmentStatus(params.row.appointmentStatus))]
              )
            }
          },
          {
            title: '顾客姓名',
            key: 'customerId',
            width: 100,
            render: (h, params) => {
              return h('div', [
                this.renderCustomerName(params.row.customerId)
              ]);
            }
          },
          {
            title: '预约日期',
            key: 'appointmentDate',
            width: 120,
            render: (h,params)=>{
              return h('div',
                {
                  style:{color:this.renderColorByAppointmentDate(params.row.appointmentDate)}
                },getDatePeriod(params.row.appointmentDate)
              )
            }
          },
          {
            title: '预约时间',
            key: 'appointmentTime',
            width: 120,
            render: (h,params)=>{
              return h('div',
                {
                  style:{color:this.renderColorByAppointmentDate(params.row.appointmentDate)}
                },getTimePeriod(params.row.appointmentDate, params.row.appointmentTime)
              )
            }
          },
          {
            title: '预约员工',
            key: 'employeeId',
            width: 100,
            render: (h,params)=>{
              return h('div',
                this.renderBelongToEmployeeName(params.row.employeeId)
              )
            }
          },
          {
            title: '项目',
            key: 'projectIds',
            width: 300,
            render: (h,params)=>{
              return h('div',
                this.renderProjectName(params.row.projectIds)
              )
            }
          },
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
                this.renderCustomerName(params.row.customerId)
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
                formatAmount(params.row.rechargeAmount)
              ]);
            }
          },
          {
            title: '代金券金额',
            key: 'rechargeCoupon',
            width: 100,
            render: (h, params) => {
              return h('div', [
                formatAmount(params.row.rechargeCoupon)
              ]);
            }
          },
          {
            title: '消费金额',
            key: 'consumeAmount',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatAmount(params.row.consumeAmount)
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
      // 查询顾客集合
      queryCustomerList :async function () {
        let params = {
          //门店id - 少不了的参数
          'shopId':this.selectedShopId,
          //查询条件
          'customerName':this.searchCustomerName,
          'phoneNumber':this.searchPhoneNumber,
          'sex':this.searchSex,
          'customerMassLevel':this.searchCustomerMassLevel,
          'belongToEmployeeId':this.searchBelongToEmployeeId,
          //页码
          'pageNo':this.currentPageNo,
          'pageSize':this.pageSize,
        };
        let res = await queryCustomerList(params);
        this.data = res.data.records;
        this.total = res.data.total;
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
        this.searchSex = "";
        this.searchCustomerMassLevel = "";
        this.searchBelongToEmployeeId = "";
        //页码设置为默认值
        this.currentPageNo = 1;
        //重置后，重新查询
        this.queryCustomerList();
      },
      // 查店铺所有员工
      queryShopAllEmployeeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShopAllEmployeeList(params);
        this.shopAllemployeeList = res.data;
      },
      // 查店铺正常状态员工
      queryShopNormalEmployeeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShopNormalEmployeeList(params);
        this.shopNormalemployeeList = res.data;
      },
      //查询会员等级集合
      getAllCustomerMassLevelList:async function(){
        let params = {};
        let res = await getAllCustomerMassLevelList(params);
        this.allCustomerMassLevelList = res.data;
      },
      /**
       * 渲染顾客等级
       * @param str
       * @returns {string}
       */
      renderCustomerMassLevel :function (str) {
        for(let i = 0; i < this.allCustomerMassLevelList.length; i++){
          if (str === this.allCustomerMassLevelList[i].code) {
            return this.allCustomerMassLevelList[i].msg;
          }
        }
      },
      /**
       * 渲染顾客所属员工姓名
       * @param str
       * @returns {string}
       */
      renderBelongToEmployeeName : function(str){
        for(let i = 0; i < this.shopAllemployeeList.length; i++){
          if (str === this.shopAllemployeeList[i].employeeId) {
            return this.shopAllemployeeList[i].employeeName;
          }
        }
      },
      /**
       * 渲染被介绍顾客姓名
       * @param str
       * @returns {string}
       */
      renderIntroducedNameByCustomerName : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].customerName;
          }
        }
      },
      /**
       * 渲染被介绍顾客手机号
       * @param str
       * @returns {string}
       */
      renderIntroducedPhoneNumberByCustomerName : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].phoneNumber;
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
       * 根据状态渲染颜色
       * @param appointmentStatus
       * @returns {string}
       */
      renderColorByAppointmentStatus : function(appointmentStatus){
        if (appointmentStatus===1){
          return "blue";
        } else if (appointmentStatus === 2) {
          return "chartreuse";
        }else if (appointmentStatus === 3) {
          return "black";
        }
      },
      /**
       * 渲染预约状态
       * @param str
       * @returns {string}
       */
      renderAppointmentStatus : function(str){
        for(let i = 0; i < this.appointmentStatusList.length; i++){
          if (str === this.appointmentStatusList[i].code) {
            return this.appointmentStatusList[i].msg;
          }
        }
      },
      /**
       * 根据预约日期渲染颜色
       * @param appointmentDate
       * @returns {string}
       */
      renderColorByAppointmentDate:function(appointmentDate){
        if (dateIsToday(new Date(appointmentDate))){
          return "blue";
        }
      },
      /**
       * 渲染顾客姓名
       * @param str
       * @returns {string}
       */
      renderCustomerName : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].customerName;
          }
        }
      },
      /**
       * 渲染项目名称
       * @param projectIdsStr
       * @returns {string}
       */
      renderProjectName : function(projectIdsStr){
        let allProjectName = "";
        //根据逗号分隔projectIds
        let projectIdsArray = projectIdsStr.split(",");
        for (let i = 0; i < projectIdsArray.length; i++) {
          for(let j = 0; j < this.projectList.length; j++){
            if (projectIdsArray[i] === this.projectList[j].projectId.toString()) {
              allProjectName += this.projectList[j].projectName + " ,";
            }
          }
        }
        //去掉最后一个逗号
        if (allProjectName.endsWith(",")) {
          allProjectName = allProjectName.slice(0, -1);
        }
        return allProjectName;
      },
      /**
       * 是否有被介绍人 改变触发函数
       */
      hasIntroducedByCustomerChange_add:function(){
        this.addCustomerForm.showIntroducedByCustomer = this.addCustomerForm.hasIntroducedByCustomer !== "0";
      },
      /**
       * 是否有被介绍人 改变触发函数
       */
      hasIntroducedByCustomerChange_update:function(){
        this.updateCustomerForm.showIntroducedByCustomer = this.updateCustomerForm.hasIntroducedByCustomer !== "0";
      },
      /**
       * 根据手机号查询顾客，如果能查到则补充姓名
       */
      queryCustomerByPhoneNumber_add: async function(){
        if (!validatePhoneNumber(this.addCustomerForm.introducedByCustomerPhoneNumber)) {
          this.$Message.warning("手机号格式错误");
          return;
        }
        let params = {
          'phoneNumber':this.addCustomerForm.introducedByCustomerPhoneNumber,
        };
        let res = await queryCustomerByPhoneNumber(params);
        if (!validateEmpty(res.data)) {
          this.$Message.success("未查询到记录");
          //设置顾客名称
          this.addCustomerForm.introducedByCustomerName = "";
        }else{
          this.$Message.success("被介绍人存在");
          //设置顾客名称
          this.addCustomerForm.introducedByCustomerName = res.data.customerName;
        }
      },
      /**
       * 根据手机号查询顾客，如果能查到则补充姓名
       */
      queryCustomerByPhoneNumber_update: async function(){
        if (!validatePhoneNumber(this.updateCustomerForm.introducedByCustomerPhoneNumber)) {
          this.$Message.warning("手机号格式错误");
          return;
        }
        let params = {
          'phoneNumber':this.updateCustomerForm.introducedByCustomerPhoneNumber,
        };
        let res = await queryCustomerByPhoneNumber(params);
        if (!validateEmpty(res.data)) {
          this.$Message.success("未查询到记录");
          //设置顾客名称
          this.updateCustomerForm.introducedByCustomerName = "";
        }else{
          this.$Message.success("被介绍人存在");
          //设置顾客名称
          this.updateCustomerForm.introducedByCustomerName = res.data.customerName;
        }
      },
      // 显示添加顾客弹框
      showAddModal:function(){
        this.$refs.addCustomerModalRef.showModal();
      },
      // 显示修改顾客弹框
      showUpdateModal:function(index){
        this.updateCustomerForm.customerId = this.data[index].customerId;
        this.updateCustomerForm.customerName = this.data[index].customerName;
        this.updateCustomerForm.sex = this.data[index].sex;
        this.updateCustomerForm.phoneNumber = this.data[index].phoneNumber;
        this.updateCustomerForm.birthday = this.data[index].birthday;
        this.updateCustomerForm.customerMassLevel = this.data[index].customerMassLevel;
        this.updateCustomerForm.belongToEmployeeId = this.data[index].belongToEmployeeId;
        this.updateCustomerForm.hasIntroducedByCustomer = !validateEmpty(this.data[index].introducedByCustomerId)?"0":"1";
        this.updateCustomerForm.showIntroducedByCustomer = validateEmpty(this.data[index].introducedByCustomerId);
        this.updateCustomerForm.introducedByCustomerPhoneNumber = this.renderIntroducedPhoneNumberByCustomerName(this.data[index].introducedByCustomerId);
        this.updateCustomerForm.introducedByCustomerName = this.renderIntroducedNameByCustomerName(this.data[index].introducedByCustomerId);
        this.$refs.updateCustomerModalRef.showModal();
      },
      // 显示顾客预约记录弹框
      showAppointmentModal:function(index){
        this.appointment_phoneNumber = this.data[index].phoneNumber;
        this.queryAppointmentList_byPhoneNumber();
        this.$refs.customerAppointmentModalRef.showModal();
      },
      //显示充值记录弹框
      showRechargeListModal:function(index){
        this.recharge_phoneNumber = this.data[index].phoneNumber;
        this.totalCashAmount = formatAmount(this.data[index].totalCashAmount);
        this.totalCouponAmount = formatAmount(this.data[index].totalCouponAmount);
        this.totalAmount = formatAmount(this.data[index].totalCashAmount + this.data[index].totalCouponAmount);
        this.queryRechargeList_byPhoneNumber();
        this.$refs.customerRechargeListModalRef.showModal();
      },
      //根据手机号查顾客预约记录
      queryAppointmentList_byPhoneNumber:async function(){
        //组织入参
        let params = {
          //门店id - 少不了的参数
          'shopId':this.selectedShopId,
          //查询条件
          'phoneNumber':this.appointment_phoneNumber,
          //页码
          'pageNo':this.appointment_currentPageNo,
          'pageSize':this.appointment_pageSize,
        };

        //查询
        let res = await queryAppointmentList(params);
        this.appointment_data = res.data.records;
        this.appointment_total = res.data.total;
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
      //添加顾客
      addCustomer:async function(){
        let params = {};
        //生日日期特殊处理，分两种情况
        if (!validateEmpty(this.addCustomerForm.birthday)) {
          params = {
            'shopId':this.selectedShopId,
            'customerName':this.addCustomerForm.customerName,
            'sex':this.addCustomerForm.sex,
            'phoneNumber':this.addCustomerForm.phoneNumber,
            //生日为空就不传生日字段
            'customerMassLevel':this.addCustomerForm.customerMassLevel,
            'belongToEmployeeId':this.addCustomerForm.belongToEmployeeId,
            'hasIntroducedByCustomer':this.addCustomerForm.hasIntroducedByCustomer,
            'introducedByCustomerPhoneNumber':this.addCustomerForm.introducedByCustomerPhoneNumber,
            'introducedByCustomerName':this.addCustomerForm.introducedByCustomerName,
          };
        }else {
          params = {
            'shopId':this.selectedShopId,
            'customerName':this.addCustomerForm.customerName,
            'sex':this.addCustomerForm.sex,
            'phoneNumber':this.addCustomerForm.phoneNumber,
            'birthday':formatDate_yyyyMMdd(this.addCustomerForm.birthday),
            'customerMassLevel':this.addCustomerForm.customerMassLevel,
            'belongToEmployeeId':this.addCustomerForm.belongToEmployeeId,
            'hasIntroducedByCustomer':this.addCustomerForm.hasIntroducedByCustomer,
            'introducedByCustomerPhoneNumber':this.addCustomerForm.introducedByCustomerPhoneNumber,
            'introducedByCustomerName':this.addCustomerForm.introducedByCustomerName,
          };
        }

        let res = await addCustomer(params);
        if (res.code === '0000') {
          this.$refs.addCustomerFormRef.resetFields();
          this.addCustomerForm.hasIntroducedByCustomer = "0";
          this.addCustomerForm.showIntroducedByCustomer = false;
          this.$Message.success(res.msg);
          this.queryCustomerList();
          this.queryShopAllCustomer();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //修改顾客
      updateCustomer:async function () {
        let params = {};
        //生日日期特殊处理，分两种情况
        if (!validateEmpty(this.updateCustomerForm.birthday)) {
          params = {
            'customerId':this.updateCustomerForm.customerId,
            'shopId':this.selectedShopId,
            'customerName':this.updateCustomerForm.customerName,
            'sex':this.updateCustomerForm.sex,
            'phoneNumber':this.updateCustomerForm.phoneNumber,
            //生日为空就不传生日字段
            'customerMassLevel':this.updateCustomerForm.customerMassLevel,
            'belongToEmployeeId':this.updateCustomerForm.belongToEmployeeId,
            'hasIntroducedByCustomer':this.updateCustomerForm.hasIntroducedByCustomer,
            'introducedByCustomerPhoneNumber':this.updateCustomerForm.introducedByCustomerPhoneNumber,
            'introducedByCustomerName':this.updateCustomerForm.introducedByCustomerName,
          };
        }else {
          params = {
            'customerId':this.updateCustomerForm.customerId,
            'shopId':this.selectedShopId,
            'customerName':this.updateCustomerForm.customerName,
            'sex':this.updateCustomerForm.sex,
            'phoneNumber':this.updateCustomerForm.phoneNumber,
            'birthday':formatDate_yyyyMMdd(this.updateCustomerForm.birthday),
            'customerMassLevel':this.updateCustomerForm.customerMassLevel,
            'belongToEmployeeId':this.updateCustomerForm.belongToEmployeeId,
            'hasIntroducedByCustomer':this.updateCustomerForm.hasIntroducedByCustomer,
            'introducedByCustomerPhoneNumber':this.updateCustomerForm.introducedByCustomerPhoneNumber,
            'introducedByCustomerName':this.updateCustomerForm.introducedByCustomerName,
          };
        }

        let res = await updateCustomer(params);
        if (res.code === '0000') {
          this.$refs.updateCustomerFormRef.resetFields();
          this.updateCustomerForm.hasIntroducedByCustomer = "0";
          this.updateCustomerForm.showIntroducedByCustomer = false;
          this.$Message.success(res.msg);
          this.queryCustomerList();
          this.queryShopAllCustomer();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //查询预约状态集合
      queryAppointmentStatusList:async function(){
        let params = {};
        let res = await queryAppointmentStatusList(params);
        this.appointmentStatusList = res.data;
      },
      // 查询项目集合
      queryProjectList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryProjectList(params);
        this.projectList = res.data;
      },
      handleChange(pageNo){
        this.currentPageNo = pageNo;
        this.queryCustomerList();
      },
      handlePageSizeChange(pageSize){
        this.pageSize = pageSize;
        this.queryCustomerList();
      },
      appointment_handleChange(pageNo){
        this.appointment_currentPageNo = pageNo;
        this.queryAppointmentList_byPhoneNumber();
      },
      appointment_handlePageSizeChange(pageSize){
        this.appointment_pageSize = pageSize;
        this.queryAppointmentList_byPhoneNumber();
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

      //查会员等级
      this.getAllCustomerMassLevelList();

      //查店铺所有员工
      this.queryShopAllEmployeeList();

      //查店铺正常状态员工
      this.queryShopNormalEmployeeList();

      //查询所有顾客
      this.queryShopAllCustomer();

      //查顾客
      this.queryCustomerList();

      //查询预约状态集合
      this.queryAppointmentStatusList();

      //查项目集合
      this.queryProjectList();

    }
  }
</script>

<style scoped>

</style>
