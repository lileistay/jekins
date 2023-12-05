<template>
    <div>
        <Tree :clums="clums" :operation="operation" :statisticsMessage="false" :isShowfile="isShowfile"
            :tableData="tableData" :showDefault="showDefault" :total="total" :tableIndex="tableIndex"
            :tableCheckbox="false" :row-class-name="rowClassName" @changeCompay="changeCompay" @rowClick="rowClick"
            @handleSelectionChang="handleSelectionChang" @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId" >
            <!-- 头部操作按钮 -->
            <template v-slot:button>

                <div>
                    <!-- <span class="Left">快捷操作</span> -->
                    <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus" @click="addType"
                        plain :disabled="ifEdit">新增门店</el-button>
                    <!-- <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus"
                        @click="addTypesecond" plain :disabled="ifEdit">新增二级门店</el-button> -->
                    <input type="file" style="visibility:hidden" id="file" @change="changeImg">
                </div>
            </template>
            <!-- 自定义内容填充 -->
            <template v-slot:tabular="{ data }">
              <div v-if="data.name == 'sortNumber'">
                <el-input-number size="mini" v-model="data.sortNumber" @blur="blurindex($event,data)"></el-input-number>
              </div>
                <div v-if="data.name == 'storImage'" style="display:flex;align-items:center;justify-content:center">
                    <img :src="data.imgurl" style="width:20px;height:20px;border-radius:50%" />
                </div>
               
                <div v-if="data.name == 'storeName'">
                    <div href="#" @click="stomesecond(data.storeId)" style="color:#409eff;cursor:pointer">{{ data.storeName }}</div>
                </div>
                <!-- <div v-if="data.name == 'shelfTime'">
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
        <sgDialog :title="TypelistsecondTitle" size="700px" out-top="2%" :dialog="Typelistsecond"
            @handleClose="Typelistsecond = false">
            <div slot="out" style="height:500px">
                <el-form :model="newruleForm" :rules="newrules" ref="newruleForm" label-width="130px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="二级类目名称" prop="catalogLevelName">
                                <el-input v-model="newruleForm.catalogLevelName" size="mini" placeholder="请输入二级类目名称"
                                    maxlength="4" show-word-limit></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:80px">
                        <el-col :span="24">
                            <el-form-item label="二级类目内容" prop="catalogLevelContent">
                                <Wangeditor :content="newruleForm.catalogLevelContent" @catchData="catchDatanew">
                                </Wangeditor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="submitok">确定</el-button>
                        <el-button @click="Typelistsecond = false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
        <sgDialog :title="TypeTitle" size="700px" out-top="2%" :dialog="Typelist" @handleClose="Typelist = false">
            <div slot="out" style="height:150px">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="门店名称" prop="storeName">
                                <el-input v-model="ruleForm.storeName" size="mini" 
                                    placeholder="请输入门店名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="门店地址" prop="address">
                                <el-input v-model="ruleForm.address" size="mini" 
                                    placeholder="请输入门店地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:55px">
                        <el-col :span="12">
                            <el-form-item label="门店图片" prop="storImage">
                                <el-input v-model="ruleForm.storImage" size="mini" @click.native="seleImg"
                                    placeholder="请上传门店图片建议350*200"></el-input>
                                <!-- <Upload :limit="1" @successFile="successFile" v-model="ruleForm.photo" :fileList="FileList" @remove="remove"></Upload> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="门店省份" prop="province">
                                <el-select v-model="ruleForm.province" placeholder="请选择" size="mini">
                                    <el-option v-for="item in arrAll" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
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
const serverPath = process.env.VUE_APP_BASE_API + '/file'
import area from '@/utils/area.js';
export default {
    components: {
        Tree,
        sgDialog,
        Wangeditor,
        Upload,

    },
    created() {
        //模拟数据
        let arr=[];
        area.arrAll.forEach(value=>{
            let object={
                label:value.name,
                value:value.name
            }
            arr.push(object)
        })
     this.arrAll=arr;
    },
    data() {
        return {
            editflag: false,
            ifEdit: true,
            newtable: [],
            selectdata: [],
            arrAll:[],
            value: false,
            Typelistsecond: false,
            TypelistsecondTitle: '新增二级类目',
            FileList: [
            ],
            TypeTitle: '新增类目',
            ruleForm: {
                storeName: "",
                address: "",
                storImage: "",
                province: "",
                storeId:"",

            },
            newruleForm: {
                catalogLevelName: "",
                catalogLevelContent: '',
                categoryId: "",
                catalogLevelId: "",
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
                storeName: [
                    { required: true, message: '请输入门店名称', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入门店地址', trigger: 'blur' },
                ],
                storImage: [
                    { required: true, message: '请上传门店照片', trigger: 'blur' },
                ],
                province: [
                    { required: true, message: '请选择门店省份', trigger: 'change' },
                ],
                // photo: [
                //     { required: true, message: '请上传文章头图，建议750*1657', trigger: 'blur' },
                // ]
            },
            Typelist: false,
            //表格数据
            tableData: [],
            //表格表头
            clums: [
              {
                value: "sortNumber",
                label: "排序",
                // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                vals: true,
              },
                {
                    value: "storeName",
                    label: "门店名称",
                    // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                    vals: true,
                },
                {
                    value: "address",
                    label: "门店地址",
                    // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "storImage",
                    label: "门店图片",
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
      blurindex(e,data){
        let value=e.target.value;
        let newdata={
          storeId:data.storeId,
          sortNumber:value
        }
        this.$api.confinementRoom.storeInfoedit(newdata).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.Typelist = false;
            this.getlist(this.deptId)
          }
        })
      },
        stomesecond(id){
          this.$router.push({ path: 'secondDoor', query: { storeId:id}})
        },
        delver(row) {
            this.Typelistsecond = true;
            this.TypelistsecondTitle = '编辑二级类目';
            this.trueFlag = true
            this.newruleForm = {
                catalogLevelName: row.catalogLevelName,
                catalogLevelContent: row.catalogLevelContent,
                categoryId: Number(row.categoryId),
                catalogLevelId: Number(row.catalogLevelId)
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
                    this.ruleForm.storImage = res.data.url;
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
            this.TypeTitle = '编辑门店';
            this.Typelist = true
            this.ruleForm.storeName = row.storeName
            this.ruleForm.address = row.address
            this.ruleForm.storImage = row.storImage;
            this.ruleForm.province = row.province;
            this.ruleForm.photo = row.photo
            this.ruleForm.storeId = row.storeId
        },
        catchData(e) {
            this.ruleForm.description = e;
        },
        getlist(id) {
            this.$api.confinementRoom.storeInfolist({
                deptId: id
            }).then(res => {
                this.tableData = res.rows;
                this.tableData.forEach(value => {
                  value.imgurl=serverPath+value.storImage
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
                    if (this.editflag) {
                        this.$api.confinementRoom.storeInfoedit(this.ruleForm).then(res => {
                            if (res.code == 200) {
                                this.$message.success(res.msg)
                                this.Typelist = false;
                                this.getlist(this.deptId)
                            }
                        })
                    } else {
                        this.$api.confinementRoom.storeInfo(this.ruleForm).then(res => {
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
            this.TypeTitle = '新增门店'
            this.ruleForm={
                storeName: "",
                address: "",
                storImage: "",
                province: "",
                storeId:'',
            },
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
                this.$api.confinementRoom.storeInforemove(data.storeId).then(res => {
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
}
</style>