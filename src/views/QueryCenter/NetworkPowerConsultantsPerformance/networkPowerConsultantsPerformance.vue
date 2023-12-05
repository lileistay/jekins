<template>
  <!--  TODO暂时隐藏-->
  <!--网电咨询师业绩统计图-->
  <el-scrollbar>
    <div class="header">
      <div class="top">
        <el-form :model="form" size="mini" label-width="110px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="时间：">
                <el-date-picker v-model="form.time" placeholder="请选择时间" clearable style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名：">
                <el-input v-model="form.name" placeholder="请输入姓名" clearable style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收费单类型：">
                <el-select v-model="form.billType" placeholder="请选择收费单类型" filterable clearable style="width: 100%">
                  <el-option
                    v-for="item in dict.type.billing_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-button type="primary" size="mini">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="float: right;margin-right: 40px" @click="switchChart">
          <span v-if="switchData"><i class="el-icon-s-data" /></span>
          <span v-else><i class="el-icon-s-fold" /></span>
        </div>
      </div>
      <transition name="chart">
        <div v-show="showChart" class="echarts">
          <span class="title">网电咨询师业绩统计图</span>
          <div id="chart" class="chart"></div>
        </div>
      </transition>
      <transition name="table">
        <div v-show="showTable" class="table">
          <sg-table
            ref="table"
          
            size="mini"
            max-height="620"
            :table-data="tableData"
            :columns="columns"
            :pagination="pagination"
            @size-change="sizeChange"
            @current-change="currentChange"
          >
            <div slot="searchBar" class="title">
              <span>网电咨询师业绩统计表</span>
            </div>
          </sg-table>
        </div>
      </transition>
    </div>
  </el-scrollbar>
</template>

<script>
import * as echarts from 'echarts'
import SgTable from '@/components/Table'

export default {
  name: 'NetworkPowerConsultantsPerformance',
  dicts: ['billing_type'],
  components: {
    SgTable
  },
  data() {
    return {
      switchData: true,
      showChart: true,
      showTable: false,
      loadingData: false,
      searchBar: {
        floorNumber: '',
        state: ''
      },
      tableData: [],
      columns: [
        {
          lab: '姓名',
          val: 'roomId'
        },
        {
          lab: '开单业绩',
          val: 'roomId'
        },
        {
          lab: '总人数',
          val: 'roomId'
        },
        {
          lab: '新客首次',
          val: 'roomId'
        },
        {
          lab: '新客二次',
          val: 'roomId'
        },
        {
          lab: '新客',
          val: 'roomId'
        },
        {
          lab: '老客',
          val: 'roomId'
        },
        {
          lab: '成交客户',
          val: 'roomId'
        },
        {
          lab: '实付总额',
          val: 'roomId'
        },
        {
          lab: '正常收费单',
          val: 'roomId'
        },
        {
          lab: '交预约金',
          val: 'roomId'
        },
        {
          lab: '交储值',
          val: 'roomId'
        },
        {
          lab: '交住院押金',
          val: 'roomId'
        },
        {
          lab: '辅助治疗',
          val: 'roomId'
        },
        {
          lab: '检验',
          val: 'roomId'
        },
        {
          lab: '住院结算单',
          val: 'roomId'
        },
        {
          lab: '交储值',
          val: 'roomId'
        },
        {
          lab: '还款单',
          val: 'roomId'
        }
      ],
      pagination: {
        show: true,
        total: 0,
        pageSize: 20,
        pageNum: 1
      },
      form: {}
    }
  },
  created() {

  },
  mounted() {
    const chart = echarts.init(document.getElementById('chart'))
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '1%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['张丽', '李四', '王麻子', '张无忌', '何潇', '吴凤', '张三丰'],
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 0
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '正常收费单',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [862, 1018, 964, 1026, 1679, 1600, 1570]
        },
        {
          name: '交预约金',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '交储值',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [620, 732, 701, 734, 1090, 1130, 1120]
        },
        {
          name: '交住院押金',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '辅助治疗',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '检验',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '住院结算单',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 290, 230, 220]
        },
        {
          name: '交储值卡',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [60, 72, 71, 74, 190, 130, 110]
        },
        {
          name: '还款单',
          type: 'bar',
          barWidth: 5,
          emphasis: {
            focus: 'series'
          },
          data: [62, 82, 91, 84, 109, 110, 120]
        }
      ]
    }
    chart.setOption(option)
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/6/30
     * @Description: 获取数据
    */
    getData() {

    },
    /**
     * @author Nevin
     * @date 2022/6/30
     * @Description: 切换图表
    */
    switchChart() {
      if (this.switchData === true) {
        this.switchData = false
        this.showChart = false
        this.showTable = true
      } else {
        this.switchData = true
        this.showChart = true
        this.showTable = false
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/30
     * @Description: 分页
    */
    sizeChange(e) {
      this.pagination.size = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.page = e[1]
      this.getData()
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  padding: 20px;
  .top {
    width: 100%;
    height: 80px;
  }
  .echarts {
    width: 100%;
    height: 650px;
    text-align: center;
    .title {
      font-size: 18px;
    }
    .chart {
      width: 100%;
      height: 100%;
    }
  }
  .table {
    width: 100%;
    height: 640px;
    text-align: center;
    .title {
      font-size: 18px;
    }
  }
}

.chart-enter-active {
  transition: all .8s
}
.chart-enter, .chart-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
.table-enter-active {
  transition: all .8s
}
.table-enter, .table-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
