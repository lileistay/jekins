<template>
    <div>
        <div style="height: 40px;margin-left: 20px;">
            <div style="height: 10px;"></div>
            <el-button type="success" size="mini" @click="addyg" icon="el-icon-plus">新建分类</el-button>

        </div>
        <div class="table">
            <el-table :data="tableData" :height="height" border class="tables" :fit="true" style="width:100%">
                <el-table-column prop="categoryName" label="分类名称"  align="center">
                </el-table-column>
                <el-table-column prop="enableFlag" label="状态"  align="center">
                    <template slot-scope="scope">
                        <span style="color: rgb(103, 194, 58);" v-show="scope.row.enableFlag == 0">
                            使用中
                        </span>
                        <span v-show="scope.row.enableFlag == 1">
                            未使用
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="weightSort" label="权重"  align="center">
                </el-table-column>
                <el-table-column prop="date" label="操作"  align="center">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="mini" @click="newedit(scope.row)">
                            增加下级分类
                        </el-button> -->
                        <!-- <el-button type="text" size="mini" @click="newdelete(scope.row.categoryId)"
                            v-has-permi="['client:productCategory:remove']" style="color: red;">
                            删除
                        </el-button> -->
                        <el-button type="text" size="mini" @click="newedit(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="text" size="mini" @click="stopuse(scope.row)" v-show="scope.row.enableFlag == 0"
                            style="color: red;">
                            停用
                        </el-button>
                        <el-button type="text" size="mini" @click="continueuse(scope.row)" v-show="scope.row.enableFlag == 1"
                            style="color: rgb(103, 194, 58);">
                            使用
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagation">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <!-- <div style="position: absolute;bottom: 0;">dsadsad</div> -->
        </div>
        <!-- 新增分类 -->
        <sgDialog title="新增分类" size="20%" out-top="2%" :dialog="showDig" @handleClose="closeRoomDialogtooth">
            <div slot="out">
                <span style="color:red">*</span> <span>分类名称</span>
                <span>
                    <el-input size="mini" style="margin-left: 20px;width: 200px;" v-model="categoryName">

                    </el-input>
                </span>
                <div style="height: 10px;">

                </div>
                <span>权重</span>
                <span style="margin-left: 40px;">
                    <el-input size="mini" style="margin-left: 20px;width: 200px;" v-model="weightSort">

                    </el-input>
                </span>
                <div style="height: 50px;">

                </div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok"
                            v-has-permi="['client:productCategory:add']">确定</el-button>
                        <el-button @click="closeRoomDialogteeth" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>

        <!-- 编辑分类 -->
        <sgDialog title="新增分类" size="20%" out-top="2%" :dialog="showDigs" @handleClose="closeRoomDialogtooths">
            <div slot="out">
                <span style="color:red">*</span> <span>分类名称</span>
                <span>
                    <el-input size="mini" style="margin-left: 20px;width: 200px;" v-model="categoryNames">

                    </el-input>
                </span>
                <div style="height: 10px;">

                </div>
                <span>权重</span>
                <span style="margin-left: 40px;">
                    <el-input size="mini" style="margin-left: 20px;width: 200px;" v-model="weightSorts">

                    </el-input>
                </span>
                <div style="height: 50px;">

                </div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="oks"
                            v-has-permi="['client:productCategory:edit']">确定</el-button>
                        <el-button @click="closeRoomDialogteeths" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
    </div>
