<template>
    <div>
        <!-- <div class="nurse_top">
            <div>
                <el-button type="text" size="mini" @click="proofread" class="left">打印</el-button>
                <el-button type="text" size="mini" @click="proofreads" class="left">预览</el-button>
            </div>

        </div> -->
        <div class="nurse_top" style="position: relative;">
     <div style="position: absolute;right:50px;top:3px">
        <el-button type="primary"  size="mini" @click="proofread" class="" style="height: 25px;line-height: 10px;">打印</el-button>
                <el-button type="primary" size="mini" @click="proofreads" class="" style="height: 25px;line-height: 10px;">预览</el-button>
    </div>
    </div>

        <div class="nurse_contain" style="margin-top: 4px;">
            <div class="nurse_left">
                <div class="nurse_search">
                    <label for="" class="" style="margin-left: 7px;">检索：</label>
                    <el-input placeholder="请输入姓名" size="mini" style="width: 160px" v-model="Name"></el-input>
                    <el-button style="width:75px;height: 30px;margin-left: 10px;" icon="el-icon-search" type="primary" plain size="mini" @click="search">搜索</el-button>
                </div>
                <div class="patient_list">
                    <div style="width: 300px;">
                        <el-table :data="Nurse_left" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @row-click='selechColum' :height="heightprint" highlight-current-row ref="tablelist">
                            <el-table-column prop="bedNumber" label="床号" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="customerName" label="姓名" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="wardNo" label="病区" width="100" align="center"> </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <!-- //右边模块 -->
            <div class="nurse_right">
                <div class="nurse_right_top" style="background-color: antiquewhite;">
                    <div style="height: 10px;"></div>
                    <div style="display: flex;" >
                            <div class="topContain"> 姓名：{{ customerNameList.customerName }}</div>
                            <div class="topContain"> 性别(年龄)：{{ customerNameList.customAge }}</div>
                            <div class="topContain"> 可用押金：<span>{{ customerNameList.residualDeposit }}</span></div>
                            <div class="topContain"> 病区床位：<span>{{ customerNameList.bedNumber}}</span></div>
                            <!-- 姓名：<span>{{ customerNameList.customerName }}</span>&emsp;&emsp;性别(年龄)：<span>{{
                            customerNameList.customAge }}</span>&emsp;&emsp;
                            病人性质：<span>李磊</span>
                            可用押金：<span>{{ customerNameList.residualDeposit
                            }}</span>&emsp;&emsp;
                            住院号：<span>李磊</span>&emsp;&emsp;
                            病区床位：<span>{{ customerNameList.wardNo }}</span> -->
                        </div>
                        <div style="height: 10px;"></div>
                        <div style="display: flex;">
                            <div class="topContain"> 科室：<span>{{ customerNameList.departmentName }}</span></div>
                            <div class="topContain"> 主治医生：<span>{{ customerNameList.doctorName }}</span></div>
                            <div class="topContain"> 护士：<span>{{ customerNameList.nursingPersonnel }}</span></div>
                            <div class="topContain" style="width: 220px;">入院时间：<span>{{ customerNameList.hospitalTime }}</span></div>
                            <div class="topContain"> 备注：<span>{{ customerNameList.remark }}</span></div>
                            <!-- <div class="topContain"> 押金警示：<span></span></div> -->


                            <!-- 科室：<span>暂无</span>&emsp;&emsp;统治医生：<span>暂无</span>&emsp;&emsp;护士：<span>{{
                            customerNameList.nursingPersonnel
                        }}</span>&emsp;&emsp;入院时间：<span>{{ customerNameList.createTime
}}</span>&emsp;&emsp;备注：<span>{{
    customerNameList.remark }}</span>&emsp;&emsp;押金警示：<span>暂无</span> -->

                        </div>
                </div>

                <span style="margin-left:10px">护理单据：</span>
                <el-select filterable v-model="type" placeholder="请选择" size="mini" clearable>
                    <el-option v-for="item in nurseType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                &emsp;&emsp;<el-radio v-model="radio" label="">全部</el-radio>
                <el-radio v-model="radio" label="0">长期</el-radio>
                <el-radio v-model="radio" label="1">临时</el-radio>
                <span>打印状态：</span>
                <el-select filterable v-model="value" placeholder="请选择" size="mini" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" size="mini" style="margin-left: 10px;margin-top:5px" @click="searchList">搜索</el-button>
                <div class="patient_list_right" style="margin-top: 10px;">
                    <div style="width:100%">
                        <el-table :data="tableData" stripe ref="table" :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @select="selCopy" @select-all="selList"
                            @selection-change="handleSelectionChange" @row-click='selechColums'
                             :height="newheight">
                            <el-table-column type="selection" width="55" align="center">
                            </el-table-column>
                            <el-table-column prop="lastCopyTime" label="抄送时间" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="bedNumber" label="床号" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="customerName" label="姓名" width="100" align="center">
                                <template slot-scope="scope">
                                            <div>
                                                <a @click="customerclick(scope.row.id, scope.row)">{{ scope.row.customerName }}</a>
                                            </div>
                                        </template>
                            </el-table-column>
                            <el-table-column prop="itemName" label="医嘱内容" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="materialSpec" label="规格" width="150" align="center">
                            </el-table-column>
                            <el-table-column prop="usageWay" label="用法" width="100" align="center">
                                <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.usageWay=='1'?'口服-外用':scope.row.usageWay=='2'?'水煎内服':scope.row.usageWay=='3'?'皮试':"" }}
                                            </div>
                                        </template>
                            </el-table-column>
                            <el-table-column prop="dosage" label="剂量" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="frequency" label="频次" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="amount" label="数量" width="100" align="center"></el-table-column>
                            <el-table-column prop="doseUnit" label="单位" width="100" align="center"></el-table-column>
                            <el-table-column prop="unit" label="用药单位" width="100" align="center">

                                <template slot-scope="scope">
                                            <div>
                                                {{ methodsUnit(scope.row.unit) }}
                                            </div>
                                        </template>
                            </el-table-column>
               
                            <el-table-column prop="unitPrice" label="实收" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="unitPrice" label="划价仓库" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="printFlag" label="打印状态" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="urgentFlag" label="医嘱对象" width="100" align="center">
                            </el-table-column>
                        </el-table>
                        <!-- 大撒大撒 -->
                    </div>
                </div>
                <vue-easy-print ref="printChargeSheet">
                    <div class="syk" v-show="print1" style="width: 90%;display: flex;justify-content: center;">
                        <div>
                        <div style="width:100%;text-align: center;">
                            <h1 style="font-size: 20px;">{{newmessage}}输液卡打印</h1>
                        </div>
                      
                        <br>
                        <span class='printType'>姓名：{{ Print.customerName }}</span><span
                            class="printTypeRight printType">性别：{{ Print.customSex == 1 ? '女' : '男' }}</span>
                        <span class="printType">病区：{{ Print.wardNo }}</span><span class="printTypeRight printType">床号：{{
                            Print.bedNumber }}</span>
                               <span class='printType'>年龄：{{  Print.customAge}}</span>
                            <br>
                            <br>
                         <table border="1px solid black" style="border-collapse: collapse;margin-left: 50px;" >
                            <thead>
                                <th>药品名称</th>
                                <th>用法</th>
                                <th>给药途径</th>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in PrintList" :key="index">
                                  <td style="width: 250px;" align="center">{{ item.itemName }}</td>
                                  <td style="width: 250px;" align="center">{{ item.frequency }}</td>
                                  <td style="width: 250px;" align="center">{{ item.usageWay }}</td>
                                </tr>
                            </tbody>
                         </table>
                        </div>
                        <!-- <div style="width: 500px;height: 150px;margin-top: 20px;display: flex;"
                            v-for="(item, index) in PrintList" :key="index">
                            <div style="width: 30px;font-size: 20px;">{{ index + '.' }}</div>
                            <div style="width: 110px;font-size: 20px;">{{ item.itemName + '.' }}</div>
                            <div style="width: 20px;font-size: 20px;margin-left: 120px;">{{  item.frequency }}</div>
                            <div style="width: 20px;font-size: 20px;margin-left: 30px;">{{ item.usageWay + '.' }}</div>
                        </div> -->
                    </div>

                    <!-- //瓶贴 -->
                    <div style="width:90%;display: flex;flex-wrap: wrap;" v-show="print2">
                        <div style="width:100%;text-align: center;">
                            <h1 style="font-size: 20px;">{{newmessage}}瓶贴打印</h1>
                        </div>
                        <br>
                        <br>
                <div :style="index>=0?'width: 270px;height: 150px;border: 1px solid black;margin-left:100px;margin-top:5px':'width: 270px;height: 150px;border: 1px solid black;'" v-for="(item,index) in PrintList " :key="index">
                    <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>姓名：{{ Print.customerName }}</span>  <span>床号：{{
                            Print.bedNumber }}</span>  <span>性别：{{ Print.customSex == 1 ? '女' : '男' }}</span>
                            <span style="">年龄：{{  item.customAge}}</span></div>
                              <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>医嘱：{{ item.itemName }}</span></div>
                              <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>用法：{{ item.usageWay }}</span></div>
                             </div>
                          
              </div>
                    
                    <!-- //临时医嘱 -->
                    <div v-for="(item,index) in PrintList " style="margin-top: 40px;" v-show="print3">
                        <div><span>科室：{{ item.departmentName }}</span><span style="margin-left: 30px;">床号：{{ item.bedNumber }}</span><span style="margin-left: 30px;">姓名：{{ item.customerName }}</span><span style="margin-left: 30px;">年龄：{{  item.customAge}}</span></div>
                        <table border style="border-collapse: collapse" width="600" class="tds">
                            <tbody>
                                <tr align="center">
                                    <td rowspan="2">转抄日期时间</td>
                                    <td rowspan="2">转抄者</td>
                                    <td rowspan="2">医嘱内容</td>
                                    <td rowspan="2">组别</td>
                                    <td rowspan="2">频次滴速</td>
                                    <td rowspan="2">签名</td>
                                    <td colspan="7">执行日期</td>
                                </tr>
                                <tr align="center">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr align="center">
                                    <td rowspan="2">{{ item.copyPersonTime }}</td>
                                    <td rowspan="2">{{ item.copyPersonName }}</td>
                                    <td rowspan="2">{{ item.itemName}}</td>
                                    <td rowspan="2">1</td>
                                    <td>{{ item.frequency }}</td>
                                    <td>时间</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr align="center">
                                    <td>{{ item.frequency }}</td>
                                    <td>执行人</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- //长期医嘱 -->
                    <!-- <div v-for="(item,index) in PrintList " style="margin-top: 20px;">
                        <div><span>科室：{{ item.departmentName }}</span><span style="margin-left: 30px;">床号：{{ item.bedNumber }}</span><span style="margin-left: 30px;">姓名：{{ item.customerName }}</span><span style="margin-left: 30px;">年龄：{{  item.customerAge}}</span></div>
                        <table border style="border-collapse: collapse" width="600" class="tds">
                            <tbody>
                                <tr align="center">
                                    <td rowspan="2">转抄日期时间</td>
                                    <td rowspan="2">转抄者</td>
                                    <td rowspan="2">医嘱内容</td>
                                    <td rowspan="2">组别</td>
                                    <td rowspan="2">频次滴速</td>
                                    <td rowspan="2">签名</td>
                                    <td colspan="7">执行日期</td>
                                </tr>
                                <tr align="center">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr align="center">
                                    <td rowspan="2">{{ item.copyPersonTime }}</td>
                                    <td rowspan="2">{{ item.copyPersonName }}</td>
                                    <td rowspan="2">{{ item.itemName}}</td>
                                    <td rowspan="2">1</td>
                                    <td>{{ item.frequency }}</td>
                                    <td>时间</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr align="center">
                                    <td>{{ item.frequency }}</td>
                                    <td>执行人</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div> -->

                    <div v-for="(item, index) in PrintList " :key="index" v-show="print4">
                        <div style="display: flex;justify-content: space-around;"><span>姓名：{{ item.customerName }}</span>
                            <span>床号：{{ item.bedNumber }}</span> <span>房间号：{{ item.wardNo }}</span></div>

                        <br>
                        <div style="display: flex;justify-content: space-around;"><span>医嘱：{{ item.itenName }}</span></div>
                        <div style="display: flex;justify-content: space-around;"><span>20ml：</span><span>剂量：{{
                            item.materialSpec }}</span></div>
                        <div style="display: flex;justify-content: space-around;"> <span>sig：{{ item.usageWay }}</span>
                        </div>
                        <br>

                    </div>
                </vue-easy-print>


                <!-- //bottom -->
            </div>
        </div>
        <el-dialog title="" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
            <div style="width:100%;height: 500px;overflow: scroll;">
                <div class="syk" v-show="print1">
                        <span class='printType' style="font-size: 16px;">姓名：{{ Print.customerName }}</span><span
                            class="printTypeRight printType" style="font-size: 16px;margin-left: 20px;">性别：{{ Print.customSex == 1 ? '女' : '男' }}</span>
                        <span class="printType" style="font-size: 16px;">病区：{{ Print.wardNo }}</span><span style="font-size: 16px;margin-left: 20px;" class="printTypeRight printType">床号：{{
                            Print.bedNumber }}</span>
                             <span class='printType' style="font-size: 16px;margin-left: 10px;">年龄：{{  Print.customAge}}</span>
                            <!-- <span style="margin-left: 10px;" class="printType" >年龄：{{  Print.customAge}}</span> -->
                            <!-- <span>年龄：{{  }}</span> -->
                            <br><br>
                        <table border="1px solid black" style="border-collapse: collapse;margin-left: 50px;" >
                            <thead>
                                <th>药品名称</th>
                                <th>用法</th>
                                <th>给药途径</th>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in PrintList" :key="index">
                                  <td style="width: 200px;" align="center">{{ item.itemName }}</td>
                                  <td style="width: 200px;" align="center">{{ item.frequency }}</td>
                                  <td style="width: 200px;" align="center">{{ item.usageWay }}</td>
                                </tr>
                            </tbody>
                         </table>
                    </div>
                    <div style="width:98%;display: flex;flex-wrap: wrap;" v-show="print2">
                <div :style="index>=0?'width: 350px;height: 150px;border: 1px solid #666;margin-left:50px;margin-top:5px':'width: 350px;height: 150px;border: 1px solid #666;'" v-for="(item,index) in PrintList " :key="index">
                    <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>姓名：{{ Print.customerName }}</span>  <span>床号：{{
                            Print.bedNumber }}</span>  <span>性别：{{ Print.customSex == 1 ? '女' : '男' }}</span>
                              <span style="">年龄：{{  item.customAge}}</span></div>
                              <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>医嘱：{{ item.itemName }}</span></div>
                              <div style="margin-top: 20px;height: 30px;display: flex;justify-content: space-around;"> <span>用法：{{ item.usageWay }}</span></div>
                             </div>
              </div>



              <div v-for="(item,index) in PrintList " style="margin-top: 20px;" v-show="print3">
                        <div><span>科室：{{ item.departmentName }}</span><span style="margin-left: 30px;">床号：{{ item.bedNumber }}</span><span style="margin-left: 30px;">姓名：{{ item.customerName }}</span><span style="margin-left: 30px;">年龄：{{  item.customerAge}}</span></div>
                        <table border style="border-collapse: collapse" width="600" class="tds">
                            <tbody>
                                <tr align="center">
                                    <td rowspan="2">转抄日期时间</td>
                                    <td rowspan="2">转抄者</td>
                                    <td rowspan="2">医嘱内容</td>
                                    <td rowspan="2">组别</td>
                                    <td rowspan="2">频次滴速</td>
                                    <td rowspan="2">签名</td>
                                    <td colspan="7">执行日期</td>
                                </tr>
                                <tr align="center">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr align="center">
                                    <td rowspan="2">{{ item.copyPersonTime }}</td>
                                    <td rowspan="2">{{ item.copyPersonName }}</td>
                                    <td rowspan="2">{{ item.itemName}}</td>
                                    <td rowspan="2">1</td>
                                    <td>{{ item.frequency }}</td>
                                    <td>时间</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr align="center">
                                    <td>{{ item.frequency }}</td>
                                    <td>执行人</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>



                    
                    <div v-for="(item, index) in PrintList " :key="index" v-show="print4">
                        <div style="display: flex;justify-content: space-around;"><span>姓名：{{ item.customerName }}</span>
                            <span>床号：{{ item.bedNumber }}</span> <span>房间号：{{ item.wardNo }}</span></div>

                        <br>
                        <div style="display: flex;justify-content: space-around;"><span>医嘱：{{ item.itenName }}</span></div>
                        <div style="display: flex;justify-content: space-around;"><span>20ml：</span><span>剂量：{{
                            item.materialSpec }}</span></div>
                        <div style="display: flex;justify-content: space-around;"> <span>sig：{{ item.usageWay }}</span>
                        </div>
                        <br>

                    </div>
                <!-- <div>
                    <span class='printType'>姓名：{{ Print.customerName }}</span><span class="printTypeRight printType">性别：{{
                        Print.customSex == 1 ? '女' : '男' }}</span>
                    <br>
                    <span class="printType">病区：{{ Print.wardNo }}</span><span class="printTypeRight printType">床号：{{
                        Print.bedNumber }}</span>
                    <div style="width: 500px;height: 200px;border: 1px solid black;margin-top: 20px;display: flex;"
                        v-for="(item, index) in [0, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]" :key="index">
                        <div style="width: 30px;font-size: 20px;">{{ item + '.' }}</div>
                        <div style="width: 130px;font-size: 20px;border: 1px solid black;">{{ item + '.' }}</div>
                        <div style="width: 50px;font-size: 20px;margin-left: 120px;">{{ item + '.' }}</div>
                        <div style="width: 50px;font-size: 20px;">{{ item + '.' }}</div>
                    </div>
                </div> -->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import vueEasyPrint from 'vue-easy-print'
