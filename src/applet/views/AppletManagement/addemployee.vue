<template>
    <div>
        <div style="height:780px;width:100%;overflow-y:scroll">
            <div style="margin-left: 80px;margin-top: 50px;display: flex;flex-wrap: wrap;">
                <div style="position: relative;margin-top:15px" v-for="(items, indexs) in uploadlist.slice(0, 11)" :key="indexs" >
                    <!-- <span class="fit" style="position: absolute;margin-left: 20px;margin-top: 10px;color: red;"
                        v-show="items.name == 'logo' || items.name == 'sc'">*</span>
                    <span style="position: absolute;margin-left: 50px;margin-top: 10px;color: red;"
                        v-show="items.name !== 'logo' && items.name !== 'zzname' && items.name !== 'sc' && items.name !== 'qz' && items.name !== 'introduce' && items.name !== 'Honorable'">*</span> -->
                    <div v-if="items.name !== 'logo'">
                        <div v-show="items.name == 'name' || items.name == 'Name'">
                            <span :style="{ color: 'red', marginLeft: items.Name == '职称' ? '10px' : '' }">*</span> <span
                                style="font-size: 14px;">{{ items.Name }}</span>
                            <el-input v-model="items.row" :style="{ width: '250px', marginLeft: '10px' }"
                                :maxlength="items.num" show-word-limit size="mini"
                                :placeholder="items.placeholder"></el-input>
                            <p style="color:red">{{ items.des }}</p>
                        </div>
                        <div v-show="items.name == 'sex'">
                            <span style="color:red;margin-left: 10px;">*</span><span style="font-size: 14px;">{{ items.Name
                            }}</span>
                            <span style="margin-left: 10px;"></span>
                            <el-radio v-model="radio" label="0">男</el-radio>
                            <el-radio v-model="radio" label="1">女</el-radio>
                        </div>
                        <div v-show="items.name == 'jy'">
                            <span style="color:red;margin-left: 10px;">*</span> <span style="font-size: 14px;">{{ items.Name
                            }}</span>
                            <el-select v-model="items.row" placeholder="请选择" size="mini" clearable
                                style="margin-left: 10px;">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>

                        <div v-show="items.name == 'zzname'">
                            <span style="font-size: 14px;margin-left: 10px;">{{ items.Name }}</span>
                            <el-input v-model="items.row" :style="{ width: '250px', marginLeft: '10px' }"
                                :maxlength="items.num" show-word-limit size="mini" placeholder="请输入资质编号"></el-input>
                        </div>
                        <div v-show="items.name == 'qz'" class="max">
                            <span style="color:red;margin-left: 5px;" v-show="items.Name=='电话'">*</span>
                            <span :style="{fontSize: '14px',marginLeft:items.Name=='微信'||items.Name=='权重'?'10px':''}">{{ items.Name }}</span>
                            <el-input v-model="items.row" :style="{ width: '250px', marginLeft: '10px' }"
                                :maxlength="items.num" show-word-limit size="mini" v-if="items.Name=='电话'||items.Name=='微信'" autocomplete="off" readonly ></el-input>
                                <el-input-number v-model="weightSort" :style="{ width: '250px', marginLeft: '10px' }"
                                :maxlength="items.num" show-word-limit size="mini" v-else></el-input-number>


                        </div>

                    </div>


                </div>

                <sgDialog title="添加擅长项目" size="30%" out-top="2%" :dialog="showproject" @handleClose="closeRoomDialogtooth">
                    <div slot="out">
                        <div class="project">
                            <span>擅长项目</span>
                            <div class="project_children">
                                <el-tag v-for="(tag, index) in tags" :key="index" closable :type="tag.type"
                                    :style="{ marginLeft: '10px', marginTop: '5px' }" @close="closelabel(index)">
                                    {{ tag.name }}
                                </el-tag>
                                <div style="margin-left: 5px;">
                                    <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addprojects"
                                        v-if="showIfproject" style="margin-top: 6px;">新增擅长项目</el-button>
                                    <el-input v-model="tagname" maxlength="4" focus show-word-limit @blur="projectblur"
                                        style="width: 150px;margin-top: 5px;" ref="Input" size="mini" v-else>
                                    </el-input>
                                </div>
                            </div>
                            <p style="margin-top: 10px;">擅长项目标签库</p>
                            <div class="Label">
                                <span class="labellist" @click="addColor(index)" v-for="(item, index) in labelList"
                                    :key="index" :style="{ background: item.back, color: item.color }">{{ item.name
                                    }}</span>
                            </div>
                        </div>
                        <div style="height: 40px;">

                        </div>
                        <div class=""
                            style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                            <div style="width: 160px;height: 40px;">
                                <el-button type="primary" size="mini" @click="ok">确定</el-button>
                                <el-button @click="closeRoomDialogteeth" size="mini">取消</el-button>
                            </div>
                        </div>
                    </div>
                </sgDialog>
            </div>
            <div
                style="width: 800px;min-height: 30px;display: flex;flex-wrap: wrap;margin-top: 20px;margin-left: 80px;align-items: center;">
                <span style="color: red;">*</span> <span style="font-size: 14px;">擅长项目</span>
                <el-tag v-for="(tag, index) in newtags" :key="index" closable :type="tag.type"
                    :style="{ marginLeft: '10px', marginTop: '5px' }" @close="closelabels(index)">
                    {{ tag.name }}
                </el-tag>
                <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addproject"
                    style="margin-left:20px">新增擅长项目</el-button>
            </div>
            <div style="width: 950px;overflow: hidden;margin-left: 80px;margin-top: 20px;display: flex;">
                <span style="font-size: 14px;">成员介绍</span>
                <div ref="editor" style="height: 350px;width: 500px;margin-left: 10px;"></div>
            </div>
            <div v-for="(items, indexs) in uploadlist.slice(10, 11)" :key="indexs" style="margin-left: 80px;display: flex;">
                <div style="color: red;font-size: 14px;">*</div>
                <div style="font-size: 14px;">职业照</div>
                <!-- <span style="color:red;margin-left: ;"> *</span>  <span style="font-size: 14px;margin-left: -60px;">职业照</span> -->
                <input type="file" :ref="'title_img' + items.name" style="display: none;" @change="selchange">
                <div class="busic_img">
                    <div v-for="(item, index) in items.value" :key="index" class="busic_img_children"
                        @mouseover="newdelete(index, items.name, indexs + 10)"
                        @mouseleave="newleave(index, items.name, indexs + 10)"
                        :style="{ marginLeft: index % 2 == 0 ? '0px' : '10px', marginTop: '10px', border: item.border, width: items.width, height: items.height }"
                        @click="addlist(index, 'title_img' + items.name, indexs + 10)">
                        <div class="busic_imgs" v-if="item.imgUrl == ''"
                            :style="{ marginLeft: items.left, marginTop: items.top }">
                            <img src="@/assets/images/add.png" alt="">
                        </div>
                        <div v-else>
                            <img :src="item.imgUrl" alt="" :style="{ width: items.width, height: items.height }">
                        </div>
                        <div class="title_del" v-show="item.showflag"
                            @click="deleter($event, index, items.name, indexs + 10)">
                            <img src="@/assets/images/del.png" alt="" class="busic_imgs">
                        </div>
                        <div class="title_right" v-show="item.flags"></div>
                        <div class="title_success" v-show="item.flags" style="z-index: 100000;">
                            <img src="@/assets/images/ok.png" alt="" style="width: 100%;height: 100%;">
                        </div>
                    </div>
                </div>
            </div>

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                style="margin-left: 30px;">
                <el-form-item :label="items.Name" v-for="(items, indexs) in newHonorable" :key="indexs + 100">
                    <input type="file" :ref="'title_img' + items.name" style="display: none;" @change="selchanges">

                    <div class="busic_img" :style="{ width: items.newwidth }">
                        <div v-for="(item, index) in items.value" :key="index" class="busic_img_children"
                            @mouseover="newdeletes(index, items.name, indexs)"
                            @mouseleave="newleaves(index, items.name, indexs)"
                            :style="{ marginLeft: index % 5 == 0 ? '0px' : '10px', marginTop: '10px', border: item.border, width: items.width, height: items.height }"
                            @click="addlists(index, 'title_img' + items.name, indexs)">
                            <div class="busic_imgs" v-if="item.imgUrl == ''"
                                :style="{ marginLeft: items.left, marginTop: items.top }">
                                <img src="@/assets/images/add.png" alt="">
                            </div>
                            <div v-else>
                                <img :src="item.imgUrl" alt="" :style="{ width: items.width, height: items.height }">
                            </div>
                            <div class="title_del" v-show="item.showflag"
                                @click="deleters($event, index, items.name, indexs)">
                                <img src="@/assets/images/del.png" alt="" class="busic_imgs"
                                    :style="{ marginLeft: items.left, marginTop: items.top }">
                            </div>
                            <div class="title_right" v-show="item.flags"></div>
                            <div class="title_success" v-show="item.flags" style="z-index: 100000;">
                                <img src="@/assets/images/ok.png" alt="" style="width: 100%;height: 100%;">
                            </div>
                        </div>
                    </div>
                    <div style="display: flex;" v-show="items.ifshow">
                        <div v-for="(item, index) in items.value " :key="index"
                            :style="{ marginLeft: '10px', width: '142px', height: '30px', border: '1px solid black', marginTop: '10px', border: '1px solid #eee' }"
                            v-show="item.ifshow">
                            <el-input size="mini" maxlength="5" v-model="item.row" show-word-limit></el-input>
                        </div>
                    </div>
                    <span style="color:red;margin-left: 10px;">{{ items.desc }}</span>
                </el-form-item>
            </el-form>
            <div style="position: absolute;right: 20px;top:0px;background-color: #fff;height: 50px;">
                <el-button type="primary" size="mini" style="position: absolute;right:120px;top:145px;z-index:1000"
                    @click="submit" :loading="submitcompant" v-has-permi="['client:companyMember:add']" v-if="addflag=='false'">
                    提交
                </el-button>
                <el-button type="primary" size="mini" style="position: absolute;right:120px;top:145px;z-index:1000"
                    @click="submit" :loading="submitcompant" v-has-permi="['client:companyMember:edit']" v-if="addflag=='true'">
                    提交
                </el-button>
                <el-button type="primary" size="mini" style="position: absolute;right:50px;top:145px;z-index: 1000;"
                    @click="submitback">
                    返回
                </el-button>
            </div>
        </div>

    </div>
