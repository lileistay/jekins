<template>
  <div class="print">
    <div class="title">兰州时光激光整形美容医院义齿设计单</div>
    <div class="header">
      <span>姓名：{{ print.customerName }}</span>
      <span>性别：{{ print.customPhone }}</span>
      <span>年龄：{{ print.orderNumber }}</span>
    </div>
    <div class="table">
<!--      <div>-->
<!--        <div style="border-bottom: 1px solid #000;width: 160px;margin-bottom: -5px;display: flex;justify-content: space-between">-->
<!--          <div style="width:78px;border-right: 1px solid #000;text-align: right">{{ numsting1}}</div>-->
<!--          <div style="width:78px;text-align: left">{{ numsting2}}</div>-->
<!--        </div>-->
<!--        <div style="display: flex;justify-content: space-between;width: 160px;margin-top: -10px">-->
<!--          <div style="width:78px;border-right: 1px solid #000;text-align: right">{{ numsting4}}</div>-->
<!--          <div style="width:78px;text-align: left">{{ numsting3}}</div>-->
<!--        </div>-->
<!--      </div>-->
      <table  v-for="(items, indexs) in contain" style="border-collapse: collapse;border: 1px solid #666;" border   >
        <!--                   {{handleleft(items.value)}}-->
        <tbody>
        <tr style="height: 50px;">
          <td class="mouth"><span style="">口腔检查：</span> </td>

          <td class="newmouth">
        <tr>
          <td class="Width" align="right">
                <span  v-for="(itemleft,indexleft) in handleleft(items.value)" :key="indexleft">
               {{itemleft.num}}
              </span>
          </td>
          <td class="Width">
                <span  v-for="(itemleft,indexleft) in handleleftright(items.value)" :key="indexleft">
               {{itemleft.num}}
              </span>
          </td>
        </tr>
        <tr >
          <td
            style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 20px;" align="right">
                <span  v-for="(itemleft,indexleft) in handleright(items.value)" :key="indexleft" >
               {{itemleft.num}}
              </span>
          </td>
          <td>
              <span  v-for="(itemleft,indexleft) in  handlerightright(items.value)" :key="indexleft">
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
      <div>
        <div>
<!--          加工类型:{{}}-->
        </div>
        <div>
<!--          色号:{{}}-->
        </div>
        <div>
          数量:{{print.makeNum}}
        </div>
      </div>
    </div>
    <div class="table">
      <div >
        <span   > 工单进度:{{print.healTime}}</span>
        <span v-if="print.worksheetState==0"> 状态:待派送</span>
        <span v-if="print.worksheetState==1"> 状态:已取件</span>
        <span v-if="print.worksheetState==2"> 状态:已回件</span>
        <span v-if="print.worksheetState==3"> 状态:已带走</span>
        <span v-if="print.worksheetState==4"> 状态:已返工</span>
      </div>
      <div>
        <span > 就诊时间:{{print.healTime}}</span>
        <span> 医生:{{print.doctorName}}</span>
      </div>
      <div>
        <span> 加工单位:{{print.processName}}</span>
        <span> 加工联系人:{{print.contactName}}</span>
      </div>
      <div>
        <span>
        是否结算:{{print.settleFlag}}
        </span>
      </div>
      <div>
        <span>
        备注:{{print.remarks}}

        </span>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'ChargeSheetPrint',
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    details: {
      type: Array,
      default: function() {
        return []
      }
    },
    total: {
      type: String,
      default: '0'
    }
  },
  watch:{
    print(val){
      let item=val
      // this.getType()
      // this.showDialog=true
      this.contain.forEach(item=>{
        item.value.arr=[]
        item.value.newarr=[]
        item.value.newarrs=[]
        item.value.arrs=[]
        item.value.teetharr=[]
        item.value.teetharrs=[]
        item.value.teethnewarr=[]
        item.value.teethnewarrs=[]
      })
      this.contain=[]
      this.form={
        num:item.makeNum,
        value:item.healTime,
        doctorId:item.doctorId,
        producerId:item.producer,
        contactId:item.producerContact,
        money:item.worksheetFee,
        remark:item.remarks
      }
      this.worksheetId=item.worksheetId
      if (item && item.toothList){
        item.toothList.forEach((value,index)=>{
          if (item.toothList.length!=0){
            this.contain.push(
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
            )
          }
          value.forEach(newvalue=>{
            if(newvalue.flag=='0'){
              if(newvalue.sort=='1'){
                this.listmonth(newvalue,index,'arr')
              }
              if(newvalue.sort=='2'){
                this.listmonth(newvalue,index,'newarr')
              }
              if(newvalue.sort=='3'){
                this.listmonth(newvalue,index,'newarrs')
              }
              if(newvalue.sort=='4'){
                this.listmonth(newvalue,index,'arrs')
              }
            }else{
              if (newvalue.sort==1){
                this.listmonth(newvalue,index,'teetharr')

              }else if (newvalue.sort==2){
                this.listmonth(newvalue,index,'teethnewarr')

              }else if (newvalue.sort==3){
                this.listmonth(newvalue,index,'teethnewarrs')

              }else if (newvalue.sort==4){
                this.listmonth(newvalue,index,'teetharrs')

              }
            }
          })
        })
      }

    }
  },
  data() {
    return {
      numlist1:[],
      numlist2:[],
      numlist3:[],
      numlist4:[],
      numsting1:null,
      numsting2:null,
      numsting3:null,
      numsting4:null,
      contain:[]
    }
  },
  methods:{
    listmonth(item,val,list){
      let numliat = item.num.split(',')
      numliat.forEach(mmm=>{
        let object={
          background:item.background,
          color:item.color,
          newbackground:item.newbackground,
          isok:item.isok,
          num:mmm
        }
        this.contain[val].value[list].push(object)
      })
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
  },
  created() {
  }
}
</script>

<style scoped lang="scss">
.print {
  margin: 0;
  padding: 0;
  .title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }
  .header {
    display: flex;
    justify-content: space-between;
    margin: 30px 20px 0 20px;
    font-size: 14px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 20px 0px;
    width: 60%;
  }
  .table  {
    width: 100%;
    margin: 30px 20px 0 20px;
    font-size: 14px;


  }
  .table  {
    div{
      margin: 10px 0px;
      span{
        margin-right: 60px;
      }
    }
  }

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
  border: 1px solid #666;
  border-right-color: transparent;
  border-bottom-color: transparent;

}
</style>
