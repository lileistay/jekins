<template>
    <div>
        <Tree :isShowfile="isShowfile" :showDefault="showDefault" @changeCompay="changeCompay">
            <template v-slot:company>
                <div style="position: absolute;right: 20px;top:0px;background-color: #fff;height: 50px;">
                    <el-button v-has-permi="['client:companyLabel:add']" type="primary" size="mini"
                        style="position: absolute;right:220px;top:145px;z-index:1000" @click="submit"
                        :loading="submitcompant" v-if="!ifEdit" :disabled="jurisdictions">
                        提交
                    </el-button>
                    <el-button v-has-permi="['client:companyBasicsInfo:edit']" type="primary" size="mini"
                        style="position: absolute;right:220px;top:145px;z-index:1000" @click="submit"
                        :loading="submitcompant" v-if="ifEdit" :disabled="jurisdictions">
                        提交
                    </el-button>
                    <el-button v-has-permi="['client:companyBasicsInfo:edit']" type="success" size="mini"
                        style="position: absolute;right:120px;top:145px;z-index:1000" @click="add" :loading="submitcompant"
                        :disabled="jurisdictions">
                        新建分类
                    </el-button>
                    <!-- ifEdit -->
                    <el-button type="primary" size="mini" style="position: absolute;right:50px;top:145px;z-index: 1000;"
                        @click="submitback">
                        返回
                    </el-button>
                </div>
                <div :style="{ height: height + 'px', border: '1px solid transparent', overflow: 'scroll' }">
                    <input type="file" id="file" style="display: none;" @change="changefile" />
                    <input type="file" id="files" style="display: none;" @change="changefiles" />
                    <div v-if="list.length > 0">
                        <div v-for="(item, index) in list">
                            <div class="basic">
                                <span class="long"></span>
                                <span style="margin-left: 10px;">{{ item.supportName }}</span>
                                <div style="margin-left: 20px;">是否有效：</div>
                                <el-switch v-model="item.useFlag" active-color="#13ce66" inactive-color="#ff4949"
                                    style="margin-left: 10px;">
                                </el-switch>
                                <el-button type="text" style="margin-left: 20px;" @click="newdelete(item,index)">删除</el-button>
                            </div>
                            <div class="basic">
                                <span class="long"></span>
                                <span style="margin-left: 10px;">图标配置</span>
                                <el-button type="primary" size="mini" style="margin-left: 20px;"
                                    @click="upload(index)">点击上传</el-button>
                                    <span style="color: red;margin-left: 20px;">建议图片尺寸：40*40,图片大小不超过2MB</span>

                            </div>
                            <div class="imgurl">
                                <div v-if="item.url == ''">暂未上传</div>
                                <div v-else>
                                    <img :src="item.url" style="width:100px;height:100px" />
                                </div>

                            </div>
                            <div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                <div class="basic">
                                    <span class="long"></span>
                                    <span style="margin-left: 10px;">图文配置</span>
                                    <el-button type="primary" size="mini" style="margin-left: 20px;"
                                        @click="uploads(index)">点击上传</el-button>
                                    <span style="margin-left:20px;color:red">最多可上传三组图文</span>
                                    <span style="color: red;margin-left: 20px;">建议图片尺寸：40*40,图片大小不超过2MB</span>
                                </div>
                                <div style="width:100%;min-height:100px;display:flex">
                                    <div style="width:250px;margin-left:15px" v-for="(items,indexs) in name[index].values">

                                        <div class="imgurl" style="margin-left:70px">
                                            <div v-if="items.url == ''">暂未上传</div>
                                            <div v-else style="display:flex">
                                                <img :src="items.url" style="width:100px;height:100px" />
                                               
                                            </div>
                                            
                                        </div>
                                        <el-button type="text" size="mini" style="margin-left:100px" v-if="items.url!==''" @click="deleImg(indexs,index)">删除</el-button>
                                        <el-input type="textarea" :rows="2" v-model="items.names"
                                            style="width:250px;margin-top:10px" v-if="items.url!==''"></el-input>
                                    </div>

                                </div>
                            </div>

                            <div style="margin-top: 10px;">
                                <el-input type="textarea" :rows="5" v-model="item.supportContent"></el-input>
                            </div>
                        </div>

                    </div>
                    <div v-else
                        :style="{ width: '100%', height: height + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                        <el-empty description="暂无分类"></el-empty>
                    </div>


                </div>
            </template>

        </Tree>
        <sgDialog title="新增分类" size="330px" out-top="2%" :dialog="showDigs" @handleClose="showDigs = false">
            <div slot="out">
                <span style="color:red">*</span> <span>分类名称</span>
                <span>
                    <el-input size="mini" style="margin-left: 20px;width: 200px;" v-model="categoryNames" clearable>

                    </el-input>
                </span>
                <div style="height: 10px;">

                </div>
                <div style="height: 50px;">

                </div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok"
                            v-has-permi="['client:productCategory:edit']">确定</el-button>
                        <el-button @click="showDigs = false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
    </div>
