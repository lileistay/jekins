<template>
  <!-- 外购入库 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          v-has-permi="['sorage:insertInfo:list']"
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
          icon="el-icon-document"
          type="success"
          plain
          v-has-permi="['sorage:insertInfo:export']"

          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          ref="table"
          id="out-table"
          :table-data="tableData"
          index="序号"
          size="mini"
          border
          selection
          :sg-ref="'multipleTable'"
          :columns="columns"
          :pagination="pagination"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="header-float ">
            <div style="font-size: 14px;">统计信息</div>
            <div style="font-size: 14px; color: darkgrey;">
              <span>(已执行)进价汇总:{{ statistics.executed }}</span>
              &nbsp;&nbsp;
              <span>进价汇总:{{ statistics.total }}</span>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props==='inDocumentNo'">
              <a
                :class="{redStr: data.custom.status == '0'}"
                style="color: #5f94de;cursor:pointer"
                @click="Receipt(data.custom)"
              >{{ data.custom.inDocumentNo }}</a>
              <p :class="{redStr: data.custom.status !== '0'}">{{ data.custom.inDocumentNo }}</p>
            </div>
            <div v-else-if="data.props==='status'">
              <p>{{ data.custom.status == '0' ? '已审核/未执行' : '已审核/已执行' }}</p>
            </div>
            <!--            <div v-else-if="data.props==='documentType'">-->
            <!--              <p>{{ data.custom.documentType === '1' ? '外购入库': '退供应商' }}</p>-->
            <!--            </div>-->
            <div v-else-if="data.props === 'documentType'">
              <show-dict-data :options="dict.type.document_type" :value="data.custom.documentType" />
            </div>
            <div v-else-if="data.props==='opera'">
              <p
                :class="{redStr: data.custom.status !== '0'}"
                style="color: #5f94de;cursor:pointer"
                @click="modify(data.custom)"
              >编辑</p>
              <p :class="{redStr: data.custom.status == '0'}" style="color: #5f94de;cursor:pointer">---</p>
            </div>
            <div v-else-if="data.props==='print'">
              <p :class="{redStr: data.custom.status !== '0'}"> --- </p>