export default {
    name: 'proofread',
    components: {
        vueEasyPrint
    },
    data() {
        return {
            PrintList: [],
            newheight:"",
            newmessage:"",
            print1:false,
            print2:false,
            print3:false,
            print4:false,
            dialogVisible: false,
            options: [{
                value: '0',
                label: '未打印'
            }, {
                value: '1',
                label: '已打印'
            }, {
                value: '2',
                label: '已退'
            }],
            nurseType: [
                {
                    value: '1',
                    label: '输液卡 '
                },
                {
                    value: '2',
                    label: '瓶签'
                },
                {
                    value: '3',
                    label: '临时医嘱'
                },
                {
                    value: '4',
                    label: '长期医嘱'
                },
                {
                    value: '5',
                    label: '当天长期医嘱'
                },
                {
                    value: '6',
                    label: '注射卡'
                },
                {
                    value: '7',
                    label: '服药卡'
                }
            ],
            value: '',
            type: '1',
            radio: '',
            coptTime: "",
            value: "",
            valueStatus: "",
            tableData: [],
            Name: "",
            customerNameList: '',
            inHospitalId: "",
            nurseId: "",
            Nurse_left: [],
            Rows: [],
            Print: '',
            methoList:[],
            heightprint:"",



        }
    },
    watch: {
        coptTime(value) {
            console.log(value)

        },
        deptId(val){
            this.deptId=val
            this.search();
        }
    },
    computed:{
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId;
            }
        }
    },
    mounted() {
        this.search();
        this.deptId = this.$store.getters.departmentId;
        let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
              let newstr=str.split('<')[0]
              this.newmessage=newstr;
    },
    created(){
        const data = {
        status: '0',
        deptId: this.deptId
      }
        this.$api.product.productList(data).then(res => {
        if (res) {  
            this.methoList=res.rows
             

            }})
            let h= window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;//获取可视区域高度
            this.newheight=h-270
            this.heightprint=h-208;
    },
    methods: {
        methodsUnit(val){
           let strName=''
          this.methoList.forEach(value=>{
                if(val==value.productUnitId){
                    strName=value.productUnitName
                }
             })
                 return strName
    

        },
        customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus,  }})
    },
        selList(row){
      this.Rows=row;
    },
    selechColums(row) {
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(row)
    },
    handleSelectionChange(row) {
      this.Rows = row;
    },
        selechColum(row, column, event) {
            let that = this;
            this.inHospitalId = row.inHospitalId
            let ids = {
                id: row.id,
                // deptId: this.deptId
            }
            this.$api.confinementRoom.nurseRightTop(ids).then(res => {
                this.customerNameList = res.data;
                const datas= {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.user.getUserList(datas).then(res => {
                if (res) {
                    res.data.forEach(item => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    res.data.forEach(item => {
                        // this.zerennurse.push(item)
                        if (item.postCode == 'zerennurse') {
                          if(item.userId==this.customerNameList.nursingPersonnel){
                            this.customerNameList.nursingPersonnel=item.nickName
                          }
                        
                        }
                    }) // 责任护士
                }
            })
                let data = { inHospitalId: this.inHospitalId, printFlag: this.value, periodicType: this.radio, type: this.type, deptId:this.deptId };
                this.$api.confinementRoom.getNursingPrintList(data).then(res => {
                    let Data = [];
                    res.rows.forEach(value => {
                        value.forEach(values => {
                            Data.push(values)
                        })
                    });
                    this.tableData = Data
                })
            });
        },
        handleClose() {
         this.dialogVisible=false
        },
        searchList() {
            let data = { inHospitalId: this.inHospitalId, printFlag: this.value, periodicType: this.radio, type: this.type, deptId:this.deptId };
            this.$api.confinementRoom.getNursingPrintList(data).then(res => {
                let Data = [];
                res.rows.forEach(value => {
                    value.forEach(values => {
                        Data.push(values)
                    })
                });
                this.tableData = Data
            })
        },
        selCopy(selection, row) {
            this.Rows.push(row);
        },
        proofreads() {
            this.getprint();
              if(this.type==1){
                
                this.print1=true
              }
              if(this.type==2){
                this.print2=true
              }
              if(this.type==3||this.type==4||this.type==5){
                this.print3=true
                
              }
              if(this.type==7){
                this.print4=true
              }
            if (this.Rows.length == 0) {
                this.$message.warning("请至少选择一条打印数据");
                return
            }
            let arr = ''
            this.Rows.forEach((value, index) => {
                if (index == this.Rows.length - 1) {
                    arr += value.copyRecordId
                } else {
                    arr += value.copyRecordId + ','
                }
            })
            let data = {
                copyRecordIds: arr,
                type: this.type
            }
            this.$api.confinementRoom.getInfusionCard(data).then(res => {
                this.Print = res.data;
                this.dialogVisible = true
                this.PrintList = []
                res.data.resultDto.forEach(value => {
                    value.forEach(newvalue => {
                        this.PrintList.push(newvalue)
                    })
                })

                // setTimeout(() => {
                //     this.$refs.printChargeSheet.print();
                // })


            })

            // if (this.Rows.length == 0) {
            //     this.$message.warning("请至少选择一条打印数据");
            //     return
            // }
            // let arr = ''
            // this.Rows.forEach((value, index) => {
            //     if (index == this.Rows.length - 1) {
            //         arr += value.copyRecordId
            //     } else {
            //         arr += value.copyRecordId + ','
            //     }
            // })
            // let data = {
            //     copyRecordIds: arr,
            //     type: this.type
            // }
            // this.$api.confinementRoom.getInfusionCard(data).then(res => {
            //     this.Print = res.data;
            //     this.dialogVisible = true

            // })

        },
        newDate(time) {
            var date = new Date(time)
            var y = date.getFullYear()
            var m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m
            var d = date.getDate()
            d = d < 10 ? '0' + d : d
            return y + '-' + m + '-' + d
        },
        proofread() {
            this.getprint();
              if(this.type==1){
                
                this.print1=true
              }
              if(this.type==2){
                this.print2=true
              }
              if(this.type==3||this.type==4||this.type==5){
                this.print3=true
                
              }
              if(this.type==7){
                this.print4=true
              }
            if (this.Rows.length == 0) {
                this.$message.warning("请至少选择一条打印数据");
                return
            }
            let arr = ''
            this.Rows.forEach((value, index) => {
                if (index == this.Rows.length - 1) {
                    arr += value.copyRecordId
                } else {
                    arr += value.copyRecordId + ','
                }
            })
            let data = {
                copyRecordIds: arr,
                type: this.type
            }
            this.$api.confinementRoom.getInfusionCard(data).then(res => {
                this.Print = res.data;
                this.PrintList = []
                res.data.resultDto.forEach(value => {
                    value.forEach(newvalue => {
                        this.PrintList.push(newvalue)
                    })
                })

                setTimeout(() => {
                    this.$refs.printChargeSheet.print();
                })


            })



        },
        getprint(){
            this.print1=false;
            this.print2=false;
            this.print3=false;
            this.print4=false;
        },
        search() {
            let data = {
                customerName: this.Name,
                pageNum: 1,
                pageSize: 20,
                inpatientStatus:'1',
                deptId:this.deptId
            }
            this.$api.confinementRoom.nurseLeft(data).then(res => {
                this.Nurse_left = res.rows;
                if (res.rows.length == 0) {
                    return
                }else{
                    this.$refs.tablelist.setCurrentRow(res.rows[0],true)
                }
                this.inHospitalId = res.rows[0].inHospitalId;
                this.nurseId = res.rows[0].id;
                let ids = {
                    id: this.nurseId
                };
                this.$api.confinementRoom.nurseRightTop(ids).then(res => {
                    this.customerNameList = res.data;
                    const data = {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.user.getUserList(data).then(res => {
                if (res) {
                    res.data.forEach(item => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    res.data.forEach(item => {
                        // this.zerennurse.push(item)
                        if (item.postCode == 'zerennurse') {
                          if(item.userId==this.customerNameList.nursingPersonnel){
                            this.customerNameList.nursingPersonnel=item.nickName
                          }
                        
                        }
                    }) // 责任护士
                }
            })
                });
                let data = { inHospitalId: this.inHospitalId, printFlag: this.value, periodicType: this.radio, type: this.type, deptId:this.deptId };
                this.$api.confinementRoom.getNursingPrintList(data).then(res => {
                    let Data = [];
                    res.rows.forEach(value => {
                        value.forEach(values => {
                            Data.push(values)
                        })
                    });
                    this.tableData = Data
                })

            })
        }
    },
}
</script>
<style scoped lang="scss">
::v-deep .patient_list .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}

::v-deep .patient_list_right .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}
* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}

