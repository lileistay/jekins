<template>
  <!-- 放射治疗 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="getData(true)" @click="getData(true)">查询</el-button>
        <el-button
          v-has-permi="['confinement:healthcareManagement:export']"
          size="mini"
          type="success"
          :plain="true"
          icon="el-icon-d-arrow-right"
          @click="newexport"
        >导出</el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          id="table_out"
          ref="table"
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          :selection="true"
          :border="true"
          index="序号"
          :highlight-current-row="true"
          :table-data="tableData"
          :columns="columns"
          :row-class-name="rowClassName"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
        >
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
              <span><i style="background-color: #ffffff" />已安排</span>
              <span><i style="background-color: #ffff00" />已取消</span>
              <span><i style="background-color: #c6f9c3" />已治疗</span>
            </div>
            <div>
              <!-- <el-button size="mini" plain type="primary" icon="el-icon-s-promotion">发送短信</el-button> -->
              <!--              <el-button size="mini" plain type="primary" icon="el-icon-plus">手工上报</el-button>-->
              <!--              <el-button size="mini" icon="el-icon-edit-outline" type="success" plain>客户需求</el-button>-->
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="openManualqrcode">扫码签名</el-button>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="openManualDialog">手工上报</el-button>
              <el-button size="mini" :plain="true" type="danger" icon="el-icon-close" @click="cancel">取消治疗</el-button>
              <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click="initiateTreatment">发起治疗</el-button>
              <!--              <el-button size="mini" plain type="primary" icon="el-icon-plus">扫码签名</el-button>-->
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customerName'">
              <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }} </a>
            </div>
            <div v-else-if="data.props === 'state'">
              <show-dict-data :options="dict.type.treatment_type" :value="data.custom.state" />
            </div>
            <div v-else-if="data.props === 'treatmentStatus'">
              <show-dict-data :options="dict.type.treatment_status" :value="data.custom.treatmentStatus" />
            </div>
          </template>
        </sg-table>
      </slot>
    </SlideSearch>
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <sgDialog title="扫码签名" size="500px" out-top="2%" :dialog="qrcode"
              @handleClose="qrcode=false">
      <div slot="out" style="width: 100%;height: 500px">
             <img :src="imgqrcode" style="width: 460px;height: 500px">
      </div>
    </sgDialog>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import {newgetData, todayTime} from '@/utils/time'
