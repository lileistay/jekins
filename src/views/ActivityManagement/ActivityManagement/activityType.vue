<template>
  <div>

  <!-- 活动类型 -->
  <slideSearch :options="options">
    <div slot="btnBar">
      <el-button
        size="mini"
        icon="el-icon-search"
        type="primary"
        plain
        @click.stop="getData(true)"
        @keydown.enter.native="getData(true)"
      >查询
      </el-button>
    </div>
    <slot>
      <sg-table
        id="out-table"
        ref="table"
        :sg-ref="'multipleTable'"
        size="mini"

        border
        index="序号"
        highlight-current-row
        :table-data="tableData"
        :columns="columns"
        :pagination="pagination"
        stripe
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
        :hideSearchBar="true"
      >
        <!-- 按钮 -->
        <div slot="header" style="width: 100%;">
          <span style="font-size: 14px;color: #999;"><i style="cursor:pointer" class="el-icon-s-fold"/>列表清单</span>
<!--          <el-button-->
<!--            type="danger"-->
<!--            size="mini"-->
<!--            plain-->
<!--            style="float: right;margin-left: 10px"-->
<!--          >删除选中-->
<!--          </el-button>-->
          <el-button
            type="primary"
            size="mini"
            plain
            style="float: right;"
            @click="showDialog"
          >添加类型
          </el-button>
        </div>

        <template #custom="data">
          <div v-if="data.props === 'eventsFlag'">
            <show-dict-data :options="dict.type.eventsFlag" :value="data.custom.eventsFlag" />
          </div>
          <div v-if="data.props === 'useFlag'">
            <show-dict-data :options="dict.type.useFlag" :value="data.custom.useFlag" />
          </div>

          <div v-if="data.props === 'edit'">
            <a @click="editDialog(data.custom)">编辑</a>
            <a style="margin-left: 10px;color:red" @click="deleteDialog(data.custom)">删除</a>
          </div>
        </template>
      </sg-table>
    </slot>
  </slideSearch>
  <sgDialog :title="giftTitle"  size="370px" :dialog="showDialogS" @handleClose="showDialogS=false">
    <div slot="out">
      <div class="formBody">
        <el-form label-width="125px" label-position="left" :inline="true" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
          <el-form-item label="活动类型名称：" prop="activeName" >
            <el-input v-model="formlist.activeName"   style="width: 190px;" />
          </el-form-item>
          <el-form-item label="活动类型类别：" prop="activeType">
            <el-select filterable clearable v-model="formlist.activeType" size="mini" style="width: 190px;">
              <el-option v-for="item in dict.type.eventsFlag" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </div>
      <div class="footer" style="text-align: right">
        <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submit(formlist)">保存</el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="showDialogS=false">关闭</el-button>
      </div>
    </div>
  </sgDialog>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import moment from "moment/moment";
export default {
  components:{
    slideSearch,
    SgTable,
    sgDialog
  },
  dicts:['eventsFlag','useFlag'],
    data(){
      return{
        submitLoadings:false,//导出loding
        options:{
          eventsTypeName: {
            type: 'input',
            label: '活动类型名称'
          },
          eventsFlag: {
            type: 'select',
            label: '活动类型类别',
            clearable: true,
            options:[]
          },
        },
        tableData:[],
        columns:[
          {
            lab: '活动类型名称',
            val: 'eventsTypeName',
          },
          {
            lab: '活动类型类别',
            val: 'eventsFlag',
            custom: 'eventsFlag'
          },
          {
            lab: '是否有效',
            val: 'useFlag',
            custom: 'useFlag'
          },
          {
            lab: '操作',
            val: 'edit',
            custom: 'edit',
          },
        ],
        pagination:{
          show: true,
          pageNum: 1,
          pageSize: 20,
          total: 0,
          currentPage: 1
        },
        showDialogS:false,
        giftTitle:'添加类型',
        formlist:{},
        rules:{
          activeName: [
            { required: true, message: '请输入活动类型名称', trigger: 'blur' }
          ],
          activeType: [
            { required: true, message: '请输入活动类型类别', trigger: 'change' },
          ],
        },
        Xflag:null
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
      this.getData()
    },
  },
  created() {
    this.options.eventsFlag.options=this.dict.type.eventsFlag
    this.getData()
  },
  methods:{
    // 列表
    getData(){
      var data = {}
      this.submitLoadings = true
      for (const k in this.options) {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
      }
      const query={
        ...this.pagination,
        ...data
        // eventsTypeName:this.formlist.activeName,
        // eventsFlag:this.formlist.activeType
      }
      this.$api.modules.active.eventsTypeList(query).then(res=>{
        if (res.code==200){
          this.tableData=res.rows
          this.pagination.total=res.total
        }
      })
    },
    // 导出
    exportExcel(){

    },
    showDialog(){
      this.showDialogS=true
      this.Xflag=0
      this.formlist={}
      this.giftTitle='添加类型'
    },
    editDialog(item){
      this.Xflag=1
      this.showDialogS=true
      this.formlist={
        activeName:item.eventsTypeName,
        eventsTypeId:item.eventsTypeId,
        activeType:item.eventsFlag
      }
      this.giftTitle='修改类型'
    },
    deleteDialog(item){
      this.$confirm('是否确认删除该数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const eventsTypeId=item.eventsTypeId
        await this.$api.modules.active.eventsTypeDelete(eventsTypeId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },

    submit(){
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          const query={
            deptId:this.deptId ,
            eventsTypeId:this.formlist.eventsTypeId?this.formlist.eventsTypeId:'',
            eventsTypeName:this.formlist.activeName,
            eventsFlag:this.formlist.activeType
          }
          if(this.Xflag==0){
            this.$api.modules.active.eventsTypeAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success(res.msg)
                this.getData()
                this.showDialogS=false
              }
            })
          }else {
            this.$api.modules.active.eventsTypeEdit(query).then(res=>{
              if (res.code==200){
                this.$message.success(res.msg)
                this.getData()
                this.showDialogS=false
              }
            })
          }

        }
      })
    },

    /**
        * @Description: 表格单选
    */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /**
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
  }
}
</script>

<style>

</style>
