<template>
  <!--首页-->
  <div style="padding: 30px 20px 5px 20px;background: #f8f8f8;">
    <!-- <el-scrollbar class="el-scrollbar"> -->
    <div class="header">
      <div class="sale">
        <div class="titme">
          <div style="float: left;position: relative;width: 200px;">
            <img style="width: 20px; height: 20px;margin-top: 5px;position: absolute;" src="@/assets/images/yuyue.png" >
            <span style="margin-left: 25px;margin-top: 5px;position: absolute;">本{{newday}}预约</span></div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none;"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style=" height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>

        </div>
        <p class="much" style="margin-top: 30px;margin-left: 60px;">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.aitData)" :duration="1000" :decimals="0">
          </CountTo>
        </p>
        <!-- <div style="margin-top: 10px">
          <img style="width: 50px; height: 50px;margin-left: 20px;" src="@/assets/images/yuyue.png" >
        </div> -->
      </div>

      <div class="sale">
        <div class="titme">
          <div style="float: left;position: relative;width: 200px;">
            <img style="width: 20px; height: 20px;margin-top: 5px;position: absolute;" src="@/assets/images/arrive.png" >
            <span style="margin-left: 25px;margin-top: 5px;position: absolute;">本{{newday}}到诊</span></div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none;"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style="height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>
        </div>
        <p class="much" style="margin-top: 30px;margin-left: 60px;">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.recData)" :duration="1000" :decimals="0">
          </CountTo>
        </p>
      </div>
      <div class="sale">
        <div class="titme">
          <div style="float: left;position: relative;width: 200px;">
            <img style="width: 20px; height: 20px;margin-top: 5px;position: absolute;" src="@/assets/images/sum.png" >
            <span style="margin-left: 25px;margin-top: 5px;position: absolute;">本{{newday}}数据</span></div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style="height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>
        </div>
        <p class="much" style="margin-top: 30px;margin-left: 60px;">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.shujuData)" :duration="1000" :decimals="0">
          </CountTo>
        </p>
      </div>

      <div class="sale">
        <!--        <div id="Assembly" style="display: flex; float: right; width: 80px;height: 80px;margin-top: 20px; margin-right: 30px;" />-->
        <div class="titme">
          <div style="float: left;position: relative;width: 200px;">

            <img style="width: 20px; height: 20px;margin-top: 5px;position: absolute;" src="@/assets/images/newchange.png" >
            <span style="margin-left: 25px;margin-top: 5px;position: absolute;">预约转化率</span></div>

          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style="height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>
        </div>
        <p class="much" style="margin-top: 30px;margin-left: 60px;">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.proportion)" :duration="1000" :decimals="0">
          </CountTo>
          %
        </p>
      </div>
      <div class="sale">
        <!--        <div id="Assembly" style="display: flex; float: right; width: 80px;height: 80px;margin-top: 20px; margin-right: 30px;" />-->
        <div class="titme">
          <div style="float: left;position: relative;width: 200px;">
            <img style="width: 20px; height: 20px;margin-top: 5px;position: absolute;" src="@/assets/images/moudlechange.png" >
            <span style="margin-left: 25px;margin-top: 5px;position: absolute;">到诊转化率</span></div>
          <div style="display: flex;flex-wrap: nowrap;float: right">
            <el-button size="mini" :class="{ bg: time === 3 }"
              style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none"
              @click="day(3)">日</el-button>
            <el-button size="mini" :class="{ bg: increase === 4 }"
              style="height: 25px;border-radius: 0 8px 8px 0;border-left: none" @click="month(4)">月</el-button>
          </div>
        </div>
        <p class="much" style="margin-top: 30px;margin-left: 60px;">
          <CountTo ref="refcountofore" :start-val="0" :end-val="Number(item.single)" :duration="1000" :decimals="0">
          </CountTo>
          %
        </p>
      </div>
    </div>
    <div class="header">
      <div class="achievement1">
        <div class="briefing_header">
          <div style="font-size: 14px;margin-left: 20px;margin-top: 10px;font-weight: bold;">数据简报</div>
          <img src="@/assets/images/change.png" alt=""
            style="width: 16px;height: 16px;margin-top: 12px;position: absolute;margin-left:90px;cursor: pointer;"
            @click="changebtnover">
          <div>
            <el-form :inline="true" :model="form" size="mini" class="form">
              <el-form-item>
                <el-select filterable v-model="form.briefing" placeholder="请选择" style="width: 150px;" @change="company" disabled>
                  <el-option label="公司简报" value="deptId" />
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
          <div v-if="newchange">
            <el-button plain size="small" @click="btnover('at')" style="margin-left: 30px;margin-top: 5px;">数据</el-button>
            <el-button plain size="small" @click="btnover('ts')" style="margin-top: 5px;">到院</el-button>
            <el-button plain size="small" @click="btnover('yy')" style="margin-top: 5px;">预约</el-button>
            <div id="trend" style="width:100%;height: 325px;margin-left: -57px;margin-top: -11px" />
          </div>
          <div v-else>
            <el-table :data="tableData" :show-summary="true" style="width: 99.9%" :height="Height" ref="newtable">
              <el-table-column prop="channel_name" label="渠道" align="center" height="10">
              </el-table-column>
              <el-table-column prop="allData" label="数据" align="center">
              </el-table-column>
              <el-table-column prop="appointmentData" label="预约" align="center">
              </el-table-column>
              <el-table-column prop="arrivalData" label="已到" align="center">
              </el-table-column>
            </el-table>

          </div>
        </div>
      </div>
      <!--个人业绩排行-->
      <div class="achievement1" style="visibility: hidden;">
        <personalPerformance style="width: 100%; height: 99%;" />
      </div>
    </div>
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
import performanceTrend from '@/views/index/performanceTrend'
import salesRanking from '@/views/index/salesRanking'
import overallTrend from '@/views/index/overallTrend'
import personalPerformance from '@/views/index/personalPerformance'
import CountTo from "vue-count-to";
import * as echarts from 'echarts'
import { thisQuarter } from '../../utils/time'

