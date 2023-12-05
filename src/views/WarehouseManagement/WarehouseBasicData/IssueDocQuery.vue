<template>
  <!--出库单查询-->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="getData(true)" @click.stop="getData(true)">查询</el-button>
        <el-button
          v-has-permi="['confinement:warehouseManagement:exportdelivery']"
          size="mini"
          type="success"
          icon="el-icon-upload2"
          plain
          @click="newexport"
        >导出
        </el-button>
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
          @row-click="rowClick"
          @current-change="currentChange"
          @selection-change="handleSelectionChange"

        >
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />统计信息</span>
            </div>
            <div>
<!--              <span class="spanfont">移库金额汇总：{{ Summary.materialPrice|numberToCurrency }}</span>-->
              <span class="spanfont">出库金额汇总：{{ Summary.materialPrice|numberToCurrency }}</span>
              <span class="spanfont">退料金额汇总：{{ Summary.returnedQuantity|numberToCurrency }}</span>
<!--              <span class="spanfont">科室业绩汇总：{{ Department|numberToCurrency }}</span>-->
            </div>
          </div>
          <div slot="header" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
            </div>
            <div>
              <el-button v-if="showflagtime"  size="mini"  type="primary"  plain icon="el-icon-edit"
                          class="headerBarBtn" @click.stop.native="editTime" v-has-permi="['sorage:outList:updateOutListTimeAndData']">修改出库时间和数量
              </el-button>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'payName'">
              <p style="color: #5f94de;cursor:pointer" @click="expiret(data.custom)">打印</p>
            </div>
            <div v-else-if="data.props === 'documentType'">
              <show-dict-data :options="dict.type.document_type" :value="data.custom.documentType" />
            </div>
            <div v-else-if="data.props === 'drugRecipient'">
              <p>{{ data.custom.drugRecipient }}{{ data.custom.outPerson }}</p>
            </div>
            <div v-else-if="data.props==='inDocumentNo'">
              <a style="color: #5f94de;cursor:pointer" @click="Receipt(data.custom)">{{ data.custom.inDocumentNo }}</a>
            </div>
            <div v-else-if="data.props==='outDocumentNo'">
              <a
                style="color: #5f94de;cursor:pointer"
                @click="outboundOrderClick(data.custom)"
              >{{ data.custom.outDocumentNo }}</a>
            </div>
          </template>
        </sg-table>
      </slot>
      <!--打印出库单-->
      <vue-easy-print ref="outsourcing">
        <outsourcing
          :print="print"
          :message="newmessage"
          :template-list="printList"
        />
      </vue-easy-print>
      <!--打印退供应商-->
      <vue-easy-print ref="returnToSupplierOutsourcing">
        <OutsourcingReturnToSupplier
          :print="print"
          :total="total"
          :message="newmessage"
          :template-list="printList"
        />
      </vue-easy-print>
    </SlideSearch>
    <!--点击入库单号-->
    <sgDialog :title="title" size="900px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <div class="formBody">
          <div class="title">入库单
          </div>
          <el-form ref="form" class="mentform" :inline="true" :model="form" size="mini" label-width="100px">
            <el-form-item label="入库单号:">
              <el-input v-model="form.inDocumentNo" disabled style="width: 140px;" />
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
              <el-select v-model="form.WhouseId" style="width: 140px;" disabled>
                <el-option
                  v-for="(item, index) in RoomList"
                  :key="index"
                  :label="item.whouseName"
                  :value="item.whouseId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="供应商:">
              <el-select v-model="form.supplierNo" style="width: 140px;" disabled>
                <el-option
                  v-for="(item, index) in supplier"
                  :key="index"
                  :label="item.companyName"
                  :value="item.supplierNo"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="form.remark" type="textarea" style="width: 200px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <div class="title">详情</div>
          <div style="margin-top: 10px">
            <el-table
              :data="templateData"
              size="mini"
              height="200"
              border
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="inBatchNumber" label="入库批次号" width="160" />
              <el-table-column prop="materialCode" label="物资编码" width="70" />
              <el-table-column prop="materialName" label="物资名称" show-overflow-tooltip width="100" />
              <el-table-column prop="materialSpec" label="规格" show-overflow-tooltip width="60" />
              <el-table-column prop="unitName" label="物资单位" width="70" />
              <el-table-column prop="materialPrice" label="物资价格" width="70" />
              <el-table-column prop="insertNumber" label="入库数量" width="70" />
              <el-table-column prop="availableNumber" label="可用数量" width="70" />
              <el-table-column prop="whouseName" show-overflow-tooltip label="库房" width="60" />
              <el-table-column prop="place" label="产地" width="60" />
              <el-table-column prop="certificateNo" label="注册证号" show-overflow-tooltip width="70" />
              <el-table-column prop="productionBatch" label="生产批次" />
              <el-table-column prop="startTime" show-overflow-tooltip label="有效起始时间" />
              <el-table-column prop="endTime" show-overflow-tooltip label="有效结束时间" />
              <el-table-column prop="remark" label="备注" />
            </el-table>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 10px">
          <!-- <el-button type="primary" size="mini" @click="putRemark">保存</el-button>-->
          <el-button size="mini" type="danger" @click="handleClose">关闭</el-button>
        </div>
      </div>
    </sgDialog>
    <!--点击出库单号-->
    <sgDialog :title="title" size="900px" :dialog="outboundShowDialog" @handleClose="outboundHandleClose">
      <div slot="out">
        <div class="formBody">
          <div v-if="form.documentType ==='2'" class="title">
            退供应商
          </div>
          <div v-else class="title">
            出库单
          </div>
          <el-form ref="form" class="mentform" :inline="true" :model="form" size="mini" label-width="100px">
            <el-form-item label="出库单号:">
              <el-input v-model="form.outDocumentNo" disabled style="width: 140px;" />
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
              <el-input v-model="form.executeData" disabled style="width: 140px;" />
            </el-form-item>
            <!-- 不是退供应商就显示领料人和领料部门 -->
            <template v-if="form.documentType !=='2' ">
              <el-form-item label="领料人:">
                <el-input v-model="form.outPerson" disabled style="width: 140px;" />
              </el-form-item>
              <el-form-item label="领料部门:">
                <el-input v-model="form.sectionName" disabled style="width: 140px;" />
              </el-form-item>
            </template>
            <el-form-item label="备注:">
              <el-input v-model="form.remark" type="textarea" style="width: 650px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <div class="title">详情</div>
          <div style="margin-top: 10px">
            <el-table
              :data="templateData"
              size="mini"
              height="200"
              border
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="outBatchNumber" label="出库批次号" width="130" />
              <el-table-column prop="matTypeName" label="物资类型" width="70" />
              <el-table-column prop="materialName" label="物资名称" />
              <el-table-column prop="materialSpec" label="规格" />
              <el-table-column prop="unitName" label="物资单位" width="70" />
              <el-table-column prop="outNumber" label="出库数量" width="70" />
              <el-table-column prop="whouseName" label="出库库房" width="120" />
              <el-table-column prop="remark" label="备注" />
            </el-table>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 10px">
          <!-- <el-button type="primary" size="mini" @click="putRemark">保存</el-button>-->
          <el-button size="mini" type="danger" @click="outboundHandleClose">关闭</el-button>
        </div>
      </div>
    </sgDialog>
    <sgDialog title="修改出库时间和数量" size="300px" :dialog="showDialogtime" @handleClose="showDialogtime=false">
      <div slot="out">
        <el-form :model="Formdata"  ref="Form">
          <el-form-item prop="time" label="出库时间" style="display: flex;align-items: center" class="cl">
            <el-date-picker
              v-model="Formdata.time"
              type="datetime"
              placeholder="选择出库日期" size="mini" style="width: 150px">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="num" label="出库数量" style="display: flex;align-items: center" class="cl">
            <el-input-number placeholder="请输入出库数量"  :min="0" v-model="Formdata.num" size="mini" style="width: 145px"></el-input-number>
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
import { debounce } from '@/utils/throttleAndDebounce'
import { math } from '@/utils/math'
// 打印
import vueEasyPrint from 'vue-easy-print'
import outsourcing from '@/components/Print/outsourcing'
import OutsourcingReturnToSupplier from '@/components/Print/outsourcingReturnToSupplier'
import moment from 'moment'
import { todayTime } from '@/utils/time'

