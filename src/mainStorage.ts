import {saveStore,loadStore} from "./tool"
import {type StoreType} from "./store.type"

class MainStorage{
    storeSotrageKey="store"
    originStoreData!: StoreType


    backupStore(){
        this.originStoreData=saveStore()
    }

    saveStoreByLocalStorage(){
        localStorage.setItem(this.storeSotrageKey,JSON.stringify(saveStore()))
    }

    loadStoreByLocalStorage(){
        let s=localStorage.getItem(this.storeSotrageKey)
        if(!s){
            return
        }
        let d:StoreType=JSON.parse(s)
        loadStore(d)
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

    async saveStoreByCloud(){
        let req=await fetch("/saveStore",{
            method:"post",
            body:JSON.stringify(saveStore()),
            headers:{
                "Content-Type":"application/json"
            }
        })
    }

}

export const mainStorage=new MainStorage()
mainStorage.backupStore()