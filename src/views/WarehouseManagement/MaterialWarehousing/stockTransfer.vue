<template>
  <!--移库-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">移库单
        </div>
        <el-form
          ref="form"
          class="mentform"
          :model="form"
          :rules="rules"
          size="mini"
          label-width="100px"
          style="margin-top:10px "
        >
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item label="移库单号:">
                <el-input v-model="form.removeNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="执行人:">
                <el-select
                  v-model="form.executePerson"
                  disabled
                  filterable
                  class="fullInput"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(userItem, index) in userList"
                    :key="index"
                    :label="userItem.nickName"
                    :value="userItem.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="执行日期:">
                <el-input v-model="form.operationDate" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="源库房:" prop="oldWhouseId">
                <el-select v-model="form.oldWhouseId" filterable clearable @change="oldWarehouseChange">
                  <el-option
                    v-for="(item, index) in oldRoomList"
                    :key="index"
                    :label="item.outWarehouseName"
                    :value="item.outWarehouseId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目标库房:" prop="newWhouseId">
                <el-select v-model="form.newWhouseId" filterable clearable @change="newWarehouseChange">
                  <el-option
                    v-for="(item, index) in newRoomList"
                    :key="index"
                    :label="item.inWarehouseName"
                    :value="item.inWarehouseId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input v-model="form.remark" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="mentediv">
        <div class="formBody" style="min-height: 520px">
          <div slot="searchBar">
            <div style="width: 100%;height:35px; margin-top: 10px; background-color: #1abc9c">
              <el-button
                class="elbut"
                style="float:right; margin-right: 5px;"
                icon="el-icon-plus"
                type="primary"
                size="mini"
                @click="importProject"
              >导入物资
              </el-button>
              <el-button
                class="elbut"
                style="float:right; margin-right: 5px;"
                icon="el-icon-plus"
                type="primary"
                size="mini"
                @click="Warehousing"
              >按入库单导入
              </el-button>
            </div>
            <el-table
              :data="tableData"
              border
              size="mini"
              max-height="480"
              style="width: 100%"
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="materialName" label="物资名称" />
              <el-table-column prop="productionBatch" label="生产批次" />
              <el-table-column prop="purchasePrice" label="物资价格" />
              <el-table-column prop="insertNumber" label="入库数量" />
              <el-table-column prop="availableNumber" label="可用量" />
              <el-table-column prop="removeNumber" label="转移数量">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.removeNumber"
                    size="mini"
                    style="width: 100%"

                    @blur="rember(scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button
          :class="{redStr: bools}"
          size="mini"
          type="primary"
          icon="el-icon-folder-checked"
          :loading="submitLoading"
          @click="addRoom(0)"
        >
          暂存
        </el-button>
        <el-button size="mini" :loading="submitLoading" @click="addRoom(1)">确定移库</el-button>
        <el-button size="mini" type="danger"  icon="el-icon-close" @click="remode">关闭
        </el-button>
      </div>
    </div>
    <!--导入物资-->
    <el-dialog
      title="导入物资"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <tMaterials :form="formTmater" @handleDelete="handleDeletes" @daoruImport="daoruImports" />
    </el-dialog>
    <!-- 按入库单导入 -->
    <sg-dialog
      title="选择入库单"
      :dialog="dialog"
      size="60%"
      @handleClose="handle"
    >
      <div slot="out">
        <el-form :inline="true" :model="forminsert" class="demo-form-inline" size="mini">
          <el-form-item label="入库日期:">
            <el-date-picker
              v-model="forminsert.inhouseData"
              style="width: 260px"
              clearable
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
          <el-button style="float:right; margin-left: 10px" size="mini" icon="el-icon-plus" @click="outImport">导入
          </el-button>
          <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="getoutku">搜索
          </el-button>
        </el-form>
        <el-table
          :data="tableDataList"
          size="mini"
          border
          height="300"
          style="width: 100%"
          highlight-current-row
          :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
          :cell-style="{'text-align':'center', 'font-size':'12px'}"
          @row-click="Dataout"
        >
          <el-table-column prop="inDocumentNo" label="入库单号" width="145"/>
          <el-table-column prop="executeUserName" label="执行人" width="130"/>
          <el-table-column prop="inhouseData" show-overflow-tooltip label="执行日期" width="145"/>
          <el-table-column prop="companyName" label="供应商" />
          <el-table-column prop="whouseName" label="库房" width="200"/>
          <el-table-column label="入库单类型">
            <template #default="scpoe">
              <template v-for="item in dict.type.document_type">
                <span v-show="scpoe.row.documentType === item.value " :key="item.value">{{ item.label }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="进价总额" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </div>
    </sg-dialog>
  </el-scrollbar>
</template>

<script>
import { math } from '@/utils/math'
import vm from '@/utils/util'
import sgDialog from '@/components/Dialog'
import tMaterials from '@/components/ImportMaterials'
import { timeFmt, todayTime } from '@/utils/time'

export default {
  name: 'StockTransfer',
  components: { sgDialog, tMaterials },
  dicts: ['document_type'],
  data() {
    return {
      formTmater: {},
      bool: true,
      bools: false,
      //  用户列表
      userList: [],
      RoomList: [], // 库房
      oldRoomList: [], // 库房
      newRoomList: [], // 库房
      // ---
      tableData: [],
      Tatalist: [],
      tableDataList: [],
      inDocumentNo: '',
      // 出库单
      form: {
        removeNo: '', // 出库单号
        executePerson: '', // 执行人
        operationDate: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()), // 执行日期
        oldWhouseId: '', // 源库房
        newWhouseId: '', // 目标库房
        remark: ''
      },
      rules: {
        newWhouseId: [{ required: true, message: '请选择目标仓库', trigger: 'blur' }],
        oldWhouseId: [{ required: true, message: '请选择源仓库', trigger: 'blur' }]
      },
      submitLoading: false, // 暂存入库 loading
      dialogVisible: false, // 导入物资 关闭/打开
      dialog: false,
      // 树结构
      deptOptions: [], // 树 的数据
      defaultProps: {
        children: 'sonList',
        label: 'name'
      },
      // 导入搜索
      femptree: {
        createTime: null, // 开始时间
        endcreateTime: null, // 结束时间
        shortCode: '', // 简码
        templateUseName: '' // 物资名称
      },
      forminsert: {
        inhouseData: todayTime()
      }, // 入库单导入
      removeIds: [], // 删除数据
      templateData: [], // 物资列表
      templateDataque: [], // 中间那个
      templateDatas: [] // 已选中
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
    }
  },
  created() {
    if (this.$route.query.item !== undefined) {
      this.form = this.$route.query.item
      this.getDate()
    }
    this.deptId = this.$store.getters.departmentId
    this.user = this.$store.getters.user
    this.form.executePerson = this.user.userId
    this.userId=this.user.userId
    this.getUserList()
    // this.getTreeselect()
  },
  methods: {
    getDate() {
      const removeNo = this.$route.query.item.removeNo
      this.$api.storageRoom.removeList({ removeNo: removeNo }).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    // 原库房改变事件
    oldWarehouseChange(e) {
      // 如果选择了一个库房
      if (e) {
        // 筛选出对应的入库库房并去重
        this.newRoomList = this.uniqueWarehouse(this.RoomList.filter(item => item.outWarehouseId === e), 'inWarehouseId')
      } else {
        this.newRoomList = this.uniqueWarehouse(this.RoomList, 'inWarehouseId')
      }
    },
    // 目标库房改变事件
    newWarehouseChange(e) {
      if (e) {
        this.oldRoomList = this.uniqueWarehouse(this.RoomList.filter(item => item.inWarehouseId === e), 'outWarehouseId')
      } else {
        this.oldRoomList = this.uniqueWarehouse(this.RoomList, 'outWarehouseId')
      }
    },
    // 出库数量
    outnumber(index, val) {
      if (val.availableNumber < val.outNumber) {
        this.$message('出库数量不得大于可用数量')
        val.outNumber = val.availableNumber
      }
    },
    // 导入物资
    importProject() {
      if (this.form.oldWhouseId === '') {
        this.$message('请选择源库房')
        return
      }
      this.formTmater.whouseId = this.form.oldWhouseId
      this.dialogVisible = true
    },
    handleDeletes() {
      this.dialogVisible = false
    },
    daoruImports(val) {
      val.forEach(res => {
        this.tableData.push(res)
      })
      this.dialogVisible = false
    },
    Warehousing() {
      if (this.form.oldWhouseId === '') {
        this.$message('请先选择源库房')
        return
      }
      this.dialog = true
    },
    handle() {
      this.dialog = false
      this.tableData = []
      this.forminsert = {}
    },
    // 转移数量
    rember(val) {
      if (val.availableNumber < val.removeNumber) {
        val.removeNumber = val.availableNumber
      }
    },
    //  列表删除
    handDelete(index, row) {
      if (row.removeListId === 0 || row.removeListId === undefined || row.removeListId === null) {
        this.tableData.splice(index, 1)
      } else {
        this.removeIds.push(row.removeListId)
        this.tableData.splice(index, 1)
      }
    },
    // 节点点击事件 禁用按钮
    handleNodeClick(data, val) {
      this.$set(this.femptree, 'whouseId', data.whouseId)
      this.$set(this.femptree, 'deptId', this.deptId)
      this.$api.storageRoom.materialInfoLst(this.femptree).then(res => {
        if (res) {
          this.templateData = res.rows
        }
      })
    },
    // 弹框按钮 点击添加
    // 第二个添加按钮
    additionapriceNum(data) {
      let flag = true
      this.templateDatas.forEach(item => {
        if (item.insertId === data.insertId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.templateDatas.push(data)
        this.templateDataque = this.templateDataque.filter(item => {
          return data.insertId !== item.insertId
        })
      } else {
        this.$message.warning('不能重复添加')
      }
    },
    // 弹框 三 列表 删除
    deleteitiona(data) {
      let flag = true
      this.templateDataque.forEach(item => {
        if (item.materId === data.materId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.templateDataque.push(data)
      }
      this.templateDatas = this.templateDatas.filter(item => {
        return data.materId !== item.materId
      })
    },
    // 弹框按钮 导入
    treeImport() {
      if (this.templateDatas.length !== 0) {
        this.tableData = this.tableData.concat(this.templateDatas)
        this.dialogVisible = false
        this.templateData = []
        this.templateDatas = []
      } else {
        this.$message('导入物资不能为空')
      }
    },
    // 按入库单 - 搜索
    getoutku() {
      var date = {
        deptId: this.deptId,
        inhouseData: this.forminsert.inhouseData === null ? null : this.forminsert.inhouseData[0],
        endinhouseData: this.forminsert.inhouseData === null ? null : this.forminsert.inhouseData[1],
        whouseId: this.form.oldWhouseId
      }
      this.$api.storageRoom.insertInfoList(date).then(res => {
        if (res) {
          this.tableDataList = res.rows
        }
      })
    },
    // 点击
    Dataout(row) {
      this.inDocumentNo = row.inDocumentNo
    },
    // 按入库单 - 导入
    outImport() {
      if (this.form.whouseId === '') {
        this.$message('请选择源库房')
        return
      }
      this.$api.storageRoom.insertList({ inDocumentNo: this.inDocumentNo }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.dialog = false
        }
      })
      this.tableData = []
      this.tableDataList = []
      this.forminsert = {
        inhouseData: todayTime()
      }
    },
    // 转移 暂存 / 确定
    addRoom(val) {
      if (this.tableData.some((val) => val.removeNumber === undefined)) {
        this.$message('请填写移库数量')
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.tableData.length === 0) {
            this.$message('请选择转移物资')
            return
          }
          if (this.form.newWhouseId === '') {
            this.$message('请选择转移库房')
            return
          }
          this.Tatalist = []
          let totalPrice = 0
          this.tableData.forEach(item => {
            totalPrice = totalPrice + item.removeNumber * item.purchasePrice
            if (item.removeListId === undefined) {
              item.removeListId = 0
            }
            this.Tatalist.push({
              'removeListId': item.removeListId === undefined ? 0 : item.removeListId,
              'deptId': this.deptId,
              'materId': item.materId,
              'materialName': item.materialName,
              // 'newInBatchNumber': '',
              'newWhouseId': this.form.newWhouseId,
              'oldInBatchNumber': item.inBatchNumber === undefined ? item.oldInBatchNumber : item.inBatchNumber,
              'oldProductionBatch': item.productionBatch,
              'oldWhouseId': this.form.oldWhouseId,
              'purchasePrice': item.purchasePrice,
              'remark': item.remark,
              'removeAmount': math.multiply(item.purchasePrice, item.removeNumber),
              'removeNo': item.removeNo,
              'removeNumber': item.removeNumber, // 转移数量
              'status': val,
              assist:item.assist

            })
          })

          const data = {
            removeInfo: {
              'removeNo': this.form.removeNo === '' ? null : this.form.removeNo,
              'totalPrice': totalPrice.toFixed(2),
              'deptId': this.deptId,
              'executeDate': this.form.operationDate, // 日期
              'executePerson': this.form.executePerson, // 执行人
              'oldWhouseId': this.form.oldWhouseId, // 源库房
              'newWhouseId': this.form.newWhouseId, // 目标库房
              'remark': this.form.remark,
              'removeId': this.form.removeId == null ? 0 : this.form.removeId,
              'status': val
            },
            removeListList: this.Tatalist,
            removeIds: this.removeIds
          }
          this.submitLoading=true
          this.$api.storageRoom.removeInfoAdd(data).then(res => {
            if (res) {
              this.$message.success('转移成功')
              this.submitLoading=false
              this.$router.push({ path: 'materialTransfer' })
            }
          })
        }
      })
    },
    // 弹框 清空
    treeDelete() {
      this.templateDatas = []
      this.templateDataque = []
    },
    // 弹框按钮 关闭
    handleClose() {
      this.templateData = []
      this.templateDatas = []
      this.templateDataque = []
      this.dialogVisible = false
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取库房列表
    getUserList() {
      // 库房
      this.$api.storageRoom.selectWarehouseAuthority({ userId: this.userId ,deptId: this.deptId}).then(res => {
        if (res) {
          this.RoomList = res.rows
          this.oldRoomList = this.uniqueWarehouse(res.rows, 'outWarehouseId')
          this.newRoomList = this.uniqueWarehouse(res.rows, 'inWarehouseId')
        }
      })
      // 获取用户列表
      this.$api.user.getUserList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.$forceUpdate()
          // 去重
          this.userList = res.data
        }
      })
    },
    uniqueWarehouse(arr, attribute) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr[attribute]) && res.set(arr[attribute], 1))
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 关闭当前标签
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 大页面关闭
    remode() {
      this.closeTag()
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-input-number__decrease {
  display: none;
}

::v-deep .el-input-number__increase {
  display: none;
}

// 弹框头部背景颜色
::v-deep .el-dialog__header {
  background-color: #1abc9c;
}

//number 宽度调整
::v-deep .el-input-number .el-input__inner {
  padding: 0;
  width: 80px;
}

.redStr {
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

.el-button--mini, .el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}

.select {
  font-size: 12px;
  padding-left: 15px;
}

.header {
  font-size: 12px;
  padding-top: 5px;
  margin-bottom: 5px;
}

.management {
  padding: 6px 40px;

  .itemment {
    color: #1abc9c;
    font-size: 14px;
    font-weight: 600;
  }

  .demo-form-inline {
    line-height: 40px;
  }

  .el-input--mini {
    line-height: 37px;
  }

  a {
    font-size: 12px;
    color: #1abc9c;
    text-decoration: none;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index: 1000;

  .content {
    position: fixed;
    right: 20px;

    .red {
      font-weight: 400;
      color: red;
    }
  }
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

::v-deep .el-input__icon:after {
  display: none;
}

::v-deep .el-table__body tr.current-row>td {
  color: #fff;
  background: #1abc9c!important;
}
</style>