export default {
  name: 'ReceiptDocQuery',
  dicts: ['document_type', 'whether', 'Material_category'],
  components: {
    OutsourcingReturnToSupplier,
    slideSearch,
    SgTable,
    sgDialog,
    vueEasyPrint,
    outsourcing
  },
  data() {
    return {
      // 弹框
      title: '详情',
      showDialogtime:false,
      selectionData:[],
      Formdata:{
        time:'',
        num:undefined,
      },
      rules:{
        time:[
          { required: true, message: '请选择出库时间', trigger: 'blur' },
        ],
        num:[
          { required: true, message: '请输入出库数量', trigger: 'blur' },
        ]
      },
      newmessage:"",
      showDialog: false,
      outboundShowDialog: false,
      RoomList: [],
      userList: [],
      supplier: [],
      templateData: [],
      form: {
        inDocumentNo: '', // 入库单号
        executeUserName: '', // 执行人
        inhouseData: '', // 执行日期
        WhouseId: '', // 库房
        supplierNo: '', // 供应商
        remark: ''
      },
      // 打印
      print: {},
      printList: [],
      total: [],
      Summary: {
        materialPriceSum: 0, // 出库金额汇总
        returnAmountSum: 0 // 退料金额汇总
      },
      Department: 0, // 科室业绩汇总
      tableData: [],
      columns: [
        {
          lab: '操作',
          val: 'payName',
          custom: 'payName'
        },
        {
          lab: '单据号',
          val: 'outDocumentNo',
          custom: 'outDocumentNo',
          width: 160
        },
        {
          lab: '源入库单号',
          val: 'inDocumentNo',
          custom: 'inDocumentNo',
          width: 160
        },
        {
          lab: '收费单号',
          val: 'outChargeNo',
          width: 165
        },
        {
          lab: '源库房',
          val: 'oldwhouseName',
          width: 130
        },
        {
          lab: '目标库房',
          val: 'newwhouseName',
          width: 130
        },
        {
          lab: '单据类型',
          val: 'documentType',
          custom: 'documentType',
          width: 140
        },
        {
          lab: '客户姓名',
          width: 140,
          val: 'customerName'
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '客户电话',
          val: 'customPhone',
          width: 120
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
          lab: '治疗时间',
          val: '',
          width: 140
        },
        {
          lab: '简码',
          width: 140,
          val: 'shortCode'
        },
        {
          lab: '执行人',
          val: 'executeUserName',
          width: 100
        },
        {
          lab: '执行日期',
          val: 'executeData',
          width: 140
        },
        {
          lab: '领料部门',
          val: 'sectionName',
          width: 140
        },
        {
          lab: '领料人',
          val: 'drugRecipient',
          width: 140,
          custom: 'drugRecipient'
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
          lab: '物资类型三级',
          width: 140,
          val: 'matTypeName'
        },
        {
          lab: '物资编码',
          width: 140,
          val: 'materialCode',
          showOverflowTooltip: true
        },
        {
          lab: '物资名称',
          val: 'materialName',
          width: 140
        },
        {
          lab: '物资单位',
          width: 140,
          val: 'unitName',
          showOverflowTooltip: true
        },
        {
          lab: '规格',
          width: 140,
          val: 'materialSpec',
          showOverflowTooltip: true
        },
        {
          lab: '批次号',
          val: 'outBatchNumber',
          width: 160
        },
        {
          lab: '供应商',
          val: 'companyName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '出库数量',
          width: 140,
          val: 'outNumber'
        },
        {
          lab: '进价单价',
          width: 140,
          val: 'purchasePrice'
        },
        {
          lab: '进价总金额',
          width: 120,
          val: 'materialPrice'
        },
        {
          lab: '零售价',
          width: 140,
          val: ''
        },
        {
          lab: '退料数量',
          width: 140,
          val: 'returnedQuantity'
        },
        {
          lab: '退料金额',
          width: 140,
          val: 'returnAmount'
        },
        {
          lab: '科室业绩',
          width: 140,
          val: ''
        },
        {
          lab: '盘点单号',
          val: 'inventoryNo',
          width: 160
        },
        {
          lab: '单据备注',
          width: 140,
          val: 'orderRemark'
        },
        {
          lab: '物资备注',
          val: 'remark',
          width: 100,
          showOverflowTooltip: true
        }
      ],
      options: {
        OutTime: {
          type: 'Tdatetime',
          label: '出库日期：',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        cusromerName: {
          type: 'input',
          label: '客户姓名：'
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },
        customCardNumber: {
          type: 'input',
          label: '卡号：'
        },
        materialCode: {
          type: 'input',
          label: '物资编码：'
        },
        outDocumentNo: {
          type: 'input',
          label: '单据号：'
        },
        executePerso: {
          type: 'input',
          label: '操作人：'
        },
        sectionId: {
          type: 'select',
          label: '领料部门：',
          clearable: true,
          options: []
        },
        departmentId: {
          type: 'select',
          label: '科室：',
          clearable: true,
          options: []
        },
        pickingMaterials: {
          type: 'select',
          label: '领料物资是否使用：',
          clearable: true,
          options: []
        },
        supplierNo: {
          type: 'select',
          label: '供应商：',
          clearable: true,
          options: []
        },
        outPerson: {
          type: 'input',
          label: '领料人：'
        },
        documentType: {
          type: 'select',
          label: '单据类型：',
          clearable: true,
          options: []
        },
        shortCode: {
          type: 'input',
          label: '简码：'
        },
        matType: {
          type: 'cascader',
          label: '物资类型',
          clearable: true,
          options: [],
          props: {}
        },
        materialName: {
          type: 'input',
          label: '物资：'
        },
        remark: {
          type: 'input',
          label: '物资备注：'
        },
        WhouseId: {
          type: 'select',
          label: '源库房',
          clearable: true,
          options: []
        },
        newWhouseId: {
          type: 'select',
          label: '目标库房',
          clearable: true,
          options: []
        },
        inventoryNo: {
          type: 'input',
          label: '盘点单号'
        },
        outChargeNo: {
          type: 'input',
          label: '收费单号：'
        }
      },
      showflagtime:false,
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
      this.getRoom()
      this.getData()
      this.department()
      this.setReturnDepartment()
      this.setMatType()
    }
  },
  created() {
    this.setShowButton=this.$store.getters.setShowButton
    if(!this.setShowButton){
      this.showflagtime=true;
    }
    this.deptId = this.$store.getters.departmentId
    this.options.documentType.options = this.dict.type.document_type
    this.options.pickingMaterials.options = this.dict.type.whether
    this.getData()
    this.getRoom()
    this.department()
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
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
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
      // this.$refs.Form.validate((valid) => {
      //   if (valid) {
      if(this.Formdata.time==''&&this.Formdata.num==undefined){
        this.$message.warning('至少填写一项进行提交')
        return
      }
      if(this.Formdata.time==null&&this.Formdata.num==undefined){
        this.$message.warning('至少填写一项进行提交')
        return
      }
          this.$api.confinementRoom.updateOutListTimeAndData({
            executeDate:this.Formdata.time==null||this.Formdata.time==""?'':this.newgetData(this.Formdata.time),
            outId:this.selectionData[0].outId,
            outNumber:this.Formdata.num
          }).then(res=>{
            if(res.code==200){
              this.$message.success(res.msg)
              this.showDialogtime=false;

              this.getData()
            }
          })
        // } else {
        //   console.log('error submit!!');
        //   return false;
        // }
      // });
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
        this.options.sectionId.options = res.rows
      })
    },
    newexport() {
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data['begin' + k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data['begin' + k] = ''
            data['end' + k] = ''
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data['begin' + k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data['begin' + k] = ''
            data['end' + k] = ''
          } else {
            if (this.options[k].values === '') {
              data[k] = undefined
            } else {
              data[k] = this.options[k].values
            }
          }
        }
        if (this.options[k].values === '') {
          data[k] = undefined
        } else {
          data[k] = this.options[k].values
        }
      }
      data = {
        deptId: this.deptId,
        customPhone: data.customPhone, // 电话
        customCardNumber: data.customCardNumber, // 卡号
        outDocumentNo: data.outDocumentNo, // 单据号
        departmentId: data.departmentId, // 科室
        supplierNo: data.supplierNo, // 供应商
        documentType: data.documentType, // 单据类型
        matTypeId: data.matTypeId, // 物资类型
        materialName: data.materialName, // 物资
        remark: data.remark, // 备注
        inventoryNo: data.inventoryNo, // 盘点单号
        outChargeNo: data.outChargeNo, // 收费单号
        status: '1',
        WhouseId: data.WhouseId, // 源库房
        params: {
          executeUserName: data.executePerso, // 操作人
          materialCode: data.materialCode, // 物资编码
          outPerson: data.outPerson, // 领料人
          cusromerName: data.cusromerName, // 姓名
          newWhouseId: data.newWhouseId, // 目标库房
          sectionId: data.sectionId, // 领料部门
          pickingMaterials: data.pickingMaterials, // 领料物资是否使用
          shortCode: data.shortCode, // 简码
          beginOutTime: data.beginOutTime, // 出库时间
          endOutTime: data.endOutTime
        }
      }
      if (this.options['matType'].values) {
        data.typeOne = this.options['matType'].values[0] ? this.options['matType'].values[0] : null
        data.typeTwo = this.options['matType'].values[1] ? this.options['matType'].values[1] : null
        data.typeThree = this.options['matType'].values[2] ? this.options['matType'].values[2] : null
      }
      this.tableData = []
      this.$api.modules.storageRoom.selectOutlist(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.Summary = res.data
          this.Department = math.subtract(res.data.materialPrice, res.data.returnedQuantity)
        }
      }).finally(() => {
        this.$export('#out-table', '出库单查询')
        // setInterval(() => {
        //   this.submitLoading = false
        // }, 5000)
      })
    },
    // 入库单号
    Receipt(val) {
      this.form = val
      this.form.WhouseId = val.whouseName // 库房
      this.form.remark = val.mremark // 备注
      this.form.supplierNo = val.companyName // 供应商
      this.form.insertInfoId = val.insertInfoId
      this.form.inhouseData = val.executeData // 执行日期
      this.title = val.inDocumentNo
      this.showDialog = true
      this.$api.storageRoom.insertList({ inDocumentNo: val.inDocumentNo }).then(res => {
        if (res) {
          this.templateData = res.rows
        }
      })
    },
    // 点击出库单号
    outboundOrderClick(val) {
      this.form = val
      this.form.remark = val.mremark // 备注
      this.form.executeData = val.executeData // 执行日期
      this.title = val.outDocumentNo
      this.outboundShowDialog = true
      // 请求单据详情
      this.$api.storageRoom.outList({ outDocumentNo: val.outDocumentNo }).then(res => {
        if (res) {
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
    // // 弹框保存
    //   var data = {
    //     insertInfoId: this.form.insertInfoId,
    //     remark: this.form.remark
    //   }
    //   this.$api.storageRoom.insertInfoUpdate(data).then(res => {
    //     if (res) {
    //       this.$message.success('修改成功')
    //       this.getData()
    //       this.showDialog = false
    //     }
    //   })
    // },
    // 弹框
    handleClose() {
      this.showDialog = false
    },
    // 弹框
    outboundHandleClose() {
      this.outboundShowDialog = false
    },
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data['begin' + k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data['begin' + k] = ''
            data['end' + k] = ''
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data['begin' + k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data['begin' + k] = ''
            data['end' + k] = ''
          } else {
            if (this.options[k].values === '') {
              data[k] = undefined
            } else {
              data[k] = this.options[k].values
            }
          }
        }
        if (this.options[k].values === '') {
          data[k] = undefined
        } else {
          data[k] = this.options[k].values
        }
      }
      data = {
        deptId: this.deptId,
        customPhone: data.customPhone, // 电话
        customCardNumber: data.customCardNumber, // 卡号
        outDocumentNo: data.outDocumentNo, // 单据号
        departmentId: data.departmentId, // 科室
        supplierNo: data.supplierNo, // 供应商
        documentType: data.documentType, // 单据类型
        // matTypeId: data.matTypeId, // 物资类型
        materialName: data.materialName, // 物资
        remark: data.remark, // 备注
        inventoryNo: data.inventoryNo, // 盘点单号
        outChargeNo: data.outChargeNo, // 收费单号
        status: '1',
        WhouseId: data.WhouseId, // 源库房
        params: {
          executeUserName: data.executePerso, // 操作人
          materialCode: data.materialCode, // 物资编码
          outPerson: data.outPerson, // 领料人
          cusromerName: data.cusromerName, // 姓名
          newWhouseId: data.newWhouseId, // 目标库房
          sectionId: data.sectionId, // 领料部门
          pickingMaterials: data.pickingMaterials, // 领料物资是否使用
          shortCode: data.shortCode, // 简码
          beginOutTime: data.beginOutTime, // 出库时间
          endOutTime: data.endOutTime
        }
      }
      // 处理物资类型
      if (this.options['matType'].values) {
        data.typeOne = this.options['matType'].values[0] ? this.options['matType'].values[0] : null
        data.typeTwo = this.options['matType'].values[1] ? this.options['matType'].values[1] : null
        data.typeThree = this.options['matType'].values[2] ? this.options['matType'].values[2] : null
      }
      data = Object.assign(data, this.pagination)
      this.tableData = []
      this.$api.storageRoom.selectOutlist(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.Summary = res.data
          this.Department = math.subtract(res.data.materialPrice, res.data.returnedQuantity)
        }
      })
    }, 500),
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
          this.options.newWhouseId.options = res.data
        }
      })
      await this.$api.storageRoom.selectOutWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.whouseName
            item.value = item.whouseId
          })
          this.options.WhouseId.options = res.data
        }
      })
    },
    // 获取科室的列表
    department() {
      /**
       * @author 李尚
       * @date 2022/10/13
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.netPower.projectTreeselect(data).then(res => {
        if (res) {
          res.data.forEach((item) => {
            item.value = item.departmentId
            item.label = item.departmentName
          })
          this.options.departmentId.options = res.data
        }
      })
    },
    // 打印
    expiret(val) {
      this.printList = []
      this.print = val
      this.total = []
      let totalMoney = 0
      this.$api.storageRoom.outList({ outDocumentNo: val.outDocumentNo }).then(res => {
        if (res) {
          this.printList = res.rows
          this.printList[0].customerName=this.print.customerName
          this.printList[0].customCardNumber=this.print.customCardNumber
          res.rows.forEach(item => {
            totalMoney = math.add(totalMoney, item.materialPrice)
          })
          this.total.push({ label: '合计金额：', totalMoney: totalMoney })
        }
        let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
        let newstr=str.split('<')[0]
        this.newmessage=newstr;
        let that=this;
        setTimeout(function (){
          if (val.documentType === '2') {
            that.$refs.returnToSupplierOutsourcing.print()
          } else {
            that.$refs.outsourcing.print()
          }
        },300)
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
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';
::v-deep .el-form-item{
  margin-bottom: 5px !important;
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
::v-deep thead .el-table-column--selection .cell {
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

.spanfont {
  font-size: 12px;
  color: #949597;
}

.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 20px 20px 20px 20px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 0;

  .title {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}
</style>
