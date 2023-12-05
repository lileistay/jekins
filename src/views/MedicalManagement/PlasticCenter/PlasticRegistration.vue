<template>
  <!-- 整形首诊登记 -->
  <div class="container">
    <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      size="mini"
      :selection="true"
      :border="true"
      index="序号"
      :highlight-current-row="true"
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      :row-class-name="rowClassName"
      @selection-change="handleSelectionChange"
      @size-change="sizeChange"
      @current-change="change"
      @row-click="rowClick"
    >
      <div slot="searchBar">
        <el-form size="mini" :model="form" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input v-model="form.customPhone" :clearable="true" />
              </el-form-item>
              <el-form-item label="客户姓名：">
                <el-input v-model="form.customerName" :clearable="true" />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input v-model="form.customCardNumber" :clearable="true" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="一级项目：">
                <el-select filterable v-model="form.crfDepartmentId" style="width: 100%" :clearable="true" :filterable="true">
                  <el-option v-for="item in crList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="二级项目：">
                <el-select filterable v-model="form.crfProjectTypeId" style="width: 100%" :clearable="true" :filterable="true">
                  <el-option v-for="item in crfProList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="三级项目：">
                <el-select filterable v-model="form.crfBookingPeojectId" style="width: 100%" :clearable="true" :filterable="true">
                  <el-option v-for="item in crfBookList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" />
            <el-col :span="4">
              <el-form-item label="是否安排：">
                <el-select filterable filterable v-model="arrange" style="width: 100%" :clearable="true">
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="结账时间：">
                <el-date-picker
                  v-model="form.checkoutTime"
                  style="width:200px;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                  :clearable="true"

                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="项目名称：">
                <el-input v-model="form.projectName" :clearable="true" />
              </el-form-item>
              <el-form-item label="医生：">
                <el-select  v-model="form.doctorId" :filter-method="doctorFilter" :filterable="true" style="width: 100%" :clearable="true">
                  <el-option v-for="item in doctor" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="是否退款项目：">
                <el-select filterable v-model="back" value="" :clearable="true">
                  <el-option value="0" label="否" />
                  <el-option value="1" label="是" />
                </el-select>
              </el-form-item>
              <el-form-item label="美学顾问：">
                <el-select
                  v-model="form.aestheticConsultant"
                  :filter-method="aestheFilter"
                  style="width: 100%"
                  :filterable="true"
                  :clearable="true"
                >
                  <el-option v-for="item in esthetics" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button
                icon="el-icon-search"
                type="primary"
                :plain="true"
                style="float: right"
                size="mini"
                @click="getData(true)"
                @keydown.enter.native="getData(true)"
              >搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
          <span><i style="background-color:#fde5d4" />未安排(未入住)</span>
          <span><i style="background-color:#c6f9c3" />已安排</span>
          <span><i style="background-color:#587fa1" />有退款</span>
          <span><i style="background-color:rgb(252,157,154)" />已入住(未安排)</span>
        </div>
        <div>
          <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus">手工录入</el-button>
          <el-button size="mini" :plain="true" type="danger" icon="el-icon-close">手工录入删除</el-button>
          <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click="Initiate">住院申请</el-button>
          <el-button
            size="mini"
            :plain="true"
            type="success"
            icon="el-icon-office-building"
            @click="hospitalization"
          >住院管理</el-button>
          <el-button size="mini" :plain="true" type="primary" icon="el-icon-bank-card" @click="Surgery">发起手术</el-button>
          <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click="triage">分诊登记</el-button>
          <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click.stop.native="openManualDialog">手工上报</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'customerName'">
          <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
        </div>
        <div v-else-if="data.props === 'state'">
          <!-- {{ data.custom.inpatientStatus==1?'已安排':'未安排' }} -->
          {{ data.custom.state==0?'否':'是' }}
          <!-- <show-dict-data :options="dict.type.just_needed" :value="data.custom.state" /> -->
        </div>
        <div v-else-if="data.props === 'isRefund'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.isRefund" />
        </div>
        <div v-else-if="data.props === 'orderNumber'">
          <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
            {{ data.custom.orderNumber }}
          </a>
        </div>
      </template>
    </sg-table>
    <!-- 手工上报 -->
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
import SgTable from '@/components/Table'
import PinyinMatch from 'pinyin-match'
import { todayTime } from '@/utils/time'
import ManualSubmission from '@/components/ManualSubmission/indexTwo.vue'
export default {
  dicts: ['just_needed', 'whether'],
  components: {
    ManualSubmission,
    SgTable
  },
  data() {
    return {
      // 手工上报
      Action: {},
      innerDialog: false,
      showManualDialog: false,
      services: '', // 科室服务助理
      mainservices: '', // 主服务助理
      arrange: '', // 是否安排
      affiliation: '', // 科室归属服务助理
      back: '', // 是否退款
      valuehospital: '',
      valuehour: '',
      selectionData: [], // 选择的数据
      crList: [], // 一级
      crfProList: [], // 二级
      crfBookList: [], // 三级
      form: {
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        doctorId: '',
        crfDepartmentId: '', // 一级
        crfProjectTypeId: '', // 二级
        crfBookingPeojectId: '', // 三级
        checkoutTime: todayTime()
      },
      doctor: [],
      doctorList: [],
      esthetics: [],
      estheticsList: [],
      tableData: [], //
      columns: [
        {
          lab: '客户',
          val: 'customerName',
          custom: 'customerName',
          width: 120
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        // {
        //   lab: '客户类型',
        //   val: 'categoryId'
        // },
        {
          lab: '是否安排',
          val: 'state',
          custom: 'state'
        },
        // {
        //   lab: '是否已住院',
        //   val: '',
        //   width: 120
        // },
        {
          lab: '是否退款',
          val: 'isRefund',
          custom: 'isRefund'
        },
        // {
        //   lab: '病历门诊',
        //   val: ''
        // },
        // {
        //   lab: '住院病历',
        //   val: ''
        // },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '结账日期',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '一级',
          val: 'departmentName'
        },
        {
          lab: '二级',
          val: 'projectTypeName',
          width: 140
        },
        {
          lab: '三级',
          val: 'categoryName',
          width: 140
        },
        {
          lab: '项目名称',
          val: 'projectName',
          width: 140
        },
        {
          lab: '医生',
          val: 'doctorName'
        },
        // {
        //   lab: '科室服务助理',
        //   val: '',
        //   width: 120
        // },
        // {
        //   lab: '主服务助理',
        //   val: '',
        //   width: 120
        // },
        {
          lab: '美学顾问',
          val: 'acName'
        },
        {
          lab: '购买数量',
          val: 'quantity',
          width: 100
        },
        {
          lab: '产品数量',
          val: 'priceNum'
        },
        {
          lab: '总次数',
          val: 'quantitySum'
        },
        {
          lab: '已治疗次数',
          val: 'treatedNumber,',
          width: 100
        },
        {
          lab: '剩余次数',
          val: 'surplusQuantity'
        },
        {
          lab: '退款次数',
          val: 'refundNum'
        }
      ],
      hospitalTimes: '',
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      }
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
    'form.crfDepartmentId'() {
      this.crfProList = []
      this.form.crfProjectTypeId = ''
      this.crfBookList = []
      this.form.crfBookingPeojectId = ''
      this.getDepartmentTwo(this.form.crfDepartmentId)
    },
    'form.crfProjectTypeId'() {
      this.crfBookList = []
      this.form.crfBookingPeojectId = ''
      this.getDepartmentThree(this.form.crfProjectTypeId)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getUserList()
    this.getDepartmentOne()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    },
    // 点击收费单号跳转
    orderNumber(data) {
      // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    aestheFilter(val) {
      if (val) {
        this.esthetics = this.estheticsList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.esthetics = this.estheticsList
      }
    },
    doctorFilter(val) {
      if (val) {
        this.doctor = this.doctorList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.doctor = this.doctorList
      }
    },
    newgetData(value) {
      const DateObj = new Date(value)
      // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
      const year = DateObj.getFullYear()
      let month = DateObj.getMonth() + 1
      let day = DateObj.getDate()
      let hh = DateObj.getHours()
      let mm = DateObj.getMinutes()
      let ss = DateObj.getSeconds()
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      if (hh >= 0 && hh <= 9) {
        hh = '0' + hh
      }
      if (mm >= 0 && mm <= 9) {
        mm = '0' + mm
      }
      if (ss >= 0 && ss <= 9) {
        ss = '0' + ss
      }
      // 最终时间
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
    },
    // 搜索
    async getData(isSearch) {
      this.selectionData = []
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        if (this.form.checkoutTime !== null) {
          this.form.checkoutTime[0] = this.newgetData(this.form.checkoutTime[0])
          this.form.checkoutTime[1] = this.newgetData(this.form.checkoutTime[1])
        }
      }

      // services:"",//科室服务助理
      // mainservices:"",//主服务助理
      // arrange:"",//是否安排
      // affiliation:"",//科室归属服务助理
      // back:'',//是否退款
      // console.log(this.form.checkoutTime[0],'haha');

      this.$set(this.form, 'deptId', this.deptId)
      await this.$api.medical.skinTriageList({
        ...this.pagination, ...this.form,
        checkoutTime: this.form.checkoutTime ? this.form.checkoutTime[0] : null,
        endcheckoutTime: this.form.checkoutTime ? this.form.checkoutTime[1] : null,
        billingDepartment: this.$route.query.departmentId,
        isRetreat: this.back,
        state: this.arrange
      }).then(res => {
        if (res.code) {
          this.selectionData = []
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 预约项目 1 2 3 级
    async getDepartmentOne() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0',
        isDepartment: '1'
      }
      await this.$api.dept.DepartmentList(data).then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.crList = res.rows
        }
      })
    },
    getDepartmentTwo(id) {
      this.$api.dept.TypeList({ departmentId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.projectTypeName
            item.value = item.projectTypeId
          })
          this.crfProList = res.rows
        }
      })
    },
    getDepartmentThree(id) {
      this.$api.dept.CategoryList({ projectTypeId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
          this.crfBookList = res.rows
        }
      })
    },
    newDate(time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    // 发起住院
    async Initiate() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客发起住院申请')
        return
      }
      if (this.selectionData.length > 1) {
        this.$message.warning('请仅选择一名顾客发起住院申请')
        return
      }
      if (this.selectionData[0].inpatientStatus !== 1 && this.selectionData[0].inpatientStatus !== 2) {
        localStorage.setItem('your', JSON.stringify(this.selectionData[0]))
        this.$router.push({ path: 'initiateHospitalization', query: { data: JSON.stringify(this.selectionData[0]) }})
      } else {
        if(this.selectionData[0].inpatientStatus=='2'){
          this.$message('该顾客已发起住院，请勿重复发起住院')
        }else{
          this.$message('该顾客已住院，请勿重复发起住院')
        }

      }
    },
    // 住院管理
    hospitalization() {
      this.$router.push({ path: 'inpatientManagement' })
    },
    // 发起手术
    Surgery() {
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      if (this.selectionData[0].quantitySum === 0) {
        this.$message.warning('剩余次数为0，无法发起手术')
        return
      }
      this.$router.push({ path: 'InitiateSurgery', query: { data: JSON.stringify(this.selectionData[0]) }})
    },
    // 分诊登记
    triage() {
      if (this.selectionData.length === 0) {
        this.$message.warning('请选择顾客进行修改')
        return
      }
      // 判断是否是同一个人
      // 对选中的数据取出id 转为set直接去重，判断去重后的set长度，如果大于0表示选中了多个不同客户
      const ids = new Set(this.selectionData.flatMap(item => [item.id]))
      if (ids.size > 1) {
        this.$message.warning('请选择同一个顾客发起批量登记')
        return
      }
      // 选择的数据是否有剩余治疗次数 并且 已经登记的次数是否大于剩余次数
      const find = this.selectionData.find(item => item.surplusQuantity === 0 || item.arrangeNumber >= item.surplusQuantity)
      if (find) {
        this.$message.warning('部分项目剩余治疗次数不足或已登记次数大于剩余次数，无法发起登记，请重新选择或取消旧登记')
        return
      }
      // 选择的数据存储到store,防止登记页面刷新页面数据丢失
      this.$store.dispatch('setTriageSelectionData', this.selectionData)
      this.$router.push({ name: 'TriageRegistrations' })
    },
    // 分页组件
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    rowClassName({ row }) {
      // 有退款
      if (row.isRefund === '1') {
        return 'isRefund-row'
      }
      if (row.inpatientStatus == '1') {
        if (row.state == '0' || row.state == '1') {
          return 'success_red'
        } else {
          return 'success-row'
        }
      } else if (row.inpatientStatus == null) {
        if (row.state === '0'||row.state=='1') {
          return 'success_wap'
        }
        if (row.state === '2'||row.state === '3') {
          return 'success-row'
        }
      }
      else if(row.inpatientStatus =='2'){
        if (row.state === '0') {
          return 'success_red'

        }
        if (row.state === '1' || row.state === '2') {
          return 'success-row'
        }
        if (row.state == null) {
          return 'success_wap'
        }
      }
      else {
        if (row.state === '0') {
          return 'success_wap'

        }
        if (row.state === '1' || row.state === '2') {
          return 'success-row'
        }
        if (row.state == null) {
          return 'success_wap'
        }
      }
    },
    // 获取用户列表
    async getUserList() {
      // 人员添加公司Id 添加状态
      await this.$api.user.getUserList({
        deptId: this.deptId,
        status: '0'
      }).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
              this.estheticsList = this.esthetics
            }
          })
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
              this.doctorList = this.doctor
            }
          })
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
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
    // 打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    // 关闭
    closeInnerDialog() {
      this.innerDialog = false
    },
    // 关闭手工上报
    closeShowManualDialog() {
      this.showManualDialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

::v-deep .el-table .success_red {
  background-color: rgb(252, 157, 154);
}

::v-deep .el-table .success_wap {
  background-color: #fde5d4
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & span {
    font-size: 14px;
    margin-right: 15px;

    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}

::v-deep .el-table .warning-row {
  background: #ffff00;
}

::v-deep .el-table .success-row {
  background: #c6f9c3;
}

::v-deep .el-table .isRefund-row {
  background: #587fa1;
  //color: #fff;
}
</style>
