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
      :hideSearchBar="true"
      @current-change="currentChange"
    >

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
          <el-button type="text" style="color: #E6A23C" size="mini" @click="edit(data.custom)">修改</el-button>
          <el-button type="text" style="color: #F56C6C" size="mini" @click="deletes(data.custom.pushLabelId)">删除</el-button>
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
          <el-form-item label="推送标签:" prop="pushTags">
            <el-input v-model="formList.pushTags"  />
          </el-form-item>
          <el-form-item label="推送提示:" prop="pushPrompt">
            <el-input v-model="formList.pushPrompt"  />
          </el-form-item>
<!--          <el-form-item label="模板标签:" prop="makId">-->
<!--            <el-select v-model="formList.makId" style="width:180px" @change="$forceUpdate()" multiple  collapse-tags  size="mini" clearable filterable  placeholder="请选择用户id">-->
<!--              <el-option-->
<!--                v-for="item in selectList"-->
<!--                :key="item.makId"-->
<!--                :label="item.makName"-->
<!--                :value="item.makId"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="消息替换字段:" prop="backendValue">
            <el-input v-model="formList.backendValue"  />
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
  name:'returnvalue',
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
          lab: '推送标签',
          val: 'pushTags',
        },
        {
          lab: '推送提示',
          val: 'pushPrompt',
        },

        {
          lab: '消息替换字段',
          val: 'backendValue',
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
      },
      rules:{
        pushTags: [{ required: true, message: '推送标签不能为空', trigger: 'blur' }],
        pushPrompt: [{ required: true, message: '推送提示不能为空', trigger: 'blur' }],
        // makId: [{ required: true, message: '模板标签不能为空', trigger: 'blur' }],
        backendValue: [{ required: true, message: '消息替换字段不能为空', trigger: 'blur' }],
      },
      xFlag:0,
      type:'',
      status:'',
      // selectList:[]
    }
  },
  created() {
    this.getList()
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
      this.$api.modules.systemset.pushLabelInfo(this.pagination).then(res=>{
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
        pushTags:null,
        pushPrompt:null,
        // makId:[],
        backendValue: '',
      }
    },
    // 修改
    edit(val){
      this.xFlag=1
      this.dialogVisible=true
      this.$api.modules.systemset.pushLabelInfoId(val.pushLabelId).then(res=>{
        if (res.code==200){
          this.formList={
            pushTags:res.data.pushTags,
            pushPrompt:res.data.pushPrompt,
            // makId:Number(res.data.makId),
            backendValue:res.data.backendValue,
            pushLabelId:res.data.pushLabelId
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
        await this.$api.modules.systemset.pushLabelInfoIdDelete(val).then(res => {
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
            pushTags:this.formList.pushTags,
            pushPrompt:this.formList.pushPrompt,
            // makId:this.formList.makId,
            backendValue: this.formList.backendValue,
            pushLabelId:this.formList.pushLabelId?this.formList.pushLabelId:null
          }
          // query.makId=query.makId.toString()
          if (this.xFlag==0){
            this.$api.modules.systemset.pushLabelInfoAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisible=false
                this.getList()
              }else {
                this.dialogVisible=false
              }
            })
          }else if(this.xFlag==1){
            this.$api.modules.systemset.pushLabelInfoEdit(query).then(res=>{
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
      this.formList.content = content;
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