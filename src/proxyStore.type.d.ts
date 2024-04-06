export type ProxyStoreType = {
    type: "tcp" | "http" | "https" | "udp" | "stcp" | "xtcp"
    /** 服务端绑定的端口，用户访问服务端此端口的流量会被转发到对应的本地服务 */
    remotePort: number
    name: string
    /** 是否启用加密功能，启用后该代理和服务端之间的通信内容都会被加密传输，如果 frpc 启用了全局 TLS，则不需要再启用此参数 */
    useEncryption: boolean
    /** 是否启用压缩功能，启用后该代理和服务端之间的通信内容都会被压缩传输 */
    useCompression: boolean
    /** 设置单个 proxy 的带宽限流，单位为 MB 或 KB，0 表示不限制，如果启用，默认会作用于对应的 frpc */
    bandwidthLimit: string
    /** 限流类型，客户端限流或服务端限流，可选值为 client 和 server，默认为客户端限流 */
    bandwidthLimitMode: "client" | "server"
    /** 启用 proxy protocol 协议的版本，可选值为 v1 和 v2。如果启用，则 frpc 和本地服务建立连接后会发送 proxy protocol 的协议，包含了原请求的 IP 地址和端口等内容 */
    proxyProtocolVersion: "none"|"v1" | "v2"
    /** 是否开启用户验证 */
    enableHttpVerify: boolean
    /** HTTP Basic Auth 用户名 */
    httpUser: string
    /** HTTP Basic Auth 密码 */
    httpPassword: string
    /**是否开启URL 路由配置 */
    enableLocations: boolean
    /**URL 路由配置 */
    locations: string
    /** 子域名 */
    subdomain: string
    /** 自定义域名列表 */
    customDomains: string
    /** 是否启动 */
    enable: boolean
    /** 被代理的本地服务 IP，默认为 127.0.0.1 */
    localIP: string
    /** 被代理的本地服务端口 */
    localPort: number
    /** 是否启动https2http插件 */
    enableHttps2http: boolean
    /** 本地 HTTPS 服务地址,可包含端口 */
    https2httpLocalAddr: string
    /** TLS 证书文件路径 */
    https2httpCrtpath: string
    /** TLS 密钥文件路径 */
    https2httpKeypath: string
    /** 替换 Host header */
    https2httpHostHeaderRewrite: string
     /** 是否替换 Host Header */
    enableHostHeaderRewrite:boolean
    /** 替换 Host Header */
    hostHeaderRewrite:string
    /** stcp密钥，服务端和访问端的密钥需要一致，访问端才能访问到服务端 */
    stcpSecretKey:string
    /** xtcp密钥，服务端和访问端的密钥需要一致，访问端才能访问到服务端 */
    xtcpSecretKey:string
    /** 允许访问的 visitor 用户列表，默认只允许同一用户下的 visitor 访问，配置为 * 则允许任何 visitor 访问,用空格隔开 */
    stcpAllowUsers:string
    /** 允许访问的 visitor 用户列表，默认只允许同一用户下的 visitor 访问，配置为 * 则允许任何 visitor 访问,用空格隔开 */
    xtcpAllowUsers:string
}