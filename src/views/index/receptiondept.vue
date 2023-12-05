<template>
  <!--业绩分布排行-->
  <div>
    <div class="achievement">

      <div id="achievement" style="width: 100%;height: 100%;" />
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { timeFmt } from '@/utils/time'
import { math } from '@/utils/math'
import CountTo from 'vue-count-to'
import {LOG2E, number} from 'mathjs'

export default {
  name: 'Distribution',
  components: { CountTo },
  props: {
    timeList: {
      type: Array,
    },
  },
  data() {
    return {
      form:[],
      ctive: 0,
      newctive: 0,
      isShow:true
    }
  },
  mounted() {
    this.disCom()
  },
    computed: {
        disabledLoad() {
            return false
        },
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId
            }
        },
    },
    watch: {
        deptId(val) {
            this.deptId = val
            this.disCom()
        },
      timeList(val,ss){
      }
    },
  methods: {
    disCom() {
      var data = {
        beginTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.timeList[0]),
        endTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.timeList[1]),
        deptId:this.deptId,
        groupType:'det'
      }
      var achievement = echarts.init(document.getElementById('achievement'))
      const achieve = {
        title: {
          show: this.isShow,
          text: '科室',
          left: "center",
          top: '50%'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          center:'center'
        },

        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '52%'],  //设置圆心
            data: [
              { value: 10, name: '月子' },
              { value:  20, name: '产康' },
            ],
            labelLine: {
              show: true,
              position: 'outside',
              length: 10,
              length2: 50
            },

            label: {
              show: true,
              position: "outside",
              // formatter: `{d}%`
              formatter:(parmas=>{
                return `${parmas.data.name}(${parmas.data.value})\n\n ${parmas.percent}% `
              })
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },

        ],
      }
      this.$api.deptId.receptionVolume(data).then(res => {
        if (res) {

          if (res.data.length>0){
            this.isShow=false
          }
          res.data.forEach(item=>{
            item.value=item.number
            item.name=item.departmentName
          })
          achieve.series[0].data=res.data
          achievement.setOption(achieve)
          window.addEventListener('resize', function() {
            achievement.resize()
          })
        }
      })

    }

  }
}
</script>

<style scoped>
p{
  font-weight: 650;
  font-size: 16px;
}

.achievement{
  /*float: left;*/
  width: 100%;
  height: 400px;
  background-color: #ffffff;
  border-radius: 10px;
}
.deal{
  /*margin-left: 15px;*/
  margin-top: 20px;
    text-align: center;
}
</style>
