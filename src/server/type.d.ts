export type ConfigType = {
    /** 监听端口 */
    listen: number
    /** 备份用的文件 */
    backupFile:string
    /** crt证书路径 */
    crtUrl:string
    /** key密钥路径 */
    keyUrl:string
    /** frpc的pm2的名字 */
    frpcPM2Name:string
}

export type BackupDataType={
    store?:any
    proxyListStore?:any[]
}