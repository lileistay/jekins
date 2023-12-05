<template>
  <!--  我的储值客户 -->
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
          <el-form-item label="客户代表:" prop="keshi">
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
          <el-form-item label="储值现金">
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
            <el-col :span="1">至</el-col>
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="储值赠送">
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
            <el-col :span="1">至</el-col>
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="储值总额">
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
            <el-col :span="1">至</el-col>
            <el-col :span="8">
              <el-input style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="最后消费时间">
            <el-col :span="8">
              <el-date-picker type="date" placeholder="选择日期" style="width: 100%;" />
            </el-col>
            <el-col class="line" :span="1">--</el-col>
            <el-col :span="8">
              <el-date-picker type="date" placeholder="选择日期" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="是否成交客户:">
            <el-select placeholder="请选择" filterable>
              <el-option label="成交" />
              <el-option label="未成交" />
            </el-select>
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
            <span> 卡储值金额: 0</span>
            <span>卡储值赠送: 0 </span>
            <span>卡储值总额: 0</span>
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
  components: { SgTable, SendMessage, ManualSubmission },
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
          lab: '美学顾问',
          val: 'isReachCourtyardName'
        },
        {
          lab: '性别',
          val: 'arrivalTime'
        },
        {
          lab: '年龄',
          val: 'preProduction'
        },
        {
          lab: '储值现金',
          val: 'onlineUserName'
        },
        {
          lab: '储值赠送',
          val: 'visituserName'
        },
        {
          lab: '储值总额',
          val: 'receptionName'
        },
        {
          lab: '最后消费时间',
          width: 130,
          val: 'blacklistName'
        },
        {
          lab: '客户代表',
          val: 'appointmentTime'
        },
        {
          lab: '是否成功客户',
          width: 130,
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