.tds td {

    width: 130px;
    height: 30px;

}
.patient_list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
  border-radius: 10px;
  background: transparent;
}
.patient_list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 7px;
}
.patient_list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
  background: #dcdcdc;
}
.printType {
    font-size: 14px;
    margin-left: 50px;
}

.printTypeRight {
    margin-left: 150px;
}

.drug {
    width: 1500px;
    height: 80px;
    display: flex;
}

.patient_list_right_bottom {
    width: 1100px;
    height: 250px;
    // border: 1px solid red;
    overflow: scroll;
    // background-color: red;
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
.patient_list_right {
    width: calc(100%);
}

.el-select {
    width: 200px !important;

    .el-input__inner {
        height: 30px !important;
    }
}

.nurse_right_center span {
    margin-right: 10px;
    cursor: pointer;
}

.nurse_right_top {
    height: 60px;
}

.nurse_right {
    width: calc(100% - 320px);
    height: calc(100% - 0px);
    // border: 1px solid #999;
    margin-left: 5px;
}

.nurse_right::-webkit-scrollbar-button {
    display: none !important;
}
.topContain {
    width: 150px;
    height: 20px;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.patient_list {
    width: 100%;
    height: calc(100% - 10px);
    position: relative;
    overflow: scroll ;
    margin-top: 10px;
    overflow-x: hidden;

}

.nurse_left {
    width: 300px;
    height: 100%;
    // border: 1px solid #999;

}

.nurse_contain {
    position: fixed;
    width: 100%;
    height: calc(100% - 175px);
    display: flex;
}

.nurse_top {
    height: 30px;
    line-height: 30px;
}

.nurse_top span {
    margin-right: 10px;
    cursor: pointer;
}

.left {
    margin-left: 10px;

}</style>