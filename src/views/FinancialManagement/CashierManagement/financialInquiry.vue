<template>
  <!-- 财务其他收支查询 -->
  <!-- :height='620' -->
  <div class="box">
    <div class="">
      <sg-table
        v-if="true"
        
        size="mini"
        selection
        border
        index="序号"
        :columns="columns"
        :header-style="{backgroundColor:'#f5eae4'}"
        :pagination="pagination"
        :table-data="tableData"
        :search-bar-style="{height:'150px'}"
        :cell-class-name="cellClassName"
        :pagination-style="{backgroundColor:'#f5eae4'}"
        @current-change="change"
        @size-change="sizeChange"
      >
        <div slot="searchBar">
          <el-form ref="form" size="mini" style="padding-top: 4px" label-width="100px">
            <el-row>
              <el-col :span="4">
                <el-form-item label="客户姓名:">
                  <el-input v-model="form.customerName" clearable />
                </el-form-item>
                <el-form-item label="收支人:">
                  <el-select placeholder="请选择..." clearable filterable :filter-method="may">
                    <el-option
                      v-for="item in sysUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="收支时间:">
<!--                  <el-date-picker-->
<!--                    v-model="form.receptionTime"-->
<!--                    clearable-->
<!--                    style="width:100%"-->
<!--                    type="daterange"-->
<!--                    format="yyyy-MM-dd"-->
<!--                    value-format="yyyy-MM-dd"-->
<!--                    range-separator="至"-->
<!--                    start-placeholder="开始日期"-->
<!--                    :default-time="['00:00:00', '23:59:59']"-->
<!--                    end-placeholder="结束日期"-->
<!--                  />-->
                  <div class="Pading">
                    <el-date-picker
                      v-model="form.receptionTime" class="inputWidth"
                      type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                      :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px" />
                  </div>


                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="电话:">
                  <el-input v-model="form.customPhone" clearable />
                </el-form-item>
                <el-form-item label="创建人:" clearable>
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="客户卡号:">
                  <el-input v-model="form.receptionNumber" clearable />
                </el-form-item>
                <el-form-item label="审批人:">
                  <el-select
                    v-model="form.gradeName"
                    placeholder="请选择..."
                    style="width: 100%;"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in dict.type.task_level"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="美学顾问:">
                  <el-select v-model="form.aestheticConsultant" filterable placeholder="请选择..." clearable :filter-method="mays">
                    <el-option
                      v-for="item in newsysUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="收支科目类型:">
                  <el-select v-model="form.serviceAssistant" filterable placeholder="请选择..." clearable>
                    <el-option label="暂无" value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="媒介类型:">
                  <el-select
                    v-model="form.channelTypeId"
                    placeholder="请选择..."
                    clearable
                    filterable
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
                <el-form-item label="收支状态:">
                  <el-select v-model="form.departmentId" filterable placeholder="请选择..." clearable>
                    <el-option label="暂无" value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="渠道来源:">
                  <el-cascader
                    v-model="form.filingType"
                    :options="filingType"
                    :props="props"
                    collapse-tags
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注:">
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="收费单号:">
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-row type="flex" justify="center">
                  <el-button size="mini" @click.stop="getData" @keydown.enter.native="getData">搜索</el-button>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="header" class="header">
          <div class="boxReception">
            <span style="margin-right:10px">收入金额：0.00   支出金额：0.00   收支金额：0.00   财务总收支金额(财务总收支+财务其他收支)：27,143.00 </span>
          </div>
          <div>
            <el-button size="mini" icon="el-icon-check">打印</el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-check">审批</el-button>
          </div>
        </div>
        <!--        <template #custom="data">-->
        <!--          <div v-if="data.props === 'customerStatus'">-->
        <!--            <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />-->
        <!--          </div>-->
        <!--          <div v-else-if="data.props === 'isSecondary'">-->
        <!--            <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />-->
        <!--          </div>-->
        <!--        </template>-->
      </sg-table>
    </div>

  </div>
</template>

