<template>
    <div>

        <sg-table v-if="true" :hide-search-bar="true" :table-data="tableData" :pagination="pagination" :columns="columns"
            :operate="operate" @operateClick="operateClick" @size-change="sizeChange" @current-change="currentChange">
            <div slot="header">
                <el-button size="mini" plain icon="el-icon-plus" type="primary" @click.stop="handleAdd">新增</el-button>
                <input type="file" style="visibility:hidden" id="file" @change="changeImg">
                <!-- <el-input v-model="pagination.typeTwoName" clearable class="header-search-item" style="width: 200px;" size="mini" placeholder="请输入类型名称" />
          <el-button icon="el-icon-search" size="mini" type="primary" @click="getData(true)">搜索</el-button>
          <el-button size="mini" @click="resetFormSearch">重置</el-button> -->
            </div>
            <template #custom="data">
                <div v-if="data.props === 'roomTypeName'">
                    <a @click="filing(data.custom)">{{ data.custom.roomTypeName }}</a>
                </div>
                <div v-if="data.props === 'detailsImage'" style="display:flex;align-items:center;justify-content:center">
                    <img :src="data.custom.imgurl" style="width:30px;height:30px;border-radius:50%" />
                </div>
                <div v-if="data.props === 'details'">
                    <el-tooltip class="item" effect="dark" :content="data.custom.details" placement="top-start">
                        <div style="cursor:pointer">
                            {{ data.custom.details.length > 20 ? data.custom.details.substr(0, 20) + '...' : data.custom.details }}
                        </div>
                    </el-tooltip>
                </div>
            </template>
        </sg-table>
        <sgDialog :title="dialogTitle" size="700px" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
                <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="120px">
                    <el-form-item label="门店详细名称" prop="detailsName">
                        <el-input v-model="form.detailsName" placeholder="请输入门店详细名称" maxlength="4" show-word-limit />
                    </el-form-item>
                    <el-form-item label="门店详细图片" prop="detailsImage">
                        <el-input v-model="form.detailsImage" placeholder="请上传门店详细图片，建议300*200" @click.native="seleImg" />
                    </el-form-item>
                    <el-form-item label="门店详情" prop="details">
                        <wangeditor :content="form.details" @catchData="catchData"></wangeditor>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">确认</el-button>
                        <el-button @click="showDialog = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </sgDialog>
    </div>
</template>
  
