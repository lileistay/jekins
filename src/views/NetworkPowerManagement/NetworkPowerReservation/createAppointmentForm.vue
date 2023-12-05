<template>
  <!--创建预约单-->

  <div>

    <sg-table
      v-if="true"
      size="mini"
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#f5eae4'}"
      @table-current-change="handleCurrentChange"
    >
      <div slot="searchBar">
        <el-form
          ref="form"
          inline
          size="mini"
          :rules="rules"
          :show-message=false
          :model="form"
          @submit.native.prevent="getData"
        >
          <el-form-item label="手机号码" prop="userPhone">
            <el-input
              v-model="form.userPhone"
              placeholder="请输入顾客手机号码"
              clearable

            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click.stop.native="getData" >查询</el-button>
            <el-button
              v-has-permi="['share:roomTypeInfo:list']"
              icon="el-icon-plus"
              :disabled="!creatFile"

             @click="gialogShow"
            >建档
            </el-button>
<!--            :disabled="!isSearchPhone"-->
<!--            @click.stop.native="goToConsult('/consultInput',{phone:form.userPhone})"-->
          </el-form-item>
        </el-form>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'customerName'">
          <a :class="data.custom.arrivalTime!==null?'isArrive':''" @click="detailsclick(data.custom.id,data.custom)">
            {{ data.custom.customerName }}
          </a>
        </div>
        <div v-else-if="data.props === 'degreeIntention'">
          <show-dict-data :options="dict.type.degree_intention_list" :value="data.custom.degreeIntention" />
        </div>
      </template>
      <div slot="header" style="width: 100%;" class="header">
        <!-- 试试看 -->
        <div><span style="margin-right:15px">网电预约</span><span class="color-block-success" /> 已到顾客</div>
        <div>
          <el-button
            v-hasPermi="['share:customerInfo:add']"
            size="mini"
            type="primary"
            plain
            icon="el-icon-plus"
            @click.stop.native="goToBuildRecord('/buildRecord')"
          >添加预约</el-button>
        </div>
        <!-- <el-form class="headerTopPadding"
                 style="float: left">
          <el-form-item label="网电预约">
            <span class="color-block-success" /> 已到顾客
          </el-form-item>
        </el-form> -->
        <!-- <el-button size="mini"
                   type="primary"
                   plain
                   icon="el-icon-plus"
                   style="float: right;margin-top: 26px;margin-right: 20px"
                   @click.stop.native="goToBuildRecord('/build-record')">添加预约</el-button> -->
      </div>
    </sg-table>
    <sgDialog title="请选择建档公司" size="400px" :dialog="showDialog" v-if="showDialog" @handleClose="showDialog=false">
      <div slot="out">
        <el-form ref="deptform" :model="deptform" size="mini" :rules="deptRules" label-width="95px" label-position="right">
          <el-form-item label="公司名称" prop="dept">
          <el-select v-model="deptform.dept" style="width: 100%;"   placeholder="请选择" filterable>
            <el-option
              v-for="(item,index) in deptList"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
              :disabled="item.disabled">
            </el-option>
          </el-select>
          </el-form-item>
          <div style="text-align: right"><el-button size="mini" type="primary"  @click.stop.native="goToConsult({phone:form.userPhone,deptId:deptform.dept})">去建档</el-button></div>

        </el-form>
      </div>
    </sgDialog>
      </div>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import { validPhone } from '@/utils/validate'
