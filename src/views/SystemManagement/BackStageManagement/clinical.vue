<template>
    <!-- 开单管理（公司） -->
    <div class="box">
        <sg-table ref="table" :sg-ref="'multipleTable'" size="mini" index="序号" border :pagination="pagination" selection
            highlight-current-row :table-data="tableData" :columns="columns" :header-style="{ backgroundColor: '#f5eae4' }"
            :cell-style="cellStyle" @size-change="sizeChange" @current-change="change" @row-click="rowClick"
            @selection-change="handleSelectionChange">
            <!--搜索框 -->
            <div slot="searchBar" class="header-float">
                <div class="helt" style="margin-top: 20px;">
                    <el-form :inline="true" size="mini" style="height:100%">
                        <el-form-item label="客户姓名:">
                            <el-input v-model="form.customerName" style="width: 100px" clearable />
                        </el-form-item>
                        <el-form-item label="电话:" class="Left">
                            <el-input v-model="customPhone" style="width: 130px" clearable />
                        </el-form-item>
                        <el-form-item label="客户卡号:" class="Left">
                            <el-input v-model="form.customCardNumber" style="width: 135px" clearable />
                        </el-form-item>
                        <el-form-item label="接诊编号:" class="Left">
                            <el-input v-model="form.receptionNumber" style="width: 135px" clearable />
                        </el-form-item>

                        <el-form-item label="接待时间:" v-has-permi="['payment:billing:timesport']" class="Left">