<script>
import SgTable from '@/components/Table'
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
import PinyinMatch from "pinyin-match";
export default {
  dicts: ['new_guest', 'whether', 'whether_secondary', 'Triage_type', 'Reception_status', 'sys_user_sex', 'whether_deal', 'whether_Newguest', 'task_level'],
  name: 'ReceptionList',
  components: {
    SgTable
  },
  data() {
    return {
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
      form: {
        receptionTime: todayTime()
      },
      sysUserList: [], // 美学顾问
      props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
      filingType: [],
      options: [],
      showDataDialog: false,
      tableData: [],
      newsysUserList:[],
      newsysUser:[],
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone'
        },
        {
          lab: '客户卡号',
          val: 'NotYet'
        },
        {
          lab: '美学顾问',
          val: 'NotYet'
        },
        {
          lab: '媒介类型',
          val: 'NotYet'
        },
        {
          lab: '媒介来源',
          val: 'NotYet'
        },
        {
          lab: '渠道',
          val: 'NotYet'
        },
        {
          lab: '收支单号',
          val: 'NotYet'
        },
        {
          lab: '收费单号',
          val: 'NotYet'
        },
        {
          lab: '收支类型',
          val: 'NotYet'
        },
        {
          lab: '科目信息',
          val: 'NotYet'
        },
        {
          lab: '收支时间',
          val: 'NotYet',
          width: 100
        },
        {
          lab: '收支部门',
          val: 'NotYet'
        }
      ],
      TriageDepartment: [], // 分诊科室数据
      // 系统用户列表
      zongshu: [],
      // 分页组件数据
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
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
      this.deptFilingList()
    }
  },
  created() {
    this.options = this.dict.type.whether_deal
    this.getUserList(this.deptId)
    this.getChannelInfo() // 媒介
    this.deptFilingList() // 预约类型
    this.getData() // 数据列表
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    mays(val){
      if (val) {
        this.newsysUserList = this.newsysUser.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.newsysUserList = this.newsysUser
      }
    },
    may(val){
      if (val) {
        this.sysUserList = this.sysUser.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.sysUserList = this.sysUser
      }

  },
    cellClassName({ row, rowIndex }) {
      if (row.isDeal === '1') {
        return 'warning-row'
      } else if (row.isDeal === '2') {
        return 'success-row'
      }
      return ''
    },
    // 分页组件的方法
    change(e) {
      this.pagination.pageNum = e[1]
      this.getData()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    // 我的接待列表接口
    getData() {
      let filingIds = []
      let typeTwoIds = []
      let typeThreeIds = []
      if (this.form.filingType !== undefined) {
        this.form.filingType.forEach(item => {
          filingIds.push(item[0])
          typeTwoIds.push(item[1])
          typeThreeIds.push(item[2])
        })
        this.form.filingIds = filingIds.join(',')
        this.form.typeTwoIds = typeTwoIds.join(',')
        this.form.typeThreeIds = typeThreeIds.join(',')
        this.$delete(this.form, 'filingType')
      } else {
        filingIds = []
        typeTwoIds = []
        typeThreeIds = []
      }
      // this.showDataDialog = true
      // todo 搜索列表接口
    },
    // 获取渠道信息
    getChannelInfo() {
      this.$api.modules.channel.getChannelType({
        'deptId': this.deptId,
        'status': 0
      }).then(res => {
        if (res) {
          this.channelType = res.data
        }
      })
    },
    // 获取建档类型
    deptFilingList() {
      this.$api.modules.filing.getFilingTypeById({
        deptId: this.deptId
      }).then(res => {
        if (res.data) {
          this.filingType = res.data
        }
      })
    },
    // 选择媒介来源第一级
    channelTypeSelection(selection) {
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      // this.form.channelTypeName = data[0].typeName
      this.form.channelId = undefined
      this.form.channelIdBack = undefined
      // this.form.channelName = undefined
      this.channelTypeChildren = data[0].channelInfo
    },
    channelSelection(selection) {
      this.channelTypeChildren.filter(filter => {
        return filter.deptChannelId === selection
      })
    },
    getUserList(deptId) {
      // 人员添加公司Id  添加状态  添加岗位
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
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.newsysUserList.push(item)
              this.newsysUser = this.newsysUserList
              this.sysUserList.push(item);
              this.sysUser = this.sysUserList
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
//::v-deep .Pading
@import '../../../styles/globalfloat.css';

.box {
  height: 100%;
}
.boxReception {
  padding-left: 15px;
  font-size: 13px;
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep.el-form-item--mini .el-form-item__label {
  font-size: 12px !important;
}
.el-form-item__label {
  font-size: 12px !important;
}

::v-deep .el-table .warning-row {
  background: #ffffff;
}

::v-deep .el-table .success-row {
  background: #7ec5b7;
}
</style>
