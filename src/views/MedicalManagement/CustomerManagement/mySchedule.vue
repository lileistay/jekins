<template>
  <!-- 我的排期客户 -->
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
          lab: '客户状态',
          val: '',
          width: 150
        },
        {
          lab: '会员等级',
          val: '',
        },
        {
          lab: '收费单编号',
          val: '',
          width: 165
        },
        {
          lab: '美学顾问',
          val: '',
        },
        {
          lab: '客户代表',
          val: '',
          width: 150
        },
        {
          lab: '是否退款',
          val: '',
          width: 150
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
          lab: '一级类型',
          val: '',
          width: 150
        },
        {
          lab: '二级类型',
          val: '',
          width: 150
        },
        {
          lab: '三级类型',
          val: '',
          width: 150
        },
        {
          lab: '结账时间',
          val: ''
        },
        {
          lab: '第一次治疗时间',
          val: '',
          width: 150,
          showOverflowTooltip: true
        },
        {
          lab: '最后治疗时间',
          val: '',
          width: 120
        },
        {
          lab: '同类型项目最后治疗时间',
          val: '',
          width: 170
        },
        {
          lab: '最后消费时间',
          val: '',
          width: 150
        },
        {
          lab: '最后到院时间',
          val: '',
          width: 150
        },
        {
          lab: '最后回访时间',
          val: '',
          width: 150
        },
        {
          lab: '年卡有效期时间',
          val: '',
          width: 150
        },
        {
          lab: '客户标签',
          val: '',
          width: 150
        },
        {
          lab: '购买数量',
          val: '',
          width: 150
        },
        {
          lab: '产品次数',
          val: '',
          width: 150
        },
        {
          lab: '产品总次数',
          val: '',
          width: 150
        },
        {
          lab: '已治疗次数',
          val: '',
          width: 150
        },
        {
          lab: '剩余次数',
          val: '',
          width: 150
        },
        {
          lab: '剩余待执行业绩',
          val: '',
          width: 150
        },
        {
          lab: '金额',
          val: '',
          width: 150
        },
        {
          lab: '累计消费金额',
          val: '',
          width: 150
        },
        {
          lab: '退款金额',
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
          lab: '医生',
          val: '',
          width: 150
        },
        {
          lab: '备注',
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
          label: '治疗时间：',
          clearable: true,
          values: []
        },
        customerName: {
          type: 'Tdatetime',
          label: '同类型项目最后治疗时间：',
          clearable: true,
          values: []
        },
        customPhone: {
          type: 'Tdatetime',
          label: '第一次治疗时间',
          clearable: true,
          values: []
        },
        customerNuber: {
          type: 'Tdatetime',
          label: '最后到院时间：',
          clearable: true,
          values: []
        },
        xiangmu: {
          type: 'Tdatetime',
          label: '最后消费时间：',
          clearable: true,
          values: []
        },
        typeThreeIds: {
          type: 'Tdatetime',
          label: '结账时间：',
          clearable: true,
          values: []
        },
        label: {
          type: 'Tdatetime',
          label: '最后回访时间：：',
          clearable: true,
          values: []
        },
        onlineUserId: {
          type: 'Tdatetime',
          label: '年卡有效期时间：',
          clearable: true,
          values: []
        },
        tades: {
          type: 'Tdatetime',
          label: '剩余治疗次数：',
          clearable: true,
          values: []
        },
        aestheticConsultant: {
          type: 'Tinput',
          label: '消费金额：',
          values: []
        },
        aestheticConsultants: {
          type: 'Tinput',
          label: '累计消费金额：',
          values: []
        },
        isSecondary: {
          type: 'input',
          label: '客户姓名：'
        },
        remarks: {
          type: 'input',
          label: '电话：'
        },
        huiyuan: {
          type: 'input',
          label: '客户卡号：'
        },
        daibiao: {
          type: 'select',
          label: '会员等级：',
          clearable: true,
          options: []
        },
        men: {
          type: 'Tinput',
          label: '年龄：',
          values: []
        },
        kouqianng: {
          type: 'select',
          label: '医生：',
          clearable: true,
          options: []
        },
        xinxi: {
          type: 'select',
          label: '是否有标签：',
          clearable: true,
          options: []
        },
        taocan: {
          type: 'select',
          label: '新老客户：',
          clearable: true,
          options: []
        },
        status: {
          type: 'input',
          label: '客户标签：',
          values: []
        },
        sex: {
          type: 'input',
          label: '客户标签反选：',
          values: []
        },
        mei: {
          type: 'select',
          label: '美学顾问：'
        },
        dai: {
          type: 'select',
          label: '客户代表：'
        },
        hui: {
          type: 'select',
          label: '会员客服：'
        },
        lastTime: {
          type: 'select',
          label: '服务助理：'
        },
        lastxiaofei: {
          type: 'select',
          label: '科室：'
        },
        lasthuifang: {
          type: 'select',
          label: '一级项目：'
        },
        gui: {
          type: 'select',
          label: '二级项目：',
          clearable: true,
          options: []
        },
        keshizhuli: {
          type: 'select',
          label: '三级项目：',
          clearable: true,
          values: []
        },
        linka: {
          type: 'input',
          label: '项目名称：'
        },
        kaStatus: {
          type: 'input',
          label: '产品项目组合：'
        },
        // hei: {
        //   type: 'input',
        //   label: '项目名称：'
        // },
        // dizhi: {
        //   type: 'input',
        //   label: '地址：'
        // },
        zhiye: {
          type: 'select',
          label: '是否退款项目：',
          clearable: true,
          options: []
        },
        nengli: {
          type: 'input',
          label: '备注：'
        },
        ramks: {
          type: 'Tinput',
          label: '待剩余执行业绩',
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
      pagination:{
        show:true
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
