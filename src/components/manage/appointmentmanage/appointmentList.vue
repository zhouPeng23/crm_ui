<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="4" >
        <Button type="warning" @click="showAddModal">添加预约</Button>
      </Col>
      <Col span="20">
        <Input v-model="searchPhoneNumber" placeholder="预约手机号码" clearable style="width: 150px" :maxlength="11"/>
        <DatePicker type="date" v-model="searchAppointmentDateStart" placeholder="开始日期" style="width: 200px" format="yyyy-MM-dd"/>
        <DatePicker type="date" v-model="searchAppointmentDateEnd" placeholder="结束日期" style="width: 200px" format="yyyy-MM-dd"/>
        <Select v-model="searchAppointmentStatus" style="width:100px" clearable>
          <Option v-for="item in appointmentStatusList" :value="item.code" :key="item.code">{{ item.msg }}</Option>
        </Select>
        <Button type="primary" shape="circle" icon="ios-search" @click="queryAppointmentList">查询</Button>
        <Button shape="circle" @click="resetQuery">重置</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Row>
              <Col span="6">&nbsp;</Col>
              <Col span="6"><Button type="primary" @click="showUpdateModal(index)">修改</Button></Col>
              <Col span="6"><Button type="error" @click="showDeleteModal(index)">作废</Button></Col>
            </Row>
          </template>
        </Table>

        <Page :total="total" :page-size="pageSize" show-total show-sizer :styles="{'text-align': 'center','margin-top': '10px'}" @on-change="handleChange" @on-page-size-change="handlePageSizeChange"/>

      </Col>
    </Row>

    <!--添加预约弹框-->
    <confirmModal ref="addCustomerModalRef" modal-title="添加预约:" :modal-width="600" @handleSubmit="addCustomer()">
      <Form ref="addCustomerFormRef" :model="addCustomerForm" :label-width="100" @submit.native.prevent>
        <FormItem label="预约姓名" prop="customerName" required>
          <Input type="text" v-model="addCustomerForm.customerName"></Input>
        </FormItem>
        <FormItem label="预约性别" prop="sex" required>
          <Select v-model="addCustomerForm.sex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预约手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="addCustomerForm.phoneNumber" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="生日日期" prop="birthday" required>
          <DatePicker type="date" v-model="addCustomerForm.birthday" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="所属员工" prop="belongToEmployeeId" required>
          <Select v-model="addCustomerForm.belongToEmployeeId" style="width:100px">
            <Option v-for="item in employeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </confirmModal>

    <!--修改预约弹框-->
    <confirmModal ref="updateCustomerModalRef" modal-title="修改预约:" :modal-width="600" @handleSubmit="updateCustomer()">
      <Form ref="updateCustomerFormRef" :model="updateCustomerForm" :label-width="100" @submit.native.prevent>
        <FormItem label="预约姓名" prop="customerName" required>
          <Input type="text" v-model="updateCustomerForm.customerName"></Input>
        </FormItem>
        <FormItem label="预约性别" prop="sex" required>
          <Select v-model="updateCustomerForm.sex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预约手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="updateCustomerForm.phoneNumber" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="生日日期" prop="birthday" required>
          <DatePicker type="date" v-model="updateCustomerForm.birthday" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="所属员工" prop="belongToEmployeeId" required>
          <Select v-model="updateCustomerForm.belongToEmployeeId" style="width:100px">
            <Option v-for="item in employeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除预约弹框-->
    <confirmModal ref="deleteCustomerModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteCustomer()">
      <div style="font-size: 14px;;">确认删除: {{deleteCustomerForm.customerName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
  import { formatDate_yyyyMMdd,formatStrDate_yymmddHHmmss,validateEmpty,validatePhoneNumber,formatAmount,addDays,formatHumanSexByNumber} from "../../../tools";
  import {queryAppointmentList,queryShopAllCustomer,queryProjectList,queryAppointmentStatusList,
    addAppointment,updateAppointment,queryEmployeeList,addCustomer,deleteCustomer,updateCustomer} from "../../../api/ApiList";
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
        pageSize:10,
        // 当前页
        currentPageNo:1,
        searchPhoneNumber:"",
        searchAppointmentDateStart:new Date(),
        searchAppointmentDateEnd:addDays(new Date(),10),
        searchAppointmentStatus:"",
        employeeList: [],
        customerList:[],
        projectList:[],
        appointmentStatusList:[],
        addCustomerForm:{
          customerName:"",
          sex:"",
          phoneNumber:"",
          birthday:"",
          customerMassLevel:"",
          belongToEmployeeId:"",
        },
        updateCustomerForm:{
          customerId:"",
          customerName:"",
          sex:"",
          phoneNumber:"",
          birthday:"",
          customerMassLevel:"",
          belongToEmployeeId:"",
        },
        deleteCustomerForm:{
          customerId:"",
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
            title: '顾客姓名',
            key: 'customerId',
            width: 200,
            fixed: 'left',
            render: (h, params) => {
              return h('div', [
                h('strong' ,
                  this.renderCustomerName(params.row.customerId))
              ]);
            }
          },
          {
            title: '性别',
            key: 'customerId',
            width: 200,
            render: (h,params)=>{
              return h('div',
                this.rendSexByCustomerId(params.row.customerId)
              )
            }
          },
          {
            title: '手机号',
            key: 'customerId',
            width: 200,
            render: (h,params)=>{
              return h('div',
                this.rendPhoneNumberByCustomerId(params.row.customerId)
              )
            }
          },
          {
            title: '预约日期',
            key: 'appointmentDate',
            width: 200,
          },
          {
            title: '预约时间',
            key: 'appointmentTime',
            width: 200,
          },
          {
            title: '项目',
            key: 'projectId',
            width: 200,
            render: (h,params)=>{
              return h('div',
                this.rendProjectName(params.row.projectId)
              )
            }
          },
          {
            title: '项目金额',
            key: 'projectPrice',
            width: 200,
            render: (h,params)=>{
              return h('div',
                formatAmount(params.row.projectPrice)
              )
            }
          },
          {
            title: '所属员工姓名',
            key: 'employeeId',
            width: 200,
            render: (h,params)=>{
              return h('div',
                this.renderBelongToEmployeeName(params.row.employeeId)
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
      // 查询员工集合
      queryEmployeeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryEmployeeList(params);
        this.employeeList = res.data;
      },
      // 查询顾客集合
      queryShopAllCustomer :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShopAllCustomer(params);
        this.customerList = res.data;
      },
      // 查询项目集合
      queryProjectList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryProjectList(params);
        this.projectList = res.data;
      },
      //查询预约状态集合
      queryAppointmentStatusList:async function(){
        let params = {};
        let res = await queryAppointmentStatusList(params);
        this.appointmentStatusList = res.data;
      },
      /**
       * 渲染预约所属员工姓名
       * @param str
       * @returns {string}
       */
      renderBelongToEmployeeName : function(str){
        for(let i = 0; i < this.employeeList.length; i++){
          if (str === this.employeeList[i].employeeId) {
            return this.employeeList[i].employeeName;
          }
        }
      },
      /**
       * 渲染顾客姓名
       * @param str
       * @returns {string}
       */
      renderCustomerName : function(str){
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
      rendSexByCustomerId : function(str){
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
      rendPhoneNumberByCustomerId : function(str){
        for(let i = 0; i < this.customerList.length; i++){
          if (str === this.customerList[i].customerId) {
            return this.customerList[i].phoneNumber;
          }
        }
      },
      /**
       * 渲染项目名称
       * @param str
       * @returns {string}
       */
      rendProjectName : function(str){
        for(let i = 0; i < this.projectList.length; i++){
          if (str === this.projectList[i].projectId) {
            return this.projectList[i].projectName;
          }
        }
      },
      // 显示添加预约弹框
      showAddModal:function(){
        this.$refs.addCustomerModalRef.showModal();
      },
      // 显示修改预约弹框
      showUpdateModal:function(index){
        this.updateCustomerForm.customerId = this.data[index].customerId;
        this.updateCustomerForm.customerName = this.data[index].customerName;
        this.updateCustomerForm.sex = this.data[index].sex;
        this.updateCustomerForm.phoneNumber = this.data[index].phoneNumber;
        this.updateCustomerForm.birthday = this.data[index].birthday;
        this.updateCustomerForm.customerMassLevel = this.data[index].customerMassLevel;
        this.updateCustomerForm.belongToEmployeeId = this.data[index].belongToEmployeeId;
        this.$refs.updateCustomerModalRef.showModal();
      },
      // 显示删除预约弹框
      showDeleteModal:function(index){
        this.deleteCustomerForm.customerId = this.data[index].customerId;
        this.deleteCustomerForm.customerName = this.data[index].customerName;
        this.$refs.deleteCustomerModalRef.showModal();
      },
      //添加预约
      addCustomer:async function(){
        let params = {
          'shopId':this.selectedShopId,
          'customerName':this.addCustomerForm.customerName,
          'sex':this.addCustomerForm.sex,
          'phoneNumber':this.addCustomerForm.phoneNumber,
          'birthday':this.addCustomerForm.birthday.length!==0 ? new Date(this.addCustomerForm.birthday).getTime() : "",
          'customerMassLevel':this.addCustomerForm.customerMassLevel,
          'belongToEmployeeId':this.addCustomerForm.belongToEmployeeId,
        };
        let res = await addCustomer(params);
        if (res.code === '0000') {
          this.$refs.addCustomerFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryAppointmentList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //修改预约
      updateCustomer:async function () {
        let params = {
          'customerId':this.updateCustomerForm.customerId,
          'shopId':this.selectedShopId,
          'customerName':this.updateCustomerForm.customerName,
          'sex':this.updateCustomerForm.sex,
          'phoneNumber':this.updateCustomerForm.phoneNumber,
          'birthday':this.updateCustomerForm.birthday.length!==0 ? new Date(this.updateCustomerForm.birthday).getTime() : "",
          'customerMassLevel':this.updateCustomerForm.customerMassLevel,
          'belongToEmployeeId':this.updateCustomerForm.belongToEmployeeId,
        };
        let res = await updateCustomer(params);
        if (res.code === '0000') {
          this.$refs.updateCustomerFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryAppointmentList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除预约
      deleteCustomer:async function () {
        let params = {
          'customerId':this.deleteCustomerForm.customerId
        };
        let res = await deleteCustomer(params);
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
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查预约
      this.queryAppointmentList();

      //查员工集合
      this.queryEmployeeList();

      //查顾客集合
      this.queryShopAllCustomer();

      //查项目集合
      this.queryProjectList();

      //查询预约状态集合
      this.queryAppointmentStatusList();

    }
  }
</script>

<style scoped>

</style>
