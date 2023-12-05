<template>
    <!-- 月子分期 -->
    <div class="container">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">
         <model ref="mydel"></model>
    </el-tab-pane>
  </el-tabs> -->
        <slideSearch :options="options">
            <div slot="btnBar">
                <el-button size="mini" icon="el-icon-search" type="primary" plain @keydown.enter.native="getData(true)"
                    @click.stop="getData(true)">查询
                </el-button>
                <!-- <el-button v-has-permi="['confinement:customerReservationForm:exportguest']" size="mini" type="success"
                     icon="el-icon-upload2" plain :loading="submitLoading" @click="exportExcel">导出
          </el-button> -->
            </div>
            <slot>
                <sg-table ref="table" :sg-ref="'multipleTable'" size="mini" selection border index="序号"
                    highlight-current-row :table-data="tableData" :columns="columns" :pagination="pagination"
                    :header-style="{ backgroundColor: '#f5eae4' }" :row-class-name="rowClassName"
                    @selection-change="handleSelectionChange" @size-change="sizeChange" @current-change="change"
                    @row-click="rowClick">
                    <div slot="searchBar" class="searchBar">
                        <div>
                            <!-- <el-form :inline="true" size="mini" label-width="120px">
              <el-form-item label="客户姓名：">
                <el-input v-model="form.customerName" clearable style="width: 140px;" />
              </el-form-item>
              <el-form-item label="电话：">
                <el-input v-model="form.customPhone" clearable style="width: 140px;" />
              </el-form-item>
              <el-form-item label="身份证号：">
                <el-input v-model="form.card" clearable style="width: 140px;" />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input v-model="form.customCardNumber" clearable style="width: 140px;" />
              </el-form-item>
              <el-form-item label="结账时间：">
                <el-date-picker
                  v-model="checkoutTime"
                  clearable
                  type="datetimerange"
                  style="width: 200px;"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                />
              </el-form-item>
              <el-form-item label="收费单号：">
                <el-input v-model="form.orderNumber" clearable style="width: 140px;" />
              </el-form-item>
              <el-form-item label="产品名称：">
                <el-input v-model="form.projectName" clearable style="width: 140px;" />
              </el-form-item>
              <el-form-item style="float: right;margin-top: -45px">
                <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
              </el-form-item>
            </el-form> -->
                        </div>
                        <div />
                    </div>
                    <div slot="header" class="header">
                        <div>
                            <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
                            <span><i style="background-color:#ffffff" />待执行</span>
                            <span><i style="background-color:#c6f9c3" />已执行</span>
                            <!--          <span>总人数：0</span>-->
                            <!--          <span>总金额：0</span>-->
                        </div>
                        <div>
                            <el-button size="mini" plain type="primary" icon="el-icon-plus"
                                @click.stop.native="openManualDialog">手工上报</el-button>
                            <!--          <el-button size="mini" plain type="primary" icon="el-icon-plus">手工录入</el-button>-->
                            <!--          <el-button size="mini" plain type="danger" icon="el-icon-plus">手工录入删除</el-button>-->
                            <!--          <el-button size="mini" plain type="primary" icon="el-icon-bank-card">年卡</el-button>-->
                            <!--          <el-button size="mini" plain type="primary" icon="el-icon-bank-card">套餐</el-button>-->
                            <el-button size="mini" plain type="primary" icon="el-icon-plus" @click="triage"
                                v-has-permi="['payment:wforservice:pack']">执行</el-button>
                        </div>
                    </div>
                    <template #custom="data">
                        <div v-if="data.props === 'customerName'">
                            <a style="color: #5f94de;cursor: pointer;"
                                @click="customer(data.custom.id, data.custom, data.custom.numberId, data.custom.id)">
                                {{ data.custom.customerName }}
                            </a>
                        </div>
                        <div v-if="data.props === 'refundReason'">
                            <show-dict-data :options="dict.type.refund_reason" :value="data.custom.refundReason" />
                        </div>
                        <!--                        <div v-else-if="data.props === 'schedulePrint'">-->
                        <!--                            <el-button size="mini" type="text" @click="printSchedule(data.custom)">打印排期表</el-button>-->
                        <!--                        </div>-->
                    </template>
                </sg-table>
            </slot>
        </slideSearch>

        <manual-submission :show-manual-dialog="showManualDialog" :inner-dialog="innerDialog"
            :selection-data="selectionData" :action="Action" @closeInnerDialog="closeInnerDialog"
            @closeShowManualDialog="closeShowManualDialog" @setInnerDialog="setInnerDialog" />
        <sgDialog title="执行" size="800px" :dialog="showproject" @handleClose="showproject = false">
            <div slot="out" class="OutHeight">
                <div class="newOutHeight">
                    <el-table :data="selectionData" style="width: 100%" border height="450">
                    <el-table-column prop="customerName" label="客户姓名" align="center">
                    </el-table-column>
                    <el-table-column prop="projectName" label="产品名称" align="center">
                    </el-table-column>
                    <el-table-column prop="quantitySum" label="总次数" align="center">
                    </el-table-column>
                    <el-table-column prop="surplusQuantity" label="本次执行次数" align="center">
                        <template slot-scope="scope">
                            <div>
                                <el-input-number v-model="scope.row.surplusQuantity" size="mini" :min="1" :max="Atable[scope.row.Index]" ></el-input-number>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="treatmentNum" label="已执行次数" align="center">
                    </el-table-column>
                </el-table>
                </div>

                <div class="bottomend">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="submitAdjuvant">确定</el-button>
                        <el-button @click="showproject=false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>

        </sgDialog>
        <!--        <vue-easy-print ref="schedulePrint">-->
        <!--            <schedule-print :print="print" :details="details" />-->
        <!--        </vue-easy-print>-->
    </div>
