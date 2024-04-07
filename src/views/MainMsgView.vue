<script setup lang="ts">
// import { } from "vue"
import { store } from "../store"
import { showToast, showLoadingToast, showConfirmDialog } from 'vant';
import { ref } from "vue"
import EasyPicker from "@/components/EasyPicker.vue"
import EasyPW from "@/components/EasyPW.vue"
import EasySwitch from "@/components/EasySwitch.vue"
import { mainStorage } from "@/mainStorage";

const desc = {
    serverAddr: "ServerAddr 指定要连接到的服务器的地址。",
    serverPort: "ServerPort 指定要连接到的服务器端口。",
    token: "Token 指定用于创建要发送到服务器的密钥的授权令牌。服务器必须具有匹配的令牌才能成功进行授权。",
    user: " 通常用于区分你与其他客户端",
    webServerAddr: "webServer 监听地址，默认为 127.0.0.1",
    webServerPort: "webServer 监听端口",
    webServerUser: "webServer用户名, 默认admin",
    webServerPW: "webServer密码, 默认admin",
    transportProtocol: "和 frps 之间的通信协议，可选值为 tcp, kcp, quic, websocket, wss。默认为 tcp",
    tls: "TLSEnable 指定在与服务器通信时是否应使用 TLS。,如果不是专业人士,请不要开,会搞疯自己",
    heartbeatInterval: "HeartBeatInterval 用于指定向服务器发送心跳包的间隔（以秒为单位）。不建议更改此值。默认情况下，此值为 30。",
    heartbeatTimeout: "HeartBeatTimeout 用于指定多久未收到心跳包后断开连接（以秒为单位）。不建议更改此值。默认情况下，此值为 90。",
    transportTcpMux: "TcpMux 切换 TCP 流多路复用。这允许来自客户端的多个请求共享单个 TCP 连接。如果此值为 true，则服务器必须启用 TCP 多路复用。默认情况下，此值为 true。",
    loglevel: 'LogLevel 指定最小的日志级别。有效值为"trace", "debug", "info", "warn"和"error"。默认情况下，此值为"info"',
    logdisablePrintColor: "当DisableLogColor设置为true且LogWay=='console'时禁用日志颜色",
    loginFailExit: "LoginFailExit 控制客户端在尝试登录失败后是否应退出。如果为 false，客户端将重试，直到登录成功。默认情况下，此值为 true。",
    crtContent: "crt证书内容,保存更新将覆写文件",
    crtUrl: "crt证书路径,将用于内容写入文件里,且代理时默认同步crt证书路径,指的当前客户端所在服务器的路径,如不清楚客户端所在服务器的路径,请不要乱修改",
    keyContent: "key密钥内容,保存更新将覆写文件",
    keyUrl: "key密钥路径,将用于内容写入文件里,且代理时默认同步key密钥路径,指的当前客户端所在服务器的路径,如不清楚客户端所在服务器的路径,请不要乱修改",


}

const inactiveColor = "#2b2e30"
const activeColor = "#1989fa"

const alertFunc = (s: string, e?: MouseEvent,) => {
    if (e) {
        let t = <HTMLElement>(e.target)
        if (t.tagName != "LABEL") {
            return
        }
    }
    showToast({
        message: s,
        duration: 0,
        // forbidClick: true,
        overlay: true,
        closeOnClickOverlay: true
    })
}

const onApply = () => {
    showConfirmDialog({
        title: `应用更新`,
        message:
            '确定要更新主数据到服务器并执行新的主数据吗?',
    })
        .then(async () => {
            let loading = showLoadingToast({ message: "应用更新中", overlay: true, forbidClick: true, duration: 0 })
            let status = await mainStorage.applyStoreByCloud()
            loading.close()
            if (status) {
                showToast("应用更新成功")
                return
            }
            showToast("应用更新失败!!!")

        })
        .catch(() => {
            // on cancel
        });
}

const onSave = () => {
    mainStorage.saveStoreByLocalStorage()
    showToast("已经保存到localstorage")
}

const onLoadCrtFile = async () => {
    let status = await mainStorage.loadCrtFileByCloud()
    if (!status) {
        showToast("没有读取到crt证书内容")
        return
    }
    showToast("读取到crt证书内容并更新显示")
    status = await mainStorage.loadKeyFileByCloud()
    if (!status) {
        showToast("没有读取到key密钥内容")
        return
    }
    showToast("读取到key密钥内容并更新显示")
}

const onSaveCrtFile = async () => {
    showConfirmDialog({
        title: `云端保存证书`,
        message:
            '确定要更新证书数据到云端?',
    })
        .then(async () => {
            let loading = showLoadingToast({ message: "应用更新中", overlay: true, forbidClick: true, duration: 0 })
            let status = await mainStorage.saveCrtFileByCloud()
            if (!status) {
                loading.close()
                showToast("无法保存crt证书到云端")
                return
            }
            showToast("成功保存crt证书到云端")
            status = await mainStorage.saveKeyFileByCloud()
            if (!status) {
                loading.close()
                showToast("无法保存key密钥到云端")
                return
            }
            loading.close()
            showToast("成功保存key密钥到云端")

        })
        .catch(() => {
            // on cancel
        });

}

