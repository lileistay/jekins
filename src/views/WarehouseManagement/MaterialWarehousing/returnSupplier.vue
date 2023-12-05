<template>
  <!--  退供应商-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">[外购入库单]退货出库
        </div>
        <el-form ref="form" class="mentform" :model="form" size="mini" :rules="rules" label-width="100px" style="margin-top:10px ">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item label="出库单号:">
                <el-input v-model="form.inDocumentNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="执行人:">
                <el-select
                  v-model="form.execreateBy"
                  disabled filterable
                  class="fullInput"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(userItem, index) in userList"
                    :key="index"
                    :label="userItem.nickName"
                    :value="userItem.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="执行日期:">
                <el-input v-model="form.executeDate" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="库房:" prop="whouseId">
                <el-select v-model="form.whouseId" disabled filterable>
                  <el-option
                    v-for="(item, index) in RoomList"
                    :key="index"
                    :label="item.whouseName"
                    :value="item.whouseId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商:" prop="supplierNo">
                <el-select v-model="form.supplierNo" disabled filterable>
                  <el-option
                    v-for="(item, index) in supplier"
                    :key="index"
                    :label="item.companyName"
                    :value="item.supplierNo"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input v-model="form.remark" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="mentediv">
        <div class="formBody" style="min-height: 520px">
          <div slot="searchBar">
            <el-table
              :data="tableData"
              border
              size="mini"
              max-height="480"
              style="width: 100%"
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="inBatchNumber" label="入库批次号" />
              <el-table-column prop="productionBatch" label="生产批次" />
              <el-table-column prop="companyName" label="供应商" />
              <el-table-column prop="matTypeName" label="物资类型" />
              <el-table-column prop="materialName" label="物资名称" />
              <el-table-column prop="materialSpec" label="规格	" />
              <el-table-column prop="unitName" label="物资单位" />
              <el-table-column prop="availableNumber" label="可用数量	" />
              <el-table-column prop="outNumber" label="退货数量">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.outNumber"
                    size="mini"
                    style="width: 100%"



                    @blur="outnum(scope.row)"
                    @input="() => $forceUpdate()"
                  />
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
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button size="mini" type="primary" icon="el-icon-folder-checked" :loading="submitLoading" @click="returnRoom">保存</el-button>
        <el-button size="mini" type="danger"  icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { math } from '@/utils/math'
import vm from '@/utils/util'
import sgDialog from '@/components/Dialog'
import { formatDate } from '@/utils/time'

