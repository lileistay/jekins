<template>
  <!-- 档案管理 -->
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
            <div>
              <span>客户量(人)：0</span>
            </div>
          </div>
          <div slot="header" class="header">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
              <span><i style="background-color:#ffffff" />未安排</span>
              <span><i style="background-color:#c6f9c3" />已安排</span>
              <span><i style="background-color:#fff8c6" />有退款</span>
            </div>
            <div>
              <el-button size="mini" plain type="success" icon="el-icon-plus">照片上传</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">档案登记</el-button>
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
          lab: '客户',
          val: ''
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
          lab: '是否安排',
          val: '',
          width: 150
        },
        {
          lab: '是否退款项目',
          val: '',
          width: 150
        },
        {
          lab: '门诊病历',
          val: ''
        },
        {
          lab: '住院病历',
          val: ''
        },
        {
          lab: '客户状态',
          val: '',
          width: 150
        },
        {
          lab: '是否二次到院',
          val: '',
          width: 150
        },
        {
          lab: '收费单编号',
          val: '',
          width: 165
        },
        {
          lab: '一级产品类型',
          val: '',
          width: 150
        },
        {
          lab: '二级产品类型',
          val: '',
          width: 150
        },
        {
          lab: '三级产品类型',
          val: '',
          width: 150
        },
        {
          lab: '项目名称',
          val: '',
          width: 150
        },
        {
          lab: '科室',
          val: ''
        },
        {
          lab: '医生',
          val: '',
          showOverflowTooltip: true
        },
        {
          lab: '美学顾问',
          val: '',
          width: 120
        },
        {
          lab: '是否有照片',
          val: '',
          width: 150
        }
      ],
      options: {
        receptionTimes: {
          type: 'Tdatetime',
          label: '结账时间：',
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
          label: '是否安排：',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'select',
          label: '是否退款项目',
          clearable: true,
          options: []
        },
        label: {
          type: 'select',
          label: '医生：',
          clearable: true,
          options: []
        },
        // onlineUserId: {
        //   type: 'Tdatetime',
        //   label: '上一次预约时间',
        //   clearable: true,
        //   values: []
        // },
        // // 无
        // xian: {
        //   type: 'input',
        //   label: '上一次预约内容：',
        //   clearable: true,
        //   options: []
        // },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问：',
          clearable: true,
          options: []
        },
        aestheticConsultants: {
          type: 'select',
          label: '客户状态：',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '是否二次到院：',
          clearable: true,
          options: []
        },
        remarks: {
          type: 'select',
          label: '科室：',
          clearable: true,
          options: []
        },
        huiyuan: {
          type: 'select',
          label: '一级类型：'
        },
        meixue: {
          type: 'select',
          label: '二级类型：'
        },
        daibiao: {
          type: 'select',
          label: '三级类型：'
        },
        kouqianng: {
          type: 'input',
          label: '项目名称：'
        },
        xinxi: {
          type: 'select',
          label: '是否有照片：'
        },
        taocan: {
          type: 'input',
          label: '门诊病历号：'
        },
        status: {
          type: 'select',
          label: '是否有门诊病历：'
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
.el-input__prefix{
  display: none;
}
</style>
