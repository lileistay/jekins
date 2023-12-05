<template>
  <!-- 盘点物资 -->
  <div class="container">
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
          v-has-permi="['sorage:ineysheetInfo:export']"
          
          @click="Export"
        >导出
        </el-button>
      </div>

      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          :table-data="tableData"
          index="序号"
          size="mini"
          border
          selection
          :columns="columns"
          :pagination="pagination"
          :row-class-name="rowClassName"
          @size-change="sizeChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @current-change="currentChange"
        >
          <template #custom="data">
            <div v-if="data.props === 'status'">
              <show-dict-data :options="dict.type.counting_status" :value="data.custom.status" />
            </div>
            <div v-else-if="data.props === 'caozuo'">
              <span style="color: #3aa1ff;cursor:pointer" @click="details(data.custom)">详情</span>&nbsp;
              <span :class="{redStr: data.custom.status !== '2'}" style="color: #3aa1ff;cursor:pointer" @click="modify(data.custom)">修改</span>
            </div>
          </template>
          <div slot="searchBar" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单 <span style="font-size: 12px;">点击单号查看单据详情</span></div>
            <div>
              <el-button v-hasPermi="['sorage:ineysheetInfo:print']" size="mini" icon="el-icon-printer" @click="Print">盘点单打印</el-button>
              <el-button v-hasPermi="['sorage:ineysheetInfo:add']" size="mini" icon="el-icon-plus" type="success" plain @click="establish">创建盘点单</el-button>
              <el-button v-hasPermi="['sorage:ineysheetInfo:add']" size="mini" icon="el-icon-edit" type="primary" plain @click="Entry">盘点录入</el-button>
              <el-button v-hasPermi="['sorage:ineysheetInfo:edit']" size="mini" icon="el-icon-check" type="success" plain @click="getOut">盘点调整</el-button>
              <el-button v-hasPermi="['sorage:ineysheetInfo:del']" size="mini" icon="el-icon-close" type="danger" plain @click="cancel">取消</el-button>
            </div>
          </div>
        </SgTable>
      </slot>
      <!--打印-->
      <vue-easy-print ref="Inventory">
        <Inventory
          :print="print"
          :message="newmessage"
          :template-list="printList"
        />
      </vue-easy-print>
    </slideSearch>
    <!--弹框-->
    <sgDialog :title="title" size="1000px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <div class="formBody">
          <div class="itemment"> 入库单
          </div>
          <el-form ref="form" class="mentform" :inline="true" :model="form" size="mini" label-width="100px" style="margin-top:10px ">
            <el-form-item label="盘点单号:">
              <el-input v-model="form.inventoryNo" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="创建人:">
              <el-select
                v-model="form.createPersonName"
                disabled
                filterable
                class="fullInput"
                placeholder="请选择"
                style="width: 140px;"
              >
                <el-option
                  v-for="(userItem, index) in userList"
                  :key="index"
                  :label="userItem.nickName"
                  :value="userItem.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="创建日期:">
              <el-input v-model="form.generateTime" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="盘点状态:">
              <el-select v-model="form.status" filterable disabled style="width: 140px;">
                <el-option
                  v-for="item in dict.type.counting_status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="盘点人:">
              <el-select
                v-model="form.inventoryPersonName"
                disabled
                filterable
                class="fullInput"
                placeholder="请选择"
                style="width: 140px;"
              >
                <el-option
                  v-for="(userItem, index) in userList"
                  :key="index"
                  :label="userItem.nickName"
                  :value="userItem.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="盘点日期:">
              <el-input v-model="form.inventoryDate" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="审核人:">
              <el-input v-model="form.examinePersonName" disabled style="width: 140px;" />
            </el-form-item>
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
              <el-table-column prop="materialTypeName" label="一级类型" />
              <el-table-column prop="typeName" label="二级类型" />
              <el-table-column prop="matTypeName" label="三级类型" />
              <el-table-column prop="shortCode" label="物资简码" />
              <el-table-column prop="materialCode" label="物资编码" />
              <el-table-column prop="materialName" label="物资名称" />
              <el-table-column prop="materialSpec" label="规格" width="80" />
              <el-table-column prop="unitName" label="单位" width="80" />
              <el-table-column prop="inventoryQuantity" label="账面数量" width="70" />
              <el-table-column prop="purchasePrice" show-overflow-tooltip label="物资单价" />
              <el-table-column prop="materialPrice" show-overflow-tooltip label="账面总金额" />
              <el-table-column prop="inventoryNumber" label="实盘数量" width="60" />
              <el-table-column prop="inventoryLossNumber" show-overflow-tooltip label="盈亏数量" width="60" />
