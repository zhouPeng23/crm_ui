<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="4" >
        &nbsp;
      </Col>
      <Col span="20">
        <DatePicker type="date" v-model="searchStartDate" placeholder="开始日期" style="width: 130px" format="yyyy-MM-dd"/>
        <DatePicker type="date" v-model="searchEndDate" placeholder="结束日期" style="width: 130px" format="yyyy-MM-dd"/>
        <Select v-model="searchEmployeeId" style="width:100px" clearable>
          <Option v-for="item in shopNormalemployeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
        </Select>
        <Button type="primary" shape="circle" icon="ios-search" @click="queryEmployeeOverTimeList">条件查询</Button>
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

  </div>
</template>

<script>
  import { formatDate_yyyyMMdd,formatStrDate_yymmddHHmmss ,validateEmpty,addDays} from "../../../tools";
  import {queryEmployeeOverTimeList,queryShopNormalEmployeeList,queryAppointmentByIds,
    queryCustomerListByAppointmentIds,queryProjectList,queryAppointmentStatusList} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "employeeOverTimeList",
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
        searchEmployeeId:"",
        searchStartDate:addDays(new Date(),-31),
        searchEndDate:addDays(new Date(),1),
        shopNormalemployeeList: [],
        customerList:[],
        appointmentList:[],
        projectList:[],
        appointmentStatusList:[],
        columns: [
          {
            title: '员工id',
            key: 'employeeId',
            width: 150,
            fixed: 'left',
            render: (h, params) => {
              return h('div', [
                h('strong' ,this.renderEmployeeName(params.row.employeeId))
              ]);
            }
          },
          {
            title: '员工班次时间详情',
            key: 'shiftTimeStr',
            width: 400,
          },
          {
            title: '顾客姓名',
            key: 'customerId',
            width: 120,
            render: (h,params)=>{
              return h('div',
                this.renderCustomerName(params.row.appointmentId)
              )
            }
          },
          {
            title: '预约单日期',
            key: 'appointmentId',
            width: 120,
            render: (h,params)=>{
              return h('div',
                this.renderAppointmentDate(params.row.appointmentId)
              )
            }
          },
          {
            title: '预约单时间',
            key: 'appointmentId',
            width: 120,
            render: (h,params)=>{
              return h('div',
                this.renderAppointmentTime(params.row.appointmentId)
              )
            }
          },
          {
            title: '预约单项目',
            key: 'appointmentId',
            width: 200,
            render: (h,params)=>{
              return h('div',
                this.renderProjectName(params.row.appointmentId)
              )
            }
          },
          {
            title: '预约单状态',
            key: 'appointmentId',
            width: 200,
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:this.renderColorByAppointmentStatus(params.row.appointmentId)
                  }},
                [ h('strong',this.renderAppointmentStatus(params.row.appointmentId))]
              )
            }
          },
        ],
      }
    },
    methods:{
      // 查询员工集合
      queryEmployeeOverTimeList :async function () {
        let params = {
          'shopId': this.selectedShopId,
          //查询参数
          'employeeId':this.searchEmployeeId,
          'startDate':formatDate_yyyyMMdd(this.searchStartDate),
          'endDate':formatDate_yyyyMMdd(this.searchEndDate),
          //页码
          'pageNo':this.currentPageNo,
          'pageSize':this.pageSize,
        };
        let res = await queryEmployeeOverTimeList(params);
        if (res.code === '0000') {
          this.data = res.data.records;
          this.total = res.data.total;

          //批量查预约单
          let appointmentIds = "";
          for(let i = 0; i < this.data.length; i++){
            appointmentIds += this.data[i].appointmentId+",";
          }
          params = {
            "appointmentIds": appointmentIds.slice(0, -1),
          };
          let result = await queryAppointmentByIds(params);
          this.appointmentList = result.data;

          //批量查顾客
          params = {
            "appointmentIds": appointmentIds.slice(0, -1),
          };
          let customerResult = await queryCustomerListByAppointmentIds(params);
          this.customerList = customerResult.data;
        }
      },
      // 查店铺正常状态员工
      queryShopNormalEmployeeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShopNormalEmployeeList(params);
        this.shopNormalemployeeList = res.data;
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
       * 渲染员工姓名
       * @param str
       * @returns {string}
       */
      renderEmployeeName : function(str){
        for(let i = 0; i < this.shopNormalemployeeList.length; i++){
          if (str === this.shopNormalemployeeList[i].employeeId) {
            return this.shopNormalemployeeList[i].employeeName;
          }
        }
      },
      /**
       * 渲染顾客姓名
       * @param appointmentId
       * @returns {string}
       */
      renderCustomerName : function(appointmentId){
        let customerId = "";
        //先找预约单
        for(let i = 0; i < this.appointmentList.length; i++){
          if (appointmentId === this.appointmentList[i].appointmentId) {
            customerId =  this.appointmentList[i].customerId;
          }
        }
        //查顾客姓名
        for(let i = 0; i < this.customerList.length; i++){
          if (customerId === this.customerList[i].customerId) {
            return this.customerList[i].customerName;
          }
        }
      },
      /**
       * 渲染预约单日期
       * @param appointmentId
       * @returns {string}
       */
      renderAppointmentDate : function(appointmentId){
        for(let i = 0; i < this.appointmentList.length; i++){
          if (appointmentId === this.appointmentList[i].appointmentId) {
            return this.appointmentList[i].appointmentDate;
          }
        }
      },
      /**
       * 渲染预约单时间
       * @param appointmentId
       * @returns {string}
       */
      renderAppointmentTime : function(appointmentId){
        for(let i = 0; i < this.appointmentList.length; i++){
          if (appointmentId === this.appointmentList[i].appointmentId) {
            return this.appointmentList[i].appointmentTime;
          }
        }
      },
      /**
       * 渲染预约单项目
       * @param appointmentId
       * @returns {string}
       */
      renderProjectName : function(appointmentId){
        let projectIdsStr = "";
        //先找预约单
        for(let i = 0; i < this.appointmentList.length; i++){
          if (appointmentId === this.appointmentList[i].appointmentId) {
            projectIdsStr =  this.appointmentList[i].projectIds;
          }
        }
        //查项目
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
       * 渲染预约状态
       * @param appointmentId
       * @returns {string}
       */
      renderAppointmentStatus : function(appointmentId){
        let appointmentStatus = "";
        //先找预约单
        for(let i = 0; i < this.appointmentList.length; i++){
          if (appointmentId === this.appointmentList[i].appointmentId) {
            appointmentStatus =  this.appointmentList[i].appointmentStatus;
          }
        }

        for(let i = 0; i < this.appointmentStatusList.length; i++){
          if (appointmentStatus === this.appointmentStatusList[i].code) {
            return this.appointmentStatusList[i].msg;
          }
        }
      },
      /**
       * 根据状态渲染颜色
       * @param appointmentId
       * @returns {string}
       */
      renderColorByAppointmentStatus : function(appointmentId){
        let appointmentStatus = "";
        //先找预约单
        for(let i = 0; i < this.appointmentList.length; i++){
          if (appointmentId === this.appointmentList[i].appointmentId) {
            appointmentStatus =  this.appointmentList[i].appointmentStatus;
          }
        }

        if (appointmentStatus===1){
          return "blue";
        } else if (appointmentStatus === 2) {
          return "chartreuse";
        }else if (appointmentStatus === 3) {
          return "black";
        }
      },
      handleChange(pageNo){
        this.currentPageNo = pageNo;
        this.queryEmployeeOverTimeList();
      },
      handlePageSizeChange(pageSize){
        this.pageSize = pageSize;
        this.queryEmployeeOverTimeList();
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查项目集合
      this.queryProjectList();

      // 查店铺正常状态员工
      this.queryShopNormalEmployeeList();

      //查员工加班记录
      this.queryEmployeeOverTimeList();

      //查询预约状态集合
      this.queryAppointmentStatusList();

    }
  }
</script>

<style scoped>

</style>
