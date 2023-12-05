<template>
  <div>
      <Tree :clums="clums" :operation="operation" :isShowfile="isShowfile" :tableData="tableData"
          :showDefault="showDefault" @changeCompay="changeCompay" @rowClick="rowClick"
          @handleSelectionChang="handleSelectionChang" @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId"
          @jurisdiction="newjurisdiction">
          <!-- 操作按钮 -->
          <template v-slot:button>
              <div>
                  <span class="Left">快捷操作</span>
                  <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus">新增成员</el-button>
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
              <div :style="{height:projectheight+'px',width: '100%'}">
                  <div style="height: 40px;margin-left: 20px;display: flex;position:relative" class="orders">
                      <div style="height: 20px;"></div>
                      <el-button type="success" size="mini" style="margin-left:20px;position: absolute;margin-top: 8px;"
                          @click="addyg" icon="el-icon-plus" v-if="newshowImg" :disabled="jurisdictions">添加成员</el-button>
                          <img src="@/assets/searchtop.png" class="Img" @click="changeImg">
                  </div>
                  <div>
                      <el-table :data="tableData" :height="tableHeight" border class="tables" :fit="true" style="width:100%">
                        <el-table-column prop="date" label="操作" align="center">
                              <template slot-scope="scope">
                                  <el-button type="text" size="mini" @click="newdelete(scope.row.memberId)"
                                      v-has-permi="['client:companyMember:remove']" style="color:red">
                                      删除
                                  </el-button>
                                  <el-button type="text" size="mini" @click="newedit(scope.row)">
                                      编辑
                                  </el-button>
                              </template>
                          </el-table-column>
                          <el-table-column prop="date" label="职业照" align="center">
                              <template slot-scope="scope">
                                  <div>
                                      <img :src="scope.row.serverPaths" alt=""
                                          style="width: 30px;height: 20px;border-radius: 50%;cursor: pointer;"
                                          @click="showImg(scope.row.serverPaths)">
                                  </div>
                              </template>
                          </el-table-column>
                          <el-table-column prop="memberName" label="姓名" align="center">
                          </el-table-column>
                          <el-table-column prop="memberSex" label="性别" align="center">
                              <template slot-scope="scope">
                                  <div>
                                      {{ scope.row.memberSex == '0' ? '男' : "女" }}
                                  </div>
                              </template>
                          </el-table-column>
                          <el-table-column prop="professionGrade" label="职称" align="center">
                          </el-table-column>
                          <el-table-column prop="jobDuration" label="经验" align="center">
                          </el-table-column>
                          <el-table-column prop="adept" label="擅长项目" width="300%" align="center">
                          </el-table-column>
                          <el-table-column prop="certificationNum" label="资质编号" width="300%" align="center">
                          </el-table-column>
                          <el-table-column prop="weightSort" label="权重" align="center">
                          </el-table-column>
                        

                      </el-table>
                  </div>
                  <div class="pagation">
                      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                          layout="total, sizes, prev, pager, next, jumper" :total="total">
                      </el-pagination>
                  </div>
              </div>
          </template>
      </Tree>
      <sgDialog title="查看图片" size="500px" out-top="2%" :dialog="projectdialog"
          @handleClose="projectdialogcloseRoomDialogtooth">
          <div slot="out">
            <div style="width: 100%;height: 300px;">
              <img :src="imgurl" alt="" style="width: 100%;height: 300px;">
            </div>
            <div style="height: 40px;"></div>
            <div class=""
                  style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;margin-left: 200px;">
                  <div style="width: 160px;height: 40px;">
                      <el-button type="primary" @click="okprojext" size="mini">确定</el-button>
               
                  </div>
              </div>
            </div>
            </sgDialog>
  </div>
