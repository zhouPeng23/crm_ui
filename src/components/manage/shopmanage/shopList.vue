<template>
  <div>

    <Row>
      <Col span="2">
        <!--添加店铺按钮-->
        <Button type="success" style="margin: 10px 0 10px 0" @click="showAddModal">添加店铺</Button>
      </Col>
      <Col span="8">
        <div v-if="selectedShopId" style="margin: 12px 0 0 0">
          <span style="font-size: 13px;font-weight: lighter;">当前选择的店铺:</span>
          <span style="font-size: 15px;font-weight: bold;color: #00b33a">{{selectedShopName}}</span>
        </div>
        <div v-else style="margin: 12px 0 0 0">
          <span style="font-size: 13px;font-weight: bold; color: red;">请选择店铺^_^</span>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Row>
              <Col span="5"><Button type="primary" @click="showUpdateModal(index)">修改</Button></Col>
              <Col span="6"><Button type="error" @click="showDeleteModal(index)">删除</Button></Col>
              <Col span="7">
                <Button v-if="selectedShopId === data[index].shopId" type="success" ghost>已选择店铺</Button>
                <Button v-else type="success" @click="selectThisShop(index)">选择此店铺</Button>
              </Col>
              <Col span="6"><Icon v-if="selectedShopId === data[index].shopId" type="ios-undo" size="40" color="red"/></Col>
            </Row>
          </template>
        </Table>
      </Col>
    </Row>

    <!--添加店铺弹框-->
    <confirmModal ref="addShopModalRef" modal-title="添加店铺:" :modal-width="600" @handleSubmit="addShop()">
      <Form ref="addShopFormRef" :model="addShopForm" :label-width="100" @submit.native.prevent>
        <FormItem label="店铺名称" prop="shopName" required>
          <Input type="text" v-model="addShopForm.shopName"></Input>
        </FormItem>
        <FormItem label="店铺位置" prop="shopWeizhi" required>
          <Input type="text" v-model="addShopForm.shopWeizhi"></Input>
        </FormItem>
        <FormItem label="店铺经营类型" prop="shopJingyingType" required>
          <Input type="text" v-model="addShopForm.shopJingyingType"></Input>
        </FormItem>
        <FormItem label="店铺经营品牌" prop="shopJingyingBrand" required>
          <Input type="text" v-model="addShopForm.shopJingyingBrand"></Input>
        </FormItem>
        <FormItem label="店铺开业日期" prop="shopOpeningDate" required>
          <DatePicker type="date" v-model="addShopForm.shopOpeningDate" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="店长姓名" prop="shopLeaderName" required>
          <Input type="text" v-model="addShopForm.shopLeaderName"></Input>
        </FormItem>
        <FormItem label="店长性别" prop="shopLeaderSex" required>
          <Select v-model="addShopForm.shopLeaderSex" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="店长手机号" prop="shopLeaderPhoneNumber" required>
          <Input type="text" v-model="addShopForm.shopLeaderPhoneNumber" :maxlength="11"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--修改店铺弹框-->
    <confirmModal ref="updateShopModalRef" modal-title="修改店铺:" :modal-width="600" @handleSubmit="updateShop()">
      <Form ref="updateShopFormRef" :model="updateShopForm" :label-width="100" @submit.native.prevent>
        <FormItem label="店铺名称" prop="shopName" required>
          <Input type="text" v-model="updateShopForm.shopName"></Input>
        </FormItem>
        <FormItem label="店铺位置" prop="shopWeizhi" required>
          <Input type="text" v-model="updateShopForm.shopWeizhi"></Input>
        </FormItem>
        <FormItem label="店铺经营类型" prop="shopJingyingType" required>
          <Input type="text" v-model="updateShopForm.shopJingyingType"></Input>
        </FormItem>
        <FormItem label="店铺经营品牌" prop="shopJingyingBrand" required>
          <Input type="text" v-model="updateShopForm.shopJingyingBrand"></Input>
        </FormItem>
        <FormItem label="店铺开业日期" prop="shopOpeningDate" required>
          <DatePicker type="date" v-model="updateShopForm.shopOpeningDate" placeholder="请选择" style="width: 200px" format="yyyy-MM-dd"/>
        </FormItem>
        <FormItem label="店长姓名" prop="shopLeaderName" required>
          <Input type="text" v-model="updateShopForm.shopLeaderName"></Input>
        </FormItem>
        <FormItem label="店长性别" prop="shopLeaderSex" required>
          <Select v-model="updateShopForm.shopLeaderSex.toString()" style="width:100px">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="店长手机号" prop="shopLeaderPhoneNumber" required>
          <Input type="text" v-model="updateShopForm.shopLeaderPhoneNumber" :maxlength="11"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除店铺弹框-->
    <confirmModal ref="deleteShopModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteShop()">
      <div style="font-size: 14px;;">确认删除: {{deleteShopForm.shopName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
    import { millisecondFormatDate_yymmddHHmmss,millisecondFormatDate_yymmdd ,formatHumanSexByNumber} from "../../../tools";
    import {queryShopList,addShop,deleteShop,updateShop,querySelectedShop,selectThisShop} from "../../../api/ApiList";
    import confirmModal from "../../utils/modal/confirmModal";

    export default {
      name: "shopList",
      components: {confirmModal},
      data () {
        return {
          selectedShopId:"",
          selectedShopName:"",
          data: [],
          addShopForm:{
            shopName:"",
            shopWeizhi:"",
            shopJingyingType:"",
            shopJingyingBrand:"",
            shopOpeningDate:"",
            shopLeaderName:"",
            shopLeaderSex:"",
            shopLeaderPhoneNumber:"",
          },
          updateShopForm:{
            shopId:"",
            shopName:"",
            shopWeizhi:"",
            shopJingyingType:"",
            shopJingyingBrand:"",
            shopOpeningDate:"",
            shopLeaderName:"",
            shopLeaderSex:"",
            shopLeaderPhoneNumber:"",
          },
          deleteShopForm:{
            shopId:"",
            shopName:""
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
          columns: [
            {
              title: '店铺名称',
              key: 'shopName',
              width: 200,
              fixed: 'left',
              render: (h, params) => {
                return h('div', [
                  h('strong' ,params.row.shopName)
                ]);
              }
            },
            {
              title: '店铺位置',
              key: 'shopWeizhi',
              width: 300,
            },
            {
              title: '店铺经营类型',
              key: 'shopJingyingType',
              width: 200,
            },
            {
              title: '店铺经营品牌',
              key: 'shopJingyingBrand',
              width: 200,
            },
            {
              title: '店铺开业日期',
              key: 'shopOpeningDate',
              width: 200,
              render: (h,params)=>{
                return h('div',
                  millisecondFormatDate_yymmdd(params.row.shopOpeningDate)
                )
              }
            },
            {
              title: '店长姓名',
              key: 'shopLeaderName',
              width: 200,
            },
            {
              title: '店长性别',
              key: 'shopLeaderSex',
              width: 200,
              render: (h,params)=>{
                return h('div',
                  formatHumanSexByNumber(params.row.shopLeaderSex)
                )
              }
            },
            {
              title: '店长手机号',
              key: 'shopLeaderPhoneNumber',
              width: 200,
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
        // 查询店铺集合
        queryShopList :async function () {
          let params = {};
          let res = await queryShopList(params);
          this.data = res.data;
        },
        // 显示添加店铺弹框
        showAddModal:function(){
          this.$refs.addShopModalRef.showModal();
        },
        // 显示修改店铺弹框
        showUpdateModal:function(index){
          this.updateShopForm.shopId = this.data[index].shopId;
          this.updateShopForm.shopName = this.data[index].shopName;
          this.updateShopForm.shopWeizhi = this.data[index].shopWeizhi;
          this.updateShopForm.shopJingyingType = this.data[index].shopJingyingType;
          this.updateShopForm.shopJingyingBrand = this.data[index].shopJingyingBrand;
          this.updateShopForm.shopOpeningDate = millisecondFormatDate_yymmdd(this.data[index].shopOpeningDate);
          this.updateShopForm.shopLeaderName = this.data[index].shopLeaderName;
          this.updateShopForm.shopLeaderSex = this.data[index].shopLeaderSex;
          this.updateShopForm.shopLeaderPhoneNumber = this.data[index].shopLeaderPhoneNumber;
          this.$refs.updateShopModalRef.showModal();
        },
        // 显示删除店铺弹框
        showDeleteModal:function(index){
          this.deleteShopForm.shopId = this.data[index].shopId;
          this.deleteShopForm.shopName = this.data[index].shopName;
          this.$refs.deleteShopModalRef.showModal();
        },
        // 选择此店铺
        selectThisShop:async function(index){
          let params = {
            'shopId':this.data[index].shopId,
          };
          let res = await selectThisShop(params);
          if (res.code === '0000') {
            this.$Message.success(res.msg);
            this.selectedShopId = res.data.shopId;
            this.selectedShopName = res.data.shopName;
            // 选择成功延迟 1s 刷新页面
            setTimeout(function () {
              window.location.href = "/manage/shopmanage/shopList";
            }, 1000);
          }else{
            this.$Message.error(res.msg);
          }
        },
        //添加店铺
        addShop:async function(){
          let params = {
            'shopName':this.addShopForm.shopName,
            'shopWeizhi':this.addShopForm.shopWeizhi,
            'shopJingyingType':this.addShopForm.shopJingyingType,
            'shopJingyingBrand':this.addShopForm.shopJingyingBrand,
            'shopOpeningDate':this.addShopForm.shopOpeningDate.length!==0 ? new Date(this.addShopForm.shopOpeningDate).getTime() : "",
            'shopLeaderName':this.addShopForm.shopLeaderName,
            'shopLeaderSex':this.addShopForm.shopLeaderSex,
            'shopLeaderPhoneNumber':this.addShopForm.shopLeaderPhoneNumber,
          };
          let res = await addShop(params);
          if (res.code === '0000') {
            this.$refs.addShopFormRef.resetFields();
            this.$Message.success(res.msg);
            this.queryShopList();
          }else {
            this.$Message.error(res.msg);
          }
        },
        //修改店铺
        updateShop:async function () {
          let params = {
            'shopId':this.updateShopForm.shopId,
            'shopName':this.updateShopForm.shopName,
            'shopWeizhi':this.updateShopForm.shopWeizhi,
            'shopJingyingType':this.updateShopForm.shopJingyingType,
            'shopJingyingBrand':this.updateShopForm.shopJingyingBrand,
            'shopOpeningDate':this.updateShopForm.shopOpeningDate.length!==0 ? new Date(this.updateShopForm.shopOpeningDate).getTime() : "",
            'shopLeaderName':this.updateShopForm.shopLeaderName,
            'shopLeaderSex':this.updateShopForm.shopLeaderSex,
            'shopLeaderPhoneNumber':this.updateShopForm.shopLeaderPhoneNumber,
          };
          let res = await updateShop(params);
          if (res.code === '0000') {
            this.$refs.updateShopFormRef.resetFields();
            this.$Message.success(res.msg);
            this.queryShopList();
            if (this.updateShopForm.shopId === this.selectedShopId) {
              // 修改成功延迟 1s 刷新页面
              setTimeout(function () {
                window.location.href = "/manage/shopmanage/shopList";
              }, 1000);
            }
          }else {
            this.$Message.error(res.msg);
          }
        },
        //删除店铺
        deleteShop:async function () {
          if (this.deleteShopForm.shopId === this.selectedShopId) {
            this.$Message.warning("无法删除，店铺正在被选择！");
            return;
          }
          let params = {
            'shopId':this.deleteShopForm.shopId
          };
          let res = await deleteShop(params);
          if (res.code === '0000') {
            this.$Message.success(res.msg);
            this.queryShopList();
          }else {
            this.$Message.error(res.msg);
          }
        },
      },
      mounted:async function () {
        this.queryShopList();
        let res = await querySelectedShop();
        if (res.code === '0000' && res.data!=null) {
          this.selectedShopId = res.data.shopId;
          this.selectedShopName = res.data.shopName;
        }
      }
    }
</script>

<style scoped>

</style>
