<template>
  <div>
    <el-form ref="formList" label-width="150px" style="display: flex;padding-top: 30px;justify-content: space-around" :rules="rules" :model="formList" size="mini">
      <div style="width: 45%">
        <el-form-item label="优惠券名称:" prop="couponName">
          <el-input  size="medium" v-model="formList.couponName"  />
        </el-form-item>
<!--        <el-form-item label="优惠券编号:" prop="couponNo">-->
<!--          <el-input v-model="formList.couponNo"  />-->
<!--        </el-form-item>-->
        <el-form-item label="优惠券状态" prop="couponState">
<!--          <el-select  style="width: 100%" v-model="formList.couponState" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="dict in dict.type.coupon_state"-->
<!--              :key="dict.value"-->
<!--              :value="dict.value"-->
<!--              :label="dict.label"-->
<!--            />-->
<!--          </el-select>-->
<!--          <el-switch v-model="formList.couponState" active-color="#409eff" inactive-color="#dcdfe6"-->
<!--                                 style="margin-left: 38px;">-->
<!--                      </el-switch>-->
          <el-radio-group  v-model="formList.couponState"  size="mini">
            <el-radio  label="0">上架</el-radio>
            <el-radio label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用类型" prop="usageType">
          <el-radio-group v-model="formList.usageType" @input="getType" size="mini">
            <el-radio-button label="商品" ></el-radio-button>
            <el-radio-button label="服务"></el-radio-button>
            <el-radio-button label="全场通用" ></el-radio-button>
            <el-radio-button label="指定类型" ></el-radio-button>
            <el-radio-button label="指定商品" ></el-radio-button>
          </el-radio-group>
<!--          <el-select size="medium"  style="width: 300px" @change="getType" v-model="formList.usageType" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="dict in dict.type.usage_type"-->
<!--              :key="dict.value"-->
<!--              :value="dict.value"-->
<!--              :label="dict.label"-->
<!--            />-->
<!--          </el-select>-->
        </el-form-item>
        <el-form-item v-if="Showtype" label="商品分类" prop="productids">
          <el-select  size="medium"  clearable filterable multiple  style="width:360px" v-model="formList.productids" placeholder="请选择">
            <el-option
              v-for="(item,index) in productCategorylists"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="couponType">
<!--          <el-select  style="width:100%" @change="getMoney" v-model="formList.couponType" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="dict in dict.type.coupon_type"-->
<!--              :key="dict.value"-->
<!--              :value="dict.value"-->
<!--              :label="dict.label"-->
<!--            />-->
<!--          </el-select>-->
          <el-radio-group @input="getMoney" v-model="formList.couponType"  size="mini">
            <el-radio  label="1">满减券</el-radio>
            <el-radio label="2">满折券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="满足金额:" prop="meetAmount">
          <el-input size="medium" style="width: 300px" v-model="formList.meetAmount"  />
        </el-form-item>
        <el-form-item label="减少金额:" v-if="!fulldisabled" prop="reduceAmount">
          <el-input style="width: 300px" size="medium" :disabled="fulldisabled" v-model="formList.reduceAmount"  />
        </el-form-item>
        <el-form-item label="券使用说明:" v-if="!fulldisabled">
          <el-input style="width: 500px" :rows="5" size="medium" :disabled="fulldisabled" v-model="remarks" type="textarea" />
        </el-form-item>
        <el-form-item label="优惠券面额(折扣率):" v-if="!discountdisabled" prop="couponValue">
          <el-input style="width: 300px" size="medium" :disabled="discountdisabled" v-model="formList.couponValue"  />
        </el-form-item>
      </div>
      <div style="width: 45%">
        <el-form-item label="兑换次数:" prop="exchangeNumber">
          <el-input  size="medium"  v-model="formList.exchangeNumber"  />
        </el-form-item>
        <el-form-item label="发放数量:" prop="quantity">
          <el-input  size="medium"   v-model="formList.quantity"  />
        </el-form-item>
        <el-form-item  size="medium" label="使用时间类型" prop="useTimeType">
