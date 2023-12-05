<template>
    <div>
        <Tree :clums="clums" :operation="operation" :statisticsMessage="false" :isShowfile="isShowfile"
            :tableData="tableData" :showDefault="showDefault" :total="total" :tableIndex="tableIndex"
            :tableCheckbox="false" :row-class-name="rowClassName" @changeCompay="changeCompay" @rowClick="rowClick"
            @handleSelectionChang="handleSelectionChang" @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId">
            <!-- 头部操作按钮 -->
            <template v-slot:button>

                <div>
                    <!-- <span class="Left">快捷操作</span> -->
                    <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus" @click="addType"
                        plain :disabled="ifEdit">新增首屏图文</el-button>
                  <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus" @click="addTypehead"
                             plain :disabled="ifEdit">新增分享头图</el-button>
                  <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus" @click="addTypeheadmoment"
                             plain :disabled="ifEdit">新增品牌瞬间</el-button>
                    <!-- <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus"
                        @click="addTypesecond" plain :disabled="ifEdit">新增二级类目</el-button> -->
                    <input type="file" style="visibility:hidden" id="file" @change="changeImg">
                  <input type="file" style="visibility:hidden" id="filedialog" @change="changeImgdialog">
                  <input type="file" style="visibility:hidden" id="filemoment" @change="changeImgdialogmoment">
                </div>
            </template>
            <!-- 自定义内容填充 -->
            <template v-slot:tabular="{ data }">
                <div v-if="data.name == 'fsdType'">
                    {{ data.fsdType==1?'背景图':data.fsdType==2?'logo':data.fsdType==3?'分享头图':'品牌瞬间' }}
                </div>
                <div v-if="data.name == 'indexImage'" style="display:flex;align-items:center;justify-content:center">
                    <img :src="data.imgurl" style="width:20px;height:20px;border-radius:50%" />
                </div>
                <div v-if="data.name == 'expertProfile'">
                    <el-tooltip class="item" effect="dark" :content="data.expertProfile" placement="top-start">
                        <div style="cursor:pointer">
                            {{ data.expertProfile.length > 20 ? data.expertProfile.substr(0, 20) + '...' : data.expertProfile }}
                        </div>
                    </el-tooltip>
                </div>
           
                
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
      <sgDialog title="分享头图" size="700px" out-top="2%" :dialog="addTypeheaddialog" @handleClose="addTypeheaddialog = false">
        <div slot="out">
          <el-form :model="ruleFormdialog" :rules="rulesdialog" ref="ruleFormdialog" label-width="130px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">

              <el-form-item label="分享头图" prop="indexImage">
                <el-input v-model="ruleFormdialog.indexImage" size="mini" @click.native="seleImgdialog"
                          placeholder="请上传分享头图建议235*230"></el-input>
                <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
              </el-form-item>

            </el-col>
            <el-col :span="12">

              <el-form-item label="分享标题" prop="name">
                <el-input v-model="ruleFormdialog.name" size="mini"
                          placeholder="请输入分享标题"></el-input>
                <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
              </el-form-item>

            </el-col>

          </el-row>
          </el-form>
          <div class=""
               style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
            <div style="width: 160px;height: 40px;">
              <el-button type="primary" size="mini" @click="submitdialog">确定</el-button>
              <el-button @click="addTypeheaddialog = false" size="mini">取消</el-button>
            </div>
          </div>
        </div>
      </sgDialog>
      <sgDialog :title="TypeTitlenow" size="700px" out-top="2%" :dialog="moment" @handleClose="moment = false">
          <div slot="out" style="height: 130px">
            <el-form :model="ruleFormmoment" :rules="rulesmoment" ref="ruleFormmoment" label-width="130px" class="demo-ruleForm">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="品牌瞬间" prop="indexImage">
                    <el-input v-model="ruleFormmoment.indexImage" size="mini" @click.native="seleImgmoment"
                              placeholder="请上传品牌瞬间照建议350*150"></el-input>
                    <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="视频号Id" prop="finderUserName">
                    <el-input v-model="ruleFormmoment.finderUserName" size="mini"
                              placeholder="请输入视频号Id"></el-input>
                    <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="视频Id" prop="feedId">
                    <el-input v-model="ruleFormmoment.feedId" size="mini"
                              placeholder="请输入视频Id"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form>
            <div class=""
                 style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
              <div style="width: 160px;height: 40px;margin-top: 20px">
                <el-button type="primary" size="mini" @click="submitmoment">确定</el-button>
                <el-button @click="moment = false" size="mini">取消</el-button>
              </div>
            </div>
          </div>
      </sgDialog>
        <sgDialog :title="TypeTitle" size="700px" out-top="2%" :dialog="Typelist" @handleClose="Typelist = false">
            <div slot="out"
                :style="{ height: ruleForm.catalogLevelType == false || ruleForm.catalogLevelType == null ? '140px' : '200px' }">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                    <span style="color:red;font-size:12px">*首屏文案想下一行直接按回车即可,建议三行</span>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="首屏图片" prop="indexImage">
                                <el-input v-model="ruleForm.indexImage" size="mini" @click.native="seleImg"
                                    placeholder="请上传专家形象照建议375*647"></el-input>
                                <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="首屏文案" prop="copyDescription">
                                <el-input v-model="ruleForm.copyDescription" size="mini" 
                                    placeholder="请输入首屏文案" type="textarea" :rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="图片类型" prop="fsdType">
                                <el-select v-model="ruleForm.fsdType" placeholder="请选择图片类型" size="mini">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
                                <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
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
import Wangeditor from '@/components/wangeditor'
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
          ruleFormmoment:{
            indexImage:'',
            deptId:'',
            fsdType:'',
            fsdId:'',
            finderUserName:'',
            feedId:'',
          },
          rulesmoment:{
            indexImage: [
              { required: true, message: '请上传品牌瞬间，建议350*150', trigger: 'blur' },
            ],
            finderUserName:[
              {
                required: true, message: '请输入视频号Id', trigger: 'blur'
              }
            ],
            feedId:[
              {
                required: true, message: '请输入视频Id', trigger: 'blur'
              }
            ]

          },
            editflag: false,
          TypeTitlenow:"新增品牌瞬间",
          moment:false,
            ifEdit: true,
          dialoghead:false,
            indexImage:"",
            newtable: [],
            options:[
                {
                    value:1,
                    label:'背景图'
                },
                {
                    value:2,
                    label:'logo'
                }
            ],
            selectdata: [],
            value: false,
            Typelistsecond: false,
            TypelistsecondTitle: '新增二级类目',
            FileList: [
            ],
          ruleFormdialog:{
              indexImage:'',
            name:"",
          },
          rulesdialog:{
            indexImage: [
              { required: true, message: '请上传分享头图，建议235*230', trigger: 'blur' },
            ],
            name: [
              { required: true, message: '请输入分享标题', trigger: 'blur' },
            ],
          },
            TypeTitle: '新增探索首屏',
            ruleForm: {
                indexImage: "",
                copyDescription: "",
                fsdId: "",
                fsdType:"",

            },
            rules: {
                indexImage: [
                    { required: true, message: '请上传首屏照片，建议375*647', trigger: 'blur' },
                ],
                copyDescription: [
                    { required: true, message: '请输入首屏文案', trigger: 'blur' },
                ],
                fsdType:[
                  { required: true, message: '请选择图片类型', trigger: 'blur' },
                ]
            },
            Typelist: false,
            //表格数据
            tableData: [],
            //表格表头
            clums: [
            {
                    value: "fsdType",
                    label: "图片类型",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "indexImage",
                    label: "首屏图片/分享头图",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "copyDescription",
                    label: "首屏文案/分享标题",
                    // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
              {
                value: "finderUserName",
                label: "视频Id",
                // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
              },
              {
                value: "feedId",
                label: "视频号Id",
                showOverflowTooltip:true,
                // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
              },
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
          addTypeheaddialog:false,
        }
    },
    methods: {
      submitmoment(){
        this.ruleFormmoment.deptId = this.deptId
        this.ruleFormmoment.fsdType='4'
        this.ruleFormmoment.copyDescription=this.ruleFormmoment.name
        this.$refs.ruleFormmoment.validate((valid) => {
          if (valid) {
            if(!this.dialoghead){
              this.$api.confinementRoom.firstScreenDisplayAdd(this.ruleFormmoment).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.moment = false;
                  this.getlist(this.deptId)
                }
              })
            }else{
              this.$api.confinementRoom.firstScreenDisplayedit(this.ruleFormmoment).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.moment = false;
                  this.getlist(this.deptId)
                }
              })
            }

          }
        })
      },
      seleImgmoment(){
        document.querySelector('#filemoment').click();
      },
      changeImgdialogmoment(e){
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
            this.ruleFormmoment.indexImage = res.data.url;
            this.$message.success('上传成功')
          }
        })
        e.target.value = ''
      },
      addTypeheadmoment(){
        this.moment=true;
        this.TypeTitlenow='新增品牌瞬间';
        this.ruleFormmoment.indexImage='';
        this.ruleFormmoment.finderUserName='';
        this.ruleFormmoment.feedId=''
      },
      submitdialog(){
        this.ruleFormdialog.deptId = this.deptId
        this.ruleFormdialog.fsdType='3'
        this.ruleFormdialog.copyDescription=this.ruleFormdialog.name
        this.$refs.ruleFormdialog.validate((valid) => {
          if (valid) {
            if(!this.dialoghead){
              this.$api.confinementRoom.firstScreenDisplayAdd(this.ruleFormdialog).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.addTypeheaddialog = false;
                  this.getlist(this.deptId)
                }
              })
            }else{

              this.$api.confinementRoom.firstScreenDisplayedit(this.ruleFormdialog).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.addTypeheaddialog = false;
                  this.getlist(this.deptId)
                }
              })
            }

          }
        })
      },
      addTypehead(){
       this.addTypeheaddialog=true;
        this.dialoghead=false;
        this.ruleFormdialog.name='';
        this.ruleFormdialog.indexImage='';
        this.ruleFormdialog.fsdId='';
      },
      seleImgdialog(){
        document.querySelector('#filedialog').click();
      },
      changeImgdialog(e){
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
            this.ruleFormdialog.indexImage = res.data.url;
            this.$message.success('上传成功')
          }
        })
        e.target.value = ''
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
                    this.ruleForm.indexImage = res.data.url;
                    this.$message.success('上传成功')
                }
            })
            e.target.value = ''
        },
        seleImg() {
            document.querySelector('#file').click();
        },
        newedit(row) {
          if(row.fsdType==3){
            this.addTypeheaddialog=true
            this.dialoghead=true;
            this.ruleFormdialog.name=row.copyDescription
            this.ruleFormdialog.indexImage=row.indexImage
            this.ruleFormdialog.fsdId=row.fsdId
          }else if(row.fsdType==4){
            this.moment=true;
            this.dialoghead=true;
            this.TypeTitlenow='编辑品牌瞬间'
            this.ruleFormmoment.indexImage=row.indexImage;
            this.ruleFormmoment.fsdId=row.fsdId;
            this.ruleFormmoment.finderUserName=row.finderUserName;
            this.ruleFormmoment.feedId=row.feedId;
            this.ruleFormmoment.fsdId=row.fsdId
          }
          else{
            this.editflag = true;
            this.TypeTitle = '编辑首屏显示';
            this.Typelist = true
            this.ruleForm.indexImage = row.indexImage
            this.ruleForm.copyDescription = row.copyDescription
            this.ruleForm.fsdId = row.fsdId;
            this.ruleForm.fsdType=Number(row.fsdType);
          }

            // if (row.catalogLevelType == 1) {
            //     this.ruleForm.catalogLevelType = true;
            // } else {
            //     this.ruleForm.catalogLevelType = false;
            // }
        },
        catchData(e) {
            this.ruleForm.expertProfile = e;
        },
        getlist(id) {
            this.$api.confinementRoom.firstScreenDisplay({
                deptId: id
            }).then(res => {
                this.tableData = res.rows;
                this.tableData.forEach(value => {
                    value.imgurl = serverPath + value.indexImage
                })

            })
        },

        submit() {
            this.ruleForm.deptId = this.deptId
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (!this.ruleForm.catalogLevelType) {
                        this.ruleForm.catalogLevelType = 0
                    } else {
                        this.ruleForm.catalogLevelType = 1
                    }
                    if (this.editflag) {
                        this.$api.confinementRoom.firstScreenDisplayedit(this.ruleForm).then(res => {
                            if (res.code == 200) {
                                this.$message.success(res.msg)
                                this.Typelist = false;
                                this.getlist(this.deptId)
                            }
                        })
                    } else {
                        this.$api.confinementRoom.firstScreenDisplayAdd(this.ruleForm).then(res => {
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
            this.TypeTitle = '新增首屏显示'
            this.ruleForm = {
                indexImage: "",
                copyDescription: "",
                fsdId: "",
                fsdType:'',
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
            this.$confirm('确认删除数据吗，是否继续？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                this.$api.confinementRoom.roomTypeInforemovelistremove(data.fsdId).then(res => {
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
        changeCompay(data, id) {
            if (!id.children) {
                this.ifEdit = false
                this.deptId = data;
                this.getlist(data)
            } else {
                this.ifEdit = true;
                this.tableData = []
            }

        },
        //点击表格每一行的回调
        rowClick(data) {

        }
    }
}
</script>
<style scoped>
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