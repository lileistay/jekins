<template>
  <!-- 网电治疗客户查询 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData"
          @keyup.enter.native="getDatakeyup"
        >查询
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
         
          :pagination="pagination"
          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :row-class-name="rowClassName"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="searchBar">
            <div class="title">信息统计</div>
            <div>
              <ul>
                <li>客户总数:<span>0 [ 整形：0；皮肤：0；口腔：0；无创：0；SPA会所：0；私密中心：0； ]</span></li>
              </ul>
            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px">
              <span class="color-block-default" /> 列表清单
              <span class="color-block-default" /> 已安排
              <span class="color-block-success" />手术进行中
              <span class="color-block-implement" />已执行/手术已结束
              <span class="color-block-danger" />已取消
            </span>
            <el-button
              size="mini"
              type="primary"
              plain
              icon="el-icon-plus"
              class="headerBarBtn"
              @click.stop.native="openManualDialog"
            >手工上报
            </el-button>
          </div>
          <!--  字典对应列表-->
          <!--          <template #custom="data">-->
          <!--            <div v-if="data.props === 'isTerminated'">-->
          <!--              <show-dict-data :options="dict.type.whether" :value="data.custom.isTerminated" />-->
          <!--            </div>-->
          <!--            &lt;!&ndash;  点击姓名跳转是否到院顾客个人详情&ndash;&gt;-->
          <!--            <div v-else-if="data.props==='customerName'">-->
          <!--              <a @click="customer(data.custom.id, data.custom.isReachCourtyard,data.custom.numberId)">-->
          <!--                {{ data.custom.customerName }}-->
          <!--              </a>-->
          <!--            </div>-->
          <!--            <div v-else-if="data.props === 'blacklist'">-->
          <!--              <show-dict-data :options="dict.type.whether" :value="data.custom.blacklist" />-->
          <!--            </div>-->
          <!--          </template>-->
        </sg-table>
      </slot>
    </slideSearch>
    <!-- 手工上报 -->
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
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import { todayTime } from '@/utils/time'
import ManualSubmission from '@/components/ManualSubmission/indexTwo' // 手工上报弹层 此处是单独的一个弹层接口有所变换
import moment from 'moment'

