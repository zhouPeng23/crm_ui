<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="4" >
        <Button type="primary" @click="showAddModal">添加预约</Button>
      </Col>
      <Col span="20">
        <Input v-model="searchPhoneNumber" placeholder="预约手机号码" clearable style="width: 150px" :maxlength="11"/>
        <DatePicker type="date" v-model="searchAppointmentDateStart" placeholder="开始日期" style="width: 130px" format="yyyy-MM-dd"/>
        <DatePicker type="date" v-model="searchAppointmentDateEnd" placeholder="结束日期" style="width: 130px" format="yyyy-MM-dd"/>
        <Select v-model="searchAppointmentStatus" style="width:100px" clearable>
          <Option v-for="item in appointmentStatusList" :value="item.code" :key="item.code">{{ item.msg }}</Option>
        </Select>
        <Button type="primary" shape="circle" icon="ios-search" @click="queryAppointmentList">条件查询</Button>
        <Button shape="circle" type="success" @click="queryToday">今日所有</Button>
        <Button shape="circle" @click="resetQuery">重置</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Row>
              <Col span="6"><Button type="primary" @click="showUpdateModal(index)">修改</Button></Col>
              <Col span="6"><Button type="error" @click="showZuofeiModal(index)">作废</Button></Col>
              <Col span="6"><Button type="success" icon="ios-search" @click="showAppointmentModal(index)">预约记录</Button></Col>
            </Row>
          </template>
        </Table>

        <Page :total="total" :page-size="pageSize" show-total show-sizer :styles="{'text-align': 'center','margin-top': '10px'}" @on-change="handleChange" @on-page-size-change="handlePageSizeChange"/>

      </Col>
    </Row>

    <!--添加预约弹框-->
    <confirmModal ref="addAppointmentModalRef" modal-title="添加预约:" :modal-width="750" @handleSubmit="addAppointment()">
      <Form ref="addAppointmentFormRef" :model="addAppointmentForm" :label-width="100">
        <FormItem label="顾客手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="addAppointmentForm.phoneNumber" :maxlength="11" style="width: 200px"></Input>
          <Button type="primary" ghost @click="queryCustomerByPhoneNumber">查询</Button>
        </FormItem>
        <FormItem label="顾客姓名" prop="customerName">
          <Input type="text" v-model="addAppointmentForm.customerName" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="顾客性别" prop="sex">
          <Select v-model="addAppointmentForm.sex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预约日期" prop="appointmentDate" required>
          <DatePicker type="date" v-model="addAppointmentForm.appointmentDate" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="预约员工" required>
          <Row>
            <Col span="4">
              <FormItem prop="employeeId">
                <Select v-model="addAppointmentForm.employeeId" style="width:100px" :onchange="employeeIdChange_add()">
                  <Option v-for="item in shopNormalemployeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="20">
              <FormItem prop="employeeShiftTimeSelected">
                <RadioGroup v-model="addAppointmentForm.employeeShiftTimeSelected" type="button" :onclick="selectThisShiftTime(addAppointmentForm.employeeShiftTimeSelected)">
                  <Radio v-for="(item,index) in addAppointmentForm.employeeShiftTimeAll.split(',')" :key="Math.random()" :label="item"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="预约时间" prop="appointmentTime" required>
          <TimePicker format="HH:mm" v-model="addAppointmentForm.appointmentTime" placeholder="请选择" style="width: 100px" />
        </FormItem>
        <FormItem label="预约项目" prop="projectIds" required>
          <Select v-model="addAppointmentForm.projectIds" filterable multiple >
            <Option v-for="item in projectList" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </confirmModal>

    <!--修改预约弹框-->
    <confirmModal ref="updateAppointmentModalRef" modal-title="修改预约:" :modal-width="750" @handleSubmit="updateAppointment()">
      <Form ref="updateAppointmentFormRef" :model="updateAppointmentForm" :label-width="100" @submit.native.prevent>
        <FormItem label="顾客手机号码" prop="phoneNumber">
          <Input type="text" v-model="updateAppointmentForm.phoneNumber" :maxlength="11" style="width: 200px" disabled></Input>
        </FormItem>
        <FormItem label="顾客姓名" prop="customerName">
          <Input type="text" v-model="updateAppointmentForm.customerName" style="width: 200px" disabled></Input>
        </FormItem>
        <FormItem label="顾客性别" prop="sex">
          <Select v-model="updateAppointmentForm.sex" style="width:100px" disabled>
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预约日期" prop="appointmentDate" required>
          <DatePicker type="date" v-model="updateAppointmentForm.appointmentDate" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="预约员工" prop="employeeId" required>
          <Select v-model="updateAppointmentForm.employeeId" style="width:100px">
            <Option v-for="item in shopNormalemployeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预约时间" prop="appointmentTime" required>
          <TimePicker format="HH:mm" v-model="updateAppointmentForm.appointmentTime" placeholder="请选择" style="width: 100px"/>
        </FormItem>
        <FormItem label="预约项目" prop="projectIds" required>
          <Select v-model="updateAppointmentForm.projectIds" filterable multiple >
            <Option v-for="item in projectList" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预约状态" prop="appointmentStatus" required>
          <Select v-model="updateAppointmentForm.appointmentStatus" style="width:100px">
            <Option v-for="item in appointmentStatusList" :value="item.code" :key="item.code">{{ item.msg }}</Option>
          </Select>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认作废预约弹框-->
    <confirmModal ref="zuofeiAppointmentModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="zuofeiAppointment()">
      <div style="font-size: 14px;;">确认作废: “ <span style="color: red">{{zuofeiAppointmentForm.customerName}}</span> ” 的预约单?</div>
    </confirmModal>

    <!--顾客预约记录弹框-->
    <confirmModal ref="customerAppointmentModalRef" modal-title="顾客预约记录:" :modal-width="1000">
      <Table border :columns="appointment_columns" :data="appointment_data"></Table>
      <Page :total="appointment_total" :page-size="appointment_pageSize" show-total show-sizer :styles="{'text-align': 'center','margin-top': '10px'}" @on-change="appointment_handleChange" @on-page-size-change="appointment_handlePageSizeChange"/>
    </confirmModal>

  </div>
