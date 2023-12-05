<template>
  <!-- 物资移库 -->
  <div>
    <slideSearch :options="options">
      <div slot="btnBar">
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
          size="mini"
          icon="el-icon-document"
          type="success"
          plain
          v-has-permi="['sorage:removeInfo:export']"

          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          :table-data="tableData"
          id="out-table"
          index="序号"
          size="mini"
          border
          selection
          :columns="columns"
          :pagination="pagination"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />库房列表</div>
            <div>
              <el-button v-hasPermi="['sorage:removeInfo:add']" size="mini" icon="el-icon-sort" type="primary" @click="getShift">移库</el-button>
            </div>
          </div>
          <!--字典-->
          <template #custom="data">
            <div v-if="data.props === 'removeType'">
              <p>物资转移</p>
            </div>
            <div v-else-if="data.props === 'operation'">
              <span v-if="data.custom.status == 1" v-hasPermi="['sorage:removeList:list']" style="color: #53ad14;cursor:pointer" @click="handledcopy(data.custom)">详情<span>&nbsp;</span></span>
              <span v-if="data.custom.status == 1" v-hasPermi="['sorage:removeList:list']" style="color: #2996e8;cursor:pointer" @click="handlePrint(data.custom)">打印</span>&nbsp;
              <span v-if="data.custom.status == 0" v-hasPermi="['sorage:removeList:list']" style="color: #919291">详情 <span>&nbsp;</span></span>
              <span v-if="data.custom.status == 0" v-hasPermi="['sorage:removeList:list']" style="color: #919291">打印</span>
              <span v-if="data.custom.status == 1" v-hasPermi="['sorage:removeInfo:edit']" style="color: #b6b6b1;cursor:pointer">编辑</span>
              <span v-if="data.custom.status == 0" v-hasPermi="['sorage:removeInfo:edit']" style="color: #d2d24f;cursor:pointer" @click="handlecompile(data.custom)">&nbsp;编辑</span>
            </div>
          </template>
        </SgTable>
      </slot>
      <!--打印-->
      <vue-easy-print ref="transfer">
        <transfer
          :print="print"
          :message="newmessage"
          :template-list="printList"
        />
      </vue-easy-print>
    </slideSearch>
    <!--点击单号-->
    <sgDialog :title="title" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <div class="formBody">
          <div class="itemment">移库单
          </div>
          <el-form ref="form" class="mentform" :inline="true" :model="form" size="mini" label-width="100px">
            <el-form-item label="移库单号:">
              <el-input v-model="form.removeNo" disabled />
            </el-form-item>
            <el-form-item label="执行人:">
              <el-input v-model="form.executeUserName" disabled />
            </el-form-item>
            <el-form-item label="执行日期:">
              <el-input v-model="form.executeDate" disabled />
            </el-form-item>
            <el-form-item label="源库房:">
              <el-select v-model="form.oldwhouseName" filterable disabled>
                <el-option
                  v-for="(item, index) in supplier"
                  :key="index"
                  :label="item.companyName"
                  :value="item.supplierNo"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="目标库房:">
              <el-select v-model="form.newwhouseName" filterable disabled>
                <el-option
                  v-for="(item, index) in supplier"
                  :key="index"
                  :label="item.companyName"
                  :value="item.supplierNo"
                />
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注:">
                  <el-input v-model="form.remark" disabled type="textarea" style="width: 500px;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="formBody">
          <div class="itemment" />
          <div style="margin-top: 10px">
            <el-table
              :data="templateData"
              size="mini"
              height="200"
              border
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="oldInBatchNumber" label="源批次号" width="140" />
              <el-table-column prop="newInBatchNumber" label="新批次号" width="140" />
              <el-table-column prop="oldProductionBatch" label="源生产批次" :show-overflow-tooltip="true" width="140" />
              <el-table-column prop="oldwhouseName" width="140" label="源库房" />
              <el-table-column prop="newwhouseName" width="140" label="目的库房" :show-overflow-tooltip="true" />
              <el-table-column prop="materialName" width="140" label="物资名称" />
              <el-table-column prop="price" label="价格" width="70" />
              <el-table-column prop="removeNumber" show-overflow-tooltip label="移库数量" width="80" />
            </el-table>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 10px">
          <el-button size="mini" type="danger" @click="close">关闭</el-button>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import { todayTime } from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
