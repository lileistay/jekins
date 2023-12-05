<template>
  <!-- 库存明细查询 -->
  <div class="box">
    <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      size="mini"
      index="序号"
      border
      :pagination="pagination"
      selection
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#1abc9c'}"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >


      <!--搜索框 -->
      <div slot="searchBar" class="headers">
        <div style="display: flex">
          <div>
            <el-form :inline="true" size="mini" style="height:40px">
              <el-form-item label="物资编码:">
                <el-input v-model="formline.materialCode" style="width: 100px" clearable />
              </el-form-item>
              <el-form-item label="物资类型:">
                <!--              <el-input v-model="formline.params.typeId" style="width: 100px" clearable />-->
                <el-cascader
                  v-model="formline.matTypeIds"
                  :options="options"
                  :props="{label:'name',value:'id',children:'sonList',multiple: true}"
                  filterable
                  :show-all-levels="false"
                  expand-trigger="hover"
                  class="w100_pidR30"
                  collapse-tags
                />
              </el-form-item>
              <el-form-item label="物资名称:">
                <el-input v-model="formline.materialName" style="width: 100px" clearable />
              </el-form-item>
              <el-form-item label="库房：">
                <el-select v-model="formline.whouseId" style="width: 100px" filterable clearable>
                  <el-option
                    v-for="(item, index) in RoomList"
                    :key="index"
                    :label="item.whouseName"
                    :value="item.whouseId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="日期：">
                <!--              <el-date-picker-->
                <!--                v-model="formline.createTime"-->
                <!--                style="width:200px"-->
                <!--                clearable-->
                <!--                type="datetimerange"-->
                <!--                format="yyyy-MM-dd HH:mm:ss"-->
                <!--                value-format="yyyy-MM-dd HH:mm:ss"-->
                <!--                start-placeholder="开始日期"-->
                <!--                end-placeholder="结束日期"-->
                <!--                :default-time="['00:00:00', '23:59:59']"-->
                <!--              />-->
                <el-date-picker
                  v-model="formline.createTime" class="inputWidth"
                  type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                  :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px" />
              </el-form-item>
              <el-form-item label="是否有库存：">
                <el-select v-model="formline.isInventory" filterable clearable style="width: 100px">
                  <el-option label="是" value="1" />
                  <el-option label="否" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="简码：">
                <el-input v-model="formline.shortCode" style="width: 100px" clearable />
              </el-form-item>
            </el-form>
          </div>
          <div style="margin-bottom: 10px">
            <el-button
              icon="el-icon-search"
              size="mini"
              type="primary"
              plain
              style="margin-right:3px"
              @click.stop.native="getData(true)"
              @keydown.enter.native="getData(true)"
            >查询</el-button>
            <el-button
              icon="el-icon-upload2"
              size="mini"
              type="primary"
              plain
              style="margin-right:3px"
              v-has-permi="['sorage:materialInfo:listexport']"
              @click.stop.native="Export()"
            >导出</el-button>
          </div>
        </div>
      </div>
      <template #custom="data">
        <!-- 点击物资名称跳转到数据分析 -->
        <div v-if="data.props === 'materialName'">
<!--          <a v-if="checkPermi(['statistics:storageStatistic:DrugReceiveStatistics'])" @click.stop="toStatistic(data.custom.materId)">{{ data.custom.materialName }}</a>-->
<!--          <p v-else>{{ data.custom.materialName }}</p>-->
          <p>{{ data.custom.materialName }}</p>
        </div>
      </template>
      <!-- 按钮 -->
            <div slot="header" class="headers" style="height: 70px">
              <div style="margin-top: 10px;font-size: 14px;display: flex">库存明细列表
                <div style="display: inline-block;width: 1800px;height: 50px;">
                  <div style="width: 100%;height: 25px;display: flex">
                   <div style="width: 200px;height: 25px;">
                     <span style="margin-left: 10px; font-size: 14px">入库合计：{{ getNum(form)|numberToCurrency  }}</span>
                   </div>
                    <div style="width: 300px;height: 25px;">
                      <span style="font-size: 14px;margin-left: 14px">入库金额汇总(包含退供应商)：{{ form.procurementPrice|numberToCurrency }}</span>
                    </div>
                    <div style="width: 250px;height: 25px;">
                      <span style="font-size: 14px">移库入库金额汇总：{{ form.moveStoragePrice|numberToCurrency }}</span>
                    </div>

