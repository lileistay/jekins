<template>
  <div>

    <!-- 活动类型 -->
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
      </div>
      <slot>
        <sg-table
          id="out-table"
          ref="table"
          :sg-ref="'multipleTable'"
          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :pagination="pagination"
          stripe
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          :hideSearchBar="true"
        >
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px;color: #999;"><i style="cursor:pointer" class="el-icon-s-fold"/>列表清单</span>

            <el-button
              type="primary"
              size="mini"
              plain
              style="float: right;"
              @click="getstatus"
            >生效
            </el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              style="float: right;margin-right: 10px"
              @click="getstatusno"
            >作废
            </el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              style="float: right;"
              @click="showDialog"
            >添加
            </el-button>
          </div>

          <template #custom="data">
            <div v-if="data.props === 'eventsState'">
              <show-dict-data :options="dict.type.eventsState" :value="data.custom.eventsState" />
            </div>
            <div v-if="data.props === 'useFlag'">
              <show-dict-data :options="dict.type.useFlag" :value="data.custom.useFlag" />
            </div>

            <div v-if="data.props === 'edit'">
              <a @click="editDialog(data.custom)">编辑</a>
              <a style="margin-left: 10px;color:red" @click="deleteDialog(data.custom)">删除</a>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <sgDialog :title="giftTitle"  size="370px" :dialog="showDialogS" @handleClose="showDialogS=false">
      <div slot="out">
        <div class="formBody">
          <el-form label-width="125px" label-position="left" :inline="true" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
            <el-form-item label="活动名称：" prop="eventsName" >
              <el-input v-model="formlist.eventsName"   style="width: 190px;" />
            </el-form-item>
            <el-form-item label="活动时间：" prop="startTime">
              <el-date-picker
                v-model="formlist.startTime"
                style="width: 190px"
                type="datetimerange"
                range-separator="至"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="活动负责人：" prop="organizerId">
              <el-select filterable clearable v-model="formlist.organizerId" size="mini" style="width: 190px;">
                <el-option v-for="item in userList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动类型：" prop="eventsTypeName">
              <el-select filterable clearable v-model="formlist.eventsTypeName" size="mini" style="width: 190px;">
                <el-option v-for="item in activeList" :label="item.eventsTypeName" :value="item.eventsTypeId" :key="item.eventsTypeId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参加人数：" prop="eventsNum" >
              <el-input v-model="formlist.eventsNum"   style="width: 190px;" />
            </el-form-item>
            <el-form-item label="活动描述：" prop="remarks" >
              <el-input v-model="formlist.remarks"   style="width: 190px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="footer" style="text-align: right">
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submit(formlist)">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="showDialogS=false">关闭</el-button>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import {newgetData, todayTime} from '@/utils/time'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import moment from "moment/moment";
export default {
  components:{
    slideSearch,
    SgTable,
    sgDialog
  },
  dicts:['eventsFlag','eventsState','useFlag'],
  data(){
    return{
      submitLoadings:false,//导出loding
      options:{
        startTime: {
          type: 'datetimerangeopentions',
          clearable: true,
          label: '开始时间',
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        eventsName: {
          type: 'input',
          label: '活动名称'
        },
        eventsTypeId: {
          type: 'select',
          label: '活动类型',
          clearable: true,
          options:[]
        },
        organizerId: {
          type: 'select',
          label: '活动负责人',
          clearable: true,
          options:[]
        },
        eventsState: {
          type: 'select',
          label: '活动状态',
          clearable: true,
          options:[]
        }
      },
      tableData:[],
      columns:[
        {
          lab: '活动名称',
          val: 'eventsName',
        },
        {
          lab: '活动类型',
          val: 'eventsTypeName',
        },
        {
          lab: '活动时间',
          val: 'startTime',
        },
        {
          lab: '是否有效',
          val: 'useFlag',
          custom: 'useFlag'
        },

        {
          lab: '活动负责人',
          val: 'organizerName',
        },
        {
          lab: '计划参加人数',
          val: 'eventsNum',
        },
        {
          lab: '活动状态',
          val: 'eventsState',
          custom: 'eventsState'
        },
        {
          lab: '活动描述',
          val: 'remarks',
        },

        {
          lab: '操作',
          val: 'edit',
          custom: 'edit',
        },
      ],
      pagination:{
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      showDialogS:false,
      giftTitle:'添加',
      formlist:{},
      rules:{
        eventsName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请输入活动时间', trigger: 'change' },
        ],
        organizerId: [
          { required: true, message: '请输入活动负责人', trigger: 'change' },
        ],
        eventsNum: [
          { required: true, message: '请输入参加人数', trigger: 'change' },
        ],
        eventsTypeName: [
          { required: true, message: '请输入活动类型', trigger: 'change' },
        ],
      },
      Xflag:null,
      userList:[],
      activeList:[],
      selectionData:[]
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
    },
  },
  created() {
    this.getData()
    this.getactiveList()
    this.getUserList()
    this.options.eventsState.options=this.dict.type.eventsState
  },
  methods:{
    // 列表
    getData(){
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
        }
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }
        else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = Object.assign(data)
      const query={
        ...this.pagination,
        ...data
        // eventsTypeName:this.formlist.activeName,
        // eventsFlag:this.formlist.activeType
      }
      this.$api.modules.active.eventsBasicInfoList(query).then(res=>{
        if (res.code==200){
          this.tableData=res.rows
          this.pagination.total=res.total
        }
      })
    },
    // 导出
    exportExcel(){

    },
    showDialog(){
      this.showDialogS=true
      this.Xflag=0
      this.formlist={}
      this.giftTitle='添加'
    },
    getstatus(){
      if(this.selectionData.length<=0){
        this.$message.warning('请选择一条数据修改')
        return
      }
      if(this.selectionData[0].useFlag==0){
        this.$message.warning('该条数据已为有效数据')
        return
      }
      this.$confirm(`确认将${this.selectionData[0].eventsName}这条数据改为有效数据？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const query={
          basicId:this.selectionData[0].basicId,
          useFlag:0,
        }
        await this.$api.modules.active.eventsBasicInfoEdit(query).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    getstatusno(){
        if(this.selectionData.length<=0){
          this.$message.warning('请选择一条数据修改')
          return
        }
        if(this.selectionData[0].useFlag==1){
          this.$message.warning('该条数据已为作废数据')
          return
        }
        this.$confirm(`确认将${this.selectionData[0].eventsName}这条数据改为无效数据？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const query={
            basicId:this.selectionData[0].basicId,
            useFlag:1,
          }
          await this.$api.modules.active.eventsBasicInfoEdit(query).then(res => {
            if (res) {
              this.getData()
              this.$message.success(res.msg)
            }
          })
        }).catch(() => {

        })
    },
    editDialog(item){
      this.Xflag=1
      this.showDialogS=true
      this.formlist={
        eventsName:item.eventsName,
        basicId:item.basicId,
        startTime:[item.startTime,item.endTime],
        eventsTypeName:item.eventsTypeId,
        eventsNum:item.eventsNum,
        remarks:item.remarks,
        organizerId:item.organizerId
      }
      this.giftTitle='修改'
    },
    deleteDialog(item){
      this.$confirm('是否确认删除该数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const basicId=item.basicId
        await this.$api.modules.active.eventsBasicInfoDelete(basicId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },

    submit(){
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          const query={
            deptId:this.deptId ,
            basicId:this.formlist.basicId?this.formlist.basicId:'',
            eventsName:this.formlist.eventsName,
            startTime:this.formlist.startTime?this.formlist.startTime[0]:'',
            endTime:this.formlist.startTime?this.formlist.startTime[1]:'',
            organizerId:this.formlist.organizerId,
            eventsTypeId:this.formlist.eventsTypeName,
            eventsNum:this.formlist.eventsNum,
            remarks:this.formlist.remarks,
          }
          if(this.Xflag==0){
            this.$api.modules.active.eventsBasicInfoAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success(res.msg)
                this.getData()
                this.showDialogS=false
              }
            })
          }else {
            this.$api.modules.active.eventsBasicInfoEdit(query).then(res=>{
              if (res.code==200){
                this.$message.success(res.msg)
                this.getData()
                this.showDialogS=false
              }
            })
          }

        }
      })
    },
    // 得到所有的工作人员，同时设置查询条件下拉框的数据
    getUserList(deptId) {
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 去重
          const arr = this.unique(res.data)
          this.userList=arr

          // 设置下拉框数据
          this.options.organizerId.options = arr
          // this.options.aestheticConsultant.options = arr
          // this.options.doctorId.options = arr
          // this.options.giveMedicalAdvice.options = arr
          // this.options.customerRepresentative.options = arr
        }
      })
    },
    // 去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 列表
    getactiveList(){
      this.$api.modules.active.eventsTypeList().then(res=>{
        if (res.code==200){
          this.activeList=res.rows
          res.rows.forEach(item => {
            item.label = item.eventsTypeName
            item.value = item.eventsTypeId
          })
          this.options.eventsTypeId.options=res.rows
        }
      })
    },
    /**
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /**
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
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
  }
}
</script>

<style>

</style>
