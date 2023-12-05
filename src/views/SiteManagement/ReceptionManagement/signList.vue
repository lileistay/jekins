<template>
  <!-- 签到列表 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
        >查询
        </el-button>
      </div>
      <slot>
        <sg-table
          id="out-table"
          ref="table"
          :sg-ref="'multipleTable'"
          size="mini"
          border
          index="序号"
          selection
          :table-data="tableData"
          :columns="columns"
          :pagination="pagination"
          :row-class-name="rowClassName"
          highlight-current-row
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="searchBar" />
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
            <el-button
              v-hasPermi="['confinement:customerCmt']"
              type="primary"
              size="mini"
              plain
              icon="el-icon-edit"
              style="float: right; margin-left: 10px"
              @click.stop.native="repulse"
            >领取接诊单
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:updatePhoneMajor:edit']"
              size="mini"
              type="primary"
              plain
              class="headerBarBtn"
              @click.stop.native="editPhone"
            >修改主号码
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:mergeCustomer:edit']"
              size="mini"
              type="primary"
              plain
              class="headerBarBtn"
              @click.stop.native="handlecompile"
            >客户合并
            </el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customerName'">
              <a @click="customer(data.custom,data.custom)">
                {{ data.custom.customerName }}
              </a>
            </div>
            <div v-if="data.props==='processingStatus'">
              <show-dict-data :options="dict.type.sign_status" :value="data.custom.processingStatus" />
            </div>
            <!--            &lt;!&ndash; 点击号码详情跳转到修改 &ndash;&gt;-->
            <!--            <div v-else-if="data.props === 'phoneDetail'">-->
            <!--              <a @click="phoneDetailClick(data)">号码详情</a>-->
            <!--            </div>-->
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <!-- 修改临客电话 -->
    <sg-dialog title="临客电话号码" :dialog="Telephone" size="400px" @handleClose="customTelephone">
      <div slot="out">
        <el-form ref="changePhoneForm" label-width="120px" size="mini" :model="changePhoneForm" :rules="phoneRules">

          <el-form-item label="新主号码：">
            <el-input v-model="changePhoneForm.customPhone" disabled />
          </el-form-item>
          <el-form-item label="客户姓名：" prop="customerName">
            <el-input v-model="changePhoneForm.customerName" disabled />
          </el-form-item>
          <el-form-item label="原主号码：" prop="customTruePhone">
            <el-input v-model="changePhoneForm.customTruePhone" disabled />
          </el-form-item>
          <el-button size="mini" @click="selectCustomerDialog=true">修改主号码</el-button>
          <el-button size="mini" @click="AddPhones">保存</el-button>
          <el-button size="mini" @click="customTelephone">关闭</el-button>
        </el-form>
      </div>
    </sg-dialog>
    <sg-dialog title="临客电话号码" :dialog="selectCustomerDialog" size="870px" @handleClose="selectCustomerDialog=false">
      <div slot="out">
        <sg-table
          ref="selectMergeCustomerTable"
          :sg-ref="'selectMergeCustomerTable'"
          :pagination="selectMergeCustomerTablePagination"
          size="mini"
          border
          index="序号"
          highlight-current-row
          :max-height="'400px'"
          :table-data="selectMergeCustomerTableData"
          :columns="selectMergeCustomerTableColumns"
        >
          <div slot="searchBar">
            <el-form :inline="true" size="mini">
              <el-form-item label="客户姓名">
                <el-input
                  v-model="searchMergeCustomersForm.customerName"
                  @keyup.enter.native="searchMergeCustomers"
                />
              </el-form-item>
              <el-form-item label="客户电话">
                <el-input
                  v-model="searchMergeCustomersForm.customPhone"
                  @keyup.enter.native="searchMergeCustomers"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchMergeCustomers">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customSex'">
              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
            </div>
            <div v-if="data.props === 'operation'">
              <el-button size="mini" type="primary" :disabled="mergeForm.mainId===data.custom.id" @click="selectedSecondaryCustomer(data.custom)">选择</el-button>
            </div>
          </template>
        </sg-table>
      </div>
    </sg-dialog>
    <!--临客合并-->
    <sg-dialog
      title="临客合并"
      :dialog="comutTemporary"
      :inner-dialog="selectMergeCustomerDialog"
      inner-title="选择合并人"
      :inner-size="'880px'"
      @innerHandleClose="margeInnerHandleClose"
      @handleClose="Temporary"
    >
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            主号码信息 <span style="color: red">*客户信息会被合并到主号码姓名下</span>
          </div>
          <div v-if="Object.keys(margeMainCustomerInfo).length!==0" class="content">
            <el-form label-width="120px" size="mini" :model="mergeForm">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：">
                    <el-input :value="margeMainCustomerInfo.customerName" style="width: 150px;" disabled />
                    <span style="color: red">{{
                        margeMainCustomerInfo.isReachCourtyard === '0' ? '未到院' : '到院'
                      }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话：" prop="customPhone">
                    <el-radio-group v-model="mergeForm.customPhone">
                      <el-radio :label="margeMainCustomerInfo.customTruePhone">{{ margeMainCustomerInfo.customTruePhone }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="建档类型：" prop="typeThreeId">
                    <el-radio-group v-model="mergeForm.typeThreeId">
                      <el-radio
                        :label="margeMainCustomerInfo.typeThreeId"
                      >
                        {{
                          margeMainCustomerInfo.filingName + '/' + margeMainCustomerInfo.typeTwoName + '/' + margeMainCustomerInfo.typeThreeName
                        }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="建档人：" prop="createuserId">
                    <el-radio-group v-model="mergeForm.createuserId">
                      <el-radio :label="margeMainCustomerInfo.createuserId">{{ margeMainCustomerInfo.createUserName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="媒介来源：" prop="channelId">
                    <el-radio-group v-model="mergeForm.channelId">
                      <el-radio :label="margeMainCustomerInfo.channelId">{{ margeMainCustomerInfo.channelName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="线上客服：" prop="onlineUserId">
                    <el-radio-group v-model="mergeForm.onlineUserId">
                      <el-radio :label="margeMainCustomerInfo.onlineUserId">{{ margeMainCustomerInfo.onlineUserName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="回访人：" prop="visituserId">
                    <el-radio-group v-model="mergeForm.visituserId">
                      <el-radio :label="margeMainCustomerInfo.visituserId">{{ margeMainCustomerInfo.visituserName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12" />
              </el-row>
            </el-form>
          </div>
        </div>
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="selectMergeCustomerDialog=true">选择号码合并
        </el-button>
        <div class="dialog-box">
          <div class="title">
            被合并号码信息
          </div>
          <div class="content">
            <el-form label-width="120px" size="mini" :model="mergeForm">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：">
                    <el-input :value="margeSecondaryCustomerInfo.customerName" style="width: 150px;" disabled />
                    <span style="color: red">{{
                        margeSecondaryCustomerInfo.isReachCourtyard === '0' ? '未到院' : '到院'
                      }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话：" prop="customPhone">
                    <el-radio-group v-model="mergeForm.customPhone">
                      <el-radio :label="margeSecondaryCustomerInfo.phone">
                        {{ margeSecondaryCustomerInfo.phone }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="建档类型：" prop="typeThreeId">
                    <el-radio-group v-model="mergeForm.typeThreeId">
                      <el-radio
                        :label="margeSecondaryCustomerInfo.typeThreeId"
                      >
                        {{
                          margeSecondaryCustomerInfo.filingName + '/' + margeSecondaryCustomerInfo.typeTwoName + '/' + margeSecondaryCustomerInfo.typeThreeName
                        }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="建档人：" prop="createuserId">
                    <el-radio-group v-model="mergeForm.createuserId">
                      <el-radio :label="margeSecondaryCustomerInfo.createuserId">
                        {{ margeSecondaryCustomerInfo.cdName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="媒介来源：" prop="channelId">
                    <el-radio-group v-model="mergeForm.channelId">
                      <el-radio :label="margeSecondaryCustomerInfo.channelId">
                        {{ margeSecondaryCustomerInfo.channelName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="线上客服：" prop="onlineUserId">
                    <el-radio-group v-model="mergeForm.onlineUserId">
                      <el-radio :label="margeSecondaryCustomerInfo.onlineUserId">
                        {{ margeSecondaryCustomerInfo.oudName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="回访人：" prop="visituserId">
                    <el-radio-group v-model="mergeForm.visituserId">
                      <el-radio :label="margeSecondaryCustomerInfo.visituserId">
                        {{ margeSecondaryCustomerInfo.vdName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12" />
              </el-row>
            </el-form>
          </div>
        </div>
        <el-button size="mini" type="primary" plain @click="mergeSave">保存</el-button>
        <el-button type="danger" plain size="mini" @click="Temporary">关闭</el-button>
      </div>
      <div slot="in">
        <sg-table
          ref="selectMergeCustomerTable"
          :sg-ref="'selectMergeCustomerTable'"
          :pagination="selectMergeCustomerTablePagination"
          size="mini"
          border
          index="序号"
          highlight-current-row
          :max-height="'400px'"
          :table-data="selectMergeCustomerTableData"
          :columns="selectMergeCustomerTableColumns"
        >
          <div slot="searchBar">
            <el-form :inline="true" size="mini">
              <el-form-item label="客户姓名">
                <el-input
                  v-model="searchMergeCustomersForm.customerName"
                  @keyup.enter.native="searchMergeCustomers"
                />
              </el-form-item>
              <el-form-item label="客户电话">
                <el-input
                  v-model="searchMergeCustomersForm.customPhone"
                  @keyup.enter.native="searchMergeCustomers"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchMergeCustomers">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customSex'">
              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
            </div>
            <div v-if="data.props === 'operation'">
              <el-button size="mini" type="primary" :disabled="mergeForm.mainId===data.custom.id" @click="selectedSecondaryCustomer(data.custom)">选择</el-button>
            </div>
          </template>
        </sg-table>
      </div>
    </sg-dialog>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import moment from 'moment'
// import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import { math } from '@/utils/math'
import { todayTime } from '@/utils/time'
import SgDialog from '@/components/Dialog'
export default {
  dicts: ['sign_status', 'marital_status', 'sys_user_sex', 'hospat_yn', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether', 'sys_is_blacklist', 'occupation'],
  components: {
    SgTable,
    slideSearch,
    SgDialog
  },
  data() {
    // const validatePhone = (rule, value, callback) => {
    //   if (value !== undefined) {
    //     const valid = validPhone(value)
    //     if (!valid) {
    //       callback(new Error('手机号码格式不正确'))
    //     }
    //     callback()
    //   }
    // }
    return {
      tableDatas: [],
      submitLoadings: false,
      submitLoading: false,
      coument: '',
      payableSigle: 0,
      placeorder: 0, // 下单人数
      // checkOut: 0,
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      dialogVisible: false,
      receipt: {
        orderId: '',
        billingStatus: '2',
        orderNumber: '',
        returnComments: ''
      },
      rules: {
        returnComments: [
          { required: true, message: '请填写打回备注', trigger: 'change' }
        ]
      },
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      //  序列清单
      columns: [

        {
          lab: '顾客名称',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '顾客电话',
          val: 'phone'
        },
        {
          lab: '顾客旧电话',
          val: 'oldPhone'
        },
        {
          lab: '签到时间',
          val: 'createTime'
        },
        {
          lab: '上次到院时间',
          val: 'lastArrivalTime'
        },
        {
          lab: '上次接待顾问',
          val: 'acName',
          showOverflowTooltip: true
        },
        {
          lab: '签到状态',
          val: 'processingStatus',
          custom: 'processingStatus'
        }
      ],
      // 查询出列表
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '签到时间:',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        customPhone: {
          type: 'input',
          label: '顾客电话:',
          values:''
        }
      },
      // 临客合并内选择框开关
      selectCustomerDialog: false,
      selectMergeCustomerDialog: false,
      secondaryCustomer: {},
      comutTemporary: false,
      // 临客合并
      mergeForm: {
        mainId: null,
        secondaryId: null,
        createuserId: null,
        filingId: null,
        typeTwoId: null,
        typeThreeId: null,
        channelId: null,
        channelTypeId: null,
        onlineUserId: null,
        visituserId: null,
        customPhone: null,
        deptId: null
      },
      // 临客合并主账号信息
      margeMainCustomerInfo: {},
      // 临客合并副账号信息
      margeSecondaryCustomerInfo: {},
      // 临客合并的查询副账户请求
      searchMergeCustomersForm: {
        customPhone: '',
        customerName: '',
        deptId: this.deptId
      },
      // 选择合并人的分页
      selectMergeCustomerTablePagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      // 选择合并人的表格数据和选择合并人的表头
      selectMergeCustomerTableData: [],
      selectMergeCustomerTableColumns: [
        {
          lab: '姓名',
          val: 'customerName',
          width: '100px'
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex',
          width: '50px'
        },
        {
          lab: '年龄',
          val: 'customAge',
          width: '50px'
        },
        {
          lab: '媒介来源',
          val: 'channelName',
          width: '150px'
        },
        {
          lab: '手机',
          val: 'customPhone',
          width: '100px'
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: '150px'
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
          width: '100px'
        },
        {
          lab: '操作',
          custom: 'operation',
          width: '80px'
        }
      ],
      Telephone: false, // 临客修改
      // 修改客户电话
      changePhoneForm: {},
      phoneRules: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' }
          // { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          // { validator: validatePhone, trigger: 'blur' },
          // { validator: validatePhone, trigger: 'change' }
        ],
        customerName: [
          { required: true, message: '请选择要变更号码的客户', trigger: 'change' }
        ],
        customTruePhone: [
          { required: true, message: '请选择要变更号码的客户', trigger: 'change' }
        ]
      }
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
    }
  },
  created() {
    this.options.customPhone.values=this.$route.query.phone
    this.getData()


  },
  methods: {
    // 修改列表
    rowClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    handlecompile() {
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客')
        return
      }
      if (this.selectionData[0].processingStatus !== '1') {
        this.$message.warning('当前客户不能合并')
        return
      }
      this.Addhandlecompile(this.selectionData[0].id)
    },
    // 打开临客合并弹窗
    Addhandlecompile(id) {
      this.$api.user.getUserInfoById(id).then(res => {
        console.log(res,'ldjgkjgkf')
        if (res) {
          console.log(res.data)
          this.mergeForm.secondaryId = res.data.id
          this.mergeForm.createuserId = res.data.createuserId
          this.mergeForm.channelTypeId = res.data.channelTypeId
          this.mergeForm.channelId = res.data.channelId
          this.mergeForm.filingId = res.data.filingId
          this.mergeForm.typeTwoId = res.data.typeTwoId
          this.mergeForm.typeThreeId = res.data.typeThreeId
          this.mergeForm.onlineUserId = res.data.onlineUserId
          this.mergeForm.visituserId = res.data.visituserId
          this.mergeForm.customPhone = res.data.phone
          this.mergeForm.deptId = res.data.deptId
          this.margeSecondaryCustomerInfo = res.data
          // 先绑定数据再打开弹出框
          this.comutTemporary = true
        }
      })
    },
    // 保存临客合并
    mergeSave() {
      if (Object.keys(this.margeSecondaryCustomerInfo).length === 0) {
        this.$message.error('请先选择要被合并的客户信息')
        return
      }
      this.$api.customerCmt.mergeCustomer(this.mergeForm).then(res => {
        // 操作成功，关闭弹窗
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.Temporary()
          this.getData()
        }
      })
    },
    Temporary() {
      // 清除上次选中的副账户数据
      this.margeSecondaryCustomerInfo = {}
      this.comutTemporary = false
    },
    // 点击跳转号码详情页面
    phoneDetailClick(val) {
      // console.log(val)
      this.$router.push({ path: '/maintainGuestPhoneDetail'})
      sessionStorage.setItem('guestId',val.custom.id)
    },
    // 修改主号码内部弹框选择副临客信息
    selectedSecondaryCustomer(info) {
      this.secondaryCustomer = info
      this.margeMainCustomerInfo = info
      // 临客合并表单
      this.mergeForm.mainName = info.customerName
      this.mergeForm.mainId = info.id
      // 修改号码表单验证
      this.$set(this.changePhoneForm, 'id', info.id)
      this.$set(this.changePhoneForm, 'deptId', this.deptId)
      this.$set(this.changePhoneForm, 'customerName', info.customerName)
      this.$set(this.changePhoneForm, 'customTruePhone', info.customTruePhone)
      // // 关闭内弹窗
      this.margeInnerHandleClose()
      this.$forceUpdate()
    },
    // 合并内部弹框关闭
    margeInnerHandleClose() {
      // 清除上次查询的数据
      this.selectMergeCustomerTableData = []
      // 清除上次搜索的表单
      this.searchMergeCustomersForm.customerName = ''
      this.searchMergeCustomersForm.customPhone = ''
      // 关闭弹窗
      this.selectMergeCustomerDialog = false
      this.selectCustomerDialog = false

    },
    // 搜索要修改号码的临客信息
    searchMergeCustomers() {
      if (this.searchMergeCustomersForm.customPhone === '' && this.searchMergeCustomersForm.customerName === '') {
        this.$message.warning('请输入姓名或电话后再搜索！')
        return
      }
      this.$set(this.searchMergeCustomersForm, 'deptId', this.deptId)
      // console.log(this.searchMergeCustomersForm)
      this.$api.user.customerCmtList(this.searchMergeCustomersForm).then(res => {
        if (res) {
          this.selectMergeCustomerTableData = res.rows
          this.selectMergeCustomerTablePagination.total = res.total
          this.$message.success('查询成功')
        }
      })
    },

    orderNumber(data) {
      // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData()
        }
      }
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
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
      if (this.selectionData[0] != undefined) {
        this.coument = this.selectionData[0].customerName
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.coument = e[1].customerName
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 领取接诊单
    repulse() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客')
        return
      }
      if (this.selectionData[0].phone == undefined) {
        this.$message.warning('该顾客电话号码为空')
        return
      }
      this.$router.push({ path: '/receptionSheet', query: { customPhone: this.selectionData[0].phone, openId: this.selectionData[0].openId }})
    },
    // 修改临客电话 - 打开
    editPhone() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData.length > 1) {
        this.$message.warning('只能同时修改一名顾客的电话')
        return
      }
      this.Telephone = true
      // this.Editphone(this.selectionData[0].id)
      this.changePhoneForm = {
        customPhone: this.selectionData[0].phone
      }
    },
    // 修改临客电话 - 保存
    AddPhones() {
      this.$refs.changePhoneForm.validate((validate) => {
        if (validate) {
          const data = new URLSearchParams()
          data.append('id', this.changePhoneForm.id)
          data.append('customPhone', this.changePhoneForm.customPhone)
          data.append('deptId', this.deptId)
          this.$api.customerCmt.setCustomMainPhone(data).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.changePhoneForm = {}
              this.Telephone = false
            }
          })
        }
      })
    },
    // 修改临客电话 - 关闭
    customTelephone() {
      this.Telephone = false
    },
    repulseReceipt() {
      this.$refs.receipt.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$api.finance.repulseReceipt(this.receipt).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.submitLoading = false
              this.getData()
            }
          })
        }
      })
    },
    customer(personal, val) {
      const id = personal.id
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.billingStatus }})
    },
    /**
     * @author 李尚
     * @date 17/5/2022
     * @Description: 搜索
     */
    async getData(isSearch) {
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
      data = Object.assign(data, this.pagination)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.showDataDialog = true
      await this.$api.finance.signinInfoList(data).then(res => {
        if (res) {
          this.pagination.total = res.total
          this.tableData = res.rows
          // let arr = res.rows.filter(ite => {
          //   return ite.billingStatus === '2'
          // })
          // this.placeorder = arr.length
          // let arrcheck = res.rows.filter(ite => {
          //   return ite.billingStatus === '3'
          // })
          // this.checkOut = arrcheck.length
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 弹框关闭
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {})
    }
  }
}
</script>

<style scoped lang="scss">


.dialog-box {
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  font-size: 14px;

  .title {
    display: flex;
    justify-content: space-between;
    //width: 100%;
    height: 30px;
    background-color: #eeeeee;
    padding: 0 10px;
    line-height: 30px;
    box-sizing: border-box;

    span {
      color: #7ec5b7;
    }
  }

  .content {
    padding: 10px;
    box-sizing: border-box;
  }
}

a{
  color: #7b95ef;
}
.container {
  width: 100%;
  height: 100%;
}
::v-deep .el-dialog__header{
  background-color: #1abc9c;
}
.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}
span {
  color: #999;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
</style>
<style>
.el-input__prefix{
  display: none;
}
</style>
