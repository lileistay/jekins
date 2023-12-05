<template>
  <!--首页-->
  <div style="padding: 30px 20px 5px 20px;background: #f8f8f8;">
    <!-- <el-scrollbar class="el-scrollbar"> -->
    <div class="header">
      <div class="sale">
        <div class="titme">
          <div style="float: left">{{ this.cs }}销售金额(元)</div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none;"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style=" height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>

        </div>
        <p class="much">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.benyue)" :duration="1000" :decimals="0">
          </CountTo>
        </p>
        <!-- <span>{{ceshi.benyue}},{{ceshi.qunian}}</span> -->
        <p class="percentage" style="margin-top: 26px">
          <span v-if="item.with === 0">月同比: {{ item.with }}％</span>
          <span v-else>月同比:<i v-if="item.with < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.with > 0"
              class="el-icon-caret-top redicon" /> {{ item.with }}％</span>&nbsp;
          <span v-if="isNaN(item.ring)">月环比: <i class="down" /> 0％</span>
          <span v-else>月环比: <i v-if="item.ring < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.ring > 0"
              class="el-icon-caret-top redicon" />{{ item.ring<0?-(item.ring):item.ring }}％</span>
        </p>
      </div>

      <div class="sale">
        <div class="titme">
          <div style="float: left">上门/人次</div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none;"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style="height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>
        </div>
        <p class="much">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.dealPeople)" :duration="1000" :decimals="0">
          </CountTo>
        </p>
        <div style="margin-top: 10px">
          <img style="width: 100%; height: 100%;" :src="indexs">
        </div>
      </div>
      <div class="sale">
        <div class="titme">
          <div style="float: left">本{{ this.cs }}成交</div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style="height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>
        </div>
        <p class="much">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.benpopr)" :duration="1000" :decimals="0">
          </CountTo>
        </p>
        <p class="percentage" style="margin-top: 26px">
          <span v-if="item.withs === 0">月同比: <i v-if="item.withs < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.withs > 0"
              class="el-icon-caret-top redicon" />{{ item.withs }}％</span>
          <span v-else>月同比:<i v-if="item.withs < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.withs > 0"
              class="el-icon-caret-top redicon" /> {{ item.withs }}％</span>&nbsp;
          <span v-if="item.ring === 0">月环比:{{ item.ring }}％</span>
          <span v-else>月环比: <i v-if="item.rings < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.rings > 0"
              class="el-icon-caret-top redicon" />{{ item.rings<0?-(item.rings):item.rings }}％</span>
        </p>
      </div>

      <div class="sale">
        <!--        <div id="Assembly" style="display: flex; float: right; width: 80px;height: 80px;margin-top: 20px; margin-right: 30px;" />-->
        <div class="titme">
          <div style="float: left">总成交率</div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style="height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>
        </div>
        <p class="much">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.proportion)" :duration="1000" :decimals="0">
          </CountTo>
          %
        </p>
        <p class="percentage" style="margin-top: 26px">
          <span v-if="item.withnew === 0">月同比: <i v-if="item.withnew < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.withnew > 0"
              class="el-icon-caret-top redicon" />{{ item.withnew }}％</span>
          <span v-else>月同比:<i v-if="item.withnew < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.withnew > 0"
              class="el-icon-caret-top redicon" /> {{ item.withnew }}％</span>&nbsp;
          <span v-if="item.ring === 0">月环比:{{ item.ring }}％</span>
          <span v-else>月环比: <i v-if="item.newring < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.newring > 0"
              class="el-icon-caret-top redicon" /> {{ item.newring<0?-(item.newring):item.newring }}％</span>
        </p>
      </div>
      <div class="sale">
        <div class="titme">
          <div style="float: left">客单价</div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style="height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>
        </div>
        <p class="much">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.single)" :duration="1000" :decimals="0">
          </CountTo>
        </p>
        <p class="percentage" style="margin-top: 26px">
          <span v-if="item.newwith === 0">月同比: <i v-if="item.newwith < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.newwith > 0"
              class="el-icon-caret-top redicon" /> {{ item.newwith }}％</span>
          <span v-else>月同比:<i v-if="item.newwith < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.newwith > 0"
              class="el-icon-caret-top redicon" /> {{ item.newwith }}％</span>&nbsp;
          <span v-if="item.ring === 0">月环比:{{ item.ring }}％</span>
          <span v-else>月环比: <i v-if="item.newrings < 0" class="el-icon-caret-bottom greenicon" /> <i v-if="item.newrings > 0"
              class="el-icon-caret-top redicon" />{{ item.newrings<0?-(item.newrings):item.newrings }}％</span>
        </p>
      </div>
    </div>
    <div class="header">
      <div class="achievement1">
        <div class="briefing_header">
          <div style="font-size: 14px;margin-left: 20px;margin-top: 10px;font-weight: bold;">数据简报</div>
          <div>
            <el-form :inline="true" :model="form" size="mini" class="form">
              <el-form-item>
                <el-select filterable v-model="form.briefing" placeholder="请选择" style="width: 150px;" @change="company">
                  <el-option label="公司简报" value="deptId" />
                  <!-- <el-option label="部门简报" value="departmentId" />
                    <el-option label="我的简报" value="createuserId" /> -->
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select filterable v-model="form.time" placeholder="请选择" style="width: 150px;" @change="timeDay">
                  <el-option label="今天" value="day" />
                  <el-option label="昨天" value="yesterday" />
                  <el-option label="本周" value="thisWeek" />
                  <el-option label="上周" value="lastWeek" />
                  <el-option label="本月" value="thisMonth" />
                  <el-option label="上月" value="lastMonth" />
                  <el-option label="本季度" value="thisQuarter" />
                  <el-option label="上季度" value="lastQuarter" />
                  <el-option label="今年" value="thisYear" />
                  <el-option label="去年" value="lastYear" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div style="width: 100%;height: 87%;">
          <div class="newOld" @click="briefingRouteJump('newlyAdded')">
            <p class="item">新增临客</p>
            <p class="muchitem"> {{ cusmer.newCustomers | numberToCurrency }} </p>
          </div>
          <div class="newOld" @click="briefingRouteJump('newlyArrive')">
            <p class="item">初诊人数</p>
            <p class="muchitem">{{ cusmer.newCustomersdz | numberToCurrency }}</p>
          </div>
          <div class="newOld">
            <p class="item">新客成交率</p>
            <p class="muchitem">{{ rate }}%</p>
          </div>
          <div class="newOld">
            <p class="item">新客客单</p>
            <p class="muchitem">{{ Guest | numberToCurrency }}</p>
          </div>
          <div class="newOld" @click="briefingRouteJump('followUp')">
            <p class="item">新客二次</p>
            <p class="muchitem">{{ cusmer.followUp | numberToCurrency }}</p>
          </div>
          <div class="newOld" @click="briefingRouteJump('oldArrive')">
            <p class="item">老客到诊</p>
            <p class="muchitem">{{ cusmer.oldCustomers | numberToCurrency }}</p>
          </div>
          <div class="newOld">
            <p class="item">老客成交率</p>
            <p class="muchitem">{{ sutrate }}%</p>
          </div>
          <div class="newOld">
            <p class="item">老客客单</p>
            <p class="muchitem">{{ sutGuest | numberToCurrency }}</p>
          </div>
        </div>
      </div>
      <!--个人业绩排行-->
      <div class="achievement1">
        <personalPerformance style="width: 100%; height: 99%;" />
      </div>
    </div>
    <!--整体趋势-->
    <div class="header">
      <div class="achievement2" style="height: 500px;width:98%">
        <overallTrend style=" " />
      </div>
    </div>
    <div class="header">
      <!--              业绩分布排行-->
      <div class="achievement" style="height:400px">
        <distribution style="width: 100%; height: 98%;" />
      </div>

      <!--      产品售卖排行-->
      <div class="achievement" style="height: 400px">
        <salesRanking style="width: 100%; height: 99%;" />
      </div>
    </div>
    <div class="header" style="margin-top: 20px;">
      <!--      业绩趋势-->
      <div class="achievement">
        <performanceTrend style="width: 100%; height: 99%;" />
      </div>
      <!--      销售漏斗-->
      <div class="achievement">
        <funnel style="width: 100%; height: 99%;" />
      </div>
    </div>
    <div class="header">
      <div class="achievement" style="height:400px">
        <distribution1 style="width: 100%; height: 98%;" />
      </div>
      <div class="achievement" style="height:400px;display: flex;align-items: center;justify-content: center;">

        <bargain style="width: 100%; height: 99%;" />
        <!-- <h2>待升级。。。</h2> -->
      </div>
    </div>
    <div style="width: 100%; height: 20px;" />
    <!--修改密码-->
    <el-dialog title="个人中心" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <personalCenter @signout="signout" />
      <span slot="footer" class="dialog-footer">
        <!--        <el-button size="mini" type="primary" @click="dialogVisible = false">确&nbsp;定</el-button>-->
      </span>
    </el-dialog>
    <!-- </el-scrollbar> -->
    <div>

    </div>

  </div>