</script>
<template>
    <div class="big">

        <div class="content">
            <div class="display">
                <van-cell-group inset>
                    <van-field autosize type="textarea" @click="alertFunc(desc.serverAddr, $event)" rows="1"
                        right-icon="warning-o" v-model="store.serverAddr" label="服务器地址:" placeholder="请输入服务器地址" />

                    <van-field autosize type="number" @click="alertFunc(desc.serverPort, $event)" right-icon="warning-o"
                        v-model="store.serverPort" label="服务器端口:" placeholder="请输入服务器端口" />

                    <EasyPW v-model="store.token" label="令牌:" placeholder="请输入令牌" @labelclick="alertFunc(desc.token)">
                    </EasyPW>

                    <van-field autosize type="text" v-model="store.user" @click="alertFunc(desc.user, $event)"
                        label="用户名:" placeholder="请输入用户名" />

                    <van-field autosize type="text" v-model="store.webServerAddr"
                        @click="alertFunc(desc.webServerAddr, $event)" label="管理地址:" placeholder="请输入管理地址" />

                    <van-field autosize type="number" v-model="store.webServerPort"
                        @click="alertFunc(desc.webServerPort, $event)" label="管理端口:" placeholder="请输入管理端口" />

                    <van-field autosize type="text" v-model="store.webServerUser"
                        @click="alertFunc(desc.webServerUser, $event)" label="管理用户:" placeholder="请输入管理用户" />

                    <EasyPW v-model="store.webServerPW" label="管理密码:" placeholder="请输入管理密码"
                        @labelclick="alertFunc(desc.webServerPW)"></EasyPW>

                    <EasyPicker @labelclick="alertFunc(desc.transportProtocol)" v-model="store.transportProtocol"
                        label="协议:" :columns="['tcp', 'kcp', 'quic', 'websocket', 'wss']">
                    </EasyPicker>

                    <EasySwitch @labelclick="alertFunc(desc.transportTcpMux)" v-model="store.transportTcpMux"
                        :inactive-color="inactiveColor" :active-color="activeColor" label="TCP 多路复用:">
                    </EasySwitch>

                    <van-field autosize type="number" @click="alertFunc(desc.heartbeatInterval, $event)"
                        right-icon="warning-o" v-model="store.heartbeatInterval" label="心跳包间隔时间:"
                        placeholder="请输入间隔秒数" />

                    <van-field autosize type="number" @click="alertFunc(desc.heartbeatTimeout, $event)"
                        right-icon="warning-o" v-model="store.heartbeatTimeout" label="心跳包超时:" placeholder="请输入超时秒数" />

                    <EasyPicker @labelclick="alertFunc(desc.loglevel)" v-model="store.loglevel" label="日志等级:"
                        :columns='["error", "info", "trace", "debug", "warn"]'>
                    </EasyPicker>

                    <EasySwitch @labelclick="alertFunc(desc.logdisablePrintColor)" v-model="store.logdisablePrintColor"
                        :inactive-color="inactiveColor" :active-color="activeColor" label="禁用日志的颜色:">
                    </EasySwitch>

                    <EasySwitch @labelclick="alertFunc(desc.loginFailExit)" v-model="store.loginFailExit"
                        :inactive-color="inactiveColor" :active-color="activeColor" label="当登录失败时退出:">
                    </EasySwitch>

                    <EasySwitch @labelclick="alertFunc(desc.tls)" v-model="store.tls" :inactive-color="inactiveColor"
                        :active-color="activeColor" label="tls:">
                    </EasySwitch>

                    <van-field autosize type="textarea" @click="alertFunc(desc.crtContent, $event)" rows="1"
                        v-model="store.crtContent" label="crt证书内容:" placeholder="请输入crt证书内容" />
                    <van-field autosize type="text" @click="alertFunc(desc.crtUrl, $event)" rows="1"
                        v-model="store.crtUrl" label="crt证书路径:" placeholder="请输入crt证书路径" />

                    <van-field autosize type="textarea" @click="alertFunc(desc.keyContent, $event)" rows="1"
                        v-model="store.keyContent" label="key密钥内容:" placeholder="请输入key密钥内容" />
                    <van-field autosize type="text" @click="alertFunc(desc.keyUrl, $event)" rows="1"
                        v-model="store.keyUrl" label="key密钥路径:" placeholder="请输入key密钥路径" />
                    <div>
                        <van-button class="btn" type="default" @click="onLoadCrtFile">云端读取证书</van-button>
                        <van-button class="btn" type="default" @click="onSaveCrtFile">云端保存证书</van-button>
                    </div>

                </van-cell-group>
            </div>

        </div>
        <div class="buttomDiv">
            <div class="pos">
                <van-button class="btn" type="primary" @click="onApply">应用更新</van-button>
                <van-button class="btn" type="primary" @click="onSave">保存本地</van-button>
            </div>
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