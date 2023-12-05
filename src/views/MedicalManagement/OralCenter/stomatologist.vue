<template>
  <!--口腔医生工作站-->
  <div class="container">
    <div class="leftBox">
      <div class="leftBox-top">
        <el-form size="mini" label-width="100px">
          <div >
         <span>姓名：</span><el-input v-model="customName" size="mini" style="width: 180px;" clearable />
         <span style="margin-left: 5px;">电话：</span><el-input v-model="customphone" size="mini" style="width: 180px;" clearable />
        </div>
        <div style="margin-top: 10px;">
         <span>卡号：</span><el-input v-model="customNumber" size="mini" style="width: 180px;" clearable />
         <span style="margin-left: 5px;">医生：</span>
         <el-select clearable filterable v-model="newdoctor" size="mini" style="width:180px" >
                  <el-option v-for="item in doctor" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
        </div>
        <div style="margin-top: 10px;">
         <span>挂号时间：</span> <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始时间"
                  end-placeholder="结束时间" style="width: 250px;" size="mini" clearable>
                </el-date-picker>
        </div>
        <div style="margin-top: 10px;">
         <span>挂号类型：</span>
         <el-select clearable filterable v-model="newregistration" size="mini" style="width: 120px;" >
                  <el-option v-for="item in registration" :label="item.label" :value="item.value"
                    :key="item.value"></el-option>
                </el-select>
                <span style="margin-left: 5px;">已写病历：</span>
                <el-select clearable filterable v-model="newclaims" size="mini" style="width: 120px;">
                  <el-option v-for="item in claims" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
        </div>
        <div style="margin-top: 10px;">
         <span>客户状态：</span>
         <el-select clearable filterable v-model="newstatus" size="mini" style="width: 120px;" >
                  <el-option v-for="item in status" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
                <el-button icon="el-icon-search" size="mini" type="primary" @keydown.enter.native="search" @click.stop="search" style="height: 28px;width:80px;margin-left: 200px;line-height: 10px;">搜索</el-button>
        </div>
        <div style="margin-top: 30px;position: absolute;right: 5px;margin-top: 12px;">
          <el-button v-hasPermi="['sysManger:dept:Handmade']" size="mini" type="primary" plain icon="el-icon-plus"
                  class="headerBarBtn" @click.stop.native="openManualDialog" style="margin-left: 200px;" @click="sb">手工上报</el-button>
        </div>
        <div style="height: 40px;"></div>
          <el-row>
            <el-col :span="12">
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="leftBox-bout">
        <span>挂号总人数1</span>
        <div class="block">
          <!-- <div style="width:460px;height: 140px;background-color: #fff;border-radius: 5px;">
                  <div style="height: 30px;border: 1px solid black;background-color: #f5f5f5;line-height: 30px;">
                    <span>排期挂号[GH2023060200009]</span>
                  </div>
          </div> -->
          <div v-for="(item,index) in doctor_list" style="margin-top: 20px;cursor: pointer;" @click="addlist(index?index:index)" @mouseover="over(index?index:'')" @mouseleave="leave(index?index:'')">
            <el-card :style="{border:item.border,width:'455px'}" >
                <!-- <div style="background-color:#f5f5f5 ;">dsad</div> -->
                <div class="card-box">
                  <!-- <span style="color:#337ab7">接诊挂号：[GH2022052500004]</span> <span class="rightSpan">2022-05-25
                    10:13</span> -->
                  <!-- <el-divider /> -->
                  <span><i style="font-size: 16px">{{ item.customerName }}</i> {{ item.customAge }}岁</span>
                  <div class="rightSpan" style="top:28px;padding: 4px;background-color: #d9534f;color: #fff;border-radius: 5px;">
                          未写病历
                  </div>
                  <el-divider />
                  <span>{{ item.customPhone }} / {{ item.customCardNumber }}</span>
                  <el-divider />
                  <span>医生：{{ item.drName}}</span>
                  <span style="margin-left: 80px;">美学顾问：{{ item.acName }}</span>
                  <!-- <span class="rightSpan">科室：整形</span> -->
                </div>
              </el-card>
          </div>
        </div>
      </div>
    </div>
    <div class="rightBOX">
      <div class="rightBOX-top">
        <el-tabs v-model="activeName" style="background-color: #f5f5f5;padding: 0 10px;" @tab-click="handleClick">
          <el-tab-pane label="客户信息" name="first">
            <information :tableData="tableData" :dist="dist" />
          </el-tab-pane>
          <el-tab-pane label="登记治疗" name="second">
            <register :doctor="doctor" :esthetics="esthetics" :Name="Name" />
          </el-tab-pane>
          <el-tab-pane label="电子病历" name="third">
            <electronicMedicalRecord :doctor="doctor" :zerennurse="zerennurse" :yizhu="yizhu" />
          </el-tab-pane>
          <el-tab-pane label="正畸" name="fourth" >
            <orthodontics :zhengji="dentalWorkflag"/>
          </el-tab-pane>
          <el-tab-pane label="技加工" name="machining">
            <machining :doctor="doctor" :dentalWorkflag="dentalWorkflag"/>
          </el-tab-pane>
        <el-tab-pane label="照片上传" name="six">
                  <photoUpload :uploadXflag="uploadXflag"></photoUpload>
        </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
  </div>
