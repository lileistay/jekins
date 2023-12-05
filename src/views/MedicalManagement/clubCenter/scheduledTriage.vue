<template>
  <!--会所中心排期分诊-->
  <div class="container">
    <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      :pagination="pagination"
      size="mini"
      selection
      border
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#f5eae4'}"
      @selection-change="handleSelectionChange"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
    >
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input v-model="form.customPhone" clearable />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input v-model="form.customCardNumber" clearable />
              </el-form-item>
              <el-form-item label="中医病历：">
                <el-input />
              </el-form-item>
              <el-form-item label="剩余时间：">
                <el-date-picker
                  v-model="form.checkoutTime"
                  style="width: 100%;"
                  clearable
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="客户姓名：">
                <el-input v-model="form.customerName" clearable />
              </el-form-item>
              <el-form-item label="身份证号：">
                <el-input v-model="form.card" clearable />
              </el-form-item>
              <el-form-item label="项目名称：">
                <el-input v-model="form.projectName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="科室归属服务助理：" label-width="140px">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="科室服务助理：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="结账时间：">
                <el-date-picker
                  v-model="form.checkoutTime"
                  style="width: 100%;"
                  clearable
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="一级项目：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="二级项目：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="三级项目：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="美学顾问：">
                <el-select v-model="form.aestheticConsultant" filterable clearable>
                  <el-option
                    v-for="item in sysUserList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="是否完成：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否安排：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="医生：">
                <el-select v-model="form.doctorId" filterable clearable>
                  <el-option
                    v-for="item in esthetics"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="科室归属医生：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="主服务助理：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">

              <el-form-item label="是否退款项目：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
          <span><i style="background-color:#ffffff" />未预约</span>
          <span><i style="background-color:#c6f9c3" />有预约</span>
        </div>
        <div>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="openManualDialog">手工上报</el-button>
          <el-button size="mini" type="primary" icon="el-icon-position">手工录入 - 无</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close">手工录入删除 - 无</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">年卡 - 无</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">套餐 - 无</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform" @click="triage">分诊登记</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props==='customerName'">
          <a style="color: #5f94de;cursor: pointer;" @click="customer(data.custom.id, data.custom,data.custom.numberId,data.custom.id)">
            {{ data.custom.customerName }}
          </a>
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
import ManualSubmission from '@/components/ManualSubmission/indexTwo'

export default {
  name: 'ScheduledTriage',
  components: {
    SgTable,
    ManualSubmission
  },
  data() {
    return {
      showManualDialog: false,
      loadingData: false,
      innerDialog: false,
      selectionData: [],
      tableData: [],
      sysUserList: [], // 美学顾问
      pagination: {
        show: true
      },
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName'
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
          val: 'treatmentNum,',
          width: 100
        },
        {
          lab: '剩余次数',
          val: 'surplusQuantity'
        },
        {
          lab: '门诊病历',
          val: '',
          width: 150
        },
        {
          lab: '中医病历',
          val: '',
          width: 120
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 130
        },
        {
          lab: '科室服务助理',
          val: '',
          width: 150
        },
        {
          lab: '主服务助理',
          val: '',
          width: 150
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 130
        },
        {
          lab: '科室归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '产品类型',
          val: '',
          width: 150
        },
        {
          lab: '年卡/套餐',
          val: '',
          width: 120
        },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          width: 165
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '是否退款',
          val: 'isRefund',
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
          val: 'customerNameType'
        },
        {
          lab: '是否安排',
          val: 'isArrange'
        },
        {
          lab: '单据明细备注',
          val: 'billingRemarks',
          width: 135,
          showOverflowTooltip: true
        }
      ],
      esthetics: [],
      form: {
        customerName: '', // 姓名
        customPhone: '', // 电话
        customCardNumber: '', // 卡号
        card: '', // 身份证
        surplusQuantity: '', // 剩余数量
        endsurplusQuantity: '',
        checkoutTime: '', // 结账时间
        aestheticConsultant: '', // 美学顾问
        doctorId: '', // 医生
        customerRepresentative: '', // 客户代表
        projectName: '', // 项目名称
        isRefund: '', // 是否退款
        isArrange: '', // 是否安排
        isComplete: '' // 是否完成

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
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getData()
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 获取数据
    */
    getData() {
      // let data = Object.assign(this.form, this.pagination)
      this.$set(this.form, 'billingStatus', '3')
      this.loadingData = true
      this.$api.medical.skinTriageList({
        ...this.pagination, ...this.form,
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
          res.rows.forEach(item => {
            if (item.quantitySum == item.surplusQuantity) {
              item.isArrange = '否'
            } else {
              item.isArrange = '是'
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
     * @date 2022/6/9
     * @Description: 姓名跳转
    */
    customer(id, val, numberId) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
    },
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
      this.$router.push({ name: 'TriageRegistration' })
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 分页
    */
    change(e) {
      this.pagination.pageNum = e[1]
      this.ReceptionList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.ReceptionList()
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
     * @Description: 获取用户列表
     */
    getUserList(deptId) {
      /**
        * @author 李尚
        * @date 2022/6/17
        * @Description:  人员添加公司Id  添加状态
      */
      let data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.sysUserList.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.esthetics.push(item)
            }
          })
        }
      })
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
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 14px;
    margin-right: 15px;
  }
  & i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
::v-deep .el-range-editor.el-input__inner {
  padding: 3px 5px;
}
</style>
