<template>
    <div @dragover="dragover">
        <div class="fitment">
            <!-- 装修左侧 -->
            <div class="fitment_left">
                <!-- 装修左侧装饰 -->
                <div class="fitment_left_contain">
                    <div class="aque active" @click="add" ref="aque_first">
                        <img src="" alt="">
                        页面
                    </div>
                    <div class="aque" @click="adddel" ref="aque_two">
                        组件
                    </div>
                </div>
                <!-- 装修左侧点击显示 -->
                <div class="fitment_left_contain_right">
                    <!-- 页面部分 -->
                    <div v-show="!flag">
                        <div class="fitment_left_contain_top">
                            <el-button type="primary" plain size="mini" ref="Html" class="Html">页面</el-button>
                            <el-button type="primary" plain size="mini" class="Html">导航</el-button>
                            <el-button type="primary" plain size="mini" class="Html">固定组件</el-button>
                        </div>
                        <div class="fitment_left_contain_bottom">
                            <div class="stair">一级页面</div>
                            <div class="stair_model">
                                <span>首页</span>
                                <img src="@/assets/images/gear.png" alt="">
                            </div>
                        </div>

                    </div>
                </div>
                <!-- 页面部分 -->

                <!-- 组件部分 -->
                <div v-show="flag" style="width: 100%;">
                    <div class="Left Top">基础组件</div>
                    <div class="basic_module Top" @dragover="dragover">
                        <div class="basic_children" v-for="(item, index) in list" @mouseover="mouseover(index)"
                            :style="{ background: item.back, opacity: item.opacity, color: item.color }"
                            @mouseleave="mouseleave(index)" :ref="item.ref" @dragstart="start($event, index)"
                            @dragend="dragend" draggable="true">
                            <img :src="item.imgUrl" alt="" class="Img">
                            <p class="pHeight">{{ item.name }}</p>
                        </div>
                        <!-- <div class="basic_children"></div>
                       <div class="basic_children"></div> -->
                    </div>
                </div>
                <!-- 组件部分 -->
            </div>
            <!-- 装修中间 -->
            <div class="fitment_middle">
                <!-- 小程序头部 -->
                <div class="fitment_phone">
                    <div class="fitment_phone_top">
                        <span class="left-top">首页</span>
                        <div class="fitment_phone_top_right">
                            <img src="@/assets/images/xcx.png" alt="" class="Left">
                            <span style="color: #999;position: absolute;margin-left: 48px;">|</span>
                            <img src="@/assets/images/quit.png" alt="" class="Left">
                            <!-- <span>兰州时光整形专家团</span>
                            <span>实力见证</span><span>匠心早没</span> -->

                        </div>
                    </div>
                    <!-- 装修部分 -->
                    <div class="fitment_advanced" @dragover="dragovermove">
                        <div v-for="(item, index) in newlist ">
                            <!-- 首页组件 -->
                            <el-tooltip class="item" effect="dark" content="删除" placement="right-end">
                                <div slot="content">
                                    <i class="el-icon-delete" style="font-size: 22px;cursor: pointer;"
                                        @click="newdelte(index)"></i>
                                </div>
                                <div v-show="item.name == 'text'" class="text"
                                    :style="{ border: item.border, overflow: 'hidden' }"
                                    @mouseover="mouseoverTitle($event, index)" data="text" @mousemove="move"
                                    @mouseleave="mouseleaveTitle($event, index)" @dragover="dragoverTitle($event, index)"
                                    @dragstart="dragstartTitle($event, index)" draggable="true" @dragend="end"
                                    @mousedown="swiperchard" @mouseup="up">
                                    <div class="swiperTop" :style="{ top: NewTop + 'px', transition: newtransition }">
                                        <div class="swiperTopchildren" v-for="(item, index) in newlist ">
                                            <img :src="item.imgurl" v-for="(item, index) in listswiper"
                                                v-if="item.imgurl !== ''" class="swiperImg" />
                                        </div>
                                    </div>
                                    <!-- 三角 -->
                                    <div class="triangle">

                                    </div>
                                    <!-- 三角滚动 -->
                                    <div class="quuswiper">
                                        <div class="quuswipers">
                                            <div class="quuswipers_children"
                                                :style="{ top: NewTo + 'px', transition: 'all 0.5s' }">
                                                <!-- 滚动部分 -->
                                                <div class="quuswipers_childrens" v-for="(item, index) in listSwiper"
                                                    @click="Toback(index)"
                                                    :style="{ color: item.index == index ? Black : newBlack, fontSize: pageIndex == index ? item.categorySize + 'px' : '1px', color: item.categoryColor }">
                                                    {{ item.categoryName }}
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                    <!-- 标题部分 -->
                                    <div class="swiperTitle"
                                        :style="{ bottom: newbottom + 'px', transition: newtransitionopen, opacity: newTans, fontSize: FontSizetitle + 'px', color: colorstitle, }">
                                        {{ titleSwiper }}
                                    </div>

                                    <div class="swiperTitlel"
                                        :style="{ bottom: newbottoms + 'px', transition: newtransitionopen, opacity: newTans, fontSize: eFontSize + 'px', color: colorstitlef }">
                                        {{ titleSwiperf }}
                                    </div>
                                    <div class="swiperTitlel"
                                        :style="{ bottom: newbottomf + 'px', transition: newtransitionopen, opacity: newTans, fontSize: eFontSize + 'px', color: colorstitlef }">
                                        {{ titleSwiperfl }}
                                    </div>
                                    <div class="immediately"
                                        :style="{ bottom: newbottoml + 'px', transition: newtransitionopen, opacity: newTans }">
                                        立即探索
                                    </div>

                                    <div class="arrows"
                                        :style="{ bottom: bottomarrows + 'px', transition: newtransitionopen, opacity: newopacity }">
                                        <div>
                                            <i class="el-icon-arrow-down"
                                                :style="{ opacity: down1, transition: newtransitionopen }"></i>
                                            <div style="position: absolute;top:0px">
                                                <i class="el-icon-arrow-down"
                                                    :style="{ opacity: down2, transition: newtransitionopen }"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-tooltip>
                            <!-- 富文本 -->
                            <div v-show="item.name == 'rich'" class="text" :style="{ border: item.border }"
                                @mouseover="mouseoverTitle($event, index)" data="text"
                                @mouseleave="mouseleaveTitle($event, index)" @dragover="dragoverTitle($event, index)"
                                @dragstart="dragstartTitle($event, index)" draggable="true">
                                {{ item.Name }}
                                <el-button type="text" size="mini" @click="newdelte(index)" v-show="item.flag"
                                    style="margin-left: 30px;">
                                    删除
                                </el-button>
                            </div>
                            <!-- 轮播图 -->
                            <div v-show="item.name == 'swiper'" class="text" :style="{ border: item.border }"
                                @mouseover="mouseoverTitle($event, index)" data="text"
                                @mouseleave="mouseleaveTitle($event, index)" @dragover="dragoverTitle($event, index)"
                                @dragstart="dragstartTitle($event, index)" draggable="true">
                                {{ item.Name }}
                                <el-button type="text" size="mini" @click="newdelte(index)" v-show="item.flag"
                                    style="margin-left: 30px;">
                                    删除
                                </el-button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            <!-- 装修右侧 -->
            <div class="fitment_right">
                <!-- <img src="" alt="" class="newimg"> -->

                <div v-if="listType == 1" class="indexset">
                    <el-button type="text" style="position:absolute;right:50px;top:10px" @click="submit">保存</el-button>
                    <div class="indexsetLeft">
                        <div>
                            <span class="Red">*</span> <span>模块名称：首页</span>
                        </div>
                    </div>
                    <div class="Reds">首页设置</div>
                    <!-- 设置类目 -->
                    <div class="Reds" style="max-height:700px;overflow:hidden">
                        <div class="addswiper">
                            <div class="overfloemessage">
                                <div class="addswiper_children" v-for="(item, index) in listswiper" v-if="pageIndex == index">
                                    <div class="leftWire">
                                        <div class="leftWire_eight">
                                            <div style="margin-bottom:5px;margin-top: 10px;"> 文章类目
                                                <span>
                                                    (第{{ index + 1 }}页)
                                                </span>
                                                <el-button type="text" style="color: red;"
                                                    @click="deleteinpuy(item.categoryId, index)">删除</el-button>
                                            </div>
                                            <el-input size="mini" v-model="item.categoryName"
                                                @input="typeinput($event, index)" placeholder="请输入文章类目"></el-input>
                                            <div style="margin-bottom:5px"> 文章标题</div>
                                            <el-input size="mini" v-model="item.mainHeading"
                                                @input="typeinputtitle($event, index)" placeholder="请输入文章标题"></el-input>
                                            <div style="margin-bottom:5px"> 文章目录字体大小</div>
                                            <el-input size="mini" v-model="item.categorySize"
                                                @input="getFontSize($event, index)" placeholder="请输入文章目录大小"></el-input>
                                            <div style="margin-bottom:5px"> 文章标题字体大小</div>
                                            <el-input size="mini" v-model="item.mainSize" @input="FontSizes"
                                                placeholder="请输入文章标题大小"></el-input>
                                            <div style="margin-bottom:5px"> 文章副标题字体大小</div>
                                            <el-input size="mini" v-model="item.subSize" @input="fFontsize"
                                                placeholder="请输入文章副标题大小"></el-input>
                                            <div style="margin-bottom:5px"> 文章目录字体颜色</div>
                                            <div class="bgcolorone" @click="addmlcolor(index)">
                                                {{ item.categoryColor }}
                                                <Chrome v-model="colors" @input="updateValue" v-if="colorFlag"></Chrome>
                                            </div>
                                            <div style="margin-bottom:5px"> 文章标题字体颜色</div>
                                            <div class="bgcolorone" @click="addmlcolortitle(index)">
                                                {{ item.mainColor }}

                                                <Chrome v-model="colorstitle" @input="updateValuetitle"
                                                    v-if="colorFlagtitle">
                                                </Chrome>
                                            </div>

                                            <div style="margin-bottom:5px"> 文章副标题字体颜色</div>
                                            <div class="bgcolorone" @click="addmlcolortitlef(index)">
                                                {{ item.subColor }}

                                                <Chrome v-model="colorstitlef" @input="updateValuetitlef"
                                                    v-if="colorFlagtitlef">
                                                </Chrome>
                                            </div>
                                            <div style="margin-bottom:5px"> 文章副标题</div>
                                            <el-input size="mini" type="textarea" :rows="2" v-model="item.subhead"
                                                @input="typeinputtitlef($event, index)" placeholder="请输入文章副标题"></el-input>

                                            <div style="margin-top: 10px;">
                                                <Upload :limit="1" @successFile="handleSuccess" :successIndex="index"
                                                    @remove="removeIndex" :fileList="item.fileList"></Upload>
                                            </div>
                                            <div style="margin-top: 10px;">
                                                <el-button type="primary" size="mini" ref="Html" class="Html"
                                                    @click="addto(index)">{{ item.categoryId ? '修改文章' : '添加文章'
                                                    }}</el-button>
                                            </div>

                                            <!-- <div style="margin-bottom:5px"><span style="color:red">*</span> 文章类目字体大小</div>
                                        <el-input size="mini" type="textarea"  v-model="item.newtitle"></el-input>
                                        <div style="margin-bottom:5px"><span style="color:red">*</span> 文章类目字体颜色</div>
                                        <el-input size="mini" type="textarea"  v-model="item.newtitle"></el-input> -->
                                        </div>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- 添加按钮 -->
                    <div class="Reds" @click="addindexswiper">
                        <div class="addclass">
                            <i class="el-icon-plus" style="margin-left: 20px;color: blue;"></i>
                            添加
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <sgDialog title="文章详情" size="55%" out-top="2%" :dialog="showDigs" @handleClose="showDigs = false">
            <div slot="out">
                <Wangeditor @catchData="catchData" :content="listcontent"></Wangeditor>
                <div style="height: 50px;">

                </div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" ref="Html" class="Html" @click="ok">确定</el-button>
                        <el-button @click="showDigs = false" size="mini" ref="Html" class="Html">取消</el-button>
                        <!-- <el-button type="primary" size="mini" @click="ok">确定</el-button>
                                        <el-button @click="closeRoomDialogteeth" size="mini">取消</el-button> -->
                    </div>
                </div>

            </div>
        </sgDialog>
    </div>
