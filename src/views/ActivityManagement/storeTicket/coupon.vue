<template>
  <div>

    <!-- 文件列表 -->
    <sg-table
      ref="table"
      id="out-table"
      :sg-ref="'multipleTable'"
      size="mini"
      border
      index="序号"
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      highlight-current-row
      @size-change="sizeChange"

      @current-change="currentChange"
    >
      <div slot="searchBar" class="header-float" >
        <el-form ref="searchList" label-width="120px" style="display: flex;flex-wrap: wrap"  label-position="center" :model="searchList" size="mini">
          <el-form-item label="优惠券名称:" prop="materialName">
            <el-input clearable v-model="searchList.couponName"  />
          </el-form-item>
          <el-form-item label="优惠券状态" prop="useFlag">
            <el-select filterable clearable v-model="searchList.couponState" class="full-width" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.coupon_state"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券类型" prop="useFlag">
            <el-select clearable filterable v-model="searchList.couponType" class="full-width" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.coupon_type"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="适用类型" prop="useFlag">
            <el-select clearable filterable v-model="searchList.usageType" class="full-width" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.usage_type"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="有效时间:" prop="validity">
<!--            <el-date-picker-->
<!--              v-model="searchList.validity"-->
<!--              style="width:180px"-->
<!--              :clearable="true"-->
<!--              type="datetimerange"-->
<!--              format="yyyy-MM-dd HH:mm:ss"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              :disabled="timedisabled"-->
<!--              :default-time="['00:00:00', '23:59:59']"-->
<!--            />-->
            <el-date-picker
              v-model="searchList.validity" class="inputWidth"
              type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px" />
          </el-form-item>
          <div style="margin-left: 20px">
            <el-button size="mini"  type="primary" icon="el-icon-search" @keydown.enter.native="getList(true)" @click.stop="getList(true)">查询</el-button>
          </div>
        </el-form>
      </div>
      <div slot="header" style="width: 100%;">
        <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
        <div style="float: right;">
          <el-button size="mini"  type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button>
          <el-button size="mini"   type="success" plain icon="el-icon-upload2"  :loading="submitLoadings" @click="exportExcel">导出</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'couponState'">
          <dict-tag :options="dict.type.coupon_state" :value="data.custom.couponState" />
        </div>
        <div v-if="data.props === 'couponType'">
          <dict-tag :options="dict.type.coupon_type" :value="data.custom.couponType" />
        </div>
        <div v-if="data.props === 'integralFlag'">
          <dict-tag :options="dict.type.whether" :value="data.custom.integralFlag" />
        </div>
        <div v-if="data.props === 'usageType'">
          <dict-tag :options="dict.type.usage_type" :value="data.custom.usageType" />
        </div>
        <div v-if="data.props === 'useTimeType'">
          <dict-tag :options="dict.type.useTime_type" :value="data.custom.useTimeType" />
        </div>
        <div v-if="data.props === 'edit'">
          <el-button type="text" style="color: #409b45" size="mini" @click="copypath(data.custom)">复制路径</el-button>
          <el-button type="text" style="color: #E6A23C" size="mini" @click="edit(data.custom)">修改</el-button>
          <el-button type="text" style="color: #F56C6C" size="mini" @click="deletes(data.custom.couponId)">删除</el-button>
        </div>
      </template>
    </sg-table>
    <!--新增-->
    <sgDialog
      :title="xFlag==0?'新增':'修改'"
      :dialog="dialogVisible"
      size="500px"
      @handleClose="handleClose"
      v-if="dialogVisible"
    >
      <div slot="out">
        <el-form ref="formList" label-width="150px"  :rules="rules" :model="formList" size="mini">
          <el-form-item label="优惠券名称:" prop="couponName">
            <el-input v-model="formList.couponName"  />
          </el-form-item>
          <el-form-item label="优惠券编号:" prop="couponNo">
            <el-input v-model="formList.couponNo"  />
          </el-form-item>
          <el-form-item label="优惠券状态" prop="couponState">
            <el-select filterable style="width: 100%" v-model="formList.couponState" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.coupon_state"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券类型" prop="couponType">
            <el-select  style="width:100%" @change="getMoney" filterable v-model="formList.couponType" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.coupon_type"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="满足金额:" prop="meetAmount">
            <el-input  v-model="formList.meetAmount"  />
          </el-form-item>
          <el-form-item label="减少金额:" v-if="!fulldisabled" prop="reduceAmount">
            <el-input :disabled="fulldisabled" v-model="formList.reduceAmount"  />
          </el-form-item>
          <el-form-item label="优惠券面额(折扣率):" v-if="!discountdisabled" prop="couponValue">
            <el-input :disabled="discountdisabled" v-model="formList.couponValue"  />
          </el-form-item>

          <el-form-item label="兑换次数:" prop="exchangeNumber">
            <el-input v-model="formList.exchangeNumber"  />
          </el-form-item>
          <el-form-item label="发放数量:" prop="quantity">
            <el-input v-model="formList.quantity"  />
          </el-form-item>
          <el-form-item label="使用时间类型" prop="useTimeType">
            <el-select filterable  style="width: 100%" @change="getTime" v-model="formList.useTimeType" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.useTime_type"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!daydisabled" label="领券后有效天数:" prop="effectiveDay">
            <el-input :disabled="daydisabled" v-model="formList.effectiveDay"  />
          </el-form-item>
          <el-form-item v-if="!timedisabled" label="有效开始时间:" prop="validity">
            <el-date-picker
              v-model="formList.validity"
              style="width:100%"
              :clearable="true"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="timedisabled"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
          <el-form-item label="适用类型" prop="usageType">
            <el-select filterable  style="width: 100%" @change="getType" v-model="formList.usageType" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.usage_type"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="Showtype" label="商品分类" prop="productids">
            <el-select filterable clearable multiple style="width: 100%" v-model="formList.productids" placeholder="请选择">
              <el-option
                v-for="(item,index) in productCategorylists"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: end;">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini" :loading="submitLoading" @click="submit">保存</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-close" @click="handleClose">关闭</el-button>
      </span>
    </sgDialog>
  </div>
