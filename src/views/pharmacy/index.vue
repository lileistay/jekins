<template>
    <div>
        <!-- <div class="nurse_top">
            <span @click="proofread" class="left">打印</span>
        </div> -->
        <div class="nurse_top" style="position: relative;">
            <div style="position: absolute;right:50px;top:3px">
                <el-button type="primary" plain size="mini" @click="proofread" class=""
                    style="height: 25px;line-height: 10px;">打印</el-button>
            </div>
        </div>

        <div class="nurse_contain" style="margin-top: 4px;">
            <div class="nurse_left">
                <div class="nurse_search">
                    <label for="" class="" style="margin-left: 7px;">检索：</label>
                    <el-input placeholder="请输入姓名" size="mini" style="width: 160px" v-model="Name"></el-input>
                    <el-button style="width:75px;height: 30px;margin-left: 10px;" icon="el-icon-search" type="primary" plain
                        size="mini" @click="search">搜索</el-button>
                </div>
                <div class="patient_list">
                    <div style="width: 300px;">
                        <el-table :data="Nurse_left" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @row-click='selechColum' :height="height" highlight-current-row ref="tablelist">
                            <el-table-column prop="bedNumber" label="床号" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="customerName" label="姓名" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="wardNo" label="病区" width="100" align="center"> </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <!-- //右边模块 -->
            <div class="nurse_right">
                <div class="nurse_right_top " style="background-color: antiquewhite;">
                    <div style="height: 10px;"></div>
                    <div style="display: flex;">
                        <div class="topContain"> 姓名：{{ customerNameList.customerName }}</div>
                        <div class="topContain"> 性别(年龄)：{{ customerNameList.customAge }}</div>
                        <div class="topContain"> 可用押金：<span>{{ customerNameList.residualDeposit }}</span></div>
                        <div class="topContain"> 病区床位：<span>{{ customerNameList.bedNumber }}</span></div>
                        <!-- 姓名：<span>{{ customerNameList.customerName }}</span>&emsp;&emsp;性别(年龄)：<span>{{
                            customerNameList.customAge }}</span>&emsp;&emsp;
                            病人性质：<span>李磊</span>
                            可用押金：<span>{{ customerNameList.residualDeposit
                            }}</span>&emsp;&emsp;
                            住院号：<span>李磊</span>&emsp;&emsp;
                            病区床位：<span>{{ customerNameList.wardNo }}</span> -->
                    </div>
                    <div style="height: 10px;"></div>
                    <div style="display: flex;">
                        <div class="topContain"> 科室：<span>{{ customerNameList.departmentName }}</span></div>
                        <div class="topContain"> 主治医生：<span>{{ customerNameList.doctorName }}</span></div>
                        <div class="topContain"> 护士：<span>{{ customerNameList.nursingPersonnel }}</span></div>
                        <div class="topContain" style="width: 220px;">入院时间：<span>{{ customerNameList.hospitalTime }}</span>
                        </div>
                        <div class="topContain" style="width: 300px;"> 备注：<span>{{ customerNameList.remark }}</span></div>
                        <!-- <div class="topContain"> 押金警示：<span></span></div> -->


                        <!-- 科室：<span>暂无</span>&emsp;&emsp;统治医生：<span>暂无</span>&emsp;&emsp;护士：<span>{{
                            customerNameList.nursingPersonnel
                        }}</span>&emsp;&emsp;入院时间：<span>{{ customerNameList.createTime
}}</span>&emsp;&emsp;备注：<span>{{
    customerNameList.remark }}</span>&emsp;&emsp;押金警示：<span>暂无</span> -->

                    </div>
                </div>
                <span class="left" style="margin-left:18px">抄送时间：</span>
                <el-date-picker v-model="coptTime" type="daterange" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" size="mini">
                </el-date-picker>
                <span class="left">期效：</span>
                <el-select filterable v-model="value" placeholder="请选择" size="mini" clearable>
                    <el-option v-for="item in newoptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <span class="left">药品状态：</span>
                <el-select filterable v-model="valueStatus" placeholder="请选择" size="mini" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" size="mini" style="margin-left: 10px;margin-top:5px"
                    @click="searchList">搜索</el-button>
                <!-- <span>给药途径：</span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <span>仓库：</span>
                <el-input placeholder="" style="width: 100px;" size="mini"></el-input> -->
                <div class="patient_list_right" style="margin-top: 10px;">
                    <div style="width:100%">
                        <el-table :data="tableData" stripe ref="table" :row-style="{ height: '0' }"
                            :cell-style="{ padding: '3px' }"
                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @select="selCopy"
                            @select-all="selList" @selection-change="handleSelectionChange" @row-click='selechColums' :height="newheight">
                            <el-table-column type="selection" width="55" align="center" >
                            </el-table-column>
                            <el-table-column prop="lastCopyTime" label="抄送时间" width="180" align="center">
                            </el-table-column>
                            <el-table-column prop="bedNumber" label="床号" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="customerName" label="姓名" width="100" align="center">
                                <template slot-scope="scope">
                                    <div>
                                        <a @click="customerclick(scope.row.id, scope.row)">{{ scope.row.customerName }}</a>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="useCustomer" label="医嘱对象" width="100" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.useCustomer == '0' ? '本人' : '子女' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="periodicType" label="期效" width="100" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.periodicType == '0' || scope.row.periodicType == '3' ? '长期' : '临时' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="itemName" label="医嘱内容" width="230" align="center">
                            </el-table-column>
                            <el-table-column prop="materialSpec" label="规格" width="130" align="center">
                            </el-table-column>
                            <el-table-column prop="amount" label="数量" width="100" align="center"></el-table-column>
                            <el-table-column prop="doseUnit" label="单位" width="100" align="center"></el-table-column>
                            <el-table-column prop="unit" label="用药单位" width="100" align="center">
                                <template slot-scope="scope">
                                    <div>
                                        {{ methodsUnit(scope.row.unit) }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="dosage" label="剂量" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="unitPrice" label="单价" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="amountReceived" label="实收" width="100" align="center">
                                <template slot-scope="scope">
                                       {{ ((scope.row.amount)*(scope.row.unitPrice)).toFixed(2) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="serialNum" label="医嘱单号" width="250" align="center">
                            </el-table-column>
                            <!-- <el-table-column prop="unitPrice" label="划价仓库" width="100" align="center">
                                    </el-table-column> -->
                            <el-table-column prop="frequency" label="频次" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="usageWay" label="用法" width="100" align="center">
                                <template slot-scope="scope">
                                    <div>
                                        {{
                                            scope.row.usageWay == '1' ? '口服-外用' : scope.row.usageWay == '2' ? '水煎内服' : scope.row.usageWay == '3' ? '皮试' : ""
                                        }}
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <vue-easy-print ref="printChargeSheet">
                    <div style="height: 100px;width: 90%;display: flex;margin-top: 50px;"
                        v-for="(item, index) in PrintList" :key="index">
                        <!-- <div style="display: flex;margin-top:50px" v-for="(item,index) in PrintList" :key="index">  -->
                        <div style="width:350px;height: 130px;border: 1px solid black;margin-left: 50px;">
                            <div style="margin-left:15px">
                            <span style="margin-left:0px;">病区：{{ item.wardNo }}</span>
                            <span style="margin-left: 10px;">床号：{{ item.bedNumber }}</span>
                            <span style="margin-left: 10px;">姓名：{{ item.customerName }}</span>
                            <span style="margin-left: 10px;">执行：{{ item.executorTime }}</span>
                        </div>
                            <table border="1" style="border-collapse: collapse;margin-left: 20px;margin-top: 10px;">
                                <th>组</th>
                                <th>药品名称</th>
                                <th>剂量</th>
                                <th>频次</th>
                                <th>配药时间</th>
                                <th>配药签名</th>
                                <tr>
                                    <td>1</td>
                                    <td>{{ item.itemName }}</td>
                                    <td>{{ item.amountUnit }}</td>
                                    <td>{{ item.frequency }}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                        <div style="width:400px;height: 130px;border: 1px solid black;margin-left: 20px;">
                            <span style="margin-left: 10px;">病区：{{ item.wardNo }}</span>
                            <span style="margin-left: 20px;">执行：{{ item.executorTime }}</span>
                            <table border="1" style="border-collapse: collapse;margin-left: 10px;margin-top: 10px;">
                                <th>药品名称</th>
                                <th>剂量</th>
                                <th>频次</th>
                                <th>执行时间</th>
                                <th>执行签名</th>
                                <th>滴速</th>
                                <tr>
                                    <td>{{ item.itemName }}</td>
                                    <td>{{ item.amountUnit }}</td>
                                    <td>{{ item.frequency }}</td>
                                    <td>{{ item.executorTime }}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>

                </vue-easy-print>
                <!-- //bottom -->
            </div>
        </div>
    </div>
</template>
<script>
import vueEasyPrint from 'vue-easy-print'
export default {
    name: 'proofread',
    components: {
        vueEasyPrint
    },
    computed() {

    },
    data() {
        return {
            newheight:'',
            options: [{
                value: '0',
                label: '待领取'
            }, {
                value: '1',
                label: '已领取'
            }, {
                value: '2',
                label: '已退'
            }],
            newoptions: [{
                value: '0',
                label: '长期'
            }, {
                value: '1',
                label: '临时'
            }],
            value: '',
            coptTime: [],
            value: "",
            valueStatus: "",
            tableData: [],
            Name: "",
            customerNameList: '',
            inHospitalId: "",
            nurseId: "",
            Nurse_left: [],
            Rows: [],
            PrintList: '',
            methoList: [],
            height:"",

        }
    },
    watch: {
        coptTime(value) {
            console.log(value)

        },
        deptId(val) {
            this.deptId = val
            this.search();
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
        this.search();
        this.deptId = this.$store.getters.departmentId;
        this.coptTime = [this.timenow() + ' ' + "00:00:00", this.timenow() + ' ' + "23:59:59"];
        // this.height = document.documentElement.clientHeight - 180

    },
    created() {
        const data = {
            status: '0',
            deptId: this.deptId
        }
        this.$api.product.productList(data).then(res => {
            if (res) {
                this.methoList = res.rows


            }
        })
        let h= window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;//获取可视区域高度
            this.newheight=h-270
            this.height=h-208;
    },
    methods: {
        methodsUnit(val) {
            let strName = ''
            this.methoList.forEach(value => {
                if (val == value.productUnitId) {
                    strName = value.productUnitName
                }
            })
            return strName


        },
        timenow() {
            var d = new Date(), str = '';
            str += d.getFullYear() + '-';
            str += d.getMonth() + 1 + '-';
            str += d.getDate();
            return str;
        },
        customerclick(id, val) {
            this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus, } })
        },
        selechColums(row) {
            this.$refs.table.clearSelection()
            this.$refs.table.toggleRowSelection(row)
        },
        handleSelectionChange(row) {
            this.Rows = row;
        },
        selList(row) {
            this.Rows = row;
        },
        selechColum(row, column, event) {
            let that = this;
            this.inHospitalId = row.inHospitalId
            let ids = {
                id: row.id,
                // deptId: this.deptId
            }
            this.$api.confinementRoom.nurseRightTop(ids).then(res => {
                this.customerNameList = res.data;
                const datas = {
                    deptId: this.deptId,
                    status: '0'
                }
                this.$api.user.getUserList(datas).then(res => {
                    if (res) {
                        res.data.forEach(item => {
                            item.label = item.nickName
                            item.value = item.userId
                        })
                        res.data.forEach(item => {
                            // this.zerennurse.push(item)
                            if (item.postCode == 'zerennurse') {
                                if (item.userId == this.customerNameList.nursingPersonnel) {
                                    this.customerNameList.nursingPersonnel = item.nickName
                                }

                            }
                        }) // 责任护士
                    }
                })
                let data = { inHospitalId: this.inHospitalId, periodicType: this.value, receiveState: this.valueStatus };
                if (this.coptTime == '') {
                    data.startTime = ''
                    data.endTime = ''
                } else {
                    this.coptTime.forEach((value, index) => {
                        if (index == 0) {
                            data.startTime = this.newDate(value) + " " + '00:00:00'
                        } else {
                            data.endTime = this.newDate(value) + " " + '23:59:59'
                        }
                    })
                }

                data.deptId = this.deptId
                this.$api.confinementRoom.getPharmacyDispensingList(data).then(res => {
                    let Data = [];
                    res.rows.forEach(value => {
                        value.forEach(values => {
                            Data.push(values)
                        })
                    });
                    console.log(Data)
                    this.tableData = Data
                })
            });
        },
        searchList() {
            let data = { inHospitalId: this.inHospitalId, periodicType: this.value, receiveState: this.valueStatus };
            if (this.coptTime == '' || this.coptTime == null) {
                data.startTime = ''
                data.endTime = ''
            } else {
                this.coptTime.forEach((value, index) => {
                    if (index == 0) {
                        data.startTime = this.newDate(value) + " " + '00:00:00'
                    } else {
                        data.endTime = this.newDate(value) + " " + '23:59:59'
                    }
                })
            }
            data.deptId = this.deptId;
            this.$api.confinementRoom.getPharmacyDispensingList(data).then(res => {
                let Data = [];
                res.rows.forEach(value => {
                    value.forEach(values => {
                        Data.push(values)
                    })
                });
                console.log(Data)
                this.tableData = Data
            })
        },
        selCopy(se, row) {
            this.Rows.push(row)

        },
        newDate(time) {
            var date = new Date(time)
            var y = date.getFullYear()
            var m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m
            var d = date.getDate()
            d = d < 10 ? '0' + d : d
            return y + '-' + m + '-' + d
        },
        // newDate(value){
        //     let DateObj = new Date(value)
        //    // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
        //    let year = DateObj .getFullYear()
        //    let month = DateObj .getMonth() + 1
        //    let day = DateObj .getDate()
        //    let hh = DateObj .getHours()
        //    let mm = DateObj .getMinutes()
        //    let ss = DateObj .getSeconds()
        //    month = month > 9 ? month : '0' + month
        //    day = day > 9 ? day : '0' + day
        //    if (hh >= 0 && hh <= 9) {
        //         hh = "0" + hh;
        //     }
        //     if (mm >= 0 && mm <= 9) {
        //         mm = "0" + mm;
        //     }
        //     if (ss >= 0 && ss <= 9) {
        //         ss = "0" + ss;
        //     }
        //    // 最终时间
        //    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
        // },
        proofread() {
            let that = this;
            if (this.Rows.length == 0) {
                this.$message.warning('请选择一条打印数据');
                return
            }
            let arr = ''
            this.Rows.forEach((value, index) => {
                if (index == this.Rows.length - 1) {
                    arr += value.copyRecordId
                } else {
                    arr += value.copyRecordId + ','
                }
            })
            let data = {
                copyRecordIds: arr,
            }
            this.$api.confinementRoom.getInfusionCard(data).then(res => {
                if (res.data == {}) {
                    this.$message.warning('此条数据不可打印,请重新选择数据')
                    return
                }
                let data = res.data.resultDto;
                let arr = []
                data.forEach(value => {
                    value.forEach(newvalue => {
                        arr.push(newvalue)
                    })
                });
                this.PrintList = arr
                setTimeout(function () {
                    that.$refs.printChargeSheet.print();
                })

            })

        },
        search() {
            let data = {
                customerName: this.Name,
                pageNum: 1,
                pageSize: 20,
                inpatientStatus: '1',
                deptId: this.deptId
            }
            this.$api.confinementRoom.nurseLeft(data).then(res => {
                this.Nurse_left = res.rows;
                if(res.rows.length==0){
                    return
                }else{
                    this.$refs.tablelist.setCurrentRow(res.rows[0],true)
                }
                this.inHospitalId = res.rows[0].inHospitalId;
                this.nurseId = res.rows[0].id;
                let ids = {
                    id: this.nurseId
                };
                this.$api.confinementRoom.nurseRightTop(ids).then(res => {
                    this.customerNameList = res.data;
                    const data = {
                        deptId: this.deptId,
                        status: '0'
                    }
                    this.$api.user.getUserList(data).then(res => {
                        if (res) {
                            res.data.forEach(item => {
                                item.label = item.nickName
                                item.value = item.userId
                            })
                            res.data.forEach(item => {
                                // this.zerennurse.push(item)
                                if (item.postCode == 'zerennurse') {
                                    if (item.userId == this.customerNameList.nursingPersonnel) {
                                        this.customerNameList.nursingPersonnel = item.nickName
                                    }

                                }
                            }) // 责任护士
                        }
                    })
                });
                let data = { inHospitalId: this.inHospitalId, periodicType: this.value, receiveState: this.valueStatus };
                if (this.coptTime == '') {
                    data.startTime = ''
                    data.endTime = ''
                } else {
                    this.coptTime.forEach((value, index) => {
                        if (typeof value == 'string') {
                            if (index == 0) {
                                data.startTime = this.newDate(value) + " " + '00:00:00'
                            } else {
                                data.endTime = this.newDate(value) + " " + '23:59:59'
                            }
                        } else {
                            if (index == 0) {
                                data.startTime = this.newDate(value) + " " + '00:00:00'
                            } else {
                                data.endTime = this.newDate(value) + " " + '23:59:59'
                            }
                        }

                    })
                }

                data.deptId = this.deptId
                this.$api.confinementRoom.getPharmacyDispensingList(data).then(res => {
                    let Data = [];
                    res.rows.forEach(value => {
                        value.forEach(values => {
                            Data.push(values)
                        })
                    });
                    this.tableData = Data
                })

            })
        }
    },
}
</script>
<style scoped lang="scss">
* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}
::v-deep .patient_list .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}