<script>
import sgTable from '@/components/Table/index'
import sgDialog from '@/components/Dialog/index'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
const serverPath = process.env.VUE_APP_BASE_API + '/file'
import wangeditor from '@/components/wangeditor'
export default {
    name: 'FilingTypeTwo',
    components: {
        sgTable,
        sgDialog,
        wangeditor
    },
    data() {
        return {
            // 加载
            loadingData: false,
            // 表格数据
            tableData: [],
            dialogTitle: undefined,
            showDialog: false,
            fatherType: undefined,

            // 表单数据
            form: {
                detailsName: "",
                detailsImage: "",
                details: '',
                storeDetailsId: '',
                roomTypeId: '',
            },
            // 表单校验
            rules: {
                detailsName: [
                    { required: true, message: '请输入门店详细名称', trigger: 'blur' }
                ],
                detailsImage: [
                    { required: true, message: '请上传门店详细图片,建议300*200', trigger: 'blur' }
                ],
                details: [
                    { required: true, message: '请输入门店详细信息', trigger: 'blur' }
                ]
            },
            // 分页 搜索
            pagination: {
                show: true,
                typeTwoName: undefined,
                pageNum: 1,
                pageSize: 20,
                total: 0,
                currentPage: 1
            },
            // 操作列
            operate: {
                name: '操作',
                width: '160',
                cell: [
                    {
                        lab: '修改',
                        type: 'warning'
                    },
                    {
                        lab: '删除',
                        type: 'danger'
                    }
                ]
            },
            // 表格数据列
            columns: [
                {
                    lab: '门店详细名称',
                    val: 'detailsName',
                },
                {
                    lab: '二级门店图片',
                    val: 'detailsImage',
                    custom: 'detailsImage'
                }, {
                    lab: '门店详细信息',
                    val: 'details',
                    custom: 'details'

                }
            ]
        }
    },
    created() {
        let item = sessionStorage.getItem('filingTypeTwoitem')
        this.pagination.filingId = item
        this.fatherType = item
        this.getData()
    },
    methods: {
        catchData(e) {
            this.form.details = e;
        },
        seleImg() {
            document.querySelector('#file').click();
        },
        changeImg(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            let len = e.target.files[0].name.split('.')
            if (e.target.files[0].name.split('.')[len.length - 1] !== 'bmp' && e.target.files[0].name.split('.')[len.length - 1] !== 'gif' && e.target.files[0].name.split('.')[len.length - 1] !== 'jpg' && e.target.files[0].name.split('.')[len.length - 1] !== 'jpeg' && e.target.files[0].name.split('.')[len.length - 1] !== 'png') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
                return
            }
            let fromdata = new FormData();
            fromdata.append('file', e.target.files[0]);
            this.$api.confinementRoom.unload(fromdata).then(res => {
                if (res.code == 200) {
                    this.form.detailsImage = res.data.url;
                    this.$message.success('上传成功')
                }
            })
            e.target.value = ''
        },
        filing(data) {
            this.$router.push({ path: 'threeDoor', query: { roomTypeId: data.roomTypeId } })
        },
        // 分页
        sizeChange(e) {
            this.searchBar.pageSize = e[1]
            this.getData()
        },
        currentChange(e) {
            this.searchBar.pageNum = e[1]
            this.searchBar.currentPage = e[1]
            this.getData()
        },
        // 操作列
        operateClick(e) {
            switch (e[0].lab) {
                case '修改':
                    this.handleUpdate(e[1])
                    break
                case '删除':
                    this.handleDelete(e[1])
            }
        },
        // 添加
        handleAdd() {
            this.showDialog = true
            this.form = {
                detailsName: "",
                detailsImage: "",
                details: '',
                storeDetailsId: '',
                roomTypeId: '',
            },
                this.$nextTick(() => {
                    this.dialogTitle = '添加门店详细'
                })
        },
        // 修改
        async handleUpdate(e) {
            this.form = {
                detailsName: e.detailsName,
                detailsImage: e.detailsImage,
                details: e.details,
                storeDetailsId: e.storeDetailsId,
                roomTypeId: e.roomTypeId,
            }
            this.showDialog = true
            this.dialogTitle = '修改门店详情'
            // await this.$api.modules.filing.filingTwoOperate().then(res => {
            //   if (res) {

            //     this.$nextTick(() => {
            //       this.resetForm()
            //       this.form = res.data
            //       this.dialogTitle = '修改二级建档类型'
            //     })
            //   }
            // })
        },
        // 删除
        handleDelete(e) {
            this.$confirm('是否确认删除数据？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$api.confinementRoom.roomTypeInforemovelist(e.storeDetailsId).then(res => {
                    if (res) {
                        this.getData()
                        this.$message.success(res.msg)
                    }
                })
            }).catch(() => {

            })
        },
        // 关闭弹窗
        handleClose() {
            this.showDialog = false
        },
        // 重置表单
        resetForm(form) {
            if (form) {
                this.pagination = {
                    pageNum: 1,
                    pageSize: 20,
                    show: true,
                    total: 0,
                    filingId: this.fatherType,
                    typeTwoName: undefined
                }
            } else {
                this.$refs.form.resetFields()
                this.form = {
                    typeTwoName: undefined
                }
            }
        },
        resetFormSearch() {
            this.pagination.typeTwoName = undefined
            this.getData(true)
        },
        // 获取数据
        getData: debounce(function (isSearch) {
            /**
             * @author Nevin
             * @date 2022/8/12
             * @Description: 如果点击搜索按钮，将页码设为1
             */
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            this.loadingData = true
            this.$api.confinementRoom.listthree({
                roomTypeId: this.$route.query.roomTypeId,
            }).then(res => {
                if (res) {
                    res.rows.forEach(value => {
                        value.imgurl = serverPath + value.detailsImage
                    })
                    this.tableData = res.rows
                    this.pagination.total = res.total
                }
            }).finally(() => {
                this.loadingData = false
            })
        }),
        // 提交表单
        async submitForm() {
            this.form.roomTypeId = this.$route.query.roomTypeId;
            await this.$refs.form.validate(async valid => {
                if (valid) {
                    if (this.form.storeDetailsId !== '') {
                        await this.$api.confinementRoom.storeDetailsListedit(this.form).then(res => {
                            if (res) {
                                this.$message.success(res.msg)
                                this.showDialog = false
                                this.getData()
                            }
                        })
                    } else {
                        await this.$api.confinementRoom.storeDetailsList(this.form).then(res => {
                            if (res) {
                                this.$message.success(res.msg)
                                this.showDialog = false
                                this.getData()
                            }
                        })
                    }

                }
            })
        }
    }
}
</script>
  