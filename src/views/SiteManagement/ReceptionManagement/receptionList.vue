<template>
  <!-- 接待列表 -->
  <!-- :height='620' -->
  <el-scrollbar>
    <div>
      <sg-table
        ref="table"

        :sg-ref="'multipleTable'"
        size="mini"
        selection
        border
        index="序号"
        :columns="columns"
        :header-style="{backgroundColor:'#f5eae4'}"
        :pagination="pagination"
        :table-data="tableData"
        :row-class-name="rowClassName"
        :search-bar-style="{height:'150px'}"
        :cell-class-name="cellClassName"
        :pagination-style="{backgroundColor:'#f5eae4'}"
        @selection-change="handleSelectionChange"
        @current-change="change"
        @size-change="sizeChange"
        @row-click="rowClick"
      >
        <div slot="searchBar" class="header-float">
          <div>
            <el-form ref="form" size="mini" style="padding-top: 4px" label-width="90px">
              <el-row>
                <el-col :span="3">
                  <el-form-item label="客户姓名:">
                    <el-input   v-model="form.customerName" clearable />
                  </el-form-item>
                  <el-form-item label="是否新客二次:">
                    <el-select v-model="form.isSecondary" filterable placeholder="请选择..." clearable>
                      <el-option
                        v-for="item in dict.type.whether_secondary"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="导医:">
                    <el-select v-model="form.giveMedicalAdvice" filterable placeholder="请选择..." clearable >
                      <el-option
                        v-for="item in daoyi"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="电话:">
                    <el-input v-model="form.customPhone" clearable />
                  </el-form-item>
                  <el-form-item label="会员等级:">
                    <el-select
                      v-model="form.gradeName"
                      placeholder="请选择..."
                      style="width: 100%;"
                      clearable filterable
                    >
                      <el-option
                        v-for="item in dict.type.task_level"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="新老客户:">
                    <el-select
                      v-model="form.customerStatus"
                      placeholder="请选择..."
                      style="width: 100%"
                      clearable filterable
                    >
                      <el-option
                        v-for="item in dict.type.whether_Newguest"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="接诊编号:">
                    <el-input v-model="form.receptionNumber" clearable />
                  </el-form-item>
                  <el-form-item label="接诊时间:">
