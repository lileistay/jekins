<template>
  <div>
    <div class="contain">
      <div class="contain_top">
        <!-- <div class="container_top_children">
          <div style="width:70px">
            客户姓名：
          </div>
          <el-input size="mini" v-model="Name" style="width:160px;">
          </el-input>
        </div>
        <div class="container_top_children">
          <div style="width:70px">
            客户电话：
          </div>
          <el-input size="mini" v-model="customerPhone" style="width:160px;">
          </el-input>
        </div>
        <div class="container_top_children">
          <div style="width:70px">
            客户卡号：
          </div>
          <el-input size="mini" v-model="customCardNumber" style="width:160px;">
          </el-input>
        </div> -->
        <div class="container_top_children">
          <div style="width:70px">
            医生：
          </div> <el-select clearable filterable v-model="doctorId" size="mini" style="width: 160px;">
            <el-option v-for="item in doctor" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </div>
        <div class="container_top_children">
          <div style="width:70px">
            美学顾问:
          </div>

          <el-select clearable filterable v-model="aestheticConsultant" size="mini" style="width: 160px;">
            <el-option v-for="item in esthetics" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </div>
        <div class="container_top_children">
          <div style="width:70px">
            项目名称:
          </div>
          <el-input size="mini" v-model="projectName" style="width: 160px;">
          </el-input>

        </div>
        <div class="container_top_children">
          <div style="width:70px">
            分诊时间：
          </div>
          <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" size="mini" style="width: 160px;" />
        </div>
        <div class="container_top_children">
          <div style="width:70px">
            治疗时间：
          </div>
          <el-date-picker v-model="value2" type="datetimerange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" size="mini" style="width: 160px;" />
        </div>
        <div class="container_top_children">
          <div style="width:70px">
            治疗状态：
          </div>
          <el-select clearable filterable v-model="state" size="mini" style="width: 160px;">
            <el-option v-for="item in dict.type.treatment_type" :label="item.label" :value="item.value"
              :key="item.value"></el-option>
          </el-select>
        </div>
        <el-button type="primary" size="mini" style="height: 30px;margin-top:10px;margin-left: 20px;" @click="search"> 搜索</el-button>
        <el-button type="primary" size="mini" style="height: 30px;margin-top:10px;margin-left: 20px;" @click="add"> 发起治疗</el-button>
      </div>
      <div class="contani-top">
        <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
        <span><span style="background-color: #ffffff;" class="Top"></span> 已安排</span>
        <span><span style="background-color: #ffff00;" class="Top"></span> 已取消</span>
        <span><span style="background-color: #c6f9c3;" class="Top"></span> 已治疗</span>
      </div>
      <div class="table">
        <sg-table
          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          size="mini"
          border
          selection
          index="序号"
          :table-data="listzl"
          :columns="columns"
          :pagination="pagination"
          highlight-current-row
          @size-change="sizeChange"
          @current-change="currentChange"
          :row-class-name="tableRowClassName"
          :hideSearchBar="true"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
        >
          <template #custom="data">
            <div v-if="data.props === 'treatmentStatus'">
              <div>
                {{ data.custom.treatmentStatus=='2'?'复诊':'初诊' }}
              </div>
            </div>
            <div v-if="data.props === 'state'">
              <div>
                {{ data.custom.state=='1'?'已安排': data.custom.state=='2'?'已治疗':'已取消' }}
              </div>
            </div>
          </template>
        </sg-table>
      </div>
    </div>

  </div>