</template>
<script>
import Upload from '@/components/newUpload';
// const serverPath = process.env.VUE_APP_BASE_API + '/file'
const serverPath = 'http://192.168.1.246:9300'
import { Chrome, Grayscale } from "vue-color";
import sgDialog from '@/components/Dialog/index'
import Wangeditor from '@/components/wangeditor'
import math from 'mathjs';
export default {
    components: {
        Upload,
        Chrome,
        sgDialog,
        Wangeditor,
    },
    data() {
        return {
            fileList: [],
            lastIndex: 0,
            bottomarrows: -60,
            FontSizetitle: 25,
            down1: 1,
            down2: 0,
            newbottom: 50,
            newopacity: 0,
            newbottoms: 10,
            newbottoml: -30,
            pageIndex: 0,
            newtransition: '',
            clintY: 0,
            endpageY: 0,
            NewTop: 0,
            NewTops: 0,
            homeIndex: 0,
            Move: "",
            NewTo: 40,
            titleSwiper: "标题默认显示",
            titleSwiperf: "副标题默认显示",
            startFlag: false,//开始移动
            showDigs: false,//文章显隐
            colorFlagtitlef: false,//副标题颜色显示隐藏
            colorstitlef: '',//副标题色
            colorFlagtitle: false,//标题颜色显示隐藏
            colorstitle: '',//标题色
            colorFlag: false,//控制目录颜色的变量
            colors: '',//目录颜色色值
            back: "",
            color: "",
            flag: false,
            Black: "",//首页左侧滚动选中字体颜色
            newBlack: "",//首页左侧滚动未选中字体颜色
            Font: '',//首页左侧滚动选中字体大小
            newFont: "",//首页左侧滚动未选中字体大小
            successIndex: 0,
            listswiper: [
            ],//添加首页图片标题以及内容
            listSwiper: [{
                categoryName: '默认显示',
                index: 0,
                categoryColor: "",
                categorySize: '',
            }],//首页滚动类目的数组
            listType: '0',//组件类型用于渲染组件
            liststart: false,//判断是否移入已经存在的组件了
            dragendstart: 0,//目标元素内进行拖动索引
            text: '',//拖拽组件取值
            Index: 0,//控制移入目标区域生成多个组件的情况
            dragendIndex: 0,//开始拖拽记录索引
            dragendObjIndex: 0,//移入目标区域记录索引
            newlist: [],//装修数据展示
            Mover: [],//进行比较是否移动
            //组件名称和图片
            list: [
                {
                    name: "首页",
                    imgUrl: 'https://resource.51beauty.com.cn/44325d19-324a-424e-a192-0541caf2d148?imageslim',
                    back: '',
                    opacity: 1,
                    color: "",
                    ref: "title",
                },
                {
                    name: "富文本",
                    imgUrl: 'https://resource.51beauty.com.cn/44325d19-324a-424e-a192-0541caf2d148?imageslim',
                    back: '',
                    opacity: 1,
                    color: "",
                    ref: "rich"
                },
                {
                    name: "轮播广告",
                    imgUrl: 'https://resource.51beauty.com.cn/44325d19-324a-424e-a192-0541caf2d148?imageslim',
                    back: '',
                    opacity: 1,
                    color: "",
                    ref: "swiper"
                }
            ],
            timestart: "",//动画开始
            newTans: '0',//标题透明度
            timeend: "",//箭头显示隐藏
            flagend: true,
            FontSize: "",//目录字体大小设置,
            eFontSize: 16,//副标题字体大小
            newtransitionopen: 'all 1s',
            Putflag: false,
            Index: 0,
            listcontent: "",
            newbottomf: 0,
            titleSwiperfl: '',//副标题二级

        }
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
    mounted() {
        // this.showDigs = true;
        this.deptId = this.$store.getters.departmentId
    },

    methods: {
        Toback() {

        },
        deleteinpuy(e, index) {
            let that = this;
            if (this.listswiper.length == 1) {
                this.$message.error('至少保留一项')
                return
            }
            if (!e) {
                this.swiperdel()
            } else {
                this.$api.confinementRoom.deptCategorydelete(e).then(res => {
                    if (res.code == 200) {
                        this.swiperdel(index)
                    }
                })
            }

        },
        //删除滑动

        swiperdel(index) {
            let that = this
            this.listSwiper.splice(index, 1)
            this.listswiper.splice(index, 1)
            that.NewTop = that.NewTops + 600
            that.NewTops = that.NewTop
            that.newtransition = 'all 1s'
            that.clearanima();
            that.NewTo = that.NewTo + 40;
            that.getswiper();
            let a = Math.abs(that.NewTops / 600)
            this.getTitlemust(Number(a))
            this.$message.success('删除成功');
        },
        submit() {
            this.listswiper.forEach(value => {
                value.deptId = this.deptId
            })
            let addarr = [];
            let editarr = [];
            if (!this.Putflag) {
                this.$api.confinementRoom.deptCategory(this.listswiper).then(res => {
                    if (res.code == 200) {
                        this.$message.success('提交成功');
                    }
                })
            } else {
                this.listswiper.forEach(value => {
                    if (value.categoryId) {
                        editarr.push(value)
                    } else {
                        addarr.push(value)
                    }
                })
                this.$api.confinementRoom.deptCategoryedit(editarr).then(res => {
                    if (res.code == 200) {
                        this.$message.success('修改成功');
                    }
                })
                if (addarr.length !== 0) {
                    this.$api.confinementRoom.deptCategory(addarr).then(res => {
                        if (res.code == 200) {

                        }
                    })
                }

            }


        },
        deptCategorylist() {
            this.$api.confinementRoom.deptCategorylist({
                deptId: this.deptId
            }).then(res => {
                if (res.rows.length == 0) {

                    this.Putflag = false;
                    this.listswiper.push({
                        categoryName: '',
                        categorySize: "",
                        categoryColor: "",
                        mainHeading: "",
                        mainSize: "",
                        mainColor: "",
                        subhead: "",
                        subSize: "",
                        subColor: "",
                        photo: "",
                        description: "",
                    })
                } else {
                    this.Putflag = true;
                    res.rows.forEach((value, index) => {
                        value.fileList = [{
                            name: '展示图片',
                            url: serverPath + value.photo
                        }]
                        value.imgurl = serverPath + value.photo
                        value.index = index
                    })
                    this.listswiper = res.rows;
                    this.listSwiper = this.deepClone(this.listswiper);
                    this.colors = this.listswiper[0].categoryColor
                    this.colorstitle = this.listswiper[0].mainColor
                    this.colorstitlef = this.listswiper[0].subColor
                    this.titleSwiper = this.listswiper[0].mainHeading
                    if (this.listswiper[0].subhead !== '') {
                        let html = this.listswiper[0].subhead;
                        let newhtml = html.split('/n')
                        this.titleSwiperf = newhtml[0];
                        this.titleSwiperfl = newhtml[1]

                    } else {
                        this.titleSwiperf = this.listswiper[0].subhead;
                    }
                }
                this.getswiper()
            })
        },
        fFontsize(e) {
            this.eFontSize = e;
        },
        //标题文字大小
        FontSizes(e) {
            this.FontSizetitle = e;
        },
        //监听目录字体大小
        getFontSize(e, index) {
            this.listSwiper[index].categorySize = e;
        },
        getswiper() {
            let that = this;
            that.newTans = '0';
            that.newopacity = '0';
            that.newtransitionopen = '';
            that.newbottom = 50,
                that.newbottoms = 15;
            if (this.listswiper[this.pageIndex].subhead == '') {
                that.newbottoml = 0;
                that.bottomarrows = -30;
            } else {
                that.newbottoml = -50;
                that.bottomarrows = -80;
            }
            that.newbottomf = -10;

            clearInterval(this.timestart);
            clearInterval(this.timeend);
            this.timestart = setInterval(function () {
                that.newtransitionopen = 'all 1s';
                that.newbottom += 1;
                that.newbottoms += 1;
                that.newbottomf += 1;
                that.newbottoml += 1;
                that.bottomarrows += 1;
                if (that.newbottom == 200) {
                    that.newTans = '1';
                    that.newopacity = '1';
                    that.timeend = setInterval(function () {
                        that.flagend = !that.flagend;
                        if (that.flagend) {
                            that.down1 = 1;
                            that.down2 = 0;
                        } else {
                            that.down2 = 1;
                            that.down1 = 0;
                        }
                    }, 1000)
                    clearInterval(that.timestart)
                }
            }, 1)
        },
        end() {
            let that = this;
            that.newtransitionopen = ''
            that.newTans = '0'
            that.newtransition = 'all 1s'
            this.startFlag = false;
            if (this.endpageY > 0) {
                this.pageIndex++
                if (this.pageIndex >= this.listswiper.length) {
                    this.pageIndex = this.listswiper.length - 1
                }
                setTimeout(function () {
                    that.NewTop = that.NewTops - 600
                    that.NewTops = that.NewTop
                    that.clearanima();
                    that.NewTo = that.NewTo - 40;
                    that.getswiper()
                    that.getTitlemust(that.pageIndex)
                }, 100)
            }
            if (this.endpageY <= 0) {
                this.pageIndex--;

                setTimeout(function () {
                    that.NewTop = that.NewTops + 600;
                    that.NewTops = that.NewTop
                    that.clearanima();
                    that.NewTo = that.NewTo + 40;
                    that.getswiper()
                    that.getTitlemust(that.pageIndex)
                }, 100)

            }

        },
        getTitlemust(index) {
            if (this.listswiper[index].mainHeading == '') {
                this.titleSwiper = '标题默认显示'
            } else {
                this.titleSwiper = this.listswiper[index].mainHeading
            }
            if (this.listswiper[index].subhead == '') {
                this.titleSwiperfl = '';
                if (this.listswiper[index].categoryId) {
                    this.titleSwiperf = ''
                } else {
                    this.titleSwiperf = '副标题默认显示'
                }

            } else {

                let html = this.listswiper[index].subhead
                let newhtml = html.split('\n')
                this.titleSwiperf = newhtml[0];
                this.titleSwiperfl = newhtml[1]
            }
            if (this.listswiper[index].mainColor == '') {
                this.colorstitle = 'black'
            } else {
                this.colorstitle = this.listswiper[index].mainColor
            }
            if (this.listswiper[index].subColor == '') {
                this.colorstitlef = 'black'
            } else {
                this.colorstitlef = this.listswiper[index].subColor
            }
        },
        //清除过度动画
        clearanima() {
            let that = this;
            setTimeout(() => {
                that.newtransition = ''
            }, 500);
        },
        up() {
            this.startFlag = false;
        },
        move(e) {
            if (this.startFlag) {
                if (this.clintY > e.pageY) {
                    this.NewTop = -(this.clintY - e.pageY)
                } else {
                    this.NewTop += (-this.clintY - e.pageY)
                }

            } else {

            }

        },
        swiperchard(e) {
            this.startFlag = true;
            this.clintY = e.pageY;

        },
        //确定富文本内容文本
        ok() {
            this.listswiper[this.Index].description = this.listcontent;
            this.showDigs = false;
            this.listcontent = '';
        },
        //符文本编辑内容文本
        catchData(e) {
            this.listcontent = e;
        },
        //打开添加文章富文本
        addto(index) {
            this.Index = index;
            this.showDigs = true;
            this.listcontent = this.listswiper[index].description;
        },
        //打开副标题颜色版
        addmlcolortitlef(index) {
            this.lastIndex = index;
            this.colorFlagtitlef = true;
        },
        //副标题颜色改变回调
        updateValuetitlef(e, index) {
            this.listswiper[this.lastIndex].subColor = e.hex;
            this.colorstitlef = e.hex
            this.colorFlagtitlef = false;
        },

        //打开标题颜色版
        addmlcolortitle(index) {
            this.lastIndex = index;
            this.colorFlagtitle = true;
        },
        //标题颜色改变回调
        updateValuetitle(e, index) {
            this.listswiper[this.lastIndex].mainColor = e.hex;
            this.colorstitle = e.hex
            this.colorFlagtitle = false;
        },
        //目录字体颜色改变时的方法
        updateValue(e, index) {
            this.listswiper[this.lastIndex].categoryColor = e.hex;
            this.listSwiper[this.lastIndex].categoryColor = e.hex
            this.colorFlag = false;
        },
        //添加目录字体颜色
        addmlcolor(index) {
            this.lastIndex = index;
            this.colorFlag = true;
        },
        removeIndex(e, index) {
            this.listswiper[index].photo = '';
        },
        handleSuccess(e, index) {
            this.listswiper[index].photo = e.url;
        },
        //文章类目监听输入
        typeinput(e, index) {
            this.listSwiper[index].categoryName = e;
        },
        //标题文本的监听
        typeinputtitle(e, index) {
            this.titleSwiper = e;
        },
        //副标题文本的监听
        typeinputtitlef(e, index) {
            if (e.split('\n').length == 2) {
                this.titleSwiperf = e.split('\n')[0];
                this.titleSwiperfl = e.split('\n')[1];
            } else {
                this.titleSwiperf = e;
            }

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
        addindexswiper() {
            let that = this;
            this.listswiper.push({
                categoryName: '',
                categorySize: "",
                categoryColor: "",
                mainHeading: "",
                mainSize: "",
                mainColor: "",
                subhead: "",
                subSize: "",
                subColor: "",
                photo: "",
                description: "",
            })
            this.listSwiper.push({
                categoryName: '默认显示',
                categoryColor: "",
            })
            setTimeout(() => {
                if (parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height) > 500) {
                    document.querySelector('.addswiper').scrollTop = parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height)
                }
                that.NewTop = that.NewTops - 600
                that.NewTops = that.NewTop
                that.newtransition = 'all 1s'
                that.clearanima();
                that.NewTo = that.NewTo - 40;
                that.getswiper()
                that.titleSwiper = '标题默认显示'
                that.titleSwiperf = '副标题默认显示'
                that.colorstitle = 'black'
                that.colorstitlef = 'black';
                that.pageIndex++
            }, 200)

        },
        newdelte(index) {
            this.newlist.splice(index, 1);
            this.$message.success('删除成功')
        },
        dragend() {
            //清空所有配置条件
            // this.Index = 0;
            this.newlist.forEach(value => {
                value.border = '1px dashed transparent'
            })
        },
        //在目标元素内进行拖动事件
        dragstartTitle($event, index) {
            this.dragendstart = index;
        },
        //标题移入事件
        dragoverTitle(e, index) {
            //阻止默认事件，改变鼠标样式
            // e.preventDefault();
            this.endpageY = this.clintY - e.pageY;
            if (this.startFlag) {
                if (this.clintY > e.pageY) {

                    this.NewTop = this.NewTops - this.endpageY
                } else {
                    this.NewTop = this.NewTops + (-this.endpageY)
                }

            }
            // if (this.Mover.length > 1) {
            //     if (this.Mover[this.Mover.length - 1] == e.pageY) {

            //     } else {
            //         if (this.startFlag) {
            //             if (this.clintY > e.pageY) {

            //                 this.NewTop = this.NewTops - (this.clintY - e.pageY);
            //             } else {
            //                 this.NewTop = this.NewTops + (-(this.clintY - e.pageY))
            //             }

            //         }
            //     }
            // }
            // this.Mover.push(e.pageY)
            // console.log('移入组建了')
            if (this.dragendstart !== index) {
                let end = this.newlist.splice(index, 1);
                this.newlist.splice(this.dragendstart, 0, end[0]);
                this.dragendstart = index;
            }
            e.dataTransfer.dropEffect = 'move';
            this.liststart = true
            //数据只有一条,不需要创建组件;
        },
        //标题移入样式设置
        mouseoverTitle(e, index) {
            e.stopPropagation();
            this.newlist.forEach(value => {
                value.border = '1px dashed transparent',
                    value.flag = false;
            })
            this.newlist[index].border = '1px dashed #409eff';
            this.newlist[index].flag = true;
        },
        //标题移出样式设置
        mouseleaveTitle(e, index) {
            e.stopPropagation();
            this.newlist.forEach(value => {
                value.border = '1px dashed transparent'
                value.flag = false
            })
        },
        async dragovermove(e) {
            // if(this.liststart){
            //     return
            // }
            let that = this;
            this.Index++;
            if (this.Index <= 1) {
                if (this.newlist.length == 0) {
                    if (this.text == '首页') {
                        this.listType = '1'
                        this.newlist.push({
                            name: "text",
                            Name: "首页",
                            border: '1px dashed #409eff',
                            flag: false,
                        })
                    }
                    await this.deptCategorylist();
                    this.listType = '1'
                    // console.log('没有数据开始插入组件了');
                } else {
                    //有数据的处理逻辑了
                    // console.log('有数据的插入逻辑');
                    if (this.text == '首页') {
                        this.newlist.push({
                            name: "text",
                            Name: "首页",
                            border: '1px dashed #409eff',
                            flag: false,
                        })
                    }
                    else if (this.text == '富文本') {
                        this.newlist.push({
                            name: "rich",
                            Name: "富文本",
                            border: '1px dashed transparent',
                            flag: false,
                        })
                    }
                    else {
                        this.newlist.push({
                            name: "swiper",
                            Name: "轮播图",
                            border: '1px dashed transparent',
                            flag: false,
                        })
                    }

                }
            } else {
                //   if(this.dranenterIndexPageY-e.pageY>0){
                //     console.log("向上移动")
                //   }else{
                //     console.log("向下移动")
                //   }
                // console.log(e,'大于1的数据')
            }

        },
        dragover(event) {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
        },
        start(event, index) {
            this.Index = 0;
            this.dragendIndex = index
            this.text = event.target.innerText;
        },
        mouseover(index) {
            this.list[index].back = '#409eff';
            this.list[index].imgUrl = 'https://resource.51beauty.com.cn/8832d020-0327-41cf-8f09-6627d46a11f0?imageslim';
            this.list[index].color = '#fff'
        },
        mouseleave(index) {
            this.list[index].back = '';
            this.list[index].imgUrl = 'https://resource.51beauty.com.cn/44325d19-324a-424e-a192-0541caf2d148?imageslim';
            this.list[index].color = ''
        },
        add() {
            this.$refs.aque_first.classList.add('active');
            this.$refs.aque_two.classList.remove('active');
            this.flag = false;
        },
        adddel() {
            this.$refs.aque_two.classList.add('active')
            this.$refs.aque_first.classList.remove('active');
            this.flag = true;
        },
        Start() {

        },
        enter(e) {
            console.log(e, 'jaja1')
        },
        draggle(e) {
            console.log(e, 'jaja')
        }
    }
}
</script>
<style scoped lang="scss">
.arrows {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 50px;
    position: absolute;
}

