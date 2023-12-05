<template>
  <!-- 科室治疗跟踪 -->
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
              <span><i class="el-icon-s-data" style="color: #5f94de" />统计信息</span>
            </div>
          </div>
          <div slot="header" class="header">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
            </div>
            <div>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">登记预约</el-button>
              <el-button size="mini" plain type="success" icon="el-icon-plus">批量发送短息</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">手工上报</el-button>
              <el-button size="mini" plain type="success" icon="el-icon-plus">登记预约(全屏)</el-button>
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
          width: 150
        },
        {
          lab: '电话',
          val: ''
        },
        {
          lab: '客户卡号',
          val: '',
          width: 165
        },
        {
          lab: '整形治疗状态',
          val: '',
          width: 150
        },
        {
          lab: '整形上一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '整形上一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '整形下一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '整形下一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '整形最后治疗时间',
          val: '',
          width: 150
        },
        {
          lab: '整形归属医生/服务助理',
          val: '',
          width: 150
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
          width: 150,
          showOverflowTooltip: true
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
          lab: '口腔治疗状态',
          val: '',
          width: 150
        },
        {
          lab: '口腔上一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '口腔上一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '口腔下一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '口腔下一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '口腔最后治疗时间',
          val: '',
          width: 150
        },
        {
          lab: '口腔归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '无创治疗状态',
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
          lab: '无创下一次预约时间',
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
          lab: '中医治疗状态',
          val: '',
          width: 150
        },
        {
          lab: '中医上一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '中医上一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '中医下一次预约时间',
          val: '',
          width: 150
        },
        {
          lab: '中医下一次预约内容',
          val: '',
          width: 150
        },
        {
          lab: '中医最后治疗时间',
          val: '',
          width: 150
        },
        {
          lab: '中医归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '客户状态',
          val: '',
          width: 150
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
          width: 150
        }
      ],
      options: {
        receptionTimes: {
          type: 'Tdatetime',
          label: '最后治疗时间：',
          clearable: true,
          values: []
        },
        label: {
          type: 'input',
          label: '客户姓名：',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'input',
          label: '电话：',
          clearable: true,
          options: []
        },
        tades: {
          type: 'input',
          label: '客户卡号：'
        },
        // 无
        xian: {
          type: 'select',
          label: '是否有排期治疗项目：',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '科室：',
          clearable: true,
          options: []
        },
        aestheticConsultants: {
          type: 'select',
          label: '科室治疗状态：',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'Tdatetime',
          label: '上次预约时间：',
          clearable: true,
          values: []
        },
        remarks: {
          type: 'Tinput',
          label: '上次预约内容：',
          values: []
        },
        daibiao: {
          type: 'select',
          label: '是否有下次预约：',
          clearable: true,
          options: []
        },
        men: {
          type: 'Tdatetime',
          label: '下次预约时间：',
          clearable: true,
          values: []
        },
        mei: {
          type: 'select',
          label: '下次预约医生：'
        },
        dai: {
          type: 'select',
          label: '项目治疗状态：'
        },
        hui: {
          type: 'select',
          label: '一级项目：'
        },
        lastTime: {
          type: 'select',
          label: '二级项目：'
        },
        lastxiaofei: {
          type: 'select',
          label: '三级项目：'
        },
        lasthuifang: {
          type: 'select',
          label: '四级项目：'
        },
        dizhi: {
          type: 'input',
          label: '四级项目名称：'
        },
        gui: {
          type: 'input',
          label: '产品组合名称：'
        },
        keshizhuli: {
          type: 'input',
          label: '产品套餐名称：'
        },
        kaStatus: {
          type: 'select',
          label: '客户状态：',
          clearable: true,
          options: []
        },
        hei: {
          type: 'select',
          label: '性别：',
          clearable: true,
          options: []
        },
        linka: {
          type: 'Tinput',
          label: '年龄：',
          values: []
        },
        zhiye: {
          type: 'select',
          label: '美学顾问：',
          clearable: true,
          options: []
        },
        nengli: {
          type: 'select',
          label: '客户代表：',
          clearable: true,
          options: []
        },
        ramks: {
          type: 'select',
          label: '服务助理：',
          clearable: true,
          options: []
        },
        huifangramks: {
          type: 'input',
          label: '客户备注'
        },
        topTime: {
          type: 'select',
          label: '会员客服：',
          clearable: true,
          options: []
        },
        xiaofeiTime: {
          type: 'Tinput',
          label: '最后来院时间：',
          values: []
        },
        menzheng: {
          type: 'Tinput',
          label: '最后消费时间：',
          values: []
        },
        card: {
          type: 'Tinput',
          label: '最后回访时间：',
          values: []
        },
        keshi: {
          type: 'select',
          label: '全部科室归属医生：',
          clearable: true,
          options: []
        },
        fuwuzhuli: {
          type: 'select',
          label: '全部科室归属服务助理：',
          clearable: true,
          options: []
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