<!--                    <el-date-picker-->
<!--                      v-model="form.receptionTime"-->
<!--                      style="width:100%"-->
<!--                      clearable-->
<!--                      type="datetimerangeopentions"-->
<!--                      format="yyyy-MM-dd"-->
<!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                      start-placeholder="开始日期"-->
<!--                      end-placeholder="结束日期"-->
<!--                      :default-time="['00:00:00', '23:59:59']"-->
<!--                    />-->
                    <div class="Padding">
                      <el-date-picker
                        v-model="form.receptionTime" class="inputWidth"
                        type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 190px" />
                    </div>

                  </el-form-item>
                  <el-form-item label="客户卡号:">
                    <el-input v-model="form.customCardNumber" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="美学顾问:">
                    <el-select v-model="form.aestheticConsultant" filterable  Adjuvanttherapy placeholder="请选择..." clearable :filter-method="may">
                      <el-option
                        v-for="item in esthetics"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="服务助理:">
                    <el-select v-model="form.serviceAssistant" filterable Adjuvanttherapy placeholder="请选择..." clearable >
                      <el-option
                        v-for="item in huli"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否成交:">
                    <el-select v-model="form.isDeal" filterable placeholder="请选择..." clearable >
                      <el-option
                        v-for="item in dict.type.whether_deal"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="医生:">
                    <el-select v-model="form.doctorId" filterable Adjuvanttherapy placeholder="请选择..." clearable >
                      <el-option
                        v-for="item in doctor"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="科室:">
                    <el-select v-model="form.departmentId" filterable Adjuvanttherapy  placeholder="请选择..." clearable >
                      <el-option
                        v-for="item in TriageDepartment"
                        :key="item.departmentId"
                        :label="item.departmentName"
                        :value="item.departmentId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="客户代表:">
                    <el-select v-model="form.customerRepresentative" filterable Adjuvanttherapy placeholder="请选择..." clearable >
                      <el-option
                        v-for="item in esthetics"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="预约类型:">
                    <el-cascader
                      v-model="form.filingType"
                      :options="filingType"
                      :props="props"
                      collapse-tags
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="媒介类型:">
                    <el-select
                      v-model="form.channelTypeId"
                      placeholder="请选择..."
                      clearable filterable
                      @change="channelTypeSelection"
                    >
                      <el-option
                        v-for="(type,typeIndex) in channelType"
                        :key="typeIndex +'type'"
                        :label="type.typeName"
                        :value="type.typeId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="媒介来源:">
                    <el-select
                      v-model="form.channelId"
                      placeholder="请选择..."
                      clearable filterable
                      @change="channelSelection"
                    >
                      <el-option
                        v-for="(type,typeChildIndex) in channelTypeChildren"
                        :key="typeChildIndex+'typeChild'"
                        :label="type.typeName"
                        :value="type.channelId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--              <el-col :span="6">-->
                <!--                <el-row type="flex" justify="center">-->
                <!--                  <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="MyReception">搜索</el-button>-->
                <!--                </el-row>-->
                <!--              </el-col>-->
                <div style="right:-10px; position: absolute; bottom: 18px;margin-top: 10px">
                  <el-button size="mini" icon="el-icon-search" type="primary" plain  @keydown.enter.native="MyReception(true)" @click.stop="MyReception(true)">搜索
                  </el-button>
                </div>
              </el-row>
            </el-form>
          </div>
          <div></div>
        </div>
        <div slot="header" class="header-float">
          <div class="boxReception">
            <span style="margin-right:10px">
              接诊客户列表 总人数：{{ zongshu.countall }}
              新客首次：{{ zongshu.newGuestFirst }}
              新客二次：{{ zongshu.oldGuestSecondary }}
              新客：{{ zongshu.newGuset }}
              老客：{{ zongshu.oldGuest }}</span>
            <!-- <span>
              <el-radio style="color:red">备选项</el-radio>
              <el-radio label="2">备选项</el-radio>
            </span> -->
            <span style="margin-right:10px"><i class="color-block-success" />成交</span>
            <span><i class="color-block-white" /> 未成交</span>
          </div>
          <div>
            <el-button v-has-permi="['confinement:receptionInformationList:edit']" type="success" icon="el-icon-edit" size="mini" @click="modify">修改接诊信息</el-button>
            <el-button v-has-permi="['confinement:receptionInformationList:export']" type="success" size="mini" icon="el-icon-search" plain :loading="submitLoading" @click.stop="exportExcel">导出</el-button>
          </div>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'customerStatus'">
            <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
          </div>
          <div v-else-if="data.props === 'isSecondary'">
            <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
          </div>
          <div v-else-if="data.props==='customerName'">
            <a style="color: #0066cc" @click="TurnJump(data.custom.id, data.custom,data.custom.numberId)">
              {{ data.custom.customerName }}
            </a>
          </div>
          <div v-else-if="data.props === 'customSex'">
            <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
          </div>
          <div v-else-if="data.props === 'isDeal'">
            <show-dict-data :options="dict.type.whether_deal" :value="data.custom.isDeal" />
          </div>
          <div v-else-if="data.props === 'receptionStatus'">
            <show-dict-data :options="dict.type.Reception_status" :value="data.custom.receptionStatus" />
          </div>
          <div v-else-if="data.props === 'triageType'">
            <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
          </div>
        </template>
      </sg-table>
      <sg-table
        id="out-table"
        size="mini"
        index="序号"
        style="display: none"
        :table-data="tableDatas"
        :columns="columns"
        :row-class-name="rowClassName"
      >
        <template #custom="data">
          <div v-if="data.props === 'customerStatus'">
            <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
          </div>
          <div v-else-if="data.props === 'isSecondary'">
            <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
          </div>
          <div v-else-if="data.props==='customerName'">
            <a style="color: #0066cc" @click="TurnJump(data.custom.id, data.custom,data.custom.numberId)">
              {{ data.custom.customerName }}
            </a>
          </div>
          <div v-else-if="data.props === 'customSex'">
            <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
          </div>
          <div v-else-if="data.props === 'isDeal'">
            <show-dict-data :options="dict.type.whether_deal" :value="data.custom.isDeal" />
          </div>
          <div v-else-if="data.props === 'receptionStatus'">
            <show-dict-data :options="dict.type.Reception_status" :value="data.custom.receptionStatus" />
          </div>
          <div v-else-if="data.props === 'triageType'">
            <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
          </div>
        </template>
      </sg-table>
    </div>
  </el-scrollbar>
