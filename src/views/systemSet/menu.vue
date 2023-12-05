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
        <div v-if="data.props=='titleTextse'">
          <el-input size="mini" @blur="blurIndex(data.custom,$event)" style="width: 100px" v-model="data.custom.displayOrder">

          </el-input>
        </div>
        <div v-if="data.props=='displayType'">
          <div>{{data.custom.displayType=='1'?'管理端':'客户端'}}</div>
        </div>
        <div v-if="data.props=='defaultPosition'">
          <show-dict-data :options="dict.type.position" :value="data.custom.defaultPosition" />
        </div>
        <div v-if="data.props=='titleText'">
          <el-button type="text"  size="mini" @click="goChildren(data.custom)" >{{data.custom.titleText}}</el-button>
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text"  size="mini" @click="edit(data.custom)" style="color: #E6A23C">修改</el-button>
          <el-button type="text"  size="mini" @click="handleDelete(data.custom)" style="color: #F56C6C">删除</el-button>
        </div>
        <div v-if="data.props === 'icon'">
          <svg-icon :icon-class="data.custom.icon" v-if="data.custom.displayType=='1'" />
          <div v-else>
            <img :src="getImg(data.custom)"   style="width: 30px;height: 30px;border-radius: 50%"/>
          </div>
<!--          <img :src="serverPath" v-else />-->
<!--          <img :src=""  />-->
        </div>
      </template>
    </sg-table>
    <sgDialog :title="dialogTitle" size="400px" :dialog="showDialog" v-if="showDialog" @handleClose="showDialog=false">
      <div slot="out">
        <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="95px" label-position="right">
          <div >
            <el-form-item label="菜单名称" prop="menuName" >
              <el-input clearable v-model="form.menuName"  ></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="displayType" >
              <el-select size="mini" v-model="form.displayType" style="width:265px" :disabled="typedisable">
              <el-option :value="item.value" :label="item.label" v-for="item in listType"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="路径" prop="path">
              <el-input v-model="form.path"  clearable  ></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon" v-if="form.displayType==1">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" :active-icon="form.icon" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    style="width: 25px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="颜色" v-if="form.displayType==1">
              <el-input  v-model="form.color" placeholder="点击选择颜色" @focus="Clickcolor"> </el-input>
              <chrome-picker  v-if="isInput" v-model="colors" @input="updateValue" />
            </el-form-item>
            <el-form-item label="菜单图标" v-if="form.displayType==2" prop="icon">
                    <Upload @successFile="successFile" :limit="1" @remove="remove" :fileList="fileList"></Upload>
              </el-form-item> 
            <el-form-item label="默认位置" prop="path" v-if="form.displayType==1">
              <el-select filterable v-model="form.position" style="width: 100%;"   placeholder="请选择">
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
import Upload from '@/components/newUpload'
import {Chrome,Grayscale} from "vue-color";