export default {
  name: 'ReturnVisitPlan',
  components: {
    SgTable,
    slideSearch,
    ManualSubmission
  },
  inject: ['reload'],
  dicts: ['degree_intention_list', 'sys_user_sex', 'economic_capacity', 'through_level', 'whether', 'is_execute_type', 'not_through_reason', 'grade', 'temin_reason', 'is_execute', 'through_result'],
  data() {
    return {
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      showManualDialog: false,
      innerDialog: false,
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 统计
      statisticsData: {},
      // 多选数据
      selectionData: [],
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      // todo 字段都没对
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone'
          // width: 110 设置列表宽度
        },
        {
          lab: '客户类型',
          val: 'customerNameType'
          // custom: 'isReachCourtyard' 字典
        },
        {
          lab: '治疗状态',
          val: 'treatmentStatus'
          // showOverflowTooltip: true 是否超出隐藏
        },
        {
          lab: '科室',
          val: 'returnVisitKeyword'
        },
        {
          lab: '项目名称',
          val: 'returnVisitFeedback'
        },
        {
          lab: '状态',
          val: 'state'
        },
        {
          lab: '线上客服',
          val: 'typeThreeName'
        },
        {
          lab: '网电回访人',
          val: 'arrivalTime'
        },
        {
          lab: '网电建档人',
          val: 'planReturnTime'
        },
        {
          lab: '建档类型',
          val: 'reportTime'
        },
        {
          lab: '媒介',
          val: 'actualReturnvisitTime'
        },
        {
          lab: '美容院',
          val: 'returnExecutorUserName'
        },
        {
          lab: '建档时间',
          val: 'lastReturnVisitTime'
        },
        {
          lab: '美学顾问',
          val: 'planReturnUserName'
        },
        {
          lab: '客户代表',
          val: 'grade'
        },
        {
          lab: '医生',
          val: 'isThrough'
        },
        {
          lab: '实际执行人',
          val: 'throughLevel'
        },
        {
          lab: '医助',
          val: 'notThroughReason'
        },
        {
          lab: '护士',
          val: 'isTerminated'
        },
        {
          lab: '麻醉师',
          val: 'blacklist'
        },
        {
          lab: '医务分诊事件',
          val: 'city'
        },
        {
          lab: '治疗登记时间',
          val: 'onlineUserIdName'
        },
        {
          lab: '治疗时间',
          val: 'serviceAssistantName'
        },
        {
          lab: '手术开始时间',
          val: 'memberCustomerServiceName'
        },
        {
          lab: '手术结束时间',
          val: 'createBy'
        },
        {
          lab: '备注',
          val: 'remarks'
        }
      ],
      // 查询列表
      options: {
        customeName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '客户电话'
        },
        Customertype: {
          type: 'select',
          label: '客户类型',
          clearable: true,
          options: []
        },
        Treatmentstatus: {
          type: 'select',
          label: '治疗状态',
          clearable: true,
          options: []
        },
        Department: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        state: {
          type: 'select',
          label: '状态',
          clearable: true,
          options: []
        },
        operationstate: {
          type: 'select',
          label: '手术状态',
          clearable: true,
          options: []
        },
        returnVisitKeyword: {
          type: 'input',
          label: '项目名称'
        },
        customerservice: {
          type: 'select',
          label: '线上客服',
          clearable: true,
          options: []
        },
        electricity: {
          type: 'select',
          label: '网电回访人',
          clearable: true,
          options: []
        },
        medium: {
          type: 'select',
          label: '媒介类型',
          clearable: true,
          options: []
        },
        mediumlei: {
          type: 'select',
          label: '媒介来源',
          clearable: true,
          options: []
        },
        returnVisitFeedback: {
          type: 'input',
          label: '建档类型'
        },
        planReturnUser: {
          type: 'select',
          label: '美容院类型',
          clearable: true,
          options: []
        },
        returnExecutorUser: {
          type: 'select',
          label: '美容院',
          clearable: true,
          options: []
        },
        returnecutorUser: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        coumentExecutorUser: {
          type: 'select',
          label: '客户代表',
          clearable: true,
          options: []
        },
        actualReturnvisitTime: {
          type: 'Tdatetime',
          clearable: true,
          label: '手术开始时间',
          values: []
        },
        reportTime: {
          type: 'Tdatetime',
          clearable: true,
          label: '手术结束时间',
          values: []
        },
        cusCreateTime: {
          type: 'Tdatetime',
          clearable: true,
          label: '建档时间',
          values: []
        },
        doctiont: {
          type: 'Tdatetime',
          clearable: true,
          label: '医务分诊时间',
          values: []
        },
        doctionttime: {
          type: 'Tdatetime',
          clearable: true,
          label: '治疗登记时间',
          values: []
        },
        doctionttimes: {
          type: 'Tdatetime',
          clearable: true,
          label: '治疗时间',
          values: []
        },
        isExecute: {
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        grade: {
          type: 'select',
          label: '实际执行人',
          clearable: true,
          options: []
        },
        isOneReturnVisit: {
          type: 'select',
          label: '护士',
          clearable: true,
          options: []
        },
        isTerminated: {
          type: 'select',
          label: '医助',
          clearable: true,
          options: []
        },
        teminReason: {
          type: 'select',
          label: '麻醉师',
          clearable: true,
          options: []
        }
      },
      customLabelDialog: true,
      noHospital: '0'
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
    this.getDatakeyup()
    this.getData()
  },
  methods: {
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData()
        }
      }
    },
    // 点击姓名是否到院
    customer(id, tyard) {
      if (tyard === 1) {
        this.$router.push({ name: 'customer-info', query: { id }})
      } else {
        this.$router.push({ path: 'NotInHospital', query: { id }})
      }
    },
    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.showManualDialog = true
    },
    // 打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    // 关闭高级选项弹层
    closeInnerDialog() {
      this.innerDialog = false
      this.reload()
    },
    // 获取城市列表
    customerCityList() {
      this.$api.modules.netPower.customerCityList().then(res => {
        var arr = []
        if (res) {
          if (res.data) {
            res.data.forEach(item => {
              arr.push({
                value: item,
                label: item
              })
            })
          }
          this.options.city.options = arr
        }
      })
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.getData()
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    // 数组去重
    ArrayDuplication(data) {
      const arr = []
      data.forEach(item => {
        if (item !== undefined && !arr.includes(item)) {
          arr.push(item)
        }
      })
      return arr
    },
    // 获取数据
    getData() {
      let data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'daterange' || this.options[k].type === 'datetimerange' || this.options[k].type === 'Tselect' || this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = undefined
            data['end' + k] = undefined
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = undefined
            data['end' + k] = undefined
          }
        } else if (this.options[k].type === 'cascader') {
          let filingIds = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingIds.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingIds', filingIds.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingIds = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data.filingId = undefined
      data = Object.assign(data, this.pagination)
      // this.showDataDialog = true
      // todo 列表接口位置
    },
     // 获取用户列表
    getUserList(deptId) {
      // 人员添加公司Id  添加状态  添加岗位
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
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.returnecutorUser.options.values.push(item)
            }
          })
        }
      })
    },
    rowClassName({ row }) {
      if (row.isExecute === '1') {
        return 'success-row'
      }
      if (row.isTerminated === '1') {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>

<style scoped lang="scss">

.container {
  width: 100%;
  height: 100%;
}

.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 100%;
  line-height: 30px;
  color: #999;

  .title {
    font-weight: bold;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;

    &:before {
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 15px;
      background-color: #1abc9c;
      left: 0px;
      border-radius: 10px;
      content: "";
    }
  }

  ul {
    list-style: none;

    li {
      display: inline-block;
      margin: 0 10px;

      span {
        color: #666666;
        font-weight: bold;
      }
    }
  }
}

.headerTopPadding {
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}

.dialogTop {
  width: 100%;
  height: 20px;
  padding-left: 10px;
  box-sizing: border-box;
  position: relative;
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
  white-space: break-spaces;
  margin-bottom: 10px;

  &:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background-color: #1abc9c;
    content: "";
  }
}

.dialog-box {
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  font-size: 14px;

  .title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    background-color: #eeeeee;
    padding: 0 10px;
    line-height: 30px;
    box-sizing: border-box;

    span {
      color: #7ec5b7;
    }
  }

  .content {
    padding: 10px;
    box-sizing: border-box;
  }
}

.color-block-success {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #ffff00;
  border-radius: 2px;
  border: 1px solid #ffff00;
}

.color-block-implement {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #008000ff;
  border-radius: 2px;
  border: 1px solid #008000;
}

.color-block-danger {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 2px;
  border: 1px solid red;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}

::v-deep .el-table .warning-row {
  background: red;
}

::v-deep .el-table .success-row {
  background: #7ec5b7;
}
</style>
<style>

.el-input__prefix {
  display: none;
}
</style>