.immediately {
    width: 70px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: black;
    position: absolute;
    margin-left: 152.5px;
    background-color: #fff;
}

.swiperTitlel {
    width: 100%;
    height: 30px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;

}

.swiperTitle {
    width: 100%;
    height: 30px;
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
}

.swiperTopchildren {
    width: 100%;
    height: 600px;
}

.swiperTop {
    width: 100%;
    min-height: 600px;
    position: absolute;
}

::v-deep .vc-chrome {
    position: absolute;
    z-index: 1000;
}

.REd {
    color: red;
}

.bgcolorone {
    width: 200px;
    border: 1px solid #eee;
    background-color: #fff;
    height: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding-left: 10px;
}

.swiperImg {
    width: 370px;
    height: 600px;
    vertical-align: top;
}

.leftWire_eight {
    margin-left: 10px;
}

.leftWire {
    display: flex;
}

.addswiper {
    max-height: 680px;
    overflow-y: scroll;
}

.addclass {
    width: 95%;
    height: 30px;
    border: 1px solid #2b75ed;
    display: flex;
    align-items: center;
    color: #2b75ed;
    justify-content: center;
    cursor: pointer;
}

.Reds {
    margin-left: 20px;
    margin-top: 10px;
}

.Red {
    color: red;
    margin-left: 10px;
}

