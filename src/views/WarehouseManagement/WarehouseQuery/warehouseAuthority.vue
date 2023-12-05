<template>
  <!-- 库房权限 -->
  <div class="box">
    <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      size="mini"
      index="序号"
      :border="true"
      :pagination="pagination"
      :selection="true"
      :highlight-current-row="true"
      :table-data="tableData"
      :columns="columns"
      :operate="operate"
      :header-style="{backgroundColor:'#1abc9c'}"
      @operateClick="operateClick"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <!--搜索框 -->
      <div slot="searchBar" class="searchBar" style="padding-top: 8px">
        <div>
          <el-form :inline="true" :model="searchForm" size="mini">
            <el-form-item label="员工姓名:">
              <el-select
                v-model="searchForm.userId"
                placeholder="请选择员工"
                style="width: 200px" filterable
                :clearable="true"
                :filterable="true"
              >
                <el-option
                  v-for="item in sysUserList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出库库房:">
              <el-select
                v-model="searchForm.outWarehouseId"
                placeholder="请选择"
                style="width: 200px" filterable
                :clearable="true"
                :filterable="true"
              >
                <el-option
                  v-for="item in warehouse"
                  :key="item.whouseId"
                  :label="item.whouseName"
                  :value="item.whouseId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="入库库房:">
              <el-select
                v-model="searchForm.inWarehouseId"
                placeholder="请选择"
                style="width: 200px" filterable
                :clearable="true"
                :filterable="true"
              >
                <el-option
                  v-for="item in warehouse"
                  :key="item.whouseId"
                  :label="item.whouseName"
                  :value="item.whouseId"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-top: -10px">
          <el-button
            icon="el-icon-search"
            size="mini"
            type="primary"
            :plain="true"
            @click.stop.native="getData"
            @keydown.enter.native="getData"
          >查询
          </el-button>
        </div>
      </div>
      <!-- 按钮 -->
      <div slot="header" class="searchBar">
        <div>权限列表</div>
        <div style="float: right">
          <el-button
            v-hasPermi="['sorage:warehouseAuthority:remove']"
            :disabled="selectionData.length===0"
            size="mini"
            :plain="true"
            type="danger"
            style="float: right;margin-left: 10px"
            icon="el-icon-close"
            @click="getDelete"
          >删除
          </el-button>
          <el-button
            v-hasPermi="['sorage:warehouseAuthority:add']"
            size="mini"
            :plain="true"
            type="primary"
            style="float: right;margin-left: 10px"
            icon="el-icon-plus"
            @click="getOther"
          >新增
          </el-button>
        </div>
      </div>
    </sg-table>
    <!-- 弹框 -->
    <sgDialog :title="title" size="400px" :dialog="showDialog" @handleClose="showdialog">
      <div slot="out">
        <el-form ref="addForm" :rules="addRules" label-width="100px" :model="addForm" size="mini">
          <el-form-item label="员工姓名：" prop="userId">
            <el-select
              v-model="addForm.userId"
              placeholder="请选择员工"
              style="width: 100%" filterable
              :clearable="true"
              :filterable="true"
            >
              <el-option
                v-for="item in sysUserList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="出库库房：" prop="outWarehouseId">
            <el-select
              v-model="addForm.outWarehouseId"
              placeholder="请选择"
              style="width: 100%" filterable
              :clearable="true"
              :filterable="true"
            >
              <el-option
                v-for="item in warehouse"
                :key="item.whouseId"
                :label="item.whouseName"
                :value="item.whouseId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入库库房：" prop="inWarehouseId">
            <el-select
              v-model="addForm.inWarehouseId"
              placeholder="请选择"
              style="width: 100%" filterable
              :clearable="true"
              :filterable="true"
            >
              <el-option
                v-for="item in warehouse"
                :key="item.whouseId"
                :label="item.whouseName"
                :value="item.whouseId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="addForm.remarks" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitLoding" @click="submitForm">确认</el-button>
            <el-button @click="closeForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import { debounce } from '@/utils/throttleAndDebounce'

export default {
  components: { SgTable, sgDialog },
  data() {
    return {
      submitLoding:false,
      title: '新增',
      showDataDialog: false,
      // 库房列表
      warehouse: [],
      selectionData: [], // 选择的数据
      // 搜索框
      searchForm: {
        userId: null, // 员工
        inWarehouseId: null, // 入库库房id
        outWarehouseId: null // 出库库房id
      },
      // 添加框几校验规则
      addForm: {
        id: null, // 主键id，有就是修改没有就是新增
        userId: null, // 员工
        inWarehouseId: null, // 入库库房id
        outWarehouseId: null // 出库库房id
      },
      addRules: {
        userId: [{ required: true, message: '请选择员工', trigger: 'blur' }],
        inWarehouseId: [{ required: true, message: '请选择入库库房', trigger: 'blur' }],
        outWarehouseId: [{ required: true, message: '请选择出库库房', trigger: 'blur' }]
      },
      // 表数据
      tableData: [],
      // 表头
      columns: [
        {
          lab: '员工姓名',
          val: 'userNikeName'
        },
        {
          lab: '出库库房',
          val: 'outWarehouseName'
        },
        {
          lab: '入库库房',
          val: 'inWarehouseName'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        },
        {
          lab: '创建人',
          val: 'createBy'
        },
        {
          lab: '备注',
          val: 'remarks'
        }
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['sorage:warehouseAuthority:edit']
          }
        ]
      },
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      showDialog: false,
      form: {
        payName: '',
        borrowType: ''
      },
      sysUserList: []
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
      this.getWarehouse()
      this.getUserList()
      this.getData()
    }
  },
  created() {
    this.getWarehouse()
    this.getUserList()
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
    // 获取本公司的员工
    getUserList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          this.sysUserList = this.unique(res.data)
        }
      })
    },
    // 去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    // 获取本公司的库房列表
    getWarehouse() {
      var data = {
        deptId: this.deptId
      }
      this.$api.storageRoom.wpartmentList(data).then(res => {
        if (res) {
          this.warehouse = res.rows
        }
      })
    },
    // 搜索
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.searchForm.deptId = this.deptId
      const data = Object.assign(this.searchForm, this.pagination)
      this.$api.storageRoom.selectWarehouseAuthority(data).then(res => {
        this.tableData = res.rows
        this.pagination.total = res.total
      })
    }),
    // 修改列表
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleEdit(e[1])
          break
      }
    },
    // 删除
    getDelete() {
      // 判断选择的条数
      if (this.selectionData.length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      const ids = this.selectionData.flatMap(item => [item.id])
      this.$api.storageRoom.removeWarehouseAuthority(ids).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getData(true)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 新增
    getOther() {
      this.showDialog = true
    },
    // 修改
    handleEdit(e) {
      this.addForm = e
      this.showDialog = true
    },
    // 弹框保存
    submitForm() {

      this.$refs.addForm.validate((valid) => {
        if (valid) {
          // 如果传递了id 就是修改
          if (this.addForm.id) {
            this.submitLoding=true
            this.$api.storageRoom.editWarehouseAuthority(this.addForm).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.getData(true)
                this.submitLoding=false
                this.closeForm()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.submitLoding=true
            this.$api.storageRoom.addWarehouseAuthority(this.addForm).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.submitLoding=false
                this.getData(true)
                this.closeForm()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    closeForm() {
      this.addForm = {}
      this.showDialog = false
    },
    showdialog() {
      this.showDialog = false
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.getData() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    // 行内点击选中
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    }
  }
}
</script>

<style lang='scss' scoped>
.box {
  padding: 0 10px;

  .searchBar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}
</style>
