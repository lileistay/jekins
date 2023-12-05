<template>
  <!-- 皮肤跟踪 -->
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
        >
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de"></i>统计信息</span>
            </div>
          </div>
          <div slot="header" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de"></i>列表清单</span>
              <span><i style="background-color:#ffffff"></i>未预约</span>
              <span><i style="background-color:#c6f9c3"></i>已预约</span>
            </div>
            <div>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">登记预约</el-button>
              <!-- <el-button size="mini" plain type="success" icon="el-icon-plus">批量发送短信</el-button> -->
              <el-button size="mini" plain type="primary" icon="el-icon-plus">手工上报</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-s-platform">登记预约(全屏)</el-button>
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
      tableData:[],
      columns: [
        {
          lab: '操作',
          val: '',
        },
        {
          lab: '排期治疗项目',
          val: '',
          width: 150
        },
        {
          lab: '下次预约信息',
          val: '',
          width: 150
        },
        {
          lab: '是否有下次预约',
          val: '',
          width: 150
        },
        {
          lab: '客户姓名',
          val: '',
        },
        {
          lab: '电话',
          val: '',
        },
        {
          lab: '客户卡号',
          val: '',
        },
        {
          lab: '皮肤治疗状态',
          val: '',
          width: 150
        },
        {
          lab: '皮肤上一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '皮肤上一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '皮肤下一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '皮肤下一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '皮肤最后治疗时间',
          val: '',
          width: 150
        },
        {
          lab: '皮肤归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '客户状态',
          val: ''
        },
        {
          lab: '美学顾问',
          val: '',
          showOverflowTooltip: true
        },
        {
          lab: '客户代表',
          val: '',
          width: 120
        },
        {
          lab: '服务助理',
          val: ''
        },
        {
          lab: '会员客服',
          val: ''
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
          width: 150
        }
      ],
      options: {
        receptionTimes: {
          type: 'Tdatetime',
          label: '最后治疗时间',
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
        customerNuber: {
          type: 'input',
          label: '客户卡号：',
          clearable: true,
          options: []
        },
        xiangmu: {
          type: 'select',
          label: '是否有排期治疗项目：',
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
          type: 'select',
          label: '科室治疗状态：',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '上一次预约时间',
          clearable: true,
          options: []
        },
        tade: {
          type: 'Tdatetime',
          label: '下单时间',
          clearable: true,
          values: []
        },
        // 无
        xian: {
          type: 'input',
          label: '上一次预约内容：',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '是否有下次预约：',
          clearable: true,
          options: []
        },
        aestheticConsultants: {
          type: 'select',
          label: '下次预约内容：',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '下次预约医生：',
          clearable: true,
          options: []
        },
        remarks: {
          type: 'select',
          label: '项目治疗状态：',
          clearable: true,
          options: []
        },
        huiyuan: {
          type: 'select',
          label: '一级项目：',
          clearable: true
        },
        meixue: {
          type: 'select',
          label: '二级项目：',
          clearable: true
        },
        daibiao: {
          type: 'select',
          label: '三级项目：',
          clearable: true
        },
        men: {
          type: 'select',
          label: '四级项目：',
          clearable: true
        },
        kouqianng: {
          type: 'input',
          label: '四级项目名称：'
        },
        xinxi: {
          type: 'input',
          label: '产品组合名称：'
        },
        taocan: {
          type: 'input',
          label: '产品套餐名称：'
        },
        status: {
          type: 'select',
          label: '客户状态：',
          clearable: true
        },
        sex: {
          type: 'select',
          label: '性别：'
        },
        nian: {
          type: 'Tinput',
          label: '年龄',
          clearable: true,
          values: []
        },
        mei: {
          type: 'select',
          clearable: true,
          label: '美学顾问：'
        },
        dai: {
          type: 'select',
          clearable: true,
          label: '客户代表：'
        },
        zhu: {
          type: 'select',
          clearable: true,
          label: '服务助理：'
        },
        hui: {
          type: 'select',
          clearable: true,
          label: '会员客服：'
        },
        lastTime: {
          type: 'Tinput',
          label: '最后来院时间',
          clearable: true,
          values: []
        },
        lastxiaofei: {
          type: 'Tinput',
          label: '最后消费时间',
          clearable: true,
          values: []
        },
        lasthuifang: {
          type: 'Tinput',
          label: '最后回访时间',
          clearable: true,
          values: []
        },
        gui: {
          type: 'select',
          label: '科室归属医生',
          clearable: true,
          values: []
        },
        keshizhuli: {
          type: 'select',
          label: '科室归属服务助理',
          clearable: true,
          values: []
        }
      },
      pagination:{
        show:true
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
 span {
    font-size: 12px;
    margin-right: 15px;
  }
 i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }
</style>
