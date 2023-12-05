<template>
  <!--- 医生业绩查询 --->
  <div class="container">
    <div class="left">
      <div class="left-content">
        <el-form ref="form" :model="form" size="mini" label-position="top">
          <el-form-item label="查询时间类型">
            <el-select  filterable v-model="form.timeType" placeholder="请选择收费单类型">
              <el-option value="treat" label="治疗时间" />
              <el-option value="create" label="生成业绩时间" />
              <el-option value="checkout" label="结账时间" />
              <el-option value="putRecord" label="建档时间" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围：" prop="triagePersonTime">
            <el-date-picker
              v-model="form.triagePersonTime"
              type="datetimerange"
              style="width: 100%"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
          <el-form-item label="客户姓名">
            <el-input v-model="form.customerName" :clearable="true" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.customPhone" :clearable="true" />
          </el-form-item>
          <el-form-item label="收费单号">
            <el-input v-model="form.orderNumber" :clearable="true" />
          </el-form-item>
          <el-form-item label="客户卡号">
            <el-input v-model="form.customCardNumber" :clearable="true" />
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="form.projectName" clearable />
          </el-form-item>
          <el-form-item label="收费单类型">
            <el-select v-model="form.billType" placeholder="请选择收费单类型" filterable clearable>
              <el-option
                v-for="item in dict.type.billing_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="麻醉方式">
            <el-select v-model="form.anesthesiaMethod" placeholder="请选择麻醉方式" filterable clearable>
              <el-option
                v-for="item in dict.type.Anesthesia_mode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="媒介">
            <el-cascader
              v-model="form.channel"
              :filterable="true"
              :clearable="true"
              :options="channelOptions"
              :props="{ expandTrigger: 'hover'}"
              @visible-change="reFlashPage"
            />
          </el-form-item>

          <el-form-item label="医生">
            <el-select filterable v-model="form.aueName" placeholder="请选择医生" :clearable="true">
              <el-option
                v-for="item in doctorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!--<el-form-item label="护士">-->
          <!--  <el-select v-model="form.zrNurse" placeholder="请选择护士" :clearable="true">-->
          <!--    <el-option-->
          <!--        v-for="item in zerenNurseList"-->
          <!--        :key="item.value"-->
          <!--        :label="item.label"-->
          <!--        :value="item.value"-->
          <!--    />-->
          <!--  </el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="客户类型">
            <el-select filterable v-model="form.customerStatus" placeholder="请选择客户类型" :clearable="true">
              <el-option value="1" label="新客户" />
              <el-option value="2" label="老客户" />
            </el-select>
          </el-form-item>
          <el-form-item label="麻醉师">
            <el-select filterable v-model="form.anesthesiologist" placeholder="请选择麻醉师" :clearable="true">
              <el-option
                v-for="item in anesthesiologistList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="建档类型">
            <el-cascader
              v-model="form.typeThree"
              :filterable="true"
              :clearable="true"
              :options="filingTypeOptions"
              :props="{ expandTrigger: 'hover' ,value:'filingId',label:'filingName',children:'child'}"
            />
          </el-form-item>
          <!--<el-form-item label="客户卡号">-->
          <!--  <el-input v-model="form.billTime"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="巡回护士">
            <el-select filterable v-model="form.circulatingNurse" placeholder="请选择巡回护士" :clearable="true">
              <el-option
                v-for="item in xunhuiNurseList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="医助">
            <el-select filterable v-model="form.doctorAssistant" placeholder="请选择医助" :clearable="true">
              <el-option
                v-for="item in doctorAssistantList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="美学顾问">
            <el-select filterable v-model="form.aestheticConsultant" placeholder="请选择美学顾问" :clearable="true">
              <el-option
                v-for="item in aestheticConsultantList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="科室">
            <el-select v-model="form.departmentId" filterable clearable @change="oneProjectChange">
              <el-option
                v-for="item in TriageDepartment"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务助理">
            <el-select v-model="form.serviceAssistant" placeholder="请选择服务助理" :clearable="true">
              <el-option
                v-for="item in serviceAssistantList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="一级项目">
            <el-select filterable v-model="form.departmentId" clearable @change="oneProjectChange">
              <el-option
                v-for="item in oneProjects"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="二级项目">
            <el-select filterable v-model="form.projectTypeId" clearable @change="twoProjectChange">
              <el-option
                v-for="item in twoProjects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="三级项目">
            <el-select filterable v-model="form.categoryId" clearable>
              <el-option
                v-for="item in threeProjects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="实际执行医生">
            <el-select v-model="form.actualExecutorUser" filterable placeholder="请选择执行医生" :clearable="true">
              <el-option
                v-for="item in doctorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="left-footer">

        <el-button size="mini" type="primary" plain icon="el-icon-search" @keydown.enter.native="getData(true,'1')" @click="getData(true,'1')">查询</el-button>
        <el-button v-has-permi="['confinement:queryCenter:exportdoctor']" size="mini" type="success" plain icon="el-icon-download" @click="getData(true,'2')">导出</el-button>
      </div>
    </div>
    <div class="right">
      <sg-table
        size="mini"
        selection
        border
        index="序号"
        highlight-current-row
        :table-data="tableData"
        :columns="columns"
        :pagination="pagination"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <div slot="searchBar" class="searchBar">
          <div class="title">信息统计</div>
          <div>
            <ul>
              <li>客户数量:<span>{{
                doctorPerformanceStatistics.customersNumber ? doctorPerformanceStatistics.customersNumber : 0
              }}人</span></li>
              <li>已执行业绩:<span>{{
                doctorPerformanceStatistics.totalPerformance ? doctorPerformanceStatistics.totalPerformance : 0
              }}元</span></li>
            </ul>
          </div>
        </div>
        <div slot="header">
          <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'customerName'">
            <a
              style="color: #5f94de;cursor:pointer"
              @click="customerclick(data.custom.id,data.custom)"
            >{{ data.custom.customerName }} </a>
          </div>
          <div v-else-if="data.props === 'orderNumber'">
            <a style="color: #5f94de;cursor:pointer" @click="ordernumber(data.custom)">{{ data.custom.orderNumber }}</a>
          </div>
          <div v-else-if="data.props === 'customerStatus'">
            <span>{{ data.custom.customerStatus === '1' ? '新客户' : '老客户' }}</span>
          </div>
          <div v-else-if="data.props === 'anesthesiaMethod'">
            <show-dict-data :options="dict.type.Anesthesia_mode" :value="data.custom.anesthesiaMethod" />
          </div>
          <div v-else-if="data.props === 'billType'">
            <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
          </div>
          <div v-else-if="data.props === 'operationTypeStatus'">
            <show-dict-data :options="dict.type.operation_type_status" :value="data.custom.operationTypeStatus" />
          </div>
        </template>
      </sg-table>
    </div>

  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import { todayTime } from '@/utils/time'