.indexsetLeft {}

.indexset {
    width: 100%;
    height: 700px;
    border: 1px solid #eee;
}

::v-deep .el-tooltip {
    cursor: pointer !important;
}

.quuswipers_childrens {
    height: 40px;
    padding-left: 5px !important;
}

.quuswipers_children {
    width: 100px;
    position: absolute;
    min-height: 120px;

}

.quuswipers {
    width: 100px;
    height: 120px;
}

.quuswiper {
    width: 100px;
    height: 120px;
    position: absolute;
    top: 155px;
    left: 15px;
    overflow: hidden;
}

.triangle {
    position: absolute;
    width: 0px;
    height: 0px;
    border-left: 15px solid transparent;
    border-top: 15px solid transparent;
    border-right: 15px solid #F0F0F0;
    border-bottom: 15px solid transparent;
    transform: rotate(-180deg);
    top: 200px;
    left: 0;
    z-index: 1000;
}

.Html {
    padding: 5px;
    width: 65px;
    line-height: 15px;
}

.text {
    height: 600px;
    line-height: 40px;
    width: 373px;
    border: 1px dashed transparent;
    // text-align: center;
    position: relative;

}

* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

.newimg {}

.Img {
    width: 24px;
    height: 24px;
    margin-top: 13px;
    margin-left: 25px;
    z-index: -1000;
    pointer-events: none;

}

