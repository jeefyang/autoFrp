<script setup lang="ts">
import { ref } from "vue"

import { showToast, showConfirmDialog } from "vant";
import { mainStorage } from "@/mainStorage"
import { onMounted, watch } from "vue"
import { otherStore } from "@/otherStore"

onMounted(() => {

    watch([() => otherStore.otherUpdate], async () => {
        onUpdateStatus()
    })
    onUpdateStatus()
})

const onUpdateStatus = async () => {
    let t = await mainStorage.getStatusByCloud()
    console.log(t)
}

const onStoreReset = () => {
    mainStorage.loadStoreByLocalStorage()
    showToast("已经从localstorage读取主配置信息")
}

const onStoreClear = () => {
    mainStorage.clearStoreByLocalStorage()
    showToast("已经清空localstorage的主配置信息")
}

const onStoreCloud = async () => {
    let status = await mainStorage.loadStoreByCloud()
    if (status) {
        showToast("已经从云端读取了主配置信息")
    }
    else {
        showToast("无法从云端读取主配置信息")
    }
}

const onProxyStoreReset = () => {
    mainStorage.loadProxyStoreByLocalStorage()
    showToast("已经从localstorage读取代理列表")
}

const onProxyStorageClear = () => {
    mainStorage.clearProxyStoreByLocalStorage()
    showConfirmDialog({ title: "是否刷新?" })
    showToast("已经清空localstorage的代理列表")
}

const onProxyStorageCloud = async () => {
    let status = await mainStorage.loadPorxyStoreByCloud()
    if (status) {
        showToast("已经从云端读取了代理列表")
    }
    else {
        showToast("无法从云端读取代理列表")
    }
}

</script>
<template>

    <div class="big">
        <div class="display">
            <van-cell-group inset>
                状态:
                <div>
                    123
                </div>
                主配置:
                <div>
                    <van-button class="btn" type="primary">重置当前</van-button>
                    <van-button class="btn" type="primary">读取云端</van-button>
                    <van-button class="btn" type="primary">清空本地</van-button>
                </div>
                代理配置:
                <div>
                    <van-button class="btn" type="primary" @click="onProxyStoreReset">重置当前</van-button>
                    <van-button class="btn" type="primary" @click="onProxyStorageCloud">读取云端</van-button>
                    <van-button class="btn" type="primary" @click="onProxyStorageClear">清空本地</van-button>
                </div>
            </van-cell-group>
        </div>


    </div>

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