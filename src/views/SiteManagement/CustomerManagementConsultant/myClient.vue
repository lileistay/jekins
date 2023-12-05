<template>
  <!-- 我的客户 -->
  <div class="box">
    <slideSearch :options="options">
      <div
        slot="btnBar"
        class="btnBar"
      >
        <el-button size="mini">查询</el-button>
        <el-button size="mini">导出</el-button>
      </div>
      <slot>
        <sg-table
          border
          :header-style="{backgroundColor:'#fff'}"
          :table-data="tableData"
          :pagination="pagination"
          :pagination-style="{backgroundColor:'#f8f8f8'}"
          :columns="columns"
        >
          <div slot="searchBar" class="searchBar">
            <div slot="header" class="header">
              <div><i class="el-icon-s-data" style="color:blue" />列表清单
              </div>
              <div>
                <el-button
                  size="mini"
                  icon="el-icon-plus"
                  type="primary"
                  plain
                >手工上报
                </el-button>
                <!-- <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-s-promotion"
                  plain
                >批量发送短信
                </el-button> -->
                <el-button
                  size="mini"
                  icon="el-icon-plus"
                  type="primary"
                  plain
                >补充客户信息
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-s-promotion"
                  plain
                >批量添加标签
                </el-button>
              </div>
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
        sitvalid: {
          type: 'Tinput',
          label: '最后来院时间:',
          values: []
        },
        Isitvali: {
          type: 'Tinput',
          label: '最后消费时间:',
          values: []
        },
        Istvalid: {
          type: 'Tinput',
          label: '最后治疗时间:',
          values: []
        },
        Isitvald: {
          type: 'Tinput',
          label: '最后回访时间:',
          values: []
        },
        Isivalid: {
          type: 'Tinput',
          label: '建档时间:',
          values: []
        },
        Isitalid: {
          type: 'Tinput',
          label: '首次来院时间:',
          values: []
        },
        // ---------
        Isitvalid: {
          type: 'input',
          label: '客户姓名:'
        },
        Isitvalid: {
          type: 'input',
          label: '客户姓名:'
        },

        Isitvalid: {
          type: 'input',
          label: '客户姓名:'
        },
        deal: {
          type: 'input',
          label: '电话:',
          options: []
        },
        CheckoutTime: {
          type: 'input',
          label: '客户卡号:'
        },
        PaidInamount: {
          type: 'select',
          clearable: true,
          label: '最后回访时间',
          options: []
        },
        RemainingAmount: {
          type: 'select',
          label: '客户状态:',
          clearable: true,
          options: []
        },
        refund: {
          type: 'select',
          clearable: true,
          label: '媒介类型:',
          options: []
        },
        customername: {
          type: 'select',
          clearable: true,
          label: '媒介来源:',
          options: []
        },
        customeripone: {
          type: 'select',
          clearable: true,
          label: '美学顾问:',
          options: []
        },
        Cardnumber: {
          type: 'select',
          clearable: true,
          label: '客户代表:',
          options: []
        },
        doctor: {
          type: 'input',
          label: '建档类型'
        },
        representative: {
          type: 'select',
          clearable: true,
          label: '是否有标签',
          options: []
        },
        MediaType: {
          type: 'input',
          label: '客户标签'
        },
        Department: {
          type: 'input',
          label: '客户标签反选'
        },
        Oneproject: {
          type: 'select',
          clearable: true,
          label: '一级项目',
          options: []
        },
        twoproject: {
          type: 'select',
          clearable: true,
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
          clearable: true,
          label: '服务助理'
        },
        member: {
          type: 'select',
          clearable: true,
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
          lab: '最后来院时间',
          width: 110,
          val: 'Print'
        },
        {
          lab: '最后消费时间',
          width: 110,
          val: 'Chargenumber'
        },
        {
          lab: '最后治疗时间',
          width: 110,
          val: 'ChargingStatus'
        },
        {
          lab: '最后回访时间',
          width: 110,
          val: 'type'
        },
        {
          lab: '建档时间',
          val: 'name'
        },
        {
          lab: '首次来院时间',
          width: 110,
          val: 'remarks'
        },
        {
          lab: '客户姓名',
          val: 'TotalExpenses'
        },
        {
          lab: '电话',
          val: 'discount'
        },
        {
          lab: '客户卡号',
          val: 'copewith'
        },
        {
          lab: '客户状态',
          val: 'ActualPayment'
        },
        {
          lab: '会员等级',
          val: 'blacklistName'
        },
        {
          lab: '客户标签',
          val: 'twoRecommender'
        },
        {
          lab: '媒介',
          val: 'Triagetype'
        },
        {
          lab: '建档人',
          val: 'ReceivingMedicine'
        },
        {
          lab: '美学顾问',
          val: 'Treatmentornot'
        },
        {
          lab: '客户代表',
          val: 'NextPerson'
        },
        {
          lab: '员工推荐人',
          val: 'Ordertime'
        },
        {
          lab: '服务助理',
          val: 'Ordertime'
        },
        {
          lab: '会员客服',
          val: 'Ordertime'
        },
        {
          lab: '建档类型',
          val: 'Ordertime'
        },
        {
          lab: '国省市区',
          val: 'Ordertime'
        },
        {
          lab: '地址',
          val: 'Ordertime'
        },
        {
          lab: '生日',
          val: 'Ordertime'
        },
        {
          lab: '职业',
          val: 'Ordertime'
        },
        {
          lab: '经济能力',
          val: 'Ordertime'
        },
        {
          lab: '婚姻',
          val: 'Ordertime'
        },
        {
          lab: '回访次数',
          val: 'Ordertime'
        },
        {
          lab: '消费金额',
          val: 'Ordertime'
        },
        {
          lab: '是否黑名单',
          val: 'Ordertime'
        },
        {
          lab: '会员卡状态',
          val: 'Ordertime'
        },
        {
          lab: '领卡时间',
          val: 'Ordertime'
        },
        {
          lab: '是否网点预约到院',
          width: 120,
          val: 'Ordertime'
        },
        {
          lab: '客户备注',
          val: 'Ordertime'
        },
        {
          lab: '回访备注',
          val: 'Ordertime'
        },
        {
          lab: '上次来院时间',
          val: 'Ordertime'
        },
        {
          lab: '上次消费时间',
          val: 'Ordertime'
        },
        {
          lab: '门诊病历号',
          val: 'Ordertime'
        },
        {
          lab: '口腔归属医生/服务助理',
          width: 140,
          val: 'Ordertime'
        },
        {
          lab: '皮肤归属医生/服务助理',
          width: 140,
          val: 'Ordertime'
        },
        {
          lab: '整形归属医生/服务助理',
          width: 140,
          val: 'Ordertime'
        },
        {
          lab: '无创归属医生/服务助理',
          width: 140,
          val: 'Ordertime'
        },
        {
          lab: '中医归属医生/服务助理',
          width: 140,
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
  height: 780px;
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
