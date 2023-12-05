<template>
  <!--  推荐人业绩查询（个人）-->
  <div class="container">
    <sg-table
      size="mini"
      selection
      border
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
    >
      <div slot="searchBar">
        <el-form size="mini" :model="form" label-width="120px">
          <el-row>
            <el-col :span="3">
              <el-form-item label="客户姓名：">
                <el-input v-model="form.customerName" />
              </el-form-item>
              <el-form-item label="医生：">
                <el-select  v-model="form.doctorId" filterable style="width: 100%" clearable>
                  <el-option
                    v-for="item in doctor"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="电话：">
                <el-input v-model="form.customPhone" />
              </el-form-item>
              <el-form-item label="科室：">
                <el-select  filterable value="" />
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="客户卡号：">
                <el-input v-model="form.customPhone" />
              </el-form-item>
              <el-form-item label="收费单号：">
                <el-input v-model="form.orderNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="分诊类型：">
                <el-select v-model="form.triageType" filterable clearable>
                  <el-option
                    v-for="item in dict.type.Triage_type"
                    :key="item.dictValue"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="收费类型：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="开单人：">
                <el-select v-model="form.duName" filterable clearable>
                  <el-option
                    v-for="(item, index) in billTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="结账时间：">
                <el-date-picker
                  v-model="form.checkoutTime"
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="客户代表：">
                <el-select v-model="form.customerRepresentative" filterable clearable>
                  <el-option
                    v-for="(item, index) in billTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="归属美学顾问：">
                <el-select v-model="form.aestheticConsultant" filterable clearable>
                  <el-option
                    v-for="item in esthetics"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="客户状态：">
                <el-select v-model="form.customerStatus" style="width: 100%" filterable clearable>
                  <el-option label="新顾客" value="0" />
                  <el-option label="老顾客" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button
                icon="el-icon-search"
                type="primary"
                plain
                style="float: right"
                size="mini"
                @click="getData"
              >搜索</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="应付金额：">
                <el-input v-model="form.beginamountPayable" style="width: 100px;" />
                至
                <el-input v-model="form.endamountPayable" style="width: 100px;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span>推荐人开单业绩查询     开单业绩合计：860    科室、客户状态取收费单对应接诊表数据，辅助治疗和检验没有科室信息</span>
        </div>
        <div />
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  name: 'Referrerperformancequeryp',
  dicts: ['billing_type', 'Triage_type'],
  components: {
    SgTable
  },
  data() {
    return {
      form: {
        customerName: '',
        doctorId: '',
        customPhone: '',
        customCardNumber: '',
        orderNumber: '',
        triageType: '',
        duName: '',
        checkoutTime: '',
        customerRepresentative: '',
        aestheticConsultant: '',
        customerStatus: '',
        beginamountPayable: '',
        endamountPayable: ''
      },
      doctor: [],
      billTypeList: [],
      esthetics: [],
      tableData: [], //
      columns: [
        {
          lab: '开单推荐人',
          val: 'custSexb',
          width: 120
        },
        {
          lab: '分诊类型',
          val: 'triageType',
          width: 120
        },
        {
          lab: '开单人',
          val: 'duName',
          width: 120
        },
        {
          lab: '归属美学顾问',
          val: 'acName',
          width: 120
        },
        {
          lab: '客户代表',
          val: 'crName',
          width: 120
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 120
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 120
        },
        {
          lab: '收费单号',
          val: 'orderNumber',
          width: 165
        },
        {
          lab: '收费单类型',
          val: 'billType',
          width: 120
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          width: 120
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '客户状态',
          val: 'customerStatus',
          width: 120
        },
        {
          lab: '结账日期',
          val: 'checkoutTime',
          width: 160
        },
        {
          lab: '总金额',
          val: '',
          width: 120
        },
        {
          lab: '应付金额',
          val: 'amountPayable',
          width: 120
        },
        {
          lab: '实付金额',
          val: 'totalPayment',
          width: 120
        },
        {
          lab: '开单业绩',
          val: 'departmentPerformance',
          width: 120
        },
        {
          lab: '财务收支总金额',
          val: '',
          width: 120
        },
        {
          lab: '源收费单号',
          val: '',
          width: 120
        },
        {
          lab: '源收费单类型',
          val: '',
          width: 120
        }
      ],
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      }
    }
  },
  watch: {
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 搜索
    getData() {
      console.log('搜索', this.form)
    },
    // 获取用户列表
    getUserList() {
      // 人员添加公司Id 添加状态
      this.$api.user.getUserList({
        deptId: this.deptId,
        status: '0'
      }).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
            }
          })
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.billTypeList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.header{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 12px;
    margin-right: 15px;
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
