<template>
  <!-- 正客修改记录 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          :plain="true"
          @click.stop="getData"
          @keydown.enter.native="getData"
        >查询
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-download"
          type="success"
          :plain="true"
          @click.stop="exportData"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          :border="true"
          :stripe="true"
          index="序号"
          :highlight-current-row="true"
          :table-data="tableData"
          :columns="columns"
          :selection="true"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="searchBar">
            <div class="title">正客归属修改记录</div>
            <div>
              <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click.stop.native="openManualDialog">手工上报</el-button>
              <!--<el-button size="mini" :plain="true" type="primary" icon="el-icon-plus">批量发送短信</el-button>-->
            </div>
          </div>
          <template #custom="data">
            <!-- 点击姓名跳转路由 -->
            <div v-if="data.props === 'customerName'">
              <a @click="customerClick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <!-- 手工上报弹窗 -->
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
import { todayTime } from '@/utils/time'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import moment from 'moment/moment'
import ManualSubmission from '@/components/ManualSubmission/indexTwo.vue'

export default {
  name: 'CustomChangeRecord',
  dicts: ['whether'],
  components: {
    ManualSubmission,
    SgTable,
    slideSearch
  },
  data() {
    return {
      Action: {},
      selectionData: [], // 选择的数据
      // 手工上报
      showManualDialog: false,
      innerDialog: false,
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName',
          width: 160,
          custom: 'customerName'
        },
        {
          lab: '客户电话',
          val: 'customPhone',
          width: 160
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 160
        },
        {
          lab: '变更时间',
          val: 'createTime',
          width: 160
        },
        {
          lab: '修改人',
          val: 'operatorName',
          width: 160
        },
        {
          lab: '变更字段',
          val: 'changeField',
          width: 160
        },
        {
          lab: '变更前',
          val: 'changerBefore',
          width: 160
        },
        {
          lab: '变更后',
          val: 'changerAfter',
          width: 160
        },
        {
          lab: '变更备注',
          val: 'changerRemark'
        }
      ],
      // 查询列表
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '变更时间',
          clearable: true,
          values: todayTime()
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customerPhone: {
          type: 'input',
          label: '客户电话'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号'
        },
        operatorName: {
          type: 'input',
          label: '修改人'
        },
        changeField: {
          type: 'select',
          label: '变更字段',
          clearable: true,
          options: []
        },
        changerBefore: {
          type: 'input',
          label: '变更前'
        },
        changerAfter: {
          type: 'input',
          label: '变更后'
        }
      }
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getData()
    }
  },
  created() {
    this.getChangeField()
    this.getData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    // 获取可选的修改字段
    getChangeField() {
      this.$api.changeAscriptionRecord.getChangeField().then(res => {
        this.options.changeField.options = res.data
      })
    },
    // 获取数据
    getData: debounce(function() {
      let data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      this.$set(data, 'deptId', this.deptId)
      data = Object.assign(data, this.pagination)
      this.showDataDialog = true
      this.$api.changeAscriptionRecord.getChangeCustomerRecordList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 导出数据
    async exportData() {
      let data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = Object.assign(data, this.pagination)
      await this.$api.changeAscriptionRecord.exportChangeCustomerRecordList(data)
    },
    // 点击跳转客户详情路由
    customerClick(id, val) {
      if (val.isReachCourtyard === '1') {
        this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
      } else {
        this.$router.push({ path: '/notInHospital', query: { id }})
      }
    },
    // handleCurrentChange(val) {
    //   this.rowTable = val[1]
    // },
    // 表格单选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    // 行内选中
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(this.selectionData)
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
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
.buildRecordBox {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .buildRecordOne {
    width: 32%;
    height: 260px;
    border: 1px solid #cccccc;

    ul {
      width: 100%;
      height: 220px;
      list-style: none;
      overflow-x: hidden;
      overflow-y: scroll;

      li {
        padding: 0 10px;
        box-sizing: border-box;
        font-size: 12px;
        cursor: pointer;
      }

      .active {
        background-color: #7ec5b7;
      }
    }

    .buildTitle {
      width: 100%;
      height: 40px;
      background-color: #f0f0f0;
      color: #666;
      text-align: center;
      line-height: 40px;
      padding: 0 10px;
      box-sizing: border-box;
    }
  }
}

.container {
  width: 100%;
  height: 100%;
}

.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 99%;
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
      left: 0;
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

.color-block-success {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #7ec5b7;
  border-radius: 2px;
  border: 1px solid #7ec5b7;
}

.color-block-default {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border-radius: 2px;
  border: 1px solid #7ec5b7;
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

.visitBox {
  width: 100%;

  ul {
    list-style: none;

    li {
      padding: 6px 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #c3ced5;
      border-top: 1px solid #c3ced5;
      background-color: #f5f5f5;
    }

    & > li:nth-of-type(odd) {
      border-bottom: none;
    }
  }
}

.innerVisitBox {
  margin-top: 20px;

  ul {
    li {
      padding: 6px 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #c3ced5 !important;
      border-top: 1px solid #c3ced5;
      background-color: #f5f5f5;
    }

    .visitContent {
      width: 100%;
      height: 160px;
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      & > div {
        width: 50%;
        padding: 0 20px;
        box-sizing: border-box;

        & > .title {
          padding: 0 10px;
          box-sizing: border-box;
          position: relative;
          font-weight: bold;
          margin-bottom: 10px;

          &:before {
            position: absolute;
            display: inline-block;
            top: 0;
            left: 0;
            bottom: 0;
            width: 3px;
            background-color: #1abc9c;
            content: "";
          }
        }
      }
    }
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

span {
  color: #999;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}
</style>
