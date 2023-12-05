<template>
  <div>
    <div style="display: flex">
      <div  style="width: 50%;">
        <el-divider content-position="left" style="width: 50%">合并客户</el-divider>
        <div class="lefts" >
          <div style="margin: 10px 0px;height: auto" >
            <el-input style="width: 200px" size="mini" v-model="phone"></el-input>
            <el-button size="mini" style="margin-left: 10px" @click="getList(1)" type="primary">查询</el-button>
          </div>
          <div style="margin-bottom: 10px">
            查询号码：
          </div>

          <el-form :model="customerlist" :inline="true" ref="customerlist" label-position="left">
            <div class="formdiv">
              <el-form-item class="formitem" label="顾客姓名:">{{customerlist.customerName}} </el-form-item>
              <el-form-item label="电话:">{{customerlist.phone}}</el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem color" label="客户状态:">
                <show-dict-data :options="dict.type.whether_Newguest" :value="customerlist.customerStatus" />
               </el-form-item>
              <el-form-item label="客户卡号:">{{customerlist.customCardNumber}}</el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem" label="性别:">
                <show-dict-data :options="dict.type.sys_user_sex" :value="customerlist.customSex" />
                </el-form-item>
              <el-form-item label="年龄:">{{customerlist.customAge}}</el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item  class="formitem color" label="成交状态:">
                <show-dict-data :options="dict.type.whether_deal" :value="customerlist.receptionStatus" />
              </el-form-item>
              <el-form-item label="创建时间:">{{customerlist.createTime}} </el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem" label="媒介:">
                <el-radio v-if="customerlist.channelName" v-model="radio" label="1">{{customerlist.channelName}}</el-radio>
              </el-form-item>
              <el-form-item label="渠道:">
                <el-radio v-model="ali" v-if="customerlist.filingName" label="1">{{customerlist.filingName}}/{{customerlist.typeTwoName}}/{{customerlist.typeThreeName}}</el-radio>
              </el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem" label="现场咨询师:">
                <el-radio v-model="vip1" v-if="customerlist.acName" label="1">{{customerlist.acName}}</el-radio>
              </el-form-item>
              <el-form-item label="客户代表:">
                <el-radio v-model="vip2" v-if="customerlist.khdbName" label="1">{{customerlist.khdbName}}</el-radio>
              </el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem" label="网电咨询师:">
                <el-radio v-model="wz1"  label="1" v-if="customerlist.oudName">{{customerlist.oudName}}</el-radio>
              </el-form-item>
              <el-form-item label="网电建档人:">
                <el-radio v-model="wd1" v-if="customerlist.createName" label="1">{{customerlist.createName }}</el-radio>

              </el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem color" label="是否黑名单:">
                <show-dict-data :options="dict.type.sys_is_blacklist" :value="customerlist.blacklist" />
              </el-form-item>
              <el-form-item label="是否有账户余额:"> </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div style="width: 50%;">
        <el-divider content-position="left" style="width: 50%">被合并客户</el-divider>
        <div class="lefts" >
          <div style="margin: 10px 0px;">
            <el-input style="width: 200px" size="mini" v-model="phonecopy"></el-input>
            <el-button size="mini" style="margin-left: 10px" @click="getList(2)" type="primary">查询</el-button>
          </div>
          <div style="margin-bottom: 10px">
            查询号码：
          </div>

          <el-form :model="customerlistcopy" :inline="true" ref="customerlistcopy" label-position="left">
            <div class="formdiv">
              <el-form-item class="formitem" label="顾客姓名:">{{customerlistcopy.customerName}} </el-form-item>
              <el-form-item label="电话:">{{customerlistcopy.phone}} <el-checkbox v-if="customerlistcopy.phone" v-model="checked">是否保留被合并客户的所有号码</el-checkbox></el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem color" label="客户状态:">
                  <show-dict-data  :options="dict.type.whether_Newguest" :value="customerlistcopy.customerStatus" />
              </el-form-item>
              <el-form-item label="客户卡号:">{{customerlistcopy.customCardNumber}}</el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem" label="性别:">
                <show-dict-data :options="dict.type.sys_user_sex" :value="customerlistcopy.customSex" />
              </el-form-item>
              <el-form-item label="年龄:">{{customerlistcopy.customAge}}</el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item  class="formitem color" label="成交状态:">
                <show-dict-data :options="dict.type.whether_deal" :value="customerlistcopy.receptionStatus" />
              </el-form-item>
              <el-form-item label="创建时间:">{{customerlistcopy.createTime}} </el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem" label="媒介:">
                <el-radio v-if="customerlistcopy.channelName" v-model="radio" label="2">{{customerlistcopy.channelName}}</el-radio>
              </el-form-item>
              <el-form-item label="渠道:">
                <el-radio v-model="ali" v-if="customerlistcopy.channelName" label="2">{{customerlistcopy.filingName}}/{{customerlistcopy.typeTwoName}}/{{customerlistcopy.typeThreeName}}</el-radio>
              </el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem" label="现场咨询师:">
                <el-radio v-model="vip1" v-if="customerlistcopy.acName" label="2">{{customerlistcopy.acName}}</el-radio>
              </el-form-item>
              <el-form-item label="客户代表:">
                <el-radio v-model="vip2" v-if="customerlistcopy.khdbName" label="2">{{customerlistcopy.khdbName}}</el-radio>
              </el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem" label="网电咨询师:">
                <el-radio v-model="wz1" khdbName label="2" v-if="customerlistcopy.oudName">{{customerlistcopy.oudName}}</el-radio>
              </el-form-item>
              <el-form-item label="网电建档人:">
                <el-radio v-model="wd1" v-if="customerlistcopy.createName" label="2">{{customerlistcopy.createName }}</el-radio>
              </el-form-item>
            </div>
            <div class="formdiv">
              <el-form-item class="formitem color" label="是否黑名单:">
                <show-dict-data :options="dict.type.sys_is_blacklist" :value="customerlistcopy.blacklist" />
              </el-form-item>
              <el-form-item label="是否有账户余额:"> </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="remark">
      <div style="display: flex;justify-content: space-between;">
       <div>
         注：
       </div>
        <div >
          <el-button size="mini" @click="onsubmit">保存</el-button>
          <el-button size="mini" @click="close">关闭</el-button>
        </div>
      </div>
      <div>
        1.默认以合并客户号码为主号码
      </div>
      <div>
        2.单选按钮：默认以合并客户为主，可以通过勾选取被合并客户的值
      </div>
      <div style="color: red">
        3.是否保留被合并号码(主号码及备用号码)：默认是。是则把被合并客户的所有号码设为合并客户的备用号码，否则被合并客户的所有号码都删除
      </div>
    </div>
  </div>

