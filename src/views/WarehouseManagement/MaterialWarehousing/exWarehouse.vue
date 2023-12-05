<template>
  <!-- 领料出库 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          v-has-permi="['sorage:outInfo:list']"
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
          v-has-permi="['ssorage:outInfo:export']"

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
          :sg-ref="'multipleTable'"
          index="序号"
          size="mini"
          border
          selection
          :columns="columns"
          :pagination="pagination"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单 <span style="font-size: 12px;">点击单号查看单据详情</span></div>
            <div>
              <el-button v-if="showflagtime"  size="mini"  type="primary"  plain icon="el-icon-edit"
                          class="headerBarBtn" @click.stop.native="editTime" v-has-permi="['sorage:outInfo:updateOutTime']">修改出库时间
              </el-button>
              <el-button size="mini" icon="el-icon-back" type="primary" @click="getOut">出库</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" type="success" @click="retreat">退料</el-button>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'documentType'">
              <show-dict-data :options="dict.type.document_type" :value="data.custom.documentType" />
            </div>
            <div v-else-if="data.props === 'statets'">
              <p />
              <p :class="{redStr: data.custom.status == '0'}"> 已审核/已执行 </p>
              <p :class="{redStr: data.custom.status !== '0'}">未执行</p>
            </div>
            <div v-else-if="data.props === 'payName'">
              <p :class="{redStr: data.custom.status !== '0'}"> --- </p>
              <p :class="{redStr: data.custom.status == '0'}" style="color: #5f94de;cursor:pointer" @click="expiret(data.custom)">打印</p>
            </div>
            <div v-else-if="data.props === 'outDocumentNo'">
              <p :class="{redStr: data.custom.status !== '0'}">{{ data.custom.outDocumentNo }}</p>
              <a :class="{redStr: data.custom.status == '0'}" style="color: #5f94de;cursor:pointer" @click="Receipt(data.custom)">{{ data.custom.outDocumentNo }}</a>
            </div>
            <div v-else-if="data.props === 'caozuo'">
              <p :class="{redStr: data.custom.status == '0'}"> --- </p>
              <a :class="{redStr: data.custom.status !== '0'}" style="color: #5f94de;cursor:pointer" @click="handlecompile(data.custom)">编辑</a>
            </div>
          </template>
        </SgTable>
      </slot>
      <!--打印-->
      <vue-easy-print ref="outsourcing">
        <outsourcing
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
          <div class="itemment">出库单
          </div>
          <el-form ref="form" class="mentform" :inline="true" :model="form" size="mini" label-width="100px">
            <el-form-item label="出库单号:">
              <el-input v-model="form.outDocumentNo" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="执行人:">
              <el-input v-model="form.executeUserName" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="执行日期:">
              <el-input v-model="form.executeData" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="领料人员:">
              <el-input v-model="form.outPerson" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="领料部门:">
              <el-select v-model="form.departmentId" filterable disabled style="width: 140px;">
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.sectionName"
                  :value="item.sectionId"
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
              <el-table-column prop="materialName" label="物资名称" width="180" />
              <el-table-column prop="matTypeName" label="物资类型" show-overflow-tooltip width="70" />
              <el-table-column prop="materialSpec" show-overflow-tooltip label="规格" />
              <el-table-column prop="unitName" label="单位" width="60" />
              <el-table-column prop="outNumber" label="出库数量" width="70" />
              <el-table-column prop="whouseName" label="出库库房" width="70" />
              <el-table-column prop="remark" show-overflow-tooltip label="备注" />
            </el-table>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 10px">
          <el-button type="primary" size="mini" @click="putRemark">保存</el-button>
          <el-button size="mini" type="danger" @click="close">关闭</el-button>
        </div>
      </div>
    </sgDialog>
    <sgDialog title="修改出库时间" size="350px" :dialog="showDialogtime" @handleClose="showDialogtime=false">
      <div slot="out">
        <el-form :model="Formdata" :rules="rules" ref="Form">
          <el-form-item prop="time" label="出库时间" style="display: flex;align-items: center" class="cl">
            <el-date-picker
              v-model="Formdata.time"
              type="datetime"
              placeholder="选择出库日期" size="mini">
            </el-date-picker>
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
// 打印
import vueEasyPrint from 'vue-easy-print'
import setMealPrint from '@/components/Print/setMealPrint'
import outsourcing from '@/components/Print/outsourcing'
import moment from 'moment'
import tree from "@/components/Tree";
export default {
  name: 'ChargeType',
  dicts: ['whether', 'document_type'],
  components: {
    slideSearch,
    SgTable,
    sgDialog,
    vueEasyPrint,
    setMealPrint,
    outsourcing
  },
  data() {
    return {
      // 打印
      print: {},
      showDialogtime:false,
      showflagtime:false,
      Formdata:{
        time:"",

      },
      rules:{
        time:[
          { required: true, message: '请选择出库时间', trigger: 'blur' },
        ]
      },
      newmessage:null,
      printList: [],
      // ----
      menuOptions: [],
      // 弹框
      title: '出库详情',
      showDialog: false,
      form: {},
      supplier: [],
      userList: [],
      templateData: [],
      // -----
      tableData: [],
      rowTable: undefined,
      // 操作列
      columns: [
        {
          lab: '打单',
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
          lab: '单据类型',
          val: 'documentType',
          custom: 'documentType'
        },
        {
          lab: '执行人',
          val: 'executeUserName'
        },
        {
          lab: '操作日期',
          val: 'operationDate'
        },
        {
          lab: '领料部门',
          val: 'sectionName'
        },
        {
          lab: '领料人',
          val: 'outPerson'
        },
        {
          lab: '备注',
          val: 'remark'
        },
        {
          lab: '单据状态',
          val: 'statets',
          custom: 'statets'
        },
        {
          lab: '操作',
          val: 'caozuo',
          custom: 'caozuo'
        }
      ],
      selectionData: [],
      options: {
        executeData: {
          type: 'Tdatetime',
          label: '出库日期：',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        // zan: {
        //   type: 'select',
        //   label: '是否暂存',
        //   clearable: true,
        //   options: []
        // },
        outDocumentNo: {
          type: 'input',
          label: '单据号：'
        },
        executePerson: {
          type: 'input',
          label: '操作人：'
        },
        departmentId: {
          type: 'select',
          label: '领料部门',
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
    this.getData()
    this.setReturnDepartment()
    this.getUserList()
    this.getTreese()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
    // this.options.status.options = this.dict.type.sys_normal_disable
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
          console.log(this.Formdata.time)
          this.$api.confinementRoom.updateOutTime({
            executeDate:this.newgetData(this.Formdata.time),
            outDocumentNo:this.selectionData[0].outDocumentNo
          }).then(res=>{
             if(res.code==200){
               this.$message.success(res.msg)
               this.showDialogtime=false
               this.getData()
             }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
        this.options.departmentId.options = res.rows
      })
    },
    Export(){
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
      for (const k in this.options) {
        console.log(this.options[k])
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
        params: {
          // beginexecuteData: data.executeData === undefined ? null : data.executeData, // 出库日期开始
          // endexecuteData: data.endexecuteData === undefined ? null : data.endexecuteData // 出库日期结束
          beginoperationDate: data.executeData === undefined ? null : data.executeData, // 出库日期开始
          endoperationDate: data.endexecuteData === undefined ? null : data.endexecuteData // 出库日期结束
        },
        deptId: this.deptId,
        outDocumentNo: this.options.outDocumentNo.values,
        executePerson: this.options.executePerson.values,
        remark: this.options.remark.values,

        documentType: '4'
      }
      this.$api.storageRoom.outInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '领料出库')
        // setInterval(() => {
        //   this.submitLoadings = false
        // }, 5000)
      })
    },
    getOut() {
      this.$router.push({ path: 'outWarehouse' })
    },
    // 点击单据号
    Receipt(val) {
      this.form = val
      this.title = val.outDocumentNo
      this.$api.storageRoom.outList({ outDocumentNo: val.outDocumentNo }).then(res => {
        if (res) {
          this.templateData = res.rows
          this.showDialog = true
        }
      })
    },
    // 打印
    async expiret(val) {
      this.printList = []
      this.print = {}
      await this.$api.storageRoom.outList({ outDocumentNo: val.outDocumentNo }).then(res => {
        if (res) {
          this.printList = res.rows
        }
      })
      this.print = val
      let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      let newstr=str.split('<')[0];
      this.newmessage=newstr;
      this.$nextTick(() => {
        this.$refs.outsourcing.print()
      })
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
        params: {
          // beginexecuteData: data.executeData === undefined ? null : data.executeData, // 出库日期开始
          // endexecuteData: data.endexecuteData === undefined ? null : data.endexecuteData // 出库日期结束
          beginoperationDate: data.executeData === undefined ? null : data.executeData, // 出库日期开始
          endoperationDate: data.endexecuteData === undefined ? null : data.endexecuteData // 出库日期结束
        },
        deptId: this.deptId,
        outDocumentNo: this.options.outDocumentNo.values,
        executeUserName: this.options.executePerson.values,
        remark: this.options.remark.values,
        departmentId:this.options.departmentId.values,
        documentType: '4'
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.outInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    // 修改
    handlecompile(e) {
      this.$router.push({ path: 'outWarehouse', query: { item: e }})
    },
    // 退料
    retreat() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请先选中客户')
        return
      }
      this.$router.push({ path: 'materialReturn' })
      sessionStorage.setItem('materialReturnitem',JSON.stringify(this.selectionData[0]))
      return
    },
    // 关闭弹框
    handleClose() {
      console.log('1')
      this.showDialog = false
    },
    // 弹框按钮 确定
    putRemark() {
      // this.$set(this.form,'deptId',this.deptId)
      this.$api.storageRoom.outInfoput(this.form).then(res => {
        if (res) {
          this.$message.success('修改成功')
          console.log('2')
          this.showDialog = false
        }
      })
    },
    // 弹框按钮 关闭
    close() {
      console.log('3')
      this.showDialog = false
    },
    /** 查询部门下拉树结构 */
    async getTreese() {
      await this.$api.post.sectionInfoList().then(res => {
        if (res) {
          this.menuOptions = []
          const menu = { sectionId: 0, sectionName: '请选择', children: [] }
          menu.children = this.handleTree(res.rows, 'sectionId')
          this.menuOptions.push(menu)
          // this.menuOptions.forEach(item => {
          // })
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
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    // 行内单选
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 操作人员
    getUserList() {
      // 库房
      this.$api.storageRoom.wpartmentList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.RoomList = res.rows
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
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
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
.redStr{
  display: none;
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
</style>
