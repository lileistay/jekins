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
                    @size-change="sizeChange" :hideSearchBar="true" @current-change="currentChange">

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
                        <div v-if="data.props == 'activityType'">
                            {{ data.custom.activityType == '1' ? '拼团' : '秒杀' }}
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

    </div>
</template>
<script>
import SgTable from '@/components/Table'
import EditorBar from '@/components/wangeditor'
import sgDialog from '@/components/Dialog'
import {newgetData, todayTime} from "@/utils/time";
import slideSearch from '@/components/SlideSearchBar/index'
import moment from "moment";
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
            newcolums: [
                {
                    lab: '科室',
                    val: 'departmentName',
                    width: 200,
                },
                {
                    lab: '医生',
                    val: 'doctorName',
                    width: 200,
                }
            ],
            columnsl: [


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
            rules: {
                pushTags: [{ required: true, message: '推送标签不能为空', trigger: 'blur' }],
                pushPrompt: [{ required: true, message: '推送提示不能为空', trigger: 'blur' }],
                // makId: [{ required: true, message: '模板标签不能为空', trigger: 'blur' }],
                backendValue: [{ required: true, message: '消息替换字段不能为空', trigger: 'blur' }],
            },
            xFlag: 0,
            type: '',
            status: '',
            // selectList:[]
            options: {
                StartTime: {
                  type: 'Tdatetime',
                    label: '查询时间',
                    clearable: true,
                    values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
                },
                departmentId: {
                    type: 'select',
                    label: '科室',
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
        let data = {
            deptId: this.deptId,
        }
        this.$api.product.expenseList(data).then(res => {
            res.rows.forEach((value, index) => {
                this.newcolums.push({
                    lab: value.expenseTypeName,
                    val: 'edit2',
                    width: 200,
                })

            })

        })
        //   this.$nextTick(function(){
        //     this.gettYPE();
        //   })

    },
    mounted() {
        this.getdepartment();
    },
    methods: {
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
            var data = {}
            for (const k in this.options) {
                if (this.options[k].type === 'Tdatetime') {
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
            const query = {
                startTime: data.StartTime,
                endTime: data.endStartTime,
                ...this.pagination,
                deptId: this.deptId,
                departmentId:data.departmentId,
            }
            if (data.activityType == '1') {
                this.columns = this.columnsl;
                setTimeout(function () {
                    document.querySelector('.el-table__body-wrapper').style.height = '690px'
                }, 500)
            } else {
                this.columns = this.newcolums
            }
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            this.$api.confinementRoom.getHospitalPerformance(query).then(res => {
                this.tableData = [];
                if (res.code == 200) {
                    if (res.rows == null) {
                        return
                    }
                    res.rows.forEach(value => {
                        let object = {};
                        object.doctorName = value.doctorName
                        object.departmentName = value.departmentName
                        this.newcolums.forEach((values, index) => {
                            if (index > 1) {
                                value.performance.forEach(newvalue => {
                                    if (newvalue.expenseType == values.lab) {
                                        object[`edit${index - 2}`] = newvalue.amountReceived
                                    }
                                })
                            }
                        })
                        this.tableData.push(object)
                    })
                    this.pagination.total = res.total
                }
            })
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