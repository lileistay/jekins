<template>
  <!-- 我的治疗客户 -->
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
            <!--            <div>-->
            <!--              <span>客户总数：0 [ 整形： 0 ；皮肤： 0 ；口腔： 0 ；无创： 0 ；SPA会所： 0 ；私密中心： 0 ； ]</span><br>-->
            <!--              <span>初诊人数：0 [ 整形： 0 ；皮肤： 0 ；口腔： 0 ；无创： 0 ；SPA会所： 0 ；私密中心： 0 ； ]</span><br>-->
            <!--              <span>复诊人数：0 [ 整形： 0 ；皮肤： 0 ；口腔： 0 ；无创： 0 ；SPA会所： 0 ；私密中心： 0 ； ]</span>-->
            <!--            </div>-->
          </div>
          <div slot="header" class="header">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
              <span><i style="background-color: #ffffff" />已安排</span>
              <span><i style="background-color: #ffff00" />手术进行中</span>
              <span><i style="background-color: #008000" />已执行/手术已结束</span>
              <span><i style="background-color: #ff0000" />已取消</span>
            </div>
            <div>
              <!-- <el-button size="mini" plain type="primary" icon="el-icon-plus">批量发送短信</el-button> -->
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
      tableData: [],
      columns: [
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
          width: 150
        },
        {
          lab: '最后来院时间',
          val: '',
          width: 150
        },
        {
          lab: '会员等级',
          val: ''
        },
        {
          lab: '客户类型',
          val: '',
          width: 150
        },
        {
          lab: '治疗状态',
          val: ''
        },
        {
          lab: '科室',
          val: '',
          width: 150
        },
        {
          lab: '项目名称',
          val: '',
          width: 150
        },
        {
          lab: '状态',
          val: ''
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
          lab: '医生',
          val: '',
          width: 150
        },
        {
          lab: '实际执行人',
          val: '',
          width: 150
        },
        {
          lab: '医助',
          val: ''
        },
        {
          lab: '护士',
          val: '',
          width: 150,
          showOverflowTooltip: true
        },
        {
          lab: '麻醉师',
          val: '',
          width: 120
        },
        {
          lab: '医务分诊时间',
          val: '',
          width: 120
        },
        {
          lab: '治疗时间',
          val: ''
        },
        {
          lab: '手术开始时间',
          val: '',
          width: 150
        },
        {
          lab: '手术结束时间',
          val: '',
          width: 150
        },
        {
          lab: '备注',
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
          label: '客户类型：',
          clearable: true,
          options: []
        },
        aestheticConsultants: {
          type: 'select',
          label: '治疗状态：',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '科室：',
          clearable: true,
          options: []
        },
        remarks: {
          type: 'select',
          label: '状态：',
          clearable: true,
          options: []
        },
        huiyuan: {
          type: 'select',
          label: '一级项目：',
          clearable: true,
          options: []
        },
        // meixue: {
        //   type: 'cascader',
        //   label: '建档类型',
        //   clearable: true,
        //   // props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
        //   options: []
        // },
        daibiao: {
          type: 'select',
          label: '二级项目：',
          clearable: true,
          options: []
        },
        men: {
          type: 'select',
          label: '三级项目：',
          clearable: true,
          options: []
        },
        kouqianng: {
          type: 'input',
          label: '项目名称：'
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
          label: '美学顾问：',
          values: []
        },
        mei: {
          type: 'select',
          label: '客户代表：'
        },
        dai: {
          type: 'Tdatetime',
          label: '医务分诊时间',
          clearable: true,
          values: []
        },
        hui: {
          type: 'Tdatetime',
          label: '治疗登记时间：',
          clearable: true,
          values: []
        },
        lastTime: {
          type: 'Tdatetime',
          label: '治疗时间：',
          clearable: true,
          values: []
        },
        lastxiaofei: {
          type: 'Tdatetime',
          label: '手术开始时间：',
          clearable: true,
          values: []
        },
        lasthuifang: {
          type: 'Tdatetime',
          label: '手术结束时间：',
          clearable: true,
          values: []
        },
        gui: {
          type: 'select',
          label: '医生：',
          clearable: true,
          options: []
        },
        keshizhuli: {
          type: 'select',
          label: '实际执行人：',
          clearable: true,
          values: []
        },
        kaStatus: {
          type: 'select',
          label: '护士：',
          clearable: true,
          options: []
        },
        hei: {
          type: 'select',
          label: '医助：',
          clearable: true,
          options: []
        },
        zhiye: {
          type: 'select',
          label: '麻醉师：',
          clearable: true,
          options: []
        },
        nengli: {
          type: 'select',
          label: '服务助理：',
          clearable: true,
          options: []
        },
        ramks: {
          type: 'select',
          label: '会员客服：',
          clearable: true,
          options: []
        },
        huifangramks: {
          type: 'Tdatetime',
          label: '最后来院时间：',
          clearable: true,
          values: []
        },
        topTime: {
          type: 'input',
          label: '治疗备注：'
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
