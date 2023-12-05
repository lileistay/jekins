<template>
    <div>
        <div class="order">
            <div class="ORDER_CHILDREN">
                <div class="order-children">
                    <span>筛选条件:</span>
                    <el-switch v-model="value1" class="Left">
                    </el-switch>
                </div>
                <div class="order-children" style="width: 650px;">
                    <span>时间类型:</span>
                    <el-select v-model="value" placeholder="请选择" size="mini" class="Left" clearable @change="changeselect">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker v-model="value3" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" size="mini" :disabled="ifSelect" :editable="false" class="Left">
                    </el-date-picker>
                </div>

                <div class="order-children" style="width: 545px;">
                    <span>查询类型:</span>
                    <el-select v-model="value2" placeholder="请选择" size="mini" class="Left" clearable>
                        <el-option v-for="item in newoptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input size="mini" placeholder="请输入" v-model="name" style="width: 250px;margin-left: 10px;"
                        clearable></el-input>
                </div>
                <div class="order-children">
                    <el-button type="primary" size="mini" @click="search">订单查询</el-button>
                    <!-- <el-button type="primary" size="mini" @click="exports">订单导出</el-button> -->
                </div>
            </div>
        </div>
        <!-- 筛选条件 -->
        <div>
            <div v-show='showflag'>
                <div style="margin-left: 20px;" v-for="(item, index) in alllist" :key="index">
                    <span v-for="(items, indexs) in item.value" class="order_children"
                        :style="{ border: items.border == true ? '1px solid #eee' : '', background: items.back, color: items.color }"
                        @click="addlist(indexs, index)" :key="indexs">{{ items.name }}</span>
                </div>
            </div>

        </div>
        <div style="display: flex;margin-left: 20px;margin-top: 10px;">
            <h3>订单GWV：</h3><span style="margin-top: 3px;">809530.35</span>
        </div>
        <div class="order_contain">
            <div class="order_detail">
                订单信息
            </div>
            <div class="order_detail">
                购买信息
            </div>
            <div class="order_details">
                订单状态
            </div>
            <div class="neworder_detail">
                订单状态
            </div>
        </div>

        <div style="height: 620px;overflow-y: scroll;">
            <div v-for="(item, index) in listorder">
                <div class="order_contain"
                    style="background-color: #f4f8ff;height: 80px;padding-left: 12px;padding-top: 15px;position: relative;">
                    <span>服务</span>
                    <span class="Left">下单时间:{{ item.createTime }} </span>
                    <span class="Left">订单号:{{ item.orderNumber }}</span>
                    <span class="Left">付款方式:{{ item.payType == undefined ? '' : item.payType }} </span>
                    <span class="Left">订单来源门店:{{ item.orderStore }} </span>
                    <!-- <span class="Left">所属员工:祁雪芬(网咨) </span> -->
                    <!-- <span class="Left">订单来源员工:祁雪芬(网咨) </span> -->
                    <span class="Left">核销员工：{{ item.cancelUserName == undefined ? '' : item.cancelUserName }}</span>
                    <div style="width:380px;right:0%;margin-top:45px;position: absolute;">
                        <span style="margin-left: 20%;">共<span style="color:red">{{ item.buyNum }}</span> 件商品,合计 <span
                                style="color:red">{{ item.actualPayment }}</span></span>
                    </div>

                </div>
                <div class="order_contain" style="background-color: #fff;height: 120px">
                    <div class="order_detail Top"
                        style="height: 80px;display: flex;color: #666;border-right:1px solid #999;">
                        <img :src="item.imgurl"
                            alt="" style="width: 87px;height: 87px;">
                        <span style="margin-left: 20px;">{{ item.projectName }}</span>
                        <span style="margin-left: 20%;">数量：{{ item.buyNum }}</span>
                        <span class="Left">单价：<span style="color:red">{{ item.sellingPrice }}</span></span>
                    </div>
                    <div class="order_detail Top"
                        style="height: 80px;color: #666;border-right:1px solid #999;position: relative;">
                        <div style="position: absolute;top:0px;">
                            <div style="display: flex;">
                                <p class="Height">客户姓名：{{ item.customerName }}</p>
                            </div>
                            <p style="height: 25px;">
                                <span class="Height" style="height:10px">联系方式：{{ item.customPhone }}</span>
                            </p>
                            <p style="height: 25px;">
                                <span class="Height" style="height:10px;">买家备注：{{ item.remarks }}</span>
                            </p>




                            <!-- <p class="Height">预约门店：</p>
                            <p style="color:red" class="Height">预约时间：满心喜欢</p> -->
                            <!-- <p class="Height">买家备注：满心喜欢</p> -->
                        </div>
                    </div>
                    <div class="order_details Top"
                        style="height: 80px;color:#666;border-right:1px solid #999;text-align: center;line-height: 70px;">
                        <!-- {{}} -->
                        {{ newtype(item.orderState) }}
                    </div>
                    <div class="neworder_detail Top"
                        style="color:#666;font-size: 18px;text-align: center;line-height: 70px;">
                        <el-button type="text" size="mini" @click="say(item, index)">订单详情</el-button>
                    </div>
                </div>
            </div>

        </div>

        <div class="pagation">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <sgDialog title="订单详情" size="1050px" out-top="2%" :dialog="showDialogtooth" @handleClose="closeRoomDialogtooth">
            <div slot="out" style="width:100%;height:800px;background:#f4f8ff;overflow:hidden">

                <div class="order_top" :style="{ height: Index == 3 ? '200px' : '' }">
                    <div style="display:flex;margin-left:20px;margin-top:20px" v-show="Index == 3">
                        <h1 style="font-size: 24px;">交易已完成</h1>
                        <div class="selectall">
                            <div class="selectall_children">
                                <div class="selectall_childrens">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                                <div style="width:140px;height:0px;border:1px solid #1abc9c;margin-top:12px"></div>
                                <div class="selectall_childrens">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                                <div style="width:140px;height:0px;border:1px solid #1abc9c;margin-top:12px"></div>
                                <div class="selectall_childrens">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                            </div>
                            <div style="color:#1abc9c">
                                <span>待支付</span>
                                <span style="margin-left:125px">待核销</span>
                                <span style="margin-left:130px">已完成</span>
                            </div>
                        </div>

                    </div>
                    <div style="display:flex;margin-left:20px;margin-top:20px" v-show="Index == 1">
                        <h1 style="font-size: 24px;">待核销</h1>
                        <div style="position:absolute;margin-top:50px">
                            <span class="hxlist" @click="Immediate">
                                立即核销
                            </span>
                            <span class="hxlist" @click="postpone">
                                核销延期
                            </span>
                            <!-- <span class="hxlist" @click="cancle">
                                取消订单
                            </span> -->
                        </div>
                        <div class="selectall" style="margin-left:400px">
                            <div class="selectall_children">
                                <div class="selectall_childrens">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                                <div style="width:140px;height:0px;border:1px solid #1abc9c;margin-top:12px"></div>
                                <div class="selectall_childrens">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                                <div style="width:140px;height:0px;border:1px solid #8a8a8a;margin-top:12px"></div>
                                <div class="selectall_childrens" style="margin-top:-5px">
                                    <img src="@/assets/images/reduce.png">
                                </div>
                            </div>
                            <!-- const inputEle = document.querySelector("#input");
                                 inputEle.select(); // 鼠标选择的内容
                                    document.execCommand("copy"); // 复制 -->
                            <div style="color:#1abc9c">
                                <span>待支付</span>
                                <span style="margin-left:125px">待核销</span>
                                <span style="margin-left:130px;color:#8a8a8a">已完成</span>
                            </div>
                        </div>

                    </div>
                    <div style="display:flex;margin-left:20px;margin-top:20px" v-show="Index == 0">
                        <h1 style="font-size: 24px;">待支付</h1>
                        <div style="position:absolute;margin-top:50px">
                            <!-- <span class="hxlist" @click="Immediate">
                                立即核销
                            </span>
                            <span class="hxlist" @click="postpone">
                                核销延期
                            </span> -->
                            <!-- <span class="hxlist" @click="cancle">
                                取消订单
                            </span> -->
                        </div>
                        <div class="selectall" style="margin-left:400px">
                            <div class="selectall_children">
                                <div class="selectall_childrens">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                                <div style="width:140px;height:0px;border:1px solid #8a8a8a;margin-top:12px"></div>
                                <div class="selectall_childrens" style="margin-top:-5px;margin-left: -5px;">
                                    <img src="@/assets/images/reduce.png">
                                </div>
                                <div
                                    style="width:140px;height:0px;border:1px solid #8a8a8a;margin-top:12px;margin-left: 5px;">
                                </div>
                                <div class="selectall_childrens" style="margin-top:-5px">
                                    <img src="@/assets/images/reduce.png">
                                </div>
                            </div>
                            <div style="color:#1abc9c">
                                <span>待支付</span>
                                <span style="margin-left:125px;color:#8a8a8a">待核销</span>
                                <span style="margin-left:130px;color:#8a8a8a">已完成</span>
                            </div>
                        </div>

                    </div>
                    <div style="display:flex;margin-left:20px;margin-top:20px" v-show="Index == 5">
                        <h1 style="font-size: 24px;">已退款</h1>
                        <div style="position:absolute;margin-top:50px">
                            <span>退款金额：</span> <span>操作人</span>
                            <p>退款时间</p>
                            <p>申请人</p>
                            <p>申请时间</p>

                        </div>
                        <div class="selectall" style="margin-left:400px">
                            <div class="selectall_children">
                                <div class="selectall_childrens">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                                <div style="width:140px;height:0px;border:1px solid #1abc9c;margin-top:12px"></div>
                                <div class="selectall_childrens">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                                <div style="width:140px;height:0px;border:1px solid #1abc9c;;margin-top:12px"></div>
                                <div class="selectall_childrens" style="margin-top:-5px">
                                    <img src="@/assets/images/oksuccess.png">
                                </div>
                            </div>
                            <div style="color:#1abc9c">
                                <span style="margin-left:-10px">提交订单</span>
                                <span style="margin-left:120px">退款中</span>
                                <span style="margin-left:140px;">已退款</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="order_top" style="height:300px;background:#f4f8ff">
                    <div class="order_left" style="background:#fff;height:300px;">
                        <div style="margin-left:30px;margin-top:20px;display:flex">
                            <img src="@/assets/images/order.png">
                            <span style="margin-top:10px;margin-left:10px">订单信息</span>
                        </div>
                        <div style="margin-top:20px;margin-left:30px">
                            <div style="display: flex;align-items: center;">
                                <span class="Tops ">订单编号:<input id="copyOrdernumbers" :value="Items.orderNumber" style="border: none;outline: none;width: 135px;" /></span> <img src="@/assets/images/copy.png"
                                class="IMG" @click="copyOrdernumber(Items.orderNumber)">
                            </div>
                         
                            <p class="Tops">下单时间: {{ Items.createTime }}</p>
                            <p class="Tops">商品类型: 服务商品</p>
                            <!-- <p class="Tops">下单门店: 兰州时光整形美容医院</p>
                            <p class="Tops">适用门店: 全部门店</p> -->
                            <p class="Tops">付款方式: {{ Items.patType == undefined ? '' : Items.payType == '0' ? '全款' : '预约金' }}</p>
                            <p class="Tops">核销员工：{{ Items.cancelUserName == undefined ? '' : Items.cancelUserName }}</p>
                            <p class="Tops">订单来源员工: {{ Items.orderStore }}</p>
                        </div>
                    </div>
                    <div class="order_left" style="background:#fff;height:300px;margin-left:1%">
                        <div style="margin-left:30px;margin-top:20px;display:flex">
                            <img src="@/assets/images/order.png">
                            <span style="margin-top:10px;margin-left:10px">购买信息</span>
                        </div>
                        <div style="margin-top:20px;margin-left:30px">
                            <div style="display: flex;align-items: center;">
                                <span class="Tops">客户姓名:{{ Items.customerName }}</span> <img src="@/assets/images/person.png"
                                class="IMG" @click="personal">
                            </div>
                          
                            <p class="Tops">联系方式: {{ Items.customPhone }}</p>
                            <!-- <p class="Tops">预约人姓名: 服务商品</p>
                            <p class="Tops">预约门店: 兰州时光整形美容医院</p>
                            <p class="Tops">预约时间: 全部门店</p> -->
                            <p class="Tops">预约备注: {{ Items.remarks }}</p>
                        </div>
                    </div>
                </div>
                <div class="order_tops" style="height:200px">
                    <div class="order_bottom">
                        <div class="order_bottom_message">
                            商品信息
                        </div>
                        <div>
                            订单状态
                        </div>
                        <div class="order_bottom_num">
                            单价/数量
                        </div>
                    </div>
                    <div style="display:flex">
                        <img :src="ImgUrl"
                            style="width:104px;height:104px;margin-left:20px;margin-top:20px;text-align:top">
                        <div style="margin-top:20px;">
                            <span style="margin-left:5px"> {{ Items.projectName }}</span>
                            <!-- <p style="margin-left:5px">冰点5次</p> -->
                        </div>
                        <span style="margin-left:150px;margin-top:50px">{{ newtype(Items.orderState) }}</span>
                        <div style="margin-left:320px;margin-top:50px">
                            <span>单价：<span style="color:red">￥{{ Items.sellingPrice }}</span></span>
                            <p>数量：<span style="color:red">{{ Items.buyNum }}</span></p>
                        </div>

                    </div>

                </div>
                <div class="order_tops" style="height:200px;overflow:hidden">
                    <div style="margin-left:800px;margin-top:30px">
                        <p>商品金额：<span style="color:red">￥{{ Items.sellingPrice }}</span></p>
                        <p>优惠金额：<span style="color:red">￥{{ Items.discountAmount }}</span></p>
                        <!-- <p>本单收入：<span style="color:red">￥68.00</span></p> -->
                    </div>
                </div>
            </div>
        </sgDialog>
        <sgDialog title="立即核销" size="23%" out-top="2%" :dialog="showDialogtooths" @handleClose="closeRoomDialogtooths">
            <div slot="out" style="width:100%;height:200px;overflow:hidden">
                <span style="color:red">*</span>
                <span>核销码</span>
                <el-input size="mini" style="width:200px;height:30px;margin-left:20px" v-model="hxm" disabled=""></el-input>
                <el-button type="primary" size="mini" @click="gethx" style="margin-left: 20px;">获取</el-button>

                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok">确定</el-button>
                        <el-button @click="closeRoomDialogtooths" size="mini">取消</el-button>
                    </div>
                </div>

            </div>

        </sgDialog>
    </div>
