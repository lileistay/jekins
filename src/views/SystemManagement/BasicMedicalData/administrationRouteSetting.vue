<template>
  <!-- 给药途径设置-->
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
          <el-form :inline="true" :model="form" size="mini" label-width="130px">
            <el-form-item label="给药途径:" style="margin-bottom: 6px">
              <el-input v-model="form.drugDelivery" style="width: 180px;" />
            </el-form-item>
            <el-form-item label="处方单打印类型：" style="margin-bottom: 6px">
              <el-select v-model="form.prescriptionType" filterable placeholder="请选择" clearable style="width: 180px">
                <el-option
                  v-for="dict in dict.type.prescription_print_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" style="margin-bottom: 6px">
              <el-select v-model="form.status" filterable placeholder="请选择" clearable style="width: 180px;">
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button icon="el-icon-search" type="primary" plain size="mini" @click.stop="getData(true)"  @keydown.enter.native="getData(true)">搜索</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
        <div v-else-if="data.props === 'prescriptionType'">
          <dict-tag :options="dict.type.prescription_print_type" :value="data.custom.prescriptionType" />
        </div>
      </template>
      <div slot="header" class="header-float">
        <div />
        <div>
          <el-button v-has-permi="['share:drugDeliveryRoute:list']" size="mini" icon="el-icon-plus" type="primary" @click.stop="added">新增</el-button>
        <!-- <el-button size="mini" type="danger" @click.stop="handleDelete">删除</el-button>-->
        </div>
      </div>
    </SgTable>
    <sgDialog :title="title" size="400px" :dialog="dialogVisible" @handleClose="closeDialog">
      <div slot="out">
        <el-form ref="eject" :model="eject" :rules="rules" label-width="140px" size="mini">
          <el-form-item label="给药途径：" prop="drugDelivery">
            <el-input v-model="eject.drugDelivery" clearable style="width: 200px;" />
          </el-form-item>
          <el-form-item label="处方单打印类型：" prop="prescriptionType">
            <el-select v-model="eject.prescriptionType" filterable placeholder="请选择" style="width: 200px">
              <el-option
                v-for="dict in dict.type.prescription_print_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="eject.status"  filterable placeholder="请选择" style="width: 200px">
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" size="mini" @click="submitForm">确认</el-button>
            <el-button size="mini" @click="closeDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sgDialog>
  </div>
</template>

<script>
// 引入新增弹层组件
import sgDialog from '@/components/Dialog/index'
import SgTable from '@/components/Table'

export default {
  dicts: ['sys_normal_disable', 'prescription_print_type'],
  components: {
    SgTable, sgDialog
  },
  data() {
    return {
      hideSearchBar:false,
      loadingData: false,
      // 搜索框
      form: {
        drugDelivery: '',
        prescriptionType: '',
        status: '0'
      },
      selectionData: [],
      // 弹框
      title: '新增',
      dialogVisible: false,
      eject: {
        drugId: '',
        drugDelivery: '',
        prescriptionType: '',
        status: '0'
      },
      rules: {
        drugDelivery: [
          { required: true, message: '给药途径不能为空', trigger: 'blur' }
        ],
        prescriptionType: [
          { required: true, message: '处方单打印类型不能为空', trigger: 'change' }
        ]
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
          lab: '给药途径',
          val: 'drugDelivery'
        },
        {
          lab: '处方单打印类型',
          width: 130,
          val: 'prescriptionType',
          custom: 'prescriptionType'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
          // width: 110
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
      this.$api.basicMedicalData.drugDeliveryRouteList({ ...this.form, ...this.pagination }).then(res => {
        if (res) {
          this.pagination.total = res.total
          this.tableData = res.rows
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
      * @author 李尚
      * @date 13/5/2022
      * @Description: 关闭弹曾
    */
    closeDialog() {
      this.$refs['eject'].resetFields()
      this.eject = {
        drugId: '',
        drugDelivery: '',
        prescriptionType: '',
        status: '0'
      }
      this.dialogVisible = false
    },
    added() {
      this.eject = {
        drugId: '',
        drugDelivery: '',
        prescriptionType: '',
        status: '0'
      }
      this.title = '新增'
      this.dialogVisible = true
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 提交表单
    */
    submitForm() {
      if (this.eject.drugId !== '') {
        this.$api.basicMedicalData.editDrugDeliveryRoute(this.eject).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.$refs['eject'].resetFields()
            this.closeDialog()
            this.getData()
          }
        })
      } else {
        this.$api.basicMedicalData.addDrugDeliveryRoute(this.eject).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.$refs['eject'].resetFields()
            this.closeDialog()
            this.getData()
          }
        })
      }
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
     * @Description: 修改
    */
    handleUpdate(e) {
      this.eject.drugId = e.drugId
      this.eject.drugDelivery = e.drugDelivery
      this.eject.prescriptionType = e.prescriptionType
      this.eject.status = e.status
      this.title = '修改'
      this.dialogVisible = true
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 删除
    */
    handleDelete(e) {
      let drugId = 0
      if (e.drugId === undefined) {
        drugId = this.selectionData[0].drugId
      } else {
        drugId = e.drugId
      }
      this.$confirm('是否确认删除此给药途径', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$api.basicMedicalData.removeDrugDeliveryRoute(drugId).then(res => {
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
  margin-bottom: 6px;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
</style>
