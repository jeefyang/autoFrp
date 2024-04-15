<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue"
import { type ProxyStoreType } from "@/server/proxyStore.type.d"
import EasySwitch from "./EasySwitch.vue"
import EasyPicker from "./EasyPicker.vue"
import EasyNum from './EasyNum.vue'
import EasyPW from "./EasyPW.vue"
import { showToast } from "vant"

const showTop = ref(false)
defineProps<{
    data: ProxyStoreType
}>()
const emit = defineEmits<{
    (e: "onconfirm"): void
    (e: "onreset"): void
}>()

const onconfirm = () => {
    emit("onconfirm")
}

const onreset = () => {
    emit("onreset")
}

const inactiveColor = "#2b2e30"
const activeColor = "#1989fa"

const desc = {
    enable: "是否启动",
    name: "用来识别不同的映射 确保备注名唯一",
    type: '代理协议有 "tcp" | "http" | "https" | "udp" | "stcp" | "xtcp"',
    subdomain: "子域名,只要子域名的头即可,不需要全称",
    customDomains: "自定义域名,可以写多个域名,需要用空格间隔",
    enableHttpVerify: " Http用户名和密码是Http协议的安全认证。",
    httpUser: "Http协议的安全认证的用户名",
    httpPassword: "Http协议的安全认证的密码",
    enableLocations: "Frp 支持通过url路由将http请求转发到不同的反向web服务。",
    locations: "Http requests with url prefix /news will be forwarded to this service.",
    hostHeaderRewrite: "是否重新修改 host header",
    enableHostHeaderRewrite: "The Host header will be rewritten to match the hostname portion of the forwarding address.",
    enableHttps2http: "使用插件使用插件模式时，本地 IP 地址和端口无需配置，插件将会处理来自服务端的链接请求。",
    https2httpLocalAddr: "插件本地地址（格式 IP:Port）",
    https2httpCrtpath: "插件证书路径,位置相对于frpc程序",
    https2httpKeypath: "插件私钥路径,位置相对于frpc程序",
    https2httpHostHeaderRewrite: "插件 Host Header 重写",
    stcpSecretKey: "stcp密钥，服务端和访问端的密钥需要一致，访问端才能访问到服务端",
    stcpAllowUsers: "允许访问的 visitor 用户列表，默认只允许同一用户下的 visitor 访问，配置为 * 则允许任何 visitor 访问,用空格隔开",
    xtcpSecretKey: "xtcp密钥，服务端和访问端的密钥需要一致，访问端才能访问到服务端",
    xtcpAllowUsers: "允许访问的 visitor 用户列表，默认只允许同一用户下的 visitor 访问，配置为 * 则允许任何 visitor 访问,用空格隔开",
    localIP: "内网 IP 指定要被代理的 IP 地址或主机名。",
    localPort: "ip端口指定要被代理的端口。",
    proxyProtocolVersion: "启用 proxy protocol 协议的版本，可选值为 v1 和 v2。如果启用，则 frpc 和本地服务建立连接后会发送 proxy protocol 的协议，包含了原请求的 IP 地址和端口等内容",
    useEncryption: "是否启用加密功能，启用后该代理和服务端之间的通信内容都会被加密传输，如果 frpc 启用了全局 TLS，则不需要再启用此参数",
    useCompression: "是否启用压缩功能，启用后该代理和服务端之间的通信内容都会被压缩传输",
    remotePort: "服务端绑定的端口，用户访问服务端此端口的流量会被转发到对应的本地服务"

}


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



