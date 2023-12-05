<template>
  <!--  赠送服务 -->
  <div class="container">
    <div class="department-list">
      <el-input v-model="deptName" size="small" placeholder="请输入公司名称" />
      <div class="down-tree">
        <el-tree
          ref="tree"
          class="el-tree"
          default-expand-all
          :filter-node-method="filterNode"
          :data="deptOptions"
          :props="defaultProps"
          highlight-current
          :expand-on-click-node=false
          @node-click="handleNodeClick"
        />
      </div>
    </div>
    <div class="dept-table">
      <sg-table
        ref="table"
        
        size="mini"
        border
        stripe
        index="序号"
        highlight-current-row
        :table-data="tableData"
        :columns="columns"
        :pagination="pagination"
        :operate="operate"
        @operateClick="operateClick"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <div slot="searchBar">
          <el-button size="mini" plain type="primary" icon="el-icon-plus" :disabled="addBan" @click="handleAdd">添加</el-button>&nbsp;
          <span style="font-size: 13px">赠送服务:</span>&nbsp;<el-input v-model="search.equipmentName" size="mini" style="width: 120px;" clearable />&nbsp;
          <span style="font-size: 13px">是否显示:</span>&nbsp;
          <el-select v-model="search.status" placeholder="请选择" size="mini" style="width: 120px;" clearable filterable>
            <el-option
              v-for="dict in dict.type.whether"
              :key="dict.value"
              :value="dict.value"
              :label="dict.label"
            />
          </el-select>&nbsp;
          <el-button size="mini" type="primary" @click="getData">搜索</el-button>
          <el-button size="mini" type="warning" @click="reset">重置</el-button>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'status'">
            <dict-tag :options="dict.type.whether" :value="data.custom.status" />
          </div>
        </template>
      </sg-table>
      <!--添加修改弹框-->
      <sgDialog :title="dialogTitle" size="400px" :dialog="showDialog" @handleClose="handleClose">
        <div slot="out">
          <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="18">
                <el-form-item label="赠送服务:" prop="equipmentName">
                  <el-input v-model="form.equipmentName" />
                </el-form-item>
                <el-form-item label="是否显示:" prop="status">
                  <el-select v-model="form.status" placeholder="请选择" filterable>
                    <el-option
                      v-for="dict in dict.type.whether"
                      :key="dict.value"
                      :value="dict.value"
                      :label="dict.label"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                  <el-input v-model="form.remark" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
              <el-button @click="showDialogs">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
    </div>
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  dicts: ['whether'],
  name: 'ComplimentaryService',
  components: {
    sgTable,
    sgDialog
  },
  data() {
    return {
      loadingData: false,
      deptName: undefined, // 公司搜索
      search: {
        equipmentName: '',
        status: '',
        deptId: ''
      },
      // 弹框
      form: {
        equipmentName: '',
        status: '',
        deptId: ''
      },
      TriageDepartment: [], // 科室
      addBan: true,
      single: true,
      rules: {
        equipmentName: [{ required: true, message: '请输入', trigger: 'blur' }],
        status: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      // 树
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ids: [], // 删除是否有选中的
      submitLoading: false,
      dialogTitle: '新增',
      showDialog: false,
      // 分页 搜索
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      tableData: [],
      // 表格数据列
      columns: [
        {
          lab: '赠送服务',
          val: 'equipmentName'
        },
        {
          lab: '创建日期',
          val: 'createTime'
        },
        {
          lab: '备注',
          val: 'remark'
        },
        {
          lab: '是否显示',
          val: 'status',
          custom: 'status'
        }
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning'
          },
          {
            lab: '删除',
            type: 'danger'
          }
        ]
      }
    }
  },
  watch: {
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
  },
  methods: {
    // 获取数据
    getData: debounce(function() {
      this.loadingData = true
      this.$api.medical.deviceManagementlist(this.search).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    // 重置
    reset() {
      this.search = {
        equipmentName: '',
        remark: '',
        departmentId: '',
        status: ''
      }
      this.getData()
    },
    // 树 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handlecompile(e[1])
          break
        case '删除':
          this.handledcopy(e[1])
      }
    },
    // 表单 添加
    handleAdd() {
      this.showDialog = true
      this.dialogTitle = '新增'
    },
    // 删除操作
    handledcopy(e) {
      this.$confirm('此操作将永久此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let deviceIds = e.deviceId
        this.$api.medical.removedeviceManagement(e.deviceId).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改
    handlecompile(e) {
      this.dialogTitle = '修改'
      this.showDialog = true
      this.handleNodeClick()
      this.$api.medical.getinfodeviceManagement(e.deviceId).then(res => {
        if (res) {
          this.form = res.data
        }
      })
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增') {
            this.$api.medical.adddeviceManagement(this.form).then(res => {
              if (res) {
                this.$message.success('添加成功')
                this.getData()
                this.showDialog = false
                this.form = {
                  equipmentName: '',
                  remark: '',
                  departmentId: '',
                  status: ''
                }
              }
            })
          } else {
            this.$api.medical.putdeviceManagement(this.form).then(res => {
              if (res) {
                this.$message.success('添加成功')
                this.getData()
                this.showDialog = false
                this.form = {
                  equipmentName: '',
                  remark: '',
                  departmentId: '',
                  status: ''
                }
              }
            })
          }
        }
      })
    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.pagination.deptId = res.data[0].id
          this.deptOptions = res.data
        }
      })
    },
    // 节点点击事件
    handleNodeClick(data) {
      if ('children' in data) {
        this.addBan = true
      } else {
        this.form.deptId = data.id
        this.search.deptId = data.id
        this.addBan = false
        this.$api.dept.DepartmentList({ deptId: data.id, status: '0', isDepartment: '1' }, 'get').then((res) => {
          if (res) {
            this.TriageDepartment = res.rows
          }
        })
        this.getData()
      }
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
      this.form = {
        equipmentName: '',
        remark: '',
        departmentId: '',
        status: ''
      }
    },
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.getData()
    },
    // 弹框取消按钮
    showDialogs() {
      this.showDialog = false
      this.form = {
        equipmentName: '',
        remark: '',
        departmentId: '',
        status: ''
      }
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
  width: calc(100% - 270px);
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
