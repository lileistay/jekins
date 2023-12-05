<template>
    <sgDialog title="自定义配置"  size="360px" :modal="false" :dialog="showDialogS" @handleClose="showdialogT">
        <div slot="out">
            <sg-table
                    ref="sortRef"
                    :sg-ref="'sortRefs'"
                    size="mini"
                    :row-key='getlab'
                    :table-data="sortList"
                    :columns="columnssortList"
                    border
                    index="序号"
                    selection
                    @select="itemHandleSelectionChange"
                    :class="drow_table"
                    :selectEnable="selectEnable"
                    :row-class-name="tableRowClassName"
            >
                <div slot="searchBar"></div>
                <template #custom="data">
                    <div v-if="data.props === 'icon'">
                        <i class="el-icon-d-caret"></i>
                    </div>
                </template>
            </sg-table>
        </div>
    </sgDialog>
</template>
<script>
import sgDialog from '@/components/Dialog/index'
import SgTable from '@/components/Table'
export default {
   components:{sgDialog,SgTable,} ,
    props:{
        drow_table:{
            type: String,
            default: ''
        },
        showDialogS:{
            type: Boolean,
            default: false
        },
        sortList:{ //顺序列表
            type:Array,
            default: () => {
                return []
            }
        },
        selectEnable:{
            type:Function,
            default: () => {
                return []
            }
        },
        tableRowClassName:{
            type:Function,
            default: () => {
                return []
            }
        },
        itemHandleSelectionChange:{
            type:Function,
            default: () => {
                return []
            }
        }
    },
    data(){
       return{
           // sortList:[],
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

       }
    },
    methods:{
        // 返回列表的唯一值
        getlab(row){
            return row.lab
        },
        // 点击选择
        // itemHandleSelectionChange() {
        //     this.$emit('itemHandleSelectionChange')
        // },
        // // 判断禁用
        // selectEnable() {
        //     this.$emit('selectEnable')
        // },
        // 返回某一行指定样式
        // tableRowClassName(){
        //     this.$emit('tableRowClassName')
        // },
        // 返回某一行指定样式
        showdialogT(){
            this.$emit('showdialogT')
        },

    }
}
</script>
<style lang="scss" scoped>
::v-deep .flagclass{
    cursor: not-allowed;
    pointer-events: none;
    color: #ccc;
}
</style>