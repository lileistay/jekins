<template>
  <div>
    <sg-table
      ref="table"
      id="out-table"
      :sg-ref="'multipleTable'"
      size="mini"
      border
      index="序号"
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      highlight-current-row
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <div slot="searchBar">
        <el-form ref="searchList" label-width="120px" style="display: flex;flex-wrap: wrap"  label-position="center" :model="searchList" size="mini">
          <el-form-item label="公告标题:" prop="colourCode">
            <el-input clearable v-model="searchList.noticeTitle"  />
          </el-form-item>
          <el-form-item label="操作人员:" prop="colourName">
            <el-input clearable v-model="searchList.createBy"  />
          </el-form-item>

          <div style="margin-left: 20px">
            <el-button size="mini"  type="primary" icon="el-icon-search" @click="search(true)">查询</el-button>
          </div>
        </el-form>
      </div>
      <div slot="header" style="width: 100%;">
        <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
        <div style="float: right;">
          <el-button size="mini"  v-has-permi="['confinement:dividendType:add']" type="primary" icon="el-icon-plus" @click="addyg">新增</el-button>
          <!--          <el-button size="mini"  v-has-permi="['confinement:dividendType:delete']" type="danger" icon="el-icon-plus" @click="deleteDialogs">删除</el-button>-->
        </div>
      </div>
      <template #custom="data">
<!--        <div v-if="data.props === 'noticeType'">-->
<!--          <dict-tag :options="dict.type.sys_notice_type" :value="data.custom.noticeType" />-->
<!--        </div>-->
<!--        <div v-if="data.props === 'status'">-->
<!--          <dict-tag :options="dict.type.sys_notice_status" :value="data.custom.status" />-->
<!--        </div>-->
<!--        <div v-if="data.props === 'edit'">-->
<!--          <el-button type="text" style="color: #E6A23C" size="mini" @click="edit(data.custom)">修改</el-button>-->
<!--          <el-button type="text" style="color: #F56C6C" size="mini" @click="deletes(data.custom.noticeId)">删除</el-button>-->
<!--        </div>-->
      </template>
    </sg-table>
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
import Tree from '@/components/newTree/index'
const serverPath = process.env.VUE_APP_BASE_API+'/file';
import sgDialog from '@/components/Dialog/index'
import SgTable from '@/components/Table'
import EditorBar from '@/components/wangeditor'
export default {
  components: {
    Tree,
    sgDialog,
    SgTable,
    EditorBar
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
      searchList:{},
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
      //表格表头
      columns:[
        {
          lab: '分类名称',
          val: 'noticeTitle',
        },

        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '权重',
          val: ''
        },
        {
          lab: '创建时间',
          val: 'createTime',
        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit',
          width:200
        },

      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
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
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.search()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.search()
    },
    newjurisdiction(id){
      this.newjurisdictions=id;
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
    //点击表格每一行的回调
    rowClick(data) {

    }
  }
}
</script>
<style scoped></style>