</template>
<script>
const serverPath = process.env.VUE_APP_BASE_API+'/file'
import sgDialog from '@/components/Dialog/index'
export default {
    components: {
        sgDialog
    },
    watch: {
        value1(newV) {
            if (newV) {
                this.showflag = true;
            } else {
                this.showflag = false;
            }
        },
        deptId(newV){
            this.search()
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
    created() {

        // this.$api.confinementRoom.onlineOrderInfo({}).then(res => {
        // })
        this.search();
        this.deptId = this.$store.getters.departmentId

    },
    methods: {
        copyOrdernumber(val){
            let inputEle = document.querySelector("#copyOrdernumbers");
            inputEle.select(); // 鼠标选择的内容
            document.execCommand("copy"); // 复制 -->
        },
        changeselect(val) {
            if (val !== '') {
                this.ifSelect = false
            } else {
                this.ifSelect = true
            }
        },
        exports() {
            this.$api.confinementRoom.companyEmployeeInfoexport({

            }).then(res => {
                let down=window.URL.createObjectURL(new Blob([res],{type: 'application/excel'}));
                let a=document.createElement('a');
                a.href=down;
                a.download=true;
                document.querySelector('body').appendChild(a);
                a.style.display='none';
                a.click();
            }) 
        },
        gethx() {
            // alert(this.Items.orderInfoId)
            this.$api.confinementRoom.getCancelCode({
                orderInfoId: this.Items.orderInfoId
            }).then(res => {
                this.hxm = res.msg
               
            })

        },
        newtype(id) {
            // 0:待支付 1:待核销 2:已取消 3:已完成 4:退款中 5:已退款
            if (id == 0) {
                return '待支付'

            }
            if (id == 1) {
                return '待核销'

            }
            if (id == 2) {
                return '已取消'

            }
            if (id == 3) {
                return '已完成'

            }
            if (id == 4) {
                return '退款中'

            }
            if (id == 5) {
                return '已退款'
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
        search() {
            let data = {

            }
            // { value: '0', label: "下单时间" },
            //     { value: '1', label: "支付时间" },
            //     { value: '2', label: "发货时间" },
            //     { value: '3', label: "预约时间" },
            //     { value: '4', label: "核销时间" },
            //     { value: '5', label: "退款完成时间" },
            if (this.value == '') {

            }

            else if (this.value == 0) {
                data['createTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[0])
                data['endCreateTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[1])

            }
            else if (this.value == 1) {
                data['payTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[0])
                data['endPayTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[1])

            }
            else if (this.value == 2) {
                data['deliveryTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[0])
                data['endDeliveryTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[1])

            }
            else if (this.value == 3) {
                data['reservationTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[0])
                data['endReservationTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[1])

            }
            else if (this.value == 4) {
                data['cancelStart'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[0])
                data['cancelEnd'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[1])

            }

            else if (this.value == 5) {
                data['refundTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[0])
                data['endRefundTime'] = this.value3 == '' || this.value3 == null ? '' : this.newgetData(this.value3[1])

            }
            if (this.value2 == '0') {
                data['projectName'] = this.name;
            }
            if (this.value2 == '1') {
                data['orderNumber'] = this.name;
            }
            if (this.value2 == '3') {
                data['customerName'] = this.name;
            }
            if (this.value2 == '4') {
                data['customPhone'] = this.name;
            }
            data.orderState = this.orderState;
            data.payType = this.payType;
            data.pageSize=this.pageSize;
            data.pageNum=this.pageNum;
            data.deptId=this.deptId;

            // { value: '0', label: "商品名称" },
            //     { value: '1', label: "订单编号" },
            //     // { value: '2', label: "微信昵称" },
            //     { value: '3', label: "购买人姓名" },
            //     { value: '4', label: "联系方式" },


            this.$api.confinementRoom.onlineOrderInfo(data).then(res => {
                this.listorder = res.rows;
                this.listorder.forEach(value=>{
                    value.imgurl=serverPath+value.productPhoto[0].photoAddr;
                
                })
                this.total = res.total;
            })
        },
        handleSizeChange(e) {
            this.pageSize = e;
            this.search();
        },
        handleCurrentChange(e) {
            this.pageNum = e;
            this.search();
        },
        personal() {
            this.showDialogtooth=false;
            this.$router.push({ path: '/notInHospital', query: { id:this.Items.purchaser } })
        },
        //核销码

        ok() {
            if (this.hxm == '') {
                this.$message.warning("请获取核销码");
                return;
            }

            this.showDialogtooths = false;
        },

        closeRoomDialogtooths() {
            this.showDialogtooths = false;
        },
        Immediate() {
            this.showDialogtooths = true;
        },
        postpone() {
            this.$confirm('延期核销，按照当前时间延期30天，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.$api.confinementRoom.editCancel({
                    days: 30,
                    orderInfoId: this.Items.orderInfoId
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                })

            }).catch(() => {
                //   this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                //   });          
            });
        },
        cancle() {
            this.$confirm('确认要取消订单并退款吗？？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '取消成功!'
                });
            }).catch(() => {
                //   this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                //   });          
            });
        },
        closeRoomDialogtooth() {
            this.showDialogtooth = false;
        },
        addlist(indexs, index) {
            this.alllist[index].value.forEach(value => {
                value.back = '';
                value.color = ''
            })
       
            if (this.alllist[index].value[0].name == '付款方式') {
                this.payType = this.alllist[index].value[indexs].indexs;
            } else {
                this.orderState = this.alllist[index].value[indexs].index;
            }
            this.alllist[index].value[indexs].back = '#1abc9c';
            this.alllist[index].value[indexs].color = '#fff'
        },
        say(item, index) {
            this.showDialogtooth = true;
            this.Index = item.orderState;
            this.Items = item;
            this.ImgUrl=item.imgurl;
        }
    },
    data() {
        return {
            ImgUrl:"",
            Index: "",
            ifSelect: true,
            Items: "",
            payType: "",
            orderState: '',
            currentPage4: 1,
            listorder: [],
            total: 0,
            pageNum: 1,
            pageSize: 20,
            hxm: "",
            showDialogtooths: false,
            value1: false,
            showdialog: false,
            showflag: false,
            value: '',
            showDialogtooth: false,
            alllist: [
                {
                    value: [{ name: '订单状态', border: false }, { name: '不限', border: true, back: "#1abc9c", color: "#fff", index: "" }, { name: '待支付', border: true, back: "", color: "", index: 0 },
                    //  { name: '待发货', border: true, back: "", color: "" },
                    //   { name: '已发货', border: true, back: "", color: "" }, 
                    //   { name: '已支付订金', border: true, back: "", color: "" },
                    //    { name: '待核销', border: true, back: "", color: "" },
                    // { name: '待退款', border: true, back: "", color: "" }, 
                    { name: '已退款', border: true, back: "", color: "", index: 5 },
                    { name: '交易已完成', border: true, back: "", color: "", index: 3 },
                    { name: '已取消', border: true, back: "", color: "", index: 2 }],
                },
                // {
                //     value: [{ name: '营销订单', border: false }, { name: '不限', border: true, back: "#2b75ed", color: "#fff" }, { name: '拼团', border: true, back: "", color: "" }, { name: '秒杀', border: true, back: "", color: "" }, { name: '优惠券', border: true, back: "", color: "" }, { name: '砍价', border: true, back: "", color: "" }, { name: '分销', border: true, back: "", color: "" }, { name: '直播', border: true, back: "", color: "" },],
                // },
                {
                    value: [{ name: '付款方式', border: false }, { name: '不限', border: true, back: "#1abc9c", color: "#fff", indexs: "" }, { name: '全款', border: true, back: "", color: "", indexs: 0 }, { name: '预约金', border: true, back: "", color: "", indexs: 1 },],
                },

                // {
                //     value: [{ name: '客户归属', border: false }, { name: '不限', border: true, back: "#2b75ed", color: "#fff" }, { name: '有归属', border: true, back: "", color: "" }, { name: '无归属', border: true, back: "", color: "" },],
                // }
            ],
            value2: "",
            name: "",
            value3: "",
            options: [
                { value: '0', label: "下单时间" },
                { value: '1', label: "支付时间" },
                { value: '2', label: "发货时间" },
                { value: '3', label: "预约时间" },
                { value: '4', label: "核销时间" },
                { value: '5', label: "退款完成时间" },
            ],
            newoptions: [
                { value: '0', label: "商品名称" },
                { value: '1', label: "订单编号" },
                // { value: '2', label: "微信昵称" },
                { value: '3', label: "购买人姓名" },
                { value: '4', label: "联系方式" },
                // { value: '5', label: "订单来源员工" },
                // { value: '6', label: "所属员工" },

            ]
        }
    }
}
</script>
<style scoped>
* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}

.hxlist {
    width: 108px;
    height: 37px;
    text-align: center;
    line-height: 37px;
    background-color: #1abc9c;
    color: #fff;
    font-size: 20px;
    margin-left: 20px;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer
}

.selectall_childrens {
    width: 30px;
    height: 30px;
    border-radius: 50%;

}

.selectall_children {
    width: 100%;
    height: 30px;
    display: flex;
}

.selectall {
    width: 400px;
    height: 80px;
    margin-left: 180px
}

.IMG {
    cursor: pointer;
}

.order_bottom_message {
    margin-left: 20px
}

.order_bottom_num {
    margin-right: 150px
}

.order_left {
    width: 50%;
    height: 150px;
    /* border:1px solid black */
}

.order_bottom {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.order_tops {
    width: 98%;
    height: 150px;
    background: #fff;
    margin-top: 10px;
    margin-left: 10px;
}

.order_top {
    width: 98%;
    height: 150px;
    background: #fff;
    margin-top: 10px;
    margin-left: 10px;
    display: flex;

}

.Height {
    height: 20px;
    font-size: 14px;
}

.pagation {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

::v-deep .el-pager li.active {
    background-color: #1abc9c !important;
    color: #fff;
}

.Top {
    height: 80px;
    margin-top: 25px;
}

.Tops {
    margin-top: 5px;
}

.Left {
    margin-left: 15px;
}

.ORDER_CHILDREN {
    margin-top: 10px;
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    min-height: 40px;
    align-items: center;
}

.ORDER_CHILDREN .order-children {
    width: 130px;
    min-height: 40px;
    display: flex;
    align-items: center;
}

.order {
    min-height: 40px;

}

.order_children {
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    cursor: pointer;
    border-radius: 4px;
}

.order_contain {
    width: 100%;
    height: 46px;
    background-color: #1abc9c;
    margin-left: 20px;
    display: flex;
}

.order_detail {
    width: 40%;
    height: 46px;
    line-height: 46px;
    color: #fff;
    padding-left: 12px;
    border-right: 1px solid #fff
}

.order_details {
    width: 10%;
    height: 46px;
    line-height: 46px;
    color: #fff;
    padding-left: 12px;
    border-right: 1px solid #fff
}

.neworder_detail {
    width: 10%;
    height: 46px;
    line-height: 46px;
    color: #fff;
    padding-left: 12px;
    border-right: 1px solid #fff
}
</style>