</template>
<script>
import Tree from '@/components/newTree/index'
import sgDialog from '@/components/Dialog/index'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
import vm from '@/utils/util'
import { re } from 'mathjs'
export default {
    data() {
        return {
            categoryNames: "",
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            weightSorts: "0",
            isShowfile: false,
            showDefault: false,
            submitcompant: false,
            ifEdit: false,
            jurisdictions: true,
            name: [

            ],
            newarr: [],
            height: "",
            showDigs: false,
            imgurl: "",
            fileList: {},
            newIndex: 0,
            list: [

            ],
            Index: 0,
            uploadlist: [
                {
                    name: "logo", Name: "职业照", desc: '建议图片不超过2MB，建议尺寸比例：1:1 （例：60*60）',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张职业照",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px"
                },
            ]
        }
    },
    components: {
        Tree,
        sgDialog
    },
    methods: {
        deleImg(indexs,index){
 
            if(indexs==2||this.name[index].values.length==1){
                this.name[index].values[indexs].url='';
                this.name[index].values[indexs].newurl='';
                this.name[index].values[indexs].names='';
                return
            }
            this.$api.confinementRoom.deleteLocalFile({
                path: this.name[index].values[indexs].newurl
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success('删除成功')
                }
            })
            this.name[index].values.splice(indexs,1)
        },
        uploads(index) {
            this.newIndex = index
            if (this.name[this.newIndex].values.length == 3) {
                if (this.name[this.newIndex].values[2].url !== '') {
                    this.$message.warning("最多上传三张图文");
                    return;
                }
            }

            document.querySelector('#files').click();
        },
        changefiles(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            let len=e.target.files[0].name.split('.')
            if (e.target.files[0].name.split('.')[len.length-1] !== 'bmp' && e.target.files[0].name.split('.')[len.length-1] !== 'gif' && e.target.files[0].name.split('.')[len.length-1] !== 'jpg' && e.target.files[0].name.split('.')[len.length-1] !== 'jpeg' && e.target.files[0].name.split('.')[len.length-1] !== 'png') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
                return
            }
            
            let fromdata = new FormData();
            fromdata.append('file', e.target.files[0]);
            this.$api.confinementRoom.unload(fromdata).then(res => {
                if(res.code==200){
                    this.$message.success('上传成功')
                }
                this.name[this.newIndex].values[this.name[this.newIndex].values.length - 1].url = serverPath + res.data.url
                this.name[this.newIndex].values[this.name[this.newIndex].values.length - 1].newurl = res.data.url
                if (this.name[this.newIndex].values.length == 3) {
                    return
                }
                this.name[this.newIndex].values.push({
                    names: '',
                    url: "",
                    newurl: "",
                })
            });
            e.target.value = '';
        },
        changefile(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            let len=e.target.files[0].name.split('.')
            if (e.target.files[0].name.split('.')[len.length-1] !== 'bmp' && e.target.files[0].name.split('.')[len.length-1] !== 'gif' && e.target.files[0].name.split('.')[len.length-1] !== 'jpg' && e.target.files[0].name.split('.')[len.length-1] !== 'jpeg' && e.target.files[0].name.split('.')[len.length-1] !== 'png') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
                return
            }
            let fromdata = new FormData();
            fromdata.append('file', e.target.files[0]);
            this.$api.confinementRoom.unload(fromdata).then(res => {
                if(res.code==200){
                    this.$message.success('上传成功')
                }
                this.list[this.Index].url = serverPath + res.data.url
                this.list[this.Index].newurl = res.data.url
            });
            e.target.value = '';
        },
        upload(index) {
            this.Index = index;

            document.querySelector('#file').click();
        },
        deleter(e, index, val, indexs) {
            e.stopPropagation();
            this.uploadlist[indexs].value.splice(index, 1);
            if (val !== 'photo') {
                if (this.uploadlist[indexs].value.length == 0) {
                    this.uploadlist[indexs].value.push(
                        {
                            imgUrl: "",
                            border: '1px dashed #d9d9d9',
                            showflag: false,
                            flags: false,
                        }
                    )
                }
            }

            this.fileList[val].splice(index, 1);
        },
        selchange(e) {

            if (this.uploadlist[this.Indexs].value.length > this.uploadlist[this.Indexs].num) {
                this.$message.warning(`${this.uploadlist[this.Indexs].des}`)
                return
            }
            if (this.showstr == 'photo') {
                this.uploadlist[this.Indexs].value.push({
                    imgUrl: "",
                    border: '1px dashed #d9d9d9',
                    showflag: false,
                    flags: false,
                    ifshow: false,
                    row: "",
                })
            } else {
                if (this.uploadlist[this.Indexs].value.length == this.uploadlist[this.Indexs].num) {

                } else {
                    this.uploadlist[this.Indexs].value.push({
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    })
                }
                // this.uploadlist[this.Indexs].value.push({
                //     imgUrl: "",
                //     border: '1px dashed #d9d9d9',
                //     showflag: false,
                //     flags: false,
                // })
            }
            this.uploadlist[this.Indexs].value[this.Index].imgUrl = window.URL.createObjectURL(e.target.files[0])
            this.uploadlist[this.Indexs].value[this.Index].flags = true;
            this.uploadlist[this.Indexs].value[this.Index].ifshow = true;
            let fromdata = new FormData();
            fromdata.append('file', e.target.files[0]);
            this.$api.confinementRoom.unload(fromdata).then(res => {
                let object = {};
                object['photoName'] = res.data.name;
                object['photoAddr'] = res.data.url;
                if (this.fileList.hasOwnProperty(this.showstr)) {

                    this.fileList[this.showstr] = this.fileList[this.showstr].concat(object)
                } else {
                    this.fileList[this.showstr] = [];
                    this.fileList[this.showstr].push(object)
                }
            });
            this.$message.success("上传成功");

        },
        addlist(index, val, indexs) {
            this.Index = index;
            this.Indexs = indexs;
            let showstr = val.substr(9, val.length);
            this.showstr = showstr;
            this.$refs[val][0].click()
        },
        newleave(id, val, indexs) {
            this.uploadlist[indexs].value[id].border = '1px dashed #d9d9d9'
            this.uploadlist[indexs].value[id].showflag = false;
            if (this.uploadlist[indexs].value[id].imgUrl !== '') {
                this.uploadlist[indexs].value[id].flags = true;
            }

        },
        newdelete(item,index) {
            this.$confirm('确认要删除分类吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                if(item.supportTypeId==undefined){
                   this.list.splice(index,1)
                }else{
                    this.$api.confinementRoom.platformSupportTypedelete(item.supportTypeId).then(res => {
                    if (res.code == 200) {
                        this.$message.success('删除成功')
                        this.search();
                    }
                })
                }
  
            }).catch((res) => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
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
        search() {
            this.$api.confinementRoom.listplatform({
                deptId: this.treedeptId
            }).then(res => {
              
                if (res.rows.length == 0) {
                    this.list = res.rows;
                    return
                }
                res.rows.forEach(value => {
                    if (value.iconAddr == null) {
                        value.url = ''
                        
                    } else {
                        value.url = serverPath + value.iconAddr
                        value.newurl = value.iconAddr
                    }
                    let str =JSON.parse(value.supportIconAddr);
                    this.name.push({
                        values:str
                    })
                    
                })
                this.list = res.rows;
                this.list.forEach(value => {
                    if (value.useFlag == '0') {
                        value.useFlag = true
                    } else {
                        value.useFlag = false
                    }
                })
                this.newarr = this.deepClone(this.list)
                if (this.list.length == 0) {
                    this.ifEdit = false
                } else {
                    this.ifEdit = true
                }
            })
        },

        ok() {
            if (this.categoryNames == '' || this.categoryNames == null) {
                this.$message.warning("请输入分类名称")
                return
            }
            let flag = false
            this.list.forEach(value => {
                if (value.guaranteeName == this.categoryNames) {
                    flag = true;
                }
            })
            if (flag) {
                this.$message.warning("已有相同分类，重新添加")
                return
            }
            this.list.push({
                supportName: this.categoryNames,
                supportContent: "",
                useFlag: false,
                url: "",
                name: [{
                    names: '',
                    url: '',
                }]

            })
            this.name.push({
                values:[
                    {
                        url:"",
                        names:"",
                        newurl:"",
                    }
                ]
            })
            this.showDigs = false
        },
        add() {
            this.showDigs = true;
            this.categoryNames = '';
        },
        submitback() {
            vm.$emit('closeTag', this.$route.path);
        },
        submit() {
            if (this.list.length == 0) {
                this.$message.warning('请先添加分类再进行提交');
                return
            }
            let str = ''
            let flag=false;
            let newflag=false
            this.list.forEach((value,index) => {
                if (value.useFlag == false) {
                    value.useFlag = '1'
                } else {
                    value.useFlag = '0'
                }
                value.deptId = this.treedeptId
                value.iconAddr = value.newurl;
                value.supportIconAddr =JSON.stringify(this.name[index].values);
                if(value.newurl==undefined){
                    flag=true
                }
                if(this.name[index].values[0].url==''){
                    newflag=true
                }

            })
            console.log(newflag)
            if(flag){
                this.$message.warning("请上传图标");
                return;
            }
            if(newflag){
                this.$message.warning("请上传图文");
                return;
            }
            if (!this.ifEdit) {
                this.$api.confinementRoom.platformSupportType(this.list).then(res => {
                    if (res.code == 200) {
                        this.$message.success('新增成功');
                        this.search();
                    }
                })
            } else {
                this.$api.confinementRoom.platformSupportTypeedit(this.list).then(res => {
                    if (res.code == 200) {
                        this.$message.success('编辑成功');
                        this.search();
                    }
                })

            }

        },
        changeCompay(id, item) {
            if (!item.children) {
                this.jurisdictions = false
                this.$store.dispatch('treedepartment', { treedepartmentId: id })
                this.search();
            } else {
                this.jurisdictions = true
            }
        }
    },
    computed: {
        treedeptId: {
            get() {
                return this.$store.getters.treedepartmentId
            },
            set(val) {
                val = this.$store.getters.treedepartmentId;
            }
        }
    },
    created() {
        let h = window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;//获取可视区域高度
        this.height = h - 132
        this.$store.dispatch('treedepartment', { treedepartmentId: this.$store.getters.departmentId })
        this.treedeptId = this.$store.getters.treedepartmentId;

    },

}
</script>
<style scoped>
.imgurl {
    width: 100px;
    height: 100px;
    border: 1px dashed #999;
    margin-left: 20px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    cursor: pointer;
}