const serverPath = process.env.VUE_APP_BASE_API + '/file'
export default {
  dicts: ['position'],
  name: "menu1",
  components:{
    sgTable,
    sgDialog,
    IconSelect,
    Upload,
    "chrome-picker": Chrome,
    "grayscale-picker": Grayscale,
  },
  watch:{
    'form.displayType'(newv){
      console.log(newv,'DSADASD')
    }
  },
  data(){

    return{
      fileList:[],
      typedisable:false,
      tableData:[],
      groupmessagelistmorel:"",
      listType:[
        {
          label:"管理端",
          value:'1'
        },
        {
          label:"客户端",
          value:'2'
        }
      ],
      // 表格数据列
      columns: [
        {
          lab: '排序',
          val: 'titleText',
          custom: 'titleTextse'
        },
        {
          lab: '菜单类型',
          val: 'displayType',
          custom: 'displayType'
        },
        {
          lab: '菜单名称',
          val: 'titleText',
          custom: 'titleText'
        },
        {
          lab: '图标',
          val: 'icon',
          custom: 'icon'
        },
        {
          lab: '菜单地址',
          val: 'path'
        },
        {
          lab: '默认位置',
          val: 'defaultPosition',
          custom: 'defaultPosition'
        },
        {
          lab: '创建时间',
          val: 'createTime'
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
      form:{ 
       
      },
      submitLoading:false,
      rules:{
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
       displayType: [
            { required: true, message: '请选择菜单类型', trigger: 'change' }
          ],
          icon:[
          { required: true, message: '请上传菜单图标', trigger: 'change' }
          ]
        // icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
      },
      colors: {
        color: "",
        hex: "#194d33",
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1,
      },
      isInput:false

    }
  },
  created() {
    this.getData()
    this.form.displayType='1'
  },
  methods:{
    blurIndex(item,index){
      const query={
        mpmId:item.mpmId,
        displayOrder:index.target.value
      }
      this.$api.modules.systemset.miniProgramMenuListEdit(query).then(res => {
        if (res) {
          this.getData()
          this.$message.success(res.msg)
          this.showDialog = false
        }
      }).finally(() => {
        this.showDialog = false
        this.isInput=false
      })
    },
    // 值改变事件
    getImg(item){
      return serverPath+item.icon
    },
    remove(data){
      this.form.icon=''
    },
    successFile(data){
      this.form.icon=data.url;
    },
    updateValue(value) {
      this.form.color=value.hex
    },
    Clickcolor(){
      this.isInput=true
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
      this.showDataDialog = true
      this.$api.modules.systemset.miniProgramMenuList(this.pagination).then(res => {
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
      this.dialogTitle='新增菜单'
      this.form={
        menuName:'',
        path:'',
        icon:'',
        mpmId:'',
        position:'',
        displayType:'1',
        icon:"",
      }
      this.fileList=[];
      this.typedisable=false;
    },
    // 确定
    submitForm(){
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.dialogTitle=='新增菜单'){
            const query={
              titleText:this.form.menuName,
              path:this.form.path,
              icon:this.form.icon,
              iconColor: this.form.color,
              defaultPosition:this.form.position,
              displayType:this.form.displayType,
              icon:this.form.icon,
              imageType:this.form.displayType
            }
            this.$api.modules.systemset.miniProgramMenuListAdd(query).then(res => {
              if (res) {
                this.getData()
                this.$message.success(res.msg)
                this.showDialog = false
                this.isInput=false
              }
            }).finally(() => {
              this.showDialog = false
              this.isInput=false
            })
          }else if (this.dialogTitle=='修改菜单'){
            const query={
              titleText:this.form.menuName,
              path:this.form.path,
              icon:this.form.icon,
              mpmId:this.form.mpmId?this.form.mpmId:'',
              iconColor: this.form.color,
              defaultPosition:this.form.position,
              imageType:this.form.displayType
            }
            this.$api.modules.systemset.miniProgramMenuListEdit(query).then(res => {
              if (res) {
                this.getData()
                this.$message.success(res.msg)
                this.showDialog = false
                this.isInput=false
              }
            }).finally(() => {
              this.showDialog = false
              this.isInput=false
            })
          }
        }
      })

    },
    edit(val){
      this.dialogTitle='修改菜单'
      this.showDialog=true
      this.form={
        menuName:val.titleText,
        path:val.path,
        icon:val.icon,
        mpmId:val.mpmId,
        color: val.iconColor,
        position:val.defaultPosition,
        displayType:val.displayType,
      }
      this.typedisable=true;
      this.fileList=[{
        name:"菜单图标",
        url:serverPath+val.icon
      }]
    },
    // 删除操作
    handleDelete(e) {
      const makId = e.mpmId
      this.$confirm('是否确认删除此菜单？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.systemset.miniProgramMenuListDelete(makId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    goChildren(val){
      this.$router.push({path:'user'})
      const query={
        mpmId:val.mpmId,
        titleText:val.titleText,
        position:val.defaultPosition
      }
      sessionStorage.setItem('useritem',JSON.stringify(query))
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