<!--                    <div style="width: 250px;height: 25px;">-->
<!--                      <span style="font-size: 14px">退药入库金额汇总：{{ form.returnMedicinePrice|numberToCurrency }}</span>-->
<!--                    </div>-->
<!--                    <div style="width: 250px;height: 25px;">-->
<!--                      <span style="font-size: 14px">退料入库金额汇总：{{ form.returnStoragePrice|numberToCurrency }}</span>-->
<!--                    </div>-->
                    <div style="width: 250px;height: 25px;">
                      <span style="font-size: 14px">退供应商金额汇总：{{ form.returnSupplierPrice|numberToCurrency }}</span>
                    </div>
                    <div style="width: 250px;height: 25px;">
                      <span style="font-size: 14px">盘盈入库金额汇总：{{ form.inventoryStoragePrice|numberToCurrency }}</span>
                    </div>
                    <div style="width: 250px;height: 25px;">
                      <span style="font-size: 14px">期初金额汇总：{{ form.initialPrice|numberToCurrency }}</span>
                    </div>
                    <div style="width: 250px;height: 25px;">
                      <span style="font-size: 14px">期末金额汇总：{{ form.lastPrice|numberToCurrency }}</span>
                    </div>
                  </div>
                  <div style="width: 100%;height: 25px;display: flex">
                    <div style="width: 200px;height: 25px;">
                      <span style="font-size: 14px;margin-left: 10px">出库合计：{{ outNum(form)|numberToCurrency }}</span>
                    </div>
                    <div style="width: 300px;height: 25px;">
                      <span style="font-size: 14px;margin-left: 14px">正常领料单金额汇总：{{ form.materialPrice|numberToCurrency }}</span>
                    </div>
                    <div style="width: 250px;height: 25px;">

                      <span style=" font-size: 14px">移库出库金额汇总：{{ form.removeStoragePrice|numberToCurrency }}</span>
                    </div>
                    <div style="width: 250px;height: 25px;">
                      <span style="font-size: 14px">领药出库金额汇总：{{ form.medicinePrice1|numberToCurrency }}</span>
                    </div>
<!--                    <div style="width: 250px;height: 25px;">-->
<!--                      <span style="font-size: 14px">退供应商金额汇总：{{ form.returnSupplierPrice|numberToCurrency }}</span>-->
<!--                    </div>-->
                                        <div style="width: 250px;height: 25px;">
                                          <span style="font-size: 14px">退药入库金额汇总：{{ form.returnMedicinePrice|numberToCurrency }}</span>
                                        </div>
                                        <div style="width: 250px;height: 25px;">
                                          <span style="font-size: 14px">退料入库金额汇总：{{ form.returnStoragePrice|numberToCurrency }}</span>
                                        </div>
                    <div style="width: 250px;height: 25px;">
                      <span style="font-size: 14px">盘亏出库金额汇总：{{ form.inventoryPrice|numberToCurrency }}</span>
                    </div>

                  </div>
                </div>
