<template>
  <div class="photo">
    <!-- 左侧 -->
    <div class="photo_left">
      <div class="photo_top">
        项目列表
      </div>
      <div class="photo_contain" >
        <div class="photo_contains" v-for="(item,index) in dataList" :key="index" :class="item.deductionId==backstyle?'back':''"  @click="uploadsubmit(item)">
          <div class="photo_list">
            <span>项目：{{item.projectName}}</span>
<!--            <span>口腔项目测试：{{}}</span>-->
          </div>
          <div class="photo_list">
            <span>产品类型：{{item.departmentName}} / {{item.projectName}}</span>
<!--            <span>口轻科</span>-->
          </div>
          <div class="photo_list">
            <span>医生：{{item.doctorName}}</span>
<!--            <span>口腔项目测试</span>-->
          </div>
          <div class="photo_list">
            <span>是否安排：</span>
            <span v-if="item.state==1">已安排</span>
            <span v-if="item.state==2">已治疗</span>
            <span v-if="item.state==0">已取消</span>
          </div>
        </div>
      </div>
      <div class="photo_top">
        共{{totals}}条记录
      </div>
    </div>
    <!-- 右侧 -->
    <div class="photo_right">
      <div class="photo_top">
        照片信息
      </div>
      <div class="photo_right_contain">
       <div style="display: flex;flex-wrap: wrap">
         <span style="margin-left:0px">角度：</span>
         <el-select clearable  filterable v-model="angle" size="mini" style="width:120px" >
           <el-option v-for="item in angles" :label="item.label" :value="item.value" :key="item.value"></el-option>
         </el-select>
         <span style="margin-left:40px">部位：</span>
         <el-select clearable filterable v-model="newpart" size="mini" style="width:120px" >
           <el-option v-for="item in part" :label="item.label" :value="item.value" :key="item.value"></el-option>
         </el-select>
         <span style="margin-left:20px">照片类型：</span>
         <el-select clearable filterable v-model="newtype" size="mini" style="width:120px" >
           <el-option v-for="item in type" :label="item.label" :value="item.value" :key="item.value"></el-option>
         </el-select>
         <div style="height:10px"></div>
         <span style="margin-left:20px">上传时间：</span>
         <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始时间"
                         end-placeholder="结束时间" style="width:200px;" format="yyyy-MM-dd HH:mm:ss"
                         value-format="yyyy-MM-dd HH:mm:ss" size="mini" clearable :editable="false">
         </el-date-picker>

         <el-button type="primary" size="mini" style="margin-left:20px" @click="searchs">查询</el-button>
       </div>
        <div style="height:5px"></div>
        <div style="height:10px;text-align: end;margin-top: 25px;">
          <el-button type="primary" size="mini" style="margin-left:20px" @click="comparison">照片对比</el-button>
          <el-button type="primary" size="mini" style="margin-left:20px" @click="upload">照片上传</el-button>
        </div>
      </div>
      <div style="display: flex">
        <div v-for="(item,index) in photoList" :key="index" style="margin-right: 25px" @click="clickimage(item)" >
          <div class="imglist">
            <div class="img" :style="{border:item.border}">
              <img :src="serverPath+item.photoAddr" style="    width: 152px; height: 152px;">
            </div>
            <div>
              <div style="text-align: center;margin: 3px 0px">{{ item.remarks }}</div>
              <div style="text-align: center">{{ item.createTime }}</div>
            </div>
          </div>
          <div style="margin-top: 5px">
            <el-button type="primary" size="mini" style="margin-left:20px" @click="edit(item)">编辑</el-button>
            <el-button type="danger" size="mini" style="margin-left:20px" @click="deleteInfo(item)">删除</el-button>
          </div>
        </div>
      </div>

    </div>
    <sgDialog title="照片上传" size="55%" out-top="2%" :dialog="showupload" @handleClose="closeRoomDialogtooths">
      <div slot="out">
        <div class="upload_photo">
          <div class="upload_photo_top">
            <div class="upload_photo_top_left">
              客户基本信息
            </div>
            <span>姓名：{{doctorList.customerName}}</span>
            <span style="margin-left:180px">电话：{{doctorList.customPhone}}</span>
            <span style="margin-left:180px">项目：{{itemList.projectName}}</span>
          </div>
          <!-- 照片类型 -->
          <!-- <div class="upload_photo" style="margin-top:20px;width:100%"> -->
          <div class="upload_photo_top" style="margin-top:10px">
            <span><span style="color:red">*</span> 照片类型：</span>
            <el-select clearable filterable v-model="newtypes" size="mini" style="width:130px" >
              <el-option v-for="item in types" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
            <span style="margin-left:180px"><span style="color:red">*</span>部位：</span>
            <el-select clearable filterable v-model="newparts" size="mini" style="width:130px">
              <el-option v-for="item in parts" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
            <el-button type="primary" size="mini" style="margin-left:50px" @click="selectPhoto">选择图片</el-button>
            <input type="file" ref="File" style="visibility:hidden" @change="photoChange" accept="image/png,image/jpeg,image/gif" />
          </div>
          <!-- </div> -->
          <!-- 照片类型 -->
          <div class="upload_photo_tops" style="margin-top:10px;height:500px;overflow-y:scroll;align-items:none">
            <el-table :data="tableData">
              <el-table-column prop="date" label="图片" align="center">
                <template slot-scope="scope">
                  <div>
                    <img :src="scope.row.imgUrl" style="width:50px;height:50px">
                  </div>
                </template>

              </el-table-column>
              <el-table-column prop="type" label="图片类型">

              </el-table-column>
              <el-table-column prop="date" label="角度">
                <template slot-scope="scope">
                  <div>
                    <el-select clearable filterable v-model="scope.row.angle" size="mini" style="width:100px" >
                      <el-option v-for="item in angles" :label="item.label" :value="item.value"
                        :key="item.value"></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="part" label="部位">

              </el-table-column>
              <el-table-column prop="date" label="效果等级">
                <template slot-scope="scope">
                  <div>
                    <div v-if="scope.row.type == '术后'">
                      <el-select clearable filterable v-model="scope.row.result" size="mini" style="width:100px" >
                        <el-option v-for="item in result" :label="item.label" :value="item.value"
                          :key="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="datetime" label="拍照时间" width="200">
                  <template slot-scope="scope">
                              <el-date-picker
      v-model="scope.row.datetime"
      type="datetime"
      placeholder="选择日期" style="width:190px">
    </el-date-picker>
                  </template>
              </el-table-column>
              <el-table-column prop="date" label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="newdelete(scope.row.id)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>

          </div>

        </div>
        <div class=""
          style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="ok">确定</el-button>
            <el-button @click="closeRoomDialogteeths" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>

    <sgDialog title="照片对此" size="75%" out-top="2%" :dialog="showcomparison" @handleClose="closeRoomDialogtooth">
      <div slot="out">
        <div class="comparisons">
          <div class="comparisons_left" v-if="comparList[0]">
              <img :src="serverPath+comparList[0].photoAddr" style="width: 100%;height: 100%;">
          </div>
          <div class="comparisons_right" v-if="comparList[1]">
            <img :src="serverPath+comparList[1].photoAddr" style="width: 100%;height: 100%;">
          </div>
        </div>
        <div class=""
          style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button @click="closeRoomDialogteeth">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
    <sgDialog title="编辑" size="55%" out-top="2%" :dialog="showDialog" @handleClose="showDialog=false">
      <div slot="out">
        <div class="comparisonss">
          <div class="comparisonss_left">
            <el-form style="margin-left: 25px;margin-top: 15px" ref="form"  :rules="rules" :model="formlist" :inline="true" size="mini" label-width="90px" label-position="left">
              <el-form-item label="照片类型" prop="photoType">
                <el-select clearable filterable v-model="formlist.photoType" size="mini" style="width:100%" >
                  <el-option v-for="item in type" :label="item.label" :value="item.value"
                             :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部位">
                <el-select clearable filterable v-model="formlist.photopaArts" size="mini" style="width:100%" >
                  <el-option v-for="item in parts" :label="item.label" :value="item.value"
                             :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角度">
                <el-select clearable filterable v-model="formlist.photoAngles" size="mini" style="width:100%" >
                  <el-option v-for="item in angles" :label="item.label" :value="item.value"
                             :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目">
                <el-select clearable filterable v-model="formlist.projectName" disabled size="mini" style="width:100%" >
                  <el-option v-for="item in dataList" :label="item.projectName" :value="item.deductionId"
                             :key="item.deductionId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="拍照时间" prop="time">
                <el-date-picker
                  v-model="formlist.time"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"   placeholder="选择日期时间" size="mini"
                />
              </el-form-item>
            </el-form>
          </div>
          <div class="comparisonss_right">
            <img :src="formlist.photoAddr">
          </div>
        </div>
        <div class=""
             style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;text-align: right">
            <el-button type="primary" size="mini" @click="submit">保存</el-button>
            <el-button type="danger" size="mini"  @click="showDialog=false">关闭</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import sgDialog from '@/components/Dialog/index'
