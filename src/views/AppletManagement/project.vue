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
                    :table-data="tableData" :columns="newcolums" :pagination="pagination" highlight-current-row
                    @size-change="sizeChange" :hideSearchBar="true" @current-change="currentChange">

                    <div slot="header" style="width: 100%;">
                        <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
                        <div style="float: right;">
                            <el-button size="mini" v-has-permi="['confinement:dividendType:add']" type="primary"
                                icon="el-icon-plus" @click="addDialogs">新增</el-button>
                            <!--          <el-button size="mini"  v-has-permi="['confinement:dividendType:delete']" type="danger" icon="el-icon-plus" @click="deleteDialogs">删除</el-button>-->
                        </div>
                    </div>
                    <template #custom="data">

                        <div v-if="data.props === 'photoAddr'">
                            <img :src="data.custom.imhurl" style="width:30px;height:30px;border-radius:50%" />
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
                                @click="deletes(data.custom.subsidiaryId)">删除</el-button>
                        </div>
                        <div v-if="data.props === 'salesVolume'">
                            {{ Number(data.custom.inventory) - Number(data.custom.salesVolume) }}
                        </div>

                    </template>
                </sg-table>
            </slot>
        </slideSearch>
        <sgDialog :title="newtitle" :dialog="projectName" @handleClose="projectNameol" size="400px">
            <div slot="out" style="height:400px">
                <div>
                    <span><span style="color:red">*</span> 预约科室</span>
                    <el-select v-model="departmenIds" placeholder="请选择" size="mini" style="margin-left:10px">
                        <el-option v-for="item in optionsel" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div style="margin-top:20px">
                    <span><span style="color:red">*</span> 预约人数</span>
                    <el-input style="width:190px;margin-left:10px" size="mini" v-model="virtualNum"
                        placeholder="请输入预约人数"></el-input>
                </div>
                <div style="margin-top:20px;display:flex;width:100%;">
                    <span><span style="color:red">*</span> 科室图标</span>
                    <div style="height:100px">
                        <Upload :limit="1" style="margin-left:10px" @successFile="successFile" @remove="remove"
                            :fileList="fileList" v-if="ifupload"></Upload>
                    </div>
                </div>
                <div style="margin-top:70px;display:flex;width:100%;">
                    <span><span style="color:red">*</span> 科室介绍</span>
                    <el-input type="textarea" :rows="4" style="width:280px;margin-left:10px" placeholder="请输入科室介绍"
                        v-model="departmentContent"></el-input>
                </div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok">确定</el-button>
                        <el-button @click="projectNameol" size="mini">取消</el-button>
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
import { todayTime } from "../../utils/time";
import slideSearch from '@/components/SlideSearchBar/index'
import moment from "moment";
import Upload from '@/components/newUpload'
const serverPath = process.env.VUE_APP_BASE_API + '/file'
export default {
    name: 'groupshop',
    dicts: ['file_type', 'sys_job_status'],
    components: {
        SgTable,
        EditorBar,
        sgDialog,
        slideSearch,
        Upload
    },
    data() {
        return {
            tableData: [],
            virtualNum: '',
            ifupload:false,
            fileList: [],
            photoAddr: "",
            departmentContent: "",
            subsidiaryId: "",
            projectName: false,
            departmenIds: "",
            optionsel: [],
            newtitle: '新增预约配置',
            newcolums: [
                // {
                //     lab: '排序',
                //     val: 'orderDisplay',
                //     custom: 'orderDisplay',
                //     width: 150
                // },
                {
                    lab: '预约科室',
                    val: 'departmentName',
                    width: 150
                },
                {
                    lab: '预约人数',
                    val: 'virtualNum',

                },
                {
                    lab: '科室图标',
                    val: 'photoAddr',
                    custom: 'photoAddr',

                },
                {
                    lab: '科室介绍',
                    val: 'departmentContent',

                },
                {
                    lab: '操作',
                    val: 'edit',
                    custom: 'edit',
                    // fixed: 'right',
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
                departmentId: {
                    type: 'select',
                    label: '科室',
                    options: [],
                },
                // deptId: {
                //     type: 'select',
                //     label: '公司名称:',
                //     clearable: true,
                //     options: []
                // },
            },
            deptList: []
        }
    },
    watch: {
        deptId(val) {
            this.getList()
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
        this.deptId = this.$store.getters.departmentId
        this.getList()
        // this.getdeptList()
        this.getdeptpatment();

    },
    mounted() {
    },
    methods: {
        projectNameol(){
         this.projectName=false;
         this.ifupload=false;
        },
        successFile(data) {
            this.photoAddr = data.url;
        },
        remove() {
            this.photoAddr = ''
        },
        ok() {
            if (this.departmenIds == '' || this.departmenIds == null) {
                this.$message.warning('请输入预约科室');
                return;
            }
            if (this.virtualNum == '' || this.virtualNum == null) {
                this.$message.warning('请输入预约人数');
                return;
            }
            if (this.photoAddr == '' || this.photoAddr == null) {
                this.$message.warning('请上传科室图标');
                return;
            }
            if (this.departmentContent == '' || this.departmentContent == null) {
                this.$message.warning('请输入科室介绍');
                return;
            }
            let data = {
                departmentContent: this.departmentContent,
                departmentId: this.departmenIds,
                photoAddr: this.photoAddr,
                virtualNum: this.virtualNum,
                deptId: this.deptId,
                subsidiaryId: this.newtitle == '修改预约配置' ? this.subsidiaryId : '',
            }
            if (this.newtitle == '修改预约配置') {

                this.$api.confinementRoom.departmentSubsidiaryInfoedit(data).then(res => {
                    if (res.code == 200) {
                        this.$message.success('修改成功')
                        this.getList();
                        this.projectName = false;
                        this.ifupload=false;

                    }
                })
            } else {
                this.$api.confinementRoom.departmentSubsidiaryInfo(data).then(res => {
                    if (res.code == 200) {
                        this.$message.success('配置成功')
                        this.getList();
                        this.projectName = false;
                        this.ifupload=false;
                    }
                })
            }

        },
        getdeptpatment() {
            let data = {
                deptId: this.deptId,
                isDepartment: 1
            }
            this.$api.confinementRoom.list(data).then(res => {
                res.rows.forEach(value => {
                    value.label = value.departmentName;
                    value.value = value.departmentId
                })
                this.options.departmentId.options = res.rows;
                this.optionsel = res.rows;
            })
        },

        // getSelectlist(){
        //   this.$api.modules.systemset.markdownTemplates().then(res=>{
        //     if (res.code==200){
        //       this.selectList=res.rows
        //     }
        //   })
        // },
        // getList(isSearch){
        //   if (isSearch){
        //     this.pagination.pageNum = 1
        //     this.pagination.currentPage = 1
        //   }
        //   this.$api.modules.groupGoods.groupGoodsInfoList(this.pagination).then(res=>{
        //     if (res.code==200){
        //       this.tableData=res.rows
        //       this.pagination.total=res.total
        //     }
        //   })
        // },
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
                } else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            const query = {
                departmentId: data.departmentId,
                deptId: data.deptId,
            }
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            this.$api.confinementRoom.lists(query).then(res => {
                if (res.code == 200) {
                    res.rows.forEach(value => {
                        value.imhurl = serverPath + value.photoAddr
                    })
                    this.tableData = res.rows
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
           let that=this;
            this.newtitle = '新增预约配置'
            this.projectName = true;
            this.ifupload=true
            this.departmenIds = '';
            this.virtualNum = '';
            this.photoAddr = '';
            this.departmentContent = '';
            that.fileList=[];
            
        },
        // 修改
        edit(val) {
            let that=this;
            this.$api.confinementRoom.subsidiaryIddec(val.subsidiaryId).then(res => {
    
                this.newtitle = '修改预约配置'
                this.projectName = true;
                this.departmenIds = val.departmentId;
                this.ifupload=true;
                this.virtualNum = val.virtualNum;
                this.departmentContent = val.departmentContent;
                this.photoAddr = val.photoAddr;
                this.subsidiaryId = val.subsidiaryId
                that.fileList = [{
                    name: "科室图标",
                    url: serverPath + val.photoAddr
                }];
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
            this.$confirm('是否确认删除该条数据？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                console.log(val, 'sadasd')
                await this.$api.confinementRoom.messageTypeIdsdel(val).then(res => {
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