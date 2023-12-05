<template>
    <div>
        <div style="position: absolute;right: 20px;top:0px;background-color: #fff;height: 50px;">
            <el-button v-has-permi="['client:companyLabel:add']" type="primary" size="mini"
                style="position: absolute;right:120px;top:145px;z-index:1000" @click="submit" :loading="submitcompant">
                提交
            </el-button>
            <!-- ifEdit -->
            <el-button type="primary" size="mini" style="position: absolute;right:50px;top:145px;z-index: 1000;"
                @click="submitback">
                返回
            </el-button>
        </div>
        <div :style="{ height: height + 'px', border: '1px solid transparent' }">
            <div>
                <div class="basic">
                    <span class="long"></span> 轮播图配置
                    <span style="color:red"><span
                            style="color:red;margin-left: 10px;font-size:14px">建议图片不超过2MB，建议图片尺寸：375*150</span></span>
                </div>
                <el-form>
                    <el-form-item v-for="(items, indexs) in uploadlist" :key="indexs">
                        <span
                            :style="{ color: 'red', position: 'absolute', left: items.Name !== '执业许可证' ? '-78px' : '-90px' }"
                            v-show="items.Name == '企业相册'">*</span>
                        <input type="file" :ref="'title_img' + items.name" style="display: none;" @change="selchange">

                        <div class="busic_img" :style="{ width: items.newwidth }">
                            <div style="width: 142px;height: 220px;margin-left: 10px;" v-for="(item, index) in items.value"
                                :key="index">
                                <div class="busic_img_children" @mouseover="newdelete(index, items.name, indexs)"
                                    @mouseleave="newleave(index, items.name, indexs)"
                                    :style="{ marginTop: '10px', border: item.border, width: items.width, height: items.height, marginLeft: '20px' }"
                                    @click="addlist(index, 'title_img' + items.name, indexs)">
                                    <div class="busic_imgs" v-if="item.imgUrl == ''"
                                        :style="{ marginLeft: items.left, marginTop: items.top }">
                                        <img src="@/assets/images/add.png" alt="">
                                    </div>
                                    <div v-else>
                                        <div v-if="item.mp4Url">
                                            <video :src="item.mp4Url" :style="{ width: items.width, height: items.height }"
                                                autoplay></video>
                                        </div>
                                        <div v-else>
                                            <img :src="item.imgUrl" alt=""
                                                :style="{ width: items.width, height: items.height }">
                                        </div>

                                    </div>
                                    <div class="title_del" v-show="item.showflag"
                                        @click="deleter($event, index, items.name, indexs)">
                                        <img src="@/assets/images/del.png" alt="" class="busic_imgs"
                                            :style="{ marginLeft: items.left, marginTop: items.top }">
                                    </div>
                                    <div class="title_right" v-show="item.flags"></div>
                                    <div class="title_success" v-show="item.flags" style="z-index: 100000;">
                                        <img src="@/assets/images/ok.png" alt="" style="width: 100%;height: 100%;">
                                    </div>
                                </div>
                                <div style="width: 1000px;height: 30px;margin-left: 20px;margin-top: 10px;">
                                    <div style="display:flex;width:1000px;display:flex;align-items:center;">
                                        <!-- 是否外链：  <el-input size="mini" v-model="item.row"
                                                    clearable></el-input> -->
                                        <span style="margin-left: 10px;">是否外链：</span>
                                        <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949">
                                        </el-switch>
                                        <span :style="{marginLeft: valueLeft,color:'#fff',position:'absolute',cursor:'pointer'}" @click="changeselevalue">{{ selectvalue }}</span>
                        
                                    </div>
                                    <div style="display: flex;" @click="addtos($event)">
                                          <span><span style="color: red;">*</span> 背景颜色:</span>
                                     
                                        <div style="width: 250px;height: 26px;border: 1px solid #eee;padding-left: 16px;display: flex;align-items: center;margin-left: 10px;color: #999;position: relative;border-radius: 3px;background-color: #fff;margin-top: 5px;font-size: 12px;">
                                            {{ newcolors }}
                                            <div style="position: absolute;right: 10px;">
                                                <i class="el-icon-arrow-down"></i>
                                            </div>
                                            <Chrome v-model="colors" @input="updateValue($event)" v-if="colorFlag"></Chrome>
                                        </div>
                                        <!-- <Chrome v-model="colors" @input="updateValue"></Chrome>  -->
                                      <!-- <span>背景颜色:</span>  <Chrome v-model="colors" @input="updateValue"></Chrome> -->
                                       </div>
                                    <div v-if="value">
                                        <span style="margin-left: 8px;">链接地址：</span> <el-input size="mini" style="width:265px" v-model="newvalue"
                                            placeholder="请输入链接地址:pages/shop/index?id=4"></el-input>
                                    </div>
                                    <div style="display: flex;height: 350px;width: 945px;margin-top:20px;">
                                        <span style="" v-if="!value"><span style="color:red">*</span> 详情内容</span>
                                        <div style="width: 850px;margin-left: 15px">
                                          <Wangeditor :content="catalogLevelContent" @catchData="catchDatanew" :flag="true" v-if="!value"></Wangeditor>
                                        </div>

                                    </div>

                                </div>
                                <!-- <div style="margin-left: 40px;display: flex;width: 200px;align-items: center;"
                                            v-if="item.ifshow">
                                            是否展示：<el-switch v-model="item.showFlag" active-color="#13ce66"
                                                inactive-color="#ff4949">
                                            </el-switch>
                                        </div> -->
                            </div>
                        </div>



                    </el-form-item>
                </el-form>
            </div>
            <!-- <div
                        :style="{ width: '100%', height: height + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                        <el-empty description="暂无轮播分类"></el-empty>
                    </div> -->


        </div>

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
import E from 'wangeditor'
import {Chrome,Grayscale} from "vue-color";
import Wangeditor from '@/components/newwangeditor'

