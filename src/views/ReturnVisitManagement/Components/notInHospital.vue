<template>
  <!--  顾客未到院个人详情  -->
  <el-scrollbar>
    <div class="customerInfo-container" >
      <div class="customerInfo-head">
        <span>{{from.customerName}}</span>
        <span>{{ccustom(from.customSex)}}</span>
        <span>{{from.customAge}}岁</span>
        <span>线上客服:{{ from.oudName}} /</span>
        <span>建档人: {{from.createName}} /</span>
        <span>所属组织: {{from.deptName}}</span>
      </div>
      <div class="customerInfo-content">
        <!-- 配置静态路由 -->
        <el-tabs v-model="activeName">
          <el-tab-pane name="second" label="基本信息">
            <personalDetails :customInfo="customInfo" />
          </el-tab-pane>
<!--          <el-tab-pane label="来院信息">-->
<!--            暂无-->
<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="客户商城信息">-->
<!--            &lt;!&ndash; <customerMallOrder /> &ndash;&gt;-->
<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="企业微信会话">-->
<!--            暂无-->
<!--          </el-tab-pane>-->
        </el-tabs>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import personalDetails from '@/views/ReturnVisitManagement/Components/personalDetails'
// import customerMallOrder from '../../customer/netPower/PersonalDetailsNotFound/customerMallOrder'
export default {
  dicts: ['sys_user_sex'],
  components: { personalDetails },
  data() {
    return {
      showDataDialog: false,
      activeName: 'second',
      from: {},
      customInfo: {}
    }
  },
  created() {
    this.customerlabel()
  },
  methods: {
    customerlabel() {
      let id = this.$route.query.id
      // let id = sessionStorage.getItem('notInHospitalid')
      this.showDataDialog = true
      this.$api.user.getinfo(id).then(res => {
        if (res) {
          this.customInfo = res.data
          this.from = res.data
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    ccustom(str) {
      const obj = this.dict.type.sys_user_sex.find(items => items.value === str)
      return obj ? obj.label : '未知'
    }
  }
}
</script>

<style scoped lang="scss">
.customerInfo-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .customerInfo-head {
    padding-left: 19px;
    font-size: 14px;
    span {
      margin: 0 6px;
      &:nth-child(1) {
        font-weight: 700;
        font-size: 16px;
        font-family: "Verdana", "Tahoma", "Lucida Grande", "Microsoft YaHei",
          "Hiragino Sans GB", sans-serif;
      }
    }
  }
  .customerInfo-content {
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
