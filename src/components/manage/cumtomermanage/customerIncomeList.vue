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

  </div>
</template>

<script>
  import {formatStrDate_yymmddHHmmss,formatAmount} from "../../../tools";
  import {queryCustomerIncomeList,queryRechargeListByIds,queryCustomerListByIds} from "../../../api/ApiList";
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
        customerList: [],
        rechargeList: [],
        columns: [
          {
            title: '姓名',
            key: 'customerId',
            width: 100,
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
            title: '介绍的顾客充值金额',
            key: 'introduceCustomerRechargeId',
            width: 150,
            render: (h,params)=>{
              return h('div',
                formatAmount(this.renderCustomerRechargeAmount(params.row.introduceCustomerRechargeId))
              )
            }
          },
          {
            title: '收益比例',
            key: 'incomePoint',
            width: 140,
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:"orange"
                  }},
                [ h('strong',params.row.incomePoint+"%")]
              )
            }
          },
          {
            title: '收益金额',
            key: 'incomeAmount',
            width: 140,
            render: (h,params)=>{
              return h('div',
                {style:{
                    color:"orange"
                  }},
                [ h('strong',"+"+formatAmount(params.row.incomeAmount))]
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

          //批量查充值记录
          let rechargeIds = "";
          for(let i = 0; i < this.data.length; i++){
            rechargeIds += this.data[i].introduceCustomerRechargeId+",";
          }
          params = {
            "rechargeIds": rechargeIds.slice(0, -1),
          };
          let result = await queryRechargeListByIds(params);
          this.rechargeList = result.data;

          //批量查询顾客集合
          let customerIds = "";
          for(let i = 0; i < this.data.length; i++){
            customerIds += this.data[i].customerId+","+this.data[i].introduceCustomerId+",";
          }
          params = {
            "customerIds": customerIds.slice(0, -1),
          };
          let customerListRes = await queryCustomerListByIds(params);
          this.customerList = customerListRes.data;

        }else {
          this.$Message.error(res.msg);
        }
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
        for(let i = 0; i < this.customerList.length; i++){
          if (str === this.customerList[i].customerId) {
            return this.customerList[i].customerName;
          }
        }
      },
      /**
       * 渲染介绍的顾客姓名
       * @param str
       * @returns {string}
       */
      renderIntroduceCustomerNameByCustomerId : function(str){
        for(let i = 0; i < this.customerList.length; i++){
          if (str === this.customerList[i].customerId) {
            return this.customerList[i].customerName;
          }
        }
      },
      /**
       * 渲染介绍的顾客手机号
       * @param str
       * @returns {string}
       */
      renderIntroduceCustomerPhoneNumberByCustomerId : function(str){
        for(let i = 0; i < this.customerList.length; i++){
          if (str === this.customerList[i].customerId) {
            return this.customerList[i].phoneNumber;
          }
        }
      },
      /**
       * 渲染介绍的顾客充值金额
       * @param rechargeId
       * @returns {string}
       */
      renderCustomerRechargeAmount : function(rechargeId){
        for(let i = 0; i < this.rechargeList.length; i++){
          if (rechargeId === this.rechargeList[i].rechargeId) {
            return this.rechargeList[i].rechargeAmount;
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

      //查顾客收益
      this.queryCustomerIncomeList();

    }
  }
</script>

<style scoped>

</style>
