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
          <el-form-item label="字典名称:" prop="typeName">
            <el-input clearable v-model="searchList.typeName"  />
          </el-form-item>
          <el-form-item label="字典类型:" prop="typeCode">
            <el-input clearable v-model="searchList.typeCode"  />
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
          <el-form-item label="创建时间" prop="create">
<!--            <el-date-picker-->
<!--              v-model="searchList.Time"-->
<!--              style="width: 220px;"-->
<!--              class="date-picker"-->
<!--              type="datetimerange"-->
<!--              size="mini"-->
<!--              clearable-->
<!--              format="yyyy-MM-dd HH:mm:ss"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              :default-time="['00:00:00', '23:59:59']"-->
<!--              range-separator="-"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--            />-->
            <el-date-picker
              v-model="searchList.Time" class="inputWidth"
              size="mini"
              type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;" />
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
        <div v-if="data.props === 'typeCode'">
          <router-link :to="{path: '/categorizeDetail', query: { typeId: data.custom.typeId ,typeName: data.custom.typeName}}">{{ data.custom.typeCode }}</router-link>
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text" style="color: #E6A23C" size="mini" @click="edit(data.custom)">修改</el-button>
          <el-button type="text" style="color: #F56C6C" size="mini" @click="deletes(data.custom.typeId)">删除</el-button>
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
        <el-form ref="formList" label-width="120px" style="" :rules="rules" :model="formList" size="mini">
          <el-form-item label="字典名称:" prop="typeName">
            <el-input v-model="formList.typeName"  style="width: 100%"/>
          </el-form-item>
          <el-form-item label="字典类型:" prop="typeCode">
            <el-input v-model="formList.typeCode"  style="width: 100%"/>
          </el-form-item>
          <el-form-item label="是否启用" prop="useFlag">
            <el-select clearable filterable v-model="formList.useFlag" class="full-width" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="dict in dict.type.isShow"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注:" prop="remarks">
            <el-input type="textarea" v-model="formList.remarks" style="width: 100%" />
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
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  timeFmt,
  todayTime
} from "@/utils/time";
export default {
  name:'categorize',
  dicts: ['isShow'],
  components: {
    SgTable,
    EditorBar,
    sgDialog
  },
  data(){
    return{
      tableData:[],
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', beforeDayTime(1))
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', todayTime())
            }
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', beforeWeek(1))
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', thisWeek())
            }
          },
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', lastMonth())
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', monthData())
            }
          },
          {
            text: '上季度',
            onClick(picker) {
              picker.$emit('pick', lastQuarter())
            }
          },
          {
            text: '本季度',
            onClick(picker) {
              picker.$emit('pick', thisQuarter())
            }
          },
          {
            text: '上年',
            onClick(picker) {
              picker.$emit('pick', lastYear())
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', thisYear())
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
            }
          }
        ]
      },
      columns:[
        {
          lab: '字典名称',
          val: 'typeName',
        },
        {
          lab: '字典类型',
          val: 'typeCode',
          custom: 'typeCode'
        },

        {
          lab: '备注',
          val: 'remarks',
        },
        {
          lab: '创建时间',
          val:'createTime'
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
        typeCode:null,
        typeName:null,
        remarks:"",
        useFlag: '',
      },
      rules:{
        typeCode: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
        typeName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
      },
      xFlag:0,
      type:'',
      status:'',
      submitLoadings:false,
      searchList:{
        typeCode:null,
        typeName:null,
        remarks:"",
        Time:[],
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
        typeCode:this.searchList.typeCode,
        typeName:this.searchList.typeName,
        useFlag:this.searchList.useFlag,
        deptId:this.deptId,
        createTime:this.searchList.Time?this.searchList.Time[0]:null,
        endCreateTime:this.searchList.Time?this.searchList.Time[1]:null
      }
      this.$api.modules.hospital.dentalDictTypeLst({...this.pagination,...query}).then(res=>{
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
        typeCode:null,
        typeName:null,
        remarks:null,
        useFlag: '',
      }
    },
    // 修改
    edit(val){
      this.xFlag=1
      this.dialogVisible=true
      this.$api.modules.hospital.dentalDictType(val.typeId).then(res=>{
        if (res.code==200){
          this.formList={
            typeCode:res.data.typeCode,
            typeName:res.data.typeName,
            remarks:res.data.remarks,
            useFlag:res.data.useFlag,
            typeId:res.data.typeId
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
        await this.$api.modules.hospital.dentalDictTypeexportDelete(val).then(res => {
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
            typeCode:this.formList.typeCode,
            typeName:this.formList.typeName,
            remarks:this.formList.remarks,
            useFlag: this.formList.useFlag,
            typeId:this.formList.typeId?this.formList.typeId:null,
            deptId:this.deptId
          }
          // query.makId=query.makId.toString()
          if (this.xFlag==0){
            this.$api.modules.hospital.dentalDictTypeAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisible=false
                this.getList()
              }else {
                this.dialogVisible=false
              }
            })
          }else if(this.xFlag==1){
            this.$api.modules.hospital.dentalDictTypeEdit(query).then(res=>{
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
        typeCode:this.searchList.typeCode,
        typeName:this.searchList.typeName,
        useFlag:this.searchList.useFlag,
        deptId:this.deptId
      }
      this.$api.modules.hospital.dentalDictTypeexport(query).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '正畸检查字典分类列表')
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