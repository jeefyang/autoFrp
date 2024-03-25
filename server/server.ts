import express from "express"
import cors from "cors"
import mime from "mime"
import fs from "fs"
import path from "path"
import { ConfigType } from "./type"


const app = express()
app.use(cors())
const jsonUrl = "./config.jsonc"
const exampleJsonUrl = "./config.example.jsonc"
if (!fs.existsSync(jsonUrl)) {
    fs.writeFileSync(jsonUrl, fs.readFileSync(exampleJsonUrl))
}

const jsonStr = fs.readFileSync(jsonUrl, "utf-8")
const configjson: ConfigType = eval(`(${jsonStr})`)

console.log(configjson)

