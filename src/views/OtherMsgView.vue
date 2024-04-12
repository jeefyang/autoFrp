<script setup lang="ts">
import { ref } from "vue"

import { showToast, showConfirmDialog } from "vant";
import { mainStorage } from "@/mainStorage"
import { onMounted, watch } from "vue"
import { otherStore } from "@/otherStore"
import type { FrpStatusType, SetFrpType } from "@/server/type.d";

const frpStatus = ref(<"null" | "online" | "offline">"null")

onMounted(() => {

    watch([() => otherStore.otherUpdate], async () => {
        onRefreshFrpStatus()
    })
    onRefreshFrpStatus()
})

const onRefreshFrpStatus = async () => {
    let t = await mainStorage.getFrpStatusByCloud()
    frpStatus.value = t.status
    showToast("已经刷新了frpc状态")
}

const onSetFrp = async (type: SetFrpType) => {
    let l: { t: SetFrpType, c: string }[] = [
        { t: "start", c: `无法启动frpc服务` },
        { t: "restart", c: `无法重启frpc服务` },
        { t: "stop", c: `无法停止frpc服务` },
        { t: "delete", c: `无法删除frpc服务` }
    ]
    let t = await mainStorage.setFrpByCloud(type)
    if (!t.status) {
        showToast(l.find(c => c.t == type)?.c || "")
        return
    }
    t.frpStatus && (frpStatus.value = t.frpStatus)
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
                <div class="frpstatus">
                    <div>{{ frpStatus }}</div>
                    <div>
                        <van-button class="btn" type="primary" @click="onRefreshFrpStatus">刷新</van-button>
                    </div>
                </div>
                <div>
                    <van-button class="btn" type="primary" :disabled="frpStatus == 'online'"
                        @click="onSetFrp('start')">启动</van-button>
                    <van-button class="btn" type="primary" :disabled="frpStatus != 'online'"
                        @click="onSetFrp('restart')">重启</van-button>
                    <van-button class="btn" type="primary" :disabled="frpStatus != 'online'"
                        @click="onSetFrp('stop')">停止</van-button>
                    <van-button class="btn" type="primary" :disabled="frpStatus == 'null'"
                        @click="onSetFrp('delete')">删除</van-button>
                </div>
                主配置:
                <div>
                    <van-button class="btn" type="primary" @click="onStoreReset">重置当前</van-button>
                    <van-button class="btn" type="primary" @click="onStoreCloud">读取云端</van-button>
                    <van-button class="btn" type="primary" @click="onStoreClear">清空本地</van-button>
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

.frpstatus {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>