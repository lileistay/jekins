<template>
<!--  企业微信员工-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay">
      <template v-slot:company>
        <div class="dept-table">
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
          >
            <div slot="header">
              <el-button v-has-permi="['share:channelDeptTypeRelation:add']" size="mini" plain type="primary" icon="el-icon-plus" @click="handleAdd" :disabled="addBan">添加</el-button>
              <!--          <el-button v-has-permi="['share:channelDeptTypeRelation:remove']" size="mini" plain :dept-channel="ids.length<=0" type="danger" icon="el-icon-delete" @click="handleDelete">批量删除</el-button>-->
              <el-select v-model="pagination.typeId" style="width: 200px;" size="mini" clearable filterable class="header-search-item" placeholder="请选择激活状态">
                <el-option
                  v-for="item in dict.type.activation_status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!--          <el-input v-model="pagination.searchValue" clearable size="mini" class="header-search-item" style="width: 200px;" placeholder="请输入要搜索的渠道名称" />-->
              <el-button icon="el-icon-search" size="mini" type="primary" @click="getData(true)">搜索</el-button>
              <el-button size="mini" @click="resetFormSearch">重置</el-button>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <dict-tag :options="dict.type.activation_status" :value="data.custom.status" />
              </div>
            </template>
          </sg-table>
          <sgDialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="80px">
                <el-form-item label="归属公司" prop="deptId">
                  <treeselect v-model="form.deptId" disabled :options="deptOptions" :show-count="true" placeholder="请选择归属公司" />
                </el-form-item>
                <el-form-item label="选择渠道" prop="type">
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
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
export default {
  dicts: ['activation_status'],
  name: 'templete',
  components: {
    sgTable,
    Tree,
    Treeselect,
    sgDialog
  },
  data() {
    var validateType = (rule, value, callback) => {
      if (this.form.type === undefined || this.form.type.length <= 0) {
        callback(new Error('请选择渠道'))
      }
      callback()
    }
    return {
      deptName: undefined,
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ids: [],
      submitLoading: false,
      selectBoxDisabled: false,
      // 类型渠道数据
      typeData: [],
      props: { multiple: true },

      dialogTitle: undefined,
      showDialog: false,
      deptTypeData: [],
      // 分页 搜索
      pagination: {
        show: true,
        deptId: undefined,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      showDataDialog: false,
      tableData: [],
      // 表单数据
      form: {
        deptId: ''
      },
      rules: {
        type: [
          { validator: validateType, trigger: 'blur' }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: 'wechatUserId',
          val: 'wechatUserId'
        },
        {
          lab: '用户名称',
          val: 'name'
        },
        {
          lab: '激活状态',
          val: 'status',
          custom:'status'
        },
        {
          lab: '别名',
          val: 'alias'
        },

      ],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:channelDeptTypeRelation:remove']
          }
          // {
          //   lab: '修改',
          //   type: 'warning',
          //   permi: ['share:channelDeptTypeRelation:edit']
          // }
        ]
      },
      addBan:true
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
  },
  methods: {
    changeCompay(id,item){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      if (item.children!==undefined){
        this.addBan = true
      }else {
        this.addBan = false
        this.pagination.deptId = id
        this.getData()
      }
      // this.$store.dispatch('department', { departmentId: id })

    },
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.deptChannel)
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    // 添加
    handleAdd() {

      if (this.pagination.deptId==1){
        this.$message.warning('请选择公司')
        return
      }
      const query={
        deptId:this.pagination.deptId
      }
       this.$api.modules.systemset.wechatUserListAdd({ deptId:this.pagination.deptId}).then(res => {
        if (res) {
          this.getData()
          this.$message.success(res.msg)
        }
      })

      // this.tableData.forEach((item) => {
      //   this.typeData.forEach((citem) => {
      //     citem.children.forEach((pitem) => {
      //       if (item.channelId === pitem.channelId) {
      //         pitem.disabled = true
      //       }
      //     })
      //   })
      // })
      // this.showDialog = true
      // this.form.type = undefined
      // this.dialogTitle = '添加公司渠道'
      // this.form.deptId = this.pagination.deptId
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
    handleNodeClick(data) {
      if (this.pagination.deptId !== data.id) {
        this.pagination.deptId = data.id
        if (data.children==undefined){
          this.getData()
        }
      }
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
        //   break
        // case '修改':
        //   this.handlecompile(e[1])
      }
    },
    // handlecompile(e) {
    //   this.dialogTitle = '修改公司渠道'
    //   // this.form = e
    //   // this.type = e.channelName
    //   let ids = e.channelId
    //   this.$api.modules.channel.channeledit(ids).then(res => {
    //     if (res) {
    //     }
    //   })
    //   this.showDialog = true
    // },
    // 删除操作
    handleDelete(e) {
      const wechatUserId = e.wechatUserId
      console.log(wechatUserId,'gg')
      this.$confirm('是否确认删除编号为' + wechatUserId + '的数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.systemset.wechatUserListRemove(wechatUserId).then(res => {
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
          if (this.dialogTitle === '添加公司渠道') {
            const data = {
              deptId: this.form.deptId,
              channelDeptTypeRelationDTOList: []
            }
            this.form.type.forEach(item => {
              const obj = {
                typeId: item[0],
                channelId: item[1]
              }
              data.channelDeptTypeRelationDTOList.push(obj)
            })
            this.submitLoading = true
            this.$api.modules.channel.deptChannelOperate(data, 'post').then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.showDialog = false
                this.getData()
              }
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
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
          this.getData()
        }
      })
    },
    resetFormSearch() {
      this.pagination.typeId = undefined
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
        if (this.pagination.deptId==1){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      const query={
        deptId:this.pagination.deptId==1?4:this.pagination.deptId
      }
      this.showDataDialog = true
      this.$api.modules.systemset.wechatUserList({...this.pagination,...query}).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    getType() {
      this.$api.modules.channel.noPageTypeList({ status: '0' }).then(res => {
        if (res) {
          this.deptTypeData = res.rows
          this.$api.modules.channel.noPageList({ status: '0' }).then(sres => {
            if (sres) {
              res.rows.forEach(item => {
                item.children = []
                item.value = item.typeId
                item.label = item.typeName
                sres.rows.forEach(citem => {
                  if (item.typeId === citem.typeId) {
                    citem.value = citem.channelId
                    citem.label = citem.channelName
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
  width: calc(100% - 0px);
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
