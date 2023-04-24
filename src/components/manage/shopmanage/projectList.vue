<template>
  <div>

    <Row>
      <Col span="2">
        <!--添加项目按钮-->
        <Button type="success" style="margin: 10px 0 10px 0" @click="showAddModal">添加项目</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Row>
              <Col span="9">&nbsp;</Col>
              <Col span="6"><Button type="primary" @click="showUpdateModal(index)">修改</Button></Col>
              <!--<Col span="6"><Button type="error" @click="showDeleteModal(index)">删除</Button></Col>-->
            </Row>
          </template>
        </Table>
      </Col>
    </Row>

    <!--添加项目弹框-->
    <confirmModal ref="addProjectModalRef" modal-title="添加项目:" :modal-width="600" @handleSubmit="addProject()">
      <Form ref="addProjectFormRef" :model="addProjectForm" :label-width="100" @submit.native.prevent>
        <FormItem label="项目名称" prop="projectName" required>
          <Input type="text" v-model="addProjectForm.projectName"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--修改项目弹框-->
    <confirmModal ref="updateProjectModalRef" modal-title="修改项目:" :modal-width="600" @handleSubmit="updateProject()">
      <Form ref="updateProjectFormRef" :model="updateProjectForm" :label-width="100" @submit.native.prevent>
        <FormItem label="项目名称" prop="projectName" required>
          <Input type="text" v-model="updateProjectForm.projectName"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除项目弹框-->
    <confirmModal ref="deleteProjectModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteProject()">
      <div style="font-size: 14px;;">确认删除: {{deleteProjectForm.projectName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
  import {queryProjectList,addProject,deleteProject,updateProject} from "../../../api/ApiList";
  import {validateAmount,formatAmount} from "../../../tools/index";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "projectList",
    components: {confirmModal},
    data () {
      return {
        selectedShopId:"",
        selectedShopName:"",
        data: [],
        addProjectForm:{
          projectName:"",
        },
        updateProjectForm:{
          projectId:"",
          projectName:"",
        },
        deleteProjectForm:{
          projectId:"",
          projectName:"",
        },
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            width: 200,
            fixed: 'left',
          },
          {
            title: '操作',
            slot: 'action',
            width: 300,
            align: 'center',
          }
        ],
      }
    },
    methods:{
      // 查询项目集合
      queryProjectList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryProjectList(params);
        this.data = res.data;
      },
      // 显示添加项目弹框
      showAddModal:function(){
        this.$refs.addProjectModalRef.showModal();
      },
      // 显示修改项目弹框
      showUpdateModal:function(index){
        this.updateProjectForm.projectId = this.data[index].projectId;
        this.updateProjectForm.projectName = this.data[index].projectName;
        this.$refs.updateProjectModalRef.showModal();
      },
      // 显示删除项目弹框
      showDeleteModal:function(index){
        this.deleteProjectForm.projectId = this.data[index].projectId;
        this.deleteProjectForm.projectName = this.data[index].projectName;
        this.$refs.deleteProjectModalRef.showModal();
      },
      //添加项目
      addProject:async function(){
        let params = {
          'shopId':this.selectedShopId,
          'projectName':this.addProjectForm.projectName,
        };
        let res = await addProject(params);
        if (res.code === '0000') {
          this.$refs.addProjectFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryProjectList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //修改项目
      updateProject:async function () {
        let params = {
          'shopId':this.selectedShopId,
          'projectId':this.updateProjectForm.projectId,
          'projectName':this.updateProjectForm.projectName,
        };
        let res = await updateProject(params);
        if (res.code === '0000') {
          this.$refs.updateProjectFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryProjectList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除项目
      deleteProject:async function () {
        let params = {
          'projectId':this.deleteProjectForm.projectId
        };
        let res = await deleteProject(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryProjectList();
        }else {
          this.$Message.error(res.msg);
        }
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查项目
      this.queryProjectList();
    }
  }
</script>

<style scoped>

</style>
