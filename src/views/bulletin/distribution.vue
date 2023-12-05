<template>
  <!--业绩分布排行-->
  <div>
    <div class="achievement">
      <div class="briefing_header">
        <div style="font-size: 14px;color: #666;margin-left: 20px;margin-top: 10px;font-weight: bold;">业绩分布排行</div>
        <div>
          <el-form :inline="true" :model="form" size="mini" class="form">
            <el-form-item>
              <el-select filterable v-model="form.user" placeholder="请选择" style="width: 150px;" @change="disCom">
                <el-option label="公司目标" value="dept" />
                <!-- <el-option label="部门目标" value="section" />
                <el-option label="我的目标" value="user" /> -->
              </el-select>
            </el-form-item>
            <el-form-item>

              <el-date-picker
                v-model="form.time"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                style="width: 145px;"
                placeholder="选择月"
                @change="disCom"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--      <div style="border: 1px solid #ccc;border-top: none;">-->
      <p class="" style="width: 98%;font-weight: 400;font-size: 14px;padding: 10px;border-bottom: none;border-top: none;"></p>
      <div style="width: 100%;display: flex; height: 97%;margin-left: 20px">
        <div id="achievement" style="width: 50%;height: 100%;" />
        <div style="width: 50%;height: 100%;">
          <p class="deal" style="font-weight: 500;font-size: 15px">新客业绩</p>
          <!--                  <p class="deal" style="font-weight: 500;font-size: 15px">￥{{ ctive|numberToCurrency }}</p>-->
          <p class="deal" style="font-weight: 500;font-size: 15px">￥<CountTo ref="refcountofore" :start-val="0" :end-val="ctive" :duration="1000" :decimals="0" /></p>

          <!-- <p class="deal" style="font-weight: 500;font-size: 15px">￥{{  newctive|numberToCurrency }}</p> -->
          <p class="deal" style="font-weight: 500;font-size: 15px">老客业绩</p>
          <p class="deal" style="font-weight: 500;font-size: 15px">￥<CountTo ref="refcountofore" :start-val="0" :end-val="newctive" :duration="1000" :decimals="0" /></p>
          <!-- <p class="deal" style="font-weight: 500;font-size: 15px">￥{{ ctive|numberToCurrency }}</p> -->
        </div>
      </div>
      <!--      </div>-->
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
  data() {
    return {
      form: {
        user: 'dept',
        time: timeFmt('YYYY-mm', new Date())
      },
      ctive: 0,
      newctive: 0
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
        currentTime: this.form.time,
        objectiveType: this.form.user,
        typeId:this.deptId
      }
      this.$api.deptId.companyObjectives(data).then(res => {
        if (res) {
          this.ctive = res.data.now
          this.newctive = res.data.lod
            if (this.ctive==0 && this.newctive==0){
                var zctivw=0
            }else {
                var zctivw = math.multiply(math.multiply(1, math.divide(this.newctive, math.add(this.ctive, this.newctive))).toFixed(2), 100).toFixed(2)// 计算老客业绩占比
            }
          var achievement = echarts.init(document.getElementById('achievement'))
          const achieve = {
              title: {
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item'
              },
              legend: {
                  orient: 'vertical',
                  left: 'left'
              },

            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: this.ctive, name: '新客业绩' },
                        { value:  this.newctive, name: '老客业绩' },
                    ],
                    labelLine: {
                        show: true,
                        position: 'outside',
                        length: 10,
                        length2: 50
                    },

                    label: {
                        show: true,
                        position: "inside",
                        // formatter: `{d}%`
                        formatter:(parmas=>{
                            return `${parmas.data.name} \n\n ${parmas.percent}% `
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
          achievement.setOption(achieve)
          window.addEventListener('resize', function() {
            achievement.resize()
          })
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
.briefing_header{
  height: 40px;
    width: 100%;
  background-color: #F9F9F9;
    border-bottom: 1px solid #e5e3e3;
  /*border-radius: 10px 10px 0 0;*/
  display: flex;
  justify-content: space-between;
  /*padding: 0 100px;*/
}
.form{
  margin-top: 5px;
}
.achievement{
  float: left;
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
