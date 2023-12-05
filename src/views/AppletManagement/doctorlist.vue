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
                        plain :disabled="ifEdit">新增医师</el-button>
                    <!-- <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus"
                        @click="addTypesecond" plain :disabled="ifEdit">新增二级类目</el-button> -->
                    <input type="file" style="visibility:hidden" id="file" @change="changeImg">
                </div>
            </template>
            <!-- 自定义内容填充 -->
            <template v-slot:tabular="{ data }">
                <div v-if="data.name == 'etImage'" style="display:flex;align-items:center;justify-content:center">
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
        <sgDialog :title="TypeTitle" size="850px" out-top="2%" :dialog="Typelist" @handleClose="Typelist = false">
            <div slot="out"
                :style="{ height: ruleForm.catalogLevelType == false || ruleForm.catalogLevelType == null ? '500px' : '200px' }">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="专家名称" prop="etName">
                                <el-input v-model="ruleForm.etName" size="mini" 
                                    placeholder="请输入专家名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="专家职称" prop="subtitle">
                                <el-input v-model="ruleForm.subtitle" size="mini" 
                                    placeholder="请输入专家职称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="专家形象照" prop="etImage">
                                <el-input v-model="ruleForm.etImage" size="mini" @click.native="seleImg"
                                    placeholder="请上传专家形象照建议115*150"></el-input>
                                <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row style="margin-top: 100px;">
                        <el-form-item label="专家简介" prop="expertProfile">
                            <Wangeditor :content="ruleForm.expertProfile" @catchData="catchData" :flag="Typelist"></Wangeditor>
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
                etName: "",
                subtitle: "",
                etImage: "",
                expertProfile: "",
                expertTeamId: "",

            },
            rules: {
                etName: [
                    { required: true, message: '请输入专家名称', trigger: 'blur' },
                ],
                subtitle: [
                    { required: true, message: '请输入专家职称', trigger: 'blur' },
                ],
                etImage: [
                    { required: true, message: '请上传专家形象照，建议115*150', trigger: 'blur' },
                ],
                expertProfile: [
                    { required: true, message: '请输入专家简介', trigger: 'blur' },
                ]
            },
            Typelist: false,
            //表格数据
            tableData: [],
            //表格表头
            clums: [
                {
                    value: "etName",
                    label: "专家姓名",
                    // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "subtitle",
                    label: "专家职称",
                    // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "etImage",
                    label: "专家形象照",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "expertProfile",
                    label: "专家简介",
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
                    this.ruleForm.etImage = res.data.url;
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
            this.TypeTitle = '编辑专家';
            this.Typelist = true
            this.ruleForm.etName = row.etName
            this.ruleForm.subtitle = row.subtitle
            this.ruleForm.etImage = row.etImage;
            this.ruleForm.expertProfile = row.expertProfile
            this.ruleForm.expertTeamId = row.expertTeamId
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
            this.$api.confinementRoom.expertTeamlist({
                deptId: id
            }).then(res => {
                this.tableData = res.rows;
                this.tableData.forEach(value => {
                    value.imgurl = serverPath + value.etImage
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
                        this.$api.confinementRoom.expertTeamedit(this.ruleForm).then(res => {
                            if (res.code == 200) {
                                this.$message.success(res.msg)
                                this.Typelist = false;
                                this.getlist(this.deptId)
                            }
                        })
                    } else {
                        this.$api.confinementRoom.expertTeamadd(this.ruleForm).then(res => {
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
            this.TypeTitle = '新增专家'
            this.ruleForm = {
                etName: "",
                subtitle: "",
                etImage: "",
                expertProfile: "",
                expertTeamId: "",

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
                this.$api.confinementRoom.expertTeamremove(data.expertTeamId).then(res => {
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