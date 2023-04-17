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
          <Option v-for="item in employeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
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
              <Col span="6">&nbsp;</Col>
              <Col span="6"><Button type="primary" @click="showUpdateModal(index)">修改</Button></Col>
              <Col span="6"><Button type="error" @click="showDeleteModal(index)">删除</Button></Col>
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
            <Option v-for="item in employeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
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
            <Option v-for="item in employeeList" :value="item.employeeId" :key="item.employeeId">{{ item.employeeName }}</Option>
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

    <!--确认删除顾客弹框-->
    <confirmModal ref="deleteCustomerModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteCustomer()">
      <div style="font-size: 14px;;">确认删除: {{deleteCustomerForm.customerName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
  import { formatDate_yyyyMMdd,formatStrDate_yymmddHHmmss,validateEmpty,formatHumanSexByNumber,validatePhoneNumber} from "../../../tools";
  import {queryEmployeeList,getAllCustomerMassLevelList,queryCustomerList,addCustomer,deleteCustomer,updateCustomer,queryShopAllCustomer,queryCustomerByPhoneNumber} from "../../../api/ApiList";
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
        pageSize:10,
        // 当前页
        currentPageNo:1,
        searchCustomerName:"",
        searchPhoneNumber:"",
        searchSex:"",
        searchCustomerMassLevel:"",
        searchBelongToEmployeeId:"",
        employeeList: [],
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
            title: '被介绍客户姓名',
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
            width: 300,
            align: 'center',
            fixed: 'right'
          }
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
      // 查询员工集合
      queryEmployeeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryEmployeeList(params);
        this.employeeList = res.data;
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
        for(let i = 0; i < this.employeeList.length; i++){
          if (str === this.employeeList[i].employeeId) {
            return this.employeeList[i].employeeName;
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
      // 显示删除顾客弹框
      showDeleteModal:function(index){
        this.deleteCustomerForm.customerId = this.data[index].customerId;
        this.deleteCustomerForm.customerName = this.data[index].customerName;
        this.$refs.deleteCustomerModalRef.showModal();
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
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除顾客
      deleteCustomer:async function () {
        let params = {
          'customerId':this.deleteCustomerForm.customerId
        };
        let res = await deleteCustomer(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryCustomerList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      handleChange(pageNo){
        this.currentPageNo = pageNo;
        this.queryCustomerList();
      },
      handlePageSizeChange(pageSize){
        this.pageSize = pageSize;
        this.queryCustomerList();
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查会员等级
      this.getAllCustomerMassLevelList();

      //查员工
      this.queryEmployeeList();

      //查询所有顾客
      this.queryShopAllCustomer();

      //查顾客
      this.queryCustomerList();

    }
  }
</script>

<style scoped>

</style>