import moment from 'moment'
import XLSX from 'xlsx'

export default {
  name: 'DoctorPerformance',
  dicts: ['billing_type', 'Triage_type', 'whether_Newguest', 'Anesthesia_mode', 'customer_type', 'operation_type_status'],
  components: {
    SgTable
  },
  data() {
    return {
      loadingData: false,
      form: {
        timeType: 'treat',
        triagePersonTime: todayTime()
      },
      tableData: [],
      doctorPerformanceStatistics: {},
      TriageDepartment: [], // 分诊科室数据
      type: [], // 二级循环的数据
      typeChildren: [], // 三级循环的数据
      // 一级项目数据
      oneProjects: [],
      // 二级项目
      allTwoProjects: [],
      twoProjects: [],
      allThreeProjects: [],
      threeProjects: [],
      // 来源渠道
      channelOptions: [],
      channelTypes: [],
      channels: [],
      // 建档类型
      filingTypeOptions: [],
      /**
       * @author ls
       * @date 2023/2/16
       * @Description: aa
       */
      columns: [
        {
          lab: '姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 140
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 140
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '收费单',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 180
        },
        {
          lab: '客户状态',
          val: 'customerStatus',
          custom: 'customerStatus',
          width: 120
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 120
        },
        {
          lab: '一级项目',
          val: 'departmentName',
          width: 120
        },
        {
          lab: '二级项目',
          val: 'projectTypeName',
          width: 120
        },
        {
          lab: '三级项目',
          val: 'categoryName',
          width: 120
        },
        {
          lab: '项目',
          val: 'projectName',
          width: 120
        },
        {
          lab: '治疗次数',
          val: 'thisScribingNum',
          width: 120
        },
        {
          lab: '产品次数',
          val: 'priceNum',
          width: 120
        },
        {
          lab: '产品总次数',
          val: 'quantitySum',
          width: 120
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 120
        },
        {
          lab: '医助',
          val: 'dassName',
          width: 120
        },
        // {
        //   lab: '护士',
        //   val: 'cnName',
        //   width: 120
        // },
        {
          lab: '巡回护士',
          val: 'cnName',
          width: 120
        },
        {
          lab: '业绩类型',
          val: 'operationTypeStatus',
          custom: 'operationTypeStatus',
          width: 120
        },
        {
          lab: '执行业绩',
          val: 'performance',
          width: 120
        },
        // {
        //   lab: '财务收支总金额',
        //   val: 'customerName',
        //   width: 120
        // },
        {
          lab: '实际执行医生',
          val: 'aueName',
          width: 120
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 120
        },
        {
          lab: '开单咨询',
          val: 'acName',
          width: 120
        },
        {
          lab: '服务助理',
          val: 'saName',
          width: 120
        },
        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType',
          width: 120
        },
        {
          lab: '治疗时间',
          val: 'treatStartTime',
          width: 180
        },
        {
          lab: '麻醉方式',
          val: 'anesthesiaMethod',
          custom: 'anesthesiaMethod',
          width: 120
        },
        {
          lab: '麻醉师',
          val: 'alName',
          width: 120
        },
        {
          lab: '生成业绩时间',
          val: 'genAmentTime',
          width: 180
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 180
        },
        {
          lab: '媒介',
          val: 'channelName',
          width: 120
        },
        {
          lab: '建档类型',
          val: 'typeThreeName',
          width: 120
        },
        {
          lab: '备注',
          val: 'remark',
          width: 120
        },
        {
          lab: '临客建档时间',
          val: 'createTime',
          width: 180
        }
      ],
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      // 医生列表
      doctorList: [],
      // 麻醉师
      anesthesiologistList: [],
      // 巡回和责任护士
      xunhuiNurseList: [],
      zerenNurseList: [],
      // 医助
      doctorAssistantList: [],
      // 美学顾问
      aestheticConsultantList: [],
      // 服务助理
      serviceAssistantList: []

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
      this.deptFilingList(val)
      this.getChannelInfo(val)
    },
    // 一二三级项目
    'options.departmentId.values'() {
      this.options.projectTypeId.options = []
      this.options.categoryId.options = []
      this.options.projectTypeId.values = ''
      this.getDepartmentTwo(this.options.departmentId.values)
    },
    'options.projectTypeId.values'() {
      this.options.categoryId.options = []
      this.options.categoryId.values = ''
      this.getDepartmentThree(this.options.projectTypeId.values)
    }

  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getUserList() // 人员
    this.getDepartmentOne() // 一 级项目
    this.getDepartmentTwo() // 二 级项目
    this.getDepartmentThree() // 三 级项目
    this.getChannelTree() // 媒介类型
    this.deptFilingList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    ordernumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    },
    // 获取媒介类型树结构
    getChannelTree() {
      this.$api.channel.noPageTypeList({ pageSize: 1000 }).then(res => {
        this.channelTypes = res.rows
      }).then(() => {
        this.$api.channel.noPageList({ pageSize: 1000 }).then(res => {
          this.channels = res.rows
        }).then(() => {
          // 遍历
          this.channelTypes.forEach(item => {
            // console.log('进入遍历')
            const channelType = {
              value: item.typeId,
              label: item.typeName,
              children: []
            }
            this.channels.forEach(channel => {
              if (channel.typeId === item.typeId) {
                channelType.children.push({
                  value: channel.channelId,
                  label: channel.channelName
                })
              }
            })
            this.channelOptions.push(channelType)
          })
        })
      })
    },
    // 获取建档类型
    deptFilingList() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.filing.getFilingTypeById(data).then(res => {
        if (res.data) {
          this.filingTypeOptions = res.data
        }
      })
    },
    // 一级项目事件
    oneProjectChange(selections) {
      this.form.two = ''
      this.form.three = ''
      const data = this.allTwoProjects.filter((item) => {
        return item.departmentId === selections
      })
      this.twoProjects = data
    },
    twoProjectChange(selections) {
      const data = this.allThreeProjects.filter((item) => {
        return item.projectTypeId === selections
      })
      this.threeProjects = data
    },
    // // 二级项目
    // DepartmentOne() {
    //   this.$api.dept.TypeList('get').then((res) => {
    //     if (res) {
    //       this.allTwoProjects = res.rows
    //     }
    //   })
    // },
    // // 三级
    // CategoryThree() {
    //   this.$api.dept.CategoryList('get').then((res) => {
    //     if (res) {
    //       this.Treeproject = res.rows
    //     }
    //   })
    // },
    // 搜索
    getData: debounce(function(isSearch,ispage) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.loadingData = true
      if(ispage=='1'){
        this.$set(this.form,'startTime',this.form.triagePersonTime ? this.form.triagePersonTime[0] : null)
        this.$set(this.form,'endTime',this.form.triagePersonTime ? this.form.triagePersonTime[1] : null)
        // this.$delete(this.form,'triagePersonTime')
        let { triagePersonTime,...params } = this.form;
        const query={
          timeType: 'treat',
          deptId: this.deptId,
          ...params,
          ...this.pagination,
          typeThreeId: this.form.typeThree ? this.form.typeThree[2] : null,
          channelId: this.form.channel ? this.form.channel[1] : null,
          // startTime: this.form.triagePersonTime ? this.form.triagePersonTime[0] : null,
          // endTime: this.form.triagePersonTime ? this.form.triagePersonTime[1] : null,
        }
        this.$api.product.getDoctorPerformance(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.doctorPerformanceStatistics = res.data
        }
      }).finally(() => {
        this.loadingData = false
      })
      }else{
        this.$set(this.form,'startTime',this.form.triagePersonTime ? this.form.triagePersonTime[0] : null)
        this.$set(this.form,'endTime',this.form.triagePersonTime ? this.form.triagePersonTime[1] : null)
        // this.$delete(this.form,'triagePersonTime')

        let { triagePersonTime,...params } = this.form;
        const query={
          timeType: 'treat',
          deptId: this.deptId,
          ...params,
          ...this.pagination,
          typeThreeId: this.form.typeThree ? this.form.typeThree[2] : null,
          channelId: this.form.channel ? this.form.channel[1] : null,
          // startTime: this.form.triagePersonTime ? this.form.triagePersonTime[0] : null,
          // endTime: this.form.triagePersonTime ? this.form.triagePersonTime[1] : null,
        }
        this.$api.product.getDoctorPerformance(query).then(res => {
        if (res) {
          if (ispage == '2') {
          if (res.rows.length == 0) {
            this.$message.warning('无数据无法导出数据');
          } else {
            let arrExports = [];
            res.rows.forEach(value => {
              let exportlist = {
                '姓名': value.customerName,
                '电话': value.customPhone,
                // '员工推荐人': value.riName,
                // "开单人": value.duName,
                // "开单推荐人": value.srName,
                // "分诊类型": value.triageType,
                // "医生": value.doctorName,
                // "科室": value.departmentName,
                // "收费单号": value.orderNumber,
                // "收费单类型": value.billType,
                // "退款原因": value.reasonForRefund,
                // "客户姓名": value.customName,
                // "会员等级": value.membershipEvel,
                // "电话": value.customPhone,
                "客户卡号": value.customCardNumber,
                "收费单":value.orderNumber,
                "客户状态": value.customerStatus,
                "科室": value.departmentName,
                "一级项目":value.departmentName,
                 "二级项目":value.projectTypeName,
                 "三级项目":value.categoryName,

                "项目": value.projectName,
                "治疗次数": value.thisScribingNum,
                "产品次数": value.priceNum,
                "产品总次数": value.quantitySum,
                "医生": value.doctorName,
                "医助": value.dassName,
                "巡回护士": value.cnName,
                "业绩类型": value.operationTypeStatus,
                "执行业绩": value.performance,
                "实际执行医生": value.aueName,
                "美学顾问":value.acName,
                "开单咨询": value.acName,
                "服务助理": value.saName,
                "收费单类型": value.billType,
                "治疗时间": value.treatStartTime,
                "麻醉方式": value.anesthesiaMethod,
                "麻醉师": value.alName,
                "生成业绩时间": value.genAmentTime,
                "结账时间": value.checkoutTime,
                "媒介": value.channelName,
                "建档类型": value.typeThreeName,
                "备注": value.remark,
                "临客建档时间": value.createTime,
                // "媒介": value.createTime,


              }
              arrExports.push(exportlist)
            })
            const data = XLSX.utils.json_to_sheet(arrExports)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
            XLSX.writeFile(wb, '医生业绩查询.xlsx')

          }
          return
        }else {
              this.tableData = res.rows
              this.pagination.total = res.total
              this.doctorPerformanceStatistics = res.data
          }
          // this.tableData = res.rows
          // this.pagination.total = res.total
          // this.doctorPerformanceStatistics = res.data
        }
      }).finally(() => {
        this.loadingData = false
      })
      }

    }),
    /** 导出按钮操作 */
    async handleExport() {
      const data = {
        timeType: 'treat',
        ...this.form,
        typeThreeId: this.form.typeThree ? this.form.typeThree[2] : null,
        channelId: this.form.channel ? this.form.channel[1] : null,
        startTime: this.form.triagePersonTime ? this.form.triagePersonTime[0] : null,
        endTime: this.form.triagePersonTime ? this.form.triagePersonTime[1] : null
      }
      await this.$api.product.exportDoctorPerformance(data)
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    /**
     * @author 李尚
     * @date 2022/10/13
     * @Description: 一二三项目
     */
    // 一级
    getDepartmentOne() {
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }).then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.oneProjects = res.rows
          // 科室id也是一级项目
          this.TriageDepartment = res.rows
        }
      })
    },
    // 二级
    getDepartmentTwo() {
      this.$api.dept.TypeList().then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.projectTypeName
            item.value = item.projectTypeId
          })
          this.allTwoProjects = res.rows
        }
      })
    },
    // 三级
    getDepartmentThree() {
      this.$api.dept.CategoryList().then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
          this.allThreeProjects = res.rows
        }
      })
    },
    getUserList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          // 去重
          const arr1 = this.unique(res.data)
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
              this.anesthesiologistList.push(item)
              this.anesthesiologistList = this.unique(this.anesthesiologistList)

            // 医生
            if (item.postCode === 'doctor') {
              this.doctorList.push(item)
            }
            // 医助
            if (item.postCode === 'yizhu') {
              this.doctorAssistantList.push(item)
            }
            // 麻醉师 anesthesiologist
            if (item.postCode === 'anesthesiologist') {

            }
            // 护士
            if (item.postCode === 'zerennurse') {
              this.zerenNurseList.push(item)
            }
            // 巡回护士
            if (item.postCode === 'xhhushi') {
              this.xunhuiNurseList.push(item)
            }
            // 美学顾问
            if (item.postCode === 'xczxs') {
              this.aestheticConsultantList.push(item)
            }
            // 服务助理
            if (item.postCode === 'zerennurse') {
              this.serviceAssistantList.push(item)
            }
          })
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 表格单选
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    rowClassName({ row }) {
      if (row.state === '1' || row.state === '2') {
        return 'success-row'
      }
    },
    reFlashPage() {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-date-editor{
  padding-left: 5px !important;
}
.container {
  width: 100%;
  height: 100%;
  //overflow: auto;
  display: flex;
  justify-content: space-between;
}

.container .left {
  padding: 10px;
  width: 226px;
  background-color: #f8f8f8;
  color: #999999;
  border-right: 1px solid #eee;
}

.container .right {
  width: calc(100% - 226px);
  height: 100%;
}

.header {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep .el-form-item__label {
  font-size: 12px;
  padding-bottom: 0;
}

::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.el-select {
  width: 100%;
}

.el-cascader {
  width: 100%;
}

.container .left .left-content {
  padding: 10px 0 0 10px;
  box-sizing: border-box;
  width: 100%;
  overflow: scroll;
  height: calc(100% - 40px);
}

.container .left .left-footer {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #eee;
}

.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 100%;
  line-height: 30px;
  color: #999;

  .title {
    font-weight: bold;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;

    &:before {
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 15px;
      background-color: #1abc9c;
      left: 0px;
      border-radius: 10px;
      content: "";
    }
  }

  ul {
    list-style: none;

    li {
      display: inline-block;
      margin: 0 10px;

      span {
        color: #666666;
        font-weight: bold;
      }
    }
  }
}
</style>
