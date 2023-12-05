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
          <el-form size="mini"  :model="form" label-width="120px" :inline="true" :show-message="false">
            <el-form-item label="层级：">
              <el-input-number :min="1" v-model="form.relationLevel"  clearable/>
            </el-form-item>
            <el-form-item label="分成比例：">
              <el-input v-model="form.dividendRatio" clearable/>
            </el-form-item>
            <el-form-item label="分成类型：">
              <el-select v-model="form.dividendTypeId" style="width: 140px;"  placeholder="请选择" clearable filterable>
                <el-option
                    v-for="item in dividendTypeLists"
                    :key="item.dividendTypeId"
                    :label="item.dividendTypeName"
                    :value="item.dividendTypeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="form.enableFlag" placeholder="请选择" clearable filterable>
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
          <el-button v-has-permi="['confinement:dividendRatio:add']" size="mini" type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button>
          <el-button v-has-permi="['confinement:dividendRatio:delete']" size="mini" type="danger" icon="el-icon-plus" @click="deleteDialogs">删除</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'enableFlag'">
          <div v-if="data.custom.enableFlag==1">禁用</div>
          <div v-if="data.custom.enableFlag==0">启用</div>
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text" v-has-permi="['confinement:dividendRatio:edit']"  @click="editDialogs(data)">编辑</el-button>
        </div>
      </template>
    </sg-table>
    <!--  新增 编辑-->
    <sgDialog :title="giftTitle"  size="600px" :dialog="showDialogS" @handleClose="showdialogT">
      <div slot="out">
        <div class="formBody">
          <el-form :inline="true" label-width="124px" label-position="right" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
            <el-form-item label="层级：" prop="relationLevel">
              <el-input-number :min="1" v-model="formlist.relationLevel"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="分成比例：" prop="dividendRatio">
              <el-input v-model="formlist.dividendRatio"  style="width: 140px;" />
            </el-form-item>

            <el-form-item label="分成类型：" prop="dividendTypeId">
              <el-select v-model="formlist.dividendTypeId" filterable style="width: 140px;"   placeholder="请选择" >
                <el-option
                    v-for="item in dividendTypeLists"
                    :key="item.dividendTypeId"
                    :label="item.dividendTypeName"
                    :value="item.dividendTypeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否启用：" prop="enableFlag">
              <el-select v-model="formlist.enableFlag" filterable style="width: 140px;"  placeholder="请选择" >
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="礼品类型描述：" prop="remarks">
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
          lab: '分成类型',
          val: 'dividendTypeName'
        },
        {
          lab: '层级',
          val: 'relationLevel'
        },{
          lab: '分成比例',
          val: 'dividendRatio',
        },
        {
          lab: '状态',
          val: 'enableFlag',
          custom: 'enableFlag'
        },
        {
          lab: '备注',
          val: 'remarks'
        },
        {
          lab: '操作',
          val: 'edit',
          custom:'edit'
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
        enableFlag:"0"
      },
      giftTitle:'新增',
      showDialogS:false,
      formlist:{},
      statusList:[
        {
          value: '0',
          label: '启用'
        },
        {
          value: '1',
          label: '禁用'
        },
      ],
      dividendTypeLists:[],
      rules: {
        relationLevel: [
          { required: true, message: '请输入层级', trigger: 'blur' },
        ],
        dividendRatio: [
          { required: true, message: '请输入分成比例', trigger: 'blur' },
        ],
        dividendTypeId: [
          { required: true, message: '请输入分成类型', trigger: 'blur' },
        ],enableFlag: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ]
      },
      xflag:0,
      editList:'',
    }
  },
  created() {
    this.dividendRatioList()
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
        relationLevel:'',
        dividendRatio:'',
        dividendTypeId:'',
        enableFlag:'',
        remarks:''
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
        relationLevel:this.editList.relationLevel,
        dividendRatio:this.editList.dividendRatio,
        dividendTypeId:this.editList.dividendTypeId,
        enableFlag:this.editList.enableFlag,
        remarks:this.editList.remarks,
      }
    },
    //删除按钮
    deleteDialogs(){
      this.$confirm('确定删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.modules.bookProject.dividendRatioDelete(this.selectionData[0].ratioId).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.dividendRatioList()
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
      this.dividendRatioList()
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
        relationLevel:this.formlist.relationLevel,
        dividendRatio:this.formlist.dividendRatio,
        dividendTypeId:this.formlist.dividendTypeId,
        enableFlag:this.formlist.enableFlag,
        remarks:this.formlist.remarks,
        dividendTypeName:'',
          deptId:this.deptId
      }
      query.dividendTypeName=this.dividendTypeLists.filter(item=>item.dividendTypeId==this.formlist.dividendTypeId)[0].dividendTypeName
      console.log(query,'query')
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.bookProject.dividendRatioAdd(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS = false
              this.dividendRatioList()
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
        ratioId:this.editList.ratioId,
        relationLevel:this.formlist.relationLevel,
        dividendRatio:this.formlist.dividendRatio,
        dividendTypeName:'',
        enableFlag:this.formlist.enableFlag,
        remarks:this.formlist.remarks,
        dividendTypeId:this.formlist.dividendTypeId
      }
      query.dividendTypeName=this.dividendTypeLists.filter(item=>item.dividendTypeId==this.formlist.dividendTypeId)[0].dividendTypeName
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.bookProject.dividendRatioEdit(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS = false
              this.dividendRatioList()
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
    //老带新分成比例列表
    dividendRatioList(){
      const query={
        pageNum:this.pagination.pageNum,
        pageSize:this.pagination.pageSize,
        relationLevel:this.form.relationLevel,
        dividendRatio:this.form.dividendRatio,
        dividendTypeId:this.form.dividendTypeId,
        enableFlag:this.form.enableFlag,
      }
      this.$api.modules.bookProject.dividendRatioList(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    //老带新分成比类型列表
    dividendTypeList(){
      const query={
        pageNum:this.pagination.pageNum,
        pageSize:this.pagination.pageSize,
          deptId:this.deptId
      }
        console.log(this.deptId,'this.deptId')
      this.$api.modules.bookProject.dividendTypeList(query).then(res => {
        if (res) {
          this.dividendTypeLists = res.rows
        }
      })
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.dividendRatioList() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.dividendRatioList()
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
::v-deep .formBody .el-input-number__increase{
  display: none !important;
}
::v-deep .el-input-number__increase{
  display: none !important;
}
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