export default {
  components: { CountTo, personalCenter, funnel, distribution, personalPerformance, performanceTrend, salesRanking, overallTrend },
  data() {
    return {
      getChange: true,
      newday:"月",
      getChangeyy: false,
      getChanges: false,
      Height: 320,
      tableData: [],
      cs: '月',
      newchange: false,
      id: '',
      timer: "",
      ws: "",
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
        shujuData: 0,
        dealPeople: 0,
        proportion: 0, // 比例
        single: 0, // 客单,
        aitData: 0,
        recData: 0

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
      this.company();
      this.timeDay(this.form.time);
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
    this.getDate()
    this.judgePassword()
    this.company();
  },
  mounted() {
    this.timeDay();
  },
  updated() {
    this.$nextTick(function () {
      if (this.$refs.newtable) {
        this.$refs.newtable.doLayout()
      } else {

      }

    })

  },
  methods: {
    changebtnover() {
      this.newchange = !this.newchange;
      this.timeDay(this.form.time);
    },
    btnover(val) {
      if (val == 'at') {
        this.getChange = true;
        this.getChanges = false;
        this.timeDay(this.form.time);
        this.getChangeyy = false
      }
      else if (val == 'ts') {
        this.getChanges = true;
        this.getChange = false;
        this.getChangeyy = false
        this.timeDay(this.form.time);
      }
      else {
        this.getChangeyy = true;
        this.getChange = false;
        this.getChanges = false;
        this.timeDay(this.form.time);
      }



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
      this.newday='日'
      if (index === 3) {
        this.time = index
        this.increase = 0
      }
      const datas = {
        deptId: this.deptId,
        timeType: 'day'
      }
      this.$api.deptId.statisticalHeader(datas).then(res => {
        if (res) {
          this.item.shujuData = res.data[0].shujuData
          this.item.aitData = res.data[0].aitData
          this.item.recData = res.data[0].recData
          if (res.data[0].shujuData == '0') {
            this.item.proportion = '0'
          } else {
            this.item.proportion = ((res.data[0].aitData) / (res.data[0].shujuData) * 100).toFixed(0);
          }
          if (res.data[0].aitData == '0') {
            this.item.single = '0'
          } else {
            this.item.single = ((res.data[0].recData) / (res.data[0].aitData) * 100).toFixed(0);
          }
        }
      })
    },
    // 月
    month(index) {
      this.cs = '月'
      this.newday='月'
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
        timeType: 'thisMonth'
      }
      this.$api.deptId.statisticalHeader(datas).then(res => {
        // console.log(res.data, '黑u黑')
        if (res) {
          // 判断 俩个数都不能等于零
          this.item.shujuData = res.data[0].shujuData
          this.item.aitData = res.data[0].aitData
          this.item.recData = res.data[0].recData;
          this.item.proportion = ((res.data[0].aitData) / (res.data[0].shujuData) * 100).toFixed(0);
          this.item.single = ((res.data[0].recData) / (res.data[0].aitData) * 100).toFixed(0);

        }
      })
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
              this.Guest = math.divide(res.data.newCustomersMoney, res.data.newCustomerscj).toFixed(0) // 新客客单
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
    timeDay(val) {
      var date = {
        deptId: this.deptId,
        timeType: val == undefined ? 'day' : val
      }
      // var date = {
      //   startTime: '2023-03-24',
      //   endTime: '2023-04-24',
      //   deptId: this.deptId,
      //   trendType:'at'
      // }
      this.$api.deptId.customerVisits(date).then(res => {
        if (res) {
          this.tableData = res.data;

          if (!this.newchange) {
            return
          }
          var receTime = [];
          var sumTime = [];
          res.data.forEach(value => {
            receTime.push(value.channel_name);
            if (this.getChange) {
              sumTime.push(value.allData)
            }
            if (this.getChanges) {
              sumTime.push(value.arrivalData)
            }
            if (this.getChangeyy) {
              sumTime.push(value.appointmentData)
            }

          })
          var whole = echarts.init(document.getElementById('trend'))
          const OverallTrend = {
            tooltip: {
              trigger: 'axis',
              formatter: (params => {
                return params[0].data + ''
              })
            },
            legend: {
              x: '46%',
              top: '0%',
              textStyle: {
                fontSize: 12
              }
            },
            grid: {
              top: '15%',
              left: '13%',
              right: '6%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',

              boundaryGap: false,
              data: receTime,


            }],
            yAxis: [{
              type: 'value',
              min: 0,
              splitNumber: 10,

            }],
            series: [
              {
                type: 'line',
                showAllSymbol: true,
                symbol: 'circle',
                symbolSize: 5,
                label: {
                  show: true,
                  itemStyle: {
                    label: { show: true },
                    color: "#49a9ee", //改变折线点的颜色
                    lineStyle: {
                      color: "#49a9ee", //改变折线颜色
                    },
                  },
                  formatter: (params => {
                    return params.data
                  }),
                },

                data: sumTime,
                showSymbol: true,
                areaStyle: {
                  color: '#dbeefc'
                },
                stack: 'Total',
                smooth: true,
                emphasis: {
                  focus: 'series'
                },
              }
            ]
          }
          whole.setOption(OverallTrend)
          window.addEventListener('resize', function () {
            whole.resize()
          })
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
    position: relative;
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

::v-deep .el-table {
  overflow: visible !important;
}

::v-deep .el-table td {
  padding: 10px !important;
  font-size: 5px !important;
}

::v-deep .el-table th {
  padding: 10px !important;
  font-size: 5px !important;
}

::v-deep .el-button {
  height: 30px !important;
  margin-top: 5px !important;
}</style>
