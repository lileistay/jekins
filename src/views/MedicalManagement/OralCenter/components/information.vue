<template>
  <!--客户信息-->
  <div class="container">
    <div class="container_left">
      <div class="container_left_top">
        <p style="margin-left: 20px;">挂号信息</p>
<!--        <el-button type="primary" size="mini" style="height: 30px;margin-right: 20px;" @click="add">新增拍片叫号</el-button>-->
      </div>
      <div class="container_left_contain">
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span>挂号编号：GH2023060200027</span>
          </div>
          <div class="container_left_flex_right">
            <span style="">挂号人员：</span>
          </div>
        </div>
        <div class="container_left_flex">
          <div class="container_left_flex_left">
            <span>挂号时间：2023-06-02 13:34</span>
          </div>
          <div>
            <span class="container_left_flex_right">挂号备注：{{ list.remark }}</span>
          </div>
        </div>
        <div class="container_left_flex">
          <div class="container_left_flex_left">
            <span>挂号诊断：{{ list.regnDis }}</span>
          </div>
        </div>
      </div>
      <div>
      </div>
      <div class="container_left_top">
        <p style="margin-left: 20px;">客户信息</p>
      </div>
      <div class="container_left_basic">
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span>姓名：<a href="#">{{ newlist.customerName }}</a></span>
          </div>
          <div class="container_left_flex_right">
            <span style="">挂号人员：</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span>电话：{{ newlist.customPhone }}</span>
          </div>
          <div class="container_left_flex_right">
            <span style="">年龄：{{ newlist.customAge }}</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span>卡号：{{ newlist.customCardNumber }}</span>
          </div>
          <div class="container_left_flex_right">
            <span style="">生日：{{ newlist.birthday }}</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span>口腔病历：</span>
          </div>
          <div class="container_left_flex_right">
            <span style="">体重（kg）：暂无</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span>门诊病历： <el-button type="text" size="mini" @click="edit">修改</el-button></span>
          </div>
          <div class="container_left_flex_right">
            <span style="">职业：{{ occup(newlist.occupation) }}</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span> 美学顾问：{{ newlist.rdName }}</span>
          </div>
          <div class="container_left_flex_right">
            <span style="">婚姻状况：{{ marriag(newlist.marriageType) }}</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span> 国家/地区：{{ newlist.country }}</span>
          </div>
          <div class="container_left_flex_right">
            <span style="">邮编：</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span> 省份：{{ newlist.province }}</span>
          </div>
          <div class="container_left_flex_right">
            <span style="">地址：{{ newlist.addr }}</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span> 市县：{{ newlist.city }}</span>
          </div>
        </div>
        <div style="" class="container_left_flex">
          <div class="container_left_flex_left">
            <span> 区：{{ newlist.area }}</span>
          </div>
        </div>



      </div>
    </div>
    <div class="container_right">
      <div style="height: 30px;display: flex;align-items: center;padding-left: 20px;">
        <span>近期治疗排期</span>&emsp;<div style="width: 15px;height: 15px;background-color:#ff0000 ;"></div>
        <span style="margin-left: 10px;">有退款</span>
        <div style="width: 15px;height: 15px;background-color:#008000 ;margin-left: 10px;"></div><span
          style="margin-left: 10px;">已安排</span>
      </div>
      <div class="table">
        <sg-table
          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          size="mini"
          border
          index="序号"
          :table-data="listzl"
          :columns="columns"
          :row-class-name="tableRowClassName"
          :hideSearchBar="true"
        >
        </sg-table>
      </div>
    </div>
    <sgDialog title="新增拍片叫号" size="30%" out-top="2%" :dialog="showDialogtooth" @handleClose="closeRoomDialogtooth">
      <div slot="out" style="height:210px">
        <span style="margin-left: 40px;">客户姓名：</span> <el-input size="mini" :disabled="true" style="width: 180px;">{{
          newlist.customerName }}</el-input>
        <p></p>
        <span style="margin-left: 40px;">业务类型：</span>
        <el-select filterable clearable v-model="newstatus" size="mini" style="width: 120px;margin-top: 20px;width: 180px;margin-left: 5px;">
          <el-option v-for="item in status" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <p></p>
        <div style="display: flex;margin-top: 20px;">
          <span style="margin-left: 40px;">备注：</span>
        <el-input size="mini" type="textarea"  style="width: 300px;margin-left: 30px;">{{
          newlist.customerName }}</el-input>
        </div>

        <div class=""
          style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="ok">确定</el-button>
            <el-button @click="closeRoomDialogteeth">取消</el-button>
          </div>
          </div>
      </div>
    </sgDialog>
    <sgDialog title="新增拍片叫号" size="30%" out-top="2%" :dialog="showDialogtooths" @handleClose="closeRoomDialogtooths">
      <div slot="out" style="height:120px">

      <span style="margin-left: 40px;">
        <span style="color: red;">*</span>门诊病历
      </span>
      <el-input v-model="Names" style="width: 200px;margin-left: 20px;" size="mini"></el-input> <el-button type="primary" size="mini" style="margin-left: 20px;">生成</el-button>
        <div class=""
          style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="oks">确定</el-button>
            <el-button @click="closeRoomDialogteeths">取消</el-button>
          </div>
          </div>
        </div>
        </sgDialog>
  </div>
