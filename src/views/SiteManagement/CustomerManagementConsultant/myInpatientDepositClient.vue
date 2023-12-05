<template>
  <!-- 我的住院押金客户 -->
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
            <div class="title"> <i class="el-icon-s-grid" /> 统计信息</div>
            <span>客户人数: 0人</span>
          </div>
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <el-form class="headerTopPadding" style="float: left">
              <el-form-item class="wentime">
                <span><i class="el-icon-s-fold" /> 列表清单</span>
              </el-form-item>
            </el-form>
            <el-button
              size="mini"
              type="primary"
              plain
              icon="el-icon-plus"
              style="float: right;margin-top: 26px;margin-right: 20px"
              @click.stop.native="openManualDialog"
            >手工上报</el-button>
            <!-- <el-button
              size="mini"
              type="success"
              plain
              icon="el-icon-plus"
              style="float: right;margin-top: 26px;margin-right: 20px"
              @click.stop="sendMessage"
            >批量发送短信</el-button> -->
          </div>
          <template #custom="data">
            <!-- 如需要点击姓名跳转 -->
            <div v-if="data.props === 'degreeIntention'">
              <show-dict-data
                :options="dict.type.degree_intention_list"
                :value="data.custom.degreeIntention"
              />
            </div>
            <div v-else-if="data.props === 'customerName'">
              <router-link :to="{path:'/要跳转的路由'}">{{ data.custom.customerName }}</router-link>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <!--批量上传-->
    <send-message
      :show-send-message-dialog="showSendMessageDialog"
      :selection-data="selectionData"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import ManualSubmission from '@/components/ManualSubmission'
import SendMessage from '@/components/SendMessage'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
export default {
  name: 'BookFormQuery',
  dicts: ['degree_intention_list', 'sys_user_sex', 'economic_capacity', 'execution_type', 'return_stage', 'task_level', 'whether'],
  components: {
    SgTable,
    slideSearch,
    ManualSubmission,
    SendMessage
  },
  data() {
    return {
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      // 系统用户列表
      sysUserList: [],
      // 预约项目
      bookProjectList: [],
      // 手工上报
      showManualDialog: false,
      innerDialog: false,
      manualFormLoading: false,
      // 客户标签
      customLabelDialog: false,
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      // 媒介来源数据
      channelType: [],
      // 手工上报表单
      manualForm: {
        userInfo: {},
        manualReport: {
          isOneReturnVisit: true
        }
      },
      // 顾客标签数据table
      manualFormTableData: [],
      // 顾客标签类型
      customerLabelTypeData: [],
      customerLabelTypeChildData: [],
      //  序列清单
      columns: [
        {
          lab: '是否有效',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '结账时间',
          val: 'customPhone'
        },
        {
          lab: '收费单号',
          val: 'remarks'
        },
        {
          lab: '实付金额',
          val: 'appointmentTime',
          width: 140
        },
        {
          lab: '收费单类型',
          val: 'lastReturnVisitTime',
          width: 140
        },
        {
          lab: '账户余额押金',
          width: 130,
          val: 'returnNum'
        },
        {
          lab: '客户姓名',
          val: 'degreeIntention',
          custom: 'degreeIntention'
        },
        {
          lab: '电话',
          val: 'dsingleUserName'
        },
        {
          lab: '客户卡号',
          val: 'visituserName'
        },
        {
          lab: '医生',
          val: 'pejectNames'
        },
        {
          lab: '美学顾问',
          val: 'channelName'
        },
        {
          lab: '客户代表',
          val: 'dsingleTime'
        },
        {
          lab: '市区',
          val: 'createTime',
          width: 140
        },
        {
          lab: '科室',
          val: 'arrivalTime',
          width: 140
        },
        {
          lab: '最后消费时间',
          width: 130,
          val: 'onlineUserName'
        }
      ],
      // 查询出列表
      options: {
        customerName: {
          type: 'select',
          label: '是否有效:',
          options: [],
          values: ''
        },
        lastReturnVisitTime: {
          type: 'Tinput',
          label: '结账时间:',
          values: []
        },
        remarks: {
          type: 'Tinput',
          label: '实付金额:',
          values: []
        },
        popname: {
          type: 'input',
          label: '客户姓名'
        },
        appointmentTime: {
          type: 'input',
          label: '电话:'
        },
        returnNum: {
          type: 'input',
          label: '客户卡号:'
        },
        degreeIntention: {
          type: 'Tinput',
          label: '账户剩余押金:',
          values: []
        },
        docti: {
          type: 'select',
          label: '医生:',
          options: []
        },
        pejectNames: {
          type: 'select',
          label: '美学顾问:',
          options: []
        },
        channelName: {
          type: 'select',
          label: '客户代表:',
          options: []
        },
        keshi: {
          type: 'select',
          label: '科室',
          options: []
        },
        dsingleTime: {
          type: 'Tinput',
          label: '最后消费时间:',
          values: []
        },
        dsileTime: {
          type: 'Tinput',
          label: '过期时间:',
          values: []
        }
      }
    }
  },
  methods: {
    // 打开手工上报弹窗
    openManualDialog() {
      this.showManualDialog = true
      // if (this.selectionData.length < 1) {
      //   this.$message.warning('请选择至少一名顾客进行修改')
      //   return
      // }
    },
    // 打开发送短信弹窗
    sendMessage() {
      // if (this.selectionData.length < 1) {
      //   this.$message.warning('请选择至少一名顾客发送短信')
      //   return
      // }
      this.showSendMessageDialog = true
    },
    // 关闭发送短信弹窗
    closeDialog() {
      this.showSendMessageDialog = false
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
  height: 100%;
  line-height: 30px;
  color: #999;
  .title {
    font-weight: bold;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;
    &:before {
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 15px;
      background-color: #1abc9c;
      left: 0px;
      border-radius: 10px;
      content: "";
    }
  }
}
.headerTopPadding {
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}
.visitBox {
  width: 100%;
    & > li:nth-of-type(odd) {
      border-bottom: none;
    }
  }
.innerVisitBox {
  margin-top: 20px;
    .visitContent {
      width: 100%;
      height: 160px;
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      & > div {
        width: 50%;
        padding: 0 20px;
        box-sizing: border-box;
        & > .title {
          padding: 0 10px;
          box-sizing: border-box;
          position: relative;
          font-weight: bold;
          margin-bottom: 10px;
          &:before {
            position: absolute;
            display: inline-block;
            top: 0;
            left: 0;
            bottom: 0;
            width: 3px;
            background-color: #1abc9c;
            content: "";
          }
        }
      }
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    background-color: #eeeeee;
    padding: 0 10px;
    line-height: 30px;
    box-sizing: border-box;
    span {
      color: #7ec5b7;
    }
  }
</style>
