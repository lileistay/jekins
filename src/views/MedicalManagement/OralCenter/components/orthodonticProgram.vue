<template>
  <!--正畸计划-->
  <div class="container">
    <div class="topBOX">
      <div class="title">诊断相关</div>
      <el-form size="mini" :model="formList">
        <el-form-item label="主诉：" label-width="100px">
          <el-input v-model="formList.mainAppeal" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item label="牙形：" label-width="100px">
          <el-select filterable clearable v-model="formList.toothForm">
            <el-option v-for="(item,index) in thread" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="骨形：" label-width="100px">
          <el-select filterable clearable v-model="formList.bonePattern">
            <el-option v-for="(item,index) in Bone" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题：" label-width="100px">
          <el-input style="width: 60%" v-model="formList.problem"></el-input>
        </el-form-item>
        <el-form-item label="矫治目标：" label-width="100px">
          <el-input style="width: 60%" v-model="formList.target"></el-input>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button size="mini" @click.stop="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="butBox">
      <div class="title">治疗计划</div>
      <el-form size="mini">
        <el-form-item label="拔牙：" label-width="100px">
          <table style="border-collapse: collapse;border: 1px solid #666;" border @click="selectteech">
                    <tbody>
                      <tr style="height: 50px;">
                        <td class="mouth"><span style="margin-left: 20px;display:none">口腔检查：</span> </td>

                        <td class="newmouth">
                      <tr>
                        <td class="Width" align="right">
                          <span  v-for="(itemleft,indexleft) in handleleft(contain[0].value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                        </td>
                        <td class="Width">
                          <span  v-for="(itemleft,indexleft) in handleleftright(contain[0].value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                        </td>
                      </tr>
                      <tr >
                        <td
                          style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 20px;" align="right">
                          <span  v-for="(itemleft,indexleft) in handleright(contain[0].value)" :key="indexleft" >
                         {{itemleft.num}}
                        </span>
                        </td>
                        <td>
                          <span  v-for="(itemleft,indexleft) in  handlerightright(contain[0].value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>

                        </td>
                      </tr>
                      </td>
                      <!-- <td
                        style="width: 781px;background-color: #fff;border: 1px solid #666;border-top-color: transparent;border-bottom-color: transparent;">
                      </td>
                      <td style="width: 143px;background-color: #fff;border: 1px solid #fff;"></td> -->
                      </tr>
                    </tbody>
                  </table>
          <el-input v-model="taxt" type="textarea" style="width: 60%;margin-top:20px"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="100px">
          <el-select clearable filterable v-model="newcure">
            <el-option v-for="(item,index) in cure" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注意事项：" label-width="100px">
          <el-input type="textarea" style="width: 60%" v-model="name"></el-input>
          <el-button size="mini" style="margin-left: 20px" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
      <div style="padding: 0 20px">
        <el-table :data="tableData">
          <el-table-column label="步骤" prop="name">
          </el-table-column>
          <el-table-column label="操作" prop="id">
            <template slot-scope="scope">
              <div>
                <el-button type="text" size="mini" @click="upmove(scope.row.id)">
                  上移
                </el-button>
                <el-button type="text" size="mini" @click="downmove(scope.row.id)">
                  下移
                </el-button>
                <el-button type="text" size="mini" @click="newdelete(scope.row.id)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <sgDialog title="请选择牙位" size="55%" out-top="2%" :dialog="showDialogtooth" @handleClose="closeRoomDialogtooth">
        <div slot="out">
          <div>
            <el-button type="primary" size="small" @click="teeth">
              恒牙
            </el-button>
            <el-button type="primary" size="small" @click="deciduous">
              乳牙
            </el-button>
            <el-button type="primary" size="small" @click="full">
              {{ reset == false ? '全口' : '重置' }}
            </el-button>
          </div>
          <div class="teeth_contain">
            <!-- 恒牙 -->
            <div v-if="teethFlag">
              <table style="border-collapse: collapse;border: 1px solid #666;" border>
                <tbody>
                  <tr style="height: 50px;">
                    <td class="newmouth">
                  <tr>
                    <td class="Width teethWidth" style="background-color: #808080;">
                      <!-- 上一图 -->
                      <div style="display: flex;height: 150px;width: 450px;">
                        <div class="teeth_top" v-for="(item, index) in teethmonth" :key="index" @click="teethclick(index)"
                          :style="{ background: item.background }">
                          <div style="height: 120px;">
                            <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                          </div>
                          <div
                            :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                            {{ item.num }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="Width " style="height: 150px;width: 450px;background-color: #808080;">
                      <div style="display: flex;height: 150px;width: 450px;">
                        <div class="teeth_top" v-for="(item, index) in teethmonthtwo" :key="index"
                          @click="teethclicktwo(index)" :style="{ background: item.background }">
                          <div style="height: 120px;">
                            <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                          </div>
                          <div
                            :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                            {{ item.num }}</div>
                        </div>
                      </div>

                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 143px;width: 450px;background-color: #808080;">
                      <div style="display: flex;height: 150px;width: 450px;">
                        <div class="teeth_top" v-for="(item, index) in teethmonththree" :key="index"
                          @click="teethclickthree(index)" :style="{ background: item.background }">
                          <div style="height: 120px;">
                            <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                          </div>
                          <div
                            :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                            {{ item.num }} </div>
                        </div>
                      </div>
                    </td>
                    <td style="background-color: #808080;">
                      <div style="display: flex;height: 150px;width: 450px;">
                        <div class="teeth_top" v-for="(item, index) in teethmonthfour" :key="index"
                          @click="teethclickfour(index)" :style="{ background: item.background }">
                          <div style="height: 120px;">
                            <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                          </div>
                          <div
                            :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                            {{ item.num }}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 恒牙结束 -->
            <!-- 乳牙开始 -->
            <div v-else>
              <table style="border-collapse: collapse;border: 1px solid #666;" border>
                <tbody>
                  <tr style="height: 50px;">
                    <td class="newmouth">
                  <tr>
                    <td class="Width teethWidth" style="background-color: #808080;">
                      <!-- 上一图 -->
                      <div style="display: flex;height: 150px;width: 450px;">
                        <div class="teeth_top" v-for="(item, index) in deciduousone" :key="index"
                          @click="deciduousclick(index)" :style="{ background: item.background, marginLeft: '30px' }">
                          <div style="height: 120px;">
                            <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                          </div>
                          <div
                            :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                            {{ item.num }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="Width " style="height: 150px;width: 450px;background-color: #808080;">
                      <div style="display: flex;height: 150px;width: 450px;">
                        <div class="teeth_top" v-for="(item, index) in deciduoustwo" :key="index"
                          @click="deciduousclicktwo(index)" :style="{ background: item.background, marginLeft: '30px' }">
                          <div style="height: 120px;">
                            <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                          </div>
                          <div
                            :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                            {{ item.num }}</div>
                        </div>
                      </div>

                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 143px;width: 450px;background-color: #808080;">
                      <div style="display: flex;height: 150px;width: 450px;">
                        <div class="teeth_top" v-for="(item, index) in deciduousthree" :key="index"
                          @click="deciduousclickthree(index)" :style="{ background: item.background, marginLeft: '30px' }">
                          <div style="height: 120px;">
                            <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                          </div>
                          <div
                            :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                            {{ item.num }}</div>
                        </div>
                      </div>
                    </td>
                    <td style="background-color: #808080;">
                      <div style="display: flex;height: 150px;width: 450px;">
                        <div class="teeth_top" v-for="(item, index) in deciduousfour" :key="index"
                          @click="deciduousclickfour(index)" :style="{ background: item.background, marginLeft: '30px' }">
                          <div style="height: 120px;">
                            <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                          </div>
                          <div
                            :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                            {{ item.num }}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 乳牙结束 -->
          </div>
          <div style="height: 60px;"></div>
          <div class=""
            style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
            <div style="width: 160px;height: 40px;">
              <el-button type="primary" size="mini" @click="ok">确定</el-button>
              <el-button @click="closeRoomDialogteeth" size="mini">取消</el-button>
            </div>
          </div>
        </div>
      </sgDialog>
  </div>
</template>

<script>
import sgDialog from '@/components/Dialog/index'
export default {
  components:{
    sgDialog
  },
  name: "orthodonticProgram",
  props:{
    xflag:{
      type:[String, Number]
    }
  },
  mounted(){
    let that=this;
     document.body.addEventListener('keydown',function(e){
       if(e.keyCode==13){
        let str = '';
      for (let i = 0; i < 6; i++) {
        str += Math.floor(Math.random() * 10)
      }
          that.tableData.push({
            name:that.name,
            id:str
          })
       }
      
     })
  },
  methods: {
    //通过挂号主键获取计划诊断详情
    getPlanDiagnoseInfo(){
      const query={
        deptRegnId:this.doctorList.deptRegnId
      }
      this.$api.modules.kouqiang.getPlanDiagnoseInfoByDeptRegnId(query).then(res=>{
        if(res.data){
          this.numXflag=1
          this.formList={
            mainAppeal:res.data.mainAppeal,
            toothForm:Number(res.data.toothForm),
            bonePattern:Number(res.data.bonePattern),
            problem:res.data.problem,
            target:res.data.target,
            diagnoseId:res.data.diagnoseId,
          }
        }else {
          this.numXflag=0
          this.formList={}
        }
      })
    },
    submit(){
      const query={
        mainAppeal:this.formList.mainAppeal,
        toothForm:this.formList.toothForm,
        bonePattern:this.formList.bonePattern,
        problem:this.formList.problem,
        target:this.formList.target,
        id:this.doctorList.id,
        deptId:this.doctorList.deptId,
        deptRegnId:this.doctorList.deptRegnId,
        diagnoseId:this.formList.diagnoseId?this.formList.diagnoseId:'',
      }
      if (this.numXflag==0){
        this.$api.modules.kouqiang.dentalPlanDiagnoseAdd(query).then(res=>{
          if (res.code==200){
            this.$message.success('操作成功')
            this.getPlanDiagnoseInfo()
          }
        })
      }else {
        this.$api.modules.kouqiang.dentalPlanDiagnoseEdit(query).then(res=>{
          if (res.code==200){
            this.$message.success('操作成功')
            this.getPlanDiagnoseInfo()
          }
        })
      }

    },
    teethclickthree(index) {
        if (this.teethmonththree[index].background == '') {
          this.teethmonththree[index].background = '#fff';
          this.teethmonththree[index].color = '#fff';
          this.teethmonththree[index].newbackground = '#286090';
          this.teethmonththree[index].isok = true
        } else {
          this.teethmonththree[index].background = '';
          this.teethmonththree[index].newbackground = '#fff'
          this.teethmonththree[index].color = 'black';
          this.teethmonththree[index].isok = false
        }
      },
      teethclickfour(index) {
        if (this.teethmonthfour[index].background == '') {
          this.teethmonthfour[index].background = '#fff';
          this.teethmonthfour[index].color = '#fff';
          this.teethmonthfour[index].newbackground = '#286090';
          this.teethmonthfour[index].isok = true
        } else {
          this.teethmonthfour[index].background = '';
          this.teethmonthfour[index].newbackground = '#fff'
          this.teethmonthfour[index].color = 'black';
          this.teethmonthfour[index].isok = false
        }
      },
      teethclicktwo(index) {
        if (this.teethmonthtwo[index].background == '') {
          this.teethmonthtwo[index].background = '#fff';
          this.teethmonthtwo[index].color = '#fff';
          this.teethmonthtwo[index].newbackground = '#286090';
          this.teethmonthtwo[index].isok = true
        } else {
          this.teethmonthtwo[index].background = '';
          this.teethmonthtwo[index].newbackground = '#fff'
          this.teethmonthtwo[index].color = 'black';
          this.teethmonthtwo[index].isok = false
        }
      },
      teethclick(index) {
        if (this.teethmonth[index].background == '') {
          this.teethmonth[index].isok = true
          this.teethmonth[index].background = '#fff';
          this.teethmonth[index].color = '#fff';
          this.teethmonth[index].newbackground = '#286090'
        } else {
          this.teethmonth[index].background = '';
          this.teethmonth[index].newbackground = '#fff'
          this.teethmonth[index].color = 'black';
          this.teethmonth[index].isok = false
        }

      },
   deciduousclick(index) {
        if (this.deciduousone[index].background == '') {
          this.deciduousone[index].background = '#fff';
          this.deciduousone[index].color = '#fff';
          this.deciduousone[index].newbackground = '#286090';
          this.deciduousone[index].isok = true;
        } else {
          this.deciduousone[index].background = '';
          this.deciduousone[index].newbackground = '#fff'
          this.deciduousone[index].color = 'black';
          this.deciduousone[index].isok = false
        }
      },
      deciduousclicktwo(index) {
        if (this.deciduoustwo[index].background == '') {
          this.deciduoustwo[index].background = '#fff';
          this.deciduoustwo[index].color = '#fff';
          this.deciduoustwo[index].newbackground = '#286090';
          this.deciduoustwo[index].isok = true;
        } else {
          this.deciduoustwo[index].background = '';
          this.deciduoustwo[index].newbackground = '#fff'
          this.deciduoustwo[index].color = 'black';
          this.deciduoustwo[index].isok = false
        }
      },
      deciduousclickthree(index) {
        if (this.deciduousthree[index].background == '') {
          this.deciduousthree[index].background = '#fff';
          this.deciduousthree[index].color = '#fff';
          this.deciduousthree[index].newbackground = '#286090';
          this.deciduousthree[index].isok = true;
        } else {
          this.deciduousthree[index].background = '';
          this.deciduousthree[index].newbackground = '#fff'
          this.deciduousthree[index].color = 'black';
          this.deciduousthree[index].isok = false;
        }
      },
      deciduousclickfour(index) {
        if (this.deciduousfour[index].background == '') {
          this.deciduousfour[index].background = '#fff';
          this.deciduousfour[index].color = '#fff';
          this.deciduousfour[index].newbackground = '#286090';
          this.deciduousfour[index].isok = true;
        } else {
          this.deciduousfour[index].background = '';
          this.deciduousfour[index].newbackground = '#fff'
          this.deciduousfour[index].color = 'black';
          this.deciduousfour[index].isok = false;
        }
      },
      closeRoomDialogteeth() {
        this.showDialogtooth = false
      },
      handlerightright(val){
        let arr=[];
        if(val==undefined){
        }else{
          if(val.newarrs.length==0){
              if(val.teethnewarrs.length==0){
                arr=[]
              }else{
                arr=val.teethnewarrs
              }
          }else{
            arr=val.newarrs
          }
        }
       return arr
      },
      handleright(val){
        let arr=[];
        if(val==undefined){
        }else{
          if(val.arrs.length==0){
              if(val.teetharrs.length==0){
                arr=[]
              }else{
                arr=val.teetharrs
              }
          }else{
            arr=val.arrs
          }
        }
       return arr
      },
      handleleft(val){
        let arr=[];
        if(val==undefined){
        }else{
          if(val.arr.length==0){

              if(val.teetharr.length==0){
                arr=[]
              }else{
                arr=val.teetharr;
              }
          }else{
            arr=val.arr
          }
        }
       return arr
      },
      handleleftright(val){
        let arr=[];
        if(val==undefined){
        }else{
          if(val.newarr.length==0){
              if(val.teethnewarr.length==0){
                arr=[]
              }else{
                arr=val.teethnewarr
              }
          }else{
            arr=val.newarr
          }
        }
       return arr
      },
      ok() {
        this.object={
          //恒牙获取牙
          arr: [],
          newarr: [],
          arrs: [],
          newarrs: [],
          //乳牙获取牙
          teetharr: [],
          teethnewarr: [],
          teetharrs: [],
          teethnewarrs: [],

        },//获取牙齿的

        this.teethmonth.forEach(value => {
          if (value.isok) {
            this.object.arr.push(value)
          }
        })
        this.teethmonthtwo.forEach(value => {
          if (value.isok) {
            this.object.newarr.push(value)
          }
        })
        this.teethmonththree.forEach(value => {
          if (value.isok) {
            this.object.arrs.push(value)
          }
        })
        this.teethmonthfour.forEach(value => {
          if (value.isok) {
            this.object.newarrs.push(value)
          }
        })

        //乳牙
        this.deciduousone.forEach(value => {
          if (value.isok) {
            this.object.teetharr.push(value)
          }
        })
        this.deciduoustwo.forEach(value => {
          if (value.isok) {
            this.object.teethnewarr.push(value)
          }
        })
        this.deciduousthree.forEach(value => {
          if (value.isok) {
            this.object.teetharrs.push(value)
          }
        })
        this.deciduousfour.forEach(value => {
          if (value.isok) {
            this.object.teethnewarrs.push(value)
          }
        })
        this.showDialogtooth = false;
        this.contain[0].value=this.object;
        console.log(this.contain[0].value,'嘿嘿')
      },
    // 选择牙齿弹窗
    selectteech(){
      // if (){
      //
      // }
      // 恒牙开始
      if ( this.contain[0].value.arr.length){
        let list1=[]
        list1=this.contain[0].value.arr[0].num.split(',')
        let arrlist1=[]
        list1.forEach(itemss=>{
          let object={
            background:this.contain[0].value.arr[0].background,
            color:this.contain[0].value.arr[0].color,
            newbackground:this.contain[0].value.arr[0].newbackground,
            isok:this.contain[0].value.arr[0].isok,
            num:itemss
          }
          arrlist1.push(object)
        })
        arrlist1.forEach(item=>{
          this.teethmonth.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.contain[0].value.newarr.length){
        let list2=[]
        list2=this.contain[0].value.newarr[0].num.split(',')
        let newarrlist1=[]
        list2.forEach(itemss=>{
          let object={
            background:this.contain[0].value.newarr[0].background,
            color:this.contain[0].value.newarr[0].color,
            newbackground:this.contain[0].value.newarr[0].newbackground,
            isok:this.contain[0].value.newarr[0].isok,
            num:itemss
          }
          newarrlist1.push(object)
        })
        newarrlist1.forEach(item=>{
          this.teethmonthtwo.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      // 三
      if (this.contain[0].value.newarrs.length){
        let list3=[]
        list3=this.contain[0].value.newarrs[0].num.split(',')
        let newarrsist1=[]
        list3.forEach(itemss=>{
          let object={
            background:this.contain[0].value.newarrs[0].background,
            color:this.contain[0].value.newarrs[0].color,
            newbackground:this.contain[0].value.newarrs[0].newbackground,
            isok:this.contain[0].value.newarrs[0].isok,
            num:itemss
          }
          newarrsist1.push(object)
        })
        newarrsist1.forEach(item=>{
          this.teethmonthfour.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
    if (this.contain[0].value.arrs.length){
      let list4=[]
      list4=this.contain[0].value.arrs[0].num.split(',')
      let arrslist1=[]
      list4.forEach(itemss=>{
        let object={
          background:this.contain[0].value.arrs[0].background,
          color:this.contain[0].value.arrs[0].color,
          newbackground:this.contain[0].value.arrs[0].newbackground,
          isok:this.contain[0].value.arrs[0].isok,
          num:itemss
        }
        arrslist1.push(object)
      })
      arrslist1.forEach(item=>{
        this.teethmonththree.forEach(val=>{
          if (val.num==item.num){
            val.background=item.background
            val.color=item.color
            val.newbackground=item.newbackground
            val.isok=item.isok
          }
        })
      })
    }
    // 恒牙结束
    // 乳牙开始
      if (this.contain[0].value.teetharr.length){
        let lists1=[]
        lists1=this.contain[0].value.teetharr[0].num.split(',')
        let teetharrlist1=[]
        lists1.forEach(itemss=>{
          let object={
            background:this.contain[0].value.teetharr[0].background,
            color:this.contain[0].value.teetharr[0].color,
            newbackground:this.contain[0].value.teetharr[0].newbackground,
            isok:this.contain[0].value.teetharr[0].isok,
            num:itemss
          }
          teetharrlist1.push(object)
        })
        teetharrlist1.forEach(item=>{
          this.deciduousone.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.contain[0].value.teethnewarr.length){
        let lists2=[]
        lists2=this.contain[0].value.teethnewarr[0].num.split(',')
        let teethnewarrlist2=[]
        lists2.forEach(itemss=>{
          let object={
            background:this.contain[0].value.teethnewarr[0].background,
            color:this.contain[0].value.teethnewarr[0].color,
            newbackground:this.contain[0].value.teethnewarr[0].newbackground,
            isok:this.contain[0].value.teethnewarr[0].isok,
            num:itemss
          }
          teethnewarrlist2.push(object)
        })
        teethnewarrlist2.forEach(item=>{
          this.deciduoustwo.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.contain[0].value.teetharrs.length){
        let lists3=[]
        lists3=this.contain[0].value.teetharrs[0].num.split(',')
        let teetharrslist3=[]
        lists3.forEach(itemss=>{
          let object={
            background:this.contain[0].value.teetharrs[0].background,
            color:this.contain[0].value.teetharrs[0].color,
            newbackground:this.contain[0].value.teetharrs[0].newbackground,
            isok:this.contain[0].value.teetharrs[0].isok,
            num:itemss
          }
          teetharrslist3.push(object)
        })
        teetharrslist3.forEach(item=>{
          this.deciduousthree.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.contain[0].value.teethnewarrs.length){
        let lists4=[]
        lists4=this.contain[0].value.teethnewarrs[0].num.split(',')
        let teethnewarrslist4=[]
        lists4.forEach(itemss=>{
          let object={
            background:this.contain[0].value.teethnewarrs[0].background,
            color:this.contain[0].value.teethnewarrs[0].color,
            newbackground:this.contain[0].value.teethnewarrs[0].newbackground,
            isok:this.contain[0].value.teethnewarrs[0].isok,
            num:itemss
          }
          teethnewarrslist4.push(object)
        })
        teethnewarrslist4.forEach(item=>{
          this.deciduousfour.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
        this.showDialogtooth = true;
        this.contain.forEach(value => {
          value.flag = false
        })
    },
    closeRoomDialogtooth(){
      this.showDialogtooth = false
    },
    teeth() {
        this.teethFlag = true;
        this.reset = false;
        this.object = {
          //恒牙获取牙
          arr: [],
          newarr: [],
          arrs: [],
          newarrs: [],
          //乳牙获取牙
          teetharr: [],
          teethnewarr: [],
          teetharrs: [],
          teethnewarrs: [],

        },//获取牙齿的
        this.deciduousone.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
        this.deciduoustwo.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
        this.deciduousthree.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
        this.deciduousfour.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })

      },
      //乳牙
      deciduous() {
        this.teethFlag = false
        this.reset = false;
        this.object = {
          //恒牙获取牙
          arr: [],
          newarr: [],
          arrs: [],
          newarrs: [],
          //乳牙获取牙
          teetharr: [],
          teethnewarr: [],
          teetharrs: [],
          teethnewarrs: [],

        },//获取牙齿的
        this.teethmonth.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
        this.teethmonthtwo.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
        this.teethmonththree.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
        this.teethmonthfour.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
      },
      //全口
      full() {
        this.reset = !this.reset;
        if (this.teethFlag) {
          if (this.reset) {
            this.teethmonth.forEach(value => {
              value.background = '#fff';
              value.color = '#fff';
              value.newbackground = '#286090'
              value.isok = true;
            })
            this.teethmonthtwo.forEach(value => {
              value.background = '#fff';
              value.color = '#fff';
              value.newbackground = '#286090';
              value.isok = true;
            })
            this.teethmonththree.forEach(value => {
              value.background = '#fff';
              value.color = '#fff';
              value.newbackground = '#286090';
              value.isok = true;
            })
            this.teethmonthfour.forEach(value => {
              value.background = '#fff';
              value.color = '#fff';
              value.newbackground = '#286090';
              value.isok = true;
            })
          } else {
            this.clearthee();
          }
        } else {
          if (this.reset) {
            this.deciduousone.forEach(value => {
              value.background = '#fff';
              value.color = '#fff';
              value.newbackground = '#286090'
              value.isok = true;
            })
            this.deciduoustwo.forEach(value => {
              value.background = '#fff';
              value.color = '#fff';
              value.newbackground = '#286090';
              value.isok = true;
            })
            this.deciduousthree.forEach(value => {
              value.background = '#fff';
              value.color = '#fff';
              value.newbackground = '#286090';
              value.isok = true;
            })
            this.deciduousfour.forEach(value => {
              value.background = '#fff';
              value.color = '#fff';
              value.newbackground = '#286090';
              value.isok = true;
            })
          } else {
            this.cleartooth();
          }
        }

      },
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {};
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj != 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      //引用类型
      //数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i];
          if (typeof new_obj[i] == 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { //对象
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] == 'object') {
              new_obj[key] = this.deepClone(obj[key]);
            } else {//对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj;
    },
    //
    getPlanHealInfo(){
      this.contain[0].value.arr=[]
      this.contain[0].value.newarr=[]
      this.contain[0].value.newarrs=[]
      this.contain[0].value.arrs=[]
      this.contain[0].value.teetharr=[]
      this.contain[0].value.teetharrs=[]
      this.contain[0].value.teethnewarr=[]
      this.contain[0].value.teethnewarrs=[]
      const query={
        deptRegnId:this.doctorList.deptRegnId
      }
      this.$api.modules.kouqiang.getPlanHealInfoByDeptRegnId(query).then(res=>{
        if(res.data){
          this.zlXflag=1
          this.taxt=res.data.note,
          this.newcure=res.data.processTypeId,
          this.healId=res.data.healId
          res.data.toothList.forEach(item=>{
            if(item.flag==0){
              // 恒牙
              if (item.sort==1){
                this.contain[0].value.arr.push(item)
              }else if (item.sort==2){
                this.contain[0].value.newarr.push(item)
              }else if (item.sort==3){
                this.contain[0].value.newarrs.push(item)
              }else if (item.sort==4){
                this.contain[0].value.arrs.push(item)
              }
            }else if (item.flag==1){
              // 乳牙
              if (item.sort==1){
                this.contain[0].value.teetharr.push(item)
              }else if (item.sort==2){
                this.contain[0].value.teethnewarr.push(item)
              }else if (item.sort==3){
                this.contain[0].value.teethnewarrs.push(item)
              }else if (item.sort==4){
                this.contain[0].value.teetharrs.push(item)
              }
            }
          })

        }else {
          this.zlXflag=0
          this.taxt='',
          this.newcure='',
          this.healId=''
        }
      })
    },
    save() {
      this.Indexsx++
      this.tableData.push({
        name:this.name,
        id:this.Indexsx
      })
      let allList=[]
      this.contain[0].value.arr.forEach(item=>{
        allList.push(item.num)
      })
      let arrsList=[]
      this.contain[0].value.arrs.forEach(item=>{
        arrsList.push(item.num)
      })
      let newarrList=[]
      this.contain[0].value.newarr.forEach(item=>{
        newarrList.push(item.num)
      })
      let newarrsList=[]
      this.contain[0].value.newarrs.forEach(item=>{
        newarrsList.push(item.num)
      })
      let teetharrList=[]
      this.contain[0].value.teetharr.forEach(item=>{
        teetharrList.push(item.num)
      })
      let teetharrsList=[]
      this.contain[0].value.teetharrs.forEach(item=>{
        teetharrsList.push(item.num)
      })
      let teethnewarrList=[]
      this.contain[0].value.teethnewarr.forEach(item=>{
        teethnewarrList.push(item.num)
      })
      let teethnewarrsList=[]
      this.contain[0].value.teethnewarrs.forEach(item=>{
        teethnewarrsList.push(item.num)
      })
      let listdata=[
        {num:allList.toString(),sort:1,flag:0,background:"#fff",
          color:"#fff",isok :true,newbackground: "#286090"},
        {num:arrsList.toString(),sort:4,flag:0,background:"#fff",
          color:"#fff",isok :true,newbackground: "#286090"},
        {num:newarrList.toString(),sort:2,flag:0,background:"#fff",
          color:"#fff",isok :true,newbackground: "#286090"},
        {num:newarrsList.toString(),sort:3,flag:0,background:"#fff",
          color:"#fff",isok :true,newbackground: "#286090"},
        {num:teetharrList.toString(),sort:1,flag:1,background:"#fff",
          color:"#fff",isok :true,newbackground: "#286090"},
        {num:teetharrsList.toString(),sort:4,flag:1,background:"#fff",
          color:"#fff",isok :true,newbackground: "#286090"},
        {num:teethnewarrList.toString(),sort:2,flag:1,background:"#fff",
          color:"#fff",isok :true,newbackground: "#286090"},
        {num:teethnewarrsList.toString(),sort:3,flag:1,background:"#fff",
          color:"#fff",isok :true,newbackground: "#286090"},
      ]
      listdata=listdata.filter(item=>item.num!='')
      let h="["
      listdata.forEach((item,index)=>{
        h+=JSON.stringify(item)+','
      })
      let y=h+"]"
      const query={
        toothPosition:y ,//牙位置
        deptRegnId:this.doctorList.deptRegnId,
        id:this.doctorList.id,
        deptId:this.doctorList.deptId,
        healId:this.healId?this.healId:'',
        processTypeId:this.newcure,
        note:this.taxt

      }
      if (this.zlXflag==0){
        this.$api.modules.kouqiang.dentalPlanHealAdd(query).then(res=>{
          if (res.code==200){
            this.getPlanHealInfo()
          }
        })
      }else {
        this.$api.modules.kouqiang.dentalPlanHealEdit(query).then(res=>{
          if (res.code==200){
            this.getPlanHealInfo()
          }
        })
      }
    },
    upmove(id) {
        let Index = 0;
        this.tableData.forEach((value, index) => {
          if (id == value.id) {
            Index = index
          }
        })
        if (Index == 0) {
          this.$message.warning('已经是第一位不能上移')
        } else {
          if (Index == 1) {
            let arr = this.tableData[Index];
            this.tableData.splice(Index, 1);
            this.tableData.unshift(arr);
          } else {
            let object = this.tableData[Index];
            let newobject = this.tableData[Index - 1].name;
            let newIndex = 0;
            let list = [];
            this.tableData.forEach((value, index) => {
              if (value.name == newobject) {
                newIndex = index;
              }
            })
            let newarr = this.tableData.slice(newIndex, this.tableData.length);
            let newarrs = this.tableData.slice(0, newIndex);
            newarr.forEach((value, index) => {
              if (value.name == object.name) {
                newarr.splice(index, 1)
              }
            })
            this.tableData = newarrs.concat(object).concat(newarr)
          }
          this.$message.success('上移成功')
        }
   
      //判断其他情况 
    },
    downmove(id) {
  
        let Index = 0;
        this.tableData.forEach((value, index) => {
          if (id == value.id) {
            Index = index
          }
        })
        if (Index == this.tableData.length - 1) {
          this.$message.warning('已经是最后一位不能下移')
        } else {
          if (Index == 0) {
            let arr = this.tableData[1];
            this.tableData.splice(1, 1);
            this.tableData.unshift(arr)

          } else {
            let arr = this.tableData.slice(0, Index);
            let newarr = this.tableData[Index + 1];
            let arrs = this.tableData.slice(Index, this.tableData.length);
            arrs.forEach((value, index) => {
              if (value.name == newarr.name) {
                arrs.splice(index, 1)
              }
            })
            this.tableData = arr.concat(newarr).concat(arrs);
          }
          this.$message.success('下移成功')
        }
        }
  },
  watch: {
    newcure(newV) {
      if (newV == 0) {
        this.tableData = this.deepClone(this.arr);
      }
      else if (newV == 1) {
        this.tableData = this.deepClone(this.newarr);
      }
      else if (newV == 2) {
        this.tableData = this.deepClone(this.newarrs);
      }
      else if (newV == 3) {
        this.tableData = this.deepClone(this.arrs);
      }
      else if (newV == 4) {
        this.tableData = this.deepClone(this.stop);
      }
      else if (newV == 5) {
        this.tableData = this.deepClone(this.stopgn);
      }
      else if (newV == 6) {
        this.tableData = this.deepClone(this.shape);
      }
    },
    xflag(newval){
      if (newval==1){
        this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
        this.getPlanDiagnoseInfo()
        this.getPlanHealInfo()
      }
    },
  },
  data() {
    return {
      tableData: [],
      reset: false,//重置
      object: {
          //恒牙获取牙
          arr: [],
          newarr: [],
          arrs: [],
          newarrs: [],
          //乳牙获取牙
          teetharr: [],
          teethnewarr: [],
          teetharrs: [],
          teethnewarrs: [],

        },//获取牙齿的
      Index:'',
      teethFlag:true,
      deciduousone: [
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_55_Facial.png", num: "E", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_54_Facial.png", num: "D", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_53_Facial.png", num: "C", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_52_Facial.png", num: "B", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_51_Facial.png", num: "A", background: "", newbackground: "#fff", color: "black", isok: false },
        ],
        deciduoustwo: [
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_61_Facial.png", num: "A", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_62_Facial.png", num: "B", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_63_Facial.png", num: "C", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_64_Facial.png", num: "D", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_65_Facial.png", num: "E", background: "", newbackground: "#fff", color: "black", isok: false },
        ],
        deciduousthree: [
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_85_Facial.png", num: "E", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_84_Facial.png", num: "D", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_83_Facial.png", num: "C", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_82_Facial.png", num: "B", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_81_Facial.png", num: "A", background: "", newbackground: "#fff", color: "black", isok: false },
        ],
        deciduousfour: [
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_71_Facial.png", num: "A", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_72_Facial.png", num: "B", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_73_Facial.png", num: "C", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_74_Facial.png", num: "D", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "	http://192.168.1.216/assets/img/teeth/Tooth_75_Facial.png", num: "E", background: "", newbackground: "#fff", color: "black", isok: false },
        ],
      teethmonth: [
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_18_Facial.png", num: "8", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_17_Facial.png", num: "7", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_16_Facial.png", num: "6", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_15_Facial.png", num: "5", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_14_Facial.png", num: "4", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_13_Facial.png", num: "3", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_12_Facial.png", num: "2", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_11_Facial.png", num: "1", background: "", newbackground: "#fff", color: "black", isok: false },
        ],
        teethmonthtwo: [
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_21_Facial.png", num: "1", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_22_Facial.png", num: "2", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_23_Facial.png", num: "3", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_24_Facial.png", num: "4", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_25_Facial.png", num: "5", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_26_Facial.png", num: "6", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_27_Facial.png", num: "7", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_28_Facial.png", num: "8", background: "", newbackground: "#fff", color: "black", isok: false },
        ],
        teethmonththree: [
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_48_Facial.png", num: "8", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_47_Facial.png", num: "7", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_46_Facial.png", num: "6", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_45_Facial.png", num: "5", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_44_Facial.png", num: "4", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_43_Facial.png", num: "3", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_42_Facial.png", num: "2", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_41_Facial.png", num: "1", background: "", newbackground: "#fff", color: "black", isok: false },
        ],
        teethmonthfour: [
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_31_Facial.png", num: "1", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_32_Facial.png", num: "2", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_33_Facial.png", num: "3", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_34_Facial.png", num: "4", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_35_Facial.png", num: "5", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_36_Facial.png", num: "6", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_37_Facial.png", num: "7", background: "", newbackground: "#fff", color: "black", isok: false },
          { path: "http://192.168.1.216/assets/img/teeth/Tooth_38_Facial.png", num: "8", background: "", newbackground: "#fff", color: "black", isok: false },
        ],
      contain: [
          {
            name: '拔牙',
            flag: false,
            fz: "",
            value:{
              //恒牙
              arr: [],
              newarr: [],
              arrs: [],
              newarrs: [],
              //乳牙获取牙
              teetharr: [],
              teethnewarr: [],
              teetharrs: [],
              teethnewarrs: [],
            }
          },
        ],
      showDialogtooth:false,
      Indexsx:-1,
      newthread: '',
      newcure: '',
      name: "",
      listshow: '',
      //矫形力
      shape: [
        {
        name: "咨询",
        id: 0
      },
      {
        name: "取资料",
        id: 1
      },
      {
        name: "矫治设计",
        id: 2
      },

      {
        name: "戴入矫治器",
        id: 3
      },
      {
        name: "矫治器加力",
        id: 4
      },
      {
        name: "去除矫治器",
        id: 5
      },

      {
        name: "保持和随访",
        id: 6
      },
      ],
      //早期功能
      stopgn: [
        {
        name: "咨询",
        id: 0
      },
      {
        name: "取资料",
        id: 1
      },
      {
        name: "矫治设计",
        id: 2
      },

      {
        name: "戴入矫治器",
        id: 3
      },
      {
        name: "矫治器加力",
        id: 4
      },
      {
        name: "去除矫治器",
        id: 5

      },

      {
        name: "保持和随访",
        id: 6
      },
      ],
      //阻鼾器
      stop: [
        {
        name: "咨询",
        id: 0
      },
      {
        name: "取资料",
        id: 1
      },
      {
        name: "矫治设计",
        id: 2
      },

      {
        name: "戴入矫治器",
        id: 3
      },
      {
        name: "矫治器复查",
        id: 4
      },
      {
        name: "保持和随访",
        id: 5
      },
      ],

      //早期固定
      arrs: [
        {
        name: "咨询",
        id: 0
      },
      {
        name: "取资料",
        id: 1
      },
      {
        name: "粘矫治器",
        id: 2
      },

      {
        name: "矫治器加力",
        id: 3
      },
      {
        name: "去除矫治器",
        id: 4
      },
      {
        name: "保持和随访",
        id: 5
      },
      ],

      //早期活动
      newarrs: [
        {
        name: "咨询",
        id: 0
      },
      {
        name: "取资料",
        id: 1
      },
      {
        name: "矫治设计",
        id: 2
      },
      {
        name: "戴入矫治器",
        id: 3
      },
      {
        name: "矫治器加力",
        id: 4
      },
      {
        name: "保持和随访",
        id: 5
      },
      ],
      //隐形
      newarr: [
        {
        name: "咨询",
        id: 0
      },
      {
        name: "取资料",
        id: 1
      },
      {
        name: "矫治设计",
        id: 2
      },
      {
        name: "确认方案",
        id: 3
      },
      {
        name: "取模型",
        id: 4
      },
      {
        name: "戴入矫治器/粘结附件",
        id: 5
      },
      {
        name: "常规复诊",
        id: 6
      },
      {
        name: "refinement or MCC",
        id: 7
      },
      {
        name: "拆除附件",
        id: 8
      },
      {
        name: "种植支坑",
        id: 9
      },
      {
        name: "保持和随访",
        id: 10
      },
      ],

      //固定
      arr: [
        {
        name: "咨询",
        id: 0
      },
      {
        name: "取资料",
        id: 1
      },
      {
        name: "矫治设计",
        id: 2
      },
      {
        name: "确认方案",
        id: 3
      },
      {
        name: "分牙",
        id: 4
      },
      {
        name: "粘矫治器",
        id: 5
      },
      {
        name: "排齐整平",
        id: 6
      },
      {
        name: "关闭间隙阶段",
        id: 7
      },
      {
        name: "精细调整",
        id: 8
      },
      {
        name: "去除矫治器",
        id: 9
      },
      {
        name: "种植支坑",
        id: 10
      },
      {
        name: "保持和随访",
        id: 11
      },
      ],
      thread: [
        { value:0, label: '安氏Ⅰ类' },
        { value: 1, label: '安氏Ⅰ类1分类' },
        { value: 2, label: '安氏Ⅰ类1分类亚类' },
        { value: 3, label: '安氏Ⅱ类2分类' },
        { value:4, label: '安氏Ⅱ类2分类亚类' },
        { value: 5, label: '安氏Ⅲ类' },
        { value: 5, label: '安氏Ⅲ类亚类' },
      ],
      cure: [
        { value: 0, label: '固定矫治' },
        { value: 1, label: '隐形矫治' },
        { value: 2, label: '早期活动矫治' },
        { value: 3, label: '早期固定矫治' },
        { value: 4, label: '阻鼾器' },
        { value: 5, label: '早期功能矫正' },
        { value: 6, label: '矫形力矫治' },
      ],
      newBone: '',
      Bone: [
        { value: 0, label: 'Ⅰ' },
        { value: 1, label: 'Ⅱ' },
        { value: 2, label: 'Ⅲ' },
      ],
      doctorList: {},//挂号主键id
      numXflag:'',//判断新增还是修改
      formList:{},//诊断
      taxt:'',
      healId:'',
      zlXflag:''
    }
  },

}
</script>

<style scoped lang="scss">
.newmouth {
  border: 1px solid transparent;
  background-color: #fff;
}
.teethWidth {
    width: 450px;
    height: 150px;

  }
  .teeth_contain {
    width: 90%;
    height: 300px;
    /* border: 1px solid black; */
    margin: 0 auto;
    margin-top: 20px;

  }
.container {
  //width: 100%;
  height: 100%;
  padding: 10px 10px;
}
.mouth {
    border: 1px solid transparent;
    background-color: #fff;
  }

  .newmouth {
    border: 1px solid transparent;
    background-color: #fff;
  }

  .Width {
    width: 100px;
    height: 20px;
  }

  .Width:nth-of-type(1) {
    border: 1px solid #666;
    border-top-color: transparent;
    border-left-color: transparent;

  }

  .Width:nth-of-type(2) {
    border: 1px solid #666;
    border-top-color: transparent;
    border-right-color: transparent;

  }

  .Width:nth-of-type(3) {
    border: 1px solid #666;
    border-left-color: transparent;
    border-bottom-color: transparent !important;

  }

  .Width:nth-of-type(4) {
    /* border: 1px solid #666;
    border-right-color: transparent;
    border-bottom-color: transparent; */

  }
.topBOX {
  //height: 200px;
  width: 100%;
  border: 1px solid #cccccc;
}

.title {
  height: 40px;
  background-color: #ebfaff;
  line-height: 40px;
  text-indent: 1em;
}

.butBox {
  margin-top: 20px;
  border: 1px solid #cccccc;
}
.teeth_top {
    width: 54px;
    height: 150px;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .teeth_top:hover {
    border: 1px solid #409eff;
  }

  .teethWidth {
    width: 450px;
    height: 150px;

  }

  .teeth_contain {
    width: 90%;
    height: 300px;
    /* border: 1px solid black; */
    margin: 0 auto;
    margin-top: 20px;

  }

  * {
    box-sizing: border-box;
  }

  .Height_contain_left {
    width: 118px;
    height: 40px;
    padding-left: 16px;
    padding-top: 16px;

  }

  .Height_contain_right {
    width: calc(100% - 118px);
    /* border: 2px solid #eee; */
    height: 40px;
  }

  .Height_contain {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;

  }

  .Height_bottom {
    width: 95%;
    height: 200px;
    position: absolute;
    top: 53px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    z-index: 10000;
    /* position: relative; */


  }

  .Height_children {
    width: 98%;
    height: 50px;
    position: relative;
    display: flex;
    /* border: 1px solid #eee; */
  }

  .Height {
    width: 100%;
    height: 70px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .history {
    min-height: 30px;
    padding-left: 16px;
    margin-top: 20px;
  }

  .newplate_top_left {
    width: 250px;
    height: 550px;
    /* border: 1px solid black; */
  }

  .newplate_top_right {
    width: calc(100% - 250px);
    height: 550px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    /* border: 1px solid black; */
  }

  .newplate_top {
    width: 100%;
    height: 550px;
    /* border: 1px solid red; */
    display: flex;
  }

  .newplate {
    width: 100%;
    height: 600px;
    /* border: 1px solid black; */
    position: relative;
  }

  .plate {
    width: 99%;
    height: 30px;
    border: 1px solid #409eff;
    border-radius: 10px;
    text-align: center;
    line-height: 20px;
    margin-top: 10px;

  }

  .yc {
    visibility: hidden;
  }

  .mouth {
    border: 1px solid transparent;
    background-color: #fff;
  }

  .newmouth {
    border: 1px solid transparent;
    background-color: #fff;
  }

  .Width {
    width: 100px;
    height: 20px;
  }

  .Width:nth-of-type(1) {
    border: 1px solid #666;
    border-top-color: transparent;
    border-left-color: transparent;

  }

  .Width:nth-of-type(2) {
    border: 1px solid #666;
    border-top-color: transparent;
    border-right-color: transparent;

  }

  .Width:nth-of-type(3) {
    border: 1px solid #666;
    border-left-color: transparent;
    border-bottom-color: transparent !important;

  }

  .Width:nth-of-type(4) {
    /* border: 1px solid #666;
    border-right-color: transparent;
    border-bottom-color: transparent; */

  }

  .glnews {
    border: 1px solid #fff !important;
    border-right-color: #666 !important;
    background-color: #fff;
  }

  .glnew {
    border: 1px solid #fff !important;
  }

  .News {
    background-color: #fff !important;
  }

  .newmerage:nth-of-type(1) {
    width: 1080px;
    height: 60px;
  }

  .newmerage:nth-of-type(2) {
    width: 145px;
  }

  .merages {
    background-color: aqua;
  }

  .merages:nth-of-type(1) {
    width: 1050px;
    padding-left: 20px;
    border: 1px solid #666;
    border-right-color: transparent;
  }

  .merages:nth-of-type(2) {
    width: 50px;
  }

  .merages:nth-of-type(3) {
    width: 150px;
  }

  .elect_right_top {
    width: 100%;
    height: 80px;
    /* border: 1px solid red; */
  }

  .merge {
    width: 75px;
    height: 88px;
    border: 1px solid #409eff;
    border-left-color: transparent;

  }

  .merge:nth-of-type(2) {
    border-right-color: transparent;
  }

  .elect_left_top {
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #409eff;
  }

  * {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
  }

  .elect_top {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
  }

  .Left {
    margin-left: 40px
  }

  .Border {
    border: 1px solid #666;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
    width: 30px;
    height: 10px;

  }

  .Bordertwo {
    border: 1px solid transparent;

  }

  .elect_contain {
    width: 100%;
    height: 150px;
    /* border: 1px solid black; */
    display: flex;
  }

  .elect_left {
    width: 130px;
    height: 150px;
    border: 1px solid #409eff;
    border-left-color: transparent;
    border-right-color: transparent;
    background-color: #fff
  }

  .elect_right {
    width: calc(100% - 130px);
    height: 150px;
    border: 1px solid transparent;
    margin-left: 10px;
  }
</style>