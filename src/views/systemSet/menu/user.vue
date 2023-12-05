<template>
  <div>
    <sg-table
      v-if="true"
      index="序号"
      size="mini"
      :table-data="tableData"
      :columns="columns"

      hide-search-bar
      :pagination="pagination"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="handleSelectionChange"
    >
      <div slot="header" style="width: 100%;">
        <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
        <div style="float: right">
          <el-button v-has-permi="['client:markdownTemplates:add']" size="mini" plain type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>

        </div>
        <!--          <el-button size="mini" @click="resetFormSearch">重置</el-button>-->
      </div>
      <template #custom="data">
        <div v-if="data.props=='titleText'">
          <el-button type="text"  size="mini" @click="goChildren(data.custom)" >{{data.custom.titleText}}</el-button>
        </div>
        <div v-if="data.props=='position'">
          <show-dict-data :options="dict.type.position" :value="data.custom.position" />
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text"  size="mini" @click="edit(data.custom)" style="color: #E6A23C">修改</el-button>
          <el-button type="text"  size="mini" @click="handleDelete(data.custom)" style="color: #F56C6C">删除</el-button>
        </div>
      </template>
    </sg-table>
    <sgDialog :title="dialogTitle" size="400px" :dialog="showDialog" v-if="showDialog" @handleClose="showDialog=false">
      <div slot="out">
        <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="95px" label-position="right">
          <div >
            <el-form-item label="菜单名称" prop="menuName" >
              <el-input clearable v-model="form.menuName" disabled  ></el-input>
            </el-form-item>
            <el-form-item label="用户" prop="path">
              <el-select filterable v-model="form.userId"  style="width: 100%;" placeholder="请选择">
                <el-option
                  v-for="item in UserList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="位置" prop="path">
              <el-select filterable v-model="form.position"  style="width: 100%;"  placeholder="请选择">
                <el-option
                  v-for="item in dict.type.position"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </div>
          <div style="text-align: right">
            <el-button type="primary" :loading="submitLoading" size="mini" @click="submitForm">确认</el-button>
            <el-button @click="showDialog = false" size="mini">取消</el-button>
          </div>
        </el-form>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import IconSelect from "@/components/iconSelect";
import {json} from "body-parser";

export default {
  dicts: ['position'],
  name: "user",
  components:{
    sgTable,
    sgDialog,
    IconSelect
  },
  data(){
    return{
      tableData:[],
      // 表格数据列
      columns: [
        {
          lab: '用户名称',
          val: 'userName',
        },
        {
          lab: '位置',
          val: 'position',
          custom: 'position'
        },
        {
          lab: '操作',
          val: 'edit',
          custom:'edit'
        }
      ],
      // 分页 搜索
      pagination: {
        show: true,
        deptId: undefined,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      ids:'',
      dialogTitle:'新增菜单',
      showDialog:false,
      form:{ },
      submitLoading:false,
      rules:{
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
        // icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
      },

    }
  },
  created() {
    this.queryList=  JSON.parse(sessionStorage.getItem('useritem'))
    this.form.menuName=this.queryList.titleText
    this.getData()
    this.getUserList()
  },
  computed: {
    // eslint-disable-next-line vue/no-dupe-keys
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
      this.getUserList()
    },
  },
  methods:{
    async getUserList(){
      const deptId=this.deptId
      await this.$api.modules.systemset.selectUser(deptId).then(res => {
        if (res) {
          this.UserList=res.data
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 选择图标
    selected(name) {
      this.form.icon = name;
      this.$set(this.form,'icon',name)
    },
    // 表单重置
    reset() {
      this.form = {
        icon: undefined,
      };
      this.resetForm("form");
    },
    // 获取数据
    getData(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const query={
        mpmId: this.queryList.mpmId
      }
      this.showDataDialog = true
      this.$api.modules.systemset.userMenuRelationships({...this.pagination,...query}).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 新增
    handleAdd(){
      this.showDialog=true
      this.dialogTitle='新增用户'
      this.form={
        menuName:this.queryList.titleText,
        path:'',
        icon:'',
        mpmId:'',
        position:this.queryList.position
      }
    },
    // 确定
    submitForm(){

      if (this.dialogTitle=='新增用户'){
        const query={
          mpmId:this.queryList.mpmId,
          useId:this.form.userId,
          position:this.form.position
        }
        this.$api.modules.systemset.userMenuRelationshipsAdd(query).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
            this.showDialog = false
          }
        }).finally(() => {
          this.showDialog = false
        })
      }else if (this.dialogTitle=='修改菜单'){
        const query={
          mpmId:this.queryList.mpmId,
          userId:this.form.useId,
          umrId:this.form.umrId,
          position:this.form.position,
          menuName:this.queryList.titleText,
        }
        this.$api.modules.systemset.userMenuRelationshipsEdit(query).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
            this.showDialog = false
          }
        }).finally(() => {
          this.showDialog = false
        })
      }
    },
    edit(val){
      this.dialogTitle='修改菜单'
      this.showDialog=true
      this.form={
        mpmId:this.queryList.mpmId,
        userId:val.useId,
        umrId:val.umrId,
        position:val.position,
        menuName:this.queryList.titleText,
      }
    },
    // 删除操作
    handleDelete(e) {
      const umrId = e.umrId
      this.$confirm('是否确认删除此用户？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.systemset.userMenuRelationshipsDelete(umrId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    goChildren(val){
      this.$router.push({path:'user',query:{val}})
    },
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.deptChannel)
    },
    // 分页
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

<style scoped>
</style>