.pHeight {
    width: 100%;
    text-align: center;
    pointer-events: none;

}

.basic_children {
    width: 75px;
    height: 75px;
    border: 1px solid #eee;
    cursor: pointer;
}

.basic_module {
    width: 100%;
    height: 80px;
    border: 1px solid black;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.Left {
    margin-left: 11.5px;
}

.Top {
    margin-top: 10px;
}

.fitment_advanced {
    width: 100%;
    height: 600px;
    background-color: #ffff;
    overflow-y: scroll;
}

.fitment_phone_top_right {
    width: 85px;
    height: 30px;
    border: 1px solid #999;
    border-radius: 15px;
    background-color: #fff;
    display: flex;
    align-items: center;
    position: absolute;
    right: 20px;
}

.fitment_phone_top {
    width: 100%;
    height: 50px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1px solid #eee;
}

.fitment_phone {
    width: 375px;
    height: 650px;
    border: 1px solid #eee;
    margin: 0 auto;
    margin-top: 50px;
}

* {
    box-sizing: border-box;
    font-size: 14px;
    font-family: PingFang SC, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Source Han Sans, Noto Sans CJK Sc, Microsoft YaHei, Microsoft Jhenghei, sans-serif;
}

.stair {
    height: 40px;
    padding-left: 16px;
    line-height: 40px;
}

.fitment_left_contain_bottom {
    width: 300px;
    height: 600px;
    border: 1px solid black;
    margin-left: 10px;
    margin-top: 10px;

}

.fitment_left_contain_top {
    margin-top: 20px;
    margin-left: 30px;
}

.fitment_left_contain_right {}

.fitment {
    width: 100%;
    position: fixed;
    height: 100%;
    // border: 1px solid black;
    display: flex;
    align-items: center;
}

.fitment_left {
    width: 400px;
    height: 100%;
    // border: 1px solid red;
    display: flex;
}

.fitment_left_contain {
    width: 70px;
    height: 100%;
    background-color: #1a1c21;
    margin-left: 10px;
}

.stair_model {
    width: 255px;
    height: 42px;
    border: 1px solid #eee;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    justify-content: space-between;
}

.aque {
    width: 100%;
    height: 50px;
    color: #8e9499;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
}

.active {
    background-color: #fff;
    color: #4573fb;
}

// .aque:nth-of-type(1){
//     background-color: #fff;
// }
.fitment_middle {
    width: calc(100% - 800px);
    height: 100%;
    // border: 1px solid red;
}

.fitment_right {
    width: 400px;
    height: 100%;
    // border: 1px solid red;
}
</style>