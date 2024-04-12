import type { BackupDataType } from "./type.d";


export function backupJson2frpcToml(j: BackupDataType) {
    let toml: string = ""
    let addFunc = (key: string, val: string | number | boolean) => {
        if (!val) {
            return
        }
        toml += `${key} = ${val.toString()}`
    }
    if (!j.store) {
        return
    }

    addFunc('serverAddr', j.store.serverAddr)
    addFunc("serverPort", j.store.serverPort)

    addFunc('loginFailExit', j.store.loginFailExit)
    addFunc("log.to", j.store.logto)
    addFunc("log.level", j.store.loglevel)
    addFunc('log.maxDays', j.store.logmaxDays)
    addFunc("log.disablePrintColor", j.store.logdisablePrintColor)

    if (j.store.token) {
        addFunc("auth.method", "token")
        addFunc("auth.token", j.store.token)
    }
    addFunc("user", j.store.user)

    addFunc('webServer.addr', j.store.webServerAddr)
    addFunc('webServer.port', j.store.webServerPort)
    addFunc('webServer.user', j.store.webServerUser)
    addFunc('webServer.password', j.store.webServerPW)

    addFunc('transport.protocol', j.store.transportProtocol)
    addFunc('transport.tcpMux', j.store.transportTcpMux)
    addFunc('transport.tcpMuxKeepaliveInterval', j.store.tcpMuxKeepaliveInterval)
    addFunc('transport.heartbeatInterval', j.store.heartbeatInterval)
    addFunc('transport.heartbeatTimeout', j.store.heartbeatTimeout)
    addFunc('transport.tls', j.store.tls)

    toml += '\n'

    let l = j.proxyListStore || []
    for (let i = 0; i < l.length; i++) {
        let c = l[i]
        if (!c.enable) {
            continue
        }
        toml += `[[proxies]]\n`
        addFunc("name", c.name)
        addFunc('type', c.type)
        addFunc("localIP", c.localIP)
        addFunc("localPort", c.localPort)

        addFunc("transport.useEncryption", c.useEncryption)
        addFunc("transport.useCompression", c.useCompression)
        addFunc("transport.bandwidthLimit", c.bandwidthLimit)
        addFunc("transport.bandwidthLimitMode", c.bandwidthLimitMode)
        if (c.proxyProtocolVersion != 'none') {
            addFunc("transport.proxyProtocolVersion", c.proxyProtocolVersion)
        }

        if (c.type == "http" || c.type == "https") {
            if (c.subdomain) {
                addFunc("subdomain", c.subdomain)
            }
            else if (c.customDomains) {
                addFunc('customDomains', `[${c.customDomains.split(" ").map(c => `"${c}"`).join(",")}]`)
            }
        }

        else if (c.type == "tcp" || c.type == "udp") {
            addFunc("remotePort", c.remotePort)
        }

        if (c.type == "http") {
            addFunc('locations', c.locations)
            if (c.enableHttpVerify) {
                addFunc("httpUser", c.httpUser)
                addFunc("httpPassword", c.httpPassword)
            }
            if (c.enableHostHeaderRewrite) {
                addFunc("hostHeaderRewrite", c.hostHeaderRewrite)
            }
        }

        if (c.type == "https") {
            if (c.enableHttps2http) {
                addFunc("plugin.localAddr", c.https2httpLocalAddr)
                addFunc("plugin.hostHeaderRewrite", c.https2httpHostHeaderRewrite)
                addFunc("plugin.crtPath", c.https2httpCrtpath)
                addFunc("plugin.keyPath", c.https2httpKeypath)
            }
        }

        if (c.type == "stcp") {
            addFunc("secretKey", c.stcpSecretKey)
            addFunc("allowUsers", `[${c.stcpAllowUsers.split(" ").map(c => `"${c}"`).join(",")}]`)
        }

        if (c.type == 'xtcp') {
            addFunc("secretKey", c.xtcpSecretKey)
            addFunc("allowUsers", `[${c.xtcpAllowUsers.split(" ").map(c => `"${c}"`).join(",")}]`)
        }
    }

    return toml

}