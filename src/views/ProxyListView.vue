<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from "vue"
import PopupProxyList from "@/components/PopupProxyList.vue"
import { copyStr, createProxyStore, objectAssign } from "@/tool"
import type { ProxyStoreType } from "@/server/proxyStore.type.d";
import { proxyStore } from "@/proxyStore"
import { mainStorage } from '@/mainStorage'
import { showToast, showConfirmDialog, showLoadingToast, showFailToast } from "vant";
import { store } from "@/store";
import { otherStore } from "@/otherStore";
import qrcode from "qrcode"


const showEdit = ref(false)
const proxySite = ref(<number>-2)
const proxyData = ref(createProxyStore())
const searchKey = ref(<string>"")
const showQrcode = ref(<boolean>false)
const qrcodeImg = ref(<string>"")
let backupProxyData!: ProxyStoreType

const redColor = "#ee0a24"
const greenColor = "#07c160"
const orangeColor = "#ff976a"
const blueColor = "#1989fa"

const size = "20px"
const fontSize = "15px"
onMounted(() => {
    watch([() => otherStore.proxyListUpdate], () => {
        // console.log("hhh")
        mainStorage.reloadProxyStore()
    })
})


const checkSearchKey = (index: number, key: string) => {
    if (!key) {
        return true
    }
    if (key == "") {
        return true
    }
    let c = proxyStore[index]
    if (c.name.indexOf(key) != -1) {
        return true
    }
    if (c.localIP.indexOf(key) != -1) {
        return true
    }
    if (c.localPort.toString().indexOf(key) != -1) {
        return true
    }
    if ((c.type != "http" && c.type != 'https') && c.remotePort.toString().indexOf(key) != -1) {
        return true
    }
    if ((c.type == 'http' || c.type == "https") && c.subdomain && c.subdomain.indexOf(key) != -1) {
        return true
    }
    if ((c.type == 'http' || c.type == "https") && !c.subdomain && c.customDomains.indexOf(key) != -1) {
        return true
    }

    return false
}

const setShow = () => {
    showEdit.value = true
}

const onAddProxy = () => {
    proxyData.value = createProxyStore()
    proxySite.value = -1
    backupProxyData = objectAssign(proxyData.value)
    showEdit.value = true
}

const onEditProxy = (i: number) => {
    proxyData.value = objectAssign(proxyStore[i])
    proxySite.value = i
    backupProxyData = objectAssign(proxyData.value)
    showEdit.value = true
}

const getProxyDomain = (i: number) => {
    let c = proxyStore[i]
    if (c.type == "http") {
        if (c.subdomain) {
            return `http://${c.subdomain}.${store.serverAddr}:${store.vhostHTTPPort}`
        }
        return `http://${c.customDomains.split(" ")[0]}:${store.vhostHTTPPort}`
    }
    else if (c.type == "https") {
        if (c.subdomain) {
            return `https://${c.subdomain}.${store.serverAddr}:${store.vhostHTTPSPort}`
        }
        return `http://${c.customDomains.split(" ")[0]}:${store.vhostHTTPPort}`
    }
    return `${store.serverAddr}:${c.remotePort}`
}

const onEditProxyEnable = (i: number) => {
    proxyStore[i].enable = !proxyStore[i].enable
    showToast(`代理 ${proxyStore[i].name} 当前状态:${proxyStore[i].enable}`)
}

const onEditProxyEncryption = (i: number) => {
    proxyStore[i].useEncryption = !proxyStore[i].useEncryption
    showToast(`代理 ${proxyStore[i].name} 当前加密状态:${proxyStore[i].useEncryption}`)
}

const onEditProxyCompression = (i: number) => {
    proxyStore[i].useCompression = !proxyStore[i].useCompression
    showToast(`代理 ${proxyStore[i].name} 当前压缩状态:${proxyStore[i].useCompression}`)
}

const onDeleteProxy = (i: number) => {
    showConfirmDialog({
        title: `删除代理 ${proxyStore[i].name}`,
        message:
            '确定要删除代理吗?',
    })
        .then(() => {
            proxyStore.splice(i, 1)
            // on confirm
        })
        .catch(() => {
            // on cancel
        });
}

const onCopyProxyUrl = (i: number) => {
    let url = getProxyDomain(i)
    let status = copyStr(url)
    if (status) {
        showToast(`复制 ${url} 到剪切板`)
        return
    }
    showToast(`无法复制 ${url} 到剪切板`)
    // navigator.clipboard.writeText(url).then(() => {
    //     showToast(`复制 ${url} 到剪切板`)
    // })

}

