<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="6" >
        &nbsp;
      </Col>
      <Col span="18">
        <Input v-model="searchCustomerName" placeholder="姓名" clearable style="width: 150px" />
        <Input v-model="searchPhoneNumber" placeholder="手机号" clearable style="width: 150px" :maxlength="11"/>
        <Button type="primary" shape="circle" icon="ios-search" @click="queryCustomerIncomeList">查询</Button>
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

    <!--预约单详情-->
    <confirmModal ref="showAppointmentDetailModalRef" modal-title="预约单详情:" :modal-width="600">
      <Form :model="showAppointmentDetailForm" :label-width="120" @submit.native.prevent>

      </Form>
    </confirmModal>

  </div>
</template>

<script>
  import { formatDate_yyyyMMdd,formatStrDate_yymmddHHmmss,validateEmpty,formatHumanSexByNumber,validatePhoneNumber,formatAmount,formatCustomerIncomeAmount} from "../../../tools";
  import {queryCustomerIncomeList,queryShopAllCustomer,queryProjectList,queryAppointmentByIds,queryAppointmentStatusList} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "customerIncomeList",
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
        projectList:[],
        currentPageAppointmentList:[],
        appointmentStatusList:[],
        showAppointmentDetailForm:{
          customerName:"",
        },
        columns: [
          {
            title: '姓名',
            key: 'customerId',
            width: 100,
            fixed: 'left',
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:"orange"
                  }},
                [ h('strong',this.renderCustomerNameByCustomerId(params.row.customerId))]
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
          // {
          //   title: '性别',
          //   key: 'sex',
          //   width: 70,
          //   render: (h,params)=>{
          //     return h('div',
          //       formatHumanSexByNumber(this.renderSexByCustomerId(params.row.customerId))
          //     )
          //   }
          // },
          {
            title: '介绍的顾客姓名',
            key: 'introduceCustomerId',
            width: 150,
            render: (h,params)=>{
              return h('div',
                this.renderIntroduceCustomerNameByCustomerId(params.row.introduceCustomerId)
              )
            }
          },
          {
            title: '介绍的顾客手机号',
            key: 'introduceCustomerId',
            width: 140,
            render: (h,params)=>{
              return h('div',
                this.renderIntroduceCustomerPhoneNumberByCustomerId(params.row.introduceCustomerId)
              )
            }
          },
          {
            title: '预约日期+时间',
            key: 'introduceCustomerAppointmentId',
            width: 160,
            render: (h,params)=>{
              return h('div',
                this.findAppointmentDateById(params.row.introduceCustomerAppointmentId)
              )
            }
          },
          {
            title: '预约单项目',
            key: 'introduceCustomerAppointmentId',
            width: 258,
            render: (h,params)=>{
              return h('div',
                this.renderProjectNameByAppointmentId(params.row.introduceCustomerAppointmentId)
              )
            }
          },
          {
            title: '项目总金额',
            key: 'introduceCustomerAppointmentId',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatAmount(this.findAppointmentProjectPriceById(params.row.introduceCustomerAppointmentId))
              )
            }
          },
          {
            title: '本单收益金额',
            key: 'introduceCustomerAppointmentId',
            width: 120,
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:"orange"
                  }},
                [ h('strong',"+"+formatCustomerIncomeAmount(this.findAppointmentProjectPriceById(params.row.introduceCustomerAppointmentId),0.05))]
              )
            }
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
            title: '预约单状态',
            key: 'introduceCustomerAppointmentId',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:this.renderColorByAppointmentStatus(this.findAppointmentStatusById(params.row.introduceCustomerAppointmentId))
                  }},
                [ h('strong',this.renderAppointmentStatus(this.findAppointmentStatusById(params.row.introduceCustomerAppointmentId)))]
              )
            }
          },
        ],
      }
    },
    methods:{
      // 查询顾客收益集合
      queryCustomerIncomeList :async function () {
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
        let res = await queryCustomerIncomeList(params);
        if (res.code === '0000') {
          this.data = res.data.records;
          this.total = res.data.total;
          //查询当前分页中预约单集合
          this.queryCurrentPageAppointment();
        }else {
          this.$Message.error(res.msg);
        }
      },
      queryCurrentPageAppointment:async function(){
        if (this.data.length === 0) {
          return;
        }
        let appointmentIds = "";
        for (let i = 0; i < this.data.length; i++) {
          appointmentIds += this.data[i].introduceCustomerAppointmentId+","
        }
        // 截取字符串，去掉最后一个字符
        appointmentIds = appointmentIds.slice(0, -1);
        let params = {
          'appointmentIds':appointmentIds,
        };
        let res = await queryAppointmentByIds(params);
        this.currentPageAppointmentList = res.data;
      },
      queryShopAllCustomer:async function(){
        let params = {
          'shopId':this.selectedShopId,
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
      //查询预约状态集合
      queryAppointmentStatusList:async function(){
        let params = {};
        let res = await queryAppointmentStatusList(params);
        this.appointmentStatusList = res.data;
      },
      resetQuery: function(){
        //查询条件设置为空
        this.searchCustomerName = "";
        this.searchPhoneNumber = "";
        //页码设置为默认值
        this.currentPageNo = 1;
        //重置后，重新查询
        this.queryCustomerIncomeList();
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
       * 渲染介绍的顾客姓名
       * @param str
       * @returns {string}
       */
      renderIntroduceCustomerNameByCustomerId : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].customerName;
          }
        }
      },
      /**
       * 渲染介绍的顾客手机号
       * @param str
       * @returns {string}
       */
      renderIntroduceCustomerPhoneNumberByCustomerId : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].phoneNumber;
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
       * 渲染顾客性别
       * @param str
       * @returns {string}
       */
      renderSexByCustomerId : function(str){
        for(let i = 0; i < this.allCustomerList.length; i++){
          if (str === this.allCustomerList[i].customerId) {
            return this.allCustomerList[i].sex;
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
       * 根据预约id查找预约单projectIds
       * @param appointmentId
       * @returns {string}
       */
      findAppointmentProjectIdsById : function(appointmentId){
        for(let i = 0; i < this.currentPageAppointmentList.length; i++){
          if (appointmentId === this.currentPageAppointmentList[i].appointmentId) {
            return this.currentPageAppointmentList[i].projectIds;
          }
        }
      },
      /**
       * 根据预约id查找预约单projectPrice
       * @param appointmentId
       * @returns {string}
       */
      findAppointmentProjectPriceById : function(appointmentId){
        for(let i = 0; i < this.currentPageAppointmentList.length; i++){
          if (appointmentId === this.currentPageAppointmentList[i].appointmentId) {
            return this.currentPageAppointmentList[i].projectPrice;
          }
        }
      },
      /**
       * 根据预约id查找预约单status
       * @param appointmentId
       * @returns {string}
       */
      findAppointmentStatusById : function(appointmentId){
        for(let i = 0; i < this.currentPageAppointmentList.length; i++){
          if (appointmentId === this.currentPageAppointmentList[i].appointmentId) {
            return this.currentPageAppointmentList[i].appointmentStatus;
          }
        }
      },
      /**
       * 根据预约id查找预约单日期
       * @param appointmentId
       * @returns {string}
       */
      findAppointmentDateById : function(appointmentId){
        for(let i = 0; i < this.currentPageAppointmentList.length; i++){
          if (appointmentId === this.currentPageAppointmentList[i].appointmentId) {
            return this.currentPageAppointmentList[i].appointmentDate+" "+this.currentPageAppointmentList[i].appointmentTime;
          }
        }
      },
      /**
       * 根据预约单id，渲染项目名称
       * @param appointmentId
       * @returns {string}
       */
      renderProjectNameByAppointmentId : function(appointmentId){

        let projectIds = "";
        for(let i = 0; i < this.currentPageAppointmentList.length; i++){
          if (appointmentId === this.currentPageAppointmentList[i].appointmentId) {
            projectIds =  this.currentPageAppointmentList[i].projectIds;
          }
        }

        let allProjectName = "";
        //根据逗号分隔projectIds
        let projectIdsArray = projectIds.split(",");
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
      // 显示预约单详情
      showAppointmentDetailModal:function(index){
        this.showAppointmentDetailForm.customerName = this.data[index].customerName;
        this.$refs.showAppointmentDetailModalRef.showModal();
      },
      handleChange(pageNo){
        this.currentPageNo = pageNo;
        this.queryCustomerIncomeList();
      },
      handlePageSizeChange(pageSize){
        this.pageSize = pageSize;
        this.queryCustomerIncomeList();
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查项目集合
      this.queryProjectList();

      //查询所有顾客
      this.queryShopAllCustomer();

      //查顾客收益
      this.queryCustomerIncomeList();

      //查询预约状态集合
      this.queryAppointmentStatusList();

    }
  }
</script>

<style scoped>

</style>
