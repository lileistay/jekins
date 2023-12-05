<template>
  <!-- 积分兑换查询 -->
    <div class="content-area">
        <slideSearch :options="options">
            <div slot="btnBar" class="buttonBox">
                <el-button
                        size="mini"
                        icon="el-icon-search"
                        type="primary"
                        plain
                        @click.stop="getData(true)"
                        @keydown.enter.native="getData(true)"
                >查询
                </el-button>
                <el-button
                        type="success"
                        size="mini"
                        icon="el-icon-upload2"
                        plain
                        @click.stop="exportExcel"
                        v-has-permi="['confinement:activityManagement:changeexport']"
                >导出
                </el-button>
                <!-- v-has-permi="['payment:toBePaidList:export']" -->
            </div>
            <slot>
                <sg-table
                        id="out-table"
                        ref="table"
                        :sg-ref="'multipleTable'"
                        size="mini"
                        border
                        index="序号"
                        selection
                        highlight-current-row
                        :table-data="tableData"
                        :columns="columns"
                        :pagination="pagination"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        @selection-change="handleSelectionChange"
                        @row-click="rowClick"
                >
                    <div slot="searchBar" class="searchBar">
                        <div>统计信息</div>
                        <div class="information-List">
                            <span>客户数量：{{statisticalData.customNum}}</span>
                        </div>
                    </div>
                    <!-- 头部列表清单 -->
                    <div slot="header" style="width:100%">
                        <span style="color: #7ec5b7; font-size: 18px"><i class="el-icon-s-fold"></i>列表清单</span>
<!--                        <span style="float: right">-->
<!--                          <el-button-->
<!--                                  size="mini"-->
<!--                                  type="primary"-->
<!--                                  plain-->
<!--                                  class="headerBarBtn"-->
<!--                                  @click="openManualDialog"-->
<!--                          >手工上报-->
<!--                          </el-button>-->
                          <el-button
                                  size="mini"
                                  type="primary"
                                  plain
                                  class="headerBarBtn"
                                  @click="numberInfo"
                          >退回礼品
                          </el-button>
<!--                            <el-button-->
<!--                                    size="mini"-->
<!--                                    type="primary"-->
<!--                                    plain-->
<!--                                    class="headerBarBtn"-->
<!--                                    @click="numberInfo"-->
<!--                            >标记-->
<!--                          </el-button>-->
<!--                        </span>-->
                    </div>
                    <template #custom="data">
                        <!-- 客户姓名 -->
                        <div v-if="data.props === 'customerName'">
                            <a class="textLink" @click="handleCustomer(data.custom)">
                                {{ data.custom.customerName }}
                            </a>
                        </div>
                        <div v-if="data.props === 'amoun'">
                            <span v-if="data.custom.amoun>=0">礼品兑换入库</span>
                            <span v-else>礼品兑换出库</span>
                        </div>
                    </template>
                </sg-table>
            </slot>
        </slideSearch>
        <!--    手工上报弹窗-->
        <manual-submission
                :show-manual-dialog="showManualDialog"
                :inner-dialog="innerDialog"
                :selection-data="selectionData"
                :action="Action"
                @closeInnerDialog="closeInnerDialog"
                @closeShowManualDialog="closeShowManualDialog"
                @setInnerDialog="setInnerDialog"
        />
      <sgDialog title="退还礼品"  size="730px" :dialog="showManualDialoggoods" @handleClose="showManualDialoggoods=false">
        <div slot="out" >
          <div style="height: 350px;display: flex;flex-wrap: wrap;align-content: flex-start">
            <div style="width: 50%;height: 30px;margin-top: 20px;display: flex">
              <div style="width: 125px;text-align: right">
                会员名：
              </div>
              <el-input size="mini" :placeholder="selectionData.length>0?selectionData[0].customerName:''" disabled style="width: 200px"></el-input>
            </div>
            <div style="width: 50%;height: 30px;margin-top: 20px;display: flex">
              礼品类型：<el-input size="mini" :placeholder="selectionData.length>0?selectionData[0].giftTypeName:''" disabled style="width: 200px"></el-input>
            </div>
            <div style="width: 50%;margin-top: 20px;display: flex">
              <div style="width: 125px;text-align: right">
                礼品名称：
              </div>
              <el-input size="mini" :placeholder="selectionData.length>0?selectionData[0].giftName:''" disabled style="width: 200px"></el-input>
            </div>
            <div style="width: 50%;margin-top: 20px">
              礼品数量：<el-input size="mini" :placeholder="selectionData.length>0?selectionData[0].amount:''" disabled style="width: 200px"></el-input>
            </div>
            <div style="width: 50%;margin-top: 20px">
              单个产品所需积分：<el-input size="mini" :placeholder="selectionData.length>0?selectionData[0].redeemPoints:''"  style="width: 200px" disabled></el-input>
            </div>
            <div style="width: 50%;margin-top: 20px;position: relative">
             <span style="color: red;position: absolute;left:-8px">*</span>  退还数量：<el-input size="mini" placeholder="请输入退还数量"  style="width: 200px" v-model="dg"></el-input>
            </div>

            <div style="width: 100%;margin-top: 20px;display: flex">
              <div style="width: 125px;text-align: right">
                备注 ：
              </div>
            <el-input size="mini" placeholder="请输入备注" type="textarea"
                      :rows="2" style="width: 500px" v-model="remarks"></el-input>
            </div>
            <div class=""
                 style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
              <div style="width: 160px;height: 40px;">
                <el-button type="primary" size="mini" @click="ok">确定</el-button>
                <el-button @click="showManualDialoggoods=false" size="mini">取消</el-button>
              </div>
            </div>
          </div>


        </div>
      </sgDialog>
    </div>
