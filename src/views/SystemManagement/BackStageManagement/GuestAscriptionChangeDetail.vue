<template>
  <div class="container">
    <sg-table v-if="true"
              ref="table"
             
              :sg-ref="'multipleTable'"
              :pagination="pagination"
              size="mini"
              border
              stripe
              index="序号"
              highlight-current-row
              :table-data="changeListVoList"
              :columns="columns">
      <div slot="searchBar">
        <el-form :inline="true" :model="phoneDetail" size="mini">
          <el-form-item label="姓名">
            <el-input v-model="phoneDetail.customerName" size="mini" placeholder="姓名" disabled/>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="phoneDetail.phone" size="mini" placeholder="电话" disabled/>
          </el-form-item>
          <el-button type="primary" size="mini" plain  :loading="showDataDialog" icon="el-icon-refresh" @click="getChangeListVoList" style="float: right">刷新</el-button>
        </el-form>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgDialog from '@/components/Dialog/index.vue'
import {validPhone} from '@/utils/validate'
import SgTable from "@/components/Table/index.vue";

export default {
  name: 'MaintainGuestPhoneDetail',
  components: {SgTable, SgDialog},
  data() {
    return {
      guestId: null,
      // 主电话详情
      phoneDetail: {
        customerName: null,
        phone: null
      },
      // 电话列表
      changeListVoList: [],
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      showDataDialog: false,
      columns: [
        {
          lab: '变更时间',
          val: 'createTime',
          width: 160
          //custom: 'changeList'
        },
        {
          lab: '变更人',
          val: 'changerOperatorName',
          width: 160
        },
        {
          lab: '变更前建档人',
          val: 'beforCreateUserName',
          width: 160
        },
        {
          lab: '变更后建档人',
          val: 'afterCreateUserName',
          width: 160
        },
        {
          lab: '变更前线上客服',
          val: 'beforOnlineUserName',
          width: 160
        },
        {
          lab: '变更后线上客服',
          val: 'afterOnlineUserName',
          width: 160
        },
        {
          lab: '变更前回访人',
          val: 'beforVisituserName',
          width: 160
        },
        {
          lab: '变更后回访人',
          val: 'afterVisituserName',
          width: 160
        },
        {
          lab: '变更前建档类型',
          val: 'beforTypeThreeName',
          width: 160
        },
        {
          lab: '变更后建档类型',
          val: 'afterTypeThreeName',
          width: 160
        },
        {
          lab: '变更前媒介类型',
          val: 'beforChannelTypeName',
          width: 160
        },
        {
          lab: '变更后媒介类型',
          val: 'afterChannelTypeName',
          width: 160
        },
        {
          lab: '变更前媒介来源',
          val: 'beforChannelName',
          width: 160
        },
        {
          lab: '变更后媒介来源',
          val: 'afterChannelName',
          width: 160
        },
        {
          lab: '变更原因',
          val: 'changerRemark',
          width: 200
        },
      ]
    }
  },
  computed: {},
  created() {
    this.showDataDialog = true
    this.guestId = this.$route.query.guestId
    this.getCustomerInfo(this.guestId)
    this.getChangeListVoList(this.guestId)
    this.showDataDialog = false
  },
  methods: {
    getCustomerInfo(guestId) {
      this.$api.customerCmt.getInfoById(guestId).then(res => {
        this.phoneDetail = res.data
      })
    },
    getChangeListVoList() {
      this.showDataDialog = true
      const data = {
        id: this.guestId
      }
      this.$api.changeAscriptionRecord.getAscriptionChangeList(data).then(res => {
        // console.log(res)
        this.changeListVoList = res.rows
      }).finally(()=>{
        this.showDataDialog = false
      })
    },
    // // 某一行被点击,切换选中状态
    // rowClick(row, column, event) {
    //   this.$refs.phoneTable.toggleRowSelection(row)
    // },
    // // 选中项发生变化
    // selectionChange(selection) {
    //   if (selection.length === 0) {
    //     this.delButtonDisable = true
    //   } else {
    //     this.delButtonDisable = false
    //   }
    // }
  }
}
</script>

<style scoped>
.container {
  width: 98%;
  height: 98%;
  padding: 5px;
}
</style>

