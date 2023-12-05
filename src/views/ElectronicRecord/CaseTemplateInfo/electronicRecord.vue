<template>
  <!--  电子病例模板信息 -->
  <div class="container">
    <div class="floor-list">
      <el-input v-model="deptName" size="small" placeholder="请输入病例模板分类名称"/>
      <div class="down-tree">
        <el-tree
            ref="tree"
            class="el-tree"
            default-expand-all
            :filter-node-method="filterNode"
            :data="deptOptions"
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
        />
      </div>
    </div>
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
        <div slot="searchBar">
          <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message="false">
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="searchBar.templateName" clearable placeholder="模板名称" />
            </el-form-item>
<!--            <el-form-item label="状态" prop="state">-->
<!--              <el-select v-model="searchBar.state" clearable placeholder="状态">-->
<!--                <el-option label="正常" value="0" />-->
<!--                <el-option label="停用" value="1" />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
            <el-form-item>
              <el-button icon="el-icon-search" type="primary"  @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="header">
          <el-button size="mini" plain icon="el-icon-plus" type="primary" :disabled="btnDisabled" @click.stop="handleAdd">新增</el-button>
          <el-button size="mini" plain icon="el-icon-delete" type="danger" @click.stop="handleDelete">删除</el-button>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'templateType'">
            <span style="font-size: 14px">{{ data.custom.templateType == '0' ? '通用模板' : '' }} </span>
          </div>
          <div v-else-if="data.props === 'useScope'">
            <span style="font-size: 14px">{{ data.custom.useScope == '0' ? '通用' : data.custom.useScope == '1' ? '男性' : '女性'}} </span>
          </div>
          <div v-else-if="data.props === 'timeNode'">
            <span style="font-size: 14px">{{ data.custom.timeNode == '0' ? '不限时' : data.custom.timeNode == '1' ? '入院' : data.custom.timeNode == '2' ? '出院' : '术后'}} </span>
          </div>
          <div v-else-if="data.props === 'templateRole'">
            <span style="font-size: 14px">{{ data.custom.templateRole == '0' ? '通用' : data.custom.templateRole == '1' ? '医生' : '护士'}} </span>
          </div>
          <div v-else-if="data.props === 'useType'">
            <span style="font-size: 14px">{{ data.custom.useType == '0' ? '通用' : data.custom.useType == '1' ? '成人' : '婴儿'}} </span>
          </div>
        </template>
      </sg-table>
    </div>
    <!-- 新增 -->
    <sg-dialog :title="dialogTitle" :dialog="showDialog" size="450px" @handleClose="handleClose">
      <div slot="out">
        <el-form ref="sg-dialog-form" :model="form" :rules="rules" label-width="80px" size="mini">
          <el-form-item label="模板分类" prop="classifyId">
            <treeselect v-model="form.classifyId" disabled :options="deptOptions" :show-count="true" placeholder="请选择归属公司" />
          </el-form-item>
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="form.templateName" clearable placeholder="请输入模板名称" />
          </el-form-item>
          <el-form-item label="模板类型" prop="templateType">
            <el-radio-group v-model="form.templateType">
              <el-radio :label="0">通用模板</el-radio>
<!--              <el-radio label="1">停用</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="使用范围" prop="useScope">
            <el-radio-group v-model="form.useScope">
              <el-radio :label="0">通用</el-radio>
              <el-radio :label="1">男性</el-radio>
              <el-radio :label="2">女性</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限时节点" prop="timeNode">
            <el-radio-group v-model="form.timeNode">
              <el-radio :label="0">不限时</el-radio>
              <el-radio :label="1">入院</el-radio>
              <el-radio :label="2">出院</el-radio>
              <el-radio :label="3">术后</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="模板角色" prop="templateRole">
            <el-radio-group v-model="form.templateRole">
              <el-radio :label="0">通用</el-radio>
              <el-radio :label="1">医生</el-radio>
              <el-radio :label="2">护士</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="病例对象" prop="useType">
            <el-radio-group v-model="form.useType">
              <el-radio :label="0">通用</el-radio>
              <el-radio :label="1">成人</el-radio>
              <el-radio :label="2">婴儿</el-radio>
            </el-radio-group>
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

<script>
import sgDialog from '@/components/Dialog/index'
import sgTable from '@/components/Table'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖

export default {
  components: {
    sgTable,
    sgDialog,
    Treeselect
  },
  data() {
    return {
      hideSearchBar:false,
      deptName: '',
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogTitle: '',
      showDialog: false,
      form: {
        classifyId: 0,
        templateName: '',
        templateType: 0,
        useScope: 0,
        timeNode: 0,
        templateRole: 0,
        useType: 0
      },
      rules: {
        floorNumber: [
          { required: true, message: '请输入模板分类名称', trigger: 'blur' }
        ]
      },
      loadingSubmit: false,
      loadingData: false,
      tableData: [],
      searchBar: {
        templateName: ''
      },
      columns: [
        {
          lab: '编号',
          val: 'templateId'
        },
        {
          lab: '模板名称',
          val: 'templateName'
        },
        {
          lab: '模板类型',
          val: 'templateType',
          custom: 'templateType'
        },
        {
          lab: '使用范围',
          val: 'useScope',
          custom: 'useScope'
        },
        {
          lab: '限时节点',
          val: 'timeNode',
          custom: 'timeNode'
        },
        {
          lab: '模板角色',
          val: 'templateRole',
          custom: 'templateRole'
        },
        {
          lab: '病例对象',
          val: 'useType',
          custom: 'useType'
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
        classifyId: 0,
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
            lab: '设计模板',
            type: 'danger',
            permi: ['share:floorInfo:remove']
          }
        ]
      },
      btnDisabled: true
    }
  },
  watch: {
    deptId(val) {
      this.getTreeSelect();
      this.getData();

    }
  },
  created() {
    this.getTreeSelect();
    this.deptId=this.$store.getters.departmentId;
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }

  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId;
      }
    }
  },
  methods: {
    changeImg(e){
      this.hideSearchBar=!e
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
      }
      this.loadingData = true
      this.$api.caseTemplateInfo.caseTemplateInfoList(isSearch ? { ...this.searchBar, ...this.pagination } : this.pagination).then(res => {
        if (res) {
          console.log(res.rows)
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
        // case '删除':
        //   this.handleDelete(e[1])
        case '设计模板':
          let a=document.createElement('a');
          a.href=`http://47.109.74.151:8902/#/edit/${e[1].templateId}T0`;
          a.setAttribute('target','_blank')
          document.body.appendChild(a);
          a.click();
          a.style.display='none'
          // this.skipTemplate(e[1])
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 新增
     */
    handleAdd() {
      this.$nextTick(() => {
        this.dialogTitle = '添加电子病例模板'
      })
      this.form.classifyId = this.pagination.classifyId
      this.showDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 修改
     */
    handleUpdate(e) {
      this.$nextTick(() => {
        this.dialogTitle = '修改电子病例模板'
      })
      this.form.templateId = e.templateId
      this.form.classifyId = e.classifyId
      this.form.templateName = e.templateName
      this.form.templateType = e.templateType
      this.form.useScope = e.useScope
      this.form.timeNode = e.timeNode
      this.form.templateRole = e.templateRole
      this.form.useType = e.useType
      this.showDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 删除
     */
    handleDelete(e) {
      const templateId = e.templateId || this.selectionData[0].templateId
      this.$confirm('是否确认删除此电子病例模板？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.caseTemplateInfo.removeCaseTemplateInfo(templateId).then(res => {
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
        classifyId: 0,
        templateName: '',
        templateType: 0,
        useScope: 0,
        timeNode: 0,
        templateRole: 0,
        useType: 0
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
          console.log(123)
          if (this.form.templateId === undefined || this.form.templateId === '') {
            this.loadingSubmit = true
            this.$api.caseTemplateInfo.addCaseTemplateInfo(this.form).then(res => {
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
            this.$api.caseTemplateInfo.editCaseTemplateInfo(this.form).then(res => {
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
      // var classifyId = 0;
      this.$api.caseTemplateInfo.caseTemplateClassifyTree({classifyId: 0,deptId:this.deptId}).then(res => {
        if (res) {
          this.pagination.classifyId = res.rows[0].classifyId
          res.rows.forEach(item => {
              var obj = {};
              var child = [];
              obj.id = item.classifyId
              obj.label = item.classifyName

              if(item.children !== null){
                item.children.forEach(x=>{
                  var obje = {};
                  obje.id = x.classifyId
                  obje.label = x.classifyName
                  child.push(obje)
                })
              }
              obj.children = child
              this.deptOptions.push(obj)
          })
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
        if (this.pagination.classifyId !== data.id) {
          this.pagination.classifyId = data.id
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
  width: calc(100% - 270px);
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
