<template>
    <div>
        <div style="position: absolute;bottom: 10px;width: 300px;height: auto;right: 0;" class="left_contain">
            <div class="chat">
                <div class="chat_children" v-for="(item, index) in messageList" @mouseover="onover($event, index)"
                    @mouseleave="onleave($event, index)" :data_index="index">
                    <div class="chat_success">
                        <img src="@/assets/images/success.png" alt="" style="margin-left: 10px;">
                        <span class="tz">您有新的顾客已到院</span>
                        <img src="@/assets/images/close.png" alt="" style="margin-left: 70px;" @click="close(index)">
                    </div>
                    <div class="chat_contain">
                        <p style="display: flex;align-items: center;">{{ item.message[2].split(':')[0] }}： <span ref="money"
                                style="margin-top: 3px;"></span></p>
                        <p>{{ item.message[3] }}</p>
                        <p>{{ item.message[4] }}</p>
                        <p>{{ item.message[5] }}</p>
                        <p>{{ item.message[6] }}</p>
                        <p>{{ item.message[7] }}</p>
                    </div>
                </div>
            </div>

        </div>
        <audio id="fail" preload hidden>
            <source src="@/assets/iphone.mp3" type="audio/ogg">
            <source src="@/assets/iphone.mp3" type="audio/mpeg">
        </audio>
    </div>