import search from "../../../../layout/components/MenuBar/Search.vue";
const serverPath = process.env.VUE_APP_BASE_API+'/file'
export default {
  computed: {
    search() {
      return search
    }
  },
  props:['uploadXflag'],
  name: 'photoUpload',
  components: {
    sgDialog
  },
  watch:{
    uploadXflag(val){
      if (val.index==5){
        this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
        this.getlist()
      }
    }
  },
  data() {
    return {
      tableData: [],
      imgUrl: "",
      id: 0,
      showcomparison: false,
      showupload: false,
      angle: '',
      newpart: "",
      newtype: "",
      newtypes: '',
      newparts: "",
      value1: '',
      result: [
        {
          value: '0',
          label: "一级"
        },
        {
          value: '1',
          label: "二级"
        },
        {
          value: '2',
          label: "三级"
        },
        {
          value: '3',
          label: "四级"
        },
        {
          value: '4',
          label: "五级"
        }
      ],
      types: [
        {
          value: "0",
          label: "术前"
        },
        {
          value: "1",
          label: "术后"
        }
      ],

      type: [
        {
          value: "0",
          label: "术前"
        },
        {
          value: "1",
          label: "术后"
        }
      ],
      parts: [
        {
          value: "0",
          label: "面部",
        },
        {
          value: "1",
          label: "四肢",
        },
        {
          value: "2",
          label: "躯干",
        },
        {
          value: "3",
          label: "手",
        },
        {
          value: "4",
          label: "腿",
        }
      ],
      part: [
        {
          value: "0",
          label: "面部",
        },
        {
          value: "1",
          label: "四肢",
        },
        {
          value: "2",
          label: "躯干",
        },
        {
          value: "3",
          label: "手",
        },
        {
          value: "4",
          label: "腿",
        }
      ],
      angles: [
        {
          value: "0",
          label: "正面"
        },
        {
          value: "1",
          label: "左45度"
        },
        {
          value: "2",
          label: "右45度"
        },
        {
          value: "3",
          label: "左90度"
        },
        {
          value: "4",
          label: "右90度"
        },
        {
          value: "5",
          label: "180度"
        },
        {
          value: "6",
          label: "仰面"
        },
        {
          value: "7",
          label: "俯面"
        }
      ],
      totals:'',
      dataList:[],//左侧
      doctorList:[],//选中的客户
      itemList:{},
      backstyle:'',
      photoList:[],
      showDialog:false,
      formlist:{},
      serverPath:'',
      rules: {
        photoType: [
          { required: true, message: '照片类型不能为空', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '拍照时间不能为空', trigger: 'blur' }
        ],
      },
      comparList:[]
    }
  },
  created() {
    this.serverPath=serverPath
  },
  methods: {
    clickimage(item){
      if  (item.border==undefined ||item.border==''){
        item.border='1px solid green'
        this.comparList.push(item)
      }else {
        item.border=''
        this.comparList =  this.comparList.filter(val=>val.photoInfoId!=item.photoInfoId)
        // this.comparList.push(item)
      }
    },
    // 搜索
    searchs(){
      if (this.itemList.deductionId==undefined){
        this.$message.warning('请先选择项目查询')
        return
      }
      this.getphotoList(this.itemList)
    },
    // 图片列表
    getphotoList(item){
      const query={
        itemId:item.deductionId,
        angle:this.angle,
        humanPart:this.newpart,
        photoType:this.newtype,
        createTime:this.value1?this.value1[0]:'',
        endCreateTime:this.value1?this.value1[1]:''
      }
      this.$api.modules.photoUploadd.dentalPhotoInfoList(query).then(res=>{
        if (res.code==200){
          this.photoList=res.rows
        }
      })
    },
    // 编辑
    edit(item){
      this.showDialog=true
      this.formlist={
        photoType:item.photoType,
        photopaArts:item.humanPart,
        photoAngles:item.angle,
        time:item.createTime,
        photoAddr:serverPath + item.photoAddr,
        projectName:item.itemId,
        photoInfoId:item.photoInfoId
      }
    },
    submit(){
      const query={
        angle:this.formlist.photoAngles,
        photoType:this.formlist.photoType,
        humanPart:this.formlist.photopaArts,
        // itemId:this.formlist.projectName,
        createTime:this.formlist.time,
        id:this.itemList.id,
        deptId: this.itemList.deptId,
        photoInfoId:this.formlist.photoInfoId
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api.modules.photoUploadd.dentalPhotoInfoEdit(query).then(res=>{
            if (res.code==200){
              this.$message.success(res.msg)
              this.showDialog=false
              this.getphotoList(this.itemList)

            }
          })
        }
      })

    },
    // 删除
    deleteInfo(item){
      this.$confirm('是否确认删除该数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const photoInfoId=item.photoInfoId
        await this.$api.modules.photoUploadd.dentalPhotoInfoDelete(photoInfoId).then(res => {
          if (res) {
            this.getphotoList(item)
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    // 上传图片
    uploadsubmit(item){
      this.itemList=item
      this.backstyle=item.deductionId
      this.getphotoList(item)
    },
    upload() {
      var objectstr=JSON.stringify(this.itemList)
      if (objectstr == '{}'){
        this.$message.warning('请先选择项目')
        return
      }
      this.showupload = true;
      this.tableData=[];
      this.newtypes='';
      this.newparts='';
    },
    // 左侧列表
    getlist(){
      let data={
        customerName:this.doctorList.customerName
      }
      this.$api.medical.selectTreatment(data).then(res => {
       if(res.code==200){
         this.dataList=res.rows
         this.totals=res.total

       }
      })
    },
    ok() {
      let flag=false;
      let flags=false
      if(this.tableData.length==0){
        this.$message.warning('请选择图片进行上传');
        return
      }
      this.tableData.forEach(value=>{
        if(value.angle==''){
          flag=true;
        }else{
          if(value.type=='术后'){
            
             if(value.result==''){
          
                 flags=true
             }
          }
        }
      })
      if(flag){
        this.$message.warning("请选择角度");
        return

      }
      if(flags){
        this.$message.warning("请选择效果等级")
        return

      }
      this.$api.modules.photoUploadd.addBatchDentalPhotoInfoAdd(this.tableData).then(res=>{
        if (res.code==200){
          this.$message.success(res.msg)
          this.showupload = false;
          this.getphotoList(this.itemList)
        }
      })
      // this.$message.success('保存成功');
    },
    getNowTime() {
      var date = new Date();
      //年 getFullYear()：四位数字返回年份
      var year = date.getFullYear(); //getFullYear()代替getYear()
      //月 getMonth()：0 ~ 11
      var month = date.getMonth() + 1;
      //日 getDate()：(1 ~ 31)
      var day = date.getDate();
      //时 getHours()：(0 ~ 23)
      var hour = date.getHours();
      //分 getMinutes()： (0 ~ 59)
      var minute = date.getMinutes();
      //秒 getSeconds()：(0 ~ 59)
      var second = date.getSeconds();

      var time =year + '-' + this.addZero(month) + '-' + this.addZero(day) + ' ' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
      return time;
    },
    //小于10的拼接上0字符串
    addZero(s) {
      return s < 10 ? ('0' + s) : s;
    },
    photoChange(e) {
      let fromdata = new FormData();
      fromdata.append('file', e.target.files[0]);
      let object = {};
      let query={
        photoType:this.newtypes,
        humanPart:this.newparts,
        itemId:this.itemList.deductionId,
        deptId:this.itemList.deptId,
        id:this.itemList.id,
      }
      this.$api.confinementRoom.unload(fromdata).then(res => {
        object['photoName'] = res.data.name;
        object['photoAddr'] = res.data.url;
        object['fileSuffix'] = res.data.fileSuffix
        this.$message.success("上传成功")
        this.tableData.push(
          { datetime: this.getNowTime(),
            ...query,
            angle: "",
            ...object,
            type: this.newtypes == 0 ? '0' : '1',
            part: Name,
            // id: this.id++,
            imgUrl: this.imgUrl,
            result:'',

          });
        this.$refs.File.value = null;
      });
      this.imgUrl = window.URL.createObjectURL(e.target.files[0])
      // this.$message.success('上传成功');
      let Name = ''
      this.parts.forEach(value => {
        if (value.value == this.newparts) {
          Name = value.value;
        }
      })

    },
    selectPhoto() {
      if (this.newtypes == '') {
        this.$message.warning("请选择照片类型");
        return
      }
      if (this.newparts == '') {
        this.$message.warning("请选择部位");
        return
      };
      this.$refs.File.click();
    },
    newdelete(val) {
      console.log(val,this.tableData,'aaaa')
      this.tableData.forEach((value, index) => {
        if (value.id == val) {
          this.$api.modules.kouqiang.deleteLocalFile(value.photoAddr).then(res=>{
            if (res.code){
              this.$message.success(res.msg)
            }
          })
          this.tableData.splice(index, 1)
        }
      })
    },
    comparison() {
      if (this.comparList.length>2){
        this.$message.warning('请选择两张照片进行对比！')
        this.comparList.forEach(item=>{
          item.border=''
        })
        this.comparList=[]
        return
      }
      this.showcomparison = true;

    },
    closeRoomDialogtooth() {
      this.showcomparison = false;
    },
    closeRoomDialogteeths(){
      this.showupload=false;
    },
    closeRoomDialogteeth() {
      this.showcomparison = false;
      // console.log(this.comparList,)
      // this.comparList=[]
    },
    closeRoomDialogtooths() {
      this.showupload = false;
    },

  },

}
</script>

<style scoped>
.upload_photo_tops {
  width: 105%;
  height: 70px;
  border: 1px solid #666;
  border-radius: 5px;
  position: relative;
}

.upload_photo_top {
  width: 100%;
  height: 70px;
  border: 1px solid #666;
  border-radius: 5px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 50px
}

.upload_photo_top_left {
  height: 10px;
  position: absolute;
  background-color: #fff;
  top: -10px;
}

.upload_photo {
  width: 95%;
  height: 700px;
}

.comparisons {
  width: 100%;
  height: 640px;
  display: flex;
  background-color: #fff;
}

.comparisons_left {
  width: 50%;
  height: 600px;
  border: 1px solid #666;
}

.comparisons_right {
  width: 49%;
  height: 600px;
  margin-left: 1%;
  border: 1px solid #666;
  overflow: scroll;
}
.comparisonss {
  width: 100%;
  height: 640px;
  display: flex;
  background-color: #fff;
}

.comparisonss_left {
  width: 45%;
  height: 233px;
  border: 1px solid #b9b9b9;
  /* padding: 20px; */
  border-radius: 6px;
}

.comparisonss_right {
  width: 54%;
  height: 600px;
  margin-left: 1%;
  border: 1px solid #b9b9b9;
  overflow: scroll;
  border-radius: 6px;
}
.photo_right_contain {
  height: 105px;
  border: 1px solid #eee;
  border-left-color: transparent;
  border-top-color: transparent;
  border-right-color: transparent;
}

.photo_list {
  margin-top: 25px;
  padding-left: 20px;
}

.photo_contains {
  height: 200px;
  border: 1px dotted #666;
  border-left-color: transparent;
  border-top-color: transparent;
  border-right-color: transparent;
  cursor: pointer;
}

.photo_contain {
  height: 520px;
  overflow-y: scroll;
  /* border: 1px solid yellow; */
}

.photo_top {
  height: 40px;
  padding-left: 20px;
  line-height: 40px;
  background: #f5f5f5;
}

.photo {
  width: 100%;
  height: 600px;
  /* border: 1px solid black; */
  display: flex;
  background-color: #fff;
}

.photo_left {
  width: 30%;
  height: 600px;
  /* border: 1px solid red */
}

.photo_right {
  width: 70%;
  height: 600px;
  /* border: 1px solid red; */
  margin-left: 1%;
  background-color:#fff;
}
.back{
  background: rgb(176 255 239 / 14%);
}
.imglist{
  height: 200px;
  width: 152px;
  background: #d7f3e2a3;
.img{
  width: 100%;
  height: 152px;
  border: 1px solid #aedfcb;


}
}
</style>