</template>
<script>
import slideSearch from '@/components/SlideSearchBar/index'
import { export_table_to_excel } from '@/utils/utils.js'
import SgTable from '@/components/Table'
import {newgetData, todayTime} from '@/utils/time'
import moment from "moment/moment";
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import sgDialog from '@/components/Dialog/index'
export default {
    dicts:['Anesthesia_mode','whether'],
    components: {
        slideSearch,
        SgTable,
        ManualSubmission,
      sgDialog
    },
    data(){
        return{
          showManualDialoggoods:false,
          remarks:"",
          dg:"",
            pagination: { //分页数
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1,
                deptId:''
            },
            statisticalData:[],
            tableData:[],
            selectionData:[],
            columns: [
                {
                    lab: '推荐人',
                    val: '',

                },
                {
                    lab: '客户姓名',
                    val: 'customerName',
                    custom: 'customerName',
                    width: 100,

                },
                {
                    lab: '电话',
                    val: 'customPhone',
                    width: 100
                },
                {
                    lab: '客户卡号',
                    val: 'customCardNumber',
                    width: 165
                    // custom: 'customerCard'
                },

                {
                    lab: '美学顾问',
                    val: 'receptionName',
                    width: 150,
                },
                {
                    lab: '建档时间',
                    val: 'createTime',
                    width: 140
                },
                {
                    lab: '累计消费',
                    val: 'consumeTotal',
                },
                {
                    lab: '礼品类型',
                    val: 'giftTypeName',
                },
                {
                    lab: '礼品名称',
                    val: 'giftName',
                    width: 120
                },
                {
                    lab: '执行时间',
                    val: 'exchangeTime',
                    width: 140

                },
                {
                    lab: '礼品进出',
                    val: 'amoun',
                    custom: 'amoun',
                    width: 130

                },
                {
                    lab: '礼品数量',
                    val: 'amount',
                    width: 100

                },
                {
                    lab: '礼品积分(每单位)',
                    val: 'redeemPoints',
                    width: 140

                },
                {
                    lab: '总积分变动',
                    val: 'pointsTotal',
                    width: 140

                },
                {
                    lab: '已退回数量',
                    val: 'refundNum',
                    width: 140

                },
                {
                    lab: '执行人',
                    val: 'createBy',
                    width: 140

                },
                {
                    lab: '备注',
                    val: 'remarks',
                },

            ],
            options:{
                // 开始时间和结束时间
                ExchangeTime: {
                  type: 'datetimerangeopentions',
                    clearable: true,
                    values: [new Date(todayTime()[0]), new Date(todayTime()[1])],
                    label: '兑换时间：'
                },
                CreateTime: {
                  type: 'datetimerangeopentions',
                    clearable: true,
                    values: [new Date(todayTime()[0]), new Date(todayTime()[1])],
                    label: '建档时间：'
                },
                customerName: {
                    type: 'input',
                    label: '客户姓名',
                    clearable: true
                },
                customPhone: {
                    type: 'input',
                    label: '电话:',
                    clearable: true
                },
                customCardNumber: {
                    type: 'input',
                    label: '客户卡号',
                    clearable: true
                },
                // 医美顾问
                giftTypeId: {
                    type: 'select',
                    label: '礼品类型：',
                    clearable: true,
                    options: []
                },
                // 医美顾问
                giftTypeListId: {
                    type: 'select',
                    label: '礼品名称：',
                    clearable: true,
                    options: []
                },
                amount: {
                    type: 'Tinput',
                    label: '兑换数量：',
                    clearable: true,
                    values: []
                },
                redeemPoints: {
                    type: 'Tinput',
                    label: '礼品积分：',
                    clearable: true,
                    values: []
                },
                pointsTotal: {
                    type: 'Tinput',
                    label: '总积分变动：',
                    clearable: true,
                    values: []
                },
                receptionId: {
                    type: 'select',
                    label: '美学顾问：',
                    clearable: true,
                    options: []
                },
            },
            xflagList:{},
            // 手工上报
            Action: {},
            showManualDialog: false,
            innerDialog: false,
        }
    },
    computed: {
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId
            }
        }
    },
    watch: {
        deptId(val) {
            this.deptId = val
            this.getData()
          this.getUserList() // 人员数据
          this.giftBasicInfo()
          this.followUpRecordList()
        },
    },
    created() {
        this.getData()
        this.getUserList() // 人员数据
        this.giftBasicInfo()
        this.followUpRecordList()
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getData()
        }
      }
    },
    methods:{
      ok(){
       if(this.dg==''||this.dg==null){
         this.$message.warning('请输入退还数量');
         return;
       }
       let data=this.selectionData[0];
       data.remarks=this.remarks;
       data.changeState="3";
       data.changeAmount=this.dg;
       this.$api.confinementRoom.giftIncomingOutgoingInfo(data).then(res=>{
         if(res.code==200){
           this.$message.success('退还成功')
           this.getData();
           this.showManualDialoggoods=false;
         }
       })

      },
        // 打开手工上报弹窗
        openManualDialog() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行修改')
                return
            }
            this.Action = this.selectionData[0]
            this.showManualDialog = true
        },
        // 关闭手工上报
        closeShowManualDialog() {
            this.showManualDialog = false
        },
        // 手工上报打开高级选项
        setInnerDialog() {
            this.innerDialog = true
            this.showManualDialog = false
        },
        // 手工上报关闭高级选项
        closeInnerDialog() {
            this.innerDialog = false
        },
        // 列表数据
        getData(isSearch){ //查询
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1

            }
            let data = {};
            for(let  k in this.options){
                // 当前治疗次数
                if (
                    this.options[k].type === 'Tinput' &&
                    Array.isArray(this.options[k].values)
                ) {
                    data[k] = this.options[k].values[0]
                    data[ 'end' + k] = this.options[k].values[1]
                } else if (this.options[k].type === 'Tdatetime') {
                    // 治疗时间
                    if (
                        this.options[k].values[0] === null &&
                        this.options[k].values[1] !== null
                    ) {
                        data['end' + k] = moment(this.options[k].values[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (
                        this.options[k].values[1] === null &&
                        this.options[k].values[0] !== null
                    ) {
                        data['start' + k] = moment(
                            this.options[k].values[0]
                        ).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (
                        this.options[k].values[1] === null &&
                        this.options[k].values[0] === null
                    ) {
                        data['start' + k] = undefined
                        data['end' + k] = undefined
                    }
                    if (
                        this.options[k].values[1] !== null &&
                        this.options[k].values[0] !== null
                    ) {
                        data['start' + k] = moment(
                            this.options[k].values[0]
                        ).format('YYYY-MM-DD HH:mm:ss')
                        data['end' + k] = moment(this.options[k].values[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (this.options[k].values.length === 0) {
                        data['start' + k] = undefined
                        data['end' + k] = undefined
                    }
                }
                else if(this.options[k].type === 'datetimerangeopentions'){
                  if(this.options[k].values){
                    if(this.options[k].values.length!==0){
                      data[k] =newgetData(this.options[k].values[0])
                      data['end' + k] =newgetData(this.options[k].values[1])
                    }
                  }


                }else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            this.xflagList=data;
            // let Time=data.startCreateTime;
            // let Times=data.startExchangeTime
            // delete  data['startCreateTime'];
            // delete  data['startExchangeTime']
            // data['createTime']=Time;
            // data['exchangeTime']=Times;
          if(data.ExchangeTime){
            let time=data.ExchangeTime;
            data.exchangeTime=time;
            delete  data.ExchangeTime
          }
          if(data.CreateTime){
            let times=data.CreateTime;
            data.createTime=times
            delete  data.CreateTime
          }
          if(data.amount<0){
            this.$message.warning('兑换数量存在负数,请重新输入');
            return
          }
          if(data.endamount<0){
            this.$message.warning('兑换数量存在负数,请重新输入');
            return
          }
          if(data.endamount<data.amount){
            this.$message.warning('兑换数量二应大于兑换数量一');
            return
          }
          //总积分变动

          if(data.pointsTotal<0){
            this.$message.warning('总积分变动存在负数,请重新输入');
            return
          }
          if(data.endpointsTotal<0){
            this.$message.warning('总积分变动存在负数,请重新输入');
            return
          }
          if(data.endpointsTotal<data.pointsTotal){
            this.$message.warning('总积分变动二应大于总积分变动一');
            return
          }
            this.$api.modules.netPower.getPointsExchangeList({...data,pageSize: this.pagination.pageSize,
                pageNum: this.pagination.currentPage,deptId:this.deptId}).then(res =>{
                if(res.rows){
                    this.tableData = res.rows;
                    this.dataList=res.data
                    this.pagination.total = res.total
                    this.statisticalData = res.data==null?'':res.data
                }
            })
        },
        rowClick(e) { //点击每行
            this.$refs.table.$refs.multipleTable.clearSelection()
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
            // const select = this.$refs.table.$refs.multipleTable.selection
            // this.handleSelectionChange(select)
        },
        // 选中的数组
        handleSelectionChange(row) {
            this.selectionData = row[1];
        },
        // 搜索
        handleSearch() {
            this.pagination = {
                ...this.pagination,
                currentPage: 1
            }
            this.getData()
        },
        // 处理客户名称
        handleCustomer(personal) {
            const id = personal.id
            this.$router.push({
                path: 'customerInfo',
                query: {
                    id,
                    status: personal.customerStatus,
                    noDeal: personal.billingStatus
                }
            })
        },
        // 收费单编号
        handleOrderNumber(data) {
            // this.$router.push({
            //     path: 'billDetails',
            //     query: { data: JSON.stringify(data) }
            // })
        },
        // 补充客户信息
        async numberInfo() {
            if(this.selectionData.length==0||this.selectionData.length>1){
              this.$message.warning('请选择一名顾客进行礼品退还');
              return;
            }
            if( Number(this.selectionData[0].amount)>0){
              this.$message.warning('该礼品已退');
              return
            }
            this.dg='';
            this.remarks=''
            this.showManualDialoggoods=true;

        },
        // 获得人员数据
        getUserList() {
          const query={
            deptId:this.deptId
          }
            this.$api.user.getUserList(query).then((res) => {
                if (res) {
                    res.data.forEach((item) => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    // doctor 医生、实际执行医生、医助
                    res.data.forEach((item) => {
                        // 医美顾问 xczxs
                        if (item.postCode === 'xczxs') {
                            this.options.receptionId.options.push(item)

                        }
                    })
                    this.options.receptionId.options = this.handleArrRepeat(
                        this.options.receptionId.options
                    ) // 医美顾问
                }
            })
        },
        // 数组去重
        handleArrRepeat(arr) {
            const newArr = []
            const empty = {}
            arr.forEach((item) => {
                if (!empty[item.userId]) {
                    newArr.push(item)
                    empty[item.userId] = true
                }
            })
            return newArr
        },
        //获取礼品类型列表
        followUpRecordList(){
            const query={
              deptId:this.deptId
            }
            this.$api.modules.bookProject.giftTypeInfo(query).then(res => {
                if (res) {
                    res.rows.forEach(item=>{
                        item.value=item.giftTypeId
                        item.label=item.giftTypeName
                    })
                    this.options.giftTypeId.options=res.rows
                }
            })
        },
        //获取礼品基本信息列表
        giftBasicInfo(){
            const query={
              deptId:this.deptId
            }
            this.$api.modules.bookProject.giftBasicInfo(query).then(res => {
                if (res) {
                    res.rows.forEach(item=>{
                        item.value=item.giftTypeListId
                        item.label=item.giftName
                    })
                    this.options.giftTypeListId.options=res.rows
                }
            })
        },

        // 导出
        exportExcel(){
            if(this.tableData.length==0){
                this.$message.warning("导出数据为空");
                return
            }
            var data = {}
            for(let  k in this.options){
                // 当前治疗次数
                if (
                    this.options[k].type === 'Tinput' &&
                    Array.isArray(this.options[k].values)
                ) {
                    data[k] = this.options[k].values[0]
                    data[ 'end' + k] = this.options[k].values[1]
                } else if (this.options[k].type === 'Tdatetime') {
                    // 治疗时间
                    if (
                        this.options[k].values[0] === null &&
                        this.options[k].values[1] !== null
                    ) {
                        data['end' + k] = moment(this.options[k].values[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (
                        this.options[k].values[1] === null &&
                        this.options[k].values[0] !== null
                    ) {
                        data['start' + k] = moment(
                            this.options[k].values[0]
                        ).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (
                        this.options[k].values[1] === null &&
                        this.options[k].values[0] === null
                    ) {
                        data['start' + k] = undefined
                        data['end' + k] = undefined
                    }
                    if (
                        this.options[k].values[1] !== null &&
                        this.options[k].values[0] !== null
                    ) {
                        data['start' + k] = moment(
                            this.options[k].values[0]
                        ).format('YYYY-MM-DD HH:mm:ss')
                        data['end' + k] = moment(this.options[k].values[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (this.options[k].values.length === 0) {
                        data['start' + k] = undefined
                        data['end' + k] = undefined
                    }
                } else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            data = Object.assign(data)
            this.$message({
                message: '稍等一下，马上就好',
                type: 'success'
            })
            this.$api.modules.netPower.getPointsExchangeList(data).then(res => {
                if (res) {
                    this.tableData = res.rows
                    console.log(this.tableData,res.rows )
                }
            }).finally(() => {
                export_table_to_excel('#out-table', '积分兑换列表')
            })
        },
        currentChange(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getData()
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getData()
        },
    }
}
</script>
<style scoped>
.goods{
  width: 100%;
  height: 300px;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
}
.content-area{
    width: 100%;
    height: 100%;
}
.searchBar {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 30px;
    color: #999;
}

.information-List >span{
    display: inline-block;
    margin-right: 5px;
}

/*.buttonBox>.el-button{*/
/*  width: 60px;*/
/*  height: 30px;*/
/*}*/
::v-deep .el-input--prefix .el-input__inner {
    padding-left: 4px !important;
}
.color-block-success {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #c6f9c3;
    border-radius: 2px;
}

.color-block-ungenerated {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 2px;
}
::v-deep .el-table--scrollable-y .el-table__body-wrapper{

}
</style>
<style>
.el-input__prefix {
    display: none;
}
.color-block-white {
    background: white !important;
}
.color-block-green {
    background-color: #c6f9c3 !important;
}
/*.el-table__body-wrapper {*/
/*    &::-webkit-scrollbar {*/
/*        height: 5px*/
/*    }*/
/*}*/
/*.el-table__fixed-body-wrapper .el-table__body {*/
/*    padding-bottom: 5px;*/
/*}*/
</style>
