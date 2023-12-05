<template>
  <!--  套餐开单-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">套餐开单
          &nbsp;
          <span class="mentem"> [ &nbsp;<em> 客户:{{ billing.customerName }} {{ getTime }} </em> &nbsp;] </span>
        </div>
        <p class="titel">
          <span>客户账户信息：</span>
          <span style="color: red">欠款金额：0.00</span>
          &nbsp;
          <span>预约金：{{ advancePayment }}；住院押金：{{ deposit }}；储值总额：{{
            totalStoredValue
          }}；[ 储值金额：{{ storedValuePrincipal }}；储值赠送：{{ storedValueGift }} ]</span>
        </p>
        <el-form ref="formInline" class="mentform" :rules="rules" :model="formInline" size="mini" label-width="140px">
          <el-row :gutter="15">
            <el-col :span="5">
              <el-form-item
                v-if="billing.departmentType === '1' || billing.departmentType === '2' || billing.departmentType === '3'"
                label="现场咨询："
                prop="aestheticConsultant"
              >
                <el-select v-model="formInline.aestheticConsultant" filterable placeholder="请选择" :filter-method="may">
                  <el-option
                    v-for="item in esthetics"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-else label="美学顾问：" prop="aestheticConsultant">
                <el-select v-model="formInline.aestheticConsultant" filterable placeholder="请选择">
                  <el-option
                    v-for="item in esthetics"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="billing.triageType !== 2" :span="5">
              <el-form-item label="推荐人：" prop="secondRecommender">
                <el-select v-model="formInline.secondRecommender" clearable filterable :filter-method="handleFilter">
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
            <el-col v-for="(items, index) in personList" :key="index" :span="5">
              <el-form-item :label="items.departmentName + '治疗师：'" prop="doctorId">
                <el-select v-model="items.doctorId" clearable filterable @change="changeDoctor">
                  <el-option
                    v-for="(item, val) in sysUserList"
                    :key="val"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!--          <el-row>-->
          <!--            <el-col>-->
          <!--              <el-form-item label="分诊科室：" prop="departmentId">-->
          <!--                <el-select v-model="formInline.departmentId" clearable>-->
          <!--                  <el-option-->
          <!--                    v-for="item in departmentList"-->
          <!--                    :key="item.departmentId"-->
          <!--                    :label="item.departmentName"-->
          <!--                    :value="item.departmentId"-->
          <!--                  />-->
          <!--                </el-select>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input v-model="formInline.billingRemarks" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="mentediv">
        <div class="formBody">
          <div class="itemment">收费单明细信息</div>
          <div
            v-for="(item, index) in selectedPackageList"
            :key="index"
            v-loading="loadingList"
            style="margin-bottom: 5px"
          >
            <div class="billing">
              <span class="billingitem">
                套餐名称：{{ item.packageName }}；数量：
                <!--                <el-input-number v-model="item.packageNum" :min="1" :max="9999" size="mini" @change="handleChange(item.projectList, index)" />-->
                <el-button icon="el-icon-plus" round size="mini" @click="handleChangePlus(item.projectList, index)" />
                <el-input v-model="item.packageNum" type="text" disabled size="mini" style="width: 50px" />
                <el-button
                  icon="el-icon-minus"
                  round
                  size="mini"
                  :disabled="item.packageNum === 1"
                  @click="handleChangeMinus(item.projectList, index)"
                />
                价格：{{ item.totalPackagePrice }}
              </span>
              <span style="float: right; margin-right: 20px"><el-button
                type="text"
                style="color: #ffffff"
                @click="handleDelete(item, index)"
              >删除</el-button></span>
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
              <el-table-column label="产品名称" width="200" prop="projectName" />
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
                    :min="0"
                    :max="1"
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
                    readonly
                    onfocus="this.removeAttribute('readonly');"
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
                <el-input v-model="dateline.pmName" style="width: 150px; margin-top: 1px"  clearable />
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
            <span v-if="billing.triageType === 2">二开推荐人: {{ billing.souName }}</span>
            &nbsp;
            <span>客户代表: {{ billing.crName }}</span>
            &nbsp;
            <span>下单人: {{ userInfo.nickName }}</span>
            &nbsp;
            <span class="reds">费用合计: {{ accountsPayable }}</span>
            &nbsp;
            <span class="reds">应付款: {{ accountsPayable }}</span>
            &nbsp;
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-folder-checked"
              :loading="submitLoading"
              @click="addOrEdit"
            >保存
            </el-button>
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
          <el-table-column prop="projectName" label="产品名称" width="200" />
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
import PinyinMatch from 'pinyin-match'

