<template>
  <!-- 其他开单 -->
  <div>
    <sg-table
      size="mini"
      index="序号"
      selection
      border
      ref="table"
      :sg-ref="'multipleTable'"
      highlight-current-row
      :table-data="tableData"
      :pagination="pagination"
      :columns="columns"
      :header-style="{backgroundColor:'#f5eae4'}"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <!--搜索框 -->
      <div slot="searchBar">
        <el-form ref="form" inline size="mini" :show-message="false" :model="form" @submit.native.prevent="getData">
          <el-form-item label="客户姓名:" prop="userPhone">
            <el-input v-model="form.customerName" clearable/>
          </el-form-item>
          <el-form-item label="电话:" prop="customPhone" >
            <el-input v-model="form.customPhone" clearable/>
          </el-form-item>
          <el-form-item label="客户卡号:" prop="customCardNumber" >
            <el-input v-model="form.customCardNumber" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" plain @click.stop.native="getData(true)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- ----------------------------------- -->
      <div slot="header" style="width: 100%;">
        <el-form style="float: left">
          <p class="kaidan">其他费用开单</p>
        </el-form>
        <el-form class="headerTopPadding" style="float: left">
        </el-form>
        <el-button
          size="mini"
          plain
          icon="el-icon-plus"
          type="primary"
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >检验开单</el-button>
        <el-button
          size="mini"
          plain
          icon="el-icon-plus"
          type="primary"
          style="float: right;margin-top: 12px"
          @click.stop="adjuvanTherapy"
        >辅助治疗开单</el-button>
      </div>
        <template #custom="data">
            <div v-if="data.props==='customSex'">
                <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex"/>
            </div>
            <div v-if="data.props==='occupation'">
                <show-dict-data :options="dict.type.occupation" :value="data.custom.occupation"/>
            </div>
            <div v-if="data.props==='customerStatus'">
                <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus"/>
            </div>
            <div v-else-if="data.props === 'customerName'">
                <a style="color: #66b1ff;cursor: pointer;"
                   @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
            </div>

        </template>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
    dicts: ['sys_user_sex', 'Reception_status', 'whether_secondary', 'whether_Newguest', 'Triage_type','occupation'],
  components: { SgTable },
  data() {
    return {
      form: {
        userPhone: undefined
      },
      tableData: [],
      rowTable: undefined,
      // 表头
      columns: [
        {
          lab: '姓名',
          val: 'customerName'
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
            lab: '性别',
            val: 'customSex',
            custom: 'customSex'
        },
        {
          lab: '年龄',
          val: 'customAge'
        },
        {
          lab: '生日',
          val: 'birthday'
        },
        {
          lab: '手机',
          val: 'customPhone'
        },
        {
          lab: '职业',
          val: 'occupation',
            custom: 'occupation'
        },
        {
          lab: '省份',
          val: 'province'
        },
        {
          lab: '县市',
          val: 'city'
        },
        {
          lab: '客户代表',
          val: 'crName'
        },
        {
          lab: '美学顾问',
          val: 'acName'
        },
        {
          lab: '客户状态',
          val: 'customerStatus',
           custom: 'customerStatus'
        },
        {
          lab: '建档时间',
          val: 'filingTime',
          width:260
        }
      ],
      operate: {},
      pagination: {
          pageSize: 20, // 每页显示的条数
          total: 0, // 总条数
          pageNum: 1,
          show: true,
          currentPage: 1
      },
        selectionData: [], // 选择的数据
    }
  },
    created() {
        this.getData()
    },
    methods: {
      // 获取列表数据
      async getData(isSearch) {
          if (isSearch) {
              this.pagination.pageNum = 1
              this.pagination.currentPage = 1
          }
          this.$set(this.form, 'deptId', this.deptId)
          this.showDataDialog = true
          await this.$api.modules.billingList.BillingManagement({...this.form, ...this.pagination}).then(res => {
              if (res.code === 200) {
                  this.pagination.total = res.total
                  this.pagination.pageNum = 1
                  this.tableData = res.rows
              }
          }).finally(() => {
              this.showDataDialog = false
          })
      },
        // 辅助治疗开单
    adjuvanTherapy() {
        if (this.selectionData[0] === undefined) {
            this.$message.warning('请选择一名顾客进行修改')
            return
        }
        this.$router.push({path: 'adjuvantBillingTherapy', query: {billing: JSON.stringify(this.selectionData[0])}})
      const query= {
        billing: JSON.stringify(this.selectionData[0]),
      }
      sessionStorage.setItem('adjuvantBillingTherapyitem',JSON.stringify(query))
    },
        // 检验开单
    openManualDialog() {
        if (this.selectionData[0] === undefined) {
            this.$message.warning('请选择一名顾客进行修改')
            return
        }
        this.$router.push({path: 'inspectionBilling', query: {billing: JSON.stringify(this.selectionData[0])}})
      const query= {
        billing: JSON.stringify(this.selectionData[0])
      }
      sessionStorage.setItem('inspectionBillingitem',JSON.stringify(query))
    },
        /**
         * @author Nevin
         * @date 2023/4/6
         * @Description: 表格单选
         */
        handleSelectionChange(e) {
            // console.log('数据',e)
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
         * @date 2023/4/6
         * @Description: 行内点击选中
         */
        rowClick(e) {
            // console.log(e)
            this.$refs.table.$refs.multipleTable.clearSelection()
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
        },
        // 分页
        change(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getData() // 调用数据
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getData()
        },
  }
}
</script>

<style scoped>
.kaidan{
  padding-top: 10px;
  font-size: 15px;
}
</style>
