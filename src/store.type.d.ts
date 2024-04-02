export type StoreType = {
    /** 服务器地址 */
    serverAddr: string
    /** 服务器端口 */
    serverPort: number
    /** 令牌 */
    token: string
    /** 用户名 */
    user: string
    /** 第一次登陆失败后是否退出，默认为 true */
    loginFailExit: boolean
    /** webServer 监听地址，默认为 127.0.0.1 */
    webServerAddr: string
    /** webServer 监听端口 */
    webServerPort: number
    /** webServer用户名 */
    webServerUser: string
    /** webServer密码 */
    webServerPW: string
    /** 和 frps 之间的通信协议，可选值为 tcp, kcp, quic, websocket, wss。默认为 tcp */
    transportProtocol: "tcp" | "kcp" | "quic" | "websocket" | "wss",
    /** TCP 多路复用，默认启用 */
    transportTcpMux: boolean,
    /** tcp_mux 的心跳检查间隔时间,默认为-1 */
    tcpMuxKeepaliveInterval: number
    /** 向服务端发送心跳包的间隔时间，默认为 30s。建议启用 tcp_mux_keepalive_interval，将此值设置为 -1 */
    heartbeatInterval: number
    /** 和服务端心跳的超时时间，默认为 90s */
    heartbeatTimeout: number
    /** 客户端 TLS 协议配置 */
    tls: boolean
    /** 日志输出文件路径，如果为 console，则会将日志打印在标准输出中 */
    logto: string
    /** 日志级别，可选值为 trace, debug, info, warn, error，默认级别为 info */
    loglevel: "trace" | "debug" | "info" | "warn" | "error"
    /** 日志文件最多保留天数，默认为 3 天 */
    logmaxDays: number
    /** 禁用标准输出中的日志颜色 */
    logdisablePrintColor: boolean
    /** 连接池大小,-1为默认不写 */
    poolCount: number,
    /** HTTPS 类型代理监听的端口，启用后才能支持 HTTPS 类型的代理 */
    vhostHTTPSPort: number
    /** HTTP 类型代理监听的端口，启用后才能支持 HTTP 类型的代理 */
    vhostHTTPPort: number
    /** crt证书内容 */
    crtContent:string
    /** crt证书路径 */
    crtUrl:string
    /** key密钥内容 */
    keyContent:string
    /** key密钥路径 */
    keyUrl:string
}