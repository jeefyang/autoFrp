import express from "express"
import cors from "cors"
import mime from "mime"
import fs from "fs"
import path from "path"
import bodyparser from "body-parser"
import type { ConfigType, BackupDataType, FrpStatusType, SetFrpType, FrpStatusSendType, SetFrpSendType } from "./type.d"
import { execSync } from "child_process"
import shell from "shelljs"
import { backupJson2frpcToml } from "./json2toml"




const app = express()
app.use(bodyparser.json({ limit: 'lmb' }))
app.use(bodyparser.urlencoded({ extended: true }))
// app.use(cors())
const jsonUrl = "./config.jsonc"
const exampleJsonUrl = "./config.example.jsonc"
if (!fs.existsSync(jsonUrl)) {
    fs.writeFileSync(jsonUrl, fs.readFileSync(exampleJsonUrl))
}

const jsonStr = fs.readFileSync(jsonUrl, "utf-8")
const configjson: ConfigType = eval(`(${jsonStr})`)

console.log(configjson)

console.log(`环境为:${import.meta.env.MODE}`)

// app.get("/", async (req, res) => {
//     console.log('hello')
//     res.send("hello world!!!")
//     return
// })

const vue_Router_list: string[] = ["/", "/list", "/other", "/home"]

let getFrpStatus = () => {
    let out = shell.exec("pm2 ls").stdout
    let list = out.split('\n')
    let status: FrpStatusType = "null"
    for (let i = 0; i < list.length; i++) {
        let c = list[i]
        if (c.indexOf(configjson.frpcPM2Name) == -1) {
            continue
        }
        if (c.indexOf("online") != -1) {
            status = 'online'
        }
        else {
            status = 'offline'
        }
        break
    }
    return status
}

app.get("/frpStatus", async (req, res) => {
    let status = getFrpStatus()
    let j: FrpStatusSendType = { status }
    res.send(JSON.stringify(j))
})

app.get("/setFrp", async (req, res) => {
    let u = new URL(`http://localhost${req.url}`)
    let list: SetFrpType[] = ['start', "restart", "stop", "delete"]
    let act = ""
    act = list.find(c => u.searchParams.has(c)) || ""
    let status = false
    if (!act) {
        res.send(JSON.stringify({ status }))
        return
    }
    let out = shell.exec(`pm2 ${act} ./pm2.frpc.jsonc`, { cwd: "./frp" }).stdout
    status = true
    let frpStatus = getFrpStatus()
    let j: SetFrpSendType = {
        status,
        frpStatus,
        content: out,
        act: <SetFrpType>act
    }
    res.send(JSON.stringify(j))
    return
})


app.get("/config", async (req, res) => {
    res.send(JSON.stringify(configjson))
})

app.get("/store", async (req, res) => {
    if (!fs.existsSync(configjson.backupFile)) {
        res.send("")
        return
    }
    let s = fs.readFileSync(configjson.backupFile, "utf-8")
    if (!s) {
        res.send("")
        return
    }
    let j: BackupDataType = JSON.parse(s)
    if (!j.store) {
        res.send("")
        return
    }
    res.send(JSON.stringify(j.store))
    return
})

app.get("/proxyListStore", async (req, res) => {
    if (!fs.existsSync(configjson.backupFile)) {
        res.send("")
        return
    }
    let s = fs.readFileSync(configjson.backupFile, "utf-8")
    if (!s) {
        res.send("")
        return
    }
    let j: BackupDataType = JSON.parse(s)
    if (!j.proxyListStore) {
        res.send("")
        return
    }
    res.send(JSON.stringify(j.proxyListStore))
})

const saveStoreFunc = (o: any) => {
    let d: BackupDataType = {}
    if (!fs.existsSync(configjson.backupFile)) {
        let dir = path.dirname(configjson.backupFile)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    }
    else {
        let s = fs.readFileSync(configjson.backupFile, "utf-8")
        d = JSON.parse(s)
    }
    d.store = o
    fs.writeFileSync(configjson.backupFile, JSON.stringify(d), "utf-8")
    return d
}

