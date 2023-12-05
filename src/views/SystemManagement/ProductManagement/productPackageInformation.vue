<template>
  <!-- 产品套餐信息 -->
  <el-scrollbar>
    <div>
      <SgTable

        :columns="columns"
        :pagination="pagination"
        :table-data="tableData"
        selection
        border
        index="序号"
        :operate="operate"
        @operateClick="operateClick"
        @selection-change="handleSelectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @changeImg="changeImg"
        :hideSearchBar="hideSearchBar"
      >
        <div slot="searchBar" class="header">
          <div>
            <el-form :inline="true" ref="setMeal" :model="setMeal" size="mini" label-width="100px">
              <el-form-item label="套餐名称">
                <el-input v-model="setMeal.pmName" clearable />
              </el-form-item>
              <el-form-item label="套餐简码">
                <el-input v-model="setMeal.pmCode" clearable />
              </el-form-item>
              <el-form-item label="套餐类别">
                <el-select v-model="setMeal.pmCategory" clearable filterable placeholder="请选择">
                  <el-option
                    v-for="dict in dict.type.package_category"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="套餐状态">
                <el-select v-model="setMeal.productStatus" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="dict in dict.type.product_status"
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
            <el-button icon="el-icon-delete" type="info" plain size="mini" @click="resetFormSearch">重置</el-button>
          </div>
        </div>
        <div slot="header" class="header">
          <i class="el-icon-edit">创建产品套餐
          </i>
          <div>
            <el-button
              v-has-permi="['productPackageInformation:createPackage']"
              size="mini"
              icon="el-icon-plus"
              type="primary"
              @click="cpackage"
            >创建产品套餐
            </el-button>
            <el-button
              v-has-permi="['confinement:packageManagementInfo:StepDown']"
              size="mini"
              type="danger"
              @click="packageDown"
            >下架
            </el-button>
          </div>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'productStatus'">
            <show-dict-data :options="dict.type.product_status" :value="data.custom.productStatus" />
          </div>
          <div v-else-if="data.props === 'isDiscount'">
            <show-dict-data :options="dict.type.discount" :value="data.custom.isDiscount" />
          </div>
          <div v-else-if="data.props === 'pmCategory'">
            <show-dict-data :options="dict.type.package_category" :value="data.custom.pmCategory" />
          </div>
          <div v-else-if="data.props === 'pmName'">
            <el-button type="text" style="color: #1abc9c" @click="openDrawer(data)">{{ data.custom.pmName }}</el-button>
          </div>
        </template>
      </SgTable>
    </div>
    <el-drawer
      title="产品套餐详情"
      :size="width"
      :visible.sync="drawer"
      :direction="direction"
    >
      <el-table
        :data="packageDetailsInfo"
        border
        stripe
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 100%; margin-left: 5px"
      >
        <el-table-column prop="projectName" label="产品名称" width="200" />
        <el-table-column prop="originalPrice" label="价格" width="90" />
        <el-table-column prop="packagePrice" label="套餐内单价" width="100" />
        <el-table-column prop="packageInAmount" label="套餐内金额" width="100" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-drawer>
  </el-scrollbar>
</template>

<script>
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖

export default {
  dicts: ['product_status', 'discount', 'package_category'],
  components: {
    SgTable
  },
  data() {
    return {
      hideSearchBar:false,
      showDataDialog: false,
      width: '750px',
      drawer: false,
      direction: 'rtl',
      dtcir: '',
      setMeal: {
        pmCategory: '1', // 套餐类别
        pmCode: '', // 套餐简码
        pmName: '', // 套餐名称
        packageValidity: '', // 套餐有效期
        productStatus: '0' // 套餐状态
      },
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      columns: [
        {
          lab: '套餐名称',
          val: 'pmName',
          custom: 'pmName'
        },
        // {
        //   lab: '套餐简码',
        //   val: 'pmCode'
        // },
        {
          lab: '套餐描述',
          val: 'productDescription'
        },
        // {
        //   lab: '套餐有效期',
        //   val: 'packageValidity'
        // },
        {
          lab: '套餐价格',
          val: 'pmPrice'
        },
        {
          lab: '是否打折',
          val: 'isDiscount',
          custom: 'isDiscount'
        },
        {
          lab: '套餐类别',
          val: 'pmCategory',
          custom: 'pmCategory'
        },
        {
          lab: '是否下架',
          val: 'productStatus',
          custom: 'productStatus'
        }
      ],
      // 操作
      operate: {
        name: '操作',
        width: '120',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['confinement:packageManagementInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['confinement:packageManagementInfo:remove']
          }
        ]
      },
      tableData: [], // 表格数据
      packageDetailsInfo: [],
      selectionData: []
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
            this.getData(val)
        },
    },
  created() {
    this.getData()
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
    openDrawer(data) {
      this.drawer = true
      const packageNumber = data.custom.packageNumber
      this.$api.product.packageDetailsInfoByNumber({ packageNumber }).then(res => {
        this.packageDetailsInfo = res.rows
      })
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
      this.showDataDialog = true
        this.$set(this.setMeal, 'deptId', this.deptId)
      this.$api.product.packageManagementInfo({
        ...this.pagination,
        ...this.setMeal
      }).then(res => {
        this.tableData = res.rows
        this.pagination.total = res.total
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    resetFormSearch() {
      this.setMeal.pmName = undefined
      this.setMeal.pmCode = undefined
      this.setMeal.productStatus = undefined
      this.setMeal.packageValidity = undefined
      this.setMeal.pmCategory = undefined
      this.getData(true)
    },
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handlecompile(e[1])
          break
        case '删除':
          this.delete(e[1])
          break
      }
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    // 下架产品
    packageDown() {
      const selectionPmId = []
      if(this.selectionData.length==0){
        this.$message.warning('请选择数据进行下架');
        return
      }
      this.selectionData.forEach(item => {
        selectionPmId.push(item.pmId)
      })
      this.$api.product.packageManagementInfoDown(selectionPmId).then(res => {
        this.getData()
      })
    },
    // 删除
    delete(e) {
      const pmId = e.pmId
      this.$api.product.packageManagementDelete(pmId).then(res => {
        this.$message.success(res.msg)
        this.getData()
      })
    },
    // 修改
    handlecompile(e) {
      const pmId = e.pmId
      this.$router.push({ name: 'CreatePackage'})
      sessionStorage.setItem('createPackage',pmId)
    },
    // 创建产品套餐
    cpackage() {
      const pmId = 'null'
      this.$router.push({ name: 'CreatePackage' })
      sessionStorage.setItem('createPackage',pmId)

    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-drawer__header{
  color: #1abc9c;
  font-size: 18px;
}
.header {
  width: 100%;
  height: 43px;
  font-size: 14px;
  color: #fffffc;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card{
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 20px;
}
.el-form-item{
  margin-bottom: 0;
}
</style>
