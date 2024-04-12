import { proxyStore } from "./proxyStore"
import { type ProxyStoreType } from "@/server/proxyStore.type.d"
import { store } from "./store"
import { type StoreType } from '@/server/store.type.d'

export function createProxyStore() {
    let d: ProxyStoreType = {
        type: "http",
        remotePort: 6300,
        name: "",
        useEncryption: true,
        useCompression: true,
        bandwidthLimit: "",
        bandwidthLimitMode: "client",
        proxyProtocolVersion: "none",
        enableHttpVerify: false,
        httpUser: "",
        httpPassword: "",
        enableLocations: false,
        locations: "locations=/",
        subdomain: "",
        customDomains: "",
        enable: false,
        localIP: "127.0.0.1",
        localPort: 80,
        enableHttps2http: false,
        https2httpLocalAddr: "127.0.0.1:80",
        https2httpCrtpath: store.crtUrl,
        https2httpKeypath: store.keyUrl,
        https2httpHostHeaderRewrite: "127.0.0.1",
        enableHostHeaderRewrite: false,
        hostHeaderRewrite: "",
        stcpSecretKey: "",
        stcpAllowUsers: "*",
        xtcpSecretKey: "",
        xtcpAllowUsers: "*"
    }
    return d
}

export function objectAssign<T>(o: T): T {
    return Object.assign({}, o)
}

export function jsonClone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o))
}

export function saveStore() {
    return objectAssign(store)
}

export function saveProxyStore() {

    return proxyStore.map(c => { console.log(c); return objectAssign(c) })
}

export function loadStore(o: StoreType) {
    for (let key in store) {
        //@ts-ignore
        if (o[key] != undefined) {
            //@ts-ignore
            store[key] = o[key]
        }
    }
}

export function loadProxyStore(o: ProxyStoreType[]) {

    proxyStore.splice(0, proxyStore.length)
    for (let i = 0; i < o.length; i++) {
        let c = o[i]
        let temp = createProxyStore()
        for (let key in temp) {
            //@ts-ignore
            if (c[key] != undefined) {
                //@ts-ignore
                temp[key] = c[key]
            }
        }
        proxyStore.push(temp)
    }
}

/**
* 复制字符串到剪切板
* @param str 字符串
* @returns 返回是否成功
*/
export function copyStr(str: string | number, isMobile?: boolean): boolean {
    if (isMobile) {
        let div = document.createElement("div")
        div.innerHTML = str.toString()
        document.body.appendChild(div)
        let range = document.createRange()
        range.selectNode(div)
        const selection = window.getSelection()
        if (!selection) {
            return false
        }
        if (selection.rangeCount > 0) {
            selection.removeAllRanges()
        }
        selection.addRange(range);

        let check = document.execCommand("copy")
        document.body.removeChild(div)
        return check
    }
    let textArea = document.createElement('textarea')
    textArea.innerHTML = str.toString()
    document.body.appendChild(textArea)
    textArea.select();
    let check = document.execCommand('copy')
    document.body.removeChild(textArea)
    return check
}

