<template>
    <div>
        <div class="server">
            <div class="server_left">
                <el-card style="" class="Width">
                    <div>CPU</div>
                    <el-divider />
                    <div class="line">
                        <div>属性</div>
                        <div style="margin-right: 20%;">值</div>
                    </div>
                    <el-divider />
                    <div v-for="item in list">
                        <div class="line">
                            <div>{{ item.name }}</div>
                            <div style="margin-right: 20%;">{{ item.num }}</div>
                        </div>
                        <el-divider />
                    </div>

                </el-card>
            </div>
            <div class="server_left" style="margin-left: 30px;">
                <el-card class="Width">
                    <div>内存</div>
                    <el-divider />
                    <div class="line">
                        <div>属性</div>
                        <div style="margin-right: 10%;">内存</div>
                        <div style="margin-right: 30%;">JVM</div>
                    </div>
                    <el-divider />
                    <div v-for="item in newlist">
                        <div class="line">
                            <div>{{ item.name }}</div>
                            <div style="margin-right: 67.5%;">{{ item.num }}</div>
                            <div style="position: absolute;margin-left: 66%;">{{ item.JVM }}</div>
                        </div>
                        <el-divider />
                    </div>
                </el-card>
            </div>

        </div>
        <el-card class="servers">
            <div>服务器信息</div>
            <el-divider />
            <div class="Dis">
                <div class="item">服务器名称</div>
                <div class="item">iZwz90rjtrmd83mt2s0df8Z</div>
                <div class="item">操作系统</div>
                <div class="item">Linux</div>
            </div>
            <el-divider />
            <div class="Dis">
                <div class="item">服务器IP</div>
                <div class="item">172.23.12.66</div>
                <div class="item">系统架构</div>
                <div class="item">amd64</div>
            </div>
            <el-divider />
        </el-card>
        <el-card class="servers" style="min-height: 300px;">
            <div>Java虚拟机信息</div>
            <el-divider />
            <div class="Dis">
                <div class="item">Java名称</div>
                <div class="item">Java HotSpot(TM) 64-Bit Server VM</div>
                <div class="item">Java版本</div>
                <div class="item">1.8.0_111</div>
            </div>
            <el-divider />
            <div v-for="item in Java">
                <div class="Dis">
                    <div class="item">{{ item.name }}</div>
                    <div class="item">{{ item.time }}</div>
                    <div class="item">{{ item.version }}</div>
                    <div class="item">{{ item.newtime }}</div>
                </div>
                <el-divider />
            </div>
            <div style="display: flex;align-items: center;">
                <span>项目参数</span>
                <span style="" class="look">[-Dname=target/ruoyi-vue.jar, -Duser.timezone=Asia/Shanghai, -Xms512m,
                    -Xmx1024m, -XX:MetaspaceSize=128m, -XX:MaxMetaspaceSize=512m, -XX:+HeapDumpOnOutOfMemoryError,
                    -XX:+PrintGCDateStamps, -XX:+PrintGCDetails, -XX:NewRatio=1, -XX:SurvivorRatio=30, -XX:+UseParallelGC,
                    -XX:+UseParallelOldGC]</span>
            </div>
            <el-divider />
        </el-card>
        <el-card class="servers" style="height: 150px;">
            <div>磁盘状态</div>
            <el-divider />
            <div class="Dis">
                    <div class="newitem">盘符路径</div>
                    <div class="newitem">文件系统</div>
                    <div class="newitem">盘符类型</div>
                    <div class="newitem">总大小</div>
                    <div class="newitem">可用大小</div>
                    <div class="newitem">已用大小</div>
                    <div class="newitem">已用百分比</div>
                </div>
                <el-divider />
                <div class="Dis">
                    <div class="newitem">/</div>
                    <div class="newitem">ext4</div>
                    <div class="newitem">/</div>
                    <div class="newitem">39.2 GB</div>
                    <div class="newitem">26.2 GB</div>
                    <div class="newitem">13.0 GB</div>
                    <div class="newitem">33.07%</div>
                </div>
                <el-divider />
            </el-card>
            <div style="height: 50px;"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            Java: [
                {
                    name: "启动时间",
                    time: "2023-07-28 20:35:49",
                    version: '运行时长',
                    newtime: "73天12小时32分钟",
                },
                {
                    name: "安装路径",
                    time: "/usr/java/jdk1.8.0_111/jre",
                    version: '',
                    newtime: "",
                },
                {
                    name: "项目路径",
                    time: "/home/ruoyi/projects/ruoyi-vue",
                    version: '',
                    newtime: "",
                },
                // {
                //  name:"运行参数",
                //  time:"	[-Dname=target/ruoyi-vue.jar, -Duser.timezone=Asia/Shanghai, -Xms512m, -Xmx1024m, -XX:MetaspaceSize=128m, -XX:MaxMetaspaceSize=512m, -XX:+HeapDumpOnOutOfMemoryError, -XX:+PrintGCDateStamps, -XX:+PrintGCDetails, -XX:NewRatio=1, -XX:SurvivorRatio=30, -XX:+UseParallelGC, -XX:+UseParallelOldGC]",
                //  version:'',
                //  newtime:"",
                // }

            ],
            newlist: [
                {
                    name: '总内存',
                    num: '7.31G',
                    JVM: '1018.5M'
                },
                {
                    name: '已用内存',
                    num: '3.47G',
                    JVM: '580M'
                },
                {
                    name: '剩余内存',
                    num: '3.84G',
                    JVM: '438.5M'
                },
                {
                    name: '使用率',
                    num: '47.49%',
                    JVM: '56.95%'
                }
            ],
            list: [
                {
                    name: '核心数',
                    num: 2,
                },
                {
                    name: '用户使用率',
                    num: '2.49%',
                },
                {
                    name: '系统使用率',
                    num: '0.5%',
                },
                {
                    name: '当前空闲率',
                    num: '96.02%',
                }
            ]
        }
    }
}
</script>
<style scoped>
.newitem{
    /* margin-left: 10%; */
    width: 20%;
}
.look {
    margin-left: 20%;
    width: 60%;
    display: inline-block;
}

.servers {
    height: 150px;
    margin-top: 30px;
    width: 97.5%;
    margin-left: 10px
}

.item {
    width: 40%;
}

.items {
    margin-left: 20.8%;
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
    height: 300px;
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
    height: 300px;
    margin-left: 10px;
    margin-top: 20px;

}</style>