<template>
  <!-- 无创排期分诊 -->
  <div class="container">
    <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      size="mini"
      selection
      border
      :pagination="pagination"
      :table-data="tableData"
      :columns="columns"
      :row-class-name="rowClassName"
      @selection-change="handleSelectionChange"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
    >
      <div slot="searchBar">
        <el-form :model="form" size="mini" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="结账时间：" label-width="140px">
                <el-date-picker
                  v-model="form.checkoutTime"
                  style="width: 100%"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00','23:59:59']"
                />
              </el-form-item>
              <el-form-item label="电话：">
                <el-input v-model="form.customPhone" clearable />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-form-item label="客户姓名：">
                <el-input v-model="form.customerName" clearable />
              </el-form-item>
              <el-form-item label="项目名称：">
                <el-input v-model="form.projectName" clearable />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-form-item label="客户卡号：">
                <el-input v-model="form.customCardNumber" clearable />
              </el-form-item>
              <el-form-item label="是否安排：">
                <el-select v-model="form.isArrange" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="dict in dict.type.whether"
                    :key="dict.value"
                    :value="dict.value"
                    :label="dict.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="一级项目：">
                <el-select v-model="form.departmentId" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="dict in departmentList"
                    :key="dict.value"
                    :value="dict.value"
                    :label="dict.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="医生：">
                <el-select v-model="form.doctorId" filterable clearable placeholder="请选择" :filter-method="may" @clear="cleardoctor">
                  <el-option
                    v-for="dict in doctorIdLists"
                    :key="dict.value"
                    :value="dict.value"
                    :label="dict.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="二级项目：">
                <el-select v-model="form.projectTypeId" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="dict in projectList"
                    :key="dict.value"
                    :value="dict.value"
                    :label="dict.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="是否退款项目：">
                <el-select v-model="form.isRetreat" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="dict in dict.type.whether"
                    :key="dict.value"
                    :value="dict.value"
                    :label="dict.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="三级项目：">
                <el-select v-model="form.categoryId" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="dict in categoryList"
                    :key="dict.value"
                    :value="dict.value"
                    :label="dict.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="剩余次数：">
                <el-input v-model="form.surplusQuantity" clearable style="width: 45%" />
                -
                <el-input v-model="form.endsurplusQuantity" clearable style="width: 45%" />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-button size="mini" icon="el-icon-search" type="primary" @click="getData(true)">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span>分诊等级</span>
          <span><i style="background-color:#ffffff " />未安排</span>
          <span><i style="background-color: #c6f9c3" />已安排</span>
          <span><i style="background-color: #ffff00" />有退款</span>
          <span><i />总金额</span>
        </div>
        <div>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="openManualDialog">手工上报</el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus">手工录入</el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="triage" >分诊登记</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'state'">
          <span v-if="data.custom.state==null || data.custom.state==0">否</span>
          <span v-else>是</span>
        </div>
        <div v-if="data.props === 'project'">
          {{ data.custom.departmentName }}/{{ data.custom.projectName }}/{{ data.custom.categoryName }}
        </div>
        <div v-if="data.props === 'iscomplete'">
          <span v-if="data.custom.iscomplete==0">否</span>
          <span v-else>是</span>
        </div>
        <div v-if="data.props === 'customerStatus'">
          <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
        </div>
      </template>
    </sg-table>
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { todayTime, timeFmt } from '@/utils/time'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import {} from '../../../utils/time'
import PinyinMatch from "pinyin-match";
export default {
  dicts: ['whether', 'whether_Newguest'],
  components: {
    SgTable,
    ManualSubmission
  },
  data() {
    return {
      showManualDialog: false,
      innerDialog: false,
      loadingData: false,

      selectionData: [],
      tableData: [],
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 110
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '项目名称',
          val: 'projectName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '购买数量',
          val: 'quantity'
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
          val: 'treatmentNum',
          width: 135,
          showOverflowTooltip: true
        },
        {
          lab: '剩余次数',
          val: 'surplusQuantity'
        },

        {
          lab: '医生',
          val: 'doctorName',
          width: 110,
          showOverflowTooltip: true
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 130
        },

        {
          lab: '产品类型',
          val: 'project',
          custom: 'project',
          width: 230
        },
        {
          lab: '订单编号',
          val: 'orderNumber',
          width: 160
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140
        },

        {
          lab: '金额',
          val: 'discountAmount'
        },
        {
          lab: '退款金额',
          val: 'refundAmount'
        },
        {
          lab: '退款次数',
          val: 'refundNum'
        },
        {
          lab: '客户类型',
          val: 'customerStatus',
          custom: 'customerStatus'
        },
        {
          lab: '是否安排',
          val: 'state',
          custom: 'state'

        },
        {
          lab: '是否完成',
          val: 'iscomplete ',
          custom: 'iscomplete '
        },
        {
          lab: '单据明细备注',
          val: 'billingRemarks',
          width: 135,
          showOverflowTooltip: true
        }
      ],
      form: {
        customerName: '', // 姓名
        customPhone: '', // 电话
        customCardNumber: '', // 卡号
        card: '', // 身份证
        surplusQuantity: '', // 剩余数量
        endsurplusQuantity: '',
        aestheticConsultant: '', // 美学顾问
        doctorId: '', // 医生
        customerRepresentative: '', // 客户代表
        projectName: '', // 项目名称
        isRefund: '', // 是否退款
        isArrange: '1', // 是否安排
        isComplete: '', // 是否完成
        checkoutTime: todayTime(),
        isRetreat:'1'
      },
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      departmentList: [],
      projectList: [],
      categoryList: [],
      doctorIdLists: [],// 医生
      newdoctorIdLists:[],
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
      this.getUserList(val)
    },
    // 监听一级项目
    'form.departmentId'() {
      // this.form.projectTypeId = '' // 二级项目
      // this.projectList = [] // 二级项目
      // this.form.categoryId = '' // 三级项目
      // this.categoryList = [] // 三级项目
      if (this.form.departmentId) {
        const departmentId = this.form.departmentId
        this.getProjectType(departmentId)
      }
    },
    // 监听二级项目
    'form.projectTypeId'() {
      // this.form.categoryId = '' // 三级项目
      // this.categoryList = [] // 三级项目
      if (this.form.projectTypeId) {
        const projectTypeId = this.form.projectTypeId
        this.categoryType(projectTypeId)
      }
    }
  },
  created(fmt, time) {
    this.getData()
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getAllDepartment(this.deptId) // 一级项目
  },
  methods: {
    cleardoctor(){
      this.doctorIdLists = this.newdoctorIdLists
    },
    may(val){
      if (val) {
        this.doctorIdLists = this.newdoctorIdLists.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.doctorIdLists = this.newdoctorIdLists
      }

  },
    // 请求一级项目

    getAllDepartment(deptId) {
      // this.form.departmentId = '' // 一级项目
      // this.form.projectTypeId = '' // 二级项目
      // this.form.categoryId = '' // 三级项目
      // this.departmentList = [] // 一级项目
      const data = {
        deptId,
        status: '0'
      }
      this.$api.modules.filing.departmentInfoList(data).then((res) => {
        if (res) {
          res.rows.forEach((item) => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.departmentList = res.rows
        }
      })
    },
    // 请求二级项目
    getProjectType(departmentId) {
      this.$api.modules.filing
        .projectTypeInfoList({ departmentId })
        .then((res) => {
          if (res) {
            if (res.rows.length === 0) {
              // this.form.projectTypeId = '' // 二级项目
              return
            }
            res.rows.forEach((item) => {
              item.label = item.projectTypeName
              item.value = item.projectTypeId
            })
            this.projectList = res.rows // 二级项目
          }
        })
    },
    // 请求三级项目
    categoryType(projectTypeId) {
      this.$api.dept.CategoryList({ projectTypeId }, 'get').then((res) => {
        if (res) {
          res.rows.forEach((item) => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
          this.categoryList = res.rows // 三级项目
        }
      })
    },
    rowClassName({ row }) {
      if (row.state === '1' || row.state === '2') {
        return 'success-row'
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 获取数据
     */
    getData(isSearch) {
      if (isSearch) {
        this.pagination.pageSize = 10
        this.pagination.pageNum = 1
      }
      // let data = Object.assign(this.form, this.pagination)
      // this.$set(this.form, 'billingStatus', '3')
      this.loadingData = true
      this.$api.medical.skinTriageList({
        ...this.pagination, ...this.form,
        billingDepartment: this.$route.query.departmentId,
        checkoutTime: this.form.checkoutTime ? this.form.checkoutTime[0] : null,
        endcheckoutTime: this.form.checkoutTime ? this.form.checkoutTime[1] : null
      }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            if (item.refundNum >= 0) {
              item.isRefund = '是'
            } else {
              item.isRefund = '否'
            }
          })
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 姓名点击
     */
    customer(id, val, numberId) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 分诊登记
     */
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
      const find = this.selectionData.find(item => item.surplusQuantity === 0 || item.arrangeNumber >= item.surplusQuantity || item.surplusQuantity<=0)
      if (find) {
        this.$message.warning('部分项目剩余治疗次数不足或已登记次数大于剩余次数，无法发起登记，请重新选择或取消旧登记')
        return
      }
      // 选择的数据存储到store,防止登记页面刷新页面数据丢失
      this.$store.dispatch('setTriageSelectionData', this.selectionData)
      this.$router.push({ name: 'TriageRegistration' })
      // this.$router.push({ path: 'triageRegistration', query: { data: JSON.stringify(this.selectionData) }})
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 手工上报弹层
     */
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.showManualDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 手工上报高级选项
     */
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 关闭高级选项弹层
     */
    closeInnerDialog() {
      this.innerDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 关闭手工上报弹层
     */
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 分页组件
     */
    change(e) {
      this.pagination.pageNum = e[1]
      this.getData()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 获取用户列表
     */
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          this.sysUserList = res.data
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctorIdLists.push(item) // 医生
            }
          })
          this.doctorIdLists = this.handleArrRepeat(this.doctorIdLists) //
          this.newdoctorIdLists=this.handleArrRepeat(this.doctorIdLists)// 医生
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
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.container {
  width: 100%;
  height: 100%;
}

span {
  font-size: 14px;
  margin-right: 20px;

  i {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
  }
}

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 105px !important;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

::v-deep .color-block-white {
  background: white !important;
}

::v-deep .color-block-green {
  background-color: #c6f9c3 !important;
}

::v-deep .el-table .success-row {
  background: #c6f9c3;
}
</style>
