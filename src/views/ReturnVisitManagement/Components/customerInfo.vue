<template>
  <!-- 已到院顾客信息 -->
  <el-scrollbar>
    <div class="customerInfo-container">
      <div class="customerInfo-head">
        <span>{{ from.customerName }}</span>
        <span>{{ ccustom(from.customSex) }}</span>
        <span>{{ from.customAge }}岁</span>
        <span>线上客服:{{ from.oudName }}</span>
         &nbsp;
        <span>建档人: {{ from.cdName }}</span>
       &nbsp;
        <span>所属组织: {{ from.deptName }}</span>
      </div>
      <div class="customerInfo-content">
        <!-- 配置静态路由 -->
        <el-tabs v-model="activeName" @tab-click="but">
          <el-tab-pane label="基本信息">
            <detailstion
              :item="titles"
              :objlist="objitem"
              :status="status"
              :no-deal="noDeal"
              :label-type-name="labelTypeName"
              :tionform="tionform"
              :ids="ids"
              :recorlist="recorlist"
              :custom-card-sum="customCardSum"
              @recoremove="changge"
            />
          </el-tab-pane>
          <el-tab-pane label="来院信息" name="first">
            <come-hospital-history ref="hu" />
          </el-tab-pane>
          <el-tab-pane v-if="displays" label="个人账户">
            <accountinformation
              ref="CardSum"
              :dept-id="deptId"
            />
          </el-tab-pane>
          <el-tab-pane v-if="displays" label="回访信息">
            <div class="header">
              <div class="divbor">
                <div class="titme">回访信息</div>
                <information :huifang="huifang" @changeList="changeList" :no-hospital="noHospital" />
              </div>
              <div class="divbor">
                <div class="titme">临客回访信息</div>
                <information :no-hospital="noHospital" :huifang="weihuifang" />
              </div>
            </div>
            <div class="footer">
              <div class="content">
                <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="displays" label="医务治疗记录" name="const">
            <medicalTreatmentRecords ref="con" />
          </el-tab-pane>
          <el-tab-pane v-if="displays" label="医务排期记录">
            <schedulingecord ref="table" />
          </el-tab-pane>
          <el-tab-pane v-if="displays" label="会员信息" name="member">
            <memeber ref="member" />
            <!-- <schedulingecord ref="table" /> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>

