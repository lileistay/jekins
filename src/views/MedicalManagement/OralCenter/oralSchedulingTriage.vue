<template>
  <!-- 口腔排期分诊 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" @click.stop="getData" @keydown.enter.native="getData(true)">查询</el-button>
        <el-button v-has-permi="['payment:wforservice:skinTriageList:exportcavity']" size="mini" type="success"
          :plain="true" icon="el-icon-upload2" @click="newexport">导出</el-button>
      </div>
      <slot>
        <sg-table v-if="true" id="out-table" ref="table" :sg-ref="'multipleTable'" :pagination="pagination" size="mini"
          :selection="true" :border="true" index="序号" :highlight-current-row="true" :table-data="tableData"
          :columns="columns" :row-class-name="rowClassName" @size-change="sizeChange" @current-change="currentChange"
          @row-click="rowClick" @selection-change="handleSelectionChange">
          <div slot="searchBar" class="header-float">
            <div>
              <span style="color: #7ec5b7"><i class="el-icon-s-data" />列表清单</span>
              <span><i style="background-color:#ffffff" />未安排</span>
              <span><i style="background-color:#c6f9c3" />已安排</span>
            </div>
            <div>
              <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus"
                @click="openManualDialogs">科室挂号</el-button>
              <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus"
                @click="openManualDialog">手工上报</el-button>
              <!--              <el-button size="mini">科室挂号</el-button>-->
              <!--              <el-button size="mini" :plain="true" type="success" icon="el-icon-plus">手工录入</el-button>-->
              <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click="triage">分诊登记</el-button>
              <!--              <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click="triage1">合并分诊登记</el-button>-->
              <!--              <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click="initiateTreatmentDirect">直接治疗</el-button>-->
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customerName'">
              <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id, data.custom)">{{
                data.custom.customerName }} </a>
            </div>
          </template>
        </sg-table>
      </slot>
    </SlideSearch>
    <manual-submission :show-manual-dialog="showManualDialog" :inner-dialog="innerDialog" :selection-data="selectionData"
      @closeInnerDialog="closeInnerDialog" @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog" />
    <sgDialog title="口腔科室挂号" size="600px" out-top="2%" :dialog="showDialogtooth" @handleClose="closeRoomDialogtooth">
      <div slot="out">
        <div style="margin-left: 30px;">
          <span>客户卡号：</span>
          <el-input size="mini" :disabled="true" v-model="customerNumber" style="width: 200px;margin-left: 10px;">

          </el-input>
        </div>
        <div style="margin-top: 10px;margin-left: 30px;">
          <span>客户电话：</span>
          <el-input size="mini" :disabled="true" v-model="customerphone" style="width: 200px;margin-left: 10px;">

          </el-input>
        </div>
        <div style="margin-top: 10px;margin-left: 30px;">
          <span>客户姓名：</span>
          <el-input size="mini" :disabled="true" v-model="customerName" style="width: 200px;margin-left: 10px;">

          </el-input>
        </div>

        <div style="margin-top: 10px;margin-left: 30px;">
          <span><span style="color:red">*</span> 医生：</span>
          <el-select filterable v-model="newdoctor" placeholder="请选择" size="mini" style="margin-left: 28px;">
            <el-option v-for="item in doctor" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 10px;margin-left: 30px;display: flex;">
          <span> <span style="color:red">*</span> 诊断：</span>
          <el-input size="mini" v-model="regnDis" style="width: 300px;margin-left: 30px;" :rows="3" type="textarea">

          </el-input>
        </div>
        <div style="margin-top: 10px;margin-left: 30px;display: flex;">
          <div>
            <span><span style="color:red">*</span> 备注：</span>
          </div>

          <el-input size="mini" v-model="remark" style="width: 300px;margin-left: 30px;" :rows="3" type="textarea">

          </el-input>
        </div>

        <div style="height: 80px;"></div>
        <div class=""
          style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="ok">确定</el-button>
            <el-button @click="closeRoomDialogteeth">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import moment from 'moment'
