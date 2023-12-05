<template>
    <div>
      <slideSearch :options="options">
        <div slot="btnBar">
          <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getList(true)">查询
          </el-button>
        </div>
      <slot>
        <sg-table
          ref="table"
          :sg-ref="'multipleTable'"
          size="mini"
          index="序号"
          border
          :pagination="pagination"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :hideSearchBar="true"
          @size-change=" sizeChange"
          @current-change="currentChange"
          :cell-class-name="cellClassName"
        >
          <template #custom="data">
            <div v-if="data.props === 'billType'">
              <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
            <div v-if="data.props === 'edit'">
              <el-button size="mini"  type="text" style="color: #E6A23C"  @click.stop="addDialogs(data.custom)">修改
              </el-button>
            </div>
          </template>

          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
          </div>
        </sg-table>
      </slot>
      </slideSearch>

      <!--新增-->
      <sgDialog
        :title="xFlag==0?'新增':'修改'"
        :dialog="dialogVisible"
        size="400px"
        @handleClose="dialogVisible=false"
        v-if="dialogVisible"
      >
        <div slot="out">
          <el-form ref="formList" label-width="120px" style="display: flex;justify-content: space-between;flex-wrap: wrap" :inline="true" :rules="rules" :model="formList" size="mini" @submit.native.prevent>
            <el-form-item label="收费渠道:" prop="noticeType">
              <el-select v-model="formList.payId" style="width:180px" @change="$forceUpdate()"   size="mini" clearable filterable  placeholder="请选择用户id">
                <el-option
                  v-for="(item,index) in billtypeDate"
                  :key="index"
                  :label="item.payName"
                  :value="item.payId"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: end;">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini" :loading="submitLoading" @click="submit">保存</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-close" @click="handleClose">关闭</el-button>
      </span>
      </sgDialog>
    </div>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import slideSearch from '@/components/SlideSearchBar/index'
import {todayTime} from "../../../utils/time";
import moment from "moment/moment";
export default {
  name: "CashierInformation.vue",
  components: {SgTable,sgDialog,slideSearch},
  dicts:['billing_type'],
  data(){
    return{
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      tableData:[],
      columns:[
        {
          lab: '订单类型',
          val: 'billType',
          custom: 'billType'
        },
        {
          lab: '收银员',
          val: 'crName',
        },
        {
          lab: '收费单编号',
          val:'orderNumber'
        },
        {
          lab: '接待顾问',
          val: 'acName'
        },
        {
          lab: '赠送',
          val: 'giveMoney',
        },
        {
          lab:'科室',
          val:'departmentName'
        },
        {
          lab: '支付金额',
          val: 'paymentAmount',
        },
        {
          lab: '收费渠道',
          val: 'payName',
        },
        {
          lab: '结账时间',
          val: 'createTime',
        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit'
        }
      ],
      orderNumber:'',
      dialogVisible:false,
      xFlag:'',
      submitLoading:false,
      formList:{},
      rules:{

      },
      options:{
        createTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          disabled:true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        orderNumber: {
          type: 'input',
          label: '收费单号:',
          clearable: true
        },
      },
      billtypeDate:[],
      chargeId:''
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods:{
    cellClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    getPayment(val){
      const query={
        billType:val,

      }
      this.$api.modules.finance.payDeptChannelRecord(query).then(res => {
        if (res) {
          this.billtypeDate = res.rows
        }
      })
    },
    getList(isSearch){
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const query={
        ...this.pagination,
        deptId:this.deptId,
        ...data,
      }
      this.$api.billingList.chargeRecordInfoList(query).then(res => {
       if (res.code==200){
         this.tableData=res.rows
         this.pagination.total=res.total
       }
      })
    },
    addDialogs(val){
      this.dialogVisible=true
      this.getPayment(val.billType)
      this.chargeId=val.chargeId
      this.formList={
        payId:val.paymentChannel
      }
    },
    submit(){
      const query={
        paymentChannel:this.formList.payId,
        chargeId:this.chargeId
      }
      this.$api.billingList.chargeRecordInfoEdit(query).then(res => {
        if (res) {
          this.getList()
          this.$message.success(res.msg)
          this.dialogVisible=false
        }
      })
    },
    handleClose(){
      this.dialogVisible=false
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getList()
    },

  }
}
</script>

<style scoped>

</style>