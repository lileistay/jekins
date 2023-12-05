<template>
  <!--创建盘点单-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">入库单
        </div>
        <el-form ref="form" class="mentform" :model="form" size="mini" :rules="rules" label-width="100px" style="margin-top:10px ">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item label="盘点单号:">
                <el-input v-model="form.outDocumentNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="创建人:">
                <el-select
                  v-model="form.createPerson"
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
                <el-input v-model="form.generateTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="库房:" prop="whouseId">
                <el-select v-model="form.whouseId" filterable clearable>
                  <el-option
                    v-for="(item, index) in RoomList"
                    :key="index"
                    :label="item.whouseName"
                    :value="item.whouseId"
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
                plain
                size="mini"
                @click="importProject"
              >导入物资
              </el-button>
              <el-button
                class="elbut"
                style="float:right; margin-right: 5px;"
                icon="el-icon-plus"
                type="primary"
                plain
                size="mini"
                @click="allLibrary"
              >导入库房全部物资
              </el-button>
              <el-button
                class="elbut"
                style="float:right; margin-right: 5px;"
                icon="el-icon-plus"
                type="primary"
                plain
                size="mini"
                @click="hoveLibrary"
              >导入库房全部物资（有库存）
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
              <el-table-column prop="materialTypeName" label="一级类型" width="280" />
              <el-table-column prop="typeName" label="二级类型" />
              <el-table-column prop="matTypeName" label="三级类型" />
              <el-table-column prop="shortCode" label="物资简码" />
              <el-table-column prop="materialCode" label="物资编码" />
              <el-table-column prop="materialName" label="物资名称" />
              <el-table-column prop="materialSpec" label="规格" width="80" />
              <el-table-column prop="unitName" label="单位" width="80" />
              <el-table-column prop="inventoryQuantity" label="现有数量" width="80" />
              <!--              <el-table-column type="index" label="排序" width="80" />-->
              <el-table-column prop="remark" label="备注" />
              <el-table-column label="操作" width="60" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
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
        <el-button size="mini" icon="el-icon-folder-add" type="primary" plain :loading="submitLoading" @click="addRoom(1)">保存</el-button>
        <el-button size="mini" type="danger"  icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
    <!--    导入物资-->
    <sg-dialog
      title="导入物资"
      :dialog="dialogVisible"
      size="60%"
      @handleClose="handleClose"
    >
      <div slot="out">
        <el-form :inline="true" :model="femptree" class="demo-form-inline" size="mini">
          <el-form-item label="物资名称:">
            <el-input v-model="femptree.materialName" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item label="简码:">
            <el-input v-model="femptree.shortCode" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item label="编码:">
            <el-input v-model="femptree.materialCode" clearable style="width: 120px" />
          </el-form-item>
          <el-button style="float:right;" type="danger" size="mini" @click="handleClose">关闭</el-button>
          <el-button style="float:right; margin-right: 5px" size="mini" @click="treeDelete">清空</el-button>
          <el-button style="float:right;" size="mini" @click="treeheva">批量添加(有库存)</el-button>
          <el-button style="float:right;" size="mini" @click="treeadd">批量添加</el-button>
          <el-button style="float:right;" size="mini" @click="treeImport">导入</el-button>
          <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="getTree">搜索</el-button>
        </el-form>
        <div class="formBodys">
          <div class="form-left">
            <div class="title">物资类型</div>
            <el-tree
              default-expand-all
              :filter-node-method="filterNode"
              :data="deptOptions"
              :props="defaultProps"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node,data }" style="width: 100%" class="custom-tree-node">
                <span style="width: 100%">
                  <b v-if="!data.departmentInfoVos" class="el-icon-document" />
                  <b v-else-if="node.expanded" class="el-icon-folder-opened" />
                  <b v-else class="el-icon-folder" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
          <div class="form-right" >
            <div class="title">物资列表</div>
            <div style="margin-top: 10px">
              <el-table
                :data="templateData"
                size="mini"
                height="200"
                border
                :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
                :cell-style="{'text-align':'center', 'font-size':'12px'}"
              >
                <el-table-column prop="materialCode" label="物资编码" />
                <el-table-column prop="shortCode" label="简码" width="120" />
                <el-table-column prop="materialName" label="物资名称" />
                <el-table-column prop="materialName" label="库房" />
                <el-table-column prop="materialSpec" label="规格" />
                <el-table-column prop="unitName" label="单位" />
                <el-table-column prop="inventoryQuantity" label="库存" />
                <el-table-column prop="priceNum" label="操作" fixed="right">
                  <template slot-scope="{row}">
                    <el-button size="mini" @click="additionalData(row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="height: 40px;line-height: 40px;padding-left: 10px; background-color: #1abc9c">已选择</div>
            <div style="margin-top: 10px">
              <el-table
                :data="templateDatas"
                size="mini"
                border
                height="200"
                :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
                :cell-style="{'text-align':'center', 'font-size':'12px'}"
              >
                <el-table-column prop="materialCode" label="物资编码" />
                <el-table-column prop="shortCode" label="物资简码" width="120" />
                <el-table-column prop="materialName" label="物资名称" />
                <el-table-column prop="materialName" label="库房" />
                <el-table-column prop="materialPpec" label="规格" />
                <el-table-column prop="unitName" label="单位" />
                <el-table-column prop="inventoryQuantity" label="现有库存" />
                <el-table-column prop="priceNum" label="操作" fixed="right">
                  <template slot-scope="{row}">
                    <el-button size="mini" @click="deleteitiona(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </sg-dialog>
  </el-scrollbar>
