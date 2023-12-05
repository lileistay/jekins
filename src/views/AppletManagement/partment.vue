<template>
  <div>
    <Tree :clums="clums" :operation="operation" :statisticsMessage="false" :isShowfile="isShowfile" :tableData="tableData"
          :showDefault="showDefault" :total="total" :tableIndex="tableIndex" :tableCheckbox="tableCheckbox"
          :row-class-name="rowClassName" @changeCompay="changeCompay" @rowClick="rowClick"
          @handleSelectionChang="handleSelectionChang" @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId" @expandChangelist="expandChangelist"
          @delver="delver" @delveredit="delveredit" :ifexpand="true" @changeIndexlist="changeIndexlist">
      <!-- 头部操作按钮 -->
      <template v-slot:button>

        <div>
          <!-- <span class="Left">快捷操作</span> -->
          <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus" @click="addType"
                     plain :disabled="ifEdit">新增类目</el-button>
          <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus"
                     @click="addTypesecond" plain :disabled="ifEdit">新增二级类目</el-button>
          <input type="file" style="visibility:hidden" id="file" @change="changeImg">
          <input type="file" style="visibility:hidden" id="filesecond" @change="changeImgsecond">
        </div>
      </template>
      <!-- 自定义内容填充 -->
      <template v-slot:tabular="{ data }">
        <!-- <div v-if="data.name == 'projectName'">
            <a href="">不同内容</a>
        </div>
        <div v-if="data.name == 'shelfTime'">
            <a href="">不同需求</a>
        </div> -->
      </template>
      <!-- 操作按钮 -->
      <template v-slot:camera="{ newdata }">
        <el-button type="text" size="mini" @click="newedit(newdata)">
          修改
        </el-button>
        <el-button type="text" size="mini" @click="newdelete(newdata)" style="color: red;">
          删除
        </el-button>
      </template>
      <!-- 自定义页面 -->
      <template v-slot:company>

      </template>
    </Tree>
    <sgDialog :title="TypelistsecondTitle" size="850px" out-top="2%" :dialog="Typelistsecond"
              @handleClose="Typelistsecond = false">
      <div slot="out" style="height:580px">
        <el-form :model="newruleForm" :rules="newrules" ref="newruleForm" label-width="130px" class="demo-ruleForm">
          <el-row>
            <el-col :span="24">
              <el-form-item label="二级类目名称" prop="catalogLevelName">
                <el-input v-model="newruleForm.catalogLevelName" size="mini" placeholder="请输入二级类目名称" maxlength="4" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;height: 70px">
            <el-col :span="12">
              <el-form-item label="背景图片文案" >
                <el-input v-model="newruleForm.bgTxt" size="mini" placeholder="请输入背景图片文字"  :rows="5" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="背景图片">
                <el-input v-model="newruleForm.towBgImg" size="mini" placeholder="请上传背景图片，建议375*600" type="texteara"  @click.native="seleImgsecond" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:80px">
            <el-col :span="24">
              <el-form-item label="二级类目内容" prop="catalogLevelContent">
                <Wangeditor :content="newruleForm.catalogLevelContent" @catchData="catchDatanew" :flag="Typelistsecond">
                </Wangeditor>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div class=""
             style="width: 100%;height: 60px;display: flex;align-items: center;justify-content: center;margin-top:380px">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="submitok">确定</el-button>
            <el-button @click="Typelistsecond = false" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
    <sgDialog :title="TypeTitle" size="850px" out-top="2%" :dialog="Typelist" @handleClose="Typelist = false">
      <div slot="out"
           :style="{ height: ruleForm.catalogLevelType == false || ruleForm.catalogLevelType == null ? '550px' : '200px' }">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="类目名称" prop="categoryName">
                <el-input v-model="ruleForm.categoryName" size="mini"  maxlength="4" show-word-limit placeholder="请输入类目名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主标题" prop="mainHeading">
                <el-input v-model="ruleForm.mainHeading" size="mini"  maxlength="9" show-word-limit placeholder="请输入主标题"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:55px">
            <el-col :span="12">
              <el-form-item label="副标题">
                <el-input v-model="ruleForm.subhead" size="mini" placeholder="请输入副标题，建议两行"   type="textarea" :rows="2"></el-input>
              </el-form-item>
              <span style="color:red;position:absolute;top:50px;left:80px;font-size:12px">
                                *两行副标题，回车换下一行副标题
                            </span>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文章头图" prop="photo">
                <el-input v-model="ruleForm.photo" size="mini" @click.native="seleImg" placeholder="请上传文章头图建议750*1657"></el-input>
                <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:55px">
            <el-col :span="12">
              <el-form-item label="是否存在多级">
                <el-switch v-model="ruleForm.catalogLevelType" active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否显示专家团队">
                <el-switch v-model="ruleForm.isExpertTeam" active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-top: 50px;height: 350px"
                  v-if="ruleForm.catalogLevelType == false || ruleForm.catalogLevelType == null">

            <el-form-item label="文章详情" prop="description">
              <Wangeditor  :flag="Typelist" :content="ruleForm.description" @catchData="catchData"></Wangeditor>
            </el-form-item>
          </el-row>
        </el-form>
        <div class=""
             style="width: 100%;height: 60px;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="submit">确定</el-button>
            <el-button @click="Typelist = false" size="mini">取消</el-button>
          </div>
        </div>

      </div>

    </sgDialog>
  </div>
