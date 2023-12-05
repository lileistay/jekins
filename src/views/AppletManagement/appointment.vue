<template>
    <div>
        <slideSearch :options="options">
            <div slot="btnBar">
                <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getList(true)">查询
                </el-button>
            </div>
            <slot>
                <!-- 文件列表 -->
                <sg-table ref="table" id="out-table" :sg-ref="'multipleTable'" size="mini" border index="序号"
                    :table-data="tableData" :columns="columns" :pagination="pagination" highlight-current-row
                    @size-change="sizeChange" :hideSearchBar="true" @current-change="currentChange" :operate="operate"
                    @operateClick="operateClick">

                    <div slot="header" style="width: 100%;">
                        <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
                        <div style="float: right;">
                            <!-- <el-button size="mini"  v-has-permi="['confinement:dividendType:add']" type="primary" icon="el-icon-plus" @click="addDialogs">新增</el-button> -->
                            <!--          <el-button size="mini"  v-has-permi="['confinement:dividendType:delete']" type="danger" icon="el-icon-plus" @click="deleteDialogs">删除</el-button>-->
                        </div>
                    </div>
                    <template #custom="data">
                        <div v-if="data.props === 'isArrive'">
                            <el-switch v-model="data.custom.isArrive" active-value="1" inactive-value="0"
                                @change="isArrivechange((data.custom))" active-color="#409eff" inactive-color="#dcdfe6">
                            </el-switch>
                        </div>
                        <div v-if="data.props === 'orderDisplay'" class="input">
                            <el-input size="mini" v-model="data.custom.orderDisplay" @blur="blur(data.custom)"
                                style="width: 80px;text-align: center" />
                        </div>
                        <div v-if="data.props === 'groupSetting'">
                            <span v-if="data.custom.groupSetting == 0">过期自动成团</span>
                            <span v-else>过期自动退款</span>
                        </div>
                        <div v-if="data.props === 'isHomeDisplay'">
                            <!--              <span v-if="data.custom.isHomeDisplay==0">否</span>-->
                            <!--              <span v-else>是</span>-->
                            <el-switch v-model="data.custom.isHomeDisplay" active-value="1" inactive-value="0"
                                @change="isHomeDisplaychange((data.custom))" active-color="#409eff"
                                inactive-color="#dcdfe6">
                            </el-switch>
                        </div>
                        <div v-if="data.props == 'visitType'">
                            {{ data.custom.visitType == '1' ? '备孕中' : '预产期' }}
                        </div>
                        <div v-if="data.props === 'customerType'">
                            <span v-if="data.custom.customerType == 0">不限</span>
                            <span v-if="data.custom.customerType == 1">限老客户</span>
                            <span v-if="data.custom.customerType == 2">限新客户</span>
                        </div>
                        <div v-if="data.props === 'effectiveTime'">
                            <span>{{ data.custom.effectiveTime }}分钟</span>
                        </div>
                        <div v-if="data.props === 'edit'">
                            <el-button type="text" style="color: #E6A23C" size="mini"
                                @click="edit(data.custom)">修改</el-button>
                            <el-button type="text" style="color: #F56C6C" size="mini"
                                @click="deletes(data.custom.ggId)">删除</el-button>
                        </div>
                        <div v-if="data.props === 'salesVolume'">
                            {{ Number(data.custom.inventory) - Number(data.custom.salesVolume) }}
                        </div>

                    </template>
                </sg-table>
            </slot>
        </slideSearch>
        <sgDialog title="处理结果" :dialog="Dialog" size="400px" out-top="50px" @handleClose="Dialog = false">
            <div slot="out">
                <el-form :model="ruleForm" :rules="newrules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="处理结果:" prop="value">
                        <el-select v-model="ruleForm.value" placeholder="请选择" size="mini">
                            <el-option v-for="item in optionsl" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注:" prop="remarks">
                        <el-input type="textarea" :row="5" v-model="ruleForm.remarks"></el-input>
                    </el-form-item>
                </el-form>
                <div style="height:30px"></div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok">确定</el-button>
                        <el-button @click="Dialog = false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
    </div>