import detailstion from '@/views/ReturnVisitManagement/Components/details' // 个人信息
import information from '@/components/ReturnRecord' // 回访
import accountinformation from '@/views/ReturnVisitManagement/Components/accountInformation' // 个人账户
import comeHospitalHistory from '@/views/ReturnVisitManagement/Components/comeHospitalHistory' // 来院信息
import medicalTreatmentRecords from '@/views/ReturnVisitManagement/Components/medicalTreatmentRecords' // 医务治疗记录
import schedulingecord from '@/views/ReturnVisitManagement/Components/schedulingRecord' // 医务排期记录
import memeber from '@/views/ReturnVisitManagement/Components/member'
import { math } from '@/utils/math'
export default {
  dicts: ['sys_user_sex'],
  name: 'CustomerInfo',
  components: {
    detailstion, accountinformation, comeHospitalHistory, information, medicalTreatmentRecords, schedulingecord, memeber
  },
  data() {
    return {
      displays: false,
      table: [],
      noHospital: '',
      huifang: [],
      weihuifang: [],
      showDataDialog: false,
      activeName: '',
      titles: {},
      status: '', // 新客老客
      noDeal: '', // 是否成交
      from: {},
      objitem: {},
      labelTypeName: [],
      // follow: {},
      tionform: [],
      recorlist: [],
      customCardSum: {
        totalStoredValue: 0,
        storedValuePrincipal: 0,
        storedValueGift: 0,
        deposit: 0,
        advancePayment: 0
      },
      ids: '',
      followUpRecord: {
        remark: ''
      }
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
  // 监听部门ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
    }
  },
  created() {
    this.$store.getters.departmentId
    this.$route.query.display
    this.dispaly()
    this.ids = this.$route.query.id
    this.table = this.$route.query.id
    this.status = this.$route.query.status
    this.noDeal = this.$route.query.noDeal
    this.customerlabel()
    this.userlist()
    this.ReservationForm()
    this.recordslist()
    this.getCustomCardSum()
    this.AccessRecord()
    this.ReturnVisit()
    this.totalConsumptionTimes()
  },
  methods: {
    changeList(){
      this.AccessRecord()
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 个人账户信息
     */
    getCustomCardSum() {
      this.$api.RechargeableCard.customCardSum({
        id: this.ids
      }).then(res => {
        if (res.rows.length !== 0) {
          this.customCardSum.totalStoredValue = math.add(res.rows[0].groupPrincipal, res.rows[0].groupGift, res.rows[0].companyPrincipal,
            res.rows[0].companyGift, res.rows[0].departmentalPrincipal, res.rows[0].departmentalGift)
          this.customCardSum.storedValuePrincipal = math.add(res.rows[0].groupPrincipal, res.rows[0].companyPrincipal,
            res.rows[0].departmentalPrincipal)
          this.customCardSum.storedValueGift = math.add(res.rows[0].groupGift, res.rows[0].companyGift, res.rows[0].departmentalGift)
          this.customCardSum.deposit = res.rows[0].deposit
          this.customCardSum.advancePayment = res.rows[0].advancePayment
        }
      })
    },
    dispaly() {
      if (this.$route.query.display === undefined) {
        this.displays = !this.displays
      }
    },
    // 已到院
    AccessRecord() {
      this.$api.modules.netPower.returnVisitHospitalList({ id: this.ids }).then((res) => {
        if (res) {
          this.huifang = res.rows
        }
      })
    },
    // 未到院
    ReturnVisit() {
      this.$api.modules.netPower.returnVisitPlan({ id: this.ids }).then((res) => {
        if (res) {
          this.weihuifang = res.rows
        }
      })
    },
    // 子传父组件
    changge() {
      this.recordslist()
    },
    // 当点击相对应的tab栏后调用组件的方法
    but(tab) {
      if (tab.index === '1') {
        this.$refs.hu.Comethehospital(this.ids)
      } else if (tab.index === '2') {
        this.$refs.CardSum.getCustomCardSum(this.ids)
      } else if (tab.index === '4') {
        this.$refs.con.Comethehospital(this.ids)
      } else if (tab.index === '5') {
        this.$refs.table.getdata(this.ids)
      } else if (tab.index == '6') {
        this.$refs.member.search(this.ids)
      }
    },
    // 列表
    recordslist() {
      const id = this.$route.query.id
      this.showDataDialog = true
      this.$api.user.recordlist({ id: id }).then(res => {
        if (res) {
          this.recorlist = res.rows
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 临客预约记录列表
    ReservationForm() {
      const customId = this.$route.query.id
      this.$api.user.customerReservationForm(customId).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.dsingleTime = (item.dsingleTime.toString()).replace('T', ' ')
            item.appointmentTime = (item.appointmentTime.toString()).replace('T', ' ')
          })
          this.tionform = res.data
        }
      })
    },
    userlist() {
      const numberId = this.$route.query.id
      this.$api.user.usrtlist({ id: numberId }).then(res => {
        if (res) {
          /**
            * @author 李尚
            * @date 12/5/2022
            * @Description: 分别拿到正客和临客标签
          */
          const obj = res.rows.filter(item => {
            return item.customerType === 1
          })
          this.objitem = obj
          const ite = res.rows.filter(item => {
            return item.customerType !== 1
          })
          this.labelTypeName = ite
        }
      })
    },
    // 临客消息
    // Followrecord() {
    //   let followId = this.$route.query.id
    //   this.$api.modules.netPower.queryBookCustomerList({ id: followId}).then(res => {
    //     if(res) {
    //       this.follow = res.rows[0]
    //     }
    //   })
    // },
    customerlabel() {
      //  把所有的值都打印出来了
      const id = this.$route.query.id
      this.$api.user.getinfo(id).then(res => {
        if (res) {
          console.log(res,'dsadgagsd')
          localStorage.setItem('birthday',res.data.birthday)
          this.titles = res.data
          this.from = res.data
          if (res.data.isReachCourtyard == '1') {
            this.noHospital = res.data.isReachCourtyard
          } else {
            this.noHospital = '0'
          }
        }
      })
    },
    // 次数
    totalConsumptionTimes() {
      //  把所有的值都打印出来了
      const id = this.$route.query.id
      this.$api.user.totalConsumptionTimes(id).then(res => {
        if (res) {
          this.titles = { ...this.titles, 'hehe': res.data }
          this.$refs.CardSum.customCardSum1 = res.data
        }
      })
    },

    ccustom(str) {
      const obj = this.dict.type.sys_user_sex.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    remode() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  /*background-color: #56dbb8;*/
}
.divbor{
  width: 49%;
  background-color: #ffffff;
}
.titme{
  height: 40px;
  width: 100%;
  line-height: 40px;
  padding-left: 10px;
  font-size: 14px;
  background-color: #ebfaff
}
.customerInfo-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .customerInfo-head {
    font-size: 14px;
    margin-left: 5px;
    span {
      margin: 0 6px;
      &:nth-child(1) {
        font-weight: 700;
        font-size: 16px;
        font-family: "Verdana", "Tahoma", "Lucida Grande", "Microsoft YaHei",
          "Hiragino Sans GB", sans-serif;
      }
    }
  }
  .customerInfo-content {
    padding: 10px;
    box-sizing: border-box;
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