// 打印
import vueEasyPrint from 'vue-easy-print'
import setMealPrint from '@/components/Print/setMealPrint'
import transfer from '@/components/Print/transfer'
import moment from 'moment'
export default {
  name: 'ChargeType',
  dicts: ['document_type'],
  components: {
    slideSearch,
    SgTable,
    sgDialog,
    vueEasyPrint,
    setMealPrint,
    transfer
  },
  data() {
    return {
      // 打印
      print: {},
      newmessage:"",
      printList: [],
      // 弹框
      showDialog: false,
      title: '详情',
      form: {},
      supplier: [],
      templateData: [],
      // 列表
      tableData: [],
      columns: [
        {
          lab: '操作',
          val: 'operation',
          custom: 'operation'
        },
        {
          lab: '单据号',
          val: 'removeNo',
          width: 160
        },
        {
          lab: '单据类型',
          val: 'removeType',
          custom: 'removeType'
          // width: 110
        },
        {
          lab: '执行人',
          val: 'executeUserName'
        },
        {
          lab: '执行日期',
          val: 'executeDate'
        },
        {
          lab: '源库房',
          val: 'oldwhouseName'
        },
        {
          lab: '目的库房',
          val: 'newwhouseName'
        },
        {
          lab: '备注',
          val: 'remark'
        }
      ],
      selectionData: [],
      options: {
        removeNo: {
          type: 'input',
          label: '单据号：'
        },
        executeUserName: {
          type: 'input',
          label: '操作人：'
        },
        receptionTime: {
          type: 'Tdatetime',
          label: '入库日期：',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        miaoshi: {
          type: 'input',
          label: '单据号:'
        }
      }, // 查询参数
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
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
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getUserList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
    // this.options.status.options = this.dict.type.sys_normal_disable
  },
  methods: {
    Export(){
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
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
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = {
        deptId: this.deptId,
        removeNo: this.options.removeNo.values,
        executePerson: this.options.executePerson.values,
        params: {
          receptionTime: data.receptionTime,
          endreceptionTime: data.endreceptionTime
        }
      }
      this.$api.modules.storageRoom.removeInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '物资移库')
        // setInterval(() => {
        //   this.submitLoadings = false
        // }, 5000)
      })
    },
    // 修改
    handlecompile(val) {
      this.$router.push({ path: 'stockTransfer', query: { item: val }})
    },
    // 详情
    handledcopy(val) {
      this.form = val
      this.showDialog = true
      const removeNo = val.removeNo
      this.$api.storageRoom.removeList({ removeNo: removeNo }).then(res => {
        if (res) {
          this.templateData = res.rows
        }
      })
    },
    async handlePrint(val) {
      this.printList = []
      this.print = {}
      await this.$api.storageRoom.removeList({ removeNo: val.removeNo }).then(res => {
        if (res) {
          this.printList = res.rows
        }
      })
      this.print = val
      let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      let newstr=str.split('<')[0]
      this.newmessage=newstr
      this.$nextTick(() => {
        this.$refs.transfer.print()
      })
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      var data = {}
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
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = {
        deptId: this.deptId,
        removeNo: this.options.removeNo.values,
        executePerson: this.options.executeUserName.values,
        params: {
          receptionTime: data.receptionTime,
          endreceptionTime: data.endreceptionTime
        }
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.removeInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    // 移库
    getShift() {
      this.$router.push({ path: 'stockTransfer' })
    },
    // 关闭弹框
    handleClose() {
      this.showDialog = false
    },
    close() {
      this.showDialog = false
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
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    getUserList() {
      this.$api.storageRoom.supplierList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.supplier = res.rows
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

.formBody {
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 5px 10px 10px 10px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 10px 0 10px;
  //margin-right: 40px;
  //margin-top: 20px;
  .itemment {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #75deca;
  }
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
</style>
