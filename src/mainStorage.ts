import { saveStore, loadStore, saveProxyStore, loadProxyStore, objectAssign } from "./tool"
import { type StoreType } from "@/server/store.type.d"
import { type ProxyStoreType } from "@/server/proxyStore.type.d"
import { proxyStore } from "./proxyStore"
import { store } from "./store"
import type { ApplyTomlStatusType, FrpStatusSendType, SaveBackupStatusType, SetFrpSendType, SetFrpType, VerifyTomlStatusType } from '@/server/type'
import { otherStore } from "./otherStore"

class MainStorage {
    storeStorageKey = "store"
    originStoreData!: StoreType
    proxyStoreStorageKey = "proxyStore"
    modifyStoreTimeStorageKey = "modifyStoreTime"
    modifyProxyStoreTimeStorageKey = 'modifyProxyStoreTime'

    backupStore() {
        this.originStoreData = saveStore()
    }

    loadModifyStoreTimeByLocalStorage() {
        return Number(localStorage.getItem(this.modifyStoreTimeStorageKey) || 0)
    }

    loadModifyProxyStoreTimeByLocalStorage() {
        return Number(localStorage.getItem(this.modifyProxyStoreTimeStorageKey) || 0)
    }

    saveModifyStoreTimeByLocalStorage(t?: string) {
        let s = t || (new Date().getTime().toString())
        localStorage.setItem(this.modifyStoreTimeStorageKey, s)
        otherStore.storeTime = Number(s)
    }

    saveModifyProxyStoreTimeByLocalStorage(t?: string) {
        let s = t || (new Date().getTime().toString())
        localStorage.setItem(this.modifyProxyStoreTimeStorageKey, s)
        otherStore.proxyStoreTime = Number(s)
    }


    saveStoreByLocalStorage() {
        localStorage.setItem(this.storeStorageKey, JSON.stringify(saveStore()))
    }

    saveProxyStoreByLocalStorage() {
        localStorage.setItem(this.proxyStoreStorageKey, JSON.stringify(saveProxyStore()))

    }

    isStoreBeginlocalStorage() {
        let s = localStorage.getItem(this.storeStorageKey)
        if (!s) {
            return true
        }
        return false
    }

    loadStoreByLocalStorage() {
        let s = localStorage.getItem(this.storeStorageKey)
        if (!s) {
            return false
        }
        let d: StoreType = JSON.parse(s)
        loadStore(d)
        console.log(store.serverPort)
        return true
    }

    clearStoreByLocalStorage() {
        localStorage.setItem(this.storeStorageKey, "")
    }

    isProxyStoreBeginlocalStorage() {
        let s = localStorage.getItem(this.proxyStoreStorageKey)
        if (!s) {
            return true
        }
        return false
    }

    loadProxyStoreByLocalStorage() {
        let s = localStorage.getItem(this.proxyStoreStorageKey)
        if (!s) {
            return false
        }
        let d: ProxyStoreType[] = JSON.parse(s)
        console.log(d)
        loadProxyStore(d)
        return true
    }

    reloadProxyStore() {
        let s = proxyStore.map(c => { return objectAssign(c) })
        proxyStore.splice(0, proxyStore.length)
        for (let i = 0; i < s.length; i++) {
            let c = s[i]
            proxyStore.push(c)
        }
    }

    clearProxyStoreByLocalStorage() {
        localStorage.setItem(this.proxyStoreStorageKey, "")
    }

    async loadStoreByCloud() {
        let s = await fetch('/store').then(c => c.text())
        if (!s) {
            return false
        }
        let j: StoreType = JSON.parse(s)
        loadStore(j)
        return true
    }

    async loadPorxyStoreByCloud() {
        let s = await fetch("/proxyListStore").then(c => c.text())
        if (!s) {
            return false
        }
        let j: ProxyStoreType[] = JSON.parse(s)
        loadProxyStore(j)
        return true
    }

    async saveDataByCloud(type: "store" | "proxyListStore") {
        let req = await fetch(`/saveData?${type}`, {
            method: "post",
            body: JSON.stringify(type == "store" ? saveStore() : saveProxyStore()),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let t: SaveBackupStatusType = await req.json()
        return t
    }

    async applyDataByCloud(type: "store" | "proxyListStore") {
        let req = await fetch(`/applyData?${type}`, {
            method: "post",
            body: JSON.stringify(type == "store" ? saveStore() : saveProxyStore()),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let t: ApplyTomlStatusType = await req.json()
        return t
    }

    async verifyDataByCloud(type: "store" | "proxyListStore") {
        let req = await fetch(`/verifyData?${type}`, {
            method: "post",
            body: JSON.stringify(type == "store" ? saveStore() : saveProxyStore()),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let t: VerifyTomlStatusType = await req.json()
        return t
    }

    async loadCrtFileByCloud() {
        let req = await fetch('/loadCrtFile', {
            method: "post",
            body: JSON.stringify({ url: store.crtUrl }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let s = await req.text()
        if (!s) {
            return false
        }
        store.crtContent = s
        return true
    }

    async saveCrtFileByCloud() {
        let req = await fetch("/saveCrtFile", {
            method: 'post',
            body: JSON.stringify({ url: store.crtUrl, content: store.crtContent }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let s = await req.text()
        if (s.indexOf("success") != -1) {
            return true
        }
        return false
    }

    async loadKeyFileByCloud() {
        let req = await fetch('/loadKeyFile', {
            method: "post",
            body: JSON.stringify({ url: store.keyUrl }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let s = await req.text()
        if (!s) {
            return false
        }
        store.keyContent = s
        return true
    }

    async saveKeyFileByCloud() {
        let req = await fetch("/saveKeyFile", {
            method: 'post',
            body: JSON.stringify({ url: store.keyUrl, content: store.keyContent }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let s = await req.text()
        if (s.indexOf("success") != -1) {
            return true
        }
        return false
    }

    async getFrpBackFileDate() {
        let s = await fetch('/backupFileDate')
        return s.text()
    }

    async getFrpStatusByCloud() {
        let req = await fetch("/frpStatus")
        let s: FrpStatusSendType = await req.json()
        return s
    }

    async setFrpByCloud(type: SetFrpType) {
        let req = await fetch(`/setFrp?${type}`)
        let j: SetFrpSendType = await req.json()
        return j
    }

}

export const mainStorage = new MainStorage()
mainStorage.backupStore()