<template>
    <!--  个人业绩排行-->
    <div>
      <div class="briefing_header">
        <div style="font-size: 14px;color: #666;margin-left: 20px; margin-top: 10px;font-weight: bold;">
          <span>接待顾问成交</span>
          <span><img src="@/assets/images/wh.png" alt="" style="display: inline-block;margin-left: 5px;margin-bottom: -6px;" title="接待量为：新客首次（顾客第一次到院）
成交量为：新客首次到院成交（顾客第一次到院成交）
成交率为：接待量*成交量"></span>
        </div>
        <div>
          <el-form :inline="true" :model="form" size="mini" class="form">
            <!-- <el-form-item>
              <el-select v-model="form.user" placeholder="请选择" style="width: 150px;line-height: 40px" @change="poperfm">
                <el-option label="现场咨询排名" value="ac" />
                <el-option label="前端咨询排名" value="ou" />
                <el-option label="科室二开排行" value="sr" />
                <el-option label="医生排行" value="di" />
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-date-picker
                v-model="form.stringDate"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                style="width: 145px;line-height: 40px"
                placeholder="选择月"
                @change="poperfm"
              />
            </el-form-item>
            <el-form-item style="margin-top: 6px">
              <el-button @click="more">查看更多 <i class="el-icon-arrow-right" /></el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div id="Columnarer" style="width: 100%;height: 100%;" />
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts'
  import { timeFmt } from '@/utils/time'
  import {numberToCurrencyNo} from "../../utils/numberToCurrency";
import { combinations } from 'mathjs';
  
  export default {
    name: 'PersonalPerformance',
    data() {
      return {
        form: {
          user: 'ac',
          stringDate: timeFmt('YYYY-mm', new Date())
        },
        anmount: {}
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
        this.poperfm()
      }
    },
    mounted() {
      this.poperfm()
    },
    methods: {
      poperfm() {
        var date = {
          deptId: this.deptId,
          time: this.form.stringDate,
        //   postType: this.form.user
        }
        this.anmount = date
        var achievement = [] // 预计销售金额
        var userName = [] // 人员姓名
        var percapita = [] // 概率金额
        var bls=[];
        this.$api.deptId.reception(date).then(res => {
          if (res) {
            res.data.some((item, i) => {
              if (i === 10) {
                return true
              }
              if(i>6){

              }else{
                achievement.push(Number(item.receptionVolume).toFixed(0)) // 接待量
              userName.push(item.acName) // 姓名
              percapita.push(Number(item.deal).toFixed(0)) // 成交量
              if(item.receptionVolume==0){
                bls.push(0)
              }else{
                bls.push((Number(item.deal))/(Number(item.receptionVolume)))
              }
              } 
            })
            let newbls=[];
            bls.forEach(value=>{
             newbls.push(value)
            })
            var myChart = echarts.init(document.getElementById('Columnarer'))
            const labelOption = {
              show: true,
              position: 'insideBottom',
              distance: 19,
              align: 'left',
              verticalAlign: 'middle',
              rotate: 90,
              // formatter: '{c}  {name|{a}}',
                formatter:(params=>{
                    // console.log(params,'numberToCurrencyNo(params.value)')
                    return numberToCurrencyNo(params.value)
                }),
              fontSize: 12,
              rich: {
                name: {}
              }
            }
            const labelOptions = {
              show: true,
              position: 'insideBottom',
              distance: 19,
              align: 'left',
              verticalAlign: 'middle',
              rotate: 90,
                formatter:(params=>{
                    return (((params.value))*100).toFixed(0)+'%'
                }),
              fontSize: 12,
              rich: {
                name: {}
              }
            }
            var option = {
              tooltip: {
                trigger: 'axis',
                show:false,
                axisPointer: {
                  type: 'shadow'
                },
                // formatter:(params=>{
                //   params[2].data=((params[2].data)*100).toFixed(0);
                //   return '<span>dsadasd</span>'
                //     // console.log(params)
                // }),

              },
              legend: {
                data: ['接待量', '成交量','成交率']
              },
              xAxis: [
                {
                  type: 'category',
                  axisTick: { show: false },
                  data: userName
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '接待量',
                  type: 'bar',
                  barGap: 0,
                  label: labelOption,
                  emphasis: {
                    focus: 'series'
                  },
                  data: achievement
                },
                {
                  name: '成交量',
                  type: 'bar',
                  label: labelOption,
                  emphasis: {
                    focus: 'series'
                  },
                  data: percapita
                },
                {
                  name: '成交率',
                  type: 'bar',
                  barGap: 0,
                  label: labelOptions,
                  emphasis: {
                    focus: 'series'
                  },
                  data: newbls
                },
              ]
            }
            myChart.setOption(option)
            window.addEventListener('resize', function() {
              myChart.resize()
            })
          }
        })
      },
      
      // 个人业绩排行--查看更多
      more() {
        this.$router.push({ path: 'announcements', query: { order: JSON.stringify(this.anmount) }})
      }
    }
  }
  </script>
  
  <style scoped>
  .briefing_header{
    height: 40px;
      width: 100%;
    background-color: #F9F9F9;
      border-bottom: 1px solid #e5e3e3;
    /*border-radius: 10px 10px 0 0;*/
    display: flex;
    justify-content: space-between;
  }
  </style>
  