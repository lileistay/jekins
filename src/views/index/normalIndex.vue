<template>
    <div class="Parent">
        <div class="children" v-if="menuNavflag" :style="{ marginLeft: leftPaeent + 'px', marginTop: '150px' }">
            <!-- <div style="width: 20px;height: 10px;background-color:#71c2fe;position: absolute;z-index: 10000000;left:0;bottom: 3px;border-radius: 100%;"></div> -->
            <div class="chidrens" :style="{ left: leftMove + 'px', width: Widthparent }" @mousedown="Down" @mouseup="Up"
                @mousemove="Move" @dragend="End">
                <div class="children_s" v-for="(item, index) in list" @mouseenter="Enter(item, index)"
                    @mouseleave="Leave(item, index)">

                    <div class="childrenMap"
                        :style="{ transform: item.transform, height: item.height, marginTop: item.top, width: item.width, marginLeft: item.left, marginRight: item.right, background: item.Color, zIndex: item.zIndex }"
                        @click="naVitorTo(item, index)">
                        {{ item.meta.title }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else
            :style="{ marginLeft: leftPaeent + 'px', marginTop: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '850px' }"
            class="children">
            <div class="childrenMap"
                style="width: 170px;height: 170px;display: flex;align-items: center;justify-content: center;box-shadow: none;"
                v-for="(item, index) in list">
                <div :style="{ width: item.width, height: item.height, background: item.Color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold', transition: 'all 1s' }"
                    @mouseenter="childrenEnter(item, index)" @mouseleave="childrenLeave(item, index)"
                    @click="childrenTo(item, index)">
                    {{ item.meta.title }}
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import { re } from 'mathjs';
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['sidebarRouters']),
    },
    created() {
        let W = window.innerWidth || document.documentElement.clientWiinnerWidth
            || document.body.clientWiinnerWidth;
        this.leftPaeent = (W - 960) / 2
        let menuNav = [];
        if (this.sidebarRouters[0].path == '/customerInfo') {
            this.sidebarRouters.shift();
        }
        this.sidebarRouters.forEach(value => {
            if (value.meta.title !== '首页') {
                menuNav.push(value)
            }
        })
        if (menuNav.length >= 6) {
            this.menuNavflag = true
            menuNav.forEach((value, index) => {
                value.Color = this.Color[index]
                value.transform = '';
                value.height = '';
                if (index == 0) {
                    value.transform = 'rotateY(10deg)'
                }
                else if (index == 1) {
                    value.height = '137px';
                    value.transform = 'rotateY(4deg)'
                    value.min = true;
                }
                else if (index == 2) {
                    value.height = '130px';
                    value.transform = 'rotateY(3deg)'
                    value.mixsecond = true
                }
                else if (index == 3) {
                    value.height = '130px';
                    value.transform = 'rotateY(-3deg)'
                    value.mixthrid = true;
                }
                else if (index == 4) {
                    value.height = '134px';
                    value.transform = 'rotateY(-4deg)'
                    value.min = false;
                }
                else {
                    if (index == 5) {
                        value.transform = 'rotateY(-10deg)'
                    } else {
                        value.height = '138px';
                    }
                }
            })
            this.list = menuNav
            this.Left = -(this.list.length - 6) * 160;
            this.Widthparent = this.list.length * 160 + 'px'

        } else {
            this.menuNavflag = false
            this.list = menuNav;
            this.list.forEach((value, index) => {
                value.width = '150px';
                value.height = '150px';
                value.Color = this.Color[index]
            })

        }
    },
    mounted() {
        // document.oncontextmenu = new Function("event.returnValue=false");
        // document.onselectstart = new Function("event.returnValue=false");
    },
    data() {
        return {
            deg: 0,
            degImg: 0,
            Index: 0,
            Widthparent: '',
            leftPaeent: "",
            seltrue: false,
            menuNavflag: false,
            Top: 0,
            Left: 0,
            flag: false,
            leftPage: 0,
            leftMove: 0,
            Color: ['#71c2fe', '#fdd676', '#78edd8', '#f3b18f', '#8e83ed', '#7ccdfe', '#71c2fe', '#fdd676', '#78edd8', '#f3b18f', '#8e83ed', '#7ccdfe',],
            list: [],
        }
    },
    methods: {
        //菜单太少跳转
        childrenTo(item, index) {
            this.$router.push('/' + item.path)
            this.$set(this.list, index, {
                width: '150px',
                height: '150px',
                Color: item.Color,
                meta: {
                    title: item.meta.title
                },
                path: item.path
            })
        },
        //菜单太少缩小
        childrenLeave(item, index) {
            this.$set(this.list, index, {
                width: '150px',
                height: '150px',
                Color: item.Color,
                meta: {
                    title: item.meta.title
                },
                path: item.path
            })
        },
        //菜单太少放大
        childrenEnter(item, index) {
            this.$set(this.list, index, {
                width: '170px',
                height: '170px',
                Color: item.Color,
                meta: {
                    title: item.meta.title
                },
                path: item.path
            })
        },
        //跳转路由
        naVitorTo(item, index) {
            this.$router.push('/' + item.path);
            if (item.transform == undefined) {
                this.$set(this.list, index, {
                    height: '140px',
                    width: "150px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path

                })
            }
        },
        //移出缩小
        Leave(item, index) {
            if (item.transform == 'rotateY(-10deg)') {
                return
            }
            if (item.min) {
                this.$set(this.list, index, {
                    height: '137px',
                    width: "150px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path,
                    zIndex: 0,
                    transform: 'rotateY(4deg)',
                    min: true

                })
            }
            if (item.min == false) {
                this.$set(this.list, index, {
                    height: '136px',
                    width: "150px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path,
                    zIndex: 0,
                    transform: 'rotateY(-4deg)',
                    min: false

                })
            }
            if (item.mixsecond) {
                this.$set(this.list, index, {
                    height: '134px',
                    width: "150px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path,
                    zIndex: 0,
                    transform: 'rotateY(2deg)',
                    mixsecond: true,

                })
            }
            if (item.mixthrid) {
                this.$set(this.list, index, {
                    height: '132px',
                    width: "150px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path,
                    zIndex: 0,
                    transform: 'rotateY(-2deg)',
                    mixthrid: true,

                })
            }

        },
        //移入放大
        Enter(item, index) {

            this.Index = index;
            if (item.transform == 'rotateY(-10deg)') {
                return
            }
            if (item.min) {

                this.$set(this.list, index, {
                    height: '173px',
                    width: "173px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path,
                    zIndex: 10000000,
                    transform: "",
                    min: true,
                    left: '-6.5px',
                })
            }
            if (item.min == false) {
                this.$set(this.list, index, {
                    height: '176px',
                    width: "176px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path,
                    zIndex: 10000000,
                    transform: "",
                    min: false,
                    left: '6.5px',
                })
            }
            if (item.mixsecond) {
                this.$set(this.list, index, {
                    height: '172px',
                    width: "172px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path,
                    zIndex: 10000000,
                    transform: "",
                    mixsecond: true,
                })
            }
            if (item.mixthrid) {
                this.$set(this.list, index, {
                    height: '173px',
                    width: "173px",
                    Color: item.Color,
                    meta: {
                        title: item.meta.title,
                    },
                    path: item.path,
                    zIndex: 10000000,
                    transform: "",
                    mixthrid: true,
                })
            }


        },
        End(e) {
            this.flag = false;
            this.parentMove(e.clientX)
        },
        //鼠标按下事件
        Down(e) {
            this.flag = true;
            this.Start = e.clientX;

        },
        //鼠标弹起事件
        Up(e) {
            this.flag = false;
            this.parentMove(e.clientX)
        },
        //鼠标移动事件
        Move(e) {

            if (this.flag) {
                this.list[this.Index].width = '150px';
                this.list[this.Index].height = '140px';
                this.seltrue = true;
                if (this.Start - e.clientX > 30) {

                }
            }

        },
        //父盒子移动判断方法
        parentMove(px) {
            if (this.Start - px > 50) {
                if (this.Left == this.leftMove) {
                    this.$message.warning('没有更多菜单了，请配置')
                    return
                }
                this.leftPage++
                this.leftMove -= 160
                this.list.forEach(value => {
                    value.transform = '';
                    value.height = '140px';
                })

            }
            if (this.Start - px < -50) {
                if (this.leftPage == 0) {
                    this.$message.warning('已经在第一个菜单了')
                    return
                }
                this.leftPage--;
                this.list.forEach(value => {
                    value.transform = '';
                    value.height = '140px'
                })
                this.leftMove += 160
            }
            this.list[this.leftPage].transform = 'rotateY(10deg)'
            this.list[this.leftPage].height = '150px'
            this.list[this.leftPage].top = '';
            delete this.list[this.leftPage].min;
            delete this.list[this.leftPage + 3].min
            delete this.list[this.leftPage + 1].mixsecond;
            delete this.list[this.leftPage + 2].mixthrid;
            this.list[this.leftPage + 1].transform = 'rotateY(4deg)'
            this.list[this.leftPage + 1].height = '136px'
            this.list[this.leftPage + 1].min = true
            this.list[this.leftPage + 1].width = '150px'
            this.list[this.leftPage + 2].transform = 'rotateY(2deg)'
            this.list[this.leftPage + 2].height = '132px'
            this.list[this.leftPage + 2].mixsecond = true
            this.list[this.leftPage + 3].transform = 'rotateY(-2deg)'
            this.list[this.leftPage + 3].height = '132px'
            this.list[this.leftPage + 3].mixthrid = true
            this.list[this.leftPage + 4].transform = 'rotateY(-4deg)'
            this.list[this.leftPage + 4].height = '136px'
            this.list[this.leftPage + 4].min = false
            this.list[this.leftPage + 5].transform = 'rotateY(-10deg)'
            this.list[this.leftPage + 5].height = '150px'
            this.list[this.leftPage + 5].top = ''


        },
    },
}
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

}


.childrenMap {
    width: 150px;
    height: 150px;
    transform-style: preserve-3d;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0px 5px 5px #ccc;
    position: absolute;
}

.children_s {
    width: 160px;
    height: 160px;
    perspective: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.chidrens {
    position: absolute;
    width: 1120px;
    height: 170px;
    transition: all 1s;
    display: flex;

}

.Parent {
    overflow: hidden;
    display: flex;
    width: 100%;
    height: 100%;
}

.children {
    display: flex;
    position: relative;
    width: 960px;
    height: 170px;
    overflow: hidden;
}
</style>