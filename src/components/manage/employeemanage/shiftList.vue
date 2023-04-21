<template>
  <div>

    <Row>
      <Col span="4">
        <Button type="success" style="margin: 10px 0 10px 0" @click="showAddShiftModal">添加班次</Button>
        <Button type="warning" style="margin: 10px 0 10px 5px" @click="showAddShiftTimeModal">添加时间</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Button type="error" @click="showDeleteModal(index)">删除</Button>
          </template>
        </Table>
      </Col>
    </Row>

    <!--添加班次弹框-->
    <confirmModal ref="addShiftModalRef" modal-title="添加班次:" :modal-width="350" @handleSubmit="addShift()">
      <Form ref="addShiftFormRef" :model="addShiftForm" :label-width="100" @submit.native.prevent>
        <FormItem label="班次名称" prop="shiftName" required>
          <Input type="text" v-model="addShiftForm.shiftName" style="width: 120px"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--添加班次时间弹框-->
    <confirmModal ref="addShiftTimeModalRef" modal-title="添加时间:" :modal-width="350" @handleSubmit="addShiftTime()">
      <Form ref="addShiftTimeFormRef" :model="addShiftTimeForm" :label-width="100" @submit.native.prevent>
        <FormItem label="班次名称" prop="shiftId" required>
          <Select v-model="addShiftTimeForm.shiftId" style="width:120px">
            <Option v-for="item in data" :value="item.shiftId" :key="item.shiftId">{{ item.shiftName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间" prop="startTime" required>
          <TimePicker format="HH:mm" v-model="addShiftTimeForm.startTime" placeholder="请选择" style="width: 120px" />
        </FormItem>
        <FormItem label="结束时间" prop="endTime" required>
          <TimePicker format="HH:mm" v-model="addShiftTimeForm.endTime" placeholder="请选择" style="width: 120px" />
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除班次弹框-->
    <confirmModal ref="deleteShiftModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteShift()">
      <div style="font-size: 14px;;">确认删除: {{deleteShiftForm.shiftName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
  import {queryShiftList,addShift,deleteShift,queryShiftTimeList,addShiftTime} from "../../../api/ApiList";
  import {validateEmpty,formatAppointmentTime2Str} from "../../../tools/index";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "shiftList",
    components: {confirmModal},
    data () {
      return {
        selectedShopId:"",
        selectedShopName:"",
        data: [],
        allShiftTimeList: [],
        addShiftForm:{
          shiftName:"",
        },
        addShiftTimeForm:{
          shiftId:"",
          startTime:"",
          endTime:"",
        },
        deleteShiftForm:{
          shiftId:"",
          shiftName:"",
        },
        columns: [
          {
            title: '班次名称',
            key: 'shiftName',
            width: 150,
            fixed: 'left',
          },
          {
            title: '班次时间',
            key: 'shiftId',
            width: 800,
            render: (h,params)=>{
              return h('div',
                this.renderShiftTime(params.row.shiftId)
              )
            }
          },
          {
            title: '操作',
            slot: 'action',
            width: 100,
            align: 'center',
            // fixed: 'right'
          }
        ],
      }
    },
    methods:{
      // 查询班次集合
      queryShiftList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShiftList(params);
        this.data = res.data;
      },
      // 查询班次时间集合
      queryShiftTimeList :async function () {
        let params = {
          'shopId': this.selectedShopId
        };
        let res = await queryShiftTimeList(params);
        this.allShiftTimeList = res.data;
      },
      //渲染班次时间
      renderShiftTime:function(shiftId){
        let shiftTimesStr = "";
        for(let i = 0; i < this.allShiftTimeList.length; i++){
          if (shiftId === this.allShiftTimeList[i].shiftId) {
            shiftTimesStr += "[ "+this.allShiftTimeList[i].startTime.substring(0,5) +" - "+ this.allShiftTimeList[i].endTime.substring(0,5) +" ]  、";
          }
        }
        return shiftTimesStr.substring(0,shiftTimesStr.length-1);
      },
      // 显示添加班次弹框
      showAddShiftModal:function(){
        this.$refs.addShiftModalRef.showModal();
      },
      // 显示添加班次时间弹框
      showAddShiftTimeModal:function(){
        this.$refs.addShiftTimeModalRef.showModal();
      },
      // 显示删除班次弹框
      showDeleteModal:function(index){
        this.deleteShiftForm.shiftId = this.data[index].shiftId;
        this.deleteShiftForm.shiftName = this.data[index].shiftName;
        this.$refs.deleteShiftModalRef.showModal();
      },
      //添加班次
      addShift:async function(){
        let params = {
          'shopId':this.selectedShopId,
          'shiftName':this.addShiftForm.shiftName,
        };
        let res = await addShift(params);
        if (res.code === '0000') {
          this.$refs.addShiftFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryShiftList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //添加班次时间
      addShiftTime:async function(){
        if (!validateEmpty(this.addShiftTimeForm.shiftId)) {
          this.$Message.warning("请选择班次");
          return;
        }
        if (!validateEmpty(this.addShiftTimeForm.startTime)) {
          this.$Message.warning("请选择开始时间");
          return;
        }
        if (!validateEmpty(this.addShiftTimeForm.endTime)) {
          this.$Message.warning("请选择结束时间");
          return;
        }
        let params = {
          'shopId':this.selectedShopId,
          'shiftId':this.addShiftTimeForm.shiftId,
          'startTime':formatAppointmentTime2Str(this.addShiftTimeForm.startTime),
          'endTime':formatAppointmentTime2Str(this.addShiftTimeForm.endTime),
        };
        let res = await addShiftTime(params);
        if (res.code === '0000') {
          this.$refs.addShiftTimeFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryShiftTimeList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除班次
      deleteShift:async function () {
        let params = {
          'shopId':this.selectedShopId,
          'shiftId':this.deleteShiftForm.shiftId
        };
        let res = await deleteShift(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryShiftList();
        }else {
          this.$Message.error(res.msg);
        }
      },
    },
    mounted:async function () {
      this.selectedShopId = localStorage.getItem('selectedShopId');
      this.selectedShopName = localStorage.getItem('selectedShopName');

      //查班次
      this.queryShiftList();

      //查班次时间
      this.queryShiftTimeList();
    }
  }
</script>

<style scoped>

</style>