<!--          <el-select  style="width: 100%" @change="getTime" v-model="formList.useTimeType" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="dict in dict.type.useTime_type"-->
<!--              :key="dict.value"-->
<!--              :value="dict.value"-->
<!--              :label="dict.label"-->
<!--            />-->
<!--          </el-select>-->
          <div >
            <el-radio-group v-model="formList.useTimeType" @input="getTime" size="mini">
              <el-radio-button label="固定使用时间"></el-radio-button>
              <el-radio-button label="领取后有效天数"></el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item v-if="!daydisabled" label="领券后有效天数:" prop="effectiveDay">
          <el-input size="medium" style="width:360px"  :disabled="daydisabled" v-model="formList.effectiveDay"  />
        </el-form-item>
        <el-form-item v-if="!timedisabled" label="有效时间:" prop="validity">
          <el-date-picker
            v-model="formList.validity"
            style="width:360px"
            :clearable="true"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="medium"
            :disabled="timedisabled"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item  label="发放时间:" prop="validity1">
          <el-date-picker
            v-model="formList.validity1"
            style="width:360px"
            :clearable="true"
            type="datetimerange"
            size="medium"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>


      </div>


    </el-form>
    <span slot="footer" class="dialog-footer" style="display: flex;justify-content: end;">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini" :loading="submitLoading" @click="submit">保存</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-close" @click="handleClose">关闭</el-button>
      </span>
  </div>
