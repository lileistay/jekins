<template>
    <div>
        <!-- <div class="nurse_top">

           
        </div> -->
        <div class="nurse_top" style="position: relative;">
            <div style="position: absolute;right:50px;top:3px">
                <el-button type="primary" plain size="mini" @click="proofread" style="height: 25px;line-height: 10px;">抄送</el-button>
            </div>
        </div>

        <div class="nurse_contain" style="margin-top: 4px;">
            <div class="nurse_left">
                <div class="nurse_search">
                    <label for="" style="margin-left: 7px;">检索：</label>
                    <el-input placeholder="请输入姓名" size="mini" style="width: 160px" v-model="Name"></el-input>
                    <el-button style="width:75px;height: 30px;margin-left: 10px;" icon="el-icon-search" type="primary" plain size="mini"
                        @click="search" >搜索</el-button>
                </div>
                <div class="patient_list">
                    <div style="width: 300px;">
                        <el-table :data="Nurse_left" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @row-click='selechColum' highlight-current-row ref="tablelist" :height="heightdup">
                            <el-table-column prop="bedNumber" label="床号" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="customerName" label="姓名" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="wardNo" label="房间号" width="100" align="center"> </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <!-- //右边模块 -->
            <div class="nurse_right">
                <div class="nurse_right_top" style="background-color: antiquewhite;">
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
                    <!-- <div>住院天数：<span>李磊</span></div> -->
                </div>
                <div style="display: flex;align-items: center;" class="drug">
                    <!-- <div class="drug_left">
                        <div><el-radio v-model="radio" label="1">药品</el-radio></div>
                        <div><el-radio v-model="radio" label="2">非药品</el-radio></div>
                    </div> -->
                    <span style="margin-left:10px">抄送截止日期：</span>
                    <el-select filterable v-model="value" placeholder="请选择" size="mini" disabled>
                        <el-option v-for="item in Today" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    &nbsp;&nbsp;<span>时间点：</span>
                    <el-time-picker v-model="value1" :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }" size="mini" @change="changeData">
                    </el-time-picker>
                    &emsp;&emsp;<span>期效：</span> <el-checkbox v-model="periodicType" label="0">长期</el-checkbox> <el-checkbox
                        v-model="periodicTypes" label="1">临时/出院带药</el-checkbox>&emsp;&emsp;<span>抄送状态：</span>
                    <el-select filterable v-model="valuestatus" placeholder="请选择" size="mini" @change="stateChange">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="patient_list_right">
                    <div style="width: 100%;">
                        <el-table :data="tableData" stripe ref="tablelistone" :row-style="{ height: '0' }"
                            :cell-style="{ padding: '3px' }"
                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @select="selCopy"
                            @row-click='selechColums' @select-all="selList" @selection-change="handleSelectionChange"
                           
                            :height="newheight"
                            border>
                            <el-table-column type="selection" width="55" align="center">
                            </el-table-column>
                            <el-table-column prop="periodicType" label="期效" width="100" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.periodicType == '0' || scope.row.periodicType == '3' ? '长期' : '临时' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="source" label="来源" width="100" align="center">
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
                            <el-table-column prop="startTime" label="开始时间" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="lastCopyTime" label="上次抄送时间" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="itemName" label="医嘱内容" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="materialSpec" label="规格" width="150" align="center">
                            </el-table-column>
                            <el-table-column prop="amount" label="单次数量" width="100" align="center">
                            </el-table-column>
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
                            <!-- <el-table-column prop="dosage" label="剂量单位" width="100" align="center">
                            </el-table-column> -->
                            <el-table-column prop="frequency" label="频次" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="usageWay" label="用法" width="100" align="center">
                                <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.usageWay=='1'?'口服-外用':scope.row.usageWay=='2'?'水煎内服':scope.row.usageWay=='3'?'皮试':"" }}
                                            </div>
                                        </template>
                            </el-table-column>
                            <el-table-column prop="skinFlag" label="皮试" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="dropVelocity" label="滴速" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="doctorName" label="处方医生" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="itemName" label="医生嘱托" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="endTime" label="结束时间" width="200" align="center">
                            </el-table-column>


                        </el-table>
                    </div>
                </div>


                <!-- //bottom -->
            </div>
        </div>
    </div>
</template>
<script>
import { index } from 'mathjs';

