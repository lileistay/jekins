<template>
  <!--  仪器管理-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay">
      <template v-slot:company>
        <div class="container">
          <div class="dept-table">
            <div class="one_list">
              <sg-table
                ref="table"
                border
                selection
                :hide-search-bar="true"
                :table-data="tableDataone"
                :pagination="paginationOne"
                :columns="columnone"
                :operate="operateone"
                :sg-ref="'multipleTable'"
                @operateClick="operateClicone"
                @row-click="rowClick"
                @size-change="sizeChangeone"
                @current-change="currentChangeone"
                @selection-change="handleSelectionChangeone"
                @table-current-change="handleCurrentChange"
              >
                <div slot="header">
                  <el-button v-hasPermi="['sorage:materialType:add']" type="primary" :disabled="btnDisabledone" size="mini" round @click="formone">新增</el-button>
                  <el-button v-hasPermi="['sorage:materialType:delete']" type="danger" :disabled="btnDisabledonedelete" size="mini" round @click="handleDeleteOne">删除</el-button>
                </div>
                <template #custom="data">
                  <div v-if="data.props === 'status'">
                    <p>{{ data.custom.status == '0' ? '是' : '否' }}</p>
                  </div>
                </template>
              </sg-table>
            </div>
            <div class="two_list">
              <sg-table
                ref="tableOne"
                border
                selection
                :sg-ref="'multipleTableOne'"
                :hide-search-bar="true"
                :table-data="tableDatatwo"
                :pagination="paginationtwo"
                :columns="columntwo"
                :operate="operatetwo"
                @row-click="rowClicktwo"
                @operateClick="operateClicktwo"
                @size-change="sizeChangetwo"
                @current-change="currentChangetwo"
                @selection-change="handleSelectionChangetwo"
              >
                <div slot="header">
                  <el-button v-hasPermi="['sorage:materialTypeInfo:add']" type="primary" :disabled="btnDisabledtwo" size="mini" round @click="twotype">新增</el-button>
                  <el-button v-hasPermi="['sorage:materialTypeInfo:delete']" type="danger" :disabled="btnDisabledtwodelete" size="mini" round @click="handleDeletetwo">删除</el-button>
                </div>
                <template #custom="data">
                  <div v-if="data.props === 'status'">
                    <p>{{ data.custom.status == '0' ? '是' : '否' }}</p>
                  </div>
                  <div v-else-if="data.props === 'materialType'">
                    <p>{{ data.custom.materialType == '0' ? '药品' : '物资' }}</p>
                  </div>
                </template>
              </sg-table>
            </div>
            <div class="theer_list">
              <sg-table
                border
                :hide-search-bar="true"
                :table-data="tableDatatheer"
                :pagination="paginationtheer"
                :columns="columntheer"
                :operate="operatetheer"
                @operateClick="operateClictheer"
                @size-change="sizeChangetheer"
                @current-change="currentChangetheer"
              >
                <div slot="header">
                  <el-button v-hasPermi="['sorage:materialTypeList:add']" type="primary" :disabled="btnDisabledtheer" size="mini" round @click="treetype">新增</el-button>
                </div>
                <template #custom="data">
                  <div v-if="data.props === 'status'">
                    <p>{{ data.custom.status == '0' ? '是' : '否' }}</p>
                  </div>
                  <div v-else-if="data.props === 'materialType'">
                    <p>{{ data.custom.materialType == '0' ? '药品' : '物资' }}</p>
                  </div>
                </template>
              </sg-table>
            </div>
          </div>
          <!-- 弹框 -->
          <sgDialog :title="title" size="430px" :dialog="showDialog" @handleClose="empty">
            <div slot="out">
              <el-form ref="form" label-width="160px" :rules="rules" :model="form" size="mini">
                <el-form-item label="类型名称：" prop="matTypeName">
                  <el-input v-model="form.matTypeName" style="width: 190px" />
                </el-form-item>
                <el-form-item label="类型描述：" prop="remark">
                  <el-input v-model="form.remark" style="width: 190px" />
                </el-form-item>
                <el-form-item label="是否显示：" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio label="1">否</el-radio>
                    <el-radio label="0">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="物资类别：" prop="typeId">
                  <el-select v-model="form.typeId" filterable style="width: 190px">
                    <el-option label="药品" value="0" />
                    <el-option label="物资" value="1" />
                  </el-select>
                </el-form-item>
                <el-form-item label="上级物资类型：" prop="supAttributeType">
                  <el-input v-model="form.supAttributeType" disabled style="width: 190px" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="submitLoding" @click="submitForm">确认</el-button>
                  <el-button @click="empty">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </sgDialog>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgDialog from '@/components/Dialog/index'
