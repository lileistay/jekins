<template>
  <!--入库单查询-->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" icon="el-icon-search" @click.stop="getData(true)" @keydown.enter.native="getData(true)">查询</el-button>
<!--        <el-button-->
<!--          v-has-permi="['confinement:warehouseManagement:export']"-->
<!--          size="mini"-->
<!--          type="success"-->
<!--          icon="el-icon-upload2"-->
<!--          plain-->
<!--          @click="newexport"-->
<!--        >导出</el-button>-->
      </div>
      <slot>
        <sg-table
          v-if="true"
          id="out-table"
          ref="table"
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
            </div>
            <div>
              <span style="color: #9e9d9d">入库金额汇总：{{ Summary.insertPrice|numberToCurrency }}</span>
              <span style="color: #9e9d9d">入库金额汇总（不包括退料金额）：{{ WarehousingRe|numberToCurrency }}</span>
              <span style="color: #9e9d9d">退料金额汇总：{{ Summary.returnPrice|numberToCurrency }}</span>
            </div>
          </div>
          <div slot="header" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
              <span style="font-size: 12px">已失效显示红色字体，快失效（一年内）显示黄色字体</span>
            </div>
            <div>
              <el-button v-if="showflagtime" size="mini"  type="primary"  plain icon="el-icon-edit"
                          class="headerBarBtn" @click.stop.native="editTime" v-has-permi="['sorage:insertList:updateInsertListTimeAndData']">修改入库时间和数量
              </el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                icon="el-icon-back"
                @click="Retreat"
              >退供应商
              </el-button>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props==='opera'">