</template>

<script>
import ManualSubmission from '@/components/ManualSubmission/indexTwo.vue'
import information from './components/information'// 客户信息
import register from './components/register'// 登记
import orthodontics from './components/orthodontics' // 正畸
import machining from './components/machining' // 技加工
import electronicMedicalRecord from './components/electronicMedicalRecord.vue'
import photoUpload from './components/photoUpload.vue'
export default {
  name: 'Stomatologist',
  components: {
    information,
    register,
    orthodontics,
    machining,
    electronicMedicalRecord,
    photoUpload,
    ManualSubmission
  },
  data() {
    return {
      innerDialog:false,
      customer: "",
      customphone:"",
      selectionData:[],
      activeName:"",
      showManualDialog: false,
      Action:{},
      dist:'',
      claims: [{
        value: "0",
        label: "否"
      },
      {
        value: "1",
        label: "是"
      }
      ],//已写病例
      status: [{
        value: "0",
        label: "新客户"
      },
      {
        value: "1",
        label: "老客户"
      }
      ],//客户状态
      Name:"",
      doctor_list:[],
      newstatus: '',//客户状态
      newclaims: [],//已写病例
      newregistration: "",//挂号类型
      newdoctor: "",//医生
      tableData: [{}, {}],
      value1: "",//挂号时间
      customName: "",
      customNumber: "",
      esthetics: [],
      doctor: [],
      zerennurse: [],
      yizhu:[],
      registration: [
        {
          value: "0",
          label: "医保挂号"
        },
        {
          value: "1",
          label: "接诊挂号"
        },
        {
          value: "2",
          label: "排期挂号"
        },
        {
          value: "3",
          label: "科室挂号"
        },
      ],
      listIndex:false,
      dentalWorkflag:'',
      uploadXflag:''

    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      // this.search();
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
    this.deptId = this.$store.getters.departmentId;
     let datas={
      customName:this.customName,
      customPhone:this.customphone,
      deptId:this.deptId,
      customCardNumber:this.customNumber,
      doctor:this.newdoctor,
     }
     
    this.$api.medical.deptRegnInfolist(datas).then(res => {
      this.doctor_list=res.rows;
      this.doctor_list.forEach(value=>{
        value['border']='';
      value['back']='';
      })
  
    })
   
    const data = {
      deptId: this.deptId,
      status: '0'
      // departmentId: this.billing.departmentId
    }
    this.$api.user.getUserList(data).then(res => {
      if (res) {
        res.data.forEach(item => {
          item.label = item.nickName
          item.value = item.userId
        })
        // 去重
        const arr1 = this.unique(res.data);
        res.data.forEach(item => {
          //医生
          if (item.postCode === 'doctor') {
            this.doctor.push(item)
          }
          //美学顾问
          if (item.postCode === 'xczxs') {
            this.esthetics.push(item)
          }
          //医助
          if (item.postCode === 'yizhu') {
              this.yizhu.push(item)
            }
        })
        //护士
        arr1.forEach(value => {
          if (value.postCode == 'zerennurse') {
            this.zerennurse.push(value)
          }
        })
      }
    })
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.search()
      }
    }
  },
  methods: {
    sb(){
      if(this.listIndex){
        this.showManualDialog=true
      }else{
        this.$message.warning('请选择客户');
      }
   
    },
    leave(){

    },
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    // 关闭
    closeInnerDialog() {
      this.innerDialog = false
    },
    // 关闭手工上报
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    over(index){
      this.doctor_list.forEach(value=>{
        value.border='';
        value.back='';
      })
      // if( this.doctor_list.length){
      //   this.doctor_list[index].border='1px solid #1989fa';
      // }
    },
    addlist(index){
      this.doctor_list.forEach(value=>{
        value.border='';
        value.back='';
      })
      this.listIndex=true;
      this.doctor_list[index].border='1px solid #1989fa';
      this.selectionData.push(this.doctor_list[index])
      this.Action = this.selectionData[0]
      this.Name=this.doctor_list[index].customerName;
      this.dist=this.doctor_list[index];
      // this.customer='first'
      this.activeName='first'
      localStorage.setItem('doctorList',JSON.stringify(this.doctor_list[index]))
    },
    handleClick(val) {
       if(this.listIndex===false){
        this.activeName=''
          this.$message.warning('请选择客户');
          return
      }

       this.dentalWorkflag=val
      this.uploadXflag=val
    },
    // activeName() {

    // },
    //查询
    search() {
      let datas={
      customerName:this.customName,
      customPhone:this.customphone,
      deptId:this.deptId,
      customCardNumber:this.customNumber,
      doctor:this.newdoctor,
     }
     
    this.$api.medical.deptRegnInfolist(datas).then(res => {
      this.doctor_list=res.rows;
    })
    },
    unique(array) {
      const res = new Map()
      return array.filter(function (arr) {
        if (res.has(arr.value)) {
          return false
        } else {
          res.set(arr.value, 1)
          return true
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
// ::v-deep .el-input__inner{
//   height: 25px !important;
// }
* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px !important;
}
.container {
  width: 100%;
  background-color: #e0f0fb;
  // position:fixed;
  // height: 100%;
  //height: 100%;
  //height: 100vh;
  padding: 10px;
  display: flex;

  .leftBox {
    height: 100%;
    border-right: 1px solid #e0f0fb;
    padding: 5px;
    width: 480px;
    position: relative;

    .leftBox-bout {
      height: 500px;
      overflow: auto;
      padding: 10px;
      border: 1px solid #c3ced5;

      &>span {
        display: inline-block;
        width: 85px;
        border: 1px solid #c3ced5;
        border-bottom: transparent;
        font-size: 14px;
        border-right-ru: 4px;
        padding: 4px;
        background-color: #ffffff;
        position: absolute;
        left: 5px;
        margin-top: -38px;
      }

      .card-title {
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 12px;
        margin-bottom: 5px;
      }
    }
  }

  .card-box {
    position: relative;

    .rightSpan {
      position: absolute;
      right: 0;
    }
  }

  .rightBOX {
    width:calc(100% - 496px);
    padding: 20px;

    .rightBOX-top {
      //width: 100%;
      height: 50px;
      //background-color: #5bc0de;
    }
  }
}

::v-deep .el-divider--horizontal {
  margin: 6px 0 !important;
}
</style>
