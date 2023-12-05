<template >
    <div style="display: flex;">
        <!-- 左侧树组件 -->
        <div :style="{ height: Nheight, width: Nwidth, overflowY: 'scroll', position: 'relative', transition: 'all .5s' }" class="TreeLeft">
            <div :style="{ width: Nwidth, overflowY: 'scroll', transition: 'all .5s' }">
                <el-tree style="width:100%" :data="deptOptions" default-expand-all :props="defaultProps"
                    @node-click="handleNodeClick" v-show="Nwidth=='250px'">
                    <span slot-scope="{data}" class="custom-tree-node">
                        <span v-if="isShowfile">
                            <b v-if="!data.children" class="el-icon-document" />
                            <b v-else class="el-icon-folder-opened" />
                        </span>
                        {{ data.deptName }}
                    </span>
                </el-tree>
            </div>
        </div>
        <!-- 右侧功能页面 -->
        <div :style="{ width: RNwidth, height: height, }">
            <div v-if="showDefault">
                <div class="physical_table" :style="{ height: height }">
                    <div class="Top">
                        <!-- 头部搜索内容及操作按钮 -->
                        <div style="height:10px"></div>
                        <slot name="button" v-if="Imgchange">
                        </slot>
                        <div class="hidemove" @mouseover="mouseover" @mouseleave="mouseleave" @click="changeImg">
                            <img src="@/assets/hide.png" />
                        </div>
                        <!-- 其他功能封装 -->
                        <div class="statistics">
                            <!-- 左侧列表清单及颜色选择 -->
                            <div class="statistics_left" v-if="statistics">
                                <div @click="getDialogStemporary">
                                    <i class="el-icon-s-fold" style="cursor:pointer" />
                                    <span class="Lefts">列表清单</span>

                                </div>
                                <!-- 填充表格不同颜色的内容 -->
                                <slot name="statistics_color"></slot>
                            </div>
                            <!-- 右侧功能按钮封装 -->
                            <div class="statistics_right">
                                <!-- 内容通过slot进行以填充 -->
                                <slot name="statistics_button">

                                </slot>
                            </div>
                        </div>
                        <!-- 统计信息 -->
                        <div class="statistics_message" v-if="statisticsMessage">
                            <div style="display: flex;">
                                <div class="shu"></div>
                                <div class="Lefts">统计信息</div>
                            </div>
                            <div>
                                <slot name="statistics_message"></slot>
                            </div>
                        </div>
                    </div>
                    <!-- 表格组件 -->
                    <div :style="{ width: '100%', height: newheight + 'px' }">
                        <el-table :data="tableData" :height="newheight - 32" border
                            @selection-change="handleSelectionChange" id="out-table" @row-click="rowClick"
                            :row-class-name="rowClassName" ref="showtable">
                            <el-table-column type="expand" v-if="ifexpand">
                                <template slot-scope="props">
                                    <div style="width: 100%;min-height: 50px;" class="sbtable">
                                        <el-table :data="props.row.catalogLevelTowList" style="width: 100%"
                                            row-key="catalogLevelId" :load="load" lazy border>
                                            <el-table-column prop="sort" label="排序" align="center">
                                                <template slot-scope="scope">
                                                    <el-input-number v-model="scope.row.sort"
                                                        @blur="blur($event, scope.row)" size="mini"
                                                        :min="0"></el-input-number>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="date" label="操作" align="center">
                                                <template slot-scope="scope">
                                                    <el-button type="text" size="mini" @click="newedit(scope.row)">
                                                        修改
                                                    </el-button>
                                                    <el-button type="text" size="mini" @click="newdelete(scope.row)"
                                                        style="color: red;">
                                                        删除
                                                    </el-button>
                                                </template>
                                            </el-table-column>

                                            <el-table-column prop="catalogLevelName" label="二级类目" align="center">

                                            </el-table-column>
                                            <el-table-column prop="catalogLevelContent" label="类目详情" align="center">
                                                <template slot-scope="scope">
                                                    <el-tooltip class="item" effect="dark"
                                                        :content="scope.row.catalogLevelContent" placement="top-start">
                                                        <div style="cursor:pointer">
                                                            {{
                                                                scope.row.catalogLevelContent.length > 20 ?
                                                                scope.row.catalogLevelContent.substr(0, 20) + '...' :
                                                                scope.row.catalogLevelContent }}
                                                        </div>
                                                    </el-tooltip>


                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </template>


                            </el-table-column>
                            <el-table-column type="index" width="50" v-if="tableIndex">
                            </el-table-column>
                            <el-table-column type="selection" width="55" align="center" v-if="tableCheckbox">
                            </el-table-column>
                            <el-table-column label="操作" align="center" v-if="showoperation" width="150">
                                <template slot-scope="scope">
                                    <div>
                                        <slot name="camera" :newdata="scope.row"></slot>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :prop="item.value" :label="item.label" align="center" :width="item.width"
                                v-for="item in newclums" v-if="item.Isshow"
                                :show-overflow-tooltip="item.showOverflowTooltip">
                                <template slot-scope="scope">
                                    <div>
                                        <slot v-if="item.vals" name="tabular"
                                            :data="Object.assign(scope.row, { name: item.value })">
                                        </slot>
                                        <span v-else>
                                            {{ scope.row[item.value] }}
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                        <!-- 分页 -->
                        <div class="pagation">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </div>
                    </div>


                </div>

            </div>
            <div v-else>
                <slot name="company">

                </slot>
            </div>

        </div>
        <!-- 右侧功能页面 -->
        <!-- 列表清单功能封装 -->
        <SgDialog title="列表清单设置" size="600px" :dialog="listDialog" @handleClose="listDialog = false">
            <div slot="out">
                <div class="draggle">
                    <el-table :data="changeclums" :fit="true" style="cursor:pointer" @select-all="selectAll"
                        @select="select" ref="tabledata">
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column type="index" width="75" label="序号" align="center" v-if="isChangeIndex">
                        </el-table-column>
                        <el-table-column label="列名" align="center">
                            <template slot-scope="scope">
                                <div>
                                    {{ scope.row.label }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="拖拽调整顺序" align="center">
                            <template slot-scope="scope">
                                <div>
                                    <i class="el-icon-d-caret"></i>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </SgDialog>
    </div>
</template>
<script>
import SgDialog from '@/components/Dialog'
import Sortable from 'sortablejs'
export default {
    components: {
        SgDialog,
    },
    props: {
        //表格列
        clums: {
            type: Array,
            default: () => {
                return []
            }
        },
        //表格操作按钮
        operation: {
            type: Array,
            default: () => {
                return []
            }
        },
        //是否显示树形文件夹
        isShowfile: {
            type: Boolean,
            default: () => {
                return 'false'
            }
        },
        //表格数据
        tableData: {
            type: Array,
            default: () => {
                return []
            }
        },
        //表格数据总条数
        total: {
            type: Number,
            default: () => {
                return 0
            }
        },
        //是否显示默认组件，true为显示默认组件，否则显示自定义组件
        showDefault: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        //是否显示表格操作按钮
        showoperation: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        //是否显示表格索引
        tableIndex: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        //是否显示表格复选框
        tableCheckbox: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        //表格颜色设置
        rowClassName: {
            type: Function
        },
        //封装的隐藏搜索内容的功能
        Imgchange: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        //刷新表格索引
        isChangeIndex: {
            type: Boolean,
            default: () => {
                return true;
            }
        },
        //缓存列表清单数据类型别名
        typeVuex: {
            type: String,
            default: () => {
                return ''
            }
        },
        //是否显示统计
        statisticsMessage: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        //是否显示列表清单
        statistics: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        //是否展开节点
        ifexpand: {
            type: Boolean,
            default: () => {
                return false
            }
        },
      //控住表格高度
      emitWidth:{
        type: String,
        default: () => {
          return '250px'
        }
      }

    },
    watch: {
        //监听deptId改变
        deptId(newV) {
            this.$emit('changeDeptId', newV)
        },
      //监听左侧树宽度
      emitWidth:{
          handler(newV){
            if(newV=='0px'){
              this.RNwidth='calc(100% - 0px)'
            }else{
              this.RNwidth='calc(100% - 250px)'
            }
            this.Nwidth=newV

          },
        deep:true,
      }
    },
    computed: {
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId;
            }
        }
    },
    created() {

        let h = window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;//获取可视区域高度
        this.height = (h - 132) + 'px';//利用可视区域高度减去头部的高度来获取可以书写页面的总高度
        this.Nheight = (h - 164) + 'px'//利用可视区域高度减去头部高度以及底部分页高度来设置表格的响应高度
        //判断是否存在头部内容，存在执行否则不执行
        this.$nextTick(function () {
            if (document.querySelector('.Top') !== null) {
                let T = parseInt(window.getComputedStyle(document.querySelector('.Top'), null).height);
                this.newheight = h - 137 - T
            }
        })

        //树形数据的加载和填充
        this.deptId = this.$store.getters.departmentId
        this.$api.dept.deptList({ status: '0' }, 'get').then(res => {
            if (res) {
                this.deptOptions = this.handleTree(res.data, 'deptId')
            }
        })
        //将数据进行克隆防止数据修改污染原数据
        //此处需要一个存储本地数据的方法，刚开始就读取，有就直接使用没有就直接获取引用进来的(主要为clums表格的每行)  
        this.newclums = this.deepClone(this.clums);
        this.changeclums = this.deepClone(this.clums);
        this.newclums.forEach(value => {
            value.Isshow = true
        })
        this.changeclums.forEach(value => {
            value.Isshow = true
        })
        console.log(this.$store.getters.rembertable, 'asdasd')
        if (this.$store.getters.rembertable[this.typeVuex] == undefined || this.$store.getters.rembertable[this.typeVuex] == null) {
            this.$store.dispatch('settabledata', {
                data: [],
                name: this.typeVuex
            });
        } else {
            if (this.$store.getters.rembertable[this.typeVuex].length !== 0) {
                this.newclums = this.$store.getters.rembertable[this.typeVuex];
            }
        }
    },
    mounted() {
        let that = this;
        //将该页面设为不可粘贴和复制
        // document.oncontextmenu = new Function("event.returnValue=false");
        // document.onselectstart = new Function("event.returnValue=false");
        //获取表格内容的高度
        setTimeout(() => {
            if (document.querySelector('.el-table__body-wrapper')) {
                that.warpperHeight = parseInt(window.getComputedStyle(document.querySelector('.el-table__body-wrapper'), null).height) + 8
            }

        }, 80)
    },
    methods: {
        blur(e, row) {
            this.$emit('changeIndexlist', e.target.value, row)
        },
        load(tree, treeNode, resolve) {
            setTimeout(() => {
                resolve([
                    {}
                ])
            })
        },
        newedit(row) {
            this.$emit('delver', row)
        },
        newdelete(row) {
            this.$emit('delveredit', row)
        },
        //展开行触发方法
        expandChange(row, rows) {
            const isExpend = rows.some(r => r.id === row.id)
            if (isExpend) {
                let that = this
                this.$emit('expandChangelist', row.categoryId)
                // setTimeout(() => {
                //     that.ifprops=true;
                //     that.$refs.showtable.loadData();
                //     that.$forceUpdate();
                // },2000);

            }


        },
        //取两个数组不同值
        getArrDifference(array2, array1) {
            var result = [];
            for (var i = 0; i < array2.length; i++) {
                var obj = array2[i];
                var num = obj.label;
                var flag = false;
                for (var j = 0; j < array1.length; j++) {
                    var aj = array1[j];
                    var n = aj.label;
                    if (n == num) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    result.push(obj);
                }
            }
            return result;
        },
        //选择复选框触发的回调
        select(selection, row) {
            let that = this;
            let flag = false;
            let Index = 0;
            this.newclums = this.deepClone(this.clums);
            selection.forEach(value => {
                if (value.label == row.label) {
                    flag = true
                } else {
                    flag = false
                }
            })
            this.clums.forEach((value, index) => {
                if (value.label == row.label) {
                    Index = index
                }
            })
            if (flag) {
                this.newclums[Index].Isshow = true
            } else {
                this.newclums = this.deepClone(this.clums);
                this.newclums[Index].Isshow = false;
            }
            this.$store.dispatch('settabledata', {
                data: this.newclums,
                name: this.typeVuex
            });
            setTimeout(() => {
                document.querySelector('.el-table__body-wrapper').style.height = that.warpperHeight + 'px'
            }, 80);
        },
        //勾选全部复选框触发的回调
        selectAll(selection) {
            let that = this;
            this.newclums = this.deepClone(this.clums);
            if (selection.length == 0) {
                this.$store.dispatch('settabledata', {
                    data: [],
                    name: this.typeVuex
                })
                this.newclums.forEach(value => {
                    value.Isshow = false
                })
            }
            if (selection.length == this.clums.length) {
                selection.forEach(value => {
                    value.Isshow = true;
                })
                this.$store.dispatch('settabledata',
                    {
                        data: selection,
                        name: this.typeVuex
                    }
                )
                this.newclums.forEach(value => {
                    value.Isshow = true
                })
            }
            setTimeout(() => {
                document.querySelector('.el-table__body-wrapper').style.height = that.warpperHeight + 'px'
            }, 80);
        },
        //拖拽逻辑实现
        rowDrop() {
            //获取拖拽对象
            const tbody = document.querySelector('.draggle .el-table__body-wrapper tbody');
            const _this = this
            Sortable.create(tbody, {
                group: {
                    name: "words",
                    pull: true,
                    put: true
                },
                animation: 150, //动画参数
                onAdd: function (evt) {//拖拽时候添加有新的节点的时候发生该事件

                },
                onUpdate: function (evt) {//拖拽更新节点位置发生该事件

                },
                onRemove: function (evt) {//删除拖拽节点的时候触发该事件

                },
                onStart: function (evt) {//开始拖拽出发该函数

                },
                onSort: function (evt) {//发生排序发生该事件
                },
                onEnd({ newIndex, oldIndex }) { //拖拽结束的回调
                    let data = _this.newclums.splice(oldIndex, 1);
                    _this.newclums.splice(newIndex, 0, data[0]);
                    // //触发方法修改原表格行数据
                    _this.$emit('changeIndex', oldIndex, newIndex);
                    _this.$store.dispatch('settabledata',
                        {
                            data: _this.newclums,
                            name: _this.typeVuex
                        }
                    );
                    setTimeout(() => {
                        let span = document.querySelectorAll('.draggle .el-table__body tbody tr');
                        for (let i = 0; i < span.length; i++) {
                            span[i].children[1].children[0].children[0].innerHTML = i + 1
                        }
                        document.querySelector('.el-table__body-wrapper').style.height = _this.warpperHeight + 'px'
                    }, 80);
                }
            })
        },
        //列拖拽逻辑
        columnDrop() {
            //获取拖拽对象
            const wrapperTr = document.querySelector('.draggle .el-table__header-wrapper tr')
            this.sortable = Sortable.create(wrapperTr, {
                animation: 180,
                delay: 0,
                onEnd: evt => {
                }
            })
        },
        //深拷贝
        deepClone(obj) {
            // 根据类型制造一个新的数组或对象 => 指向一个新的空间
            // 由于数组的typeof也是'object',所以用Array.isArray(obj)
            var new_obj = Array.isArray(obj) ? [] : {};
            // 首先判断obj的类型
            // 普通类型
            if (typeof obj != 'object') {
                // 这里不能直接返回obj,不然就是浅拷贝的性质
                return new_obj = obj
            }
            //引用类型
            //数组
            if (obj instanceof Array) {
                for (let i = 0; i < obj.length; i++) {
                    new_obj[i] = obj[i];
                    if (typeof new_obj[i] == 'object') {
                        this.deepClone(new_obj[i])
                    }
                }
            } else { //对象
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        // 对象中的数组和对象
                        if (typeof obj[key] == 'object') {
                            new_obj[key] = this.deepClone(obj[key]);
                        } else {//对象中没有引用类型
                            new_obj[key] = obj[key]
                        }
                    }
                }
            }
            return new_obj;
        },
        //列表清单逻辑封装
        getDialogStemporary() {
            this.listDialog = true;
            let that = this;
            this.changeclums = this.deepClone(this.newclums);
            setTimeout(function () {
                that.rowDrop();
                that.columnDrop();
                that.changeclums.forEach(value => {
                    if (value.Isshow !== false) {
                        that.$refs.tabledata.toggleRowSelection(value, true)
                    }
                })
            }, 80)

        },
        //移出隐藏图标触发事件
        mouseleave(e) {
            setTimeout(() => {
                e.target.style.right = '-60px';
                e.target.style.transition = 'all 1s'
            }, 200);
        },
        //移入隐藏图标触发事件
        mouseover(e) {
            setTimeout(() => {
                e.target.style.right = '0px';
                e.target.style.transition = 'all 1s'
            }, 200);

        },
        //点击隐藏图标触发的回调
        changeImg() {
            let that = this;
            this.$emit('changeImg', !this.Imgchange);
            setTimeout(() => {
                let T = parseInt(window.getComputedStyle(document.querySelector('.Top'), null).height);
                that.newheight = parseInt(that.height) - 5 - T
            }, 1);

        },
        //点击复选框选择数据
        handleSelectionChange(data) {
            if (data.length == 0) {
                this.$emit('handleSelectionChang', []);
            } else {

                this.$emit('handleSelectionChang', data);
            }

        },
        //点击某一行选择数据
        rowClick(data) {
            this.$emit('rowClick', data);
            this.$refs.showtable.clearSelection();
            this.$refs.showtable.toggleRowSelection(data);
        },
        //点击树形获取数据
        handleNodeClick(data, item, id) {
            this.$emit('changeCompay', data.deptId, data)
        },
        //点击选择每页展示条数
        handleSizeChange(e) {
            this.$emit('handleSizeChange', e)
        },
        //点击底部分页选择页码
        handleCurrentChange(e) {
            this.$emit('handleCurrentChange', e)
        },


    },
    data() {
        return {
            tableDataprops: [],
            Rotate: 'rotate(-180deg)',
            Nwidth: '250px',
            RNwidth: 'calc(100% - 250px)',
            ifprops: false,
            Nleft: '225px',
            currentPage4: 1,//无用(后期可能会用到)
            defaultProps: {
                children: 'children',
                label: 'deptName'
            },//树改变默认项
            deptOptions: [],//树形列表数据
            pageNum: 1,//每页(哪一页)
            pageSize: 20,//每页条数(默认)
            height: "",//左侧树形结构数据高度自适应,
            newheight: '1',//右侧表格自适应
            Nheight: "",//左侧树高度自适应
            listDialog: false,//列表清单弹窗
            newclums: [],//深拷贝出来的数据
            warpperHeight: 0,//获取表格的内容高度，因为在勾选所有列数据全部消失的时候会出现一个bug
            changeclums: [],//改变值的存储
        }
    }
}
</script>
<style scoped lang="scss">
::v-deep .sbtable tr td {
    font-size: 12px !important;
}

