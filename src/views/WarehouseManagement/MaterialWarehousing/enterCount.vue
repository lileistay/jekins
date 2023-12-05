<template>
  <!--录入盘点单-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">盘点单
        </div>
        <el-form ref="form" class="mentform" :model="form" size="mini" label-width="100px" style="margin-top:10px ">
          <el-row>
            <el-col :span="4">
              <el-form-item label="盘点单号:">
                <el-input v-model="form.inventoryNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="创建人:">
                <el-select
                  v-model="form.createPerson"
                  disabled
                  filterable
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
              <el-form-item label="创建日期:">
                <el-input v-model="form.generateTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="盘点状态:" prop="status">
                <el-select v-model="form.status" filterable disabled>
                  <el-option
                    v-for="item in dict.type.counting_status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="盘点人:">
                <el-select
                  v-model="form.inventoryPerson"
                  disabled
                  filterable
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
              <el-form-item label="盘点日期:">
                <el-date-picker
                  v-model="inventory"
                  disabled
                  type="datetime"
                  style="width: 150px;"
                  placeholder="选择日期时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="审核人:">
                <el-input v-model="form.examinePerson" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="mentediv">
        <div class="formBody" style="min-height: 520px">
          <div slot="searchBar">
            <div style="width: 100%;height:35px; margin-top: 10px; background-color: #1abc9c" />
            <div class="itemment">盘点单明细
            </div>
            <el-table
              :data="tableData"
              border
              size="mini"
              max-height="480"
              style="width: 100%"
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="materialName" label="物资名称" />
              <el-table-column prop="materialSpec" label="规格" />
              <el-table-column prop="unitName" label="单位" />
              <el-table-column prop="inventoryQuantity" label="库存数量" />
              <el-table-column prop="inventoryNumber" label="盘点数量">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.inventoryNumber"
                    size="mini"
                    style="width: 100%"
                    :precision="2"
                    @click.native="focus(scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button size="mini" icon="el-icon-folder-add" type="primary" plain :loading="submitLoading" @click="addRoom(2)">保存</el-button>
        <el-button size="mini" type="danger" :loading="submitLoading" icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { math } from '@/utils/math'
import vm from '@/utils/util'

export default {
  name: 'EnterCount',
  components: {
  },
  dicts: ['counting_status'],
  data() {
    return {
      //  用户列表
      userList: [],
      RoomList: [], // 库房
      // ---
      tableData: [],
      // 入库单
      form: {
        generateTime: '', // 盘点日期
        inventoryNo: '', // 单号
        createPersonName: '', // 执行人
        inventoryDate: '', // 执行日期
        status: '',
        examinePersonName: ''
      },
      inventoryPerson: '', // 盘点人
      inventory: '',
      submitLoading: false, // 暂存入库 loading
      removeIds: []
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
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.user = this.$store.getters.user
    // this.inventoryPerson = this.user.userId
    this.getUilist()
    if (this.$route.query.item !== undefined) {
      this.form = this.$route.query.item
      this.form.inventoryPerson = this.user.userId
      this.form.examinePerson = null
      this.getDate()
    }
  },
  methods: {
    getDate() {
      const inventoryNo = this.$route.query.item.inventoryNo
      this.$api.storageRoom.inventoryListList({ inventoryNo: inventoryNo }).then(res => {
        if (res) {
          res.rows.forEach(value=>{
            value.inventoryNumber=value.inventoryQuantity
          })
          this.tableData = res.rows
        }
      })
    },
    // 关闭当前标签
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    focus(val) {
      if (val.inventoryNumber === 0) {
        val.inventoryNumber = undefined
      }
    },
    // 保存
    addRoom(val) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var inventoryLists = []
          let purchasePrice = 0
          this.tableData.forEach(item => {
            console.log('数据显示', item)
            purchasePrice = 0
            if (item.inventoryId > 0) {
              purchasePrice = item.purchasePrice
            } else {
              purchasePrice = math.divide(item.inventoryQuantity, item.inventoryPrice) === Infinity ? 0 : math.divide(item.inventoryQuantity, item.inventoryPrice)
            }
            inventoryLists.push({
              'inventoryId': item.inventoryId, // id
              'inventoryNumber': item.inventoryNumber, // 盘点数量
              'inventoryQuantity': item.inventoryQuantity, // 库存数量
              'materialPrice': math.multiply(purchasePrice, item.inventoryQuantity), // 总金额
              'purchasePrice': purchasePrice, // 物资单价
              'inventoryPrice': math.multiply(purchasePrice, item.inventoryNumber), // 实盘点总金额
              'inventoryLossNumber': math.subtract(item.inventoryNumber, item.inventoryQuantity), // 盈亏总数量
              'inventoryLossPrice': math.multiply(purchasePrice, math.subtract(item.inventoryNumber, item.inventoryQuantity)) // 盈亏总金额
            })
          })
          const data = {
            ineysheetInfo: {
              'deptId': this.deptId,
              'inventoryNo': this.form.inventoryNo, // 单号
              'inventoryPerson': this.form.inventoryPerson, // 盘点人
              'inventoryDate': this.inventory, // 盘点日期
              'whouseId': this.form.whouseId,
              'sheetId': this.form.sheetId,
              'status': val
            },
            inventoryLists: inventoryLists
          }
          console.log('inventoryLists', inventoryLists)
          this.$api.storageRoom.ineysheetInfoAdd(data).then(res => {
            if (res) {
              this.$router.push({ path: 'inventoryMaterials' })
              this.submitLoading = false
            }
          })
        }
      })
    },
    getUilist() {
      const year = new Date().getFullYear()// 年
      // 月份是从0月开始获取的，所以要+1;
      const month = new Date().getMonth() + 1
      const day = new Date().getDate() // 日
      const hour = new Date().getHours() // 时
      const minute = new Date().getMinutes() // 分
      const second = new Date().getSeconds() // 秒
      this.inventory = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      // 添加状态
      this.$api.user.getUserList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          const arr1 = this.unique(res.data)
          this.userList = arr1
          this.$forceUpdate()
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
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
// 弹框头部背景颜色
::v-deep .el-dialog__header {
  background-color: #1abc9c;
}
// 表头子
::v-deep .el-dialog__title {
  font-size: 16px;
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
    width: 23%;
    min-height: 250px;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }
  .form-right{
    width: 75%;
    min-height: 250px;
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
.select{
  font-size: 12px;
  padding-left: 15px;
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
    .red {
      font-weight: 400;
      color: red;
    }
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