</template>

<script>
import { math } from '@/utils/math'
import { debounce } from '@/utils/throttleAndDebounce'
import { timeFmt } from '@/utils/time'
import vm from '@/utils/util'
import sgDialog from '@/components/Dialog'

export default {
  name: 'CreateCount',
  components: {
    sgDialog
  },
  dicts: ['medication_unit', 'cm_medication_frequency', 'wm_medication_frequency', 'whether', 'discount'],
  data() {
    return {
      params: {
        materialTypeId: null,
        typeId: null,
        matTypeId: null
      }, // 查询
      // 弹框
      dialogVisible: false, // 导入物资 关闭/打开
      // 树结构
      templateData: [],
      outListList: [],
      templateDatas: [],
      deptOptions: [], // 树 的数据
      defaultProps: {
        children: 'sonList',
        label: 'name'
      },
      femptree: {},
      //  用户列表
      userList: [],
      RoomList: [], // 库房
      // ---
      tableData: [],
      // 入库单
      form: {
        outDocumentNo: '', // 出库单号
        createPerson: '', // 执行人
        generateTime: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()), // 执行日期
        whouseId: '', // 供应商
        remark: ''
      },
      rules: {
        whouseId: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ]
      },
      submitLoading: false, // 暂存入库 loading
      removeIds: []
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
    },
    userId: {
      get() {
        return this.$store.getters.user.userId
      }
    }
  },
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getUserList()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.user = this.$store.getters.user
    this.form.createPerson = this.user.userId
    this.getUserList()
    this.getTreeselect()
  },
  methods: {
    // 弹框按钮 关闭
    handleClose() {
      this.templateData = []
      this.templateDatas = []
      this.dialogVisible = false
    },
    // 弹框 清空
    treeDelete() {
      this.templateDatas = []
      this.getTree()
    },
    // 弹框-导入
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
    // 弹框-批量添加
    treeadd() {
      this.$api.storageRoom.storehouseInfoList({ whouseId: this.form.whouseId }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.dialogVisible = false
        }
      })
    },
    // 弹框-批量导入有库存
    treeheva() {
      const data = {
        whouseId: this.form.whouseId,
        params: {
          isInventory: '1'
        }
      }
      this.$api.storageRoom.storehouseInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.dialogVisible = false
        }
      })
    },
    // 导入物资-搜索
    getTree: debounce(function() {
      // this.$delete(this.femptree, 'whouseId')
      this.$set(this.femptree, 'whouseId', this.form.whouseId)
      this.femptree.params={
        shortCode:this.femptree.shortCode,
        materialName:this.femptree.materialName,
        materialCode:this.femptree.materialCode
      }
      this.$api.storageRoom.storehouseInfoList(this.femptree).then(res => {
        if (res) {
          this.templateData = res.rows
        }
      })
    }, 300),
    // 节点点击事件 禁用按钮
    handleNodeClick: debounce(function(data, val) {
      if (data.type === '1') {
        this.$set(this.params, 'materialTypeId', data.id)
        this.$delete(this.params, 'typeId')
        this.$delete(this.params, 'matTypeId')
      } else if (data.type === '2') {
        this.$delete(this.params, 'materialTypeId')
        this.$delete(this.params, 'matTypeId')
        this.$set(this.params, 'typeId', data.id)
      } else if (data.type === '3') {
        this.$delete(this.params, 'materialTypeId')
        this.$delete(this.params, 'typeId')
        this.$set(this.params, 'matTypeId', data.id)
      }
      var data = {
        whouseId: this.form.whouseId,
        params: this.params
      }
      this.$api.storageRoom.storehouseInfoList(data).then(res => {
        if (res) {
          this.templateData = res.rows
        }
      })
    }, 300),
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 弹框按钮 点击添加
    additionalData(data) {
      let flag = true
      this.templateDatas.forEach((item) => {
        if (item.materId === data.materId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.templateDatas.push(data)
        this.templateData = this.templateData.filter(item => {
          return data.materId !== item.materId
        })
      } else {
        this.$message.warning('不能重复添加')
      }
    },
    // 删除
    deleteitiona(data) {
      this.templateDatas = this.templateDatas.filter(item => {
        return data.inBatchNumber !== item.inBatchNumber
      })
      this.templateData.push(data)
    },
    // 树结构
    getTreeselect() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 关闭当前标签
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 导入物资
    importProject() {
      if (this.form.whouseId === '') {
        this.$message('请选择库房')
        return
      }
      this.dialogVisible = true
    },
    // 导入库房全部物资
    allLibrary: debounce(function() {
      if (this.form.whouseId === '') {
        this.$message('请选择库房')
        return
      }
      const date = {
        whouseId: this.form.whouseId,
        deptId: this.deptId
      }
      this.$api.storageRoom.storehouseInfoList(date).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    }, 300),
    // 导入库房全部物资（有库存）
    hoveLibrary: debounce(function() {
      if (this.form.whouseId === '') {
        this.$message('请选择库房')
        return
      }
      const data = {
        deptId: this.deptId,
        whouseId: this.form.whouseId,
        params: {
          isNotInven: '1'
        }
      }
      console.log(data)
      this.$api.storageRoom.storehouseInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    }, 300),
    // 删除此条数据
    handleDelete(index, row) {
      if (this.form.outDocumentNo !== '') {
        if (row.outId !== undefined || row.outId !== null) {
          this.$api.storageRoom.outListDelete(row.outId).then(res => {
            if (res) {
              this.$message.success('删除成功')
            }
          })
        }
      }
      this.$message.success('删除成功')
      this.removeIds.push(row.orderDetailsId)
      this.tableData.splice(index, 1)
      this.accountsPayable = this.tableData.reduce((prev, next) => {
        return math.add(prev, next.discountAmount).toFixed(2)
      }, 0)
    },
    // 保存盘点单
    addRoom(val) {
      // 创建盘点单
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.outListList = []
          this.tableData.forEach(item => {
            console.log(item)
            this.outListList.push({
              deptId: this.deptId,
              purchasePrice: math.divide(item.inventoryPrice, item.inventoryQuantity) === Infinity ? 0 : math.divide(item.inventoryPrice, item.inventoryQuantity), // 物资单价
              // purchasePrice: math.subtract(item.inventoryPrice, item.inventoryQuantity),
              matTypeId: item.matTypeId,
              whouseId: item.whouseId,
              materialTypeId: item.materialTypeId,
              typeId: item.typeId,
              materialPrice: item.inventoryPrice,
              materId: item.materId,
              unitName: item.unitName,
              typeName: item.typeName,
              materialName: item.materialName,
              inventoryQuantity: item.inventoryQuantity,
              assist:item.assist
            })
          })
          const data = {
            ineysheetInfo: {
              deptId: this.deptId,
              inventoryNo: this.form.outDocumentNo === null ? null : this.form.outDocumentNo,
              generateTime: this.form.generateTime,
              createPerson: this.form.createPerson, // 执行人
              whouseId: this.form.whouseId,
              remark: this.form.remark,
              sheetId: this.form.sheetId,
              status: val
            },
            inventoryLists: this.outListList
          }
          this.submitLoading=true
          this.$api.storageRoom.ineysheetInfoAdd(data).then(res => {
            if (res) {
              this.templateData = res.rows
              this.$router.push({ path: 'inventoryMaterials' })
              this.submitLoading = false
            }
          })
        }
      })
    },
    // 获取系统用户列表
    getUserList() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      // 库房
      this.$api.storageRoom.selectInWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          this.RoomList = res.data
        }
      })
      // 添加状态
      this.$api.user.getUserList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.$forceUpdate()
          const arr1 = this.unique(res.data)
          this.userList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    // 大页面关闭
    remode() {
      this.closeTag()
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 8px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
::v-deep .el-input-number__decrease {
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}
//number 宽度调整
::v-deep .el-input-number .el-input__inner {
  padding: 0;
  width: 80px;
}
// 弹框头部背景颜色
::v-deep .el-dialog__header {
  background-color: #1abc9c;
}
// 表头子
::v-deep .el-dialog__title {
  font-size: 16px;
}
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
.formBodys{
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding:40px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 15px;
  .title{
    position: absolute;
    top: -11px;
    left: 25px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
  .form-left{
    width: 23%;
    min-height: 250px;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }
  .form-right{
    width: 75%;
    min-height: 250px;
    border-radius: 10px;
    position: relative;
    border: 1px solid #c6c6c6;
  }
}
.titme{
  height: 40px;
  line-height: 40px;
  color: #ffff;
  font-size: 14px;
  margin-top: 10px;
  background-color: #1abc9c;
}
.el-button--mini, .el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}
.select{
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
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
::v-deep .el-input__icon:after {
  display: none;
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>

