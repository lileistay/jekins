<template>
    <div>
        <Tree :clums="clums" :operation="operation" :isShowfile="isShowfile" :tableData="tableData"
            :showDefault="showDefault" @jurisdiction="newjurisdiction" @changeCompay="changeCompay" @rowClick="rowClick"
            @handleSelectionChang="handleSelectionChang" @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange" @changeDeptId="changeDeptId">
            <!-- 操作按钮 -->
            <template v-slot:button>
                <div>
                    <span class="Left">快捷操作</span>
                    <el-button type="success" size="mini" style="margin-left:20px" icon="el-icon-plus">新增商品</el-button>
                </div>
            </template>
            <!-- 自定义内容填充 -->
            <template v-slot:tabular="{ data }">
                <div v-if="data.name == 'projectName'">
                    <a href="">sdadsad</a>
                </div>
                <div v-if="data.name == 'shelfTime'">
                    <a href="">哈哈哈</a>
                </div>
            </template>
            <!-- 操作按钮 -->
            <template v-slot:camera="{ newdata }">
                <!-- <el-button type="text" size="mini" @click="newdelete(newdata)">
                    删除
                </el-button> -->
            </template>
            <!-- 自定义页面 -->
            <template v-slot:company>
                <div style="position: absolute;right: 20px;top:0px;background-color: #fff;height: 50px;">
                    <el-button v-has-permi="['client:companyLabel:add']" type="primary" size="mini"
                        style="position: absolute;right:120px;top:145px;z-index:1000" @click="submit"
                        :loading="submitcompant" v-if="!ifEdit" :disabled="jurisdictions">
                        提交
                    </el-button>
                    <el-button v-has-permi="['client:companyBasicsInfo:edit']" type="primary" size="mini"
                        style="position: absolute;right:120px;top:145px;z-index:1000" @click="submit"
                        :loading="submitcompant" v-if="ifEdit" :disabled="jurisdictions">
                        提交
                    </el-button>
                    <!-- ifEdit -->
                    <el-button type="primary" size="mini" style="position: absolute;right:50px;top:145px;z-index: 1000;"
                        @click="submitback">
                        返回
                    </el-button>
                </div>
                <div style="width:100%;overflow-y: scroll;height: 785px;">
                    <div class="basic_top">
                        <div class="basic">
                            <span class="long"></span> 企业详情
                        </div>
                        <!-- 符合本系统写法 -->
                        <div style="display: flex;width: 100%;min-height: 30px;flex-wrap: wrap;margin-left: 80px;">
                            <div v-for="(items, indexs) in enterprise" :key="indexs + 100"
                                :style="{ position: 'relative', display: 'flex', fontSize: '14px', marginTop: '15px' }">
                                <div v-show="items.flag" style="display: flex;align-items: center;">
                                    <span :style="{ marginLeft: '20px', color: 'red' }">*</span>
                                    <span :style="{ marginLeft: items.name == '企业规模' ? '0px' : '' }">{{ items.name }}</span>
                                    <img src="@/assets/images/wh.png" alt="" style="display: inline-block;margin-left: 5px;"
                                        :title="items.des" v-show="items.name !== '企业地址' && items.name !== '来院路线'">
                                    <div style="position: relative"  v-if="items.name !== '企业面积' && items.name !== '企业规模'">
                                        <el-input v-model="items.row"
                                                  :style="{ width: '250px', marginLeft: items.name == '企业地址' || items.name == '来院路线' ? '35px' : '10px' }"
                                                  :maxlength="items.num" show-word-limit size="mini" :placeholder="items.placeholder"
                                                  clearable  ></el-input>
                                        <p v-if="blurred && !items.row" :style="{color:'red',fontSize:'12px', position: 'absolute',bottom:' -15px',left: items.name == '企业地址' || items.name == '来院路线' ? '45px' : '20px'}">{{ items.placeholder }}</p>
                                    </div>
                                    <div class="msx" v-else style="display:inline-block">
                                        <el-input  type="number" v-model="items.row" :min="0" label="描述文字" size="mini"
                                                         style="margin-left:10px;width:250px" clearable></el-input>
                                        <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                    </div>


                                    <!-- <p style="color:red;margin-left: 95px;">{{ items.des }}</p> -->
                                </div>
                                <div v-show="items.name == '成立时间'" class="time">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
<!--                                    <div style="position: relative">-->
                                        <el-date-picker v-model="value2" type="date" placeholder="选择日期" size="mini"
                                                        style="margin-left: 35px;" clearable>
                                        </el-date-picker>
                                        <p v-if="blurred && !value2" class="bulplaceholder">请选择成立日期</p>