</template>
<script>
import SgTable from '@/components/Table'
import EditorBar from '@/components/wangeditor'
import sgDialog from '@/components/Dialog'
import slideSearch from '@/components/SlideSearchBar/index'
import moment from "moment";
import { beforeDayTime, todayTime } from '@/utils/time'
export default {
    name: 'groupshop',
    dicts: ['file_type', 'sys_job_status'],
    components: {
        SgTable,
        EditorBar,
        sgDialog,
        slideSearch
    },
    data() {
        return {
            tableData: [],
            optionsl: [
                {
                    value: "0",
                    label: "未处理",
                },
                {
                    value: "1",
                    label: "已处理",
                }
            ],
            ruleForm: {
                value: '',
                remarks: "",
            },
            newrules: {
                value: [{ required: true, message: '请选择处理结果', trigger: 'change' }]
            },
            Dialog: false,
            operate: {
                name: '操作',
                width: 300,
                cell: [
                    {
                        lab: '处理',
                        type: 'warning',
                        permi: ['system:user:edit']
                    },
                ]
            },
            columns: [
                {
                    lab: '预约门店',
                    val: 'storeName'
                },

                {
                    lab: '客户姓名',
                    val: 'visitName'
                },
                {
                    lab: '客户电话',
                    val: 'visitPhone'
                },
                {
                    lab: '预约类型',
                    val: 'visitType',
                    custom: 'visitType'
                },
                {
                    lab: '预产期时间',
                    val: 'ycTime'
                },
                {
                    lab: '创建时间',
                    val: 'createTime'
                },
            ],

            pagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1
            },
            dialogVisible: false,
            submitLoading: false,
            form: {
                content: '',
            },
            rangenum: '',
            formList: {
                pushTags: null,
                pushPrompt: null,
                // makId:[],
                backendValue: '',
            },
            xFlag: 0,
            type: '',
            status: '',
            // selectList:[]
            options: {
                StartTimes: {
                    type: 'Tdatetime',
                    label: '创建时间',
                    clearable: true,
                    values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])],
                    placeholder: '请选择创建时间'
                },
                StartTime: {
                    type: 'Tdatetime',
                    label: '预约时间',
                    clearable: true,
                    values: [],
                    placeholder: '请选择预约时间'
                },

                visitName: {
                    type: 'input',
                    label: '客户姓名',
                    clearable: true,
                    options: []
                },
                visitPhone: {
                    type: 'input',
                    label: '客户电话',
                    clearable: true,
                    options: []
                }
            },
            deptList: []
        }
    },
    watch: {
        deptId(val) {
            this.deptId = val
            this.gettYPE();
            this.getList();

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
    created() {
        this.getList();
        this.deptId = this.$store.getters.departmentId
        //   this.$nextTick(function(){
        //     this.gettYPE();
        //   })

    },
    mounted() {
        // this.getdepartment();
    },
    methods: {
        ok() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.Dialog = false
                } else {
                    return false;
                }
            });

        },
        operateClick(e) {
            switch (e[0].lab) {
                case '处理':
                    this.handleUpdate(e[1])
                    break
            }
        },
        handleUpdate(row) {
            this.Dialog = true;
        },
        getdepartment() {
            const data = {
                deptId: this.deptId
            }
            this.$api.modules.filing.departmentInfoList(data).then(res => {
                if (res) {
                    res.rows.forEach(item => {
                        item.label = item.departmentName
                        item.value = item.departmentId
                    })
                }
                this.options.departmentId.options = res.rows.filter(item => item.isDepartment == 1)
            })
        },
        gettYPE() {
            let data = {
                deptId: this.deptId,
            }
            this.newcolums = [
                {
                    lab: '科室',
                    val: 'departmentName',
                    width: 200,
                },
                {
                    lab: '医生',
                    val: 'doctorName',
                    width: 200,
                },
            ]
            this.$api.product.expenseList(data).then(res => {
                res.rows.forEach((value, index) => {
                    this.newcolums.push({
                        lab: value.expenseTypeName,
                        val: `edit${index}`,
                        width: 200,
                    })

                })
                console.log(this.newcolums, 'ijij')
            })
        },
        getList(isSearch) {
            var data = {};
            for (const k in this.options) {
                if (this.options[k].type === 'date') {
                    if (this.options[k].values == null) {

                    } else {
                        if (this.options[k].values === null && this.options[k].values !== null) {
                            data['end' + k] = moment(this.options[k].values).format('YYYY-MM-DD HH:mm:ss')
                        }
                        if (this.options[k].values === null && this.options[k].values !== null) {
                            data[k] = moment(this.options[k].values).format('YYYY-MM-DD HH:mm:ss')
                        }
                        if (this.options[k].values === null && this.options[k].values === null) {
                            data[k] = null
                            data['end' + k] = null
                        }
                        if (this.options[k].values !== null && this.options[k].values !== null) {
                            data[k] = moment(this.options[k].values).format('YYYY-MM-DD HH:mm:ss')
                            data['end' + k] = moment(this.options[k].values).format('YYYY-MM-DD HH:mm:ss')
                        }
                        if (this.options[k].values.length === 0) {
                            data[k] = null
                            data['end' + k] = null
                        }
                    }

                } else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            const query = {
                // ycTime:data.StartTime==null?'':data.StartTime.split(' ')[0],
                // createTime:data.StartTimes==null?'':data.StartTimes,
                ...this.pagination,
                deptId: this.deptId,
                visitName: data.visitName,
                visitPhone: data.visitPhone,
                params: {
                    beginCreateTime: data.StartTimes[0] == null ? '' : this.newgetData(data.StartTimes[0]),
                    endCreateTime: data.StartTimes[1] == null ? '' : this.newgetData(data.StartTimes[1]),
                    beginYcTime: data.StartTime.length == 0 ? '' : data.StartTime[0] == null ? '' : this.newgetData(data.StartTime[0]),
                    endYcTime: data.StartTime.length == 0 ? '' : data.StartTime[1] == null ? '' : this.newgetData(data.StartTime[1]),
                }
            }

            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            this.$api.confinementRoom.scheduleVisitInfo(query).then(res => {
                if (res.code == 200) {
                    this.tableData = res.rows;
                    this.pagination.total = res.total
                }
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
        handleClose() {
            this.dialogVisible = false
            this.formList.content = ''
        },
        // 新增
        addDialogs() {
            this.$router.push({
                path: '/addgroupshop', query: { xFlag: 0 }
            })
        },
        // 修改
        edit(val) {
            this.$router.push({
                path: '/addgroupshop', query: { xFlag: 1, id: val.ggId }
            })
        },

        isArrivechange(val) {
            const query = {
                ggId: val.ggId,
                isArrive: val.isArrive == '0' ? '0' : '1',
            }
            this.$api.modules.groupGoods.groupGoodsInfoListEdit(query).then(res => {
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.getList()
                }
            })
        },
        isHomeDisplaychange(val) {
            const query = {
                ggId: val.ggId,
                isHomeDisplay: val.isHomeDisplay == '0' ? '0' : '1',
            }
            this.$api.modules.groupGoods.groupGoodsInfoListEdit(query).then(res => {
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.getList()
                }
            })
        },
        blur(val) {
            const query = {
                ggId: val.ggId,
                orderDisplay: val.orderDisplay
            }
            this.$api.modules.groupGoods.groupGoodsInfoListEdit(query).then(res => {
                if (res) {
                    if (res.code == 200) {
                        this.$message.success('修改成功');
                        this.getList();
                    }
                }
            })

        },
        // 删除
        deletes(val) {
            this.$confirm('是否确认该条数据？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$api.modules.groupGoods.groupGoodsInfoDelete(val).then(res => {
                    if (res) {
                        this.getList()
                        this.$message.success(res.msg)
                    }
                })
            })
        },
        // 保存
        submit() {
            this.$refs.formList.validate(valid => {
                if (valid) {
                    const query = {
                        pushTags: this.formList.pushTags,
                        pushPrompt: this.formList.pushPrompt,
                        // makId:this.formList.makId,
                        backendValue: this.formList.backendValue,
                        pushLabelId: this.formList.pushLabelId ? this.formList.pushLabelId : null
                    }
                    // query.makId=query.makId.toString()
                    if (this.xFlag == 0) {
                        this.$api.modules.systemset.pushLabelInfoAdd(query).then(res => {
                            if (res.code == 200) {
                                this.$message.success('操作成功')
                                this.dialogVisible = false
                                this.getList()
                            } else {
                                this.dialogVisible = false
                            }
                        })
                    } else if (this.xFlag == 1) {
                        this.$api.modules.systemset.pushLabelInfoEdit(query).then(res => {
                            if (res.code == 200) {
                                this.$message.success('操作成功')
                                this.dialogVisible = false
                                this.getList()
                            } else {
                                this.dialogVisible = false
                            }
                        })
                    }
                }
            })

            this.formList.content = ''
        },
        //
        getdeptList() {
            this.$api.dept.deptList({ status: '0' }, 'get').then(res => {
                if (res) {
                    res.data.forEach(item => {
                        let list = []
                        list = item.ancestors.split(',')
                        item.list = list
                        if (list.length == 4) {
                            item.ancestorsId = Number(list[item.list.length - 1])
                            this.deptList.push(item)
                            this.deptList.forEach(value => {
                                value.label = value.deptName;
                                value.value = value.deptId
                            })
                            this.options.deptId.options = this.deptList
                        }
                    })

                }
                this.valuenes = this.deptId
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
<style lang="scss" scoped>
.input {
    ::v-deep .el-input__inner {
        padding: 0px !important;
        text-align: center;
    }
}
</style>