<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="6" >
        &nbsp;
      </Col>
      <Col span="18">
        <Input v-model="searchCustomerName" placeholder="顾客姓名" clearable style="width: 150px" />
        <Input v-model="searchPhoneNumber" placeholder="顾客手机号码" clearable style="width: 150px" :maxlength="11"/>
        <Button type="primary" shape="circle" icon="ios-search" @click="queryCustomerIncomeList">查询</Button>
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
              <Col span="6"><Button type="primary" @click="showAppointmentDetailModal(index)">预约单详情</Button></Col>
            </Row>
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
  import { formatDate_yyyyMMdd,formatStrDate_yymmddHHmmss,validateEmpty,formatHumanSexByNumber,validatePhoneNumber} from "../../../tools";
  import {queryCustomerIncomeList,queryShopAllCustomer,queryProjectList,queryAppointmentByIds} from "../../../api/ApiList";
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
        pageSize:10,
        // 当前页
        currentPageNo:1,
        searchCustomerName:"",
        searchPhoneNumber:"",
        allCustomerList: [],
        projectList:[],
        currentPageAppointmentList:[],
        showAppointmentDetailForm:{
          customerName:"",
        },
        columns: [
          {
            title: '姓名',
            key: 'customerId',
            width: 150,
            fixed: 'left',
            render: (h, params) => {
              return h('div', [
                h('strong' ,this.renderCustomerNameByCustomerId(params.row.customerId))
              ]);
            }
          },
          {
            title: '性别',
            key: 'sex',
            width: 100,
            render: (h,params)=>{
              return h('div',
                formatHumanSexByNumber(this.renderSexByCustomerId(params.row.customerId))
              )
            }
          },
          {
            title: '手机号',
            key: 'customerId',
            width: 150,
            render: (h,params)=>{
              return h('div',
                this.renderPhoneNumberByCustomerId(params.row.customerId)
              )
            }
          },
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
            width: 150,
            render: (h,params)=>{
              return h('div',
                this.renderIntroduceCustomerPhoneNumberByCustomerId(params.row.introduceCustomerId)
              )
            }
          },
          {
            title: '预约单做的项目',
            key: 'introduceCustomerAppointmentId',
            width: 150,
            render: (h,params)=>{
              return h('div',
                this.renderProjectName(this.findAppointmentProjectIdsById(params.row.introduceCustomerAppointmentId))
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
        this.data = res.data.records;
        this.total = res.data.total;

        //查询当前分页中预约单集合
        this.queryCurrentPageAppointment();

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

    }
  }
</script>

<style scoped>

</style>
