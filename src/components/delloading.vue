<template>
    <div>
        <div v-show="isTrueshow" style="position: absolute;z-index: 100000;">
            <div style="position: fixed;height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;background-color: #fff;opacity: 0;">
          <div style="width: 300px;height: 130px;position: relative;display: flex;" class="xz">
          </div>
    </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'loadingfalse',
 data(){
    return {
         
    }
 },
 props:['isTrueshow'],
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