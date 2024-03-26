import express from "express"
import cors from "cors"
import mime from "mime"
import fs from "fs"
import path from "path"
import { type ConfigType } from "./type.d"


const app = express()
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

const vue_Router_list: string[] = ["/", "/about", "/home"]

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
