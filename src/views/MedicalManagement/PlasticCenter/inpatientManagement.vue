<template>
  <!--住院管理-->
  <div class="container">
    <div class="heaser">
      <el-form size="mini" label-width="120px">
        <el-row>
          <el-col :span="3">
            <el-form-item label="客户姓名：">
              <el-input v-model="form.customerName" clearable />
            </el-form-item>
            <el-form-item label="护士：">
              <el-select v-model="form.nursingPersonnel" filterable class="fullInput" placeholder="请选择"
                style="width: 100%;" clearable :filter-method="nurseFilter">
                <el-option v-for="(userItem, index) in nurse" :key="index" :label="userItem.nickName"
                  :value="userItem.userId + ''" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="客户卡号：">
              <el-input v-model="form.receptionNumber" clearable />
            </el-form-item>
            <el-form-item label="状态：">
              <el-select filterable v-model="form.inpatientStatus" clearable>
                <el-option v-for="dict in dict.type.inpatient_status" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="服务助理：">
              <el-select
                v-model="form.nursingPersonnel"
                filterable
                clearable
                class="fullInput"
                placeholder="请选择"
                style="width: 100%;"
                :filter-method="actualFilter"
              >
                <el-option
                  v-for="(userItem, index) in sysUserList"
                  :key="index"
                  :label="userItem.nickName"
                  :value="userItem.userId + ''"
                />
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :span="4">
            <el-form-item label="电话：">
              <el-input v-model="form.customPhone" clearable />
            </el-form-item>
            <el-form-item label="住院时间：">
              <el-date-picker v-model="form.hospitalTime" clearable style="width: 105%;" type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="病房号：">
              <el-select v-model="roomId" filterable class="fullInput" placeholder="请选择" style="width: 100%;" clearable
                @change="newchanges">
                <el-option v-for="(userItem, index) in newlistTree" :key="index" :label="userItem.label"
                  :value="userItem.roomId" />
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="3">
            <el-form-item label="病床号：">
              <!-- this.bedIdList -->
              <!-- <el-input v-model="form.bedNumber" clearable /> -->
              <el-select v-model="form.bedNumber" filterable class="fullInput" placeholder="请选择" style="width: 100%;"
                clearable>
                <el-option v-for="(userItem, index) in bedIdList" :key="index" :label="userItem.label"
                  :value="userItem.bedId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="医生：">
              <el-select v-model="form.hospitalDoctor" filterable clearable class="fullInput" placeholder="请选择"
                style="width: 100%;" :filter-method="doctorFilter">
                <el-option v-for="(userItem, index) in doctor" :key="index" :label="userItem.nickName"
                  :value="userItem.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-row type="flex" justify="end"><el-button size="mini" type="primary" icon="el-icon-search"
                @click.stop="getData" @keydown.enter.native="getData">搜索</el-button></el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="main">
      <div class="main-left">
        <p class="title">
          在院客户: {{ customAdvice.inHospital }}人 , <span>今日新入:{{ customAdvice.todayNum }}人</span>, 已出院客户:{{
            customAdvice.outHospital }}人
        </p>
        <el-card v-for="(item, index) in InHospital" :key="index" style="margin-top: 10px;" @click="elCards($event)"
          :body-style="Indexs == index ? { 'background': 'antiquewhite' } : ''">
          <div class="card-box elCard" @click="conHospital(item, $event)">
            <span style="color:#337ab7" @click="clickCustomer(item)">{{ item.customerName }}</span>&nbsp;
            <span style="color: #7d7b7b">{{ item.medicalRecordId }}</span>
            {{ item.orderNumber }}
            <span style="color:#337ab7">{{ inpastatus(item.inpatientStatus) }}</span>
            <span class="rightSpan">{{ item.hospitalTime }}</span>
            <el-divider />
            <span style="color: red;font-size: 12px">手术: {{ item.operationName }}</span>
            <span class="rightSpan">{{ item.wardNo }}房 {{ item.bedNumber }}床</span><span></span>
            <el-divider />
          </div>
        </el-card>
      </div>
      <div class="main-right">
        <el-tabs v-model="activeName" type="card" :before-leave="beforeLeave" @tab-click="handleClick">
          <el-tab-pane label="住院信息" name="Hospitalization">
            <Hospitalization :hospitalization="hospita" @deleteget="delGet" @change="cahngeList" />
          </el-tab-pane>
          <el-tab-pane label="医嘱浏览" name="second">
            <doctorsOrder :czHis="czHis" :IsReload="IsReload" />
          </el-tab-pane>
          <el-tab-pane label="长嘱录入" name="third">
            <long0rder :czHis="czHis" :IsReloadnew="IsReloadnew" />
          </el-tab-pane>
          <el-tab-pane label="临嘱录入" name="ko">
            <duan :czHis="czHis" :IsReloads="IsReloads" />
          </el-tab-pane>
          <el-tab-pane label="首次护理记录" name="fourth">
            <firstCareRecord :czHis="czHis" />
          </el-tab-pane>
          <el-tab-pane label="护理记录" name="fourths">
            <nursingRecords  :czHis="czHis"/>
          </el-tab-pane>
          <el-tab-pane label="费用记录" name="feiyong">
            <xpenseSettlement :czHis="czHis" />
          </el-tab-pane>
          <el-tab-pane label="电子病历" name="fourthe">
            <electricMedicalRecord :czHis="czHis" />
          </el-tab-pane>
          <!-- <el-tab-pane label="住院结账" name="fourthg">
            <inpatientBookkeeping />
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Hospitalization from './components/hospitalizationInformation'
import firstCareRecord from './components/firstCareRecord'
import nursingRecords from './components/nursingRecords'
import electricMedicalRecord from './components/electricMedicalRecord'
import xpenseSettlement from './components/xpenseSettlement'
import inpatientBookkeeping from './components/inpatientBookkeeping'
import doctorsOrder from './components/doctorsOrder'
import long0rder from './components/long0rder'
import PinyinMatch from 'pinyin-match'
import duan from './components/duan.vue'
import { todayTime } from '@/utils/time'
import { stringify } from 'querystring'
export default {
  name: 'InpatientManagement',
  dicts: ['Hospitalization_status', 'inpatient_status'],
  components: {
    Hospitalization,
    firstCareRecord,
    nursingRecords,
    electricMedicalRecord,
    xpenseSettlement,
    inpatientBookkeeping,
    doctorsOrder,
    long0rder,
    duan
  },
  data() {
    return {
      roomId: "",
      bch: "",
      IsReloadnew:"",
      IsReloads:'',
      IsReload: 0,
      customAdvice: {},
      Indexs: 0,
      czHis: {},
      hospitalInfoId: "",
      nurse: [],
      nurseList: [],
      comTabs: false,
      InHospital: [],
      illnessRoom: [],
      doctor: [],
      doctorList: [],
      totleo: 0, // 人数
      hospita: {},
      sysUserList: [], // 服务助理
      sysUser: [],
      form: {
        hospitalTime:[],
        inpatientStatus: '1', // 状态
        region: '',
        doctorId: ''
      },
      activeName: '',
      listTree: [],
      newlistTree: [],
      bedIdList: [],
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val;
      this.getData()

    }
  },
  created() {
    // localStorage.setItem('inHospitalId','');
    // localStorage.setItem('isReload',false)
    let that=this;
    setTimeout(function (){
      that.form.inpatientManagement='3';
    },100)


    this.$api.confinementRoom.getFloorInfoTree().then(res => {
      this.listTree = res.data;
      let arr = [];
      this.listTree.forEach((value, index) => {
        if (value.children !== null) {
          value.children.forEach(newvalue => {
            if (newvalue.children.length == 0) {

            } else {
              arr.push(value)
            }

          })
        }
      })
      let obj = {}
      let newarr = arr.reduce(function (item, index) {
        obj[index.floorId] ? '' : obj[index.floorId] = true && item.push(index)
        return item
      }, []);

      newarr.forEach(value => {
        value.children.forEach(newvalue => {
          newvalue.label += '(病房号)'
          newvalue.children.forEach(values => {
            values.label += '(病床号)'
          })
        })
      })
      this.listTree = newarr;

      this.listTree.forEach(value => {
        value.children.forEach(newvalue => {
          this.newlistTree.push(newvalue)
        })

      })

    })
    this.deptId = this.$store.getters.departmentId;
    localStorage.setItem('deptId', this.deptId)
    this.getData()
    this.getUserList()
    this.conHospital();
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  mounted() {
    setTimeout(function () {

    }, 200)

    // document.querySelector('.elCard').click();
  },
  methods: {
    newchanges(val) {
      this.bedIdList=[];
      this.listTree.forEach(value => {
        value.children.forEach(newvalue => {
          if (newvalue.roomId == val) {
            if (newvalue.children) {
              newvalue.children.forEach(newvalues => {
                this.bedIdList.push(newvalues)
              })
            }
          }

        })
      })
    },
    handles() {

    },
    treeClick(node, val, his) {
      if (node.children == null) {
        // this.bch=node.label;
      } else {

        if (val.parent.parent == null) {

        } else {
          this.bch = val.data.label.split('(')[0]
          this.roomId = val.data.roomId;
          let name = val.parent.data.floorId;
          let arr = [];
          this.listTree.forEach(value => {
            if (value.floorId == name) {
              arr.push(value)
            }
          })
          arr.forEach(value => {
            value.children.forEach(newvalue => {
              if (newvalue.label == val.data.label) {
                newvalue.children.forEach(values => {
                  this.bedIdList.push(values)
                })
              }
            })
          })


        }

      }


    },
    cahngeList(val) {
    },
    elCards(event) {

    },
    nurseFilter(val) {
      if (val) {
        this.nurse = this.nurseList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.nurse = this.nurseList
      }
    },
    actualFilter(val) {
      if (val) {
        this.sysUserList = this.sysUser.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.sysUserList = this.sysUser
      }
    },
    doctorFilter(val) {
      if (val) {
        this.doctor = this.doctorList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.doctor = this.doctorList
      }
    },
    // 阻止tabs跳转
    handleClick(val) {
      let str = '';
      for (let i = 0; i < 8; i++) {
        str += Math.floor(Math.random() * 10)
      }
      if (val.label == '医嘱浏览') {
         this.IsReload = str;
      }
      if (val.label == '长嘱录入') {
         this.IsReloadnew = str;
      }
      if (val.label == '临嘱录入') {
         this.IsReloads = str;
      }
      if (this.comTabs === false) {
        this.activeName = ''
        this.$message('请先选择住院客户')
        return
      }
    },
    beforeLeave() {
      if (this.activeName === '') {
        return false
      }
    },
    // 子组件取消住院 页面刷新
    delGet() {
      this.getData()
    },
    getData() {
      const data = {
        deptId: this.deptId,
        customerName: this.form.customerName,
        customCardNumber: this.form.receptionNumber,
        customPhone: this.form.customPhone,
        medicalRecordId: this.form.medicalRecordId,
        hospitalTimeStart: this.form.hospitalTime ? this.form.hospitalTime[0] : null,
        hospitalTimeEnd: this.form.hospitalTime ? this.form.hospitalTime[1] : null,
        // 服务助理
        bedId: this.form.bedNumber,
        hospitalDoctor: this.form.hospitalDoctor,
        nursingPersonnel: this.form.nursingPersonnel,
        inpatientStatus: this.form.inpatientStatus === '' ? '1' : this.form.inpatientStatus,
        roomId: this.roomId,


      }
      this.$api.medical.hospitalInfoList(data).then(res => {
        if (res) {
           if(res.rows.length==0){
            this.hospita={};
           }
          this.InHospital = res.rows;
          localStorage.setItem('payId',this.InHospital[0].id)
          // if(document.querySelector('.elCard')==null){

          // }else{
          //   setTimeout(() => {
          //     alert(document.querySelector('.elCard'))
          //   document.querySelector('.elCard').click();
          // }, 400);
          // }
          this.customAdvice = res.data
          this.totleo = res.total
          this.activeName = ''
          this.$nextTick(function () {
            if (document.querySelector('.elCard') == null) {

            } else {
              document.querySelector('.elCard').click()
            }
          })
        }
      })
    },
    clickCustomer(val) {
      this.$router.push({ path: '/customerInfo', query: { id: val.id, status: val.customerStatus, noDeal: val.receptionStatus, display: val.disPlay } })
    },
    conHospital(val, event) {
      // this.hospita = Object.assign(this.hospita, val)；
      let elCard = document.querySelectorAll('.elCard');
      for (let i = 0; i < elCard.length; i++) {
        if (event.target == elCard[i]) {
          this.Indexs = i;
        }
        // elCard[i].style.background='';
      }
      // event.target.parentNode.parentNode.style.background='antiquewhite'
      // if(val==undefined){
      //   return
      // }
      if (val == undefined) {
        return
      }
      this.hospita = val;
      this.hospitalInfoId = val.inHospitalId;
      localStorage.setItem('payId',val.id)
      localStorage.setItem('val', JSON.stringify(val))
      localStorage.setItem('inHospitalId', val.inHospitalId)
      localStorage.setItem('medicalRecordId', val.medicalRecordId)
      localStorage.setItem('customerName', val.customerName);
      this.$api.confinementRoom.listGroup({
        inHospitalId: val.inHospitalId,
        pageNum: 1,
        pageSize: 20,
        periodicType: '0',
        deptId: this.deptId
      }).then(res => {

        this.$set(this.czHis, 'list', res.rows)
      })
      this.$api.RechargeableCard.customCardSum({ id: val.id }).then(res => {
        if (res) {
          // this.$set(this.hospita, 'deposit', res.rows[0].deposit)
        }
      })
      this.$api.dept.receptionInformationList(val.id).then(res => {
        if (res) {
          this.hospita = Object.assign(this.hospita, res.data)
        }
        localStorage.setItem('hospita', JSON.stringify(this.hospita))
      })
      if (val !== undefined) {
        this.activeName = 'Hospitalization'
        this.comTabs = true
      }
    },
    newsnurse() {
      let inHospitalId;
      inHospitalId = localStorage.getItem('inHospitalId');

      let data = {
        inHospitalId: inHospitalId,
        pageNum: 1,
        pageSize: 20,
        periodicType: '0',
        deptId: this.deptId
      };
      this.$api.confinementRoom.listGroup(data).then(res => {
        let Data = [];
        res.rows.forEach(value => {
          value.forEach(values => {
            Data.push(values)
          })
        });
        this.listGroup = Data;

      })
    },
    inpastatus(str) {
      const obj = this.dict.type.inpatient_status.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    getUserList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      // 病房好
      this.$api.confinementRoom.roomInfoList(data).then(res => {
        if (res) {
          this.illnessRoom = res.rows
        }
      })
      // 人员添加公司Id 添加状态
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
              this.doctorList = this.doctor
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'zerennurse') {
              this.nurse.push(item)
              this.nurseList = this.doctor
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dropdown-menu {
  width: 120px !important;
}

.container {
  //width: 100%;
  //height: 100%;
  padding: 15px;
}

.heaser {
  //width: 100%;
  height: 90px;
  padding: 5px;
  background-color: #e0f0fb;
  border: 1px solid #c3ced5;
}

.main {
  display: flex;
  margin-top: 10px;

  .main-left {
    width: 25%;
    height: 620px;
    overflow: auto;
    margin-right: 10px;
    padding: 0 10px;
    border: 1px solid #c3ced5;

    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 3px;
      background-color: #f5f5f5;
      font-size: 14px;
    }
  }

  .main-right {
    width: 74%;
    height: 650px;
    background-color: #e0f0fb;
    //overflow: auto;
    border: 1px solid #c3ced5;
  }
}

.card-box {
  font-size: 12px;
  position: relative;

  .rightSpan {
    position: absolute;
    right: 0;
  }
}

::v-deep .el-divider--horizontal {
  margin: 6px 0 !important;
}

::v-deep .el-dropdown-link {
  cursor: pointer;
  // color: #409EFF;
}
</style>
