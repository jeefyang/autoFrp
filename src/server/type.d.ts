import type { ProxyStoreType } from "./proxyStore.type.d"
import type { StoreType } from "./store.type.d"

export type ConfigType = {
    /** 监听端口 */
    listen: number
    /** 备份用的文件 */
    backupFile: string
    /** crt证书路径 */
    crtUrl: string
    /** key密钥路径 */
    keyUrl: string
    /** frpc的pm2的名字 */
    frpcPM2Name: string
    /** frpc的toml文件 */
    frpcTomlName: string
}

export type BackupDataType = {
    store?: StoreType
    proxyListStore?: ProxyStoreType[]
}

export type FrpStatusType = 'null' | 'online' | 'offline'

export type SetFrpType = 'start' | 'restart' | 'stop' | 'delete'

export type FrpStatusSendType = {
    status: FrpStatusType
}

export type SetFrpSendType = {
    status: boolean,
    act:SetFrpType
    frpStatus?: FrpStatusType,
    content?: string
}

