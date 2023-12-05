<template>
    <!--业绩分布排行-->
    <div>
      <div class="achievement">
        <div class="briefing_header">
          <div style="font-size: 14px;color: #666;margin-left: 20px;margin-top: 10px;font-weight: bold;">门店占比</div>
          <div>
            <el-form :inline="true" :model="form" size="mini" class="form">
  
              <!-- <el-form-item>
                  <el-date-picker
                          v-model="form.time"
                          type="daterange"
                          range-separator="至"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          @change="disCom">
                  </el-date-picker>
              </el-form-item> -->
            </el-form>
          </div>
        </div>
        <!--      <div style="border: 1px solid #ccc;border-top: none;">-->
        <p class="" style="width: 98%;font-weight: 400;font-size: 14px;padding: 10px;border-bottom: none;border-top: none;"></p>
        <div style="width: 100%;display: flex; height: 97%;margin-left: 20px">
          <div id="achievements" style="width: 100%;height: 100%;" />
  <!--        <div style="width: 20%;height: 100%;text-align: center">-->
  <!--          <div v-for="(item,index) in this.dataList" :key="index" class="deal" style="font-weight: 500;font-size: 15px">-->
  <!--              <p class="deal" style="font-weight: 500;font-size: 15px"><span style="margin-right: 15px">{{item.departmenName}}</span>￥<CountTo ref="refcountofore" :start-val="0" :end-val="item.value" :duration="1000" :decimals="0" /></p>-->
  <!--            </div>-->
  
  <!--        </div>-->
        </div>
        <!--      </div>-->
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts'
  import { timeFmt,todayTime,beforeDayTime } from '@/utils/time'
  import { math } from '@/utils/math'
  import CountTo from 'vue-count-to'
  import { LOG2E } from 'mathjs'
  import {numberToCurrencyNo} from "../../utils/numberToCurrency";
  export default {
    name: 'Distribution1',
    components: { CountTo },
    props:['timeList'],
    data() {
      return {
        form: {
          user: 'dept',
          time: []
        },
        ctive: 0,
        dataList:[],
        options:[],
        stordId:null
      }
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
        timeList(val) {
              this.disCom()
          }
      },
      created() {
      this.getstore()
          // 查询当前月份月初到月末
          const myDate = new Date()
          let month = myDate.getMonth() + 1
          month = month < 10 ? '0' + month : month // 格式化月份，补0
          const statDateStart = myDate.getFullYear().toString() + '-' + month +  '-' +'01' // 月初
          const dayEnd = new Date(myDate.getFullYear(), month, 0).getDate() // 获取当月一共有多少天
          const statDateEnd = myDate.getFullYear().toString() + '-'+ month +  '-' + dayEnd // 月末
          this.form.time.push(statDateStart, statDateEnd)


      },
    mounted() {
      this.disCom()
    },
      methods: {
        getstore(){
          this.$api.deptId.listStoreinfo().then(res=>{
            this.options=res.data
          })
        },
      disCom() {
        console.log(this.timeList.value.length)
        if (this.timeList.value.length==0){
          let data=[]
          setTimeout(()=>{
            this.options.forEach(item=>{
              data.push(item.store_id)
            })
            this.stordId=data.toString()
            var data1 = {
              startCreateDate:timeFmt('YYYY-mm-dd HH:MM:SS',this.timeList.value1[0]),
              endCreateDate:timeFmt('YYYY-mm-dd HH:MM:SS',this.timeList.value1[1]),
              storeId: this.stordId
            }
            this.disCom1(data1)
          },200)
        }else {
          this.stordId=this.timeList.value.toString()
          var data1 = {
            startCreateDate:timeFmt('YYYY-mm-dd HH:MM:SS',this.timeList.value1[0]),
            endCreateDate:timeFmt('YYYY-mm-dd HH:MM:SS',this.timeList.value1[1]),
            storeId: this.stordId
          }
          this.disCom1(data1)
        }
      },
        disCom1(data){
          this.$api.deptId.getRegistrSheetStore(data).then(res => {
            if (res) {
              var newctive = [];
              newctive = res.data
              this.dataList=res.data
              newctive.forEach(item=>{
                item.value=item.chanPay
                item.name=item.storeName
              })
              var achievements = echarts.init(document.getElementById('achievements'))
              const achieve = {
                title: {
                  left: 'center'
                },
                tooltip: {
                  trigger: 'item',
                  // formatter:(parmas=>{
                  //     return `<span style="color:${parmas.color};font-size: 60px;float: left;margin-top: -4px">·</span><span style="margin: 0px 5px">${parmas.data.name}</span>     ${numberToCurrencyNo(parmas.value)}  `
                  // })
                },
                legend: {
                  orient: 'horizontal',
                  x:'center',
                  y:'%',
                  // left: -5,
                  // top: 100,

                },

                series: [
                  {
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '43%'],  //设置圆心
                    data: newctive,
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
                        return `${parmas.data.name} \n\n ${parmas.percent}% \n ${numberToCurrencyNo(parmas.value)}  `
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
              achievements.setOption(achieve)
              window.addEventListener('resize', function() {
                achievements.resize()
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
      margin-top: 9px;
      display: flex;
      text-align: center;
      justify-content: flex-start;
  }
  </style>
  