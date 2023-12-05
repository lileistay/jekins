<template>
    <div>
        <br>
        <el-button type="primary" size="mini" style="margin-left: 20px;" @click="add">添加记录</el-button>
        <el-button type="primary" size="mini" style="margin-left: 20px;" @click="adds">保存</el-button>
        <div style="width: 100%;height: 770px;overflow-y: scroll;">
            <el-table :data="Nurse_left" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                :row-key="roolkey"
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @row-click='selechColum' border>
                <el-table-column prop="createTime" label="时间" width="170" align="center">
                    <!-- <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.createTime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </template> -->
                </el-table-column>
                <el-table-column prop="tc" label="T(℃)" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.tc" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="p" label="P/HR (次/分)" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.p" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="r" label="R (次/分)" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.r" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="bpL" label="BP (mmHg)" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.bpL" ></el-input>
                    </template> </el-table-column>
                <!-- <el-table-column prop="wardNo" label="SPO2H (%)" width="100" align="center"> </el-table-column> -->
                <el-table-column prop="ys" label="意识" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.ys" ></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="rnr" label="入_内容" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.rnr" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="rl" label="入_量(ml)" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.rl" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="cnr" label="出_内容" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.cnr" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="cl" label="出_量(ml)" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.cl" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="qktt" label="切口疼痛" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.qktt" ></el-input>
                    </template> </el-table-column>
                <el-table-column prop="qkfl" label="腹痛" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.qkfl" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="lzng" label="留置尿管" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.lzng" ></el-input>
                    </template>
                    
                </el-table-column>
                <el-table-column prop="lzztb" label="留置镇痛泵" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.lzztb" ></el-input>
                    </template> </el-table-column>
                <el-table-column prop="ydfmw" label="阴道分泌物" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.ydfmw" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="kqylg" label="口腔引流管" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.kqylg" ></el-input>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="wardNo" label="其他情况记录" width="100" align="center"> </el-table-column> -->
                <el-table-column prop="createUserId" label="记录人" width="150" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.createUserId" placeholder="请选择" >
                            <el-option v-for="item in Advice"  :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <!-- <el-input size="mini" v-model="scope.row.createUserId"></el-input> -->
                    </template>
                </el-table-column>
                <el-table-column prop="wardNo" label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="newdelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            Nurse_left: [],
            count: 0,
            value: "",
            //保存主键列表
            NUrseList: [],
            Advice: [],
        }
    },
    watch: {
        $route() {
            this.search();
        }
    },
    created() {
        this.search();
        this.$forceUpdate()
        this.deptId = this.$store.getters.departmentId;
        const data = {
            deptId: this.deptId,
            status: '0'
        }
        this.value = JSON.parse(localStorage.getItem('val'))
        this.$api.user.getUserList(data).then(res => {
            if (res) {
                let arr=[];
                res.data.forEach(item => {
                    item.label = item.nickName
                    item.value = item.userId
                })
                arr=this.unique(res.data)
                arr.forEach(value => {
                    this.Advice.push(value)
                })
            }
        })

    },
    methods: {
        unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
        roolkey(row){
            let str = '';
      for (let i = 0; i < 8; i++) {
        str += Math.floor(Math.random() * 10)
      }
      return row.id +str
        },
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
        adds() {
            if (this.NUrseList.length == 0) {
                this.Nurse_left.forEach(value => {
                    value.createTime = this.newgetData(value.createTime);
                    value.deptId = this.deptId;
                    value.inHospitalId = this.value.inHospitalId;
                    value.id = this.value.id;
                    value.delFlag = '0';
                    if(typeof value.createUserId=='string'){
                        this.Advice.forEach(newvalue=>{
                            if(newvalue.nickName==value.createUserId){
                                value.createUserId=newvalue.userId;
                            }
                        })
                    }
                })

                this.$api.confinementRoom.addBatchNursingRecords(this.Nurse_left).then(res => {
                    if (res.code == 200) {
                        this.$message.success('添加记录成功');
                        document.querySelectorAll('.tags-li-icon')[document.querySelectorAll('.tags-li-icon').length - 1].click()
                    }
                })
            } else {
                this.$api.confinementRoom.editBatchNursingRecords(this.NUrseList).then(res => {
                    if (res.code == 200) {
                        this.$message.success('修改记录成功');
                        document.querySelectorAll('.tags-li-icon')[document.querySelectorAll('.tags-li-icon').length - 1].click()
                    }
                })
                let len = this.Nurse_left.length;
                while (len--) {
                    if (this.Nurse_left[len].id) {
                        this.Nurse_left.splice(len, 1)
                    }
                }
                if (this.Nurse_left.length == 0) {

                } else {
                    this.Nurse_left.forEach(value => {
                        value.createTime = this.newgetData(value.createTime);
                        value.deptId = this.deptId;
                        value.inHospitalId = this.value.inHospitalId;
                        value.id = this.value.id;
                        value.delFlag = '0'
                    })
                    this.$api.confinementRoom.addBatchNursingRecords(this.Nurse_left).then(res => {
                        if (res.code == 200) {
                            // document.querySelectorAll('.tags-li-icon')[document.querySelectorAll('.tags-li-icon').length - 1].click()
                        }
                    })
                }


            }

        },
        newdelete(row) {
            if (row.ids && row.delFlag) {
                this.NUrseList.forEach(value => {
                    if (value.ids == row.ids) {
                        value.delFlag = '1'
                    }
                })
            }
            this.Nurse_left.forEach((value, index) => {
                if (value.ids == row.ids) {

                    this.Nurse_left.splice(index, 1)
                }
            })
        },
        selechColum() {

        },
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
        //查询护理列表
        search() {
            let val=JSON.parse(localStorage.getItem('val'))
            let data = {
                createTime: "",
                inHospitalId:val.inHospitalId
                
                
            }
            this.$api.confinementRoom.singRecords(data).then(res => {
                this.Nurse_left = res.rows;
                this.Nurse_left.forEach(value => {
                    let str = '';
                    for (let i = 0; i < 8; i++) {
                        str += Math.floor(Math.random() * 10)
                    }
                    value.ids = str;
                })
                this.NUrseList = this.deepClone(this.Nurse_left)
            })
        },
        getDate() {
            var date = new Date() // 获取时间
            var year = date.getFullYear() // 获取年
            var month = date.getMonth() + 1 // 获取月
            var strDate = date.getDate() // 获取日
            let newmonth = month < 10 ? '0' + month : month
            return year + '-' + newmonth + '-' + strDate + ' ' + '00:00:00'
        },
        add() {
            let str = '';
            for (let i = 0; i < 8; i++) {
                str += Math.floor(Math.random() * 10)
            }
            let newatr='';
            let userId=localStorage.getItem('userId');
            this.Advice.forEach(value=>{
                   if(value.userId==userId){
                      newatr=value.nickName;
                   }
                })
            this.Nurse_left.push({
                ids: str,
                createTime: this.getNowDate(),
                tc: "",
                p: "",
                r: "",
                bpL: "",
                ys: "",
                rnr: "",
                rl: "",
                cnr: "",
                cl: "",
                qktt: "",
                qkfl: "",
                lzng: "",
                lzztb: "",
                ydfmw: "",
                kqylg: "",
                createUserId:newatr,
                wardNo: '',

            })
        },
    },

}
</script>

<style scoped>
* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}
</style>