<!--              <i-->
<!--                :class="{redStr: data.custom.status == '0'}"-->
<!--                style="font-size: 19px;color: red"-->
<!--                class="el-icon-printer"-->
<!--                @click="pinrtlist(data.custom)"-->
<!--              />-->
              &nbsp;
              <i
                :class="{redStr: data.custom.status == '0'}"
                style="font-size: 19px;color: #3aa1ff"
                class="el-icon-printer"
                @click="pinrtlist(data.custom)"
              />
            </div>
          </template>
          <div slot="header" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单 <span
              style="font-size: 12px;"
            >点击单号查看单据详情</span></div>
            <div>
              <el-button v-hasPermi="['confinement:customerCmt:comeedit']" size="mini" type="info" plain icon="el-icon-download"
                         class="headerBarBtn" @click.stop.native="importCustomer">导入入库信息
              </el-button>
              <el-button v-if="showflagtime"  size="mini"  type="primary"  plain icon="el-icon-edit"
                         class="headerBarBtn" v-has-permi="['sorage:insertInfo:updateInsertTime']" @click.stop.native="editTime">修改入库时间
              </el-button>
              <el-button
                v-hasPermi="['sorage:insertInfo:add']"
                size="mini"
                icon="el-icon-plus"
                type="primary"
                @click="getEnter"
              >入库
              </el-button>
              <el-button
                v-hasPermi="['sorage:outInfo:add']"
                size="mini"
                icon="el-icon-back"
                type="success"
                @click="retreat"
              >退供应商
              </el-button>
            </div>
          </div>
        </SgTable>
      </slot>
      <!--打印-->
      <vue-easy-print ref="receiptDoc">
        <receiptDoc
          :print="print"
          :message="newmessage"
          :template-list="printList"
        />
      </vue-easy-print>
    </slideSearch>
    <!--点击单号-->
    <sgDialog :title="title" size="900px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <div class="formBody">
          <div class="itemment">入库单
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
              <el-input v-model="form.remark" type="textarea" style="width: 200px;" />
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
              <el-table-column prop="materialCode" label="物资编码" :show-overflow-tooltip="true" width="70" />
              <el-table-column
                prop="materialName"
                label="物资名称"
                :show-overflow-tooltip="true"
                width="70"
              />
              <el-table-column prop="materialSpec" :show-overflow-tooltip="true" label="规格" width="60" />
              <el-table-column prop="unitName" label="物资单位" width="70" />
              <el-table-column prop="purchasePrice" label="物资价格" width="70" />
              <el-table-column prop="insertNumber" label="入库数量" width="70" />
              <el-table-column prop="availableNumber" label="可用数量" width="70" />
              <el-table-column prop="whouseName" label="库房" :show-overflow-tooltip="true" width="100" />
              <el-table-column prop="place" :show-overflow-tooltip="true" label="产地" width="60" />
              <el-table-column prop="certificateNo" :show-overflow-tooltip="true" label="注册证号" />
              <el-table-column prop="productionBatch" :show-overflow-tooltip="true" label="生产批次" />
              <el-table-column prop="startTime" :show-overflow-tooltip="true" label="有效起始时间" />
              <el-table-column prop="endTime" :show-overflow-tooltip="true" label="有效结束时间" />
              <el-table-column prop="remark" :show-overflow-tooltip="true" label="备注" />
            </el-table>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 10px">
          <el-button type="primary" size="mini" @click="putRemark">保存</el-button>
          <el-button size="mini" type="danger" @click="close">关闭</el-button>
        </div>
      </div>
    </sgDialog>
    <import-template ref="import" :upload="upload" @downloadTemplate="downloadTemplate" @handleFileClose="handleFileClose"
                     @handleFileUploadProgress="handleFileUploadProgress" @handleFileSuccess="handleFileSuccess"
                     @handleFileError="handleFileError" @submitFileForm="submitFileForm" />
    <sgDialog title="修改入库时间" size="350px" :dialog="showDialogtime" @handleClose="showDialogtime=false">
      <div slot="out">
        <el-form :model="Formdata" :rules="rules" ref="Form">
          <el-form-item prop="time" label="入库时间" style="display: flex;align-items: center" >
            <div class="cl">
              <el-date-picker
                v-model="Formdata.time"
                type="datetime"
                placeholder="选择入库日期" size="mini">
              </el-date-picker>
            </div>

          </el-form-item>
        </el-form>
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
import { todayTime } from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce'
import importTemplate from '@/components/ImportTemplate'
// 打印
import vueEasyPrint from 'vue-easy-print'
import setMealPrint from '@/components/Print/setMealPrint'
import receiptDoc from '@/components/Print/receiptDoc'
import { math } from '@/utils/math'
import moment from 'moment' // 防抖
export default {
  dicts: ['document_type'],
  name: 'ChargeType',
  components: {
    slideSearch,
    SgTable,
    sgDialog,
    vueEasyPrint,
    setMealPrint,
    receiptDoc,
    importTemplate
  },
  data() {
    return {
      // 打印
      print: {},
      Formdata:{
        time:''
      },
      rules:{
        time:[
          { required: true, message: '请选择入库时间', trigger: 'blur' },
        ]
      },
      showDialogtime:false,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 上传的地址
        url: '/api/sorage/insertInfo/importInstall',
        type:'come',

      },
      newmessage:"",
      printList: [],
      totalArrears: 0,
      // 弹框
      title: '详情',
      showDialog: false,
      // 入库单
      form: {
        inDocumentNo: '', // 入库单号
        executeUserName: '', // 执行人
        inhouseData: '', // 执行日期
        whouseId: '', // 库房
        supplierNo: '', // 供应商
        remark: ''
      },
      templateData: [],
      supplier: [],
      RoomList: [], // 库房
      userList: [],
      // 列表
      tableData: [],
      columns: [
        {
          lab: '操作',
          val: 'opera',
          custom: 'opera'
        },
        {
          lab: '打印',
          val: 'print',
          custom: 'print',
          width: 50
        },
        {
          lab: '入库单号',
          val: 'inDocumentNo',
          custom: 'inDocumentNo',
          width: 160
        },
        {
          lab: '执行人',
          val: 'executeUserName'
        },
        {
          lab: '操作日期',
          val: 'inhouseData',
          width: 160

        },
        {
          lab: '供应商',
          val: 'companyName',
          showOverflowTooltip: true,
          width: 260
        },
        {
          lab: '库房',
          val: 'whouseName'
        },
        {
          lab: '入库单类型',
          val: 'documentType',
          custom: 'documentType'
        },
        {
          lab: '进价总额',
          val: 'totalPrice'
        },
        {
          lab: '备注',
          val: 'remark',
          showOverflowTooltip: true
        },
        {
          lab: '单据状态',
          val: 'status',
          width: 100,
          custom: 'status'
        }
      ],
      selectionData: [],
      options: {
        inhouseData: {
          type: 'Tdatetime',
          label: '入库日期：',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        inDocumentNo: {
          type: 'input',
          label: '入库单号：'
        },
        executeUserName: {
          type: 'input',
          label: '操作人：'
        },
        // materName: {
        //   type: 'input',
        //   label: '物资名称：',
        //   values: null
        // },
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
        remark: {
          type: 'input',
          label: '备注'
        }
      }, // 查询参数
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      statistics: {},
      showflagtime:false,
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
      this.getRoom()
      this.getsupplier()
      this.getUserList()
    }
  },
  created() {
    this.setShowButton=this.$store.getters.setShowButton
    if(!this.setShowButton){
      this.showflagtime=true;
    }
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getRoom()
    this.getsupplier()
    this.getUserList()
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
      this.Formdata.time=''
      this.showDialogtime=true;
    },
    ok(){
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.$api.confinementRoom.updateInsertTime({
            executeDate:this.newgetData(this.Formdata.time),
            inDocumentNo:this.selectionData[0].inDocumentNo
          }).then(res=>{
            if(res.code==200){
              this.$message.success(res.msg)
              this.showDialogtime=false
              this.selectionData=[]
              this.getData()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitFileForm() {
      // this.$refs.upload.submit()
    },
    handleFileError() {
      this.upload.open = false
      this.upload.isUploading = false
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.getData()
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileClose() {
      this.upload.open = false
    },
    downloadTemplate() {
      this.$api.netPower.importTemplate()
    },
    importCustomer() {
      this.upload.title = '入库导入'
      this.upload.open = true
    },
    // 入库单号
    Receipt(val) {
      this.form = val
      console.log(this.form ,'this.form this.form ')
      this.form.insertInfoId = val.insertInfoId
      this.title = val.inDocumentNo
      this.showDialog = true
      this.$api.storageRoom.insertList({ inDocumentNo: val.inDocumentNo }).then(res => {
        if (res) {
          this.templateData = res.rows
        }
      })
    },
    // 弹框保存
    putRemark() {
      var data = {
        insertInfoId: this.form.insertInfoId,
        remark: this.form.remark
      }
      this.$api.storageRoom.insertInfoUpdate(data).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.getData()
          this.showDialog = false
        }
      })
    },
    // 打印
    async pinrtlist(val) {
      this.printList = []
      this.print = {}
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
        whouseId: val.whouseId,
        whouseName: val.whouseName,
        supplierNo: val.supplierNo,
        companyName: val.companyName,
        totalArrears: this.totalArrears
      }
      let bill=''
      this.dict.type.document_type.forEach(value=>{
        if(value.value==val.documentType){
          bill=value.label
        }
      })
      let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      let newstr=str.split('<')[0]

      if(bill.includes('入库单')){
        this.newmessage=newstr+bill;
      }else{
        this.newmessage=newstr+bill+'入库单';
      }

      this.$nextTick(() => {
        this.$refs.receiptDoc.print()
      })
    },
    // 弹框
    handleClose() {
      this.showDialog = false
    },
    close() {
      this.showDialog = false
    },
    // 入库
    getEnter() {
      this.$router.push({ path: 'Warehousing' })
    },
    // 编辑
    modify(val) {
      this.$router.push({ path: 'Warehousing', query: { item: val }})
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
    // 退供应商
    retreat() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请先选中客户')
        return
      }
      localStorage.setItem('returnId',JSON.stringify(this.selectionData[0]))
      this.$router.push({ path: 'returnSupplier'})
      sessionStorage.setItem('returnSupplieritem',JSON.stringify(this.selectionData[0]))
    },
    // 获取数据
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
        inhouseData: data.inhouseData === undefined ? null : data.inhouseData,
        endinhouseData: data.endinhouseData === undefined ? null : data.endinhouseData,
        deptId: this.deptId,
        inDocumentNo: this.options.inDocumentNo.values,
        executeUserName: this.options.executeUserName.values,
        whouseId: this.options.whouseId.values,
        supplierNo: this.options.supplierNo.values,
        remark: this.options.remark.values,
        documentType: '1'
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.insertInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.statistics.notExecuted = res.data[0] ? res.data[0].totalMaterialPrice : 0
          this.statistics.executed = res.data[1] ? res.data[1].totalMaterialPrice : 0
          this.statistics.total = this.statistics.notExecuted + this.statistics.executed
        }
      })
    }),
    // 导出
    Export() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
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
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = {
        inhouseData: data.inhouseData === undefined ? null : data.inhouseData,
        endinhouseData: data.endinhouseData === undefined ? null : data.endinhouseData,
        deptId: this.deptId,
        inDocumentNo: this.options.inDocumentNo.values,
        executeUserName: this.options.executeUserName.values,
        whouseId: this.options.whouseId.values,
        supplierNo: this.options.supplierNo.values,
        remark: this.options.remark.values,
        documentType: '1'
      }
      data = Object.assign(data)
      this.$api.storageRoom.insertInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        this.$export('#out-table', '外购入库')
        // setInterval(() => {
        //   this.submitLoadings = false
        // }, 5000)
      })
      // console.log('导出')
    },
    getRoom() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      this.$api.storageRoom.selectInWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.whouseName
            item.value = item.whouseId
          })
          this.options.whouseId.options = res.data
        }
      })
    },
    getsupplier() {
      this.$api.storageRoom.supplierList({ deptId: this.deptId }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.companyName
            item.value = item.supplierNo
          })
          this.options.supplierNo.options = res.rows
        }
      })
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    getUserList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.userList = arr1
        }
      })
      const data1 = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      // 库房
      this.$api.storageRoom.selectInWarehouseAuthoritiesByUserId(data1).then(res => {
        if (res) {
          this.RoomList = res.data
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

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';
::v-deep .cl .el-date-editor{
  display: flex;
  align-items: center;
}
::v-deep .cl .el-input__inner{
  margin-left: 5px;
}
.redStr {
  display: none;
}

.container {
  width: 100%;
  height: 100%;
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

.formBody {
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 5px 10px 10px 10px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 10px 0 10px;

  .itemment {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #75deca;
  }
}
</style>
