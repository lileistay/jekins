<template>
    <div style="margin-top: 50px;margin-left: 20px;">
        <div style="display: flex;">
            <div :class="{ quare: true, active: Active }" @click="prevent">
                1
            </div>
            <div class="quare dot" v-if="isTrue">
                <div class="dots">...</div>
            </div>
            <div class="quare" v-for="(item, index) in pagelist" @click="clickquare(index, item.item)"
                :style="{ background: item.back, color: item.color }">
                {{ item.item }}
            </div>
            <div class="quare dot" v-if="nextisTrue">
                <div class="dots">...</div>
            </div>
            <div :class="{ quare: true,nextActive:newActive }" @click="next">
                {{ total }}
            </div>
        </div>

    </div>
</template>
<script>

export default {
    created() {
        if (this.total > this.normalNum) {
            this.nextisTrue = true;
            this.getlist(this.normalNumStart, this.normalNum)

        }
    },
    props: {
        total: {
            type: Number,
            default: () => {
                return 1
            }
        }
    },
    data() {
        return {
            normalNum: 6,
            normalNumStart: 2,
            newActive:false,
            middNum: 5,
            Active: true,
            isTrue: false,
            pagelist: [],
            nextisTrue: false,
            newactive: false,
            change: false,
        }
    },
    methods: {
        next(){
         this.newActive=true;
         this.pagelist.forEach(value => {
                value.back = '#eee'
                value.color = 'black'
            })
        },
        getlist(min, maxl) {
            for (let max = min; max < maxl; max++) {
                this.pagelist.push({
                    item: max,
                    back: "",
                    color: ""
                })
            }
        },
        prevent() {
            this.Active = true;
            this.pagelist.forEach(value => {
                value.back = '#eee'
                value.color = 'black'
            })
        },
        clickquare(index, item) {
            this.Active = false
            this.newActive=false;
            this.pagelist.forEach(value => {
                value.back = '#eee'
                value.color = 'black'
            })
            this.pagelist[index].back = '#409eff';
            this.pagelist[index].color = '#fff';
            if (!this.change) {
    
                if (item == this.pagelist[this.pagelist.length - 1].item) {
                    if (item + this.middNum < this.total) {
                        this.isTrue = true;
                        this.pagelist = [];
                        this.getlist(item, item + this.middNum)
                        this.pagelist[0].back = '#409eff';
                        this.pagelist[0].color = '#fff';
                    } else {
                        this.nextisTrue = false
                        this.change = true;
                        this.pagelist = [];
                        this.getlist(item - 1, this.total - 1)
                        this.pagelist[1].back = '#409eff';
                        this.pagelist[1].color = '#fff';

                    }
                    return

                }
                if(item==this.pagelist[0].item){
                    if(item-this.middNum==0){
                     if(this.isTrue){
                        this.isTrue=false;
                        this.pagelist=[];
                        this.getlist(item-3,item+1)
                        this.pagelist[this.pagelist.length-1].back = '#409eff';
                        this.pagelist[this.pagelist.length-1].color = '#fff';
                     }
                    }
                }

            }else{
                if(item==this.pagelist[0].item){
                    if(item-this.middNum>0){
                     if(this.isTrue){
                        this.isTrue=false;
                        this.pagelist=[];
                        this.getlist(item-3,item+1)
                        this.pagelist[this.pagelist.length-1].back = '#409eff';
                        this.pagelist[this.pagelist.length-1].color = '#fff';
                     }
                    }
                }
            }

        },
    }
}
</script>

<style scoped>
* {
    font-family: '微软雅黑' !important;
}
.nextActive{
    background-color: #409eff !important;
    color: #fff;
}
.active {
    background-color: #409eff !important;
    color: #fff;
}

.quare {
    width: 20px;
    height: 20px;
    background-color: #eee;
    margin-left: 10px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    cursor: pointer;
}

.dot {
    position: relative;

}

.dots {
    position: absolute;
    text-align: center;
    margin-left: 4px;
    top: -4px
}
</style>