import sgTable from '@/components/Table/index'
import { debounce } from '@/utils/throttleAndDebounce'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Tree from '@/components/newTree/index'
// import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  dicts: ['whether'],
  name: 'DeptChannel',
  components: {
    sgTable,
    Tree,
    sgDialog
  },
  data() {
    return {
      submitLoding:false,
      DataOne: {
        deptId: '',
        deptidname: ''
      },
      addedList: 0,
      deptName: undefined, // 公司搜索
      // 树
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      title: '新增',
      rowTable: undefined,
      // 新增 弹框
      showDialog: false,
      form: {
        matTypeName: '',
        remark: '',
        status: '0',
        typeId: '',
        supAttributeType: '',
        deptId: ''
      },
      // 表单校验
      rules: {
        matTypeName: [
          { required: true, message: '请填写类型名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请填写类型描述', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择物资类别', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      // 一级
      btnDisabledone: true,
      btnDisabledonedelete: true,
      tableDataone: [], // 列表
      selectionData: [],
      btnDisabled: true,
      operateone: {
        name: '操作',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['sorage:materialType:edit']
          }
        ]
      },
      // 分页
      paginationOne: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      columnone: [
        {
          lab: '类别名称',
          val: 'materialTypeName' +
            ''
        },
        {
          lab: '物资描述',
          val: 'remark'
          // custom: 'productUnitName'
        },
        {
          lab: '是否显示',
          val: 'status',
          custom: 'status'
        }
      ],
      // 二级
      tableDatatwo: [], // 列表
      selectionDataTwo: [],
      btnDisabledtwo: true,
      btnDisabledtwodelete: true,
      paginationtwo: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      operatetwo: {
        name: '操作',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['sorage:materialTypeInfo:edit']
          }
        ]
      },
      columntwo: [
        {
          lab: '类别名称',
          val: 'materialName'
        },
        {
          lab: '物资描述',
          val: 'remark'
          // custom: 'productUnitName'
        },
        {
          lab: '物资类型',
          val: 'materialType',
          custom: 'materialType'
        },
        {
          lab: '是否显示',
          val: 'status',
          custom: 'status'
        }
      ],
      // 三级
      typeId: '',
      tableDatatheer: [],
      treeMatType: [],
      operatetheer: {
        name: '操作',
        cell: [
          {
            lab: '删除',
            type: 'danger',
            permi: ['sorage:materialTypeList:delete']
          },
          {
            lab: '修改',
            type: 'warning',
            permi: ['sorage:materialTypeList:edit']
          }
        ]
      },
      btnDisabledtheer: true,
      paginationtheer: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      columntheer: [
        {
          lab: '名称',
          val: 'matTypeName'
          // custom: 'productUnitName'
        },
        {
          lab: '物资描述',
          val: 'remark'
        },
        {
          lab: '物资类型',
          val: 'materialType',
          custom: 'materialType'
        },
        {
          lab: '是否显示',
          val: 'status',
          custom: 'status'
        }
      ]
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
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    },
    deptId(val) {
      // this.getDataOne() // 第一个列表
      this.getTreeselect()
    }
  },
  created() {
      this.DataOne.deptId=this.$store.getters.departmentId
      console.log(  this.DataOne.deptId)

    this.getDataOne() // 第一个列表
    this.getTreeselect()

  },
  methods: {
    changeCompay(id,item){
      // this.paginationOne.pageNum = 1
      // this.paginationOne.currentPage = 1
      // this.paginationOne.pageSize = 20
      // this.$store.dispatch('department', { departmentId: id })
      if (item.children!==undefined){
        this.btnDisabledone = true
      }else {
      this.tableDataone = []
      this.tableDatatwo = []
      this.tableDatatheer = []
      this.paginationtwo.total = 0
      this.paginationtheer.total = 0
      this.form.supAttributeType = id
      this.btnDisabled = false
      this.btnDisabledone = false
      this.form.deptId =id
      this.DataOne.deptId=id
      let datas = {
        deptId: id,
        status: '0',
        whouseLevel: 0
      }
      // console.log(this.DataOne,'DataOneDataOneDataOne')
      datas = Object.assign(datas, this.paginationOne)
      this.$api.storageRoom.materialTypeLsit(datas).then(res => {
        if (res) {
          this.tableDataone = res.rows
          this.paginationOne.total = res.total
        }
      })
      }
    },
    // 点击公司 树结构
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树结构 节点点击事件
    handleNodeClick: debounce(function(data) {
      this.tableDataone = []
      this.tableDatatwo = []
      this.tableDatatheer = []
      this.paginationtwo.total = 0
      this.paginationtheer.total = 0
      this.form.supAttributeType = data.label
      if (data.children === undefined) {
        this.btnDisabled = false
        this.btnDisabledone = false
        this.form.deptId = data.id
      } else {
        this.btnDisabled = true
        this.form.deptId = data.id
      }
      let datas = {
        deptId: data.id,
        status: '0',
        whouseLevel: 0
      }
      this.DataOne = {
        deptId: data.id,
        deptidname: data.label
      }
        // console.log(this.DataOne,'DataOneDataOneDataOne')
      datas = Object.assign(datas, this.paginationOne)
      if (data.children === undefined){
        this.$api.storageRoom.materialTypeLsit(datas).then(res => {
          if (res) {
            this.tableDataone = res.rows
            this.paginationOne.total = res.total
          }
        })
      }

      this.tableDataone = []
    }, 500),
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    /**
      * @author 李尚
      * @date 2022/9/6
      * @Description: 一级list 库存
    */
    getDataOne() {
      var data = {
        whouseLevel: 0,
        deptId: this.DataOne.deptId ? this.DataOne.deptId : this.deptId
      }
      this.$api.storageRoom.materialTypeLsit(data).then(res => {
        if (res) {
          this.tableDataone = res.rows
          this.paginationOne.total = res.total
        }
      })
    },
    // 一级 新增
    formone() {
      this.addedList = 1
      this.showDialog = true
      this.form.deptId = this.DataOne.deptId
      this.form.supAttributeType = this.DataOne.deptidname
    },
    operateClicone(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdateOne(e[1])
      }
    },
    // 删除
    handleDeleteOne() {
      this.$confirm('此操作将永久删除该数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.tableDatatwo.length > 0) {
          this.$message('该数据下有子数据，不能删除')
          return
        }
        this.$api.storageRoom.materialTypeDelete(this.selectionData[0].materialTypeId).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.getDataOne()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUpdateOne(e) {
      this.addedList = 11
      this.form = {
        matTypeId: e.materialTypeId,
        matTypeName: e.materialTypeName,
        remark: e.remark,
        status: e.status,
        typeId: e.materialType,
        deptId: this.DataOne.deptId,
        supAttributeType: this.DataOne.deptidname
      }
      this.showDialog = true
    },
    // 二级库房数据
    // 行内点击
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 表格多选 点击一级查二级
    handleSelectionChangeone: debounce(function(e) {
      this.tableDatatwo = []
      this.tableDatatheer = []
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      // 判断是否选中 显示下级
      if (this.selectionData[0] === undefined) {
        this.tableDatatwo = []
        this.btnDisabledonedelete = true // 一级删除
        this.btnDisabledtwo = true // 二级新增
        this.paginationtwo.total = 0
        this.paginationtheer.total = 0
        return
      } else {
        this.btnDisabledonedelete = false // 一级删除
        this.btnDisabledtwo = false // 二级新增
        this.twomaterialTypeInfoList()
      }
    }, 500),
    // 一级
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    /** 分页*/
    sizeChangeone(e) {
      this.paginationOne.pageSize = e[1]
      this.getDataOne()
    },
    currentChangeone(e) {
      this.paginationOne.pageNum = e[1]
      this.paginationOne.currentPage = e[1]
      this.getDataOne()
    },
    /**
      * @author 李尚
      * @date 2022/9/6
      * @Description: 二级级list 库存
    */
    twomaterialTypeInfoList() {
      let whouseIds = {
        materialTypeId: this.selectionData[0].materialTypeId
      }
      whouseIds = Object.assign(whouseIds, this.paginationtwo)
      this.$api.storageRoom.materialTypeInfoList(whouseIds).then(res => {
        if (res) {
          this.tableDatatwo = res.rows
          this.paginationtwo.total = res.total
        }
      })
    },
    // 页码
    sizeChangetwo(e) {
      this.paginationtwo.pageSize = e[1]
      this.twomaterialTypeInfoList()
    },
    currentChangetwo(e) {
      this.paginationtwo.pageNum = e[1]
      this.paginationtwo.currentPage = e[1]
      this.twomaterialTypeInfoList()
    },
    // 二级库删除/修改
    operateClicktwo(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdatetwo(e[1])
      }
    },
    // 行内点击
    rowClicktwo(e) {
      this.$refs.tableOne.$refs.multipleTableOne.clearSelection()
      this.$refs.tableOne.$refs.multipleTableOne.toggleRowSelection(e[1])
    },
    // 二级点击传值
    handleSelectionChangetwo: debounce(function(e) {
      this.selectionDataTwo = []
      this.tableDatatheer = []
      if (e[1].length > 1) {
        this.$refs.tableOne.$refs.multipleTableOne.clearSelection()
        this.$refs.tableOne.$refs.multipleTableOne.toggleRowSelection(e[1].pop())
      }
      this.selectionDataTwo.push(e[1].pop())
      this.$delete(this.selectionDataTwo, 1)
      // 判断是否选中 显示下级
      // this.$api.storageRoom.materialInfoLst(dataLts).then(res => {
      //   if (res) {
      // if (res.rows.length === 0) {
      if (this.selectionDataTwo[0] === undefined) {
        this.btnDisabledtheer = true // 三级新增
        this.btnDisabledtwodelete = true // 二级删除按钮
        this.tableDatatheer = []
        this.paginationtheer.total = 0
        return
      } else {
        this.btnDisabledtheer = false // 三级新增
        this.btnDisabledtwodelete = false // 二级删除按钮
        this.getDatatree()
        return
      }
      // } else {
      //   this.btnDisabledtheer = true // 三级新增
      //   this.btnDisabledtwodelete = false // 二级删除按钮
      //   this.tableDatatheer = []
      //   this.paginationtheer.total = 0
      //   return
      // }
      //   }
      // })
    }, 500),
    // 二级库删除
    handleDeletetwo() {
      this.$confirm('此操作将永久删除该数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.tableDatatheer.length > 0) {
          this.$message('该数据下有子数据，不能删除')
          return
        }
        this.$api.storageRoom.materialTypeInfoDelete(this.selectionDataTwo[0].typeId).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.$api.storageRoom.materialTypeInfoList({ materialTypeId: this.selectionData[0].materialTypeId }).then(res => {
              if (res) {
                this.tableDatatwo = res.rows
                this.paginationtwo.total = res.total
              }
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 二级库修改
    handleUpdatetwo(e) {
      this.form = {
        matTypeName: e.materialName,
        remark: e.remark,
        status: e.status,
        typeId: e.materialType,
        whouseId: e.whouseId,
        typeIds: e.typeId,
        materialType: e.materialType,
        supAttributeType: this.selectionData[0].materialTypeName
      }
      this.addedList = 22
      this.showDialog = true
    },
    /**
      * @author 李尚
      * @date 2022/9/6
      * @Description: 三级级list 库存
    */
    // 三级list数据
    getDatatree() {
      let typeIds = {
        typeId: this.selectionDataTwo[0].typeId
      }
      typeIds = Object.assign(typeIds, this.paginationtwo)
      this.$api.storageRoom.materialTypeList(typeIds).then(res => {
        if (res) {
          this.tableDatatheer = res.rows
          this.paginationtheer.total = res.total
        }
      })
    },
    // 三级list 删除/修改
    operateClictheer(e) {
      switch (e[0].lab) {
        case '删除':
          this.handleDeletetheer(e[1])
          break
        case '修改':
          this.handleUpdatetheer(e[1])
      }
    },
    // 二级删除
    handleDeletetheer(e) {
      this.$confirm('此操作将永久删除该数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.storageRoom.materialTypeEdlete(e.matTypeId).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.$api.storageRoom.materialTypeList({ typeId: this.selectionDataTwo[0].typeId }).then(res => {
              if (res) {
                this.tableDatatheer = res.rows
                this.paginationtheer.total = res.total
              }
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 三级修改
    handleUpdatetheer(e) {
      this.form = {
        matTypeId: e.matTypeId,
        matTypeName: e.matTypeName,
        remark: e.remark,
        status: e.status,
        typeId: e.materialType,
        typeids: e.typeId,
        whouseId: e.whouseId,
        supAttributeType: this.selectionDataTwo[0].materialName
      }
      this.addedList = 33
      this.showDialog = true
    },
    // 三级
    sizeChangetheer(e) {
      this.paginationtheer.pageSize = e[1]
      this.getDatatree()
    },
    currentChangetheer(e) {
      this.paginationtheer.pageNum = e[1]
      this.paginationtheer.currentPage = e[1]
      this.getDatatree()
    },
    // ------
    /**
      * @author 李尚
      * @date 2022/9/6
      * @Description: 新增按钮
    */
    submitForm() {

      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.addedList === 1) {
            var dataone = {
              materialTypeName: this.form.matTypeName,
              remark: this.form.remark,
              status: this.form.status,
              materialType: this.form.typeId,
              deptId: this.DataOne.deptId
            }
            this.submitLoding=true
            this.$api.storageRoom.materialTypeAdds(dataone).then(res => {
              if (res) {
                this.$message.success('添加成功')
                this.submitLoding=false
                this.empty()
                this.$api.storageRoom.materialTypeLsit(this.DataOne).then(res => {
                  if (res) {
                    this.tableDataone = res.rows
                    this.paginationOne.total = res.total
                  }
                })
              }
            })
          } else if (this.addedList === 2) { // 二级新增
            var data = {
              materialTypeId: this.selectionData[0].materialTypeId,
              remark: this.form.remark,
              materialName: this.form.matTypeName,
              status: this.form.status,
              materialType: this.form.typeId
            }
            this.submitLoding=true
            // 第二个表的添加
            this.$api.storageRoom.materialTypeInfoAdd(data).then(res => {
              if (res) {
                this.$message.success('添加成功')
                this.submitLoding=false

                this.empty()
                this.$api.storageRoom.materialTypeInfoList({ materialTypeId: this.selectionData[0].materialTypeId }).then(res => {
                  if (res) {
                    this.tableDatatwo = res.rows
                    this.paginationtwo.total = res.total
                  }
                })
              }
            })
          } else if (this.addedList === 3) { // 三级新增
            this.submitLoding=true
            // 第三个表的添加
            var datatree = {
              deptId: this.form.deptId,
              whouseId: this.selectionDataTwo[0].whouseId,
              remark: this.form.remark,
              matTypeName: this.form.matTypeName,
              status: this.form.status,
              materialType: this.form.typeId,
              typeId: this.selectionDataTwo[0].typeId
            }
            this.$api.storageRoom.materialTypeAdd(datatree).then(res => {
              if (res) {
                this.$message.success('添加成功')
                this.submitLoding=false
                this.empty()
              }
              this.getDatatree()
            })
          } else if (this.addedList === 11) {
            this.submitLoding=true
            const dataTone = {
              materialTypeId: this.form.matTypeId,
              materialTypeName: this.form.matTypeName,
              remark: this.form.remark,
              status: this.form.status,
              materialType: this.form.typeId,
              deptId: this.form.deptId
            }
            this.$api.storageRoom.materialTypePut(dataTone).then(res => {
              if (res) {
                this.getDataOne()
                this.empty()
                this.$message.success('修改成功')
                this.submitLoding=false
              }
            })
          } else if (this.addedList === 22) { // 二级修改
            this.submitLoding=true
            const dataTwo = {
              materialName: this.form.matTypeName,
              remark: this.form.remark,
              status: this.form.status,
              materialType: this.form.typeId,
              typeId: this.form.typeIds,
              whouseId: this.form.whouseId
            }
            this.$api.storageRoom.materialTypeInfoEdit(dataTwo).then(res => {
              if (res) {
                this.empty()
                this.$message.success('修改成功')
                this.submitLoding=false
                this.twomaterialTypeInfoList()
              }
            })
          } else if (this.addedList === 33) { // 三级修改
            this.submitLoding=true
            const datatr = {
              remark: this.form.remark,
              matTypeId: this.form.matTypeId,
              matTypeName: this.form.matTypeName,
              status: this.form.status,
              materialType: this.form.typeId,
              typeId: this.form.typeids,
              whouseId: this.form.whouseId
            }
            this.$api.storageRoom.materialTypeEdit(datatr).then(res => {
              if (res) {
                this.empty()
                this.$message.success('修改成功')
                this.submitLoding=false
                this.getDatatree()
              }
            })
          }
        }
      })
    },
    // 清空 关闭弹框
    empty() {
      this.showDialog = false
      this.form = {
        matTypeName: '',
        remark: '',
        status: '0',
        typeId: '',
        supAttributeType: ''
      }
    },
    // 二级新增
    twotype() {
      this.addedList = 2
      this.form.supAttributeType = this.selectionData[0].materialTypeName
      this.showDialog = true
    },
    // 三级新增
    treetype() {
      this.addedList = 3
      this.form.supAttributeType = this.selectionDataTwo[0].materialName
      this.showDialog = true
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.department-list {
  width: 250px;
  padding: 5px;
  box-sizing: border-box;

  .down-tree {
    height: 730px;
    display: block;
    overflow-y: scroll;
  }

  .el-tree {
    background-color: #f8f8f8;
  }
}
.dept-table{
  width: calc(100% - 0px);
  display: flex;
}
// 三个框
.one_list{
  width: 33%;
  height: 100%;
  margin-right: 20px;
}
.two_list{
  width: 32%;
  height: 100%;
  margin-right: 20px;
}
.theer_list{
  width: 32%;
  height: 100%;
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
