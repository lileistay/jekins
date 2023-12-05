<template>
  <!-- 我的欠款客户-->
  <div>
    <sg-table
      size="mini"
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#f5eae4'}"
    >
      <!--搜索框 -->
      <div slot="searchBar" style="float:left;position:relative;">
        <el-form ref="form" inline size="mini" :rules="rules" :show-message="false" :model="form" @submit.native.prevent="getData">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="form.userPhone" />
          </el-form-item>
          <el-form-item label="电话:" prop="userPhone">
            <el-input />
          </el-form-item>
          <el-form-item label="客户卡号:" prop="ID">
            <el-input />
          </el-form-item>
          <el-form-item label="科室:" prop="keshi">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="医生:" prop="userPhone">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户代表:" prop="yisheng">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="美学顾问:" prop="userPhone">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="一级项目:" prop="userPhone">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="二级项目:" prop="userPhone">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否还请:" prop="userPhone">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="欠款">
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
            <el-col :span="1">至</el-col>
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="8">
              <el-date-picker type="date" placeholder="选择日期" style="width: 100%;" />
            </el-col>
            <el-col class="line" :span="1">--</el-col>
            <el-col :span="8">
              <el-date-picker type="date" placeholder="选择日期" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="最后消费时间">
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
            <el-col :span="1">至</el-col>
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click.stop.native="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- ----------------------------------- -->
      <div slot="header" style="width: 100%;">
        <el-form class="headerTopPadding" style="float: left">
          <el-form-item class="wentime">
            <span> 总人数: 0</span>
            <span> 欠款金额合计: 0</span>
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
    </sg-table>
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
import SgTable from '@/components/Table'
import { validPhone } from '@/utils/validate'
export default {
  name: 'BookForm',
  dicts: ['degree_intention_list'],
  components: { SgTable, ManualSubmission, SendMessage },
  data() {
    // 手机号校验
    const validatePhone = (rule, value, callback) => {
      if (value !== undefined) {
        const valid = validPhone(value)
        if (!valid) {
          callback(new Error('手机号码格式不正确'))
        }
        callback()
      }
    }
    return {
      // 手工上报
      showManualDialog: false,
      innerDialog: false,
      manualFormLoading: false,
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      // 搜索手机号码
      form: {
        userPhone: undefined
      },
      rules: {
        userPhone: [
          { trigger: 'change' },
          { validator: validatePhone, trigger: 'blur' },
          { validator: validatePhone, trigger: 'change' }
        ]
      },
      tableData: [],
      rowTable: undefined,
      // 表头
      columns: [
        {
          lab: '姓名',
          val: 'createTime',
          width: 180
        },
        {
          lab: '电话',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '客户卡号',
          val: 'formalCustomerName',
          width: 165
        },
        {
          lab: '性别',
          val: 'isReachCourtyardName'
        },
        {
          lab: '年龄',
          val: 'arrivalTime'
        },
        {
          lab: '城市',
          val: 'preProduction'
        },
        {
          lab: '区域',
          val: 'onlineUserName'
        },
        {
          lab: '美学顾问',
          val: 'visituserName'
        },
        {
          lab: '医生',
          val: 'receptionName'
        },
        {
          lab: '科室',
          val: 'blacklistName'
        },
        {
          lab: '产品名称',
          val: 'appointmentTime',
          width: 180
        },
        {
          lab: '预约状态',
          val: 'appointmentName'
        }
      ],
      operate: {}
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
.headerTopPadding{
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}
span{
    font-size: 14px;
    font-weight: 700;
    margin-right: 8px;
    color: #587fa1;
}
</style>
