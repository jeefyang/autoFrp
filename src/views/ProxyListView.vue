<script setup lang="ts">
import { ref } from "vue"
import PopupProxyList from "@/components/PopupProxyList.vue"
import { createProxyStore } from "@/tool"

const showEdit = ref(false)
const proxySite = ref(<number>-1)
const proxyData = ref(createProxyStore())

const setShow = () => {
    showEdit.value = true
    console.log("hello")
}

</script>
<template>

    <div class="big">

        <div class="content">
            <div class="display">

            </div>

        </div>
        <div class="buttomDiv">
            <div class="pos">
                <van-button class="btn" type="primary" @click="setShow">添加</van-button>
                <van-button class="btn" type="primary">应用</van-button>
                <van-button class="btn" type="primary">保存</van-button>
                <van-button class="btn" type="primary">重置</van-button>
                <van-button class="btn" type="primary">云端</van-button>
                <van-button class="btn" type="primary">初始化</van-button>
            </div>
        </div>
    </div>
    <PopupProxyList v-model:show="showEdit" :data="proxyData"></PopupProxyList>
</template>
<style scoped>
.big {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: 100%;
}

.content {
    flex-grow: 1;
    overflow: hidden;
}

.display {
    width: 100%;
    position: relative;
    height: 96%;
    top: 2%;
    overflow: auto
}

.btn {
    flex-grow: 1;
    margin: 0px 5px 0px 5px;
}

.pos {
    display: flex;
}

.buttomDiv {
    /* bottom: 0px; */
    /* position: absolute; */
    width: 100%;


}
</style>