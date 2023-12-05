<template>
    <div>

    </div>
</template>
<script>
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog'
export default {
    components: {
        SgTable,
        SgDialog
    },
    data() {
        return {
            customLabelDialog: false,
            newcustomLabelDialog:false,
            textarea: "",
            newtextarea:"",
            tableData: [],
            pagination: {
                show: true,
                pageNum: 1,
                pageSize: 20,
                total: 0,
                currentPage: 1
            },
            columns: [
                {
                    lab: '内容',
                    val: 'name',
                },
                {
                    lab: '操作',
                    val: 'names',
                    custom: 'names',
                    width:200
                }
            ]
        }
    },
    created() {

    },
    methods: {
        edit(data){
        this.newcustomLabelDialog=true;

        },
        deletesel(data){
            this.$confirm('确认删除快捷回复吗，是否继续？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
            console.log(res)
            }).catch(res=>{
                console.log(res)
            })
        },
        appointmentAddition() {
            this.customLabelDialog = true;
        },
        newok(){

        },
        ok() {
            this.tableData.push({
                name: this.textarea,
            })
            this.customLabelDialog = false;
        },
    }
}
</script>

<style scoped></style>