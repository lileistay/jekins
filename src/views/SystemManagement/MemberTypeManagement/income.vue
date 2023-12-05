<template>
  <!-- 老带新收益审核列表 -->
    <div class="container">
        <slideSearch :options="options">
            <div slot="btnBar">
                <el-button
                        size="mini"
                        icon="el-icon-search"
                        type="primary"
                        plain
                        @click.stop="getData(true)"
                >查询
                </el-button>
                <el-button
                        v-has-permi="['payment:toBePaidList:export']"
                        type="success"
                        size="mini"
                        icon="el-icon-upload2"
                        plain
                        :loading="submitLoading"
                        @click.stop="exportExcel"
                >导出
                </el-button>
            </div>
            <slot>
                <sg-table
                        id="out-table"
                        ref="table"
                        :row-key="handle"
                        :sg-ref="'multipleTable'"
                        size="mini"
                        border
                        index="序号"
                        :expand-row-keys="expands"
                        highlight-current-row
                        :table-data="tableData"
                        :columns="columns"
                        :pagination="pagination"
                        stripe
                        selection
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        @row-click="rowClick"
                        @selection-change="handleSelectionChange"

                >
                    <div slot="searchBar" class="searchBar">

                    </div>
                    <!-- 按钮 -->
                    <div slot="header" style="width: 100%;">
                        <span style="font-size: 14px;cursor:pointer"><i @click="getDialog" class="el-icon-s-fold" /> 列表清单</span>

                    </div>
                    <template #custom="data">
                        <div v-if="data.props==='customerName'">
                            <a
                                style="color: #5f94de;cursor: pointer;"
                                @click="customer(data.custom.id, data.custom,data.custom.numberId,data.custom.id)"
                            >
                                {{ data.custom.customerName }}
                            </a>
                        </div>
                        <div v-if="data.props === 'orderNumber'">
                            <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
                                {{ data.custom.orderNumber }}
                            </a>
                        </div>
                        <div v-if="data.props === 'applyState'">
                            <span v-if="data.custom.applyState==0">待审核</span>
                            <span v-if="data.custom.applyState==1">已审核</span>
                            <span v-if="data.custom.applyState==2">已拒绝</span>
                        </div>
                        <div v-if="data.props === 'deit'">
                            <span style="cursor: pointer;" @click="getDialog(data.custom)">审核</span>
                        </div>
                        <div v-if="data.props === 'customerStatus'">
                            <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
                        </div>

                    </template>
                </sg-table>
            </slot>
        </slideSearch>
        <sgDialog title="审核"  size="400px" :modal="false" :dialog="showDialogS" @handleClose="showdialogT">
            <div slot="out">
                <div class="formBody">
                    <el-form :inline="true" label-width="144px" label-position="right" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
                        <el-form-item label="推荐人：" prop="relationLevel">
                            <el-input disabled v-model="formlist.refereeName"  style="width: 140px;" />
                        </el-form-item>


                        <el-form-item label="推荐人分成类型：" prop="dividendTypeId">
                            <el-select v-model="formlist.dividendTypeId" filterable style="width: 140px;"   placeholder="请选择" >
                                <el-option
                                    v-for="item in dividendTypeLists"
                                    :key="item.ratioId"
                                    :label="item.dividendTypeName"
                                    :value="item.dividendTypeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户名称：" prop="dividendRatio">
                            <el-input disabled v-model="formlist.customerName"  style="width: 140px;" />
                        </el-form-item>
                        <el-form-item label="分成类型：" prop="dividendTypeIds">
                            <el-select v-model="formlist.dividendTypeIds" filterable style="width: 140px;"   placeholder="请选择" >
                                <el-option
                                    v-for="(item,index) in dividendTypeLists"
                                    :key="index"
                                    :label="item.dividendTypeName"
                                    :value="item.dividendTypeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批状态：" prop="applyState">
                            <el-select v-model="formlist.applyState" filterable style="width: 140px;"   placeholder="请选择" >
                                <el-option
                                    v-for="item in applayStatus"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批备注：" prop="remarks">
                            <el-input v-model="formlist.remarks"  style="width: 140px;" />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="footer" style="text-align: right">
                    <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submit(formlist)">保存</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-close" @click="showDialogS=false">关闭</el-button>
                </div>
            </div>
        </sgDialog>
    </div>
</template>

<script>

// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import moment from 'moment'
import SendMessage from '@/components/SendMessage'
import { todayTime } from '@/utils/time'
import vueEasyPrint from 'vue-easy-print'
import orderDetailsPrint from '@/components/Print/orderDetailsPrint'
// import setMealPrint from '@/components/Print/setMealPrint'
import setMealDetailsPrint from '@/components/Print/setMealDetailsPrint'
import { math } from '@/utils/math'
import sgDialog from '@/components/Dialog/index'
import Sortable from 'sortablejs' //排序拖拽
import {log} from "mathjs";
export default {
    dicts: ['whether_Newguest'],
    components: {
        vueEasyPrint,
        orderDetailsPrint,
        // setMealPrint,
        setMealDetailsPrint,
        SgTable,
        slideSearch,
        SendMessage,
        sgDialog,
    },
    data() {
        return {

            expands: [], // 存放展开行的ID
            print: {},
            details: [],
            total: '',
            userInfo: {},
            finalPayData: '',
            tableDatas: [],
            submitLoading: false,
            coument: '',
            payableSigle: 0,
            placeorder: 0, // 下单人数
            checkOut: 0,
            // 显示发送短信弹窗
            showSendMessageDialog: false,
            // 加载蒙版
            showDataDialog: false,
            tableData: [],
            // 多选数据
            selectionData: [],
            // 套餐打印的表单数据
            packageDetailPrintData: {},
            // 序列清单
            columns: [
                {
                    lab: '操作',
                    val: 'deit',
                    custom: 'deit'
                },
                {
                    lab: '客户姓名',
                    val: 'customerName',
                    custom: 'customerName'
                },
                {
                    lab: '电话',
                    val: 'customPhone',
                    width: 100
                },
                {
                    lab: '客户卡号',
                    val: 'customCardNumber',
                    width: 165
                },

                {
                    lab: '客户状态',
                    val: 'customerStatus',
                    custom: 'customerStatus'
                },
                {
                    lab: '建档名称',
                    val: 'typeThreeName',
                    width: 120,
                },
                {
                    lab: '媒介类型',
                    val: 'channelTypeName'
                },
                {
                    lab: '媒介来源',
                    val: 'channelSource',
                    width: 120,
                    showOverflowTooltip: true
                },
                {
                    lab: '推荐人',
                    val: 'refereeName',
                    width: 120,
                    showOverflowTooltip: true
                },
                {
                    lab: '推荐电话',
                    val: 'refereePhone',
                    width: 120,
                    showOverflowTooltip: true
                },
                {
                    lab: '推荐人卡号',
                    val: 'refereeCard',
                    width: 140
                },
                {
                    lab: '申请人',
                    val: 'applyUserName',
                    width: 120,
                },
                {
                    lab: '申请时间',
                    val: 'applyTime',
                    width: 140
                },
                {
                    lab: '申请备注',
                    val: 'remarks',
                },
                {
                    lab: '审核人',
                    val: 'auditName',
                    width: 120,
                },
                {
                    lab: '审核时间',
                    val: 'auditTime',
                    width: 140,
                },
                {
                    lab: '审核状态',
                    val: 'applyState',
                    custom: 'applyState'

                },
                {
                    lab: '审核备注',
                    val: 'reason',
                }
            ],
            // 查询出列表
            options: {
                applyTime: {
                    type: 'Tdatetime',
                    label: '申请时间',
                    clearable: true,
                    values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
                },
                customerName: {
                    type: 'input',
                    label: '客户姓名:',
                    clearable: true
                },
                customPhone: {
                    type: 'input',
                    label: '电话:',
                    clearable: true
                },
                customCardNumber: {
                    type: 'input',
                    label: '顾客卡号:',
                    clearable: true
                },
                refereePhone: {
                    type: 'input',
                    label: '推荐人电话:',
                    clearable: true
                },
                refereeCard: {
                    type: 'input',
                    label: '推荐人卡号:',
                    clearable: true
                },
                channel: {
                    type: 'Tselect',
                    label: '媒介类型',
                    clearable: true,
                    values: [],
                    options: []
                },

                typeThreeName: {
                    type: 'cascader',
                  label: '渠道:',
                  props: { multiple: false, children: 'child', label: 'filingName', value: 'filingId' },
                  options: [],
                  clearable: true
                },
                auditId: {
                    type: 'select',
                    label: '审核人:',
                    options: [],
                    clearable: true
                },
                applyUserId: {
                    type: 'select',
                    label: '申请人:',
                    options: [],
                    clearable: true
                },
                remarks: {
                    type: 'input',
                    label: '申请备注:',
                    clearable: true
                },
                auditTime: {
                    type: 'Tdatetime',
                    label: '审核时间',
                    clearable: true,
                    values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
                },
                applyState: {
                    type: 'select',
                    label: '审核状态',
                    options: [],
                    clearable: true
                },
                reason: {
                    type: 'input',
                    label: '审核备注:',
                    clearable: true
                },
            },
            // 分页
            pagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1
            },
            showDialogS:false,
            formlist:{},
            dividendTypeLists:[],
            applayStatus:[
                {label:'待审核',value:0},
                {label:'已审核',value:1},
                {label:'已拒绝',value:2},
            ],
            rules: {
                dividendTypeId: [
                    { required: true, message: '请输入推荐人分成类型', trigger: 'change' },
                ],
                dividendTypeIds: [
                    { required: true, message: '请输入分成类型', trigger: 'change' },
                ],applyState: [
                    { required: true, message: '请选择状态', trigger: 'change' },
                ]
            },
            sortList:[],//顺序列表
            columnssortList:[
                {
                    lab: '列名',
                    val: 'lab',
                },
                {
                    lab: '拖动调整顺序',
                    val: 'icon',
                    custom:'icon'
                },
            ],
            selectionDataSortList:[],
            selectionlist:[],
            cancelList:[],
            xflagList:[],

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
            this.getData()
            this.getUserList(val)
        },
        // 媒介
        'options.channel.values'() {
            if (this.options.channel.values[0]) {
                this.options.channel.options[1] = this.channelType.filter(filter => {
                    return filter.typeId === this.options.channel.values[0]
                })[0].channelInfo
            } else {
                this.options.channel.options[1] = []
            }
        },
        'options.channel.values.0'() {
            this.options.channel.values[1] = ''
        }
    },
    created() {
         this.deptId = this.$store.getters.departmentId
        this.Department()
        this.getData()
        this.getUserList(this.deptId)
        this.deptFilingList()
        this.getChannelInfo()
        this.options.applyState.options=this.applayStatus
    },
    methods: {
        //老带新分成比类型列表
        dividendTypeList(){
            const query={
                deptId:this.deptId
            }
            this.$api.modules.bookProject.dividendRatioList(query).then(res => {
                if (res) {
                    this.dividendTypeLists = res.rows
                }
            })
        },
        //保存审核
        submit(){
            const query={
                applyState:this.formlist.applyState,
                dividendTypeId:this.formlist.dividendTypeId,
                dividendTypeName:'',
                applyId: this.selectionData[0].applyId,
                dividendRatio: '',
                ratioId:'' ,
                reason: this.formlist.reason,
                remarks: this.formlist.remarks,
                earningTotal: this.selectionData[0].earningTotal
            }
            if (this.dividendTypeLists.length){
                query.dividendTypeName=this.dividendTypeLists.filter(item=>item.dividendTypeId==this.formlist.dividendTypeId)[0].dividendTypeName
                query.dividendRatio=this.dividendTypeLists.filter(item=>item.dividendTypeId==this.formlist.dividendTypeId)[0].dividendRatio
                query.ratioId=this.dividendTypeLists.filter(item=>item.dividendTypeId==this.formlist.dividendTypeId)[0].ratioId
            }
            console.log(query,'query')
            this.$refs.formlist.validate((valid) => {
                if (valid) {
                    this.$api.modules.bookProject.earningApply(query).then(res => {
                        if (res) {
                            this.$message.success(res.msg)
                            this.showDialogS = false
                            this.dividendRatioList()
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        // 自定义配置弹框
        getDialog(val){
            this.formlist.customerName=val.customerName
            this.formlist.refereeName=val.refereeName
            this.dividendTypeList()
            this.showDialogS=true
            console.log(this.selectionData,'this.selectionData')


        },
        showdialogT(){
            this.showDialogS=false
        },
        // 导出
        exportExcel() {
            if (this.tableData.length === 0) {
                this.$message('打印数据为空')
                return
            }
            var data = {}
            this.submitLoading = true
            for (const k in this.options) {
                if (this.options[k].type === 'Tselect') {
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
                }else if (this.options[k].type === 'cascader') {
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
                        this.$set(data, 'typeThreeName', typeThreeId.join(','))
                        this.$set(data, 'typeThreeId', typeThreeId.join(','))
                    } else {
                        filingIds = []
                        typeTwoIds = []
                        typeThreeIds = []
                    }
                } else if (this.options[k].type === 'Tinput') {
                    data[k] = this.options[k].values[0]
                    data['end' + k] = this.options[k].values[1]
                } else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            data = Object.assign(data)
            this.$set(data, 'deptId', this.deptId)
            this.$message({
                message: '稍等一下，马上就好',
                type: 'success'
            })
            this.$api.modules.bookProject.getPromotionCommissionlist(data).then(res => {
                if (res) {
                    this.tableData = res.rows
                }
            }).finally(() => {
                export_table_to_excel('#out-table', '已结账列表')
                setInterval(() => {
                    this.submitLoading = false
                }, 5000)
            })
        },
        // 分页组件的方法
        currentChange(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getData()
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getData()
        },
        /**
         * @author 李尚
         * @date 2022/5/31
         * @Description: 点击跳转
         */
        customer(id, val, numberId) {
            this.$router.push({ path: '/customerInfo', query: { id}})
        },
        orderNumber(data) {
            // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
            this.$router.push({ path: 'billDetails'})
          sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
        },
        /**
         * @author hpl
         * @date 2023/5/5
         * @Description: 搜索
         */
        async getData(isSearch) {
            var data = {}
            for (const k in this.options) {
                if (this.options[k].type === 'Tselect') {
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
                    if (this.options[k].values){
                        this.$set(data, 'typeThreeId',this.options[k].values[this.options[k].values.length-1] )
                    }

                } else if (this.options[k].type === 'Tinput') {
                    data[k] = this.options[k].values[0]
                    data['end' + k] = this.options[k].values[1]
                } else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            /**
             * @author hpl
             * @date 2023/5/5
             * @Description: 如果点击搜索按钮，将页码设为1
             */
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            data = Object.assign(data, this.pagination)
            /**
             * @author hpl
             * @date 2023/5/5
             * @Description: 传公司ID，后期可能要改
             */
            this.$set(data, 'deptId', this.deptId)
            await this.$api.modules.bookProject.getPromotionCommissionlist(data).then(res => {
                if (res) {
                    this.tableData = res.rows
                    this.pagination.total = res.total
                }
            })
            // 接口
        },

        // 科室
        Department() {
            this.$api.modules.netPower.projectTreeselect({ deptId: this.deptId }).then(res => {
                if (res) {
                    res.data.forEach((item) => {
                        item.value = item.departmentId
                        item.label = item.departmentName
                    })
                    // this.options.departmentId.options = res.data
                }
            })
        },

        handle(row) {
            return row.orderId
        },
        /**
         * @author 李尚
         * @date 2022/5/31
         * @Description: 点击复选框选中
         */
        handleSelectionChange(e) {
            this.selectionData = []
            if (e[1].length > 1) {
                this.$refs.table.$refs.multipleTable.clearSelection()
                this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
            }
            this.selectionData.push(e[1].pop())
            this.$delete(this.selectionData, 1)
            // // this.coument = this.selectionData[0].customerName
            // let totals = 0
            // let temp = []
            // this.tableData.forEach(item => {
            //   if (item.id === this.selectionData[0].id) {
            //     totals = math.add(item.amountPayable, totals)
            //   }
            // })
            // temp = this.tableData.filter(item => {
            //   return item.id === this.selectionData[0].id
            // })
            // this.payableSigle = temp.length
            // this.placeorder = totals
        },
        /**
         * @author hpl
         * @date 2023/5/5
         * @Description: 人员添加公司Id  添加状态
         */
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
                }
                this.options.auditId.options=res.data
                this.options.applyUserId.options=res.data
            })
        },
        unique(arr) {
            const res = new Map()
            return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
        },
        respliceNameLabel(data) {
            data.forEach(item => {
                item.label = item.typeName
                item.value = item.channelId === undefined ? item.typeId : item.channelId
                if (item.channelInfo !== undefined) {
                    this.respliceNameLabel(item.channelInfo)
                }
            })
        },

        // 批量发送短信
        sendMessage() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客发送短信')
                return
            }
            this.showSendMessageDialog = true
        },
        // 设置侧边搜索的建档类型
        deptFilingList() {
            const data = {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.modules.filing.getFilingTypeById(data).then(res => {
                if (res.data) {
                    this.options.typeThreeName.options = res.data
                }
            })
        },
        // 获取媒介类型
        getChannelInfo() {
            this.$api.modules.channel.getChannelType({
                'deptId': this.deptId,
                'status': 0
            }).then(res => {
                if (res) {
                    if (res.data.length !== 0) {
                        this.channelType = res.data
                        this.respliceNameLabel(res.data)
                        this.options.channel.options.splice(0, 0, res.data)
                    } else {
                        this.options.channel.options = []
                        this.options.channel.values = []
                    }
                }
            })
        },
        /**
         * @author 李尚
         * @date 2022/5/31
         * @Description: 选中行内点击
         */
        rowClick(e) {
            this.$refs.table.$refs.multipleTable.clearSelection()
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
            this.coument = e[1].customerName
            this.placeorder = e[1].paidAmount
        }
    }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}

::v-deep .el-dialog__header {
  background-color: #1abc9c;
}

.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}

span {
  color: #7ec5b7;
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
::v-deep .flagclass{
  cursor: not-allowed;
  pointer-events: none;
  color: #ccc;
}
// dialog 去除遮罩层 弹窗底下可点击
::v-deep .el-dialog__wrapper {
  pointer-events: none;
}
::v-deep .el-dialog {
  pointer-events: auto;
}
</style>
<style>
.el-input__prefix {
    display: none;
}

</style>
