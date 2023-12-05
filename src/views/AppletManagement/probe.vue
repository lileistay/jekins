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
                        plain :disabled="ifEdit">新增探索分类</el-button>
                    <!-- <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus"
                        @click="addTypesecond" plain :disabled="ifEdit">新增二级类目</el-button> -->
                    <input type="file" style="visibility:hidden" id="file" @change="changeImg">
                </div>
            </template>
            <!-- 自定义内容填充 -->
            <template v-slot:tabular="{ data }">
                <div v-if="data.name=='weightNum'">
                    <el-input-number v-model="data.weightNum" size="mini" @blur="blur($event,data)">
                    </el-input-number>
                </div>
                <div v-if="data.name == 'isBackground'" style="display:flex;align-items:center;justify-content:center">
                    <img :src="data.imgurl" style="width:20px;height:20px;border-radius:50%" v-if="data.imgurl!==''" />
                </div>
                <div v-if="data.name == 'copywriting'">
                    <el-tooltip class="item" effect="dark" :content="data.copywriting" placement="top-start">
                        <div style="cursor:pointer">
                            {{ data.copywriting.length > 20 ? data.copywriting.substr(0, 20) + '...' : data.copywriting }}
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
        <sgDialog :title="TypeTitle" size="850px" out-top="2%" :dialog="Typelist" @handleClose="Typelist = false">
            <div slot="out"
                :style="{ height: ruleForm.catalogLevelType == false || ruleForm.catalogLevelType == null ? '500px' : '200px' }">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="分类名称" prop="eiDirectory">
                                <el-input v-model="ruleForm.eiDirectory" size="mini" 
                                    placeholder="请输入分类名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="背景图片">
                                <el-input v-model="ruleForm.isBackground" size="mini" @click.native="seleImg"
                                    placeholder="上传背景图片建议375*600" style="width:200px"></el-input>
                                    <el-button type="primary" size="mini" @click="clear" style="margin-left:10px">清除</el-button>
                            </el-form-item>
                           
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 60px;">
                        <el-form-item label="分类文案" prop="copywriting">
                            <Wangeditor :content="ruleForm.copywriting" @catchData="catchData" :flag="Typelist"></Wangeditor>
                        </el-form-item>
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
            ifEdit: true,
            newtable: [],
            selectdata: [],
            value: false,
            Typelistsecond: false,
            TypelistsecondTitle: '新增二级类目',
            FileList: [
            ],
            TypeTitle: '新增类目',
            ruleForm: {
                isBackground: "",
                eiId: "",
                copywriting: "",
                eiDirectory: "",
            },
            rules: {
                eiDirectory: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ],
                copywriting: [
                    { required: true, message: '请输入分类文案', trigger: 'blur' },
                ],
            },
            Typelist: false,
            //表格数据
            tableData: [],
            //表格表头
            clums: [
            {
                    value: "weightNum",
                    label: "排序",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "eiDirectory",
                    label: "分类名称",
                    // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "copywriting",
                    label: "分类文案",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "isBackground",
                    label: "背景图片",
                    vals: true, 
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
        clear(){
            this.ruleForm.isBackground=''
        },
        blur(e,data){
         this.$api.confinementRoom.exploreInfoedit({
            weightNum:e.target.value,
            eiId:data.eiId
         }).then(res=>{
            if(res.code==200){
                this.$message.success(res.msg);
                this.getlist(this.deptId);
            }
         })
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
                    this.ruleForm.isBackground = res.data.url;
                    this.$message.success('上传成功')
                }
            })
            e.target.value = ''
        },
        seleImg() {
            document.querySelector('#file').click();
        },
        newedit(row) {
            this.editflag = true;
            this.TypeTitle = '编辑分类';
            this.Typelist = true
            this.ruleForm.eiDirectory = row.eiDirectory
            this.ruleForm.copywriting = row.copywriting
            this.ruleForm.isBackground = row.isBackground;
            this.ruleForm.eiId = row.eiId
        },
        catchData(e) {
            this.ruleForm.copywriting= e;
        },
        getlist(id) {
            this.$api.confinementRoom.exploreInfo({
                deptId: id
            }).then(res => {
                this.tableData = res.rows;
                this.tableData.forEach(value => {
                    if(!value.isBackground){
                        value.imgurl = ""
                    }else{
                        value.imgurl = serverPath + value.isBackground
                    }
                    
                })

            })
        },

        submit() {
            this.ruleForm.deptId = this.deptId
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.editflag) {
                        this.$api.confinementRoom.exploreInfoedit(this.ruleForm).then(res => {
                            if (res.code == 200) {
                                this.$message.success(res.msg)
                                this.Typelist = false;
                                this.getlist(this.deptId)
                            }
                        })
                    } else {
                        this.$api.confinementRoom.exploreInfoadd(this.ruleForm).then(res => {
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
            this.TypeTitle = '新增分类'
            this.ruleForm = {
                eiDirector: "",
                copywriting: "",
                isBackground: "",
                eiId: "",

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
            this.$confirm('确认删除数据，是否继续？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                this.$api.confinementRoom.exploreInforemove(data.eiId).then(res => {
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
::v-deep .el-input-number__decrease{
    display:none
}
::v-deep .el-input-number__decrease{
    display:none
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