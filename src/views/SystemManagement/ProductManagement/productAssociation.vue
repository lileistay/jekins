<template>
  <!-- 产品关联 -->
  <div>
    <SgTable
      ref="table"

      :sg-ref="'multipleTable'"
      size="mini"
      border
      index="序号"
      :columns="columns"
      :operate="operate"
      :pagination="pagination"
      :table-data="tableData"
      @operateClick="operateClick"
      @size-change="sizeChange"
      @current-change="currentChange"
      :hideSearchBar="hideSearchBar"
      @changeImg="changeImg"
    >
      <div slot="searchBar" class="header-float">
        <div style="width: 50%;">
          <el-form :inline="true" :model="form" size="mini" label-width="130px">
            <el-form-item label="产品:" style="margin-bottom: 6px">
              <el-input v-model="form.projectName" style="width: 100px;" />
            </el-form-item>
            <el-form-item label="物资:" style="margin-bottom: 6px">
              <el-input v-model="form.materialName" style="width: 100px;" />
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button icon="el-icon-search" type="primary" plain size="mini" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
        </div>
      </div>
      <div slot="header" class="header-float">
        <div />
        <div>
          <el-button v-has-permi="['sorage:materialAuxiliaryRelation:add']" size="mini" icon="el-icon-plus" type="primary" @click.stop="added">新增</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'projectName'">
          {{data.custom.projectName+'/'}}{{data.custom.specs==undefined?'':data.custom.specs+'/'}}{{data.custom.priceUnit==undefined?'':data.custom.priceUnit}}
        </div>
        <div v-if="data.props === 'materialName'">
          {{data.custom.materialName+'/'}}{{data.custom.materialSpec==undefined?'':data.custom.materialSpec+'/'}}{{data.custom.unitName==undefined?'':data.custom.unitName}}
        </div>
      </template>
    </SgTable>
  </div>
</template>

<script>
// 引入新增弹层组件
import SgTable from '@/components/Table'

export default {
  dicts: ['sys_normal_disable', 'prescription_print_type'],
  components: {
    SgTable
  },
  data() {
    return {
      hideSearchBar:false,
      loadingData: false,
      // 搜索框
      form: {
        projectName: '',
        materialName: ''
      },
      selectionData: [],
      // 弹框
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
          lab: '产品',
          val: 'projectName',
          custom: 'projectName'
        },
        {
          lab: '物资',
          val: 'materialName',
          custom: 'materialName'
        }
      ],
      operate: {
        name: '操作',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['sorage:materialAuxiliaryRelation:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['sorage:materialAuxiliaryRelation:remove']
          }
        ]
      },
      tableData: [] // 表格数据
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      console.log('数据',val)
      this.getData()
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
    getData(isSearch) {
      let params = {
        projectName: this.form.projectName,
        materialName: this.form.materialName
      }
      this.pagination.deptId = this.deptId
      this.$api.storageRoom.materialAuxiliaryRelationList({ ...this.pagination, params }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    added() {
      this.$router.push({ path: 'productAssociationAdd' })
      sessionStorage.setItem("productAssociationitem", JSON.stringify(''));
    },
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    // 修改
    handleUpdate(e) {
      this.$api.storageRoom.materialAuxiliaryRelationGetInfo(e.marId).then(res => {
        if (res) {
          this.$router.push({ path: '/productAssociationAdd'})
          const  query= {
            itemId: res.data.itemId,
            marId: res.data.marId,
            materId: res.data.materId,
            whouseId: res.data.whouseId,
            materialName: e.materialName,
            projectName:e.projectName
          }
          sessionStorage.setItem("productAssociationitem", JSON.stringify(query));
        }
      })
    },
    // 删除
    handleDelete(e) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.storageRoom.materialAuxiliaryRelationDElete(e.marId).then(res => {
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
@import '../../../styles/globalfloat.css';

.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 6px;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
.searchBar{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
