<template>
  <!--医嘱-->
  <div class="box">
    <div class="box-title">
      <div>
        <el-form size="mini" label-width="100px">
          <el-row>
            <el-col>
              <el-form-item label="选择日期：" style="margin-bottom: 0">
                <el-date-picker style="width: 70%;" type="date" placeholder="选择日期" v-model="values" />
                <el-button size="mini" style="margin-left: 10px" @click="search">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <!-- <el-button size="mini" type="success" icon="el-icon-d-arrow-right">导出</el-button> -->
      </div>
    </div>
    <div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="医嘱明细信息" name="first">
          <div style="width:100%;height: 390px;overflow-y: scroll;" class="AdviceTop">
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

                <el-button type="primary" size="mini" v-if="item[0].executingState == '2'"
                  @click="cancle(item[0].executingState, item)" style="visibility: hidden;">申请停止</el-button>
                <el-button style="visibility: hidden;" type="primary" size="mini" v-if="item[0].executingState == '1'"
                  @click="cancle(item[0].executingState, item)" >撤销提交</el-button>
                <el-button type="primary" size="mini" @click="editAdvice(item[0].periodicType, index)" class="stop"
                  v-if="item[0].executingState == '0'" style="visibility: hidden;">编辑医嘱</el-button>
                <el-button type="primary" size="mini" @click="deleteAdvice(index)" class="stop"
                  v-if="item[0].executingState == '0'" style="visibility: hidden;">删除</el-button>
                <el-button type="primary" size="mini" @click="edits(index)" class="stop"
                  v-if="lo(item[0].executingState)" style="visibility: hidden;">修改停嘱时间</el-button>
              </div>
              <div style="">
                <table border style="border-collapse: collapse;border: 1px solid #999;">
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

            <!-- //边界 -->
          </div>
          <div>医生：{{ hospitalDoctor ? hospitalDoctor : '' }}<span></span>&emsp;护理人员：{{ nursingPersonnel ? nursingPersonnel
            : ''
          }}<span></span>&emsp;住院中
            <el-button type="text" size="mini" style="margin-left: 20px;" @click="print('3')">打印临嘱</el-button>
            <el-button type="text" size="mini" style="margin-left: 20px;" @click="print('4')">打印长期医嘱</el-button>
            <el-button type="text" size="mini" @click="print(5)">打印当天长嘱</el-button>
            <el-button type="text" size="mini" @click="print(1)">打印输液卡</el-button>
            <el-button type="text" size="mini" @click="print(2)">打印瓶签</el-button>
            <el-button type="text" size="mini" @click="print(6)">打印注射卡</el-button>
            <el-button type="text" size="mini" @click="print(7)">打印服药卡</el-button>
            <el-button type="text" size="mini" @click="print(8)">打印费用清单</el-button>

          </div>
          <el-button type="text" size="mini" @click="print(9)" style="margin-left: 290px">打印费用汇总</el-button>
          <!-- //滚动边界 -->
        </el-tab-pane>
        <!-- <el-tab-pane label="描述性医嘱信息" name="second">
          <descriptiveOrders :czHis="czHis" :title="title" />
        </el-tab-pane> -->
      </el-tabs>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClosesubmit">
      <span>确认撤销提交吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adds">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibles" width="30%" :before-close="handleClosetime">
      <span>申请停止时间：</span>
      <el-date-picker v-model="value1" type="date" placeholder="选择日期">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="addsok">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="newdialogVisible" width="30%" :before-close="handleCloseAdvice">

      <span class="demonstration">医嘱停止时间:</span>
      <el-date-picker v-model="newvalue1" type="date" placeholder="选择日期" size="mini">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addsnew">确 定</el-button>
      </span>
    </el-dialog>
    <vue-easy-print ref="printChargeSheet">
      <div class="syk" v-show="print1">
        <div style="width:100%;text-align: center;">
                            <h1 style="font-size: 20px;">{{newmessage}}输液卡</h1>
                        </div>
        <span class='printType'>姓名：{{ Print.customerName }}</span><span class="printTypeRight printType">性别：{{
          Print.customSex == 1 ? '女' : '男' }}</span>
        <br>
        <span class="printType">病区：{{ Print.wardNo }}</span><span class="printTypeRight printType">床号：{{
          Print.bedNumber }}</span>
        <div style="width: 500px;height: 150px;margin-top: 20px;display: flex;" v-for="(item, index) in PrintList"
          :key="index">
          <div style="width: 30px;font-size: 20px;">{{ index + '.' }}</div>
          <div style="width: 110px;font-size: 20px;">{{ item.itemName + '.' }}</div>
          <div style="width: 20px;font-size: 20px;margin-left: 120px;">{{ item.frequency }}</div>
          <div style="width: 20px;font-size: 20px;margin-left: 30px;">{{ item.usageWay + '.' }}</div>
        </div>
      </div>

      <!-- //瓶贴 -->
      <div style="width:98%;display: flex;flex-wrap: wrap;" v-show="print2">
        <div style="width:100%;text-align: center;">
                            <h1 style="font-size: 20px;">{{newmessage}}瓶贴打印</h1>
                        </div>
        <div
          :style="index >= 0 ? 'width: 250px;height: 150px;border: 1px solid black;margin-left:50px;margin-top:5px' : 'width: 250px;height: 150px;border: 1px solid black;'"
          v-for="(item, index) in PrintList " :key="index">
          <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>姓名：{{
            Print.customerName }}</span> <span>床号：{{
    Print.bedNumber }}</span> <span>性别：{{ Print.customSex == 1 ? '女' : '男' }}</span></div>
          <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>医嘱：{{
            item.itemName }}</span></div>
          <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>用法：{{
            item.usageWay }}</span></div>
        </div>
      </div>

      <!-- //临时医嘱 -->
      <div v-for="(item, index) in PrintList " style="margin-top: 20px;" v-show="print3">
        <div><span>科室：{{ item.departmentName }}</span><span style="margin-left: 30px;">床号：{{ item.bedNumber }}</span><span
            style="margin-left: 30px;">姓名：{{ item.customerName }}</span><span style="margin-left: 30px;">年龄：{{
              item.customerAge }}</span></div>
        <table border style="border-collapse: collapse" width="600" class="tds">
          <tbody>
            <tr align="center">
              <td rowspan="2">转抄日期时间</td>
              <td rowspan="2">转抄者</td>
              <td rowspan="2">医嘱内容</td>
              <td rowspan="2">组别</td>
              <td rowspan="2">频次滴速</td>
              <td rowspan="2">签名</td>
              <td colspan="7">执行日期</td>
            </tr>
            <tr align="center">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr align="center">
              <td rowspan="2">{{ item.copyPersonTime }}</td>
              <td rowspan="2">{{ item.copyPersonName }}</td>
              <td rowspan="2">{{ item.itemName }}</td>
              <td rowspan="2">1</td>
              <td>{{ item.frequency }}</td>
              <td>时间</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr align="center">
              <td>{{ item.frequency }}</td>
              <td>执行人</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- //长期医嘱 -->
      <!-- <div v-for="(item,index) in PrintList " style="margin-top: 20px;">
                        <div><span>科室：{{ item.departmentName }}</span><span style="margin-left: 30px;">床号：{{ item.bedNumber }}</span><span style="margin-left: 30px;">姓名：{{ item.customerName }}</span><span style="margin-left: 30px;">年龄：{{  item.customerAge}}</span></div>
                        <table border style="border-collapse: collapse" width="600" class="tds">
                            <tbody>
                                <tr align="center">
                                    <td rowspan="2">转抄日期时间</td>
                                    <td rowspan="2">转抄者</td>
                                    <td rowspan="2">医嘱内容</td>
                                    <td rowspan="2">组别</td>
                                    <td rowspan="2">频次滴速</td>
                                    <td rowspan="2">签名</td>
                                    <td colspan="7">执行日期</td>
                                </tr>
                                <tr align="center">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr align="center">
                                    <td rowspan="2">{{ item.copyPersonTime }}</td>
                                    <td rowspan="2">{{ item.copyPersonName }}</td>
                                    <td rowspan="2">{{ item.itemName}}</td>
                                    <td rowspan="2">1</td>
                                    <td>{{ item.frequency }}</td>
                                    <td>时间</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr align="center">
                                    <td>{{ item.frequency }}</td>
                                    <td>执行人</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div> -->

      <div v-for="(item, index) in PrintList " :key="index" v-show="print4">
        <div style="display: flex;justify-content: space-around;"><span>姓名：{{ item.customerName }}</span>
          <span>床号：{{ item.bedNumber }}</span> <span>房间号：{{ item.wardNo }}</span>
        </div>

        <br>
        <div style="display: flex;justify-content: space-around;"><span>医嘱：{{ item.itenName }}</span></div>
        <div style="display: flex;justify-content: space-around;"><span>20ml：</span><span>剂量：{{
          item.materialSpec }}</span></div>
        <div style="display: flex;justify-content: space-around;"> <span>sig：{{ item.usageWay }}</span>
        </div>
        <br>

      </div>
      <div v-show="print5">
        <div class="free" style="width: 99%;height: 25px;text-align: center;line-height: 25px;">
          <h3>住院病人费用清单</h3>
        </div>
        <br>
        <div>
          <span class="Left">住院号：{{ freedata.inHospitalId }}</span>
          <span class="Left" style="width:120px ;">姓名：{{ freedata.customerName }}</span>
          <span class="Left">年龄：{{ freedata.customAge }}</span>
          <span class="Left">床位：{{ freedata.bedNumber }}</span>
          <span class="Left">住院天数：{{ freedata.days }}</span>
          <span class="Left">医疗付款：{{ freedata.fyzffs }}</span>
        </div>
        <br>
        <div>
          <span class="Left">金额：{{ sumfree }}</span>
          <span class="Left" style="width:120px ;">预交押金：{{ freedata.deposit }}</span>
          <span class="Left" style="width:300px">入院时间：{{ freedata.hospitalTime }}</span>
          <span class="Left" style="width:300px">出院时间：{{ freedata.leaveTime }}</span>
        </div>
        <!-- <hr style="border: 1.5px solid black;margin-top: 10px;">
          <br>
          <div v-for="(item,index) in freedata.expenseType" :key="index"> 
             <span class="Left">药费：{{  item.expenseType}}</span>
             <span class="Left">中成药费：{{ item.amountReceived }}</span>
          </div> -->
        <hr style="border: 1.5px solid black;margin-top: 10px;">
        <br>
        <div>
          <span class="Left" style="margin-left: 50px;width: 250px;">统计时间：{{ freedata.hospitalTime }}</span>
          <span class="Left" style="width:50px ;">至：</span>
          <span class="Left" style="width: 250px;">结束时间：{{ freedata.leaveTime == undefined ? timeFmt('YYYY-mm-dd HH: MM: SS',new Date()) : freedata.leaveTime }}</span>
          <span class="Left">总金额：{{ sumfree }}</span>
        </div>
        <br>
        <table border="1px solid black" style="border-collapse: collapse" class="free_list">
          <thead>
            <th>项目名称</th>
            <th>规格</th>
            <th>数量</th>
            <th>单位</th>
            <th>单价</th>
            <th>金额</th>
            <th>优惠</th>
            <th>审核时间</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in freelist" :key="index">
              <td align="center" style="width: 350px">{{ item.itemName }}</td>
              <td align="center">{{ item.materialSpec }}</td>
              <td align="center">{{ item.amount }}</td>
              <td align="center">{{ item.doseUnit }}</td>
              <td align="center">{{ item.unitPrice }}</td>
              <td align="center">{{ item.amountReceived }}</td>
              <td align="center" style="width: 50px;">{{ item.discountAmount }}</td>
              <td align="center">{{ item.pricingTime }}</td>
            </tr>
            <tr>
              <td align="center">合计</td>
              <td colspan="4"></td>
              <td align="center">{{ yh.toFixed(2) }}</td>
              <td align="center">{{ money }}</td>
            </tr>
          </tbody>
        </table>
        <br>
        <div>
          <span class="Left">医生：{{ freedata.doctorName }}</span>
          <span class="Left" style="width: 250px;">打印时间：{{ timeFmt('YYYY-mm-dd HH:MM:SS', new Date()) }}</span>

        </div>
      </div>

      <div v-show="print6">
        <div class="free" style="width: 99%;height: 25px;text-align: center;line-height: 25px;">
          <h3>住院病人费用汇总</h3>
        </div>
        <br>
        <div>
          <span class="Left">住院号：{{ freedata.inHospitalId }}</span>
          <span class="Left" style="width:120px ;">姓名：{{ freedata.customerName }}</span>
          <span class="Left">年龄：{{ freedata.customAge }}</span>
          <span class="Left">床位：{{ freedata.bedNumber }}</span>
          <span class="Left">住院天数：{{ freedata.days }}</span>
          <span class="Left">医疗付款：{{ freedata.fyzffs }}</span>
        </div>
        <br>
        <div>
          <span class="Left">金额：{{ sumfree }}</span>
          <span class="Left" style="width:120px ;">预交押金：{{ freedata.deposit }}</span>
          <span class="Left" style="width:300px">入院时间：{{ freedata.hospitalTime }}</span>
          <span class="Left" style="width:300px">出院时间：{{ freedata.leaveTime }}</span>
        </div>
        <!-- <hr style="border: 1.5px solid black;margin-top: 10px;">
          <br>
          <div v-for="(item,index) in freedata.expenseType" :key="index">
             <span class="Left">药费：{{  item.expenseType}}</span>
             <span class="Left">中成药费：{{ item.amountReceived }}</span>
          </div> -->
        <hr style="border: 1.5px solid black;margin-top: 10px;">
        <br>
        <div>
          <span class="Left" style="margin-left: 50px;width: 250px;">统计时间：{{ freedata.hospitalTime }}</span>
          <span class="Left" style="width:50px ;">至：</span>
          <span class="Left" style="width: 250px;">结束时间：{{ freedata.leaveTime == undefined ? timeFmt('YYYY-mm-dd HH: MM: SS',new Date()) : freedata.leaveTime }}</span>
          <span class="Left">总金额：{{ yh }}</span>
        </div>
        <br>
        <table border="1px solid black" style="border-collapse: collapse" class="free_list">
          <thead>
          <th>项目名称</th>
          <th>规格</th>
          <th>数量</th>
          <th>单位</th>