</template>
<script>
import Tree from '@/components/newTree/index'
import sgDialog from '@/components/Dialog/index'
import Wangeditor from '@/components/newwangeditor'
import Upload from '@/components/newUpload'
import fa from 'element-ui/src/locale/lang/fa'
const serverPath = process.env.VUE_APP_BASE_API + '/file'
export default {
  components: {
    Tree,
    sgDialog,
    Wangeditor,
    Upload,

  },
  created() {
    //模拟数据

  },
  data() {
    return {
      editflag: false,
      ifEdit:true,
      newtable: [],
      selectdata: [],
      value: false,
      Typelistsecond: false,
      TypelistsecondTitle: '新增二级类目',
      FileList: [
      ],
      TypeTitle: '新增类目',
      ruleForm: {
        categoryName: "",
        mainHeading: "",
        subhead: "",
        description: "",
        photo: "",
        categoryId: '',
        catalogLevelType: false,
        isExpertTeam:false

      },
      newruleForm: {
        catalogLevelName: "",
        catalogLevelContent: '',
        categoryId: "",
        catalogLevelId: "",
        bgTxt:"",
        towBgImg:"",
        sort:"",
      },
      newrules: {
        catalogLevelName: [
          { required: true, message: '请输入二级类目名称', trigger: 'blur' },
        ],
        catalogLevelContent: [
          { required: true, message: '请输入二级类目内容', trigger: 'blur' },
        ]
      },
      rules: {
        categoryName: [
          { required: true, message: '请输入类目名称', trigger: 'blur' },
        ],
        mainHeading: [
          { required: true, message: '请输入主标题', trigger: 'blur' },
        ],
        subhead: [
          { required: true, message: '请输入副标题', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入文章详情', trigger: 'blur' },
        ],
        photo: [
          { required: true, message: '请上传文章头图，建议750*1657', trigger: 'blur' },
        ]
      },
      Typelist: false,
      //表格数据
      tableData: [],
      //表格表头
      clums: [
        {
          value: "categoryName",
          label: "文章类目",
          // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
        },
        {
          value: "mainHeading",
          label: "文章主标题",
          // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
        },
        {
          value: "subhead",
          label: "文章副标题",
        }
      ],
      //操作按钮
      operation: [
        {
          label: '删除',
          val: '0'
        }
      ],

      //是否显示树形文件
      isShowfile: false,
      //是否显示默认组件
      showDefault: true,
      //是否显示表格操作按钮
      showoperation: true,
      //默认条数为0
      total: 0,
      //是否显示表格索引
      tableIndex: false,
      //是否显示表格复选框
      tableCheckbox: true,
    }
  },
  methods: {
    changeIndexlist(e,row){

      this.$api.confinementRoom.catalogLevelTowedit(row).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.getlist(this.deptId);
          this.Typelistsecond = false;
          this.newruleForm = {
            catalogLevelName: "",
            catalogLevelContent: '',
            categoryId: "",
            catalogLevelId: "",
            towBgImg:"",
            bgTxt:"",
            sort:""
          }
        }
      })
    },
    changeImgsecond(e){
      if (((e.target.files[0].size) / 1048576) > 2) {
        this.$message.warning("上传图片大小请控制在2MB以内");
        return
      }
      let len = e.target.files[0].name.split('.')
      if (e.target.files[0].name.split('.')[len.length - 1] !== 'bmp' && e.target.files[0].name.split('.')[len.length - 1] !== 'gif' && e.target.files[0].name.split('.')[len.length - 1] !== 'jpg' && e.target.files[0].name.split('.')[len.length - 1] !== 'jpeg' && e.target.files[0].name.split('.')[len.length - 1] !== 'png') {
        this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
        return
      }
      let fromdata = new FormData();
      fromdata.append('file', e.target.files[0]);
      this.$api.confinementRoom.unload(fromdata).then(res => {
        if (res.code == 200) {
          this.newruleForm.towBgImg = res.data.url;
          this.$message.success('上传成功')
        }
      })
      e.target.value = ''
    },
    seleImgsecond(){
      document.querySelector('#filesecond').click();
    },
    delver(row) {
      console.log(row.catalogLevelContent,'sadhduahsd')
      this.Typelistsecond = true;
      this.TypelistsecondTitle = '编辑二级类目';
      this.trueFlag = true
      this.newruleForm = {
        catalogLevelName: row.catalogLevelName,
        catalogLevelContent: row.catalogLevelContent,
        categoryId: Number(row.categoryId),
        catalogLevelId: Number(row.catalogLevelId),
        towBgImg:row.towBgImg,
        bgTxt:row.bgTxt,
        sort:row.sort
      }
    },
    delveredit(row) {
      this.$confirm('确认删除吗？，是否继续？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.$api.confinementRoom.deptCategorydeleteremove(row.catalogLevelId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getlist(this.deptId)
          }
        })
      }).catch(res => {
        console.log(res)
      })

    },
    expandChangelist(e) {
      let that = this;
      that.$api.confinementRoom.catalogLevelTowlist({
        categoryId: e
      }).then(res => {
        that.tableData.forEach(value => {
          if (value.categoryId == e) {
            value.tableDataprops = res.rows;
            that.$set(value, 'ifprops', true)
            // value.ifprops=true
          }
        })
        that.$forceUpdate()
        // that.tableData=that.newtable;

      })
    },
    submitok() {
      this.$refs.newruleForm.validate((valid) => {
        if (valid) {
          if (this.trueFlag) {
            this.$api.confinementRoom.catalogLevelTowedit(this.newruleForm).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.getlist(this.deptId);
                this.Typelistsecond = false;
                this.newruleForm = {
                  catalogLevelName: "",
                  catalogLevelContent: '',
                  categoryId: "",
                  catalogLevelId: "",
                  towBgImg:"",
                  bgTxt:"",
                  sort:""
                }
              }
            })
          } else {
            this.$api.confinementRoom.catalogLevelTow(this.newruleForm).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.getlist(this.deptId);
                this.Typelistsecond = false;
                this.newruleForm = {
                  catalogLevelName: "",
                  catalogLevelContent: '',
                  categoryId: "",
                  catalogLevelId: "",
                  towBgImg:"",
                  bgTxt:"",
                  sort:""
                }
              }
            })
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    catchDatanew(e) {
      this.newruleForm.catalogLevelContent = e;
    },
    addTypesecond() {
      if (this.selectdata.length == 0 || this.selectdata.length > 1) {
        this.$message.warning('请选择一条记录进行修改');
        return
      }
      this.newruleForm.categoryId = this.selectdata[0].categoryId
      this.TypelistsecondTitle = '新增二级类目';
      this.trueFlag = false
      this.Typelistsecond = true;
    },
    changeImg(e) {
      if (((e.target.files[0].size) / 1048576) > 2) {
        this.$message.warning("上传图片大小请控制在2MB以内");
        return
      }
      let len = e.target.files[0].name.split('.')
      if (e.target.files[0].name.split('.')[len.length - 1] !== 'bmp' && e.target.files[0].name.split('.')[len.length - 1] !== 'gif' && e.target.files[0].name.split('.')[len.length - 1] !== 'jpg' && e.target.files[0].name.split('.')[len.length - 1] !== 'jpeg' && e.target.files[0].name.split('.')[len.length - 1] !== 'png') {
        this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
        return
      }
      let fromdata = new FormData();
      fromdata.append('file', e.target.files[0]);
      this.$api.confinementRoom.unload(fromdata).then(res => {
        if (res.code == 200) {
          this.ruleForm.photo = res.data.url;
          this.$message.success('上传成功')
        }
      })
      e.target.value = ''
    },
    seleImg() {
      document.querySelector('#file').click();
    },
    remove(e) {
      this.FileList = [];
      this.ruleForm.photo = '';
    },
    successFile(e) {
      this.ruleForm.photo = e.url;
    },
    newedit(row) {
      this.editflag = true;
      this.TypeTitle = '编辑类目';
      this.Typelist = true
      this.ruleForm.categoryName = row.categoryName
      this.ruleForm.mainHeading = row.mainHeading
      this.ruleForm.subhead = row.subhead;
      this.ruleForm.description = row.description;
      this.ruleForm.photo = row.photo
      this.ruleForm.categoryId = row.categoryId
      if (row.catalogLevelType == 1) {
        this.ruleForm.catalogLevelType = true;
      } else {
        this.ruleForm.catalogLevelType = false;
      }
      if(row.isExpertTeam==1){
        this.ruleForm.isExpertTeam=true
      }else{
        this.ruleForm.isExpertTeam=false
      }

      this.FileList = [{
        name: '文章头图',
        url: serverPath + row.photo,
      }]
    },
    catchData(e) {
      this.ruleForm.description = e;
    },
    getlist(id) {
      this.$api.confinementRoom.deptCategorylist({
        deptId: id
      }).then(res => {
        this.tableData = res.rows;
        console.log(res.rows[0].description.replace(/size="4"/g,"font-size='16px'"))
        // console.log(res.rows[0].description,'黑欸')
        this.tableData.forEach(value => {
          value.tableDataprops = []
          value.ifprops=false
        })
        this.newtable = this.deepClone(this.tableData)


      })
    },
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {};
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj != 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      //引用类型
      //数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i];
          if (typeof new_obj[i] == 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { //对象
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] == 'object') {
              new_obj[key] = this.deepClone(obj[key]);
            } else {//对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj;
    },
    submit() {
      this.ruleForm.deptId = this.deptId;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {

          if (!this.ruleForm.catalogLevelType) {
            this.ruleForm.catalogLevelType = 0
          } else {
            this.ruleForm.catalogLevelType = 1
          }
          if(!this.ruleForm.isExpertTeam){
            this.ruleForm.isExpertTeam=0
          }else{
            this.ruleForm.isExpertTeam=1
          }
          if (this.editflag) {
            this.$api.confinementRoom.deptCategoryedit(this.ruleForm).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.Typelist = false;
                this.getlist(this.deptId)
              }
            })
          } else {
            this.$api.confinementRoom.deptCategory(this.ruleForm).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.Typelist = false;
                this.getlist(this.deptId)

              }
            })
          }

        } else {
          return false;
        }
      });
    },
    addType() {
      this.Typelist = true;
      this.editflag = false;
      this.TypeTitle = '新增类目'
      this.ruleForm = {
        categoryName: "",
        mainHeading: "",
        subhead: "",
        description: "",
        photo: "",
        categoryId: '',
        catalogLevelType: false,
        isExpertTeam:false

      }
      this.FileList = []
    },
    //自定义行颜色
    rowClassName(row) {

    },
    //deptId改变之后的回调
    changeDeptId(id) {
      // alert(id)
    },
    newdelete(data) {
      this.$confirm('确认删除类目吗，是否继续？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.$api.confinementRoom.deptCategorydelete(data.categoryId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getlist(this.deptId)
          }
        })
      }).catch(res => {

      })

    },
    //点击页码
    handleCurrentChange(e) {
      alert(e)
    },

    //点击选择条数
    handleSizeChange(e) {
      alert(e)
    },
    //点击复选框的回调
    handleSelectionChang(row) {
      this.selectdata = row;
    },
    //点击树形三级的回调
    changeCompay(data,id) {
      if(!id.children){
        this.ifEdit=false
        this.deptId = data;
        this.getlist(data)
      }else{
        this.ifEdit=true;
        this.tableData=[]
      }

    },
    //点击表格每一行的回调
    rowClick(data) {

    }
  }
}
</script>
<style scoped>
::v-deep .el-input-number__decrease{
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}

::v-deep .el-table__header-wrapper .el-checkbox {
  display: none
}

::v-deep .el-col {
  height: 45px !important;
}

::v-deep .el-row {
  height: 0px;
}

::v-deep .el-form-item__error {
  margin-top: -5px !important;
}

.Width {
  width: 200px;
}</style>