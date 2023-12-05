<template>
    <div>
        <div style="height:800px;background-color:#fff">
            <div style="height:20px"></div>
            <span class="Left">轨迹数据:</span>
            <div class="orderDetail" v-for="item in list ">
                <div class="orderDetail_children">
                    <p style="margin-top:30px;color:rgba(0,0,0,.45)">
                        {{ item.name1 }}
                    </p>
                    <p style="color:rgba(0,0,0,.85)">
                        {{ item.num1 }}
                    </p>
                </div>
                <div class="orderDetail_children" style="margin-left:20px">
                    <p style="margin-top:30px;color:rgba(0,0,0,.45)">
                        {{ item.name2 }}
                    </p>
                    <p style="color:rgba(0,0,0,.85)">
                        {{ item.num2 }}
                    </p>
                </div>
                <div class="orderDetail_children" style="margin-left:20px">
                    <p style="margin-top:30px;color:rgba(0,0,0,.45)">
                        {{ item.name3 }}
                    </p>
                    <p style="color:rgba(0,0,0,.85)">
                        {{ item.num3 }}
                    </p>
                </div>
                <div class="orderDetail_children" style="margin-left:20px">
                    <p style="margin-top:30px;color:rgba(0,0,0,.45)">
                        {{ item.name4 }}
                    </p>
                    <p style="color:rgba(0,0,0,.85)">
                        {{ item.num4 }}
                    </p>
                </div>
            </div>
            <span class="Left">首次进入时间：</span>
            <P style="margin-top:10px;margin-left:20px">最后浏览时间：</P>
            <div class="contain">
                <el-timeline v-for="item in [1,2]"  >
                    <el-timeline-item timestamp="2018/4/12" placement="top" color="#0bbd87" >
                        <el-card>
                            <h4>满心欢喜从智能测肤页进入查看了你的名片</h4>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: [
                {
                    name1: "浏览名片",
                    num1: "1",
                    name2: "浏览案例",
                    num2: "2",
                    name3: "浏览商城",
                    num3: "3",
                    name4: "浏览企业",
                    num4: "4",
                },
                {
                    name1: "观看直播",
                    num1: "1",
                    name2: "浏览成员",
                    num2: "2",
                    name3: "预约面诊",
                    num3: "3",
                    name4: "成功交易",
                    num4: "4",
                }
            ]
        }

    }
}
</script>

<style scoped>
.Left {
    margin-left: 20px;
    margin-top: 50px;
}

.contain {
    width: 100%;
    height: 400px;
    overflow-y: scroll;
    margin-left:20px;
    margin-top:20px;
    background-color:#fff;
}

.orderDetail {
    width: 100%;
    height: 160px;
    display: flex;
    margin-top: 20px;
    margin-left: 20px;
}

.orderDetail_children {
    width: 390px;
    height: 95px;
    background-color: #F6F6F6;
    text-align: center;

}</style>