const onJumpProxy = (i: number) => {
    // console.log("跳转")
    showToast(`即将跳转 ${getProxyDomain(i)}`)
    try {
        window.open(getProxyDomain(i))
    }
    catch {
        showFailToast({ message: `无法跳转到 ${getProxyDomain(i)}` })
    }
}

const onJumpLocal = (i: number) => {
    let c = proxyStore[i]
    let url = `${c.localIP}:${c.localPort}`
    showConfirmDialog({
        title: `跳转`,
        message:
            `确定跳转 ${url}`,
    })
        .then(() => {
            try {
                if (c.type == "https") {
                    if (c.pluginType == "none") {
                        url = c.type + '://' + url
                    }
                    else if (c.pluginType == "https2http") {
                        url = 'http://' + url
                    }
                    else if (c.pluginType == "https2https") {
                        url = 'https://' + url
                    }
                }
                else {
                    url = c.type + '://' + url
                }

                window.open(url, "_blank")
            }
            catch {
                showFailToast({ message: `无法跳转到 ${url}` })
            }

            // on confirm
        })
        .catch(() => {

            // on cancel
        });
}

const onConfirmChild = () => {
    if (proxySite.value == -1) {
        proxyStore.push(objectAssign(proxyData.value))
    }
    else if (proxySite.value >= 0) {
        proxyStore[proxySite.value] = objectAssign(proxyData.value)
    }
    proxySite.value = -2
    showEdit.value = false
    console.log(proxyStore)
}

const onResetChild = () => {
    proxyData.value = objectAssign(backupProxyData)
}

const onSave = () => {
    mainStorage.saveProxyStoreByLocalStorage()
    showToast("已经保存到localstorage")
}

const onVerify = async () => {
    let loading = showLoadingToast({ message: "应用校验中", overlay: true, forbidClick: true, duration: 0 })
    let res = await mainStorage.verifyDataByCloud("proxyListStore")
    loading.close()
    console.log(res)
    if (res.verifyStaus == "success") {
        showToast("校验成功!")
        return
    }
    else if (res.verifyStaus == "tomlErr") {
        showToast("数据转换toml后,frpc识别错误,请修正再校验")
    }
    else {
        showToast("应用更新失败!!!")
    }
}

const onApplyUpdate = async () => {
    showConfirmDialog({
        title: `应用更新`,
        message:
            '确定要更新代理数据到服务器并执行新代理吗?',
    })
        .then(async () => {
            let loading = showLoadingToast({ message: "应用更新中", overlay: true, forbidClick: true, duration: 0 })
            let res = await mainStorage.applyDataByCloud("proxyListStore")
            loading.close()
            console.log(res)
            if (res.status) {
                showConfirmDialog({
                    title: `更新成功`,
                    message:
                        '应用更新成功,需要保存数据到本地?',
                }).then(() => {
                    onSave()
                })
                return
            }
            else {
                if (res.verifyStaus == "tomlErr") {
                    showToast("数据转换toml后,frpc识别错误,请修正再更新")
                }
                else {
                    showToast("应用更新失败!!!")
                }
            }

        })
        .catch(() => {
            // on cancel
        });

}

const onQrcode = (i: number) => {
    qrcode.toDataURL(getProxyDomain(i), function (err: any, url: string) {
        qrcodeImg.value = url
        showQrcode.value = true
    });
}

