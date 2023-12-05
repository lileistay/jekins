<template>
  <!-- 二开推荐开单(公司  ) -->
  <div class="box">
    <sg-table
      ref="table"

      :sg-ref="'multipleTable'"
      size="mini"
      index="序号"
      border
      selection
      :pagination="pagination"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#f5eae4'}"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <!--搜索框 -->
      <div slot="searchBar" class="headers">
        <div>
          <el-form
            ref="form"
            inline
            size="mini"
            :rules="rules"
            :show-message="false"
            :model="form"
            @submit.native.prevent="getData(true)"
          >
            <el-form-item
              label="客户姓名:"
              prop="customerName"
            >
              <el-input v-model="form.customerName" clearable style="width: 120px;" />
            </el-form-item>
            <el-form-item
              label="电话:"
              prop="customPhone"
            >
              <el-input v-model="form.customPhone" clearable style="width: 120px;" />
            </el-form-item>
            <el-form-item
              label="客户卡号:"
              prop="customCardNumber"
            >
              <el-input v-model="form.customCardNumber" clearable style="width: 120px;" />
            </el-form-item>
            <el-form-item
              label="新老客户:"
              prop="customerStatus"
            >
              <el-select v-model="form.customerStatus" filterable clearable style="width: 120px;" placeholder="请选择">
                <el-option
                  v-for="(item, index) in dict.type.whether_Newguest"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="开单状态:"
              prop="receptionStatus"
            >
              <el-select v-model="form.receptionStatus" style="width: 120px;" filterable clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in dict.type.Reception_status"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="接待时间:"
              prop="receptionTime"
            >
              <el-date-picker
                v-model="form.receptionTime"
                clearable
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 160px;"
                :disabled="showTime"
              />
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button
            size="mini"
            icon="el-icon-search"
            style="margin-bottom: 10px"
            @click.stop.native="getData(true)"
            @keydown.enter.native="getData(true)"
          >查询</el-button>
        </div>
      </div>
      <div slot="header" class="headers">
        <div>开单推荐开单列表</div>
        <div style="float: right">
          <el-button
            v-has-permi="['confinement:package']"
            size="mini"
            plain
            type="success"
            style="float: right;margin-left: 10px"
            icon="el-icon-shopping-cart-1"
            @click="packageBilling"
          >套餐开单</el-button>
          <el-button
            v-has-permi="['confinement:test']"
            size="mini"
            plain
            style="float: right;"
            type="primary"
            @click="inspectionBilling"
          >检验开单</el-button>
          <el-button
            v-has-permi="['confinement:auxiliary']"
            size="mini"
            plain
            type="primary"
            style="float: right;"
            icon="el-icon-suitcase-1"
            @click="adjuvantTherapy"
          >辅助治疗开单</el-button>
          <el-button
            v-has-permi="['confinement:deposit']"
            size="mini"
            plain
            type="primary"
            style="float: right;"
            icon="el-icon-school"
            @click="hospitalizationDeposit"
          >交住院押金</el-button>
          <el-button
            v-has-permi="['confinement:activate']"
            size="mini"
            plain
            type="danger"
            style="float: right;"
            icon="el-icon-bank-card"
            @click="StoredValueCard"
          >储值开卡</el-button>
          <el-button
            v-has-permi="['confinement:deposited']"
            size="mini"
            plain
            type="danger"
            style="float: right;"
            icon="el-icon-bank-card"
            @click="depositValue"
          >交储值</el-button>
          <el-button
            v-has-permi="['confinement:payment']"
            size="mini"
            plain
            type="primary"
            style="float: right;"
            @click="advancePayment"
          >交预约金</el-button>
          <el-button
            v-has-permi="['confinement:billing']"
            size="mini"
            plain
            type="primary"
            style="float: right;"
            icon="el-icon-circle-check"
            @click="bill"
          >开单</el-button>
          <el-button
            v-has-permi="['confinement:interdisciplinary']"
            size="mini"
            plain
            type="info"
            style="float: right;"
            icon="el-icon-refresh-left"
            @click="interdisciplinary"
          >跨科 </el-button>
          <el-button
            v-has-permi="['confinement:receiveReceptionSheet']"
            size="mini"
            plain
            style="float: right;"
            @click.stop.native="receiveReceptionSheet"
          >领取接诊单</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props==='customSex'">
          <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
        </div>
        <div v-if="data.props==='receptionStatus'">
          <show-dict-data :options="dict.type.Reception_status" :value="data.custom.receptionStatus" />
        </div>
        <div v-if="data.props==='customerStatus'">
          <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
        </div>
        <div v-if="data.props==='isSecondary'">
          <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.customerStatus" />
        </div>
        <div v-if="data.props==='triageType'">
          <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
        </div>
        <div v-else-if="data.props === 'customerName'">
          <a style="color: #66b1ff;cursor: pointer;" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
        </div>
      </template>
    </sg-table>
    <!-- 跨科 -->
    <el-dialog
      title="跨科"
      :visible="openDilog"
      width="40%"
      @close="closeDialog"
    >
      <div>
        <div class="one">
          <span>客户信息</span>
          <el-form
            ref="formInline"
            :model="formInline"
            :rules="rules"
            size="mini"
            label-width="130px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名：" prop="customerName">
                  <el-input v-model="formInline.customerName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机：" prop="customPhone">
                  <el-input v-model="formInline.customPhone" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分诊科室：" prop="departmentId">
                  <el-select v-model="formInline.departmentId" filterable clearable>
                    <el-option
                      v-for="(item, index) in departmentList"
                      :key="index"
                      :label="item.departmentName"
                      :value="item.departmentId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="客户代表：" prop="customerRepresentative">
                  <el-select v-model="formInline.customerRepresentative" filterable clearable>
                    <el-option
                      v-for="(item, index) in sysUserList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="美学顾问：" prop="aestheticConsultant">
                  <el-select v-model="formInline.aestheticConsultant" filterable clearable>
                    <el-option
                      v-for="(item, index) in esthetics"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="医生：" prop="doctorId">
                  <el-select v-model="formInline.doctorId" clearable filterable>
                    <el-option
                      v-for="(item, index) in doctorList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="二开推荐人:" prop="secondOpeningUser">
                  <el-select v-model="formInline.secondOpeningUser" filterable clearable>
                    <el-option
                      v-for="(item, index) in sysUserList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="客户意向描述：" prop="intentionDescription">
                  <el-input v-model="formInline.intentionDescription" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="interdisciplinaryEdit"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 领取接诊单 -->
    <receive-reception-sheet :dialog-visible.sync="showDialong" />
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import receiveReceptionSheet from '@/views/SiteManagement/JumpPage/receiveReceptionSheet.vue'
import { debounce } from '@/utils/throttleAndDebounce'
import { timeFmt } from '@/utils/time' // 防抖

