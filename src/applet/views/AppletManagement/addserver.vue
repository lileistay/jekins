<template>
    <div>
        <div style="position: absolute;right: 20px;top:0px;background-color: #fff;height: 50px;">
            <el-button type="primary" size="mini" style="position: absolute;right:120px;top:145px;z-index:1000"
                @click="submit" :loading="submitcompant" v-has-permi="['client:productInfo:add']">
                提交
            </el-button>
            <!-- <el-button type="primary" size="mini" style="position: absolute;right:120px;top:145px;z-index:1000"
                @click="submit" :loading="submitcompant" v-has-permi="['client:productInfo:add']">
                提交
            </el-button> -->
            <el-button type="primary" size="mini" style="position: absolute;right:50px;top:145px;z-index: 1000;"
                @click="submitback">
                返回
            </el-button>
        </div>
        <div style="height:780px;width:100%;overflow-y:scroll">

            <div class="basic">
                <span class="long"></span> 基础信息
            </div>
            <div class="basic_title" style="display:flex;flex-wrap:wrap;align-items:center;margin-left: 80px;">
                <div style="margin-top:20px;width: 330px;" >
                    <span class="Red">*</span>
                    <span>商品名称</span>
                    <el-input placeholder="请输入商品名称" style="width:250px;margin-left:10px" v-model="projectName"
                        size="mini"></el-input>
                </div>
                <div style="margin-top:20px;width: 330px;">
                    <span class="Red" style="visibility: hidden;">*</span>
                    <span class="Right">副标题</span>
                    <el-input placeholder="请输入副标题" style="width:250px;" v-model="projectSubtitle" size="mini"></el-input>
                </div>
                <div style="margin-top:20px;width: 330px;">
                    <span class="Red">*</span>
                    <span>商品分类</span>
                    <el-input placeholder="请选择商品分类" style="width:250px;margin-left:10px" v-model="projectType"
                        @focus="focusAll" size="mini"></el-input>
                </div>
                <div style="margin-top:20px;width: 330px;">
                    <span class="Red">*</span>
                    <span>分享描述</span>
                    <el-input placeholder="请输入分享描述" style="width:250px;margin-left: 10px;" v-model="shareDescription"
                        size="mini"></el-input>
                </div>
                <div style="margin-top:20px;width: 330px;" class="max">
                    <span class="Red" style="visibility: hidden;">*</span>
                    <span>排序权重</span>
                    <el-input-number placeholder="请输入排序权重" style="width:250px;margin-left: 10px;" v-model="weightSort"
                        size="mini"></el-input-number>
                </div>
                <div style="margin-top:20px;width: 800px;">
                    <span class="Red" style="visibility: hidden;">*</span>
                    <span style="margin-right: 10px;">核销有效期</span>
                    <el-radio v-model="refundFlags" label="1">自下单</el-radio>
                    <el-input style="width:100px;" v-model="cancelDay" :disabled="refundFlags == 2" size="mini"></el-input>
                    <span class="Left">天</span>
                    <el-radio v-model="refundFlags" label="2" class="Left">固定时间段</el-radio>
                    <el-date-picker v-model="value1" :disabled="refundFlags == 1" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
                    </el-date-picker>
                </div>
                <div style="margin-top:20px;width: 200px;">
                    <span class="Right">优惠券商品</span>
                    <el-checkbox v-model="checked">商品优惠券</el-checkbox>
                </div>
                <div style="margin-top:20px;width: 280px;">
                    <span class="Red">*</span>
                    <span class="Right">服务类型</span>
                    <el-radio v-model="makeType" label="1">付费预约</el-radio>
                    <el-radio v-model="makeType" label="2">免费预约</el-radio>
                </div>
                <div style="margin-top:20px;width: 220px;margin-left: 10px;">
                    <span class="Red">*</span>
                    <span class="Right">是否可退</span>
                    <el-radio v-model="refundFlag" label="0">是</el-radio>
                    <el-radio v-model="refundFlag" label="1">否</el-radio>
                </div>
                <div style="margin-top:20px;width: 280px;">
                    <span class="Red">*</span>
                    <span class="Right">付款方式</span>
                    <el-radio v-model="payType" label="0">全款</el-radio>
                    <el-radio v-model="payType" label="1">预约金尾款</el-radio>
                </div>
                <div style="margin-top:20px;margin-right: 10px;">
                    <span class="Right">每人限购</span>
                    <el-select v-model="restrictionType" placeholder="请选择" size="mini">
                        <el-option v-for="item in newoptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                    <span class="Right" style="margin-left: 10px;" v-show="showFlag"><span style="color:red">*</span>
                        限购</span>
                    <el-input style="width: 100px;" v-show="showFlag" v-model="restrictionNum" size="mini">

                    </el-input>
                </div>
                <div style="margin-top:20px;width: 280px;">
                    <span style="color:red">*</span><span>商品类型</span>
                    <el-select v-model="newoptionslolpl" placeholder="请选择" size="mini" style="margin-left:20px">
                        <el-option v-for="item in newoptionslol" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!-- <div style="margin-top:20px;margin-left:15px">
                    <span class="Right">副标题</span>
                    <el-input placeholder="请输入副标题" style="width:250px;" v-model="projectSubtitle" size="mini"></el-input>
                </div>
                <div style="margin-top:20px;margin-left:10px">
                    <span class="Red">*</span>
                    <span>商品分类</span>
                    <el-input placeholder="请选择商品分类" style="width:250px;margin-left:10px" v-model="projectType"
                        @focus="focusAll" size="mini"></el-input>
                </div>
                <div style="margin-top:20px">
                    <span style="color:red;margin-left: 10px;">*</span> <span style="margin-left: 0px;">分享描述</span>
                    <el-input placeholder="请输入分享描述" style="width:250px;margin-left: 20px;" v-model="shareDescription"
                        size="mini"></el-input>
                </div>
                <div style="margin-top:20px;margin-left:10px" class="max">
                    <span class="Right">排序权重</span>
                    <el-input-number placeholder="" style="width:150px;" v-model="weightSort" size="mini"></el-input-number>
                    <span style="color:red;margin-left: 20px;">输入数字</span>
                </div>
                <div style="margin-top:20px" class="Lefts">
                    <span class="Right">核销有效期</span>
                    <el-radio v-model="refundFlags" label="1">自下单</el-radio>
                    <el-input style="width:100px;" v-model="cancelDay" :disabled="refundFlags == 2" size="mini"></el-input>
                    <span class="Left">天</span>
                    <el-radio v-model="refundFlags" label="2" class="Left">固定时间段</el-radio>
                    <el-date-picker v-model="value1" :disabled="refundFlags == 1" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
                    </el-date-picker>
                </div>
                <div style="margin-top:20px;margin-left:10px">
                    <span class="Right">优惠券商品</span>
                    <el-checkbox v-model="checked">商品优惠券</el-checkbox>
                </div>

                <div style="margin-top:20px;margin-left:15px">
                    <span class="Red">*</span>
                    <span class="Right">服务类型</span>
                    <el-radio v-model="makeType" label="1">付费预约</el-radio>
                    <el-radio v-model="makeType" label="2">免费预约</el-radio>
                </div>

                <div style="margin-top:20px;margin-left:15px">
                    <span class="Red">*</span>
                    <span class="Right">是否可退</span>
                    <el-radio v-model="refundFlag" label="0">是</el-radio>
                    <el-radio v-model="refundFlag" label="1">否</el-radio>
                </div>

                <div style="margin-top:20px;margin-left:10px">
                    <span class="Red">*</span>
                    <span class="Right">付款方式</span>
                    <el-radio v-model="payType" label="0">全款</el-radio>
                    <el-radio v-model="payType" label="1">预约金尾款</el-radio>
                </div>
                <div style="margin-top:20px" class="Lefts">
                    <span class="Right">每人限购</span>
                    <el-select v-model="restrictionType" placeholder="请选择" size="mini">
                        <el-option v-for="item in newoptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                    <span class="Right" style="margin-left: 10px;" v-show="showFlag"><span style="color:red">*</span>
                        限购</span>
                    <el-input style="width: 100px;" v-show="showFlag" v-model="restrictionNum" size="mini">

                    </el-input>
                </div>
                <div style="margin-top:20px" class="Lefts">
                    <span style="color:red">*</span><span>商品类型</span>
                    <el-select v-model="newoptionslolpl" placeholder="请选择" size="mini" style="margin-left:20px">
                        <el-option v-for="item in newoptionslol" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div> -->

            </div>


            <div class="basic">
                <span class="long"></span> 规格信息
            </div>
            <div class="basic_title">
                <div v-for="(item, index) in list" style="display: flex;flex-wrap: wrap;align-items: center;margin-left: 60px;">
                    <div style="margin-top:20px;width: 240px;"  v-show="item.flag == true">
                        <span class="Red">*</span>
                        <span class="Right">规格类型</span>
                        <el-select v-model="item.specsType" placeholder="请选择" size="mini" style="width: 150px;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" >
                            </el-option>
                        </el-select>
                    </div>
                    <div style="margin-top:20px;width: 240px;"  >
                        <span class="Red">*</span>
                        <span class="Right">商品规格</span>
                        <el-input placeholder="请输入商品规格" style="width:150px;" v-model="item.specs" size="mini"></el-input>
                    </div>
                    <div style="margin-top:20px;width: 240px;" class="max" >
                        <span class="Red">*</span>
                        <span class="Right">销售价格</span>
                        <el-input-number placeholder="请输入销售价格" style="width:150px;" v-model="item.sellingPrice" size="mini"></el-input-number>
                    </div>
                    <div style="margin-top:20px;width: 240px;" class="max" >
                        <span class="Red">*</span>
                        <span class="Right">商品原价</span><el-input-number placeholder="请输入商品原价" style="width:150px;" v-model="item.originalPrice" size="mini"></el-input-number>
                    </div>
                    <div style="margin-top:20px;width: 240px;" class="max" >
                        <span class="Red">*</span>
                        <span class="Right">销售库存</span>
                        <el-input-number placeholder="请输入销售库存" style="width:150px;" v-model="item.inventoryNum" size="mini"></el-input-number>
                    </div>
                    <div style="margin-top:20px;width: 240px;" class="max" >
                        <span class="Red">*</span>
                        <span class="Right">虚拟销量</span>
                        <el-input-number placeholder="请输入虚拟销量" style="width:150px;" v-model="item.virtualSales" size="mini"></el-input-number>
                    </div>
                    <div style="margin-top:20px;width: 240px;display: flex;align-items: center;" class="max" >
                        <span class="Red" style="visibility: hidden;">*</span>
                        <span class="Right">关联产品</span>
                        <div style="display:inline-block">
                            <div style="display:flex;align-items:center">
                                <div style="display:inline-block;width:150px;height:30px;border:1px solid #eee;background-color:#fff;text-align:center;line-height:30px"
                                    @click="addfocus(index)">{{ item.itemName }}</div>
                            </div>
                        </div>
                        <!-- <el-input-number placeholder="请输入虚拟销量" style="width:150px;" v-model="item.virtualSales" size="mini"></el-input-number> -->
                    </div>
                    <div style="margin-top:20px;width:50px;" class="max" >
                        <el-button type="text" size="mini" @click="newdeletes(index)" v-show="index > 0"
                            style="margin-left: 20px;">删除</el-button>
                    </div>
                    <!-- <div style="margin-top:20px;">
                        <span class="Red" :style="{marginLeft:index<=0?'10px':'60px'}">*</span>
                        <span class="Right">商品规格</span>
                        <el-input placeholder="请输入商品规格" style="width:150px;" v-model="item.specs" size="mini"></el-input>
                    </div>
                    <div style="margin-top:20px;width: 235px;margin-left: 12px;" class="max">
                        <span class="Red">*</span>
                        <span class="Right">销售价格</span>
                        <el-input-number placeholder="请输入销售价格" style="width:150px;" v-model="item.sellingPrice" size="mini"></el-input-number>
                
                    </div>
                    <div style="margin-top:20px;" class="max">
                        <span class="Red" style="margin-left: 10px;">*</span>
                        <span class="Right">商品原价</span><el-input-number placeholder="请输入商品原价" style="width:150px;" v-model="item.originalPrice" size="mini"></el-input-number>
                    </div>
                    <div style="margin-top:20px;overflow:hidden;margin-left: 10px;" class="max">
                        <span class="Red">*</span>
                        <span class="Right">销售库存</span>
                        <el-input-number placeholder="请输入销售库存" style="width:150px;" v-model="item.inventoryNum" size="mini"></el-input-number>
                        <span class="Red" style="margin-left: 10px;">*</span>
                        <span class="Right">虚拟销量</span>
                        <el-input-number placeholder="请输入虚拟销量" style="width:150px;" v-model="item.virtualSales" size="mini"></el-input-number>
                        <div style="display:inline-block">
                            <div style="display:flex;align-items:center">
                                <span class="Right" style="margin-left: 20px;">关联产品</span>
                                <div style="display:inline-block;width:150px;height:30px;border:1px solid #eee;background-color:#fff;text-align:center;line-height:30px"
                                    @click="addfocus(index)">{{ item.itemName }}</div>
                            </div>
                        </div>
                        <el-button type="text" size="mini" @click="newdeletes(index)" v-show="index > 0"
                            style="margin-left: 20px;">删除</el-button>
                    </div> -->
                </div>
                <el-button type="success" size="mini" @click="add" icon="el-icon-plus"
                    v-show="list[0].specsType == '1'">新增规格</el-button>
            </div>
            <!-- 服务保障 -->
            <div class="basic">
                <span class="long"></span> 服务保障
            </div>
            <div class="basic_title">
                <div style="margin-top:20px" class="Lefts">
                    <span class="Red">*</span>
                    <span class="Right">放心购物</span>
                    <el-radio v-model="easeFalg" label="1">展示</el-radio>
                    <el-radio v-model="easeFalg" label="2">不展示</el-radio>
                </div>
                <div style="margin-top:20px" class="Lefts">
                    <span class="Red">*</span>
                    <span class="Right">私信咨询</span>
                    <el-radio v-model="consultFlag" label="1">展示</el-radio>
                    <el-radio v-model="consultFlag" label="2">不展示</el-radio>
                </div>
                <div style="margin-top:20px" class="Lefts">
                    <span class="Red">*</span>
                    <span class="Right">消费流程</span>
                    <el-radio v-model="processFlag" label="1">展示</el-radio>
                    <el-radio v-model="processFlag" label="2">不展示</el-radio>
                </div>
                <div style="margin-top:20px" class="Lefts">
                    <span class="Red">*</span>
                    <span class="Right">注意事项</span>
                    <el-radio v-model="noticeFlag" label="1">展示</el-radio>
                    <el-radio v-model="noticeFlag" label="2">不展示</el-radio>
                </div>
                <!-- <div style="display: flex;margin-top: 20px;height: 202px;width: 1500px;" v-show="newnoticeFlag">
                    <div style="width:90px;">
                        注意事项图片
                    </div>
                    <div style="margin-left: 10px;width: 1200px;">
                        <div v-for="(items, indexs) in uploadlist.slice(0, 1)">
                            <input type="file" :ref="'title_img' + items.name" style="display: none;" @change="selchange">
                            <div class="busic_img">
                                <div v-for="(item, index) in items.value" :key="index" class="busic_img_children"
                                    @mouseover="newdelete(index, items.name, indexs)"
                                    @mouseleave="newleave(index, items.name, indexs)"
                                    :style="{ marginLeft: index % 2 == 0 ? '0px' : '10px', marginTop: '10px', border: item.border, width: items.width, height: items.height }">
                                    <div class="busic_imgs" @click="addlist(index, 'title_img' + items.name, indexs)"
                                        v-if="item.imgUrl == ''" :style="{ marginLeft: items.left, marginTop: items.top }">
                                        <img src="@/assets/images/add.png" alt="">
                                    </div>
                                    <div v-else>
                                        <img :src="item.imgUrl" alt=""
                                            :style="{ width: items.width, height: items.height }">
                                    </div>
                                    <div class="title_del" v-show="item.showflag"
                                        @click="deleter(index, items.name, indexs)">
                                        <img src="@/assets/images/del.png" alt="" class="busic_imgs"
                                            :style="{ marginLeft: items.left, marginTop: items.top }">
                                    </div>
                                    <div class="title_right" v-show="item.flags"></div>
                                    <div class="title_success" v-show="item.flags" style="z-index: 100000;">
                                        <img src="@/assets/images/ok.png" alt=""
                                            style="width: 100%;height: 100%;margin-top: 10px;">
                                    </div>
                                </div>
                            </div>
                            <span style="color:red;margin-left: 10px;">{{ items.desc }}</span>
                        </div>

                    </div>
                </div> -->
                <div style="display: flex;height: 350px;width: 1600px;margin-top:20px" v-show="newnoticeFlag">
                    <span style="color:red">*</span> <span style="margin-left: 10px;"> 注意事项内容</span>
                    <div ref="editor" style="margin-left: 20px;"></div>
                </div>
            </div>
            <div class="basic">
                <span class="long"></span> 其他信息
            </div>
            <!-- <div class="basic_title">
                <div style="margin-top:20px" class="Lefts">
                    <span class="Right">每人限购</span>
                    <el-select v-model="restrictionType" placeholder="请选择">
                        <el-option v-for="item in newoptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                    <span class="Right" style="margin-left: 50px;" v-show="showFlag"><span style="color:red">*</span>
                        限购</span>
                    <el-input style="width: 250px;" v-show="showFlag" v-model="restrictionNum">

                    </el-input>
                </div>
                <div style="margin-top:20px" class="Lefts">
                    <span class="Right">排序权重</span>
                    <el-input placeholder="" style="width:350px;" v-model="weightSort"></el-input>
                    <span style="color:red;margin-left: 20px;">输入数字</span>
                </div>
            </div> -->
            <!-- asdasd
            uploadlist -->
            <div style="display: flex;height: 350px;width: 1600px;margin-top: 20px;" >
                <span style="color:red;margin-left: 75px;">*</span> <span style=""> 商品详情</span>
                <div ref="editors" style="margin-left: 20px;"></div>
            </div>
            <!-- <div style="display: flex;width: 1600px;margin-top: 20px;" v-show="newnoticeFlag">
                <span style="color:red;margin-left: 75px;">*</span> <span style="margin-left: 0px;">分享描述</span>
                <el-input placeholder="请输入分享描述" style="width:350px;margin-left: 20px;"
                    v-model="shareDescription"></el-input>
            </div> -->

            <div style="display: flex;margin-top: 20px;height: 202px;width: 1500px;" 
                v-for="(items, indexs) in uploadlist.slice(1, 6)">
                <div style="width:90px;margin-left: 60px;">
                    <span style="color:red" v-show="items.Name == '商品头图'">*</span> {{ items.Name }}
                </div>
                <div style="width: 1200px;">
                    <div>
                        <input type="file" :ref="'title_img' + items.name" style="display: none;" @change="selchange">
                        <div class="busic_img">
                            <div v-for="(item, index) in items.value" :key="index" class="busic_img_children"
                                @mouseover="newdelete(index, items.name, indexs + 1)"
                                @mouseleave="newleave(index, items.name, indexs + 1)"
                                :style="{ marginLeft: index % 2 == 0 ? '0px' : '10px', marginTop: '10px', border: item.border, width: items.width, height: items.height }" @click="addlist(index, 'title_img' + items.name, indexs + 1)">
                                <div class="busic_imgs" 
                                    v-if="item.imgUrl == ''" :style="{ marginLeft: items.left, marginTop: items.top }">
                                    <img src="@/assets/images/add.png" alt="">
                                </div>
                                <div v-else>
                                    <img :src="item.imgUrl" alt="" :style="{ width: items.width, height: items.height }">
                                </div>
                                <div class="title_del" v-show="item.showflag"
                                    @click="deleter($event,index, items.name, indexs + 1)">
                                    <img src="@/assets/images/del.png" alt="" class="busic_imgs"
                                        :style="{ marginLeft: items.left, marginTop: items.top }">
                                </div>
                                <div class="title_right" v-show="item.flags"></div>
                                <div class="title_success" v-show="item.flags" style="z-index: 100000;">
                                    <img src="@/assets/images/ok.png" alt=""
                                        style="width: 100%;height: 100%;margin-top: 10px;">
                                </div>
                            </div>
                        </div>
                        <span style="color:red;margin-left: 10px;">{{ items.desc }}</span>
                    </div>

                </div>
            </div>
        </div>
        <!-- <div class="bottom">
            <div style="width: 200px;height:80px;">
                <el-button type="primary" size="mini" style="margin-left: 70px;margin-top: 30px;" @click="submit">
                    提交
                </el-button>
            </div>
        </div> -->
        <sgDialog title="请选择商品分类" size="25%" out-top="2%" :dialog="showDig" @handleClose="closeRoomDialogtooth">
            <div slot="out">
                <span style="color:red">*</span> <span>商品分类</span>
                <span>
                    <el-select v-model="value" placeholder="请选择" size="mini" style="margin-left: 20px;"
                        @change="selectchange">
                        <el-option v-for="item in newoptionsl" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </span>
                <el-button type="success" size="mini" style="margin-left: 20px;" @click="newaddlist">
                    去新建分类
                </el-button>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok">确定</el-button>
                        <el-button @click="closeRoomDialogteeth" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
        <sgDialog title="选择关联产品" size="1100px" out-top="2%" :dialog="projectdialog"
            @handleClose="projectdialogcloseRoomDialogtooth">
            <div slot="out">
                <span style="color:red">*</span> <span>产品名称</span>
                <span>
                    <el-input v-model="project_name" style="width: 200px;margin-left:10px" size="mini"></el-input>
                </span>
                <span style="margin-left:20px">预约科室：</span>
                <!-- <el-select v-model="value" placeholder="请选择" size="mini" style="width:150px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select> -->
                <el-select v-model="departmentId" class="fullInput" clearable filterable @change="departmentid" size="mini"
                    style="width:150px">
                    <el-option v-for="item in postOptions" :key="item.departmentId" :label="item.departmentName"
                        :value="item.departmentId" />
                </el-select>

                <span style="margin-left:20px">预约类型：</span>
                <el-select v-model="newprojectTypeId" class="fullInput" clearable filterable size="mini" style="width:150px"
                    @change="newcategoryId">
                    <el-option v-for="item in projectType" :key="item.departmentId" :label="item.projectTypeName"
                        :value="item.projectTypeId" />
                </el-select>
                <el-select v-model="categoryId" class="fullInput" clearable size="mini" style="width:150px;margin-left: 10px;"
                    @change="categoryIds" >
                    <el-option v-for="item in category" :key="item.categoryId" :label="item.categoryName"
                        :value="item.categoryId" />
                </el-select>
                <el-button type="primary" size="mini" style="margin-left: 20px;" @click="searchProject">搜索</el-button>
                <div style="height: 250px;width:95%;overflow-y: scroll;" class="abs" >
                    <el-table :data="tableData" style="width: 100%" @row-click='selechColums' ref="newtable"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column prop="projectName" label="项目名称" width="320" align="center">
                        </el-table-column>
                        <el-table-column prop="priceOne" label="价格" width="320" align="center">
                        </el-table-column>
                        <el-table-column prop="specs" label="规格" width="320" align="center">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagation">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage4" :page-sizes="[1, 2, 3, 5]" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
                <div style="height: 40px;">

                </div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;margin-left:900px">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" @click="okprojext" size="mini">确定</el-button>
                        <el-button @click="closeRoomDialogteethokprojext" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
    </div>
