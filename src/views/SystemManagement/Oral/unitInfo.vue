<template>
  <div>
    <!-- 口腔加工单位信息列表 -->
    <div style="display: flex;justify-content: space-between">
      <div  style="width: 50%;margin-top: 10px;">
        <div  class="searchBar" >
          <el-form size="mini" ref="searchList" label-width="120px" :inline="true"    :model="searchList">
            <el-form-item label="单位编码:" prop="processCode">
              <el-input clearable style="width: 150px" v-model="searchList.processCode"  />
            </el-form-item>
            <el-form-item label="单位名称:" prop="processName">
              <el-input clearable style="width: 150px" v-model="searchList.processName"  />
            </el-form-item>

            <el-form-item label="是否显示" prop="showFlag">
              <el-select clearable filterable style="width: 150px" v-model="searchList.showFlag"  placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.isShow"
                  :key="dict.value"
                  :value="dict.value"
                  :label="dict.label"
                />
              </el-select>

            </el-form-item>
            <el-form-item label="单位地址:" prop="processName">
              <el-input clearable style="width: 150px" v-model="searchList.processAddr"  />
            </el-form-item>
            <el-form-item label="单位电话:" prop="processName">
              <el-input clearable style="width: 150px" v-model="searchList.processPhone"  />
            </el-form-item>
            <el-form-item style="margin-left: 20px">
              <el-button size="mini"  type="primary" icon="el-icon-search" @click="getList(true)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <sg-table

          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          size="mini"
          border
          index="序号"
          :table-data="tableData"
          :columns="columns"
          :pagination="pagination"
          highlight-current-row
          @size-change="sizeChange"
          @row-click="rowClick"
          @current-change="currentChange"
          :hideSearchBar="true"
        >

          <div slot="header" class="header" style="width: 100%;">
            <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
            <div style="float: right;">
              <el-button size="mini"  type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button>
              <el-button size="mini"   type="success" plain icon="el-icon-upload2"  :loading="submitLoadings" @click="exportExcel">导出</el-button>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'showFlag'">
              <dict-tag :options="dict.type.isShow" :value="data.custom.showFlag" />
            </div>
            <div v-if="data.props === 'edit'">
              <el-button type="text" style="color: #E6A23C" size="mini" @click="edit(data.custom)">修改</el-button>
              <el-button type="text" style="color: #F56C6C" size="mini" @click="deletes(data.custom.producerId)">删除</el-button>
            </div>
          </template>
        </sg-table>
      </div>
      <div style="width: 50%;margin-top: 10px;">
        <div  class="header-float" >
          <el-form ref="searchList" label-width="120px" :inline="true"   label-position="center" :model="searchLists" size="mini">