<!--                            <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"-->
<!--                                end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">-->
<!--                            </el-date-picker>-->
                          <el-date-picker
                            v-model="value1" class="inputWidth"
                            size="mini"
                            type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;margin-right: 30px" />
                        </el-form-item>
                        <el-form-item label="是否有效:" class="Left">
                            <el-select v-model="useFlag" placeholder="请选择" filterable clearable style="width: 100px">
                                <el-option v-for="item in efficacious" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <div style="display: inline-block;position: absolute;right: 60px;">
                            <el-button icon="el-icon-search" size="mini" type="primary" plain style="margin-right:3px"
                                @click.stop.native="getData(true)">查询
                            </el-button>
                        </div>
                    </el-form>
                </div>
                <div class="helt">
                </div>
            </div>
            <div slot="header" class="header-float">
                <div>
                </div>
                <div style="float: right">
                    <el-button v-has-permi="['SiteManagement:SetMealnormal']" size="mini" plain type="success"
                        style="float: right;margin-left: 10px" icon="el-icon-shopping-cart-1" @click="PackageBilling">修改接诊指标
                    </el-button>
                    <el-button v-has-permi="['SiteManagement:testnoal']" size="mini" plain style="float: right;" type="primary"
                        @click="inspectionBilling">设置无效接诊
                    </el-button>
                </div>
            </div>
            <template #custom="data">
                <div v-if="data.props === 'useFlag'">
                    <span style="font-size:9px">{{ data.custom.useFlag == 0 ? '是' : '否' }}</span>
                </div>
                <div v-if="data.props === 'receptionStatus'">
                    <show-dict-data :options="dict.type.Reception_status" :value="data.custom.receptionStatus" />
                </div>
                <div v-if="data.props === 'treatment'">
                    <span style="font-size:9px">
                        {{ data.treatment == 0 ? '未处理' : "已处理" }}
                    </span>
                </div>
                <div v-if="data.props === 'customerName'">
                    <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
                </div>
                <div v-if="data.props === 'customerStatus'">
                    <span style="font-size:9px">{{ data.custom.customerStatus == '1' ? "新客户" : '老客户' }}</span>
                </div>
                <div v-if="data.props === 'isSecondary'">
                    <span style="font-size:9px">{{ data.custom.isSecondary == '1' ? "否" : '是' }}</span>
                </div>
                <div v-if="data.props === 'souName'">
                    <a @click="newcustomerclick(data.custom)">修改记录</a>
                </div>


            </template>
        </sg-table>
        <!-- 跨科 -->
        <el-dialog title="跨科" :visible="openDilog" width="40%" @close="closeDialog">
            <div>
                <div class="one">
                    <span>客户信息</span>
                    <el-form ref="formInline" :model="formInline" :rules="rules" size="mini" label-width="122px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="姓名：" prop="customerName">
                                    <el-input v-model="formInline.customerName" disabled />
                                </el-form-item>

                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="手机：" prop="customPhone">
                                    <el-input v-model="formInline.customPhone" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="分诊科室：" prop="departmentId">
                                    <el-select v-model="formInline.departmentId" clearable filterable>
                                        <el-option v-for="item in departmentList" :key="item.departmentId"
                                            :label="item.departmentName" :value="item.departmentId" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="客户代表：">
                                    <el-select v-model="formInline.customerRepresentative" clearable filterable>
                                        <el-option v-for="item in sysUserList" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="美学顾问：" prop="aestheticConsultant">
                                    <el-select v-model="formInline.aestheticConsultant" clearable filterable>
                                        <el-option v-for="item in esthetics" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="医生：">
                                    <el-select v-model="formInline.doctorId" clearable filterable>
                                        <el-option v-for="item in doctor" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="客户意向描述：" prop="intentionDescription">
                                    <el-input v-model="formInline.intentionDescription" type="textarea" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="closeDialog">取 消</el-button>
                <el-button type="primary" size="mini" @click="interdisciplinaryEdit">确 定</el-button>
            </span>
        </el-dialog>
        <sgDialog title="修改记录" size="800px" out-top="2%" :dialog="editrecord" @handleClose="editrecordclose">
            <div slot="out" style="height:400px;overflow-x:scroll">
                <el-table :data="newtableData" stripe style="width: 100%" height="350">
                    <el-table-column prop="functionNumber" label="接诊编号" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="customerName" label="姓名" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="customPhone" label="电话" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="operationContent" label="修改内容" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="operationBefore" label="修改前" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="operationAfter" label="修改后" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="operationName" label="操作人" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="createTime" label="操作时间" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注" width="180" align="center">
                    </el-table-column>
                </el-table>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button @click="editrecord = false" size="mini">关闭</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
        <sgDialog title="修改接诊指标" size="300px" out-top="2%" :dialog="showproject" @handleClose="closeRoomDialogtooth">

            <div slot="out">
                <div style="height: 200px;">
                    <div class="clinical_children">
                        <div class="clinical_childrens">
                            姓名:
                        </div>
                        <div>
                            <el-input style="width: 150px;margin-left: 10px;" size="mini" disabled=""
                                v-model="newcustomerName"></el-input>
                        </div>
                    </div>
                    <div class="clinical_children">
                        <div class="clinical_childrens">
                            美学顾问:
                        </div>
                        <div>
                            <el-input style="width: 150px;margin-left: 10px;" size="mini" disabled="" v-model="newacname"></el-input>
                        </div>
                    </div>
                    <div class="clinical_children">
                        <div class="clinical_childrens">
                           <span style="color:red">*</span> 客户状态:
                        </div>
                        <div>
                            <el-select v-model="newcustomerStatus" filterable placeholder="请选择" size="mini"
                                style="width: 150px;margin-left: 10px;">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="clinical_children">
                        <div class="clinical_childrens">
                            <span style="color:red">*</span> 是否二次来院:
                        </div>
                        <div>
                            <el-select v-model="newisSecondary" filterable placeholder="请选择" size="mini"
                                style="width: 150px;margin-left: 10px;">
                                <el-option v-for="item in newoptions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                </div>

                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok">确定</el-button>
                        <el-button @click="showproject = false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
    </div>
</template>
  
