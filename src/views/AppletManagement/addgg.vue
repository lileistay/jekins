<template>
    <div>
        <Tree :clums="clums" :operation="operation" :isShowfile="isShowfile" :tableData="tableData"
            :showDefault="showDefault" :total="total" :tableIndex="tableIndex" :tableCheckbox="tableCheckbox" :row-class-name="rowClassName"  @changeCompay="changeCompay" @rowClick="rowClick"
            @handleSelectionChang="handleSelectionChang" @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId">
            <!-- 头部操作按钮 -->
            <template v-slot:button>
                <div>
                    <span class="Left">快捷操作</span>
                    <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus">新增商品</el-button>
                </div>
            </template>
            <!-- 自定义内容填充 -->
            <template v-slot:tabular="{ data }">
                <div v-if="data.name == 'projectName'">
                    <a href="">不同内容</a>
                </div>
                <div v-if="data.name == 'shelfTime'">
                    <a href="">不同需求</a>
                </div>
            </template>
            <!-- 操作按钮 -->
            <template v-slot:camera="{ newdata }">
                <el-button type="text" size="mini" @click="newdelete(newdata)">
                    删除


                </el-button>
            </template>
            <!-- 自定义页面 -->
            <template v-slot:company>
                
            </template>
        </Tree>
    </div>
</template>
<script>
import Tree from '@/components/newTree/index'
export default {
    components: {
        Tree
    },
    created() {
        //模拟数据
        let data = {
            deptId: 4
        }
        this.$api.confinementRoom.companyMemberlist(data).then(res => {
            console.log(res, 'sdadgasd')
        })
    },
    data() {
        return {
            //表格数据
            tableData: [],
            //表格表头
            clums: [
                {
                    value: "projectName",
                    label: "商品名称",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "shelfTime",
                    label: "上架类型",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "projectName",
                    label: "商品名称",
                }
            ],
            //操作按钮
            operation: [
                {
                    label: '删除',
                    val: '0'
                }
            ],

            //是否显示树形文件
            isShowfile: false,
            //是否显示默认组件
            showDefault: true,
            //是否显示表格操作按钮
            showoperation: true,
            //默认条数为0
            total: 0,
            //是否显示表格索引
            tableIndex:false,
            //是否显示表格复选框
            tableCheckbox:false,
        }
    },
    methods: {
          //自定义行颜色
        rowClassName(row){

        },
        //deptId改变之后的回调
        changeDeptId(id) {
            alert(id)
        },
        newdelete(data) {
            console.log(data)
        },
        //点击页码
        handleCurrentChange(e) {
            alert(e)
        },

        //点击选择条数
        handleSizeChange(e) {
            alert(e)
        },
        //点击复选框的回调
        handleSelectionChang(row) {
            // console.log(row,'sadgasd')
        },
        //点击树形三级的回调
        changeCompay(id) {
            alert(id)
        },
        //点击表格每一行的回调
        rowClick(data) {

        }
    }
}
</script>
<style scoped></style>