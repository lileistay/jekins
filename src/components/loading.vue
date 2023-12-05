<template>
    <div>
        <div v-show="isTrue" style="position: absolute;z-index: 100000;">
            <div style="position: fixed;height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;background-color: rgba(255, 255,255, 0.4);">
          <div style="width: 300px;height: 130px;position: relative;display: flex;" class="xz">
            <div style="width: 130px;height: 100px;">
                <img src="@/assets/images/u4916.svg" alt="" style="width: 100%;height: 100%;">
            </div>
            <div>
                <br>
                <div style="text-align: center;font-size: 20px;  font-family:'微软雅黑 Bold', '微软雅黑';font-weight:700;margin-top: 10px;color: #1abc9c;">客户关系管理系统</div>
              <div style="text-align: center;font-size: 20px;font-family:'微软雅黑 Bold', '微软雅黑';font-weight:700;color: #999999;">助力企业销售成长</div>
            </div>
        
          </div>
    </div>
        </div>
    </div>
</template>
<script>
export default {
 data(){
    return {
         
    }
 },
 props:['isTrue'],
 
}
</script>

<style scoped >
* {
    padding: 0;
    margin: 0;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}
*{ 
 -webkit-touch-callout:none; /*系统默认菜单被禁用*/
 -webkit-user-select:none; /*webkit浏览器*/
 -khtml-user-select:none; /*早期浏览器*/
 -moz-user-select:none;/*火狐*/
 -ms-user-select:none; /*IE10*/
 user-select:none; 
} 
input{ 
 -webkit-user-select:auto; /*webkit浏览器*/ 
}
textarea{
 -webkit-user-select:auto; /*webkit浏览器*/
}

</style>