<template>
  <div>

    <Row>
      <Col span="2">
        <!--添加员工按钮-->
        <Button type="warning" style="margin: 10px 0 10px 0" @click="showAddModal">添加员工</Button>
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
      </Col>
    </Row>

    <!--添加员工弹框-->
    <confirmModal ref="addEmployeeModalRef" modal-title="添加员工:" :modal-width="600" @handleSubmit="addEmployee()">
      <Form ref="addEmployeeFormRef" :model="addEmployeeForm" :label-width="100" @submit.native.prevent>
        <FormItem label="员工姓名" prop="employeeName" required>
          <Input type="text" v-model="addEmployeeForm.employeeName"></Input>
        </FormItem>
        <FormItem label="员工性别" prop="sex" required>
          <Select v-model="addEmployeeForm.sex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="员工手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="addEmployeeForm.phoneNumber" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="生日日期" prop="birthday" required>
          <DatePicker type="date" v-model="addEmployeeForm.birthday" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="角色" prop="roleId" required>
          <Select v-model="addEmployeeForm.roleId" style="width:100px">
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </confirmModal>

    <!--修改员工弹框-->
    <confirmModal ref="updateEmployeeModalRef" modal-title="修改员工:" :modal-width="600" @handleSubmit="updateEmployee()">
      <Form ref="updateEmployeeFormRef" :model="updateEmployeeForm" :label-width="100" @submit.native.prevent>
        <FormItem label="员工姓名" prop="employeeName" required>
          <Input type="text" v-model="updateEmployeeForm.employeeName"></Input>
        </FormItem>
        <FormItem label="员工性别" prop="sex" required>
          <Select v-model="updateEmployeeForm.sex.toString()" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="员工手机号码" prop="phoneNumber" required>
          <Input type="text" v-model="updateEmployeeForm.phoneNumber" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="生日日期" prop="birthday" required>
          <DatePicker type="date" v-model="updateEmployeeForm.birthday" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="角色" prop="roleId" required>
          <Select v-model="updateEmployeeForm.roleId" style="width:100px">
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
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
  import { millisecondFormatDate_yymmddHHmmss,millisecondFormatDate_yymmdd ,formatHumanSexByNumber} from "../../../tools";
  import {querySelectedShop,queryRoleList,queryEmployeeList,addEmployee,deleteEmployee,updateEmployee} from "../../../api/ApiList";
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
        },
        updateEmployeeForm:{
          employeeId:"",
          employeeName:"",
          sex:"",
          phoneNumber:"",
          birthday:"",
          roleId:"",
        },
        deleteEmployeeForm:{
          employeeId:"",
          employeeName:""
        },
        sexList: [
          {
            value: '1',
            label: '男'
          },
          {
            value: '0',
            label: '女'
          },
        ],
        roleList:[],
        columns: [
          {
            title: '员工姓名',
            key: 'employeeName',
            width: 200,
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
            width: 200,
            render: (h,params)=>{
              return h('div',
                formatHumanSexByNumber(params.row.sex)
              )
            }
          },
          {
            title: '手机号',
            key: 'phoneNumber',
            width: 200,
          },
          {
            title: '生日日期',
            key: 'birthday',
            width: 200,
            render: (h,params)=>{
              return h('div',
                millisecondFormatDate_yymmdd(params.row.birthday)
              )
            }
          },
          // {
          //   title: '角色id',
          //   key: 'roleId',
          //   width: 200,
          // },
          {
            title: '角色名称',
            key: 'roleName',
            width: 200,
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
                millisecondFormatDate_yymmddHHmmss(params.row.createTime)
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
                millisecondFormatDate_yymmddHHmmss(params.row.updateTime)
              )
            }
          },
          // {
          //   title: '员工id',
          //   key: 'employeeId',
          //   width: 80,
          // },
          // {
          //   title: '店铺id',
          //   key: 'shopId',
          //   width: 80,
          // },
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
      queryEmployeeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryEmployeeList(params);
        this.data = res.data;
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
      // 显示添加员工弹框
      showAddModal:function(){
        this.$refs.addEmployeeModalRef.showModal();
      },
      // 显示修改员工弹框
      showUpdateModal:function(index){
        this.updateEmployeeForm.employeeId = this.data[index].employeeId;
        this.updateEmployeeForm.employeeName = this.data[index].employeeName;
        this.updateEmployeeForm.sex = this.data[index].sex;
        this.updateEmployeeForm.phoneNumber = this.data[index].phoneNumber;
        this.updateEmployeeForm.birthday = millisecondFormatDate_yymmdd(this.data[index].birthday);
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
        let params = {
          'shopId':this.selectedShopId,
          'employeeName':this.addEmployeeForm.employeeName,
          'sex':this.addEmployeeForm.sex,
          'phoneNumber':this.addEmployeeForm.phoneNumber,
          'birthday':this.addEmployeeForm.birthday.length!==0 ? new Date(this.addEmployeeForm.birthday).getTime() : "",
          'roleId':this.addEmployeeForm.roleId,
        };
        let res = await addEmployee(params);
        if (res.code === '0000') {
          this.$refs.addEmployeeFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryEmployeeList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //修改员工
      updateEmployee:async function () {
        let params = {
          'employeeId':this.updateEmployeeForm.employeeId,
          'shopId':this.selectedShopId,
          'employeeName':this.updateEmployeeForm.employeeName,
          'sex':this.updateEmployeeForm.sex,
          'phoneNumber':this.updateEmployeeForm.phoneNumber,
          'birthday':this.updateEmployeeForm.birthday.length!==0 ? new Date(this.updateEmployeeForm.birthday).getTime() : "",
          'roleId':this.updateEmployeeForm.roleId,
        };
        let res = await updateEmployee(params);
        if (res.code === '0000') {
          this.$refs.updateEmployeeFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryEmployeeList();
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
          this.queryEmployeeList();
        }else {
          this.$Message.error(res.msg);
        }
      },
    },
    mounted:async function () {
      let res = await querySelectedShop();
      if (res.code === '0000' && res.data!=null) {
        this.selectedShopId = res.data.shopId;
        this.selectedShopName = res.data.shopName;

        //查询到选中的shop，再查员工
        this.queryEmployeeList();
      }

      //查询角色集合
      let roleDataRes = await queryRoleList();
      if (roleDataRes.code === '0000' && roleDataRes.data!=null) {
        this.roleList = roleDataRes.data;
      }

    }
  }
</script>

<style scoped>

</style>
