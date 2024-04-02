
type frpConfigExNameType = "ini" | "toml" | "op"

type frpMatchDataType = {
    /** 匹配到的对应数据的关键字段 */
    keyList?: string[],
    /** 匹配成功后的默认值 */
    val: string
    /** 是否显示出来 */
    isDisplay?: boolean
    desc?: string
}

type frpDataTransType = {
    /** 对应数据关键字 */
    keyList: string[]
    /** ini格式关键字 */
    iniKey?: string
    /** ini数据额外匹配赋予,有多个匹配规则请重复写多个 */
    iniData?: frpMatchDataType
    /** op数据额外匹配赋予,有多个匹配规则请重复写多个 */
    opData?: frpMatchDataType
    /** toml数据额外匹配赋予,有多个匹配规则请重复写多个 */
    tomlData?: frpMatchDataType
    opKey?: string
    /** json数据额外匹配赋予,有多个匹配规则请重复写多个 */
    jsonData?: frpMatchDataType
    /** toml格式关键字 */
    tomlKey?: string
    /** 数据类型 */
    dataType?: "num" | "str" | "json" | "bool" | "arr"
}