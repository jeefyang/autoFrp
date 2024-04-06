import {saveStore,loadStore, saveProxyStore, loadProxyStore, objectAssign} from "./tool"
import {type StoreType } from "./store.type.d"
import {type ProxyStoreType } from "./proxyStore.type.d"
import { proxyStore } from "./proxyStore"

class MainStorage{
    storeStorageKey="store"
    originStoreData!: StoreType
    proxyStoreStorageKey="proxyStore"

    backupStore(){
        this.originStoreData=saveStore()
    }

    saveStoreByLocalStorage(){
        localStorage.setItem(this.storeStorageKey,JSON.stringify(saveStore()))
    }

    saveProxyStoreByLocalStorage(){
        localStorage.setItem(this.proxyStoreStorageKey,JSON.stringify(saveProxyStore()))
    }

    loadStoreByLocalStorage(){
        let s=localStorage.getItem(this.storeStorageKey)
        if(!s){
            return false
        }
        let d:StoreType=JSON.parse(s)
        loadStore(d)
        return true
    }

    clearStoreByLocalStorage(){
            localStorage.setItem(this.storeStorageKey,"")
    }

    loadProxyStoreByLocalStorage(){
        let s=localStorage.getItem(this.proxyStoreStorageKey)
        if(!s){
            return false
        }
        let d:ProxyStoreType[]=JSON.parse(s)
        console.log(d)
        loadProxyStore(d)
        return true
    }

    reloadProxyStore(){
            let s=proxyStore.map(c=>{return objectAssign(c)})
            proxyStore.splice(0,proxyStore.length)
            for(let i=0;i<s.length;i++){
                let c=s[i]
                proxyStore.push(c)
            }
    }

    clearProxyStoreByLocalStorage(){
        localStorage.setItem(this.proxyStoreStorageKey,"")
    }

   async loadStoreByCloud(){
        let s=await fetch('/store').then(c=>c.text())
        if(!s){
            return false
        }
        let j:StoreType=JSON.parse(s)
        loadStore(j)
        return true
    }

    async loadPorxyStoreByCloud(){
        let s=await fetch("/proxystore").then(c=>c.text())
        if(!s){
            return false
        }
        let j:ProxyStoreType[]=JSON.parse(s)
        loadProxyStore(j)
        return true
    }

    async saveStoreByCloud(){
        let req=await fetch("/saveStore",{
            method:"post",
            body:JSON.stringify(saveStore()),
            headers:{
                "Content-Type":"application/json"
            }
        })
    }

    async saveProxyStoreByCloud(){
        let req=await fetch("/saveProxyStore",{
            method:"post",
            body:JSON.stringify(saveProxyStore()),
            headers:{
                "Content-Type":"application/json"
            }
        })
    }

}

export const mainStorage=new MainStorage()
mainStorage.backupStore()