app.post("/saveStore", async (req, res) => {
    saveStoreFunc(req.body)
    res.send("saveStore success!!!")
    return
})

app.post("/applyStore", async (req, res) => {
    let d = saveStoreFunc(req.body)
    let t = backupJson2frpcToml(d) || ""
    fs.writeFileSync(configjson.frpcTomlName, t, { encoding: "utf-8" })
    res.send("saveStore success!!!")
    return
})

app.post('/loadCrtFile', async (req, res) => {
    let url = configjson.crtUrl
    if (req.body && req.body.url) {
        url = req.body.url
    }
    if (!fs.existsSync(url)) {
        res.send("")
        return
    }
    let s = fs.readFileSync(url, 'utf8')
    res.send(s)
    return
})

app.post("/saveCrtFile", async (req, res) => {
    let url = req?.body?.url || configjson.crtUrl
    if (!fs.existsSync(url)) {
        let dir = path.dirname(url)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    }
    fs.writeFileSync(url, req?.body?.content)
    res.send("crtfile save success!!!!")
    return
})

app.post('/loadKeyFile', async (req, res) => {
    let url = configjson.keyUrl
    if (req.body && req.body.url) {
        url = req.body.url
    }
    if (!fs.existsSync(url)) {
        res.send("")
        return
    }
    let s = fs.readFileSync(url, 'utf8')
    res.send(s)
    return
})

app.post("/saveKeyFile", async (req, res) => {
    let url = req?.body?.url || configjson.keyUrl
    if (!fs.existsSync(url)) {
        let dir = path.dirname(url)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    }
    fs.writeFileSync(url, req?.body?.content)
    res.send("keyfile save success!!!!")
    return
})

const saveProxyListStoreFunc = (o: any) => {
    let d: BackupDataType = {}
    if (!fs.existsSync(configjson.backupFile)) {
        let dir = path.dirname(configjson.backupFile)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    }
    else {
        let s = fs.readFileSync(configjson.backupFile, "utf-8")
        d = JSON.parse(s)
    }
    d.proxyListStore = o
    fs.writeFileSync(configjson.backupFile, JSON.stringify(d), "utf-8")
    return d
}

app.post("/saveProxyListStore", async (req, res) => {
    saveProxyListStoreFunc(req.body)
    res.send("saveProxyListStore success!!!")
    return
})

app.post("/applyProxyListStore", async (req, res) => {
    let d = saveProxyListStoreFunc(req.body)
    let t = backupJson2frpcToml(d) || ""
    fs.writeFileSync(configjson.frpcTomlName, t, { encoding: "utf-8" })
    res.send("saveProxyListStore success!!!")
    return
})

app.get(/\/*/, async (req, res, next) => {
    let p = req.path
    console.log(`加载路径为: ${p} ${req.url}`)
    for (let i = 0; i < vue_Router_list.length; i++) {
        let c = vue_Router_list[i]
        if (p == c) {
            p = '/index.html'
            break
        }
    }
    let url: string = ""
    if (import.meta.env.MODE == "development") {
        url = `./.dev_web${p}`
    }
    else if (import.meta.env.MODE == "production") {
        url = `./build_web${p}`
    }
    console.log(`加载网页文件:${url}`)
    if (fs.existsSync(url) && fs.statSync(url).isFile()) {
        res.setHeader("Content-Type", mime.getType(url) || "")
        res.send(fs.readFileSync(url))
        return
    }
    console.log(`无法加载文件:${url}`)
    if (import.meta.env.MODE == "development") {
        url = `./.dev_web${req.url}`
    }
    else if (import.meta.env.MODE == "production") {
        url = `./build_web${req.url}`
    }

    console.log(`尝试加载网页文件:${url}`)
    if (fs.existsSync(url) && fs.statSync(url).isFile()) {
        res.setHeader("Content-Type", mime.getType(url) || "")
        res.send(fs.readFileSync(url))
        return
    }
    console.log(url, 404)
    res.sendStatus(404)
    return
})

if (import.meta.env.MODE == "development") {

}
else {

}

app.listen(configjson.listen)
console.log(`监听启动:${configjson.listen}`)