const serverPath = process.env.VUE_APP_BASE_API+'/file'
export default {
    components: {
        Tree,
        sgDialog,
        Chrome,
      Wangeditor
    },
    watch: {
        value(newV) {
            if (!newV) {
                this.selectvalue='否';
                this.valueLeft='100px'
            }else{
                this.selectvalue='是';
                this.valueLeft='87px'
            }
        },

    },
    methods: {
      catchDatanew(e){
        this.catalogLevelContent=e;
      },
        changeselevalue(){
          this.value=!this.value
          if(this.value){
            this.valueLeft='87px'
          }else{
            this.valueLeft='100px'
          }
        },
        addtos(e){
           e.stopPropagation();
           let that=this;
           this.colorFlag=true;
          setTimeout(function(){
            let len=document.querySelectorAll('.okselect');
            if(len.length==1){
                return
            }
            let button=document.querySelector('.vc-editable-input');
            let Btn=document.createElement('div');
            Btn.className='okselect';
            Btn.innerHTML='确定'
            Btn.style.cursor='pointer'
            Btn.style.color='#409eff'
            button.appendChild(Btn);
            Btn.onclick=function(e){
                that.colorFlag=false;
                e.stopPropagation();
        
            }


          })
        },
        updateValue(e){
            this.newcolors=e.hex;
        },
        deleter(e, index, val, indexs, vals) {

            e.stopPropagation();
            let arr = this.fileList[val][index];
            this.uploadlist[indexs].value.splice(index, 1);
            if (this.uploadlist[indexs].value.length == 0) {
                this.uploadlist[indexs].value.push(
                    {
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                        mp4Url: "",
                        showFlag: false,
                    }
                )
            }
            let str = '';
            this.fileList['photo'].forEach((value, index) => {
                if (index == this.fileList['photo'].length - 1) {
                    str += value.photoAddr
                } else {
                    str += value.photoAddr + ','
                }
            })

            this.$api.confinementRoom.deleteLocalFile({
                path: str
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success('删除成功')
                }
            })
            this.fileList[val].splice(index, 1);
            // this.$api.confinementRoom.serviceGuaranteeInfodeltedelete(this.list[index].carouselId).then(res => {
            //     if (res.code == 200) {
            //         this.$message.success('删除成功');
            //     }
            // })

            // this.$refs[vals][0]='';

        },
        selchange(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            let len = e.target.files[0].name.split('.')
            if (e.target.files[0].name.split('.')[len.length - 1] !== 'bmp' && e.target.files[0].name.split('.')[len.length - 1] !== 'gif' && e.target.files[0].name.split('.')[len.length - 1] !== 'jpg' && e.target.files[0].name.split('.')[len.length - 1] !== 'jpeg' && e.target.files[0].name.split('.')[len.length - 1] !== 'png' && e.target.files[0].name.split('.')[len.length - 1] !== 'mp4' && e.target.files[0].name.split('.')[len.length - 1] !== 'avi' && e.target.files[0].name.split('.')[len.length - 1] !== 'wmv' && e.target.files[0].name.split('.')[len.length - 1] !== 'mpg') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片以及MP4，avi,mpg类型的视频');
                return
            }
      
            if (this.uploadlist[this.Indexs].value.length > this.uploadlist[this.Indexs].num) {
                this.$message.warning(`${this.uploadlist[this.Indexs].des}`)
                return
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
            if (e.target.files[0].name.split('.')[1] == 'mp4'||e.target.files[0].name.split('.')[1] == 'avi' || e.target.files[0].name.split('.')[1] == 'mpg') {
                this.uploadlist[this.Indexs].value[this.Index].mp4Url = window.URL.createObjectURL(e.target.files[0])
                this.uploadlist[this.Indexs].value[this.Index].imgUrl = window.URL.createObjectURL(e.target.files[0])
                this.carouselType='2'
            } else {
                this.uploadlist[this.Indexs].value[this.Index].imgUrl = window.URL.createObjectURL(e.target.files[0])
                this.carouselType='1'
            }
            this.uploadlist[this.Indexs].value[this.Index].flags = true;
            this.uploadlist[this.Indexs].value[this.Index].ifshow = true;
            e.target.value = '';
            this.create();
        },
        newleave(id, val, indexs) {
            this.uploadlist[indexs].value[id].border = '1px dashed #d9d9d9'
            this.uploadlist[indexs].value[id].showflag = false;
            if (this.uploadlist[indexs].value[id].imgUrl !== '') {
                this.uploadlist[indexs].value[id].flags = true;
            }

        },
        addlist(index, val, indexs) {
            // this.$router.push({
            //     path:"/swiperchildren"
            // })
            this.Index = index;
            this.Indexs = indexs;
            let showstr = val.substr(9, val.length);
            this.showstr = showstr;
            this.$refs[val][0].click()

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
            let flag = localStorage.getItem('editswiper');
            if (flag == 'true') {
                let num = JSON.parse(localStorage.getItem('numberedit'))
                if (num.carouselType == '2') {
                    this.uploadlist[0].value[0].imgUrl = serverPath + num.carouselAddr
                    this.uploadlist[0].value[0].mp4Url = serverPath + num.carouselAddr
                    this.carouselType='2'
                } else {
                    this.uploadlist[0].value[0].imgUrl = serverPath + num.carouselAddr;
                    this.carouselType='1'
                }

                this.value = num.outsideFlag == '1' ? true : false
                this.newvalue = num.nextAddr;
                this.newcolors=num.background;
                this.colors=num.background;

                let object = {}
                let arr = [];
                object['photoAddr'] = num.carouselAddr
                object['carouselType'] = num.carouselType
                object['carouselId'] = num.carouselId
                arr.push(object)
                this.fileList['photo'] = arr;
                if (num.outsideFlag == '0') {
                    setTimeout(() => {

                        this.editor.txt.html(num.nextAddr)
                    }, 200);

                }
            } else {
                this.create();
            }
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
            if(this.newcolors=='请点击选择轮播背景颜色'){
                this.$message.warning('请选择背景颜色');
                return;
            }
            if (flag) {
                this.$message.warning('请上传轮播图')
                return
            }
            if (!this.value) {
                if (this.catalogLevelContent == '') {
                    this.$message.warning("请输入详情内容");
                    return;
                }
            }

            let arr = [];
            
            this.fileList.photo.forEach((value, index) => {
                let newdata = {

                }
                newdata['carouselAddr'] = value.photoAddr

                newdata['deptId'] = this.treedeptId
                newdata['showFlag'] = data[index].showFlag == false ? "0" : '1'
                newdata['outsideFlag'] = this.value == false ? "0" : "1"
                if (this.value == true) {
                    newdata['nextAddr'] = this.newvalue
                } else {
                    newdata['nextAddr'] = this.catalogLevelContent
                }

                let flag = localStorage.getItem('editswiper');
                newdata['carouselType'] = value.carouselType
                if (flag) {
                    newdata['carouselId'] = value.carouselId
                } else {

                }
                // newdata['noticeContent']=this.noticeContent
                arr.push(newdata)
            })
            let flags = localStorage.getItem('editswiper');
            if (flags == 'true') {
                let num = JSON.parse(localStorage.getItem('numberedit'))
                arr[0].carouselId = num.carouselId;
                arr[0].background=this.newcolors;
                arr[0].carouselType=this.carouselType;
                this.$api.confinementRoom.editBatchCarouselInfo(arr).then(res => {
                    if (res.code == 200) {
                        this.$message.success('修改成功')
                        vm.$emit('closeTag', this.$route.path);

                    }
                })
            } else {
                arr[0].background=this.newcolors;
                arr[0].carouselType=this.carouselType;
                this.$api.confinementRoom.addBatchCarouselInfo(arr).then(res => {
                    if (res.code == 200) {
                        this.$message.success('提交成功')
                        vm.$emit('closeTag', this.$route.path);
                    }
                })
            }


        },

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
        this.treedeptId = this.$store.getters.treedepartmentId;
        this.search();
      let flag = localStorage.getItem('editswiper');
      if (flag == 'true') {
        let num = JSON.parse(localStorage.getItem('numberedit'));
        this.catalogLevelContent=num.nextAddr
      }
    },
    data() {
        return {
            categoryNames: "",
            catalogLevelContent:'',
            valueLeft:"100px",
            carouselType:"1",
            selectvalue:'否',
            newcolors:"请点击选择轮播背景颜色",
            colorFlag:false,
            colors:"",
            count: 0,//记录是删除图片还是新增图片
            removelist: [],//记录图片删除的地址
            countFlag: false,
            countFlags: false,
            imgUrl: "",
            weightSorts: "0",
            noticeContent: "",
            editor: '',
            newvalue: "",
            value: false,
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
                    name: "photo", Name: "轮播配置", desc: '建议图片和视频不超过2MB，建议图片尺寸：375*150',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                        ifshow: false,
                        row: "",
                        showFlag: false,
                        mp4Url: "",
                    }],
                    num: 1,
                    des: "只允许上传1张营业执照",
                    width: '375px',
                    height: "142px",
                    left: "170px",
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
::v-deep .vc-chrome{
    position: absolute;
    z-index:100001
}
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
    width: 300px;
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
