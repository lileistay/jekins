<template>
  <!-- 档案借还记录 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" icon="el-icon-search">查询</el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"
       
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          highlight-current-row
        >
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
            </div>
          </div>
          <div slot="header" class="header">
            <!--            <div>-->
            <!--              <span><i class="el-icon-s-data" style="color: #5f94de"></i>列表清单</span>-->
            <!--              <span><i style="background-color:#ffffff"></i>未预约</span>-->
            <!--              <span><i style="background-color:#c6f9c3"></i>已预约</span>-->
            <!--            </div>-->
            <!--            <div>-->
            <!--              <el-button size="mini" plain type="primary" icon="el-icon-plus">登记预约</el-button>-->
            <!--              <el-button size="mini" plain type="success" icon="el-icon-plus">批量发送短信</el-button>-->
            <!--              <el-button size="mini" plain type="primary" icon="el-icon-plus">手工上报</el-button>-->
            <!--              <el-button size="mini" plain type="primary" icon="el-icon-s-platform">登记预约(全屏)</el-button>-->
            <!--            </div>-->
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
          label: '记录时间',
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
          label: '借还操作：',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        // 无
        xian: {
          type: 'input',
          label: '借还人员：',
          clearable: true,
          options: []
        }
      },
      pagination: {
        show: true
      }
    }
  },
  methods: {
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
