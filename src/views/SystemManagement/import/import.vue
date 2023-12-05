<template>
    <div style="margin: 20px 20px">
      <div >
          产品类型模板: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="handleImport">导入</el-button>
      </div>
        <div style="margin-top: 10px">
            产品信息维护: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="handleProjectInfo">导入</el-button>
        </div>
        <div style="margin-top: 10px">
            顾客信息: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="CustomerCmt">导入</el-button>
        </div>
        <div style="margin-top: 10px">
            接待单信息: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="ReceptionInformation">导入</el-button>
        </div>
        <div style="margin-top: 10px">
            开单信息: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="OrderDetails">导入</el-button>
        </div>
        <div style="margin-top: 10px">
            划扣数据: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="DeductionRecord">导入</el-button>
        </div>
        <div style="margin-top: 10px">
            客户卡包: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="CustomCardSum">导入</el-button>
        </div>
        <div style="margin-top: 10px">
            物资信息数据: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="MaterialInfo">导入</el-button>
        </div>
      <div style="margin-top: 10px">
        回访信息: <el-button  size="mini" plain icon="el-icon-download" type="info" @click="backMaterialInfo">导入</el-button>
      </div>
        <import-template
                ref="import"
                :upload="upload"
                :IfShow="IfShow"
                :xflag="xflag"
                @downloadTemplate="downloadTemplate"
                @handleFileClose="handleFileClose"
                @handleFileUploadProgress="handleFileUploadProgress"
                @handleFileSuccess="handleFileSuccess"
                @handleFileError="handleFileError"
                @submitFileForm="submitFileForm"
        />
    </div>
</template>
<script>
import importTemplate from '@/components/ImportTemplate'
import Treeselect from "@riophae/vue-treeselect";
export default {
    components: {
        importTemplate
    },
    data(){
        return{
          IfShow:true,
            // 用户导入参数
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: '',
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 上传的地址
                url: '/api/share/departmentInfo/importDepartmentInfoData'
            },
            xflag:1
        }
    },
    computed: {
        // eslint-disable-next-line vue/no-dupe-keys
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
        },
        deptName(val) {
            this.$refs.tree.filter(val)
        }
    },
    methods:{
      backMaterialInfo(){
        this.xflag=9
        this.upload.title = '回访信息导入'
        this.upload.open = true
        this.upload.url='/api/confinement/returnVisitHospital/importReturnVisitTemplateData'
      },
        MaterialInfo(){
            this.xflag=8
            this.upload.title = '物资信息导入'
            this.upload.open = true
            this.upload.url='/api/sorage/materialInfo/importMaterialInfoTemplateData'
        },
        CustomCardSum(){
            this.xflag=7
            this.upload.title = '客户卡包导入'
            this.upload.open = true
            this.upload.url='/api/payment/customCardSum/importCustomCardSumTemplateData'
        },
        DeductionRecord(){
            this.xflag=6
            this.upload.title = '划扣信息导入'
            this.upload.open = true
            this.upload.url='/api/scribing/deductionRecord/importDeductionRecordTemplateData'
        },
        OrderDetails(){
            this.xflag=5
            this.upload.title = '开单信息导入'
            this.upload.open = true
            this.upload.url='/api/payment/orderDetails/importOrderDetailsTemplateData'
        },
        ReceptionInformation(){
            this.xflag=4
            this.upload.title = '接待单信息导入'
            this.upload.open = true
            this.upload.url='/api/confinement/receptionInformationList/importReceptionInformationTemplateData'
        },
        CustomerCmt(){
            this.xflag=3
            this.upload.title = '顾客信息导入'
            this.upload.open = true
            this.upload.url='/api/confinement/customerCmt/importCustomerCmtTemplateData'
        },
        handleProjectInfo(){
            this.xflag=2
            this.upload.title = '产品信息维护导入'
            this.upload.open = true
            this.upload.url='/api/confinement/projectInfo/importProjectInfoTemplateData'
        },
        /** 导入按钮操作 */
        handleImport() {
            this.xflag=1
            this.upload.title = '产品类型导入'
            this.upload.open = true
            this.upload.url='/api/share/departmentInfo/importDepartmentInfoData'
        },
        /**
         * @author hpl
         * @date 2023/5/4
         * @Description: 下载产品类型模板
         */
        downloadTemplate() {
            if (this.xflag==1){
                this.$api.imports.importDepartmentInfoTemplate({deptId: this.deptId})
            }else if (this.xflag==2){
                this.$api.imports.importProjectInfoTemplate({deptId: this.deptId})
            }else if (this.xflag==3){
                this.$api.imports.importCustomerCmtTemplate({deptId: this.deptId})
            }else if (this.xflag==4){
                this.$api.imports.importReceptionInformationTemplate({deptId: this.deptId})
            }else if (this.xflag==5){
                this.$api.imports.importOrderDetailsTemplate({deptId: this.deptId})
            }else if (this.xflag==6){
                this.$api.imports.importDeductionRecordTemplate({deptId: this.deptId})
            }else if (this.xflag==7){
                this.$api.imports.importCustomCardSumTemplate({deptId: this.deptId})
            }else if (this.xflag==8){
                this.$api.imports.importMaterialInfoTemplate({deptId: this.deptId})
            }else if (this.xflag==9){
              this.$api.imports.importMaterialInfoTemplateinfo({deptId: this.deptId})
            }

        },
        /**
         * @author Nevin
         * @date 2022/8/11
         * @Description: 提交上传文件
         */
        submitFileForm() {
            // this.$refs.upload.submit()
        },
        /**
         * @author Nevin
         * @date 2022/8/11
         * @Description: 文件上传中处理
         */
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true
        },
        /**
         * @author Nevin
         * @date 2022/8/11
         * @Description: 文件上传成功处理
         */
        handleFileSuccess(response, file, fileList) {
            // this.upload.open = false
            this.upload.isUploading = false
            // this.getData()
        },
        /**
         * @author Nevin
         * @date 2022/8/13
         * @Description: 上传失败处理
         */
        handleFileError() {
            this.upload.open = false
            this.upload.isUploading = false
        },
        /**
         * @author Nevin
         * @date 2022/8/12
         * @Description: 关闭弹窗
         */
        handleFileClose() {
            this.upload.open = false
        }
    }
}
</script>