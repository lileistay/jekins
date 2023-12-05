<template>
  <el-dialog
    :title="showTitle"
    :visible="dialogVisible"
    width="25%"
    height="0%"
    @close="btncolse"
  >
    <el-form
      size="mini"
      label-width="100px"
      label-position="left"
      style="padding:0 35px"
    >
      <el-form-item label="需求类型：">
        <el-select
          v-model="customerDemandInfo.demandTypeId"
          style="width:50%"
          @change="change"
          filterable
        >
          <el-option
            v-for="item in DemandData"
            :key="item.demandTypeId"
            :label="item.demandTypeName"
            :value="item.demandTypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="需求：">
        <el-select
          v-model="customerDemandInfo.demandId"
          style="width:50%"
          @change="change" filterable
        >
          <el-option
            v-for="item in list"
            :key="item.demandId"
            :label="item.demandName"
            :value="item.demandId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="需求时间：">
        <el-date-picker
          v-model="customerDemandInfo.demandTime"
          type="date"
          format="yyyy-MM-dd"
          style="width:50%"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="需求等级：">
        <el-select v-model="customerDemandInfo.demandLevel" filterable style="width:50%">
          <el-option
            v-for="item in dict.type.demand_level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="customerDemandInfo.state" filterable style="width:50%">
          <el-option
            v-for="item in dict.type.demand_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="解决时间：">
        <el-date-picker
          v-model="customerDemandInfo.solutionTime"
          type="date"
          format="yyyy-MM-dd"
          style="width:50%"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="是否刚需：">
        <el-select v-model="customerDemandInfo.isNeeded" filterable style="width:50%">
          <el-option
            v-for="item in dict.type.just_needed"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开发策略：">
        <el-checkbox
          v-model="customerDemandInfo.education"
          true-label="1"
          false-label="2"
        >教育</el-checkbox>
        <el-checkbox
          v-model="customerDemandInfo.isDiscount"
          true-label="1"
          false-label="2"
        >折扣</el-checkbox>
        <el-checkbox
          v-model="customerDemandInfo.expert"
          true-label="1"
          false-label="2"
        >专家</el-checkbox>
        <el-checkbox
          v-model="customerDemandInfo.experience"
          true-label="1"
          false-label="2"
        >体验</el-checkbox>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          v-model="customerDemandInfo.demandRemarks"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="foter">
      <el-button
        size="mini"
        @click="btncolse"
      >取 消</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="add"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  dicts: ['demand_level', 'demand_status', 'just_needed'],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      customerDemandInfo: {
        demandTypeId: undefined,
        education: '',
        isDiscount: '',
        expert: '',
        experience: '2',
        demandRemarks: ''
      },
      administration: [], // 客户需求
      DemandData: [], // 需求类型
      list: []// 客户需求数据
    }
  },

  computed: {
    // 动态显示标题
    showTitle() {
      return this.customerDemandInfo.customerDemandId ? '编辑需求' : '新增需求'
    }
  },
  watch: {
    customerDemandInfo: {
      handler(newval, oldval) {
        const data = this.administration.filter((item) => {
          return item.demandTypeId == newval.demandTypeId
        })
        this.list = data
      }
    }
  },
  created() {
    this.DemandManagement()// 获取需求类型
    this.DemandType()// 获取需求的数据
  },
  mounted() {
    this.change()
  },
  methods: {
    handleClose() {
    },
    // 监听事件
    change(selection) {
      const data = this.administration.filter((item) => {
        return item.demandTypeId == selection
      })
      this.list = data
    },
    // 获取客户需求
    DemandManagement() {
      // 添加状态
      this.$api.demand.DemandManagement({status: '0'}).then((res) => {
        if (res) {
          this.administration = res.rows
        }
      })
    },
    // 需求类型
    DemandType() {
      // 添加状态
      let data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.demand.DemandType(data).then((res) => {
        if (res) {
          this.DemandData = res.rows
        }
      })
    },
    // 获取个人需求的接口
    getInfoList(customerDemandId) {
      this.$api.demand.getInfoDemandRelationship(customerDemandId).then((res) => {
        if (res) {
          this.customerDemandInfo = res.data
        }
      })
    },
    // 点击确定
    add() {
      if (this.customerDemandInfo.customerDemandId) {
        // 编辑
        // this.change()
        this.$api.demand.putDemandRelationship(this.customerDemandInfo).then((res) => {
          if (res) {
            this.$message.success(res.msg)
            this.$emit('RefreshList')
          }
        })
      } else {
        // 新增
        this.$api.demand.addDemandRelationship({ ...this.customerDemandInfo, id: this.id }).then((res) => {
          if (res) {
            this.$message.success(res.msg)
            this.$emit('RefreshList')
          }
        })
      }
    },
    btncolse() {
      this.customerDemandInfo = {
        demandTypeId: undefined,
        education: '',
        isDiscount: '',
        expert: '',
        experience: '',
        demandRemarks: ''
      }
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.el-checkbox {
  margin-right: 10px !important;
}
::v-deep .el-dialog__header {
  background-color: #1abc9c;
  .el-dialog__title {
    color: #ffffff;
  }
  .el-dialog__close {
    border: 1px solid #909399;
    background-color: #909399;
    border-radius: 50%;
    color: #ffffff;
  }
}
.foter {
  display: flex;
  justify-content: center;
}
</style>
