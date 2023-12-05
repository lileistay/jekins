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
            <el-form-item label="礼品名称：">
              <el-input v-model="form.giftName" clearable/>
            </el-form-item>
            <el-form-item label="礼品型号：">
              <el-input v-model="form.model" clearable/>
            </el-form-item>
            <el-form-item label="兑换积分：">
              <el-input v-model="form.integralMin" clearable style="width: 130px"/>至
              <el-input v-model="form.integralMax" clearable style="width: 130px"/>
            </el-form-item>
            <el-form-item label="是否有效：">
              <el-select v-model="form.isWhether" placeholder="请选择" clearable filterable>
                <el-option label="是" value="0"></el-option>
                <el-option label="否" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="礼品类型：">
              <el-select v-model="form.region" placeholder="请选择" clearable filterable>
                <el-option
                    v-for="item in giftType"
                    :key="item.giftTypeId"
                    :label="item.giftTypeName"
                    :value="item.giftTypeId">
                </el-option>
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
          <el-button  v-has-permi="['share:giftTypeList:add']" size="mini" type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button>
          <el-button  v-has-permi="['share:giftTypeList:delete']" size="mini" type="danger" icon="el-icon-plus" @click="deleteDialogs">删除</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'sataus'">
          <div v-if="data.custom.sataus==1">禁用</div>
          <div v-if="data.custom.sataus==0">启用</div>
        </div>
        <div v-if="data.props === 'isWhether'">
          <div v-if="data.custom.isWhether==1">否</div>
          <div v-if="data.custom.isWhether==0">是</div>
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text" v-has-permi="['share:giftTypeList:edit']"  @click="editDialogs(data)">编辑</el-button>
        </div>
      </template>
    </sg-table>
    <!--  新增 编辑-->
    <sgDialog :title="giftTitle"  size="600px" :dialog="showDialogS" @handleClose="showdialogT">
      <div slot="out">
        <div class="formBody">
          <el-form label-width="110px" label-position="right" :inline="true" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
            <el-form-item label="礼品名称：" prop="giftName">
              <el-input v-model="formlist.giftName"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品型号：" prop="model">
              <el-input v-model="formlist.model"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品类型：" prop="giftTypeId">
              <el-select v-model="formlist.giftTypeId" placeholder="请选择" clearable filterable style="width: 140px;">
                <el-option
                    v-for="item in giftTypeAdd"
                    :key="item.giftTypeId"
                    :label="item.giftTypeName"
                    :value="item.giftTypeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="礼品单位：" prop="unit">
              <el-input v-model="formlist.unit"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="生产日期：" prop="productionDate">
            <el-date-picker
                v-model="formlist.productionDate"
                type="datetime"
                placeholder="选择生产日期" style="width: 140px;"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期：" prop="validDate">
              <el-date-picker
                  v-model="formlist.validDate"
                  type="datetime"
                  placeholder="选择有效期" style="width: 140px;"  value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="总兑换积分：" prop="redeemPoints">
              <el-input v-model="formlist.redeemPoints"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="是否有效：">
              <el-select v-model="formlist.isWhether" filterable style="width: 140px;"  placeholder="请选择" >
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="微信是否有效：">
              <el-select filterable v-model="formlist.wtrWhether" style="width: 140px;"  placeholder="请选择" >
                <el-option
                    v-for="item in wtrWhetherList"
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
          lab: '礼品名称',
          val: 'giftName'
        },
        {
          lab: '礼品类型',
          val: 'giftTypeName'
        },{
          lab: '礼品型号',
          val: 'model',
        },
        {
          lab: '兑换积分',
          val: 'redeemPoints'
        },
        {
          lab: '生产日期',
          val: 'productionDate',
        },
        {
          lab: '是否有效',
          val: 'isWhether',
          custom: 'isWhether',
        },
        {
          lab: '有效期',
          val: 'validDate',
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
        isWhether:'0'
      },
      giftTitle:'新增',
      showDialogS:false,
      formlist:{},
      statusList:[
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        },
      ],
      wtrWhetherList:[
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        },
      ],
      rules: {
        giftName: [
          { required: true, message: '请输入礼品名称', trigger: 'blur' },
        ],
        model: [
          { required: true, message: '请输入礼品型号', trigger: 'blur' },
        ],
        redeemPoints: [
          { required: true, message: '请输入兑换积分', trigger: 'blur' },
        ]
      },
      xflag:0,
      editList:'',
      selectionData:[],
      giftType:[],
      giftTypeAdd:[]
    }
  },
  created() {
    this.followUpRecordList()
    this.giftTypeInfo()
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
      this.giftTypeInfo()
    },
  },
  methods:{
    //新增按钮
    addDialogs(){
      this.xflag=0
      this.formlist={
        giftName:'',
        model:'',
        productionDate:'',
        validDate:'',
        isWhether:'',
        unit:'',
        giftTypeId:'',
        wtrWhether:'',
        redeemPoints:''
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
        giftName:this.editList.giftName,
        model:this.editList.model,
        productionDate:this.editList.productionDate,
        validDate:this.editList.validDate,
        isWhether:this.editList.isWhether,
        unit:this.editList.unit,
        giftTypeId:this.editList.giftTypeId,
        wtrWhether:this.editList.wtrWhether,
        redeemPoints:this.editList.redeemPoints
      }
    },
    //删除按钮
    deleteDialogs(){
      if (this.selectionData.length==0){
        this.$message.warning('请先选择一条数据')
        return
      }
      this.$confirm('确定删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.modules.bookProject.giftBasicInfoDelete(this.selectionData[0].giftTypeListId).then(res => {
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
        giftName:this.formlist.giftName,
        model:this.formlist.model,
        productionDate:this.formlist.productionDate,
        validDate:this.formlist.validDate,
        isWhether:this.formlist.isWhether,
        unit:this.formlist.unit,
        giftTypeId:this.formlist.giftTypeId,
        wtrWhether:this.formlist.wtrWhether,
        redeemPoints:this.formlist.redeemPoints,
        deptId:this.deptId
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.bookProject.giftBasicInfoAdd(query).then(res => {
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
        giftName:this.formlist.giftName,
        model:this.formlist.model,
        productionDate:this.formlist.productionDate,
        validDate:this.formlist.validDate,
        isWhether:this.formlist.isWhether,
        unit:this.formlist.unit,
        giftTypeId:this.formlist.giftTypeId,
        wtrWhether:this.formlist.wtrWhether,
        redeemPoints:this.formlist.redeemPoints,
        giftTypeListId:this.selectionData[0].giftTypeListId,
        deptId:this.deptId
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.$api.modules.bookProject.giftBasicInfoEdit(query).then(res => {
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
    //获取礼品基本信息列表
    followUpRecordList(){
      const query={
        pageNum:this.pagination.pageNum,
        pageSize:this.pagination.pageSize,
        giftName:this.form.giftName,
        model:this.form.model,
        isWhether:this.form.isWhether,
        integralMin :this.form.integralMin,
        integralMax:this.form.integralMax,
        giftTypeId:this.form.region,
        deptId:this.deptId
      }
      this.$api.modules.bookProject.giftBasicInfo(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 获取礼品类型列表
    giftTypeInfo(){
      const query={
        delFlag: "0",
        deptId:this.deptId
      }
      this.$api.modules.bookProject.giftTypeInfo(query).then(res => {
        if (res) {
          this.giftType = res.rows
          this.giftTypeAdd = res.rows
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