<!--            <el-form-item label="单位名称:" prop="processName">-->
<!--              <el-input clearable  style="width: 150px" v-model="searchLists.processName"  />-->
<!--            </el-form-item>-->
            <el-form-item label="联系人姓名:" prop="contactName">
              <el-input clearable  style="width: 150px" v-model="searchLists.contactName"  />
            </el-form-item>
            <el-form-item label="联系人电话:" prop="contactPhone">
              <el-input clearable  style="width: 150px" v-model="searchLists.contactPhone"  />
            </el-form-item>
            <el-form-item label="是否显示" prop="showFlag">
              <el-select clearable filterable  style="width: 150px" v-model="searchLists.showFlag"  placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.isShow"
                  :key="dict.value"
                  :value="dict.value"
                  :label="dict.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 20px">
              <el-button size="mini"  type="primary" icon="el-icon-search" @click="getLists(true)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <sg-table
          ref="table"
          id="out-tables"
          :sg-ref="'multipleTable'"
          size="mini"
          border
          index="序号"
          :table-data="tableDatas"
          :columns="columnss"
          :pagination="paginations"
          highlight-current-row
          @size-change="sizeChanges"
          style="margin-left: 10px"
          @current-change="currentChanges"
          :hideSearchBar="true"
        >

          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
            <div style="float: right;">
              <el-button size="mini"  type="primary" icon="el-icon-plus" @click="addDialogss">新增</el-button>
              <el-button size="mini"   type="success" plain icon="el-icon-upload2"  :loading="submitLoadings" @click="exportExcels">导出</el-button>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'showFlag'">
              <dict-tag :options="dict.type.isShow" :value="data.custom.showFlag" />
            </div>
            <div v-if="data.props === 'edit'">
              <el-button type="text" style="color: #E6A23C" size="mini" @click="edits(data.custom)">修改</el-button>
              <el-button type="text" style="color: #F56C6C" size="mini" @click="deletess(data.custom.contactId)">删除</el-button>
            </div>
          </template>
        </sg-table>
      </div>

    </div>

    <!--新增-->
    <sgDialog
      :title="xFlag==0?'新增':'修改'"
      :dialog="dialogVisible"
      size="400px"
      @handleClose="handleClose"
      v-if="dialogVisible"
    >
      <div slot="out">
        <el-form ref="formList" label-width="120px" style="display: flex;justify-content: space-between;flex-wrap: wrap" :rules="rules" :model="formList" size="mini">
          <el-form-item label="单位编码:" prop="processCode">
            <el-input v-model="formList.processCode"  />
          </el-form-item>
          <el-form-item label="单位名称:" prop="processName">
            <el-input v-model="formList.processName"  />
          </el-form-item>
          <el-form-item label="单位地址:" prop="processAddr">
            <el-input v-model="formList.processAddr"  />
          </el-form-item>
          <el-form-item label="单位电话:" prop="processPhone">
            <el-input v-model="formList.processPhone"  />
          </el-form-item>
          <el-form-item label="是否启用" prop="showFlag">
            <el-select clearable filterable v-model="formList.showFlag" class="full-width" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.isShow"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: end;">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini" :loading="submitLoading" @click="submit">保存</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-close" @click="handleClose">关闭</el-button>
      </span>
    </sgDialog>
    <!--联系人新增-->
    <sgDialog
      :title="xFlags==0?'新增':'修改'"
      :dialog="dialogVisibles"
      size="400px"
      @handleClose="handleCloses"
      v-if="dialogVisibles"
    >
      <div slot="out">
        <el-form ref="formLists" label-width="120px" style="display: flex;justify-content: space-between;flex-wrap: wrap" :rules="ruless" :model="formLists" size="mini">
          <el-form-item label="单位名称:" prop="processName">
            <el-input disabled v-model="formLists.processName"  />
          </el-form-item>
          <el-form-item label="联系人姓名:" prop="contactName">
            <el-input clearable v-model="formLists.contactName"  />
          </el-form-item>
          <el-form-item label="单位电话:" prop="contactPhone">
            <el-input clearable v-model="formLists.contactPhone"  />
          </el-form-item>
          <el-form-item label="是否启用" prop="showFlag">
            <el-select clearable filterable v-model="formLists.showFlag" class="full-width" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.isShow"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: end;">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini" :loading="submitLoadings" @click="submits">保存</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-close" @click="handleCloses">关闭</el-button>
      </span>
    </sgDialog>
  </div>
