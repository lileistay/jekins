<template>
  <!--库存查询-->
  <div>

    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-warning-outline"
          type="danger"
          plain
        >库房预警
        </el-button>

      </div>
      <slot>
        <div>
          <el-table
            ref="multipleTable"
            size="mini"
            border
            height="360"
            :data="handleList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            @selection-change="handleSelectionChange"
            @select="selectChange"
            @row-click="handleRowClick"
            @select-all="selectAll"
          >
            <el-table-column width="60px" type="selection" align="center" />
            <el-table-column type="index" label="序列" />
            <el-table-column prop="whouseName" label="库房" width="150" />
            <el-table-column prop="matTypeName" label="物资类型" />
            <el-table-column prop="shortCode" label="简码" />
            <el-table-column prop="materialCode" label="物资编码" />
            <el-table-column prop="materialName" label="物资名称">
              <template #default="scope">
                <a v-if="checkPermi(['statistics:storageStatistic:DrugReceiveStatistics'])" @click.stop="toStatistic(scope.row.materId)">{{ scope.row.materialName }}</a>
                <p v-else>{{ scope.row.materialName }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="materialSpec" label="规格" />
            <el-table-column prop="unitName" label="物资单位" />
            <el-table-column prop="inventoryQuantity" label="库存数量" />
            <el-table-column prop="inventoryPrice" label="金额" />
            <el-table-column prop="avgPrice" label="平均单价" />
            <el-table-column prop="priceOne" label="售价" />
            <el-table-column prop="minStock" label="最小库存" />
          </el-table>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[20, 40, 60, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="handleList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <p style="font-size: 15px;background-color: #1abc9c;height: 30px;line-height: 30px;padding-left: 5px">物资库存变动记录</p>
          <el-table
            size="mini"
            border
            height="330"
            :data="tableData"
            style="width: 100%"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column prop="whouseName" label="库房" width="150" />
            <el-table-column prop="createTime" label="时间" width="150" />
            <el-table-column prop="documentType" label="类型" width="100">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.document_type" :value="scope.row.documentType" />
              </template>
            </el-table-column>
            <el-table-column prop="insertNumber" label="数量" width="60" />
            <el-table-column prop="stock" label="库存" width="60" />
            <el-table-column prop="purchasePrice" label="进价" width="60" />
            <el-table-column prop="inDocumentNo" label="单号" width="150" />
            <el-table-column prop="productionBatch" label="生产批次" width="150" />
            <el-table-column prop="returnDepartmentName" label="部门" />
            <el-table-column prop="startTime" label="有效期开始" />
            <el-table-column prop="endTime" label="有效期结束" />
            <el-table-column prop="companyName" :show-overflow-tooltip="true" label="供应商" />
            <el-table-column prop="place" label="产地" width="60" />
            <el-table-column prop="remark" label="备注" />
          </el-table>
          <div style="width: 100%;height: 50px;display: flex;align-content: center">
            <el-pagination @size-change="handleSizeChangenew" @current-change="handleCurrentChangenew"
                           :current-page.sync="currentPage4" :page-sizes="[10, 20, 30, 50]" :page-size="10"
                           layout="total, sizes, prev, pager, next, jumper" :total="changetotal">
            </el-pagination>
          </div>
        </div>
      </slot>
    </slideSearch>
    <el-table
      id="out-table"
      ref="multipleTable"
      size="mini"
      border
      height="360"
      :data="handleList"
      style="width: 100%;display: none"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      @selection-change="handleSelectionChange"
      @select="selectChange"
      @row-click="handleRowClick"
      @select-all="selectAll"

    >
      <el-table-column width="60px" type="selection" align="center" />
      <el-table-column type="index" label="序列" />
      <el-table-column prop="whouseName" label="库房" width="150" />
      <el-table-column prop="matTypeName" label="物资类型" />
      <el-table-column prop="shortCode" label="简码" />
      <el-table-column prop="materialCode" label="物资编码" />
      <el-table-column prop="materialName" label="物资名称">
        <template #default="scope">
          <a v-if="checkPermi(['statistics:storageStatistic:DrugReceiveStatistics'])" @click.stop="toStatistic(scope.row.materId)">{{ scope.row.materialName }}</a>
          <p v-else>{{ scope.row.materialName }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="materialSpec" label="规格" />
      <el-table-column prop="unitName" label="物资单位" />
      <el-table-column prop="inventoryQuantity" label="库存数量" />
      <el-table-column prop="inventoryPrice" label="金额" />
      <el-table-column prop="avgPrice" label="平均单价" />
      <el-table-column prop="priceOne" label="售价" />
      <el-table-column prop="minStock" label="最小库存" />
    </el-table>
    <el-button type="primary" size="mini" class="el-icon-download" plain style="position: absolute;top: 140px;left: 140px" @click="newexport" v-has-permi="['sorage:storehouseInfo:export']">
      导出
    </el-button>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import { debounce } from '@/utils/throttleAndDebounce'
import { todayTime } from '@/utils/time'
import moment from 'moment'
import {checkPermi} from "@/utils/permission";
export default {
  name: 'InventoryQuery',
  dicts: ['document_type', 'whether'],
  components: {
    slideSearch
  },
  data() {
    return {
      handleSelectionList: [],
      newNum:"",
      currentPage4:1,
      changetotal:0,
      form:{
        pageNum:1,
        pageSize:10,
      },
      tableData: [],
      handleList: [],
      // 当前页
      currentPage: 1,
      // 每页多少条
      pageSize: 20,
      options: {
        // Warehousing: {
        //   type: 'Tdatetime',
        //   label: '库存变动时间：',
        //   clearable: true,
        //   values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        // },
        matTypeId: {
          type: 'cascader',
          label: '物资类型：',
          clearable: true,
          props: { multiple: true, children: 'sonList', label: 'name', value: 'id' },
          options: []
        },
        materialCode: {
          type: 'input',
          label: '物资编码：'
        },
        materialName: {
          type: 'input',
          label: '物资名称：'
        },
        shortCode: {
          type: 'input',
          label: '简码：'
        },
        whouseId: {
          type: 'select',
          label: '库房',
          clearable: true,
          options: []
        },
        isInventory: {
          type: 'select',
          label: '是否有库存：',
          clearable: true,
          options: []
        },
        paidAmount: {
          type: 'Tinput',
          label: '库存范围',
          values: [],
          clearable: true
        }
      } // 查询参数
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
      this.getTreeselect()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.options.isInventory.options = this.dict.type.whether
    this.getData()
    this.getUserList()
    this.getTreeselect()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    getlist(){
      var data = {
        whouseId: this.newNum.whouseId,
        materId: this.newNum.materId,
        pageNum:this.form.pageNum,
        pageSize:this.form.pageSize,
      }
      this.$api.storageRoom.selectInsertlistandOutlist(data).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    handleSizeChangenew(e){
      this.form.pageSize=e
      this.getlist()
    },
    handleCurrentChangenew(e){
     this.form.pageNum=e
      this.getlist()
    },
    newexport(){
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
        } else if (this.options[k].type === 'cascader') {
          let filingIds = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingIds.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingIds', filingIds.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingIds = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      let istory
      if (data.isInventory == 0) {
        istory = 2
      } else if (data.isInventory == 1) {
        istory = 1
      }
      console.log(data,'llllll')
      data = {
        // matTypeId: this.options.matTypeId.values, // 类型
        matTypeIds: data.typeThreeIds,
        whouseId: this.options.whouseId.values, // 库房
        params: {
          materialCode: this.options.materialCode.values, // 物资编码
          materialName: this.options.materialName.values, // 物资名称
          shortCode: this.options.shortCode.values, // 简码
          beginupdateTime: data.Warehousing, // 库存变动时间
          endupdateTime: data.endWarehousing,
          isInventory: istory, // 是否有库存
          begininventoryQuantity: data.paidAmount[0], // 库存范围
          endinventoryQuantity: data.paidAmount[1],
          deptId: this.deptId // 公司
        }
      }
      this.tableData = []
       this.$api.storageRoom.selectMaterialInventoryQuerylist(data).then(res => {
        if (res) {
          // multipleTable
          if(res.rows.length==0){
            this.$message.warning('导出数据为空，请重新筛选')
            return
          }else {
            this.$export('#out-table', '库存进销存')
          }
          this.handleList = res.rows
        }
      })
    },
    checkPermi,
    getData: debounce(async function(isSearch) {
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
        } else if (this.options[k].type === 'cascader') {
          let filingIds = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingIds.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingIds', filingIds.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingIds = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      if (isSearch) {
        // this.pageSize = 1
        this.currentPage = 1
      }
      let istory
      if (data.isInventory == 0) {
        istory = 2
      } else if (data.isInventory == 1) {
        istory = 1
      }
      data = {
        // matTypeId: this.options.matTypeId.values, // 类型
        matTypeIds: data.typeThreeIds,
        whouseId: this.options.whouseId.values, // 库房
        params: {
          materialCode: this.options.materialCode.values, // 物资编码
          materialName: this.options.materialName.values, // 物资名称
          shortCode: this.options.shortCode.values, // 简码
          beginupdateTime: data.Warehousing, // 库存变动时间
          // endupdateTime: data.endWarehousing,
          isInventory: istory, // 是否有库存
          begininventoryQuantity: data.paidAmount[0], // 库存范围
          endinventoryQuantity: data.paidAmount[1],
          deptId: this.deptId // 公司
        }
      }
      this.tableData = []
      await this.$api.storageRoom.selectMaterialInventoryQuerylist(data).then(res => {
        if (res) {
          this.handleList = res.rows
        }
      })
    }, 500),
    handleSelectionChange(value) {
      this.handleSelectionList = value
    },
    selectChange(selection, row) {
      if (selection.length > 1) {
        const del_row = selection.shift()
        this.$refs.multipleTable.toggleRowSelection(del_row, false)
      }
    },
    // 单选
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1
      }
    },
    selectInsertlistandOutlist: debounce(async function(row) {
      var data = {
        whouseId: this.handleSelectionList[0].whouseId,
        materId: this.handleSelectionList[0].materId,
        pageNum:this.form.pageNum,
        pageSize:this.form.pageSize,
      }
      await this.$api.storageRoom.selectInsertlistandOutlist(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.changetotal=res.total;
          this.currentPage4=1;
        }
      })
      // table 会取消选中
      // 重新设置选中的行
      this.$refs.multipleTable.toggleRowSelection(row)
    }, 500),
    // 点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row)
      this.selectChange(this.handleSelectionList)
      this.selectInsertlistandOutlist(row)
        this.newNum=row;

    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 物资类型
    getTreeselect() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
        if (res) {
          // console.log(res.data, '物资')
          this.options.matTypeId.options = res.data
        }
      })
    },
    async getUserList() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      // 库房
      await this.$api.storageRoom.selectInWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.whouseName
            item.value = item.whouseId
          })
          this.options.whouseId.options = res.data
        }
      })
    },
    toStatistic(materId) {
      this.$router.push({ path: 'materialStatistics', query: { materId: materId }})
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-pager li.active {
  background-color: #409eff !important;
  color: #fff;
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
::v-deep  .el-table__row td{
  height: 1px;
  padding: 3px 0px;
}
</style>