export default {
  components: { sgDialog },
  data() {
    return {
      // 可选套餐弹框
      TotalPrice:0,
      submitLoading: false,
      tilem: '套餐项选择',
      pmPrice: 0,
      pmCategory: '',
      setMeal: [],
      setmealitem: {},
      // 多选数据
      selection: [],
      departmentList: [],
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
      selectedPackageList: [], // 选中的套餐列表
      formInline: {},
      selectionData: [], // 选择的数据
      // 用户列表
      sysUserList: [],
      copySysUserList: [],
      esthetics: [],
      newesthetics:[],
      Chankang: [],
      doctor: [],
      Bath: [],
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
      // 不同科室套餐数据
      personList: []
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
      this.getUserList(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    // this.billing = JSON.parse(this.$route.query.billing)
    this.billing =JSON.parse(JSON.parse(sessionStorage.getItem('packageBillingitem')).billing)
    this.billType = this.billing.billType
    this.departmentId = this.billing.departmentId
    this.formInline = this.billing
    if (this.formInline.aestheticConsultant === 0) {
      this.formInline.aestheticConsultant = undefined
    }
    if (this.formInline.doctorId === 0) {
      this.formInline.doctorId = undefined
    }
    if (this.formInline.secondRecommender === 0) {
      this.formInline.secondRecommender = undefined
    }
    this.userInfo = this.$store.getters.user
    this.getCurrentTime()
    this.getUserList(this.deptId)
    this.getPackageList()
    this.getCustomCardSum()

    // this.getDepartment()
  },
  methods: {
    may(val){
      if (val) {
        this.esthetics = this.newesthetics.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.esthetics = this.newesthetics
      }

  },
    handleFilter(val) {
      if (val) {
        this.sysUserList = this.copySysUserList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.sysUserList = this.copySysUserList
      }
    },
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
      this.num = this.selectedPackageList[index].packageNum - 1

      let total = 0
      val.forEach(item => {
        this.$set(item, 'totalAmount', math.multiply(item.originalPrice, this.num).toFixed(2))
        this.$set(item, 'projectNum', item.quantity * this.num)
        this.$set(item, 'packageNum', this.num)
        // 购买的套餐数量
        this.$set(item, 'payNum', this.num)
        this.$set(item, 'quantitySum', this.num * item.quantity)
        // this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, num).toFixed(2))
        this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, item.quantity).toFixed(2))
        total = math.add(total, item.packageInAmount * 1).toFixed(2)
      })
      this.$forceUpdate()
      this.$set(this.selectedPackageList[index], 'totalPackagePrice', math.multiply(this.selectedPackageList[index].TotalPrice,this.num))
      this.$set(this.selectedPackageList[index], 'packageNum', this.num)
      let set = 0
      this.selectedPackageList.forEach(item => {
        set = math.add(item.totalPackagePrice, set).toFixed(2)
      })
      this.accountsPayable = set
      // 重写不同科室套餐分开传参
      this.resetOrderInfoList()
    },
    /** 计数器增加改变方法*/
    handleChangePlus(val, index) {
      this.num = this.selectedPackageList[index].packageNum + 1
      let total = 0
      val.forEach(item => {
        this.$set(item, 'totalAmount', math.multiply(item.originalPrice, this.num).toFixed(2))
        this.$set(item, 'projectNum', item.quantity * this.num)
        this.$set(item, 'packageNum', this.num)
        this.$set(item, 'payNum', this.num)
        this.$set(item, 'quantitySum', this.num * item.quantity)
        // this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, num).toFixed(2))
        this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, item.quantitySum).toFixed(2))
        total = math.add(total, item.packageInAmount).toFixed(2)
      })
      this.$forceUpdate()
      this.$set(this.selectedPackageList[index], 'totalPackagePrice', math.multiply(this.selectedPackageList[index].TotalPrice,this.num))
      this.$set(this.selectedPackageList[index], 'packageNum', this.num)
      let set = 0
      this.selectedPackageList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set
      // 重写不同科室套餐分开传参
      this.resetOrderInfoList()
    },
    /** 根据折扣计算折扣后金额*/
    discountBlur(val) {
      let total = 0
      this.selectedPackageList.forEach((items, index) => {
        items.projectList.forEach(item => {
          this.$set(item, 'onlineUserId', this.billing.onlineUserId)
          if (item.packageDetailsId === val.packageDetailsId) {
            this.$set(item, 'discountAmount', math.multiply(item.packagePrice, item.discount).toFixed(2))
            this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, math.multiply(item.quantity, this.num).toFixed(2)).toFixed(2))
          }
          total = math.add(total, item.packageInAmount * 1).toFixed(2)
        })
        this.$forceUpdate()
        this.$set(this.selectedPackageList[index], 'totalPackagePrice', total)
        total = 0
      })
      let set = 0
      this.selectedPackageList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set
    },
    /** 根据折扣后金额计算折扣*/
    discountAmountBlur(val) {
      let total = 0
      this.selectedPackageList.forEach((items, index) => {
        items.projectList.forEach(item => {
          this.$set(item, 'onlineUserId', this.billing.onlineUserId)
          if (item.packageDetailsId === val.packageDetailsId) {
            this.$set(item, 'packageInAmount', math.multiply(item.discountAmount, math.multiply(item.quantity, this.num).toFixed(2)).toFixed(2))
            this.$set(item, 'discount', math.divide(item.discountAmount, item.packagePrice).toFixed(2))
          }
          total = math.add(total, item.packageInAmount * 1).toFixed(2)
        })
        this.$forceUpdate()
        this.$set(this.selectedPackageList[index], 'totalPackagePrice', total)
        this.$set(this.selectedPackageList[index], 'TotalPrice', total)
        total = 0
      })
      let set = 0
      this.selectedPackageList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set
    },
    // 点击确定将可选数据上传
    confirm() {
      if (this.selection.length < 1 || this.selection.length < Number(this.productQuantity)) {
        this.$message.warning(`至少选择${this.productQuantity}条数据`)
        return
      }
      let price = 0
      this.selection.forEach(item => {
        // 设置每个项目归属的套餐id
        this.$set(item, 'pmId', this.setmealitem.pmId)
        this.$set(item, 'packageNum', 1)
        // 设置每一个项目的购买数量为1
        this.$set(item, 'payNum', 1)
        item.totalAmount = math.multiply(item.originalPrice, item.packageNum, item.quantity).toFixed(2)
        item.projectNum = math.multiply(item.quantity, item.packageNum).toFixed(2)
        item.packageDiscount = math.divide(item.packagePrice, item.originalPrice).toFixed(2)
        this.$set(item, 'discount', 1)
        this.$set(item, 'discountAmount', math.multiply(item.packagePrice, item.discount).toFixed(2))
        price = math.add(price, item.packageInAmount).toFixed(2)
        // 设置每个套餐内项目的套餐内原始数量
        this.$set(item, 'priceNum', item.quantity)
      })
      const projectInfo = {}
      this.$set(projectInfo, 'packageNum', 1)
      this.$set(projectInfo, 'packageId', this.setmealitem.pmId)
      this.$set(projectInfo, 'packageName', this.setmealitem.pmName)
      this.$set(projectInfo, 'packagePrice', this.setmealitem.pmPrice)
      this.$set(projectInfo, 'finalPrice', this.setmealitem.pmPrice)
      this.$set(projectInfo, 'isDiscount', this.setmealitem.isDiscount)
      this.$set(projectInfo, 'totalPackagePrice', price)
      this.$set(projectInfo, 'projectList', this.selection)
      this.selectedPackageList.push(projectInfo)
      let set = 0
      this.selectedPackageList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })

      this.accountsPayable = set

      // 重写不同科室套餐分开传参
      this.resetOrderInfoList()
      this.dialogVisible = false
    },
    /** 添加*/
    handleClick(val) {
      // 如果是可选套餐 pmCategory=2 打开选择弹窗
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
      // 获取套餐详情
      this.$api.product.packageDetailsInfoByNumber({
        packageNumber: val.packageNumber
      }).then(res => {
        if (res) {
          let price = 0
          res.rows.forEach(item => {
            // 设置每个项目归属的套餐id
            this.$set(item, 'pmId', val.pmId)
            // 设置每一个项目的套餐数量为1
            this.$set(item, 'packageNum', 1)
            // 设置每一个项目的购买数量为1
            this.$set(item, 'payNum', 1)
            // 设置项目单位单位
            this.$set(item, 'company', item.priceUnit)
            // 设置单个项目的总价
            item.totalAmount = math.multiply(item.originalPrice, item.packageNum, item.quantity).toFixed(2)
            // 设置单个项目的数量
            item.projectNum = math.multiply(item.quantity, item.packageNum).toFixed(2)
            // 设置套餐折扣，套餐价/原价
            if (item.packagePrice === 0 || item.originalPrice === 0) {
              item.packageDiscount = math.add(0, 0).toFixed(2)
            } else {
              item.packageDiscount = math.divide(item.packagePrice, item.originalPrice).toFixed(2)
            }
            this.$set(item, 'discount', 1)
            // 设置折扣价
            this.$set(item, 'discountAmount', math.multiply(item.packagePrice, item.discount).toFixed(2))
            // 套餐的总价格 循环加项目的价格
            price = math.add(price, item.packageInAmount).toFixed(2)
            // 设置总数量 套餐数量 * 项目数量
            this.$set(item, 'quantitySum', math.multiply(item.packageNum, item.quantity))
            // 设置每个套餐内项目的套餐内原始数量
            this.$set(item, 'priceNum', item.quantity)
          })
          const projectInfo = {}
          this.$set(projectInfo, 'onlineUserId', this.billing.onlineUserId)
          this.$set(projectInfo, 'packageNum', 1)
          this.$set(projectInfo, 'packageId', val.pmId)
          this.$set(projectInfo, 'packageName', val.pmName)
          this.$set(projectInfo, 'packagePrice', val.pmPrice)
          this.$set(projectInfo, 'finalPrice', val.pmPrice)
          this.$set(projectInfo, 'isDiscount', val.isDiscount)
          this.$set(projectInfo, 'totalPackagePrice', price)
          this.$set(projectInfo, 'projectList', res.rows)
          // 将刚选择点击添加的套餐添加到已选择的套餐列表中
          this.selectedPackageList.push(projectInfo)
          // 计算应付账款
          let set = 0
          this.selectedPackageList.forEach(item => {
            set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
          })
          this.accountsPayable = set
          this.selectedPackageList.forEach(value=>{
            value.TotalPrice=value.finalPrice
          })
          // 重写不同科室套餐分开传参
          this.resetOrderInfoList()
        }
      }).finally(() => {
        this.loadingList = false
      })
    },
    // 重置订单详细
    resetOrderInfoList() {
      this.orderInfoList = []
      this.personList = []
      if (this.selectedPackageList.length !== 0) {
        // 得到几个选择套餐套餐名 拼接的 套餐名，用逗号隔开
        const packageName = this.selectedPackageList.flatMap(x => x.packageName).join(',')
        // 创建一个map 以project.departmentId 为key ，项目list为值
        const departmentProjectMap = new Map()
        // 遍历所有的项目
        this.selectedPackageList.forEach(selectedPackage => {
          selectedPackage.projectList.forEach(project => {
            // 设置项目详情的线上客服、美学顾问、订单备注、客户代表、下单人、第二推荐人、id、单价、数量、总价
            this.$set(project, 'onlineUserId', this.billing.onlineUserId)
            this.$set(project, 'billingDepartment', project.departmentId)
            this.$set(project, 'aestheticConsultant', this.formInline.aestheticConsultant)
            this.$set(project, 'billingRemarks', this.formInline.billingRemarks)
            this.$set(project, 'customerRepresentative', this.formInline.customerRepresentative)
            // this.$set(project, 'dsingleUser', this.formInline.dsingleUser)  后台自动生成
            this.$set(project, 'secondRecommender', this.formInline.secondRecommender)
            this.$set(project, 'id', this.formInline.id)
            // this.$set(project, 'priceNum', project.quantity)
            // this.$set(project, 'quantity', project.payNum)
            this.$set(project, 'quantitySum', project.quantitySum)
            this.$set(project, 'totalAmount', project.totalAmount)
            this.$set(project, 'finalPrice', project.discountAmount)
            if (!departmentProjectMap.has(project.departmentId)) {
              departmentProjectMap.set(project.departmentId, [project])
            } else {
              departmentProjectMap.get(project.departmentId).push(project)
            }
          })
        })
        // 此时是一个departmentId 和 对应的项目数组组成的map
        // 迭代map 每个key生成一个订单
        const entries = departmentProjectMap.entries()
        for (let i = 0; i < departmentProjectMap.size; i++) {
          // 得到 key 和 项目list
          const [departmentId, projectList] = entries.next().value
          // 得到套餐id
          const pmIdsSet = projectList.length > 1 ? new Set(projectList.flatMap(x => [x.pmId])) : new Set().add(projectList[0].pmId)
          const pmIds = [...pmIdsSet].join()
          // 得到套餐总价
          let totalAmountPayable = 0
          projectList.forEach(item => {
            totalAmountPayable = math.add(item.packageInAmount, totalAmountPayable)
          })
          const orderInfo = {
            onlineUserId: this.formInline.onlineUserId,
            billingDepartment: departmentId,
            customerStatus: this.formInline.customerStatus,
            isSecondary: this.formInline.isSecondary,
            aestheticConsultant: this.formInline.aestheticConsultant,
            amountPayable: totalAmountPayable,
            billType: '8',
            billingRemarks: this.formInline.billingRemarks,
            customerRepresentative: this.formInline.customerRepresentative,
            departmentId: departmentId,
            departmentName: projectList[0].departmentName,
            deptId: this.deptId,
            doctorId: this.formInline.doctorId,
            id: this.formInline.id,
            orderDetailsDtoList: projectList,
            packageName: packageName, // 前面拼接的多个项目的name
            totalExpenses: totalAmountPayable,
            pmIds: pmIds
          }
          // 添加到订单数组
          this.orderInfoList.push(orderInfo)
        }
        // 筛选出选中套餐中不同的科室给personList，为了方便展示不同科室的治疗师
        const temp = []
        this.personList = []
        this.selectedPackageList.forEach(items => {
          items.projectList.forEach(item => {
            temp.push(item)
          })
        })
        this.sortClass(temp).forEach(item => {
          this.personList.push(item[0])
        })
      } else {
        this.orderInfoList = []
        this.personList = []
      }
      this.loadingList = false
    },
    sortClass(data) {
      const groupBy = (array, f) => {
        const groups = {}
        array.forEach(o => {
          const group = JSON.stringify((f(o)))
          groups[group] = groups[group] || []
          groups[group].push(o)
        })
        return Object.keys(groups).map(group => {
          return groups[group]
        })
      }
      return groupBy(data, (item) => {
        return item.departmentId
      })
    },
    /** 删除套餐*/
    handleDelete(item, index) {
      this.removeIds.push(item.orderDetailsId)
      this.$delete(this.selectedPackageList, index)
      let set = 0
      this.selectedPackageList.forEach(item => {
        set = math.add(set, item.totalPackagePrice * 1).toFixed(2)
      })
      this.accountsPayable = set

      // 重写不同科室套餐分开传参
      this.resetOrderInfoList()
    },
    // 搜索
    getData: debounce(function() {
      this.$api.product.packageManagementInfo({
        deptId: this.deptId,
        pmName: this.dateline.pmName,
        pmPrice: this.dateline.pmPrice,
        endpmPrice: this.dateline.endpmPrice,
        productStatus:'0'
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
          if (this.accountsPayable === 0) {
            this.$message('请添加套餐')
            return
          }
          this.submitLoading = true
          // 设置客服、推荐人等
          this.orderInfoList.forEach(items => {
            items.onlineUserId = this.billing.onlineUserId
            this.$set(items, 'secondRecommender', this.billing.secondRecommender)
            items.orderDetailsDtoList.forEach(item => {
              item.onlineUserId = this.billing.onlineUserId
              item.discountAmount = item.packageInAmount
              if (item.secondRecommender === undefined) {
                this.$set(item, 'secondRecommender', items.secondRecommender)
              }
              // 不要动！！！不要问！！！
              // 这是购买的套餐数量
              item.quantity = item.payNum
            })
          })
          // 设置不同科室的医生
          this.personList.forEach(department => {
            if (department.doctorId) {
              this.orderInfoList.forEach(orderInfo => {
                if (orderInfo.departmentId === department.departmentId) {
                  // 设置订单的医生
                  orderInfo.doctorId = department.doctorId
                  // 设置订单详情每一项的医生
                  orderInfo.orderDetailsDtoList.forEach(item => {
                    item.doctorId = department.doctorId
                  })
                }
              })
            }
          })
          this.orderInfoList.forEach(value=>{
          value.amountPayable=this.accountsPayable;
          value.totalExpenses=this.accountsPayable
          })
          this.$api.billingList.setMealInsert({
            'orderInfoList': this.orderInfoList
          }).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.submitLoading = false
              // this.closeTag()
            }
          }).then(() => {
            this.closeTag()
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
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1

          this.copySysUserList = this.sysUserList
          // ----------
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          })
          // ---------------------
          // 产康
          res.data.forEach(item => {
            if (item.postCode === 'chks') {
              this.Chankang.push(item)
            }
          })
          // 洗浴师
          res.data.forEach(item => {
            if (item.postCode === 'therapeutist') {
              this.Bath.push(item)
            }
          })
          // ---------------------
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
              this.newesthetics.push(item)
            }
          }) // 美学顾问
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-input-number__decrease {
  display: none;
}

::v-deep .el-input-number__increase {
  display: none;
}

//number 宽度调整
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
    border-radius: 10px 10px 0 0;

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
