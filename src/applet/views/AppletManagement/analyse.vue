<template>
    <div>
        <div class="analyse">
            <div class="analyse_left" style="display:flex;">
                <h3>
                    客户分析
                </h3>
                <div class="analyse_shape">

                </div>
            </div>
            <div class="analyse_left">
                <span class="Left">客户最关注</span>
                <div class="analyse_top Left"></div>
                <div style="height:10px"></div>
                <span class="Left">客户最感兴趣</span>
                <div style="margin-left:20px;">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="商品" name="first">
                            <div class="analyse_top" style="height:100px;display:flex">
                                <img src="https://resource.51beauty.com.cn/104b4ac6-082e-4f8b-9771-0ea162479239?imageslim,https://resource.51beauty.com.cn/7437d27a-d100-4df2-a581-2b8d03e575bb?imageslim"
                                    style="width:97px;height:97px">
                                <div>
                                    <h3 class="Left">冰点脱毛半年卡（唇/腋）</h3>
                                    <div style="margin-top:50px" class="Left">
                                        <span>¥68 </span> <span>100人已付款</span>
                                    </div>

                                </div>

                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="成员" name="second">
                            <div class="analyse_top" style="height:100px;display:flex">
                                <img src="https://resource.51beauty.com.cn/2c64964c-fe2f-44bf-8ede-1e31ae34d664?imageslim"
                                    style="width:97px;height:97px">
                                <div>
                                    <div style="display:flex">
                                        <h3 class="Left">逯岩</h3>
                                        <span class="doctor">主任医师</span>
                                    </div>
                                    <div style="margin-top:10px" class="Left">
                                        <span>从业23年</span>|<span>案例2</span><span>|</span><span>商品0</span>
                                    </div>
                                    <div style="margin-top:10px" class="Left">
                                        <span>擅长：</span><span>眼部</span><span>鼻部</span><span>胸部</span>
                                    </div>

                                </div>

                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="案例" name="thrid">
                            <div class="analyse_top" style="height:100px;display:flex;align-items:center;justify-content:center">
                              暂无相关信息

                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="活动" name="four">
                            <div class="analyse_top" style="height:100px;display:flex;align-items:center;justify-content:center">
                                暂无相关信息

                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            activeName: "first"
        }
    },
    mounted() {

        // this.$api.deptId.companyObjectives(data).then(res => {

        // })
    },
    methods: {
        handleClick() {

        }
    }
}
</script>

<style scoped >
.Left {
    margin-left: 20px
}

.doctor {
    border: 1px solid #dcb67f;
    padding: 2px;
    display: inline-block;
    color: #dcb67f;
    margin-left: 10px
}

.analyse_top {
    width: 100%;
    height: 50px;
    background-color: #fff;
    margin-top: 20px;
}

.analyse_shape {
    width: 500px;
    height: 300px;
    margin-left: 50px;
}

.analyse {
    width: 100%;
    height: 300px;
    display: flex;
}

.analyse_left {
    width: 50%;
    height: 300px;
    border-right: 1px solid #999;

}
</style>