<template>
  <!-- 临客合并记录 -->
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
          size="mini"
          icon="el-icon-document"
          type="success"
          plain
          v-has-permi="['system:systemManagement:mergeexport']"

          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"
            id="out-table"
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          border
          stripe
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
            <div class="title">临客归属修改记录</div>
          </div>

          <!--          <template #custom="data">-->
          <!--            <div v-if="data.props === 'customSex'">-->
          <!--              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex"/>-->
          <!--            </div>-->
          <!--            &lt;!&ndash; 点击姓名跳转路由 &ndash;&gt;-->
          <!--            <div v-else-if="data.props === 'name'">-->
          <!--              <a @click="customerclick(data.custom.id,data.custom)">{{ data.custom.name }}</a>-->
          <!--            </div>-->

          <!--          </template>-->
        </sg-table>
      </slot>
    </slideSearch>
  </div>
</template>

<script>
import { beforeDayTime, todayTime } from '@/utils/time'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog'
import { debounce } from '@/utils/throttleAndDebounce'
import moment from 'moment/moment'

export default {
  name: 'GuestPhoneChangeRecord',
  dicts: ['marital_status', 'sys_user_sex', 'hospat_yn', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether', 'sys_is_blacklist', 'occupation'],
  components: {
    SgDialog,
    SgTable,
    slideSearch
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
          lab: '操作人姓名',
          val: 'mergeOperatorName',
          width: 160
          // custom: 'changeList'
        },
        {
          lab: '合并时间',
          val: 'createTime',
          width: 160
          // custom: 'changeList'
        },
        {
          lab: '客户姓名',
          val: 'mainName',
          width: 160
          // custom: 'changeList'
        },
        {
          lab: '客户电话',
          val: 'mainPhone',
          width: 160
          // custom: 'changeList'
        },
        {
          lab: '回访人',
          val: 'mainVisitorName',
          width: 160
          // custom: 'changeList'
        },
        {
          lab: '线上客服',
          val: 'mainOnlineUserName',
          width: 160
        },
        {
          lab: '建档人',
          val: 'mainCreateUserName',
          width: 160
        },
        {
          lab: '建档类型',
          val: 'mainFilling',
          width: 260
        },
        {
          lab: '媒介来源',
          val: 'mainChannel',
          width: 260
        },
        {
          lab: '被合并客户姓名',
          val: 'slaveName',
          width: 160
          // custom: 'changeList'
        },
        {
          lab: '被合并客户电话',
          val: 'slavePhone',
          width: 160
          // custom: 'changeList'
        },
        {
          lab: '被合并客户回访人',
          val: 'slaveVisitorName',
          width: 160
          // custom: 'changeList'
        },
        {
          lab: '被合并客户线上客服',
          val: 'slaveOnlineUserName',
          width: 160
        },
        {
          lab: '被合并客户建档人',
          val: 'slaveCreateUserName',
          width: 160
        },
        {
          lab: '被合并客户建档类型',
          val: 'slaveFilling',
          width: 260
        },
        {
          lab: '被合并客户媒介来源',
          val: 'slaveChannel',
          width: 260
        }
      ],
      // 查询列表
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '变更时间',
          clearable: true,
          // beforeDayTime 传递天数可以获取几天前的时间，方便查询
          values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
        },
        name: {
          type: 'input',
          label: '客户姓名'
        },
        phone: {
          type: 'input',
          label: '电话'
        },
        createBy: {
          type: 'input',
          label: '操作人'
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
      console.log('发送请求')
      this.$api.customerCmt.customerMergeRecord(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '临客合并记录')
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
      this.$api.customerCmt.customerMergeRecord(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 搜索栏表格多选
    // getUserList() {
    //   const data = {
    //     deptId: this.deptId,
    //     status: '0'
    //   }
    //   this.$api.user.getUserList(data).then(res => {
    //     if (res) {
    //       res.data.forEach(item => {
    //         item.label = item.nickName
    //         item.value = item.userId
    //         // 判断岗位
    //         // if (item.postCode === 'doctor') {
    //         //   this.doctor.push(item)
    //         // }
    //       })
    //       const userList = this.unique(res.data)
    //       this.options.changerOperator.options = userList
    //       this.options.beforCreateUser.options = userList
    //       this.options.afterCreateUser.options = userList
    //       this.options.beforOnlineUserId.options = userList
    //       this.options.afterOnlineUserId.options = userList
    //       this.options.beforVisituserId.options = userList
    //       this.options.afterVisituserId.options = userList
    //     }
    //   })
    // },
    // 去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 获取三级建档类型
    // getFilingThree() {
    //   const data = {
    //     // 后台是分页，前端请求单页写大一点
    //     pageSize: 1000,
    //     pageNum: 1
    //   }
    //   this.$api.filing.FilingThreeList(data).then(res => {
    //     if (res) {
    //       res.rows.forEach(item => {
    //         item.label = item.typeThreeName
    //         item.value = item.typeThreeId
    //       })
    //       this.options.afterTypeThreeId.options = res.rows
    //       this.options.beforTypeThreeId.options = res.rows
    //     }
    //   })
    // },
    // // 获取媒介类型
    // getChannelType() {
    //   const data = {
    //     // 后台是分页，前端请求单页写大一点
    //     pageSize: 1000,
    //     pageNum: 1
    //   }
    //   this.$api.channel.typeList(data).then(res => {
    //     if (res) {
    //       console.log(res)
    //       res.rows.forEach(item => {
    //         item.label = item.typeName
    //         item.value = item.typeId
    //       })
    //       this.options.afterChannelTypeId.options = res.rows
    //       this.options.beforChannelTypeId.options = res.rows
    //     }
    //   })
    // },
    // // 获取媒介来源
    // getChannel() {
    //   const data = {
    //     // 后台是分页，前端请求单页写大一点
    //     pageSize: 1000,
    //     pageNum: 1
    //   }
    //   this.$api.channel.list(data).then(res => {
    //     if (res) {
    //       console.log(res)
    //       res.rows.forEach(item => {
    //         item.label = item.channelName
    //         item.value = item.channelId
    //       })
    //       this.options.afterChannelId.options = res.rows
    //       this.options.beforChannelId.options = res.rows
    //     }
    //   })
    // },
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