<!--              <el-tab le-column prop="materialPrice" show-overflow-tooltip label="实盘总金额" />-->
              <el-table-column prop="inventoryLossPrice" show-overflow-tooltip label="盈亏总金额" />
              <el-table-column prop="remark" show-overflow-tooltip label="备注" />
            </el-table>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 10px">
          <el-button type="success" size="mini" @click="putRemark">导出</el-button>
          <el-button size="mini" type="danger" @click="handleClose">关闭</el-button>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import { GMTToStr, todayTime } from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
// 打印
import vueEasyPrint from 'vue-easy-print'
import setMealPrint from '@/components/Print/setMealPrint'
import Inventory from '@/components/Print/Inventory'
import moment from 'moment'
export default {
  name: 'ChargeType',
  dicts: ['counting_status'],
  components: {
    slideSearch,
    SgTable,
    sgDialog,
    vueEasyPrint,
    setMealPrint,
    Inventory
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
      form: {
        generateTime: '', // 盘点日期
        inventoryNo: '', // 单号
        createPersonName: '', // 执行人
        inventoryPersonName: '',
        inventoryDate: '', // 执行日期
        status: '',
        examinePersonName: ''
      },
      templateData: [],
      userList: [],
      // ----
      tableData: [],
      columns: [
        {
          lab: '操作',
          val: 'caozuo',
          custom: 'caozuo'
        },
        {
          lab: '盘点单号',
          val: 'inventoryNo'
        },
        // {
        //   lab: '状态',
        //   val: 'status',
        //   custom: 'status',
        // width: 110
        // },
        {
          lab: '生成盘点单日期',
          width: 145,
          val: 'generateTime'
        },
        {
          lab: '盘点单创建人',
          width: 130,
          val: 'createPersonName'
        },
        {
          lab: '盘点状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '盘点人',
          val: 'inventoryPersonName'
        },
        {
          lab: '盘点日期',
          val: 'inventoryDate'
        },
        {
          lab: '审批人',
          val: 'examinePersonName',
          width: 120
        },
        {
          lab: '备注',
          val: 'remark'
        }
      ],
      selectionData: [],
      options: {
        inventoryNo: {
          type: 'input',
          label: '盘点单号：'
        },
        createPerson: {
          type: 'select',
          label: '创建人',
          clearable: true,
          options: []
        },
        inventoryPerson: {
          type: 'select',
          label: '盘点人',
          clearable: true,
          options: []
        },
        examinePerson: {
          type: 'select',
          label: '审核人',
          clearable: true,
          options: []
        },
        status: {
          type: 'select',
          label: '盘点状态',
          clearable: true,
          options: []
        },
        generateTime: {
          type: 'Tdatetime',
          label: '创建日期：',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        inventoryDate: {
          type: 'Tdatetime',
          label: '盘点日期',
          clearable: true,
          values: []
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
  // 监听公司ID deptId
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
    this.options.status.options = this.dict.type.counting_status
    this.user = this.$store.getters.user
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
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
      data = {
        inventoryNo: this.options.inventoryNo.values, // 单号
        createPerson: this.options.createPerson.values, // 创建人
        inventoryPerson: this.options.inventoryPerson.values, // 盘点人
        // examinePerson: this.options.examinePerson.values, // 审核人
        status: this.options.status.values, // 盘点状态
        params: {
          begingenerateTime: data.generateTime === undefined ? null : data.generateTime, // 创建日期开始
          endgenerateTime: data.endgenerateTime === undefined ? null : data.endgenerateTime, // 创建日期结束
          begininventoryDate: data.inventoryDate === undefined ? null : data.inventoryDate, // 盘点日期开始
          endinventoryDate: data.endinventoryDate === undefined ? null : data.endinventoryDate, // 盘点日期结束
          deptId: this.deptId // 公司
        }
      }
       this.$api.modules.storageRoom.ineysheetInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '盘点外资')
        // setInterval(() => {
        //   this.submitLoadings = false
        // }, 5000)
      })
    },
    // 获取数据
    getData: debounce(async function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
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
      data = {
        inventoryNo: this.options.inventoryNo.values, // 单号
        createPerson: this.options.createPerson.values, // 创建人
        inventoryPerson: this.options.inventoryPerson.values, // 盘点人
        // examinePerson: this.options.examinePerson.values, // 审核人
        status: this.options.status.values, // 盘点状态
        deptId: this.deptId, // 公司
        params: {
          begingenerateTime: data.generateTime === undefined ? null : data.generateTime, // 创建日期开始
          endgenerateTime: data.endgenerateTime === undefined ? null : data.endgenerateTime, // 创建日期结束
          begininventoryDate: data.inventoryDate === undefined ? null : data.inventoryDate, // 盘点日期开始
          endinventoryDate: data.endinventoryDate === undefined ? null : data.endinventoryDate // 盘点日期结束
        }
      }
      data = Object.assign(data, this.pagination)
      await this.$api.storageRoom.ineysheetInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    // 取消按钮
    cancel() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请先选中盘点单')
        return
      }
      this.$confirm('确定要取消吗？')
        .then(_ => {
          if (this.selectionData[0].status === '3') {
            this.$message('已调整完成，不可取消！！！')
          } else {
            const data = {
              ineysheetInfo: {
                deptId: this.deptId,
                inventoryNo: this.selectionData[0].inventoryNo, // 单号
                whouseId: this.selectionData[0].whouseId,
                sheetId: this.selectionData[0].sheetId,
                status: '5'
              }
            }
            this.$api.storageRoom.ineysheetInfoAdd(data).then(res => {
              if (res) {
                this.$message.success('取消成功')
                this.getData()
              }
            })
          }
          // if (this.selectionData[0].status === '1') {
          //   const data = {
          //     ineysheetInfo: {
          //       deptId: this.deptId,
          //       inventoryNo: this.selectionData[0].inventoryNo, // 单号
          //       whouseId: this.selectionData[0].whouseId,
          //       sheetId: this.selectionData[0].sheetId,
          //       status: '5'
          //     }
          //   }
          //   this.$api.storageRoom.ineysheetInfoAdd(data).then(res => {
          //     if (res) {
          //       this.$message.success('取消成功')
          //       this.getData()
          //     }
          //   })
          // } else if (this.selectionData[0].status === '2') {
          //   const data = {
          //     ineysheetInfo: {
          //       deptId: this.deptId,
          //       inventoryNo: this.selectionData[0].inventoryNo, // 单号
          //       whouseId: this.selectionData[0].whouseId, // 库房编号
          //       sheetId: this.selectionData[0].sheetId, // 该数据id
          //       status: '5'
          //     }
          //   }
          //   this.$api.storageRoom.ineysheetInfoAdd(data).then(res => {
          //     if (res) {
          //       this.$message.success('取消成功')
          //       this.getData()
          //     }
          //   })
          // } else if (this.selectionData[0].status === '3') {
          //   this.$message('已调整完成，不可取消！！！')
          // } else if (this.selectionData[0].status === '5') {
          //   this.$message('该盘点单已取消')
          // } else {
          // }
        }).catch(_ => {})
    },
    // 盘点调整
    getOut() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请先选中盘点单')
        return
      }
      if(this.selectionData[0].status=='1'){
        this.$message.warning('盘点完成前禁止调整')
        return
      }
      if(this.selectionData[0].status=='3'){
        this.$message.warning('盘点调整完成禁止调整')
        return
      }
      if(this.selectionData[0].status=='5'){
        this.$message.warning('盘点取消禁止调整')
        return
      }
      this.$confirm('确定要调整吗？')
        .then(_ => {
          if (this.selectionData[0].status === '1') {
            this.$message('该盘点单未完成盘点')
          } else if (this.selectionData[0].status === '3') {
            this.$message('该盘点单已完成调整')
          } else if (this.selectionData[0].status === '5') {
            this.$message('该盘点单已取消')
          } else if (this.selectionData[0].status === '2') {
            const data = {
              ineysheetInfo: {
                sheetId: this.selectionData[0].sheetId, // 总单编号
                inventoryNo: this.selectionData[0].inventoryNo, // 单号
                status: '3',
                examinePerson: this.user.userId,
                inventoryDate: GMTToStr(new Date())
              }
            }
            this.$api.storageRoom.ineysheetInfoAdd(data).then(res => {
              if (res) {
                this.$message.success('调整成功')
                this.getData()
              }
            })
          }
        }).catch(_ => {})
    },
    // 盘点录入
    Entry() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请先选中盘点单')
        return
      }
      if(this.selectionData[0].status=='2'){
        this.$message.warning('盘点完成禁止录入')
        return
      }
      if(this.selectionData[0].status=='3'){
        this.$message.warning('盘点调整完成禁止录入')
        return
      }
      if(this.selectionData[0].status=='5'){
        this.$message.warning('盘点取消禁止录入')
        return
      }
      this.$router.push({ path: 'enterCount', query: { item: this.selectionData[0] }})
    },
    // 修改
    modify(val) {
      this.$router.push({ path: 'enterCount', query: { item: val }})
    },
    // 创建盘点单
    establish() {
      // if(this.)
      this.$router.push({ path: 'createCount' })
    },
    // 导出
    async putRemark() {
      await this.$api.storageRoom.inventoryListExport({ inventoryNo: this.form.inventoryNo })
    },
    // 详情
    details(val) {
      this.form = val
      this.$api.storageRoom.inventoryListList({ inventoryNo: val.inventoryNo }).then(res => {
        if (res) {
          this.templateData = res.rows
        }
      })
      this.showDialog = true
    },
    handleClose() {
      this.showDialog = false
    },
    // 打印
    Print() {
      this.printList = []
      this.print = {}
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请先选中盘点单')
        return
      }
      if (this.selectionData[0].status === '3' || this.selectionData[0].status === '4' || this.selectionData[0].status === '5') {
        this.$message('只能打印调整前的盘点单')
      } else {
        this.print = this.selectionData[0]
        this.$api.storageRoom.inventoryListList({ inventoryNo: this.selectionData[0].inventoryNo }).then(res => {
          if (res) {
            this.printList = res.rows;
            let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
            let newstr=str.split('<')[0]
            this.newmessage=newstr
            this.$nextTick(() => {
              this.$refs.Inventory.print()
            })
          }
        })

      }
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
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    getUserList() {
      /**
       * @author 李尚
       * @date 2022/9/17
       * @Description: 人员添加公司Id  添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          // const tempU = []
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
            // if (item.postCode === 'kuguan') {
            //   tempU.push(item)
            // }
          })
          const arr1 = this.unique(res.data)
          this.userList = this.unique(res.data)
          this.options.examinePerson.options = arr1
          this.options.inventoryPerson.options = arr1
          this.options.createPerson.options = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    rowClassName({ row }) {
      if (row.status === '2') {
        return 'success-rows'
      } else if (row.status === '3') {
        return 'success-rowstree'
      } else if (row.status === '5') {
        return 'success-rowsfix'
      }
      return ''
    }
  }
}
</script>
<style>
.el-table .success-rows {
  background-color: #a4e0d5;
}
.el-table .success-rowstree {
  background-color: #ecdfb1;
}
.el-table .success-rowsfix {
  background-color: #bfbdbd;
}
</style>
<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

.redStr{
  display: none;
}
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