import moment from 'moment'
import ManualSubmission from '@/components/ManualSubmission/indexTwo.vue'
import QRCode from "qrcode";
import sgDialog from '@/components/Dialog/index'
export default {
  dicts: ['treatment_type', 'treatment_status'],
  name: 'RadiationTherapy',
  components: {
    ManualSubmission,
    slideSearch,
    SgTable,
    sgDialog 
  },
  data() {
    return {
      // 手工上报
      Action: {},
      imgqrcode:'',
      qrcode:false,
      innerDialog: false,
      showManualDialog: false,
      selectionData: [],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1

      },
      tableData: [],
      showDataDialog: false,
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 120
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '项目',
          val: 'projectName',
          width: 120
        },
        {
          lab: '计划治疗次数',
          val: 'estimateScribingNum',
          width: 120
        },
        {
          lab: '当次治疗次数',
          val: 'thisScribingNum',
          width: 120
        },
        {
          lab: '回访类型',
          val: 'typeName',
          width: 135
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 135
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 135
        },
        {
          lab: '状态',
          val: 'treatmentStatus',
          custom: 'treatmentStatus',
          width: 100
        },
        {
          lab: '治疗状态',
          val: 'state',
          custom: 'state',
          width: 138
        },
        {
          lab: '客户代表',
          val: 'crName',
          width: 135,
          showOverflowTooltip: true
        },
        {
          lab: '医助',
          val: 'assistantName'
        },
        {
          lab: '护士',
          val: 'circulatingName'
        },
        {
          lab: '实际执行人',
          val: 'executorName',
          width: 120
        },
        {
          lab: '服务助理',
          val: 'saName'
        },
        {
          lab: '分诊人',
          val: 'tpName',
          width: 120
        },
        {
          lab: '分诊时间',
          val: 'triagePersonTime',
          width: 150
        },
        {
          lab: '分诊备注',
          val: 'remark',
          width: 120
        },
        {
          lab: '治疗时间',
          val: 'treatStartTime',
          width: 150
        }
      ],
      options: {
        triagePersonTime: {
          type: 'Tdatetime',
          label: '分诊时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        treatmentTime: {
          type: 'Tdatetime',
          label: '治疗时间',
          clearable: true,
          values: []
        },
        customerName: {
          type: 'input',
          label: '客户姓名：'
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号：',
          clearable: true,
          options: []
        },
        projectName: {
          type: 'input',
          label: '项目名称',
          clearable: true,
          options: []
        },
        state: {
          type: 'select',
          label: '治疗状态',
          clearable: true,
          options: []

        },
        treatmentStatus: {
          type: 'select',
          label: '状态',
          clearable: true,
          options: []
        },
        doctorId: {
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        // nursing: {
        //   type: 'select',
        //   label: '护士',
        //   clearable: true,
        //   options: []
        // },
        // 护士
        circulatingNurse: {
          type: 'select',
          label: '护士：',
          clearable: true,
          options: []
        },
        actualExecutorUser: {
          type: 'select',
          label: '实际执行人',
          clearable: true,
          options: []
        },
        serviceAssistant: {
          type: 'select',
          label: '服务助理：',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        // 无
        customerRepresentative: {
          type: 'select',
          label: '客户代表：',
          clearable: true,
          options: []
        },
        typeName: {
          type: 'select',
          label: '回访类型：',
          clearable: true,
          options: []
        },
        // // 无
        // createuserId: {
        //   type: 'select',
        //   label: '是否有退款：',
        //   clearable: true,
        //   options: []
        // },
        totalDoctorId: {
          type: 'select',
          label: '科室归属医生：',
          clearable: true,
          options: []
        }
        // serviceAssistant: {
        //   type: 'selct',
        //   label: '科室归属服务助理：'
        // }
      }
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
      this.getUserList(val)
      // this.getDepartment()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData() // 搜索
    this.getUserList(this.deptId) // 人员
    // this.getDepartment() //获取科室
    this.options.state.options = this.dict.type.treatment_type // 获取治疗状态
    this.options.treatmentStatus.options = this.dict.type.treatment_status // 初复诊
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    openManualqrcode(){
      if(this.selectionData.length==0){
        this.$message.warning('请选择一条数据进行签名');
        return
      }
      this.qrcode=true;
      let that=this;
      const qrCodeCanvas = document.createElement("canvas");
      qrCodeCanvas.width = 460;
      qrCodeCanvas.height = 500;
      QRCode.toCanvas(
        qrCodeCanvas,
        `https://www.crm120.cn/cosmetic?qrcode=1&deductionId=${this.selectionData[0].deductionId}`,
        { width:460, height:500 },
        (any) => {
          that.imgqrcode=qrCodeCanvas.toDataURL("image/png")
        }
      );
    },
    newexport() {
      if (this.tableData.length === 0) {
        this.$message.warning('无数据无法导出')
        return
      }
      const data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }

      const form = {
        departmentId: this.$route.query.departmentId,
        // deductionDepartment: this.$route.query.departmentId,
        deptId: this.deptId,
        customerName: data.customerName, // 姓名
        customPhone: data.customPhone, // 电话
        doctorId: data.doctorId, // 医生
        customCardNumber: data.customCardNumber, // 客户卡号
        totalDoctorId: data.totalDoctorId, // 科室归属医生
        actualExecutorUser: data.actualExecutorUser, // 实际执行医生
        doctorAssistant: data.doctorAssistant, // 医助
        serviceAssistant: data.serviceAssistant, // 服务助理
        circulatingNurse: data.circulatingNurse, // 护士
        aestheticConsultant: data.aestheticConsultant, // 美学顾问
        customerRepresentative: data.customerRepresentative, // 客户代表
        projectName: data.projectName, // 项目名称
        typeName: data.typeName, // 回访类型
        state: data.state, // 治疗状态
        treatmentStatus: data.treatmentStatus, // 治疗状态
        treatmentTime: data.treatmentTime, // 开始治疗时间
        endtreatmentTime: data.endtreatmentTime, // 结束治疗时间
        triagePersonTime: data.triagePersonTime, // 分诊时间
        endtriagePersonTime: data.endtriagePersonTime // 分诊时间下限
      }
      this.$api.medical.selectTreatment(form).then(res => {
        if (res) {
          // res.rows.forEach(item => {
          //   if (item.state === '1' || item.state === '0') {
          //     item.isExecute = '是'
          //   } else {
          //     item.isExecute = '否'
          //   }
          // })
          this.tableData = res.rows
          this.pagination.total = res.total
          // this.form = res.data
        }
      }).finally(() => {
        this.$export('#table_out', '放射治疗')
        this.loadingData = false
      })
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    },
    // 获取数据
    getData: debounce(async function(isSearch) {
      // 取值
      const data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        }
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }
        else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }

      let form = {
        departmentId: this.$route.query.departmentId,
        // deductionDepartment: this.$route.query.departmentId,
        deptId: this.deptId,
        customerName: data.customerName, // 姓名
        customPhone: data.customPhone, // 电话
        doctorId: data.doctorId, // 医生
        customCardNumber: data.customCardNumber, // 客户卡号
        totalDoctorId: data.totalDoctorId, // 科室归属医生
        actualExecutorUser: data.actualExecutorUser, // 实际执行医生
        doctorAssistant: data.doctorAssistant, // 医助
        serviceAssistant: data.serviceAssistant, // 服务助理
        circulatingNurse: data.circulatingNurse, // 护士
        aestheticConsultant: data.aestheticConsultant, // 美学顾问
        customerRepresentative: data.customerRepresentative, // 客户代表
        projectName: data.projectName, // 项目名称
        typeName: data.typeName, // 回访类型
        state: data.state, // 治疗状态
        treatmentStatus: data.treatmentStatus, // 治疗状态
        treatmentTime: data.treatmentTime, // 开始治疗时间
        endtreatmentTime: data.endtreatmentTime, // 结束治疗时间
        triagePersonTime: data.triagePersonTime, // 分诊时间
        endtriagePersonTime: data.endtriagePersonTime // 分诊时间下限
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      form = Object.assign(form, this.pagination)
      this.$api.medical.selectTreatment(form).then(res => {
        if (res) {
          // res.rows.forEach(item => {
          //   if (item.state === '1' || item.state === '0') {
          //     item.isExecute = '是'
          //   } else {
          //     item.isExecute = '否'
          //   }
          // })
          this.tableData = res.rows
          this.pagination.total = res.total
          this.form = res.data
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    // 获取用户
    async  getUserList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      await this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor' || item.postCode === 'therapeutist' || item.postCode === 'chks') {
              this.options.doctorId.options.push(item)
              this.options.circulatingNurse.options.push(item)
              this.options.serviceAssistant.options.push(item)
              this.options.actualExecutorUser.options.push(item)
              this.options.totalDoctorId.options.push(item)
            }
          })
          // 护士
          res.data.forEach(item => {
            if (item.postCode === 'zerennurse') {
              this.options.circulatingNurse.options.push(item)
            }
          })
          // 美学顾问,客户代表
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              // this.options.aestheticConsultant.options.push(item)
              // console.log(this.options.aestheticConsultant,111111111111)
              this.options.aestheticConsultant.options.push(item)
              this.options.customerRepresentative.options.push(item)
            }
          })
          // // 客户代表
          // res.data.forEach(item => {
          //   if (item.postCode === 'gkdb') {
          //     this.options.crName.options.push(item)
          //   }
          // })

          // 去重
          const arr1 = this.unique(res.data)
          // console.log('測試',arr1);
          this.options.doctorId.options = arr1
          this.options.circulatingNurse.options = arr1
          this.options.serviceAssistant.options = arr1
          this.options.actualExecutorUser.options = arr1
          this.options.totalDoctorId.options = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    rowClassName({ row }) {
      if (row.state === '2') {
        return 'success-row'
      } else if (row.state === '0') {
        return 'warning-row'
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/6
     * @Description: 发起治疗
     */
    initiateTreatment() {
      if (this.selectionData.length === 0) {
        this.$message.warning('请选择顾客进行修改')
        return
      }
      // 判断是否是同一个人
      // 对选中的数据取出id 转为set直接去重，判断去重后的set长度，如果大于0表示选中了多个不同客户
      const ids = new Set(this.selectionData.flatMap(item => [item.id]))
      if (ids.size > 1) {
        this.$message.warning('请选择同一个顾客发起批量治疗')
        return
      }
      // 并且选择的数据是否有剩余治疗次数
      const find = this.selectionData.find(item => item.state === '2' || item.state === '0')
      if (find) {
        this.$message.warning('部分项目已治疗或取消，不能发起治疗，请重新选择')
        return
      }
      // 选择的数据存入store,防止后续页面刷新数据丢失
      this.$store.dispatch('setTreatmentSelectionData', this.selectionData)
      this.$router.push({ name: 'InitiateTreatment' })
    },
    cancel() {
      if (this.selectionData.length === 0 || this.selectionData.length > 1) {
        this.$message.warning('请选择一条数据进行取消操作！')
        return
      }
      if (this.selectionData[0].state === '2') {
        this.$message.warning('该顾客已治疗，不可取消！')
      } else if (this.selectionData[0].state === '0') {
        this.$message.warning('该顾客已取消，不可重复取消！')
      } else {
        this.$confirm('是否取消此治疗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.$api.medical.editDeductionRecord({
            deductionId: this.selectionData[0].deductionId,
            waitSource: this.selectionData[0].waitSource,
            caozuoType: '5' // 取消治疗，后端设置state为0
          }).then(res => {
            if (res) {
              this.getData()
              this.$message.success(res.msg)
            }
          })
        })
      }
    },
    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.Action = this.selectionData[0]
      this.showManualDialog = true
    },
    // 打开高级选项
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
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}

i {
  display: inline-block;
  margin-right: 5px;
  width: 10px;
  height: 10px;
}

span {
  font-size: 14px;
  margin-right: 15px;
}

::v-deep .el-table .warning-row {
  background: #ffff00;
}
::v-deep .el-table .success-row {
  background: #c6f9c3;
}
::v-deep .el-table .cancel-row {
  background: #8f9295;
  text-decoration: line-through;
}
@import '../../../styles/globalfloat.css';

</style>
