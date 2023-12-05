<template>
    <div style="height:300px;background-color:#fff">
        <div style="height:20px"></div>
         <span class="Left">订单数据:</span>
         <p style="margin-top:20px" class="Left">上次消费时间:{{  }}</p>
         <div class="orderDetail">
             <div class="orderDetail_children">
                <p style="margin-top:30px;color:rgba(0,0,0,.45)" >
                    累计消费订单
                </p>
                <p style="color:rgba(0,0,0,.85)">
                    68.00
                </p>
                        
             </div>
             <div class="orderDetail_children" style="margin-left:20px">
                <p style="margin-top:30px;color:rgba(0,0,0,.45)">
                    累计下单次数
                </p>
                <p style="color:rgba(0,0,0,.85)">
                    1
                </p>
            </div>
         </div>
    </div>
</template>
<script>
export default {
    
}
</script>

<style scoped>
.Left{
    margin-left:20px;
    margin-top:50px;
}
  .orderDetail{
    width:800px;
    height:160px;
    display:flex;
    margin-top:20px;
    margin-left:20px
  }
  .orderDetail_children{
    width:300px;
    height:95px;
    background-color:#F6F6F6;
    text-align:center;

  }
</style>