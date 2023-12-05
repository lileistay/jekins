<template>
  <div>
    <el-card>
      <div style="width: 500px;margin: auto;">
        <el-date-picker
          v-model="form.receptionTime"
          style="width: 390px"
          size="small"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
        />
          <el-button style="margin-left: 20px;"  type="primary"  size="small" @click="search">搜索</el-button>
      </div>

    </el-card>
    <el-card style="margin-top: 10px;">

      <div class="header">

        <!--业绩分布排行-->
        <div  class="achievement"  :style="{height:heights+'px'}">
          <div style="margin-bottom: 10px;font-weight: 600; font-size: 17px;">数据汇总</div>
          <div class="card" style="display: flex;margin-bottom: 20px">
            <el-card  shadow="never" class="cardCSS"   style="background:#6cc7f3">
              <div>{{list.addCustom | numberToCurrency}}</div>
              <div>新增人数</div>
            </el-card>
            <el-card  shadow="never" class="cardCSS"   style="background:#ed8181">
              <div>{{list.anticipation | numberToCurrency}}</div>
              <div>预计到院</div>
            </el-card>
            <el-card  shadow="never" class="cardCSS"   style="background:#8585ef">
              <div>{{list.arrival | numberToCurrency}}</div>
              <div>首次到院人数</div>
            </el-card>
            <el-card  shadow="never" class="cardCSS"  style="background:#52bd52">
              <div>{{list.arrivaLinKe | numberToCurrency}}</div>
              <div>首次临客到院</div>
            </el-card><el-card  shadow="never" class="cardCSS"  style="background:#b386e5">
            <div>{{list.arrivalZhenKe | numberToCurrency}}</div>
            <div>首次正客到院</div>
          </el-card>
            <el-card  shadow="never" class="cardCSS"   style="background:#6cc7f3">
              <div>{{list.sumDy | numberToCurrency}}</div>
              <div>总到院人数</div>
            </el-card>
            <el-card  shadow="never" class="cardCSS"   style="background:#ed8181">
              <div>{{list.lkDy | numberToCurrency}}</div>
              <div>临客人数</div>
            </el-card>
            <el-card  shadow="never" class="cardCSS"   style="background:#6cc7f3">
              <div>{{list.zkDy  | numberToCurrency}}</div>
              <div>正客人数</div>
            </el-card>

          </div>
          <div style="margin-bottom: 20px;text-align: center;font-weight: 600; font-size: 17px;" :style="{ marginTop: margintop1}">接待数据</div>

          <div style="display: flex; "  :style="{ marginTop: margintop}">
            <distribution ref="dept" :timeList="form.receptionTime" style="width: 100%; height: 98%;" />
            <distribution1 ref="depts" :timeList="form.receptionTime" style="width: 100%; height: 98%;" />
          </div>
        </div>
        <div class="achievement" >
          <div style="margin-bottom: 10px;font-weight: 600; font-size: 17px;">预到院数据</div>
          <!-- 文件列表 -->
          <sg-table
            ref="table"
            id="out-table"
            :sg-ref="'multipleTable'"
            size="mini"
            border
            :table-data="tableData"
            :columns="columns"
            :pagination="pagination"
            highlight-current-row
            @size-change="sizeChange"
            @current-change="currentChange"
            :hideSearchBar="true"
            :maxHeight="heights"
            :row-class-name="rowClassName"
          >
            <div slot="searchBar" >
              <div style="font-size: 14px;color: #666;margin-left: 20px;margin-top: 5px;font-weight: bold;">数据报表</div>
            </div>
            <template  #custom="data">
              <div v-if="data.props === 'isReachCourtyard'">
                <dict-tag :options="dict.type.whether" :value="data.custom.isReachCourtyard" />
              </div>
              <div  v-if="data.props === 'edit'">
                <el-button type="text" @click="goreceptionTriage(data.custom.phone)">分诊</el-button>
              </div>
            </template>
          </sg-table>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