import { todayTime } from '@/utils/time'
import sgDialog from '@/components/Dialog/index'
export default {
  components: {
    slideSearch,
    SgTable,
    ManualSubmission,
    sgDialog,
  },
  data() {
    return {
      showDialogtooth: false,
      remark: "",
      regnDis: "",
      customerNumber: "",
      customerNames: "",
      newtableData: [],
      customerphone: "",
      doctor: [],
      customerName: "",
      newdoctor: "",
      showDataDialog: false,
      showManualDialog: false,
      innerDialog: false,
      selectionData: [],
      tableData: [],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
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
          width: 110
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '项目名称',
          val: 'projectName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '购买数量',
          val: 'quantity'
        },
        {
          lab: '产品数量',
          val: 'priceNum'
        },
        {
          lab: '总次数',
          val: 'quantitySum'
        },
        {
          lab: '已治疗次数',
          val: 'treatmentNum',
          width: 135,
          showOverflowTooltip: true
        },
        {
          lab: '剩余次数',
          val: 'surplusQuantity'
        },
        {
          lab: '退款次数',
          val: 'refundNum',
          showOverflowTooltip: true
        },
        // {
        //   lab: '门诊病历',
        //   val: ''
        // },
        // {
        //   lab: '口腔病历',
        //   val: ''
        // },
        {
          lab: '医生',
          val: 'doctorName',
          width: 110,
          showOverflowTooltip: true
        },
        {
          lab: '是否安排',
          val: 'isArrange',
          width: 90
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 130
        },
        // {
        //   lab: '主服务助理',
        //   val: '',
        //   width: 130
        // },
        // {
        //   lab: '产品类型',
        //   val: '',
        //   width: 130
        // },
        {
          lab: '订单编号',
          val: 'orderNumber',
          width: 155
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140
        },
        // {
        //   lab: '客户类型',
        //   val: 'customerNameType'
        // },
        // {
        //   lab: '科室归属医生/服务助理',
        //   val: '',
        //   width: 150
        // },
        {
          lab: '单据明细备注',
          val: 'billingRemarks',
          width: 135,
          showOverflowTooltip: true
        }
      ],
      options: {
        checkoutTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        // createTime: {
        //   type: 'Tdatetime',
        //   label: '建档时间',
        //   clearable: true,
        //   values: []
        // },
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
        card: {
          type: 'input',
          label: '身份证号：',
          clearable: true,
          options: []
        }
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
    }
  },
  created() {
    this.getUserList(this.deptId)
    this.getData();
    this.deptId = this.$store.getters.departmentId;
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }

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
        res.data.forEach(item => {
          //医生
          if (item.postCode === 'doctor') {
            this.doctor.push(item)
          }
        })
      }
    })
  },
  methods: {
    ok() {
      if (this.newdoctor == '') {
        this.$message.warning("请选择医生");
        return
      }
      if (this.remark == '') {
        this.$message.warning("请输入备注");
        return
      }
      if (this.regnDis == '') {
        this.$message.warning("请输入诊断");
        return
      }
      let data = {
        doctor: this.newdoctor,
        remark: this.remark,
        regnDis: this.regnDis,
        id: this.selectionData[0].id,
        deptId:this.deptId,
      }
      this.$api.medical.deptRegnInfo(data).then(res => {
        if (res.code == 200) {
          this.$message.success('挂号成功,请到医生工作站查看')
          this.showDialogtooth = false;
          this.getData(this.deptId)
        }
      })
    },
    closeRoomDialogteeth() {
      this.showDialogtooth = false;
    },
    closeRoomDialogtooth() {
      this.showDialogtooth = false;
    },
    openManualDialogs() {
      if (this.selectionData.length < 1 || this.selectionData.length > 1) {
        this.$message.warning('请选择至少一名顾客科室挂号')
        return
      }
      this.customerName = this.selectionData[0].customerName;
      this.customerphone = this.selectionData[0].customPhone;
      this.customerNumber = this.selectionData[0].customCardNumber
      this.newdoctor = this.selectionData[0].doctorId;
      this.remark = '';
      this.regnDis = ''
      this.showDialogtooth = true;
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 获取数据
    */
    newexport() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
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
      // data.departmentId = this.$route.query.departmentId
      data.billingDepartment = this.$route.query.departmentId
      data = Object.assign(data, this.pagination)
      this.loadingData = true
      this.$api.medical.skinTriageList(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            if (item.state === '1' || item.state === '2') {
              item.isArrange = '是'
            } else {
              item.isArrange = '否'
            }
          })
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '口腔排期分诊')
        this.loadingData = false
      })
    },
    getData() {
      var data = {}
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
      // data.departmentId = this.$route.query.departmentId
      data.billingDepartment = this.$route.query.departmentId
      data = Object.assign(data, this.pagination)
      this.loadingData = true
      this.$api.medical.skinTriageList(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            if (item.state === '1' || item.state === '2') {
              item.isArrange = '是'
            } else {
              item.isArrange = '否'
            }
          })
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus } })
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 分诊登记
    */
    triage() {
      if (this.selectionData.length === 0) {
        this.$message.warning('请选择顾客进行修改')
        return
      }
      // 判断是否是同一个人
      // 对选中的数据取出id 转为set直接去重，判断去重后的set长度，如果大于0表示选中了多个不同客户
      const ids = new Set(this.selectionData.flatMap(item => [item.id]))
      if (ids.size > 1) {
        this.$message.warning('请选择同一个顾客发起批量登记')
        return
      }
      // 选择的数据是否有剩余治疗次数 并且 已经登记的次数是否大于剩余次数
      const find = this.selectionData.find(item => item.surplusQuantity === 0 || item.arrangeNumber >= item.surplusQuantity)
      if (find) {
        this.$message.warning('部分项目剩余治疗次数不足或已登记次数大于剩余次数，无法发起登记，请重新选择或取消旧登记')
        return
      }
      // 选择的数据存储到store,防止登记页面刷新页面数据丢失
      this.$store.dispatch('setTriageSelectionData', this.selectionData)
      this.$router.push({ name: 'TriageRegistrations' })
    },
    triage1() {
      if (this.selectionData.length === 0) {
        this.$message.warning('请选择顾客进行修改')
        return
      }
      // 判断是否是同一个人
      // 对选中的数据取出id 转为set直接去重，判断去重后的set长度，如果大于0表示选中了多个不同客户
      const ids = new Set(this.selectionData.flatMap(item => [item.id]))
      if (ids.size > 1) {
        this.$message.warning('请选择同一个顾客发起批量登记')
        return
      }
      // 选择的数据是否有剩余治疗次数 并且 已经登记的次数是否大于剩余次数
      const find = this.selectionData.find(item => item.surplusQuantity === 0 || item.arrangeNumber >= item.surplusQuantity)
      if (find) {
        this.$message.warning('部分项目剩余治疗次数不足或已登记次数大于剩余次数，无法发起登记，请重新选择或取消旧登记')
        return
      }
      // 选择的数据存储到store,防止登记页面刷新页面数据丢失
      this.$store.dispatch('setTriageSelectionData', this.selectionData)
      this.$router.push({ name: 'TriageRegistration' })
    },
    /**
     * @author Nevin
     * @date 2022/6/6
     * @Description: 发起治疗
     */
    initiateTreatmentDirect() {
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
      const find = this.selectionData.find(item => item.surplusQuantity === 0 || item.arrangeNumber >= item.surplusQuantity)
      if (find) {
        this.$message.warning('部分项目剩余次数不足或剩余次数已被安排，不能直接发起治疗，请重新选择')
        return
      }
      // 选择的数据存入store,防止后续页面刷新数据丢失
      this.$store.dispatch('setDirectTreatmentSelectionData', this.selectionData)
      this.$router.push({ name: 'InitiateTreatmentDirect' })
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 手工上报弹层
    */
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.showManualDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 手工上报高级选项
    */
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 关闭高级选项弹层
    */
    closeInnerDialog() {
      this.innerDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 关闭手工上报弹层
    */
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 获取用户列表
    */
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
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
          this.sysUserList = res.data
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 分页
    */
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.ReceptionList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.ReceptionList()
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
      if (row.state === '1' || row.state === '2') {
        return 'success-row'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.container {
  width: 100%;
  height: 100%;
}

.header-float {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & span {
    font-size: 14px;
    margin-right: 15px;

    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}

::v-deep .el-input__prefix {
  display: none;
}

::v-deep .el-table .success-row {
  background: #c6f9c3;
}
</style>
