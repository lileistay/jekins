<template>
  <!-- 我的收费单 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData"
        >查询</el-button>
      </div>
      <slot>
        <sg-table

          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          stripe
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="handleSelectionChange"
        >
          <div
            slot="searchBar"
            class="searchBar"
          >
            <div>统计信息</div>
            <div>
              <span>应付金额 : 0.00元</span>
              &nbsp;
              <span>实付金额 : 0.00元</span>
            </div>
          </div>
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <el-form class="headerTopPadding" style="float: left">
              <el-form-item class="wentime">
                <span><i class="el-icon-s-fold" /> 列表清单</span>
              </el-form-item>
            </el-form>
            <el-button
              type="danger"
              size="mini"
              plain
              style="float: right;margin-top: 12px"
              @click.stop="sendMessage"
            >删除</el-button>
            <el-button
              type="success"
              size="mini"
              plain
              style="float: right;margin-top: 12px"
              @click.stop.native="openManualDialog"
            >预约金消费</el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              style="float: right;margin-top: 12px"
              @click.stop="sendMessage"
            >退储值</el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              style="float: right;margin-top: 12px"
              @click.stop.native="openManualDialog"
            >退款</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              style="float: right;margin-top: 12px"
              @click.stop.native="openManualDialog"
            >提交</el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              style="float: right;margin-top: 12px"
              @click.stop.native="openManualDialog"
            >撤回</el-button>
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
    SgTable,
    slideSearch
  },
  data() {
    return {
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      //  序列清单
      columns: [
        {
          lab: '打印',
          val: 'customerName'
        },
        {
          lab: '明细',
          val: 'customPhone'
        },
        {
          lab: '还退款',
          val: 'remarks'
        },
        {
          lab: '收费单编号',
          val: 'appointmentTime',
          width: 165
        },
        {
          lab: '收费单状态',
          val: 'lastReturnVisitTime'
        },
        {
          lab: '收费单类型',
          val: 'returnNum'
        },
        {
          lab: '客户姓名',
          val: 'degreeIntention'
        },
        {
          lab: '卡号',
          val: 'dsingleUserName'
        },
        {
          lab: '备注',
          val: 'visituserName'
        },
        {
          lab: '费用合计',
          val: 'pejectNames'
        },
        {
          lab: '折扣',
          val: 'channelName'
        },
        {
          lab: '应付款',
          val: 'dsingleTime'
        },
        {
          lab: '实付款',
          val: 'createTime'
        },
        {
          lab: '是否领药',
          val: 'arrivalTime'
        },
        {
          lab: '是否治疗',
          val: 'onlineUserName'
        },
        {
          lab: '科室',
          val: 'onlineUserName'
        },
        {
          lab: '客户代表',
          val: 'onlineUserName'
        },
        {
          lab: '推荐人',
          val: 'onlineUserName'
        },
        {
          lab: '现场咨询师',
          val: 'onlineUserName'
        },
        {
          lab: '下单人',
          val: 'onlineUserName'
        },
        {
          lab: '下单时间',
          val: 'onlineUserName'
        },
        {
          lab: '退款原因',
          val: 'onlineUserName'
        },
        {
          lab: '打回备注/审批备注',
          width: 120,
          val: 'onlineUserName'
        }
      ],
      // 查询出列表
      options: {
        customerName: {
          type: 'input',
          label: '收费单号:'
        },
        customPhone: {
          type: 'input',
          label: '客户姓名:'
        },
        remarks: {
          type: 'input',
          label: '电话:'
        },
        appointmentTime: {
          type: 'input',
          label: '卡号:'
        },
        lastReturnVisitTime: {
          type: 'select',
          label: '收费类型:',
          options: []
        },
        returnNum: {
          type: 'select',
          label: '收费单状态:',
          options: []
        },
        degreeIntention: {
          type: 'select',
          label: '科室:',
          options: []
        },
        dsingleUserName: {
          type: 'select',
          label: '美学顾问:',
          options: []
        },
        visituserName: {
          type: 'select',
          label: '回访次数:',
          values: []
        },
        pejectNames: {
          type: 'select',
          label: '下单人:',
          values: []
        },
        visiterName: {
          type: 'Tinput',
          label: '开单时间:',
          values: []
        },
        dsingleTime: {
          type: 'input',
          label: '退款原因:'
        }
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
.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}
.headerTopPadding {
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}
  span {
    color: #7ec5b7;
  }
</style>