import { todayTime ,timeFmt,shortcuts} from '@/utils/time'
import distribution from '@/views/index/receptiondept'
import distribution1 from '@/views/index/receptiondept1'
import SgTable from '@/components/Table'


export default {
  dicts:['whether'],
  name: "receptionIndex.vue",
  components:{
    distribution,
    distribution1,
    SgTable
  },
  data(){
    return{
      form:{
        receptionTime: [new Date(todayTime()[0]), new Date(todayTime()[1])]
      },
      list:[
        {num:null,title:'新增人数',color:'#6cc7f3'},
        {num:null,title:'预计到院',color:'#ed8181'},
        {num:null,title:'到院人数',color:'#8585ef'},
        {num:null,title:'临客到院',color:'#52bd52'},
        {num:null,title:'正客到院',color:'#b386e5'},
      ],
      tableData:[],
      columns:[
        {
          lab: '是否已到院',
          val: 'isReachCourtyard',
          custom: 'isReachCourtyard',
        },
        {
          lab: '顾客姓名',
          val: 'customerName',
        },
        {
          lab: '电话',
          val: 'customPhone',
        },

        {
          lab: '接待顾问',
          val: 'acName',
        },
        {
          lab: '线上客服',
          val: 'onlName',
        },
        {
          lab: '预约渠道',
          val: 'channelName',
        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit',
        },
      ],
      pagination:{
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      formList:{

      },
      time:[],
      heights:'',
      pickerOptions: {
        shortcuts: shortcuts()
      },
      margintop:null,
      margintop1:null,
    }
  },
  created() {
    this.getFirst()
    this.getList()
    this.heights = (document.documentElement.clientHeight-325).toString()
    if ( this.heights>=636){
      this.margintop='15%'
      this.margintop1='5%'
    }if (this.heights<636 && this.heights>536){
      this.margintop='15%'
      this.margintop1='10%'
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
    },
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getFirst()
      this.getList()
    },
  },
  methods:{
    rowClassName({ row }) {
      if (row.isReachCourtyard === '1') {
        return 'success-row'
      }
      return ''
    },
    search(){
      this.getFirst()
      this.getList()
      this.$refs.dept.disCom()
      this.$refs.depts.disCom()
    },
    goreceptionTriage(val){
      this.$router.push({ path: 'receptionTriage', query: { item: val }})
    },
    getFirst(){
      console.log(this.form.receptionTime,'和黑')
      const query={
        beginTime:this.form.receptionTime==null?'':timeFmt('YYYY-mm-dd HH:MM:SS',this.form.receptionTime[0]),
        endTime:this.form.receptionTime==null?'':timeFmt('YYYY-mm-dd HH:MM:SS',this.form.receptionTime[1]),
        deptId:this.deptId
      }
      this.$api.deptId.reonStatis(query).then(res=>{
        this.list=res.data
      })
    },
    getList(){
      const query={
        beginTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.form.receptionTime[0]),
        endTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.form.receptionTime[1]),
        deptId:this.deptId
      }
      this.$api.deptId.preArrivalList({...query,...this.pagination}).then(res=>{
        this.tableData=res.rows
        this.pagination.total=res.total
      })
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getList()
    },
  }
}
</script>

<style scoped lang="scss">
.cardCSS{
  text-align: center;
  width: 100px;
  margin-right: 10px;
  font-size: 13px;
  color: #fff;

}
.card{
  width: 100%;
  justify-content: center;
 ::v-deep .el-card__body{
    padding: 9px;
  }
}
.achievement {
  margin-left: 10px;
  width: 48%;
  //margin-top: 30px;
  //background-color: #ffffff;
  //border: 1px solid #e5e3e3;

}
.header{
  display: flex;
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
::v-deep .el-table .warning-row {
  background: rgba(255, 0, 0,0.8);
}
::v-deep .el-table .success-row {
  background: #7ec5b7;
}
</style>
