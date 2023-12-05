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
              <span class="Left">结账时间:</span>
              <el-date-picker
                  v-model="checkoutTime"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="mini" style="width:200px" disabled>
              </el-date-picker>
            </div>

          </div>
          <div class="opacbutton_children">
            <div style="margin-bottom: 10px;">
              <span class="Left">客户姓名:</span>
              <el-input v-model="customerName" style="width: 150px;" size="mini" clearable></el-input>
            </div>
          </div>
          <div class="opacbutton_children">
            <div style="margin-bottom: 10px;">
              <span class="Left">客户卡号:</span>
              <el-input v-model="customCardNumber" style="width: 150px;" size="mini" clearable></el-input>
            </div>
          </div>
          <div class="opacbutton_children">
            <div>
              <span class="Left">客户电话:</span>
              <el-input v-model="customPhone" style="width: 150px;" size="mini" clearable></el-input>
            </div>
          </div>
          <div class="opacbutton_children">
            <div>
              <span class="Left">收费单号:</span>
              <el-input v-model="orderNumber" style="width: 150px;" size="mini" clearable></el-input>
            </div>
          </div>
          <el-button type="primary" size="mini" @click="getData" :disabled="getflag" style="margin-left: 20px">搜索</el-button>
        </div>

      </template>
      <!-- 列表清单及颜色填充 -->
      <template v-slot:statistics_color>
      </template>
      <!-- 右侧按钮填充 -->
      <template v-slot:statistics_button>
      <el-button @click="editasync" type="primary" size="mini" :disabled="getflag" v-has-permi="['payment:orderInfo:modifyAdvisor:edit']">修改业绩顾问</el-button>
      </template>
      <template v-slot:statistics_message>
        <div>

        </div>
      </template>
      <!-- 自定义内容填充 -->
      <template v-slot:tabular="{ data }">
        <div v-if="data.name == 'customerName'">
          <a @click="customerclick(data.id, data)" style="color: #409EFF;cursor: pointer;font-size: 12px;">{{
              data.customerName }}</a>
        </div>
        <div v-if="data.name == 'orderNumber'">
          <a @click="customerclickorderNumber(data)" style="color: #409EFF;cursor: pointer;font-size: 12px;">{{
              data.orderNumber }}</a>
        </div>
        <div v-if="data.name === 'billType'">
          <show-dict-data :options="dict.type.billing_type" :class="data.billType == 11
               || data.billType == 12
               || data.billType == 22
               || data.billType == 13
               || data.billType == 18
               || data.billType == 14
               || data.billType == 15
               || data.billType == 20
               || data.billType == 16
               ? 'redClass' : ''"
                          :value="data.billType" />
        </div>
        <div v-if="data.name === 'paidAmount'">
              <span :class="data.billType == 11
               || data.billType == 12
               || data.billType == 22
               || data.billType == 13
               || data.billType == 18
               || data.billType == 14
               || data.billType == 15
               || data.billType == 20
               || data.billType == 16
               ? 'redClass' : 'redClass1'"> {{ data.paidAmount }}</span>
        </div>
        <div v-else-if="data.name === 'chargeSheetId'">
          <a style="color: #5f94de;cursor: pointer;" @click="customerclickorderNumber(data)">
            {{ data.chargeSheetId }}
          </a>
        </div>
        <div v-if="data.name === 'isPackage'">
          <show-dict-data :options="dict.type.whether" :value="data.isPackage" />
        </div>
        <div v-if="data.name === 'reasonForRefund'">
          <show-dict-data :options="dict.type.refund_reason" :value="data.reasonForRefund" />
        </div>
      </template>
      <template v-slot:company>

      </template>
    </Tree>
    <sgDialog title="修改业绩顾问" size="300px" out-top="2%" :dialog="ayName"
              @handleClose="ayName=false">
      <div slot="out">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="原美学顾问" prop="name">
                <el-input v-model="ruleForm.name" size="mini" disabled></el-input>
              </el-form-item>
              <el-form-item label="现美学顾问" prop="acName">
                <el-select v-model="ruleForm.acName" placeholder="请选择美学顾问" size="mini" >
                  <el-option
                    v-for="item in aestheticConsultant"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
        <div class=""
             style="width: 100%;height: 40px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 0px;display: flex;height: 0px">
            <el-button type="primary" size="mini" @click="oks" style="margin-left: 20px">确定</el-button>
            <el-button @click="ayName=false" size="mini" style="margin-left: 20px">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
  </div>
