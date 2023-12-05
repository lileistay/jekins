<template>
  <!--  费用类型-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth" >
      <template v-slot:company>
        <div >
          <sg-table
            v-if="true"

            :hide-search-bar="true"
            :table-data="tableData"
            :pagination="pagination"
            :columns="columns"
            :operate="operate"
            @operateClick="operateClick"
            @size-change="sizeChange"
            @current-change="currentChange"
            @changeImg="changeImg"
            :hideSearchBar="hideSearchBar"
          >
            <div slot="searchBar" style="display: flex;align-items: center">
              <div style="display: inline-block;margin-right: 10px">
                <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
              </div>
              <el-input v-model="pagination.expenseTypeName" clearable class="header-search-item" style="width: 200px;" size="mini" placeholder="请输费用类型名称" />
              <el-button size="mini" type="primary" @click.stop="getData(true)"  @keydown.enter.native="getData(true)">搜索</el-button>
              <el-button size="mini" @click="resetFormSearch">重置</el-button>
            </div>
            <div slot="header">
              <el-button v-has-permi="['confinement:expenseTypeInfo:add']" size="mini" plain icon="el-icon-plus" :disabled="addBan" type="primary" @click.stop="handleAdd">新增</el-button>

            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
              </div>
              <div v-else-if="data.props === 'expenseTypeName'">
                <p>{{ data.custom.expenseTypeName }}</p>
              </div>
            </template>
          </sg-table>
          <sgDialog :title="dialogTitle" size="380px" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="productItemTypeInfo" :rules="rules" :model="productItemTypeInfo" size="mini" label-width="120px">
                <el-form-item label="费用类型:" prop="expenseTypeName">
                  <el-input v-model="productItemTypeInfo.expenseTypeName" placeholder="请输入费用类型" style="width: 145px;" />
                </el-form-item>
                <el-form-item label="产品状态" prop="status">
                  <el-radio-group v-model="productItemTypeInfo.status">
                    <el-radio
                      v-for="dict in dict.type.sys_normal_disable"
                      :key="dict.value"
                      :label="dict.value"
                    >{{ dict.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                  <el-button @click="handleClose">取消</el-button>
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
import sgTable from '@/components/Table/index'
import sgDialog from '@/components/Dialog/index'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
export default {
  dicts: ['sys_normal_disable'],
  components: {
    Tree,
    sgTable,
    sgDialog
  },
  data() {
    return {
      hideSearchBar:false,
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      deptName: undefined, // 公司搜索
      // 树
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addBan: true,
      submitLoading: false,
      // 加载
      loadingData: false,
      // 表格数据
      tableData: [],
      dialogTitle: undefined,
      showDialog: false,
      // 表单数据
      productItemTypeInfo: {
        expenseTypeName: '',
        status: '0'
      },
      rules: {
        expenseTypeName: [
          { required: true, message: '请输入费用类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择费用状态', trigger: 'blur' }
        ]
      },
      // 分页 搜索
      pagination: {
        show: true,
        expenseTypeName: '',
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      // 操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['confinement:expenseTypeInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['confinement:expenseTypeInfo:remove']
          }
        ]
      },
      expenTypeId: '',
      // 表格数据列
      columns: [
        {
          lab: '编号',
          val: 'expenseTypeId'
        },
        {
          lab: '费用类型名称',
          width: 130,
          val: 'expenseTypeName',
          custom: 'expenseTypeName'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '添加时间',
          val: 'createTime'
        }
      ],
      deptid:''
    }
  },
  // computed: {
  //   deptId: {
  //     get() {
  //       return this.$store.getters.departmentId
  //     },
  //     set(val) {
  //       val = this.$store.getters.departmentId
  //     }
  //   }
  // },
  created() {
    // this.getData()
    this.getTreeselect()
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
        this.deptid=id
        this.deptId=id
        this.getData()
      }


    },
    // 树形
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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
        this.deptid = data.id
        this.addBan = false
        this.getData()
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
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    // 添加
    handleAdd() {
      this.productItemTypeInfo = {
        expenseTypeName: '',
        status: '0'
      }
      this.showDialog = true
      this.$nextTick(() => {
        // this.resetFormSearch()
        this.dialogTitle = '新增费用类型名称'
      })
    },
    // 修改
    async handleUpdate(e) {
      this.expenTypeId = e.expenseTypeId
      await this.$api.product.expensetyinfo(this.expenTypeId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            // this.resetFormSearch()
            this.productItemTypeInfo = res.data
            this.dialogTitle = '修改费用类型名称'
          })
        }
      })
    },
    // 删除
    handleDelete(e) {
      this.$confirm('是否确认删除"' + e.expenseTypeName + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.product.expenseRemove(e.expenseTypeId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    // 关闭弹窗
    handleClose() {
      this.expenTypeId = ''
      this.showDialog = false
    },
    // 重置表单
    // resetForm(form) {
    //   if (form) {
    //     this.pagination = {
    //       pageNum: 1,
    //       pageSize: 20,
    //       show: true,
    //       total: 0,
    //       expenseTypeName: ''
    //     }
    //   } else {
    //     this.$refs.productItemTypeInfo.resetFields()
    //     this.productItemTypeInfo = {
    //       expenseTypeName: '',
    //       status: '0'
    //     }
    //   }
    // },
    resetFormSearch() {
      this.pagination.expenseTypeName = ''
      this.getData(true)
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
        if (this.deptId==undefined){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.loadingData = true
      var date = {
        expenseTypeName: this.pagination.expenseTypeName,
        deptId: this.deptId
      }
      date = Object.assign(date, this.pagination)
      this.$api.product.expenseList(date).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    // 提交表单
    submitForm() {
      this.$refs.productItemTypeInfo.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.expenTypeId === '') {
            this.$set(this.productItemTypeInfo, 'deptId', this.deptid)
            this.$api.product.expenseAdd(this.productItemTypeInfo).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.showDialog = false
                this.submitLoading = false
                this.getData()
              }
            })
          } else {
            this.$set(this.productItemTypeInfo, 'deptId', this.deptid)
            this.$api.product.expenseyedit(this.productItemTypeInfo).then(res => {
              if (res) {
                this.getData()
                this.productItemTypeInfo = {}
                this.expenseTypeId = ''
                this.submitLoading = false
                this.showDialog = false
              }
            })
          }
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
</style>
