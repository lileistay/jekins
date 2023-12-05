<template>
  <!--  接待分诊-->
  <div class="box">
    <sg-table
      v-if="true"

      size="mini"
      border
      selection
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :cell-class-name="addClass"
      :span-method="objectSpanMethod"
      :row-class-name="rowClassName"
      :header-style="{backgroundColor:'#f5eae4'}"
      @selection-change="handleSelectionChange"
      @row-click="rowclick"
    >
      <div slot="searchBar" class="tou">
        <div>
          <el-form :inline="true" size="mini">
            <el-form-item label="姓名:">
              <el-input v-model="form.customerName" clearable style="width:130px"  @focus="handleFocus" />
            </el-form-item>
            <el-form-item label="电话:" prop="customPhone">
              <el-input
                v-model="form.customPhone"
                autocomplete="on"
                clearable
                style="width:130px"
                @keydown.enter.native="keydown"
                @focus="handleFocus"
              />
            </el-form-item>
            <el-form-item label="客户卡号:">
              <el-input  @keydown.enter.native="keydown" v-model="form.customCardNumber" clearable style="width:140px" />
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            plain
            @click.stop="InformationList"
            @keydown.enter.native="InformationList"
          >搜索</el-button>
          <el-button
            v-has-permi="['confinement:customerCmt']"
            size="mini"
            icon="el-icon-edit-outline"
            :disabled="btnDisabled"
            @click="receive"
          > 领取接诊单</el-button>
        </div>
      </div>
      <div slot="header">
        <div>前台接待</div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'customerName'">
          <a style="color: #5f94de" @click.stop="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
        </div>
        <div v-else-if="data.props==='customSex'">
          <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
        </div>
      </template>
    </sg-table>
    <el-drawer
      title="近期接待记录"
      :visible.sync="drawer"
      :direction="direction"
    >
      <el-table
        :data="list"
        border=""
        height="400"
        size="mini"
      >
        <el-table-column type="index" label="序号" />
        <el-table-column label="会员等级" prop="gradeName" />
        <el-table-column label="接待时间" prop="receptionTime" />
        <el-table-column label="导医" prop="gmaName" />
        <el-table-column label="客户代表" prop="crName" />
        <el-table-column label="美学顾问" prop="actName" />
        <el-table-column label="科室" prop="departmentName" />
        <el-table-column label="医生" prop="doctorName" />
        <el-table-column label="顾客状态" :formatter="formatter" prop="customerStatus" />
        <el-table-column label="意向描述" prop="intentionDescription" />
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
export default {
  name: 'Reception1',
  dicts: ['whether_Newguest', 'sys_user_sex'],
  components: {
    SgTable
  },
  data() {
    return {
      btnDisabled: true,
      temporaryCustomer: [], // 临客标签数据
      formalCustomer: [], // 正客标签数据
      options: [],
      showDataDialog: false,
      form: {
        customerName: '',
        customPhone: '',
        customCardNumber: ''
      },
      selectionData: [], // 表格多选
      drawer: false, // 控制显示抽屉
      direction: 'btt', // 控制抽屉弹出方向
      tableData: [], // 用于搜索后显示表格的数据
      list: [], // 抽屉里表格的数据
      zhengke: [],
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '手机',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '年龄',
          val: 'customAge',
          width: 50
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex',
          width: 50
        },
        {
          lab: '建档人(开发人)',
          val: 'createUserName'
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
          width: 160
        },
        {
          lab: '网电回访人',
          val: 'visituserName',
          width: 150
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: 150
        },
        {
          lab: '渠道',
          val: 'channelName'
        },
        // {
        //   lab: '预约项目',
        //   val: 'categoryName',
        //   width: 120
        // },
        {
          lab: '客户代表',
          val: 'customerrepName',
          width: 100
        },
        {
          lab: '归属美学顾问',
          val: 'receptionName',
          width: 120
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '身份证',
          val: 'appointmentName',
          width: 240
        },
        {
          lab: '预约项目',
          val: 'categoryName'
        }
        // {
        //   lab: '介绍客户数量',
        //   val: 'degreeIntention'
        // custom: 'degreeIntention',
        // width: 260
        // }
      ] // 主页面的列
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
    }
  },
  created() {
    this.options = this.dict.type.new_guest
    if (this.$route.query.item){
      this.form.customPhone = this.$route.query.item
    }
    console.log(this.form.customPhone,'sss',this.$route.query.item)
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    rowClassName({row,rowIndex}){
       // if(rowIndex%2==0){
       //   return 'normal-row'
       // }
    },
    handleFocus(e) {
      this.btnDisabled = true
      console.log(e)
    },

    // 点击姓名跳转路由
    customerclick(id, val) {
      if (val.isReachCourtyard === '1') {
        this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
      } else {
        this.$router.push({ path: '/notInHospital', query: { id }})
      }
    },
    addClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 && rowIndex === 2) {
        return 'align-left'
      }
      if (columnIndex === 3 && rowIndex === 1) {
        return 'align-left'
      }
    },
    // 合并列的方法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 3 && rowIndex === 2) {
        return {
          rowspan: 1,
          colspan: 13
        }
      }
      if (columnIndex === 3 && rowIndex === 1) {
        return {
          rowspan: 1,
          colspan: 13
        }
      }
    },
    // 点击行的时候触发抽屉弹层
    rowclick(row, column, event) {
      // 不管点击第几行都会调用第一行的数据
      this.$api.dept.Receptiondata(row[1].id, 'get').then((res) => {
        if (res) {
          this.list = res.data
        }
      })
      this.drawer = true // 打开抽屉
    },
    // 键盘回车事件
    keydown() {
      this.InformationList()
    },
    // 获取信息列表
    InformationList: debounce(async function() {
      this.tableData = []
      this.temporaryCustomer = []
      this.formalCustomer = []
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (this.form.customerName === '' && this.form.customPhone === '' && this.form.customCardNumber === '') {
        this.$message('请输入要搜索的内容')
        return
      } else if (this.form.customPhone !== '') {
        if (!reg.test(this.form.customPhone)) {
          this.$message('输入电话号码格式不正确')
          return
        }
      }
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(this.form, 'deptId', this.deptId)
      await this.$api.dept.ReceptionTriagelist({ ...this.form }, 'get').then((res) => {
        if (res) {
          if (res.data === {}) {
            this.btnDisabled = false
          } else {
            this.btnDisabled = false
            // this.id = res.data.id // 将第一行的数据的id赋值 使得每一行点击都可以获取数据
            res.data.forEach((item) => {
              if (item.customerLabelRelationList !== undefined) {
                item.customerLabelRelationList.forEach((keys) => {
                  if (keys.customerType === 1) {
                    this.temporaryCustomer.push(keys.labelDataName)
                  } else {
                    this.formalCustomer.push(keys.labelDataName)
                  }
                })
                const formalLabelName = this.formalCustomer.join('/')
                const temporaryLabelName = this.temporaryCustomer.join('/')
                const obj = { customPhone: '正客标签', customAge: formalLabelName }
                const type = { customPhone: '临客标签', customAge: temporaryLabelName }
                obj.id = item.id
                type.id = item.id
                this.tableData.push(item, obj, type)
              } else {
                const obj = { customPhone: '正客标签', customAge: '无' }
                const type = { customPhone: '临客标签', customAge: '无' }
                obj.id = item.id
                type.id = item.id
                this.tableData.push(item, obj, type)
              }
            })
          }
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 领取接诊单
    receive() {
      if (this.form.customPhone === '') {
        this.$message('请输入电话号码')
        return
      }
      if (this.tableData.length === 0) {
        this.$router.push({ path: '/receptionSheet', query: { customPhone: this.form.customPhone }})
      } else {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择至少一名顾客')
          return
        }
        if (this.selectionData.length > 1) {
          this.$message.warning('只能选择一名顾客')
          return
        }

        // 转跳路由传递参数
        this.$router.push({ path: '/receptionSheet', query: { customPhone: this.selectionData[0].trueCustomPhone ,onlineUserName:this.selectionData[0].onlineUserName,grossConsumption:this.selectionData[0].grossConsumption }})
      }
    },
    formatter(row, column, cellValue, index) {
      const obj = this.dict.type.whether_Newguest.find(item => item.value === cellValue)
      return obj ? obj.label : '未知'
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    }
  },

}
</script>

<style lang="scss" scoped>
.box {
   padding: 0;
  .tou {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    height: 100%;
  }
}
::v-deep .el-drawer__header>:first-child {
    padding-left: 20px;
}
::v-deep .el-drawer {
  height: 60% !important;
  .el-drawer__header {
    height: 28px;
    font-size: 14px;
    color: #fff;
    background-color: #1abc9c !important;
    padding: 5px 0 !important;
  }
  .pagination {
    align-content: center;
  }
}
::v-deep .align-left{
  text-align: left !important;
}
</style>
