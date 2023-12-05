<template>
  <div>
    <div class="taber" v-for="(item,index) in infant" :key="index">
      <div class="titem"><i class="el-icon-folder-opened" />{{item.name}}排期记录</div>

      <div v-if="item.name!=='月子中心'">
        <el-table
          :data="item.values"
          height="180"
          border
          size="mini"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{ textAlign: 'center' }"
          style="width: 100%"
        >
        <el-table-column prop="orderNumber" label="收费单编号" />
          <el-table-column prop="checkoutTime" label="结账日期" />
          <el-table-column prop="projectName" label="项目名称" width="300" />
          <el-table-column prop="quantity" label="购买数量" />
          <el-table-column prop="quantity" label="产品数量" />
          <el-table-column prop="quantitySum" label="总次数" />
          <el-table-column prop="treatmentNum" label="已治疗次数" />
          <el-table-column prop="surplusQuantity" label="剩余次数" />
          <el-table-column prop="state" label="是否安排" >
            <template slot-scope="scope">
              <div>
                {{scope.row=='0'?'否':'是'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="isRefund" label="是否退款">
            <template slot-scope="scope">
              <div>
                 {{ scope.row.isRefund==0?'否':'是' }}
              </div>
             </template>
          </el-table-column>

          <el-table-column prop="" label="门诊病历" />
          <el-table-column prop="" label="住院病历" />
          <el-table-column prop="doctorName" label="医生" />
          <el-table-column prop="acName" label="美学顾问" />
          <el-table-column prop="customerStatus" label="客户类型">
                 <template slot-scope="scope">
                     <div>
                       {{scope.row.customerStatus=='1'?'新客户':"老客户"}}
                     </div>
                 </template>
            </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-table
          :data="item.values"
          height="180"
          border
          size="mini"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{ textAlign: 'center' }"
          style="width: 100%"
        >
          <el-table-column prop="customerName" width="80" label="客户" />
          <el-table-column prop="orderNumber" width="130" show-overflow-tooltip label="收费单编号" />
          <el-table-column prop="checkoutTime" show-overflow-tooltip label="结账日期" />
          <el-table-column prop="customCardNumber" width="120" show-overflow-tooltip label="客户卡号" />
          <el-table-column prop="projectName" width="200" show-overflow-tooltip label="产品名称" />
          <el-table-column prop="quantitySum" width="70" label="总次数" />
          <el-table-column prop="surplusQuantity" width="70" label="剩余次数" />
          <el-table-column prop="treatmentNum" label="已治疗次数" />
          <el-table-column prop="isRefund" label="是否退款">
            <template slot-scope="scope">
              <div>
                {{ scope.row.isRefund==0?'否':'是' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="acName" show-overflow-tooltip label="现场咨询" />
          <el-table-column prop="circulatingName" label="责任护士" />
          <el-table-column prop="dtrnursingName" label="责任月嫂" />
          <el-table-column prop="dtrdoctorName" label="产康师" />
          <el-table-column prop="discountAmount" label="金额" />
          <el-table-column prop="checkoutTime" show-overflow-tooltip label="结账时间" />
          <el-table-column prop="billingRemarks" show-overflow-tooltip label="备注" />
        </el-table>

      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vm from '@/utils/util'
export default {
  data() {
    return {
      form: {
        deptId: ''
      },
      infant:[],
      tableData: [],
      plasticList: [], // 整形列表
      confinement: [], // 皮肤列表
      NoninvasiveList: [], // 无创列表
      cavityList: [], // 口腔列表
      spaList: [], // SPA列表
      privateList: [] // 私密列表
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
    // 根据名称筛选公司树
    deptId(val) {
      this.deptId = val
    },
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
  },
  methods: {
    getdata(id) {
      this.infant=[];
      this.$api.dept.DepartmentList({ deptId: this.deptId }, 'get').then((res) => {
        res.rows.forEach(value => {
          if (value.isDepartment == '0') { }
          else {
            let object = { name: value.departmentName, values: [], departmentId: value.departmentId };
            this.infant.push(object)
          }
        })
        this.$api.medical.skinTriageList({ deptId: this.deptId, id: id }).then(res => {
        if (res) {
          res.rows.forEach(value => {
            this.infant.forEach(newvalue => {
              if (value.departmentId == newvalue.departmentId) {
                newvalue.values.push(value)
              }
            })


          })
           console.log(this.infant,'和黑')
        }
      })

      })
    },
    remode() {
      // this.$router.go(-1);
      vm.$emit('closeTag', this.$route.path)
    }
  }
}
</script>

<style scoped lang="scss">
.taber{
  width: 99%;
  height: 100%;
  border: 1px solid #c7c7c7;
  margin-bottom: 10px;
  .titem{
    font-size: 13px;
    font-weight: 700;
    line-height: 30px;
    padding-left: 20px;
    background-color: #ebfaff;
    border-bottom: 1px solid #c7c7c7;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30px;
  //background-color: #fff;
  z-index: 1000;

  .content {
    position: fixed;
    right: 20px;
  }
}
</style>
