<template>
  <!-- 放射开单 -->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div>
        <div class="formBody">
          <div class="itemment">放射开单
            <span class="mentem"> [ <em> {{ BillTypeName(billType) }} {{
              BillStatusName(billing.billingStatus)
            }} {{ getTime }} </em> ] </span>
          </div>
          <el-form class="mentform" :rules="rules" :model="formInline" size="mini">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item label="下单人:">
                  <el-input v-model="userInfo.nickName" disabled style="width: 200px" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="医生:" prop="doctorId">
                  <el-select v-model="formInline.doctorId" filterable clearable :filter-method="doctorFilter">
                    <el-option
                      v-for="item in doctorList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="开单科室:" prop="billingDepartment">
<!--                  <el-select v-model="formInline.billingDepartment" filterable clearable @change="departmentIdChange">-->
                  <el-select v-model="formInline.billingDepartment" filterable clearable>
                    <el-option
                      v-for="item in departmentList"
                      :key="item.departmentId"
                      :label="item.departmentName"
                      :value="item.departmentId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="billing.triageType !== 2" :span="5">
                <el-form-item label="推荐人:" prop="secondRecommender">
                  <el-select v-model="formInline.secondRecommender" filterable clearable :filter-method="handleFilter">
                    <el-option
                      v-for="item in sysUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!--<el-col :span="4">-->
              <!--  <el-form-item label="开单类型:" prop="billType">-->
              <!--    <el-select v-model="formInline.billType" disabled>-->
              <!--      <el-option-->
              <!--        v-for="item in dict.type.billing_type"-->
              <!--        :key="item.value"-->
              <!--        :label="item.label"-->
              <!--        :value="item.value"-->
              <!--      />-->
              <!--    </el-select>-->
              <!--  </el-form-item>-->
              <!--</el-col>-->
            </el-row>
            <el-form-item label="备注:" style="margin-left: 13px;">
              <el-input
                v-model="formInline.billingRemarks"
                readonly
                onfocus="this.removeAttribute('readonly');"
                type="textarea"
                style="width: 70%;"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <span class="itemment">客户订单</span>
          <div class="mentediv">
            <span class="mentem">收费单明细信息</span>
            <span class="mentem"> [ <em> {{
              billing.orderNumber === undefined ? '' : billing.orderNumber
            }}客户:{{ billing.customerName }} [{{ billing.gradeName }}] </em> ] </span>
            <div class="billing">
              <span class="billingitem">客户账户信息：欠款金额：0.00；预约金：{{ advancePayment }}；住院押金：{{
                deposit
              }}；储值总额：{{ totalStoredValue }}；[ 储值金额：{{ storedValuePrincipal }}；储值赠送：{{ storedValueGift }} ]</span>
            </div>
            <el-table
              border
              :data="tableData"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              :style="{'font-size': '12px'}"
              style="width: 100%"
            >
              <el-table-column label="产品名称" width="200" prop="projectName" />
              <el-table-column label="价格1" prop="priceOne" />
              <el-table-column label="价格2" prop="priceTwo" />
              <el-table-column label="最终价格" prop="finalPrice">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.finalPrice"
                    size="mini"
                    style="width: 100%"
                    :precision="2"
                    :disabled="disabled"
                    @blur="totalAmount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="产品次数/每单位" prop="priceNum" />
              <el-table-column label="数量" prop="quantity">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.quantity"
                    size="mini"
                    style="width: 100%"
                    :precision="0"
                    @blur="totalAmount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="单位" prop="company" />
              <el-table-column label="合计金额" prop="totalAmount" />
              <el-table-column label="折扣" prop="discount">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.discount"
                    size="mini"
                    style="width: 100%"
                    :disabled="scope.row.isDiscount === '1'? false: true"
                    :precision="2"
                    :max="1"
                    :min="0"
                    :step="0.01"
                    @blur="discount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="折后金额" prop="discountAmount">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.discountAmount"
                    size="mini"
                    style="width: 100%"
                    :disabled="scope.row.isDiscount === '1'? false: true"
                    :precision="2"
                    @blur="discountAmount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    size="mini"
                    type="text"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="formBody">
          <span class="itemment">产品检索</span>
          <div>
            <div class="billing">
              <el-form
                :inline="true"
                :model="dateline"
                class="demo-form-inline"
                size="mini"
              >
                <el-form-item>
                  产品名称：
                  <el-input v-model="dateline.projectName" style="width: 150px" />
                </el-form-item>
                <el-form-item>
                  产品价格：
                  <el-input-number v-model="dateline.priceOne" :precision="2" style="width: 100px" />
                  至
                  <el-input-number v-model="dateline.endpriceOne" :precision="2" style="width: 100px" />
                </el-form-item>
                <span class="itemspan">[新增产品组合内项目：先选中产品组合名称再添加项目]</span>
                <el-button
                  class="elbut"
                  style="float:right;"
                  icon="el-icon-search"
                  round
                  size="mini"
                  @click="search"
                >搜索
                </el-button>
              </el-form>
            </div>
          </div>
          <div class="product" style="height:100%">
            <div class="type">
              <span style="margin-left: 10px">产品类型</span>
              <el-tree
                :data="bookProjectList"
                :props="defaultProps"
                :highlight-current="true"
                @node-click="treeNodeClick"
              >
                <span slot-scope="{ node,data }" style="width: 100%" class="custom-tree-node">
                  <span style="width: 100%">
                    <b v-if="!data.departmentInfoVos" class="el-icon-document" />
                    <b v-else-if="node.expanded" class="el-icon-folder-opened" />
                    <b v-else class="el-icon-folder" />
                    {{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
            <div class="list">
              <span style="margin-left: 10px">产品列表</span>
              <el-table :data="projectList" size="mini" style="width: 100%; max-height: 170px;overflow: auto;">
                <el-table-column prop="projectName" label="产品名称" width="200" align="center" />
                <!-- <el-table-column prop="shorCode" label="简码" align="center"></el-table-column> -->
                <el-table-column prop="priceUnit" label="单位" align="center" />
                <el-table-column prop="priceOne" label="价格一" align="center" />
                <el-table-column prop="priceTwo" label="价格二" align="center" />
                <el-table-column prop="isDiscount" label="是否打折" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isDiscount === '0'">否</span>
                    <span v-if="scope.row.isDiscount === '1'">是</span>
                  </template>
                </el-table-column>
                <el-table-column prop="discountNumber" label="折扣" align="center" />
                <el-table-column prop="priceNum" label="次数" align="center" />
                <el-table-column prop="priceTwo" label="操作" align="center" width="60">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleClick(scope.$index, scope.row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="content">
          <span v-if="billing.triageType === 2">二开推荐人: {{ billing.souName }}</span>
          &nbsp;
          <span>客户代表: {{ billing.crName }}</span>
          &nbsp;
          <span>美学顾问: {{ billing.acName }}</span>
          &nbsp;
          <span class="reds">费用合计: {{ this.accountsPayable }}</span>
          &nbsp;
          <span class="reds">应付款: {{ this.accountsPayable }}</span>
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
  </el-scrollbar>
</template>

<script>

import { math } from '@/utils/math'
import vm from '@/utils/util'
import { getDicts } from '@/api/sysManger/dict/data'
import { debounce } from '@/utils/throttleAndDebounce'
import PinyinMatch from 'pinyin-match' // 防抖

export default {
  dicts: ['billing_status', 'billing_type'],
  data() {
    return {
      submitLoading: false,
      loadingData: true,
      bookProjectList: [],
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      projectList: [], // 产品列表
      keshi: [], // 科室
      formInline: {},
      selectionData: [], // 选择的数据
      sysUserList: [], // 用户列表
      copySysUserList: [],
      doctorList: [], // 医生
      copyDoctor: [],
      rules: {
        aestheticConsultant: [{ required: true, message: '请选择', trigger: 'blur' }],
        Department: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      tableData: [], // 表单数据
      dateline: {},
      getTime: '', // 当前时间
      departmentName: '',
      departmentId: '',
      disabled: false,
      billing: {},
      billType: '',
      triageType: '',
      departmentList: [],
      userInfo: [],
      packageProducts: {},
      accountsPayable: 0,
      removeIds: [],
      totalStoredValue: 0,
      storedValuePrincipal: 0,
      storedValueGift: 0,
      advancePayment: 0,
      deposit: 0
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
      this.getBookProjectList()
      this.getDepartment()
      this.getUserList(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    // this.billType = this.$route.query.billType
     this.billType = JSON.parse(sessionStorage.getItem('radiationBillingitem')).billType
    // this.billing = JSON.parse(this.$route.query.billing)
     this.billing = JSON.parse(JSON.parse(sessionStorage.getItem('radiationBillingitem')).billing)
    // this.departmentId = this.billing.departmentId
    this.formInline = this.billing
    if (this.billing.billingDepartment) {
      console.log('有billingDepartment')
      this.$set(this.formInline, 'billingDepartment', this.billing.billingDepartment)
    } else {
      console.log('没有billingDepartment')
      this.$set(this.formInline, 'billingDepartment', this.billing.departmentId)
    }
    if (this.formInline.doctorId === 0) {
      this.formInline.doctorId = undefined
    }
    if (this.formInline.secondRecommender === 0) {
      this.formInline.secondRecommender = undefined
    }
    this.userInfo = this.$store.getters.user
    // 修改会传递billType，直接开放射单类型就是 19
    if (this.billType !== undefined) {
      this.getOrderDetailsList()
      this.formInline.billType = this.billType
    } else {
      this.billType = '19'
      this.formInline.billType = '19'
    }
    this.getCustomCardSum()
    this.getUserList(this.deptId)
    this.getDepartment()
    this.getCurrentTime()
    this.getBookProjectList()
  },
  methods: {
    doctorFilter(val) {
      if (val) {
        this.doctorList = this.copyDoctor.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.doctorList = this.copyDoctor
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
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 关闭当前标签
     */
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 获取当前时间
     */
    getCurrentTime() {
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.getTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 开单类型/状态
     */
    BillTypeName(str) {
      const obj = this.dict.type.billing_type.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    BillStatusName(str) {
      const obj = this.dict.type.billing_status.find(item => item.value === str)
      return obj ? obj.label : '未开单'
    },
    search: debounce(function() {
      getDicts('dept_radiology_attribution').then(res => {
        if (res) {
          console.log(res.data,'黑河')
          const list = res.data.find(item => parseInt(item.dictValue) === this.deptId)
          console.log(list,'dsadsad')
          if (list !== undefined) {
            this.$api.product.productManagement({
              deptId: this.deptId,
              departmentId: parseInt(list.dictLabel),
              projectName: this.dateline.projectName,
              priceOne: this.dateline.priceOne,
              endpriceOne: this.dateline.endpriceOne,
              priceStatus:'0'
            }).then(res => {
              this.projectList = res.rows
            })
          }
        }
      })
    }),
    /**
     * @author Nevin
     * @date 2022/5/17
     * @Description: 获取订单详情
     */
    getOrderDetailsList() {
      this.$api.billingList.orderDetailsList({
        orderNumber: this.billing.orderNumber
      }).then(res => {
        this.tableData = res.rows
        this.accountsPayable = this.tableData.reduce((prev, next) => {
          return math.add(prev, next.discountAmount).toFixed(2)
        }, 0)
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 放射科项目
     */
    getBookProjectList() {
      this.loadingData = true
      getDicts('dept_radiology_attribution').then(res => {
        if (res) {
          const list = res.data.find(item => parseInt(item.dictValue) === this.deptId)
          if (list !== undefined) {
            this.$api.modules.netPower.projectTreeselect({
              deptId: this.deptId,
              departmentId: parseInt(list.dictLabel)
            }).then(res => {
              this.bookProjectList = res.data
            })
          }
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    treeNodeClick(data) {
      if (data.departmentInfoVos === undefined || data.departmentInfoVos === null) {
        this.$api.product.productManagement({ categoryId: data.departmentId,priceStatus:'0',deptId:this.deptId }).then(res => {
          if (res) {
            this.projectList = res.rows
          }
        })
      }
    },
    handleClick(index, row) {
      let flag = false
      this.tableData.forEach(item => {
        if (item.itemId === row.itemId) {
          this.$message.warning('不可重复添加')
          flag = true
          return
        }
      })
      if (!flag) {
        if (row.priceOne === row.priceTwo) {
          this.disabled = true
          this.packageProducts.finalPrice = row.priceOne // 最终价格
        } else {
          this.packageProducts.finalPrice = row.priceOne
        }
        this.packageProducts.id = this.billing.id // 客户ID
        this.packageProducts.isDiscount = row.isDiscount // 是否打折
        this.packageProducts.itemId = row.itemId // 产品ID
        this.packageProducts.departmentId = row.departmentId // 科室ID
        this.packageProducts.departmentName = row.departmentName // 科室名称
        this.packageProducts.deptId = this.deptId // 医院
        this.packageProducts.company = row.priceUnit // 单位
        this.packageProducts.projectName = row.projectName // 产品名称
        this.packageProducts.orderDetailsId = row.orderDetailsId // 编号
        this.packageProducts.orderNumber = row.orderNumber // 订单编号
        this.packageProducts.priceOne = row.priceOne // 价格1
        this.packageProducts.priceTwo = row.priceTwo // 价格2
        this.packageProducts.discount = row.discountNumber // 折扣
        this.packageProducts.priceNum = row.priceNum // 次数
        this.packageProducts.totalAmount = row.priceOne // 合计金额
        this.packageProducts.quantity = row.quantity // 数量
        this.packageProducts.customerRepresentative = row.customerRepresentative // 客户代表
        this.packageProducts.doctorId = row.doctorId // 医生
        this.packageProducts.isPayment = row.isPayment // 是否交款
        this.packageProducts.refundsignid = row.refundsignid // 未知
        this.packageProducts.secondRecommender = row.secondRecommender // 二开推荐人
        this.packageProducts.quantity = 1 // 默认数量设为1
        this.packageProducts.costType = row.costType // 费用类型
        // this.packageProducts.discountAmount = math.multiply(this.packageProducts.finalPrice, this.packageProducts.quantity) // 折扣后金额
        this.packageProducts.discountAmount = row.discountAmount
        this.tableData.push(this.packageProducts)
        this.packageProducts = {}
        this.tableData.forEach(item => {
          item.discountAmount = math.multiply(item.finalPrice, item.quantity, item.discount).toFixed(2)
          this.$set(item, 'quantitySum', math.multiply(item.priceNum, item.quantity))
        })
        // 计算费用合计
        let total = 0
        this.tableData.forEach(ite => {
          total = math.add(total, ite.discountAmount).toFixed(2)
        })
        this.accountsPayable = total
        // this.$set(this.tableData, index, value)
        this.accountsPayable = this.tableData.reduce((prev, next) => {
          return math.add(prev, next.discountAmount).toFixed(2)
        }, 0)
      }
    },
    // 数量
    totalAmount(index, value) {
      if (value.quantity === '' || value.quantity === null) {
        value.quantity = 0
      }
      if (value.finalPrice < value.priceOne) {
        this.$message.error('最终价格必须在' + value.priceOne + '和' + value.priceTwo + '之间')
        value.finalPrice = value.priceOne
      } else if (value.finalPrice > value.priceTwo) {
        this.$message.error('最终价格必须在' + value.priceOne + '和' + value.priceTwo + '之间')
        value.finalPrice = value.priceTwo
      }
      // 合计金额
      this.tableData.forEach(item => {
        item.totalAmount = math.multiply(item.finalPrice, item.quantity).toFixed(2)
      })
      // 计算折后价格
      this.tableData.forEach(item => {
        item.discountAmount = math.multiply(item.finalPrice, item.quantity, item.discount).toFixed(2)
      })
      this.$set(this.tableData, index, value)
      // 计算费用合计
      let total = 0
      this.tableData.forEach(ite => {
        total = math.add(total, ite.discountAmount).toFixed(2)
      })
      this.accountsPayable = total
    },
    // 折扣数
    discount(index, value) {
      if (value.discount === '0' || value.discount === '') {
        value.discount = 1
      }
      // 计算折后价格
      this.tableData.forEach(item => {
        item.discountAmount = math.multiply(item.finalPrice, item.quantity, item.discount).toFixed(2)
      })
      this.$set(this.tableData, index, value)
      // 计算费用合计
      let total = 0
      this.tableData.forEach(ite => {
        total = math.add(total, ite.discountAmount).toFixed(2)
      })
      this.accountsPayable = total
    },
    // 折后金额
    discountAmount(index, value) {
      if (value.discountAmount === '') {
        value.discountAmount = 0
        value.discount = 0
      }
      this.tableData.forEach(item => {
        item.discount = math.divide(item.discountAmount, math.multiply(item.finalPrice, item.quantity)).toFixed(2)
      })
      this.$set(this.tableData, index, value)
    },
    handleDelete(index, row) {
      if (row.orderDetailsId) {
        this.removeIds.push(row.orderDetailsId)
      }
      this.tableData.splice(index, 1)
      this.accountsPayable = this.tableData.reduce((prev, next) => {
        return math.add(prev, next.discountAmount).toFixed(2)
      }, 0)
    },
    remode() {
      this.closeTag()
    },
    // 科室修改
    // departmentIdChange(val) {
    //   this.formInline.billingDepartment = this.formInline.departmentId
    // },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 保存
     */
    addOrEdit() {
      if (this.tableData.length === 0) {
        this.$message('没有添加订单')
        return
      }
      this.submitLoading = true
      // 传递了orderId 就是修改，没传递就是新开单
      if (this.billing.orderId !== undefined) {
        this.$set(this.formInline, 'departmentId', this.tableData[0].departmentId)
        this.$set(this.formInline, 'onlineUserId', this.billing.onlineUserId)
        this.$set(this.formInline, 'deptId', this.deptId) // 公司ID
        // this.$set(this.formInline, 'billType', this.billType) // 开单类型
        this.$set(this.formInline, 'amountPayable', this.accountsPayable) // 应付金额
        this.$set(this.formInline, 'dsingleUser', this.userInfo.userId) // 下单人
        this.$set(this.formInline, 'totalExpenses', this.accountsPayable)
        this.$set(this.formInline, 'customerStatus', this.billing.customerStatus)
        // this.$set(this.formInline, 'isSecondary', this.billing.isSecondary)
        this.$delete(this.formInline, 'acName')
        this.$delete(this.formInline, 'crName')
        this.$delete(this.formInline, 'customAge')
        this.$delete(this.formInline, 'customCardNumber')
        this.$delete(this.formInline, 'customPhone')
        this.$delete(this.formInline, 'customSex')
        this.$delete(this.formInline, 'customerName')
        this.$delete(this.formInline, 'departmentName')
        this.$delete(this.formInline, 'doctorName')
        this.$delete(this.formInline, 'gradeName')
        // this.$delete(this.formInline, 'isSecondary')
        this.$delete(this.formInline, 'receptionStatus')
        this.$delete(this.formInline, 'receptionTime')
        this.$delete(this.formInline, 'secondOpeningUser')
        this.$delete(this.formInline, 'triageType')
        this.$delete(this.formInline, 'billTime')
        this.$delete(this.formInline, 'createBy')
        this.$delete(this.formInline, 'createTime')
        this.$delete(this.formInline, 'params')
        this.$delete(this.formInline, 'searchValue')
        this.$delete(this.formInline, 'updateBy')
        this.$delete(this.formInline, 'updateTime')
        this.$delete(this.formInline, 'channelName')
        this.$delete(this.formInline, 'dsingleName')
        this.$delete(this.formInline, 'dsingleUserName')
        this.$delete(this.formInline, 'souName')
        this.tableData.forEach(item => {
          this.$set(item, 'onlineUserId', this.billing.onlineUserId)
          this.$set(item, 'quantitySum', math.multiply(item.priceNum, item.quantity))
          this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
          this.$set(item, 'doctorId', this.formInline.doctorId)
          this.$set(item, 'customerRepresentative', this.billing.customerRepresentative)
          this.$set(item, 'dsingleUser', this.userInfo.userId)
          // 设置开单科室
          this.$set(item, 'billingDepartment', this.formInline.billingDepartment)
          // 设置新的剩余次数为新修改的次数
          this.$set(item, 'surplusQuantity', math.multiply(item.priceNum, item.quantity))
        })
        this.$api.billingList.editOrderInfo({
          'orderInfo': this.formInline,
          'orderDetailsList': this.tableData,
          'removeIds': this.removeIds
        }).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.submitLoading = false
            this.closeTag()
          }
        })
      } else {
        this.$set(this.formInline, 'departmentId', this.bookProjectList[0].departmentId)
        this.$set(this.formInline, 'onlineUserId', this.billing.onlineUserId)
        this.$set(this.formInline, 'deptId', this.deptId) // 公司ID
        // this.$set(this.formInline, 'billType', '19') // 开单类型
        this.$set(this.formInline, 'amountPayable', this.accountsPayable) // 应付金额
        this.$set(this.formInline, 'dsingleUser', this.userInfo.userId) // 下单人
        this.$set(this.formInline, 'totalExpenses', this.accountsPayable)
        this.$set(this.formInline, 'customerStatus', this.billing.customerStatus)
        this.$delete(this.formInline, 'acName')
        this.$delete(this.formInline, 'crName')
        this.$delete(this.formInline, 'customAge')
        this.$delete(this.formInline, 'customCardNumber')
        this.$delete(this.formInline, 'customPhone')
        this.$delete(this.formInline, 'customSex')
        this.$delete(this.formInline, 'customerName')
        this.$delete(this.formInline, 'departmentName')
        this.$delete(this.formInline, 'doctorName')
        this.$delete(this.formInline, 'gradeName')
        // this.$delete(this.formInline, 'isSecondary')
        this.$delete(this.formInline, 'receptionStatus')
        this.$delete(this.formInline, 'receptionTime')
        this.$delete(this.formInline, 'secondOpeningUser')
        this.$delete(this.formInline, 'triageType')
        this.$delete(this.formInline, 'billTime')
        this.$delete(this.formInline, 'createBy')
        this.$delete(this.formInline, 'createTime')
        this.$delete(this.formInline, 'params')
        this.$delete(this.formInline, 'searchValue')
        this.$delete(this.formInline, 'updateBy')
        this.$delete(this.formInline, 'updateTime')
        this.$delete(this.formInline, 'channelName')
        this.$delete(this.formInline, 'dsingleName')
        this.$delete(this.formInline, 'dsingleUserName')
        this.$delete(this.formInline, 'souName')
        this.tableData.forEach(item => {
          this.$set(item, 'onlineUserId', this.billing.onlineUserId)
          this.$set(item, 'quantitySum', math.multiply(item.priceNum, item.quantity))
          this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
          this.$set(item, 'doctorId', this.formInline.doctorId)
          this.$set(item, 'customerRepresentative', this.billing.customerRepresentative)
          this.$set(item, 'dsingleUser', this.userInfo.userId)
          // 设置开单科室1
          this.$set(item, 'billingDepartment', this.formInline.billingDepartment)
        })
        this.$api.billingList.addOrderInfo({
          'orderInfo': this.formInline,
          'orderDetailsList': this.tableData
        }).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.submitLoading = false
            this.closeTag()
          }
        })
      }
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
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 获取用户信息
     */
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
        // departmentId: this.billing.departmentId
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctorList.push(item)
              this.copyDoctor.push(item)
            }
          }) // 医生
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          this.copySysUserList = this.sysUserList
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 获取科室列表
     */
    getDepartment() {
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }, 'get').then((res) => {
        if (res) {
          this.departmentList = res.rows
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

::v-deep .el-input-number__increase {
  display: none;
}

//number 宽度调整
::v-deep .el-input-number .el-input__inner {
  padding: 0;
  width: 80px;
}

//5月5，修改样式
.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 25px 20px 20px 20px;
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

// 之前
.el-button--mini,
.el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}

.management {
  padding: 6px 35px;

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
    padding: 0 10px;
    color: #ffffff;

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
    //border: 1px solid rgb(144, 144, 141);
  }

  .list {
    flex: 70%;
    padding-left: 5px;
    height: 200px;
    //border: 1px solid rgb(144, 144, 141);
  }
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

.reds {
  color: red;
}
</style>