</template>
<script>
import E from 'wangeditor'
import sgDialog from '@/components/Dialog/index'
import vm from '@/utils/util'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
export default {
    components: {
        sgDialog
    },
    watch: {
        noticeFlag(newV) {
            if (newV == '1') {
                this.newnoticeFlag = true
            } else {
                this.newnoticeFlag = false;
            }
        },
        restrictionType(newV) {
            if (newV !== '0') {
                this.showFlag = true;
            } else {
                this.showFlag = false;
            }
        },
        spec(newV) {
            if (newV == 0) {
                this.showFlags = false;
            } else {
                this.showFlags = true
            }

        },
        radio(newV) {
            if (newV == '1') {
                this.showFlags = true;
            } else {
                this.showFlags = false;
            }
        }
    },
    created() {
        this.deptId = this.$store.getters.departmentId;
        let data = {
            deptId: this.deptId,
            isDepartment: "1"
        }
        this.$api.dept.DepartmentList(data, 'get').then((res) => {
            if (res) {
                //    console.log(res.rows,'dsafdsfdsfdsfds')
                this.postOptions = res.rows
            }
        })
        
        let datas = {
            deptId: this.deptId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }
        this.$api.confinementRoom.productCategorylist(datas).then(res => {
             let list=[];
            res.rows.forEach(value => {
                value.value = value.categoryId;
                value.label = value.categoryName
            })
            res.rows.forEach(value=>{
                if(value.enableFlag==0){
                    list.push(value)
                }
            })
            this.newoptionsl = list;
        })

    },
    mounted() {

        let flag = localStorage.getItem('ifshowtalFlag')
        if (flag == 'true') {
            let ids = JSON.parse(localStorage.getItem('ifshowtal'));
            this.projectName = ids.projectName;
            this.checked = ids.couponFlag == 0 ? true : false
            this.projectSubtitle = ids.projectSubtitle;
            this.makeType = ids.makeType;
            let str = '';
            this.newoptionsl.forEach(value => {
                if (value.value == ids.categoryId) {
                    str = value.label;
                }
            })
            this.productId = ids.productId;
            this.projectType = str;
            this.refundFlag = ids.refundFlag;
            this.cancelDay = ids.cancelDay;
            this.newoptionslolpl=ids.productType;
            if (ids.cancelStart == null || this.cancelEnd == '') {
                this.value1 = ''
            } else {
                this.value1 = [new Date(ids.cancelStart), new Date(ids.cancelEnd)];
            }

            this.payType = ids.payType;
            this.easeFalg = ids.easeFalg;
            this.consultFlag = ids.consultFlag,
                this.processFlag = ids.processFlag;
            this.noticeFlag = ids.noticeFlag;
            this.restrictionType = ids.restrictionType+"";
            this.restrictionNum = ids.restrictionNum;
            this.weightSort = ids.weightSort;
            let data = {
                deptId: this.deptId,
                projectName: this.project_name,
            }
            this.$api.product.productManagement(data).then(res => {

                ids.productSpecInfo.forEach((value, index) => {
                    value.newspec = '0';
                    if (index == 0) {
                        value.flag = true
                    }
                    res.rows.forEach(newvalue => {
                        if (newvalue.itemId == value.itemId) {
                            value.itemName = newvalue.projectName
                        }
                    })
                })

                this.list = ids.productSpecInfo;
            })

            this.shareDescription = ids.shareDescription;
            let object = {
                'head': [],
                'share': [],
            }
            ids.productPhoto.forEach(value => {
                if (value.photoType == '13') {
                    object['head'].push(value)
                } else if (value.photoType == '15') {
                    object['share'].push(value)

                }
            })
            if (object.head.length == 0) {

            } else {
                this.fileList['head'] = object.head
                this.uploadlist[1].value[0].imgUrl = serverPath + object.head[0].photoAddr;
                this.uploadlist[1].value[0].flags = true;
            }
            if (object.share.length == 0) {

            } else {
                this.fileList['share'] = object.share
                this.uploadlist[2].value[0].imgUrl = serverPath + object.share[0].photoAddr;
                this.uploadlist[2].value[0].flags = true;
            }
            // if (ids.productPhoto == null) {

            // } else {
            //     this.fileList['head'] = ids.productPhoto
            //     if (ids.productPhoto.length > 1) {
            //         this.uploadlist[1].value[0].imgUrl = serverPath + ids.productPhoto[0].photoAddr;
            //         this.uploadlist[1].value[0].flags = true;
            //         ids.productPhoto.forEach(value => {
            //             this.uploadlist[1].value.push({
            //                 imgUrl: serverPath + value.photoAddr,
            //                 border: '1px dashed #d9d9d9',
            //                 showflag: false,
            //                 flags: true,
            //             })
            //         })
            //         this.uploadlist[1].value.push(
            //             {
            //                 imgUrl: "",
            //                 border: '1px dashed #d9d9d9',
            //                 showflag: false,
            //                 flags: false,
            //             }
            //         )
            //     } else {
            //         this.uploadlist[1].value[0].imgUrl = serverPath + ids.productPhoto[0].photoAddr;
            //         this.uploadlist[1].value[0].flags = true;
            //         this.uploadlist[1].value.push(
            //             {
            //                 imgUrl: "",
            //                 border: '1px dashed #d9d9d9',
            //                 showflag: false,
            //                 flags: false,
            //             }
            //         )
            //     }
            // }
            //          if(ids.productSpecInfo==null){

            // }else{
            //    if(ids.productSpecInfolength>1){
            //        this.uploadlist[2].value[0].imgUrl= serverPath+ids.productSpecInfo[0].photoAddr;
            //        this.uploadlist[2].value[0].flags=true
            //    }else{
            //        this.uploadlist[2].value[0].imgUrl= serverPath+ids.productSpecInfo[0].photoAddr;
            //        this.uploadlist[2].value[0].flags=true;
            //        this.uploadlist[2].value.push(
            //            {
            //                imgUrl: "",
            //                border: '1px dashed #d9d9d9',
            //                showflag: false,
            //                flags: false,
            //            }
            //        )
            //    }
            // }
            // if (ids.sharePhoto == null || ids.sharePhoto.length == 0) {

            // } else {
            //     this.fileList['share'] = ids.sharePhoto
            //     if (ids.sharePhoto.length > 1) {
            //         this.uploadlist[2].value[0].imgUrl = serverPath + ids.sharePhoto[0].photoAddr;
            //         this.uploadlist[2].value[0].flags = true
            //         ids.sharePhoto.forEach(value => {
            //             this.uploadlist[2].value.push({
            //                 imgUrl: serverPath + value.photoAddr,
            //                 border: '1px dashed #d9d9d9',
            //                 showflag: false,
            //                 flags: true,
            //             })
            //         })
            //         this.uploadlist[2].value.push(
            //             {
            //                 imgUrl: "",
            //                 border: '1px dashed #d9d9d9',
            //                 showflag: false,
            //                 flags: false,
            //             }
            //         )
            //     } else {
            //         this.uploadlist[2].value[0].imgUrl = serverPath + ids.sharePhoto[0].photoAddr;
            //         this.uploadlist[2].value[0].flags = true;
            //         this.uploadlist[2].value.push(
            //             {
            //                 imgUrl: "",
            //                 border: '1px dashed #d9d9d9',
            //                 showflag: false,
            //                 flags: false,
            //             }
            //         )
            //     }
            // }
            //  this.uploadlist[1]
            //  projectName: this.projectName,//商品名称
            //         couponFlag: this.checked == true ? '1' : "0",//优惠券商品
            //         projectSubtitle: this.projectSubtitle,//副标题
            //         makeType: this.makeType,//服务类型
            //         refundFlag: this.refundFlag,//是否可退
            //         cancelDay: this.cancelDay,//核销有效期，
            //         cancelStart: this.value1 == '' ? '' : this.newgetData(this.value1[0]),//核销开始时间
            //         cancelEnd: this.value1 == '' ? '' : this.newgetData(this.value1[1]),//核销结束时间
            //         payType: this.payType,//f付款方式
            //         projectTypeId: this.projectTypeId,
            //         // specs: "",//规格类型
            //         // sellingPrice: '',//销售价格
            //         // originalPrice: "",//商品原价
            //         // inventoryNum: "",//库存
            //         // virtualSales: "",//虚拟销量
            //         easeFalg: this.easeFalg,//放心购
            //         consultFlag: this.consultFlag,//私信咨询
            //         processFlag: this.processFlag,//消费流程
            //         noticeFlag: this.noticeFlag,//是否注意事项
            //         noticeContent: this.noticeContent,//注意事项内容
            //         restrictionType: this.restrictionType,//限购类型
            //         restrictionNum: this.restrictionNum,//限购次数
            //         weightSort: this.weightSort,//排序
            //         productSpecInfo: this.list,//规格,
            //         productDetails: this.productDetails,
            //         shareDescription: this.shareDescription,
            let datas = {
                deptId: this.deptId,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            this.$api.confinementRoom.productCategorylist(datas).then(res => {
                res.rows.forEach(value => {
                    value.value = value.categoryId;
                    value.label = value.categoryName
                })
                this.newoptionsl = res.rows;
                this.newoptionsl.forEach(value => {
                    if (value.categoryId == ids.categoryId) {
                        this.projectType = value.categoryName
                    }

                })
            })
        } else {
           
            // localStorage.setItem('ifshowtalFlag',false)
        }
        this.editor = new E(this.$refs.editor)
        /*设置存储照片的格式*/
        this.editor.config.uploadImgShowBase64 = true // base 64 存储图片
        // this.editor.config.uploadImgServer = this.UploadVidio// 配置服务器端地址
        // this.editor.config.uploadImgHeaders = {}// 自定义 header
        this.editor.config.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
        this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

        // 配置菜单
        this.editor.config.menus = [
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            'table', // 表格
            'video', // 插入视频
            'code', // 插入代码
            'undo', // 撤销
            'redo', // 重复
            'fullscreen' // 全屏
        ]
        this.editor.config.onchange = (html) => {
            this.noticeContent = html // 绑定当前逐渐地值
            this.$emit('change', this.info_) // 将内容同步到父组件中
        }
        // 创建富文本编辑器
        this.editor.create();
        let flagedit = localStorage.getItem('ifshowtalFlag')
        let ids = JSON.parse(localStorage.getItem('ifshowtal'));
        if (flagedit == 'true') {
            this.editor.txt.html(ids.noticeContent)
        } else {
            this.editor.txt.html('')
        }

        this.editors = new E(this.$refs.editors)
        /*设置存储照片的格式*/
        this.editors.config.uploadImgShowBase64 = true // base 64 存储图片
        this.editors.config.uploadImgServer = this.UploadVidio// 配置服务器端地址
        this.editors.config.uploadImgHeaders = {}// 自定义 header
        this.editors.config.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editors.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        this.editors.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
        this.editors.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

        // 配置菜单
        this.editors.config.menus = [
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            'table', // 表格
            'video', // 插入视频
            'code', // 插入代码
            'undo', // 撤销
            'redo', // 重复
            'fullscreen' // 全屏
        ]

        this.editors.config.uploadImgHooks = {
            fail: (xhr, editors, result) => {
                // 插入图片失败回调
            },
            success: (xhr, editors, result) => {
                // 图片上传成功回调
            },
            timeout: (xhr, editors) => {
                // 网络超时的回调
            },
            error: (xhr, editors) => {
                // 图片上传错误的回调
            },
            customInsert: (insertImg, result, editors) => {
                // 图片上传成功，插入图片的回调
                //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
                // console.log(result.data[0].url)
                //insertImg()为插入图片的函数
                //循环插入图片
                // for (let i = 0; i < 1; i++) {
                // console.log(result)
                let url = this.UploadVidio
                insertImg(url)
                // }
            }
        }
        this.editors.config.onchange = (html) => {
            this.productDetails = html // 绑定当前逐渐地值
            this.$emit('change', this.info_) // 将内容同步到父组件中
        }
        // 创建富文本编辑器
        this.editors.create();
        if (flagedit == 'true') {
            this.editors.txt.html(ids.productDetails)
        } else {

        }

    },
    methods: {
        selechColums(row) {
            this.selectdata.push(row)
            this.$nextTick(() => {
                this.$refs.newtable.clearSelection()
                this.$refs.newtable.toggleRowSelection(row)
            })

        },
        handleSizeChange(e) {
            // this.pageSize = e;
            this.searchProject();
        },
        handleCurrentChange(e) {
            this.pageNum = e;
            this.searchProject();
        },
        newcategoryId(e) {
            this.categoryId = '';
            this.$api.dept.CategoryList({ projectTypeId: e }, 'get').then((res) => {
                if (res) {
                    this.category = res.rows
                }
            })
        },
        categoryIds() {

        },
        submitback() {
            vm.$emit('closeTag', this.$route.path);
        },
        categoryIds(e) {
            this.$api.dept.CategoryList({ projectTypeId: e }, 'get').then((res) => {
                if (res) {
                    this.category = res.rows
                }
            })
        },
        departmentid(event) {
            this.newprojectTypeId = '';
            this.categoryId = '';
            this.$api.dept.TypeList({ departmentId: event }, 'get').then((res) => {
                if (res) {
                    let count = 0;
                    res.rows.forEach(value => {
                        count++;
                        value.departmentId = count
                    })
                    this.projectType = res.rows;

                }
            })
        },
        closeRoomDialogteethokprojext() {
            this.projectdialog = false;
        },
        newdeletes(index) {
            this.list.splice(index, 1)
        },
        searchProject() {
            // if(this.project_name==''){
            //     this.$message.warning('请输入产品名称');
            //     return;
            // }
            // if(this.departmentId==''){
            //     this.$message.warning('请选择预约科室');
            //     return;
            // }
            // if(this.newprojectTypeId==''){
            //     this.$message.warning('请选择预约类型');
            //     return;
            // }
            // if(this.categoryId==''){
            //     this.$message.warning('请选择预约类型');
            //     return;
            // }

            let data = {
                deptId: this.deptId,
                projectName: this.project_name,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                categoryId: this.categoryId
            }
            this.$api.product.productManagement(data).then(res => {
                this.tableData = res.rows;
                this.total = res.total

                // console.log(this.optionsos, '______________')
            })
        },
        okprojext() {
            if (this.selectdata.length == 0 || this.selectdata.length > 1) {
                this.$message.warning('请至少选择一个产品');
                return;
            } else {
                this.$message.success('选择成功');
                this.list[this.projectIndex].itemName = this.selectdata[0].projectName;
                this.list[this.projectIndex].itemId = this.selectdata[0].itemId;
                this.projectdialog = false;
            }
        },
        handleSelectionChange(e) {
            this.selectdata = e;
        },

        addfocus(index) {
            this.projectdialog = true;
            this.project_name='';
            this.departmentId='';
            this.newprojectTypeId='';
            this.categoryId='';
            this.projectIndex=index;
            this.searchProject();

            // console.log(document.querySelector('.el-checkbox'),'fdsfdsjjfjdsjfjsdojf')
            //         let data={
            //             deptId:this.deptId,
            //             isDepartment:"1"
            //         }
            //         this.$api.dept.DepartmentList(data, 'get').then((res) => {
            //     if (res) {
            //    console.log(res.rows,'dsafdsfdsfdsfds')
            //     //   this.postOptions = res.rows
            //     }
            //   })
            // this.projectIndex = index
            // console.log(this.project_name, '++++++++++++++')
            // let data = {
            //     deptId: this.deptId,
            //     projectName: this.project_name,
            // }
            // this.$api.product.productManagement(data).then(res => {
            //     this.tableData = res.rows;

            //     // console.log(this.optionsos, '______________')
            // })
        },
        projectdialogcloseRoomDialogtooth() {
            this.projectdialog = false;
        },
        remoteMethod(query) {
    
            if (query !== '') {
                this.loading = true;

                setTimeout(() => {
                    this.loading = false;
                    let data = {
                        deptId: this.deptId,
                        projectName: query,
                    }
                    this.$api.product.productManagement(data).then(res => {
                        this.optionsos = res.rows;
                       
                    })

                    // this.options = this.list.filter(item => {
                    //   return item.label.toLowerCase()
                    //     .indexOf(query.toLowerCase()) > -1;
                    // });
                }, 200);
            } else {
                this.optionsos = [];
            }
        },
        selectchange(e) {
            this.projectType = e;
        },
        newaddlist() {
            this.$router.push('/typegrammer');
            this.showDig = false
        },
        ok() {
            if (this.value == '') {
                this.$message.warning('请选择商品分类');
                return;
            }
            this.showDig = false;
            this.value = this.projectType;
            let str = '';
            let id = ''
            this.newoptionsl.forEach(value => {
                if (value.value == this.value) {
                    str = value.label;
                    id = value.categoryId;
                }
            })
            this.projectType = str;
            this.projectTypeId = id;

        },
        closeRoomDialogteeth() {
            this.showDig = false;
        },
        closeRoomDialogtooth() {
            this.showDig = false;
        },
        focusAll() {
            this.showDig = true;
        },
        add() {
            this.list.push({
                specs: "",
                sellingPrice: '',//销售价格
                originalPrice: "",//商品原价
                inventoryNum: "",//库存
                virtualSales: "",//虚拟销量
                itemId: "",
                newspec: "0",
                itemName: "",
                specsType:"",
            })
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
            // alert(this.restrictionType)
            if (this.projectName == '') {
                this.$message.warning('请输入商品名称');
                return;
            }
            if (this.projectType == '') {
                this.$message.warning('请选择商品分类');
                return;
            }
            if (this.shareDescription == '') {
                this.$message.warning('请输入分享描述');
                return;
            }
            let flag = false;
            let flags = false;
            let newflag = false;
            let newflags = false;
            let newflg = false;
            this.list.forEach(value => {
                if (value.specs == '') {
                    newflg = true
                }
                if (value.sellingPrice == '') {
                    flag = true
                }
                if (value.originalPrice == '') {
                    flags = true
                }
                if (value.inventoryNum == '') {
                    newflag = true
                }
                if (value.virtualSales == '') {
                    newflags = true
                }
            })
            if (newflg) {
                this.$message.warning('请输入商品规格');
                return;
            }
            if (flag) {
                this.$message.warning('请输入销售价格');
                return;
            }
            if (flags) {
                this.$message.warning('请输入商品原价');
                return;
            }
            if (newflag) {
                this.$message.warning('请输入销售库存');
                return;
            }
            if (newflags) {
                this.$message.warning('请输入虚拟销量');
                return;
            }
            if (this.noticeFlag == 1) {

            } else {
                if (this.noticeContent == '') {
                    this.$message.warning('请输入注意事项内容');
                    return;
                }
            }
            if (this.restrictionType !== '0' && this.restrictionType !== '') {
                if (this.restrictionNum == '') {
                    this.$message.warning('请输入限购');
                    return;
                }
            }
            // if (typeof this.weightSort == 'string') {
            //     this.$message.warning('排序权重请输入数字');
            //     return
            // }
            if (this.newoptionslolpl == '') {
                this.$message.warning('请选择商品类型');
                return;
            }
            if (this.productDetails == '') {
                this.$message.warning('请输入商品详情');
                return;
            }
    
            if (this.uploadlist[1].value[0].imgUrl == '') {
                this.$message.warning('请上传商品头图');
                return;
            }
            // if(typeof this.restrictionType=='number')
            // this.newoptions.forEach(value=>{
            //    if(value.value==this.restrictionType){
            //       strs=value.label
            //    }
            // })
            // return
            let arr = [];
            for (let x in this.fileList) {
                this.fileList[x].forEach((value, index) => {
                    value.deptId = this.deptId;
                    if (x == 'head') {
                        value.photoType = '13'
                        // value.photoName = this.newHonorable[0].value[index].row;
                    }
                    if (x == 'share') {
                        value.photoType = '15'
                    }
                    arr.push(value);
                })
            }
            let arrstr = '';
            arr.forEach((value, index) => {
                if (index == arr.length - 1) {
                    arrstr += JSON.stringify(value)
                } else {
                    arrstr += JSON.stringify(value) + ','
                }
            })
            
           this.list.forEach(value=>{
            value.remark=value.newspec;
           })
            let data = {
                projectName: this.projectName,//商品名称
                couponFlag: this.checked == true ? '1' : "0",//优惠券商品
                projectSubtitle: this.projectSubtitle,//副标题
                makeType: this.makeType,//服务类型
                refundFlag: this.refundFlag,//是否可退
                cancelDay: this.cancelDay,//核销有效期，
                cancelStart: this.value1 == '' ? '' : this.newgetData(this.value1[0]),//核销开始时间
                cancelEnd: this.value1 == '' ? '' : this.newgetData(this.value1[1]),//核销结束时间
                payType: this.payType,//付款方式
                categoryId: this.projectTypeId,//商品分类
                // specs: "",//规格类型
                // sellingPrice: '',//销售价格
                // originalPrice: "",//商品原价
                // inventoryNum: "",//库存
                // virtualSales: "",//虚拟销量
                easeFalg: this.easeFalg,//放心购
                consultFlag: this.consultFlag,//私信咨询
                processFlag: this.processFlag,//消费流程
                noticeFlag: this.noticeFlag,//是否注意事项
                noticeContent: this.noticeContent,//注意事项内容
                restrictionType: this.restrictionType,//限购类型
                restrictionNum: this.restrictionNum,//限购次数
                weightSort: this.weightSort,//排序
                productSpecInfo: this.list,//规格,
                productDetails: this.productDetails,
                shareDescription: this.shareDescription,
                deptId: this.deptId,
                productId: this.productId,
                productType: this.newoptionslolpl,
                photoInfo: arrstr,

            }
            let flagedit = localStorage.getItem('ifshowtalFlag')
            if (flagedit == 'true') {
                this.$api.confinementRoom.productInfoedit(data).then(res => {
                    if (res) {
                        if (res.code == 200) {
                            this.$message.success('修改商品信息成功');
                            vm.$emit('closeTag', this.$route.path);
                            // let newstr = res.data.productId
                            // let arr = [];
                            // for (let x in this.fileList) {
                            //     this.fileList[x].forEach((value, index) => {
                            //         value.entityId = newstr;
                            //         value.deptId = this.deptId;
                            //         if (x == 'head') {
                            //             value.photoType = '13'
                            //             // value.photoName = this.newHonorable[0].value[index].row;
                            //         }
                            //         if (x == 'Card') {
                            //             value.photoType = '14'
                            //         }
                            //         if (x == 'share') {
                            //             value.photoType = '15'
                            //         }
                            //         arr.push(value);
                            //     })
                            // }
                            // this.$api.confinementRoom.photoInfo(arr).then(res => {
                            //     if (res) {
                            //         vm.$emit('closeTag', this.$route.path);
                            //     }
                            //     // console.log(res, 'fdshfjdshfhdsf')
                            // })


                        }
                    }
                })
            } else {
                this.$api.confinementRoom.productInfoadd(data).then(res => {
                    if (res) {
                        if (res.code == 200) {
                            this.$message.success('新增商品信息成功');
                            vm.$emit('closeTag', this.$route.path);
                            // let newstr = res.data.productId
                            // let arr = [];
                            // for (let x in this.fileList) {
                            //     this.fileList[x].forEach((value, index) => {
                            //         value.entityId = newstr;
                            //         value.deptId = this.deptId;
                            //         if (x == 'head') {
                            //             value.photoType = '13'
                            //             // value.photoName = this.newHonorable[0].value[index].row;
                            //         }
                            //         if (x == 'Card') {
                            //             value.photoType = '14'
                            //         }
                            //         if (x == 'share') {
                            //             value.photoType = '15'
                            //         }
                            //         arr.push(value);
                            //     })
                            // }
                            // this.$api.confinementRoom.photoInfo(arr).then(res => {
                            //     if (res) {
                            //         vm.$emit('closeTag', this.$route.path);
                            //     }
                            //     // console.log(res, 'fdshfjdshfhdsf')
                            // })


                        }
                    }
                })
            }
        },
        selchange(e) {
            if (((e.target.files[0].size) / 1048576) > 2) {
                this.$message.warning("上传图片大小请控制在2MB以内");
                return
            }
            if (e.target.files[0].name.split('.')[1] !== 'bmp' && e.target.files[0].name.split('.')[1] !== 'gif' && e.target.files[0].name.split('.')[1] !== 'jpg' && e.target.files[0].name.split('.')[1] !== 'jpeg' && e.target.files[0].name.split('.')[1] !== 'png') {
                this.$message.warning('请上传bmp,gif,jpg,jpeg,png类型的图片');
                return
            }
            if (this.uploadlist[this.Indexs].value.length > this.uploadlist[this.Indexs].num) {
                this.$message.warning(`${this.uploadlist[this.Indexs].des}`)
                return
            }
            // if (this.showstr == 'photo') {
            //     this.uploadlist[this.Indexs].value.push({
            //         imgUrl: "",
            //         border: '1px dashed #d9d9d9',
            //         showflag: false,
            //         flags: false,
            //         ifshow: false,
            //         row: "",
            //     })
            // } else {
            //     this.uploadlist[this.Indexs].value.push({
            //         imgUrl: "",
            //         border: '1px dashed #d9d9d9',
            //         showflag: false,
            //         flags: false,
            //     })
            // }
            let fromdata = new FormData();

            fromdata.append('file', e.target.files[0]);
            this.$api.confinementRoom.unload(fromdata).then(res => {
                let object = {};
                object['photoName'] = res.data.name;
                object['photoAddr'] = res.data.url;
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
            e.target.value=''


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
        deleter(e,index, val, indexs) {
            e.stopPropagation();
            let flag = localStorage.getItem('ifshowtalFlag')
            this.uploadlist[indexs].value.splice(index, 1);
            if (flag) {
                // let id = this.fileList[val][index].photoId;
                // if (id == undefined) {

                // } else {
                //     this.$api.confinementRoom.photoInfodel(id).then(res => {
                //         this.$message.success('删除成功')
                //     })
                // }

            }
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
            
            this.fileList[val].splice(index, 1);
        },
        newdelete(id, val, indexs) {
            if (this.uploadlist[indexs].value[id].imgUrl !== '') {
                this.uploadlist[indexs].value[id].showflag = true;
            }
            this.uploadlist[indexs].value[id].border = '1px dashed blue';
            this.uploadlist[indexs].value[id].flags = false;
        },
    },
    data() {
        return {
            projectIndex: 0,
            newoptionslol: [
                {
                    value: "1",
                    label: "实物"
                },
                {
                    value: "2",
                    label: "服务"
                }
            ],
            newoptionslolpl: "",
            currentPage4: 1,
            total: 0,
            pageSize: 5,
            pageNum: 1,
            newprojectTypeId: "",
            categoryId: "",
            submitcompant: false,
            departmentId: "",
            postOptions: [],
            projectType: [],
            category: [],
            productId: "",
            projectTypeId: 0,
            productDetails: "",
            shareDescription: "",
            fileList: {},
            tableData: [],
            selectdata: [],
            project_name: "",
            project_names: "",//选择产品
            projectdialog: false,//新增关联产品
            value: '',
            values: "",
            optionsos: [],
            loading: false,
            projectType: '',
            newoptionsl: [],
            showDig: false,//商品分类增加
            newnoticeFlag: true,
            showFlags: false,
            projectName: "",//商品名称
            projectSubtitle: "",//优惠券商品
            makeType: "1",//服务类型
            refundFlag: "0",//是否可退
            cancelDay: "",//核销有效期，
            cancelStart: "",//核销开始时间
            cancelEnd: "",//核销结束时间
            payType: "0",//付款方式
            specs: "",//规格类型
            sellingPrice: '',//销售价格
            originalPrice: "",//商品原价
            inventoryNum: "",//库存
            virtualSales: "",//虚拟销量
            easeFalg: '1',//放心购
            consultFlag: '1',//私信咨询
            processFlag: "1",//消费流程
            noticeFlag: '1',//是否注意事项
            noticeContent: "",//注意事项内容
            restrictionType: "",//限购类型
            restrictionNum: "",//限购次数
            weightSort: "",//排序
            refundFlags: "1",//是否核销有效期
            rows: "",
            Index: 0,
            Indexs: 0,
            showstr: "",
            showFlag: false,
            uploadlist: [
                {
                    name: "Img", Name: "企业图片", desc: '建议图片不超过2MB，最多可以上传5张，建议图片尺寸：（ 若在装修使用：样式一：750 * 750， 样式二 750 * 382）',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张注意事项图片",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px"
                },
                {
                    name: "head", Name: "商品头图", desc: '建议图片不超过2MB）',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张注意事项图片",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px"
                },
                // {
                //     name: "Card", Name: "分享卡片", desc: '建议图片不超过2MB，最多可以上传5张，建议图片尺寸：（ 若在装修使用：样式一：750 * 750， 样式二 750 * 382）',
                //     value: [{
                //         imgUrl: "",
                //         border: '1px dashed #d9d9d9',
                //         showflag: false,
                //         flags: false,
                //     }],
                //     num: 1,
                //     des: "只允许上传1张注意事项图片",
                //     width: '142px',
                //     height: "142px",
                //     left: "56px",
                //     top: "56px"
                // },
                {
                    name: "share", Name: "分享海报", desc: '建议图片不超过2MB',
                    value: [{
                        imgUrl: "",
                        border: '1px dashed #d9d9d9',
                        showflag: false,
                        flags: false,
                    }],
                    num: 1,
                    des: "只允许上传1张注意事项图片",
                    width: '142px',
                    height: "142px",
                    left: "56px",
                    top: "56px"
                },
            ],
            row: "",
            list: [{
                specs: "",
                newspec: '0',
                sellingPrice: '',//销售价格
                originalPrice: "",//商品原价
                inventoryNum: "",//库存
                virtualSales: "",//虚拟销量
                itemId: "",
                flag: true,
            }],
            checked: false,
            showFlags: false,
            radio: '1',
            value1: [],
            spec: '0',
            newoptions: [
                {
                    value: "0",
                    label: '不限购'
                },
                {
                    value: "1",
                    label: '每天'
                },
                {
                    value: "2",
                    label: '每周'
                },
                {
                    value: "3",
                    label: '每月'
                },
                {
                    value: "4",
                    label: '每年'
                },
                {
                    value: "5",
                    label: '终身'
                }
            ],
            options: [
                {
                    value: "0",
                    label: '单规格'
                },
                {
                    value: "1",
                    label: '多规格'
                },

            ]
        }
    }
}
</script>
<style scoped>
::v-deep .abs td{
    padding: 6px !important;
}
::v-deep .max .el-input__inner {
    padding: 0 !important;
    text-align: left;
    padding-left: 20px !important;
}
::v-deep .el-table__header-wrapper .el-checkbox {
    /* // display: none;//设置不成功，页面卡顿 */
    visibility: hidden;
}
::v-deep .el-input-number__decrease {
    display: none !important
}

::v-deep .el-input-number__increase {
    display: none;
}
.pagation {
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

::v-deep .el-pager li.active {
    background-color: #409eff !important;
    color: #fff;
}

::v-deep .w-e-menu:nth-of-type(18) {
    display: none !important;
}

::v-deep .w-e-icon-fullscreen {
    display: none !important;
}

::v-deep .w-e-toolbar {
    z-index: 100 !important;

}

::v-deep .w-e-text {
    width: 810px !important;
    z-index: 1 !important;

}

::v-deep .w-e-text-container {
    z-index: 1 !important;

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

.title_del {
    width: 300px;
    height: 142px;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0.7;
    position: absolute;
    top: 0;
}

.busic_img {
    width: 1200px;
    min-height: 142px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 10px;

}

.busic_img_children {
    width: 1200px;
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

.Lefts {
    margin-left: 60px;
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

* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}

.Red {
    color: red;
}

.Left {
    margin-left: 10px
}

.Right {
    margin-right: 20px
}

.basic_title {
    margin-left: 20px;
    margin-top: 20px;
}

.basic {
    margin-top: 10px;
    margin-left: 20px;
    height: 35px;
    /* border: 1px solid black; */
    border-bottom: 1px solid #eee;
    z-index: 2000000,
}

.long {
    height: 10px;
    border: 2px solid #2b75ed;
    display: inline-block;
}
</style>