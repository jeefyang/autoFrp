import { reactive } from "vue"
import { type StoreType } from "./store.type.d"
import {saveStore} from "./tool"

export const store = reactive(<StoreType>{
    serverAddr: "127.0.0.1",
    serverPort: 7000,
    token: "",
    user: "",
    loginFailExit: true,
    webServerAddr: "127.0.0.1",
    webServerPort: 7400,
    webServerUser: "admin",
    webServerPW: "admin",
    transportProtocol: "tcp",
    transportTcpMux: true,
    tcpMuxKeepaliveInterval: -1,
    heartbeatInterval: 30,
    heartbeatTimeout: 90,
    tls: false,
    logto: "",
    loglevel: "info",
    logmaxDays: 3,
    logdisablePrintColor: true,
    poolCount: -1,
    vhostHTTPPort: 6300,
    vhostHTTPSPort: 6301,
    crtContent:"",
    crtUrl:"./server.crt",
    keyContent:"",
    keyUrl:"./server.key"
})