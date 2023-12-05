<template>
    <div style="background-color:#F0F0F0;overflow:hidden">
      <div class="personal">
         <div class="personal_top">
            <div style="margin-left:20px;display:flex">
                <img src="https://resource.51beauty.com.cn/fa761c7a-c5b2-449b-8565-cb9f19abc2fb?imageslim" style="width:60px;height:60px;border-radius:50%">
                <div>
                    <span class="Left">满心喜欢</span>
                 <p class="Left">会员等级：无</p>
                </div>
            
            </div>
         </div>
         <!-- 基本信息 -->
         <div class="Left" style="margin-top:10px">
            <h3>基本信息</h3>
        </div>
         <div class="personal_contain">
             <div class="personal_contain_children">
               <p>客户姓名：</p>
               <p>手机号：</p>
               <p>最近访问时间：</p>
             </div>
             <div class="personal_contain_children">
               <p>客户昵称：</p>
               <p>客户来源：</p>
               <p>获取人：</p>
             </div>
             <div class="personal_contain_children">
               <p>客户生日：</p>
               <p>归属时间：</p>
             </div>
             <div class="personal_contain_children" style="margin-right:250px">
               <p>跟进状态：</p>
               <p>成为客户时间：</p>
             </div>
         </div>
         <div class="Left" style="margin-top:10px"><h3>其他信息</h3></div>
         <div class="personal_contain">
             <div class="personal_contain_children">
               <p>所在区域：</p>
               <p>意向项目：</p>
             </div>
             <div class="personal_contain_children">
               <p>客户职业：</p>
               <p>家庭住址：</p>
             </div>
             <div class="personal_contain_children">
               <p>收入情况：</p>
             </div>
             <div class="personal_contain_children" style="margin-right:250px">
               <p>客户意向：</p>
             </div>
         </div>
         saddas
      </div>
      <!-- 订单情况 -->
      <div style="margin-left:20px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="订单情况" name="first">
          <orderDetail></orderDetail>
    </el-tab-pane>
    <el-tab-pane label="客户轨迹" name="second">
        <Custom></Custom>
    </el-tab-pane>
    <el-tab-pane label="客户分析" name="thrid">
       <analyse></analyse>
    </el-tab-pane>
    </el-tabs>  
      </div>
    </div>
</template>
<script>
import orderDetail from './orderDetail.vue'
import Custom from './Customer.vue'
import analyse from './analyse.vue'
export default {
    components:{
        orderDetail,
        Custom,
        analyse
    },
    data(){
        return{
            activeName:"first",
        }
    },
    methods:{
        handleClick(){

        },
    }
}
</script>
<style scoped>
* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}
.personal_contain_children p{
    margin-top:10px
}
.personal_contain{
    width:100%;
    height:150px;
    /* border:1px solid red; */
    display:flex;
    justify-content:space-between;
}
.personal_contain_children{
    width:150px;
    height:100px;
    /* border:1px solid black; */
    margin-left:10px;
    margin-top:10px
}
.Left{
    margin-left:10px
}
.personal_top{
    width:100%;
    height:60px;
    /* border:1px solid black; */
    display:flex;
    margin-top:10px;
}
 .personal{
    width:98%;
    height:400px;
    margin-left:1%;
    /* border:1px solid black; */
    overflow:hidden;
    background-color:#fff;
    margin-top:1%;
 }

</style>