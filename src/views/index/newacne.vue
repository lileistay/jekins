<template>
    <!--首页-->
    <div style="background: #f8f8f8;">
        <div style="width:100%;height:100px;display:flex;align-items:center;background-color:#fff;">
            <div class="acne">
                <span>选择日期：</span>
                <el-date-picker v-model="form.value1" :picker-options="pickerOptions" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" size="mini">
                </el-date-picker>
                <span class="Left">选择门店:</span>
                <el-select v-model="form.value" filterable multiple collapse-tags placeholder="请选择" size="mini" class="Left">
                    <el-option v-for="item in options" :key="item.value" :label="item.store_name" :value="item.store_id" size="mini"
                        class="Left">
                    </el-option>
                </el-select>

                <el-button type="primary" size="mini" @click="search" style="margin-left:20px">搜索</el-button>
                <el-button type="primary" size="mini" style="margin-left:20px" @click="emplloy">员工绩效</el-button>
            </div>
        </div>
        <div class="header">
            <!-- 饼图-->
            <div class="achievement" style="height:400px">
                <distribution2 ref="distribution"  :timeList="form" style="width: 100%; height: 98%;" />
            </div>

            <!-- 右侧数据-->
            <div class="achievement" style="overflow-y:scroll">
              <div style="font-size: 14px;color: #666;font-weight: bold;background-color: #F9F9F9;border-bottom: 1px solid #e5e3e3;font-weight: bold;padding: 11px;">门店业绩</div>

              <div style="display: flex;flex-wrap: wrap;">
                <div class="achievement_children" style="background:#6cc7f3">
                  <div class="childfrens">
                    <div style="margin-top:30px">
                      <span>总收入金额</span>
                      <p class="Size">{{datalist.paybiao | numberToCurrency}}</p>
                    </div>

                  </div>
                </div>
                <div class="achievement_children" style="background:#8585ef">
                  <div class="childfrens">
                    <div style="margin-top:30px">
                      <span>欠款金额</span>
                      <p class="Size">{{datalist.debtPrice | numberToCurrency}}</p>
                    </div>

                  </div>

                </div>
                <div class="achievement_children" style="background:#ed8181">
                  <div class="childfrens">
                    <div style="margin-top:30px">
                      <span>还款金额</span>
                      <p class="Size">{{datalist.MoneyInfo | numberToCurrency }}</p>
                    </div>

                  </div>
                </div>
                <div class="achievement_children" style="background:#b386e5">
                  <div class="childfrens">
                    <div style="margin-top:30px">
                      <span>退款金额</span>
                      <p class="Size">{{ datalist.fundInfo | numberToCurrency }}</p>
                    </div>

                  </div>
                </div>
              </div>

                <!-- <performanceTrend style="width: 100%; height: 99%;" /> -->
            </div>
        </div>
    </div>
</template>
  
<script>


// import data from '@/api/sysManger/dict/data'
import distribution2 from '@/views/index/distribution2'
import { beforeDayTime } from '@/utils/time'
import { todayTime,timeFmt ,shortcuts,monthData} from '@/utils/time'
export default {
    components: {  distribution2 },
    data() {
        return {
          form:{
            value1:monthData(),
            value:null,
          },
          options:[],
          datalist:{},
          stordId:'',
          pickerOptions: {
            shortcuts: shortcuts()
          },
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
        },
        avatar: {
            get() {
                return this.$store.getters.avatar
            },
            set(val) {
                val = this.$store.getters.avatar
            }
        },


    },
    watch: {
        deptId(val) {
            this.deptId = val
            // console.log(this.item.ring, '哈哈')
        },
        avatar(val) {
            // alert('dshajsa')
        },

    },
    created() {
        this.deptId = this.$store.getters.departmentId
      this.getstore()
      this.getturnoverIncome()
    },
    mounted() {

    },
    methods: {
      getstore(){
        this.$api.deptId.listStoreinfo().then(res=>{
          this.options=res.data
        })
      },
      //
      getturnoverIncome(){
        if (this.form.value==null || this.form.value.length==0){
          let data=[]
          setTimeout(()=>{
            this.options.forEach(item=>{
              data.push(item.store_id)
              this.stordId=data.toString()
            })
            const query={
              startTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.form.value1[0]),
              endTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.form.value1[1]),
              sthreId:data.toString()
            }
            this.$api.deptId.turnoverIncome(query).then(res=>{
              res.data.MoneyInfo=res.data.MoneyInfo.toFixed(0)
              res.data.debtPrice=res.data.debtPrice.toFixed(0)
              res.data.fundInfo=res.data.fundInfo.toFixed(0)
              res.data.paybiao=res.data.paybiao.toFixed()
              this.datalist=res.data
            })
          },200)
        }else {
          this.stordId=this.form.value.toString()
          const query={
            startTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.form.value1[0]),
            endTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.form.value1[1]),
            sthreId:this.form.value.toString()
          }
          this.$api.deptId.turnoverIncome(query).then(res=>{
            res.data.MoneyInfo=res.data.MoneyInfo.toFixed(0)
            res.data.debtPrice=res.data.debtPrice.toFixed(0)
            res.data.fundInfo=res.data.fundInfo.toFixed(0)
            res.data.paybiao=res.data.paybiao.toFixed()
            this.datalist=res.data
          })
        }
      },
      search(){
        this.getturnoverIncome()
        this.$refs.distribution.disCom()
        console.log(this.$refs.distribution.stordId,this.form.value.toString(),',,,,')
        this.$refs.distribution.stordId=this.form.value.toString()
      },
        emplloy(){
        this.$router.push({
            path:'/employy'
        })
        },
    }
}
</script>
<style scoped>
::v-deep .el-table__header thead tr th{
    padding:5px;
}
::v-deep .el-table__row td{
    padding:3px;
    font-size:9px;
}
.pagation {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    position:absolute;
    bottom:0;
    /* border: 1px solid black; */
}
::v-deep .el-pager li.active {
    background-color: rgb(26, 188, 156) !important;
    color: #fff;
}
::v-deep .el-button--primary span{
    color:#fff !important;
}
.Size{
    font-size:20px;
}
.childfrens {
    width: 200px;
    height: 100px;
    text-align: center;
    color: #fff;
    font-size: 20px !important;
    font-weight: bolder;
}