export default {
    name: 'proofread',
    data() {
        return {
            newheight:20,
            Today: [
                {
                    value: '0',
                    label: '今日'
                },
                {
                    value: '1',
                    label: '明日'
                },
                {
                    value: '2',
                    label: '后天'
                },
                {
                    value: '3',
                    label: '指定'
                }
            ],
            options: [{
                value: '0',
                label: '今日未抄送'
            }, {
                value: '3',
                label: '今日可抄送'
            }, {
                value: '2',
                label: '今日已抄送'
            }, {
                value: '1',
                label: '全部'
            }],
            value: '0',
            value1: "Thu Mar 30 2023 00:00:00 GMT+0800 (中国标准时间)",
            radio: '1',
            Name: '',
            Nurse_left: [],
            checked: "",
            checkedls: "",
            checkedsy: "",
            checkedzs: '',
            checkedkf: "",
            checkedall: "",
            tableData: [],
            inHospitalId: "",
            copyState: '',
            customerNameList: '',
            valuestatus: "0",
            flag: true,
            periodicType: true,
            periodicTypes: false,
            DataVlaue: "",
            Rows: [],
            deptId: "",
            heightdup:"",

        }
    },

    mounted() {
     
        this.deptId = this.$store.getters.departmentId;
        this.search();
        this.value1=this.timeFmt('YYYY-mm-dd HH:MM:SS', new Date())
    },
    watch: {
        radio(value) {
            if (value == '2') {
                this.flag = false
            } else {
                this.flag = true
            }
        },
        checked() { },
        checkedls() { },
        checkedsy() { },
        checkedzs() { },
        checkedkf() { },
        checkedall() { },
        periodicType(value) {
            this.Rows = [];
            if (value) {
                let Data;
                if (this.value1 == '') {
                    Data = this.getNowDate();
                } else {
                    Data = this.getData(this.value1)
                }
                let data = {
                    inHospitalId: this.inHospitalId, copyState: this.valuestatus, periodicType: '0', 
                    deptId: this.deptId
                }
                this.copyList(data)
                this.periodicTypes = false;
            }else{
                if(this.periodicTypes==false){
                    let data = {
                    inHospitalId: this.inHospitalId, copyState: this.valuestatus,
                    deptId: this.deptId
                }
                this.copyList(data)
                }
         
                // this.periodicTypes = false;
            }
        },
        periodicTypes(value) {
            this.Rows = []
            if (value) {
                let Data;
                if (this.value1 == '') {
                    Data = this.getNowDate();
                } else {
                    Data = this.getData(this.value1)
                }
                let data = {
                    inHospitalId: this.inHospitalId, copyState: this.valuestatus, periodicType: '1', 
                    deptId: this.deptId
                }
                this.copyList(data)
                this.periodicType = false
            }else{
                if(this.periodicType==false){
                    let data = {
                    inHospitalId: this.inHospitalId, copyState: this.valuestatus, periodicType: '', 
                    deptId: this.deptId
                }
                this.copyList(data)
                }
         
                // this.periodicType = true
            }
        }
    },
    created(){
        const data = {
        status: '0',
        deptId: this.deptId
      }
        this.$api.product.productList(data).then(res => {
        if (res) {  
            this.methoList=res.rows
             

            }})
            let h= window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;//获取可视区域高度
            this.newheight=h-265
            this.heightdup=h-208

    },
    methods: {
        methodsUnit(val){
           let strName=''
          this.methoList.forEach(value=>{
                if(val==value.productUnitId){
                    strName=value.productUnitName
                }
             })
                 return strName
    

        },
        customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus, }})
    },
        selechColums(row) {
            this.$refs.tablelistone.clearSelection()
            this.$refs.tablelistone.toggleRowSelection(row)
        },
        selList(row) {
            this.Rows = row;
        },
        handleSelectionChange(row) {
            this.Rows = row;
        },
        selechColum(row, column, event) {
            this.inHospitalId = row.inHospitalId;
            let ids = {
                id: row.id,
                // deptId: this.deptId
            }
            this.$api.confinementRoom.nurseRightTop(ids).then(res => {
                this.customerNameList = res.data;
                let data = { inHospitalId: this.inHospitalId, copyState: this.valuestatus, periodicType:this.periodicTypes==true?'1':'0', lastCopyTime: this.getNowDate(), deptId: this.deptId }
                this.$api.confinementRoom.listCopyMedicalAdvice(data).then(res => {
                    let Data = [];
                    res.rows.forEach(value => {
                        value.forEach(values => {
                            Data.push(values)
                        })
                    });
                    this.tableData = Data;
                    this.$refs.tablelistone.setCurrentRow(Data[0],true);
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
                })
            });
        },
        getDate() {
            var date = new Date() // 获取时间
            var year = date.getFullYear() // 获取年
            var month = date.getMonth() + 1 // 获取月
            var strDate = date.getDate() // 获取日
            let newmonth = month < 10 ? '0' + month : month;
            let newstrDate=strDate < 10 ? '0' + strDate : strDate;
            return year + '-' + newmonth + '-' + newstrDate
        },
        changeData(value) {
            // alert(value,'哈根')
            this.Rows = [];
            this.DataVlaue = this.getData(value);
            let flag = '0'
            if (this.periodicType) {
                flag = '0'
            }
            if (this.periodicTypes) {
                flag = '1'
            }
            let data = {
                inHospitalId: this.inHospitalId, copyState: this.valuestatus, periodicType: flag, 
                deptId: this.deptId
            }
            this.copyList(data)

        },
        stateChange(value) {
            this.Rows = []
            let flag;
            let Data;
            if (this.periodicType) {
                flag = '0'
            }
            if (this.periodicTypes) {
                flag = '1'
            }
            if (this.value1 == '') {
                Data = this.getNowDate();
            } else {
                Data = this.getData(this.value1)
            }
            let data = {
                inHospitalId: this.inHospitalId, copyState: value, periodicType: flag, 
                deptId: this.deptId
            }
            this.copyList(data)
        },

        selCopy(select, row) {
            this.Rows.push(row)
        },
        // 格式化日对象
        getNowDate() {
            var date = new Date();
            var sign2 = ":";
            var year = date.getFullYear() // 年
            var month = date.getMonth() + 1; // 月
            var day = date.getDate(); // 日
            var hour = date.getHours(); // 时
            var minutes = date.getMinutes(); // 分
            var seconds = date.getSeconds() //秒
            var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
            var week = weekArr[date.getDay()];
            // 给一位数的数据前面加 “0”
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (day >= 0 && day <= 9) {
                day = "0" + day;
            }
            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + seconds;
            }
            return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
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
        //转换时间为时分秒
        getData(value) {
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
        timeFmt(fmt, time) {
  if (!time) {
    return ''
  } else {
    if (!fmt) {
      fmt = 'YYYY-mm-dd HH:MM:SS'
    }
    let ret
    var date = new Date(time)
    const opt = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString() // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    }
    for (const k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt)
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
        )
      }
    }
    return fmt
  }
},
        proofread() {
            if (this.Rows.length == 0) {
                this.$message.warning('请选择一条抄送数据');
                return
            }
            let data = this.Rows;
            let flag = false
            data.forEach((value, index) => {
                if (value.lastCopyTime == null) {

                } else {
                    let newCopy = value.lastCopyTime.split(' ')[0]
                    let copyTime = this.getNowDate().split(' ')[0];
                    if (newCopy == copyTime) {
                        flag = true;
                        this.$message.warning('第' + `${index+1}` + '条数据今日不可抄送')
                    }
                }

            })
            if (flag) {
                return
            }
            data.forEach(value => {
                value.executingState = '3';
                value.printFlag = '0';
                value.lastCopyTime = this.getDate()+' '+this.getData(this.value1).split(' ')[1]
            });
            this.$api.confinementRoom.editBatchStates(data).then(res => {
                if (res.code == 200) {
                    this.$message.success('抄送成功');

                }
            })

        },
        //查询抄送列表
        copyList(data) {
            this.$api.confinementRoom.listCopyMedicalAdvice(data).then(res => {
                let Data = [];
                res.rows.forEach(value => {
                    value.forEach(values => {
                        Data.push(values)
                    })
                });
                this.tableData = Data
                this.$refs.tablelistone.setCurrentRow(Data[0],true);

            })
        },
        search() {
            let data = {
                customerName: this.Name,
                pageNum: 1,
                pageSize: 20,
                inpatientStatus: '1',
                deptId:this.deptId 
            }
            this.$api.confinementRoom.nurseLeft(data).then(res => {
                this.Nurse_left = res.rows;
                
                if (res.rows.length == 0) {
                    return
                }else{
                    this.$refs.tablelist.setCurrentRow(res.rows[0],true);
                }
                this.inHospitalId = res.rows[0].inHospitalId;
                this.copyState = res.rows[0].copyState;
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
                let data = { inHospitalId: this.inHospitalId, copyState: this.valuestatus, periodicType: '0', lastCopyTime: this.getNowDate(), deptId: this.deptId }
                this.$api.confinementRoom.listCopyMedicalAdvice(data).then(res => {
                    if (res.rows.length == 0) {
                        return
                    }
                    let Data = [];
                    res.rows.forEach(value => {
                        value.forEach(values => {
                            Data.push(values)
                        })
                    });
                    this.tableData = Data
                    this.$refs.tablelistone.setCurrentRow(Data[0],true);
                })



            })
        }
    },
}
</script>
<style scoped lang="scss">
::v-deep .patient_list .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}

::v-deep .patient_list_right .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}
.el-input__icon el-icon-time {
    position: absolute !important;
    margin-top: -10px;
}

* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}

.patient_list::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
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

.drug {
    width: 1500px;
    height: 40px;
    // border: 1px solid black;
    display: flex;
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
.patient_list_right_bottom {
    width: 1100px;
    height: 250px;
    // border: 1px solid red;
    overflow: scroll;
    // background-color: red;
}

.patient_list_right {
    width: calc(100% - 280px);
    height: 660px;
    // border: 1px solid red;
    overflow: scroll;
    // background-color: red;
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

.nurse_right_top {
    height: 60px;
    // border: 1px solid black;
}

.nurse_right {
    width: calc(100% - 40px);
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

.nurse_top {
    height: 30px;
    // border: 1px solid red;
    line-height: 30px;
}

.nurse_top span {
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
}</style>