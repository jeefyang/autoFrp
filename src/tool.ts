import {type ProxyStoreType} from "./proxyStore.type.d"
import {store } from "./store"
import {type StoreType} from './store.type.d'

export function createProxyStore(){
    let d:ProxyStoreType={
        type:"http",
        remotePort:6300,
        name:"",
        useEncryption:true,
        useCompression:true,
        bandwidthLimit:"",
        bandwidthLimitMode:"client",
        enableProxyProtocol:false,
        proxyProtocolVersion:"v1",
        enableHttpVerify:false,
        httpUser:"",
        httpPassword:"",
        enableLocations:false,
        locations:"locations=/",
        subdomain:"",
        customDomains:"",
        enable:false,
        localIP:"127.0.0.1",
        localPort:80,
        enableHttps2http:false,
        https2httpLocalAddr:"127.0.0.1:80",
        https2httpCrtpath:store.crtUrl,
        https2httpKeypath:store.keyUrl,
        https2httpHostHeaderRewrite:"127.0.0.1",
        enableHostHeaderRewrite:false,
        hostHeaderRewrite:""
    }
    return d
}

export function objectAssign<T>(o:T):T{
    return Object.assign({},o) 
}

export function saveStore(){
    return objectAssign(store)
}

export function loadStore(o:StoreType){
    for(let key in store){
        //@ts-ignore
        if(o[key]!=undefined){
            //@ts-ignore
           store[key]= o[key]
        }
    }
}