<!--                                    </div>-->
                                </div>
                                <div v-show="items.name == '营业时间'" style="">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-time-select placeholder="营业开始时间" v-model="startTime" :picker-options="{
                                        start: '08:00',
                                        step: '00:15',
                                        end: '18:30'
                                    }" style="width: 150px;margin-left: 35px;" size="mini" clearable></el-time-select>
                                    <span style="margin-left: 10px;margin-right: 10px;">至</span>
                                    <el-time-select placeholder="营业结束时间" v-model="endTime" :picker-options="{
                                        start: '08:30',
                                        step: '00:15',
                                        end: '18:30',
                                        minTime: startTime
                                    }" style="width: 150px;" size="mini">
                                    </el-time-select>
                                    <span style="margin-left:10px;width:150px">备注：</span>
                                    <!-- <img src="@/assets/images/wh.png" alt=""> -->
                                    <el-input style="width:120px" v-model="remark" size="mini" clearable></el-input>
                                    <p v-if="blurred && !startTime" class="bulplaceholder">请选择营业时间或输入备注</p>
                                    <!-- <span style="margin-left: 10px;color: red;">周一至周日</span> -->
                                </div>
                                <div v-show="items.name == '企业电话'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-input  v-model="items.row" :style="{ width: '250px', marginLeft: '35px' }"
                                        maxlength="100" :placeholder="items.placeholder" :rows="4" size="mini"></el-input>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <div v-show="items.name == '企业微信'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;visibility: hidden;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-input v-model="items.row" :style="{ width: '250px', marginLeft: '35px' }"
                                        maxlength="100" :placeholder="items.placeholder" :rows="4" size="mini"></el-input>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <div v-show="items.name == '所在省份'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-select v-model="items.row" :style="{ width: '250px', marginLeft: '35px' }"
                                        maxlength="100" :placeholder="items.placeholder" :rows="4" size="mini" clearable
                                        @change="changeprovice">

                                        <el-option v-for="item in areaArrs" :value="item.name"
                                            :label="item.name"></el-option>
                                    </el-select>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <div v-show="items.name == '所在城市'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-select v-model="items.row" :style="{ width: '250px', marginLeft: '35px' }"
                                        maxlength="100" :placeholder="items.placeholder" :rows="4" size="mini" clearable
                                        @change="changecity">
                                        <el-option v-for="item in cityArr" :value="item.name"
                                            :label="item.name"></el-option>
                                    </el-select>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <div v-show="items.name == '所在区/县'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-select v-model="items.row" :style="{ width: '250px', marginLeft: '35px' }"
                                        maxlength="100" :placeholder="items.placeholder" :rows="4" size="mini" clearable>
                                        <el-option v-for="item in areaArr" :value="item.name"
                                            :label="item.name"></el-option>
                                    </el-select>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <div v-show="items.name == '科室数量'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-input type="number" v-model="items.row" :style="{ width: '250px', marginLeft: '35px' }"
                                        maxlength="100" :placeholder="items.placeholder" :rows="4" size="mini"></el-input>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <div v-show="items.name == '科室介绍'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-input v-model="items.row" :style="{ width: '500px', marginLeft: '35px' }"
                                        maxlength="100" show-word-limit type="textarea" :placeholder="items.placeholder" :rows="4"
                                        clearable></el-input>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <div v-show="items.name == '接待流程'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-input v-model="items.row" :style="{ width: '500px', marginLeft: '35px' }"
                                        maxlength="100" show-word-limit type="textarea" :placeholder="items.placeholder" :rows="4"
                                        clearable></el-input>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <div v-show="items.name == '企业简介'" class="time" style="display:flex">
                                    <span style="margin-left: 20px;color: red;">*</span>
                                    <span>{{ items.name }}</span>
                                    <el-input v-model="items.row" :style="{ width: '500px', marginLeft: '35px' }"
                                        maxlength="100" show-word-limit type="textarea" :placeholder="items.placeholder" :rows="4"
                                        clearable></el-input>
                                    <p style="color:red">{{ items.des }}</p>
                                    <p v-if="blurred && !items.row" class="bulplaceholder">{{ items.placeholder }}</p>
                                </div>
                                <!-- <div v-show="items.flags" style="width: 800px;min-height: 30px;display: flex;flex-wrap: wrap;">
                                <el-tag v-for="(tag, index) in newtags" :key="index" closable :type="tag.type"
                                    :style="{ marginLeft: '10px', marginTop: '5px' }" @close="closelabels(index)">
                                    {{ tag.name }}
                                </el-tag>
                                <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addproject"
                                    style="margin-left:20px;margin-top:5px">新增擅长项目</el-button>
                            </div> -->
                                <!-- <span style="position: absolute;margin-left: 20px;margin-top: 10px;color: red;">*</span> -->
                                <!-- <el-form-item :label="items.name">

                            <div v-show="items.flag">
                                <el-input v-model="items.row" :style="{ width: '500px' }" :maxlength="items.num"
                                    show-word-limit ></el-input>
                                <p style="color:red">{{ items.des }}</p>
                            </div>

                            <div v-show="items.flags" style="width: 800px;min-height: 30px;display: flex;flex-wrap: wrap;">
                                <el-tag v-for="(tag, index) in newtags" :key="index" closable :type="tag.type"
                                    :style="{ marginLeft: '10px', marginTop: '5px' }" @close="closelabels(index)">
                                    {{ tag.name }}
                                </el-tag>
                                <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addproject"
                                    style="margin-left:20px;margin-top:5px">新增擅长项目</el-button>
                            </div>
                            <div v-show="items.name == '成立时间'" class="time">
                                <el-date-picker v-model="value2" type="date" placeholder="选择日期" width="600">
                                </el-date-picker>
                            </div>
                            <div v-show="items.name == '企业面积' || items.name == '企业规模' || items.name == '企业地址'" class="time">
                                <el-input v-model="items.row" :style="{ width: '500px' }" :maxlength="items.num"
                                    show-word-limit></el-input>
                                <p style="color:red">{{ items.des }}</p>
                            </div>
                            <div v-show="items.name == '来院路线'" class="time">
                                <el-input v-model="items.row" :style="{ width: '500px' }" maxlength="300" show-word-limit
                                    type="textarea"></el-input>
                                <p style="color:red">{{ items.des }}</p>
                            </div>
                            <div v-show="items.name == '营业时间'" class="time newtimes">
                                <el-time-select placeholder="起始时间" v-model="startTime" :picker-options="{
                                    start: '08:30',
                                    step: '00:15',
                                    end: '18:30'
                                }" style="width: 110px;"></el-time-select>
                                <span style="margin-left: 70px;margin-right: 20px;">至</span>
                                <el-time-select placeholder="结束时间" v-model="endTime" :picker-options="{
                                    start: '08:30',
                                    step: '00:15',
                                    end: '18:30',
                                    minTime: startTime
                                }" style="width: 150px;">
                                </el-time-select>

                                <span style="margin-left:50px;width:150px">备注：</span> <el-input style="width:120px"
                                    v-model="remark"></el-input>
                            </div>
                            <div v-show="items.name == '企业简介'" class="time">
                                <el-input v-model="items.row" :style="{ width: '500px' }" maxlength="100" show-word-limit
                                    type="textarea"></el-input>
                                <p style="color:red">{{ items.des }}</p>
                            </div>
                        </el-form-item> -->
                            </div>

                            <div>

                            </div>
                        </div>
                        <!-- 擅长标签 -->
                        <div v-for="(items, indexs) in enterprise" :key="indexs + 100" style="margin-left: 80px;">
                            <div v-if="items.flags"
                                style="width: 100%;min-height: 30px;display: flex;flex-wrap: wrap;font-size: 14px;align-items: center;margin-top: 10px;">
                                <span style="margin-left: 20px;color: red;">*</span>
                                <span>{{ items.name }}</span>
                                <el-tag v-for="(tag, index) in newtags" :key="index" closable :type="tag.type"
                                    :style="{ marginLeft: '10px', marginTop: '5px' }" @close="closelabels(index)">
                                    {{ tag.name }}
                                </el-tag>
                                <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addproject"
                                    style="margin-left:20px;margin-top:5px">新增擅长项目</el-button>
                            </div>
                           <div v-if="items.newflags">
                            <div
                                style="width: 100%;min-height: 30px;display: flex;flex-wrap: wrap;font-size: 14px;align-items: center;margin-top: 10px;">
                                <span style="margin-left: 20px;color: red;">*</span>
                                <span>{{ items.name }}</span>
                                <el-tag v-for="(tag, index) in newts" :key="index" closable :type="tag.type"
                                    :style="{ marginLeft: '10px', marginTop: '5px' }" @close="newcloselabels(index)">
                                    {{ tag.name }}
                                </el-tag>
                                <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addprojectadd"
                                    style="margin-left:20px;margin-top:5px">新增特色项目</el-button>
                            </div>
                           </div>
                        </div>
                        <div class="basic">
                            <span class="long"></span> 基础信息
                        </div>
                        <div style="margin-left: 80px;">
                            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <!-- 企业主题 -->
                                <!-- <el-form-item label="企业主题" prop="name" style="margin-top: 10px;">

                            <div class="basic_title">
                                <div class="basic_title_children" v-for="(item, index) in list" :key="index"
                                    :style="{ backgroundColor: item.background }" @click="selectTitle(index)">
                                    <div class="title_right" v-show="item.flag"></div>
                                    <div class="title_success" v-show="item.flags">
                                        <img src="@/assets/images/ok.png" alt="" style="width: 100%;height: 100%;">
                                    </div>
                                </div>
                            </div>
                        </el-form-item> -->
                                <!-- 企业图片 -->
                                <el-form-item :label="items.Name" prop="region"
                                    v-for="(items, indexs) in uploadlist.slice(0, 5)" :key="indexs"
                                    :style="{ display: items.name == 'video' ? 'none' : '', position: 'relative' }">
                                    <span
                                        :style="{ color: 'red', position: 'absolute', left: items.Name !== '品牌介绍图' ? '-78px' : '-90px' }"
                                        v-show="items.Name !== '邀约到店'">*</span>
                                    <div v-if="items.name !== 'video'" class="brand">

                                        <input type="file" :ref="'title_img' + items.name" style="display: none;"
                                            @change="selchange">
                                        <div class="busic_img">
                                            <div v-for="(item, index) in items.value" :key="index"
                                                class="busic_img_children" @mouseover="newdelete(index, items.name, indexs)"
                                                @mouseleave="newleave(index, items.name, indexs)"
                                                :style="{ marginLeft: index % 2 == 0 ? '0px' : '10px', marginTop: '10px', border: item.border, width: items.width, height: items.height }"
                                                @click="addlist(index, 'title_img' + items.name, indexs)">
                                                <div class="busic_imgs" v-if="item.imgUrl == ''"
                                                    :style="{ marginLeft: items.left, marginTop: items.top }">
                                                    <img src="@/assets/images/add.png" alt="">
                                                </div>
                                                <div v-else style="object-fit: cover;">
                                                    <img :src="item.imgUrl" alt=""
                                                        :style="{ width: items.width, height: items.height, }">
                                                </div>
                                                <div class="title_del" v-show="item.showflag"
                                                    @click="deleter($event, index, items.name, indexs, 'title_img' + items.name,)">
                                                    <img src="@/assets/images/del.png" alt="" class="busic_imgs"
                                                        :style="{ marginLeft: items.left, marginTop: items.top }">
                                                </div>
                                                <div class="title_right" v-show="item.flags"></div>
                                                <div class="title_success" v-show="item.flags" style="z-index: 100000;">
                                                    <img src="@/assets/images/ok.png" alt=""
                                                        style="width: 100%;height: 100%;">
                                                </div>
                                            </div>
                                        </div>
                                        <span style="color:red;margin-left: 10px;">{{ items.desc }}</span>
                                    </div>
                                    <div v-else>
                                        <!-- <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">请上传 <span style="color:red">mp4</span> 格式文件 ，且文件大小不超过
                                <span style="color:red">30</span> MB
                            </div>
                        </el-upload> -->
                                    </div>
                                </el-form-item>
                                <div class="basic">
                                    <span class="long"></span> 企业相册
                                </div>
                                <!-- {{ uploadlist }} -->
                                <el-form-item :label="items.Name" v-for="(items, indexs) in uploadlist.slice(5, 9)"
                                    :key="indexs + 5">
                                    <span
                                        :style="{ color: 'red', position: 'absolute', left: items.Name !== '执业许可证' ? '-78px' : '-90px' }"
                                        v-show="items.Name == '企业相册'">*</span>
                                    <input type="file" :ref="'title_img' + items.name" style="display: none;"
                                        @change="selchange">

                                    <div class="busic_img" :style="{ width: items.newwidth }">

                                        <div v-for="(item, index) in items.value" :key="index" class="busic_img_children"
                                            @mouseover="newdelete(index, items.name, indexs + 5)"
                                            @mouseleave="newleave(index, items.name, indexs + 5)"
                                            :style="{ marginLeft: index % 5 == 0 ? '0px' : '10px', marginTop: '10px', border: item.border, width: items.width, height: items.height }">

                                            <div class="busic_imgs"
                                                @click="addlist(index, 'title_img' + items.name, indexs + 5)"
                                                v-if="item.imgUrl == ''"
                                                :style="{ marginLeft: items.left, marginTop: items.top }">
                                                <img src="@/assets/images/add.png" alt="">
                                            </div>
                                            <div v-else>
                                                <img :src="item.imgUrl" alt=""
                                                    :style="{ width: items.width, height: items.height }">
                                            </div>
                                            <div class="title_del" v-show="item.showflag"
                                                @click="deleter($event, index, items.name, indexs + 5)">
                                                <img src="@/assets/images/del.png" alt="" class="busic_imgs"
                                                    :style="{ marginLeft: items.left, marginTop: items.top }">
                                            </div>
                                            <div class="title_right" v-show="item.flags"></div>
                                            <div class="title_success" v-show="item.flags" style="z-index: 100000;">
                                                <img src="@/assets/images/ok.png" alt="" style="width: 100%;height: 100%;">
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display: flex;" v-show="items.ifshow">
                                        <div v-for="(item, index) in items.value " :key="index"
                                            :style="{ marginLeft: '10px', width: '142px', height: '30px', border: '1px solid black', marginTop: '10px', border: '1px solid #eee' }"
                                            v-show="item.ifshow">
                                            <el-input size="mini" maxlength="5" v-model="item.row" show-word-limit
                                                clearable></el-input>
                                        </div>
                                    </div>

                                    <span style="color:red;margin-left: 10px;">{{ items.desc }}</span>
                                </el-form-item>
                            </el-form>
                        </div>
                        <sgDialog title="添加特色项目" size="330px" out-top="2%" :dialog="showts"
                            @handleClose="showts=false">
                            <div slot="out" style="display:flex">
                                <span style="color:red">*</span> 特色项目<el-input size="mini" v-model="tsinput" style="width:200px;margin-left:10px"></el-input>
                                <div class=""
                                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                                    <div style="width: 160px;height: 40px;">
                                        <el-button type="primary" size="mini" @click="oks">确定</el-button>
                                        <el-button @click="showts=false" size="mini">取消</el-button>
                                    </div>
                                </div>
                                </div>
                                </sgDialog>
                        <sgDialog title="添加擅长项目" size="500px" out-top="2%" :dialog="showproject"
                            @handleClose="closeRoomDialogtooth">
                            <div slot="out">
                                <div class="project">
                                    <span>擅长项目</span>
                                    <div class="project_children">
                                        <el-tag v-for="(tag, index) in tags" :key="index" closable :type="tag.type"
                                            :style="{ marginLeft: '10px', marginTop: '5px' }" @close="closelabel(index)">
                                            {{ tag.name }}
                                        </el-tag>
                                        <div style="margin-left: 5px;">
                                            <el-button type="primary" size="mini" plain icon="el-icon-plus"
                                                @click="addprojects" v-if="showIfproject"
                                                style="margin-top: 6px;">新增擅长项目</el-button>
                                            <el-input v-model="tagname" maxlength="4" focus show-word-limit
                                                @blur="projectblur" style="width: 150px;margin-top: 5px;" ref="Input"
                                                size="mini" v-else>
                                            </el-input>
                                        </div>
                                    </div>
                                    <p style="margin-top: 10px;">擅长项目标签库</p>
                                    <div class="Label">
                                        <span class="labellist" @click="addColor(index)" v-for="(item, index) in labelList"
                                            :key="index" :style="{ background: item.back, color: item.color }">{{ item.name
                                            }}</span>
                                    </div>
                                </div>
                                <div style="height:40px"></div>
                                <div class=""
                                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                                    <div style="width: 160px;height: 40px;">
                                        <el-button type="primary" size="mini" @click="ok">确定</el-button>
                                        <el-button @click="closeRoomDialogteeth" size="mini">取消</el-button>
                                    </div>
                                </div>
                            </div>
                        </sgDialog>
                    </div>
                </div>
            </template>
        </Tree>
    </div>
