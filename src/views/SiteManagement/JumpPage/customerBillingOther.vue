<template>
  <!-- 开单 -->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div style="padding: 6px 40px">
        <div class="formBody">
          <div class="itemment">其他开单
            <span class="mentem"> [ <em> {{ BillTypeName(billType) }} {{ BillStatusName(billing.billingStatus) }} {{ getTime }} </em> ] </span>
          </div>
          <el-form ref="formInline" class="mentform" :rules="rules" :model="formInline" size="mini">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item
                  v-if="billing.departmentType === '1' || billing.departmentType === '2' || billing.departmentType === '3'"
                  label="现场咨询:"
                  prop="aestheticConsultant"
                >
                  <el-select v-model="formInline.aestheticConsultant" placeholder="请选择" filterable :filter-method="Consultant">
                    <el-option
                      v-for="item in esthetics"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item v-else label="美学顾问:" prop="aestheticConsultant">
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
              <el-col :span="6">
                <el-form-item v-if="billing.departmentType === '1'" label="洗浴师:" prop="doctorId" style="margin-left: 80px;">
                  <el-select v-model="formInline.doctorId" clearable filterable :filter-method="doctorine">
                    <el-option
                      v-for="(item,index) in Bath"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-else-if="billing.departmentType === '2' || billing.departmentType === '3'"
                  label="产康师:"
                  prop="doctorId"
                  style="margin-left: 80px;"
                >
                  <el-select v-model="formInline.doctorId" clearable filterable>
                    <el-option
                      v-for="(item,index) in Chankang"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>

                </el-form-item>
                <el-form-item v-else-if="billing.departmentType === '6'" label="美颜师:" prop="doctorId" style="margin-left: 80px;">
                  <el-select v-model="formInline.doctorId" clearable filterable>
                    <el-option
                      v-for="item in doctor"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-else label="医生:" prop="doctorId" style="margin-left: 80px;">
                  <el-select v-model="formInline.doctorId" filterable clearable>
                    <el-option
                      v-for="item in doctor"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="billing.triageType !== 2" :span="6">
                <el-form-item label="推荐人:" prop="secondRecommender" style="margin-left: 80px;">
                  <el-select v-model="formInline.secondRecommender" clearable filterable :filter-method="handleFilter" @change="marriageChange">
                    <el-option
                      v-for="item in sysUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col :span="6">
                <el-form-item label="科室:" prop="depertment">
                  <el-select v-model="formInline.depertment" filterable placeholder="请选择" @change="getTree">
                    <el-option
                      v-for="item in depertmentList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="备注:" style="margin-left: 38px;">
              <el-input v-model="formInline.billingRemarks" type="textarea" style="width: 70%;" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item label="整单折扣金额:" prop="discount" size="mini">
                  <el-input-number
                    v-model="formInline.discount"
                    style="width: 150px;"
                    placeholder="请填写金额"
                    :precision="2"
                    :min="0"
                    :step="0.01"
                    :disabled="tableData.length===0"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                  />
                </el-form-item>
              </el-col>
              <el-button size="mini" :disabled="tableData.length===0" @click="confirm">确认整单折扣</el-button>
              <a>整单折扣会覆盖原本填写的折扣</a>
            </el-row>
          </el-form>
        </div>
        <div class="formBody">
          <span class="itemment">客户订单</span>
          <div class="mentediv">
            <span class="mentem">收费单明细信息</span>
            <span class="mentem">
              [ <em>
                {{ billing.orderNumber === undefined ? '' : billing.orderNumber }}
                客户:{{ billing.customerName }} [{{ billing.gradeName }}] </em> ]
            </span>
            <div class="billing">
              <span class="billingitem">
                客户账户信息：
                欠款金额：0.00；
                预约金：{{ advancePayment }}；
                住院押金：{{ deposit }}；
                储值总额：{{ totalStoredValue }}；
                [ 储值金额：{{ storedValuePrincipal }}；储值赠送：{{ storedValueGift }} ]
              </span>
            </div>
            <el-table
              border
              :data="tableData"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              :style="{'font-size': '12px'}"
              style="width: 100%"
            >
              <el-table-column label="产品名称" width="300" prop="projectName" />
              <el-table-column label="价格1" prop="priceOne" />
              <el-table-column label="价格2" prop="priceTwo" />
              <el-table-column label="最终价格" prop="finalPrice">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.finalPrice"
                    size="mini"
                    style="width: 100%"
                    :disabled="disabled"
                    :precision="2"
                    :min="0"
                    :step="0.01"
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
                    :precision="0"
                    size="mini"
                    style="width: 100%"
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
                    :precision="2"
                    :disabled="scope.row.isDiscount !== '1'"
                    @blur.stop="discount(scope.$index, scope.row)"
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
                    :precision="2"
                    :disabled="scope.row.isDiscount !== '1'"
                    @blur.stop="discountAmount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark"   size="mini" type="text" @input="() => $forceUpdate()" :readonly="scope.row.readonly" @click.native="Readonly(scope.$index)" />
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
                  <el-input v-model="dateline.projectName" style="width: 150px;padding-top: 1px" @keyup.enter.native="search" />
                </el-form-item>
                <el-form-item>
                  产品价格：
                  <el-input-number v-model="dateline.priceOne" :precision="2" style="width: 100px;padding-top: 6px" />
                  至
                  <el-input-number v-model="dateline.endpriceOne" :precision="2" style="width: 100px;padding-top: 6px" />
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
                style="margin-bottom: 15px"
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
              <span style="margin: 0 10px">产品列表</span>
              <el-table v-loading="product" :data="projectList" size="mini" style="width: 100%; max-height: 170px;overflow: auto;">
                <el-table-column prop="projectName" label="产品名称" width="200" align="center" />
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
                    <el-button type="text" size="mini" @click.stop="handleClick(scope.$index, scope.row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="detailed">
            <p>物资明细</p>
          </div>
        </div>
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
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" :loading="submitLoading" @click="addOrEdit">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import vm from '@/utils/util'
import { math } from '@/utils/math'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import PinyinMatch from 'pinyin-match'
export default {
  dicts: ['billing_status', 'billing_type'],
  data() {
    return {
      product: false, // 产品列表
      submitLoading: false, // 保存 之后就不能再点
      showDataDialog: false,
      bookProjectList: [],
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      projectList: [],
      packageProducts: {},
      keshi: [], // 科室
      formInline: {
        discount: '', // 整单折扣
        depertment: '' // 部门
      },
      selectionData: [], // 选择的数据
      // 用户列表
      sysUserList: [], // 用户列表
      copySysUserList: [],
      estheticsList: [],
      esthetics: [],
      Chankang: [],
      copyChankang: [],
      doctor: [],
      Bath: [],
      BathList: [],
      rules: {
        aestheticConsultant: [{ required: true, message: '请选择', trigger: 'blur' }],
        depertment: [{ required: true, message: '请选择科室', trigger: 'blur' }]
      },
      tableData: [], // 表单数据
      dateline: {},
      getTime: '',
      jdxxId: 0,
      departmentName: '',
      departmentId: '',
      company: '',
      removeIds: [],
      disabled: false,
      accountsPayable: 0,
      userInfo: {},
      triageType: '',
      allDiscount: 1,
      billType: '',
      billing: {},
      totalStoredValue: 0,
      storedValuePrincipal: 0,
      storedValueGift: 0,
      advancePayment: 0,
      deposit: 0,
      categoryId: 0,
      depertmentList: []
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
      this.getUserList(val)
      this.getBookProjectList(val)
      this.getDepartment()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    // this.billType = this.$route.query.billType
    this.billType = JSON.parse(sessionStorage.getItem('customerBillingOtheritem')).billType
    // this.billing = JSON.parse(this.$route.query.billing)
    this.billing=JSON.parse(JSON.parse(sessionStorage.getItem('customerBillingOtheritem')).billing)
    this.departmentId = this.formInline.depertment
    this.formInline = this.billing
    this.formInline.secondRecommender = this.billing.secondOpeningUser
    if (this.formInline.aestheticConsultant === 0) {
      this.formInline.aestheticConsultant = undefined
    }
    if (this.formInline.doctorId === 0) {
      this.formInline.doctorId = undefined
    }
    if (this.formInline.doctorId === 0) {
      this.formInline.doctorId = undefined
    }
    if (this.formInline.secondRecommender === 0) {
      this.formInline.secondRecommender = undefined
    }
    this.userInfo = this.$store.getters.user
    this.getBookProjectList()
    if (this.billType !== undefined) {
      this.getOrderDetailsList()
    }
    this.getCustomCardSum()
    this.getCurrentTime()
    this.getUserList(this.deptId)
    // this.getBillingManagement()
    this.getDepartment()
  },
  methods: {
    //设置不默认回填
    Readonly(index){
       this.tableData[index].readonly=false;
       this.$set(this.tableData,index,this.tableData[index])
    },
    doctorine(val) {
      if (val) {
        this.Bath = this.BathList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.Bath = this.BathList
      }
    },
    Consultant(val) {
      if (val) {
        this.esthetics = this.estheticsList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.esthetics = this.estheticsList
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
    BillTypeName(str) {
      const obj = this.dict.type.billing_type.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    BillStatusName(str) {
      const obj = this.dict.type.billing_status.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    search: debounce(function() {
      this.$api.product.productManagement({
        deptId: this.deptId,
        // departmentId: this.billing.departmentId,
        projectName: this.dateline.projectName,
        priceOne: this.dateline.priceOne,
        endpriceOne: this.dateline.endpriceOne,
        priceStatus:'0'
      }).then(res => {
        this.projectList = res.rows
      })
    }),
    // 时间格式化
    getCurrentTime() {
      // 获取当前时间并打印
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.getTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },
    // 确认整单折扣
    /**
     * @author 李尚
     * @date 11/5/2022
     * @Description: 判断是否打折，不打折折扣不变
     */
    confirm() {
      if (this.formInline.discount === '') {
        this.$message('套餐价格不能为空')
        return
      }
      if (this.tableData.length === 0) {
        this.$message('请先选择产品')
        return
      }
      // 计算总的不打折金额
      let noDiscountTotal = 0
      this.tableData.forEach(item => {
        noDiscountTotal = math.add(noDiscountTotal, item.totalAmount).toFixed(2)
      })
      if (this.formInline.discount > noDiscountTotal) {
        this.$message('整单折扣价格不能大于整单原价')
        return
      }
      // 过滤出不打折的
      const set = this.tableData.filter(function(num) {
        return num.isDiscount !== '1'
      })
      let number = 0
      // 不打折的价格相加
      set.forEach(item => {
        number = math.add(number, item.discountAmount).toFixed(2)
        // number = math.add(number, item.finalPrice).toFixed(2)
      })
      // 不打折的价格与整单折扣金额相减
      const reduce = math.subtract(this.formInline.discount, number).toFixed(2)
      // 过滤出打折的
      const labes = this.tableData.filter(function(num) {
        return num.isDiscount === '1'
      })
      // 循环相加打折的价格
      let final = 0
      labes.forEach(item => {
        final = math.add(item.finalPrice, final).toFixed(2)
      })
      let except = 0
      labes.forEach(item => {
        // 打折的金额相加除自身的金额 所得百分比
        except = math.divide(item.finalPrice, final).toFixed(2)
        // 所得百分比 乘 不打折的价格与整单折扣金额相减的值
        item.discountAmount = math.multiply(except, reduce).toFixed(2)
      })
      // 打折的和不打折的全部合并到一个数组里
      this.tableData = labes
      set.forEach(item => {
        this.tableData.push(item)
      })
      // 判断不打折的所有价格合 是否大于 输入的整单折扣
      if (parseFloat(number) > parseFloat(this.formInline.discount)) {
        this.accountsPayable = number
        this.tableData.forEach(item => {
          item.discount = math.divide(item.discountAmount, math.multiply(item.finalPrice, item.quantity).toFixed(2)).toFixed(2)
        })
      } else if (parseFloat(number) < parseFloat(this.formInline.discount) || parseFloat(number) === parseFloat(this.formInline.discount)) {
        this.accountsPayable = this.formInline.discount
        this.tableData.forEach(item => {
          item.discount = math.divide(item.discountAmount, math.multiply(item.finalPrice, item.quantity).toFixed(2)).toFixed(2)
          // item.discount = math.divide(item.discountAmount, item.finalPrice).toFixed(2)
        })
      }
      // this.$set(this.tableData, scope.$index, scope.row)
      this.discountAmount()
    },
    /**
     * @author Nevin
     * @date 2022/5/16
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
    // 项目列表
    getBookProjectList() {
      this.showDataDialog = true
      this.$api.modules.netPower.projectTreeselect({
        deptId: this.deptId,
        departmentId: this.formInline.depertment
      }).then(res => {
        const arr = []
        res.data.forEach(value => {
          if (value.isDepartment == '1') {
            arr.push(value)
          }
        })
        this.bookProjectList = arr
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    getTree() {
      this.getBookProjectList()
    },
    // 树形结构
    treeNodeClick(data) {
      /**
        * @author 李尚
        * @date 2022/8/10
        * @Description: 555-570行 节流，如果一秒内多次点击只请求一次
      */
      // 判断是否再请求数据
      if (this.timer) {
        // 如果数据正在请求阻止并删除上次请求
        clearTimeout(this.timer)
      }
      // this.product = true
      this.timer = setTimeout(() => {
        if ('departmentInfoVos' in data) {
          this.projectList = []
        } else {
          this.categoryId = data.departmentId
          this.$api.product.productManagement({ categoryId: data.departmentId,priceStatus:'0' }).then(res => {
            if (res) {
              this.projectList = res.rows
              this.product = false
            }
          })
        }
      }, 500)
    },
    // 产品列表 添加按钮
    handleClick(index, row) {
      let flag = false
      // 计算费用合计
      let total = 0
      this.tableData.forEach(item => {
        if (item.itemId === row.itemId) {
          this.$message.warning('不可重复添加')
          flag = true
          return
        }
        total = math.add(total, item.discountAmount).toFixed(2)
      })

      if (!flag) {
        this.accountsPayable = total // 测试新加
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
        this.packageProducts.discount = row.discountNumber // 折扣(默认1)
        this.packageProducts.priceNum = row.priceNum // 次数
        this.packageProducts.totalAmount = row.priceOne // 合计金额
        this.packageProducts.quantity = row.quantity ? row.quantity : 1 // 数量默认为1
        this.packageProducts.customerRepresentative = row.customerRepresentative // 客户代表
        this.packageProducts.doctorId = row.doctorId // 医生
        this.packageProducts.isPayment = row.isPayment // 是否交款
        this.packageProducts.refundsignid = row.refundsignid // 未知
        this.packageProducts.secondRecommender = row.secondRecommender // 二开推荐人
        this.packageProducts.quantity = 1 // 默认数量设为1
        this.packageProducts.costType = row.costType // 费用类型
        this.packageProducts.categoryId = this.categoryId
        this.packageProducts.discountAmount = math.multiply(row.priceOne, row.quantity ? row.quantity : 1, row.discountNumber).toFixed(2) // 折扣后金额
        this.packageProducts.cycleDays = row.cycleDays
        this.packageProducts.billingDepartment = row.departmentId //  划扣科室 开
        this.packageProducts.readonly=true //默认不回填
        this.tableData.push(this.packageProducts)
        this.packageProducts = {}
        this.tableData.forEach(item => {
          this.$set(item, 'quantitySum', math.multiply(item.priceNum, item.quantity))
        })
        this.accountsPayable = this.tableData.reduce((prev, next) => {
          return math.add(prev, next.discountAmount).toFixed(2)
        }, 0)
      }
    },
    // 数量 最终价格
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

      // 计算折后价格
      value.totalAmount = value.totalAmount == 0 ? value.totalAmount : math.multiply(value.finalPrice, value.quantity).toFixed(2)
      value.discountAmount = value.discountAmount == 0 ? value.discountAmount : math.multiply(value.finalPrice, value.quantity, value.discount).toFixed(2)
      this.$set(this.tableData, index, value)
      // 计算费用合计
      let total = 0
      this.tableData.forEach(ite => {
        if (ite.discountAmount > 0) {
          total = math.add(total, ite.discountAmount).toFixed(2)
        }
      })
      this.accountsPayable = total
      // this.formInline.discount = total
    },
    // 折扣
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
        if (parseFloat(ite.discountAmount) > 0) {
          total = math.add(total, ite.discountAmount).toFixed(2)
        }
      })
      this.accountsPayable = total
      // this.formInline.discount = total
    },
    // 折后金额
    discountAmount(index, value) {
      if (value !== undefined) {
        if (value.discountAmount === '') {
          value.discountAmount = 0
          value.discount = 0
        }
        console.log(value.discountAmount)
        this.$set(this.tableData, index, value)
        let total = 0
        this.tableData.forEach(item => {
          if (item.discountAmount !== 0) {
            item.discount = math.divide(item.discountAmount, math.multiply(item.finalPrice, item.quantity).toFixed(2)).toFixed(2)
          }
          if (parseFloat(item.discountAmount) > 0) {
            total = math.add(total, item.discountAmount).toFixed(2)
          }
        })
        this.accountsPayable = total
      }
    },
    // 删除
    handleDelete(index, row) {
      if (row.orderDetailsId) {
        this.removeIds.push(row.orderDetailsId)
      }
      this.tableData.splice(index, 1)
      this.accountsPayable = this.tableData.reduce((prev, next) => {
        return math.add(prev, next.discountAmount).toFixed(2)
      }, 0)
    },
    // 退出
    remode() {
      this.closeTag()
      // this.$router.back()
    },
    addOrEdit() {
      if (this.tableData.length === 0) {
        this.$message.error('请选择产品！')
        this.$message.error('请选择产品！')
        return
      }
      this.$refs.formInline.validate((valid) => {
        if (valid) {
          // this.submitLoading = true
          if (this.billType !== undefined) {
            this.$set(this.formInline, 'onlineUserId', this.billing.onlineUserId)
            this.$set(this.formInline, 'deptId', this.deptId) // 公司ID
            this.$set(this.formInline, 'billType', this.billType) // 开单类型
            this.$set(this.formInline, 'departmentId', this.formInline.depertment) // 科室ID
            this.$set(this.formInline, 'billingDepartment', this.formInline.depertment) // 科室ID
            this.$set(this.formInline, 'amountPayable', this.accountsPayable) // 应付金额
            // this.$set(this.formInline, 'discount', this.allDiscount) // 折扣
            this.$set(this.formInline, 'dsingleUser', this.userInfo.userId) // 下单人
            this.$set(this.formInline, 'totalExpenses', this.accountsPayable)
            this.$set(this.formInline, 'orderId', this.billing.orderId)
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
            this.$delete(this.formInline, 'intentionDescription')
            // this.$delete(this.formInline, 'isSecondary')
            this.$delete(this.formInline, 'receptionStatus')
            this.$delete(this.formInline, 'receptionTime')
            this.$delete(this.formInline, 'secondOpeningUser')
            this.$delete(this.formInline, 'triageType')
            this.tableData.forEach(item => {
              item.onlineUserId = this.billing.onlineUserId
              this.$set(item, 'quantitySum', math.multiply(item.priceNum, item.quantity))
              this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
              this.$set(item, 'doctorId', this.formInline.doctorId)
              this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
              this.$set(item, 'customerRepresentative', this.billing.customerRepresentative)
              this.$set(item, 'dsingleUser', this.userInfo.userId)
            })
            this.$api.billingList.editOrderInfo({
              'orderInfo': this.formInline,
              'orderDetailsList': this.tableData,
              'removeIds': this.removeIds
            }).then(res => {
              if (res) {
                this.tableData = []
                this.projectList = []
                this.$message.success(res.msg)
                this.submitLoading = false
                this.closeTag()
              }
            })
          } else {
            this.$set(this.formInline, 'onlineUserId', this.billing.onlineUserId)
            this.$set(this.formInline, 'deptId', this.deptId) // 公司ID
            this.$set(this.formInline, 'billType', '21') // 开单类型
            this.$set(this.formInline, 'departmentId', this.formInline.depertment) // 科室ID
            this.$set(this.formInline, 'billingDepartment', this.formInline.depertment) // 科室ID
            this.$set(this.formInline, 'amountPayable', this.accountsPayable) // 应付金额
            // this.$set(this.formInline, 'discount', this.allDiscount) // 折扣
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
            this.$delete(this.formInline, 'intentionDescription')
            // this.$delete(this.formInline, 'isSecondary')
            this.$delete(this.formInline, 'receptionStatus')
            this.$delete(this.formInline, 'receptionTime')
            this.$delete(this.formInline, 'secondOpeningUser')
            this.$delete(this.formInline, 'triageType')
            this.tableData.forEach(item => {
              item.onlineUserId = this.billing.onlineUserId
              this.$set(item, 'quantitySum', math.multiply(item.priceNum, item.quantity))
              this.$set(item, 'aestheticConsultant', this.formInline.aestheticConsultant)
              this.$set(item, 'doctorId', this.formInline.doctorId)
              this.$set(item, 'secondRecommender', this.formInline.secondRecommender)
              this.$set(item, 'customerRepresentative', this.billing.customerRepresentative)
              this.$set(item, 'dsingleUser', this.userInfo.userId)
            })
            this.$api.billingList.addOrderInfo({
              'orderInfo': this.formInline,
              'orderDetailsList': this.tableData
            }).then(res => {
              if (res) {
                this.tableData = []
                this.projectList = []
                this.$message.success(res.msg)
                this.submitLoading = false
                this.closeTag()
              }
            })
          }
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
    marriageChange(val) {
      this.$forceUpdate()
    },
    // 获取用户列表
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
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          this.copySysUserList = this.sysUserList

          // ---------岗位------
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          })
          // 洗浴师
          res.data.forEach(item => {
            if (item.postCode === 'therapeutist' || item.postCode === 'doctor') {
              this.Bath.push(item)
            }
          })
          this.BathList = this.Bath
          // ---------------------
          // 产康
          res.data.forEach(item => {
            if (item.postCode === 'chks') {
              this.Chankang.push(item)
            }
          })
          this.copyChankang = this.Chankang
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
            }
          })
          this.estheticsList = this.esthetics
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    getDepartment() { // 获取科室接口
      const data = {
        deptId: this.deptId
      }
      this.$api.modules.filing.departmentInfoList(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
        }
        this.depertmentList = res.rows.filter(item => item.isDepartment == 1)
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
//5月5，李 修改样式
.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 15px 20px 20px 20px;
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

.el-button--mini,
.el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}

.management {
  //padding: 6px 40px;
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

  .demo-form-inline .el-form-item__label {
    color: #ffffff;
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
    flex: 25%;
    width: 25%;
    height: 200px;
    overflow-y: auto;
    border: 1px solid rgb(144, 144, 141);
  }

  .list {
    flex: 75%;
    width: 75%;
    padding-left: 5px;
    height: 200px;
    border: 1px solid rgb(144, 144, 141);
  }
}

.detailed {
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  height: 100px;
  border: 1px solid rgb(144, 144, 141);
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
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
