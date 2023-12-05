<template>
  <!--  仪器管理-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div >
          <sg-table
            ref="table"
            size="mini"
            :border="true"
            :stripe="true"
            index="序号"
            :highlight-current-row="true"
            :table-data="tableData"
            :columns="columns"
            :pagination="pagination"
            :operate="operate"
            @operateClick="operateClick"
            @size-change="sizeChange"
            @current-change="currentChange"
            :hideSearchBar="hideSearchBar"
            @changeImg="changeImg"
          >
            <div slot="searchBar" class="searchBar">
              <div style="display: flex;align-items: center">
                <div style="display: inline-block;margin-right: 10px">
                  <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
                </div>
                <span style="font-size: 13px">仪器名称:</span>&nbsp;<el-input v-model="search.equipmentName" size="mini" style="width: 120px;" :clearable="true" />&nbsp;
                <span style="font-size: 13px">仪器描述:</span>&nbsp;<el-input v-model="search.remark" size="mini" style="width: 120px;" :clearable="true" />&nbsp;
                <span style="font-size: 13px">科室:</span>&nbsp;
                <el-select v-model="search.departmentId" placeholder="请选择" size="mini" style="width: 120px;" :filterable="true" :clearable="true">
                  <el-option
                    v-for="item in TriageDepartment"
                    :key="item.departmentId"
                    :label="item.departmentName"
                    :value="item.departmentId"
                  />
                </el-select>&nbsp;
                <span style="font-size: 13px">状态:</span>&nbsp;
                <el-select v-model="search.status" placeholder="请选择" size="mini" style="width: 120px;" filterable :clearable="true">
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :value="dict.value"
                    :label="dict.label"
                  />
                </el-select>&nbsp;
              </div>
              <div>
                <el-button icon="el-icon-search" size="mini" type="primary"  @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
                <el-button size="mini" type="warning" @click="reset">重置</el-button>
              </div>
            </div>
            <div slot="header">
              <el-button v-has-permi="['share:departmentInfo:add']" size="mini" :plain="true" type="primary" icon="el-icon-plus" :disabled="addBan" @click="handleAdd">添加</el-button>&nbsp;
            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
              </div>
            </template>
          </sg-table>
          <!--添加修改弹框-->
          <sgDialog :title="dialogTitle" size="400px" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="100px">
                <el-row>
                  <el-col :span="18">
                    <el-form-item label="仪器名称:" prop="equipmentName">
                      <el-input v-model="form.equipmentName" />
                    </el-form-item>
                    <el-form-item label="仪器描述:" prop="remark">
                      <el-input v-model="form.remark" />
                    </el-form-item>
                    <el-form-item label="科室:" prop="departmentId">
                      <el-select v-model="form.departmentId" :filterable="true" placeholder="请选择科室">
                        <el-option
                          v-for="item in TriageDepartment"
                          :key="item.departmentId"
                          :label="item.departmentName"
                          :value="item.departmentId"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="状态:" prop="status">
                      <el-select v-model="form.status" filterable placeholder="请选择">
                        <el-option
                          v-for="dict in dict.type.sys_normal_disable"
                          :key="dict.value"
                          :value="dict.value"
                          :label="dict.label"
                        />
                      </el-select>
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
      </template>

    </Tree>
  </div>

</template>

<script>
import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
export default {
  dicts: ['sys_normal_disable'],
  name: 'DeptChannel',
  components: {
    sgTable,
    sgDialog,
    Tree
  },
  data() {
    return {
      hideSearchBar:false,
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      loadingData: false,
      deptName: undefined, // 公司搜索
      search: {
        equipmentName: undefined,
        departmentId: undefined,
        status: '0',
        deptId: undefined
      },
      // 弹框
      form: {
        equipmentName: '',
        remark: '',
        departmentId: '',
        status: '',
        deptId: ''
      },
      TriageDepartment: [], // 科室
      addBan: true,
      rules: {
        equipmentName: [{ required: true, message: '请输入', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择', trigger: 'blur' }],
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
        show: true,
        currentPage: 1
      },
      tableData: [],
      // 表格数据列
      columns: [
        {
          lab: '名称',
          val: 'equipmentName'
        },
        {
          lab: '描述',
          val: 'remark'
        },
        {
          lab: '创建日期',
          val: 'createTime'
        },
        {
          lab: '科室',
          val: 'departmentName'
        },
        {
          lab: '状态',
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
            type: 'warning',
            permi: ['share:departmentInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:departmentInfo:delete']
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
    // this.getData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    fold(){
      if(this.trans=='rotate(-180deg)'){
        this.trans='rotate(0deg)'
        this.emitWidth='0px';
      }else{
        this.trans='rotate(-180deg)'
        this.emitWidth='250px';
      }

    },
    changeImg(e){
      this.hideSearchBar=!e
    },
    changeCompay(id,item){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      if (item.children!==undefined){
        this.addBan = true
      }else {
        this.addBan = false
      // this.$store.dispatch('department', { departmentId: id })
      this.search.deptId=id
      this.form.deptId = id

      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const datas = {
        deptId: id,
        status: '0',
        isDepartment: '1'
      }
      this.$api.dept.DepartmentList(datas, 'get').then((res) => {
        if (res) {
          this.TriageDepartment = res.rows
        }
      })
      this.getData()
      }
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        if (this.search.deptId==undefined){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.loadingData = true
      this.$api.medical.deviceManagementlist({ ...this.search, ...this.pagination }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    reset() {
      this.search = {
        equipmentName: '',
        remark: '',
        departmentId: '',
        status: ''
      }
      this.getData()
    },
    // 筛选节点
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
    // 添加
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
      this.form = e
      this.handleNodeClick()
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
        /**
         * @author 李尚
         * @date 2022/6/18
         * @Description: 添加状态
         */
        const datas = {
          deptId: data.id,
          status: '0',
          isDepartment: '1'
        }
        this.$api.dept.DepartmentList(datas, 'get').then((res) => {
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
      this.pagination.currentPage = e[1]
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
.searchBar{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