</template>
<script>
import Tree from '@/components/newTree/index'
import sgDialog from '@/components/Dialog/index'
import area from '@/utils/area'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
import vm from '@/utils/util'
export default {
    components: {
        Tree,
        sgDialog
    },
    created() {
        //模拟数据
        let data = {
            deptId: 4
        }
        this.$api.confinementRoom.companyMemberlist(data).then(res => {
            // console.log(res,'sdadgasd')
        })
        this.areaArrs = area.arrAll

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
    mounted() {
        window.addEventListener('scroll', function (e) {
            this.scrollTop = e.srcElement.scrollTop;
            //    alert(this.scrollTop)
        }, true)

        this.$store.dispatch('treedepartment', { treedepartmentId: this.$store.getters.departmentId })
        this.treedeptId = this.$store.getters.treedepartmentId;
        // this.search();
    },
    data() {
        return {
            blurred: false,// 记录是否失去焦点
            //表格数据
            tableData: [],
            newts:[],
            tsinput:"",
            showts:false,
            jurisdictions: true,
            areaArrs: [],
            cityArr: [],
            areaArr: [],
            //表格表头
            clums: [
                {
                    value: "projectName",
                    label: "商品名称",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "shelfTime",
                    label: "上架类型",
                    vals: true, //true表示自定义内容，false或者不传表示不需要自定义
                },
                {
                    value: "projectName",
                    label: "商品名称",
                }
            ],
            //操作按钮
            operation: [
                {
                    label: '删除',
                    val: '0'
                }
            ],

            //是否显示树形文件
            isShowfile: false,
            //是否显示默认组件
            showDefault: false,
            fileList: {},
            deptOptions: [],
            deptid: "",
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            submitcompant: false,
            delimage: [],//删除图片数据保存
            scrollTop: 0,
            companyId: '',
            ifEdit: false,
            newcompanyId: "",
            remark: "",
            newtags: [],
            value2: "",
            companyName: "",
            companyShort: "",
            introduce: "",
            companyLabel: "",
            foundingTime: "",
            companyArea: "",
            companyScale: "",
            companyAddr: "",
            walkRoute: "",
            startTime: "",
            endTime: "",
            companyIntroduce: "",
            businessDay: "",
            companySubject: "rgb(128, 123, 213)",
            Index: 0,
            Indexs: 0,
            showstr: "",
            value1: "",
            // value1: [new Date(2016, 9, 10, 8, 40,12), new Date(2016, 9, 10, 9, 40)],
            showproject: false,
            tagname: "",
            tags: [],
            flshow: false,
            showIfproject: true,
            labelList: [{
                name: "眼部",
                back: '',
                color: ""
            },
            {
                name: "鼻部",
                back: '',
                color: ""
            },
            {
                name: "面部",
                back: '',
                color: ""
            },
            {
                name: "胸部",
                back: '',
                color: ""
            }
            ],
            //企业详情
            enterprise: [{
                name: "企业名称",
                des: "最多可输入15个字",
                placeholder: "请输入企业名称",
                num: 15,
                row: "",
                flag: true,
            },
            {
                name: "企业简称",
                des: "最多可输入8个字",
                placeholder: "请输入企业简称",
                num: 8,
                row: "",
                flag: true,
            },
            {
                name: "企业介绍",
                des: "最多可输入20个字",
                placeholder: "请输入企业介绍",
                num: 20,
                row: "",
                flag: true,

            },
            {
                name: "企业标签",
                row: "",
                flags: true
            },
            {
                name: "企业面积",
                placeholder: "请输入企业面积(平方米)",
                row: "",
                flag: true,
                des: "平方米",
            },
            {
                name: "企业规模",
                placeholder: "请输入企业规模(平方米)",
                row: "",
                flag: true,
                des: "企业成员(人数)",
            },
            {
                name: "企业地址",
                placeholder: "请输入企业地址",
                row: "",
                flag: true,
            },
            {
                name: "来院路线",
                placeholder: "请输入来院线路",
                row: "",
                flag: true,
            },
            {
                name: "成立时间",
                row: "",
            },
            {
                name: "营业时间",
                row: "",
            },
            {
                name: "企业电话",
                row: "",
                placeholder: "请输入企业电话",
            },
            {
                name: "企业微信",
                row: "",
                placeholder: "请输入企业微信",
            },
            {
                name: "所在省份",
                row: "",
                placeholder: "请选择所在省份",
            },
            {
                name: "所在城市",
                row: "",
                placeholder: "请选择所在城市",
            },
            {
                name: "所在区/县",
                row: "",
                placeholder: "请选择所在区/县",
            },
            {
                name: "科室数量",
                row: "",
                placeholder: "请输入科室数量",
            },
            {
                name: "企业简介",
                row: "",
                placeholder: "请输入企业简介",
            },
            {
                name: "科室介绍",
                row: "",
                placeholder: "请输入科室介绍",
            },
            {
                name: "接待流程",
                row: "",
                placeholder: "请输入接待流程",

            },
            {
                name: "特色项目",
                row: "",
                newflags: true
            },
            ],
            //企业相册和基本信息
            uploadlist: [
                {
                    name: "Img", Name: "企业图片", desc: '建议图片不超过2MB，最多可以上传5张，建议图片尺寸：375*150',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 5,
                    des: "只允许上传5张企业图片",
                    width: '300px',
                    height: "142px",
                    left: "135px",
                    top: "56px"
                },
                {
                    name: "brand", Name: "品牌介绍图", desc: '建议图片不超过2MB，最多可以上传5张，建议图片尺寸：350*250',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 5,
                    des: "只允许上传5张品牌介绍图",
                    width: '300px',
                    height: "142px",
                    left: "135px",
                    top: "56px"
                },
                {
                    name: "logo", Name: "企业logo", desc: '建议图片不超过2MB，建议尺寸比例：1:1 （例：60*60）',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张企业logo",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px"
                },
                {
                    name: "invite", Name: "邀约到店", desc: '建议图片不超过2MB，建议尺寸比例：1:1 （例：60*60）',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张邀约到店默认图",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px"
                },
                {
                    name: "video", Name: "企业视频", desc: '请上传  mp4 格式文件 ，且文件大小不超过 30 MB',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张邀约到店默认图",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px"
                },
                {
                    name: "photo", Name: "企业相册", desc: '建议图片不超过2MB，建议尺寸比例：1:1 （例：60*60）',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                        ifshow: false,
                        row: "",
                    }],
                    num: 10000,
                    des: "只允许上传1张营业执照",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px",
                    newwidth: '780px',
                    ifshow: true,
                },
                {
                    name: "trading", Name: "营业执照", desc: '建议图片不超过2MB，建议图片尺寸：375*150',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张营业执照",
                    width: '300px',
                    height: "142px",
                    left: "135px",
                    top: "56px",
                    newwidth: '630px',
                    ifshow: false,
                },
                {
                    name: "operation", Name: "执业许可证", desc: '建议图片不超过2MB，建议图片尺寸：375*150',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张执业许可证",
                    width: '300px',
                    height: "142px",
                    left: "135px",
                    top: "56px",
                    newwidth: '630px',
                    ifshow: false,
                },
                {
                    name: "advertising", Name: "广告审查", desc: '建议图片不超过2MB，建议图片尺寸：375*150',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张广告审查证明",
                    width: '300px',
                    height: "142px",
                    left: "135px",
                    top: "56px",
                    newwidth: '630px',
                    ifshow: false,
                },


            ],
            newuploadlist: [

                {
                    name: "brand", Name: "品牌介绍图", desc: '建议图片不超过2MB，最多可以上传5张，建议图片尺寸：678*340',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 5,
                    des: "只允许上传5张品牌介绍图",
                    width: '300px',
                    height: "142px",
                    left: "135px",
                    top: "56px",
                    newwidth: '680px'
                },
            ],
            list: [
                {
                    background: 'rgb(128, 123, 213)',
                    flag: true,
                    flags: true,
                },
                {
                    background: 'rgb(178, 55, 48)',
                    flag: false,
                    flags: false,
                },
                {
                    background: 'rgb(73, 175, 189)',
                    flag: false,
                    flags: false,
                },
                {
                    background: 'rgb(210, 180, 124)',
                    flag: false,
                    flags: false,
                },
                {
                    background: 'rgb(0, 47, 167)',
                    flag: false,
                    flags: false,
                },
                {
                    background: 'rgb(30, 80, 162)',
                    flag: false,
                    flags: false,
                },


            ],
            ruleForm: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',

            },
            rules: {
                name: [
                    { required: true, message: '', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        newcloselabels(index){
            this.newts.splice(index,1)
        },
        oks(){
         if(this.tsinput==''){
             this.$message.warning('请输入特色项目');
             return ;
         }
         this.newts.push({
            name:this.tsinput
         })
         this.showts=false;
        },
        addprojectadd(){
            this.showts=true;
            this.tsinput='';
        },
        changecity(val) {
            console.log(val)
            this.updateDistrict(val)
        },
        changeprovice(val) {
            for (const i in this.areaArrs) {
                const obj = this.areaArrs[i]
                if (obj.name) {
                    if (obj.name === val) {
                        this.cityArr = obj.sub
                        break
                    }
                }
            }
            this.enterprise[13].row = this.cityArr[0].name;
            this.updateDistrict(this.cityArr[0].name)

        },
        updateDistrict(val) {
            for (var i in this.cityArr) {
                var obj = this.cityArr[i]
                if (obj.name === val) {
                    this.areaArr = obj.sub
                    break
                }
            }
            if (
                this.areaArr && this.areaArr.length > 0 && this.areaArr[0].name
            ) {
                this.enterprise[14].row = this.areaArr[0].name
            } else {
                this.enterprise[14].row = ''
            }

        },
        newjurisdiction(id) {
            this.jurisdictions = id;
        },
        search(isSearch, item) {
            if (item && item.children !== undefined) {
                this.jurisdictions = true
            } else {
                this.jurisdictions = false
                let newdata = ''
                if (isSearch == undefined) {
                    newdata = {
                        deptId: this.treedeptId
                    }
                } else {
                    newdata = {
                        deptId: isSearch
                    }
                }
                this.$api.confinementRoom.companyLabel(newdata).then(res => {
                    res.rows.forEach(value => {
                        value.back = '',
                            value.color = "",
                            value.name = value.labelName
                    })
                    this.labelList = res.rows
                })
                this.$api.confinementRoom.getCompanyInfoByDeptIdedit(newdata).then(res => {
                    if (res.data == undefined) {
                        this.ifEdit = false;
                        this.companySubject = 'rgb(128, 123, 213)'
                        this.enterprise[0].row = ''
                        this.enterprise[1].row = ''
                        this.enterprise[2].row = ''
                        this.companyLabel = ''
                        this.value2 = '',
                            this.enterprise[4].row = ''
                        this.enterprise[5].row = ''
                        this.enterprise[6].row = ''
                        this.enterprise[7].row = ''
                        this.startTime = ''
                        this.endTime = ''
                        this.enterprise[10].row = ''
                        this.enterprise[11].row = '';
                        this.enterprise[12].row = ''
                        this.enterprise[13].row = ''
                        this.enterprise[14].row = ''
                        this.enterprise[15].row = ''
                        this.enterprise[16].row = ''
                        this.enterprise[17].row = ''
                        this.enterprise[18].row = ''

                        this.remark = ''
                        this.treedeptId = ''
                        this.newcompanyId = ''
                        this.tags = [];
                        this.newtags = [];
                        this.uploadlist.forEach(value => {
                            if (value.Name !== '企业相册') {
                                value.value = [
                                    {
                                        imgUrl: "",
                                        border: '1px dashed #d9d9d9',
                                        showflag: false,
                                        flags: false,
                                    }
                                ];
                            } else {
                                value.value = [
                                    {
                                        imgUrl: "",
                                        border: '1px dashed #d9d9d9',
                                        showflag: false,
                                        flags: false,
                                        ifshow: false,
                                        row: "",
                                    }
                                ]
                            }

                        })
                    } else {
                        this.uploadlist[0].value = [
                            {
                                imgUrl: "",
                                border: '1px dashed #d9d9d9',
                                showflag: false,
                                flags: false,
                            }
                        ];
                        this.uploadlist[1].value = [
                            {
                                imgUrl: "",
                                border: '1px dashed #d9d9d9',
                                showflag: false,
                                flags: false,
                            }
                        ];
                        this.uploadlist[5].value = [
                            {
                                imgUrl: "",
                                border: '1px dashed #d9d9d9',
                                showflag: false,
                                flags: false,
                                ifshow: false,
                                row: '',
                            }
                        ]
                        this.ifEdit = true;
                        this.list[0].flag = false;
                        this.list[0].flags = false;
                        this.list.forEach((value, index) => {
                            if (value.background == res.data.companySubject) {
                                value.flag = true;
                                value.flags = true
                            }
                        })
                        this.companySubject = res.data.companySubject;
                        this.companyId = res.data.companyId
                        this.uploadlist[0].value[0].flags = true;
                        let object = {
                            'Img': [],
                            'brand': [],
                            'logo': [],
                            'invite': [],
                            'photo': [],
                            'trading': [],
                            'operation': [],
                            'advertising': [],
                        }
                        res.data.companyPhoto.forEach(value => {
                            if (value.photoType == '5') {
                                object['Img'].push(value)
                            } else if (value.photoType == '6') {
                                object['brand'].push(value)
                            } else if (value.photoType == '7') {
                                object['logo'].push(value)
                            } else if (value.photoType == '8') {
                                object['invite'].push(value)
                            } else if (value.photoType == '9') {
                                object['photo'].push(value)
                            } else if (value.photoType == '10') {
                                object['trading'].push(value)
                            } else if (value.photoType == '11') {
                                object['operation'].push(value)
                            } else if (value.photoType == '12') {
                                object['advertising'].push(value)
                            }
                        })

                        if (object['Img'].length == 0) {

                        } else {
                            this.uploadlist[0].value[0].imgUrl = serverPath + object.Img[0].photoAddr;
                            if (object.Img.length > 1) {
                                object.Img.forEach((value, index) => {
                                    if (index > 0) {
                                        this.uploadlist[0].value.push({
                                            imgUrl: serverPath + value.photoAddr,
                                            border: '1px dashed #d9d9d9',
                                            showflag: false,
                                            flags: true,
                                        })
                                    }
                                })
                                this.uploadlist[0].value.push(
                                    {
                                        imgUrl: "",
                                        border: '1px dashed #d9d9d9',
                                        showflag: false,
                                        flags: false,
                                    }
                                )
                            } else {
                                this.uploadlist[0].value[0].imgUrl = serverPath + object.Img[0].photoAddr;
                                this.uploadlist[0].value.push(
                                    {
                                        imgUrl: "",
                                        border: '1px dashed #d9d9d9',
                                        showflag: false,
                                        flags: false,
                                    }
                                )
                            }
                            this.fileList['Img'] = object.Img;
                        }
                        this.uploadlist[1].value[0].imgUrl = serverPath + object.brand[0].photoAddr;
                        this.uploadlist[1].value[0].flags = true;
                        if (object.brand.length > 1) {
                            object.brand.forEach((value, index) => {
                                if (index > 0) {
                                    this.uploadlist[1].value.push({
                                        imgUrl: serverPath + value.photoAddr,
                                        border: '1px dashed #d9d9d9',
                                        showflag: false,
                                        flags: true,
                                    })
                                }
                            })
                            this.uploadlist[1].value.push(
                                {
                                    imgUrl: "",
                                    border: '1px dashed #d9d9d9',
                                    showflag: false,
                                    flags: false,
                                }
                            )
                        } else {
                            this.uploadlist[1].value[0].imgUrl = serverPath + object.brand[0].photoAddr;
                            this.uploadlist[1].value.push(
                                {
                                    imgUrl: "",
                                    border: '1px dashed #d9d9d9',
                                    showflag: false,
                                    flags: false,
                                }
                            )
                        }
                        this.fileList['brand'] = object.brand;

                        this.uploadlist[2].value[0].imgUrl = serverPath + object.logo[0].photoAddr;
                        this.uploadlist[2].value[0].flags = true;
                        this.fileList['logo'] = object.logo;
                        if (object.invite.length == 0) {

                        }
                        else {
                            this.uploadlist[3].value[0].imgUrl = serverPath + object.invite[0].photoAddr;
                            this.uploadlist[3].value[0].flags = true;
                            // this.uploadlist[3].value.push(
                            //     {
                            //         imgUrl: "",
                            //         border: '1px dashed #d9d9d9',
                            //         showflag: false,
                            //         flags: false,
                            //     }
                            // )
                            this.fileList['invite'] = object.invite;
                        }

                        this.uploadlist[5].value[0].imgUrl = serverPath + object.photo[0].photoAddr;
                        this.uploadlist[5].value[0].flags = true;
                        this.uploadlist[5].value[0].row = object.photo[0].photoName;
                        this.uploadlist[5].value[0].ifshow = true;
                        if (object.photo.length > 1) {
                            object.photo.forEach((value, index) => {
                                if (index > 0) {
                                    this.uploadlist[5].value.push({
                                        imgUrl: serverPath + value.photoAddr,
                                        border: '1px dashed #d9d9d9',
                                        showflag: false,
                                        flags: true,
                                        ifshow: true,
                                        row: value.photoName,

                                    })
                                }
                            })
                            this.uploadlist[5].value.push(
                                {
                                    imgUrl: "",
                                    border: '1px dashed #d9d9d9',
                                    showflag: false,
                                    flags: false,
                                    ifshow: false,
                                    row: '',
                                }
                            )
                        } else {
                            this.uploadlist[5].value[0].imgUrl = serverPath + object.photo[0].photoAddr;
                            this.uploadlist[5].value.push(
                                {
                                    imgUrl: "",
                                    border: '1px dashed #d9d9d9',
                                    showflag: false,
                                    flags: false,
                                    ifshow: false,
                                    row: ''
                                }
                            )
                        }
                        this.fileList['photo'] = object.photo;

                        if (object.trading.length == 0) {

                        } else {
                            this.uploadlist[6].value[0].imgUrl = serverPath + object.trading[0].photoAddr;
                            this.uploadlist[6].value[0].flags = true;
                            this.fileList['trading'] = object.trading;
                        }
                        if (object.operation.length == 0) {

                        } else {
                            this.uploadlist[7].value[0].imgUrl = serverPath + object.operation[0].photoAddr;
                            this.uploadlist[7].value[0].flags = true;
                            this.fileList['operation'] = object.operation;
                        }
                        if (object.advertising.length == 0) {
                        } else {
                            this.uploadlist[8].value[0].imgUrl = serverPath + object.advertising[0].photoAddr;
                            this.uploadlist[8].value[0].flags = true;
                            this.fileList['advertising'] = object.advertising;
                        }
                        //企业详情
                        this.enterprise[0].row = res.data.companyName;
                        this.enterprise[1].row = res.data.companyShort;
                        this.enterprise[2].row = res.data.introduce;
                        let arr = [];
                        let newarr=[]
                        res.data.companyLabel.split(',').forEach(value => {
                            let obj = {};
                            obj.name = value;
                            arr.push(obj)
                        })
                        res.data.feature.split(',').forEach(value => {
                            let obj = {};
                            obj.name = value;
                            newarr.push(obj)
                        })
                        this.newtags = this.deepClone(arr);
                        this.tags = this.deepClone(arr);
                        this.newts=this.deepClone(newarr)
                        this.value2 = res.data.foundingTime;
                        this.enterprise[4].row = res.data.companyArea;
                        this.enterprise[5].row = res.data.companyScale
                        this.enterprise[6].row = res.data.companyAddr
                        this.enterprise[7].row = res.data.walkRoute;
                        this.startTime = res.data.startTime;
                        this.endTime = res.data.endTime
                        this.remark = res.data.businessDay;
                        this.enterprise[10].row = res.data.companyPhone;
                        this.enterprise[11].row = res.data.companyWx;
                        this.enterprise[12].row = res.data.province;
                        this.enterprise[13].row = res.data.city;
                        this.enterprise[14].row = res.data.area;
                        this.enterprise[15].row = res.data.departmentNum;
                        this.enterprise[16].row = res.data.companyIntroduce;
                        this.enterprise[17].row = res.data.departmentIntro;
                        this.enterprise[18].row = res.data.receptionStep;
                        this.newcompanyId = res.data.companyId



                        // companySubject: this.companySubject,
                        // companyName: this.enterprise[0].row,
                        // companyShort: this.enterprise[1].row,
                        // introduce: this.enterprise[2].row,
                    }
                })
            }
        },
        submitback() {
            vm.$emit('closeTag', this.$route.path);
        },
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
        newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            let hh = DateObj.getHours()
            let mm = DateObj.getMinutes()
            let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            if (hh >= 0 && hh <= 9) {
                hh = "0" + hh;
            }
            if (mm >= 0 && mm <= 9) {
                mm = "0" + mm;
            }
            if (ss >= 0 && ss <= 9) {
                ss = "0" + ss;
            }
            // 最终时间
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
        },
        submit() {
            this.blurred = true;
            let str = '';
            let newstrsl='';
            this.tags.forEach((value, index) => {
                if (index == this.tags.length - 1) {
                    str += value.name
                } else {
                    str += value.name + ','
                }
            })
            this.newts.forEach((value,index)=>{
                if (index == this.newts.length - 1) {
                    newstrsl += value.name
                } else {
                    newstrsl += value.name + ','
                }
            })
            this.companyLabel = str;
            if (this.enterprise[0].row == '') {
                this.$message.warning('请输入企业名称');
                return;
            }
            if (this.enterprise[1].row == '') {
                this.$message.warning('请输入企业简称');
                return;
            }
            if (this.enterprise[2].row == '') {
                this.$message.warning('请输入企业介绍');
                return;
            }

            if (this.enterprise[4].row == undefined) {
                this.$message.warning('请输入企业面积');
                return;
            }
            if (this.enterprise[6].row == '') {
                this.$message.warning('请输入企业地址');
                return;
            }
            if (this.enterprise[7].row == '') {
                this.$message.warning('请输入来源路线');
                return;
            }
            if (this.value2 == '') {
                this.$message.warning('请选择成立时间');
                return;
            }
            if (this.startTime == '' || this.endTime == '' || this.startTime == null || this.endTime == null) {
                this.$message.warning('请选择企业营业时间');
                return;
            }

            // if(this.enterprise[10].row==''){
            //     this.$message.warning('请输入企业电话');
            //     return;
            // }else{
            //     if(!validPhone(this.enterprise[10].row)){
            //     this.$message.warning('请输入正确的的企业电话');
            //     return;
            // }
            // }
            if (this.enterprise[12].row == '') {
                this.$message.warning('请选择所在省份');
                return;
            }
            if (this.enterprise[13].row == '') {
                this.$message.warning('请选择所在城市');
                return;
            }
            if (this.enterprise[14].row == '') {
                this.$message.warning('请选择所在区/县');
                return;
            }
            if (this.enterprise[15].row == '') {
                this.$message.warning('请输入科室数量');
                return;
            }
            if (this.enterprise[16].row == '') {
                this.$message.warning('请输入企业简介');
                return;
            }
            if (this.enterprise[17].row == '') {
                this.$message.warning('请输入科室介绍');
                return;
            }
            if (this.enterprise[18].row == '') {
                this.$message.warning('请输入接待流程');
                return;
            }
            if (this.companyLabel == '') {
                this.$message.warning('请选择企业标签');
                return;
            }
            if (this.uploadlist[0].value[0].imgUrl == '') {
                this.$message.warning('请上传企业图片');
                return;
            }
            if (this.uploadlist[1].value[0].imgUrl == '') {
                if (document.querySelector('.topscroll').scrollTop == 0) {
                    document.querySelector('.topscroll').scrollTop = document.querySelectorAll('.brand')[1].getBoundingClientRect().top - 150
                } else {

                }

                this.$message.warning('请上传品牌介绍图');
                return;
            }
            if (this.uploadlist[2].value[0].imgUrl == '') {

                document.querySelector('.topscroll').scrollTop = document.querySelector('.topscroll').scrollTop + 180;
                this.$message.warning('请上传企业logo');
                return;
            }
            if (this.uploadlist[5].value[0].imgUrl == '') {
                document.querySelector('.topscroll').scrollTop = document.querySelector('.topscroll').scrollTop + 500
                this.$message.warning('请上传企业相册');
                return;
            }
            let arr = [];
            for (let x in this.fileList) {
                this.fileList[x].forEach((value, index) => {
                    value.deptId = this.treedeptId;
                    if (x == 'Img') {
                        value.photoType = '5'
                    }
                    if (x == 'brand') {
                        value.photoType = '6'
                    }
                    if (x == 'logo') {
                        value.photoType = '7'
                    }
                    if (x == 'invite') {
                        value.photoType = '8'
                    }
                    if (x == 'photo') {
                        value.photoType = '9'
                        value.photoName = this.uploadlist[5].value[index].row;
                    }
                    if (x == 'trading') {
                        value.photoType = '10'
                    }
                    if (x == 'operation') {
                        value.photoType = '11'
                    }
                    if (x == 'advertising') {
                        value.photoType = '12'
                    }
                    arr.push(value);
                })
            }
            this.tags.forEach(value => {
                value.companyId = this.companyId,
                    value.labelName = value.name
            })

            let arrstr = '';
            let newstr = '';
            arr.forEach((value, index) => {
                if (index == arr.length - 1) {
                    arrstr += JSON.stringify(value)
                } else {
                    arrstr += JSON.stringify(value) + ','
                }

            })
            this.delimage.forEach((value, index) => {
                if (index == this.delimage.length - 1) {
                    newstr += JSON.stringify(value)
                } else {
                    newstr += JSON.stringify(value) + ','
                }

            })
            this.submitcompant = true;
            let data = {
                companySubject: this.companySubject,
                companyName: this.enterprise[0].row,
                companyShort: this.enterprise[1].row,
                introduce: this.enterprise[2].row,
                companyLabel: this.companyLabel,
                foundingTime: this.value2 == '' ? '' : this.newgetData(this.value2),
                companyArea: this.enterprise[4].row,
                companyScale: this.enterprise[5].row,
                companyAddr: this.enterprise[6].row,
                walkRoute: this.enterprise[7].row,
                startTime: this.startTime,
                endTime: this.endTime,
                companyPhone: this.enterprise[10].row,
                companyWx: this.enterprise[11].row,
                province: this.enterprise[12].row,
                city: this.enterprise[13].row,
                area: this.enterprise[14].row,
                departmentNum: this.enterprise[15].row,
                companyIntroduce: this.enterprise[16].row,
                departmentIntro:this.enterprise[17].row,
                receptionStep:this.enterprise[18].row,
                businessDay: this.remark,
                deptId: this.treedeptId,
                companyId: this.newcompanyId,
                photoInfo: arrstr,
                photoInfoDel: newstr,
                labelList: this.tags,
                feature:newstrsl,
            }
            if (this.ifEdit) {
                this.$api.confinementRoom.getCompanyInfoByDeptIdedits(data).then(res => {
                    if (res.code == 200) {
                        this.$message.success("修改企业信息成功");
                        this.submitcompant = false;
                        vm.$emit('closeTag', this.$route.path);
                    }
                })
            } else {
                this.$api.confinementRoom.companyBasicsInfo(data).then(res => {
                    if (res.code == 200) {
                        this.$message.success("新增企业信息成功");
                        this.submitcompant = false;
                        vm.$emit('closeTag', this.$route.path);
                    }
                })
            }

        },
        closeRoomDialogteeth() {
            this.showproject = false;
        },
        ok() {
            this.newtags = this.deepClone(this.tags);
            this.showproject = false;
        },
        closelabel(index) {
            this.labelList.forEach((value, indexs) => {
                if (this.tags[index].name == value.name) {
                    this.labelList[indexs].back = '';
                    this.labelList[indexs].color = '';
                }
            })
            this.tags.splice(index, 1);
        },
        closelabels(index) {
            this.newtags.splice(index, 1);
            this.tags.splice(index, 1);
        },
        addColor(index) {
            if (this.labelList[index].back == '#2b75ed') {
                this.labelList[index].back = '';
                this.labelList[index].color = '';
                this.tags.forEach((value, indexs) => {
                    if (value.name == this.labelList[index].name) {
                        this.tags.splice(indexs, 1)
                    }
                })
            } else {
                this.labelList[index].back = '#2b75ed';
                this.labelList[index].color = '#fff'
                this.tags.push({
                    name: this.labelList[index].name
                })
            }

        },
        closeRoomDialogtooth() {
            this.showproject = false;
        },
        //新增项目
        addproject() {
            this.showproject = true;
            this.labelList.forEach((value, index) => {
                this.tags.forEach(newvalue => {
                    if (value.name == newvalue.name) {
                        this.labelList[index].back = '#2b75ed';
                        this.labelList[index].color = '#fff'
                    }
                })
            })
        },
        addprojects() {
            this.flshow = true;
            let that = this;
            this.showIfproject = false;
            setTimeout(() => {
                that.$refs.Input.focus();
            }, 100)


        },
        projectblur() {
            this.showIfproject = true;
            if (this.tagname == '') {

            } else {
                let flag = false;
                this.tags.forEach(value => {
                    if (value.name == this.tagname) {
                        flag = true;
                    }
                })
                if (flag) {
                    this.$message.warning("已有相同标签，请重新添加")
                    return
                }
                this.tags.push({
                    name: this.tagname
                })
            }

            this.tagname = ''
        },
        //企业图片上传
        selchange(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            let len=e.target.files[0].name.split('.')
            if (e.target.files[0].name.split('.')[len.length-1] !== 'bmp' && e.target.files[0].name.split('.')[len.length-1] !== 'gif' && e.target.files[0].name.split('.')[len.length-1] !== 'jpg' && e.target.files[0].name.split('.')[len.length-1] !== 'jpeg' && e.target.files[0].name.split('.')[len.length-1] !== 'png') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
                return
            }

            if (this.uploadlist[this.Indexs].value.length > this.uploadlist[this.Indexs].num) {
                this.$message.warning(`${this.uploadlist[this.Indexs].des}`)
                return
            }
            if (this.showstr == 'photo') {
                this.uploadlist[this.Indexs].value.push({
                    imgUrl: "",
                    border: 'len.length-1px dashed #d9d9d9',
                    showflag: false,
                    flags: false,
                    ifshow: false,
                    row: "",
                })
            } else {
                if (this.uploadlist[this.Indexs].value.length == this.uploadlist[this.Indexs].num) {

                } else {
                    this.uploadlist[this.Indexs].value.push({
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    })
                }

            }
            let fromdata = new FormData();

            fromdata.append('file', e.target.files[0]);
            this.$api.confinementRoom.unload(fromdata).then(res => {
                let object = {};
                object['photoName'] = res.data.name;
                object['photoAddr'] = res.data.url;
                object['fileSuffix'] = res.data.fileSuffix
                if (this.fileList.hasOwnProperty(this.showstr)) {

                    this.fileList[this.showstr] = this.fileList[this.showstr].concat(object)
                } else {
                    this.fileList[this.showstr] = [];

                    this.fileList[this.showstr].push(object)
                }
                this.$message.success("上传成功")
            });
            this.uploadlist[this.Indexs].value[this.Index].imgUrl = window.URL.createObjectURL(e.target.files[0])
            this.uploadlist[this.Indexs].value[this.Index].flags = true;
            this.uploadlist[this.Indexs].value[this.Index].ifshow = true;
            e.target.value = '';
        },
        addlist(index, val, indexs) {
            this.Index = index;
            this.Indexs = indexs;
            let showstr = val.substr(9, val.length);
            this.showstr = showstr;
            this.$refs[val][0].click()
        },
        newleave(id, val, indexs) {
            this.uploadlist[indexs].value[id].border = '1px dashed #d9d9d9'
            this.uploadlist[indexs].value[id].showflag = false;
            if (this.uploadlist[indexs].value[id].imgUrl !== '') {
                this.uploadlist[indexs].value[id].flags = true;
            }

        },
        deleter(e, index, val, indexs, vals) {
            e.stopPropagation();
            let arr = this.fileList[val][index];
            this.uploadlist[indexs].value.splice(index, 1);

            if (val !== 'photo') {
                if (this.uploadlist[indexs].value.length == 0) {
                    this.uploadlist[indexs].value.push(
                        {
                            imgUrl: "",
                            border: '1px dashed #d9d9d9',
                            showflag: false,
                            flags: false,
                        }
                    )
                }
            }

            if (this.ifEdit) {
                this.delimage.push(
                    arr
                )

            }
            this.fileList[val].splice(index, 1);
            // this.$refs[vals][0]='';

        },
        newdelete(id, val, indexs) {
            if (this.uploadlist[indexs].value[id].imgUrl !== '') {
                this.uploadlist[indexs].value[id].showflag = true;

            }else{
                this.uploadlist[indexs].value[id].border = '1px dashed blue';
            }

            this.uploadlist[indexs].value[id].flags = false;
        },
        selectTitle(index) {
            this.list.forEach(value => {
                value.flag = false;
                value.flags = false
            })
            this.companySubject = this.list[index].background;
            this.list[index].flag = true;
            this.list[index].flags = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                } else {

                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //deptId改变之后的回调
        changeDeptId(id) {
            // alert(id)
        },
        // newdelete(data) {
        //     // console.log(data)
        // },
        //点击页码
        handleCurrentChange(e) {
            // alert(e)
        },

        //点击选择条数
        handleSizeChange(e) {
            // alert(e)
        },
        //点击复选框的回调
        handleSelectionChang(row) {
            // console.log(row,'sadgasd')
        },
        //点击树形三级的回调
        changeCompay(id, item) {
            this.search(id, item)

            this.$store.dispatch('treedepartment', { treedepartmentId: id })
            // this.deptId=id;
            // alert(id)
        },
        //点击表格每一行的回调
        rowClick(data) {

        }
    }
}
</script>
<style scoped>
::v-deep .msx .el-input__inner {
    padding: 0 !important;
    text-align: left;
    padding-left: 20px !important;
}

::v-deep .el-input-number__decrease {
    display: none !important
}

::v-deep .el-input-number__increase {
    display: none;
}

::v-deep .newtimes .el-date-editor .el-input__inner {
    width: 150px !important;
}

::v-deep .newtimes .el-input .el-input__inner {
    width: 170px !important;
}

.bottom {
    position: fixed;
    width: 100%;
    height: 80px;
    bottom: 0;
    background-color: #fff;
    z-index: 1000;
    display: flex;
    align-items: center;

    justify-content: center;
}

.time ::v-deep .el-input__inner {
    width: 250px !important;
}

/* .time ::v-deep .el-input__prefix {
    width:500px !important;
     position:absolute;
     margin-left:400px
} */

.Label {
    width: 100%;
    min-height: 100px;
    /* border: 1px solid black; */
    display: flex;
    flex-wrap: wrap;
}

.labellist {
    /* width: 50px; */
    height: 20px;
    display: inline-block;
    border: 1px solid #eee;
    margin-left: 10px;
    margin-top: 10px;
    text-align: center;
    line-height: 20px;
    border-radius: 5px;
    cursor: pointer;
    padding: 10px;
}

.project_children {
    width: 97%;
    min-height: 20px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.project {
    width: 100%;
    min-height: 250px;

}

.photo {
    width: 810px;
    min-height: 206px;
    border: 1px solid red;
    display: flex;
}

.title_del {
    width: 300px;
    height: 142px;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0.7;
    position: absolute;
    top: 0;
}

.busic_img {
    width: 630px;
    min-height: 142px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 10px;

}

.busic_img_children {
    width: 300px;
    height: 142px;
    border: 1px dashed #eee;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

}

.busic_imgs {
    margin-left: 135px;
    margin-top: 56px;
}

.basic_title_children {
    width: 120px;
    height: 40px;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    margin-left: 10px;
    cursor: pointer;
}

.title_success {
    width: 15px;
    height: 15px;
    position: absolute;
    right: 0;
    top: -8px;
    z-index: 1000;
}

/* .basic_title_children::before{

} */
.title_right {
    content: '';
    width: 20px;
    height: 50px;
    background-color: #13ce66;
    position: absolute;
    right: 0;
    top: -20px;
    transform: rotate(-45deg);
}

.basic_title {
    width: 770px;
    height: 40px;
    display: flex;
}

.basic {
    margin-top: 10px;
    margin-left: 20px;
    height: 35px;
    /* border: 1px solid black; */
    border-bottom: 1px solid #eee;
}

.long {
    height: 10px;
    border: 2px solid #2b75ed;
    display: inline-block;
}
.bulplaceholder{
    color:red;
    position: absolute;
    bottom: -15px;
    left: 130px;
    font-size: 12px;
}
</style>
