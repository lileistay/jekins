<template>
  <!--整体趋势-->
  <div class="overa">
    <div class="">
      <div >
        <div style=" height: 40px;background-color: #F9F9F9;border-bottom: 1px solid #e5e3e3 ">
          <span style="font-size: 14px;color: #666; line-height: 37px;margin-left: 20px;font-weight: bold;">整体趋势</span>
        </div>
        <div style="height:10px"></div>
        <div style="display: flex;    justify-content: space-between;margin-left: 10px;" class="mini">
            <div class="butt">
                <el-button-group>
                    <el-button  plain size="small" @click="btnover('at')">业绩</el-button>
                    <el-button  plain size="small" @click="btnover('ts')">总上门量</el-button>
                    <el-button  plain size="small" @click="btnover('te')">总成交量</el-button>
                    <el-button  plain size="small" @click="btnover('tre')">总成交率</el-button>
                    <el-button  plain size="small" @click="btnover('tpe')">总客单价</el-button>
                    <el-button  plain size="small" @click="btnover('il')">初诊量</el-button>
                    <el-button  plain size="small" @click="btnover('ne')">新客成交量</el-button>
                    <el-button  plain size="small" @click="btnover('ntn')">新客成交额</el-button>
                    <el-button  plain size="small" @click="btnover('nt')">新客客单</el-button>
                </el-button-group>
            </div>
            <div>
                <el-date-picker
                        v-model="stringDate"
                        size="small"
                        type="daterange"
                        style="width: 80% !important;float: right;margin-right: 5px"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="pickerstring"
                >
                </el-date-picker>
            </div>

        </div>
        <div style="width: 300px;display: inline-block;margin-left: 410px;position: absolute; z-index: 100;">

      </div>
      </div>

    </div>
    <div id="trend" style="width:100%;height: 444px;margin-left: -57px;margin-top: -11px" />

  </div>
</template>

<script>
import * as echarts from 'echarts'
import {timeFmt,todayTime,beforeDayTime} from "../../utils/time";
import {numberToCurrencyNo} from "../../utils/numberToCurrency"
export default {
  name: 'OverallTrend',
  data() {
    return {
      // TODO 默认选择当月第二次选择不显示，但数据请求是选中的数
      stringDate: [],
        hest:''
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
      this.btnover()
    }
  },
  created() {
    // 查询当前月份月初到月末
    const myDate = new Date()
    let month = myDate.getMonth() + 1
    month = month < 10 ? '0' + month : month // 格式化月份，补0
    // const statDateStart = myDate.getFullYear().toString() + month + '01' // 月初
    // const dayEnd = new Date(myDate.getFullYear(), month, 0).getDate() // 获取当月一共有多少天
    // const statDateEnd = myDate.getFullYear().toString() + month + dayEnd // 月末
    // this.stringDate.push(statDateStart, statDateEnd)
    this.stringDate=[new Date(beforeDayTime(31)[0]), new Date(todayTime()[1])]
  },
  mounted() {
    this.btnover()
  },
  methods: {
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {};
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj != 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      //引用类型
      //数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i];
          if (typeof new_obj[i] == 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { //对象
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] == 'object') {
              new_obj[key] = this.deepClone(obj[key]);
            } else {//对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj;
    },

    btnover(val) {
        this.hest=val
      //  this.newprice=this.deepClone(this.stringDate)
      // // 判断日期是否为2000-01-01 不是就截取添加
      // if (this.newprice[0].length === 8) {
      //     this.newprice[0] = this.newprice[0].slice(0, 4) + '-' + this.newprice[0].slice(4, 6) + '-' + this.newprice[0].slice(6)
      //     this.newprice[1] = this.newprice[1].slice(0, 4) + '-' + this.newprice[1].slice(4, 6) + '-' + this.newprice[1].slice(6)
      // }
      var date = {
        startTime: this.stringDate[0] === undefined ? '2023-01-01 00:00:00' : timeFmt('YYYY-mm-dd', this.stringDate[0]),
        endTime: this.stringDate[1] === undefined ? '2023-02-20 00:00:00' : timeFmt('YYYY-mm-dd',this.stringDate[1]),
        deptId: this.deptId,
        trendType: val === undefined ? 'at' : val
      }
      this.$api.deptId.overallTrend(date).then(res => {
        if (res) {
          var receTime = []
          var sumTime = [];
          if(res.rows.length==0){
            receTime=['2023-03-30','2023-04-01','2023-04-02','2023-04-03']
            sumTime=[0,0,0,0]
          }else{

            if (res.rows !== []) {
            res.rows.forEach(item => {
              receTime.push(item.receptionTime)
              if (item.totalunitPrice === undefined) {
                item.totalunitPrice = 0
              }
              if (val=='tre'){
                  sumTime.push((Number(item.totalunitPrice )*100).toFixed(0))
              }else {
                  sumTime.push(Number(item.totalunitPrice).toFixed(0) )
              }

            })
          }
          }

          var whole = echarts.init(document.getElementById('trend'))
          const OverallTrend = {
            tooltip: {
              trigger: 'axis',
                formatter:(params=>{
                    if (this.hest=='tre' && this.hest!=undefined){
                        return  `<div>${params[0].name}</div>
                         <div><span style="color: #5bc0de;font-size: 60px;float: left">·</span><span style="float: right;margin-top:3px">${numberToCurrencyNo(params[0].value)}%</span></div> `
                    }else {
                        return  `<div>${params[0].name}</div>
                         <div><span style="color: #5bc0de;font-size: 60px;float: left">·</span><span style="float: right;margin-top:3px">${numberToCurrencyNo(params[0].value)}</span></div> `
                    }
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
                itemStyle : {
                    // normal: {
                        label : {show: true},
                        color: "#49a9ee", //改变折线点的颜色
                        lineStyle: {
                            color: "#49a9ee", //改变折线颜色
                        },

                    // },
                },
                  label:{
                      // normal: {
                          formatter:(params=>{
                              if (this.hest=='tre' && this.hest!=undefined){
                                  return numberToCurrencyNo(params.value) + '%'
                              }else {
                                  return numberToCurrencyNo(params.value)
                              }
                          })
                      // }
                  },
                data: sumTime,
                showSymbol: true,
                areaStyle: {
                    color:'#dbeefc'
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
          window.addEventListener('resize', function() {
            whole.resize()
          })
        }
      })
      // 整体趋势
    },
    pickerstring(val) {
      this.stringDate=[];
      this.stringDate.push(val[0],val[1])
      this.btnover()
    }
  }
}
</script>
<style scoped>
.header{
  width: 85%;
  /* display: flex; */
  /* justify-content: space-between;
  align-items: center; */
}
.el-button{
  margin-left: 1px;
}
.overa{
  height: 99%;
}
::v-deep .el-date-editor{
      width: 100% !important;
      margin-left: 40px !important;
}
.Labko{
  overflow-y: hidden;
}
.Labko::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.Labko::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.Labko::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}
/*.mini ::v-deep .el-button--mini{*/
/*  padding: 7px 14px !important;*/
/*}*/
::v-deep .butt .el-button.is-plain:hover {
    border-color: #1abc9c !important;
    color: #1abc9c ;
}
</style>