</template>

<script>

import funnel from '@/views/index/funnel'

import { math } from '@/utils/math'
// import data from '@/api/sysManger/dict/data'
import personalCenter from '@/views/SystemManagement/PersonalCenter'
import distribution from '@/views/index/distribution'
import distribution1 from '@/views/index/distribution1'
import performanceTrend from '@/views/index/performanceTrend'
import salesRanking from '@/views/index/salesRanking'
import overallTrend from '@/views/index/overallTrend'
import personalPerformance from '@/views/index/personalPerformance'
import bargain from '@/views/index/bargain'
import CountTo from "vue-count-to";
import { thisQuarter } from '../../utils/time'

export default {
  components: { CountTo, personalCenter, funnel, distribution, distribution1, personalPerformance, performanceTrend, salesRanking, overallTrend,bargain },
  data() {
    return {
      cs: '月',
      id: '',
      timer: "",
      ws: "",
      ceshi: "",
      // 写成组件，不要再一个页面写一堆
      time: 0,
      increase: 4,
      messageList: [],
      Guest: 0, // 新客客单
      rate: 0, // 新客成交率
      sutGuest: 0, // 老客客单
      sutrate: 0, // 老客成交率
      dialogVisible: false, // 隐藏个人中心
      indexs: require('@/assets/index/index_bl.png'),
      item: {
        benyue: 0,
        benpopr: 0,
        with: 0,
        ring: 0,
        dealPeople: 0,
        proportion: 0, // 比例
        single: 0, // 客单,
        withs: 0,
        rings: 0,

      },
      hospital: '',
      // 数据简报
      form: {
        briefing: 'deptId',
        time: 'day'
      },
      cusmer: {},
      burnoverRate: 0
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
    },
    avatar: {
      get() {
        return this.$store.getters.avatar
      },
      set(val) {
        val = this.$store.getters.avatar
      }
    },
    homepage: {
      get() {
        return this.$store.getters.Homepage
      },
      set(val) {
        val = this.$store.getters.Homepage
      }
    }


  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getDate()
      this.judgePassword()
      this.company()
      // console.log(this.item.ring, '哈哈')
    },
    avatar(val) {
      // alert('dshajsa')
    },
    homepage(newv) {
      this.getDate();
    }

  },
  created() {
    let that = this;

    this.$route.query.judgePassword
    this.deptId = this.$store.getters.departmentId
    this.homepage = this.$store.getters.Homepage
    this.getDate();
    this.judgePassword();
    this.company();
  },
  mounted() {

  },
  methods: {
    jump() {
      let that = this;
      this.newjump = setInterval(function () {
        that.ws.send('心跳检测');
      }, 1000 * 60)
    },
    beforedestroyed() {
      alert('dasdh')
    },
    // 数据简报点击路由跳转
    briefingRouteJump(val) {
      if (val === 'newlyAdded') {
        // 新增客户
        this.$router.push({ name: 'NewlyAddedCustomerBriefing', params: { time: this.form.time } })
      } else if (val === 'newlyArrive') {
        // 新客首次
        this.$router.push({ name: 'customerArrive', params: { time: this.form.time, customerType: '1', isSecondary: '1' } })
      } else if (val === 'oldArrive') {
        // 老客到诊
        this.$router.push({ name: 'customerArrive', params: { time: this.form.time, customerType: '2' } })
      } else if (val === 'followUp') {
        // 新客二次
        this.$router.push({ name: 'customerArrive', params: { time: this.form.time, customerType: '1', isSecondary: '2' } })
      }
    },
    newOldCus() {
      // 节流
      setTimeout(() => {
        this.$message.warning('该功能正在升级中，请稍后......')
      }, 1000)
      // this.$router.push({ path: 'dataDriefingBetails' })
    },
    // 日
    day(index) {
      this.cs = '日'
      if (index === 3) {
        this.time = index
        this.increase = 0
      }
      const datas = {
        deptId: this.deptId,
        type: 'day'
      }
      this.$api.deptId.fomePageStatistics(datas).then(res => {
        if (res) {
          this.item.benpopr = res.data.totalPeople // 本月成交
          // 判断 俩个数都不能等于零
          if (res.data.totalPeople === 0 && res.data.dealPeople === 0) {
            this.item.proportion = 0
          } else {
            this.item.proportion = math.multiply(math.divide(res.data.totalPeople, res.data.dealPeople), 100).toFixed(0) // 总成交率
          }
          // 判断 俩个数都不能等于零
          if (res.data.benyue === 0 && res.data.dealPeople === 0) {
            this.item.single = 0
            this.item.with = 0;
            this.item.ring = 0;
          } else {
            // console.log(res.data.benyue)
            // console.log(res.data.dealPeople)
            if(res.data.totalPeople==0){
              this.item.single=0;
            }else{
              this.item.single = math.divide(res.data.benyue, res.data.totalPeople).toFixed(0) // 客单价
            }
            
          }
          this.item.benyue = res.data.benyue.toFixed(0) // 日销售金额(元)
          this.item.dealPeople = res.data.dealPeople // 上门/人
          // //本日销售金额同环比
          // if (res.data.qunian == 0) {
          //   this.item.with = this.newdecimals(res.data.benyue);
          //   this.item.ring = '100'
          // } else {
          //   this.newdecimals(((res.data.benyue - res.data.qunian)) / (res.data.qunian));
          //   this.item.ring = (((res.data.benyue - res.data.shangyue) / res.data.shangyue) * 100).toFixed(0)
          // }
          // //本月成交同月环比
          // if (res.data.lasTtotalPeople == 0) {
          //   this.item.withs = this.newdecimals(res.data.totalPeople);
          //   this.item.rings = '100';
          // } else {
          //   this.item.withs = this.newdecimals(((res.data.totalPeople - res.data.lasTtotalPeople)) / (res.data.lasTtotalPeople));
          //   this.item.rings = (((res.data.totalPeople - res.data.lasTtotalPeople) / res.data.lasTtotalPeople) * 100).toFixed(0)
          // }

          // //总成交率同月环比
          // if (res.data.lasTdealPeople == 0) {
          //   this.item.withnew = this.item.proportion;
          //   this.item.newring = '100'
          // } else {
          //   this.item.withnew = this.newdecimals(((this.item.proportion / 100) - (res.data.lasTtotalPeople - res.data.lasTdealPeople) / (res.data.lasTdealPeople))) * 100;
          //   this.item.newring = (((res.data.totalPeople / res.data.dealPeople) - (res.data.uPtotalPeople / res.data.uPdealPeople)) / (res.data.uPtotalPeople / res.data.uPdealPeople)) * 100
          // }

          // //客单价同月环比
          // if (res.data.lasTtotalPeople == 0) {
          //   this.item.newwith = this.newdecimals(this.item.single);
          //   this.item.newrings = '100'
          // } else {
          //   this.item.newwith = (((res.data.benyue / res.data.totalPeople) - (res.data.qunian / res.data.lasTtotalPeople)) / (res.data.qunian / res.data.lasTtotalPeople)) * 100
          //   this.item.newrings = (((res.data.benyue / res.data.totalPeople) - (res.data.shangyue / res.data.uPtotalPeople)) / (res.data.shangyue / res.data.uPtotalPeople)) * 100
          // }

          // 计算月同比 月环比
          if (res.data.qunian || res.data.shangyue) {

            if (typeof math.multiply(math.divide(res.data.benyue, res.data.qunian), 100).toFixed(0) === 'number') {
              this.item.with = 0
            } else {

              this.item.with = math.multiply(math.divide(res.data.benyue, res.data.qunian), 100).toFixed(0) // 同比
            }

            this.item.ring = math.multiply(math.divide(math.subtract(res.data.benyue, res.data.shangyue), res.data.shangyue), 100).toFixed(0) // 环比
          }else{
            // this.item.with=res.data.benyue;
            if(res.data.totalPeople==0){
              this.item.withs=0;
              this.item.rings=0;
              this.item.withnew=0;
              this.item.newring=0;
              this.item.newwith=0;
              this.item.newrings=0;
            }
            if(res.data.benyue>0){
              this.item.ring=100
            }
            if(res.data.totalPeople>0){
                this.item.withs=res.data.totalPeople;
                this.item.rings=100;

            }
            if(res.data.totalPeople>0&&res.data.dealPeople>0){
                this.item.withnew=this.item.proportion;
                this.item.newring=100;
            }
            if(res.data.benyue>0&&res.data.totalPeople>0){
                this.item.newwith=this.item.single;
                this.item.newrings=100;
            }

          }
          // ========
          if (res.data.burnoverRate === 0 || res.data.burnoverRate === undefined) {
            this.burnoverRate = 0
          } else {
            this.burnoverRate = math.multiply(res.data.burnoverRate, 100).toFixed(0)
          }
        }
      })
    },

    // 月
    month(index) {
      this.cs = '月'
      if (index === 4) {
        this.increase = index
        this.time = 0
      }
      this.getDate()
    },
    // 个人中心
    judgePassword() {
      if (this.$route.query.judgePassword === 1) {
        this.dialogVisible = true
        this.$message('密码过于简单请修改密码')
      }
    },
    signout() {
      this.dialogVisible = false
    },
    // 表头 计算
    getDate() {
      const datas = {
        deptId: this.deptId,
        type: 'month'
      }
      this.$api.deptId.fomePageStatistics(datas).then(res => {
        this.ceshi = res.data
        if (res) {
          // 判断 俩个数都不能等于零
          if (res.data.totalPeople === 0 && res.data.dealPeople === 0) {
            this.item.proportion = 0
          } else {
            this.item.proportion = math.multiply(math.divide(res.data.totalPeople, res.data.dealPeople), 100).toFixed(0) // 总成交率
          }
          // 判断 俩个数都不能等于零
          if (res.data.benyue === 0 && res.data.dealPeople === 0) {
            this.item.single = 0
          } else {
            // console.log(res.data.benyue)
            // console.log(res.data)
            if(res.data.totalPeople==0){
              this.item.single=0
            }else{
              this.item.single = math.divide(res.data.benyue, res.data.totalPeople).toFixed(0) // 客单价
            }
          
            // this.item.newwith =res.data.qunian==0?((res.data.benyue).toFixed(0)):math.multiply(math.divide(res.data.benyue, res.data.qunian), 100).toFixed(2) // 同比
          }
          // res.data.benyue=0
          this.item.benpopr = res.data.totalPeople // 本月成交
          this.item.benyue = res.data.benyue.toFixed(0) // 月销售金额(元)
          this.item.dealPeople = res.data.dealPeople // 上门/人
          // 计算月同比 月环比

          //月销售金额同月环比
          if (res.data.qunian == 0) {
            this.item.with = this.newdecimals(res.data.benyue);
            if(res.data.benyue==0){
              this.item.ring = '0'  
            }else{      
              if(res.data.shangyue==0){
                this.item.ring
              }else{
                this.item.ring = (((res.data.benyue - res.data.shangyue) / res.data.shangyue) * 100).toFixed(0)
              }                                                                                                                                                              
              
            }
            
          } else {
            this.item.with=this.newdecimals(((res.data.benyue - res.data.qunian)) / (res.data.qunian));
            if(res.data.shangyue==0){
                this.item.ring
              }else{
                this.item.ring = (((res.data.benyue - res.data.shangyue) / res.data.shangyue) * 100).toFixed(0)
              }   
          }
          //本月成交同月环比
          if (res.data.lasTtotalPeople == 0) {
            this.item.withs = this.newdecimals(res.data.totalPeople);
            if(res.data.totalPeople==0){
              this.item.rings = '0';
            }else{
              this.item.rings = (((res.data.totalPeople - res.data.uPtotalPeople) / res.data.uPtotalPeople) * 100).toFixed(0)
            }
           
          } else {
 
            this.item.withs = this.newdecimals(((res.data.totalPeople - res.data.lasTtotalPeople)) / (res.data.lasTtotalPeople));
            this.item.rings = (((res.data.totalPeople - res.data.uPtotalPeople) / res.data.uPtotalPeople) * 100).toFixed(0)
          }
          //总成交率同月环比
          if (res.data.lasTdealPeople == 0) {
            this.item.withnew = this.item.proportion;
            if(this.item.proportion==0){
              this.item.newring = '0'
            }else{
              // this.item.newring = '100'
              this.item.newring = ((((res.data.totalPeople / res.data.dealPeople) - (res.data.uPtotalPeople / res.data.uPdealPeople)) / (res.data.uPtotalPeople / res.data.uPdealPeople)) * 100).toFixed(0)
            }
           
          } else {
            this.item.withnew = this.newdecimals(((this.item.proportion / 100) - (res.data.lasTtotalPeople - res.data.lasTdealPeople) / (res.data.lasTdealPeople))) * 100;
            this.item.newring = ((((res.data.totalPeople / res.data.dealPeople) - (res.data.uPtotalPeople / res.data.uPdealPeople)) / (res.data.uPtotalPeople / res.data.uPdealPeople)) * 100).toFixed(0)
          }
          //客单价同月环比
          if (res.data.lasTtotalPeople == 0&&res.data.qunian==0) {
            this.item.newwith = this.newdecimals(this.item.single);
            console.log(this.item.single,'呼啦啦')
            if(this.item.single==0){
              this.item.newrings = '0'
            }else{
              // this.item.newrings = '100'
              this.item.newrings = ((((res.data.benyue / res.data.totalPeople) - (res.data.shangyue / res.data.uPtotalPeople)) / (res.data.shangyue / res.data.uPtotalPeople)) * 100).toFixed(0)
            }
          
          } else {
            if(res.data.qunian==0){
              this.item.newwith = this.newdecimals(this.item.single);
            this.item.newrings = '100'
            }else{
              this.item.newwith = (((res.data.benyue / res.data.totalPeople) - (res.data.qunian / res.data.lasTtotalPeople)) / (res.data.qunian / res.data.lasTtotalPeople)).toFixed(0)
            this.item.newrings = ((((res.data.benyue / res.data.totalPeople) - (res.data.shangyue / res.data.uPtotalPeople)) / (res.data.shangyue / res.data.uPtotalPeople)) * 100).toFixed(0)
            }

          }

          if (res.data.burnoverRate === 0 || res.data.burnoverRate === undefined) {
            this.burnoverRate = 0
          } else {
            this.burnoverRate = math.multiply(res.data.burnoverRate, 100).toFixed(0)
          }
        }
      })
    },

    //判断是否有小数
    newdecimals(val) {
      if (String(val).includes('.')) {
        return (val.toFixed(0))
      } else {
        return val
      }
    },
    // 数据简报
    company() {
      var data = {
        briefingType: this.form.briefing,
        typeId: this.form.briefing === 'deptId' ? this.deptId : null,
        timeType: this.form.time
      }
      this.$api.deptId.dataBriefing(data).then(res => {
        if (res) {
          this.cusmer = res.data
          if (res.data.newCustomerscj === 0 && res.data.newCustomersdz === 0) {
            this.Guest = 0
            this.rate = 0
          } else {
            this.rate = math.multiply(math.divide(res.data.newCustomerscj, res.data.newDz), 100).toFixed(0)
            // 新客单 = 成交金额 除于 成交人数
            if (res.data.newCustomersMoney === 0 && res.data.newCustomerscj === 0) {
              this.Guest = 0
            } else {
              // console.log(res.data.newCustomersMoney)
              // console.log(res.data.newCustomerscj)
              //设置新客客单
              this.Guest = res.data.newCustomerscj==0?res.data.newCustomersMoney:math.divide(res.data.newCustomersMoney, res.data.newCustomerscj).toFixed(0) // 新客客单
            }
          }
          if (res.data.oldCustomerscj === 0 && res.data.oldCustomers === 0) {
            this.sutGuest = 0
            this.sutrate = 0
          } else {
            this.sutrate = math.multiply(math.divide(res.data.oldCustomerscj, res.data.oldCustomers), 100).toFixed(0)
            this.sutGuest = math.divide(res.data.oldCustomersMoney, res.data.oldCustomers).toFixed(0) // 老客客单
          }
        }
      })
    },
    timeDay() {
      var data = {
        briefingType: this.form.briefing,
        typeId: this.form.briefing === 'deptId' ? this.deptId : null,
        timeType: this.form.time
      }
      this.$api.deptId.dataBriefing(data).then(res => {
        if (res) {
          this.cusmer = res.data
          if (res.data.newCustomerscj === 0 && res.data.newCustomersdz === 0) {
            this.Guest = 0
            this.rate = 0
          } else {
            this.rate = math.multiply(math.divide(res.data.newCustomerscj, res.data.newDz), 100).toFixed(0)
            // 客单 = 成交金额 除于 成交人数
            if (res.data.newCustomersMoney === 0 && res.data.newCustomerscj === 0) {
              this.Guest = 0
            } else {
              this.Guest = math.divide(res.data.newCustomersMoney, res.data.newCustomerscj).toFixed(0) // 新客客单
            }
          }
          if (res.data.oldCustomerscj === 0 && res.data.oldCustomers === 0) {
            this.sutGuest = 0
            this.sutrate = 0
          } else {
            this.sutrate = math.multiply(math.divide(res.data.oldCustomerscj, res.data.oldCustomers), 100).toFixed(0)
            // 客单 = 成交金额 除于 成交人数
            this.sutGuest = math.divide(res.data.oldCustomersMoney, res.data.oldCustomers).toFixed(0) // 老客客单
          }
        }
      })
    }
  }
}
</script>
<style scoped>
/*箭头*/
.down {
  color: red;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

.deal {
  margin-left: 15px;
  margin-top: 20px;
}
</style>
<style scoped lang="scss">
// 图标颜色 月同比 月环比
.greenicon {
  color: green;
}

.redicon {
  color: red;
}

.newOld {
  float: left;
  width: 25%;
  height: 50%;
  cursor: pointer;
}

// 修改 样式布局 6次luan de ya pi
.bg {
  background-color: rgb(242, 242, 242);
  color: #272727;
}

.header1 {
  justify-content: space-around;
  //display: flex;
  //justify-content: space-evenly;
  margin-left: 10px;
  padding: 0 8%;
  overflow: hidden;

  .sale {
    width: 274px;
    height: 150px;
    margin: 0 10px;
    background-color: #ffffff;
    border-radius: 6px;
    margin-bottom: 10px;
    float: left;
    border: 1px solid #e5e3e3;

    .titme {
      margin-top: 20px;

      font-size: 14px;
      color: #8f9295;
      padding: 0px 21px;
    }

    .much {
      margin-top: 10px;
      margin-left: 25px;
      font-size: 25px;
      font-weight: 800;
    }

    .percentage {
      margin-top: 15px;
      margin-left: 25px;
      font-size: 13px;
    }
  }

  p {
    //font-weight: 650;
    font-size: 16px;
  }

  .briefing_header {
    height: 40px;
    width: 100%;
    background-color: #F9F9F9;
    border-bottom: 1px solid #e5e3e3;
    //border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    //padding: 0 100px;
  }

  .form {
    margin-top: 5px;
  }

  .item {
    margin-top: 55px;
    text-align: center;
    font-size: 14px;
    color: #8f9295;
  }

  .muchitem {
    //margin-top: 15px;
    text-align: center;
    font-size: 28px;
    color: #686868;
  }

  .achievement {
    float: left;
    margin-left: 10px;
    width: 48%;
    height: 400px;
    margin-top: 30px;
    background-color: #ffffff;
    border: 1px solid #e5e3e3;
  }
}

.header {
  //justify-content: space-between;
  display: flex;
  justify-content: space-evenly;
  padding: 0 8%;
  overflow: hidden;

  .sale {
    width: 274px;
    height: 150px;
    margin: 0 10px;
    background-color: #ffffff;
    border-radius: 6px;
    margin-bottom: 10px;
    float: left;
    border: 1px solid #e5e3e3;

    .titme {
      font-size: 14px;
      color: #8f9295;
      padding: 21px;
    }

    .much {
      margin-top: 10px;
      margin-left: 25px;
      font-size: 25px;
      font-weight: 800;
    }

    .percentage {
      margin-top: 15px;
      margin-left: 25px;
      font-size: 13px;
    }
  }

  p {
    //font-weight: 650;
    font-size: 16px;
  }

  .briefing_header {
    height: 40px;
    width: 100%;
    background-color: #F9F9F9;
    border-bottom: 1px solid #e5e3e3;
    //border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    //padding: 0 100px;
  }

  .form {
    margin-top: 5px;
  }

  .item {
    margin-top: 55px;
    text-align: center;
    font-size: 14px;
    color: #8f9295;
  }

  .muchitem {
    //margin-top: 15px;
    text-align: center;
    font-size: 28px;
    color: #686868;
  }

  .achievement {
    float: left;
    margin-left: 10px;
    width: 48%;
    height: 400px;
    margin-top: 30px;
    background-color: #ffffff;
    border: 1px solid #e5e3e3;
  }

  .achievement2 {
    margin-left: 10px;
    height: 400px;
    margin-top: 30px;
    background-color: #ffffff;
    border: 1px solid #e5e3e3;
  }

  .achievement1 {
    float: left;
    margin-left: 10px;
    width: 48%;
    height: 360px;
    margin-top: 30px;
    background-color: #ffffff;
    border: 1px solid #e5e3e3;
  }
}

.days {
  margin-right: 20px;
  margin-top: -20px;
}

// 整体趋势
.ztqs {
  height: 450px;
  border-radius: 10px;
  margin-left: 8%;
  margin-top: 10px
}

.dayday {
  margin-right: 5px;
}

.month {
  width: 20px;
  height: 20px;
  background-color: #8f9295;
}

::v-deep .el-dialog__headerbtn .el-dialog__close {
  display: none;
}

::v-deep .el-button+.el-button {
  //display: none;
}

::v-deep .el-button:focus,
.el-button:hover {
  border-color: #1abc9c !important;
  color: #1abc9c;
}
</style>