.acne_bottom {
    width: 100%;
    height: 500px;
    margin-top: 30px;
    background: #fff;
    /* align-items:center;
    justify-content:space-evenly; */
}

.acne_bottom_children {
    width: 140px;
    height: 40px;
    border: 1px solid red
}

/* * {
    font-size: 14px;
    overflow: hidden;
} */

.acne {
    width: 1200px;
    height: 30px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    font-size:14px;
  justify-content: center;
}

.Left {
    margin-left: 20px
}

/*箭头*/
.down {
    color: red;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}

.deal {
    margin-left: 15px;
    margin-top: 20px;
}
</style>
<style scoped lang="scss">
// 图标颜色 月同比 月环比
.greenicon {
    color: green;
}

.redicon {
    color: red;
}

.newOld {
    float: left;
    width: 25%;
    height: 50%;
    cursor: pointer;
}

// 修改 样式布局 6次luan de ya pi
.bg {
    background-color: rgb(242, 242, 242);
    color: #272727;
}

.header1 {
    justify-content: space-around;
    //display: flex;
    //justify-content: space-evenly;
    margin-left: 10px;
    padding: 0 8%;
    overflow: hidden;

    .sale {
        width: 274px;
        height: 150px;
        margin: 0 10px;
        background-color: #ffffff;
        border-radius: 6px;
        margin-bottom: 10px;
        float: left;
        border: 1px solid #e5e3e3;

        .titme {
            margin-top: 20px;

            font-size: 14px;
            color: #8f9295;
            padding: 0px 21px;
        }

        .much {
            margin-top: 10px;
            margin-left: 25px;
            font-size: 25px;
            font-weight: 800;
        }

        .percentage {
            margin-top: 15px;
            margin-left: 25px;
            font-size: 13px;
        }
    }

    p {
        //font-weight: 650;
        font-size: 16px;
    }

    .briefing_header {

    }

    .form {
        margin-top: 5px;
    }

    .item {
        margin-top: 55px;
        text-align: center;
        font-size: 14px;
        color: #8f9295;
    }

    .muchitem {
        //margin-top: 15px;
        text-align: center;
        font-size: 28px;
        color: #686868;
    }

    .achievement {
        float: left;
        margin-left: 10px;
        width: 48%;
        height: 400px;
        margin-top: 30px;
        background-color: #ffffff;
        border: 1px solid #e5e3e3;
    }
}

.header {
    //justify-content: space-between;
    display: flex;
    justify-content: space-evenly;
    padding: 0 8%;
    overflow: hidden;

    .sale {
        width: 274px;
        height: 150px;
        margin: 0 10px;
        background-color: #ffffff;
        border-radius: 6px;
        margin-bottom: 10px;
        float: left;
        border: 1px solid #e5e3e3;

        .titme {
            font-size: 14px;
            color: #8f9295;
            padding: 21px;
        }

        .much {
            margin-top: 10px;
            margin-left: 25px;
            font-size: 25px;
            font-weight: 800;
        }

        .percentage {
            margin-top: 15px;
            margin-left: 25px;
            font-size: 13px;
        }
    }

    p {
        //font-weight: 650;
        font-size: 16px;
    }

    .briefing_header {
        height: 40px;
        width: 100%;
        background-color: #F9F9F9;
        border-bottom: 1px solid #e5e3e3;
        //border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        //padding: 0 100px;
    }

    .form {
        margin-top: 5px;
    }

    .item {
        margin-top: 55px;
        text-align: center;
        font-size: 14px;
        color: #8f9295;
    }

    .muchitem {
        //margin-top: 15px;
        text-align: center;
        font-size: 28px;
        color: #686868;
    }

    .achievement {
        float: left;
        margin-left: 10px;
        width: 48%;
        height: 400px;
        margin-top: 30px;
        background-color: #ffffff;
        border: 1px solid #e5e3e3;
        //display: flex;
        flex-wrap: wrap;
    }

    .achievement_children {
        width: 325px;
        height: 150px;
        background-color: red;
        margin-left: 40px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    receptionIndex .achievement2 {
        margin-left: 10px;
        height: 400px;
        margin-top: 30px;
        background-color: #ffffff;
        border: 1px solid #e5e3e3;
    }

    .achievement1 {
        float: left;
        margin-left: 10px;
        width: 48%;
        height: 360px;
        margin-top: 30px;
        background-color: #ffffff;
        border: 1px solid #e5e3e3;
    }
}

.days {
    margin-right: 20px;
    margin-top: -20px;
}

// 整体趋势
.ztqs {
    height: 450px;
    border-radius: 10px;
    margin-left: 8%;
    margin-top: 10px
}

.dayday {
    margin-right: 5px;
}

.month {
    width: 20px;
    height: 20px;
    background-color: #8f9295;
}

::v-deep .el-dialog__headerbtn .el-dialog__close {
    display: none;
}

::v-deep .el-button+.el-button {
    //display: none;
}

::v-deep .el-button:focus,
.el-button:hover {
    border-color: #1abc9c !important;
    color: #1abc9c;
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
</style>
  