export default {
  components: {
    sgDialog
  },
  dicts: ['medication_unit', 'cm_medication_frequency', 'wm_medication_frequency', 'whether', 'discount'],
  data() {
    return {
      bool: true,
      bools: false,
      //  用户列表
      userList: [],
      RoomList: [], // 库房
      supplier: [], // 供应商
      // ---
      tableData: [],
      Tatalist: [],
      // 入库单
      form: {
        inDocumentNo: '', // 入库单号
        execreateBy: '', // 执行人
        executeDate: '', // 执行日期
        whouseId: '', // 库房
        supplierNo: '', // 供应商
        remark: ''
      },
      rules: {
        whouseId: [
          { required: true, message: '请选择库房', trigger: 'blur' }
        ],
        supplierNo: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ]
      },
      submitLoading: false, // 暂存入库 loading
      removeIds: [],
      templateData: [], // 物资列表
      templateDatas: [], // 已选中
      queryList:{}
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
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getUserList()
      this.getDate()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.user = this.$store.getters.user
    this.queryList = JSON.parse(sessionStorage.getItem('returnSupplieritem'))

    if ( this.queryList !== undefined) {
      this.form =  this.queryList
      // this.form.createBy = this.$route.query.item.executeUserId
      this.getDate()
      this.bool = false
      this.bools = true
    } else {
      this.bool = true
      this.bools = false
    }
    this.form.execreateBy = this.user.userId
    this.getUserList()
  },
  methods: {
    // 点击编辑
    getDate() {
      const inDocumentNo =  this.queryList.inDocumentNo;
      let item=JSON.parse(localStorage.getItem('returnId'))
      this.form = item
      this.$api.storageRoom.insertList({ inDocumentNo: item.inDocumentNo }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.amountPrice = item.materialPrice // 金额
            item.materialPrice = item.purchasePrice
            item.insertNumber = item.inventoryQuantity
            item.insertNumber = Number(item.availableNumber) // 库房可用数量
          })
          this.tableData = res.rows;
          console.log(res.rows,'sdadasdh')
        }
      })
    },
    // 关闭当前标签
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 导入物资-搜索
    getreturn() {
      this.$router.push({ path: 'purchaseReceipt' })
    },
    outnum(row) {
      if (row.availableNumber < row.outNumber) {
        this.$message('退货数量不得大于可用数量')
        row.outNumber = row.availableNumber
      }
    },
    // 删除此条数据
    handleDelete(index, row) {
      this.tableData.splice(index, 1)
    },
    // 退供应商
    returnRoom() {
      this.Tatalist = []
      if (this.tableData.some((val) => val.outNumber === undefined)) {
        this.$message('请填写退货数量')
        return
      }
      this.tableData.forEach(item => {
        if (item.outNumber > 0 && item.outNumber !== undefined) {
          this.Tatalist.push({
            deptId: this.deptId, // 公司id
            inBatchNumber: item.inBatchNumber, // 入库批次号
            productionBatch: item.productionBatch, // 生产批次
            unitName: item.unitName, // 单位
            matTypeName: item.matTypeName, // 物资类型
            materialName: item.materialName, // 物资名称
            materialSpec: item.materialSpec, // 规格
            outNumber: item.outNumber, // 退货数量
            endTime: item.endTime, // 结束时间
            createTime: item.createTime, // 开始时间
            materId: item.materId, // 物资编号
            matTypeId: item.matTypeId, // 三级类型
            typeId: item.typeId, // 二级类型
            materialTypeId: item.materialTypeId, // 一级类型
            whouseId: item.whouseId, // 库房
            place: item.place, // 产地
            purchasePrice: item.purchasePrice, // 进价
            materialPrice: math.multiply(item.purchasePrice, item.outNumber), // 价格
            status: '1', // 单据状态
            supplierNo: item.supplierNo, // 供应商
            insertId: item.insertId,
            remark: item.remark,
            documentType: '2', // 单据类型
            assist:item.assist
          })
        }
      })
      const outInfo = {
        deptId: this.deptId, // 公司
        // outDocumentNo: this.form.inDocumentNo || null, // 单号
        executeData: this.form.executeDate, // 日期
        /**
         * @author lishang
         * @date 2022/11/3
         * @Description: 退的时候直接从页面拿过来 退的时候就不用传编号了
        */
        executePerson: this.form.execreateBy, // 执行人
        whouseId: this.form.whouseId, // 库房
        supplierNo: this.form.supplierNo, // 供应商
        remark: this.form.remark,
        status: '1',
        outData: formatDate('YY-MM-DD hh:mm:ss'),
        operationDate: formatDate('YY-MM-DD hh:mm:ss'),
        documentType: '2' // 单据类型
      }
      this.submitLoading=true
      this.$api.storageRoom.outInfoAdd({
        'outInfo': outInfo,
        'outListList': this.Tatalist
      }).then(res => {
        if (res) {
          this.$message.success('退货成功')
          this.submitLoading=false
          this.$router.push({ path: 'purchaseReceipt' })
        }
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取系统用户列表
    getUserList() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      // 库房
      this.$api.storageRoom.selectWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          this.RoomList = res.data
        }
      })
      // 供应商
      this.$api.storageRoom.supplierList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.supplier = res.rows
        }
      })
      // 添加状态
      this.$api.user.getUserList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.$forceUpdate()
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.userList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 大页面关闭
    remode() {
      this.closeTag()
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-input-number__decrease {
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}
//number 宽度调整
::v-deep .el-input-number .el-input__inner {
  padding: 0;
  width: 80px;
}
.redStr{
  display: none;
}
.formBody {
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 5px 10px 10px 10px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 10px 0 10px;
  //margin-right: 40px;
  //margin-top: 20px;
  .itemment {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #75deca;
  }
}
.formBodys{
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding:40px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 15px;
  .title{
    position: absolute;
    top: -11px;
    left: 25px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
  .form-left{
    width: 25%;
    min-height: 260px;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }
  .form-right{
    width: 73%;
    min-height: 260px;
    border-radius: 10px;
    position: relative;
    border: 1px solid #c6c6c6;
  }
}
.titme{
  height: 40px;
  line-height: 40px;
  color: #ffff;
  font-size: 14px;
  margin-top: 10px;
  background-color: #1abc9c;
}
.el-button--mini, .el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}
.header {
  font-size: 12px;
  padding-top: 5px;
  margin-bottom: 5px;
}

.management {
  padding: 6px 40px;

  .itemment {
    color: #1abc9c;
    font-size: 14px;
    font-weight: 600;
  }

  .demo-form-inline {
    line-height: 40px;
  }

  .el-input--mini {
    line-height: 37px;
  }

  a {
    font-size: 12px;
    color: #1abc9c;
    text-decoration: none;
  }
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
::v-deep .el-input__icon:after {
  display: none;
}
</style>
