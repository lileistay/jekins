<template>
  <!-- 会员升级记录 -->
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
                        icon="el-icon-search"
                        plain
                        @click.stop="exportExcel"
                        v-has-permi="['confinement:activityManagement:sjexport']"
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
                        :row-class-name="rowClassName"
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
                     头部列表清单
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
<!--                          <el-button-->
<!--                                  size="mini"-->
<!--                                  type="primary"-->
<!--                                  plain-->
<!--                                  class="headerBarBtn"-->
<!--                                  @click="numberInfo"-->
<!--                          >补充客户信息-->
<!--                          </el-button>-->
<!--                            <el-button-->
<!--                                    size="mini"-->
<!--                                    type="primary"-->
<!--                                    plain-->
<!--                                    class="headerBarBtn"-->
<!--                                    -->
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
    </div>
</template>
<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import {newgetData, todayTime} from '@/utils/time'
import moment from "moment/moment";
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import { export_table_to_excel } from '@/utils/utils.js'
export default {
    dicts:['Anesthesia_mode','whether'],
    components: {
        slideSearch,
        SgTable,
        ManualSubmission
    },
    data(){
        return{
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
                    lab: '客户姓名',
                    val: 'customerName',
                    width: 100,
                    custom: 'customerName'
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
                    val: 'aestheticConsultantName',
                    width: 150,
                },
                {
                    lab: '会员客服',
                    val: 'onlineUserName',
                    width: 140
                },
                {
                    lab: '会员卡号',
                    val: 'memberCard',
                    width: 150
                    // custom: 'closingTime'
                },
                {
                    lab: '可用积分',
                    val: 'usablePoints',
                },
                {
                    lab: '升级时间',
                    val: 'upgradeTime',
                    width: 140
                },
                {
                    lab: '升级前会员卡',
                    val: 'upgradeBeforeName',
                    width: 120
                },
                {
                    lab: '升级后会员卡',
                    val: 'upgradeAfterName',
                    width: 120

                },
                // {
                //     lab: '标记状态',
                //     val: 'delFlag',
                //     custom: 'delFlag'
                //
                // },
                // {
                //     lab: '标记时间',
                //     val: 'projectName',
                //     width: 140
                //
                // },
                {
                    lab: '备注',
                    val: 'remarks', // 后端没有返回数据

                },
            ],
            options:{
                // 开始时间和结束时间
                upgradeTime: {
                  type: 'datetimerangeopentions',
                    clearable: true,
                    values: [new Date(todayTime()[0]), new Date(todayTime()[1])],
                    label: '升级时间：'
                },
                // Time1: {
                //     type: 'Tdatetime',
                //     clearable: true,
                //     values: [new Date(todayTime()[0]), new Date(todayTime()[1])],
                //     label: '标记时间：'
                // },
                customerName: {
                    type: 'input',
                    label: '客户姓名',
                    clearable: true,

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
                aestheticConsultant: {
                    type: 'select',
                    label: '美学顾问：',
                    clearable: true,
                    options: []
                },
                // 会员客服
                onlineUserId: {
                    type: 'select',
                    label: '会员客服：',
                    clearable: true,
                    options: []
                },
                memberCard: {
                    type: 'input',
                    label: '会员卡号',
                    clearable: true
                },
                // 升级前会员
                upgradeBeforeId: {
                    type: 'select',
                    label: '升级前会员：',
                    clearable: true,
                    options: []
                },
                // 升级后会员
                upgradeAfterId: {
                    type: 'select',
                    label: '升级后会员：',
                    clearable: true,
                    options: this.anesthesiaTypeList
                },
                // 标记状态
                // delFlag: {
                //     type: 'select',
                //     label: '标记状态：',
                //     clearable: true,
                //     options: []
                // },

                usablePoints: {
                    type: 'Tinput',
                    label: '可用积分：',
                    clearable: true,
                    values: []
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
        },
    },
    created() {
        this.getData()
        this.getUserList() // 人员数据
        this.membershipLevelInfoList()//会员等级
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getData()
        }
      }
    },
    methods:{
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
            this.pagination.deptId=this.deptId
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


                }
                else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            this.xflagList=data
          //    let Time=data['startupgradeTime'];
          //    let Times=data['endupgradeTime'];
          //    let newTime=data['endusablePoints'];
          //    delete data['startupgradeTime'];
          // delete data['endupgradeTime']
          // delete data['endusablePoints'];
          // data['upgradeTime']=Time;
          // data['endUpgradeTime']=Times;
          // data['endUsablePoints']=newTime;

            this.$api.modules.netPower.memberUpgradeList({...data,pageSize: this.pagination.pageSize,
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
            // if (this.selectionData.length < 1) {
            //     this.$message.warning('请选择至少一名顾客')
            //     return
            // }
            this.$router.push({ path: '/memberImproveCustomerInformation', query: { customerId: '' }})
        },
        // 获得人员数据
        getUserList() {
            this.$api.user.getUserList().then((res) => {
                if (res) {
                    res.data.forEach((item) => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    this.options.onlineUserId.options = res.data // 客服


                    // doctor 医生、实际执行医生、医助
                    res.data.forEach((item) => {
                        // 医美顾问 xczxs
                        if (item.postCode === 'xczxs') {
                            this.options.aestheticConsultant.options.push(item)

                        }
                    })
                    this.options.aestheticConsultant.options = this.handleArrRepeat(
                        this.options.aestheticConsultant.options
                    ) // 医美顾问
                    this.options.onlineUserId.options = this.handleArrRepeat(
                        this.options.onlineUserId.options
                    ) // 客服

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
        //获取会员等级列表
        membershipLevelInfoList(){
            const query={
            }
            this.$api.modules.bookProject.membershipLevelInfo(query).then(res => {
                if (res) {
                    res.rows.forEach(item => {
                        item.label = item.levelDescription
                        item.value = item.membershipLevel
                    })
                    this.options.upgradeBeforeId.options=res.rows
                    this.options.upgradeAfterId.options=res.rows
                }
            })
        },
        // row背景颜色
        rowClassName({ row }) {
            const { isExecute } = row
            if (isExecute==1){
                return 'color-block-green'
            }else if (isExecute==1){
                return 'color-block-white'
            }
        },
        // 导出
        exportExcel(){
            if(this.tableData.length==0){
                this.$message.warning('打印数据为空');
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
            this.$api.modules.netPower.memberUpgradeList(data).then(res => {
                if (res) {
                    this.tableData = res.rows
                }
            }).finally(() => {
                export_table_to_excel('#out-table', '会员升级记录')
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