</script>
<template>
    <van-popup v-model:show="showTop" position="top" :style="{ height: '75%' }">
        <van-cell-group inset>
            <EasySwitch @labelclick="alertFunc(desc.enable)" v-model="data.enable" :inactive-color="inactiveColor"
                :active-color="activeColor" label="启动:">
            </EasySwitch>
            <van-field autosize type="text" v-model="data.name" @click="alertFunc(desc.name, $event)" label="备注名:"
                placeholder="请输入备注名" />
            <EasyPicker @labelclick="alertFunc(desc.type)" v-model="data.type" label="代理协议:"
                :columns='["tcp", "http", "https", "udp", "stcp", "xtcp"]'>
            </EasyPicker>
            <van-field autosize type="text" v-model="data.localIP" @click="alertFunc(desc.localIP, $event)"
                label="内网ip:" placeholder="请输入内网ip" />
            <EasyNum v-model="data.localPort" @click="alertFunc(desc.localPort, $event)" label="ip端口:"
                placeholder="请输入端口号" />
            <template v-if="data.type == 'tcp'">
                <EasyNum v-model="data.remotePort" @click="alertFunc(desc.remotePort, $event)" label="远程端口:"
                    placeholder="请输入端口号" />
            </template>
            <template v-if="data.type == 'udp'">
                <EasyNum v-model="data.remotePort" @click="alertFunc(desc.remotePort, $event)" label="远程端口:"
                    placeholder="请输入端口号" />
            </template>
            <template v-if="data.type == 'http'">
                <van-field autosize type="text" v-model="data.subdomain" @click="alertFunc(desc.subdomain, $event)"
                    label="子域名:" placeholder="请输入子域名" />
                <van-field autosize type="text" v-model="data.customDomains"
                    @click="alertFunc(desc.customDomains, $event)" label="自定义域名:" placeholder="请输入自定义域名" />
                <EasySwitch @labelclick="alertFunc(desc.enableHttpVerify)" v-model="data.enableHttpVerify"
                    :inactive-color="inactiveColor" :active-color="activeColor" label="http安全认证:">
                </EasySwitch>
                <template v-if="data.enableHttpVerify">
                    <van-field autosize type="text" v-model="data.httpUser" @click="alertFunc(desc.httpUser, $event)"
                        label="认证用户名:" placeholder="请输入用户名" />
                    <EasyPW v-model="data.httpPassword" label="认证密码:" placeholder="请输入密码"
                        @labelclick="alertFunc(desc.httpPassword)"></EasyPW>
                </template>
                <EasySwitch @labelclick="alertFunc(desc.enableLocations)" v-model="data.enableLocations"
                    :inactive-color="inactiveColor" :active-color="activeColor" label="启用 URL 路由:">
                </EasySwitch>
                <template v-if="data.enableLocations">
                    <van-field autosize type="text" v-model="data.locations" @click="alertFunc(desc.locations, $event)"
                        label="Host Header:" placeholder="请输入Host Header" />
                </template>
                <EasySwitch @labelclick="alertFunc(desc.enableHostHeaderRewrite)" v-model="data.enableHostHeaderRewrite"
                    :inactive-color="inactiveColor" :active-color="activeColor" label="重改 Host Header:">
                </EasySwitch>
                <template v-if="data.enableHostHeaderRewrite">
                    <van-field autosize type="text" v-model="data.hostHeaderRewrite"
                        @click="alertFunc(desc.hostHeaderRewrite, $event)" label="Host Header:"
                        placeholder="请输入Host Header" />
                </template>
            </template>
            <template v-if="data.type == 'https'">
                <van-field autosize type="text" v-model="data.subdomain" @click="alertFunc(desc.subdomain, $event)"
                    label="子域名:" placeholder="请输入子域名" />
                <van-field autosize type="text" v-model="data.customDomains"
                    @click="alertFunc(desc.customDomains, $event)" label="自定义域名:" placeholder="请输入自定义域名" />
                <EasySwitch @labelclick="alertFunc(desc.enableHttps2http)" v-model="data.enableHttps2http"
                    :inactive-color="inactiveColor" :active-color="activeColor" label="https2http:">
                </EasySwitch>
                <template v-if="data.enableHttps2http">
                    <van-field autosize type="text" v-model="data.https2httpLocalAddr"
                        @click="alertFunc(desc.https2httpLocalAddr, $event)" label="本地地址:" placeholder="请输入地址" />
                    <van-field autosize type="text" v-model="data.https2httpCrtpath"
                        @click="alertFunc(desc.https2httpCrtpath, $event)" label="插件crt证书路径:"
                        placeholder="请输入插件crt证书路径" />
                    <van-field autosize type="text" v-model="data.https2httpKeypath"
                        @click="alertFunc(desc.https2httpKeypath, $event)" label="插件key密钥路径:"
                        placeholder="请输入插件key密钥路径" />

                    <van-field autosize type="text" v-model="data.https2httpHostHeaderRewrite"
                        @click="alertFunc(desc.https2httpHostHeaderRewrite, $event)" label="插件Host Header 重写:"
                        placeholder="请输入Host Header" />
                </template>
            </template>
            <template v-if="data.type == 'stcp'">
                <van-field autosize type="text" v-model="data.stcpSecretKey"
                    @click="alertFunc(desc.stcpSecretKey, $event)" label="stcp密钥:" placeholder="请输入密钥" />
                <van-field autosize type="text" v-model="data.stcpAllowUsers"
                    @click="alertFunc(desc.stcpAllowUsers, $event)" label="stcp允许用户:" placeholder="请输入用户名" />
            </template>
            <template v-if="data.type == 'xtcp'">
                <van-field autosize type="text" v-model="data.xtcpSecretKey"
                    @click="alertFunc(desc.xtcpSecretKey, $event)" label="xtcp密钥:" placeholder="请输入密钥" />
                <van-field autosize type="text" v-model="data.xtcpAllowUsers"
                    @click="alertFunc(desc.xtcpAllowUsers, $event)" label="xtcp允许用户:" placeholder="请输入用户名" />
            </template>
            <template v-if="data.type != 'udp'">
                <EasyPicker @labelclick="alertFunc(desc.proxyProtocolVersion)" v-model="data.proxyProtocolVersion"
                    label="Proxy-Protocol版本:" :columns='["none", "v1", "v2"]'>
                </EasyPicker>
            </template>
            <EasySwitch @labelclick="alertFunc(desc.useEncryption)" v-model="data.useEncryption"
                :inactive-color="inactiveColor" :active-color="activeColor" label="加密:">
            </EasySwitch>
            <EasySwitch @labelclick="alertFunc(desc.useCompression)" v-model="data.useCompression"
                :inactive-color="inactiveColor" :active-color="activeColor" label="压缩:">
            </EasySwitch>
        </van-cell-group>
        <van-button class="btn" type="default" @click="onconfirm">确认</van-button>
        <van-button class="btn" type="default" @click="onreset">重置</van-button>
    </van-popup>

</template>
<style scoped></style>@/server/proxyStore.type