</template>
<script>
import Tree from '@/components/newTree/index'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
import sgDialog from '@/components/Dialog/index'
export default {
  components: {
      Tree,
      sgDialog
  },

  watch:{
    $route(newV){
      if(newV.fullPath=='/employee'){
        this.search(this.treedeptId,{
        children:undefined
      })
      }

    }
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
  mounted(){
    this.$store.dispatch('treedepartment', { treedepartmentId: this.$store.getters.departmentId })
    this.treedeptId = this.$store.getters.treedepartmentId;
    let h = window.innerHeight || document.documentElement.clientHeight
      || document.body.clientHeight;
    this.projectheight=h-132;
    let T=parseInt(window.getComputedStyle(document.querySelector('.orders'),null).height);
    this.tableHeight=this.projectheight-T-31;
           this.search();
  },
  created() {
    //模拟数据


  },
  data() {
      return {
          total:0,
      projectdialog:false,
      projectheight:"",
      tableHeight:null,
      jurisdictions:true,

      deptOptions:[],
      defaultProps: {
      children: 'children',
      label: 'label'
    },
      imgurl:"",//查看图片
      newshowImg:true,
          height:'0px',
          currentPage4:0,
          pageSize:20,
          pageNum:1,
          serverPaths:"",
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
          showDefault: false
      }
  },
  methods: {
    newjurisdiction(id){
          this.jurisdictions=id;
    },
    changeImg(){
      this.newshowImg=!this.newshowImg
    },
      okprojext(){
      this.projectdialog=false;
    },
    projectdialogcloseRoomDialogtooth(){
        this.projectdialog=false
    },
    showImg(e){
        this.projectdialog=true;
        this.imgurl=e
    },
    newdelete(id){
      this.$confirm('确认删除员工信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$api.confinementRoom.hospitalCaseTemplateDelel(id).then(res => {
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
    newedit(val){
      this.$router.push('/addemployee');
      localStorage.setItem('addemployee',true);
      localStorage.setItem('addemployeeId',JSON.stringify(val));
    },
      addyg(){
        localStorage.setItem('addemployee',false);
          this.$router.push('/addemployee');
      },
    handleCurrentChange(e){
      this.pageNum=e;
      this.search();
    },
    handleSizeChange(e){
      this.pageSize=e
      this.search();
    },
    search(isSearch,item){
      let newdata='';
      if(item && !item.children){
        this.jurisdictions=false
        newdata={
             deptId:this.treedeptId,
             pageNum:this.pageNum,
             pageSize:this.pageSize
            }
        this.$api.confinementRoom.companyMemberlist(newdata).then(res => {
          res.rows.forEach(value=>{
            value.serverPaths= serverPath+value.memberPhoto[0].photoAddr
          })
          this.tableData=res.rows;
          this.total=res.total;
        })
      }else{
        this.jurisdictions=true
        newdata={
          deptId:this.treedeptId,
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
        this.$api.confinementRoom.companyMemberlist(newdata).then(res => {
          res.rows.forEach(value=>{
            value.serverPaths= serverPath+value.memberPhoto[0].photoAddr
          })
          this.tableData=res.rows;
          this.total=res.total;
        })
      }



    },
      //deptId改变之后的回调
      changeDeptId(id) {
          // alert(id)
      },
      // newdelete(data) {
      //     console.log(data)
      // },
      // //点击页码
      // handleCurrentChange(e) {
      //     alert(e)
      // },
      //
      // //点击选择条数
      // handleSizeChange(e) {
      //     alert(e)
      // },
      //点击复选框的回调
      handleSelectionChang(row) {
          // console.log(row,'sadgasd')
      },
      //点击树形三级的回调
      changeCompay(id,item) {
        this.$store.dispatch('treedepartment', { treedepartmentId: id })
       this.search(id,item);
      },
      //点击表格每一行的回调
      rowClick(data) {

      }
  }
}
</script>
<style scoped>
.Img{
    width:30px;height:30px;position:absolute;right:30px;top:10px;
    cursor:pointer
}
::v-deep tr th {
  padding: 0 !important;
  padding: 5px !important;
}

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

  background: transparent;

}

.pagation {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .el-pager li.active {
  background-color: #1abc9c !important;
  color: #fff;
}
</style>