</template>
<script>
const serverPath = process.env.VUE_APP_BASE_API+'/file';
import sgDialog from '@/components/Dialog/index'
export default {
    components: {
        sgDialog
    },
    data() {
        return {
            total: "",
            tableData: [],
            height: '0px',
            currentPage4: 0,
            pageSize: 20,
            pageNum: 1,
            serverPaths: "",
            showDig: false,
            categoryName: "",
            weightSort: 0,
            showDigs: false,
            categoryNames: "",
            weightSorts: "",
            categoryId: 0,



        }
    },
    watch: {
        $route() {
            this.search();
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
    mounted() {
        this.deptId = this.$store.getters.departmentId
    },
    created() {
     
        this.search();
        this.$nextTick(function () {
            this.height = document.documentElement.clientHeight - 222 + 'px'
            document.querySelector('.table').style.height = document.documentElement.clientHeight - 172 + 'px'
            document.querySelector('.tables').style.height = document.documentElement.clientHeight - 172 + 'px'
        })
    },
    methods: {
        stopuse(val) {
            this.$confirm('确认停用商品分类信息，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    categoryName: val.categoryName,
                    weightSort: val.weightSort,
                    categoryId: val.categoryId,
                    deptId: val.deptId,
                    enableFlag: '1'
                }
                this.$api.confinementRoom.productCategoryedit(data).then(res => {
                    if (res) {
                        this.$message.success('停用成功');
                        this.showDigs = false;
                        this.search();
                    }
                })

            }).catch(() => {

                //   this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                //   });          
            });

        },
        continueuse(val) {
            this.$confirm('确认使用商品分类信息，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    categoryName: val.categoryName,
                    weightSort: val.weightSort,
                    categoryId: val.categoryId,
                    deptId: val.deptId,
                    enableFlag: '0'
                }
                this.$api.confinementRoom.productCategoryedit(data).then(res => {
                    if (res) {
                        this.$message.success('使用成功');
                        this.showDigs = false;
                        this.search();
                    }
                })

            }).catch(() => {

                //   this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                //   });          
            });
        },
        closeRoomDialogteeths() {
            this.showDigs = false
        },
        oks() {
            this.showDigs = false;
            let data = {
                categoryName: this.categoryNames,
                weightSort: this.weightSorts,
                categoryId: this.categoryId,
                deptId: this.deptId,
            }
            this.$api.confinementRoom.productCategoryedit(data).then(res => {
                if (res) {
                    this.$message.success('修改分类成功');
                    this.showDigs = false;
                    this.search();
                }
            })

        },
        closeRoomDialogtooths() {
            this.showDigs = false;
        },
        ok() {
            if (this.categoryName == '') {
                this.$message.warning("请输入分类名称");
                return;
            }
            let data = {
                categoryName: this.categoryName,
                weightSort: this.weightSort,
                deptId: this.deptId,
            }
            this.$api.confinementRoom.productCategory(data).then(res => {
                if (res) {
                    this.$message.success('新增分类成功');
                    this.showDig = false;
                    this.search();
                }
            })
            // productCategory
        },
        closeRoomDialogteeth() {
            this.showDig = false;
        },
        closeRoomDialogtooth() {
            this.showDig = false
        },
        newdelete(id) {
            this.$confirm('确认删除分类信息，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.$api.confinementRoom.productCategorydel(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.search();
                })

            }).catch(() => {

                //   this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                //   });          
            });

        },
        newedit(val) {
            this.showDigs = true;
            this.categoryNames = val.categoryName;
            this.weightSorts = val.weightSort;
            this.categoryId = val.categoryId
            // this.$router.push('/addemployee');
            // localStorage.setItem('addemployee', true);
            // localStorage.setItem('addemployeeId', JSON.stringify(val));
        },
        addyg() {
            this.categoryName = '';
            this.showDig = true;
            //   localStorage.setItem('addemployee',false);
            //     this.$router.push('/addemployee');
        },
        handleCurrentChange(e) {
            this.pageNum = e;
        },
        handleSizeChange(e) {
            this.pageSize = e
        },
        search() {
            let data = {
                deptId: this.deptId,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            this.$api.confinementRoom.productCategorylist(data).then(res => {
                this.tableData = res.rows;
                this.total = res.total;
            })

        }
    }
}
</script>
  
<style scoped lang="scss">
::v-deep .el-table__row td {
    padding: 5px !important;
}

.table {
    width: 100%;
    position: relative;
    /* height: 100%;
    position: fixed; */
}

::v-deep .el-scrollbar {
    width: 100%;
    height: 100%;

    .el-scrollbar__wrap {
        margin-bottom: 0 !important;
        overflow-x: unset;
    }
}

// ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
//   width: 10px;
//   height: 10px;
//   background-color: aqua;
// }
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 8px;
    z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 20px;
    background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    //box-shadow: inset 0 0 5px #999;
    background: transparent;
    //border-radius: 2px;
}

.pagation {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

::v-deep .el-pager li.active {
    background-color: #409eff !important;
    color: #fff;
}</style>