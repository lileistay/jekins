<template>
  <!--整形复诊-->
  <div class="box">
    <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      :pagination="pagination"
      size="mini"
      selection
      border
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      @size-change="sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
        <template #custom="data">
            <div v-if="data.props === 'customerStatus'">
                <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
            </div>
            <div v-if="data.props === 'followupItem'">
                <show-dict-data :options="dict.type.followup_item" :value="data.custom.followupItem" />
            </div>

            <div v-if="data.props === 'customerName'">
                <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }} </a>
            </div>
            <div v-if="data.props === 'orderNumber'">
                <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
                    {{ data.custom.orderNumber }}
                </a>
            </div>
      </template>
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" :model="form" label-width="120px" style="display: flex">
          <el-row>
            <el-col :xs="12" :sm="7" :lg="4">
              <el-form-item label="客户姓名：">
                <el-input v-model="form.customerName" clearable></el-input>
              </el-form-item>
              <el-form-item label="复诊登记时间：">
                <el-date-picker
                  v-model="form.timeList"
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="7" :lg="4">
              <el-form-item label="复诊备注：">
                <el-input v-model="form.remark" clearable></el-input>
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input v-model="form.customCardNumber" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="7" :lg="4">
                <el-form-item label="护士：">
                    <el-select v-model="form.circulatingNurse" filterable clearable>
                        <el-option
                                v-for="(item, idnex) in circulatingNurseList"
                                :key="idnex"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>
              <el-form-item label="医助：">
                  <el-select v-model="form.doctorAssistant" :filterable="true" clearable>
                      <el-option
                              v-for="dict in doctorAssistantList"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                      />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="7" :lg="4">
              <el-form-item label="手术名称：">
                <el-input v-model="form.operationName" clearable></el-input>
              </el-form-item>
              <el-form-item label="新老客户：">
                  <el-select v-model="form.customerStatus" :filterable="true" clearable>
                      <el-option
                              v-for="dict in dict.type.whether_Newguest"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                      />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="7" :lg="4">
              <el-form-item label="复诊类型：">
                  <el-select v-model="form.followupItem" :filterable="true" clearable>
                      <el-option
                              v-for="dict in dict.type.followup_item"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                      />
                  </el-select>
              </el-form-item>
              <el-form-item label="医生：">
                  <el-select v-model="form.doctorName" :filterable="true" clearable>
                      <el-option
                              v-for="dict in doctorlist"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                      />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="7" :lg="4">
              <el-form-item label="电话：">
                <el-input v-model="form.customPhone" clearable></el-input>
              </el-form-item>
              <el-form-item label="手术单号：">
                <el-input v-model="form.orderNumber" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="margin-left: 30px">
              <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="getData(true)" @click="getData(true)">搜索</el-button>
          </div>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div></div>
        <div>
          <!-- <el-button size="mini" type="primary" icon="el-icon-plus">批量发送短信</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="openManualDialog">手工上报</el-button>
        </div>
      </div>
    </sg-table>
      <!-- 手工上报-->
      <manual-submission
              :show-manual-dialog="showManualDialog"
              :inner-dialog="innerDialog"
              :selection-data="selectionData"
              :action="Action"
              @closeInnerDialog="closeInnerDialog"
              @closeShowManualDialog="closeShowManualDialog"
              @setInnerDialog="setInnerDialog"
      />
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import {timeFmt,todayTime,beforeDayTime} from "@/utils/time"
export default {
    dicts:['whether_Newguest','followup_item'],
  name: "surgicalInquiry",
  components: {
    SgTable, ManualSubmission
  },
  data() {
    return {
      tableData:[],
      form: {
        timeList: [beforeDayTime(7)[0], todayTime()[1]],
        customerStatus:'1'
      },
      columns: [
          {
              lab: '客户姓名',
              val: 'customerName',
              custom: 'customerName',
              width: 120
          },
          {
              lab: '电话',
              val: 'customPhone',
              width: 120
          },
          {
              lab: '客户卡号',
              val: 'customCardNumber',
              width: 165
          },
          {
              lab: '手术单号',
              val: 'orderNumber',
              custom: 'orderNumber',
              width: 150
          },
          {
              lab: '手术名称',
              val: 'operationName',
              width: 150
          },
        {
          lab: '客户类型',
          val: 'customerStatus',
            custom:'customerStatus'
        },
        {
          lab: '复诊项目',
          val: 'followupItem',
            custom: 'followupItem'
        },
          {
              lab: '主治医生',
              val: 'doctorName',
              width: 120
          },
          {
              lab: '医助',
              val: 'doctorAssistantName',
              width: 150
          },
          {
              lab: '护士',
              val: 'nursingName'
          },
        {
          lab: '复诊时间',
          val: 'createTime'
        },
        {
          lab: '复诊备注',
          val: 'remark'
        }
      ],
      pagination: {
          pageSize: 20, // 每页显示的条数
          total: 0, // 总条数
          pageNum: 1,
          show: true,
          currentPage: 1
      },
        doctorlist:[],//医生
        circulatingNurseList:[],//护士
        doctorAssistantList:[],//医助
        showManualDialog:false,//手工上报弹框
        innerDialog: false,
        Action: {},
        selectionData:[],//复选框选中的数据
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
            this.getData()
            this.getUserList(val)
        }
    },
    created() {
        this.getUserList(this.deptId)
        this.getData()
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getData()
        }
      }
    },
    methods:{
        // 列表数据
        getData(isSearch){
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            const query={
                deptId:this.deptId,
                customerName:this.form.customerName,
                createTime:this.form.timeList?timeFmt('YYYY-mm-dd HH:MM:SS', this.form.timeList[0]):'',
                endCreateTime:this.form.timeList?timeFmt('YYYY-mm-dd HH:MM:SS', this.form.timeList[1]):'',
                customCardNumber:this.form.customCardNumber,
                remark:this.form.remark,
                nursing:this.form.circulatingNurse,
                doctorAssistant:this.form.doctorAssistant,
                orderNumber:this.form.orderNumber,
                operationName:this.form.operationName,
                customPhone:this.form.customPhone,
                doctorId:this.form.doctorName,
                followupItem:this.form.followupItem,
                customerStatus:this.form.customerStatus,


            }
            const data={...this.pagination,...query}
            this.$api.medical.deductionOperationFollowup(data).then((res) => {
                if (res) {
                    this.tableData = res.rows
                    this.pagination.total = res.total
                }
            })
        },
        // 获取人员列表
        getUserList(deptId) {
            const data = {
                deptId: deptId,
                status: '0'
            }
            this.$api.user.getUserList(data).then((res) => {
                if (res) {
                    res.data.forEach((item) => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    const arr1 = this.unique(res.data)
                    this.sysUserList = arr1
                    res.data.forEach((item) => {
                        // 医生数组
                        if (item.postCode === 'doctor') {
                            this.doctorlist.push(item)
                           }
                        // 医助
                        if (item.postCode === 'yizhu') {
                            this.doctorAssistantList.push(item)
                        }
                        // 护士数组
                        if (item.postCode === 'xhhushi' || item.postCode === 'zerennurse') {
                            this.circulatingNurseList.push(item)
                        }
                    })
                }
            })
        },
        // 数组的去重复
        unique(arr) {
            const res = new Map()
            return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
        },
        // 点击跳转是否已到院路由
        customerclick(id, val) {
            this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
        },
        // 点击收费单编号
        orderNumber(data) {
            // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
            this.$router.push({ path: 'billDetails'})
          sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
        },
        // 分页
        change(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getData() // 调用数据
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getData()
        },
        // 复选框的选中
        handleSelectionChange(e) {
            this.selectionData = []
            if (e[1].length > 1) {
                this.$refs.table.$refs.multipleTable.clearSelection()
                this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
            }
            this.selectionData.push(e[1].pop())
            this.$delete(this.selectionData, 1)
        },
        // 点击行内选择
        rowClick(e) {
            this.$refs.table.$refs.multipleTable.clearSelection()
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
        },
        // 手工上报
        openManualDialog() {
            if (this.selectionData[0]==undefined || this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行修改')
                return
            }
            this.Action = this.selectionData[0]
            this.showManualDialog = true
        },
        // 关闭手工上报高级选项
        closeInnerDialog(){
            this.innerDialog = false
        },
        // 关闭手工上报弹窗
        closeShowManualDialog(){
            this.showManualDialog = false
        },
        // 打开高级选项
        setInnerDialog(){
            this.innerDialog = true
            this.showManualDialog = false
        }
    }
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 14px;
  }
}
::v-deep .el-range__icon {
  display: none;
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
