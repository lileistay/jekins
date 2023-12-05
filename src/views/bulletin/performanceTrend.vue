<template>
  <!--业绩趋势-->
  <div>
    <div class="briefing_header">
      <div style="font-size: 14px;color: #666;margin-left: 20px;margin-top: 10px;font-weight: bold;">业绩趋势</div>
      <div>
        <el-form :inline="true" :model="form" size="mini">
          <el-form-item>
            <el-select filterable v-model="form.user" placeholder="请选择" style="width: 150px; line-height: 40px" @change="perform">
              <el-option label="公司数据" value="deptId" />
              <!-- <el-option label="部门数据" value="departmentId" />
              <el-option label="我的数据" value="aestheicConsultant" /> -->
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div id="manceTrend" style="width: 100%;height: 100%;" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { math } from '@/utils/math'
import {numberToCurrencyNo} from "../../utils/numberToCurrency";
export default {
  name: 'PerformanceTrend',
  data() {
    return {
      form: {
        user: 'deptId'
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
  watch: {
    deptId(val) {
      this.deptId = val
        this.perform()
    }
  },
  mounted() {
    this.perform()
    // window.onresize = manceTrend.resize
  },
  methods: {
    perform() {
      var data = {
        objectiveType: this.form.user,
          typeId:this.deptId
      }

      this.$api.deptId.moneyTrend(data).then(res => {
        if (res) {
          // console.log(JSON.stringify(res.data),'额')
          var timeDay = []
          var mony = []
          var prop = [];
          for (var i = 1; i <= 12; i++) {
            if (i > 9) {
              timeDay.push(i + '月');
              mony.push('')
              prop.push('')
            } else {
              timeDay.push('0' + i + '月')
              mony.push('')
              prop.push('')
            }

          }
          //伪造假数据模拟真实环境
          // let arr=[{"dateMath":"03","money":2884632.4,"peopleNumber":313},{"dateMath":"06","money":2884632.4,"peopleNumber":313},{"dateMath":"11","money":2884632.4,"peopleNumber":313}];
          res.data.forEach((val, index) => {

            if (val.dateMath[0] == 0) {
              if (val.money) {
                mony[Number(val.dateMath[1] - 1)] = Number(Number(val.money.replace(/[,]/g, ""))).toFixed(0);
                prop[Number(val.dateMath[1] - 1)] =Number(0-Number(val.peopleNumber.replace(/[,]/g, ""))).toFixed(0);
              }
            } else {
              if (val.money) {
                mony[Number(val.dateMath - 1)] = Number(Number(val.money.replace(/[,]/g, ""))).toFixed(0);
                prop[Number(val.dateMath - 1)] = Number(0-Number(val.peopleNumber.replace(/[,]/g, ""))).toFixed(0)
              }

            }
          })
          var manceTrend = echarts.init(document.getElementById('manceTrend'))
          const labelOption = {
            show: true,
            position: 'insideBottom',
            distance: 19,
            align: 'left',
            verticalAlign: 'middle',
            rotate: 90,
              // formatter: '{c}  {name|{a}}',
              formatter:(params=>{
                  return numberToCurrencyNo(params.value)
              }),
            fontSize: 12,
            rich: {
              name: {}
            }
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['业绩', '退款金额']
            },
            xAxis: [
              {
                type: 'category',
                axisTick: { show: false },
                // 月份
                data: timeDay
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '业绩',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                emphasis: {
                  focus: 'series'
                },
                // 蓝色预计销售金额
                data: mony
              },
              {
                name: '退款金额',
                type: 'bar',
                arGap: 0,
                label: labelOption,
                emphasis: {
                  focus: 'series'
                },
                // 概率金额
                data: prop
              }
            ]
          }
          manceTrend.setOption(option)
          window.addEventListener('resize', function () {
            manceTrend.resize()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.briefing_header {
  height: 40px;
  width: 100%;
  background-color: #F9F9F9;
  border-bottom: 1px solid #e5e3e3;
  /*border-radius: 10px 10px 0 0;*/
  display: flex;
  justify-content: space-between;
  /* //padding: 0 100px; */
}
</style>