</template>
<script>
//    const modulesFiles = require.context('@/assets', true, /\.mp3$/);
//    console.log(modulesFiles,'哈哈哈')
import { getrandom } from '@/utils/randomNumber';
import { thisQuarter } from '../utils/time';
export default {
    data() {
        return {
            messageList: [],
            Index: -1,
            newjump: "",
            vanish: "",
            timer: "",
            count: 0,
            newcount: -1,
        }
    },
    methods: {

        member(h) {
            let that = this;
            that.newcount++
            setTimeout(() => {
                if (h < 4000 * 2 && h >= 1000 * 2) {
                    let xx = Math.floor(h / (1000 * 2)) //显示星星数量
                    for (let i = 0; i < xx; i++) {
                        let span = document.createElement('img');
                        span.src = require('@/assets/images/start.png')
                        that.$refs.money[that.newcount].appendChild(span)

                    }
                }
                if (h >= 4000 * 2 && h < 16000 * 2) {
                    //要显示几个月亮的逻辑
                    let yueliang = Math.floor(h / (4000 * 2)) //月亮数量
                    let b = h - Math.floor(h / (4000 * 2)) * 4000 * 2
                    let xx = Math.floor(b / (1000 * 2))//显示星星数量
                    for (let i = 0; i < yueliang; i++) {
                        let span = document.createElement('img');
                        span.src = require('@/assets/images/yl.png')
                        that.$refs.money[that.newcount].appendChild(span)

                    }
                    for (let i = 0; i < xx; i++) {
                        let span = document.createElement('img');
                        span.src = require('@/assets/images/start.png')
                        that.$refs.money[that.newcount].appendChild(span)

                    }
                    // alert(yueliang)
                    // alert(xx)
                }
                if (h >= 16000 * 2) {
                    let sun = Math.floor(h / (16000 * 2)) //月亮数量
                    for (let i = 0; i < sun; i++) {
                        let span = document.createElement('img');
                        span.src = require('@/assets/images/sun.png')
                        that.$refs.money.appendChild(span)
                    }
                    let sum = h - sun * 16000 * 2;
                    if (sum < 4000 * 2 && sum >= 1000 * 2) {
                        let xx = Math.floor(sum / (1000 * 2)) //显示星星数量
                        for (let i = 0; i < xx; i++) {
                            let span = document.createElement('img');
                            span.src = require('@/assets/images/start.png')
                            that.$refs.money[that.newcount].appendChild(span)

                        }
                    }

                    if (sum >= 4000 * 2 && sum < 16000 * 2) {
                        //要显示几个月亮的逻辑
                        let yueliang = Math.floor(sum / (4000 * 2)) //月亮数量
                        let b = sum - Math.floor(sum / (4000 * 2)) * (4000 * 2)
                        let xx = Math.floor(b / (1000 * 2))//显示星星数量
                        for (let i = 0; i < yueliang; i++) {
                            let span = document.createElement('img');
                            span.src = require('@/assets/images/yl.png')
                            that.$refs.money[that.newcount].appendChild(span)

                        }
                        for (let i = 0; i < xx; i++) {
                            let span = document.createElement('img');
                            span.src = require('@/assets/images/start.png')
                            that.$refs.money[that.newcount].appendChild(span)

                        }
                    }

                }
                if (h < 1000 * 2) {

                }
            }, 200)

        },
        onover(event, index) {
            this.Index = index;

        },
        onleave(event, index) {
            this.Index = index;
            clearTimeout(this.disappear)
            this.disappear = setTimeout(() => {
                document.querySelectorAll('.chat_children')[index].style.right = '-300px'
                document.querySelectorAll('.chat_children')[index].style.transition = 'all 0.7s';
                setTimeout(() => {
                    let len = document.querySelectorAll('.chat_children');
                    let count = 0
                    for (let i = 0; i < len.length; i++) {

                        if (window.getComputedStyle(len[i]).right == '-300px') {
                            count++
                        }
                    }
                    if (count == this.messageList.length) {
                        this.messageList = []
                    }
                }, 1000)
            }, 3000)

        },
        //连接websocket
        connectLition() {
            let that = this;

            if (localStorage.getItem('isTrue') == 'false') {

            } else {
                // this.ws = new WebSocket(`ws://192.168.0.103:8098`);
                setTimeout(function () {
                    that.id = localStorage.getItem('userId');
                    // this.ws = new WebSocket(`ws://192.168.0.104:8099/service/websocket/${this.id}`);
                    that.ws = new WebSocket(`ws://192.168.111.5:8099/service/websocket/${that.id}`);
                    that.ws.onopen = function () {
                        // console.log(`ws://192.168.0.104:8099/service/websocket/${that.id}|1`, '叩叩叩')
                        // console.log('连接成功')
                    }
                    that.ws.onmessage = function (e) {
                        clearInterval(that.newjump)
                        clearTimeout(that.timer)
                        that.timer = setTimeout(() => {
                                that.newjump = setInterval(function () {
                                    that.ws.send('心跳检测');
                                }, 1000 * 60)
                            }, 10000)
                        if (e.data.includes('来自后台的反馈：连接成功')) {

                        } else if (e.data.includes('onLine')) {
                            let list = e.data.split('|');
                            //说明有上线用户
                            if (list[0].length > 2) {
                                var newlist = eval('(' + list[0] + ')');
                                that.$store.dispatch('online', {
                                    online: newlist
                                })
                            }
                            //说明没有任何上线用户
                            else {
                                that.$store.dispatch('online', {
                                    online: []
                                })
                            }
                        }
                        else if (e.data.includes('face')) {
                            let message=e.data.split('|');
                            // let customMessage=message[1];
                            let customName=message[message.length-2]
                            let customphone=message[message.length-1]
                            that.$confirm(`${customName}已到院，电话号码${customphone},是否直接分诊？`, '提示', {
                                distinguishCancelAndClose: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then((res) => {
                                that.$router.push(
                                    {
                                        path:"/signList",
                                        query:{
                                        phone:customphone
                                    }
                                    })
                            }).catch(res => {

                            })
                        }
                        //说明有自己的顾客上线
                        else if (e.data.includes('up')) {
                            let span = e.data.split('|')
                            that.$store.dispatch('onlineup', {
                                online: {
                                    type: "1",
                                    val: span[0]
                                }
                            })
                            document.querySelector('#fail').play();
                        }
                        //说明有用户下线
                        else if (e.data.includes('dw')) {
                            let span = e.data.split('|')
                            that.$store.dispatch('onlineup', {
                                online: {
                                    type: "2",
                                    val: span[0]
                                }
                            })
                            document.querySelector('#fail').play();
                        }
                        else {
                            clearTimeout(that.vanish);
                            let type = e.data;
                            that.$store.dispatch('setloadmessage', {
                                loadmessage: type
                            })
                            that.$store.dispatch('setloadmessage', {
                                loadmessage: type
                            })
                            let newtype = type.split('/');
                            if (newtype[1].includes('|')) {
                                document.querySelector('#fail').play();
                                let value = newtype[1].split('|')
                                if (that.messageList.length == 0) {
                                    that.messageList.push({
                                        message: value,
                                        Pxs: 10,
                                        star: value[2].split(':')[1],
                                    })
                                    that.member(Number(value[2].split('：')[1]));
                                } else {
                                    that.$set(that.messageList, that.messageList.length, {
                                        message: value,
                                        Pxs: that.messageList[that.messageList.length - 1].Pxs + 160
                                    })

                                    that.member(Number(value[2].split('：')[1]))
                                }

                                if (that.messageList.length == 1) {
                                    setTimeout(() => {
                                        document.querySelector('.chat_children').style.right = '0px'
                                        document.querySelectorAll('.chat_children')[0].style.transition = 'all 0.7s'
                                    }, 50)

                                } else {
                                    for (let men = 0; men < that.messageList.length; men++) {
                                        if (men == that.messageList.length - 1) {
                                            setTimeout(() => {
                                                document.querySelectorAll('.chat_children')[that.messageList.length - 1].style.right = '0px'
                                                document.querySelectorAll('.chat_children')[that.messageList.length - 1].style.transition = 'all 0.7s'
                                            }, 10)

                                        } else {
                                            for (let newmen = 0; newmen < that.splicenew; newmen++) {
                                                document.querySelectorAll('.chat_children')[newmen].style.right = '-300px'
                                            }
                                            document.querySelectorAll('.chat_children')[men].style.right = '0px'
                                            document.querySelectorAll('.chat_children')[men].style.bottom = ((that.messageList.length - 1 - men) * 160 + 10 * (that.messageList.length - 1 - men)) + 'px';
                                        }
                                    }
                                }
                            } else {
                                that.$store.dispatch('homepageReload', { Homepage: getrandom() });
                            }

                            that.vanish = setTimeout(() => {
                                for (let mens = 0; mens < that.messageList.length; mens++) {
                                    if (mens == that.Index) {

                                    }
                                    else {
                                        setTimeout(() => {
                                            document.querySelectorAll('.chat_children')[mens].style.right = '-300px'
                                            document.querySelectorAll('.chat_children')[mens].style.transition = 'all 0.7s';
                                            if (mens == that.messageList.length - 1) {
                                                setTimeout(() => {
                                                    let len = document.querySelectorAll('.chat_children');
                                                    let count = 0
                                                    for (let i = 0; i < len.length; i++) {

                                                        if (window.getComputedStyle(len[i]).right == '-300px') {
                                                            count++
                                                        }
                                                    }
                                                    if (count == that.messageList.length) {
                                                        that.messageList = []
                                                    }
                                                }, 1000)


                                            }
                                        }, 50 + mens * 300)

                                    }

                                }
                            }, 6000)
                        }

                    }
                }, 500)

                //else
            }
        },
        close(index) {
            let that = this;

            if (that.messageList.length == 1) {
                setTimeout(() => {
                    document.querySelectorAll('.chat_children')[0].style.right = '-300px'
                    document.querySelectorAll('.chat_children')[0].style.transition = 'all 0.7s'
                }, 50)
            } else {
                setTimeout(() => {
                    for (let lens = 0; lens < index; lens++) {
                        let Bot = parseInt(window.getComputedStyle(document.querySelectorAll('.chat_children')[lens]).bottom);
                        document.querySelectorAll('.chat_children')[lens].style.bottom = (Bot - 160) + 'px'

                    }
                    document.querySelectorAll('.chat_children')[index].style.right = '-300px';
                    document.querySelectorAll('.chat_children')[index].style.transition = 'all 0.7s';
                    setTimeout(() => {
                        let len = document.querySelectorAll('.chat_children');
                        let count = 0
                        for (let i = 0; i < len.length; i++) {

                            if (window.getComputedStyle(len[i]).right == '-300px') {
                                count++
                            }
                        }
                        if (count == this.messageList.length) {
                            this.messageList = []
                        }
                    }, 1000);

                }, 50)
            }
        }
    },
    created() {
        let that = this;
        this.deptId = this.$store.getters.departmentId;
        this.$nextTick(function () {
            this.connectLition()
        })


    },
    mounted() {

    },
    watch: {
        Loginconnect(newv) {
            this.connectLition();
        }
    },
    computed: {
        Loginconnect: {
            get() {
                return this.$store.getters.Loginconnect
            },
            set(val) {
                val = this.$store.getters.Loginconnect;
            }
        },
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId;
            }
        }

    }
}
</script>

<style scoped>
.chat {
    width: 300px;
    height: auto;
    /* border: 1px solid red; */
    position: relative;

}

.chat_children {
    width: 100%;
    height: 160px;
    position: absolute;
    bottom: 0;
    right: -300px;
    background-color: #d7f3ee;
    border-radius: 8px;
    border: 1px solid #eee;

}

.chat_success {
    width: 100%;
    height: 30px;
    /* border: 1px solid black; */
    display: flex;
    align-items: center;
    background-color: #d7f3ee;

}

.tz {
    font-family: "Lucida Calligraphy", cursive, serif, sans-serif !important;
    font-weight: 700;
    margin-left: 20px;
    color: #666666;
    background-color: #d7f3ee;

}

.chat_contain {
    width: 300px;
    height: 105px;
    padding-left: 47px;
    background-color: #d7f3ee;
    color: #666666;

}

.left_contain {
    background-color: #d7f3ee;
    /* border-radius: 8px; */
}
</style>
