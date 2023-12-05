<template>
  <!--业绩分布排行-->
  <div>
    <div class="achievement">
      <div id="achievement1" style="width: 100%;height: 100%" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { timeFmt } from '@/utils/time'
import { math } from '@/utils/math'
import CountTo from 'vue-count-to'
import { LOG2E } from 'mathjs'

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
      form: {
        user: 'dept',
        time: timeFmt('YYYY-mm', new Date())
      },
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
        }
    },
    watch: {
        deptId(val) {
            this.deptId = val
            this.disCom()
        }
    },
  methods: {
    disCom() {
      var data = {
        beginTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.timeList[0]),
        endTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.timeList[1]),
        deptId:this.deptId,
        groupType:'ac'
      }
      var achievement1 = echarts.init(document.getElementById('achievement1'))
      const achieve = {
        title: {
          show: this.isShow,
          text: '顾问',
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
              { value: 60, name: '月租' },
              { value: 120, name: '产康' },
              { value: 50, name: '口腔' },
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
                return `${parmas.data.name}(${parmas.data.value}) \n\n ${parmas.percent}% `
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

        ]
      }
      this.$api.deptId.receptionVolume(data).then(res => {
        if (res) {
          res.data.forEach(item=>{
            item.value=item.number
            item.name=item.acName
          })
          achieve.series[0].data=res.data
          achievement1.setOption(achieve)
          window.addEventListener('resize', function() {
            achievement1.resize()
          })
          if (res.data.length>0){
            this.isShow=false
          }
        }
      })
      const refname = 'refcountofore'
      if (this.$refs[refname]) { // 判空
        this.$refs[refname].reset() // 重置
        this.$refs[refname].start() // 开始滚动
      }
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

</style>