.basic {
    margin-top: 10px;
    margin-left: 20px;
    height: 35px;
    /* border: 1px solid black; */
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
}

.long {
    height: 10px;
    border: 2px solid #2b75ed;
    display: inline-block;
}

.fit {
    position: absolute;
    margin-left: 20px;
    margin-top: 10px;
    color: red
}

.Label {
    width: 100%;
    min-height: 100px;
    /* border: 1px solid black; */
    display: flex;
    flex-wrap: wrap;
}

.labellist {
    width: 50px;
    height: 30px;
    display: inline-block;
    border: 1px solid #eee;
    margin-left: 10px;
    margin-top: 10px;
    text-align: center;
    line-height: 30px;
    border-radius: 5px;
    cursor: pointer;
}

.project_children {
    width: 97%;
    min-height: 20px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.project {
    width: 100%;
    min-height: 250px;

}

.photo {
    width: 810px;
    min-height: 206px;
    border: 1px solid red;
    display: flex;
}

.title_del {
    width: 300px;
    height: 142px;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0.7;
    position: absolute;
    top: 0;
}

.busic_img {
    width: 630px;
    min-height: 142px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 10px;

}

.busic_img_children {
    width: 300px;
    height: 142px;
    border: 1px dashed #eee;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

}

.busic_imgs {
    margin-left: 56px;
    margin-top: 56px;
}

.basic_title_children {
    width: 120px;
    height: 40px;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    margin-left: 10px;
    cursor: pointer;
}

.title_success {
    width: 15px;
    height: 15px;
    position: absolute;
    right: 0;
    top: -8px;
    z-index: 1000;
}

/* .basic_title_children::before{

} */
.title_right {
    content: '';
    width: 20px;
    height: 50px;
    background-color: #13ce66;
    position: absolute;
    right: 0;
    top: -20px;
    transform: rotate(-45deg);
}

.basic_title {
    width: 770px;
    height: 40px;
    display: flex;
}

.basic {
    margin-top: 10px;
    margin-left: 20px;
    height: 35px;
    /* border: 1px solid black; */
    border-bottom: 1px solid #eee;
}

.long {
    height: 10px;
    border: 2px solid #2b75ed;
    display: inline-block;
}
</style>