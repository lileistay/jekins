<template>
  <!-- 我的预约金客户 -->
  <div class="box">
    <slideSearch :options="options">
      <div slot="btnBar" class="btnBar">
        <el-button size="mini">查询</el-button>
        <el-button size="mini">导出</el-button>
      </div>

      <slot>
        <sg-table
          size="mini"
          index="序号"
          border
          highlight-current-row
          :header-style="{backgroundColor:'#fff'}"
          :table-data="tableData"
          :pagination="pagination"
          :pagination-style="{backgroundColor:'#f8f8f8'}"
          :columns="columns"
        >
          <div slot="searchBar" class="searchBar">
            <div><i class="el-icon-s-data" style="color:blue" />统计信息</div>
            <div>
              <span>总人数：222</span>
              <span>实付金额：333</span>
              <span>剩余总合计：33</span>
            </div>
          </div>
          <div slot="header" class="header">
            <div> <i class="el-icon-s-data" style="color:blue" />列表清单</div>
            <div>
              <!-- <el-button
                size="mini"
                type="success"
                icon="el-icon-s-promotion"
                plain
              >批量发送短信</el-button> -->
              <el-button
                size="mini"
                icon="el-icon-plus"
                type="primary"
                plain
              >手工上报</el-button>
            </div>
          </div>
        </sg-table>
      </slot>
    </slideSearch>
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
      options: {
        Isitvalid: {
          type: 'select',
          label: '是否有效',
          options: []
        },
        deal: {
          type: 'select',
          label: '是否成交客户',
          options: []
        },
        CheckoutTime: {
          type: 'datetimerange',
          label: '结账时间'
        },
        PaidInamount: {
          type: 'input',
          label: '实付金额'
        },
        RemainingAmount: {
          type: 'input',
          label: '剩余金额'
        },
        refund: {
          type: 'select',
          label: '是否有退款'
        },
        customername: {
          type: 'input',
          label: '客户姓名'
        },
        customeripone: {
          type: 'input',
          label: '电话'
        },
        Cardnumber: {
          type: 'input',
          label: '客户卡号'
        },
        doctor: {
          type: 'select',
          label: '医生',
          options: []
        },
        representative: {
          type: 'select',
          label: '客户代表',
          options: []
        },
        MediaType: {
          type: 'select',
          label: '媒介类型',
          options: []
        },
        Department: {
          type: 'select',
          label: '科室'
        },
        Oneproject: {
          type: 'select',
          label: '一级项目',
          options: []
        },
        twoproject: {
          type: 'select',
          label: '二级项目'
        },
        FinalConsumption: {
          type: 'input',
          label: '最后消费时间'
        },
        lastVisit: {
          type: 'datetimerange',
          label: '最后回访时间'
        },
        assistant: {
          type: 'select',
          label: '服务助理'
        },
        member: {
          type: 'select',
          label: '会员客服'
        },
        outTime: {
          type: 'datetimerange',
          label: '过期时间'
        }

      },
      tableData: [],
      pagination: {
        show: true// 显示底部分页组件
      },
      columns: [
        {
          lab: '打印',
          val: 'Print'
        },
        {
          lab: '收费编号',
          val: 'Chargenumber'
        },
        {
          lab: '收费单状态',
          val: 'ChargingStatus'
        },
        {
          lab: '收费单类型',
          val: 'type'
        },
        {
          lab: '客户姓名',
          val: 'name'
        },
        {
          lab: '备注',
          val: 'remarks'
        },
        {
          lab: '费用合计',
          val: 'TotalExpenses'
        },
        {
          lab: '折扣',
          val: 'discount'
        },
        {
          lab: '应付款',
          val: 'copewith'
        },
        {
          lab: '实付款',
          val: 'ActualPayment'
        },
        {
          lab: '美学顾问',
          val: 'blacklistName'
        },
        {
          lab: '二开推荐人',
          val: 'twoRecommender'
        },
        {
          lab: '分诊类型',
          val: 'Triagetype'
        },
        {
          lab: '是否领药',
          val: 'ReceivingMedicine'
        },
        {
          lab: '是否治疗',
          val: 'Treatmentornot'
        },
        {
          lab: '下单人',
          val: 'NextPerson'
        },
        {
          lab: '下单时间',
          val: 'Ordertime'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
}

.searchBar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:nth-child(1) div span {
    margin-right: 10px;
  }
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