</template>

<script>
  import { formatDate_yyyyMMdd,formatStrDate_yymmddHHmmss,validateEmpty,validatePhoneNumber,formatAmount,addDays,
    formatHumanSexByNumber,dateIsToday,getDatePeriod,getTimePeriod,formatAppointmentTime2Str} from "../../../tools/index";
  import {queryAppointmentList,queryShopAllCustomer,queryShopNormalEmployeeList,queryProjectList,queryAppointmentStatusList,queryCustomerByPhoneNumber,
    addAppointment,updateAppointment,queryShopAllEmployeeList,zuofeiAppointment,queryShiftTimeList} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "appointmentList",
    components: {confirmModal},
    data () {
      return {
        selectedShopId:"",
        selectedShopName:"",
        data: [],
        // 总数
        total:0,
        // 每页记录数
        pageSize:40,
        // 当前页
        currentPageNo:1,
        searchPhoneNumber:"",
        searchAppointmentDateStart:new Date(),
        searchAppointmentDateEnd:addDays(new Date(),10),
        searchAppointmentStatus:"",
        shopAllemployeeList: [],
        shopNormalemployeeList:[],
        allCustomerList:[],
        projectList:[],
        allShiftTimeList:[],
        appointmentStatusList:[],
        addAppointmentForm:{
          phoneNumber:"",
          customerName:"",
          sex:"",
          appointmentDate:"",
          appointmentTime:"",
          projectIds:[],
          employeeId:"",
          employeeShiftTimeAll:"",
          employeeShiftTimeSelected:"",
          employeeShiftTimeSelected_lasttime:"",
        },
        updateAppointmentForm:{
          appointmentId:"",
          phoneNumber:"",
          customerName:"",
          sex:"",
          appointmentDate:"",
          appointmentTime:"",
          projectIds:[],
          employeeId:"",
          appointmentStatus:"",
        },
        zuofeiAppointmentForm:{
          appointmentId:"",
          customerName:""
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
            title: '预约状态',
            key: 'appointmentStatus',
            width: 100,
            fixed: 'left',
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
            width: 230,
            render: (h,params)=>{
              return h('div',
                this.renderProjectName(params.row.projectIds)
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
            width: 300,
            align: 'center',
            fixed: 'right'
          }
        ],

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
      }
    },
    methods:{
      // 查询预约集合
      queryAppointmentList :async function () {
        //查询参数
        let params = {};

        //思路: 手机号如果不为空，则精确查找, 如果为空，则不根据手机号查找，而是根据其他条件查
        if (!validateEmpty(this.searchPhoneNumber)) {
          //手机号为空,那么两个日期都必填, 预约状态非必选
          if (!validateEmpty(this.searchAppointmentDateStart)) {
            this.$Message.warning("请选择开始日期");
            return;
          }
          if (!validateEmpty(this.searchAppointmentDateEnd)) {
            this.$Message.warning("请选择结束日期");
            return;
          }
          if (this.searchAppointmentDateEnd.getTime() < this.searchAppointmentDateStart.getTime()) {
            this.$Message.warning("结束日期必须大于或等于开始日期");
            return;
          }
          //组织入参
          params = {
            //门店id - 少不了的参数
            'shopId':this.selectedShopId,
            //查询条件
            'appointmentDateStart':formatDate_yyyyMMdd(this.searchAppointmentDateStart),
            'appointmentDateEnd':formatDate_yyyyMMdd(this.searchAppointmentDateEnd),
            'appointmentStatus':this.searchAppointmentStatus,
            //页码
            'pageNo':this.currentPageNo,
            'pageSize':this.pageSize,
          };

        }else{
          //手机号不为空，校验格式，必须填入一个完整手机号查
          if (!validatePhoneNumber(this.searchPhoneNumber)){
            this.$Message.warning("请输入11位完整手机号");
            return;
          }
          //将其他三个参数置空
          this.searchAppointmentDateStart = "";
          this.searchAppointmentDateEnd = "";
          this.searchAppointmentStatus = "";
          //组织入参
          params = {
            //门店id - 少不了的参数
            'shopId':this.selectedShopId,
            //查询条件
            'phoneNumber':this.searchPhoneNumber,
            //页码
            'pageNo':this.currentPageNo,
            'pageSize':this.pageSize,
          };
        }

        //查询
        let res = await queryAppointmentList(params);
        this.data = res.data.records;
        this.total = res.data.total;
      },
      queryToday:function(){
        //查询条件设置为空
        this.searchPhoneNumber = "";
        this.searchAppointmentDateStart = new Date();
        this.searchAppointmentDateEnd = new Date();
        this.searchAppointmentStatus = "";
        //页码设置为默认值
        this.currentPageNo = 1;
        //重置后，重新查询
        this.queryAppointmentList();
      },
      resetQuery: function(){
        //查询条件设置为空
        this.searchPhoneNumber = "";
        this.searchAppointmentDateStart = new Date();
        this.searchAppointmentDateEnd = addDays(new Date(),10);
        this.searchAppointmentStatus = "";
        //页码设置为默认值
        this.currentPageNo = 1;
        //重置后，重新查询
        this.queryAppointmentList();
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
      // 查询顾客集合
      queryShopAllCustomer :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShopAllCustomer(params);
        this.allCustomerList = res.data;
      },
      // 查询项目集合
      queryProjectList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryProjectList(params);
        this.projectList = res.data;
      },
      // 查询店铺下所有班次集合
      queryShiftTimeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShiftTimeList(params);
        this.allShiftTimeList = res.data;
      },
      //查询预约状态集合
      queryAppointmentStatusList:async function(){
        let params = {};
        let res = await queryAppointmentStatusList(params);
        this.appointmentStatusList = res.data;
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
       * 渲染预约预约员工姓名
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
       * 获取顾客性别code
       * @param str
       * @returns {string}
       */
      getSexIdByCustomerId : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].sex;
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
       * 获取项目id数组
       * @param projectIdsStr
       */
      getProjectIdsArray : function(projectIdsStr){
        let projectIdsArray = projectIdsStr.split(",");
        let intArray = [];
        for (let i = 0; i < projectIdsArray.length; i++) {
          intArray.push(parseInt(projectIdsArray[i]));
        }
        return intArray;
      },
      // 显示添加预约弹框
      showAddModal:function(){
        this.$refs.addAppointmentModalRef.showModal();
      },
      //添加预约，预约员工改变触发函数
      employeeIdChange_add: function(){
        let employeeId = this.addAppointmentForm.employeeId;
        let shiftId = "";
        //查到班次id
        for(let i = 0; i < this.shopAllemployeeList.length; i++){
          if (employeeId === this.shopAllemployeeList[i].employeeId) {
            shiftId = this.shopAllemployeeList[i].shiftId;
          }
        }
        //根据班次id查班次时间
        let shiftTimesStr = "";
        for(let i = 0; i < this.allShiftTimeList.length; i++){
          if (shiftId === this.allShiftTimeList[i].shiftId) {
            shiftTimesStr += this.allShiftTimeList[i].startTime.substring(0,5) +"-"+ this.allShiftTimeList[i].endTime.substring(0,5) +",";
          }
        }
        shiftTimesStr = shiftTimesStr.substring(0,shiftTimesStr.length-1);
        console.log(shiftTimesStr);
        this.addAppointmentForm.employeeShiftTimeAll = shiftTimesStr;
      },
      //选择该时间
      selectThisShiftTime:function(employeeShiftTimeSelected){

        if (this.addAppointmentForm.employeeShiftTimeSelected_lasttime === employeeShiftTimeSelected) {
          return;
        }else{
          this.addAppointmentForm.employeeShiftTimeSelected_lasttime = employeeShiftTimeSelected;
        }

        this.addAppointmentForm.appointmentTime = employeeShiftTimeSelected.substring(0,5);
        console.log("真正预约时间:"+this.addAppointmentForm.appointmentTime);
      },
      /**
       * 根据手机号查询顾客，如果能查到则补充姓名、性别
       */
      queryCustomerByPhoneNumber: async function(){
        if (!validatePhoneNumber(this.addAppointmentForm.phoneNumber)) {
          this.$Message.warning("手机号格式错误");
          return;
        }
        let params = {
          'phoneNumber':this.addAppointmentForm.phoneNumber,
        };
        let res = await queryCustomerByPhoneNumber(params);
        if (!validateEmpty(res.data)) {
          this.$Message.success("未查询到记录");
          this.addAppointmentForm.customerName = "";
          this.addAppointmentForm.sex = "";
        }else{
          this.$Message.success("老顾客");
          //设置顾客名称、性别
          this.addAppointmentForm.customerName = res.data.customerName;
          this.addAppointmentForm.sex = res.data.sex;
        }
      },
      // 显示修改预约弹框
      showUpdateModal:function(index){
        this.updateAppointmentForm.appointmentId = this.data[index].appointmentId;
        this.updateAppointmentForm.phoneNumber = this.renderPhoneNumberByCustomerId(this.data[index].customerId);
        this.updateAppointmentForm.customerName = this.renderCustomerName(this.data[index].customerId);
        this.updateAppointmentForm.sex = this.getSexIdByCustomerId(this.data[index].customerId);
        this.updateAppointmentForm.appointmentDate = this.data[index].appointmentDate;
        this.updateAppointmentForm.appointmentTime = this.data[index].appointmentTime;
        this.updateAppointmentForm.projectIds = this.getProjectIdsArray(this.data[index].projectIds);
        this.updateAppointmentForm.employeeId = this.data[index].employeeId;
        this.updateAppointmentForm.appointmentStatus = this.data[index].appointmentStatus;
        this.$refs.updateAppointmentModalRef.showModal();
      },
      // 显示作废预约弹框
      showZuofeiModal:function(index){
        this.zuofeiAppointmentForm.appointmentId = this.data[index].appointmentId;
        this.zuofeiAppointmentForm.customerName = this.renderCustomerName(this.data[index].customerId);
        this.$refs.zuofeiAppointmentModalRef.showModal();
      },
      // 显示顾客预约记录弹框
      showAppointmentModal:function(index){
        this.appointment_phoneNumber = this.renderPhoneNumberByCustomerId(this.data[index].customerId);
        this.queryAppointmentList_byPhoneNumber();
        this.$refs.customerAppointmentModalRef.showModal();
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
      //添加预约
      addAppointment:async function(){
        if (!validateEmpty(this.addAppointmentForm.appointmentDate)) {
          this.$Message.warning("预约日期不能为空");
          return;
        }
        if (!validateEmpty(this.addAppointmentForm.appointmentTime)) {
          this.$Message.warning("预约时间不能为空");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'phoneNumber':this.addAppointmentForm.phoneNumber,
          'customerName':this.addAppointmentForm.customerName,
          'sex':this.addAppointmentForm.sex,
          'appointmentDate':formatDate_yyyyMMdd(this.addAppointmentForm.appointmentDate),
          'appointmentTime':formatAppointmentTime2Str(this.addAppointmentForm.appointmentTime),
          'projectIds':this.addAppointmentForm.projectIds.join(","),
          'employeeId':this.addAppointmentForm.employeeId,
        };
        let res = await addAppointment(params);
        if (res.code === '0000') {
          this.$refs.addAppointmentFormRef.resetFields();
          this.$Message.success(res.msg);
          //查顾客集合，再查预约记录，因为有的顾客是新顾客，需要重新查询顾客集合
          this.queryShopAllCustomer();
          this.queryAppointmentList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //修改预约
      updateAppointment:async function () {
        if (!validateEmpty(this.updateAppointmentForm.appointmentDate)) {
          this.$Message.warning("预约日期不能为空");
          return;
        }
        if (!validateEmpty(this.updateAppointmentForm.appointmentTime)) {
          this.$Message.warning("预约时间不能为空");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'appointmentId':this.updateAppointmentForm.appointmentId,
          'appointmentDate':formatDate_yyyyMMdd(this.updateAppointmentForm.appointmentDate),
          'appointmentTime':formatAppointmentTime2Str(this.updateAppointmentForm.appointmentTime),
          'projectIds':this.updateAppointmentForm.projectIds.join(","),
          'employeeId':this.updateAppointmentForm.employeeId,
          'appointmentStatus':this.updateAppointmentForm.appointmentStatus,
        };
        let res = await updateAppointment(params);
        if (res.code === '0000') {
          this.$refs.updateAppointmentFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryAppointmentList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //作废预约
      zuofeiAppointment:async function () {
        let params = {
          'appointmentId':this.zuofeiAppointmentForm.appointmentId
        };
        let res = await zuofeiAppointment(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryAppointmentList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      handleChange(pageNo){
        this.currentPageNo = pageNo;
        this.queryAppointmentList();
      },
      handlePageSizeChange(pageSize){
        this.pageSize = pageSize;
        this.queryAppointmentList();
      },
      appointment_handleChange(pageNo){
        this.appointment_currentPageNo = pageNo;
        this.queryAppointmentList_byPhoneNumber();
      },
      appointment_handlePageSizeChange(pageSize){
        this.appointment_pageSize = pageSize;
        this.queryAppointmentList_byPhoneNumber();
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查预约
      this.queryAppointmentList();

      //查店铺所有员工
      this.queryShopAllEmployeeList();

      //查店铺正常状态员工
      this.queryShopNormalEmployeeList();

      //查顾客集合
      this.queryShopAllCustomer();

      //查项目集合
      this.queryProjectList();

      //查询店铺下所有班次集合
      this.queryShiftTimeList();

      //查询预约状态集合
      this.queryAppointmentStatusList();

    }
  }
</script>

<style scoped>

</style>
