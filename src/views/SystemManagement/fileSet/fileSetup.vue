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
      selection
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      highlight-current-row
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <div slot="searchBar" style="height:100%">
      <div style="display: flex">
        <el-select v-model="type" style="width: 200px;margin-right: 10px" clearable size="mini" placeholder="请选择类型" filterable>
          <el-option
            v-for="dict in dict.type.file_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        <el-select v-model="status" style="width: 200px;margin-right: 10px" clearable size="mini" placeholder="请选择状态" filterable>
          <el-option
            v-for="dict in dict.type.sys_job_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        <div>
          <el-button icon="el-icon-search" size="mini" type="primary" @click.stop="getList(true)" @keydown.enter.native="getList(true)">搜索</el-button>
        </div>
      </div>
      </div>
      <div slot="header" style="width: 100%;">
        <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
        <div style="float: right;">
          <el-button size="mini"  v-has-permi="['confinement:dividendType:add']" type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button>
<!--          <el-button size="mini"  v-has-permi="['confinement:dividendType:delete']" type="danger" icon="el-icon-plus" @click="deleteDialogs">删除</el-button>-->
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'type'">
          <dict-tag :options="dict.type.file_type" :value="data.custom.type" />
        </div>
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_job_status" :value="data.custom.status" />
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text" @click="edit(data.custom)">修改</el-button>
          <el-button type="text" @click="deletes(data.custom.pmlId)">删除</el-button>
        </div>
      </template>
    </sg-table>
    <!--新增-->
    <sgDialog
      :title="xFlag==0?'新增':'修改'"
      :dialog="dialogVisible"
      width="35%"
      @handleClose="handleClose"
      v-if="dialogVisible"
    >
      <div slot="out">
          <el-form ref="formList" label-width="100px" :rules="rules" :model="formList" size="mini">
            <el-form-item label="标题:" prop="title">
              <el-input v-model="formList.title"  />
            </el-form-item>
            <el-form-item label="类型:" prop="type">
              <el-select v-model="formList.type" style="width: 100%;" placeholder="请选择类型" filterable>
                <el-option
                  v-for="dict in dict.type.file_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态:">
              <el-select v-model="formList.status" style="width: 100%" clearable filterable placeholder="状态">
                <el-option label="正常" value="0" />
                <el-option label="停用" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="文本:" prop="content">
              <EditorBar  v-if="dialogVisible==true" @catchData="catchData" :content="formList.content" ></EditorBar>
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
    dicts: ['file_type','sys_job_status'],
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
            lab: '标题',
            val: 'title',
          },
          {
            lab: '类型',
            val: 'type',
            custom:'type'
          },
          {
            lab: '状态',
            val: 'status',
            custom:'status'
          },
          {
            lab: '内容',
            val: 'content',
            showOverflowTooltip:true
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
          title:null,
          type:null,
          remark:null,
          content: '',
        },
        rules:{
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择选择类型', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入文本', trigger: 'blur' }
          ],

        },
        xFlag:0,
        type:'',
        status:'0',
        queryContent:''
      }
    },
    created() {
      this.getList()
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getList()
        }
      }
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
          type:this.type,
          pageNum:this.pagination.pageNum ,
          currentPage: this.pagination.currentPage,
          status:this.status
        }
        this.$api.modules.protocolManagement.protocolManagementList(query).then(res=>{
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
          title:null,
            type:null,
            remark:null,
            content: '',
        }
      },
      // 修改
      edit(val){
        this.xFlag=1
        this.dialogVisible=true
        this.$api.modules.protocolManagement.getprotocolManagementLists(val.pmlId).then(res=>{
          if (res.code==200){
            this.formList={
              title:res.data.title,
              type:res.data.type,
              remark:this.formList.remark,
              content: res.data.content,
              pmlId:res.data.pmlId,
              status:res.data.status
            }
            let list=''
            let arr=val.content.split('<br/>');
            list+=arr[0]
            arr.forEach((iten,index)=>{
              if (index){
                list+=`<p>${iten}</p>`
              }else{
                var reg =  /<[^>]+>/gi;

              }
            })
            this.formList.content=list
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
          await this.$api.modules.protocolManagement.deleteprotocolManagementList(val).then(res => {
            if (res) {
              this.getList()
              this.$message.success(res.msg)
            }
          })
        })
      },
      // 保存
      submit(){
        const query={
          title:this.formList.title,
          type:this.formList.type,
          remark:this.formList.remark,
          content: this.queryContent,
          pmlId:this.formList.pmlId?this.formList.pmlId:null,
          status:this.formList.status
        }
        this.$refs.formList.validate(valid => {
          if (valid){
            if (this.xFlag==0){
              this.$api.modules.protocolManagement.addprotocolManagementList(query).then(res=>{
                if (res.code==200){
                  this.$message.success('操作成功')
                  this.dialogVisible=false
                  this.getList()
                }else {
                  this.dialogVisible=false
                }
              })
            }else if(this.xFlag==1){
              this.$api.modules.protocolManagement.editprotocolManagementList(query).then(res=>{
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
        // this.rangenum = currentRange;
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