</template>

<script>
import sgDialog from '@/components/Dialog/index'
import SgTable from '@/components/Table'
import { thisQuarter } from '../../../../utils/time';
export default {
  name: 'Information',
  components: {
    sgDialog,
    SgTable
  },
  dicts: ['economic_capacity', 'whether_deal', 'whether_Newguest', 'occupation', 'marital_status', 'whether', 'mutual_relationship', 'degree_intention_list'],
  data() {
    return {
      showDialogtooth: false,
      showDialogtooths:false,
      Names:"",
      newstatus: "",
      status: [
        {
          value: "0",
          label: '拍片'
        },
        {
          value: "1",
          label: '治疗'
        },

      ],
      tableData: [{
        name: "12121"
      }],
      list: '',
      newlist: {},
      listzl: [],
      columns:[
        {
          val:'checkoutTime',
          lab:'结账日期',
          width:140
        },
        {
          val:'projectName',
          lab:'项目名称',
          width: 120
        },
        {
          val:'doctorName',
          lab:'医生'
        },
        {
          val:'acName',
          lab:'美学顾问'
        },
        {
          val:'quantitySum',
          lab:'总次数'
        },
        {
          val:'treatmentNum',
          lab:'已治疗次数',
          width: 110
        },
        {
          val:'surplusQuantity',
          lab:'剩余次数'
        }
      ]

    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId;
  },
  methods: {
    edit(){
      this.showDialogtooths=true;

    },
    oks(){
      if(this.Names==''){
        this.$message.warning('请输入门诊病历');
        return
      }
      this.showDialogtooths=false;
    },
    closeRoomDialogteeths(){
      this.showDialogtooths=false;
    },
    closeRoomDialogtooths(){
      this.showDialogtooths=false;
    },
    ok(){
      this.showDialogtooth = false
    },
    closeRoomDialogteeth(){
      this.showDialogtooth = false
    },
    add() {
      this.showDialogtooth = true;
    },
    closeRoomDialogtooth() {
      this.showDialogtooth = false
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.state === '1' || row.state === '2') {
        return 'success-row'
      }
    },
    marriag(str) {
      const obj = this.dict.type.marital_status.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    occup(str) {
      const obj = this.dict.type.occupation.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
  },
  watch: {
    'dist': {
      deep: true,
      handler: function (newV) {
        this.list = newV;
        this.$api.user.customerCmt(this.list.id).then(res => {
          this.newlist = res.data;
        })
        this.$api.medical.skinTriageList({ customerName: this.list.customerName, deptId: this.deptId, billingDepartment: '38' ,id:this.list.id}).then(res => {
          this.listzl = res.rows;
        })
      }
    }
  },
  props: ['dist']
}
</script>

<style scoped lang="scss">
::v-deep .success-row {
  background-color: #c6f9c3;

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
  //box-shadow: inset 0 0 5px #999;
  background: transparent;
  //border-radius: 2px;
}

.table {
  width: 95%;
  height: 600px;
  // border: 1px solid red;
  overflow: scroll;
}

.container_right {
  width: 50%;
  height: 600px;
  margin-left: 10px;
  // border: 1px solid black
}

.container_left_basic {
  min-height: 400px;
  background-color: #ffffff;
  border: 1px solid transparent;
}

.container_left_flex_left {
  width: 300px;
  padding-left: 20px;
}

.container_left_flex_right {
  width: 160px;
  padding-left: 20px;
}

.container_left_flex {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.container_left_contain {
  min-height: 100px;
  background-color: #ffffff;
  border: 1px solid transparent;
}

.container_left_top {
  height: 40px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.container_left {
  width: 50%;
  min-height: 600px;
  // border: 1px solid red;
}

.container {
  display: flex;
  // justify-content:space-around;
  min-height: 600px;
  // border: 1px solid black;
}

.box-left {
  width: 40%;
  margin: 0 10px;

  //border: 1px solid #c3ced5;
  .box-register {
    height: 200px;
    margin-bottom: 5px;
    border: 1px solid #c3ced5;
    background-color: #ffffff;

    p {
      height: 35px;
      background-color: #ebfaff;
      line-height: 35px;
      text-indent: 2em;

    }

    .box-buttom {
      padding-left: 20px;
    }
  }

  .box-customer {
    height: 500px;
    border: 1px solid #c3ced5;
    background-color: #ffffff;

    p {
      height: 35px;
      background-color: #ebfaff;
      line-height: 35px;
      text-indent: 2em;

    }
  }
}

.box-right {
  flex: 1;
  border: 1px solid #c3ced5;

  .title {
    height: 35px;
    line-height: 35px;
    background-color: #ebfaff;
    text-indent: 1em;

    & span {
      font-size: 12px;
      margin: 0 15px;

      i {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
    }
  }

}
</style>
