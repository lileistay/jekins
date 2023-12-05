<!--礼品类型·-->
<template>
  <div class="container">
    <sg-table
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
        @size-change=" sizeChange"
        @current-change="change"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
    >
      <div slot="searchBar" >
        <div>
          <el-form size="mini" :model="form" label-width="120px"  :inline="true" :show-message="false">
            <el-form-item label="名称：" prop="dividendTypeName">
              <el-input v-model="form.dividendTypeName" clearable/>
            </el-form-item>
            <el-form-item label="描述：">
              <el-input v-model="form.description" clearable/>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="form.enableFlag" filterable placeholder="请选择" clearable>
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search" @keydown.enter.native="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div slot="header" class="header">
        <div style="text-align: right">
          <el-button size="mini"  v-has-permi="['confinement:dividendType:add']" type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button>
          <el-button size="mini"  v-has-permi="['confinement:dividendType:delete']" type="danger" icon="el-icon-plus" @click="deleteDialogs">删除</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'enableFlag'">
          <div v-if="data.custom.enableFlag==0">启用</div>
          <div v-if="data.custom.enableFlag==1">禁用</div>
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text"  v-has-permi="['confinement:dividendType:edit']"  @click="editDialogs(data)">编辑</el-button>
        </div>
      </template>
    </sg-table>
    <!--  新增 编辑-->
    <sgDialog :title="giftTitle"  size="600px" :dialog="showDialogS" @handleClose="showdialogT">
      <div slot="out">
        <div class="formBody">
          <el-form label-width="125px" label-position="right" :inline="true" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
            <el-form-item label="类型名称：" prop="dividendTypeName" >
              <el-input v-model="formlist.dividendTypeName"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="类型描述：" prop="description">
              <el-input v-model="formlist.description"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="状态：" prop="enableFlag">
              <el-select v-model="formlist.enableFlag" filterable style="width: 140px;"  placeholder="请选择" >
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remarks">
              <el-input v-model="formlist.remarks"  style="width: 140px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submit(formlist)">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        </div>
      </div>
    </sgDialog>
  </div>
</template>
<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'

export default {
  components: {
    SgTable,
    sgDialog
  },
  data(){
    return{
      tableData:[],
      columns:[

        {
          lab: '类型名称',
          val: 'dividendTypeName'
        },
        {
          lab: '类型描述',
          val: 'description'
        },{
          lab: '状态',
          val: 'enableFlag',
          custom: 'enableFlag',
        },
        {
          lab: '备注',
          val: 'remarks',
        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit',
        },
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      form:{
        enableFlag:'0'
      },
      giftTitle:'新增',
      showDialogS:false,
      formlist:{},
      statusList:[
        {
          value: '1',
          label: '禁用'
        },
        {
          value: '0',
          label: '启用'
        },
      ],

      rules: {
        dividendTypeName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
        ],
      },
      xflag:0,
      editList:'',
      selectionData:[],
      giftType:[]
    }
  },
  created() {
    this.dividendTypeList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.search()
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
            this.dividendTypeList()
        },

    },
  methods:{
    //新增按钮
    addDialogs(){
      this.xflag=0
      this.formlist={
        dividendTypeName:'',
        remarks:'',
        enableFlag:'',
        description:''
      }
      this.showDialogS = true
    },
    //编辑按钮
    editDialogs(val){
      this.editList=val.custom
      this.xflag=1
      this.showDialogS = true
      this.giftTitle='修改'
      this.formlist={
        dividendTypeName:this.editList.dividendTypeName,
        remarks:this.editList.remarks,
        enableFlag:this.editList.enableFlag,
        description:this.editList.description
      }
    },
    //删除按钮
    deleteDialogs(){
      if (this.selectionData.length==0){
        this.$message.warning('请先选择一条数据')
        return
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.modules.bookProject.dividendTypeDelete(this.selectionData[0].dividendTypeId).then(res => {
          if (res) {
            console.log(res,'res')
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.dividendTypeList()
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //搜锁按钮
    search(){
      this.dividendTypeList()
    },
    //弹窗关闭
    showdialogT(){
      this.showDialogS = false
    },
    //保存
    submit(){
      if (this.xflag==0){
        this.add()
      }else {
        this.edit()
      }
    },
    // 新增
    add(){
      const query={
        dividendTypeName:this.formlist.dividendTypeName,
        remarks:this.formlist.remarks,
        enableFlag:this.formlist.enableFlag,
        description:this.formlist.description,
          deptId:this.deptId
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.bookProject.dividendTypeAdd(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS = false
              this.dividendTypeList()
            }
          })
        } else {
          return false;
        }
      });
    },
    //修改i
    edit(){
      const query={
        dividendTypeName:this.formlist.dividendTypeName,
        remarks:this.formlist.remarks,
        enableFlag:this.formlist.enableFlag,
        description:this.formlist.description,
        dividendTypeId: this.editList.dividendTypeId
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.bookProject.dividendTypeEdit(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS = false
              this.dividendTypeList()
            }
          })
        } else {
          return false;
        }
      });
    },
    //关闭
    close(){
      this.showDialogS = false
    },
    //获取礼品基本信息列表
    dividendTypeList(){
      const query={
        pageNum:this.pagination.pageNum,
        pageSize:this.pagination.pageSize,
        dividendTypeName:this.form.dividendTypeName,
        description:this.form.description,
        enableFlag:this.form.enableFlag,
          deptId:this.deptId
      }
        console.log(query)
      this.$api.modules.bookProject.dividendTypeList(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },

    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.dividendTypeList() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.dividendTypeList()
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
  }
}
</script>
<style>
.footer{
  margin-top: 10px;
  text-align: right;
}
.header{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>