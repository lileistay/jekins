<template>
  <!-- 无创治疗客户跟踪管理 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" icon="el-icon-search">查询</el-button>
        <el-button size="mini" type="success" icon="el-icon-d-arrow-right">导出</el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"
       
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :row-class-name="rowClassName"
          @size-change="sizeChange"
          @current-change="currentChange"
          @operateClick="operateClick"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
            </div>
            <div>
              <span>总人数：16人 [ 新客：4人 老客：12人 有预约：0人 未预约：16人 | 未治疗：2人 治疗中：0人 治疗完：14人 ]</span>
            </div>
          </div>
          <div slot="header" class="header">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
              <span><i style="background-color:#ffffff" />未预约</span>
              <span><i style="background-color:#c6f9c3" />有预约</span>
            </div>
            <div>
              <el-button size="mini" type="primary" icon="el-icon-plus">登记预约</el-button>
              <!-- <el-button size="mini" type="success" icon="el-icon-position">批量发送短信</el-button> -->
              <el-button size="mini" type="primary" icon="el-icon-plus">手工上报</el-button>
              <el-button size="mini" type="primary" icon="el-icon-s-platform">登记预约(全屏)</el-button>
            </div>
          </div>
        </sg-table>
      </slot>
    </SlideSearch>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
export default {
  components: {
    slideSearch,
    SgTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          lab: '操作',
          val: ''
        },
        {
          lab: '排期治疗项目',
          val: '',
          width: 120
        },
        {
          lab: '下次预约信息',
          val: '',
          width: 150
        },
        {
          lab: '是否有下次预约',
          val: '',
          width: 120
        },
        {
          lab: '客户姓名',
          val: ''
        },
        {
          lab: '电话',
          val: ''
        },
        {
          lab: '客户卡号',
          val: ''
        },
        {
          lab: '整形治疗治疗状态',
          val: '',
          width: 150
        },
        {
          lab: '无创上一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '无创上一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '无创下一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '无创最后治疗时间',
          val: '',
          width: 150
        },
        {
          lab: '无创归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '客户状态',
          val: '',
          width: 120
        },
        {
          lab: '美学顾问',
          val: '',
          width: 150
        },
        {
          lab: '客户代表',
          val: '',
          width: 150
        },
        {
          lab: '服务助理',
          val: '',
          width: 150
        },
        {
          lab: '会员客服',
          val: '',
          width: 150
        },
        {
          lab: '最后来院时间',
          val: '',
          width: 150
        },
        {
          lab: '最后消费时间',
          val: '',
          width: 150
        },
        {
          lab: '最后回访时间',
          val: '',
          width: 120
        }
      ],
      options: {
        receptionTimes: {
          type: 'Tdatetime',
          label: '最后治疗时间：',
          clearable: true,
          values: []
        },
        customerName: {
          type: 'input',
          label: '客户姓名：'
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },
        customerStatus: {
          type: 'input',
          label: '客户卡号：',
          clearable: true,
          options: []
        },
        paiqi: {
          type: 'select',
          label: '是否有排期治疗项目：',
          clearable: true,
          options: []
        },
        zhiliao: {
          type: 'select',
          label: '科室治疗状态：',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        label: {
          type: 'Tdatetime',
          label: '上一次预约时间：',
          clearable: true,
          values: []
        },
        onlineUserId: {
          type: 'Tinput',
          label: '上一次预约内容：',
          clearable: true,
          values: []
        },
        // 无
        xian: {
          type: 'select',
          label: '是否有下次预约：',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'Tdatetime',
          label: '下次预约时间：',
          clearable: true,
          values: []
        },
        xia: {
          type: 'Tdatetime',
          label: '下次预约内容：',
          clearable: true,
          values: []
        },
        one: {
          type: 'select',
          label: '下次预约医生：',
          clearable: true,
          values: []
        },
        two: {
          type: 'select',
          label: '项目治疗状态：',
          clearable: true,
          values: []
        },
        projectOne: {
          type: 'select',
          label: '一级项目：',
          clearable: true,
          values: []
        },
        projectTwo: {
          type: 'select',
          label: '二级项目：',
          clearable: true,
          values: []
        },
        projectTherr: {
          type: 'select',
          label: '三级项目：',
          clearable: true,
          values: []
        },
        projectsi: {
          type: 'select',
          label: '四级项目：',
          clearable: true,
          values: []
        },
        projectName: {
          type: 'select',
          label: '四级项目名称：',
          clearable: true,
          values: []
        },
        projectFive: {
          type: 'select',
          label: '产品组合名称：',
          clearable: true,
          values: []
        },
        product: {
          type: 'select',
          label: '产品套餐：',
          clearable: true,
          values: []
        },
        Customerstatus: {
          type: 'select',
          label: '客户状态：',
          clearable: true,
          values: []
        },
        sex: {
          type: 'select',
          label: '性别：',
          clearable: true,
          values: []
        },
        age: {
          type: 'input',
          label: '年龄：',
          clearable: true,
          values: []
        },
        Aesthetic: {
          type: 'select',
          label: '美学顾问：',
          clearable: true,
          values: []
        },
        representative: {
          type: 'select',
          label: '客户代表：',
          clearable: true,
          values: []
        },
        ServiceAssistant: {
          type: 'select',
          label: '服务助理：',
          clearable: true,
          values: []
        },
        assistant: {
          type: 'select',
          label: '美学顾问：',
          clearable: true,
          values: []
        },
        member: {
          type: 'select',
          label: '美学顾问：',
          clearable: true,
          values: []
        },
        last: {
          type: 'Tinput',
          label: '最后来院时间：',
          clearable: true,
          values: []
        },
        lastconsumption: {
          type: 'Tinput',
          label: '最后消费时间：',
          clearable: true,
          values: []
        },
        lastReturnVisit: {
          type: 'Tinput',
          label: '最后回访时间：',
          clearable: true,
          values: []
        },
        zui: {
          type: 'select',
          label: '最后回访时间：',
          clearable: true,
          values: []
        },
        ho: {
          type: 'select',
          label: '最后回访时间：',
          clearable: true,
          values: []
        },
        yi: {
          type: 'select',
          label: '最后回访时间：',
          clearable: true,
          values: []
        }
      },
      pagination: {
        show: true
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.container {
  width: 100%;
  height: 100%;
}
  span {
    font-size: 14px;
    margin-right: 15px;
  }
  i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }
</style>
