<template>
  <!-- 业绩 管理 -->
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
            v-has-permi="['confinement:financialManagement:exportperformance']"

            @click.stop="exportExcel"
        >导出
        </el-button>
        <!-- v-has-permi="['payment:toBePaidList:export']" -->
      </div>
      <slot>
        <sg-table
            ref="table"
            id="out-table"
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
            :row-class-name="rowClassName"
        >
          <div slot="searchBar" class="searchBar">
            <div>统计信息</div>
            <div class="information-List">
              <span>客户数量：{{ dataList.customNum }}</span>
              <span>总执行业绩：{{ dataList.totalAmount }}</span>
              <span>总已执行业绩：{{ dataList.performance }}</span>
              <span>总待执行业绩：{{ dataList.executedPerformance }}</span>
            </div>
          </div>
          <!-- 头部列表清单 -->
          <div slot="header" style="width:100%">
            <span style="color: #7ec5b7; font-size: 18px"><i class="el-icon-s-fold"></i>列表清单</span>
            <!--              <el-button -->
            <!--                v-has-permi="['confinement:receiveReceptionSheet']"-->
            <!--                size="mini"-->
            <!--                plain-->
            <!--                type="success"-->
            <!--                style="float: right;margin-left: 5px;"-->
            <!--                @click.stop.native="receiveReceptionSheet"-->
            <!--              >批量分配业绩（一次最多五百条）</el-button>-->
            <el-button
                v-has-permi="['confinement:financialManagement:add']"
                size="mini"
                type="success"
                plain
                style="float: right;margin-left: 100px;"
                icon="el-icon-refresh-left"
                @click="interdisciplinary"
            >手工下账
            </el-button>
            <!--              <el-button-->
            <!--                v-has-permi="['confinement:billing']"-->
            <!--                size="mini"-->
            <!--                plain-->
            <!--                type="success"-->
            <!--                style="float: right;margin-left: 5px;"-->
            <!--                icon="el-icon-circle-check"-->
            <!--                @click="bill"-->
            <!--              >清理剩余治疗次数</el-button>-->
            <!--              <el-button-->
            <!--                v-has-permi="['confinement:payment']"-->
            <!--                size="mini"-->
            <!--                plain-->
            <!--                style="float: right;margin-left: 5px;"-->
            <!--                @click="advancePayment"-->
            <!--              >退款处理</el-button>-->
            <!--              <el-button-->
            <!--                v-has-permi="['confinement:deposited']"-->
            <!--                size="mini"-->
            <!--                plain-->
            <!--                style="float: right;"-->
            <!--                icon="el-icon-bank-card"-->
            <!--                @click="depositValue"-->
            <!--              >还款处理</el-button>-->
          </div>
          <template #custom="data">
            <div v-if="data.props === 'isExperience'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isExperience"/>
            </div>
            <div v-else-if="data.props === 'isRefund'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isRefund"/>
            </div>
            <div v-else-if="data.props === 'isPerformancePending'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isPerformancePending"/>
            </div>
            <div v-else-if="data.props === 'isCleanTimes'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isCleanTimes"/>
            </div>
            <div v-else-if="data.props === 'isTreatmentTime'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isTreatmentTime"/>
            </div>
            <div v-else-if="data.props === 'isTreatment'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isTreatment"/>
            </div>
            <div v-else-if="data.props === 'isPerformance'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isPerformance"/>
            </div>
            <div v-else-if="data.props === 'isRepayment'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isRepayment"/>
            </div>
            <div v-else-if="data.props === 'isRefund'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isRefund"/>
            </div>
            <!-- 客户姓名 -->
            <div v-if="data.props === 'customerName'">
              <a class="textLink" @click="handleCustomer(data.custom)">
                {{ data.custom.customerName }}
              </a>
            </div>
            <!-- 收费单号 -->
            <div v-if="data.props === 'orderNumber'">
              <a
                  style="color: #0066cc; cursor: pointer"
                  @click="handleOrderNumber(data.custom)"
              >
                {{ data.custom.orderNumber }}
              </a>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import {newgetData, todayTime} from '@/utils/time'
import moment from 'moment'