<!--          <th>单价</th>-->
          <th>金额</th>
<!--          <th>优惠</th>-->
<!--          <th>审核时间</th>-->
          </thead>
          <tbody>
          <tr v-for="(item, index) in freelist" :key="index">
            <td align="center" style="width: 350px">{{ item.itemName }}</td>
            <td align="center">{{ item.materialSpec }}</td>
            <td align="center">{{ item.amount }}</td>
            <td align="center">{{ item.doseUnit }}</td>
<!--            <td align="center">{{ item.unitPrice }}</td>-->
            <td align="center">{{ item.amountReceived }}</td>
<!--            <td align="center" style="width: 50px;">{{ item.discountAmount }}</td>-->
<!--            <td align="center">{{ item.pricingTime }}</td>-->
          </tr>
          <tr>
            <td align="center">合计</td>
            <td colspan="3"></td>
            <td align="center">{{ yh.toFixed(2) }}</td>
<!--            <td align="center">{{ money }}</td>-->
          </tr>
          </tbody>
        </table>
        <br>
        <div>
          <span class="Left">医生：{{ freedata.doctorName }}</span>
          <span class="Left" style="width: 250px;">打印时间：{{ timeFmt('YYYY-mm-dd HH:MM:SS', new Date()) }}</span>

        </div>
      </div>
    </vue-easy-print>
  </div>
