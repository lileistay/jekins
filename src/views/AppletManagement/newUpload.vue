<template>
     <div>
        <Upload :upload="upload" :limit="limit" :accept="accept" @successFile="successFile" :drag="drag" :fileSize="fileSize">
        
        </Upload>
     </div>
</template>
<script>
import Upload from "@/components/newUpload/index";
export default {
    components:{
      Upload
    },
    methods:{
      successFile(file){

      }
    },
    data(){
        return {
             upload:{
                url:"/api/file/upload"
             },
             limit:2,
             accept:".jpg, .png",
             drag:false,
             fileSize:2,
        }
    }
}
</script>

<style scoped>

</style>