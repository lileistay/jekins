<template>
  <!--  楼层-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="container">
          <div class="floor-table">
            <sg-table
              ref="table"
              :sg-ref="'multipleTable'"
              selection
              size="mini"
              :table-data="tableData"
              :columns="columns"
              :operate="operate"
              :pagination="pagination"
              @operateClick="operateClick"
              @size-change="sizeChange"
              @current-change="currentChange"
              @row-click="rowClick"
              @selection-change="handleSelectionChange"
              @changeImg="changeImg"
              :hideSearchBar="hideSearchBar"
            >
              <!--     删除    row-key="roleId" -->
              <div slot="searchBar" style="display: flex;align-items: center">
                <div style="display: inline-block;margin-right: 10px;margin-top: -13px">
                  <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
                </div>
                <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message=false>
                  <el-form-item label="楼层名称" prop="roleName">
                    <el-input v-model="searchBar.floorNumber" clearable placeholder="楼层名称" />
                  </el-form-item>
                  <el-form-item label="状态" prop="state">
                    <el-select v-model="searchBar.state" clearable filterable placeholder="状态">
                      <el-option label="正常" value="0" />
                      <el-option label="停用" value="1" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div slot="header">
                <el-button v-has-permi="['share:floorInfo:add']" size="mini" plain icon="el-icon-plus" type="primary" :disabled="btnDisabled" @click.stop="handleAdd">新增</el-button>
                <el-button v-has-permi="['share:floorInfo:remove']" size="mini" plain icon="el-icon-delete" type="danger" @click.stop="handleDelete">删除</el-button>
              </div>
              <template #custom="data">
                <div v-if="data.props === 'state'">
                  <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.state" />
                </div>
              </template>
            </sg-table>
          </div>
          <sg-dialog :title="dialogTitle" :dialog="showDialog" size="400px" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="sg-dialog-form" :model="form" :rules="rules" label-width="80px" size="mini">
                <el-form-item label="归属公司" prop="deptId">
                  <treeselect v-model="form.deptId" disabled :options="deptOptions" :show-count="true" placeholder="请选择归属公司" />
                </el-form-item>
                <el-form-item label="楼层名称" prop="floorNumber">
                  <el-input v-model="form.floorNumber" clearable placeholder="请输入楼层名称" />
                </el-form-item>
                <el-form-item label="状态" prop="state">
                  <el-radio-group v-model="form.state">
                    <el-radio label="0">正常</el-radio>
                    <el-radio label="1">停用</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="form.remark" type="textarea" clearable placeholder="请输入备注" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loadingSubmit" @click.stop="submitForm">确定</el-button>
                  <el-button @click="handleClose">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </sg-dialog>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgDialog from '@/components/Dialog/index'
import sgTable from '@/components/Table'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
export default {
  name: 'ConfinementRoomManagement',
  dicts: ['sys_normal_disable'],
  components: {
    sgTable,
    sgDialog,
    Treeselect,
    Tree
  },
  data() {
    return {
      deptName: '',
      deptOptions: [],
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogTitle: '',
      showDialog: false,
      form: {
        deptId: 0,
        floorNumber: '',
        state: '0',
        remark: ''
      },
      rules: {
        floorNumber: [
          { required: true, message: '请输入楼层名称', trigger: 'blur' }
        ]
      },
      loadingSubmit: false,
      loadingData: false,
      tableData: [],
      searchBar: {
        floorNumber: '',
        state: '0'
      },
      columns: [
        {
          lab: '编号',
          val: 'floorId'
        },
        {
          lab: '楼层名称',
          val: 'floorNumber'
        },
        {
          lab: '状态',
          val: 'state',
          custom: 'state',
          width: 80
        },
        {
          lab: '备注',
          val: 'remark'
        },
        {
          lab: '创建人',
          val: 'createBy'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ],
      pagination: {
        deptId: 0,
        show: true,
        total: 0,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      operate: {
        name: '操作',
        width: '140',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:floorInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:floorInfo:remove']
          }
        ]
      },
      btnDisabled: true,
      hideSearchBar:false
    }
  },
  created() {
    this.getTreeSelect()
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
        this.btnDisabled = true
      }else {
        this.pagination.deptId=id
        this.btnDisabled = false
        this.getData()
      }

    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 获取数据
     */
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        if (this.pagination.deptId==1){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.loadingData = true
      this.$api.confinementRoom.floorInfoList(isSearch ? { ...this.searchBar, ...this.pagination } : this.pagination).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 操作
     */
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 新增
     */
    handleAdd() {
      this.$nextTick(() => {
        this.dialogTitle = '添加楼层'
      })
      this.form.deptId = this.pagination.deptId
      this.showDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 修改
     */
    handleUpdate(e) {
      this.$nextTick(() => {
        this.dialogTitle = '修改楼层'
      })
      this.form.deptId = e.deptId
      this.form.floorNumber = e.floorNumber
      this.form.floorId = e.floorId
      this.form.remark = e.remark
      this.form.state = e.state
      this.showDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 删除
     */
    handleDelete(e) {
      const floorId = e.floorId || this.selectionData[0].floorId
      this.$confirm('是否确认删除此楼层？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.confinementRoom.removefloorInfo(floorId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 关闭
     */
    handleClose() {
      this.showDialog = false
      this.resetForm()
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 重置表单
    */
    resetForm() {
      this.form = {
        floorId: '',
        floorNumber: '',
        remark: '',
        state: '0'
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 提交
     */
    submitForm() {
      this.$refs['sg-dialog-form'].validate(valid => {
        if (valid) {
          if (this.form.floorId === undefined || this.form.floorId === '') {
            this.loadingSubmit = true
            this.$api.confinementRoom.addfloorInfo(this.form).then(res => {
              if (res) {
                this.showDialog = false
                this.getData()
                this.$message.success(res.msg)
                this.resetForm()
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          } else {
            this.loadingSubmit = true
            this.$api.confinementRoom.editfloorInfo(this.form).then(res => {
              if (res) {
                this.showDialog = false
                this.getData()
                this.$message.success(res.msg)
                this.resetForm()
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 获取公司树
     */
    getTreeSelect() {
      this.$api.dept.deptTree().then(res => {
        if (res) {
          this.pagination.deptId = res.data[0].id
          this.deptOptions = res.data
          this.getData()
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 筛选节点
     */
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 节点点击
     */
    handleNodeClick(data) {
      if (data.children === undefined) {
        this.btnDisabled = false
        if (this.pagination.deptId !== data.id) {
          this.pagination.deptId = data.id
          this.getData()
        }
      } else {
        this.btnDisabled = true
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 分页
     */
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
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
.floor-list {
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
.floor-table {
  width: calc(100% - 0px);
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
