<template>
  <!--组件-->
  <div>
    <div class="briefing_header">
      <div style="font-size: 14px;color: #666;margin-left: 20px;margin-top: 10px;font-weight: bold;">销售漏斗</div>
      <div>
        <el-form :inline="true" :model="form" size="mini" class="form">
          <el-form-item>
            <el-select filterable v-model="form.objectiveType" placeholder="请选择" style="width: 150px;line-height: 40px" @change="getNewdata">
              <el-option label="公司数据" value="deptId" />
              <el-option label="部门数据" value="departmentId" />
              <el-option label="我的数据" value="onlineUserId" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="form.time" type="month" style="width: 145px;line-height: 40px" placeholder="选择月"
              @change="getNewdata" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div id="main" style="width: 100%;height: 360px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { timeFmt } from '@/utils/time'

export default {
  name: 'Funnel',
  data() {
    return {
      form: {
        objectiveType: 'deptId',
        time: timeFmt('YYYY-mm', new Date())
      },
      funnel: "",
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
        this.getNewdata()
    }
  },
  mounted() {
    this.getNewdata();
    // this.GetNUm(278.4445464)
    // window.onresize = myChart.resize
  },
  methods: {

    getNewdata(val){
      // if(val==undefined){
      //   var date =this.form;
      // }
      // if(val=='deptId'||val=='departmentId'||val=='onlineUserId'){
      //   var date = {
      //     objectiveType: this.form.user,
      //     time: timeFmt('YYYY-mm',this.form.time),
      //     deptId: this.deptId,
      //   }
      // }
      //
      // else {
      //   var date = {
      //     objectiveType: this.form.user,
      //     time: timeFmt('YYYY-mm',val),
      //     deptId: this.deptId,
      //   }
      // }
        const query = {
            objectiveType: this.form.user,
          time: timeFmt('YYYY-mm',this.form.time),
            typeId: this.deptId,
        }
    this.$api.deptId.salesPipeline(query).then(res => {
          this.funnel=res.data;
          this.poperfm();
    })
    },
    GetNUm(num){
      let arr= String(num).split('.');
      let newstr=arr[1].substr(0,2);
     return arr[0]+'.'+newstr;
    },
    poperfm() {
      let that=this;
      var myChart = echarts.init(document.getElementById('main'))
      var option = {

        tooltip: {
          trigger: 'item',
          formatter: function(val){
            // console.log(,'__________________')
              let name=val.data.name.substr(0,3);
          }
        },

          calculable: false,
        series: [
          {
            name: 'Expected',
            type: 'funnel',
            left: '10%',
            top: 30,
            bottom: 30,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '25%', //漏斗最小值的宽度
            maxSize: '80%', //漏斗最大值的宽度
            sort: 'none', // 金字塔形:'ascending',  漏斗图形:'descending'
            gap: 0,
            label: {
                // normal:{
                    show: true,
                    position: 'inside',
                    formatter:(params=>{
                        // if (params.name.indexOf('新增数') == -1) {
                        //     const value=Number(params.value).toFixed(2)
                        //     return  params.name=`${params.name} ${value}%`
                        // }else  {
                        //     return params.name = params.name
                        // }
                        if (params.name.indexOf('新增数') != -1){
                            return params.name = params.name
                        }
                        if (params.name.indexOf('预约数') != -1){
                            const value=Number(this.funnel.yuyue/this.funnel.addUser)*100
                            return  params.name=`${params.name} ${value.toFixed(2)}%`
                        }
                        if (params.name.indexOf('到院数') != -1){
                            const value=Number(this.funnel.daoyuan/this.funnel.yuyue)*100
                            return  params.name=`${params.name} ${value.toFixed(2)}%`
                        }
                        if (params.name.indexOf('成交数') != -1){
                            const value=Number(this.funnel.chengjiao/this.funnel.daoyuan)*100
                            return  params.name=`${params.name} ${value.toFixed(2)}%`
                        }
                    })
                // }

            },
              labelLine: { //视觉引导线样式
                  length: 30,
                  lineStyle: {
                      width: 2,
                      type: 'solid'
                  }
              },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                // fontSize: 20
              }
            },
            tooltip: {
                  trigger: 'item',
                  formatter:(params=>{
                      if (params.name.indexOf('新增数') != -1){
                          return params.name = `${params.name}`
                      }
                      if (params.name.indexOf('预约数') != -1){
                          const value=Number(this.funnel.yuyue/this.funnel.addUser)*100
                          return  params.name=`${params.name} ${value.toFixed(2)}%`
                      }
                      if (params.name.indexOf('到院数') != -1){
                          const value=Number(this.funnel.daoyuan/this.funnel.yuyue)*100
                          return  params.name=`${params.name} ${value.toFixed(2)}%`
                      }
                      if (params.name.indexOf('成交数') != -1){
                          const value=Number(this.funnel.chengjiao/this.funnel.daoyuan)*100
                          return  params.name=`${params.name} ${value.toFixed(2)}%`
                      }
                  })
              },
            data: [

              { value:100 , name: `新增数(${this.funnel.addUser}) 100%`, num: 1200},
              // { value: (this.funnel.yuyue/this.funnel.addUser).toFixed(2)*100, name: `预约数(${this.funnel.yuyue})`, num: 1200},
              // { value:(this.funnel.daoyuan/this.funnel.yuyue).toFixed(2)*100, name: `到院数(${this.funnel.daoyuan})` , num: 1200},
              // { value:(this.funnel.chengjiao/this.funnel.daoyuan).toFixed(2)*100, name: `成交数(${this.funnel.chengjiao})`, num: 1200  },
                { value: 80, name: `预约数(${this.funnel.yuyue})`, num: 1200},
                { value:40, name: `到院数(${this.funnel.daoyuan})` , num: 1200},
                { value:1, name: `成交数(${this.funnel.chengjiao})`, num: 1200  },
            ]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
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
