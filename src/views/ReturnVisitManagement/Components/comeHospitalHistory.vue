<template>
  <div class="headers">
    <div class="one">
      <div>来院记录</div>
      <el-timeline v-for="item in list" :key="item.id">
        <el-timeline-item :timestamp="item.receptionTime" placement="top">
          <el-card>
            <el-row type="flex"  >
              <el-col :span="12" style="margin-right:5px; " >
                <div style="width: 100%;height: 150px;display: flex">
                  <span>接诊备注：</span>
                  <div style="width: 70%;height: 240px;">
                    {{ item.remark }}
                  </div>
                </div>
                <div style="width: 100%;height: 140px;display: flex">
                  <span>咨询备注：</span>
                  <div style="width: 70%;height: 240px;">
                    {{ item.consultationNotes }}
                  </div>
                </div>

              </el-col>
              <el-col :span="12">
                <span>客户状态：{{ customState(item.customerStatus) }}</span>
                <div class="Line"></div>
<!--                <el-divider />-->
                <span>是否二次来院:{{ customFrequency(item.isSecondary) }}</span>
                <div class="Line"></div>
                <span>科室：{{ item.departmentName }}</span>
                <div class="Line"></div>
                <span>医生：{{ item.diName }}</span>
                <div class="Line"></div>
                <span>美学顾问：{{ item.acName }}</span>
                <div class="Line"></div>
                <span>核销顾客：</span>
                <div class="Line"></div>
                <span>分诊意向：{{ triage(item.receptionStatus) }}</span>
                <div class="Line"></div>
                <span>导医：{{ item.gmaName }}</span>
              </el-col>
            </el-row>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="two">
      <div class="searchber">未成交项目</div>
      <SgTable
        size="mini"
        selection
        border
        index="序号"
        highlight-current-row
        :table-data="tableData"
        :columns="columns"
      >
        <div slot="searchBar" />
        <template #custom="data">
          <div v-if="data.props==='isDiscount'">
            <show-dict-data :options="dict.type.discount" :value="data.custom.isDiscount" />
          </div>
        </template>
      </SgTable>
      <div class="block">
        <el-pagination
          :page-sizes="[50, 100, 150, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
      <el-table
        border
        size="mini"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="收费单号" />
        <el-table-column label="结账时间" />
        <el-table-column label="开单推荐人" />
        <el-table-column label="类型" />
        <el-table-column label="金额" />
      </el-table>
    </div>
  </div>
</template>

<script>
import SgTable from '@/components/Table'

export default {
  name: 'ComeHospitalHistory',
  dicts: ['whether_Newguest', 'whether_secondary', 'discount', 'degree_intention_list', 'department', 'whether'],
  components: { SgTable },
  data() {
    return {
      // id: '',//传递过来的数据
      list: [], // 接受根据id获取来的数据
      tableData: [],
      pageSize: 20, // 每页显示的条数
      total: 0, // 总条数
      columns: [
        {
          lab: '来院时间',
          val: 'arrivalTime'
        },
        {
          lab: '科室',
          val: 'departmenNname'
        },
        {
          lab: '接待顾问',
          val: 'receptionName'
        },
        {
          lab: '未成交项目',
          val: 'projectName'
        }
      ]
    }
  },
  created() {
    this.$route.query.id
    // this.Comethehospital(this.id)
    this.unsettledItem()
  },
  methods: {
    // 来院信息
    Comethehospital(id) {
      this.$api.dept.MyReception({ id: id }, 'get').then((res) => {
        if (res) {
          this.list = res.rows
        }
      })
    },
    unsettledItem() {
      const doctorId = this.$route.query.id
      this.$api.user.unsettledItems({ id: doctorId }).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    // // 未成交项目
    // NoDeal(id){
    //   this.$api.UnsettledItems.NoDealList({ id : id }).then((res)=>{
    //     if(res){
    //     }
    //   })
    // },
    customState(str) {
      const obj = this.dict.type.whether_Newguest.find(item => item.value === str);
      // console.log(this.dict.type.whether_Newguest)

      return obj ? obj.label : ''
    },
    triage(str) {
      const obj = this.dict.type.degree_intention_list.find(item => item.value === str);
      // console.log(this.dict.type.degree_intention_list)

      return obj ? obj.label : ''
    },
    customFrequency(str) {
      const obj = this.dict.type.whether_secondary.find(item => item.value === str)
      // console.log(this.dict.type.whether_secondary)
      // console.log(obj,'dsadjsad')
      return obj ? obj.label : ''
    }
  }
}
</script>

<style scoped lang="scss">
.Line{
  border-top: 1px solid #EBEEF5;
  margin-top: 10px;
  margin-bottom: 10px;
}
// 样式别动 一点别动，有问题找我(李尚)
.headers {
  font-size: 14px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  //align-items: center;
  .one {
    width: 36%;
  }
  .two {
    width: 60%;
  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar{
  height: 0;
  padding: 0;
}
</style>
