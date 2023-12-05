<template>
  <div>
    <div class="header">
      <div></div>
      <div class="btn">
       
        <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="prescription">处方添加</el-button>
        <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="prescriptions">检验添加</el-button>
        <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="prescriptionfs">放射添加</el-button>
      </div>
    </div>
    <div class="patient_list_right" style="">

      <div style="width:100%;height: 390px;overflow-y: scroll;margin-left: 10px;" class="AdviceTop" >
            <div v-for="(item, index) in listGroup" :key="index">
              <div style="display:flex;align-items: center;background-color: antiquewhite;"> &emsp;<input class="checkbox"
                  @click="handchange($event)" type="checkbox"> &emsp; 开嘱日期：{{ item[0].createTime
                  }} 开始日期：{{ item[0].startTime
}}<span></span>&emsp;停嘱日期：{{ item[0].endTime
}}<span style="margin-left: 10px;">医嘱类型：{{
  item[0].periodicType == '0' ? '长期' : item[0].periodicType == '1' ? '临时' : item[0].periodicType == '3' ?
    '长期' : "临时"
}}</span>

                &emsp;开嘱医生/护士：{{
                  item[0].doctorName }}<span></span>
                <span></span>&emsp; 状态：<span style="font-weight: bold;">{{
                  change(item[0].executingState) }}</span>&emsp;

                <el-button type="danger" plain size="mini" v-if="item[0].executingState == '2'"
                  @click="cancle(item[0].executingState, item)" >申请停止</el-button>
                <el-button style="" type="info" plain size="mini" v-if="item[0].executingState == '1'"
                  @click="cancle(item[0].executingState, item)" >撤销提交</el-button>
                <el-button type="primary" plain size="mini" @click="editAdvice(item[0].periodicType, index)" class="stop"
                  v-if="item[0].executingState == '0'">编辑医嘱</el-button>
                <el-button type="danger" plain size="mini" @click="deleteAdvice(index)" class="stop"
                  v-if="item[0].executingState == '0'">删除</el-button>
                <el-button type="danger" plain size="mini" @click="edits(index)" class="stop"
                  v-if="lo(item[0].executingState)">修改停嘱时间</el-button>
              </div>
              <div style="">
                <table border style="border-collapse: collapse;">
                  <th>产品名称</th>
                  <th>规格</th>
                  <th>数量</th>
                  <th>每次用量</th>
                  <tbody>
                    <tr align="center" v-for="(items, indexs) in item" :key="indexs" @mouseover="handle($event)"
                      @mouseout="handleLeave($event)">
                      <td style="width: 340px;">{{ items.itemName ? items.itemName : '' }}</td>
                      <td style="width: 340px;">{{ items.materialSpec ? items.materialSpec : '' }}</td>
                      <td style="width: 340px;">{{ items.amount ? items.amount : "" }}</td>
                      <td style="width: 325px;">{{ items.dosage ? items.dosage : '' }}</td>
                    </tr>
                    <div style="width: 200%;height: 20px;">
                      用药频次：{{ item[0].frequency ? item[0].frequency : '' }}<span></span>&emsp;给药途径：{{
                        item[0].usageWay ? frequency(item[0].usageWay) : '' }}<span></span>&emsp;滴速：{{
    item[0].dropVelocity ? item[0].dropVelocity : '' }}<span></span>
                      <!-- &emsp;剂数：{{ item[0].doctorName }}<span></span> -->
                      &emsp;天数：{{ item[0].days ? item[0].days : "" }}<span></span>
                    </div>

                  </tbody>
                </table>
              </div>
            </div>
            </div>
      <!-- <div style="margin-left: 20px;">
      开始日期：{{ listGroup.length!==0?listGroup[0].startTime:'' }}<span></span>&emsp;停嘱日期：{{ listGroup.length!==0?listGroup[0].endTime:''
      }}<span></span>&emsp;开嘱医生/护士：{{ listGroup.length!==0?listGroup[0].doctorName:'' }}<span></span>
      </div> -->
      <br>
      <!-- <div style="width: 100%;" >
        <el-table :data="listGroup" stripe :cell-style="{ padding: '3px' }"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }" border>
          <el-table-column prop="itemName" label="产品名称" width="270" align="center">
          </el-table-column>
          <el-table-column prop="materialSpec" label="规格" width="200" align="center">
          </el-table-column>
          <el-table-column prop="frequency" label="用药频次" width="200" align="center">
          </el-table-column>
          <el-table-column prop="usageWay" label="给药途径" width="200" align="center">
            <template slot-scope="scope">
              <div>
                {{ frequency(listGroup[0].usageWay) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="dropVelocity" label="滴速" width="100" align="center">
          </el-table-column>
          <el-table-column prop="dropVelocity" label="天数" width="100" align="center">
          </el-table-column>
          <el-table-column prop="amount" label="数量" width="100" align="center">
          </el-table-column>
          <el-table-column prop="days" label="每次用量" width="215" align="center">
          </el-table-column>
        </el-table>
      </div> -->
    </div>
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClosesubmit">
      <span>确认撤销提交吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="adds" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibles" width="30%" :before-close="handleClosetime">
      <span>申请停止时间：</span>
      <el-date-picker v-model="value1" type="date" placeholder="选择日期">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addsok" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="newdialogVisible" width="30%" :before-close="handleCloseAdvice">

      <span class="demonstration">医嘱停止时间:</span>
      <el-date-picker v-model="newvalue1" type="date" placeholder="选择日期" size="mini">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newdialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addsnew" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog title="" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">

      <span class="demonstration">长嘱停止时间:</span>
      <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="mini">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="adds" size="mini">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  name: 'Longorderentry',
  props: ['czHis', 'IsReloadnew'],
  watch: {
    $route() {
      this.nurse();
    },
    'IsReloadnew': {
      deep: true,
      handler: function (newV) {
        this.nurse();
      }
    },
    'czHis': {
      deep: true,
      handler: function (newV) {
        this.values = '';
        this.value1 = this.timenow();
        this.newvalue1 = this.timenow();
        this.listGroup = newV.list;
        this.doctor = JSON.parse(localStorage.getItem('his'))
        // hospitalDoctor:this.form.hospitalDoctor,
        //   nursingPersonnel:this.form.nursingPersonnel
        const data = {
          deptId: this.deptId,
          status: '0'
        }
        this.$api.user.getUserList(data).then(res => {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          res.data.forEach(value => {
            // alert(value)
            if (value.postCode === 'doctor') {
              if (value.value == this.doctor.hospitalDoctor) {
                this.hospitalDoctor = value.label;
              }
            }
            if (value.value == this.doctor.nursingPersonnel) {
              this.nursingPersonnel = value.label;
            }
          })
        })
        // this.nurse();
      }
    },
    isReload(val) {
      // alert(val,'嘿嘿')
    }
  },
  computed: {
    isReload: {
      get() {
        return this.$store.getters.isReload
      },
      set(val) {
        val = this.$store.getters.isReload;
      }
    }
  },
  data() {
    return {
      nursingPersonnel: "",
      hospitalDoctor: "",
      Print: "",
      PrintList: [],
      print1: false,
      print4: false,
      print2: false,
      print3: false,
      print5: false,
      newvalue1: "",
      newdialogVisible: false,
      activeName: 'first',
      title: '添加描述性医嘱',
      listGroup: [],
      dialogVisible: false,
      row: '',
      value1: "",
      dialogVisibles: false,
      radio: "1",
      deptId: '',
      values: '',
      list: '',
      Index: 0,
      doctor: {},
      freedata: '',
      freelist: "",
      sumfree: 0,
      yh: 0,
      money: 0,
      liveList: [],

    }
  },
  created() {
    this.$api.confinementRoom.Route().then(res => {
      this.liveList = res.rows;
    })
    this.deptId = this.$store.getters.departmentId;
    this.list = JSON.parse(localStorage.getItem('val'));
    this.values = this.timenow();
    this.value1 = this.timenow();
    this.newvalue1 = this.timenow();
    // this.nurse();

    // setTimeout(function(){
    //   window.open('','_self');
    //   alert('121212')
    // },2000);

  },
  mounted() {
  },
  methods: {
    lo(val) {
      if (val == 6 || val == 7 || val == 8||val == 5) {
        return false
      } else {
        return true;
      }
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
    handleClosesubmit() {
      this.dialogVisible = false
    },
    handleClosetime() {
      this.dialogVisibles = false;
    },
    handleCloseAdvice() {
      this.newdialogVisible = false
    },
    timenow() {
      var d = new Date(), str = '';
      str += d.getFullYear() + '-';
      str += d.getMonth() + 1 + '-';
      str += d.getDate();
      return str;
    },
    frequency(val) {
      let Name = ''
      this.liveList.forEach(value => {
        if (value.drugId == val) {
          Name = value.drugDelivery
        }
      })

      return Name;
      // if (val == '1') {
      //   return '口服-外服'
      // }
      // if (val == '2') {
      //   return '水煎内服'
      // }
      // if (val == '3') {
      //   return '皮试'
      // }
    },
    deleteAdvice(index) {
      let arr = []
      this.listGroup[index].forEach(value => {
        arr.push(value.medicalAdviceId)
      })
      this.$api.confinementRoom.RemoveroomNumbers(arr).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.nurse();
        }
      })
    },
    editAdvice(val, index) {
      localStorage.setItem('numbersb', index)
      if (val == '0') {
        this.$router.push({ path: 'editcheckout' })
      } else {
        this.$router.push({ path: 'editchekouts' })
      }
    },
    edits(index) {
      this.Index = index
      this.newdialogVisible = true

    },
    addsnew() {
      this.listGroup[this.Index].forEach(value => {
        value.endTime = this.newDate(this.newvalue1) + ' ' + '00:00:00';
        // value.executingState = '6';
      })
      // arr.executingState='6';
      this.$api.confinementRoom.editBatchState(this.listGroup[this.Index]).then(res => {
        if (res.code == 200) {
          this.newdialogVisible = false
          this.$message.success('修改成功')
        }
      })
    },
    handleLeave($event) {
      $event.target.parentNode.style.background = ''
    },
    search() {
      let inHospitalId;
      inHospitalId = localStorage.getItem('inHospitalId');
      let Time = ''
      if (this.values == '') {
        // alert(this.values)
      }
      else if (this.values == null) {
        // alert('1')
      }

      else {
        Time = this.newDate(this.values) + ' ' + '00:00:00'
      }
      let data = {
        inHospitalId: inHospitalId,
        pageNum: 1,
        pageSize: 20,
        deptId: this.deptId,
        startTime: Time
      };
      this.$api.confinementRoom.listGroup(data).then(res => {
        if (res.rows.length == 0) {
          this.listGroup = [];
        }
        this.listGroup = res.rows;


      })
    },
    handchange($event) {

    },
    print(val) {
      this.getprint();
      let vals = JSON.parse(localStorage.getItem('val'));
      if (val == 1) {

        this.print1 = true
      }
      if (val == 2) {
        this.print2 = true
      }
      if (val == 3 || val == 4 || val == 5) {
        this.print3 = true

      }
      if (val == 7) {
        this.print4 = true
      }
      if (val == 8) {
        this.print5 = true;
        this.$api.confinementRoom.getHospitalExpenseRecordList({ inHospitalId: vals.inHospitalId }).then(res => {
          this.freedata = res.data;
          this.freelist = res.rows;
          res.data.expenseType.forEach(value => {
            this.sumfree += Number(value.amountReceived)
          })
          res.rows.forEach(value => {
            this.yh += Number(value.amountReceived)
            this.money += Number(value.discountAmount)
          })

          setTimeout(() => {
            this.$refs.printChargeSheet.print();
          })
        })
        return
      }
      let arr = [];
      let flag = false;
      let handchange = document.querySelectorAll('.checkbox');
      for (let i = 0; i < handchange.length; i++) {
        if (handchange[i].checked == true) {
          arr.push(this.listGroup[i])
        }
      }

      if (arr.length == 0) {
        this.$message.warning('请选择打印数据');
        return
      }
      arr.forEach(value => {
        value.forEach(values => {
          if (values.lastCopyTime == null) {
            flag = true
          }
        })
      })
      if (flag) {
        this.$message.warning('所选数据包含未抄送，不能打印');
        return
      }

      let newarr = [];
      arr.forEach(value => {
        value.forEach(values => {
          newarr.push(values.medicalAdviceId)
        })


      })
      let str = ''
      newarr.forEach((value, index) => {
        if (index == newarr.length - 1) {
          str += value
        } else {
          str += value + ','
        }
      })
      let data = {
        medicalAdviceIds: str,
        type: val,
        deptId: this.deptId
      };
      this.$api.confinementRoom.getInfusionCard(data).then(res => {
        let NewCount = 0;
        for (let mun in res.data) {
          NewCount++
        }
        if (NewCount == 0) {
          this.$message.warning('所选数据与打印内容不符合，请重新选择');
          return
        }
        this.Print = res.data;
        this.PrintList = []
        res.data.resultDto.forEach(value => {
          value.forEach(newvalue => {
            this.PrintList.push(newvalue)
          })
        })
        setTimeout(() => {
          this.$refs.printChargeSheet.print();
        })
      })
    },
    getprint() {
      this.print1 = false;
      this.print2 = false;
      this.print3 = false;
      this.print4 = false;
      this.print5 = false
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
    addsok() {
      let arr = []
      let data = {

        applyStopId: localStorage.getItem('userId'),
        applyStopName: localStorage.getItem('username'),
        applyStopTime: this.newDate(this.value1) + ' ' + '00:00:00'
      }
      this.row.forEach(value => {
        value.executingState = '6'
        arr.push(Object.assign(value, data))
      })

      this.$api.confinementRoom.editBatchState(arr).then(res => {
        if (res.code == 200) {
          this.dialogVisibles = false
          this.$message.success('停止成功');
          this.nurse();

        }
      }
      )
    },
    handleClose() {

    },
    adds() {
      this.row[0].executingState = '0'
      this.$api.confinementRoom.editBatchState(this.row).then(res => {
        if (res.code == 200) {
          this.dialogVisible = false
          this.$message.success('撤销成功');
          this.nurse();

        }
      }
      )
    },
    handle($event) {
      $event.target.parentNode.style.background = '#fafafa'
    },
    cancle(val, row) {
      this.row = row
      if (val == 1) {
        this.dialogVisible = true;
      }
      if (val == 2) {
        this.dialogVisibles = true;
      }
      if (val == 0) {

      }
    },
    // 状态 0:草稿; 1.提交; 2:校对; 3:已抄送; 4:待执行; 5:已完成; 6:待停止; 7:已停止; 8:作废
    changes(val) {
      if (val == 1) {
        return '撤销提交'
      }
      if (val == 2) {
        return '申请停止'
      }

    },
    change(val) {
      switch (val) {
        case 0:
          return '草稿'
          break;
        case 1:
          return '提交'
          break;
        case 2:
          return '校对'
          break;
        case 3:
          return '已抄送'
          break;
        case 4:
          return '待执行'
          break;
        case 5:
          return '已完成'
          break;
        case 6:
          return '待停止'
          break;
        case 7:
          return '已停止'
          break;
        case 8:
          return '作废'
          break;
      }

    },
    prescriptionfs(){
    this.$router.push({ path: 'Adjuvanttherapyfs' })
  },
  prescription() {
    this.$router.push({ path: 'Adjuvanttherapy' })
  },
  prescriptions() {
    this.$router.push({ path: 'checkout' })
  },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    nurse() {
      let inHospitalId;
      inHospitalId = localStorage.getItem('inHospitalId')
      let data = {
        inHospitalId: inHospitalId,
        pageNum: 1,
        pageSize: 20,
        deptId: this.deptId,
        periodicType: '0',
      };
      this.$api.confinementRoom.listGroup(data).then(res => {
        this.listGroup = res.rows;

      })
    },
  }
}
</script>

<style scoped lang="scss">
* {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
  font-size: 14px;
}

.patient_list_right {
  width:calc(100% - 20px) ;
  height: 430px;
  overflow-y: scroll;
  margin-top: 20px;
}

.header {
  width: 100%;
  height: 40px;
  margin: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1abc9c;
}

.btn {
  margin-right: 10px;
}
* {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
  font-size: 14px;
  cursor: pointer;
}

.Left {
  width: 150px;
  height: 16px;
  display: inline-block;
}

.free_list th {
  width: 200px;
}

.AdviceTop::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 7px;
}

.AdviceTop::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
  background: #dcdcdc;
}

.AdviceTop::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
  border-radius: 10px;
  background: transparent;
}

.checkbox {
  width: 15px;
  height: 15px;
}

tr {
  cursor: pointer;
}

td {
  cursor: pointer;
}

.box {
  padding: 10px;

  .box-title {
    padding: 0 10px;
    //width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1abc9c;
  }
}
</style>