<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import { debounce } from '@/utils/throttleAndDebounce'
import {
  beforeWeek,
  lastMonth,
  lastQuarter,
  lastYear,
  monthData,
  thisQuarter,
  thisWeek,
  thisYear,
  timeFmt
} from '@/utils/time'
import { beforeDayTime, todayTime } from '@/utils/time'
export default {
    dicts: ['sys_user_sex', 'Reception_status', 'whether_secondary', 'whether_Newguest', 'Triage_type'],
    components: { SgTable, sgDialog },
    data() {
        return {
            openDilog: false,
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
            newacname:"",
            editrecord: false,
            newcustomerName: "",
            newcustomerStatus: '',
            newisSecondary: "",
            newtableData: [],
            showproject: false,
            showDataDialog: false,
            customerStatus: "",
            value1: [],
            useFlag: "0",
            isSecondary: "",
            customPhone: "",
            efficacious: [
                {
                    value: "0",
                    label: '是'
                },
                {
                    value: "1",
                    label: '否'
                }
            ],
            options: [
                {
                    value: "1",
                    label: "新客户"
                },
                {
                    value: "2",
                    label: "老客户"
                }
            ],
            newoptions: [

                {
                    value: "2",
                    label: "是"
                },
                {
                    value: "1",
                    label: "否"
                }

            ],
            selectionData: [], // 选择的数据
            form: {
                customerName: undefined, // 姓名
                customPhone: undefined, // 电话
                customCardNumber: undefined, // 顾客卡号
                customerStatus: undefined, // 顾客状态
                receptionNumber: "",//接诊编号
                c: "",//是否有效
                receptionTime: timeFmt('YYYY-mm-dd', new Date()) // 接待时间

            },
            formInline: {
                customerName: '',
                customPhone: '',
                departmentId: '',
                customerRepresentative: '',
                aestheticConsultant: '',
                doctorId: '',
                id: '',
                intentionDescription: ''
            },
            tableData: [],
            rowTable: undefined,
            // 表头
            columns: [
                {
                    lab: '是否有效',
                    val: 'useFlag',
                    width: 100,
                    custom: 'useFlag'
                },
                {
                    lab: '接诊编号',
                    val: 'receptionNumber',
                    width: 200
                },
                {
                    lab: '接诊状态',
                    val: 'receptionStatus',
                    custom: 'receptionStatus',
                    width: 100
                },
                {
                    lab: '处理情况',
                    val: 'treatment',
                    custom: 'treatment',
                    width: 165
                },
                {
                    lab: '姓名',
                    val: 'customerName',
                    custom: 'customerName',
                    width: 200
                },
                {
                    lab: '电话',
                    val: 'customPhone',
                    width: 120
                },
                {
                    lab: '客户卡号',
                    val: 'customCardNumber',
                    width: 200,
                },
                {
                    lab: '客户状态',
                    val: 'customerStatus',
                    custom: "customerStatus",
                    width: 150
                },
                // {
                //   lab: '会员等级',
                //   val: 'gradeName'
                // },
                {
                    lab: '二次来院',
                    val: 'isSecondary',
                    custom: 'isSecondary',
                    width: 150
                },
                {
                    lab: '接诊人',
                    val: 'gmaName',
                    width: 150
                },
                {
                    lab: '接诊时间',
                    val: 'receptionTime',
                    width: 150
                },
                {
                    lab: '医生',
                    val: 'doctorName',
                    width: 150,
                    showOverflowTooltip: true
                },
                // {
                //   lab: '医助描述',
                //   val: 'visituserName'
                // },
                {
                    lab: '客户意向',
                    val: 'intentionDescription',
                    width: 200,
                  showOverflowTooltip: true
                },
                {
                    lab: '分诊备注',
                    val: 'remark',
                    width: 150,
                  showOverflowTooltip: true
                },
                {
                    lab: '操作',
                    val: 'souName',
                    width: 150,
                    custom: 'souName'
                },
                // {
                //     lab: '分诊类型',
                //     val: 'triageType',
                //     custom: 'triageType',
                //     width: 130
                // }
            ],
            pagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1
            },
            rules: {
                departmentId: [{ required: true, message: '请选择', trigger: 'blur' }],
                // customerRepresentative: [{ required: true, message: '请选择', trigger: 'blur' }],
                aestheticConsultant: [{ required: true, message: '请选择', trigger: 'blur' }],
                intentionDescription: [{ required: true, message: '请输入', trigger: 'blur' }]
                // doctorId: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            sysUserList: [],
            esthetics: [],
            doctor: [],
            departmentList: []
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
            this.getDepartment()
            this.getData()
            this.getUserList(val)
        }
    },
    created() {
        this.deptId = this.$store.getters.departmentId
        this.getDepartment();
        this.getUserList(this.deptId)
        this.getData() // 页面加载显示数据
        this.value1 = [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
    },
    methods: {
        editrecordclose() {
            this.editrecord = false;
        },
        newcustomerclick(item) {
            this.editrecord = true;
            let data = {
                functionId: item.jdxxId,
                functionType: "1"
            }
            this.$api.confinementRoom.getReceptionListedit(data).then(res => {
                this.newtableData=res.rows;
            })
        },
        ok() {
            if(this.newcustomerStatus==''){
                this.$message.warning('请选择顾客状态');
                return;
            }
            if(this.newisSecondary==''){
                this.$message.warning('请选择是否二次来院');
                return;
            }
            let data = {
                jdxxId: this.selectionData[0].jdxxId,
                customerStatus: this.newcustomerStatus,
                isSecondary: this.newisSecondary
            }
            this.$api.confinementRoom.receptionInformationList(data).then(res => {
                if (res.code == 200) {
                    this.$message.success('修改成功');
                    this.getData();
                    this.showproject = false
                }
            })

        },
        closeRoomDialogtooth() {
            this.showproject = false
        },
        cellClassName({ row, rowIndex }) {
            if (row.customerStatus === '1') {
                return 'warning-row'
            } else if (row.customerStatus === '2') {
                return 'success-row'
            }
            return ''
        },
        /**
         * @author Nevin
         * @date 2022/6/15
         * @Description: 月子开单
         */
        confinementBilling() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({ path: 'confinementBilling', query: { billing: JSON.stringify(this.selectionData[0]) } })
        },
        /**
         * @author Nevin
         * @date 2022/6/15
         * @Description: 产康开单
         */
        chankangBilling() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({ path: 'chankangBilling', query: { billing: JSON.stringify(this.selectionData[0]) } })
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 产康套餐开单
         */
        chankangPackageBilling() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({ path: 'chankangPackageBilling', query: { billing: JSON.stringify(this.selectionData[0]) } })
        },
        // 点击姓名跳转页面
        customerclick(id, val) {
            this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus } })
        },
        // 储值开卡
        storedBill() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({
                name: 'StoredValueCard',
                query: { id: this.selectionData[0].id, content: JSON.stringify(this.selectionData[0]) }
            })
        },
        // 辅助治疗开单
        AdjuvantTherapy() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({ path: 'adjuvantBillingTherapy' })
          const query= {
            billing: JSON.stringify(this.selectionData[0]),
          }
          sessionStorage.setItem('adjuvantBillingTherapyitem',JSON.stringify(query))
        },
        // 交住院押金
        deposit() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({
                path: 'hospitalizationDeposit',
                query: { id: this.selectionData[0].id, content: JSON.stringify(this.selectionData[0]) }
            })
        },
        // 套餐开单
        PackageBilling() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.newcustomerName = this.selectionData[0].customerName;
            this.newacname=this.selectionData[0].acName
           this.newcustomerStatus='';
           this.newisSecondary='';
            this.showproject = true;
            // if (this.selectionData[0] === undefined) {
            //     this.$message.warning('请选择一名顾客进行修改')
            //     return
            // }
            // this.$router.push({ path: 'packageBilling', query: { billing: JSON.stringify(this.selectionData[0]) } })
        },
        // 开单
        management() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({ path: 'customerBilling' })
          const query={
            billing:JSON.stringify(this.selectionData[0]),
          }
          sessionStorage.setItem('customerBillingitem',JSON.stringify(query))
        },
        // 其他开单
        managementOther() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }

            this.$router.push({ path: 'customerBillingOther'})
            const query={
              billing:JSON.stringify(this.selectionData[0]),
            }
            sessionStorage.setItem('customerBillingOtheritem',JSON.stringify(query))
        },
        // 交预约金
        AdvancePayment() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({ path: 'advancePayment'})
          const query={
            billing:JSON.stringify(this.selectionData[0]),
          }
          sessionStorage.setItem('advancePaymentitem',JSON.stringify(query))
        },
        // 交储值
        StoredValue() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({
                path: 'pepositValue'
            })
          const query={
            billing:JSON.stringify(this.selectionData[0]),
            id: this.selectionData[0].id
          }
          sessionStorage.setItem('pepositValueitem',JSON.stringify(query))
        },
        // 检验开单
        inspectionBilling() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行设置')
                return
            }
            if(this.selectionData[0].receptionStatus=='2'){
                this.$message.warning('该顾客已开单禁止设置无效接诊');
                return;
            }
            if(this.selectionData[0].useFlag=='1'){
                this.$message.warning('该顾客已设置无效接诊');
                return;
            }
            let data = {
                jdxxId: this.selectionData[0].jdxxId,
                state: '1'
            }
            this.$api.confinementRoom.updateReceptionEffective(data).then(res => {
                if (res.code == 200) {
                    this.$message.success('设置无效接诊成功');
                }

            })
        },
        // 放射开单
        radiationBilling() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({ path: 'radiationBilling'})
            const query= {
              billing: JSON.stringify(this.selectionData[0])
            }
            sessionStorage.setItem('radiationBillingitem',JSON.stringify(query))
        },
        // 微商城订单开单
        bilingWechat() {
            if (this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.$router.push({ path: 'billingWechatMall' })
            // this.$message.success('很好！没有页面')
        },
        // StoredValue
        // BillingManagement
        // 获取列表数据
        getData: debounce(async function (isSearch) {
            /**
             * @author Nevin
             * @date 2022/8/12
             * @Description: 如果点击搜索按钮，将页码设为1
             */
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            /**
             * @author Nevin
             * @date 2022/6/14
             * @Description: 传公司ID，后期可能要改
             */
            let data = {
                pageSize: this.pagination.pageSize,
                pageNum:this.pagination.pageNum,
                customerName: this.form.customerName,
                customPhone: this.customPhone,
                customCardNumber: this.form.customCardNumber,
                receptionNumber: this.form.receptionNumber,
                receptionTime: this.value1 == '' || this.value1 == null ? '' : this.newgetData(this.value1[0]),//接诊开始时间
                endReceptionTime: this.value1 == '' || this.value1 == null ? '' : this.newgetData(this.value1[1]),//接诊结束时间
                useFlag: this.useFlag,
                deptId: this.deptId

            }
            this.$set(this.form, 'deptId', this.deptId)

            this.showDataDialog = true
            await this.$api.confinementRoom.getReceptionList(data).then(res => {
                if (res.code === 200) {
                    this.pagination.total = res.total
                    this.pagination.pageNum = 1
                    this.tableData = res.rows
                }
            }).finally(() => {
                this.showDataDialog = false
            })
        }),
        /**
         * @author Nevin
         * @date 2022/5/17
         * @Description:
         */
        cellStyle({ row, column, rowIndex, columnIndex }) {
            if (row.receptionStatus === '2') {
                if (columnIndex === 3) {
                    return { 'color': '#ff0000', 'font-weight': '600' }
                }
            }
            if (row.receptionStatus === '3') {
                if (columnIndex === 3) {
                    return { 'color': '#1abc9c', 'font-weight': '600' }
                }
            }
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
        // 分页
        change(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getData() // 调用数据
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getData()
        },
        /**
         * @author Nevin
         * @date 2022/5/10
         * @Description: 表格单选
         */
        handleSelectionChange(e) {
            // console.log('数据',e)
            this.selectionData = []
            if (e[1].length > 1) {
                this.$refs.table.$refs.multipleTable.clearSelection()
                this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
            }
            this.selectionData.push(e[1].pop())
            this.$delete(this.selectionData, 1)
        },
        /**
         * @author Nevin
         * @date 2022/5/10
         * @Description: 行内点击选中
         */
        rowClick(e) {
            // console.log(e)
            this.$refs.table.$refs.multipleTable.clearSelection()
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
        },
        /**
         * @author Nevin
         * @date 2022/5/10
         * @Description: 跨科
         */
        interdisciplinary() {
            if (this.selectionData.length !== 1) {
                this.$message.warning('请选择一名顾客进行修改')
                return
            }
            this.formInline.id = this.selectionData[0].id
            this.formInline.customerName = this.selectionData[0].customerName
            this.formInline.customPhone = this.selectionData[0].customPhone
            this.openDilog = true
        },
        // 保存 跨科内容
        interdisciplinaryEdit() {
            // 跨科校验 LS 5/26
            this.$refs.formInline.validate((val) => {
                if (val) {
                    this.$delete(this.formInline, 'customerName')
                    this.$delete(this.formInline, 'customPhone')
                    this.$set(this.formInline, 'deptId', this.deptId)
                    this.$set(this.formInline, 'receptionType', 'kk')

                    // console.log(this.formInline);
                    // return;
                    this.$api.dept.addReceptiondata({ ...this.formInline }).then(res => {
                        if (res) {
                            this.$message.success(res.msg)
                            this.openDilog = false
                            this.getData()
                        }
                    })
                }
            })
        },
        /**
         * @author Nevin
         * @date 2022/5/10
         * @Description: 关闭跨科按钮
         */
        closeDialog() {
            this.formInline.customerName = ''
            this.formInline.customPhone = ''
            this.formInline.departmentId = ''
            this.formInline.customerRepresentative = ''
            this.formInline.aestheticConsultant = ''
            this.formInline.id = ''
            this.formInline.intentionDescription = ''
            this.formInline.doctorId = ''
            this.openDilog = false
        },
        /**
         * @author Nevin
         * @date 2022/5/10
         * @Description: 获取用户信息
         */
        async getUserList(deptId) {
            /**
             * @author 李尚
             * @date 2022/6/18
             * @Description: 人员添加公司Id 添加状态
             */
            const data = {
                deptId: deptId,
                status: '0'
            }
            await this.$api.user.getUserList(data).then(res => {
                if (res) {
                    res.data.forEach(item => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    // this.sysUserList = res.data
                    // 美学顾问
                    res.data.forEach(item => {
                        if (item.postCode === 'xczxs') {
                            this.esthetics.push(item)
                            this.sysUserList.push(item)
                        }
                    })
                    // 医生
                    res.data.forEach(item => {
                        if (item.postCode === 'doctor') {
                            this.doctor.push(item)
                        }
                    })
                }
            })
        },
        /**
         * @author Nevin
         * @date 2022/5/10
         * @Description: 获取科室列表
         */
        getDepartment() {
            this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }, 'get').then((res) => {
                if (res) {
                    this.departmentList = res.rows
                }
            })
        }
    }

}
</script>
  
<style lang='scss' scoped>
@import '../../../styles/globalfloat.css';
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 8px;
    z-index: 999999;
}
::v-deep .el-table__row td {
    padding:3px;
    //font-size:9px
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 20px;
    background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px #999; */
    background: transparent;
    /* border-radius: 2px; */
}
.clinical_children {
    display: flex;
    margin-top: 10px;
}

.clinical_childrens {
    width: 100px;
    height: 20px;
    text-align: right;
}

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
    height: 70px;
}

.box {
    padding: 0;
}

.Left {
    margin-left: 30px;
}

span {
    font-size: 15px;
}

.one {
    border: 1px solid #f2f2f2;
    padding: 20px;
    border-radius: 5px;

    &>span {
        font-size: 15px;
        background-color: #fff;
        position: absolute;
        margin-top: -30px;
    }
}

::v-deep thead .el-table-column--selection .cell {
    display: none;
}

::v-deep .el-table .warning-row {
    background: #ffffff;
}

::v-deep .el-table .success-row {
    background: #7ec5b7;
}
</style>
  