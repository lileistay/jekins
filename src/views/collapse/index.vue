<template>
    <div v-show="isshow">
        <div class="a">
            <div class="b">
                   <div style="width: 300px;height: 50px;text-align: center;line-height: 30px;font-size: 50px;color: red;">{{ title }}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['title','isshow'],
    data(){
        return{

        }
    },
   
}
</script>
<style scoped>
 .a{
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: black;
  z-index: 99999999;
 }
 .b{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
 }
</style>