::v-deep .sbtable .el-table__header-wrapper tr th {
    padding: 0 !important;
    font-family: 'Microsoft YaHei',
}

.Lefts {
    margin-left: 7px;
}

.shu {
    width: 6px;
    height: 20px;
    background-color: #1abc9c;
    margin-left: 16px;
}

.statistics_message {
    width: 100%;
    min-height: 20px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.statistics {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding: 16px;
    background-color: #f5eae4;
    margin-top: 10px;

    .statistics_left {
        display: flex;
    }

    div {
        cursor: pointer;
    }
}

.hidemove {
    width: 80px;
    height: 30px;
    position: absolute;
    right: -60px;
    top: 0;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

* {
    /* padding: 4px;
    margin: 0; */
    box-sizing: border-box;
}

::v-deep .el-tree-node.is-current>.el-tree-node__content {
    background-color: #1abc9c !important;
    color: #fff
}

::v-deep .cell span {
    font-size: 12px !important;
}

::v-deep .el-table__header th {
    padding: 3px;
}

* {
    font-size: 14px;
}

.Top {
    margin-bottom: 5px;
    position: relative;
    min-height: 40px;
}

.ORDER_CHILDREN {
    margin-top: 10px;
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    min-height: 40px;
    align-items: center;
}

.ORDER_CHILDREN .order-children {
    width: 130px;
    min-height: 40px;
    display: flex;
    align-items: center;
}

::v-deep .el-table__row td {
    padding: 3px;
}

.pagation {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid black; */
}

::v-deep .el-pager li.active {
    background-color: rgb(26, 188, 156) !important;
    color: #fff;
}

.Left {
    margin-left: 15px;
}

.table {
    width: calc(100%);
    height: 740px;
    position: relative;
    overflow-x: scroll;
}

.physical_table {
    width: 100%;
    /* border: 1px solid black; */
    overflow: hidden;

}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 8px;
    z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 20px;
    background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px #999; */
    background: transparent;
    /* border-radius: 2px; */
}

::v-deep .table::-webkit-scrollbar {
    height: 12px;
    z-index: 999999;
}

::v-deep .table::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 20px;
    background: #dcdcdc;
}

::v-deep .table::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px #999; */
    background: transparent;
    /* border-radius: 2px; */
}

.order_children {
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    cursor: pointer;
    border-radius: 4px;
}

.physical {
    width: 100%;
    min-height: 40px;
    /* height: 200px; */
    background-color: #fff;
    overflow: hidden;
}

.physical_top {
    width: 100%;
    height: 50px;
    border: 1px solid red
}</style>