</script>
<template>

    <div class="big">

        <div class="content">
            <div class="display">
                <van-cell-group inset>
                    <!-- 输入任意文本 -->
                    <van-field v-model="searchKey" label="搜索:" placeholder="请输入关键字搜索" />
                </van-cell-group>
                <template v-for="(child, index) in proxyStore">
                    <div class="pos" v-if="checkSearchKey(index, searchKey)">
                        <van-cell-group :style="{ 'width': '100%' }">
                            <!-- 上层 -->
                            <div class="row rowbig">
                                <div class="row posleft">
                                    <!-- 运行图标 -->
                                    <van-icon :name="child.enable ? 'play-circle' : 'stop-circle'"
                                        @click="onEditProxyEnable(index)"
                                        :class="child.enable ? 'enableLight' : 'disableLight'" :size="size"></van-icon>
                                </div>
                                <div class="row poscenter">
                                    <div class="urlleft">
                                        <div>
                                            <!-- frpc名称 -->
                                            <div :style="{ 'color': orangeColor, 'font-size': fontSize }">{{ child.name
                                                }}
                                            </div>
                                            <!-- 代理路径 -->
                                            <div :style="{ 'color': orangeColor, 'font-size': fontSize }"
                                                @dblclick="onJumpLocal(index)">{{
                                                    child.localIP
                                                }}:{{ child.localPort }}</div>
                                        </div>
                                    </div>
                                    <div class="toolright">
                                        <div>
                                            <div :style="{ 'color': orangeColor, 'font-size': fontSize }">{{ child.type
                                                }}
                                            </div>
                                            <div :style="{ 'color': orangeColor, 'font-size': fontSize }">{{
                                                child.type == "http" ? store.vhostHTTPPort : child.type == "https" ?
                                                    store.vhostHTTPSPort : child.remotePort }}
                                            </div>

                                        </div>

                                    </div>

                                </div>
                                <div class="row posright">
                                    <div>
                                        <van-button class="btn" type="primary"
                                            @click="onEditProxy(index)">修改</van-button>
                                    </div>
                                </div>
                            </div>
                            <!-- 下层 -->
                            <div class="row rowbig">
                                <div class="row posleft">
                                    <!-- 跳转图标 -->
                                    <van-icon name="arrow" :class="child.enable ? 'enableLight' : 'disableLight'"
                                        :size="size" @click="onJumpProxy(index)"></van-icon>

                                </div>
                                <div class="row poscenter">
                                    <!-- 跳转url -->
                                    <div class="urlleft" :style="{ 'color': blueColor, 'font-size': fontSize }"
                                        @click="onCopyProxyUrl(index)">{{
                                            getProxyDomain(index) }}</div>
                                    <div class="toolright">
                                        <!-- 二维码 -->
                                        <van-icon name="qr" :size="size" @click="onQrcode(index)"></van-icon>
                                        <div>
                                            <!-- 加密 -->
                                            <div :style="{ 'color': child.useEncryption ? greenColor : redColor, 'font-size': fontSize }"
                                                @click="onEditProxyEncryption(index)">
                                                加密
                                            </div>
                                            <!-- 压缩 -->
                                            <div :style="{ 'color': child.useCompression ? greenColor : redColor, 'font-size': fontSize }"
                                                @click="onEditProxyCompression(index)">
                                                压缩
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div class="row posright">
                                    <div>
                                        <van-button class="btn" type="danger"
                                            @click="onDeleteProxy(index)">删除</van-button>
                                    </div>
                                </div>
                            </div>
                        </van-cell-group>
                    </div>

                </template>
            </div>

        </div>
        <div class="buttomDiv">
            <div class="pos">
                <van-button class="btn" type="primary" @click="onAddProxy">添加代理</van-button>
                <van-button class="btn" type="primary" @click="onVerify">数据校验</van-button>
                <van-button class="btn" type="primary" @click="onApplyUpdate">应用更新</van-button>
                <van-button class="btn" type="primary" @click="onSave">保存本地</van-button>
                <!-- <van-button class="btn" type="primary">重置当前</van-button>
                <van-button class="btn" type="primary">读取云端</van-button>
                <van-button class="btn" type="primary">清空本地</van-button> -->
            </div>
        </div>
    </div>
    <PopupProxyList v-model:show="showEdit" :data="proxyData" @onreset="onResetChild" @onconfirm="onConfirmChild">
    </PopupProxyList>
    <van-overlay :show="showQrcode" @click="showQrcode = false">
        <div class="wrapper">
            <img :src="qrcodeImg" />
        </div>
    </van-overlay>
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
    flex-direction: row;
}

.posleft {
    width: 15%;
}

.poscenter {
    width: 70%
}

.posright {
    width: 15%;
}

.buttomDiv {
    /* bottom: 0px; */
    /* position: absolute; */
    width: 100%;


}

.enableLight {
    color: #07c160;
}

.disableLight {
    color: #ee0a24
}

.rowbig {
    width: 100%
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

.col {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.urlleft {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 70%;
    word-break: break-all;

}

.toolright {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 25%;
}

.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}


@media screen and (orientation: portrait) {

    /*竖屏 css*/
    .wrapper img {
        max-width: 85%;
        width: auto;
        height: auto;
        min-width: 85%;

    }
}

@media screen and (orientation: landscape) {

    /*横屏 css*/
    .wrapper img {
        max-height: 85%;
        width: auto;
        height: auto;
        min-height: 85%;

    }
}

div {
    text-align: center;
}
</style>@/server/proxyStore.type