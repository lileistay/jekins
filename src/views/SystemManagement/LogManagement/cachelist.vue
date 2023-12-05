<template>
    <div style="overflow: hidden;">
        <div class="cache" :style="{ height: height + 'px' }">
            <el-card class="cache_card">
                <div>基本信息</div>
                <el-divider />
                <el-table :data="tableData" style="width: 100%" :height="tableHeight" @row-click="rowClick">
                    <el-table-column type="index" width="50" label="序号" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="缓存名称" align="center">

                    </el-table-column>
                    <el-table-column prop="remark" label="备注" align="center">

                    </el-table-column>
                    <el-table-column prop="date" label="操作" align="center">
                      <template slot-scope="scope">
                       <div>
                        <i class="el-icon-delete" style="color: #409eff;cursor: pointer;" @click="deleter(scope.row)"></i>
                       </div>
                      </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="cache_card">
                <div>键名列表</div>
                <el-divider />
                <el-table :data="Newdata" style="width: 100%" :height="tableHeight" @row-click="nerClick">
                    <el-table-column type="index" width="50" label="序号" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="缓存键名" align="center">

                    </el-table-column>
                    <el-table-column prop="date" label="操作" align="center">
                      <template slot-scope="scope">
                       <div>
                        <i class="el-icon-delete" style="color: #409eff;cursor: pointer;" @click="deleters(scope.row)"></i>
                       </div>
                      </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="cache_card">
                <div style="display: flex;justify-content: space-between;">
                    <div>缓存内容</div>
                    <div style="color: #409eff;font-size: 14px;margin-right: 20px;cursor: pointer;"> <i class="el-icon-refresh-right"></i> 清理全部</div>
                </div>
                <el-divider />
                <div class="Tops">
                    <span>缓存名称</span>
                    <div class="Top">
                        <el-input v-model="name" size="mini" disabled></el-input>
                    </div>
                   
                </div>
                <div class="Tops">
                    <span>缓存键名</span>
                    <div class="Top">
                        <el-input v-model="names" size="mini" disabled></el-input>
                    </div>
                </div>
                <div class="Tops">
                    <span>缓存键名</span>
                    <div class="Top">
                        <el-input v-model="newname" size="mini"   type="textarea" :rows="2" disabled></el-input>
                    </div>
                </div>
            </el-card>

        </div>
    </div>
</template>
<script>
export default {
    created() {
        this.height = document.documentElement.clientHeight - 175
        this.tableHeight=this.height-68
    },
    data() {
        return {
            height: '',
            tableData: [{name:"首页",remark:"首次登录"},],
            tableHeight:"",
            Newdata:[],
            flag:false,
            name:"",
            names:"",
            newname:'',
            createname:"",
        }
    },
    methods:{
        nerClick(row){
          this.name=this.createname;
          this.names=row.name;
        },
        deleter(index){
            let Index=this.tableData.indexOf(index)
            this.tableData.splice(Index,1)
            this.flag=true;
        },
        deleters(index){
            let Index=this.Newdata.indexOf(index)
            this.Newdata.splice(Index,1)
            this.flag=true;
        },
        rowClick(row){
            if(!this.flag){
                this.Newdata.push({
                name:'bcab0c3f-8ad8-4c29-a1ab-fba5fcdddfa7',
            })
            }
            this.createname=row.name;
            this.flag=false
     
        }
    },
}
</script>
<style scoped>
.Top{
    margin-top: 10px;
}
.Tops{
    margin-top: 15px;
}
*{
    font-size: 14px;
}
::v-deep .el-card__body {
    padding: 10px 0px 0px 10px !important;
    height: 10px !important;
}

::v-deep .el-divider {
    margin: 5px 0px 0px 0px !important;
    width: 100% !important;
}

.cache_card {
    width: 30%;
}

.cache {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin-top: 20px;
}
</style>