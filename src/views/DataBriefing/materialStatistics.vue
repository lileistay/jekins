<template>
  <!-- 物资数据统计分析 -->
  <div>
    <el-row>
      <el-col :span="2">
        <p>&nbsp;</p>
      </el-col>
      <el-col :span="20">
        <el-card shadow="hover" style="margin-top: 20px">
          <div class="search">
            <span>售出情况分析图</span>
            <span style="margin-left: 30px;font-size: 14px">物资名称：</span>
            <span style="color: #5f94de;font-size: 14px">{{materialName}}</span>
            <div style="display: flex;flex-wrap: nowrap;float: right;padding:0 40px">
              <span class="span">统计周期：</span>
              <el-date-picker
                v-model="statisticTime"
                size="mini"
                class="inputWidth"
                type="datetimerange"
                align="right"
                unlink-panels
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
                @change="getData"
              />
              <el-button
                size="mini"
                :class="{ buttonbg: statisticType === 'day' }"
                style="height: 25px;margin-left: 30px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none;"
                @click="statisticType = 'day'"
              >日
              </el-button>
              <el-button
                size="mini"
                :class="{ buttonbg: statisticType === 'month' }"
                style=" height: 25px;border-radius: 0 0px 0px 0;border-left: none;border-right: none;"
                @click="statisticType = 'month'"
              >月
              </el-button>
              <el-button
                size="mini"
                :class="{ buttonbg: statisticType === 'year' }"
                style="height: 25px; margin-left: -10px;border-radius: 0 8px 8px 0;border-left: none;"
                @click="statisticType = 'year'"
              >年
              </el-button>
            </div>
          </div>
          <!--      <div class="num">{{ 12 |numberToCurrency }}</div>-->
          <div v-if="trendShow" id="trend" style="width:100%;height: 450px;margin-top:35px;" />
          <div v-else style="width:100%;height: 450px;margin-top:35px;text-align: center;line-height: 450px;">
            统计周期内暂无销售数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="2" />
    </el-row>
  </div>
</template>

<script>

import { monthData, monthLater, weekLater, yearLater } from '@/utils/time'
import * as echarts from 'echarts'
import macarons2 from 'echarts/theme/macarons2'

export default {
  name: 'MaterialStatistics',
  dicts: [],
  data() {
    return {
      materId: null,
      trendShow: false,
      materialName:"",
      // statisticTypes: [
      //   { label: '年', value: 'year' },
      //   { label: '月', value: 'month' },
      //   { label: '日', value: 'day' }
      // ],
      // 统计方式默认为日
      statisticType: 'day',
      // 统计周期默认为本月
      statisticTime: monthData(),
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '一周内',
            onClick(picker) {
              picker.$emit('pick', weekLater(-1).reverse())
            }
          },
          {
            text: '一月内',
            onClick(picker) {
              picker.$emit('pick', monthLater(-1).reverse())
            }
          },
          {
            text: '三月内',
            onClick(picker) {
              picker.$emit('pick', monthLater(-3).reverse())
            }
          },
          {
            text: '一年内',
            onClick(picker) {
              picker.$emit('pick', yearLater(-1).reverse())
            }
          }
        ]
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
    deptId() {
      this.getData()
    },
    statisticType() {
      this.getData()
    }
  },
  created() {
    this.materId = this.$route.query.materId
    this.materialName=this.$route.query.materialName
    this.deptId = this.$store.getters.departmentId
    this.getData()
  },
  methods: {
    getData() {
      const data = {
        materId: this.materId,
        statisticType: this.statisticType,
        startTime: this.statisticTime[0],
        endTime: this.statisticTime[1],
        deptId:this.deptId,
      }
      this.$api.storageStatistic.getDrugReceiveStatistics(data).then(res => {
        if (res.data.data.length > 0) {
          this.trendShow = true

          this.$nextTick(function() {
            const whole = echarts.init(document.getElementById('trend'), 'macarons2')
            const option = {
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: res.data.data.flatMap(item => [item.xtime])
              },
              toolbox: {
                show: true,
                feature: {
                  dataView: { readOnly: false },
                  magicType: { type: ['line', 'bar'] },
                  saveAsImage: {}
                }
              },
              tooltip: {
                trigger: 'axis'
              },
              yAxis: {
                type: 'value'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              series: [
                {
                  name: '销量',
                  data: res.data.data.flatMap(item => [item.number]),
                  type: 'line',
                  smooth: true,
                  label: {
                    show: true,
                    position: 'top'
                  }
                }
              ]
            }
            whole.setOption(option)
            window.addEventListener('resize', function() {
              whole.resize()
            })
          })
        } else {
          this.trendShow = false
          echarts.dispose(document.getElementById('trend'))
          this.$forceUpdate()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

// 激活按钮的背景
.buttonbg {
  background-color: rgb(242, 242, 242);
  color: #272727;
}
</style>
