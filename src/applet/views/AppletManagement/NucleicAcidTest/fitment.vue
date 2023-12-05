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
                                <span>名片</span>
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
                        <span class="left-top">名片</span>
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
                            <!-- 标题组件 -->
                            <div v-show="item.name == 'text'" class="text" :style="{ border: item.border }"
                                @mouseover="mouseoverTitle($event, index)" data="text"
                                @mouseleave="mouseleaveTitle($event, index)" @dragover="dragoverTitle($event, index)" @dragstart="dragstartTitle($event,index)" draggable="true">
                                {{ item.Name }}
                                <el-button type="text" size="mini" @click="newdelte(index)" v-show="item.flag" style="margin-left: 40px;">
                                      删除
                                </el-button>
                            </div>
                            <!-- 富文本 -->
                            <div v-show="item.name == 'rich'" class="text" :style="{ border: item.border }"
                                @mouseover="mouseoverTitle($event,index)" data="text" @mouseleave="mouseleaveTitle($event,index)"
                                @dragover="dragoverTitle($event,index)" @dragstart="dragstartTitle($event,index)" draggable="true">
                                {{ item.Name }}
                                <el-button type="text" size="mini" @click="newdelte(index)" v-show="item.flag" style="margin-left: 30px;">
                                      删除
                                </el-button>
                            </div>
                            <!-- 轮播图 -->
                            <div v-show="item.name == 'swiper'" class="text" :style="{ border: item.border }"
                                @mouseover="mouseoverTitle($event,index)" data="text" @mouseleave="mouseleaveTitle($event,index)"
                                @dragover="dragoverTitle($event,index)" @dragstart="dragstartTitle($event,index)" draggable="true">
                                {{ item.Name }}
                                <el-button type="text" size="mini" @click="newdelte(index)" v-show="item.flag" style="margin-left: 30px;">
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
            </div>

        </div>
    </div>
</template>
<script>
import { index } from 'mathjs'

export default {
    data() {
        return {
            back: "",
            color: "",
            flag: false,
            liststart:false,//判断是否移入已经存在的组件了
            dragendstart:0,//目标元素内进行拖动索引
            text: '',//拖拽组件取值
            Index: 0,//控制移入目标区域生成多个组件的情况
            dragendIndex: 0,//开始拖拽记录索引
            dragendObjIndex: 0,//移入目标区域记录索引
            newlist: [],//装修数据展示
            //组件名称和图片
            list: [
                {
                    name: "标题",
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
            ]
        }
    },
    mounted() {
        document.onselectstart = function () {
            return false
        }
    },
    methods: {
        newdelte(index){
          this.newlist.splice(index,1)
        },
        dragend() {
            //清空所有配置条件
            // this.Index = 0;
            this.newlist.forEach(value => {
                value.border = '1px dashed transparent'
            })
        },
        //在目标元素内进行拖动事件
        dragstartTitle($event,index){
            this.dragendstart=index;
        },
        //标题移入事件
        dragoverTitle(e, index) {
            //阻止默认事件，改变鼠标样式
            e.preventDefault();
            console.log('移入组建了')
            if(this.dragendstart!==index){
                let end =this.newlist.splice(index,1);
                this.newlist.splice(this.dragendstart,0,end[0]);
                this.dragendstart=index;
            }
            e.dataTransfer.dropEffect = 'move';
            this.liststart=true
            //数据只有一条,不需要创建组件;
        },
        //标题移入样式设置
        mouseoverTitle(e, index) {
            e.stopPropagation();
            this.newlist.forEach(value => {
                value.border = '1px dashed transparent',
                value.flag=false;
            })
            this.newlist[index].border = '1px dashed red';
            this.newlist[index].flag=true;
        },
        //标题移出样式设置
        mouseleaveTitle(e, index) {
            e.stopPropagation();
            this.newlist.forEach(value => {
                value.border = '1px dashed transparent'
                value.flag=false
            })
        },
        dragovermove(e) {
        // if(this.liststart){
        //     return
        // }
            this.Index++;
            if (this.Index <= 1) {
                if (this.newlist.length == 0) {
                    if (this.text == '标题') {
                        this.newlist.push({
                            name: "text",
                            Name: "标题",
                            border: '1px dashed red',
                            flag:false,
                        })
                    }
                    // console.log('没有数据开始插入组件了');
                } else {
                    //有数据的处理逻辑了
                    // console.log('有数据的插入逻辑');
                    if (this.text == '标题') {
                        this.newlist.push({
                            name: "text",
                            Name: "标题",
                            border: '1px dashed red',
                            flag:false,
                        })
                    }
                    else if (this.text == '富文本') {
                        this.newlist.push({
                            name: "rich",
                            Name: "富文本",
                            border: '1px dashed transparent',
                            flag:false,
                        })
                    }
                    else {
                        this.newlist.push({
                            name: "swiper",
                            Name: "轮播图",
                            border: '1px dashed transparent',
                            flag:false,
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
.Html {
    padding: 5px;
    width: 65px;
    line-height: 15px;
}

.text {
    height: 40px;
    line-height: 40px;
    width: 373px;
    border: 1px dashed transparent;
    text-align: center;
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
    border: 1px solid black;
    display: flex;
    align-items: center;
}

.fitment_left {
    width: 400px;
    height: 100%;
    border: 1px solid red;
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
    border: 1px solid red;
}

.fitment_right {
    width: 400px;
    height: 100%;
    border: 1px solid red;
}</style>