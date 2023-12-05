<template>
  <!--出库-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">出库单--单据信息
        </div>
        <el-form ref="form" class="mentform" :model="form" size="mini" :rules="rules" label-width="100px" style="margin-top:10px ">
          <el-row :gutter="24" style="display: flex;align-items: center">
<!--            <el-col :span="4">-->
<!--              <el-form-item label="出库单号:">-->
<!--                <el-input v-model="form.outDocumentNo" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="4" style="display: flex;align-items: center">
              <el-form-item label="执行人:">
                <el-select
                  v-model="form.executePerson"
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
            <el-col :span="4" style="display: flex;align-items: center" class="Timedate">
              <el-form-item label="执行日期:">
                <el-date-picker
                  v-model="form.operationDate"
                  type="datetime"
                  placeholder="选择日期" size="mini">
                </el-date-picker>
<!--                <el-input v-model="form.operationDate" disabled />-->
              </el-form-item>
            </el-col>
            <el-col :span="5" style="display: flex;align-items: center;">
              <el-form-item label="领料人员:" prop="outPerson">
                <el-select v-model="form.outPerson" placeholder="请选择" filterable :filter-method="may" clearable @change="changeOutPerson">
                  <el-option
                    v-for="item in outPersonList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
<!--                <el-input v-model="form.outPerson" />-->
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="领料部门:" prop="departmentId">
                <treeselect
                  v-model="form.departmentId"
                  :options="menuOptions"
                  :normalizer="normalizer"
                  placeholder="选择部门"
                  :disable-branch-nodes="true"
                  style="width: 260px"
                  size="mini"
                />

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" >
              <el-form-item label="领料客户:" >
                <el-select
                  v-model="form.outCuntomer"
                  clearable
                  placeholder="姓名/电话/卡号"
                  filterable
                  remote
                  reserve-keyword
                  value-key="arr"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="changes"
                >
                  <el-option
                    v-for="(arr, index) in PickingCustomer"
                    :key="index"
                    :value="arr.id"
                    :label="arr.refereeName + arr.refereePhone"
                    @click.native="getValue(arr)"
                  />
                </el-select>
                <i class="el-icon-search Search" @click="SarchList"></i>

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
          <div class="itemment">出库单-单据详情
          </div>
          <div slot="searchBar">
            <div style="width: 100%;height:35px; margin-top: 10px; background-color: #1abc9c">
              <el-button
                class="elbut"
                style="float:right; margin-right: 5px;"
                icon="el-icon-plus"
                type="primary"
                plain
                size="mini"
                @click="importProject"
              >导入物资
              </el-button>
              <el-button
                class="elbut"
                style="float:right; margin-right: 5px;"
                icon="el-icon-plus"
                type="primary"
                plain
                size="mini"
                @click="Warehousing"
              >按入库单导入
              </el-button>
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
              <el-table-column prop="materialName" label="物资名称" width="280" />
              <el-table-column prop="inBatchNumber" label="批次号" />
              <el-table-column prop="productionBatch" label="生产批次" />
              <el-table-column prop="place" label="产地" width="80" />
              <el-table-column prop="startTime" label="有效起始时间" />
              <el-table-column prop="endTime" label="有效结束时间" />
              <el-table-column prop="whouseName" label="库房" />
              <el-table-column prop="materialSpec" label="规格" width="80" />
              <el-table-column prop="unitName" label="单位" width="80" />
              <el-table-column prop="insertNumber" label="入库数量" width="80" />
              <el-table-column prop="availableNumber" label="可用数量" width="80" />
              <el-table-column prop="outNumber" label="出库数量">
                <template slot-scope="scope">
                  <el-input-number

                    v-model="scope.row.outNumber"
                    size="mini"
                    style="width: 100%"

                    @blur="outnumber(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    size="mini"
                    style="width: 100%"
                    @input="() => $forceUpdate()"
                    :readonly="scope.row.readonly"
                    @click.nat.native="Readonly(scope.$index)"


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
      <div class="content" style="float: right">
        <el-button :class="{redStr: bools}" size="mini" type="primary" icon="el-icon-folder-checked" :loading="submitLoading" @click="addRoom(0)">暂存</el-button>
        <el-button size="mini" :loading="submitLoading" @click="addRoom(1)">确定出库</el-button>
        <el-button size="mini" type="danger"  icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
    <!--    导入物资-->
    <el-dialog
      title="导入物资"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <tMaterials @handleDelete="handleDeletes" @daoruImport="daoruImports" />
    </el-dialog>
    <!-- 按入库单导入 -->
    <sg-dialog
      title="选择入库单"
      :dialog="dialog"
      size="60%"
      @handleClose="handle"
    >
      <div slot="out">
        <el-form :inline="true" :model="forminsert" class="demo-form-inline" size="mini">
          <el-form-item label="入库日期:">
            <el-date-picker
              v-model="forminsert.inhouseData"
              style="width: 100%"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
          <el-form-item label="入库单号:">
            <el-input v-model="forminsert.inDocumentNo" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item label="库房:">
            <el-select v-model="forminsert.whouseId" filterable clearable>
              <el-option
                v-for="(item, index) in RoomList"
                :key="index"
                :label="item.whouseName"
                :value="item.whouseId"
              />
            </el-select>
          </el-form-item>
          <el-button style="float:right; margin-left: 10px" size="mini" icon="el-icon-plus" @click="outImport">导入</el-button>
          <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="getoutku">搜索</el-button>
        </el-form>
        <el-table
          :data="tableDataList"
          size="mini"
          border
          height="300"
          style="width: 100%"
          highlight-current-row
          @row-click="Dataout"
        >
          <el-table-column prop="inDocumentNo" label="入库单号" width="145"/>
          <el-table-column prop="executeUserName" label="执行人" width="130"/>
          <el-table-column prop="inhouseData" show-overflow-tooltip label="执行日期" width="145"/>
          <el-table-column prop="supplierNo" label="供应商" />
          <el-table-column prop="whouseName" label="库房" width="200"/>
          <el-table-column label="入库单类型">
            <template #default="scpoe">
              <template v-for="item in dict.type.document_type">
                <span v-show="scpoe.row.documentType === item.value " :key="item.value">{{ item.label }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="进价总额" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </div>
    </sg-dialog>
  </el-scrollbar>
</template>

<script>
import { math } from '@/utils/math'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import tMaterials from '@/components/ImportMaterials'
import vm from '@/utils/util'
import sgDialog from '@/components/Dialog'
import { todayTime, timeFmt } from '@/utils/time'
import PinyinMatch from "pinyin-match";

export default {
  components: {
    sgDialog,
    tMaterials,
    Treeselect
  },
  dicts: ['medication_unit', 'cm_medication_frequency', 'wm_medication_frequency', 'whether', 'discount', 'document_type'],
  data() {
    return {
      outPersonList:[],
      radio:'0',
      queryPhone:"",
      whoid: 0, // 库房id
      PickingCustomer: [], // 领料客户
      loading: false,
      bool: true,
      bools: false,
      //  用户列表
      userList: [],
      RoomList: [], // 库房
      menuOptions: [], // 部门
      // ---
      tableData: [],
      Tatalist: [], // 暂存传值
      tableDataList: [],
      inDocumentNo: '',
      // 出库单
      form: {
        outDocumentNo: null, // 出库单号
        executePerson: 0, // 执行人
        operationDate: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()), // 执行日期
        outPerson: '', // 领料人员
        departmentId: null, // 科室
        id: 0, // 领料客户
        remark: '',
        outCuntomer:""
      },
      outCuntomer: '0', // 领料客户id
      // 按入库单导入
      dialog: false,
      rules: {
        outPerson: [
          { required: true, message: '请输入领料人员', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ]
      },
      submitLoading: false, // 暂存入库 loading
      dialogVisible: false, // 导入物资 关闭/打开
      forminsert: {
        inhouseData: todayTime()
      }, // 入库单导入
      removeIds: [],
      newhfuserList:[],
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
      this.getTreese()
      this.getDate()
    }
  },
  created() {
    this.getTreese()
    if (this.$route.query.item !== undefined) {
      this.form = this.$route.query.item
      this.getDate()
    }
    this.deptId = this.$store.getters.departmentId
    this.user = this.$store.getters.user
    this.form.executePerson = this.user.userId
    this.getUserList();
    this.getlistpeople();
  },
  methods: {
    changeOutPerson(val){
      if(val==''){
        this.outPersonList=this.newhfuserList;
      }
    },
    Readonly(index){
      this.tableData[index].readonly=false
      this.$set(this.tableData,index,this.tableData[index])
    },
    //查询客户
    SarchList(){
      this.$api.modules.netPower.selectRecommend({ namephonecard: this.queryPhone,deptId:this.deptId }).then(res => {
        if (res) {
          this.PickingCustomer = res.data
        }
      })
    },
    may(val){
      if (val) {
        this.form.outPerson=val;
        //取值
        let newlist = this.newhfuserList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
        this.outPersonList=newlist;

        this.$forceUpdate()
        // this.otherForm.refereeuserId=val
      }else{
        this.outPersonList=this.newhfuserList;
      }
    },
    getlistpeople(){
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        res.data.forEach(item => {
          item.label = item.nickName
          item.value = item.userId
        })
        const arr1 = this.unique(res.data)
         this.outPersonList=arr1;
        this.newhfuserList=arr1;
      })
    },
    // 导入物资
    handleClose() {
      this.dialogVisible = false
    },
    handleDeletes() {
      this.dialogVisible = false
    },
    daoruImports(val) {
      val.forEach(res => {
        res.remark = ''
        res.readonly=true
        this.tableData.push(res)
      })
      this.dialogVisible = false
    },
    getDate() {
      const outDocumentNo = this.$route.query.item.outDocumentNo
      this.$api.storageRoom.outList({ outDocumentNo: outDocumentNo }).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    /** 查询部门下拉树结构 */
    async getTreese() {
      var data = {
        status: '0',
        deptId: this.deptId
      }
      await this.$api.post.sectionInfoList(data).then(res => {
        if (res) {
          this.menuOptions = []
          const menu = { sectionId: 0, sectionName: '请选择', children: [] }
          menu.children = this.handleTree(res.rows, 'sectionId')
          this.menuOptions.push(menu)
        }
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.sectionId,
        label: node.sectionName,
        children: node.children
      }
    },
    // 出库数量
    outnumber(index, val) {
      if (val.availableNumber < val.outNumber) {
        this.$message('出库数量不得大于可用数量')
        val.outNumber = val.availableNumber
      }
    },
    // 关闭当前标签
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 导入物资
    importProject() {
      this.dialogVisible = true
    },
    Warehousing() {
      this.dialog = true
    },
    handle() {
      this.dialog = false
      this.tableDataList = []
      this.inDocumentNo = []
      this.forminsert = {
        inhouseData: todayTime()
      }
    },
    // 删除此条数据
    handleDelete(index, row) {
      this.$confirm('此操作将永久此条库存记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.form.outDocumentNo !== '' && this.form.outDocumentNo !== null) {
          if (row.outId !== undefined || row.outId !== null || row.outId !== 0) {
            this.$api.storageRoom.outListDelete(row.outId).then(res => {
              if (res) {
                this.$message.success('删除成功')
              }
            })
          }
          this.removeIds.push(row.orderDetailsId)
          this.tableData.splice(index, 1)
        } else {
          this.removeIds.push(row.orderDetailsId)
          this.tableData.splice(index, 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 按入库单 - 搜索
    getoutku() {
      const dates = {
        inDocumentNo: this.forminsert.inDocumentNo,
        whouseId: this.forminsert.whouseId,
        deptId: this.deptId,
        isInventory: '1',
        inhouseData: this.forminsert.inhouseData !== null ? this.forminsert.inhouseData[0] : null,
        endinhouseData: this.forminsert.inhouseData !== null ? this.forminsert.inhouseData[1] : null
      }
      this.$api.storageRoom.insertInfoList(dates).then(res => {
        if (res) {
          this.tableDataList = res.rows
        }
      })
    },
    // 点击
    Dataout(row) {
      this.inDocumentNo = row.inDocumentNo
    },
    // 按入库单 - 导入
    outImport() {
      if (this.inDocumentNo === '') {
        this.$message('请选择入库单')
        return
      }
      this.$api.storageRoom.insertList({ inDocumentNo: this.inDocumentNo }).then(res => {
        if (res) {
          this.dialog = false
          this.tableData = this.tableData.concat(res.rows)
          this.tableData.forEach(value=>{
            value.readonly=true;
          })
        }
      })
      this.tableData = []
      this.forminsert = {}
    },
    // 出库 暂存 / 确定
    addRoom(val) {
      if (this.tableData.some((val) => val.outNumber === undefined)) {
        this.$message('请填写出库数量')
        return
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.Tatalist = []
          this.tableData.forEach(item => {
            this.whoid = item.whouseId
            this.Tatalist.push({
              deptId: this.deptId, // 公司
              insertId: item.insertId, // 入库详情id
              materialName: item.materialName, // 物资名称
              productionBatch: item.productionBatch, // 生产批次
              place: item.place, // 产地
              startTime: item.startTime,
              createTime: item.createTime, // 有效起始时间
              endTime: item.endTime, // 有效结束时间
              whouseId: item.whouseId, // 库房
              materialSpec: item.materialSpec, // 规格
              unitName: item.unitName, // 单位
              outNumber: item.outNumber, // 出库数量
              availableNumber: item.availableNumber, // 可用数量
              purchasePrice: item.purchasePrice,
              materialPrice: math.multiply(item.outNumber, item.purchasePrice), // 金额
              supplierNo: item.supplierNo, // 供应商
              status: val,
              matTypeId: item.matTypeId,
              materId: item.materId,
              materialTypeId: item.materialTypeId,
              typeId: item.typeId,
              outId: item.outId === undefined ? 0 : item.outId,
              remark: item.remark,
              documentType: '4',// 单据类型
              assist:item.assist
            })
          })
          if(this.outCuntomer=='0'){
            this.outCuntomer=''
          }
          this.Tatalist.forEach(value=>{
            value.id=this.outCuntomer
          })
          const data = {
            outInfo: {
              deptId: this.deptId,
              outDocumentNo: this.form.outDocumentNo === '' ? null : this.form.outDocumentNo,
              operationDate: this.form.outDocumentNo === null ? timeFmt('', this.form.operationDate) : null,
              executeData: val === 1 ? timeFmt('', new Date()) : null,
              executePerson: this.form.executePerson, // 执行人
              outPerson: this.form.outPerson, // 领料人
              departmentId: this.form.departmentId,
              outCuntomer: this.outCuntomer,
              whouseId: this.whoid,
              outInfoId: this.form.outInfoId === undefined ? 0 : this.form.outInfoId,
              status: val,
              remark: this.form.remark,
              documentType: '4', // 单据类型
            },
            outListList: this.Tatalist
          }
          this.submitLoading=true
          this.$api.storageRoom.outInfoAdd(data).then(res => {
            if (res) {
              this.templateData = res.rows
              this.$router.push({ path: 'exWarehouse' })
              this.submitLoading = false
            }
          })
        }
      })
    },
    // 领料客户
    changes(val) {
      this.form.outCuntomer = val
      this.outCuntomer = val;
      if(this.form.outCuntomer==""){
        this.outCuntomer=''
        this.PickingCustomer=[]

      }
    },
    getValue(val) {
    },
    // 模糊查找搜索
    remoteMethod(query) {
      this.queryPhone=query;
      this.form.outCuntomer=this.queryPhone

      // 当input里面的值大于两个的时候触法搜索
      //   this.loading = true
      //   //  一秒后再搜索
      //   setTimeout(() => {
      //     this.loading = false
      //     this.$api.modules.netPower.selectRecommend({ namephonecard: query,deptId:this.deptId }).then(res => {
      //       if (res) {
      //         this.PickingCustomer = res.data
      //       }
      //     })
      //   }, 1000)
    },
    // 获取系统用户列表
    getUserList() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      // 库房
      this.$api.storageRoom.selectInWarehouseAuthoritiesByUserId(data).then(res => {
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
          // 去重
          const arr1 = this.unique(res.data)
          this.userList = arr1
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
@import '../../../styles/globalfloat.css';
::v-deep .Timedate .el-form-item__label{
  margin-top: 4px !important;
}
.Search{
  font-size: 20px ;
  margin-left: 10px;
  color: #409eff;
  cursor: pointer;
  position: absolute;
  margin-top: 5px;
}
::v-deep .vue-treeselect__control{
  height: 25px !important;
}
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

::v-deep .el-table__body tr.current-row>td {
  color: #fff;
  background: #1abc9c!important;
}

</style>

