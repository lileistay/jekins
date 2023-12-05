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
      <div slot="searchBar">
        <el-form ref="searchList" label-width="120px" style="display: flex;flex-wrap: wrap"  label-position="center" :model="searchList" size="mini">
          <el-form-item label="公告标题:" prop="colourCode">
            <el-input clearable v-model="searchList.noticeTitle"  />
          </el-form-item>
          <el-form-item label="操作人员:" prop="colourName">
            <el-input clearable v-model="searchList.createBy"  />
          </el-form-item>
          <el-form-item label="公告类型" prop="useFlag">
            <el-select clearable filterable v-model="searchList.noticeType" class="full-width" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.sys_notice_type"
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
          <el-button size="mini"  v-has-permi="['confinement:dividendType:add']" type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button>
          <!--          <el-button size="mini"  v-has-permi="['confinement:dividendType:delete']" type="danger" icon="el-icon-plus" @click="deleteDialogs">删除</el-button>-->
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'noticeType'">
          <dict-tag :options="dict.type.sys_notice_type" :value="data.custom.noticeType" />
        </div>
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_notice_status" :value="data.custom.status" />
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text" style="color: #E6A23C" size="mini" @click="edit(data.custom)">修改</el-button>
          <el-button type="text" style="color: #F56C6C" size="mini" @click="deletes(data.custom.noticeId)">删除</el-button>
        </div>
      </template>
    </sg-table>
    <!--新增-->
    <sgDialog
      :title="xFlag==0?'新增':'修改'"
      :dialog="dialogVisible"
      size="800px"
      @handleClose="handleClose"
      v-if="dialogVisible"
    >
      <div slot="out">
        <el-form ref="formList" label-width="120px" style="display: flex;justify-content: space-between;flex-wrap: wrap" :rules="rules" :model="formList" size="mini" @submit.native.prevent>
          <el-form-item label="标题:" prop="noticeTitle">
            <el-input v-model="formList.noticeTitle"  style="width: 320px"/>
          </el-form-item>
          <el-form-item label="公告类型:" prop="noticeType">
            <el-select v-model="formList.noticeType" style="width:180px" @change="$forceUpdate()"   size="mini" clearable filterable  placeholder="请选择用户id">
              <el-option
                v-for="item in dict.type.sys_notice_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="formList.status">
              <el-radio  :label="0">正常</el-radio>
              <el-radio :label="1">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内容:" prop="backendValue">
            <EditorBar  v-if="dialogVisible==true"  @catchData="catchData" :content="formList.content" ></EditorBar>
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
export default {
  name:'notice',
  dicts: ['sys_notice_type','sys_notice_status'],
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
          lab: '公告标题',
          val: 'noticeTitle',
        },
        {
          lab: '公告类型',
          val: 'noticeType',
          custom:'noticeType'
        },
        {
          lab: '公告内容',
          val:'noticeContent',
          showOverflowTooltip:true
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '创建人',
          val: 'createBy'
        },
        {
          lab: '创建时间',
          val: 'createTime',
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
        pushTags:null,
        pushPrompt:null,
        // makId:[],
        backendValue: '',
        status:0
      },
      rules:{
        noticeTitle: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        noticeType: [{ required: true, message: '公告类型不能为空', trigger: 'blur' }],
        // makId: [{ required: true, message: '模板标签不能为空', trigger: 'blur' }],
        // backendValue: [{ required: true, message: '消息替换字段不能为空', trigger: 'blur' }],
      },
      xFlag:0,
      type:'',
      status:'',
      queryContent:'',
      selectList:[],
      searchList:{}
    }
  },
  created() {
    this.getList()
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
      }
    }
  },
  mounted() {
  },
  methods:{
    // getSelectlist(){
    //   this.$api.modules.systemset.markdownTemplates().then(res=>{
    //     if (res.code==200){
    //       this.selectList=res.rows
    //     }
    //   })
    // },
    getList(isSearch){
      if (isSearch){
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const query={
        noticeTitle:this.searchList.noticeTitle,
        createBy:this.searchList.createBy,
        noticeType:this.searchList.noticeType,
        ...this.pagination
      }
      this.$api.menu.noticeList(query).then(res=>{
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
        noticeTitle:null,
        noticeType:null,
        // makId:[],
        status: '',
      }
    },
    // 修改
    edit(val){
      this.xFlag=1
      this.dialogVisible=true
      this.$api.menu.noticeListInfo(val.noticeId).then(res=>{
        if (res.code==200){
          this.formList={
            noticeTitle:res.data.noticeTitle,
            noticeType:res.data.noticeType,
            status:Number(res.data.status),
            noticeId:res.data.noticeId

          }
          this.formList.content=res.data.noticeContent
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
        await this.$api.menu.noticeListDelete(val).then(res => {
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
            noticeTitle:this.formList.noticeTitle,
            noticeType:this.formList.noticeType,
            noticeContent:this.queryContent,
            status: this.formList.status,
            noticeId:this.formList.noticeId?this.formList.noticeId:null
          }
          // query.makId=query.makId.toString()
          if (this.xFlag==0){
            this.$api.menu.noticeListAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisible=false
                this.getList()
              }else {
                this.dialogVisible=false
              }
            })
          }else if(this.xFlag==1){
            this.$api.menu.noticeListEdit(query).then(res=>{
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

      this.formList.content=''
    },
    //编辑器的内容赋值
    catchData(content) {
      let currentRange = window.getSelection().getRangeAt(0);
      this.rangenum = currentRange;
      // this.formList.content = content;
      this.queryContent = content;
    },
    getChange(content){
      this.queryContent = content;
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