import ChoiceMechanism from '@/layout/components/HeaderBar/choiceMechanism1'
import {forEach} from "mathjs";
import deptId from "../../../api/index/deptId";
import fa from "element-ui/src/locale/lang/fa";
export default {
  name: 'BookForm',
  dicts: ['degree_intention_list'],
  components: { SgTable ,ChoiceMechanism,sgDialog},
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value !== undefined) {
        const valid = validPhone(value)
        if (!valid) {
          callback(new Error('手机号码格式不正确'))
        }
        callback()
      }
    }
    return {

      // 搜索手机号码
      form: {
        userPhone: undefined
      },
      rules: {
        userPhone: [
          { required: true, message: '请输入合法手机号', trigger: 'change' },
          { validator: validatePhone, trigger: 'blur' },
          { validator: validatePhone, trigger: 'change' }
        ]
      },
      deptRules:{
        dept: [
          { required: true, message: '请选择公司', trigger: 'change' },
        ]
      },
      isSearchPhone: false,
      showDataDialog: false,
      tableData: [],
      rowTable: undefined,
      istrue:false,
      columns: [
        {
          lab: '建档时间',
          val: 'createTime',
          width: 180
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '正式客户',
          val: 'formalCustomerName'
        },
        {
          lab: '是否到院',
          val: 'isReachCourtyardName'
        },
        {
          lab: '到院时间',
          val: 'arrivalTime',
          width: 180
        },
        {
          lab: '公司',
          val: 'deptName',
          width: 120
        },
        {
          lab: '预产期',
          val: 'preProduction'
        },
        {
          lab: '线上客服',
          val: 'onlineUserName'
        },
        {
          lab: '网电回访人',
          val: 'visituserName'
        },
        {
          lab: '美学顾问',
          val: 'receptionName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '是否黑名单',
          val: 'blacklistName'
        },
        {
          lab: '预约时间',
          val: 'appointmentTime',
          width: 180
        },
        {
          lab: '预约状态',
          val: 'appointmentName'
        },
        {
          lab: '意向度',
          val: 'degreeIntention',
          custom: 'degreeIntention',
          width: 260
        }
      ],
      operate: {},
      deptList:[],
      showDialog:false,
      deptform:{},
      creatFile:false
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
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.form.userPhone = this.$route.query.phone
    // const this_ = this
    // // 点击回车后事件
    // document.onkeydown = function(e) {
    //   if (e.keyCode === 13) {
    //     this_.getData()
    //   }
    // }
  },
  methods: {
    gialogShow(){
      if (this.tableData.length==0 && this.deptList.length>=2){
        this.showDialog=true
      }else {
        if (this.deptList.length==1 ){
          this.$router.push({path:'/consultInput'})
          const query={
            phone:this.form.userPhone,
            deptId:this.deptList[0].deptId
          }
          sessionStorage.setItem('consultInputitem',JSON.stringify(query))
        }else {
          this.showDialog=true
        }
      }
    },
    getdeptList(){
      this.$api.dept.deptList({ status: '0' }, 'get').then(res => {
        if (res) {
          res.data.forEach(item=>{
            let list=[]
            list=item.ancestors.split(',')
            item.list=list
            if (list.length==4){
              item.ancestorsId=Number(list[item.list.length-1])
              this.tableData.forEach(val=>{
                if (val.deptId==item.deptId){
                  item.disabled=true
                }
              })
              this.deptList.push(item)
              console.log()
              if (this.tableData.length==1 && this.deptList[0].disabled==this.tableData[0].disabled){
                this.creatFile=true
              }else if (this.tableData.length>=1){
                let isSame= this.deptList.every(item => this.deptList.every(it => it.disabled == item.disabled ? true : false));
                if (isSame) {
                  //数组元素的值相等代码块
                  this.creatFile=true
                } else {
                  //数组元素的值不相等，给错误提示
                  this.creatFile=true
                }
              }
            }
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    detailsclick(id, val) {
      if (val.isReachCourtyardName === '否') {
        this.$router.push({ path: 'notInHospital', query: { id }})
      } else {
        if (val.formalCustomerName === '否') {
          const customerStatus = 1
          this.$router.push({ path: 'customerInfo', query: { id, status: customerStatus, noDeal: val.isDeal }})
        }
      }
    },
    goToBuildRecord(path) {
      if (this.rowTable === undefined) {
        this.$message.warning('请先选择需要预约的顾客')
        return false
      } else if (this.rowTable !== undefined && this.rowTable.appointmentName === '已预约') {
        this.$message.warning('当前顾客已有预约,不可重复添加')
        return false
      }
      this.$router.push({ path: path, query: { id: this.rowTable.id }})
    },
    goToConsult( query) {
      this.$refs.deptform.validate(valid => {
          if (valid) {
            this.$router.push({ path: '/consultInput'})
            sessionStorage.setItem('consultInputitem',JSON.stringify(query))
          }
      })

    },
    // 查询预约信息
    getData() {
      this.deptList=[]
    this.creatFile=true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.istrue=true
          // this.showDataDialog = true
          const data = {
            deptId: this.deptId,
            customPhone: this.form.userPhone
          }
          this.$api.modules.netPower.queryCustomInfo(data).then(res => {
            if (res) {
              this.rowTable = undefined

              if (res.data.length <= 0 ) {
                this.istrue=false
                this.isSearchPhone = true
                this.tableData = []
                this.getdeptList()
              } else {
                setTimeout(()=>{
                  this.istrue=false;
                  this.tableData = res.data
                  this.getdeptList()
                  this.isSearchPhone = false
                },500)
         
              }


            }
          }).finally(() => {
            this.showDataDialog = false
          })
        } else {
          this.creatFile=false
          this.$message('手机号格式或电话号码格式不正确')
        }
      })
    }
  }
}
</script>

<style >
/* .headerTopPadding{
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
} */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.isArrive {
  color: #1abc9c;
  font-weight: bold;
}

.color-block-success {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #7ec5b7;
  border-radius: 2px;
}
</style>