<!--                &nbsp;-->
<!--                &nbsp;-->
<!--                &nbsp;-->
<!--                &nbsp;-->
<!--                -->
<!--                <br>-->
<!--                <div style="height: 10px"></div>-->
<!--                &nbsp;-->
<!--                &nbsp;-->
<!--               &nbsp;-->
<!--                <span style="font-size: 14px">出库金额合计：{{ outSumPrice|numberToCurrency }}</span>-->
              </div>
            </div>
    </sg-table>
    <sg-table
      ref="tableexport"
      :table-data="newtableData"
      style="display: none"
      :columns="columns"
      id="tableexport"
      >

    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
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
import { math } from '@/utils/math'
import { checkPermi } from '@/utils/permission'
export default {
  dicts: ['Reception_status'],
  components: { SgTable },
  data() {
    return {
      options: [],
      newtableData:[],
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
        insertSumPrice: 0, // 入库金额汇总
        outSumPrice: 0, // 退供应商金额汇总
        materialllPrice: 0, // 正常领料单金额汇总
        returnSupplierPrice: 0, // 退料入库单金额汇总
        materialPyPrice: 0, // 正常入库单金额汇总
        returnSumAmount: 0, // 出库金额汇总
        insertzcPrice: 0, // 盘亏金额汇总
        surplusKuiPrice: 0 // 盘盈金额汇总
      },
      Issuetotal: 0, // 出库合计=出库汇总-退料入库-退供货商
      showDataDialog: false,
      selectionData: [], // 选择的数据
      RoomList: [], // 库房
      //   搜索框
      formline: {
        typeId: '', // 物资类型
        whouseId: '', // 库房
        isInventory: '', // 是否有库存
        shortCode: '', // 简码
        createTime: todayTime(), // 日期
        materialCode: '', // 物资编码
        materialName: '', // 物资名称
        matTypeIds: [] // 物质类型
      },
      tableData: [],
      // 表头
      columns: [
        {
          lab: '库房',
          width: 120,
          val: 'whouseName'
        },
        {
          lab: '编码',
          val: 'materialCode',
          width: 140,
          showOverflowTooltip:true

        },
        {
          lab: '物资类型一级',
          width: 120,
          val: 'materialTypeName'
        },
        {
          lab: '物资类型二级',
          width: 120,
          val: 'typeName'
        },
        {
          lab: '物资类型',
          val: 'matTypeName'
        },
        {
          lab: '物资名称',
          val: 'materialName',
          // custom: 'materialName',
          width: 200,
          showOverflowTooltip:true
        },
        {
          lab: '简码',
          val: 'shortCode',
          width: 200,
          showOverflowTooltip:true
        },
        {
          lab: '规格',
          val: 'materialSpec'
        },
        {
          lab: '物资单位',
          val: 'unitName'
        },
        {
          lab: '期初库存数量',
          val: 'initialInventory',
          width: 120
        },

        {
          lab: '期末库存数量',
          val: 'lastInventory',
          width: 120
        },
        {
          lab: '期初库存金额',
          width: 120,
          val: 'initialPrice'
        },
        {
          lab: '期末库存金额',
          val: 'lastPrice',
          width: 120
        },
        {
          lab: '采购入库数量',
          val: 'insertNumber',
          width: 120
        },
        {
          lab: '退领料入库数量',
          val: 'returnedQuantity',
          width: 120
        },
        {
          lab: '盘盈入库数量',
          val: 'surplusYinNumber',
          width: 120
        },
        {
          lab: '退药数量',
          val: 'drugReturns'
        },
        {
          lab: '移库入库数量',
          val: 'moveJInNumber',
          width: 120
        },
        {
          lab: '移库入库金额',
          val: 'moveJInPricer',
          width: 120
        },
        {
          lab: '正常领料数量',
          val: 'outSumNumber',
          width: 120
        },
        {
          lab: '盘亏出库数量',
          val: 'surplusKuiNumber',
          width: 120
        },
        {
          lab: '领药数量',
          val: 'outDrugReturns'
        },
        {
          lab: '移库出库数量',
          val: 'moveChuNumber',
          width: 120
        },
        {
          lab: '移库出库金额',
          val: 'moveChuPrice',
          width: 120
        },
        {
          lab: '退供应商出库数量',
          val: 'returnSupplierNumber',
          width: 120
        },
        {
          lab: '本期入库数量',
          val: 'inserSum',
          width: 120
        },
        {
          lab: '本期出库数量',
          val: 'sumOutNumber',
          width: 120
        },
        {
          lab: '本期入库总金额',
          val: 'insertSumPrice',
          width: 120
        },
        {
          lab: '本期出库总金额',
          val: 'outSumPrice',
          width: 120
        },
        {
          lab: '正常入库金额',
          val: 'insertzcPrice',
          width: 120
        },
        {
          lab: '退料入库金额',
          val: 'returnAmount',
          width: 120
        },
        {
          lab: '正常领料金额',
          val: 'materialllPrice',
          width: 120
        },
        {
          lab: '退供应商金额',
          val: 'returnSupplierPrice',
          width: 120
        },
        {
          lab: '盘盈金额',
          val: 'materialPyPrice'
        },
        {
          lab: '盘亏金额',
          val: 'surplusKuiPrice'
        }

      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
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
    },
    userId: {
      get() {
        return this.$store.getters.user.userId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getData()
      this.getUserList()
      this.getTree()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getUserList()
    this.getTree()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    //入库合计
    getNum(form){
      let total=math.add(math.subtract(math.add(Number(form.procurementPrice),Number(form.moveStoragePrice)),Number(form.returnSupplierPrice)),Number(form.inventoryStoragePrice));
      return total
    },
    //出库合计
    outNum(form){
      let total=math.add(math.subtract(math.subtract(math.add(Number(form.medicinePrice1),math.add(Number(form.materialPrice),Number(form.removeStoragePrice))),Number(form.returnMedicinePrice)),Number(form.returnStoragePrice)),Number(form.inventoryPrice))
        return total;
    },
    Export(){
      const arr = []
      this.formline.matTypeIds.forEach(res => {
        arr.push(res[res.length - 1])
      })
      let date = {
        deptId: this.deptId, // 公司
        whouseId: this.formline.whouseId, // 库房
        matTypeIds: arr, // 三级
        params: {
          shortCode: this.formline.shortCode, // 简码
          isInventory: this.formline.isInventory, // 是否有库存
          bigenTime: this.formline.createTime === null ? null : this.formline.createTime[0],
          endTime: this.formline.createTime === null ? null : this.formline.createTime[1],
          materialCode: this.formline.materialCode, // 物资编码
          materialName: this.formline.materialName // 物资名称
        }
      }
      this.$api.storageRoom.selectInventoryDetailsQueryList(date).then(res => {
        if (res) {
          this.newtableData = res.rows

        }
      }).finally(() => {
        if(this.newtableData.length==0){
          this.$message('导出数据为空');
          return
        }
        this.$export('#tableexport', '库存明细查询')
        // setInterval(() => {
        //   this.submitLoading = false
        // }, 5000)
      })
    },
    checkPermi,
    // 搜索
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const arr = []
      this.formline.matTypeIds.forEach(res => {
        arr.push(res[res.length - 1])
      })
      let date = {
        deptId: this.deptId, // 公司
        whouseId: this.formline.whouseId, // 库房
        matTypeIds: arr, // 三级
        params: {
          shortCode: this.formline.shortCode, // 简码
          isInventory: this.formline.isInventory, // 是否有库存
          bigenTime: this.formline.createTime === null ? null : this.formline.createTime[0],
          endTime: this.formline.createTime === null ? null : this.formline.createTime[1],
          materialCode: this.formline.materialCode, // 物资编码
          materialName: this.formline.materialName // 物资名称
        }
      }
      date = Object.assign(date, this.pagination)
      this.$api.storageRoom.selectInventoryDetailsQueryList(date).then(res => {
        if (res) {
          this.tableData = res.rows
          this.form = res.data
          this.pagination.total = res.total
          this.showDataDialog = false
        }
      })
    }, 500),
    getTree() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
        if (res) {
          this.options = res.data
        }
      })
    },
    toStatistic(materId) {
      this.$router.push({ path: 'materialStatistics', query: { materId: materId }})
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    // 获取系统用户列表
    async getUserList() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      // 库房
      await this.$api.storageRoom.selectWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          this.RoomList = res.data
          if(res.data.length>0){
            this.formline.whouseId=res.data[0].whouseId
          }

        }
      })
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
    // 行内点击选中
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-input__inner{
  height: 30px !important;
}
::v-deep .el-cascader__search-input{
  display: none !important;
}
.Left{
  margin-left: 16px;
}
.box {
  padding: 0;
  .headers {
    font-size: 14px;
    width: 100%;
    //display: flex;
    //justify-content: space-between;
    //align-items: center;
  }
}
span{
  font-size: 12px;
}
.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 10px;
  /* margin-right: 10px; */
  /* right: 10px; */
}

/* 这个样式针对IE有用，不考虑IE的可以不用管*/
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}

</style>
