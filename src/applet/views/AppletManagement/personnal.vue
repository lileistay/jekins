<template>
    <div>
    <div style="height: 40px;margin-left: 20px;">
        <div style="height: 10px;"></div>
     <el-button type="success" size="mini" style="margin-left:20px" @click="addyg"
                    icon="el-icon-plus">添加个人名片</el-button>
    </div>
       <div class="table">
        <el-table
        :data="tableData"
        :height="height"
        border 
        class="tables"
        :fit="true"
        style="width:100%"
        >
        <el-table-column
          prop="date"
          label="职业照"
           align="center">
          <template slot-scope="scope">
            <div >
                <img :src="scope.row.serverPaths" alt="" style="width: 30px;height: 20px;border-radius: 50%;cursor: pointer;" @click="showImg(scope.row.serverPaths)">  
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="employeeName"
          label="姓名"
           align="center">
        </el-table-column>
        <!-- <el-table-column
          prop="memberSex"
          label="性别"
           align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.memberSex=='0'?'男':"女" }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="professionGrade"
          label="职称"
           align="center">
        </el-table-column>
        <el-table-column
          prop="jobDuration"
          label="经验"
           align="center">
        </el-table-column>
        <el-table-column
          prop="adept"
          label="擅长项目"
          width="300%" align="center">
        </el-table-column >
        <el-table-column
          prop="employeePhone"
          label="手机号"
          width="300%" align="center">
        </el-table-column>
        <el-table-column
          prop="employeeWx"
          label="微信"
           align="center">
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作"
           align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="newdelete(scope.row.employeeId)" v-has-permi="['client:companyEmployeeInfo:remove']">
                    删除
            </el-button>
            <el-button type="text" size="mini" @click="newedit(scope.row)">
                    编辑
            </el-button>
          </template>
        </el-table-column>
      
      </el-table>
      <div class="pagation">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      </div>
          <!-- <div style="position: absolute;bottom: 0;">dsadsad</div> -->
       </div>
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
                        <!-- <el-button @click="closeRoomDialogteethokprojext" size="mini">取消</el-button> -->
                    </div>
                </div>
              </div>
              </sgDialog>
    </div>
  </template>
  <script>
  const serverPath = process.env.VUE_APP_BASE_API+'/file'
  import sgDialog from '@/components/Dialog/index'
  export default {
    data(){
      return{
        total:"",
        projectdialog:false,
        imgurl:"",//查看图片
        tableData: [],
            height:'0px',
            currentPage4:0,
            pageSize:20,
            pageNum:1,
            serverPaths:"",
      }
    },
    components:{
      sgDialog,
    },
    watch:{
       $route(){
        this.search();
       },
       deptId(newV){
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
    created(){
      this.search();
      this.$nextTick(function(){
        this.height=document.documentElement.clientHeight-212+'px'
        document.querySelector('.table').style.height=document.documentElement.clientHeight-172+'px'
        document.querySelector('.tables').style.height=document.documentElement.clientHeight-172+'px'
      })
    },
    methods:{
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

          this.$api.confinementRoom.editProductInfoShelfdelem(id).then(res => {
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
        localStorage.setItem('personnaladd',true);
        this.$router.push('/personnaladd');
        localStorage.setItem('personnaladdId',JSON.stringify(val));
      },
        addyg(){
          localStorage.setItem('personnaladd',false);
            this.$router.push('/personnaladd');
        },
      handleCurrentChange(e){
        this.pageNum=e;
      },
      handleSizeChange(e){
        this.pageSize=e
        // console.log(e)
      },
      search(){
          let data={
           deptId:this.deptId,
           pageNum:this.pageNum,
           pageSize:this.pageSize
          }
        this.$api.confinementRoom.companyEmployeeInfolist(data).then(res => {
       
           res.rows.forEach(value=>{
             value.serverPaths= serverPath+value.employeePhoto[0].photoAddr
           })
           this.tableData=res.rows;
           this.total=res.total;
        })

      }
    }
  }
  </script>
  
  <style scoped lang="scss">

  ::v-deep tr th{
    padding: 0 !important;
    padding: 5px !important;
  }

  ::v-deep .el-table__row td{
    padding:5px !important;
  }
   .table{
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
  .pagation{
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::v-deep .el-pager li.active {
      background-color: #409eff !important;
      color: #fff;
  }
  </style>