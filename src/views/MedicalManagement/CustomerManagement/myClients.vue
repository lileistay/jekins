<template>
  <!-- 我的客户 -->
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
          <div slot="header" class="header">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de"></i>列表清单</span>
            </div>
            <div>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">批量添加标签</el-button>
              <el-button size="mini" plain type="success" icon="el-icon-plus">补充客户信息</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">批量发送短息</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">手工上报</el-button>
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
          lab: '最后治疗时间',
          val: '',
          width: 150
        },
        {
          lab: '最后回访时间',
          val: '',
          width: 150
        },
        {
          lab: '建档时间',
          val: '',
        },
        {
          lab: '首次来院时间',
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
          width: 150
        },
        {
          lab: '客户卡号',
          val: '',
          width: 165
        },
        {
          lab: '客户状态',
          val: '',
          width: 150
        },
        {
          lab: '会员等级',
          val: '',
          width: 150
        },
        {
          lab: '客户标签',
          val: '',
          width: 150
        },
        {
          lab: '媒介',
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
          val: ''
        },
        {
          lab: '员工推荐人',
          val: '',
          width: 150,
          showOverflowTooltip: true
        },
        {
          lab: '服务助理',
          val: '',
          width: 120
        },
        {
          lab: '会员客服',
          val: ''
        },
        {
          lab: '建档类型',
          val: ''
        },
        {
          lab: '国省市区',
          val: '',
          width: 150
        },
        {
          lab: '地址',
          val: '',
          width: 150
        },
        {
          lab: '生日',
          val: '',
          width: 150
        },
        {
          lab: '职业',
          val: '',
          width: 150
        },
        {
          lab: '经济能力',
          val: '',
          width: 150
        },
        {
          lab: '婚姻',
          val: '',
          width: 150
        },
        {
          lab: '回访次数',
          val: '',
          width: 150
        },
        {
          lab: '消费金额',
          val: '',
          width: 150
        },
        {
          lab: '是否黑名单',
          val: '',
          width: 150
        },
        {
          lab: '会员卡状态',
          val: '',
          width: 150
        },
        {
          lab: '领卡时间',
          val: '',
          width: 150
        },
        {
          lab: '是否网电预约到院',
          val: '',
          width: 150
        },
        {
          lab: '客户备注',
          val: '',
          width: 150
        },
        {
          lab: '回访备注',
          val: '',
          width: 150
        },
        {
          lab: '上一次来院时间',
          val: '',
          width: 150
        },
        {
          lab: '上一次消费时间',
          val: '',
          width: 150
        },
        {
          lab: '门诊病历号',
          val: '',
          width: 150
        },
        {
          lab: '门诊病历号',
          val: '',
          width: 150
        },
        {
          lab: '口腔归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '皮肤归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '整形归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '无创归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '中医归属医生/服务助理',
          val: '',
          width: 150
        }
      ],
      options: {
        receptionTimes: {
          type: 'Tdatetime',
          label: '最后来院时间',
          clearable: true,
          values: []
        },
        customerName: {
          type: 'Tdatetime',
          label: '最后消费时间',
          clearable: true,
          values: []
        },
        customPhone: {
          type: 'Tdatetime',
          label: '最后治疗时间',
          clearable: true,
          values: []
        },
        customerNuber: {
          type: 'Tdatetime',
          label: '最后回访时间',
          clearable: true,
          values: []
        },
        xiangmu: {
          type: 'Tdatetime',
          label: '建档时间',
          clearable: true,
          values: []
        },
        typeThreeIds: {
          type: 'Tdatetime',
          label: '首次来院时间',
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
          label: '会员等级：',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '客户状态：',
          clearable: true,
          options: []
        },
        aestheticConsultants: {
          type: 'select',
          label: '媒介类型：',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '媒介来源：',
          clearable: true,
          options: []
        },
        remarks: {
          type: 'select',
          label: '美学顾问：',
          clearable: true,
          options: []
        },
        huiyuan: {
          type: 'select',
          label: '客户代表：',
          clearable: true,
          options: []
        },
        meixue: {
          type: 'cascader',
          label: '建档类型',
          clearable: true,
          // props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        daibiao: {
          type: 'select',
          label: '是否有标签：',
          clearable: true,
          options: []
        },
        men: {
          type: 'input',
          label: '客户标签：'
        },
        kouqianng: {
          type: 'input',
          label: '客户标签反选：'
        },
        xinxi: {
          type: 'Tinput',
          label: '消费金额：',
          values: []
        },
        taocan: {
          type: 'Tinput',
          label: '生日：',
          values: []
        },
        status: {
          type: 'Tinput',
          label: '回访次数：',
          values: []
        },
        sex: {
          type: 'select',
          label: '性别：',
          values: []
        },
        nian: {
          type: 'Tinput',
          label: '年龄',
          clearable: true,
          values: []
        },
        mei: {
          type: 'select',
          label: '国家/地区：'
        },
        dai: {
          type: 'select',
          label: '省份：'
        },
        hui: {
          type: 'select',
          label: '区：'
        },
        lastTime: {
          type: 'select',
          label: '是否网点预约到院：'
        },
        lastxiaofei: {
          type: 'select',
          label: '是否员工推荐：',
          clearable: true
        },
        lasthuifang: {
          type: 'select',
          label: '员工推荐人：',
          clearable: true
        },
        gui: {
          type: 'select',
          label: '服务助理：',
          clearable: true,
          options: []
        },
        keshizhuli: {
          type: 'select',
          label: '会员客服：',
          clearable: true,
          values: []
        },
        linka: {
          type: 'Tinput',
          label: '领卡时间：',
          values: []
        },
        kaStatus: {
          type: 'select',
          label: '卡状态：',
          clearable: true,
          options: []
        },
        hei: {
          type: 'select',
          label: '是否黑名单：',
          clearable: true,
          options: []
        },
        dizhi: {
          type: 'input',
          label: '地址：'
        },
        zhiye: {
          type: 'select',
          label: '职业：',
          clearable: true,
          options: []
        },
        nengli: {
          type: 'select',
          label: '经济能力：',
          clearable: true,
          options: []
        },
        ramks: {
          type: 'input',
          label: '客户备注'
        },
        huifangramks: {
          type: 'input',
          label: '客户备注'
        },
        topTime: {
          type: 'Tinput',
          label: '上次来院时间：',
          values: []
        },
        xiaofeiTime: {
          type: 'Tinput',
          label: '上次来院时间：',
          values: []
        },
        menzheng: {
          type: 'input',
          label: '门诊病历号：'
        },
        card: {
          type: 'input',
          label: '身份证号：'
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
