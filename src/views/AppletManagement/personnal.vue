<template>
  <div>
      <Tree :clums="clums" :operation="operation" :isShowfile="isShowfile" :tableData="tableData"
        :Imgchange="Imgchange"
        :statisticsMessage="statisticsMessage"
          :showDefault="showDefault" :total="total" :tableIndex="tableIndex" :tableCheckbox="tableCheckbox" :row-class-name="rowClassName"  @changeCompay="changeCompay" @rowClick="rowClick"
          @handleSelectionChang="handleSelectionChang" @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId" @changeImg="changeImg"
          @jurisdiction="newjurisdiction">
          <!-- 头部操作按钮 -->
          <template v-slot:button>
              <div>
                  <!-- <span class="Left">快捷操作</span> -->
                  <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus" :disabled="newjurisdictions">新增个人名片</el-button>
                  
              </div>
          </template>
          <!-- 自定义内容填充 -->
          <template v-slot:tabular="{ data }">
              <div v-if="data.name == 'projectName'">
                <img :src="data.serverPaths" alt="" style="width: 30px;height: 20px;border-radius: 50%;cursor: pointer;" @click="showImg(data.serverPaths)">  
              </div>
              <div v-if="data.name == 'shelfTime'">
                  <a href="">不同需求</a>
              </div>
          </template>
          <!-- 操作按钮 -->
          <template v-slot:camera="{ newdata }">
              <el-button type="text" size="mini" @click="newdelete(newdata.employeeId)">
                  删除
              </el-button>
              <el-button type="text" size="mini" @click="newedit(newdata)">
                  编辑
              </el-button>
          </template>
          <!-- 自定义页面 -->
          <template v-slot:company>
              
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
                        <!-- <el-button @click="closeRoomDialogteethokprojext" size="mini">取消</el-button> -->
                    </div>
                </div>
              </div>
              </sgDialog>
  </div>
</template>
<script>
import sgDialog from '@/components/Dialog/index'
import Tree from '@/components/newTree/index'
const serverPath = process.env.VUE_APP_BASE_API+"/file"

export default {
  components: {
      Tree,
      sgDialog
  },
  created() {
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
          //表格数据
          tableData: [],
          newjurisdictions:true,
          projectdialog:false,
          pageSize:20,
          pageNum:1,
          imgurl:"",
          //表格表头
          clums: [
              {
                  value: "projectName",
                  label: "职业照",
                  vals: true, //true表示自定义内容，false或者不传表示不需要自定义
              },
              {
                  value: "employeeName",
                  label: "姓名",
                  // vals: true, //true表示自定义内容，false或者不传表示不需要自定义
              },
              {
                  value: "professionGrade",
                  label: "职称",
              },
              {
                  value: "jobDuration",
                  label: "经验",
              },
              {
                  value: "adept",
                  label: "擅长项目",
              },
              {
                  value: "employeePhone",
                  label: "手机号",
              },
              {
                  value: "employeeWx",
                  label: "微信",
              }
          ],
          //操作按钮
          operation: [
              {
                  label: '删除',
                  val: '0'
              },
              {
                  label: '编辑',
                  val: '1'
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
          //控制头部显示隐藏
          Imgchange:true,
          statisticsMessage:false,
      }
  },
  mounted(){
    // document.querySelector(".statistics").style.display='none'
  },
  methods: {
    newjurisdiction(id){
       this.newjurisdictions=id;
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
           deptId:this.treedeptId,
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

      },
      //控制头部隐藏
      changeImg(id){
        this.Imgchange=id
      },
        //自定义行颜色
      rowClassName(row){

      },
      //deptId改变之后的回调
      changeDeptId(id) {
          alert(id)
      },
      // newdelete(data) {
      //     console.log(data)
      // },
      //点击页码
      handleCurrentChange(e) {
        this.pageNum=e;
        this.search();
      },

      //点击选择条数
      handleSizeChange(e) {
        this.pageSize=e;
        this.search();
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
          this.$store.dispatch('treedepartment', { treedepartmentId: id })
          this.newjurisdictions=false

          this.search();
        }

          // alert(id)
      },
      //点击表格每一行的回调
      rowClick(data) {

      }
  }
}
</script>
<style scoped>

 .statistics{
  display:none !important;
 }
</style>