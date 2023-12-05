<template>
    <div>
        <Tree :clums="clums" :operation="operation" :isShowfile="isShowfile" :tableData="tableData"
            :showDefault="showDefault"
            @changeCompay="changeCompay" @rowClick="rowClick" @handleSelectionChang="handleSelectionChang"
            @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId"
            @jurisdiction="newjurisdiction">
            <!-- 操作按钮 -->
            <template v-slot:button>
                <div>
                    <span class="Left">快捷操作</span>
                    <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus">新增商品</el-button>
                </div>
            </template>
            <!-- 自定义内容填充 -->
            <template v-slot:tabular="{ data }">
                <div v-if="data.name == 'projectName'">
                    <a href="">sdadsad</a>
                </div>
                <div v-if="data.name == 'shelfTime'">
                    <a href="">哈哈哈</a>
                </div>
            </template>
            <!-- 操作按钮 -->
            <template v-slot:camera="{ newdata }">
                <el-button type="text" size="mini" @click="newdelete(newdata)">
                    删除
                </el-button>
            </template>
            <template v-slot:company>
                    <div style="width: 100%;height:795px;">
                        <div style="height: 40px;margin-left: 20px;">
                <div style="height: 10px;"></div>
                <el-button type="success" size="mini" @click="addyg" icon="el-icon-plus" :disabled="newjurisdictions">新建分类</el-button>
            </div>
            <el-table :data="tableData"  height="717" border class="tables" :fit="true" style="width:100%">
              <el-table-column prop="weightSort" label="权重"  align="center">
                <template slot-scope="scope">
                  <div >
                    <el-input size="mini" v-model="scope.row.weightSort" @blur="blur(scope.row)" style="width: 50px"/>
                  </div>
                </template>
              </el-table-column>
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

		<el-table-column prop="date" label="操作"  align="center">
			<template slot-scope="scope">
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
            <!-- <div class="table"> -->
                    </div>
            </template>
        </Tree>
        <sgDialog title="新增分类" size="350px" out-top="2%" :dialog="showDig" @handleClose="closeRoomDialogtooth">
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
        <sgDialog title="编辑分类" size="350px" out-top="2%" :dialog="showDigs" @handleClose="closeRoomDialogtooths">
            <div slot="out">
                <span style="color:red">*</span> <span>分类名称</span>
                <span>
                    <el-input size="mini" style="margin-left: 20px;width: 200px;" v-model="categoryNames">

                    </el-input>
                </span>
                <div style="height: 10px;">

                </div>
<!--                <span>权重</span>-->
<!--                <span style="margin-left: 40px;">-->
<!--                    <el-input size="mini" style="margin-left: 20px;width: 200px;" v-model="weightSorts">-->

<!--                    </el-input>-->
<!--                </span>-->
                <div style="height: 50px;">

                </div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: right;">
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
import Tree from '@/components/newTree/index'
const serverPath = process.env.VUE_APP_BASE_API+'/file';
import sgDialog from '@/components/Dialog/index'
export default {
    components: {
        Tree,
        sgDialog
    },
    
    created(){
        //模拟数据
       this.$store.dispatch('treedepartment', { treedepartmentId: this.$store.getters.departmentId })
       this.treedeptId = this.$store.getters.treedepartmentId;
       this.search();
    },
    computed: {
        treedeptId: {
            get() {
                return this.$store.getters.treedepartmentId
            },
            set(val) {
                val = this.$store.getters.treedepartmentId;
            }
        }
    },
    data() {
        return {
            total: 0,
            deptOptions: [],
            newjurisdictions:true,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
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
            //表格数据
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
            showDefault:false
        }
    },
    methods: {
        newjurisdiction(id){
            this.newjurisdictions=id;
        },
      blur(val){
        const query={
          weightSort: val.weightSort,//排序
          categoryId:val.categoryId
        }
        this.$api.confinementRoom.productCategoryedit(query).then(res => {
          if (res) {
            if (res.code == 200) {
              this.$message.success('修改权重成功');
              this.search();
            }
          }
        })

      },

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
                // weightSort: this.weightSorts,
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
                deptId: this.treedeptId,
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
            // this.weightSorts = val.weightSort;
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
        search(isSearch) {
            let data=''
            if(isSearch==undefined){
                 data = {
                deptId: this.treedeptId,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            }else{
                data = {
                deptId: isSearch,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            }
       
            this.$api.confinementRoom.productCategorylist(data).then(res => {
                this.tableData = res.rows;
                this.total = res.total;
            })

        },
        //deptId改变之后的回调
        changeDeptId(id) {
            // alert(id)
        },
        //点击复选框的回调
        handleSelectionChang(row) {
            // console.log(row,'sadgasd')
        },
        //点击树形三级的回调
        changeCompay(id,item) {
          if (item.children!==undefined){
this.newjurisdictions=true
          }else {
            this.newjurisdictions=false
            this.$store.dispatch('treedepartment', { treedepartmentId: id })
            this.search(id)
          }

        },
        //点击表格每一行的回调
        rowClick(data) {

        }
    }
}
</script>
<style scoped></style>