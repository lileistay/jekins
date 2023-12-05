<template>
  <!-- 临客电话修改记录 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData"
          @keyup.enter.native="getData"
        >查询
        </el-button>
        <el-button
          v-has-permi="['system:systemManagement:phoneexport']"
          size="mini"
          icon="el-icon-document"
          type="success"
          plain

          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          id="out-table"
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
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="searchBar">
            <div class="title">临客电话修改记录</div>
          </div>
        </sg-table>
      </slot>
    </slideSearch>
  </div>
</template>

<script>
import { beforeDayTime, todayTime } from '@/utils/time'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import moment from 'moment/moment'

export default {
  name: 'GuestPhoneChangeRecord',
  dicts: ['marital_status', 'sys_user_sex', 'hospat_yn', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether', 'sys_is_blacklist', 'occupation'],
  components: {
    SgTable, slideSearch
  },
  data() {
    return {
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
          val: 'name',
          width: 120
        },
        {
          lab: '电话',
          val: 'phone',
          width: 140
        },
        {
          lab: '归属线上客服',
          val: 'onlineUserName',
          width: 140
        },
        {
          lab: '变更前号码',
          val: 'beforePhone',
          width: 140
        },
        {
          lab: '变更后号码',
          val: 'afterPhone',
          width: 140
        },
        {
          lab: '变更人',
          val: 'changerOperator',
          width: 140
        },
        {
          lab: '变更时间',
          val: 'createTime',
          width: 160
        },
        {
          lab: '变更备注',
          val: 'changerRemark'
          // width: 300
        }
      ],
      // 查询列表
      options: {
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '电话'
        },
        changerOperator: {
          type: 'input',
          label: '变更人'
        },
        createTime: {
          type: 'Tdatetime',
          label: '变更时间',
          clearable: true,
          // beforeDayTime 传递天数可以获取几天前的时间，方便查询
          values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
        }
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
    }
  },
  created() {
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
    Export() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
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
      data = Object.assign(data)
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'formalCustomer', '0')
      this.showDataDialog = true
      this.$api.changePhoneRecord.getChangePhoneRecordList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.statisticsData = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '临客电话修改记录')

        this.showDataDialog = false
      })
    },
    // 获取数据
    getData: debounce(function() {
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
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
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'formalCustomer', '0')
      this.showDataDialog = true
      this.$api.changePhoneRecord.getChangePhoneRecordList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.statisticsData = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData()
        }
      }
    },
    // 点击跳转客户详情路由
    // customerclick(id, val) {
    //   if (val.isReachCourtyard === '1') {
    //     this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    //   } else {
    //     this.$router.push({ path: '/notInHospital', query: { id }})
    //   }
    // },
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    // 表格单选
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    // 行内选中
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
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