</template>

<script>

// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import PinyinMatch from "pinyin-match";
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from '@/utils/time'
export default {
  dicts: ['new_guest', 'whether', 'whether_secondary', 'Triage_type', 'Reception_status', 'sys_user_sex', 'whether_deal', 'whether_Newguest', 'task_level'],
  name: 'ReceptionList',
  components: {
    SgTable
  },
  data() {
    return {
      tableDatas: [], // 导出
      submitLoading: false,
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', beforeDayTime(1))
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', todayTime())
            }
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', beforeWeek(1))
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', thisWeek())
            }
          },
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', lastMonth())
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', monthData())
            }
          },
          {
            text: '上季度',
            onClick(picker) {
              picker.$emit('pick', lastQuarter())
            }
          },
          {
            text: '本季度',
            onClick(picker) {
              picker.$emit('pick', thisQuarter())
            }
          },
          {
            text: '上年',
            onClick(picker) {
              picker.$emit('pick', lastYear())
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', thisYear())
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
            }
          }
        ]
      },
      selectionData: [],
      form: {
        receptionTime: todayTime(),
        customerName: '', // 客户姓名
        // customPhone: '', // 电话
        isSecondary: '', // 是否新客
        giveMedicalAdvice: '', // 导医
        gradeName: '', // 会员等级
        customerStatus: '', // 新老客户
        receptionNumber: '', // 接诊编号
        customCardNumber: '', // 客户卡号
        aestheticConsultant: '', // 美学顾问
        serviceAssistant: '', // 服务助理
        isDeal: '', // 是否成交
        doctorId: '', // 医生
        departmentId: '', // 科室
        customerRepresentative: '', // 客户代表
        filingType: '', // 预约类型
        channelTypeId: '', // 媒介类型
        channelId: ''
      },
      props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
      filingType: [],
      options: [],
      showDataDialog: false,
      tableData: [],
      columns: [
        {
          lab: '会员等级',
          val: 'gradeName'
        },
        {
          lab: '（建档人）开发人',
          val: 'kfName',
          width: 120
        },
        {
          lab: '接待时间',
          val: 'receptionTime',
          width: 200
        },
        {
          lab: '姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '新老客户',
          val: 'customerStatus',
          custom: 'customerStatus'
        },
        {
          lab: '是否二次',
          val: 'isSecondary',
          custom: 'isSecondary'
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 100
        },
        {
          lab: '接诊状态',
          val: 'receptionStatus',
          custom: 'receptionStatus'
        },
        {
          lab: '分诊类型',
          val: 'triageType',
          custom: 'triageType',
          width: 120
        },
        {
          lab: '是否成交',
          val: 'isDeal',
          custom: 'isDeal'
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 130
        },
        {
          lab: '客户代表',
          val: 'crName',
          width: 130
        },
        {
          lab: '服务助理',
          val: 'saName'
        },
        {
          lab: '医生',
          val: 'diName',
          width: 130

        },
        {
          lab: '客户意向',
          val: 'intentionDescription',
          width: 200,
          showOverflowTooltip: true

        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 160
        },
        {
          lab: '导医',
          val: 'gmaName',
          width: 100

        },
        {
          lab: '预约类型',
          val: 'typeThreeName',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '媒介类型',
          val: 'channelTypeName',
          width: 100

        },
        {
          lab: '媒介来源',
          val: 'channelName',
          width: 100

        },
        {
          lab: '接诊备注',
          val: 'remark',
          width: 140,
          showOverflowTooltip: true

        },
        {
          lab: '接诊编号',
          val: 'receptionNumber',
          width: 160
          // custom: 'degreeIntention',
        }
      ],
      TriageDepartment: [], // 分诊科室数据
      // 系统用户列表
      sysUserList: [],
      esthetics: [],
      newestheics:[],
      doctor: [],
      daoyi: [],
      huli: [],
      zongshu: {},
      // 分页组件数据
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      // 来源渠道
      channelType: [],
      channelTypeChildren: []
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
      this.getChannelInfo()
      this.Department()
      this.deptFilingList()
      this.MyReception()
      this.getUserList(val)
    }
  },
  created() {
    this.options = this.dict.type.whether_deal
    this.Department()
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getChannelInfo() // 媒介
    this.deptFilingList() // 预约类型
    this.MyReception() // 数据列表
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.MyReception()
      }
    }
  },
  methods: {
    rowClassName({row,rowIndex}){
      if (row.isDeal === '1') {
        return 'warning-row'
      } else if (row.isDeal === '2') {
        return 'success-row'
      }

    },
    may(val){
      if (val) {
        //取值
        let newlist = this.newestheics.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
        //赋值
      this.esthetics=newlist
      }else{
         this.esthetics=this.newestheics
      }
    },
    exportExcel() {
      this.submitLoading = true
      let filingIds = []
      let typeTwoIds = []
      let typeThreeIds = []
      if (this.form.filingType !== undefined && this.form.filingType.length !== 0) {
        this.form.filingType.forEach(item => {
          filingIds.push(item[0])
          typeTwoIds.push(item[1])
          typeThreeIds.push(item[2])
        })
        this.form.filingIds = filingIds.join(',')
        this.form.typeTwoIds = typeTwoIds.join(',')
        this.form.typeThreeIds = typeThreeIds.join(',')
        // this.$delete(this.form, 'filingType')
      } else {
        filingIds = []
        typeTwoIds = []
        typeThreeIds = []
        this.form.filingIds = ''
        this.form.typeTwoIds = ''
        this.form.typeThreeIds = ''
      }
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$set(this.form, 'deptId', this.deptId)
      this.$api.dept.MyReception({
        ...this.form,
        receptionTime: this.form.receptionTime ? this.form.receptionTime[0] : null,
        endreceptionTime: this.form.receptionTime ? this.form.receptionTime[1] : null
      }, 'get').then((res) => {
        if (res) {
          this.tableDatas = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '接待列表')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    cellClassName({ row, rowIndex }) {
      // if (row.isDeal === '1') {
      //   return 'warning-row'
      // } else if (row.isDeal === '2') {
      //   return 'success-row'
      // }
      // return ''
    },
    // 获取科室的数据
    Department() {
      const data = {
        deptId: this.deptId,
        status: '0',
        isDepartment: '1'
      }
      this.$api.dept.DepartmentList(data, 'get').then((res) => {
        if (res) {
          this.TriageDepartment = res.rows
        }
      })
    },
    // 分页组件的方法
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.MyReception()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.MyReception()
    },
    /**
      * @author 李尚
      * @date 20/5/2022
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
     * @author 李尚
     * @date 2022/6/2
     * @Description: 点击列选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 修改结诊信息
    modify() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      } else if (this.selectionData.length > 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'Modifycustomer', query: { id: this.selectionData[0].id, list: JSON.stringify(this.selectionData[0]) }})
    },
    // 我的接待列表接口
    MyReception: debounce(async function(isSearch) {
      let filingIds = []
      let typeTwoIds = []
      let typeThreeIds = []
      if (this.form.filingType !== undefined && this.form.filingType.length !== 0) {
        this.form.filingType.forEach(item => {
          filingIds.push(item[0])
          typeTwoIds.push(item[1])
          typeThreeIds.push(item[2])
        })
        this.form.filingIds = filingIds.join(',')
        this.form.typeTwoIds = typeTwoIds.join(',')
        this.form.typeThreeIds = typeThreeIds.join(',')
        // this.$delete(this.form, 'filingType')
      } else {
        filingIds = []
        typeTwoIds = []
        typeThreeIds = []
        this.form.filingIds = ''
        this.form.typeTwoIds = ''
        this.form.typeThreeIds = ''
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
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(this.form, 'deptId', this.deptId)
      this.showDataDialog = true
      await this.$api.dept.MyReception({
        ...this.form, ...this.pagination,
        receptionTime: this.form.receptionTime ? this.form.receptionTime[0] : null,
        endreceptionTime: this.form.receptionTime ? this.form.receptionTime[1] : null
      }, 'get').then((res) => {
        if (res) {
          this.tableData = res.rows
          this.zongshu = res.data
          this.pagination.pageNum = 1
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 获取用户列表
    async getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
      }
      await this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          // ------------
          // 助理
          res.data.forEach(item => {
            if (item.postCode === 'zerennurse') {
              this.huli.push(item)
            }
          })
          // ---------岗位------
           // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          })
          // ---------------------
          // 美学顾问// 客户代表
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
              this.newestheics.push(item)
            }
          })
          // ---------
          res.data.forEach(item => {
            if (item.postCode === 'front-reception') {
              this.daoyi.push(item)
            }
          })
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 获取渠道信息
    getChannelInfo() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.channel.getChannelType(data).then(res => {
        if (res) {
          this.channelType = res.data
        }
      })
    },
    // 点击顾客姓名转跳详情页
    TurnJump(id, val) {
      // if (val === '1') {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
      // } else {
      //   this.$router.push({ path: '/NotInHospital', query: { id }})
      // }
      // this.$router.push({name: 'NotInHospital',query:{id}})
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
          this.filingType = res.data
        }
      })
    },
    // 选择媒介来源第一级
    channelTypeSelection(selection) {
      if(selection==""){
        this.channelTypeChildren=[];
        this.form.channelId = ''
        return
      }
      this.form.channelId = ''
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      // this.form.channelTypeName = data[0].typeName
      // this.form.channelId = ''
      // this.form.channelIdBack = undefined
      // this.form.channelName = undefined
      this.channelTypeChildren = data[0].channelInfo
    },
    channelSelection(selection) {
      this.channelTypeChildren.filter(filter => {
        return filter.channelId === selection
      })
      // this.form.channelId = data[0].typeId
      // this.form.channelId = data[0].deptChannelId
      // this.form.channelName = data[0].typeName
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .Padding .el-date-editor {
  padding-left: 20px !important ;
}
@import '../../../styles/globalfloat.css';

.box {
  height: 100%;
}

.boxReception {
  font-size: 14px;
  padding-top: 5px;
}


.color-block-white {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid #fff;
}
::v-deep .el-icon-time {
  display: none;
}
::v-deep .el-form-item--mini .el-form-item__label {
  font-size: 12px !important;
}

.el-form-item__label {
  font-size: 12px !important;
}
//日期边框
::v-deep .el-date-editor .el-range__close-icon {
  width: 10px;
}
::v-deep .el-range-editor.el-input__inner {
  padding: 3px 2px;
}
//列表背景颜色
::v-deep .el-table .warning-row {
  background: #ffffff;
}
::v-deep .el-table .success-row {
  background: #7ec5b7;
}
</style>
