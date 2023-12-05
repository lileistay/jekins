<template>
    <div>
        <Tree :clums="clums" :operation="operation" :isShowfile="isShowfile" :tableData="tableData" :total="total"
            :Imgchange="Imgchange" :tableCheckbox="tableCheckbox" :tableIndex="tableIndex" :showDefault="showDefault"
            :statisticsMessage="statisticsMessage" :statistics="statistics" :showoperation="showoperation"
            :row-class-name="rowClassName" :isChangeIndex="isChangeIndex" :typeVuex="typeVuex" @changeCompay="changeCompay"
            @rowClick="rowClick" @handleSelectionChang="handleSelectionChang" @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId" @changeImg="changeImg"
            @changeIndex="changeIndex">
            <!-- 操作按钮 -->
            <template v-slot:button>
                <div style="position: relative;" class="opacbutton">
                    <div class="opacbutton_children">
                        <div style="margin-bottom: 10px;">
                            <span class="Left">客户姓名:</span>
                        <el-input v-model="customName" style="width: 150px;" size="mini" clearable></el-input>
                        </div>
                        <div>
                            <span class="Left">客户电话:</span>
                        <el-input v-model="customPhone" style="width: 150px;" size="mini" clearable></el-input>
                        </div>
                    </div>
                    <div class="opacbutton_children">
                        <div style="margin-bottom: 10px;">
                            <span class="Left">客户卡号:</span>
                        <el-input v-model="customCardNumber" style="width: 150px;" size="mini" clearable></el-input>
                        </div>
                        <div>
                            <span class="Left">产品名称:</span>
                        <el-input v-model="projectName" style="width: 150px;" size="mini" clearable></el-input>
                        </div>
                    </div>
                    <div class="opacbutton_children">
                        <div style="margin-bottom: 10px;">
                            <span class="Left">订单编号:</span>
                        <el-input v-model="orderNumber" style="width: 150px;" size="mini" clearable></el-input>
                        </div>
                        <div>
                            <span class="Left">审批人员:</span>
                        <el-input v-model="approverName" style="width: 150px;" size="mini" clearable></el-input>
                        </div>
                    </div>
                    <div class="opacbutton_children">
                        <div style="margin-bottom: 10px;">
                            <span class="Left">审批状态:</span>
                        <el-select v-model="value" placeholder="请选择" filterable clearable size="mini" style="width: 150px;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        </div>
                        <div>
                            <span class="Left">审批时间:</span>
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="mini" clearable
                            style="width: 150px;">
                        </el-date-picker>
                        </div>
                    </div>
                    <div class="opacbutton_children">
                        <div style="margin-bottom: 10px;">
                            <span class="Left">退费申请时间:</span>
                        <el-date-picker v-model="value2" type="date" placeholder="选择日期" size="mini" clearable
                            style="width: 150px;">
                        </el-date-picker>
                        </div>
                        <div style="display: flex;align-items: center;">
                        <span style="margin-left: 40px">退款类型:</span>
                        <el-select v-model="valuegroup" placeholder="请选择" filterable  size="mini" style="width: 150px;margin-left: 15px;">
                            <el-option v-for="item in optionstwo" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                            <!-- <span class="Left" :style="{ color: groupcolor }">商品退款</span>/<span
                            :style="{ color: groupcolors,marginLeft:'10px' }">拼团退款</span>
                        <el-switch v-model="valuegroup" active-color="#13ce66" inactive-color="#409eff" style="margin-left: 15px;">
                        </el-switch>
                        <span style="color: red;">（系统默认商品退款切换选择拼团退款）</span> -->
                        </div>
                    </div>
                    <!-- <div class="opacbutton_children">
                        <span class="Left">客户姓名:</span>
                        <el-input v-model="customName" style="width: 150px;" size="mini" clearable></el-input>
                    </div>
                    <div class="opacbutton_children">
                        <span class="Left">客户电话:</span>
                        <el-input v-model="customPhone" style="width: 150px;" size="mini" clearable></el-input>
                    </div>
                    <div class="opacbutton_children">
                        <span class="Left">客户卡号:</span>
                        <el-input v-model="customCardNumber" style="width: 150px;" size="mini" clearable></el-input>
                    </div>
                    <div class="opacbutton_children">
                        <span class="Left">产品名称:</span>
                        <el-input v-model="projectName" style="width: 150px;" size="mini" clearable></el-input>
                    </div>
                    <div class="opacbutton_children">
                        <span class="Left">订单编号:</span>
                        <el-input v-model="orderNumber" style="width: 150px;" size="mini" clearable></el-input>
                    </div>
                    <div class="opacbutton_children">
                        <span class="Left">审批人:</span>
                        <el-input v-model="approverName" style="width: 150px;" size="mini" clearable></el-input>
                    </div>
                    <div class="opacbutton_children">
                        <span class="Left">审批状态:</span>
                        <el-select v-model="value" placeholder="请选择" filterable clearable size="mini" style="width: 150px;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="opacbutton_children">
                        <span class="Left">审批时间:</span>
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="mini" clearable
                            style="width: 150px;">
                        </el-date-picker>
                    </div>
                    <div class="opacbutton_children">
                        <span class="Left">退费申请时间:</span>
                        <el-date-picker v-model="value2" type="date" placeholder="选择日期" size="mini" clearable
                            style="width: 150px;">
                        </el-date-picker>
                    </div>
                    <div class="opacbutton_children" style="display: flex;align-items: center;">

                        <span class="Left" :style="{ color: groupcolor }">商品退款</span>/<span
                            :style="{ color: groupcolors,marginLeft:'10px' }">拼团退款</span>
                        <el-switch v-model="valuegroup" active-color="#13ce66" inactive-color="#409eff" style="margin-left: 15px;">
                        </el-switch>
                        <span style="color: red;">（系统默认商品退款切换选择拼团退款）</span>
                    </div> -->
                    <div style="position: absolute;right:50px;bottom: -8px;">
                        <el-button size="mini" icon="el-icon-search" type="success" plain @keydown.enter.native="getData()"
                            @click.stop="getData()">查询</el-button>
                    </div>

                    <!-- <el-button size="mini" type="primary" plain @click.stop="addtotal">统计</el-button> -->

                </div>
            </template>
            <!-- 列表清单及颜色填充 -->
            <template v-slot:statistics_color>
                <!-- <div class="statistics_circle"></div>
                <span class="Leftmonth">同意</span>
                <div class="statistics_circle"></div>
                <span class="Leftmonth">拒绝</span> -->
            </template>
            <!-- 右侧按钮填充 -->
            <template v-slot:statistics_button>
                <!-- <el-button type="primary" size="mini">
                手工上报
              </el-button> -->
                <div style="width:100%;height:30px;display:flex;align-items:center">
                    <span class="Left" style="margin-left:15px">待审核： <span>{{ tables == null ? '' : tables.pendingReview
                    }}</span></span>
                    <span class="Left">已同意：<span>{{ tables == null ? '' : tables.agreed }}</span></span>
                    <span class="Left">已拒绝：<span>{{ tables == null ? '' : tables.rejected }}</span></span>
                </div>
            </template>
            <template v-slot:statistics_message>
                <div>

                </div>
            </template>
            <!-- 自定义内容填充 -->
            <template v-slot:tabular="{ data }">
                <div v-if="data.name == 'customerName'">
                    <a @click="customerclick(data.id, data)" style="color: #409EFF;cursor: pointer;font-size: 9px;">{{
                        data.customerName }}</a>
                </div>
                <div v-if="data.name == 'approverState'">
                    <span>{{ data.approverState == '0' ? '待审核' : data.approverState == '1' ? "已同意" : "已拒绝" }}</span>
                </div>
            </template>
            <!-- 操作按钮 -->
            <template v-slot:camera="{ newdata }">
                <div v-if="newdata.approverState == 0">
                    <span class="okadd" @click="addrows(newdata)"
                        v-has-permi="['client:orderRefundRecord:getOrderRefundRecordList:ok']">同意</span>
                    <span class="reject" @click="addreject(newdata)"
                        v-has-permi="['client:orderRefundRecord:getOrderRefundRecordList:reject']">拒绝</span>
                </div>

            </template>
            <template v-slot:company>

            </template>
        </Tree>
    </div>
