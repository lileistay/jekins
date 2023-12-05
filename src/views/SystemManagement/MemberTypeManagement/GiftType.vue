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
      <el-form size="mini" :model="form" label-width="120px" :inline="true" :show-message="false">
            <el-form-item label="类型代码：">
              <el-input v-model="form.giftTypeType" clearable/>
            </el-form-item>
            <el-form-item label="类型名称：">
              <el-input v-model="form.giftTypeName" clearable/>
            </el-form-item>
        <el-form-item label="是否启用：">
          <el-select  filterable v-model="form.region" placeholder="请选择" clearable>
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click.stop="search" @keydown.enter.native="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
  <div slot="header" class="header">

    <div style="text-align: right">
      <el-button size="mini" type="primary" v-has-permi="['share:giftTypeInfo:add']" icon="el-icon-plus" @click="addDialogs">新增</el-button>
      <el-button size="mini" type="danger" v-has-permi="['share:giftTypeInfo:delete']"  icon="el-icon-plus" @click="deleteDialogs">删除</el-button>
    </div>
  </div>
  <template #custom="data">
    <div v-if="data.props === 'sataus'">
      <div v-if="data.custom.sataus==1">禁用</div>
      <div v-if="data.custom.sataus==0">启用</div>
    </div>
    <div v-if="data.props === 'edit'">
      <el-button type="text" v-has-permi="['share:giftTypeInfo:edit']"   @click="editDialogs(data)">编辑</el-button>
    </div>
  </template>
</sg-table>
<!--  新增 编辑-->
  <sgDialog :title="giftTitle"  size="600px" :dialog="showDialogS" @handleClose="showdialogT">
    <div slot="out">
      <div class="formBody">
        <el-form :inline="true" label-width="125px" label-position="right" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
          <el-form-item label="礼品类型名称：" prop="giftTypeName">
            <el-input v-model="formlist.giftTypeName"  style="width: 140px;" />
          </el-form-item>
          <el-form-item label="礼品类型代码：" prop="giftTypeType">
            <el-input v-model="formlist.giftTypeType"  style="width: 140px;" />
          </el-form-item>
          <el-form-item label="礼品类型描述：">
            <el-input v-model="formlist.remark"  style="width: 140px;" />
          </el-form-item>
          <el-form-item label="是否启用：">
            <el-select filterable v-model="formlist.sataus" style="width: 140px;"  placeholder="请选择" >
              <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
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
          lab: '礼品类型代码',
          val: 'giftTypeType'
        },
        {
          lab: '礼品类型名称',
          val: 'giftTypeName'
        },{
          lab: '是否启用',
          val: 'sataus',
          custom:'sataus'
        },
        {
          lab: '礼品描述',
          val: 'remark'
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
        region:'0'
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
      rules: {
        giftTypeName: [
          { required: true, message: '请输入礼品名称', trigger: 'blur' },
        ],
        giftTypeType: [
          { required: true, message: '请输入礼品类型代码', trigger: 'blur' },
        ]
      },
      xflag:0,
      editList:'',
    }
  },
  created() {
    this.followUpRecordList()
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
      this.followUpRecordList()
    },
  },
  methods:{
    //新增按钮
    addDialogs(){
      this.xflag=0
      this.formlist={
        delFlag:'0',
        giftTypeName:'',
        giftTypeType:'',
        sataus:'',

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
        delFlag:'0',
        giftTypeName:val.custom.giftTypeName,
        giftTypeType:val.custom.giftTypeType,
        sataus:val.custom.sataus,
        remark:val.custom.remark,
      }
    },
    //删除按钮
    deleteDialogs(){
      this.$confirm('确定删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.modules.bookProject.giftTypeInfoDelete(this.selectionData[0].giftTypeId).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.followUpRecordList()
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
      this.followUpRecordList()
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
        delFlag:'0',
        giftTypeName:this.formlist.giftTypeName,
        giftTypeType:this.formlist.giftTypeType,
        sataus:this.formlist.sataus,
        remark:this.formlist.remark,
        deptId:this.deptId
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.bookProject.giftTypeInfoAdd(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS = false
              this.followUpRecordList()
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
        delFlag:'0',
        giftTypeName:this.formlist.giftTypeName,
        giftTypeType:this.formlist.giftTypeType,
        sataus:this.formlist.sataus,
        giftTypeId:this.editList.giftTypeId,
        remark: this.formlist.remark,
        deptId:this.deptId
      }
      console.log(query,'queryquery')
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.bookProject.giftTypeInfoEdit(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS = false
              this.followUpRecordList()
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
    //获取礼品类型列表
    followUpRecordList(){
      const query={
        pageNum:this.pagination.pageNum,
        pageSize:this.pagination.pageSize,
        giftTypeType:this.form.giftTypeType,
        giftTypeName:this.form.giftTypeName,
        sataus:this.form.region,
        deptId:this.deptId
      }
       this.$api.modules.bookProject.giftTypeInfo(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.followUpRecordList() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.followUpRecordList()
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