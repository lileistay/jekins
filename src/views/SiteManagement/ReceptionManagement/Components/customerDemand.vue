<template>
  <!-- 客户需求 -->
  <div class="returnVisitDetial">
    <el-scrollbar class="el-scrollbar">
      <SgTable
        v-if="true"
        :table-data="tableData"
        :columns="columns"
        :pagination="pagination"
        index="序号"
        :row-class-name="rowClassName"
        size="mini"
        selection
        border
        :header-style="{backgroundColor:'#f8f8f8'}"
        :pagination-style="{backgroundColor:'#f8f8f8'}"
        @size-change=" sizeChange"
        @current-change="change"
      >
        <div slot="searchBar">
          <span> {{ form.customerName }}</span>
          &nbsp;
          <span class="titme">{{ form.customAge }}岁</span>
          &nbsp;
          <span class="titme">{{ form.customCardNumber }}</span>
          &nbsp;
          <span class="titme">经济能力：{{ economic(form.economicCapacity) }}: /</span>
          &nbsp;
          <span class="titme">会员等级：{{ form.gradeName }}/</span>
          &nbsp;
          <span class="titme">建档时间：{{ form.createTime }}/</span>
          &nbsp;
          <span class="titme">美学顾问：{{ form.rdName }}</span>
        </div>
        <div slot="header" class="header-float">
          <div />
          <div>
            <el-button size="mini" @click="openDemand">添加需求</el-button>
          </div>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'operation'">
            <el-button size="mini" :disabled="data.custom.state==='1'" @click="solve(data.custom)">{{ data.custom.state==1?'已解决':'未解决' }}</el-button>
            <el-button size="mini" @click="putdemand(data.custom.customerDemandId)">编辑</el-button>
          </div>
          <div v-else-if="data.props === 'state'">
            <show-dict-data :options="dict.type.demand_status" :value="data.custom.state" />
          </div>
          <div v-else-if="data.props === 'isNeeded'">
            <show-dict-data :options="dict.type.just_needed" :value="data.custom.isNeeded" />
          </div>
          <div v-else-if="data.props === 'education'">
            <show-dict-data :options="dict.type.just_needed" :value="data.custom.education" />
          </div>
          <div v-else-if="data.props === 'isDiscount'">
            <show-dict-data :options="dict.type.just_needed" :value="data.custom.isDiscount" />
          </div>
          <div v-else-if="data.props === 'expert'">
            <show-dict-data :options="dict.type.just_needed" :value="data.custom.expert" />
          </div>
          <div v-else-if="data.props === 'experience'">
            <show-dict-data :options="dict.type.just_needed" :value="data.custom.experience" />
          </div>
        </template>
      </SgTable>

    </el-scrollbar>
    <Adddemand :id="id" ref="put" :dialog-visible.sync="dialogVisible" @RefreshList="RefreshList" />
  </div>
</template>

<script>
import { todayTime } from '@/utils/time'
import SgTable from '@/components/Table'
import Adddemand from '@/views/SiteManagement/ReceptionManagement/Components/addDemand'// 弹层
export default {
  dicts: ['economic_capacity', 'demand_status', 'just_needed'],
  components: {
    SgTable,
    Adddemand
  },
  data() {
    return {
      id: this.$route.query.id,
      tableData: [],
      form: {
        customerName: '',
        customAge: 0, // 年龄
        customCardNumber: 0, // 卡号
        economicCapacity: '', // 经济能力
        gradeName: '', //  会员等级
        rdName: '' // 美学顾问
      },
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      dialogVisible: false, // 需求的弹层
      // tableData: [],
      columns: [
        {
          lab: '操作',
          val: 'operation',
          custom: 'operation',
          width: 200
        },
        {
          lab: '需求类型',
          val: 'demandTypeName'
        },
        {
          lab: '需求名称',
          val: 'demandName'

        },
        {
          lab: '需求时间',
          val: 'demandTime',
          width: 110
        },
        {
          lab: '状态',
          val: 'state',
          custom: 'state'
        },
        {
          lab: '解决时间',
          val: 'solutionTime',
          width: 140
        },
        {
          lab: '是否刚需',
          val: 'isNeeded',
          width: 140,
          custom: 'isNeeded'
        },
        {
          lab: '教育',
          val: 'education',
          custom: 'education'
        },
        {
          lab: '折扣',
          val: 'isDiscount',
          custom: 'isDiscount'

        },
        {
          lab: '专家',
          val: 'expert',
          custom: 'expert'
        },
        {
          lab: '体验',
          val: 'experience',
          custom: 'experience'
        },
        {
          lab: '备注',
          val: 'demandRemarks',
          width: 200
          // showOverflowTooltip: true
        }
      ]
    }
  },
  created() {
    // this.id = this.$route.query.id
    this.ReceptionList(this.id)
    this.customerlabel(this.id)
  },
  methods: {

    // 弹层点击确定后
    RefreshList() {
      this.dialogVisible = false // 关闭弹窗
      this.ReceptionList(this.id)
    },

    // 获取客户需求关系表
    ReceptionList(id) {
      this.$api.demand.DemandRelationship({ id: id, ...this.pagination }).then((res) => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.pagination.pageNum = 1
        }
      })
    },
    // 打开弹层添加需求的接口
    openDemand() {
      this.dialogVisible = true // 打开弹层
    },
    // 编辑
    async putdemand(id) {
      const customerDemandId = id
      this.dialogVisible = true // 打开弹层
      await this.$refs.put.getInfoList(customerDemandId)
    },
    // 分页
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.ReceptionList() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.ReceptionList()
    },
    // 头部数据
    customerlabel(id) {
      //  把所有的值都打印出来了
      // const id = this.$route.query.id
      this.$api.user.getinfo(id).then(res => {
        if (res) {
          // this.from = res.data
          this.form = res.data
        }
      })
    },
    // 表格颜色
    rowClassName({ row }) {
      if (row.state === '1') {
        return 'warning-row'
      }
    },
    // 点击解决或未解决按钮
    solve(custom) {
      const d = todayTime(new Date()); // 获取系统当前时间
      this.$confirm('是否解决该需求, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.demand.putDemandRelationship({
          customerDemandId: custom.customerDemandId,
          state: '1',
          solutionTime: d[0]
        }).then((res) => {
          if (res) {
            this.$message.success(res.msg)
            this.ReceptionList(this.id)
          }
        })
      })
    },
    /**
      * @author 李尚
      * @date 14/5/2022
      * @Description: 头部字典对应数据
    */
    economic(str) {
      const obj = this.dict.type.economic_capacity.find(items => items.value === str)
      return obj ? obj.label : '未知'
    }
  }
}
</script>

<style scoped lang="scss">

.returnVisitDetial {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .el-scrollbar {
    height: 100%;
    & .customer-info-bar {
      height: 45px;
      line-height: 45px;
      align-content: center;
      background-color: beige;
      span {
        margin: 0 6px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
.titme{
  font-size: 12px;
}
.searchBar {
  & span {
    font-size: 14px;
  }
}
::v-deep .el-table .warning-row {
  background: rgba(198, 249, 195,0.8);
}
</style>