export default {
  dicts: ['whether', 'billing_type'],
  components: {
    slideSearch,
    SgTable
  },
  data() {
    return {
      pagination: { //分页数
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1,
        deptId: ''
      },
      tableData: [],
      selectionData: [],
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 100
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 160
          // custom: 'customerCard'
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 150
          // custom: 'closingTime'
        },
        {
          lab: '收费单号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '项目',
          val: 'projectName',
          width: 150
          // custom: 'project'
        },
        {
          lab: '项目单价',
          val: 'totalPayment',
          // custom: 'project'
        },
        {
          lab: '购买数量',
          val: 'quantity',
          width: 100
        },
        {
          lab: '产品数量',
          val: 'priceNum',

        },
        {
          lab: '产品总次数',
          val: 'quantitySum',
          width: 150
          // custom: 'quantitySum'
        },
        {
          lab: '剩余治疗次数',
          val: 'surplusNumber',
          width: 150
        },
        {
          lab: '退款次数',
          val: 'refundNum',
          width: 130
        },
        {
          lab: '项目业绩',
          val: 'departmentPerformance',
          width: 130
        },
        {
          lab: '已执行业绩',
          val: 'performance',
          width: 240
        },
        {
          lab: '剩余待执行业绩',
          val: 'surplusDepartmentPerformance',
          width: 300
        },
        {
          lab: '欠款金额',
          val: 'debtAmount',
          width: 130

        },
        {
          lab: '是否退款',
          val: 'isRefund',
          width: 200,
          custom: 'isRefund',
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 160
        },
        {
          lab: '一级项目',
          val: 'departmentName',
          width: 100

        },
        {
          lab: '二级项目',
          val: 'projectTypeName',
          width: 140
        },
        {
          lab: '三级项目',
          val: 'categoryName',
          width: 100

        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 100

        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 140
        },
        {
          lab: '客户代表',
          val: 'crName',
          width: 150
          // custom: 'degreeIntention',
        },
        {
          lab: '媒介类型',
          val: 'channelTypeName',
          width: 150
          // custom: 'degreeIntention',
        },
        {
          lab: '媒介来源',
          val: 'channelName',
          width: 150
          // custom: 'degreeIntention',
        },
      ],
      options: {
        checkoutTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
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
        orderNumber: {
          type: 'input',
          label: '收费单号',
          clearable: true
        },
        doctorId: {
          type: 'select',
          label: '医生:',
          clearable: true,
          options: []
        },
        departmentId: {
          type: 'select',
          label: '一级项目:',
          values: '',
          clearable: true,
        },
        projectTypeId: {
          type: 'select',
          label: '二级项目',
          clearable: true,
          values: '',
          options: []
        },
        categoryId: {
          type: 'select',
          label: '三级项目',
          clearable: true,
          values: '',
          options: []
        },
        projectName: {
          type: 'input',
          label: '项目',
          clearable: true,
          options: []
        },
        billingDepartment: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        isRefund: {
          type: 'select',
          label: '是否退款',
          clearable: true,
          values: [],
          options: []
        },
        isPerformancePending: {
          type: 'select',
          label: '是否有待执行业绩',
          clearable: true,
          options: []
        },
        isTreatmentTime: {
          type: 'select',
          label: '是否有待治疗次数',
          clearable: true,
          options: []
        },
        isRepayment: {
          type: 'select',
          label: '是否有还款',
          clearable: true,
          options: []
        },
        isTreatment: {
          type: 'select',
          label: '是否有治疗',
          clearable: true,
          options: []
        },
        isPerformance: {
          type: 'select',
          label: '是否有已执行业绩',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        customerRepresentative: {
          type: 'select',
          label: '客户代表',
          clearable: true,
          options: []
        },
        channelTypeId: {
          type: 'select',
          label: '媒介类型',
          clearable: true,
          values: '',
          options: []
        },
        channelId: {
          type: 'select',
          label: '媒介来源',
          clearable: true,
          values: '',
          options: []
        },
      },
      //媒体信息，一级列表，二级列表联动
      channelType: [],
      channelTypeChildren: [],
      dataList: {}
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getChannelInfo() // 媒介
    this.getDepartment() //获取科室

    this.getFirstObject() //获取一级列表

    this.getUserList(this.deptId)  //医生列表选项卡
    //根据字典获取是否两个状态
    // this.options.isExperience.options = this.dict.type.whether;
    this.options.isRefund.options = this.dict.type.whether;
    this.options.isPerformancePending.options = this.dict.type.whether;
    // this.options.isCleanTimes.options = this.dict.type.whether;
    this.options.isTreatmentTime.options = this.dict.type.whether;
    this.options.isTreatment.options = this.dict.type.whether;
    this.options.isPerformance.options = this.dict.type.whether;
    this.options.isRepayment.options = this.dict.type.whether;
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData(this_.deptId)
      }
    }

  },
  mounted() {
    this.getData(this.deptId) //主列表
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
      this.getChannelInfo(val)
      this.getDepartment()
      this.getFirstObject()
      this.getUserList(val)
      this.getData(val)
    },
    // 三级联动监听
    'options.departmentId.values'() {
      this.options.projectTypeId.values = ''
      this.getSecondObject(this.options.departmentId.values)
    },
    'options.projectTypeId.values'() {
      this.options.categoryId.values = ''
      this.getThirdObject(this.options.projectTypeId.values)
    },
    //媒介类型二级联动监听
    'options.channelTypeId.values'() {
      this.options.channelId.values = ''
      this.getChannelInfoDetail(this.options.channelTypeId.values)
    }
  },
  methods: {
    rowClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
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
      this.$router.push({
        path: 'billDetails'
      })
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    getData(isSearch) { //查询
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1

      }
      this.pagination.deptId = this.deptId
      let data = {};
      for (let k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if ((this.options[k].values[0] === 'null' && this.options[k].values[1] !== 'null')) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }

          if ((this.options[k].values[1] === null && this.options[k].values[0] !== 'null')) {
            console.log(k)
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = ''
          }
          if ((this.options[k].values[1] === 'null' && this.options[k].values[0] === 'null')) {
            console.log('进来了没')
            data[k] = undefined
            data['end' + k] = undefined
          }
          if ((this.options[k].values[1] !== null && this.options[k].values[0] !== 'null')) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
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
      this.$api.demand.performanceManagement({...data, ...this.pagination}).then(res => {
        if (res.rows) {
          this.tableData = res.rows;
          this.dataList = res.data
          this.pagination.total = res.total
        }
      })
    },
    rowClick(e) { //点击每行
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
      const select = this.$refs.table.$refs.multipleTable.selection;
      this.selectionData =select;
    },
    handleSelectionChange(row) {
      this.selectionData = row[1];
    },
    receiveReceptionSheet() {
    },
    interdisciplinary() {
      console.log(this.selectionData)
      if (this.selectionData.length !== 0) {
        this.$router.push({path: 'performanceManualPosting', query: {order: JSON.stringify(this.selectionData)}})
      } else if (this.selectionData.length === 0) {
        this.$msgbox({
          title: '消息',
          message: '必须选择一条数据',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
      }

    },
    bill() {
    },
    advancePayment() {
    },
    depositValue() {
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
    exportExcel() {  //导出excel
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      let data = {};
      for (let k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if ((this.options[k].values[0] === 'null' && this.options[k].values[1] !== 'null')) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }

          if ((this.options[k].values[1] === null && this.options[k].values[0] !== 'null')) {
            console.log(k)
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = ''
          }
          if ((this.options[k].values[1] === 'null' && this.options[k].values[0] === 'null')) {
            console.log('进来了没')
            data[k] = undefined
            data['end' + k] = undefined
          }
          if ((this.options[k].values[1] !== null && this.options[k].values[0] !== 'null')) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data.deptId = this.deptId;
      this.$api.demand.performanceManagement({...data,}).then(res => {
        if (res.rows) {
          this.tableData = res.rows;
          this.dataList = res.data
          this.pagination.total = res.total

        }
      }).finally(() => {
        this.$export('#out-table', '业绩管理')
        setInterval(() => {
          this.submitLoadings = false
        }, 5000)
      })
    },

    getUserList() { //获取医生列表
      const data = {
        deptId: this.deptId,
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          console.log(res);
          res.data.forEach(item => {
            item.label = item.nickName,
                item.value = item.userId
          })
          res.data.forEach(item => {
            if (item.postCode === 'doctor') { //查询医生列表
              this.options.doctorId.options.push(item);
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') { //客户代表
              this.options.customerRepresentative.options.push(item);
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') { //美学顾问
              this.options.aestheticConsultant.options.push(item);
            }
          })
          this.options.doctorId.options = this.unique(this.options.doctorId.options)
          this.options.customerRepresentative.options = this.unique(this.options.customerRepresentative.options)
          this.options.aestheticConsultant.options = this.unique(this.options.aestheticConsultant.options)
        }
      })
    },
    unique(arr) { //去重字典
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    getFirstObject() { //一级列表
      const data = {
        deptId: this.deptId,
        status: '0',
        // isDepartment: '1'
      }
      this.$api.dept.DepartmentList(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.departmentId.options = res.rows
        }

      })
    },
    getSecondObject(id) { //二级列表
      this.$api.dept.TypeList({departmentId: id}, 'get').then(res => {
        console.log(res);
        if (res) {
          res.rows.forEach(item => {
            item.label = item.projectTypeName
            item.value = item.projectTypeId
          })
          this.options.projectTypeId.options = res.rows
        }
      })
    },
    getThirdObject(id) {  //三级列表
      this.$api.dept.CategoryList({projectTypeId: id}, 'get').then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
          this.options.categoryId.options = res.rows
        }
      })
    },
    getChannelInfo() {  //获取媒介一级列表
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.channel.noPageTypeList(data).then(res => {
        if (res) {
          if (res.rows) {
            ;
            res.rows.forEach(item => {
              item.label = item.typeName
              item.value = item.typeId
            })
            this.options.channelTypeId.options = res.rows
          }
        }
      })
    },
    getChannelInfoDetail(id) { //获取媒介二级列表
      const data = {
        deptId: this.deptId,
        typeId: id
      }
      this.$api.modules.channel.noPageList(data).then(res => {
        if (res) {
          console.log(res)
          res.rows.forEach(item => {
            item.label = item.channelName
            item.value = item.channelId
          })
          this.options.channelId.options = res.rows
        }
      })
    },
    getDepartment() { //获取科室接口
      const data = {
        deptId: this.deptId,
      }
      this.$api.modules.filing.departmentInfoList(data).then(res => {
        if (res) {
          console.log(res.rows)
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
        }
        this.options.billingDepartment.options = res.rows
      })
    },
  }
}


</script>

<style scoped>

.content-area {
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

.information-List > span {
  display: inline-block;
  margin-right: 5px;
}

/*.buttonBox>.el-button{*/
/*  width: 60px;*/
/*  height: 30px;*/
/*}*/

</style>