<!--              <i style="font-size: 19px;color: red" class="el-icon-printer" @click="pinrtlist(data.custom)" />-->
              &nbsp;
              <i style="font-size: 19px;color: #3aa1ff" class="el-icon-printer" @click="pinrtlist(data.custom)" />
            </div>
            <div v-else-if="data.props==='inDocumentNo'">
              <a style="color: #5f94de;cursor:pointer" @click="Receipt(data.custom)">{{ data.custom.inDocumentNo }}</a>
            </div>
            <!--万-->
            <div v-if="data.props==='documentType'">
              <show-dict-data :options="dict.type.document_type" :value="data.custom.documentType" />
            </div>
          </template>
        </sg-table>
      </slot>
      <!--打印-->
      <vue-easy-print ref="receiptDocs">
        <receiptDocs
          :print="print"
          :message="newmessage"
          :template-list="printList"
        />
      </vue-easy-print>
    </SlideSearch>
    <!--点击单号-->
    <sgDialog :title="title" size="900px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <div class="formBody">
          <div class="itemment">入库单
          </div>
          <el-form ref="form" class="mentform" :inline="true" :model="form" size="mini" label-width="100px">
            <el-form-item label="入库单号:">
              <el-input v-model="form.inDocumentNo" disabled style="width: 155px;" />
            </el-form-item>
            <el-form-item label="执行人:">
              <el-select
                v-model="form.executeUserName"
                disabled
                filterable
                class="fullInput"
                placeholder="请选择"
                style="width: 140px;"
              >
                <el-option
                  v-for="(userItem, index) in userList"
                  :key="index"
                  :label="userItem.nickName"
                  :value="userItem.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="执行日期:">
              <el-input v-model="form.inhouseData" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="库房:">
              <el-select v-model="form.whouseId" filterable style="width: 140px;" disabled>
                <el-option
                  v-for="(item, index) in RoomList"
                  :key="index"
                  :label="item.whouseName"
                  :value="item.whouseId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="供应商:">
              <el-select v-model="form.supplierNo" filterable style="width: 140px;" disabled>
                <el-option
                  v-for="(item, index) in supplier"
                  :key="index"
                  :label="item.companyName"
                  :value="item.supplierNo"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="form.iremark" type="textarea" style="width: 200px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <div class="itemment" />
          <div style="margin-top: 10px">
            <el-table
              :data="templateData"
              size="mini"
              height="200"
              border
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="inBatchNumber" label="入库批次号" width="130" />
              <el-table-column prop="materialCode" label="物资编码" width="70" />
              <el-table-column prop="materialName" label="物资名称" show-overflow-tooltip width="70" />
              <el-table-column prop="materialSpec" label="规格" show-overflow-tooltip width="60" />
              <el-table-column prop="unitName" label="物资单位" width="70" />
              <el-table-column prop="purchasePrice" label="物资价格" width="70" />
              <el-table-column prop="quantity" label="入库数量" width="70" />
              <el-table-column prop="availableNumber" label="可用数量" width="70" />
              <el-table-column prop="whouseName" show-overflow-tooltip label="库房" width="60" />
              <el-table-column prop="place" label="产地" width="60" />
              <el-table-column prop="certificateNo" label="注册证号" />
              <el-table-column prop="productionBatch" label="生产批次" />
              <el-table-column prop="startTime" show-overflow-tooltip label="有效起始时间" />
              <el-table-column prop="endTime" show-overflow-tooltip label="有效结束时间" />
              <el-table-column prop="iremark" label="备注" />
            </el-table>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 10px">
          <!-- <el-button type="primary" size="mini" @click="putRemark">保存</el-button>-->
          <el-button size="mini" type="danger" @click="close">关闭</el-button>
        </div>
      </div>
    </sgDialog>
    <!-- 退药退料详情 -->
    <sgDialog :title="form.inDocumentNo" size="900px" :dialog="showDialogReturn" @handleClose="handleCloseReturn">
      <div slot="out">
        <div class="formBody">
          <div class="itemment">退料单
          </div>
          <el-form ref="form" class="mentform" :inline="true" :model="form" size="mini" label-width="100px">
            <el-form-item label="退料单号:">
              <el-input v-model="form.inDocumentNo" :disabled="true" style="width: 140px;" />
            </el-form-item>
            <el-form-item label="执行人:">
              <el-select
                v-model="form.executeUserName"
                :disabled="true"
                :filterable="true"
                class="fullInput" filterable
                placeholder="请选择"
                style="width: 140px;"
              >
                <el-option
                  v-for="(userItem, index) in userList"
                  :key="index"
                  :label="userItem.nickName"
                  :value="userItem.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="执行日期:">
              <el-input v-model="form.inhouseData" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="form.iremark" type="textarea" style="width: 645px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <div class="itemment" />
          <div style="margin-top: 10px">
            <el-table
              :data="templateData"
              size="mini"
              height="200"
              border
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="inBatchNumber" label="入库批次号" width="150" />
              <el-table-column prop="materialCode" label="物资编码" width="150" />
              <el-table-column prop="materialName" label="物资名称" show-overflow-tooltip />
              <el-table-column prop="materialSpec" label="规格" show-overflow-tooltip width="100" />
              <el-table-column prop="unitName" label="物资单位" width="70" />
              <el-table-column prop="quantity" label="退料数量" width="70" />
            </el-table>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 10px">
          <!-- <el-button type="primary" size="mini" @click="putRemark">保存</el-button>-->
          <el-button size="mini" type="danger" @click="handleCloseReturn">关闭</el-button>
        </div>
      </div>
    </sgDialog>
    <sgDialog title="修改入库时间和数量" size="300px" :dialog="showDialogtime" @handleClose="showDialogtime=false">
      <div slot="out">
        <el-form :model="Formdata"  ref="Form">
          <el-form-item prop="time" label="入库时间" style="display: flex;align-items: center" class="cl">
            <el-date-picker
              v-model="Formdata.time"
              type="datetime"
              placeholder="选择入库日期" size="mini" style="width: 150px">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="num" label="入库数量" style="display: flex;align-items: center" class="cl">
           <el-input-number :min="0" placeholder="请输入入库数量" v-model="Formdata.num" size="mini" style="width: 145px"></el-input-number>
          </el-form-item>
        </el-form>
        <div style="height: 50px"></div>
        <div class=""
             style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="ok">确定</el-button>
            <el-button @click="showDialogtime=false" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import moment from 'moment'