::v-deep .patient_list_right .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}
.drug {
    width: 1500px;
    height: 80px;
    // border: 1px solid black;
    display: flex;
}


.patient_list_right {
    width:100%;
}

.el-select {
    width: 200px !important;

    .el-input__inner {
        height: 30px !important;
    }
}

.nurse_right_center span {
    margin-right: 10px;
    cursor: pointer;
}

.topContain {
    width: 150px;
    height: 20px;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.nurse_right_top {
    height: 60px;
    // border: 1px solid black;
}

.nurse_right {
    width: calc(100% - 320px);
    height: calc(100% - 0px);
    // border: 1px solid palevioletred;
    // background-color: #999999;
}

.patient_list {
    width: 100%;
    height: calc(100% - 10px);
    position: relative;
    overflow: scroll;
    margin-top: 10px;
    overflow-x: hidden;

}

.nurse_left {
    width: 300px;
    height: 100%;
    // border: 1px solid red;
}

.nurse_contain {
    position: fixed;
    width: 100%;
    height: calc(100% - 170px);
    // border: 1px solid black;
    display: flex;
}



.patient_list::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 8px;
    z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 20px;
    background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px #999; */
    background: transparent;
    /* border-radius: 2px; */
}
.patient_list::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.patient_list::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.nurse_top {
    height: 30px;
    // border: 1px solid red;
    line-height: 30px;
}

.nurse_top span {
    margin-right: 10px;
    cursor: pointer;
}

.left {
    margin-left: 10px;
}</style>