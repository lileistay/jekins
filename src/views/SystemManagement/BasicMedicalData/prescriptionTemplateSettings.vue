<template>
  <!-- 处方模板设置-->
  <div>
    <SgTable
      ref="table"

      :sg-ref="'multipleTable'"
      size="mini"
      selection
      border
      index="序号"
      :columns="columns"
      :operate="operate"
      :pagination="pagination"
      :table-data="tableData"
      @operateClick="operateClick"
      @size-change="sizeChange"
      @current-change="currentChange"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
      @changeImg="changeImg"
      :hideSearchBar="hideSearchBar"
    >
      <div slot="searchBar" class="header-float">
        <div>
          <el-form size="mini" :model="form" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item label="处方模板名称:">
                  <el-input v-model="form.templateName" type="text" clearable style="width: 200px;" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="是否全局模板：">
                  <el-select v-model="form.isWholeTemplate" filterable clearable placeholder="请选择" style="width: 200px">
                    <el-option
                      v-for="dict in dict.type.whether"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="状态：">
                  <el-select v-model="form.status" filterable clearable placeholder="请选择" style="width: 200px">
                    <el-option
                      v-for="dict in dict.type.sys_normal_disable"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="备注：">
                  <el-input v-model="form.remark" clearable style="width: 200px;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-button icon="el-icon-search" type="primary" plain size="mini"  @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
        </div>
      </div>
      <div slot="header" class="header-float">
        <div />
        <div>
          <el-button v-has-permi="['share:prescriptionTemplateInfo:add']" size="mini" icon="el-icon-plus" @click.stop="handleAdd" type="primary">新增</el-button>
<!--          <el-button size="mini" type="danger" @click.stop="handleDelete">删除</el-button>-->
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
        <div v-else-if="data.props === 'isWholeTemplate'">
          <dict-tag :options="dict.type.whether" :value="data.custom.isWholeTemplate" />
        </div>
        <div v-else-if="data.props === 'templateUseName'">
          <span>{{ data.custom.templateUseName ? data.custom.templateUseName : '全局模板' }}</span>
        </div>
      </template>
    </SgTable>
  </div>
</template>

<script>
// 引入新增弹层组件
import SgTable from '@/components/Table'

export default {
  components: {
    SgTable
  },
  dicts: ['sys_normal_disable', 'whether'],
  data() {
    return {
      hideSearchBar:false,
      loadingData: false,
      // 搜索框
      form: {
        templateName: '',
        isWholeTemplate: '1',
        status: '0',
        remark: ''
      },
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      columns: [
        {
          lab: '处方模板名称',
          val: 'templateName'
        },
        {
          lab: '是否全局模板',
          width: 130,
          val: 'isWholeTemplate',
          custom: 'isWholeTemplate'
        },
        {
          lab: '模板使用者',
          width: 130,
          val: 'templateUseName',
          custom: 'templateUseName'
          // width: 110
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '处方模板备注信息',
          width: 130,
          val: 'remark'
        }
      ],
      operate: {
        name: '操作',
        width: '140',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:prescriptionTemplateInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:prescriptionTemplateInfo:delete']
          }
        ]
      },
      tableData: [] // 表格数据
    }
  },
  created() {
    this.getData();
    this.deptId = this.$store.getters.departmentId
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
  watch:{
    deptId(){
      this.getData();
    }
  },
  methods: {
    changeImg(e){
      this.hideSearchBar=!e
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 获取数据
     */
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

      this.$api.basicMedicalData.prescriptionTemplateSettingsList({ ...this.form, ...this.pagination,deptId:this.deptId }).then(res => {
        if (res) {
          this.pagination.total = res.total
          this.tableData = res.rows
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 操作点击
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
     * @date 2022/5/13
     * @Description: 新增
    */
    handleAdd() {
      this.$router.push({ path: 'prescriptionTemplate' })
      sessionStorage.setItem('prescriptionTemplateitem',JSON.stringify(undefined))
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 修改
     */
    handleUpdate(e) {
      this.$router.push({ path: 'prescriptionTemplate'})
      sessionStorage.setItem('prescriptionTemplateitem',JSON.stringify(e))
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 删除
     */
    handleDelete(e) {
      let relationshipNumber = 0
      if (e.relationshipNumber === undefined) {
        relationshipNumber = this.selectionData[0].relationshipNumber
      } else {
        relationshipNumber = e.relationshipNumber
      }
      this.$confirm('是否确认删除此处方模板', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$api.basicMedicalData.removePrescriptionTemplateSettings(relationshipNumber).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/13
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
     * @date 2022/5/13
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
     * @date 2022/5/13
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
@import '../../../styles/globalfloat.css';

.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
</style>
