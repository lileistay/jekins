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
            <el-form-item label="礼品类型：">
              <el-select v-model="form.giftType" style="width: 140px;"  placeholder="请选择" filterable clearable>
                <el-option
                    v-for="item in giftTypeList"
                    :key="item.giftTypeId"
                    :label="item.giftTypeName"
                    :value="item.giftTypeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="礼品名称：">
              <el-select v-model="form.giftName" style="width: 140px;"  placeholder="请选择" filterable clearable>
                <el-option
                    v-for="item in giftNameList"
                    :key="item.giftTypeListId"
                    :label="item.giftName"
                    :value="item.giftTypeListId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="search" @click.stop="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <template #custom="data">
        <div v-if="data.props === 'edit'">
          <el-button size="mini" v-has-permi="['share:giftIncomingOutgoingInfo:edit']" type="text" @click="addDialogs(data)">入库</el-button>
          <el-button type="text" v-has-permi="['share:giftIncomingOutgoingInfo:edit']"  @click="editDialogs(data)">出库</el-button>

        </div>
      </template>
    </sg-table>
    <!--  新增 编辑-->
    <sgDialog :title="giftTitle"  size="600px" :dialog="showDialogS" @handleClose="showdialogT">
      <div slot="out">
        <div class="formBody">
          <el-form label-width="125px" label-position="right" :inline="true" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
            <el-form-item label="礼品类型：" prop="giftType" >
              <el-input v-model="formlist.giftType" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品名称：" prop="giftName">
              <el-input v-model="formlist.giftName"  disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品单位：" prop="unit">
              <el-input v-model="formlist.unit" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品数量：" prop="number">
              <el-input v-model="formlist.number"  style="width: 140px;" />
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
          lab: '礼品类型',
          val: 'giftTypeName'
        },
        {
          lab: '礼品名称',
          val: 'giftName'
        },{
          lab: '礼品型号',
          val: 'model',
        },
        {
          lab: '兑换积分',
          val: 'redeemPoints',
        },
        {
          lab: '单位',
          val: 'unit',
        },
        {
          lab: '数量',
          val: 'changeAmount',
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
        number: [
          { required: true, message: '请输入礼品数量', trigger: 'blur' },
        ],
      },
      xflag:0,
      editList:'',
      selectionData:[],
      giftTypeList:[],
      giftNameList:[]
    }
  },
  created() {
    this.getInOutInventoryList()
    this.followUpRecordList()
    this.giftBasicInfo()
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
      this.getInOutInventoryList()
      this.followUpRecordList()
      this.giftBasicInfo()
    },
  },
  methods:{
    //获取礼品类型列表
    followUpRecordList(){
      const query={
        deptId:this.deptId
      }
      this.$api.modules.bookProject.giftTypeInfo(query).then(res => {
        if (res) {
          this.giftTypeList = res.rows
        }
      })
    },
    //获取礼品基本信息列表
    giftBasicInfo(){
      const query={
        deptId:this.deptId
      }
      this.$api.modules.bookProject.giftBasicInfo(query).then(res => {
        if (res) {
          this.giftNameList = res.rows
        }
      })
    },
    //新增按钮
    addDialogs(val){
      this.editList=val.custom
      this.giftTitle='入库'
      this.xflag=0
      this.formlist={
        giftType:this.editList.giftTypeName,
        giftName:this.editList.giftName,
        unit:this.editList.unit,
        remarks:this.editList.remarks,
        // number:this.editList.changeAmount
      }
      this.showDialogS = true
    },
    //编辑按钮
    editDialogs(val){
      this.editList=val.custom
      if (this.editList.changeAmount<=0){
        this.$message.warning('数量小于等于0时，无法出库')
        return
      }
      this.xflag=1
      this.showDialogS = true
      this.giftTitle='出库'
      this.formlist={
        giftType:this.editList.giftTypeName,
        giftName:this.editList.giftName,
        unit:this.editList.unit,
        remarks:this.editList.remarks,
        // number:this.editList.changeAmount
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
            this.getInOutInventoryList()
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
      this.getInOutInventoryList()
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
    // 入库
    add(){
      const query={
        giftTypeName:this.formlist.giftType,
        giftName:this.formlist.giftName,
        unit:this.formlist.unit,
        remarks:this.formlist.remarks,
        changeAmount:this.formlist.number,
        changeState:'0',
        giftTypeId:this.selectionData[0].giftTypeId,
        giftTypeListId:this.selectionData[0].giftTypeListId,
        model:this.selectionData[0].model,
        deptId:this.deptId
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.activityManagement.giftIncomingOutgoingInfo(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS = false
              this.getInOutInventoryList()
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
        giftTypeName:this.formlist.giftType,
        giftName:this.formlist.giftName,
        unit:this.formlist.unit,
        remarks:this.formlist.remarks,
        changeAmount:this.formlist.number,
        changeState:'1',
        giftTypeId:this.selectionData[0].giftTypeId,
        giftTypeListId:this.selectionData[0].giftTypeListId,
        model:this.selectionData[0].model,
        deptId:this.deptId
      }
      if (this.selectionData[0].changeAmount<this.formlist.number){
          this.$message.warning('出库礼品数量不能大于现有礼品数量')
        return
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.activityManagement.giftIncomingOutgoingInfo(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS = false
              this.getInOutInventoryList()
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
    //获取礼品出入库信息
    getInOutInventoryList(){
      const query={
        pageNum:this.pagination.pageNum,
        pageSize:this.pagination.pageSize,
        giftTypeId:this.form.giftType,
        giftTypeListId:this.form.giftName,
        deptId:this.deptId
      }
      this.$api.modules.activityManagement.getInOutInventoryList(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },

    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.getInOutInventoryList() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getInOutInventoryList()
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