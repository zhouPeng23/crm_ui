<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="2">
        <!--添加员工按钮-->
        <Button type="warning" @click="showAddModal">添加员工</Button>
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
              <Col span="6"><Button type="error" @click="showDeleteModal(index)" disabled>删除</Button></Col>
            </Row>
          </template>
        </Table>
      </Col>
    </Row>

    <!--添加员工弹框-->
    <confirmModal ref="addEmployeeModalRef" modal-title="添加员工:" :modal-width="600" @handleSubmit="addEmployee()">
      <Form ref="addEmployeeFormRef" :model="addEmployeeForm" :label-width="100" @submit.native.prevent>
        <FormItem label="员工姓名" prop="employeeName" required>
          <Input type="text" v-model="addEmployeeForm.employeeName" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="员工性别" prop="sex" required>
          <Select v-model="addEmployeeForm.sex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="员工手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="addEmployeeForm.phoneNumber" :maxlength="11" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="生日日期" prop="birthday">
          <DatePicker type="date" v-model="addEmployeeForm.birthday" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="角色" prop="roleId" required>
          <Select v-model="addEmployeeForm.roleId" style="width:100px">
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="班次" prop="shiftId" required>
          <Select v-model="addEmployeeForm.shiftId" style="width:100px">
            <Option v-for="item in shiftList" :value="item.shiftId" :key="item.shiftId">{{ item.shiftName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </confirmModal>

    <!--修改员工弹框-->
    <confirmModal ref="updateEmployeeModalRef" modal-title="修改员工:" :modal-width="600" @handleSubmit="updateEmployee()">
      <Form ref="updateEmployeeFormRef" :model="updateEmployeeForm" :label-width="100" @submit.native.prevent>
        <FormItem label="员工姓名" prop="employeeName" required>
          <Input type="text" v-model="updateEmployeeForm.employeeName" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="员工性别" prop="sex" required>
          <Select v-model="updateEmployeeForm.sex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="员工手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="updateEmployeeForm.phoneNumber" :maxlength="11" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="生日日期" prop="birthday">
          <DatePicker type="date" v-model="updateEmployeeForm.birthday" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="角色" prop="roleId" required>
          <Select v-model="updateEmployeeForm.roleId" style="width:100px">
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="班次" prop="shiftId" required>
          <Select v-model="updateEmployeeForm.shiftId" style="width:100px">
            <Option v-for="item in shiftList" :value="item.shiftId" :key="item.shiftId">{{ item.shiftName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除员工弹框-->
    <confirmModal ref="deleteEmployeeModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteEmployee()">
      <div style="font-size: 14px;;">确认删除: {{deleteEmployeeForm.employeeName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
  import { formatDate_yyyyMMdd,formatStrDate_yymmddHHmmss ,validateEmpty,formatHumanSexByNumber} from "../../../tools";
  import {queryRoleList,queryShopNormalEmployeeList,addEmployee,deleteEmployee,updateEmployee,queryShiftList} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "employeeList",
    components: {confirmModal},
    data () {
      return {
        selectedShopId:"",
        selectedShopName:"",
        data: [],
        addEmployeeForm:{
          employeeName:"",
          sex:"",
          phoneNumber:"",
          birthday:"",
          roleId:"",
          shiftId:"",
        },
        updateEmployeeForm:{
          employeeId:"",
          employeeName:"",
          sex:"",
          phoneNumber:"",
          birthday:"",
          roleId:"",
          shiftId:"",
        },
        deleteEmployeeForm:{
          employeeId:"",
          employeeName:""
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
        shiftList:[],
        columns: [
          {
            title: '员工姓名',
            key: 'employeeName',
            width: 150,
            fixed: 'left',
            render: (h, params) => {
              return h('div', [
                h('strong' ,params.row.employeeName)
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
            title: '班次',
            key: 'shiftId',
            width: 100,
            render: (h,params)=>{
              return h('div',
                this.renderShift(params.row.shiftId)
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
            title: '角色名称',
            key: 'roleId',
            width: 100,
            render: (h,params)=>{
              return h('div',
                this.renderRoleName(params.row.roleId)
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
      // 查询员工集合
      queryShopNormalEmployeeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShopNormalEmployeeList(params);
        this.data = res.data;
      },
      //查询角色集合
      queryRoleList :async function () {
        //查询角色集合
        let params = {
          'shopId':this.selectedShopId
        };
        let roleDataRes = await queryRoleList(params);
        if (roleDataRes.code === '0000' && roleDataRes.data!=null) {
          this.roleList = roleDataRes.data;
        }
      },
      //查询班次集合
      queryShiftList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShiftList(params);
        this.shiftList = res.data;
      },
      /**
       * 渲染员工角色名称
       * @param str
       */
      renderRoleName :function(str){
        for(let i = 0; i < this.roleList.length; i++){
          if (str === this.roleList[i].roleId) {
            return this.roleList[i].roleName;
          }
        }
      },

      /**
       * 渲染员工班次名称
       * @param str
       */
      renderShift :function(str){
        for(let i = 0; i < this.shiftList.length; i++){
          if (str === this.shiftList[i].shiftId) {
            return this.shiftList[i].shiftName;
          }
        }
      },
      // 显示添加员工弹框
      showAddModal:function(){
        this.$refs.addEmployeeModalRef.showModal();
      },
      // 显示修改员工弹框
      showUpdateModal:function(index){
        this.updateEmployeeForm.employeeId = this.data[index].employeeId;
        this.updateEmployeeForm.employeeName = this.data[index].employeeName;
        this.updateEmployeeForm.sex = this.data[index].sex;
        this.updateEmployeeForm.shiftId = this.data[index].shiftId;
        this.updateEmployeeForm.phoneNumber = this.data[index].phoneNumber;
        this.updateEmployeeForm.birthday = this.data[index].birthday;
        this.updateEmployeeForm.roleId = this.data[index].roleId;
        this.$refs.updateEmployeeModalRef.showModal();
      },
      // 显示删除员工弹框
      showDeleteModal:function(index){
        this.deleteEmployeeForm.employeeId = this.data[index].employeeId;
        this.deleteEmployeeForm.employeeName = this.data[index].employeeName;
        this.$refs.deleteEmployeeModalRef.showModal();
      },
      //添加员工
      addEmployee:async function(){
        let params = {};
        //生日日期特殊处理，分两种情况
        if (!validateEmpty(this.addEmployeeForm.birthday)) {
          params = {
            'shopId':this.selectedShopId,
            'employeeName':this.addEmployeeForm.employeeName,
            'sex':this.addEmployeeForm.sex,
            'shiftId':this.addEmployeeForm.shiftId,
            'phoneNumber':this.addEmployeeForm.phoneNumber,
            //生日为空就不传生日字段
            'roleId':this.addEmployeeForm.roleId,
          };
        }else {
          params = {
            'shopId':this.selectedShopId,
            'employeeName':this.addEmployeeForm.employeeName,
            'sex':this.addEmployeeForm.sex,
            'shiftId':this.addEmployeeForm.shiftId,
            'phoneNumber':this.addEmployeeForm.phoneNumber,
            'birthday':formatDate_yyyyMMdd(this.addEmployeeForm.birthday),
            'roleId':this.addEmployeeForm.roleId,
          };
        }

        let res = await addEmployee(params);
        if (res.code === '0000') {
          this.$refs.addEmployeeFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryShopNormalEmployeeList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //修改员工
      updateEmployee:async function () {
        let params = {};
        //生日日期特殊处理，分两种情况
        if (!validateEmpty(this.updateEmployeeForm.birthday)) {
          params = {
            'employeeId':this.updateEmployeeForm.employeeId,
            'shopId':this.selectedShopId,
            'employeeName':this.updateEmployeeForm.employeeName,
            'sex':this.updateEmployeeForm.sex,
            'shiftId':this.updateEmployeeForm.shiftId,
            'phoneNumber':this.updateEmployeeForm.phoneNumber,
            //生日为空就不传生日字段
            'roleId':this.updateEmployeeForm.roleId,
          };
        }else {
          params = {
            'employeeId':this.updateEmployeeForm.employeeId,
            'shopId':this.selectedShopId,
            'employeeName':this.updateEmployeeForm.employeeName,
            'sex':this.updateEmployeeForm.sex,
            'shiftId':this.updateEmployeeForm.shiftId,
            'phoneNumber':this.updateEmployeeForm.phoneNumber,
            'birthday':formatDate_yyyyMMdd(this.updateEmployeeForm.birthday),
            'roleId':this.updateEmployeeForm.roleId,
          };
        }

        let res = await updateEmployee(params);
        if (res.code === '0000') {
          this.$refs.updateEmployeeFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryShopNormalEmployeeList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除员工
      deleteEmployee:async function () {
        let params = {
          'employeeId':this.deleteEmployeeForm.employeeId
        };
        let res = await deleteEmployee(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryShopNormalEmployeeList();
        }else {
          this.$Message.error(res.msg);
        }
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查员工
      this.queryShopNormalEmployeeList();

      //查班次集合
      this.queryShiftList();

      //查角色集合
      this.queryRoleList();

    }
  }
</script>

<style scoped>

</style>
