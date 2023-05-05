<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="2">
        <!--添加项目按钮-->
        <Button type="success" @click="showAddModal">添加项目</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Row>
              <Col span="6">&nbsp;</Col>
              <Col span="3"><Icon type="md-arrow-round-up" size="25" color="green" style="cursor: pointer" @click="thisProjectUp(index)"/></Col>
              <Col span="3"><Icon type="md-arrow-round-down" size="25" color="green" style="cursor: pointer" @click="thisProjectDown(index)"/></Col>
              <Col span="6"><Button type="primary" @click="showUpdateModal(index)">修改</Button></Col>
              <Col span="6"><Button type="error" @click="showDeleteModal(index)" disabled>删除</Button></Col>
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
  import {queryProjectList,addProject,deleteProject,updateProject,thisProjectUp,thisProjectDown} from "../../../api/ApiList";
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
            render: (h, params) => {
              return h('div', [
                h('strong' ,params.row.projectName)
              ]);
            }
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
      //上移项目
      thisProjectUp:async function(index){
        if (index === 0) {
          this.$Message.warning("已经在最上面了");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'currentProjectId':this.data[index].projectId,
          'upperProjectId':this.data[index-1].projectId,
        };
        let res = await thisProjectUp(params);
        if (res.code==='0000'){
          this.queryProjectList();
        } else{
          this.$Message.error(res.msg);
        }
      },
      //下移项目
      thisProjectDown:async function(index){
        if (index === this.data.length-1) {
          this.$Message.warning("已经在最下面了");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'currentProjectId':this.data[index].projectId,
          'downerProjectId':this.data[index+1].projectId,
        };
        let res = await thisProjectDown(params);
        if (res.code==='0000'){
          this.queryProjectList();
        } else{
          this.$Message.error(res.msg);
        }
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
