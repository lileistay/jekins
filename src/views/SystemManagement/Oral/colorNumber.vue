<template>
  <div>

    <!-- 文件列表 -->
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

      @current-change="currentChange"
    >
      <div slot="searchBar" class="header-float" >
        <el-form ref="searchList" label-width="120px" style="display: flex;flex-wrap: wrap"  label-position="center" :model="searchList" size="mini">
          <el-form-item label="色号代码:" prop="colourCode">
            <el-input clearable v-model="searchList.colourCode"  />
          </el-form-item>
          <el-form-item label="色号别名:" prop="colourName">
            <el-input clearable v-model="searchList.colourName"  />
          </el-form-item>
          <el-form-item label="是否启用" prop="useFlag">
            <el-select clearable filterable v-model="searchList.useFlag" class="full-width" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.isShow"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <div style="margin-left: 20px">
            <el-button size="mini"  type="primary" icon="el-icon-search" @click="getList(true)">查询</el-button>
          </div>
        </el-form>
      </div>
      <div slot="header" style="width: 100%;">
        <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
        <div style="float: right;">
          <el-button size="mini"  type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button>
          <el-button size="mini"   type="success" plain icon="el-icon-upload2"  :loading="submitLoadings" @click="exportExcel">导出</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'useFlag'">
          <dict-tag :options="dict.type.isShow" :value="data.custom.useFlag" />
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text" style="color: #E6A23C" size="mini" @click="edit(data.custom)">修改</el-button>
          <el-button type="text" style="color: #F56C6C" size="mini" @click="deletes(data.custom.colourId)">删除</el-button>
        </div>
      </template>
    </sg-table>
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
          <el-form-item label="色号代码:" prop="colourCode">
            <el-input v-model="formList.colourCode"  />
          </el-form-item>
          <el-form-item label="色号别名:" prop="colourName">
            <el-input v-model="formList.colourName"  />
          </el-form-item>
          <el-form-item label="排序:" prop="weightSort">
            <el-input v-model="formList.weightSort"  />
          </el-form-item>
          <el-form-item label="色号值:" prop="colourValue">
            <el-input v-model="formList.colourValue"  />
          </el-form-item>
          <el-form-item label="描述:" prop="remarks">
            <el-input v-model="formList.remarks"  />
          </el-form-item>
          <el-form-item label="是否启用" prop="useFlag">
            <el-select clearable filterable v-model="formList.useFlag"  placeholder="请选择">
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
  </div>
</template>
<script>
import SgTable from '@/components/Table'
import EditorBar from '@/components/wangeditor'
import sgDialog from '@/components/Dialog'
import { export_table_to_excel } from '@/utils/utils.js'
export default {
  name:'colorNumber',
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
          lab: '色号代码',
          val: 'colourCode',
        },
        // {
        //   lab: '色号组',
        //   val: 'colourName',
        // },

        {
          lab: '色号名称',
          val: 'colourName',
        },
        {
          lab: '色号描述',
          val: 'remarks',
        },
        {
          lab: '色号值',
          val: 'colourValue',
        },
        {
          lab: '顺序号',
          val: 'weightSort',
        },
        {
          lab: '是否启用',
          val: 'useFlag',
          custom: 'useFlag'
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
      dialogVisible:false,
      submitLoading:false,
      form: {
        content: '',
      },
      rangenum:'',
      formList:{
        colourCode:null,
        colourName:null,
        weightSort:"",
        useFlag: '',
        colourValue:''
      },
      rules:{
        colourCode: [{ required: true, message: '材质编码不能为空', trigger: 'blur' }],
        colourName: [{ required: true, message: '材质名称不能为空', trigger: 'blur' }],
        // weightSort: [{ required: true, message: '模排序不能为空', trigger: 'blur' }],
        useFlag: [{ required: true, message: '是否启用不能为空', trigger: 'blur' }],
      },
      xFlag:0,
      type:'',
      status:'',
      submitLoadings:false,
      searchList:{
        colourCode:null,
        colourName:null,
        weightSort:"",
        useFlag:'0'
      },

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
        colourCode:this.searchList.colourCode,
        colourName:this.searchList.colourName,
        useFlag:this.searchList.useFlag,
        deptId:this.deptId
      }
      this.$api.modules.hospital.dentalMakeColourList({...this.pagination,...query}).then(res=>{
        if (res.code==200){
          this.tableData=res.rows
          this.pagination.total=res.total
        }
      })
    },
    handleClose(){
      this.dialogVisible=false
      this.formList.content=''
    },
    // 新增
    addDialogs(){
      this.xFlag=0
      this.dialogVisible=true
      this.formList={
        colourCode:null,
        colourName:null,
        weightSort:null,
        useFlag: '',
      }
    },
    // 修改
    edit(val){
      this.xFlag=1
      this.dialogVisible=true
      this.$api.modules.hospital.dentalMakeColour(val.colourId).then(res=>{
        if (res.code==200){
          this.formList={
            colourCode:res.data.colourCode,
            colourName:res.data.colourName,
            colourValue:res.data.colourValue,
            remarks:res.data.remarks,
            weightSort:Number(res.data.weightSort),
            useFlag:res.data.useFlag,
            colourId:res.data.colourId
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
        await this.$api.modules.hospital.dentalMakeColourDelete(val).then(res => {
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
            colourCode:this.formList.colourCode,
            colourName:this.formList.colourName,
            weightSort:this.formList.weightSort,
            useFlag: this.formList.useFlag,
            remarks:this.formList.remarks,
            colourValue:this.formList.colourValue,
            colourId:this.formList.colourId?this.formList.colourId:null,
            deptId:this.deptId
          }
          // query.makId=query.makId.toString()
          if (this.xFlag==0){
            this.$api.modules.hospital.dentalMakeColourAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisible=false
                this.getList()
              }else {
                this.dialogVisible=false
              }
            })
          }else if(this.xFlag==1){
            this.$api.modules.hospital.dentalMakeColourEdit(query).then(res=>{
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
        colourCode:this.searchList.colourCode,
        colourName:this.searchList.colourName,
        useFlag:this.searchList.useFlag,
        deptId:this.deptId
      }
      this.$api.modules.hospital.dentalMakeColourexport(query).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '口腔加工色号列表')
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
  },

}
</script>
<style>

</style>