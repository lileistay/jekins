<template>
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="">
          <sg-table
            v-if="true"

            selection
            size="mini"
            :table-data="tableData"
            :columns="columns"
            :operate="operate"
            hide-search-bar
            :pagination="pagination"
            @size-change="sizeChange"
            @current-change="currentChange"
            @operateClick="operateClick"
            @selection-change="handleSelectionChange"
            :hideSearchBar="hideSearchBar"
            @changeImg="changeImg"
          >
            <div slot="searchBar" style="display: flex;align-items: center">
              <div style="display: inline-block;margin-right: 10px;margin-top: 3px">
                <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
              </div>
              <el-select v-model="pagination.customerLabelTypeId" style="width: 200px;" size="mini" clearable filterable class="header-search-item" placeholder="请选择标签类型">
                <el-option
                  v-for="item in deptTypeData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button icon="el-icon-search" size="mini" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
              <el-button size="mini" @click="resetFormSearch">重置</el-button>
            </div>
            <div slot="header">
              <el-button v-has-permi="['share:customerLabelTypeRelation:add']" :disabled="addBan" size="mini" plain type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
              <el-button v-has-permi="['share:customerLabelTypeRelation:remove']" size="mini" plain :disabled="ids.length<=0" type="danger" icon="el-icon-delete" @click="handleDelete">批量删除</el-button>

            </div>
          </sg-table>
          <sgDialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="80px">
                <el-form-item label="归属公司" prop="deptId">
                  <treeselect v-model="form.deptId" disabled :options="deptOptions" :show-count="true" placeholder="请选择归属公司" />
                </el-form-item>
                <el-form-item label="选择标签" prop="type">
                  <el-cascader
                    v-model="form.type"
                    class="full-width"
                    :disabled="selectBoxDisabled"
                    :options="typeData"
                    :props="props"
                    collapse-tags
                    clearable
                    size="mini"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                  <el-button @click="showDialog = false">取消</el-button>
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
import Treeselect from '@riophae/vue-treeselect'
import sgDialog from '@/components/Dialog'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Tree from '@/components/newTree/index'
export default {
  name: 'DeptLabel',
  components: {
    sgTable,
    Treeselect,
    sgDialog,
    Tree
  },
  data() {
    var validateType = (rule, value, callback) => {
      if (this.form.type === undefined || this.form.type.length <= 0) {
        callback(new Error('请选择标签'))
      }
      callback()
    }
    return {
      deptName: undefined,
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ids: [],
      submitLoading: false,
      selectBoxDisabled: false,
      // 类型标签数据
      typeData: [],
      props: { multiple: true },

      dialogTitle: undefined,
      showDialog: false,
      deptTypeData: [],
      // 分页 搜索
      pagination: {
        show: true,
        deptId: undefined,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      showDataDialog: false,
      tableData: [],
      // 表单数据
      form: {},
      rules: {
        type: [
          { validator: validateType, trigger: 'blur' }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: '标签编号',
          val: 'labelDataId'
        },
        {
          lab: '标签名称',
          val: 'labelDataName'
        },
        {
          lab: '类型',
          val: 'labelTypeName'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:customerLabelTypeRelation:remove']
          }
          // {
          //   lab: '修改',
          //   type: 'warning',
          //   permi: ['share:customerLabelTypeRelation:edit']
          // }
        ]
      },
      addBan:true,
      hideSearchBar:false
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
    this.getType()
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

      this.handleNodeClick(id,item)
    },
    // 多选
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.labelTypeRelationId)
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    // 添加
    handleAdd() {
      this.tableData.forEach((item) => {
        this.typeData.forEach((citem) => {
          citem.children.forEach((pitem) => {
            if (item.labelDataId === pitem.labelDataId) {
              pitem.disabled = true
            }
          })
        })
      })
      this.showDialog = true
      this.form.type = undefined
      this.dialogTitle = '添加公司标签'
      this.form.deptId = this.pagination.deptId
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
    // 节点点击事件
    handleNodeClick(data,item) {

      if (item.children!==undefined){
        this.addBan = true
      }else {
        this.pagination.deptId = data
        this.addBan = false
        this.getData()
      }
      // if (this.pagination.deptId !== data.id) {
      //   this.pagination.deptId = data.id
      //   if (data.children==undefined){
      //     this.getData()
      //   }
      // }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '删除':
          this.handleDelete(e[1])
          break
        // case '修改':
        //   this.handlecompile(e[1])
      }
    },
    // handlecompile(e) {
    //   this.showDialog = true
    // },
    // 删除操作
    handleDelete(e) {
      const labelTypeRelationId = e.labelTypeRelationId || this.ids
      this.$confirm('是否确认删除编号为' + labelTypeRelationId + '的数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.custLabel.custDeptLabelOperate({}, 'delete', labelTypeRelationId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    // 重置表单
    resetForm(form) {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
        this.form = {
          deptId: undefined,
          type: undefined
        }
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            deptId: this.form.deptId,
            customerLabelTypeRelations: []
          }
          this.form.type.forEach(item => {
            const obj = {
              customerLabelTypeId: item[0],
              labelDataId: item[1]
            }
            data.customerLabelTypeRelations.push(obj)
          })
          this.submitLoading = true
          this.$api.modules.custLabel.custDeptLabelOperate(data, 'post').then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialog = false
              this.getData()
            }
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.pagination.deptId = res.data[0].id
          this.deptOptions = res.data
          this.getData()
        }
      })
    },
    resetFormSearch() {
      this.pagination.customerLabelTypeId = undefined
      this.getData()
    },
    // 获取数据
    getData(isSearch) {
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
      this.showDataDialog = true
      this.$api.modules.custLabel.custDeptLabelTypeList(this.pagination).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    getType() {
      this.$api.modules.custLabel.custLabelTypeList({ status: '0' }).then(res => {
        if (res) {
          this.deptTypeData = res.rows
          this.$api.modules.custLabel.custLabelData({ status: '0' }).then(sres => {
            if (sres) {
              res.rows.forEach(item => {
                item.children = []
                item.value = item.customerLabelTypeId
                item.label = item.labelTypeName
                sres.rows.forEach(citem => {
                  if (item.customerLabelTypeId === citem.customerLabelTypeId) {
                    citem.value = citem.labelDataId
                    citem.label = citem.labelDataName
                    item.children.push(citem)
                  }
                })
              })
              this.typeData = res.rows
            }
          })
        }
      })
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