</template>
<script>
import vm from '@/utils/util'
import {todayTime} from "../../../utils/time";
export default {
  name:'couponAdd',
  // dicts: ['discount_type'],
  dicts: ['whether','coupon_state','discount_type','usage_type','useTime_type','coupon_type'],

  mounted() {
    this.deptId = this.$store.getters.departmentId
    let that = this;
    setTimeout(() => {
      // that.type = that.dict.type.discount_type[2];
      // console.log(that.type)
    }, 100);
  },
  created() {
    this.xFlag=this.$route.query.xFlag
    if (this.xFlag==0){
      this.getAdd()
    }else {
      this.couponId=this.$route.query.couponId

      this.getEdit(this.couponId)
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
  data() {
    return {

      formList:{
        couponType:1,
        couponState:1
      },
      remarks:"",
      rules:{
        couponName: [{ required: true, message: '优惠券名称不能为空', trigger: 'blur' }],
        quantity: [{ required: true, message: '发放数量不能为空', trigger: 'blur' }],
        couponState: [{ required: true, message: '优惠券状态不能为空', trigger: 'blur' }],
        meetAmount: [{ required: true, message: '满足金额不能为空', trigger: 'blur' }],
        reduceAmount: [{ required: true, message: '减少金额不能为空', trigger: 'blur' }],
        couponValue: [{ required: true, message: '优惠券面额(折扣率)不能为空', trigger: 'blur' }],
        exchangeNumber: [{ required: true, message: '兑换次数不能为空', trigger: 'blur' }],
        couponType: [{ required: true, message: '优惠券类型不能为空', trigger: 'blur' }],
        surplusNum: [{ required: true, message: '剩余量不能为空', trigger: 'blur' }],
        useTimeType: [{ required: true, message: '使用时间类型不能为空', trigger: 'blur' }],
        effectiveDay: [{ required: true, message: '领券后有效天数不能为空', trigger: 'blur' }],
        validity: [{ required: true, message: '有效开始时间不能为空', trigger: 'blur' }],
        validity1: [{ required: true, message: '发放时间不能为空', trigger: 'blur' }],
        usageType: [{ required: true, message: '适用类型不能为空', trigger: 'blur' }],
        productids: [{ required: true, message: '商品分类不能为空', trigger: 'blur' }],
      },
      timedisabled:false,
      daydisabled:false,
      fulldisabled:false,
      discountdisabled:false,
      productCategorylists:[],
      Showtype:false,
      submitLoading:false,
      xFlag:'',
      couponId:''
    }
  },
  methods: {
    getAdd(){
      this.formList={
        couponType:'1',
        couponState:'0',
        useTimeType:"固定使用时间",
        usageType:'全场通用',
        validity:todayTime(),
        validity1:todayTime(),
      couponName:'',
        productids:[],
        meetAmount:'',
        reduceAmount:'',
        couponValue:'',
        exchangeNumber:'',
        quantity:'',
        effectiveDay:'',
      }
      if (this.formList.useTimeType=='固定使用时间'){
        this.daydisabled=true
        this.timedisabled=false
        this.rules.validity=[{ required: true, message: '有效开始时间不能为空', trigger: 'blur' }]
        this.rules.effectiveDay=[]

      }else if (this.formList.useTimeType=='领取后有效天数') {
        this.timedisabled=true
        this.daydisabled=false
        this.rules.validity=[]
        this.rules.effectiveDay=[{ required: true, message: '领券后有效天数不能为空', trigger: 'blur' }]

      }
      if (this.formList.couponType==1){
        this.discountdisabled=true
        this.fulldisabled=false
        this.rules.couponValue=[]
        this.rules.meetAmount=[{ required: true, message: '满足金额不能为空', trigger: 'blur' }]
        this.rules.reduceAmount=[{ required: true, message: '减少金额不能为空', trigger: 'blur' }]
      }else if (this.formList.couponType==2) {
        this.fulldisabled=true
        this.discountdisabled=false
        this.rules.meetAmount=[]
        this.rules.reduceAmount=[]
        this.rules.couponValue=[{ required: true, message: '优惠券面额(折扣率)不能为空', trigger: 'blur' }]


      }
    },
    getEdit(val){
      this.$api.modules.coupon.couponInfo(val).then(res=>{
        if (res.code==200){

          this.formList=res.data
          if (res.data.usageType==1){
            this.formList.usageType='商品'
          }else if (res.data.usageType==2){
            this.formList.usageType='服务'
          }else if (res.data.usageType==3){
            this.formList.usageType='全场通用'
          }else if (res.data.usageType==4){
            this.formList.usageType='指定类型'
            this.productCategorylist()
            this.Showtype=true
          }else {
            this.Showtype=true
            this.formList.usageType='指定商品'
            this.getproductInfo()
          }
          if (res.data.useTimeType==1){
            this.formList.useTimeType='固定使用时间'
          }else {
            this.formList.useTimeType='领取后有效天数'
          }
          this.formList.productids=res.data.productids?res.data.productids.split(','):''
          if (res.data.useTimeType=='固定使用时间'){
            this.daydisabled=true
            this.timedisabled=false
            this.rules.validity=[{ required: true, message: '有效开始时间不能为空', trigger: 'blur' }]
            this.rules.effectiveDay=[]

          }else if (res.data.useTimeType=='领取后有效天数') {
            this.timedisabled=true
            this.daydisabled=false
            this.rules.validity=[]
            this.rules.effectiveDay=[{ required: true, message: '领券后有效天数不能为空', trigger: 'blur' }]
          }
          if (res.data.couponType==1){
            this.discountdisabled=true
            this.fulldisabled=false
            this.rules.couponValue=[]
            this.rules.meetAmount=[{ required: true, message: '满足金额不能为空', trigger: 'blur' }]
            this.rules.reduceAmount=[{ required: true, message: '减少金额不能为空', trigger: 'blur' }]
          }else if (res.data.couponType==2) {
            this.fulldisabled=true
            this.discountdisabled=false
            this.rules.meetAmount=[]
            this.rules.reduceAmount=[]
            this.rules.couponValue=[{ required: true, message: '优惠券面额(折扣率)不能为空', trigger: 'blur' }]
          }
          this.formList.validity=[res.data.validityStartTime,res.data.validityEndTime]
          this.formList.validity1=[res.data.releaseStartTime,res.data.releaseEndTime]
          console.log(this.formList.validity,'this.formList.validity')
        }
      })


    },
    // 保存
    submit(){
      this.$refs.formList.validate(valid => {
        if (valid) {
          const query={
            couponName:this.formList.couponName,
            // couponNo:this.formList.couponNo,
            couponState:this.formList.couponState,
            // couponState:this.formList.couponState==true?'0':'1',
            couponType: this.formList.couponType,
            effectiveDay:this.formList.effectiveDay,
            exchangeNumber:this.formList.exchangeNumber,
            // integralAmount:this.formList.integralAmount,
            // integralFlag:this.formList.integralFlag,
            meetAmount:this.formList.meetAmount,
            couponValue:this.formList.couponValue,
            quantity:this.formList.quantity,
            // receiveQuantity:this.formList.receiveQuantity,
            reduceAmount:this.formList.reduceAmount,
            // surplusNum:this.formList.surplusNum,
            usageType:this.formList.usageType=='商品'?'1':(this.formList.usageType=='服务'?'2':this.formList.usageType=='全场通用'?'3':this.formList.usageType=='指定类型'?'4':'5'),
            useTimeType:this.formList.useTimeType=='固定使用时间'?'1':'2',
            validityStartTime:this.formList.validity?this.formList.validity[0]:'',
            validityEndTime:this.formList.validity?this.formList.validity[1]:'',
            releaseStartTime: this.formList.validity1?this.formList.validity1[0]:'',   //发放时间开始
            releaseEndTime:this.formList.validity1?this.formList.validity1[1]:'',       //发放时间结束
            couponId:this.formList.couponId?this.formList.couponId:null,
            deptId:this.deptId,
            productids:this.formList.productids?this.formList.productids.toString():'',
            remarks:this.remarks
          }
          this.submitLoading=true
          if (this.xFlag==0){
            this.$api.modules.coupon.couponInfoAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.closeTag()
                this.submitLoading=false
              }else {
                this.dialogVisible=false
              }
            })
          }else if(this.xFlag==1){
            this.$api.modules.coupon.couponInfoEdit(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.closeTag()
                this.submitLoading=false
              }else {
                this.dialogVisible=false
              }
            })
          }
        }
      })
    },

    handleClose(){
      this.closeTag()
    },
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 分类管理列表
    productCategorylist(){
      let data = {
        deptId: this.deptId,
      }
      this.$api.confinementRoom.productCategorylist(data).then(res => {
        res.rows.forEach(item=>{
          item.label=item.categoryName
          item.value=item.categoryId.toString()
        })
        this.productCategorylists = res.rows;
      })
    },
    getTime(val){
      if (val=='固定使用时间'){
        this.daydisabled=true
        this.timedisabled=false
        this.rules.validity=[{ required: true, message: '有效开始时间不能为空', trigger: 'blur' }]
        this.rules.effectiveDay=[]

      }else if (val=='领取后有效天数') {
        this.timedisabled=true
        this.daydisabled=false
        this.rules.validity=[]
        this.rules.effectiveDay=[{ required: true, message: '领券后有效天数不能为空', trigger: 'blur' }]

      }
    },
    getMoney(val){
      if (val==1){
        this.discountdisabled=true
        this.fulldisabled=false
        this.rules.couponValue=[]
        this.rules.reduceAmount=[{ required: true, message: '减少金额不能为空', trigger: 'blur' }]
      }else if (val==2) {
        this.fulldisabled=true
        this.discountdisabled=false
        this.rules.reduceAmount=[]
        this.rules.couponValue=[{ required: true, message: '优惠券面额(折扣率)不能为空', trigger: 'blur' }]


      }
    },
    getType(val){
      this.formList.productids=[]
    // }
      if (val=='指定类型'){
        this.Showtype=true
        this.productCategorylist()
      }else if(val=='指定商品') {
        this.Showtype=true
        this.getproductInfo()
      }else {
        this.Showtype=false
      }
    },
    // 商品管理列表
    getproductInfo(){
      let data = {
        deptId: this.deptId,
      }
      this.$api.confinementRoom.productInfo(data).then(res => {
        res.rows.forEach(item=>{
          item.label=item.projectName
          item.value=item.productId
        })
        this.productCategorylists = res.rows;
      })
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
    add(index) {
      this.newlist.forEach(value => {
        value.back = '';
        value.color = '';
      })
      this.Indexs = this.newlist[index].index
      this.newlist[index].back = '#1890ff'
      this.newlist[index].color = '#fff'
    },
    addlist(index) {
      this.list.forEach(value => {
        value.back = '';
        value.color = '';
      })
      this.Index = this.list[index].index;
      this.list[index].back = '#1890ff'
      this.list[index].color = '#fff'
    }
  }
}
</script>

<style scoped>
* {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
  font-size: 14px;
}

::v-deep .el-input-number__decrease {
  display: none !important;
}

::v-deep .el-input-number__increase {
  display: none !important;
}

.bottom {
  position: fixed;
  width: 100%;
  height: 80px;
  bottom: 0;
  background-color: #fff;
  z-index: 1000;
  display: flex;
  align-items: center;

  justify-content: center;
}

.discount_children {
  width: 800px;
  height: 40px;
  /* border: 1px solid black; */
  line-height: 40px;
  padding-left: 100px;
  margin-top: 20px;
}

.discount {
  width: 100%;
  height: 100%;
  position: fixed;
  /* border: 1px solid black; */
  display: flex;
}

.discount_left {
  width: 50%;
  height: 100%;
  margin-top: 20px;
  /* border: 1px solid red; */
}

.discount_right {
  width: 50%;
  height: 100%;
  margin-top: 20px;
  /* border: 1px solid red; */
}

.children span {
  height: 20px;
  display: inline-block;
  border: 1px solid #eee;
  padding: 5px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;

}
</style>