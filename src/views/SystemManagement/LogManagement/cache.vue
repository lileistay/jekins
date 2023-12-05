<template>
    <div style="overflow: hidden;">
        <el-card class="servers">
            <div>基本信息</div>
            <el-divider />
            <div v-for="item in  radius">
                <div class="Dis">
                <div class="item">{{ item.name }}</div>
                <div class="item">{{ item.time }}</div>
                <div class="item">{{ item.version }}</div>
                <div class="item">{{ item.newtime }}</div>
            </div>
            <el-divider />
            </div>
        </el-card>
        <div class="server">
            <div class="server_left">
                <el-card style="" class="Width">
                    <div>命令统计</div>
                    <el-divider />
                    <div class="Height"></div>
                    <el-divider />
                </el-card>
            </div>
            <div class="server_left" style="margin-left: 30px;">
                <el-card class="Width">
                    <div>内存信息</div>
                    <el-divider />
                    <div class="Height"></div>
                    <el-divider />
                </el-card>
            </div>

        </div>
            <div style="height: 50px;"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            radius: [
                {
                    name: "Redis版本",
                    time: "运行模式",
                    version: '端口',
                    newtime: "客户端数",
                },
                {
                    name: "运行时间(天)",
                    time: "使用内存",
                    version: '使用CPU',
                    newtime: "内存配置",
                },
                {
                    name: "AOF是否开启",
                    time: "RDB是否成功",
                    version: 'Key数量',
                    newtime: "网络入口/出口",
                },

            ],
        }
    }
}
</script>
<style scoped>
.Height{
    height: 300px;
    width: 100%;
}
.servers {
    height: 200px;
    margin-top: 30px;
    width: 97.5%;
    margin-left: 10px
}

.item {
    width: 40%;
}



.Dis {
    display: flex;
    height: 40px;
    align-items: center;
}

* {
    font-size: 14px;
}

.Width {
    height: 360px;
    color: #666;
}

.line {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    position: relative;
}

::v-deep .el-card__body {
    padding: 10px 0px 0px 10px !important;
    height: 10px !important;
}

::v-deep .el-divider {
    margin: 5px 0px 0px 0px !important;
    width: 100% !important;
}

.server {
    display: flex;
}

.server_left {
    width: 48%;
    height: 400px;
    margin-left: 10px;
    margin-top: 20px;

}</style>