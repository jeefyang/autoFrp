export type ConfigType = {
    /** 监听端口 */
    listen: number
    /** 备份用的文件 */
    backupFile:string
}

export type BackupDataType={
    store?:any
    proxyListStore?:any[]
}