</template>
<script>
import sgDialog from '@/components/Dialog/index';
import E from 'wangeditor'
import vm from '@/utils/util'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
import { validPhone } from '@/utils/validate'
export default {
    components: {
        sgDialog,
    },
    computed: {
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId;
            }
        }
    },
    created() {
        this.$api.confinementRoom.companyLabel({
            deptId:this.deptId
        }).then(res => {
            res.rows.forEach(value => {
                value.back = '',
                    value.color = "",
                    value.name = value.labelName
            })
            this.labelList = res.rows
        })
        let flag = localStorage.getItem('addemployee');
        this.addflag=localStorage.getItem('addemployee');

        let id = localStorage.getItem('addemployeeId')
        if (flag == 'true') {
            let ids = JSON.parse(id);
            let arr = [];
            let tag = ids.adept.split(',');
            tag.forEach(value => {
                let obj = {};
                obj.name = value;
                arr.push(obj)
            })

            this.newtags = this.deepClone(arr);
            this.tags = arr;
            let object = {
                        'photo': [],
                        'logo': [],
                        'trading':[],
                        'peration': [],
                    }
                    ids.memberPhoto.forEach(value => {
                        if (value.photoType == '1') {
                            object['logo'].push(value)
                        }
                        else if (value.photoType == '2') {
                            object['photo'].push(value)
                        } else if (value.photoType == '3') {
                            object['trading'].push(value)
                        } else if (value.photoType == '4') {
                            object['peration'].push(value)
                        }
                    })
            if (ids.memberPhoto == null) {

            } else {

                this.uploadlist[10].value[0].imgUrl = serverPath + object.logo[0].photoAddr;
                this.fileList['logo'] = object.logo;
                this.uploadlist[10].value[0].flags = true;
            }
            if(object.photo.length>0){


                      this.fileList['photo'] = object.photo;
                this.newHonorable[0].value[0].imgUrl = serverPath + object.photo[0].photoAddr;
                this.newHonorable[0].value[0].flags = true;
               this.newHonorable[0].value[0].ifshow = true;
               this.newHonorable[0].value[0].row = object.photo[0].photoName;
               object.photo.forEach((value,index)=>{
                      if(index>1){
                        this.newHonorable[0].value.push(
                            {
                        imgUrl: serverPath + value.photoAddr,
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                        ifshow: false,
                        row: value.photoName,
                    }
                        )
                      }
               })


                this.newHonorable[0].value.push(
                    {
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                        ifshow: false,
                        row: "",
                    }
                )
            }
            if(object.trading.length>0){
                this.fileList['trading'] = object.trading;
                this.newHonorable[1].value[0].imgUrl = serverPath + object.trading[0].photoAddr;
                this.newHonorable[1].value[0].flags = true
                // this.newHonorable[1].value.push(
                //     {
                //         imgUrl: "",
                //         border: '1px dashed #d9d9d9',
                //         showflag: false,
                //         flags: false,
                //         ifshow: false,
                //         row: "",
                //     }
                // )
            }
            if(object.peration.length>0){
                this.fileList['peration'] = object.peration;
                this.newHonorable[2].value[0].imgUrl = serverPath + object.peration[0].photoAddr;
                this.newHonorable[2].value[0].flags = true
                // this.newHonorable[2].value.push(
                //     {
                //         imgUrl: "",
                //         border: '1px dashed #d9d9d9',
                //         showflag: false,
                //         flags: false,
                //         ifshow: false,
                //         row: "",
                //     }
                // )
            }
            // if (ids.memberPhoto == null) {

            // } else {
            //     this.fileList['logo'] = ids.memberPhoto;
            //     this.uploadlist[0].value[0].imgUrl = serverPath + ids.memberPhoto[0].photoAddr;
            //     this.uploadlist[0].value[0].flags = true;
            //     this.uploadlist[0].value.push({
            //         imgUrl: "",
            //         border: '1px dashed #d9d9d9',
            //         showflag: false,
            //         flags: false,
            //         ifshow: false,
            //         row: "",
            //     })
            // }
            // if (ids.practiceCredential == null) {

            // } else {
            //     this.fileList['trading'] = ids.practiceCredential;
            //     this.newHonorable[1].value[0].imgUrl = serverPath + ids.practiceCredential[0].photoAddr;
            //     this.newHonorable[1].value[0].flags = true
            //     this.newHonorable[1].value.push(
            //         {
            //             imgUrl: "",
            //             border: '1px dashed #d9d9d9',
            //             showflag: false,
            //             flags: false,
            //             ifshow: false,
            //             row: "",
            //         }
            //     )
            // }
            // if (ids.statusCredential == null) {

            // } else {
            //     this.fileList['peration'] = ids.statusCredential;
            //     this.newHonorable[2].value[0].imgUrl = serverPath + ids.statusCredential[0].photoAddr;
            //     this.newHonorable[2].value[0].flags = true
            //     this.newHonorable[2].value.push(
            //         {
            //             imgUrl: "",
            //             border: '1px dashed #d9d9d9',
            //             showflag: false,
            //             flags: false,
            //             ifshow: false,
            //             row: "",
            //         }
            //     )
            // }

            this.uploadlist[0].row = ids.memberName;
            this.radio = ids.memberSex;
            this.uploadlist[2].row = ids.professionGrade;
            this.uploadlist[3].row = ids.jobDuration;
            this.uploadlist[5].row = ids.certificationNum;
            this.weightSort = ids.weightSort;
            this.uploadlist[7].row=ids.memberPhone;
            this.uploadlist[8].row=ids.memberWx;
            this.info_ = ids.introduce;

            // photo,
            //     trading,
            //     operation
            // memberName: this.uploadlist[1].row,
            //     memberSex: this.radio,
            //     professionGrade: this.uploadlist[3].row,
            //     jobDuration: this.uploadlist[4].row,
            //     adept: str,
            //     certificationNum: this.uploadlist[6].row,
            //     weightSort: this.uploadlist[7].row,
            //     introduce: this.info_,


        } else {

        }
        this.deptId = this.$store.getters.departmentId
        for (let i = 1; i < 51; i++) {
            let object = {};
            object['value'] = i;
            object['label'] = i;
            this.options.push(object)
        }
    },
    mounted() {
        let id = localStorage.getItem('addemployeeId');
        let ids = JSON.parse(id)
        this.editor = new E(this.$refs.editor);

        /*设置存储照片的格式*/
        this.editor.config.uploadImgShowBase64 = true // base 64 存储图片
        this.editor.config.uploadImgServer = this.UploadVidio// 配置服务器端地址
        this.editor.config.uploadImgHeaders = {}// 自定义 header
        this.editor.config.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
        this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
        // this.editor.customConfig.uploadImgServer = '/upload'
        // 配置菜单
        this.editor.config.menus = [
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            'table', // 表格
            'video', // 插入视频
            'code', // 插入代码
            'undo', // 撤销
            'redo', // 重复
            'fullscreen' // 全屏
        ]

        this.editor.config.uploadImgHooks = {
            fail: (xhr, editor, result) => {
                // 插入图片失败回调
            },
            success: (xhr, editor, result) => {
                // 图片上传成功回调
            },
            timeout: (xhr, editor) => {
                // 网络超时的回调
            },
            error: (xhr, editor) => {
                // 图片上传错误的回调
            },
            customInsert: (insertImg, result, editor) => {
                // 图片上传成功，插入图片的回调
                //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
                // console.log(result.data[0].url)
                //insertImg()为插入图片的函数
                //循环插入图片
                // for (let i = 0; i < 1; i++) {
                // console.log(result)
                let url = this.UploadVidio
                insertImg(url)
                // }
            }
        }
        this.editor.config.onchange = (html) => {
            this.info_ = html // 绑定当前逐渐地值
            this.$emit('change', this.info_) // 将内容同步到父组件中
        }
        // 创建富文本编辑器
        this.editor.create();
        let flag = localStorage.getItem('addemployee');
        if (flag == 'true') {
            this.editor.txt.html(ids.introduce)
        }
    },
    methods: {
        submitback() {
            vm.$emit('closeTag', this.$route.path);

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
        submit(val) {
            //  console.log(this.fileList,'________');
            //  return

            let flag = localStorage.getItem('addemployee')
            let str = '';
            if (this.tags.length == 1) {
                str = this.tags[0].name + '';
            } else {
                this.tags.forEach((value, index) => {
                    if (index == this.tags.length - 1) {
                        str += value.name
                    } else {
                        str += value.name + ','
                    }
                })
            }
            if (this.uploadlist[0].row == '') {
                this.$message.warning("请输入姓名");
                return
            }
            if (this.uploadlist[2].row == '') {
                this.$message.warning("请输入职称");
                return
            }
            if (this.uploadlist[3].row == '') {
                this.$message.warning("请选择经验");
                return
            }
            if(this.uploadlist[7].row==''){
                this.$message.warning('请输入电话');
                return;
            }else{
                if(!validPhone(this.uploadlist[7].row)){
                this.$message.warning('请输入正确的电话');
                return;
                }
            }
            if (str == '') {
                this.$message.warning("请选择擅长项目");
                return
            }
            if (this.uploadlist[10].value[0].imgUrl == '') {
                this.$message.warning("请上传职业照");
                return
            }
            this.tags.forEach(value => {
                value.companyId = this.companyId,
                    value.labelName = value.name
            })
            let arr = [];
            for (let x in this.fileList) {
                this.fileList[x].forEach((value, index) => {
                    value.deptId = this.deptId;
                    if (x == 'logo') {
                        value.photoType = '1'
                    }
                    if (x == 'photo') {
                        value.photoType = '2'
                        value.photoName = this.newHonorable[0].value[index].row;
                    }
                    if (x == 'trading') {
                        value.photoType = '3'
                    }
                    if (x == 'operation') {
                        value.photoType = '4'
                    }
                    arr.push(value);
                })
            }
            let arrstr = '';
            // let newstr='';
            arr.forEach((value, index) => {
                if (index == arr.length - 1) {
                    arrstr += JSON.stringify(value)
                } else {
                    arrstr += JSON.stringify(value) + ','
                }

            })
            let id = localStorage.getItem('addemployeeId')
            let ids = JSON.parse(id);
            let date = {
                memberName: this.uploadlist[0].row,
                memberSex: this.radio,
                professionGrade: this.uploadlist[2].row,
                jobDuration: this.uploadlist[3].row,
                adept: str,
                certificationNum: this.uploadlist[5].row,
                weightSort: this.weightSort,
                memberPhone: this.uploadlist[7].row,
                memberWx: this.uploadlist[8].row,
                introduce: this.info_,
                deptId: this.deptId,
                memberId: ids.memberId,
                labelList: this.tags,
                photoInfo: arrstr,



            }
            if (flag == 'true') {
                this.submitcompant = true;
                this.$api.confinementRoom.companyMemberedit(date).then(res => {
                    if (res.code == 200) {
                        this.submitcompant = false;
                        this.$message.success('修改员工信息成功');
                        vm.$emit('closeTag', this.$route.path);

                    }
                });
            } else {
                this.$api.confinementRoom.companyMember(date).then(res => {
                    if (res.code == 200) {
                        this.$message.success('新增员工信息成功');
                        this.submitcompant = false;
                        vm.$emit('closeTag', this.$route.path);


                    }
                });
            }




        },
        closeRoomDialogtooth() {
            this.showproject = false;
        },
        ok() {
            this.newtags = this.deepClone(this.tags)
            this.showproject = false;
        },
        closeRoomDialogteeth() {
            this.showproject = false;
        },
        addColor(index) {
            if (this.labelList[index].back == '#2b75ed') {
                this.labelList[index].back = '';
                this.labelList[index].color = '';
                this.tags.forEach((value, indexs) => {
                    if (value.name == this.labelList[index].name) {
                        this.tags.splice(indexs, 1)
                    }
                })
            } else {
                this.labelList[index].back = '#2b75ed';
                this.labelList[index].color = '#fff'
                this.tags.push({
                    name: this.labelList[index].name
                })
            }

        },
        addprojects() {
            this.flshow = true;
            let that = this;
            this.showIfproject = false;
            setTimeout(() => {
                that.$refs.Input.focus();
            }, 100)


        },
        projectblur() {

            this.showIfproject = true;
            if (this.tagname == '') {

            } else {
                let flag = false;
                this.tags.forEach(value => {
                    if (value.name == this.tagname) {
                        flag = true;
                    }
                })
                if (flag) {
                    this.$message.warning("已有相同标签，请重新添加")
                    return
                }
                this.tags.push({
                    name: this.tagname
                })
            }

            this.tagname = ''
        },
        closelabel(index) {
            this.labelList.forEach((value, indexs) => {
                if (this.tags[index].name == value.name) {
                    this.labelList[indexs].back = '';
                    this.labelList[indexs].color = '';
                }
            })
            this.tags.splice(index, 1);
        },
        closelabels(index) {
            this.tags.splice(index, 1);
            this.newtags.splice(index, 1);
        },
        addproject() {
            this.showproject = true;
            this.labelList.forEach((value, index) => {
                this.tags.forEach(newvalue => {
                    if (value.name == newvalue.name) {
                        this.labelList[index].back = '#2b75ed';
                        this.labelList[index].color = '#fff'
                    }
                })
            })
        },
        selchange(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            if (e.target.files[0].name.split('.')[1] !== 'bmp' && e.target.files[0].name.split('.')[1] !== 'gif' && e.target.files[0].name.split('.')[1] !== 'jpg' && e.target.files[0].name.split('.')[1] !== 'jpeg' && e.target.files[0].name.split('.')[1] !== 'png') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
                return
            }
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
            e.target.value = '';
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
        newdelete(id, val, indexs) {
            if (this.uploadlist[indexs].value[id].imgUrl !== '') {
                this.uploadlist[indexs].value[id].showflag = true;
            }
            this.uploadlist[indexs].value[id].border = '1px dashed blue';
            this.uploadlist[indexs].value[id].flags = false;
        },
        selchanges(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            if (e.target.files[0].name.split('.')[1] !== 'bmp' && e.target.files[0].name.split('.')[1] !== 'gif' && e.target.files[0].name.split('.')[1] !== 'jpg' && e.target.files[0].name.split('.')[1] !== 'jpeg' && e.target.files[0].name.split('.')[1] !== 'png') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
                return
            }
            if (this.newHonorable[this.Indexs].value.length > this.newHonorable[this.Indexs].num) {
                this.$message.warning(`${this.newHonorable[this.Indexs].des}`)
                return
            }
            if (this.showstr == 'photo') {
                this.newHonorable[this.Indexs].value.push({
                    imgUrl: "",
                    border: '1px dashed #d9d9d9',
                    showflag: false,
                    flags: false,
                    ifshow: false,
                    row: "",
                })
            } else {
                if (this.newHonorable[this.Indexs].value.length == this.newHonorable[this.Indexs].num) {

                } else {
                    this.newHonorable[this.Indexs].value.push({
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    })
                }
                // this.newHonorable[this.Indexs].value.push({
                //     imgUrl: "",
                //     border: '1px dashed #d9d9d9',
                //     showflag: false,
                //     flags: false,
                // })
            }
            this.newHonorable[this.Indexs].value[this.Index].imgUrl = window.URL.createObjectURL(e.target.files[0])
            this.newHonorable[this.Indexs].value[this.Index].flags = true;
            this.newHonorable[this.Indexs].value[this.Index].ifshow = true;
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
            e.target.value = '';
        },
        addlists(index, val, indexs) {
            this.Index = index;
            this.Indexs = indexs;
            let showstr = val.substr(9, val.length);
            this.showstr = showstr;
            this.$refs[val][0].click()
        },
        newleaves(id, val, indexs) {
            this.newHonorable[indexs].value[id].border = '1px dashed #d9d9d9'
            this.newHonorable[indexs].value[id].showflag = false;
            if (this.newHonorable[indexs].value[id].imgUrl !== '') {
                this.newHonorable[indexs].value[id].flags = true;
            }

        },
        deleters(e, index, val, indexs) {
            e.stopPropagation();
            let flag = localStorage.getItem('addemployee');
            this.newHonorable[indexs].value.splice(index, 1);
            if (val !== 'photo') {
                if (this.newHonorable[indexs].value.length == 0) {
                    this.newHonorable[indexs].value.push(
                        {
                            imgUrl: "",
                            border: '1px dashed #d9d9d9',
                            showflag: false,
                            flags: false,
                        }
                    )
                }
            }
            if (flag) {
                let id = this.fileList[val][index].photoId;
                if (id == undefined) {

                } else {
                    this.$api.confinementRoom.photoInfodel(id).then(res => {
                        this.$message.success('删除成功')
                    })
                }

            }

            this.fileList[val].splice(index, 1);
        },
        newdeletes(id, val, indexs) {
            if (this.newHonorable[indexs].value[id].imgUrl !== '') {
                this.newHonorable[indexs].value[id].showflag = true;
            }
            this.newHonorable[indexs].value[id].border = '1px dashed blue';
            this.newHonorable[indexs].value[id].flags = false;
        },
    },
    data() {
        return {
            info_: "",
            addflag:"",
            submitcompant: false,
            weightSort:"",
            fileList: {},
            newtags: [],
            info_: "",
            options: [],
            radio: '0',
            value1: "",
            tags: [],
            content: `<p>这是 vue-quill-editor 的内容！</p>`,
            showIfproject: true,
            showproject: false,

            tagname: "",
            labelList: [{
                name: "眼部",
                back: '',
                color: ""
            },
            {
                name: "鼻部",
                back: '',
                color: ""
            },
            {
                name: "面部",
                back: '',
                color: ""
            },
            {
                name: "胸部",
                back: '',
                color: ""
            }
            ],
            employee: [
                {

                }
            ],
            ruleForm: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            uploadlist: [
                {
                    name: "name",
                    Name: "姓名",
                    row: "",
                    placeholder: "请输入姓名"
                },
                {
                    name: "sex",
                    Name: "性别",
                    row: "",

                },
                {
                    name: "Name",
                    Name: "职称",
                    row: "",
                    num: 5,
                    placeholder: "请输入职称"
                },
                {
                    name: "jy",
                    Name: "经验",
                    row: "",
                },
                {
                    name: "sc",
                    Name: "擅长项目",
                    row: "",
                },
                {
                    name: "zzname",
                    Name: "资质编号",
                    row: "",
                },
                {
                    name: "qz",
                    Name: "权重",
                    row: "",
                },
                {
                    name: "qz",
                    Name: "电话",
                    row: "",
                },
                {
                    name: "qz",
                    Name: "微信",
                    row: "",
                },
                {
                    name: "introduce",
                    Name: "成员介绍",
                    row: "",
                },
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



            ],
            newHonorable: [
                {
                    name: "photo", Name: "荣誉风采", desc: '建议图片不超过2MB，建议图片尺寸：248*164',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                        ifshow: false,
                        row: "",
                    }],
                    num: 10000,
                    des: "只允许上传1张营业执照",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px",
                    newwidth: '780px',
                    ifshow: true,
                },


                {
                    name: "trading", Name: "相关执业证", desc: '建议图片不超过2MB，建议图片尺寸：248*164',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张相关执业证",
                    width: '300px',
                    height: "142px",
                    left: "135px",
                    top: "56px",
                    newwidth: '630px',
                    ifshow: false,
                },
                {
                    name: "operation", Name: "相关资格证", desc: '建议图片不超过2MB，建议图片尺寸：248*164',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张相关资格证",
                    width: '300px',
                    height: "142px",
                    left: "135px",
                    top: "56px",
                    newwidth: '630px',
                    ifshow: false,
                },
            ],
            rules: {
                name: [
                    { required: true, message: '', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            }
        }
    }
}
</script>

<style scoped>
::v-deep .max .el-input__inner {
    padding: 0 !important;
    text-align: left;
    padding-left: 20px !important;
}
::v-deep .el-input-number__decrease {
    display: none !important
}

::v-deep .el-input-number__increase {
    display: none;
}
::v-deep .w-e-menu:nth-of-type(18) {
    display: none !important;
}

::v-deep .w-e-icon-fullscreen {
    display: none !important;
}

::v-deep .w-e-toolbar {
    z-index: 100 !important;

}

::v-deep .w-e-text {
    width: 810px !important;
    z-index: 1 !important;

}

::v-deep .w-e-text-container {
    z-index: 1 !important;

}

/* .w-e-toolbar */
.bottom {
    position: fixed;
    width: 100%;
    height: 80px;
    bottom: 0;
    background-color: #fff;
    z-index: 1000;
    display: flex;
    align-items: center;
    z-index: 10;

    justify-content: center;
}

/* ::v-deep .w-e-toolbar {
    width: 1400px !important;
}

::v-deep .w-e-text-container {
    width: 1400px !important;
} */

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