</template>
<script>
import SgTable from '@/components/Table'
import EditorBar from '@/components/wangeditor'
import sgDialog from '@/components/Dialog'
import { export_table_to_excel } from '@/utils/utils.js'
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from "@/utils/time";
export default {
  name:'coupon',
  dicts: ['whether','coupon_state','discount_type','usage_type','useTime_type','coupon_type'],
  components: {
    SgTable,
    EditorBar,
    sgDialog
  },
  data(){
    return{
      tableData:[],
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', beforeDayTime(1))
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', todayTime())
            }
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', beforeWeek(1))
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', thisWeek())
            }
          },
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', lastMonth())
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', monthData())
            }
          },
          {
            text: '上季度',
            onClick(picker) {
              picker.$emit('pick', lastQuarter())
            }
          },
          {
            text: '本季度',
            onClick(picker) {
              picker.$emit('pick', thisQuarter())
            }
          },
          {
            text: '上年',
            onClick(picker) {
              picker.$emit('pick', lastYear())
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', thisYear())
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
            }
          }
        ]
      },
      columns:[

        {
          lab: '优惠券名称',
          val: 'couponName',
          width: 180

        },
        // {
        //   lab: '跳转地址',
        //   val: 'pathurl',
        //   width: 400
        //
        // },
        {
          lab: '优惠券编号',
          val: 'couponNo',
          width: 150

        },
        {
          lab: '优惠券状态',
          val: 'couponState',
          custom: 'couponState',
          width: 100

        },
        {
          lab: '优惠券类型',
          val: 'couponType',
          custom: 'couponType',
          width: 100

        },

        {
          lab: '领券后有效天数',
          val: 'effectiveDay',
          width: 110
        },

        {
          lab: '兑换次数',
          val: 'exchangeNumber',
        },


        {
          lab: '满足金额',
          val: 'meetAmount',
        },
        {
          lab: '优惠券面额(折扣率)',
          val: 'couponValue',
          width: 150
        },
        {
          lab: '发放数量',
          val: 'quantity',
        },
        {
          lab: '领用数量',
          val: 'receiveQuantity',
        },
        {
          lab: '减少金额',
          val: 'reduceAmount',
        },
        {
          lab: '剩余量',
          val: 'surplusNum',
        },
        {
          lab: '适用类型',
          val: 'usageType',
          custom: 'usageType',
        },
        {
          lab: '使用时间类型',
          val: 'useTimeType',
          custom: 'useTimeType',
          width: 120
        },
        {
          lab: '有效开始时间',
          val: 'validityStartTime',
          width: 150
        },
        {
          lab: '有效结束时间',
          val: 'validityEndTime',
          width: 150
        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit',
          width:150,
          fixed:'right'
        },

      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      dialogVisible:false,
      submitLoading:false,
      form: {
        content: '',
      },
      rangenum:'',
      formList:{
        couponState:'',
        materialName:null,
        weightSort:"",
        useFlag: '',
        productids:[]
      },
      rules:{
        couponName: [{ required: true, message: '优惠券名称不能为空', trigger: 'blur' }],
        couponNo: [{ required: true, message: '优惠券编号不能为空', trigger: 'blur' }],
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
        usageType: [{ required: true, message: '适用类型不能为空', trigger: 'blur' }],
        productids: [{ required: true, message: '商品分类不能为空', trigger: 'blur' }],
      },
      xFlag:0,
      type:'',
      status:'',
      submitLoadings:false,
      searchList:{
        materialCode:null,
        materialName:null,
        weightSort:"",
        couponState:'0'
      },
      timedisabled:false,
      daydisabled:false,
      fulldisabled:false,
      discountdisabled:false,
      productCategorylists:[],
      Showtype:false,
      XflagType:''

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
      this.deptId = val
      this.getList()
    }
  },
  created() {
    this.getList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getList()
      }
    }
  },
  mounted() {
  },
  methods:{
    // 复制路经功能
    copypath(val){
      if (val.pathurl){
        let oInput = document.createElement('input');
        // 将想要复制的值
        oInput.value = val.pathurl;
        // 页面底部追加输入框
        document.body.appendChild(oInput);
        // 选中输入框
        oInput.select();
        // 执行浏览器复制命令
        document.execCommand('Copy');
        // 将输入框删除
        document.body.removeChild(oInput)
        // 弹出复制成功信息
        this.$message.success('复制成功');

      }else {
        this.$message.error('复制失败');
      }

    },
    getTime(val){
      if (val==1){
        this.daydisabled=true
        this.timedisabled=false
        this.rules.validity=[{ required: true, message: '有效开始时间不能为空', trigger: 'blur' }]
        this.rules.effectiveDay=[]

      }else if (val==2) {
        this.timedisabled=true
        this.daydisabled=false
        this.rules.validity=[]
        this.rules.effectiveDay=[{ required: true, message: '领券后有效天数不能为空', trigger: 'blur' }]

      }
    },
    getMoney(val){
      console.log(val,'aaaa')
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
      this.XflagType=val
      // this.productCategorylists=[]
      if (val==4){
        this.Showtype=true
        this.productCategorylist()
      }else if(val==5) {
        this.Showtype=true
        this.getproductInfo()
      }
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
    getList(isSearch){
      if (isSearch){
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const query={
        couponName:this.searchList.couponName,
        couponState:this.searchList.couponState,
        couponType:this.searchList.couponType,
        usageType:this.searchList.usageType,
        validityEndTime:this.searchList.validity?this.searchList.validity[1]:'',
        validityStartTime:this.searchList.validity?this.searchList.validity[0]:'',
        // useFlag:this.searchList.useFlag,
        deptId:this.deptId
      }
      this.$api.modules.coupon.couponInfoList({...this.pagination,...query}).then(res=>{
        if (res.code==200){
          res.rows.forEach(value=>{
            value.pathurl=`/page_subject3/pages/coupon/detail?id=${value.couponId}&newdeptId=${this.deptId}`
          })
          this.tableData=res.rows
          this.pagination.total=res.total
        }
      })
    },
    handleClose(){
      this.dialogVisible=false
      this.formList.content=''
    },
    // 新增
    addDialogs(){
      this.$router.push({path:'/couponAdd',query: { xFlag:0 }})
      console.log('gggg')
      // this.xFlag=0
      // this.dialogVisible=true
      // this.formList={}
      // this.formList.couponState='0'
      // this.formList.couponType='1'
      // this.formList.useTimeType='1'
      // this.formList.usageType='3'
      // this.timedisabled=false
      // this.daydisabled=false
      // this.fulldisabled=false
      // this.discountdisabled=false
    },
    // 修改
    edit(val){
      this.$router.push({path:'/couponAdd',query:{xFlag:1,couponId:val.couponId}})
      return
      this.xFlag=1
      this.dialogVisible=true
      this.$api.modules.coupon.couponInfo(val.couponId).then(res=>{
        if (res.code==200){
          this.formList=res.data
          this.formList.productids=res.data.productids.split(',')
          if (this.formList.usageType==4){
            this.Showtype=true
            this.productCategorylist()
          }else if(this.formList.usageType==5) {
            this.Showtype=true
            this.getproductInfo()
          }
          console.log(this.formList,'this.formList===')
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
          if (this.formList.useTimeType==1){
            this.daydisabled=true
            this.timedisabled=false
            this.rules.validity=[{ required: true, message: '有效开始时间不能为空', trigger: 'blur' }]
            this.rules.effectiveDay=[]

          }else if (this.formList.useTimeType==2) {
            this.timedisabled=true
            this.daydisabled=false
            this.rules.validity=[]
            this.rules.effectiveDay=[{ required: true, message: '领券后有效天数不能为空', trigger: 'blur' }]

          }
        }
      })


    },
    // 删除
    deletes(val){
      this.$confirm('是否确认该条数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.coupon.couponInfoDelete(val).then(res => {
          if (res) {
            this.getList()
            this.$message.success(res.msg)
          }
        })
      })
    },
    // 保存
    submit(){
      this.$refs.formList.validate(valid => {
        if (valid) {
          const query={
            couponName:this.formList.couponName,
            couponNo:this.formList.couponNo,
            couponState:this.formList.couponState,
            couponType: this.formList.couponType,
            effectiveDay:this.formList.effectiveDay,
            exchangeNumber:this.formList.exchangeNumber,
            integralAmount:this.formList.integralAmount,
            integralFlag:this.formList.integralFlag,
            meetAmount:this.formList.meetAmount,
            couponValue:this.formList.couponValue,
            quantity:this.formList.quantity,
            receiveQuantity:this.formList.receiveQuantity,
            reduceAmount:this.formList.reduceAmount,
            surplusNum:this.formList.surplusNum,
            usageType:this.formList.usageType,
            useTimeType:this.formList.useTimeType,
            validityStartTime:this.formList.validity?this.formList.validity[0]:'',
            validityEndTime:this.formList.validity?this.formList.validity[1]:'',
            couponId:this.formList.couponId?this.formList.couponId:null,
            deptId:this.deptId,
            productids:this.formList.productids.toString()
          }
          if (this.xFlag==0){
            this.$api.modules.coupon.couponInfoAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisible=false
                this.getList()
              }else {
                this.dialogVisible=false
              }
            })
          }else if(this.xFlag==1){
            this.$api.modules.coupon.couponInfoEdit(query).then(res=>{
              if (res.code==200){
                this.$message.success('操作成功')
                this.dialogVisible=false
                this.getList()
              }else {
                this.dialogVisible=false
              }
            })
          }
        }
      })
    },
    // 导出
    exportExcel() {
      this.submitLoadings=true
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      const query={
        materialCode:this.searchList.materialCode,
        materialName:this.searchList.materialName,
        useFlag:this.searchList.useFlag,
        deptId:this.deptId
      }
      this.$api.modules.coupon.couponInfoExport(query).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '口腔加工材质信息查询列表')
        setInterval(() => {
          this.submitLoadings = false
        }, 5000)
      })
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getList()
    },
  },

}
</script>
<style>

</style>