</template>
<script>
import SgTable from '@/components/Table'
import EditorBar from '@/components/wangeditor'
import sgDialog from '@/components/Dialog'
import { export_table_to_excel } from '@/utils/utils.js'
export default {
  name:'unitInfo',
  dicts: ['isShow'],
  components: {
    SgTable,
    EditorBar,
    sgDialog
  },
  data(){
    return{
      tableData:[],
      columns:[
        {
          lab: '单位编码',
          val: 'processCode',
        },
        {
          lab: '单位名称',
          val: 'processName',
        },

        {
          lab: '单位地址',
          val: 'processAddr',
          showOverflowTooltip:true
        },
        {
          lab: '单位电话',
          val: 'processPhone',
        },
        {
          lab: '是否显示',
          val: 'showFlag',
          custom: 'showFlag'
        },
        {
          lab: '联系人个数',
          val: 'contactNum',
        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit',
          width:100
        },

      ],
      tableDatas:[],
      columnss:[
        {
          lab: '单位名称',
          val: 'processName',
        },
        {
          lab: '联系人姓名',
          val: 'contactName',
        },

        {
          lab: '联系人电话',
          val: 'contactPhone',
        },
        {
          lab: '是否显示',
          val: 'showFlag',
          custom: 'showFlag'
        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit',
          width:200
        },

      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      paginations: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      dialogVisible:false,
      dialogVisibles:false,
      submitLoading:false,
      formList:{
        processCode:null,
        processName:null,
        weightSort:"",
        showFlag: '',
      },
      formLists:{
        processCode:null,
        processName:null,
        weightSort:"",
        showFlag: '',
      },
      rules:{
        processCode: [{ required: true, message: '单位编码不能为空', trigger: 'blur' }],
        processName: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
        processAddr: [{ required: true, message: '单位地址不能为空', trigger: 'blur' }],
        processPhone: [{ required: true, message: '单位电话不能为空', trigger: 'blur' }],
        showFlag: [{ required: true, message: '是否启用不能为空', trigger: 'blur' }],
      },
      ruless:{
        processName: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
        contactName: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '联系人电话不能为空', trigger: 'blur' }],
        showFlag: [{ required: true, message: '是否启用不能为空', trigger: 'blur' }],
      },
      xFlag:0,
      xFlags:0,
      submitLoadings:false,
      submitLoadingss:false,
      searchList:{
        processCode:null,
        processName:null,
        weightSort:"",
        showFlag:'0'
      },
      searchLists:{
        processCode:null,
        processName:null,
        weightSort:"",
        showFlag:'0'
      },
      XflagproducerId:'',//	单位主键id
      XflagprocessName:'',//单位名称
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
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods:{
    getList(isSearch){
      if (isSearch){
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const query={
        processCode:this.searchList.processCode,
        processName:this.searchList.processName,
        processPhone:this.searchList.processPhone,
        processAddr:this.searchList.processAddr,
        showFlag:this.searchList.showFlag,
        deptId:this.deptId
      }
      this.$api.modules.hospital.dentalProducerInfoList({...this.pagination,...query}).then(res=>{
        if (res.code==200){
          this.tableData=res.rows
          this.pagination.total=res.total
        }
      })
    },
    handleClose(){
      this.dialogVisible=false
    },
    // 新增
    addDialogs(){
      this.xFlag=0
      this.dialogVisible=true
      this.formList={
        processCode:null,
        processName:null,
        weightSort:null,
        showFlag: '',
      }
    },
    // 修改
    edit(val){
      this.xFlag=1
      this.dialogVisible=true
      this.$api.modules.hospital.dentalProducerInfo(val.producerId).then(res=>{
        if (res.code==200){
          this.formList={
            processCode:res.data.processCode,
            processName:res.data.processName,
            processAddr:res.data.processAddr,
            processPhone:res.data.processPhone,
            showFlag:res.data.showFlag,
            producerId:res.data.producerId
          }

        }
      })
    },
    // 删除
    deletes(val){
      this.$confirm('是否确认该条数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.hospital.dentalProducerInfoDelete(val).then(res => {
          if (res) {
            this.getList()
            this.$message.success(res.msg)
          }
        })
      })
    },
    // 保存
    submit(){
      this.$refs.formList.validate(valid => {
        if (valid) {
          const query={
            processCode:this.formList.processCode,
            processName:this.formList.processName,
            processAddr:this.formList.processAddr,
            processPhone:this.formList.processPhone,
            showFlag: this.formList.showFlag,
            producerId:this.formList.producerId?this.formList.producerId:null,
            deptId:this.deptId
          }
          // query.makId=query.makId.toString()
          if (this.xFlag==0){
            this.$api.modules.hospital.dentalProducerInfoAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisible=false
                this.getList()
              }else {
                this.dialogVisible=false
              }
            })
          }else if(this.xFlag==1){
            this.$api.modules.hospital.dentalProducerInfoEdit(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisible=false
                this.getList()
              }else {
                this.dialogVisible=false
              }
            })
          }
        }
      })
    },
    // 导出
    exportExcel() {
      this.submitLoadings=true
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      const query={
        processCode:this.searchList.processCode,
        processName:this.searchList.processName,
        showFlag:this.searchList.showFlag,
        deptId:this.deptId
      }
      this.$api.modules.hospital.dentalProducerInfoexport(query).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '口腔加工单位信息查询列表')
        setInterval(() => {
          this.submitLoadings = false
        }, 5000)
      })
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getList()
    },
    rowClick(e){
      this.XflagproducerId=e[1].producerId
      this.XflagprocessName=e[1].processName
      this.getLists()
    },
    getLists(isSearch){
      if (isSearch){
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const query={
        processName:this.searchLists.processName,
        contactName:this.searchLists.contactName,
        contactPhone:this.searchLists.contactPhone,
        showFlag:this.searchLists.showFlag,
        producerId:this.XflagproducerId,
        deptId:this.deptId
      }
      this.$api.modules.hospital.dentalProducerContactList({...this.paginations,...query}).then(res=>{
        if (res.code==200){
          this.tableDatas=res.rows
          this.paginations.total=res.total
        }
      })
    },
    handleCloses(){
      this.dialogVisibles=false
    },
    // 新增
    addDialogss(){
      this.xFlags=0
      this.dialogVisibles=true
      this.formLists={
        contactPhone:null,
        showFlag: '',
        processName:this.XflagprocessName
      }
    },
    // 修改
    edits(val){
      this.xFlags=1
      this.dialogVisibles=true
      this.$api.modules.hospital.dentalProducerContact(val.contactId).then(res=>{
        if (res.code==200){
          this.formLists={
            processName:res.data.processName,
            contactName:res.data.contactName,
            contactPhone:res.data.contactPhone,
            showFlag:res.data.showFlag,
            contactId:res.data.contactId,
            gprocessName:this.XflagprocessName
          }

        }
      })
    },
    // 删除
    deletess(val){
      this.$confirm('是否确认该条数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.hospital.dentalProducerContactDelete(val).then(res => {
          if (res) {
            this.getLists()
            this.$message.success(res.msg)
          }
        })
      })
    },
    // 保存
    submits(){
      this.$refs.formLists.validate(valid => {
        if (valid) {
          const query={
            processName:this.formLists.processName,
            contactName:this.formLists.contactName,
            contactPhone:this.formLists.contactPhone,
            showFlag: this.formLists.showFlag,
            contactId:this.formLists.contactId?this.formLists.contactId:null,
            deptId:this.deptId,
            producerId:this.XflagproducerId,
          }
          // query.makId=query.makId.toString()
          if (this.xFlags==0){
            this.$api.modules.hospital.dentalProducerContactAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisibles=false
                this.getLists()
              }else {
                this.dialogVisibles=false
              }
            })
          }else if(this.xFlags==1){
            this.$api.modules.hospital.dentalProducerContactEdit(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisibles=false
                this.getLists()
              }else {
                this.dialogVisibles=false
              }
            })
          }
        }
      })
    },
    // 导出
    exportExcels() {
      this.submitLoadingss=true
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      const query={
        processCode:this.searchLists.processCode,
        processName:this.searchLists.processName,
        showFlag:this.searchLists.showFlag,
        deptId:this.deptId
      }
      this.$api.modules.hospital.dentalProducerContactexport(query).then(res => {
        if (res) {
          this.tableDatas = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '口腔加工单位联系人信息查询列表')
        setInterval(() => {
          this.submitLoadingss = false
        }, 5000)
      })
    },
    // 分页组件的方法
    currentChanges(e) {
      this.paginations.pageNum = e[1]
      this.paginations.currentPage = e[1]
      this.getLists()
    },
    sizeChanges(e) {
      this.paginations.pageSize = e[1]
      this.getLists()
    },
  },

}
</script>
<style lang="scss" scoped>
.header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 14px;
    margin-right: 15px;
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}
</style>