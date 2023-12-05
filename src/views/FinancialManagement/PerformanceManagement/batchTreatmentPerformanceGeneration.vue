<template>
  <div>
  <div ref="container" class="container" v-loading="tableLoading">
    <div class="mainArea">
      <div ref="title" class="pageTitle">
        <i class="el-icon-s-data" style="color: #409eff" /> 待执行业绩信息
      </div>
      <div class="tableWrap">
        <el-table
          :data="tableData"
          border
          :size="sizeType"
          style="width: 100%"

          fit
        >
          <el-table-column type="index" label="序号" align="center" width="50" />
          <template v-for="(tableItem, tableIndex) in columns">
            <el-table-column
              v-if="tableItem.val !== 'deductionAmount'"
              :key="tableIndex"
              align="center"
              :prop="tableItem.val"
              :label="tableItem.lab"
              :width="tableItem.width"
              :show-overflow-tooltip="tableItem.showOverflowTooltip"
            />
            <el-table-column
              v-else
              :key="tableIndex"
              align="center"
              :prop="tableItem.val"
              :label="tableItem.lab"
              :width="tableItem.width"
              :show-overflow-tooltip="tableItem.showOverflowTooltip"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.deductionAmount"
                  :size="sizeType"
                  @change="() =>handleInput(scope.row)"
                />
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
    <div ref="footer" class="batchFooter">
      <div class="btnArea">
        <el-button :size="sizeType" type="primary" @click="handleSave">保存</el-button>
        <el-button :size="sizeType" @click="handleClose">关闭</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import {textChangeArr} from "./constants";
import { math } from '@/utils/math'

export default {
  name: 'BatchTreatmentPerformanceGeneration',
  data() {
    return {
      tableData: [], // table的数据
      columns: [
        {
          lab: '姓名',
          val: 'customerName',
          showOverflowTooltip: true
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '收费单号',
          val: 'orderNumber',
          width: 165
        },
        {
          lab: '项目',
          val: 'projectName',
          showOverflowTooltip: true
        },
        {
          lab: '产品总次数',
          val: 'quantitySum',
          showOverflowTooltip: true
        },
          {
              lab: '产品数量',
              val: 'quantity',

          },
        {
          lab: '已执行次数',
          val: 'executedTimes',
          showOverflowTooltip: true
        },
        {
          lab: '剩余待执行业绩',
          val: 'remainingPerformance',
          showOverflowTooltip: true
        },
        {
          lab: '医生',
          val: 'doctorName',
          showOverflowTooltip: true
        },
        {
          lab: '医助',
          val: 'dassName',
          showOverflowTooltip: true
        },
        {
          lab: '护士',
          val: 'cnName',
          showOverflowTooltip: true
        },
        {
          lab: '实际治疗医生',
          val: 'aueName',
          showOverflowTooltip: true
        },
        {
          lab: '当前治疗次数',
          val: 'thisScribingNum', //, 当前治疗次数
          showOverflowTooltip: true
        },
        {
          lab: '本次执行金额',
          val: 'deductionAmount',
          showOverflowTooltip: true,
          edit: true
        }
      ], // table的配置
      tableHeight: 0, // table的高度
      sizeType: 'mini', // 尺寸的定义
      editData: [], // 修改的本次执行金额的数据
      tableLoading: false
    }
  },
    created() {
        if (this.$route.query.xflag ==2){
            this.tableLoading = true
            this.$api.treatmentMoney.queryTreatmentMoneyList({
                pageSize: 500,
                pageNum: 1,
                isExecute:0,
                ...this.$route.query.num
            }).then((res) => {
                if (res) {
                    res.rows.forEach((item) => {
                        item[textChangeArr[0]] =
                            item[textChangeArr[0]] === '1' ? '是' : '否'
                        item[textChangeArr[1]] =
                            item[textChangeArr[1]] === '1' ? '是' : '否'
                        // item['deductionAmount'] = Number(math.multiply(math.divide(item['billingPerformance'],item['quantity']))).toFixed(2) || 0
                        item['deductionAmount'] =
                          Number(math.multiply(math.divide(item['remainingPerformance'],math.subtract(item['quantitySum'],item['executedTimes'])),item['thisScribingNum'])).toFixed(2) || 0
                    })
                    this.tableData = res.rows.filter(item => item.isExecute != '是')
                }
            }).finally(() => {
                this.tableLoading = false
            })
        }
    },
    mounted() {
    // 获取参数
    if (this.$route.query.batchData) {
      this.tableLoading = true
      const currentData = JSON.parse(this.$route.query.batchData)
      currentData.forEach((item, index) => {
        item.itemIndex = index
        item['deductionAmount'] = Number(math.multiply(math.divide(item['remainingPerformance'],math.subtract(item['quantitySum'],item['executedTimes'])),item['thisScribingNum'])).toFixed(2) || 0
      })
      this.tableData = currentData;
    }
    this.$nextTick(() => {
      const containerHeight = this.$refs.container.clientHeight
      const titleHeight = this.$refs.title.clientHeight
      const footerHeight = this.$refs.footer.clientHeight
      //  计算table的高度
      // this.tableHeight = containerHeight - titleHeight - footerHeight - 40
      this.tableLoading = false
    })
  },

  methods: {

    // 关闭
    handleClose() {
      this.$router.go(-1)
    },
    // 是否是数字
    handleIsNaN(value) {
      return typeof Number(value) === 'number' && value >= 0
    },
    // 本次执行金额的修改
    handleInput(rowData) {
      if (!this.tableLoading) {
        const { deductionAmount, remainingPerformance } = rowData
        if (!this.handleIsNaN(deductionAmount)) {
          this.$message.warning('请输入有效数字！')
          return
        }
        //   不能大于超过剩余执行业绩！
        if (parseFloat(remainingPerformance) < parseFloat(deductionAmount)) {
          this.$message.warning('输入数字不能大于超过剩余执行业绩！')
          return
        }
      }
    },
    // 保存
    handleSave() {
      const params = this.tableData.map(item => ({
        deductionId: item.deductionId,
        performance: parseFloat(item.deductionAmount),
        waitId: item.waitId,
        executedTimes: parseFloat(item.thisScribingNum) }))
      this.$api.treatmentMoney.batchPerformanceSave({ pfDtoList: params }).then((res) => {
          if (res) {
              this.$message.success('批量生成业绩成功')
              this.$router.go(-1)
          }
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.pageTitle {
  margin: 10px;
  padding: 0 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: inherit;
  color: #333333;
  border: 0;
}
.mainArea{
  width: 100%;
}
.tableWrap {
  margin: 10px 10px 0;
}
.batchFooter {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-top: 1px solid #eee;
  background: #eaf1f6;
  .btnArea {
    float: right;
  }
}
</style>
<style>
.el-table .odd-rpw {
  background: white;
}

.el-table .double-row {
  background: #f0f9eb;
}
</style>
