<template>
  <!--  产品自定义类型-->
  <Tree  :showDefault="showDefault" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth" >
    <template v-slot:company>
      <div class="">
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
            <el-input v-model="pagination.productCustomTypeName" clearable class="header-search-item"
                      style="width: 200px;" size="mini" placeholder="请输入自定义产品名称"/>
            <el-button size="mini" type="primary" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
          </div>
          <div slot="header">
            <el-button v-has-permi="['confinement:productCustomTypeInfo:add']" size="mini" plain icon="el-icon-plus"
                       type="primary" :disabled="addBan" @click.stop="handleAdd">新增
            </el-button>

            <el-button size="mini" @click="resetFormSearch">重置</el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'status'">
              <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status"/>
            </div>
            <div v-else-if="data.props === 'productCustomTypeName'">
              <p>{{ data.custom.productCustomTypeName }}</p>
            </div>
          </template>
        </sg-table>
        <sgDialog :title="dialogTitle" size="380px" :dialog="showDialog" @handleClose="handleClose">
          <div slot="out">
            <el-form ref="productCustomTypeInfo" :rules="rules" :model="productCustomTypeInfo" size="mini"
                     label-width="100px">
              <el-form-item label="产品名称:" prop="productCustomTypeName">
                <el-input v-model="productCustomTypeInfo.productCustomTypeName" placeholder="请输入自定义产品名称"
                          style="width: 145px;"/>
              </el-form-item>
              <el-form-item label="产品状态" prop="status">
                <el-radio-group v-model="productCustomTypeInfo.status">
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
                <el-button @click="showDialog = false">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </sgDialog>
      </div>
    </template>

  </Tree>


</template>

<script>
import sgTable from '@/components/Table/index'
import sgDialog from '@/components/Dialog/index'
import Tree from '@/components/newTree/index'
export default {
  dicts: ['sys_normal_disable'],
  components: {
    sgTable,
    sgDialog,
    Tree
  },
  data() {
    return {
      hideSearchBar:false,
      trans:'rotate(-180deg)',
      emitWidth:"",
      showDefault:false,
      deptName: undefined, // 公司搜索
      submitLoading: false,
      // 树
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addBan: true,
      // 加载
      loadingData: false,
      // 表格数据
      tableData: [],
      dialogTitle: undefined,
      showDialog: false,
      // 表单数据
      productCustomTypeInfo: {
        productCustomTypeName: '',
        status: ''
      },
      deptid: 0,
      // 表单校验
      rules: {
        productCustomTypeName: [
          {required: true, message: '请输入产品单位名称', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择产品单位状态', trigger: 'blur'}
        ]
      },
      // 分页 搜索
      pagination: {
        show: true,
        productCustomTypeName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      producttomTypeId: '',
      // 操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['confinement:productCustomTypeInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['confinement:productCustomTypeInfo:remove']
          }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: '编号',
          val: 'productCustomTypeId'
        },
        {
          lab: '自定义产品名称',
          width: 130,
          val: 'productCustomTypeName',
          custom: 'productCustomTypeName'
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
      deptId:''
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
  watch: {
    deptId(val) {
      this.deptId = val
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      // this.getData(true)
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
/*      searchBar
      if (item.children!==undefined){

      }else {

      }*/
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      if (item.children !== undefined) {
        this.addBan = true
      } else {
        this.deptId=id
        this.deptid = id
        this.addBan = false
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
    handleNodeClick(id,data) {
      if ('children' in data) {
        this.addBan = true
      } else {
        this.deptid = data.id
        this.addBan = false
        this.getData()
      }
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
      this.productCustomTypeInfo = {}
      this.showDialog = true
      this.$nextTick(() => {
        this.resetForm()
        this.dialogTitle = '添加自定义名称'
      })
    },
    // 修改
    async handleUpdate(e) {
      this.producttomTypeId = e.productCustomTypeId
      await this.$api.product.productCustominfo(e.productCustomTypeId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            this.resetForm()
            this.productCustomTypeInfo = res.data
            this.dialogTitle = '修改自定义名称'
          })
        }
      })
      this.handleNodeClick()
    },
    // 删除
    handleDelete(e) {
      this.$confirm('是否确认删除"' + e.productCustomTypeName + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.product.productCustomRemove(e.productCustomTypeId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    // 重置表单
    resetForm() {
      if (this.productCustomTypeInfo) {
        this.pagination = {
          pageNum: 1,
          pageSize: 20,
          show: true,
          total: 0,
          productCustomTypeName: ''
        }
      } else {
        this.$refs.productCustomTypeInfo.resetFields()
        this.productCustomTypeInfo = {
          productCustomTypeName: '',
          status: '0'
        }
      }
    },
    resetFormSearch() {
      this.pagination.productCustomTypeName = ''
      this.getData(true)
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
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
      }
      this.loadingData = true
      var date = {
        productCustomTypeName: this.pagination.productCustomTypeName,
        deptId: this.deptId
      }
      date = Object.assign(date, this.pagination)
      this.$api.product.productCustomList(date).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    // 提交表单
    async submitForm() {
      await this.$refs.productCustomTypeInfo.validate(async valid => {
        if (valid) {
          if (this.producttomTypeId) {
            this.submitLoading = true
            this.$set(this.productCustomTypeInfo, 'deptId', this.deptid)
            await this.$api.product.productCustomedit(this.productCustomTypeInfo).then(res => {
              if (res) {
                this.getData()
                this.submitLoading = false
                this.productCustomTypeInfo = {}
                this.productCustomTypeId = ''
                this.showDialog = false
              }
            })
          } else {
            this.$set(this.productCustomTypeInfo, 'deptId', this.deptid)
            await this.$refs.productCustomTypeInfo.validate(async valid => {
              if (valid) {
                await this.$api.product.productCustomAdd(this.productCustomTypeInfo).then(res => {
                  if (res) {
                    this.submitLoading = false
                    this.$message.success(res.msg)
                    this.showDialog = false
                    this.getData()
                  }
                })
              }
            })
          }
        }
      })
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
    }
  }
}
</script>

<style scoped lang="scss">
.container {
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

.dept-table {
  width: calc(100% - 270px);
}
</style>