</template>
<script>
import Tree from '@/components/newTree/index'
import { beforeDayTime } from '@/utils/time'
export default {
    components: {
        Tree
    },
    created() {
        //模拟数据
        this.$store.dispatch('treedepartment', { treedepartmentId: this.$store.getters.departmentId })
        this.treedeptId = this.$store.getters.treedepartmentId;
        this.getData();
        const this_ = this
        // 点击回车后事件
        document.onkeydown = function (e) {
            if (e.keyCode === 13) {
                this_.getData()
            }
        }
    },
    watch: {
        valuegroup(newV) {
            if (newV) {
                this.groupcolor = "";
                this.groupcolors = "#409EFF";
            } else {
                this.groupcolor = "#409EFF";
                this.groupcolors = "";
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
    data() {
        return {
            customName: "",
            groupcolor: "#409EFF",
            optionstwo:[
                {
                 label:'正常购买',
                 value:'0'
                },
                {
                 label:'拼团购买',
                 value:'1'
                },
                {
                 label:'秒杀购买',
                 value:'2'
                },
            ],
            groupcolors: "",
            valuegroup:'0',
            isChangeIndex: true,//刷新表格索引
            tables: '',
            shows: false,
            customPhone: "",
            Imgchange: true,
            customCardNumber: "",
            projectName: "",
            orderNumber: "",
            approverName: "",
            value: "0",
            value1: '',
            typeVuex: "backmoney",
            value2: new Date(beforeDayTime(0)[0]),
            total: 0,
            options: [
                {
                    value: '0',
                    label: "待审核"
                },
                {
                    value: '1',
                    label: "已同意"
                },
                {
                    value: '2',
                    label: "已拒绝"
                },

            ],
            //表格数据
            tableData: [],
            //表格表头
            clums: [
                {
                    value: "customerName",
                    label: "客户姓名",
                    width: '150',
                    vals: true,
                },
                {
                    value: "customPhone",
                    label: "客户电话",
                    width: '150'
                },
                {
                    value: "customCardNumber",
                    label: "客户卡号",
                    width: '200',
                    // vals:true,
                },
                {
                    value: "orderNumber",
                    label: "订单编号",
                    width: '250',
                },
                {
                    value: "projectName",
                    label: "产品名称",
                    width: '200',
                },
                {
                    value: "sellingPrice",
                    label: "产品单价",
                    width: '250',
                },
                {
                    value: "buyNum",
                    label: "购买数量",
                    width: '100',
                },
                {
                    value: "actualPayment",
                    label: "实付总金额",
                    width: '100',
                },
                {
                    value: "specs",
                    label: "购买产品规格",
                    width: '160',
                },
                {
                    value: "refundNum",
                    label: "退款产品数量",
                    width: '180',
                },
                {
                    value: "refundAmount",
                    label: "退费总金额",
                    width: '160',
                },
                {
                    value: "refundTime",
                    label: "退费申请时间",
                    width: '250',
                },
                {
                    value: "refundNumber",
                    label: "退费申请编号",
                    width: '250',
                },
                {
                    value: "approverName",
                    label: "审批人姓名",
                    width: '250',
                },
                {
                    value: "approverTime",
                    label: "审批时间",
                    width: '250',
                },
                {
                    value: "approverState",
                    label: "审批状态",
                    width: '150',
                    vals: true,
                },
                {
                    value: "approverNote",
                    label: "审批说明",
                    width: '200',
                }

            ],
            //操作按钮
            operation: [
                {
                    label: '删除',
                    val: '0'
                }
            ],

            //是否显示树形文件
            isShowfile: false,
            //是否显示默认组件
            showDefault: true,
            showoperation: true,
            tableIndex: false,
            tableCheckbox: false,
            statisticsMessage: false,
            statistics: true,

        }
    },
    methods: {
        changeIndex(oldIndex, newIndex) {
            // let that=this;
            // let newdata=this.deepClone(this.clums);
            // let data = newdata.splice(oldIndex, 1);
            // newdata.splice(newIndex, 0, data[0]);
            // setTimeout(()=>{
            //     that.clums=newdata;
            // },1)
        },
        //深拷贝
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
        addrows(item) {
            this.$confirm('确认同意退款吗，是否继续？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '同意',
                type: 'warning'
            }).then((res) => {
                this.$api.confinementRoom.updateRefundApproval({
                    orderInfoId: item.orderInfoId,
                    orderState: '5',
                    refuseReason: "",
                    orderSource:this.valuegroup
                }).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '同意退款成功!'
                        });
                        this.getData()
                    }

                })

            })
        },
        addreject(item) {
            this.$confirm('确认拒绝退款吗，是否继续？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '同意',

                type: 'warning'
            }).then((res) => {
                this.$api.confinementRoom.updateRefundApproval({
                    orderInfoId: item.orderInfoId,
                    orderState: '1',
                    refuseReason: "",
                    orderSource:this.valuegroup
                }).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '拒绝退款成功!'
                        });
                    }
                    this.getData()
                })

            })
        },
        addtotal() {
            this.shows = true;
        },
        changeImg(id) {
            this.Imgchange = id;
        },
        //定义行颜色
        rowClassName(row) {

        },
        customerclick(id, val) {
            if (val.isReachCourtyard === '1') {
                const disPlay = 1
                this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus, display: disPlay } })
            } else {
                this.$router.push({ path: '/notInHospital', query: { id } })
            }
        },
        //deptId改变之后的回调
        getData() {

            let data = {
                customerName: this.customName,
                customPhone: this.customPhone,
                customCardNumber: this.customCardNumber,
                projectName: this.projectName,
                orderNumber: this.orderNumber,
                approverName: this.approverName,
                approverState: this.value,
                approverTime: this.value1 == '' || this.value1 == null ? '' : this.newgetData(this.value1),
                refundTime: this.value2 == '' || this.value2 == null ? '' : this.newgetData(this.value2),
                deptId: this.treedeptId,
                orderSource:this.valuegroup
            }
            if (this.valuegroup=='0') {
                this.$api.confinementRoom.listback(data).then(res => {
                    this.tableData = res.rows;
                    this.tables = res.data;
                    this.total = res.total;
                })
            } else if(this.valuegroup=='1') {
                this.$api.confinementRoom.pinRefundPay(data).then(res => {
                    this.tableData = res.rows;
                    this.tables = res.data;
                    this.total = res.total;
                })
            }else{
                //秒杀订单接口
                this.$api.confinementRoom.pinRefundPay(data).then(res => {
                    this.tableData = res.rows;
                    this.tables = res.data;
                    this.total = res.total;
                })
            }


        },
        newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            let hh = DateObj.getHours()
            let mm = DateObj.getMinutes()
            let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            if (hh >= 0 && hh <= 9) {
                hh = "0" + hh;
            }
            if (mm >= 0 && mm <= 9) {
                mm = "0" + mm;
            }
            if (ss >= 0 && ss <= 9) {
                ss = "0" + ss;
            }
            // 最终时间
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
        },
        changeDeptId(id) {
            // alert(id)
        },
        newdelete(data) {
            console.log(data)
        },
        //点击页码
        handleCurrentChange(e) {
            alert(e)
        },

        //点击选择条数
        handleSizeChange(e) {
            alert(e)
        },
        //点击复选框的回调
        handleSelectionChang(row) {
            // console.log(row,'sadgasd')
        },
        //点击树形三级的回调
        changeCompay(id, item) {
            this.$store.dispatch('treedepartment', { treedepartmentId: id })
            if (!item.children) {
                this.getData();
            }
        },
        //点击表格每一行的回调
        rowClick(data) {

        }
    }
}
</script>
<style scoped>
.Leftmonth {
    margin-left: 8px;
}

.statistics_circle {
    width: 20px;
    height: 20px;
    margin-left: 20px;
    background-color: #409EFF
}

.statistics_circle:nth-of-type(2) {
    background-color: red
}

.okadd {
    color: #409EFF;
    cursor: pointer
}

.reject {
    color: red;
    margin-left: 20px;
    cursor: pointer;
}

::v-deep .warning-row {
    background: red !important;
}

::v-deep .el-button {
    padding: 0px 20px;
    height: 30px;
    margin-left: 20px;
}

.Left {
    margin-right: 10px;
}

.opacbutton {
    display: flex;
    flex-wrap: wrap;
    min-height: 70px;
    /* border: 1px solid black; */
}

.opacbutton_children {
    margin-bottom: 10px;
    height: 70px;
    /* border: 1px solid red; */
}
</style>