</template>

<script>

import vm from '@/utils/util'

export default {
  dicts:['whether_Newguest','sys_user_sex','sys_is_blacklist','whether_deal'],
  name: "Customermerger",
  data(){
      return{
        phone:'',
        customerlist:{},
        customerlistcopy:{},
        phonecopy:'',
        checked:true,
        radio:'1',
        ali:'1',
        vip1:'1',
        vip2:'1',
        wz1:'1',
        wd1:'1',
      }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
    }
  },
  methods:{
    close(){
      // this.$router.push({path:'systemManagement'})
      this.$router.go(0)
      this.closeTag()
    },
    onsubmit(){
      if (JSON.stringify(this.customerlistcopy)==="{}"){
        this.$message.error('被合并人信息为空，请重新选择')
        return
      }
      const query={
        blacklist:this.customerlist.blacklist,
        channelId:this.radio==1?this.customerlist.channelId:this.customerlistcopy.channelId,//
        channelTypeId:this.radio==1?this.customerlist.channelTypeId:this.customerlistcopy.channelTypeId,
        createuserId:this.wd1==1?this.customerlist.createuserId:this.customerlistcopy.createuserId,
        customAge:this.customerlist.customAge,
        customCardNumber:this.customerlist.customCardNumber,
        customSex:this.customerlist.customSex,
        customerName:this.customerlist.customerName,
        customerRepresentative:this.vip2==1?this.customerlist.customerRepresentative:this.customerlistcopy.customerRepresentative,
        customerStatus:this.customerlist.customerStatus,
        customerphone:this.customerlist.phone,
        filingId:this.ali==1?this.customerlist.filingId:this.customerlistcopy.filingId,
        isReserve:this.checked==true?1:0,//是否保留被合并客户的所有号码(0否 1是)
        mainId:this.customerlist.id,
        onlineUserId:this.wz1==1?this.customerlist.onlineUserId:this.customerlistcopy.onlineUserId,
        quiltId:this.customerlistcopy.id,
        receptionId:this.vip1==1?this.customerlist.receptionId:this.customerlistcopy.receptionId,
        receptionStatus:this.customerlist.receptionStatus,
        typeThreeId:this.ali==1?this.customerlist.typeThreeId:this.customerlistcopy.typeThreeId,
        typeTwoId:this.ali==1?this.customerlist.typeTwoId:this.customerlistcopy.typeTwoId,
        mainCustomId:this.customerlist.customId,
        quiltCustomId:this.customerlistcopy.customId,
        deptId:this.deptId,
        createTime:this.customerlist.createTime
      }
      this.$api.changeAscriptionRecord.mergeAllCustom(query).then(res => {
         if (res){
           this.$message.success(res.msg)
           this.$router.push({path:'systemManagement'})
           this.closeTag()

         }
      })

    },
    /**
     * @Description: 关闭当前标签
     */
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    getList(val){

      const query={
        customPhone:'',
        deptId:this.deptId
      }
      if (val==1){
        if (this.phone==''){
          this.$message.warning('请输入电话号码')
          return
        }
        query.customPhone=this.phone

      }else if (val==2){
        if (this.phonecopy==''){
          this.$message.warning('请输入电话号码')
          return
        }
        query.customPhone=this.phonecopy
      }
      this.$api.changeAscriptionRecord.getCustom(query).then(res => {

          if (val==1){
            if (res.data){
              this.customerlist = res.data
            }else {
              this.customerlist={}
            }
          }else if (val==2){
            if (res.data){
              this.customerlistcopy = res.data
            }else {
              this.customerlistcopy={}
            }

          }


      })
    },

  }
}
</script>

<style scoped lang="scss">
.formitem{
  width: 50%;

}
.formdiv{
  border-top: 1px solid #ccc;
}
.lefts{
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  padding: 10px;
  margin-left:20px;
}
::v-deep .el-divider--horizontal {
  width: 98%;

  margin-left: 20px;
  margin-bottom: -1px;
}
.el-form-item {
  margin-bottom:0px !important;
}
.remark{
  line-height: 30px;
  margin-left: 20px;
  font-size: 13px;
}
.color {
  color: red !important;
}
::v-deep .el-form-item__label{
  line-height: 30px;

}
::v-deep .el-form--inline .el-form-item__label{
  font-size: 12px !important;
}
::v-deep .el-form-item__content{
  line-height: 30px !important;
  font-size: 12px;
}
::v-deep .el-radio__label{
  font-size: 12px;
}
.el-checkbox__label{
  color: red;
}
</style>
