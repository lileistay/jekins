<template>
  <!--  套餐开单-->
  <el-scrollbar>
    <div  class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">产康套餐开单
          &nbsp;
          <span class="mentem"> [ &nbsp;<em> 客户:{{ billing.customerName }} {{ getTime }} </em> &nbsp;] </span>
        </div>
        <p class="titel">
          <span>客户账户信息：</span>
          <span style="color: red">欠款金额：0.00</span>
          &nbsp;
          <span>预约金：{{ advancePayment }}；住院押金：{{ deposit }}；储值总额：{{ totalStoredValue }}；[ 储值金额：{{ storedValuePrincipal }}；储值赠送：{{ storedValueGift }} ]</span>
        </p>
        <el-form ref="formInline" class="mentform" :rules="rules" :model="formInline" size="mini">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="现场咨询：">
                <el-select v-model="formInline.aestheticConsultant" clearable filterable>
                  <el-option
                    v-for="item in xczxs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="产康师：">
                <el-select v-model="formInline.chanKangShi" clearable filterable>
                  <el-option
                    v-for="item in sysUserList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="备注：" style="margin-left: 27px;">
                <el-input v-model="formInline.billingRemarks" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="mentediv">
        <div class="formBody">
          <div class="itemment">收费单明细信息</div>
          <div v-for="(item, index) in projectList" :key="index"  style="margin-bottom: 5px">
            <div class="billing">
              <span class="billingitem">
                套餐名称：{{ item.packageName }}；数量：
                <!--                <el-input-number v-model="item.packageNum" :min="1" :max="9999" size="mini" @change="handleChange(item.projectList, index)" />-->
                <el-button icon="el-icon-plus" round size="mini" @click="handleChangePlus(item.projectList, index)" />
                <el-input v-model="item.packageNum" type="text" disabled size="mini" style="width: 50px" />
                <el-button icon="el-icon-minus" round size="mini" :disabled="item.packageNum === 1" @click="handleChangeMinus(item.projectList, index)" />
                价格：{{ item.totalPackagePrice }}
              </span>
              <span style="float: right; margin-right: 20px"><el-button type="text" style="color: #ffffff" @click="handleDelete(item, index)">删除</el-button></span>
            </div>
            <el-table
              border
              :data="item.projectList"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              :style="{'font-size': '12px'}"
              style="width: 100%"
            >
              <el-table-column label="科室" prop="departmentName" />
              <el-table-column label="产品名称" prop="projectName" />
              <el-table-column label="单位" prop="priceUnit" />
              <el-table-column label="单价" prop="originalPrice" />
              <el-table-column label="数量" prop="projectNum" />
              <el-table-column label="合计金额" prop="totalAmount" />
              <el-table-column label="套餐单价" prop="packagePrice" />
              <el-table-column label="套餐折扣" prop="packageDiscount" />
              <el-table-column label="折扣" prop="discount">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.discount"
                    style="width: 100%"
                    size="mini"
                    :precision="2"
                    :disabled="item.isDiscount !== '1'"
                    :step="0.01"
                    @blur="discountBlur(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="折后单价" prop="discountAmount">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.discountAmount"
                    style="width: 100%"
                    size="mini"
                    :disabled="item.isDiscount !== '1'"
                    :precision="2"
                    @blur="discountAmountBlur(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="折后合计" prop="packageInAmount" />
              <el-table-column label="产品项目分类" prop="productItemTypeName" />
              <el-table-column label="备注" prop="remark">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    size="mini"
                    type="text"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="formBody">
        <span class="itemment">套餐检索</span>
        <div>
          <div class="billing">
            <el-form
              :inline="true"
              :model="dateline"
              class="demo-form-inline"
              size="mini"
            >
              <el-form-item>
                <span style="color: #ffffff">套餐名称：</span>
                <el-input v-model="dateline.pmName" style="width: 150px; margin-top: 1px" />
              </el-form-item>
              <!-- <el-form-item>
                <span style="color: #ffffff">套餐简码：</span>
                <el-input v-model="dateline.projectName" style="width: 150px" />
              </el-form-item> -->
              <el-form-item>
                <span style="color: #ffffff">产品价格：</span>
                <el-input-number v-model="dateline.pmPrice" :precision="2" style="width: 100px; margin-top: 6px" />
                <span style="color: #ffffff">&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                <el-input-number v-model="dateline.endpmPrice" :precision="2" style="width: 100px; margin-top: 6px" />
              </el-form-item>
              <span class="itemspan">[新增产品组合内项目：先选中产品组合名称再添加项目]</span>
              <el-button
                class="elbut"
                style="float:right; margin-right: 10px"
                icon="el-icon-search"
                size="mini"
                @click="getData"
              >搜索
              </el-button>
            </el-form>
          </div>
        </div>
        <div class="product" style="height:100%">
          <el-table
            border
            :data="packageList"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :style="{'font-size': '12px'}"
            style="width: 100%"
          >
            <el-table-column label="套餐名称" prop="pmName" />
            <el-table-column label="套餐价格" prop="pmPrice" />
            <el-table-column label="是否打折" prop="isDiscount">
              <template slot-scope="scope">
                <span v-if="scope.row.isDiscount === '0'">否</span>
                <span v-if="scope.row.isDiscount === '1'">是</span>
              </template>
            </el-table-column>
            <el-table-column label="套餐类别" prop="pmCategory">
              <template slot-scope="scope">
                <span v-if="scope.row.pmCategory === '1'">全选项套餐</span>
                <span v-if="scope.row.pmCategory === '2'">可选项套餐</span>
              </template>
            </el-table-column>
            <!--          <el-table-column label="选择数量" prop="remark"></el-table-column>-->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleClick(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <div class="content">
            <span>下单人: {{ userInfo.nickName }}</span>
            &nbsp;
            <span class="reds">费用合计: {{ accountsPayable }}</span>
            &nbsp;
            <span class="reds">应付款: {{ accountsPayable }}</span>
            &nbsp;
            <el-button size="mini" type="primary" icon="el-icon-folder-checked" :loading="submitLoading" @click="addOrEdit">保存</el-button>
            <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 可选套餐添加-->
    <sgDialog :title="tilem" size="800px" :dialog="dialogVisible" @handleClose="showdialog">
      <div slot="out">
        <div class="header">
          <div>套餐金额：{{ pmPrice }}; 请选择 {{ productQuantity }} 个产品项目</div>
          <el-button type="primary" size="mini" @click="confirm">确认选择</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="setMeal"
          border
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="departmentName" label="科室" width="100" />
          <el-table-column prop="projectName" label="产品名称" />
          <el-table-column prop="priceUnit" label="单位" width="60" />
          <el-table-column prop="originalPrice" label="单价" width="60" />
          <el-table-column prop="quantity" label="数量" width="60" />
          <el-table-column prop="productItemTypeName" label="产品项目分类" width="120" />
        </el-table>
      </div>
    </sgDialog>
  </el-scrollbar>
</template>

<script>

import vm from '@/utils/util'
import sgDialog from '@/components/Dialog/index'
import { math } from '@/utils/math'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  components: { sgDialog },
  data() {
    return {
      // 可选套餐弹框
      submitLoading: false,
      tilem: '套餐项选择',
      pmPrice: 0,
      pmCategory: '',
      setMeal: [],
      setmealitem: {},
      // 多选数据
      selection: [],
      multipleSelection: [],
      dialogVisible: false, // 可选套餐添加显示隐藏
      // 别的
      loadingData: false,
      loadingList: false,
      bookProjectList: [],
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      packageList: [], // 套餐列表
      projectList: [], // 产品列表
      formInline: {},
      selectionData: [], // 选择的数据
      // 用户列表
      sysUserList: [],
      xczxs: [],
      rules: {
        aestheticConsultant: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      tableData: [], // 表单数据
      dateline: {},
      getTime: '', // 当前时间
      departmentName: '',
      departmentId: '',
      disabled: false,
      accountsPayable: 0,
      userInfo: {},
      billing: {},
      packageNum: 1,
      num: 1,
      removeIds: [],
      productQuantity: '',
      orderInfoList: [],
      orderDetailsDtoList: [],
      totalStoredValue: 0,
      storedValuePrincipal: 0,
      storedValueGift: 0,
      advancePayment: 0,
      deposit: 0,
      status: undefined
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
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getPackageList()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.billing = JSON.parse(this.$route.query.billing)
    this.billType = this.billing.billType
    this.departmentId = this.billing.departmentId
    this.formInline = this.billing
    this.userInfo = this.$store.getters.user
    this.getCurrentTime()
    this.getUserList(this.deptId)
    this.getPackageList()
    this.getCustomCardSum()
  },
  methods: {
    // 可选套餐添加显示隐藏
    showdialog() {
      this.dialogVisible = false
    },
    /**
     * @author Nevin
     * @date 2022/5/17
     * @Description: 套餐选项选择
    */
    handleSelectionChange(e) {
      if (e.length > this.productQuantity) {
        this.$message.error('只能选择' + this.productQuantity + '项！')
        this.$delete(e, e.length - 1)
        this.$refs.multipleTable.clearSelection()
        e.forEach(item => {
          this.$refs.multipleTable.toggleRowSelection(item)
        })
      } else {
        this.selection = e
      }
    },
    /** 获取当前时间*/
    getCurrentTime() {
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.getTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /** 获取套餐列表*/
    getPackageList() {
      this.loadingData = true
      this.$api.product.packageManagementInfo({
        deptId: this.deptId,
        productStatus: '0'
      }).then(res => {
        this.packageList = res.rows
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/31
     * @Description: 医生改变事件
    */
    changeDoctor() {
      this.orderInfoList.forEach(item => {
        this.$forceUpdate()
      })
    },
    /** 计数器减少改变方法*/
    handleChangeMinus(val, index) {
      this.num = this.projectList[index].packageNum - 1
      let total = 0
      val.forEach(item => {
        this.$set(item, 'totalAmount', math.multiply(item.originalPrice, this.num, item.quantity).toFixed(2))
        this.$set(item, 'projectNum', math.multiply(item.quantity, this.num).toFixed(2))
        this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, math.multiply(item.quantity, this.num).toFixed(2)).toFixed(2))
        this.$set(item, 'packageNum', this.num)
        total = math.add(total, item.packageInAmount * 1).toFixed(2)
      })
      this.$forceUpdate()
      this.$set(this.projectList[index], 'totalPackagePrice', total)
      this.$set(this.projectList[index], 'packageNum', this.num)
      let set = 0
      this.projectList.forEach(item => {
        set = math.add(item.totalPackagePrice, set).toFixed(2)
      })
      this.accountsPayable = set
      if (this.projectList.length !== 0) {
        const inDepartment = []
        const notInDepartment = []
        let inDepartmentId = 0
        let notInDepartmentId = 0
        let inDepartmentName = ''
        let notInDepartmentName = ''
        let string = ''
        let inTotal = 0
        let notInTotal = 0
        let inPmId = 0
        let notInPmId = 0
        this.projectList.forEach(items => {
          items.projectList.forEach(item => {
            if (item.departmentId !== this.departmentId) {
              notInDepartment.push(item)
              notInTotal = math.add(notInTotal, item.packageInAmount)
              notInDepartmentId = item.departmentId
              notInPmId = items.packageId
              notInDepartmentName = item.departmentName
            } else if (item.departmentId === this.departmentId) {
              inDepartment.push(item)
              inTotal = math.add(inTotal, item.packageInAmount)
              inDepartmentId = item.departmentId
              inPmId = items.packageId
              inDepartmentName = item.departmentName
            }
          })
          // 拼接套餐名，用逗号隔开
          string += items.packageName + ','
        })
        // 去掉最后多余的逗号
        if (string.length > 0) {
          string = string.substr(0, string.length - 1)
        }
        if (notInDepartment.length !== 0) {
          notInDepartment.forEach(item => {
            this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
            this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
            this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(item, 'id', this.formInline.id)
            this.$set(item, 'priceNum', item.projectNum)
            this.$set(item, 'quantitySum', item.quantitySum)
            this.$set(item, 'totalAmount', item.discountAmount)
            this.$set(item, 'finalPrice', item.discountAmount)
          })
          const notInorderInfo = {
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: notInTotal,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: notInDepartmentId,
            departmentName: notInDepartmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: notInDepartment,
            packageName: string,
            totalExpenses: notInTotal,
            pmIds: notInPmId
          }
          if (this.orderInfoList.length !== 0) {
            this.orderInfoList[0] = notInorderInfo
          } else {
            this.orderInfoList.push(notInorderInfo)
          }
        }
        if (inDepartment.length !== 0) {
          inDepartment.forEach(item => {
            this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
            this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
            this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(item, 'id', this.formInline.id)
            this.$set(item, 'priceNum', item.projectNum)
            this.$set(item, 'quantitySum', item.quantitySum)
            this.$set(item, 'totalAmount', item.discountAmount)
            this.$set(item, 'finalPrice', item.discountAmount)
          })
          const inorderInfo = {
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: inTotal,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: inDepartmentId,
            departmentName: inDepartmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: inDepartment,
            packageName: string,
            totalExpenses: inTotal,
            pmIds: inPmId
          }
          if (this.orderInfoList.length !== 0) {
            this.orderInfoList[1] = inorderInfo
          } else {
            this.orderInfoList.push(inorderInfo)
          }
        }
      } else {
        this.orderInfoList = []
      }
    },
    /** 计数器增加改变方法*/
    handleChangePlus(val, index) {
      this.num = this.projectList[index].packageNum + 1
      let total = 0
      val.forEach(item => {
        this.$set(item, 'totalAmount', math.multiply(item.originalPrice, this.num, item.quantity).toFixed(2))
        this.$set(item, 'projectNum', math.multiply(item.quantity, this.num).toFixed(2))
        this.$set(item, 'packageNum', this.num)
        // this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, num).toFixed(2))
        this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, math.multiply(item.quantity, this.num).toFixed(2)).toFixed(2))
        total = math.add(total, item.packageInAmount * 1).toFixed(2)
      })
      this.$forceUpdate()
      this.$set(this.projectList[index], 'totalPackagePrice', total)
      this.$set(this.projectList[index], 'packageNum', this.num)
      let set = 0
      this.projectList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set
      if (this.projectList.length !== 0) {
        const inDepartment = []
        const notInDepartment = []
        let inDepartmentId = 0
        let notInDepartmentId = 0
        let inDepartmentName = ''
        let notInDepartmentName = ''
        let string = ''
        let inTotal = 0
        let notInTotal = 0
        let inPmId = 0
        let notInPmId = 0
        this.projectList.forEach(items => {
          items.projectList.forEach(item => {
            if (item.departmentId !== this.departmentId) {
              notInDepartment.push(item)
              notInTotal = math.add(notInTotal, item.packageInAmount)
              notInDepartmentId = item.departmentId
              notInPmId = items.packageId
              notInDepartmentName = item.departmentName
            } else if (item.departmentId === this.departmentId) {
              inDepartment.push(item)
              inTotal = math.add(inTotal, item.packageInAmount)
              inDepartmentId = item.departmentId
              inPmId = items.packageId
              inDepartmentName = item.departmentName
            }
          })
          // 拼接套餐名，用逗号隔开
          string += items.packageName + ','
        })
        // 去掉最后多余的逗号
        if (string.length > 0) {
          string = string.substr(0, string.length - 1)
        }
        if (notInDepartment.length !== 0) {
          notInDepartment.forEach(item => {
            this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
            this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
            this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(item, 'id', this.formInline.id)
            this.$set(item, 'priceNum', item.projectNum)
            this.$set(item, 'quantitySum', item.quantitySum)
            this.$set(item, 'totalAmount', item.discountAmount)
            this.$set(item, 'finalPrice', item.discountAmount)
          })
          const notInorderInfo = {
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: notInTotal,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: notInDepartmentId,
            departmentName: notInDepartmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: notInDepartment,
            packageName: string,
            totalExpenses: notInTotal,
            pmIds: notInPmId
          }
          if (this.orderInfoList.length !== 0) {
            this.orderInfoList[0] = notInorderInfo
          } else {
            this.orderInfoList.push(notInorderInfo)
          }
        }
        if (inDepartment.length !== 0) {
          inDepartment.forEach(item => {
            this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
            this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
            this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(item, 'id', this.formInline.id)
            this.$set(item, 'priceNum', item.projectNum)
            this.$set(item, 'quantitySum', item.quantitySum)
            this.$set(item, 'totalAmount', item.discountAmount)
            this.$set(item, 'finalPrice', item.discountAmount)
          })
          const inorderInfo = {
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: inTotal,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: inDepartmentId,
            departmentName: inDepartmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: inDepartment,
            packageName: string,
            totalExpenses: inTotal,
            pmIds: inPmId
          }
          if (this.orderInfoList.length !== 0) {
            this.orderInfoList[1] = inorderInfo
          } else {
            this.orderInfoList.push(inorderInfo)
          }
        }
      } else {
        this.orderInfoList = []
      }
    },
    /** 根据折扣计算折扣后金额*/
    discountBlur(val) {
      let total = 0
      this.projectList.forEach((items, index) => {
        items.projectList.forEach(item => {
          if (item.packageDetailsId === val.packageDetailsId) {
            this.$set(item, 'discountAmount', math.multiply(item.packagePrice, item.discount).toFixed(2))
            this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, math.multiply(item.quantity, this.num).toFixed(2)).toFixed(2))
          }
          total = math.add(total, item.packageInAmount * 1).toFixed(2)
        })
        this.$forceUpdate()
        this.$set(this.projectList[index], 'totalPackagePrice', total)
        total = 0
      })
      let set = 0
      this.projectList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set
    },
    /** 根据折扣后金额计算折扣*/
    discountAmountBlur(val) {
      let total = 0
      this.projectList.forEach((items, index) => {
        items.projectList.forEach(item => {
          if (item.packageDetailsId === val.packageDetailsId) {
            this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, math.multiply(item.quantity, this.num).toFixed(2)).toFixed(2))
            this.$set(item, 'discount', math.divide(item.discountAmount, item.packagePrice).toFixed(2))
          }
          total = math.add(total, item.packageInAmount * 1).toFixed(2)
        })
        this.$forceUpdate()
        this.$set(this.projectList[index], 'totalPackagePrice', total)
        total = 0
      })
      let set = 0
      this.projectList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set
    },
    // 点击确定将可选数据上传
    confirm() {
      if (this.selection.length < 1) {
        this.$message.warning('至少选择一条数据')
        return
      }
      let price = 0
      this.selection.forEach(item => {
        this.$set(item, 'packageNum', 1)
        this.$set(item, 'company', item.priceUnit)
        item.totalAmount = math.multiply(item.originalPrice, item.packageNum, item.quantity).toFixed(2)
        item.projectNum = math.multiply(item.quantity, item.packageNum).toFixed(2)
        item.packageDiscount = math.divide(item.packagePrice, item.originalPrice).toFixed(2)
        this.$set(item, 'discount', 1)
        this.$set(item, 'discountAmount', math.multiply(item.packagePrice, item.discount).toFixed(2))
        price = math.add(price, item.packageInAmount).toFixed(2)
        this.$set(item, 'quantitySum', math.multiply(item.packageNum, item.quantity))
      })
      const projectInfo = []
      this.$set(projectInfo, 'packageNum', 1)
      this.$set(projectInfo, 'packageId', this.setmealitem.pmId)
      this.$set(projectInfo, 'packageName', this.setmealitem.pmName)
      this.$set(projectInfo, 'packagePrice', this.setmealitem.pmPrice)
      this.$set(projectInfo, 'finalPrice', this.setmealitem.pmPrice)
      this.$set(projectInfo, 'isDiscount', this.setmealitem.isDiscount)
      this.$set(projectInfo, 'totalPackagePrice', price)
      this.$set(projectInfo, 'projectList', this.selection)
      this.projectList.push(projectInfo)
      let set = 0
      this.projectList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set
      /**
       * @author Nevin
       * @date 2022/5/24
       * @Description: 不同科室套餐分开传参
       */
      if (this.projectList.length !== 0) {
        const inDepartment = []
        const notInDepartment = []
        let inDepartmentId = 0
        let notInDepartmentId = 0
        let inDepartmentName = ''
        let notInDepartmentName = ''
        let string = ''
        let inTotal = 0
        let notInTotal = 0
        let inPmId = 0
        let notInPmId = 0
        this.projectList.forEach(items => {
          items.projectList.forEach(item => {
            if (item.departmentId !== this.departmentId) {
              notInDepartment.push(item)
              notInTotal = math.add(notInTotal, item.packageInAmount)
              notInDepartmentId = item.departmentId
              notInPmId = items.packageId
              notInDepartmentName = item.departmentName
            } else if (item.departmentId === this.departmentId) {
              inDepartment.push(item)
              inTotal = math.add(inTotal, item.packageInAmount)
              inDepartmentId = item.departmentId
              inPmId = items.packageId
              inDepartmentName = item.departmentName
            }
          })
          // 拼接套餐名，用逗号隔开
          string += items.packageName + ','
        })
        // 去掉最后多余的逗号
        if (string.length > 0) {
          string = string.substr(0, string.length - 1)
        }
        if (notInDepartment.length !== 0) {
          notInDepartment.forEach(item => {
            this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
            this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
            this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(item, 'id', this.formInline.id)
            this.$set(item, 'priceNum', item.projectNum)
            this.$set(item, 'quantitySum', item.quantitySum)
            this.$set(item, 'totalAmount', item.discountAmount)
            this.$set(item, 'finalPrice', item.discountAmount)
          })
          const notInorderInfo = {
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: notInTotal,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: notInDepartmentId,
            departmentName: notInDepartmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: notInDepartment,
            packageName: string,
            totalExpenses: notInTotal,
            pmIds: notInPmId
          }
          if (this.orderInfoList.length !== 0) {
            this.orderInfoList[0] = notInorderInfo
          } else {
            this.orderInfoList.push(notInorderInfo)
          }
        }
        if (inDepartment.length !== 0) {
          inDepartment.forEach(item => {
            this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
            this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
            this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(item, 'id', this.formInline.id)
            this.$set(item, 'priceNum', item.projectNum)
            this.$set(item, 'quantitySum', item.quantitySum)
            this.$set(item, 'totalAmount', item.discountAmount)
            this.$set(item, 'finalPrice', item.discountAmount)
          })
          const inorderInfo = {
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: inTotal,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: inDepartmentId,
            departmentName: inDepartmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: inDepartment,
            packageName: string,
            totalExpenses: inTotal,
            pmIds: inPmId
          }
          if (this.orderInfoList.length !== 0) {
            this.orderInfoList[1] = inorderInfo
          } else {
            this.orderInfoList.push(inorderInfo)
          }
        }
      } else {
        this.orderInfoList = []
      }
      this.dialogVisible = false
    },
    /** 添加*/
    handleClick(val) {
      if (val.pmCategory === '2') {
        this.setmealitem = val
        this.pmPrice = val.pmPrice
        this.productQuantity = val.productQuantity
        this.dialogVisible = true
        this.$api.product.packageDetailsInfoByNumber({ packageNumber: val.packageNumber }).then(res => {
          if (res) {
            this.setMeal = res.rows
          }
        })
        return
      }
      this.loadingList = true
      this.$api.product.packageDetailsInfoByNumber({
        packageNumber: val.packageNumber
      }).then(res => {
        if (res) {
          let price = 0
          res.rows.forEach(item => {
            this.$set(item, 'packageNum', 1)
            this.$set(item, 'company', item.priceUnit)
            item.totalAmount = math.multiply(item.originalPrice, item.packageNum, item.quantity).toFixed(2)
            item.projectNum = math.multiply(item.quantity, item.packageNum).toFixed(2)
            item.packageDiscount = math.divide(item.packagePrice, item.originalPrice).toFixed(2)
            this.$set(item, 'discount', 1)
            this.$set(item, 'discountAmount', math.multiply(item.packagePrice, item.discount).toFixed(2))
            price = math.add(price, item.packageInAmount).toFixed(2)
            this.$set(item, 'quantitySum', math.multiply(item.packageNum, item.quantity))
          })
          const projectInfo = []
          this.$set(projectInfo, 'packageNum', 1)
          this.$set(projectInfo, 'packageId', val.pmId)
          this.$set(projectInfo, 'packageName', val.pmName)
          this.$set(projectInfo, 'packagePrice', val.pmPrice)
          this.$set(projectInfo, 'finalPrice', val.pmPrice)
          this.$set(projectInfo, 'isDiscount', val.isDiscount)
          this.$set(projectInfo, 'totalPackagePrice', price)
          this.$set(projectInfo, 'projectList', res.rows)
          this.projectList.push(projectInfo)
          let set = 0
          this.projectList.forEach(item => {
            set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
          })
          this.accountsPayable = set
          /**
           * @author Nevin
           * @date 2022/5/24
           * @Description: 不同科室套餐分开传参
          */
          if (this.projectList.length !== 0) {
            const inDepartment = []
            const notInDepartment = []
            let inDepartmentId = 0
            let notInDepartmentId = 0
            let inDepartmentName = ''
            let notInDepartmentName = ''
            let string = ''
            let inTotal = 0
            let notInTotal = 0
            let inPmId = 0
            let notInPmId = 0
            this.projectList.forEach(items => {
              items.projectList.forEach(item => {
                if (item.departmentId !== this.departmentId) {
                  notInDepartment.push(item)
                  notInTotal = math.add(notInTotal, item.packageInAmount)
                  notInDepartmentId = item.departmentId
                  notInPmId = items.packageId
                  notInDepartmentName = item.departmentName
                } else if (item.departmentId === this.departmentId) {
                  inDepartment.push(item)
                  inTotal = math.add(inTotal, item.packageInAmount)
                  inDepartmentId = item.departmentId
                  inPmId = items.packageId
                  inDepartmentName = item.departmentName
                }
              })
              // 拼接套餐名，用逗号隔开
              string += items.packageName + ','
            })
            // 去掉最后多余的逗号
            if (string.length > 0) {
              string = string.substr(0, string.length - 1)
            }
            if (notInDepartment.length !== 0) {
              notInDepartment.forEach(item => {
                this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
                this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
                this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
                this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
                this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
                this.$set(item, 'id', this.formInline.id)
                this.$set(item, 'priceNum', item.projectNum)
                this.$set(item, 'quantitySum', item.quantitySum)
                this.$set(item, 'totalAmount', item.discountAmount)
                this.$set(item, 'finalPrice', item.discountAmount)
              })
              const notInorderInfo = {
                aestheticConsultant: this.formInline.aestheticConsultant,
                amountPayable: notInTotal,
                billType: '8',
                billingRemarks: this.formInline.billingRemarks,
                customerRepresentative: this.formInline.customerRepresentative,
                departmentId: notInDepartmentId,
                departmentName: notInDepartmentName,
                deptId: this.deptId,
                doctorId: this.formInline.doctorId,
                id: this.formInline.id,
                orderDetailsDtoList: notInDepartment,
                packageName: string,
                totalExpenses: notInTotal,
                pmIds: notInPmId
              }
              if (this.orderInfoList.length !== 0) {
                this.orderInfoList[0] = notInorderInfo
              } else {
                this.orderInfoList.push(notInorderInfo)
              }
            }
            if (inDepartment.length !== 0) {
              inDepartment.forEach(item => {
                this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
                this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
                this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
                this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
                this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
                this.$set(item, 'id', this.formInline.id)
                this.$set(item, 'priceNum', item.projectNum)
                this.$set(item, 'quantitySum', item.quantitySum)
                this.$set(item, 'totalAmount', item.discountAmount)
                this.$set(item, 'finalPrice', item.discountAmount)
              })
              const inorderInfo = {
                aestheticConsultant: this.formInline.aestheticConsultant,
                amountPayable: inTotal,
                billType: '8',
                billingRemarks: this.formInline.billingRemarks,
                customerRepresentative: this.formInline.customerRepresentative,
                departmentId: inDepartmentId,
                departmentName: inDepartmentName,
                deptId: this.deptId,
                doctorId: this.formInline.doctorId,
                id: this.formInline.id,
                orderDetailsDtoList: inDepartment,
                packageName: string,
                totalExpenses: inTotal,
                pmIds: inPmId
              }
              if (this.orderInfoList.length !== 0) {
                this.orderInfoList[1] = inorderInfo
              } else {
                this.orderInfoList.push(inorderInfo)
              }
            }
          } else {
            this.orderInfoList = []
          }
        }
      }).finally(() => {
        this.loadingList = false
      })
    },
    /** 删除套餐*/
    handleDelete(item, index) {
      this.removeIds.push(item.orderDetailsId)
      this.$delete(this.projectList, index)
      let set = 0
      this.projectList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set
      /**
       * @author Nevin
       * @date 2022/5/24
       * @Description: 不同科室套餐分开传参
       */
      const inDepartment = []
      const notInDepartment = []
      let inDepartmentId = 0
      let notInDepartmentId = 0
      let inDepartmentName = ''
      let notInDepartmentName = ''
      let string = ''
      let inTotal = 0
      let notInTotal = 0
      let inPmId = 0
      let notInPmId = 0
      if (this.projectList.length !== 0) {
        this.projectList.forEach(items => {
          items.projectList.forEach(item => {
            if (item.departmentId !== this.departmentId) {
              notInDepartment.push(item)
              notInTotal = math.add(notInTotal, item.packageInAmount)
              notInDepartmentId = item.departmentId
              notInPmId = items.packageId
              notInDepartmentName = item.departmentName
            } else if (item.departmentId === this.departmentId) {
              inDepartment.push(item)
              inTotal = math.add(inTotal, item.packageInAmount)
              inDepartmentId = item.departmentId
              inPmId = items.packageId
              inDepartmentName = item.departmentName
            }
          })
          // 拼接套餐名，用逗号隔开
          string += items.packageName + ','
        })
        // 去掉最后多余的逗号
        if (string.length > 0) {
          string = string.substr(0, string.length - 1)
        }
        if (notInDepartment.length !== 0) {
          notInDepartment.forEach(item => {
            this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
            this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
            this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(item, 'id', this.formInline.id)
            this.$set(item, 'priceNum', item.projectNum)
            this.$set(item, 'quantitySum', item.quantitySum)
            this.$set(item, 'totalAmount', item.discountAmount)
            this.$set(item, 'finalPrice', item.discountAmount)
          })
          const notInorderInfo = {
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: notInTotal,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: notInDepartmentId,
            departmentName: notInDepartmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: notInDepartment,
            packageName: string,
            totalExpenses: notInTotal,
            pmIds: notInPmId
          }
          if (this.orderInfoList.length !== 0) {
            this.orderInfoList[0] = notInorderInfo
          } else {
            this.orderInfoList.push(notInorderInfo)
          }
        }
        if (inDepartment.length !== 0) {
          inDepartment.forEach(item => {
            this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(item, 'customerRepresentative', this.formInline.customerRepresentative)
            this.$set(item, 'dsingleUser', this.formInline.dsingleUser)
            this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(item, 'id', this.formInline.id)
            this.$set(item, 'quantitySum', parseInt(item.projectNum))
            this.$set(item, 'totalAmount', item.discountAmount)
            this.$set(item, 'finalPrice', item.discountAmount)
          })
          const inorderInfo = {
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: inTotal,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: inDepartmentId,
            departmentName: inDepartmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: inDepartment,
            packageName: string,
            totalExpenses: inTotal,
            pmIds: inPmId
          }
          if (this.orderInfoList.length !== 0) {
            this.orderInfoList[1] = inorderInfo
          } else {
            this.orderInfoList.push(inorderInfo)
          }
        }
      } else {
        this.orderInfoList = []
      }
    },
    // 搜索
    getData: debounce(function() {
      this.$api.product.packageManagementInfo({
        deptId: this.deptId,
        pmName: this.dateline.pmName,
        pmPrice: this.dateline.pmPrice,
        endpmPrice: this.dateline.endpmPrice
      }).then(res => {
        this.packageList = res.rows
      })
    }),
    /** 关闭*/
    remode() {
      this.closeTag()
      // this.$router.back()
    },
    /** 保存*/
    addOrEdit() {
      this.$refs.formInline.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.orderInfoList.forEach(item => {
            this.$set(item, 'billingRemarks', this.formInline.billingRemarks)
          })
          this.orderInfoList.forEach(items => {
            items.orderDetailsDtoList.forEach(item => {
              item.discountAmount = item.packageInAmount
            })
          })
          this.$api.billingList.setMealInsert({
            'orderInfoList': this.orderInfoList
          }).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.submitLoading = false
              this.closeTag()
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 个人账户信息
     */
    getCustomCardSum() {
      this.$api.RechargeableCard.customCardSum({
        id: this.billing.id
      }).then(res => {
        if (res.rows.length !== 0) {
          this.totalStoredValue = math.add(res.rows[0].groupPrincipal, res.rows[0].groupGift, res.rows[0].companyPrincipal,
            res.rows[0].companyGift, res.rows[0].departmentalPrincipal, res.rows[0].departmentalGift)
          this.storedValuePrincipal = math.add(res.rows[0].groupPrincipal, res.rows[0].companyPrincipal, res.rows[0].departmentalPrincipal)
          this.storedValueGift = math.add(res.rows[0].groupGift, res.rows[0].companyGift, res.rows[0].departmentalGift)
          this.deposit = res.rows[0].deposit
          this.advancePayment = res.rows[0].advancePayment
        }
      })
    },
    /** 获取用户列表*/
    getUserList(deptId) {
      // 人员添加公司Id  添加状态
      let data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          res.data.forEach(item => {
            if (item.postCode == 'chks') {
              this.sysUserList.push(item)
            }
          }) // 产康师
          // ---------------------
          res.data.forEach(item => {
            if (item.postCode == 'xczxs') {
              this.xczxs.push(item)
            }
          }) // 现场咨询
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-input-number__decrease {
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}
/*//number 宽度调整*/
::v-deep .el-input-number .el-input__inner {
  padding: 0;
  width: 80px;
}
//5月5，李 修改样式
.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 15px 10px 15px 10px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 0;
  .itemment {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}
//-----------
.el-button--mini,
.el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}

.el-table--border {
  border-radius: 0 0 10px 10px;
}

.titel {
  margin-top: 15px;
  margin-left: 25px;
  font-size: 12px;
}

.management {
  padding: 6px 40px;

  .itemment {
    color: #1abc9c;
    font-size: 14px;
    font-weight: 600;
  }

  .mentem {
    font-size: 12px;
    font-weight: 600;
  }

  .mentform {
    margin-top: 14px;
    margin-left: 25px;
  }

  a {
    font-size: 12px;
    color: #1abc9c;
    text-decoration: none;
  }

  .billing {
    height: 40px;
    background-color: #1abc9c;
    padding-left: 5px;
    border-radius: 10px 10px 0 0 ;
    .billingitem {
      font-size: 14px;
      line-height: 40px;
      color: aliceblue;
    }
  }

  .itemspan {
    font-size: 12px;
    color: #ffffff;
    font-weight: 600;
  }

  .demo-form-inline {
    line-height: 40px;
  }

  .el-input--mini {
    line-height: 37px;
  }

  .elbut {
    margin-top: 7px;
  }
}

.product {
  display: flex;

  .type {
    // float: left;
    flex: 30%;
    width: 25%;
    height: 200px;
    overflow-y: auto;
    border: 1px solid #c6c6c6;
  }

  .list {
    flex: 70%;
    padding-left: 5px;
    height: 200px;
    border: 1px solid #c6c6c6;
    border-radius: 0 0 10px 10px;
  }
}

.detailed {
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  height: 100px;
  border: 1px solid #c6c6c6;
}

.reds {
  color: red;
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index: 1000;
  .content {
    position: fixed;
    right: 20px;
  }
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