</template>
<script>
import SgTable from '@/components/Table'
export default {
  components:{
    SgTable
  },
  dicts: ['treatment_type', 'treatment_status'],
  props: ['doctor', 'esthetics', 'Name'],
  watch: {
    Name(newV) {
      this.search();
    }
  },
  methods: {
    handleSizeChange(e){
      this.pageSize=e;
      this.search();
    },
    handleCurrentChange(e){
      this.pageNum=e;
      this.currentPage=e;
      this.search();
    },
    tableRowClassName({ row }) {
      if (row.state === '2') {
        return 'success-row'
      } else if (row.state === '0') {
        return 'warning-row'
      }
    },
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClick(e) {
      this.selectionData = e
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(e)
    },
    add(){
      if (this.selectionData.length === 0) {
        this.$message.warning('请选择顾客进行修改')
        return
      }
      // 判断是否是同一个人
      // 对选中的数据取出id 转为set直接去重，判断去重后的set长度，如果大于0表示选中了多个不同客户
      const ids = new Set(this.selectionData.flatMap(item => [item.id]))
      if (ids.size > 1) {
        this.$message.warning('请选择同一个顾客发起批量治疗')
        return
      }
      // 并且选择的数据是否有剩余治疗次数
      const find = this.selectionData.find(item => item.state === '2' || item.state === '0')
      if (find) {
        this.$message.warning('部分项目已治疗或取消，不能发起治疗，请重新选择')
        return
      }
      // 选择的数据存入store,防止后续页面刷新数据丢失
      this.$store.dispatch('setTreatmentSelectionData', this.selectionData)
      this.$router.push({ name: 'InitiateTreatment' })
    },
    newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            let hh = DateObj.getHours()
            let mm = DateObj.getMinutes()
            let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            if (hh >= 0 && hh <= 9) {
                hh = "0" + hh;
            }
            if (mm >= 0 && mm <= 9) {
                mm = "0" + mm;
            }
            if (ss >= 0 && ss <= 9) {
                ss = "0" + ss;
            }
            // 最终时间
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
        },
    search() {
      let data = {
        customerName: this.Name,
        customerPhone: this.customerPhone,
        customCardNumber:this.customCardNumber,
        doctorId: this.doctorId,
        aestheticConsultant:this.aestheticConsultant,
        state:this.state,
        triagePersonTime: this.value1.length==0?'':this.newgetData(this.value1[0]),
        endtriagePersonTime:this.value1.length==0?'':this.newgetData(this.value1[1]),
        treatmentTime:this.value2.length==0?'':this.newgetData(this.value2[0]),
        endtreatmentTime: this.value2.length==0?'':this.newgetData(this.value2[1]),
        projectName:this.projectName,
        // pageNum:this.pageNum,
        //  pageSize:this.pageSize
        ...this.pagination
      }
      this.$api.medical.selectTreatment(data).then(res => {
        this.listzl=res.rows
        // this.total=res.total;
        this.pagination.total=res.total
        // console.log(res, 'sdfhdshfhdshf')

      })
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.search()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.search()
    },
  },
  created() {
    // this.search()
  },
  data() {
    return {
      listzl: [],
      total:0,
      currentPage4:1,
      pageSize:20,
      pageNum:1,
      currentPage:1,
      selectionData:[],
      value1: [],
      value2: [],
      customerName: "",
      customerPhone: "",
      customCardNumber: "",
      doctorId: "",
      aestheticConsultant: "",
      state: "",
      triagePersonTime: "",
      endtriagePersonTime: "",
      treatmentTime: "",
      endtreatmentTime: "",
      projectName:"",
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      columns:[
        {
          lab: '客户姓名',
          val: 'customerName',
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '客户卡号',
          val:'customCardNumber',
          width:160
        },
        {
          lab: '项目',
          val: 'projectName',
          width: 110
        },
        {
          lab: '计划治疗次数',
          val: 'estimateScribingNum'
        },
        {
          lab: '当次治疗次数',
          val: 'thisScribingNum',
        },
        {
          lab: '医生',
          val: 'doctorName',
        },
        {
          lab: '美学顾问',
          val: 'acName'
        },
        {
          lab: '状态',
          val: 'treatmentStatus',
          custom: 'treatmentStatus'
        },
        {
          lab: '治疗状态',
          val: 'state',
          custom: 'state'
        },
        {
          lab: '客户代表',
          val: 'surplusQuantity',
        },
        {
          lab: '分诊时间',
          val: 'triagePersonTime',
          width: 155
        },
        {
          lab: '分诊备注',
          val: 'remark'
        },


      ],
    }
  }
}
</script>

<style scoped>
::v-deep .el-table .warning-row {
  background: #ffff00;
}
::v-deep .el-table .success-row {
  background: #c6f9c3;
}
.pagation {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .el-pager li.active {
  background-color: #409eff !important;
  color: #fff;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 8px;
  z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  height: 20px;
  background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 5px #999; */
  background: transparent;
  /* border-radius: 2px; */
}

.table {
  width: 99%;
  height: 510px;
  overflow: scroll;

}

.Top {
  width: 10px;
  height: 10px;
  display: inline-block;
}

.contani-top {
  height: 40px;
  background-color: #f8f8f8;
  margin-top: 10px;
  display: flex;
  align-items: center;

}

.contani-top span {
  margin-left: 10px;
}

.contain {
  width: 100%;
  min-height: 700px;
}

.contain_top {
  min-height: 100px;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.container_top_children {
  width: 240px;
  height: 35px;
  margin-left: 10px;
  display: flex;
  margin-top: 10px;
  align-items: center;
}
</style>
