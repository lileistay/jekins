<template>
    <div>
        <Tree :isShowfile="isShowfile" :showDefault="showDefault" @changeCompay="changeCompay">
            <template v-slot:company >
                <div style="position: absolute;right: 20px;top:0px;background-color: #fff;height: 50px;">
                    <!-- <el-button v-has-permi="['client:companyLabel:add']" type="primary" size="mini"
                        style="position: absolute;right:120px;top:145px;z-index:1000" @click="submit"
                        :loading="submitcompant" v-if="!ifEdit" :disabled="jurisdictions">
                        提交
                    </el-button>
                    <el-button v-has-permi="['client:companyBasicsInfo:edit']" type="primary" size="mini"
                        style="position: absolute;right:120px;top:145px;z-index:1000" @click="submit"
                        :loading="submitcompant" v-if="ifEdit" :disabled="jurisdictions">
                        提交
                    </el-button>
          
                    <el-button type="primary" size="mini" style="position: absolute;right:50px;top:145px;z-index: 1000;"
                        @click="submitback">
                        返回
                    </el-button> -->
                </div>
                <div :style="{ height: height + 'px', border: '1px solid transparent' }">
                    <div>
                        <div class="basic">
                            <span class="long"></span> 轮播图配置
                            <el-button type="success" size="mini" @click="addlist" style="margin-left:20px"
                                :disabled="jurisdictions">新增轮播图</el-button>
                        </div>
                        <el-form>
                            <el-form-item v-for="(items, indexs) in uploadlist" :key="indexs">
                                <span
                                    :style="{ color: 'red', position: 'absolute', left: items.Name !== '执业许可证' ? '-78px' : '-90px' }"
                                    v-show="items.Name == '企业相册'">*</span>
                                <input type="file" :ref="'title_img' + items.name" style="display: none;"
                                    @change="selchange">

                                <div class="busic_img" :style="{ width: items.newwidth }">
                                    <div style="width: 375px;height: 220px;margin-left: 10px;"
                                        v-for="(item, index) in items.value" :key="index">
                                        <div class="busic_img_children" @mouseover="newdelete(index, items.name, indexs)"
                                            @mouseleave="newleave(index, items.name, indexs)"
                                            :style="{ marginTop: '10px', border: item.border, width: items.width, height: items.height, marginLeft: '20px' }">
                                            <div class="busic_imgs" v-if="item.imgUrl == ''"
                                                :style="{ marginLeft: items.left, marginTop: items.top }">
                                                <img src="@/assets/images/add.png" alt="">
                                            </div>
                                            <div v-else>
                                                <div v-if="item.mp4Url">
                                                    <video :src="item.mp4Url"
                                                        :style="{ width: items.width, height: items.height }"
                                                        autoplay></video>
                                                </div>
                                                <div v-else>
                                                    <img :src="item.imgUrl" alt=""
                                                        :style="{ width: items.width, height: items.height }">
                                                </div>

                                            </div>
                                            <div class="title_del" v-show="item.showflag"
                                                >
                                                <img src="@/assets/images/del.png" alt="" class="busic_imgs"
                                                    :style="{ marginLeft: items.left, marginTop: items.top }" @click="deleter($event, index, items.name, indexs)">

                                            </div>
                                            <div class="title_del" v-show="item.showflag" @click="addlist(true, index)"
                                                style="width:50px;height:50px">
                                                <img src="@/assets/edit.png" alt="" class="busic_imgs"
                                                    :style="{ marginLeft: items.lefts, marginTop: items.top }">
                                            </div>
                                            <div class="title_right" v-show="item.flags"></div>
                                            <div class="title_success" v-show="item.flags" style="z-index: 100000;">
                                                <img src="@/assets/images/ok.png" alt="" style="width: 100%;height: 100%;">
                                            </div>
                                        </div>
                                        <div style="width: 250px;height: 30px;margin-left: 60px;margin-top: 10px;"
                                            v-if="item.ifshow">
                                            <div v-if="item.ifshow">
                                                <el-input size="mini" v-model="item.row" clearable
                                                    :disabled="true"></el-input>
                                            </div>
                                        </div>
                                        <div style="margin-left: 120px;display: flex;width: 200px;align-items: center;"
                                            v-if="item.ifshow">
                                            是否展示：<el-switch v-model="item.showFlag" active-color="#13ce66"
                                                inactive-color="#ff4949" @change="changes(index)">
                                            </el-switch>
                                        </div>
                                    </div>
                                </div>


                                <span style="color:red;margin-left: 10px;">{{ items.desc }}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- <div 
                        :style="{ width: '100%', height: height + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                        <el-empty description="暂无轮播分类"></el-empty>
                    </div> -->


                </div>
            </template>

        </Tree>
        <sgDialog title="新增分类" size="20%" out-top="2%" :dialog="showDigs" @handleClose="showDigs = false">
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
import vm from '@/utils/util'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
export default {
    components: {
        Tree,
        sgDialog
    },
    watch: {
        $route(newV) {
            if(newV.fullPath=='/swiper'){
                this.search();
            }
        },
        uploadlist: {
            handler: function (newVal, oldVal) {
                
                //  console.log(this.list)
            },
            deep: true
        }
    },
    methods: {
        changes(e){
            console.log(this.list[e],'asddasd');
            let el={}
            el.carouselId=this.list[e].carouselId;
            el.deptId=this.treedeptId;
            el.showFlag=this.uploadlist[0].value[e].showFlag==false?"0":'1'
            this.$api.confinementRoom.updateDisplay(el).then(res => {
                  if(res==undefined){
                    this.uploadlist[0].value[e].showFlag=false
                  }
                if(res.code==200){
                    this.$message.success('提交成功')
                    this.search()
                }
            })
            
        },
        deleter(e, index, val, indexs, vals) {
            e.stopPropagation();
            let arr = this.fileList[val][index];
            this.uploadlist[indexs].value.splice(index, 1);
            if (this.uploadlist[indexs].value.length == 0) {

            }
            this.$api.confinementRoom.deleteLocalFile({
                path: this.list[index].carouselAddr
            }).then(res => {

            })
            this.$api.confinementRoom.serviceGuaranteeInfodeltedelete(this.list[index].carouselId).then(res => {
                if (res.code == 200) {
                    this.$message.success('删除成功');
                }
            })

            this.fileList[val].splice(index, 1);


            // this.$refs[vals][0]='';

        },
        selchange(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            if (e.target.files[0].name.split('.')[1] !== 'bmp' && e.target.files[0].name.split('.')[1] !== 'gif' && e.target.files[0].name.split('.')[1] !== 'jpg' && e.target.files[0].name.split('.')[1] !== 'jpeg' && e.target.files[0].name.split('.')[1] !== 'png' && e.target.files[0].name.split('.')[1] !== 'mp4' && e.target.files[0].name.split('.')[1] !== 'avi' && e.target.files[0].name.split('.')[1] !== 'wmv' && e.target.files[0].name.split('.')[1] !== 'mpg') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片以及MP4，avi,mpg类型的视频');
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
                    mp4Url: "",
                    showFlag: false,
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

            }
            let fromdata = new FormData();

            fromdata.append('file', e.target.files[0]);
            this.$api.confinementRoom.unload(fromdata).then(res => {
                let object = {};
                object['photoName'] = res.data.name;
                object['photoAddr'] = res.data.url;
                object['fileSuffix'] = res.data.fileSuffix
                if (this.fileList.hasOwnProperty(this.showstr)) {

                    this.fileList[this.showstr] = this.fileList[this.showstr].concat(object)
                } else {
                    this.fileList[this.showstr] = [];

                    this.fileList[this.showstr].push(object)
                }
                this.$message.success("上传成功")
            });
            if (e.target.files[0].name.split('.')[1] == 'mp4') {
                this.uploadlist[this.Indexs].value[this.Index].mp4Url = window.URL.createObjectURL(e.target.files[0])
                console.log(window.URL.createObjectURL(e.target.files[0]), 'ashdhhasd')
                this.uploadlist[this.Indexs].value[this.Index].imgUrl = window.URL.createObjectURL(e.target.files[0])

            } else {
                this.uploadlist[this.Indexs].value[this.Index].imgUrl = window.URL.createObjectURL(e.target.files[0])
            }
            this.uploadlist[this.Indexs].value[this.Index].flags = true;
            this.uploadlist[this.Indexs].value[this.Index].ifshow = true;
            e.target.value = '';
        },
        newleave(id, val, indexs) {
            this.uploadlist[indexs].value[id].border = '1px dashed #d9d9d9'
            this.uploadlist[indexs].value[id].showflag = false;
            if (this.uploadlist[indexs].value[id].imgUrl !== '') {
                this.uploadlist[indexs].value[id].flags = true;
            }

        },
        addlist(val, item) {
            this.$router.push({
                path: "/swiperchildren"
            })
            if (val == true) {
                localStorage.setItem('editswiper', true)
                localStorage.setItem('numberedit', JSON.stringify(this.list[item]))
            } else {
                localStorage.setItem('editswiper', false)
            }


            // this.Index = index;
            // this.Indexs = indexs;
            // let showstr = val.substr(9, val.length);
            // this.showstr = showstr;
            // this.$refs[val][0].click()

        },
        newdelete(id, val, indexs) {
            if (this.uploadlist[indexs].value[id].imgUrl !== '') {
                this.uploadlist[indexs].value[id].showflag = true;
            }else{
                this.uploadlist[indexs].value[id].border = '1px dashed blue';
            }
      
            this.uploadlist[indexs].value[id].flags = false;
        },
        search() {
            this.$api.confinementRoom.carouselInfo({
                deptId: this.treedeptId
            }).then(res => {
                this.list = res.rows;
                if (this.list.length == 0) {
                    this.ifEdit = false
                    this.uploadlist[0].value = []
                } else {
                    this.ifEdit = true
                    let arr = [];
                    this.list.forEach(value => {
                        let object = {}
                        object['photoAddr'] = value.carouselAddr
                        object['carouselType'] = value.carouselType
                        object['carouselId'] = value.carouselId
                        arr.push(object)
                    })
                    this.uploadlist[0].value = [
                        {
                            imgUrl: "",
                            border: '1px dashed #d9d9d9',
                            showflag: false,
                            flags: false,
                            ifshow: false,
                            row: "",
                            mp4Url: "",
                            showFlag: false,
                        }
                    ]
                    this.fileList['photo'] = arr
                    this.uploadlist[0].value[0].imgUrl = serverPath + this.list[0].carouselAddr
                    this.uploadlist[0].value[0].row = this.list[0].nextAddr
                    this.uploadlist[0].value[0].showFlag = this.list[0].showFlag == '0' ? false : true
                    this.uploadlist[0].value[0].ifshow = true
                    if (this.list[0].carouselType == '2') {
                        this.uploadlist[0].value[0].mp4Url = serverPath + this.list[0].carouselAddr
                    }

                    for (let i = 1; i < this.list.length; i++) {
                        this.uploadlist[0].value.push({
                            imgUrl: serverPath + this.list[i].carouselAddr,
                            border: '1px dashed #d9d9d9',
                            showflag: false,
                            flags: false,
                            ifshow: true,
                            row: this.list[i].nextAddr,
                            mp4Url: this.list[i].carouselType == '2' ? serverPath + this.list[i].carouselAddr : '',
                            showFlag: this.list[i].showFlag == '0' ? false : true,
                        })
                    }
                    console.log(this.uploadlist,'asdhudhasd')
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
                guaranteeName: this.categoryNames,
                guaranteeContent: "",
                useFlag: false,

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
            let flag = false
            let data = this.uploadlist[0].value;
            if (data.length < 2) {
                if (data[0].imgUrl == '') {
                    flag = true
                }
            }
            if (data.length == 2) {
                if (data[1].imgUrl == '') {
                    flag = true
                }
            }
            if (flag) {
                this.$message.warning('请至少上传两张轮播图')
                return
            }
            let arr = [];

            this.fileList.photo.forEach((value, index) => {
                let newdata = {

                }
                newdata['carouselAddr'] = value.photoAddr
                newdata['nextAddr'] = data[index].row
                newdata['deptId'] = this.treedeptId
                newdata['showFlag'] = data[index].showFlag == false ? "0" : '1'

                if (this.ifEdit) {
                    newdata['carouselType'] = value.carouselType
                    if (value.carouselType == undefined) {
                        if (value.fileSuffix !== 'jpg' && value.fileSuffix !== 'png' && value.fileSuffix !== 'bmp' && value.fileSuffix !== 'gif' && value.fileSuffix !== 'jpeg') {
                            newdata['carouselType'] = '2'
                        } else {
                            newdata['carouselType'] = '1'
                        }
                    }
                } else {
                    if (value.fileSuffix !== 'jpg' && value.fileSuffix !== 'png' && value.fileSuffix !== 'bmp' && value.fileSuffix !== 'gif' && value.fileSuffix !== 'jpeg') {
                        newdata['carouselType'] = '2'
                    } else {
                        newdata['carouselType'] = '1'
                    }
                }
                if (this.ifEdit) {
                    newdata['carouselId'] = value.carouselId
                }
                arr.push(newdata)
            })

            if (this.ifEdit) {
                this.$api.confinementRoom.editBatchCarouselInfo(arr).then(res => {
                    if (res.code == 200) {
                        this.$message.success('修改成功')
                        this.search();
                    }
                })
            } else {
                this.$api.confinementRoom.addBatchCarouselInfo(arr).then(res => {
                    if (res.code == 200) {
                        this.$message.success('提交成功')
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
    data() {
        return {
            categoryNames: "",
            weightSorts: "0",
            isShowfile: false,
            fileList: {},
            showDefault: false,
            submitcompant: false,
            ifEdit: false,
            jurisdictions: true,
            height: "",
            showDigs: false,
            uploadlist: [
                {
                    name: "photo", Name: "轮播配置", desc: '',
                    value: [],
                    num: 10000,
                    des: "只允许上传1张营业执照",
                    width: '375px',
                    height: "142px",
                    left: "170px",
                    lefts: '220px',
                    top: "56px",
                    newwidth: '1200px',
                    ifshow: true,
                },
            ],
            list: [

            ]
        }
    }
}
</script>
<style scoped>
.Label {
    width: 100%;
    min-height: 100px;
    /* border: 1px solid black; */
    display: flex;
    flex-wrap: wrap;
}

.labellist {
    /* width: 50px; */
    height: 20px;
    display: inline-block;
    border: 1px solid #eee;
    margin-left: 10px;
    margin-top: 10px;
    text-align: center;
    line-height: 20px;
    border-radius: 5px;
    cursor: pointer;
    padding: 10px;
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
    width: 375px;
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
    width: 375px;
    height: 142px;
    border: 1px dashed #eee;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

}

.busic_imgs {
    margin-left: 135px;
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