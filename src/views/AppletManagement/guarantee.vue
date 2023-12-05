<template>
    <div>
        <Tree :isShowfile="isShowfile" :showDefault="showDefault" @changeCompay="changeCompay">
            <template v-slot:company>
                <div style="position: absolute;right: 20px;top:0px;background-color: #fff;height: 50px;">
                    <el-button v-has-permi="['client:companyLabel:add']" type="primary" size="mini"
                        style="position: absolute;right:220px;top:145px;z-index:1000" @click="submit"
                        :loading="submitcompant" v-if="!ifEdit" :disabled="jurisdictions">
                        提交
                    </el-button>
                    <el-button v-has-permi="['client:companyBasicsInfo:edit']" type="primary" size="mini"
                        style="position: absolute;right:220px;top:145px;z-index:1000" @click="submit"
                        :loading="submitcompant" v-if="ifEdit" :disabled="jurisdictions">
                        提交
                    </el-button>
                    <el-button v-has-permi="['client:companyBasicsInfo:edit']" type="success" size="mini"
                        style="position: absolute;right:120px;top:145px;z-index:1000" @click="add" :loading="submitcompant"
                        :disabled="jurisdictions">
                        新建分类
                    </el-button>
                    <!-- ifEdit -->
                    <el-button type="primary" size="mini" style="position: absolute;right:50px;top:145px;z-index: 1000;"
                        @click="submitback">
                        返回
                    </el-button>
                </div>
                <div :style="{ height: height + 'px', border: '1px solid transparent' }">
                    <div v-if="list.length > 0">
                        <div v-for="item in list">
                            <div class="basic">
                                <span class="long"></span>
                                <span style="margin-left: 10px;">{{ item.guaranteeName }}</span>
                                <div style="margin-left: 20px;">是否有效：</div>
                                <el-switch v-model="item.useFlag" active-color="#13ce66" inactive-color="#ff4949"
                                    style="margin-left: 10px;">
                                </el-switch>
                                <el-button type="text" style="margin-left: 20px;" @click="newdelete(item)">删除</el-button>
                            </div>
                            <div style="margin-top: 10px;">
                                <el-input type="textarea" :rows="5" v-model="item.guaranteeContent"></el-input>
                            </div>
                        </div>
                    </div>
                    <div v-else :style="{width:'100%',height:height+'px',display:'flex',alignItems:'center',justifyContent:'center'}">
                        <el-empty description="暂无分类"></el-empty>
                    </div>


                </div>
            </template>

        </Tree>
        <sgDialog title="新增分类" size="20%" out-top="2%" :dialog="showDigs" @handleClose="showDigs = false">
            <div slot="out">
                <span style="color:red">*</span> <span>分类名称</span>
                <span>
                    <el-input size="mini" style="margin-left: 20px;width: 200px;" v-model="categoryNames" clearable>

                    </el-input>
                </span>
                <div style="height: 10px;">

                </div>
                <div style="height: 50px;">

                </div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok"
                            v-has-permi="['client:productCategory:edit']">确定</el-button>
                        <el-button @click="showDigs = false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
    </div>
</template>
<script>
import Tree from '@/components/newTree/index'
import sgDialog from '@/components/Dialog/index'
import vm from '@/utils/util'
import { re } from 'mathjs'
export default {
    components: {
        Tree,
        sgDialog
    },
    methods: {
        newdelete(item) {
            this.$confirm('确认要删除分类吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                this.$api.confinementRoom.serviceGuaranteeInfodelte(item.guaranteeInfoId).then(res => {
                    if (res.code == 200) {
                        this.$message.success('删除成功')
                        this.search();
                    }
                })
            }).catch((res) => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        search() {
            this.$api.confinementRoom.serviceGuaranteeInfo({
                deptId: this.treedeptId
            }).then(res => {
                this.list = res.rows;
                this.list.forEach(value => {
                    if (value.useFlag == '0') {
                        value.useFlag = true
                    } else {
                        value.useFlag = false
                    }
                })
                if (this.list.length == 0) {
                    this.ifEdit = false
                } else {
                    this.ifEdit = true
                }
            })
        },

        ok() {
            if (this.categoryNames == '' || this.categoryNames == null) {
                this.$message.warning("请输入分类名称")
                return
            }
            let flag = false
            this.list.forEach(value => {
                if (value.guaranteeName == this.categoryNames) {
                    flag = true;
                }
            })
            if (flag) {
                this.$message.warning("已有相同分类，重新添加")
                return
            }
            this.list.push({
                guaranteeName: this.categoryNames,
                guaranteeContent: "",
                useFlag: false,

            })
            this.showDigs = false
        },
        add() {
            this.showDigs = true;
            this.categoryNames = '';
        },
        submitback() {
            vm.$emit('closeTag', this.$route.path);
        },
        submit() {
            if (this.list.length == 0) {
                this.$message.warning('请先添加分类再进行提交');
                return
            }
            this.list.forEach(value => {
                if (value.useFlag == false) {
                    value.useFlag = '1'
                } else {
                    value.useFlag = '0'
                }
                value.deptId = this.treedeptId
            })
            if (!this.ifEdit) {
                this.$api.confinementRoom.addBatchServiceGuarantee(this.list).then(res => {
                    if (res.code == 200) {
                        this.$message.success('新增成功');
                        this.search();
                    }
                })
            } else {
                this.$api.confinementRoom.editBatchServiceGuarantee(this.list).then(res => {
                    if (res.code == 200) {
                        this.$message.success('编辑成功');
                        this.search();
                    }
                })

            }

        },
        changeCompay(id, item) {
            if (!item.children) {
                this.jurisdictions = false
                this.$store.dispatch('treedepartment', { treedepartmentId: id })
                this.search();
            }else{
                this.jurisdictions = true
            }
        }
    },
    computed: {
        treedeptId: {
            get() {
                return this.$store.getters.treedepartmentId
            },
            set(val) {
                val = this.$store.getters.treedepartmentId;
            }
        }
    },
    created() {
        let h = window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;//获取可视区域高度
        this.height = h - 132
        this.$store.dispatch('treedepartment', { treedepartmentId: this.$store.getters.departmentId })
        this.treedeptId = this.$store.getters.treedepartmentId;

    },
    data() {
        return {
            categoryNames: "",
            weightSorts: "0",
            isShowfile: false,
            showDefault: false,
            submitcompant: false,
            ifEdit: false,
            jurisdictions: true,
            height: "",
            showDigs: false,
            list: [

            ]
        }
    }
}
</script>
<style scoped>
.basic {
    margin-top: 10px;
    margin-left: 20px;
    height: 35px;
    /* border: 1px solid black; */
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
}

.long {
    height: 10px;
    border: 2px solid #2b75ed;
    display: inline-block;
}
</style>