import { debounce } from '@/utils/throttleAndDebounce'
import vueEasyPrint from 'vue-easy-print'
import setMealPrint from '@/components/Print/setMealPrint'
import receiptDocs from '@/components/Print/receiptDocs'
import { math } from '@/utils/math'
import { todayTime } from '@/utils/time'

export default {
  name: 'ReceiptDocQuery',
  dicts: ['document_type', 'Material_category'],
  components: {
    slideSearch,
    SgTable,
    sgDialog,
    vueEasyPrint,
    setMealPrint,
    receiptDocs
  },
  data() {
    return {
      // 打印
      print: {},
      showflagtime:false,
      Formdata:{
        time:'',
        num:undefined,
      },
      rules:{
        time:[
          { required: true, message: '请选择入库时间', trigger: 'blur' },
        ],
        num:[
          { required: true, message: '请输入入库数量', trigger: 'blur' },
        ]
      },
      newmessage:'如急急急',
      showDialogtime:false,
      printList: [],
      totalArrears: 0,
      // 弹框
      title: '详情',
      showDialog: false,
      form: {
        inDocumentNo: '', // 入库单号
        executeUserName: '', // 执行人
        inhouseData: '', // 执行日期
        whouseId: '', // 库房
        supplierNo: '', // 供应商
        remark: ''
      },
      showDialogReturn: false,
      templateData: [],
      supplier: [],
      RoomList: [], // 库房
      userList: [],
      // -----
      Summary: {
        insertPrice: 0, // 入库金额汇总
        returnPrice: 0 // 退料金额汇总
      },
      WarehousingRe: 0, // 入库金额汇总（不包括退料金额)
      selectionData: [],
      tableData: [],
      columns: [
        {
          lab: '操作',
          val: 'opera',
          custom: 'opera'
        },
        {
          lab: '入库单号',
          val: 'inDocumentNo',
          custom: 'inDocumentNo',
          width: 250
        },
        {
          lab: '领料部门',
          val: 'returnDepartmentName',
          width: '150'
        },
        {
          lab: '收费单号',
          val: 'inChargeNo',
          width: 170
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          width: 140
        },
        {
          lab: '客户电话',
          val: 'customPhone',
          width: 140
        },
        {
          lab: '生产日期',
          val: 'startTime',
          width: 140
        },
        {
          lab: '失效日期',
          val: 'endTime',
          width: 140
        },
        {
          lab: '执行人',
          val: 'createBy',
          width: 140
        },
        {
          lab: '执行日期',
          val: 'executeDate',
          width: 140
        },

        {
          lab: '库房',
          val: 'whouseName',
          width: 140
        },
        {
          lab: '入库单类型',
          val: 'documentType',
          custom: 'documentType',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '简码',
          val: 'shortCode'
        },
        {
          lab: '物资类型一级',
          width: 140,
          val: 'materialType'
        },
        {
          lab: '物资类型二级',
          width: 140,
          val: 'materialTypeName'
        },
        {
          lab: '物资类型',
          val: 'matTypeName'
        },
        {
          lab: '物资编码',
          width: 140,
          val: 'materialCode'
        },
        {
          lab: '物资名称',
          val: 'materialName',
          width: 140
        },
        {
          lab: '规格',
          val: 'materialSpec',
          showOverflowTooltip: true
        },
        {
          lab: '物资单位',
          val: 'unitName',
          showOverflowTooltip: true
        },
        {
          lab: '正常入库数量',
          width: 140,
          val: 'insertNumber',
          showOverflowTooltip: true
        },
        {
          lab: '剩余数量',
          val: 'availableNumber'
        },
        {
          lab: '进价单价',
          val: 'purchasePrice'
        },
        {
          lab: '进价总额',
          val: 'materialPrice'
        },
        {
          lab: '售价',
          val: 'priceOne'
        },
        {
          lab: '退料数量',
          val: 'returnedQuantity'
        },
        {
          lab: '退料总额',
          val: 'returnAmount'
        },
        {
          lab: '批次号',
          val: 'inBatchNumber',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '供应商',
          val: 'companyName',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '注册证号',
          val: 'certificateNo',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '生产批次号',
          val: 'productionBatch',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '产地',
          val: 'place',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '单据备注',
          val: 'iremark',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '出库单号',
          val: 'outDocumentNo',
          width: 150
        },

        {
          lab: '领料人',
          val: 'ouPerson'
        },
        {
          lab: '盘点单号',
          val: 'inventoryNo',
          width: 140
        },
        {
          lab: '物资备注',
          val: 'iremark',
          width: 140,
          showOverflowTooltip: true
        }
      ],
      options: {
        executeDate: {
          type: 'Tdatetime',
          label: '入库日期：',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        inDocumentNo: {
          type: 'input',
          label: '入库单号：'
        },
        inBatchNumber: {
          type: 'input',
          label: '收费单号：'
        },
        executeUserName: {
          type: 'input',
          label: '操作人：',
          clearable: true,
          options: []
        },
        matType: {
          type: 'cascader',
          label: '物资类型',
          clearable: true,
          options: [],
          props: {}
        },
        shortCode: {
          type: 'input',
          label: '简码'
        },
        materialName: {
          type: 'input',
          label: '物资'
        },
        materialCode: {
          type: 'input',
          label: '物资编码：'
        },
        whouseId: {
          type: 'select',
          label: '库房',
          clearable: true,
          options: []
        },
        supplierNo: {
          type: 'select',
          label: '供应商',
          clearable: true,
          options: []
        },
        documentType: {
          type: 'select',
          label: '入库单类型',
          clearable: true,
          options: []
        },
        inventoryNo: {
          type: 'input',
          label: '盘点单号'
        },
        invalidTime: {
          type: 'Tdatetime',
          clearable: true,
          label: '失效期查询',
          values: []
        },
        availableNumber: {
          type: 'Tinput',
          label: '剩余数量',
          clearable: true,
          values: []
        },
        returnDepartmentId: {
          type: 'select',
          label: '领料部门',
          clearable: true,
          options: []
        },
        remark: {
          type: 'input',
          label: '备注'
        }
      },
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
    }
  },
  created() {
    this.setShowButton=this.$store.getters.setShowButton
    if(!this.setShowButton){
      this.showflagtime=true;
    }
    this.deptId = this.$store.getters.departmentId
    this.options.documentType.options = this.dict.type.document_type
    // this.options.matTypeId.options = this.dict.type.Material_category
    this.getData()
    this.getRoom()
    this.getUserList()
    this.setReturnDepartment()
    this.setMatType()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    newgetData(value) {
      let DateObj = new Date(value)
      // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
      let year = DateObj.getFullYear()
      let month = DateObj.getMonth() + 1
      let day = DateObj.getDate()
      let hh = DateObj.getHours()
      let mm = DateObj.getMinutes()
      let ss = DateObj.getSeconds()
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      if (hh >= 0 && hh <= 9) {
        hh = "0" + hh;
      }
      if (mm >= 0 && mm <= 9) {
        mm = "0" + mm;
      }
      if (ss >= 0 && ss <= 9) {
        ss = "0" + ss;
      }
      // 最终时间
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
    },
    editTime(){
      if(this.selectionData.length==0||this.selectionData.length>1||this.selectionData[0] === undefined){
        this.$message.warning('请选择一条数据进行修改')
        return
      }
      this.Formdata.time=""
      this.Formdata.num=undefined
     this.showDialogtime=true
    },
    ok(){
       if(this.Formdata.time==''&&this.Formdata.num==undefined){
         this.$message.warning('至少填写一项进行提交')
         return
       }
      if(this.Formdata.time==null&&this.Formdata.num==undefined){
        this.$message.warning('至少填写一项进行提交')
        return
      }
      this.$api.confinementRoom.updateInsertListTimeAndData({
        executeDate:this.Formdata.time==""||this.Formdata.time==null?'':this.newgetData(this.Formdata.time),
        insertId:this.selectionData[0].insertId,
        insertNumber:this.Formdata.num
      }).then(res=>{
        if(res.code==200){
          this.$message.success(res.msg)
          this.showDialogtime=false;
          this.getData()
        }
      })
    },
    // 设置物资类型级联选择框
    setMatType() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
        // console.log(res)
        // 设置级联选择多选等属性
        const props = { expandTrigger: 'hover', children: 'sonList', value: 'id', label: 'name', checkStrictly: true }
        this.options.matType.options = res.data
        this.options.matType.props = props
      })
    },
    // 设置领料/退料部门下拉框数据
    setReturnDepartment() {
      const data = {
        deptId: this.deptId,
        status: 0
      }
      this.$api.post.sectionInfoList(data).then(res => {
        res.rows.forEach(item => {
          item.label = item.sectionName
          item.value = item.sectionId
        })
        this.options.returnDepartmentId.options = res.rows
      })
    },
    // 入库单号
    Receipt(val) {
      this.form = val
      this.form.whouseId = val.whouseName // 库房
      this.form.iremark = val.iremark // 备注
      this.form.supplierNo = val.companyName // 供应商
      this.form.insertInfoId = val.insertInfoId
      this.form.inhouseData = val.executeDate // 执行日期
      this.title = val.inDocumentNo
      if (val.documentType === '5' || val.documentType === '10') {
        this.showDialogReturn = true
      } else {
        this.showDialog = true
      }
      this.$api.storageRoom.insertList({ inDocumentNo: val.inDocumentNo }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.quantity = math.add(item.insertNumber + item.returnedQuantity)
            item.amountOfMoney = math.add(item.materialPrice + item.returnAmount)
          })
          this.templateData = res.rows
        }
      })
    },
    /**
     * @author lishang
     * @date 2022/11/8
     * @Description: 暂时将保存注释，等需要的时候启用
     */
    // putRemark() {
    //   // 弹框保存
    //   var data = {
    //     insertInfoId: this.form.insertInfoId,
    //     iremark: this.form.iremark
    //   }
    //   this.$api.storageRoom.insertInfoUpdate(data).then(res => {
    //     if (res) {
    //       this.$message.success('修改成功')
    //       this.getData()
    //       this.showDialog = false
    //     }
    //   })
    // },
    // 搜索
    getData: debounce(function(isSearch) {
      var data = {}
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
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
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = {
        deptId: this.deptId,
        materialCode: data.materialCode, // 物资编码
        executeUserName: data.executeUserName, // 操作人
        begininsertTime: data.executeDate, // 入库时间
        endinsertTime: data.endexecuteDate,
        beginendTime: data.invalidTime, // 失效期查询
        endendTime: data.endinvalidTime,
        beginavailableNumber: data.availableNumber === '' ? null : data.availableNumber, // 剩余数量
        endavailableNumber: data.endavailableNumber === '' ? null : data.endavailableNumber,
        inDocumentNo: data.inDocumentNo, // 入库单号
        inBatchNumber: data.inBatchNumber, // 收费单号
        // matTypeId: data.matTypeId, // 物资类型
        shortCode: data.shortCode, // 简码
        materialName: data.materialName, // 物资
        whouseId: data.whouseId, // 库房
        supplierNo: data.supplierNo, // 供应商
        documentType: data.documentType, // 入库单类型
        inventoryNo: data.inventoryNo, // 盘点单号
        returnDepartmentId: data.returnDepartmentId, // 领料部门
        remark: data.remark, // 备注
        status: '1'
      }

      // 处理物资类型
      if (this.options['matType'].values) {
        data.typeOne = this.options['matType'].values[0] ? this.options['matType'].values[0] : null
        data.typeTwo = this.options['matType'].values[1] ? this.options['matType'].values[1] : null
        data.typeThree = this.options['matType'].values[2] ? this.options['matType'].values[2] : null
      }
      data = Object.assign(data, this.pagination)
      this.tableData = []
      this.$api.storageRoom.selectinsertinfoInboundOrderList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.Summary = res.data
          this.WarehousingRe = math.subtract(this.Summary.insertPrice, this.Summary.returnPrice)
        }
      })
    }, 500),
    // 退供应商
    Retreat() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择先选择库房')
        return
      }
      localStorage.setItem('returnId',JSON.stringify(this.selectionData[0]))
      this.$router.push({ path: 'returnSupplier'})
      sessionStorage.setItem('returnSupplieritem',JSON.stringify(this.selectionData[0]))
    },
    // 打印
    async pinrtlist(val) {
      this.print = {}
      this.printList = []
      this.totalArrears = 0
      await this.$api.storageRoom.insertList({ inDocumentNo: val.inDocumentNo }).then(res => {
        if (res) {
          res.rows.forEach(rest => {
            this.totalArrears = math.add(this.totalArrears, rest.materialPrice, rest.returnAmount)
            rest.quantity = math.add(rest.insertNumber + rest.returnedQuantity)
            rest.amountOfMoney = math.add(rest.materialPrice + rest.returnAmount)
          })
          this.printList = res.rows
        }
      })
      this.print = {
        inDocumentNo: val.inDocumentNo,
        executeUserName: val.executeUserName,
        inhouseData: val.inhouseData,
        executeDate: val.executeDate,
        // whouseId: val.whouseId,
        whouseName: val.whouseName,
        // supplierNo: val.supplierNo,
        companyName: val.companyName,
        documentType: val.documentType,
        totalArrears: this.totalArrears
      }
      let str='';
      this.dict.type.document_type.forEach(value=>{
        if(value.value==val.documentType){
             str=value.label
        }
      })
      if(str.includes('入库单')){

      }else {
        str=str+'入库单'
      }
      let newstr=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      let newstrs=newstr.split('<')[0]
      this.newmessage= newstrs+str;
      this.$nextTick(() => {
        this.$refs.receiptDocs.print()
      })
    },
    // 弹框
    handleClose() {
      this.showDialog = false
    },
    // 关闭退料退药弹框
    handleCloseReturn() {
      this.showDialogReturn = false
    },
    close() {
      this.showDialog = false
    },
    async getRoom() {
      // 供应商
      await this.$api.storageRoom.supplierList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.companyName
            item.value = item.supplierNo
          })
          this.options.supplierNo.options = res.rows
        }
      })
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
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
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      // this.selectionData.push(e[1].pop())
      this.selectionData = e[1]
      this.$delete(this.selectionData, 1)
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
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
      this.$api.user.getUserList({ deptId: this.deptId, status: '0' }).then(res => {
        if (res) {
          this.$forceUpdate()
          const arr1 = this.unique(res.data)
          this.userList = arr1
        }
      })
      // 供应商
      this.$api.storageRoom.supplierList(data).then(res => {
        if (res) {
          this.supplier = res.rows
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';
::v-deep .el-form-item{
  margin-bottom: 5px !important;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .cl .el-date-editor{
  display: flex;
  align-items: center;
}
::v-deep .cl .el-input__inner{
  margin-left: 5px;
  padding: 0px 0px 0px 5px !important;
  text-align: left;
}
::v-deep .el-input-number__decrease{
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}

.container {
  width: 100%;
  height: 100%;
}

span {
  font-size: 14px;
  margin-right: 15px;
}

i {
  display: inline-block;
  margin-right: 5px;
  width: 10px;
  height: 10px;

}

</style>