</template>

<script>
// import vueEasyPrint from 'vue-easy-print'
import SgTable from '@/components/Table'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
// import schedulePrint from '@/components/Print/schedulePrint'
import slideSearch from '@/components/SlideSearchBar/index'
import {beforeDayTime, newgetData, todayTime} from '@/utils/time'
import sgDialog from '@/components/Dialog/index'
import moment from 'moment'
import { math } from '@/utils/math'
export default {
    dicts: ['refund_reason'],
    components: {
        SgTable,
        ManualSubmission,
        // vueEasyPrint,
        // schedulePrint,
        slideSearch,
        sgDialog,
    },
    data() {
        return {
            activeName: "first",
            showproject: false,
            Atable:[],
            options: {
                checkoutTime: {
                  type: 'Tdatetime',
                    label: '结账时间',
                    clearable: true,
                    values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
                },
                customerName: {
                    type: 'input',
                    label: '客户姓名'
                },
                customPhone: {
                    type: 'input',
                    label: '电话号码'
                },
                card: {
                    type: 'input',
                    label: '身份账号'
                },
                customCardNumber: {
                    type: 'input',
                    label: '客户卡号'
                },
                orderNumber: {
                    type: 'input',
                    label: '收费单号'
                },
                projectName: {
                    type: 'input',
                    label: '产品名称'
                },

            },
            Action: {},
            loadingData: false,
            selectionData: [], // 选择的数据
            // 手工上报
            showManualDialog: false,
            innerDialog: false,
            sysUserList: [], // 医生
            // 列表
            tableData: [],
            columns: [

                {
                    lab: '产品名称',
                    val: 'projectName',
                    width: 150,
                    showOverflowTooltip: true
                },
                {
                    lab: '总次数',
                    width: 120,
                    val: 'quantitySum'
                },
                {
                    lab: '待执行次数',
                    width: 90,
                    val: 'surplusQuantity'
                },
                {
                    lab: '已执行次数',
                    width: 90,
                    val: 'treatmentNum'
                },
                {
                    lab: '客户姓名',
                    val: 'customerName',
                    width: 100,
                    custom: 'customerName'
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
                    lab: '收费单编号',
                    val: 'orderNumber',
                    width: 165
                },

                {
                    lab: '产品名称',
                    val: 'projectName',
                    width: 150,
                    showOverflowTooltip: true
                },
                {
                    lab: '产品单位',
                    val: 'company',
                    width: 80
                },

                {
                    lab: '已退款次数',
                    width: 90,
                    val: 'refundNum'
                },
                {
                    lab: '退款金额',
                    width: 90,
                    val: 'refundAmount'
                },
                {
                    lab: '退款原因',
                    width: 150,
                    val: 'refundReason',
                    custom: 'refundReason',
                    showOverflowTooltip: true
                },
                {
                    lab: '现场咨询',
                    val: 'acName',
                    width: 90
                },

                {
                    lab: '金额',
                    width: 90,
                    val: 'discountAmount'
                },
                {
                    lab: '结账时间',
                    val: 'checkoutTime',
                    width: 140
                },

                {
                    lab: '备注',
                    val: 'billingRemarks',
                    showOverflowTooltip: true
                }
            ],
            pagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1
            },
            checkoutTime: todayTime(), // 结账时间
            // 搜索框
            form: {
                customerName: '', // 姓名
                customPhone: '', // 电话
                customCardNumber: '', // 卡号
                card: '', // 身份证
                orderNumber: '', // 收费单号
                projectName: ''
            },
            print: {
                customName: undefined,
                departmentName: undefined,
                customCardNumber: undefined
            },
            details: []
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
            this.getData()
        }
    },
    created() {
        this.getData()
        this.deptId = this.$store.getters.departmentId
        this.getUserList(this.deptId)
        const this_ = this
        // 点击回车后事件
        document.onkeydown = function (e) {
            if (e.keyCode === 13) {
                this_.getData()
            }
        }
    },
    methods: {
        //确定方法
        submitAdjuvant(){
            this.$confirm('确认执行吗，是否继续？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                let data=[];
            this.selectionData.forEach(value=>{
                let object={
                    waitId:value.waitId,
                    executorNumber:value.surplusQuantity,
                    executionAmount:Number(math.multiply(math.divide(value.discountAmount,value.quantitySum),value.surplusQuantity).toFixed(2)),
                    departmentId:value.departmentId,
                    billingDepartment:value.billingDepartment
                }
                data.push(object)
            })
           this.$api.confinementRoom.auxiliaryExecution(data).then(res=>{
              if(res.code==200){
                this.$message.success(res.msg)
                this.showproject=false;
                this.getData();
              }
           })
            }).catch(res=>{
             
            })
         
        },
        /**
         * @author Nevin
         * @date 2022/7/26
         * @Description: 打印排期表
         */
        printSchedule(data) {
            this.details = []
            this.print.customName = data.customerName
            this.print.departmentName = data.departmentName
            this.print.customCardNumber = data.customCardNumber
            this.$api.medical.skinTriageList({ id: data.id }).then(res => {
                if (res) {
                    res.rows.forEach(item => {
                        const temp = {
                            projectName: item.projectName,
                            surplusQuantity: item.surplusQuantity
                        }
                        this.details.push(temp)
                    })
                    // this.$nextTick(() => {
                    //     this.$refs.schedulePrint.print()
                    // })
                }
            })
        },
        // 搜索
        getData(isSearch) {
            /**
             * @author Nevin
             * @date 2022/8/12
             * @Description: 如果点击搜索按钮，将页码设为1
             */
            var data = {}
            for (const k in this.options) {
                if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
                    data[k] = this.options[k].values[0]
                    data['end' + k] = this.options[k].values[1]
                } else if (this.options[k].type === 'Tselect') {
                    this.$set(data, 'channelTypeId', this.options[k].values[0])
                    this.$set(data, 'channelId', this.options[k].values[1])
                    this.$delete(data, 'channel')
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
                } else if (this.options[k].type === 'cascader') {
                    let filingIds = []
                    let typeTwoIds = []
                    let typeThreeIds = []
                    if (this.options[k].values !== undefined) {
                        const arr = this.options[k].values
                        arr.forEach(item => {
                            filingIds.push(item[0])
                            typeTwoIds.push(item[1])
                            typeThreeIds.push(item[2])
                        })
                        this.$set(data, 'filingIds', filingIds.join(','))
                        this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
                        this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
                    } else {
                        filingIds = []
                        typeTwoIds = []
                        typeThreeIds = []
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
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            data.billingStatus = '3';
            data.deptId = this.deptId
            // this.form.customerName = this.$route.query.customerName
            if (this.$route.query.id === undefined || this.$route.query.id === 0) {
                this.form.checkoutTime = this.checkoutTime ? this.checkoutTime[0] : null
                this.form.endcheckoutTime = this.checkoutTime ? this.checkoutTime[1] : null
            }
            this.loadingData = true
            this.$api.confinementRoom.auxiliaryTreatList({
                ...data, ...this.pagination,
                billingDepartment: this.$route.query.departmentId,
                id: this.$route.query.id
            }).then(res => {
                if (res) {
                    res.rows.forEach(item => {
                        if (item.state === '1' || item.state === '2') {
                            item.isArrange = '是'
                        } else {
                            item.isArrange = '否'
                        }
                    })
                    res.rows.forEach((value,index)=>{
                        value.Index=index;
                    })
                    this.tableData = res.rows
                    this.pagination.total = res.total
                }
            }).finally(() => {
                this.loadingData = false
            })
        },
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
        // 姓名跳转
        customer(id, val, numberId) {
            this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal } })
        },
        // 打开手工上报弹窗
        openManualDialog() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行手工上报')
                return
            }
            this.Action = this.selectionData[0]
            this.showManualDialog = true
        },
        // MedicalManagement/SkinCenter/skinSchedulingTriage
        triage() {
            if (this.selectionData.length === 0) {
                this.$message.warning('请至少选择一名顾客进行执行')
                return
            }
            let flag=false;
            this.selectionData.forEach(value=>{
                if(value.surplusQuantity==-1||value.surplusQuantity==0){
                    flag=true
                }
            })
            if(flag){
                this.$message.warning('有已执行数据，不可执行')
                return
            }
            this.showproject = true;
            this.selectionData.forEach(value=>{
                this.Atable.push(value.surplusQuantity)
            })
            // this.$confirm('确认执行，是否继续？', '提示', {
            //     distinguishCancelAndClose: true,
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then((res) => {
            //     console.log(res)
            // }).catch(res => {
            //     console.log(res)
            // })
            // 判断是否是同一个人
            // 对选中的数据取出id 转为set直接去重，判断去重后的set长度，如果大于0表示选中了多个不同客户
            // const ids = new Set(this.selectionData.flatMap(item => [item.id]))
            // if (ids.size > 1) {
            //   this.$message.warning('请选择同一个顾客发起批量登记')
            //   return
            // }
            // 选择的数据是否有剩余治疗次数 并且 已经登记的计划治疗次数是否大于剩余次数
            // const find = this.selectionData.find(item => item.surplusQuantity === 0 || item.arrangeNumber >= item.surplusQuantity)
            // if (find) {
            //   this.$message.warning('部分项目剩余治疗次数不足或已登记次数大于剩余次数，无法发起登记，请重新选择或取消旧登记')
            //   return
            // }
            // 选择的数据存储到store,防止登记页面刷新页面数据丢失
            // this.$store.dispatch('setTriageSelectionData', this.selectionData)
            // this.$router.push({ name: 'TriageRegistrations' })
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
        },
        // 分页组件
        change(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getData()
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getData()
        },
        // ---
        getUserList(deptId) {
            /**
              * @author 李尚
              * @date 2022/6/17
              * @Description: 人员添加公司Id  添加状态
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
        // 表格多选
        handleSelectionChange(e) {
            this.selectionData = e[1]
        },
        rowClick(e) {
            this.selectionData = e[1]
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
        },
        rowClassName({ row }) {
            if (row.surplusQuantity == '-1' || row.surplusQuantity == '0') {
                return 'success-row'
            }
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep .newOutHeight .el-table__header-wrapper tr th {
    padding: 2px !important;
}
::v-deep .newOutHeight tr td {
    padding: 3px !important;
}
.bottomend {
    position: absolute;
    width: 100%;
    height: 60px;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.OutHeight {
    height: 500px;
    overflow-y: scroll;
}

.container {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.header {
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

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
    height: 0px !important;
}

::v-deep .el-table .warning-row {
    background: #ffff00;
}

::v-deep .el-table .success-row {
    background: #c6f9c3;
}

::v-deep .el-range-editor.el-input__inner {
    padding: 3px 5px;
}</style>