</template>

<script>
import { index } from 'mathjs';
import vueEasyPrint from 'vue-easy-print'
import descriptiveOrders from './descriptiveOrders'
export default {
  name: 'DoctorsOrder',
  components: {
    descriptiveOrders,
    vueEasyPrint

  },
  props: ['czHis', 'IsReload'],
  watch: {
    $route() {
      this.nurse();
    },
    'IsReload': {
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
      newmessage:"",
      hospitalDoctor: "",
      Print: "",
      PrintList: [],
      print1: false,
      print4: false,
      print2: false,
      print3: false,
      print5: false,
      print6:false,
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
    this.nurse();

    // setTimeout(function(){
    //   window.open('','_self');
    //   alert('121212')
    // },2000);

  },
  mounted() {
    let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
              let newstr=str.split('<')[0]
              this.newmessage=newstr;
  },
  methods: {
    lo(val) {
      if (val == 6 || val == 7 || val == 8) {
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
        this.money=0;
        this.yh=0;
        this.sumfree=0;
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
      if(val==9){
        let data={
          deptId:this.deptId,
          inHospitalId: vals.inHospitalId
        }
        this.print6=true;
        this.sumfree=0;
        this.yh=0;
        this.$api.confinementRoom.expenseSummaryList(data).then(res=>{
          this.freedata=res.data;
          this.freelist=res.rows;
          res.data.expenseType.forEach(value => {
            this.sumfree += Number(value.amountReceived)
          })
          res.rows.forEach(value => {
            this.yh += Number(value.amountReceived)
            // this.money += Number(value.discountAmount)
          })
          setTimeout(() => {
            this.$refs.printChargeSheet.print();
          })
        })
        return;
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
      this.print5 = false;
      this.print6 = false;
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
        deptId: this.deptId
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
}</style>