</template>
<script>
import Tree from '@/components/newTree/index'
import { monthData } from '@/utils/time'
import sgDialog from '@/components/Dialog/index'
export default {
  dicts: ['whether', 'billing_type', 'refund_reason'],
  components: {
    Tree,
    sgDialog,
  },
  created() {
    //模拟数据
    this.$store.dispatch('treedepartment', { treedepartmentId: this.$store.getters.departmentId })
    this.treedeptId = this.$store.getters.treedepartmentId;
    const this_ = this;
    this.checkoutTime=monthData()
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
      Id:"",
      ruleForm:{
        name:'',
        acName:"",
        oldAc:'',
        nowAc:'',
        orderNumber: "",
        jdxxId:'',
      },
      aestheticConsultant:[],
      rules:{
        acName:[
          { required: true, message: '请选择美学顾问', trigger: 'blur' },
        ]
      },
      ayName:false,
      getlist:[],
      getflag:true,
      operaedit:false,
      customerName:'',
      checkoutTime:[],
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
      // value2: new Date(beforeDayTime(0)[0]),
      total: 0,
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
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
          label: '结账时间',
          value: 'checkoutTime',
          width: 180
        },
        {
          label: '收费单编号',
          value: 'orderNumber',
          vals: 'orderNumber',
          width: 165
        },
        {
          label: '客户姓名',
          value: 'customerName',
          vals: 'customerName',
          width: 200,
        },
        {
          label: '电话',
          value: 'customPhone',
          width: 150
        },
        {
          label: '客户卡号',
          value: 'customCardNumber',
          width: 165
        },
        {
          label: '收费单类型',
          value: 'billType',
          vals: 'billType',
          width: 100
        },

        {
          label: '科室',
          value: 'departmentName'
        },
        {
          label: '收银员',
          value: 'cashierName',
          width: 100
        },
        {
          label: '美学顾问',
          value: 'acName',
          width: 120,
          showOverflowTooltip: true
        },
        // {
        //   lab: '是否开发票',
        //   val: '暂无',
        //   width: 100
        // },
        // {
        //   lab: '是否返款',
        //   val: '暂无'
        // },
        {
          label: '折前合计',
          value: 'totalExpenses',
          width: 120,
        },
        {
          label: '费用合计',
          value: 'totalExpenses',
          width: 120,
        },
        {
          label: '实付款',
          value: 'paidAmount', // 合计金额
          vals: 'paidAmount'
        },
        {
          label: '科室业绩',
          value: 'departmentPerformance',
          width: 100
        },
        {
          label: '媒介类型',
          value: 'typeName',
          width: 120
        },
        {
          label: '媒介信息',
          value: 'channelName',
          width: 120
        },
        {
          label: '来源渠道',
          value: 'typeThreeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          label: '结账方式',
          value: 'payNameAmount',
          width: 120,
          showOverflowTooltip: true
        },
        {
          label: '收费备注',
          value: 'billingRemarks',
          width: 120,
          showOverflowTooltip: true
        },
        {
          label: '财务收支金额',
          value: 'paidAmount',
          width: 150
        },
        {
          label: '源单据号',
          value: 'chargeSheetId',
          vals: 'chargeSheetId',
          width: 200
        },
        {
          label: '源单据结账时间',
          value: 'sourceCheckoutTime',
          width: 200
        },
        {
          label: '退款原因',
          value: 'reasonForRefund',
          vals: 'reasonForRefund',
          width: 120,
        },
        {
          label: '是否套餐',
          value: 'isPackage',
          vals: 'isPackage',
          width: 120,
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
      showoperation: false,
      tableIndex: false,
      tableCheckbox: true,
      statisticsMessage: false,
      statistics: true,

    }
  },
  methods: {
    oks(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
         this.ruleForm.nowAc=this.ruleForm.acName
          this.$api.confinementRoom.cName(this.ruleForm).then(res=>{
            if(res){
              this.$message.success(res.msg);
              this.ayName=false;
              this.getData()
            }
          })
        } else {

          return false;
        }
      });
    },
    getUserList(deptId) {
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.aestheticConsultant.push(item)
            }
          })
        }
      })
    },
    customerclickorderNumber(data){
      this.$router.push({ path: 'billDetails' })
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    getData(deptId){
      let data={
        checkoutTime:this.checkoutTime[0],
        endcheckoutTime:this.checkoutTime[1],
        customerName:this.customerName,
        customPhone: this.customPhone,
        orderNumber: this.orderNumber,
        customCardNumber: this.customCardNumber,
        deptId: this.Id,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum
      }
       this.$api.finance.paidList(data).then(res => {
        if (res) {
          this.placeorder = res.data
          this.tableData = res.rows
          this.total = res.total
          // this.summary = res.data
        }
      })
    },
    //修改业绩顾问
    editasync(e){
     if(this.getlist.length==0||this.getlist.length>1){
       this.$message.warning('请选择一条数据进行修改')
       return
     }
     this.ayName=true;
      this.ruleForm.acName=''
     this.ruleForm.name=this.getlist[0].acName;
     this.ruleForm.oldAc=this.getlist[0].aestheticConsultant;
     this.ruleForm.jdxxId=this.getlist[0].jdxxId;
     this.ruleForm.orderNumber=this.getlist[0].orderNumber;

    },
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

    },
    //点击页码
    handleCurrentChange(e) {
      this.pagination.pageNum=e;
      this.getData();
    },

    //点击选择条数
    handleSizeChange(e) {
      this.pagination.pageSize=e;
      this.getData();
    },
    //点击复选框的回调
    handleSelectionChang(row) {
      this.getlist=row;
      // console.log(row,'sadgasd')
    },
    //点击树形三级的回调
    changeCompay(id, item) {
      this.$store.dispatch('treedepartment', { treedepartmentId: id })
      if (!item.children) {
        this.Id=id;
        this.getData(id);
        this.getUserList(id)
        this.getflag=false
      }else{
        this.getflag=true;
      }
    },
    //点击表格每一行的回调
    rowClick(data) {

    }
  }
}
</script>
<style scoped>
::v-deep .el-form-item{
  margin-bottom: 0px;
}
.redClass {
  color: red;
}

.redClass1 {
  color: #606266;
}
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

  height: 30px;
}

.Left {
  margin-right: 10px;
}

.opacbutton {
  display: flex;
  flex-wrap: wrap;
  min-height: 30px;
  /* border: 1px solid black; */
}

.opacbutton_children {
  margin-bottom: 10px;
  height: 20px;
  /* border: 1px solid red; */
}
</style>