export default {
  components: { SgTable, receiveReceptionSheet },
  dicts: ['sys_user_sex', 'Reception_status', 'whether_secondary', 'whether_Newguest', 'Triage_type'],
  data() {
    return {
      showDialong: false, // 控制弹层
      loadingData: false,
      openDilog: false,
      form: {
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        customerStatus: '',
        receptionStatus: '',
        receptionTime: timeFmt('YYYY-mm-dd', new Date())
      },
      formInline: {
        customerName: '',
        customPhone: '',
        departmentId: '',
        customerRepresentative: '',
        aestheticConsultant: '',
        doctorId: '',
        id: '',
        intentionDescription: '',
        secondOpeningUser: ''
      },
      tableData: [],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      rules: {
        departmentId: [{ required: true, message: '请选择', trigger: 'blur' }],
        customerRepresentative: [{ required: true, message: '请选择', trigger: 'blur' }],
        aestheticConsultant: [{ required: true, message: '请选择', trigger: 'blur' }],
        intentionDescription: [{ required: true, message: '请输入', trigger: 'blur' }],
        doctorId: [{ required: true, message: '请输入', trigger: 'blur' }],
        secondOpeningUser: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      rowTable: undefined,
      // 表头
      columns: [
        {
          lab: '二开推荐员工',
          val: 'souName',
          width: 150
        },
        {
          lab: '接待时间',
          val: 'receptionTime',
          width: 150
        },
        {
          lab: '接待状态',
          val: 'receptionStatus',
          custom: 'receptionStatus'
        },
        {
          lab: '姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '顾客卡号',
          val: 'customCardNumber',
          width: 150
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '新老顾客',
          val: 'customerStatus',
          custom: 'customerStatus'
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 150
        },
        // {
        //   lab: '会员等级',
        //   val: 'membershipLevel'
        // },
        {
          lab: '科室',
          val: 'departmentName',
          width: 100
        },
        {
          lab: '顾客代表',
          val: 'crName',
          width: 150
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 150
        },
        {
          lab: '分诊备注',
          val: 'remark'
        },
        {
          lab: '二次来院',
          val: 'isSecondary',
          custom: 'isSecondary'
        }
      ],
      sysUserList: [],
      esthetics: [],
      doctorList: [],
      selectionData: [],
      departmentList: [],
      permission:[],
      showTime:true,
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
      this.getDepartment()
      this.getUserList(val)
    },
    'showDialong'() {
      if (this.showDialong === false) {
        this.getData()
      }
    }
  },
  created() {
    this.getDepartment()
    this.deptId = this.$store.getters.departmentId
    let that=this;
    setTimeout(function (){
      if(localStorage.getItem('WhetherDisableflag')=='true'){
        that.showTime=false
      }else{
        that.showTime=true;
      }
    },500)
    this.getUserList(this.deptId)
    this.getData()
    this.user = this.$store.getters.user
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    cellClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/9
     * @Description: 获取数据
    */
    getData: debounce(async function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.$set(this.form, 'triageType', '2')
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(this.form, 'deptId', this.deptId)
      this.loadingData = true
      await this.$api.modules.billingList.secondbillingList({ ...this.form, ...this.pagination }).then(res => {
        this.pagination.total = res.total
        this.pagination.pageNum = 1
        this.tableData = res.rows
      }).finally(() => {
        this.loadingData = false
      })
    }),
    /**
     * @author Nevin
     * @date 2022/5/9
     * @Description: 领取接诊单
    */
    receiveReceptionSheet() {
      this.showDialong = true
    },
    /**
      * @author 李尚
      * @date 16/5/2022
      * @Description: 点击姓名跳转页面
    */
    customerclick(id, val) {
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 套餐开单
    */
    packageBilling() {
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'packageBilling'})
      const query={
        billing:JSON.stringify(this.selectionData[0]),
      }
      sessionStorage.setItem('packageBillingitem',JSON.stringify(query))
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 检验开单
    */
    inspectionBilling() {
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'inspectionBilling'})
      const query= {
        billing: JSON.stringify(this.selectionData[0])
      }
      sessionStorage.setItem('inspectionBillingitem',JSON.stringify(query))
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 辅助治疗开单
    */
    adjuvantTherapy() {
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'adjuvantBillingTherapy'})
      const query= {
        billing: JSON.stringify(this.selectionData[0]),
      }
      sessionStorage.setItem('adjuvantBillingTherapyitem',JSON.stringify(query))
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 交住院押金
    */
    hospitalizationDeposit() {
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'hospitalizationDeposit', query: { id: this.selectionData[0].id, content: JSON.stringify(this.selectionData[0]) }})
      const query={
        content:JSON.stringify(this.selectionData[0]),
        id: this.selectionData[0].id,
      }
      sessionStorage.setItem('hospitalizationDeposititem',JSON.stringify(query))
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 储值开卡
    */
    StoredValueCard() {
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'StoredValueCard'})
      const query={
        content:JSON.stringify(this.selectionData[0]),
        id: this.selectionData[0].id
      }
      sessionStorage.setItem('StoredValueCarditem',JSON.stringify(query))
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 交储值
    */
    depositValue() {
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'pepositValue'})
      const query= {id: this.selectionData[0].id, content: JSON.stringify(this.selectionData[0])}
      sessionStorage.setItem('pepositValueitem',JSON.stringify(query))
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 交预约金
    */
    advancePayment() {
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'advancePayment', query: { billing: JSON.stringify(this.selectionData[0]) }})
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 开单
    */
    bill() {
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      /**
        * @author 李尚
        * @date 2022/5/10
        * @Description: 传递个人数据
      */
      this.$router.push({ path: 'customerBilling'})
      const query={
        billing:JSON.stringify(this.selectionData[0]),
      }
      sessionStorage.setItem('customerBillingitem',JSON.stringify(query))
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 跨科
    */
    interdisciplinary() {
      if (this.selectionData.length === 0) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.formInline.id = this.selectionData[0].id
      this.formInline.customerName = this.selectionData[0].customerName
      this.formInline.customPhone = this.selectionData[0].customPhone
      this.openDilog = true
    },
    interdisciplinaryEdit() {
      this.$refs.formInline.validate((val) => {
        if (val) {
          this.$delete(this.formInline, 'customerName')
          this.$delete(this.formInline, 'customPhone')
          this.$set(this.formInline, 'deptId', this.deptId)
          this.$set(this.formInline, 'triageType', '2')
          this.$set(this.formInline, 'receptionType', 'kk')
          this.$api.dept.addReceptiondata({ ...this.formInline }).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.openDilog = false
              this.getData()
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 关闭跨科按钮
    */
    closeDialog() {
      this.formInline.customerName = ''
      this.formInline.customPhone = ''
      this.formInline.departmentId = ''
      this.formInline.customerRepresentative = ''
      this.formInline.aestheticConsultant = ''
      this.formInline.id = ''
      this.formInline.intentionDescription = ''
      this.openDilog = false
    },
    /**
     * @author 李尚
     * @date 2022/10/12
     * @Description: 人员添加公司Id 添加状态 医生传值
     * 有问题
    */
    async getUserList(deptId) {
      var dates = {
        deptId: deptId,
        status: '0'
      }
      await this.$api.user.getUserList(dates).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctorList.push(item)
            }
          })
          // // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item) // 美学顾问
              this.sysUserList.push(item) // 二开推荐人
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 获取科室列表
    */
    getDepartment() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0',
        isDepartment: '1'
      }
      this.$api.dept.DepartmentList(data, 'get').then((res) => {
        if (res) {
          this.departmentList = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/17
     * @Description:
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.receptionStatus === '2') {
        if (columnIndex === 4) {
          return { 'color': '#ff0000', 'font-weight': '600' }
        }
      }
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
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  padding: 0;
  .tou {
    width: 100%;
    font-size: 14px;
    overflow: scroll;
    white-space: nowrap;
  }
  .headers {
    font-size: 14px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.one {
  border: 1px solid #f2f2f2;
  padding: 20px;
  border-radius: 5px;
  & > span {
    font-size: 15px;
    background-color: #fff;
    position: absolute;
    margin-top: -30px;
  }
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
</style>
