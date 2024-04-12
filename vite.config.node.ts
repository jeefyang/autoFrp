import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import downgithub from "download-github-release"
import fs from "fs"
import zlib from "zlib"
import tar from 'tar'
import { ArchiveTarGz } from '@shockpkg/archive-files';
import path from 'path'

async function frpInit() {
    const github_frp = ""
    const frp_dir = "./frp"
    var user = 'fatedier';
    var repo = 'frp';
    var leaveZipped = false;
    let includename = "linux_amd64"
    let filename: string = ""
    let pm2FileName = "pm2.frpc.jsonc"
    let pm2ExampleFile = "./pm2.frpc.example.jsonc"

    if (!fs.existsSync(frp_dir)) {
        fs.mkdirSync(frp_dir)
        console.log("创建文件夹", frp_dir)
    }
    if (!fs.existsSync(path.join(frp_dir, pm2FileName))) {
        fs.writeFileSync(path.join(frp_dir, pm2FileName), fs.readFileSync(pm2ExampleFile))
        console.log(`复制frpc的PM2文件:${path.join(frp_dir, pm2FileName)}`)
    }
    let list = fs.readdirSync(frp_dir)
    for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf(includename) != -1) {
            filename = list[i]
            console.log("frp核心文件已经配置好了,无需下载")
            return
            // break
        }
    }
    if (!filename) {
        try {
            await downgithub(user, repo, frp_dir, undefined, (asset) => {
                if (asset.name.indexOf(includename) != -1) {
                    filename = asset.name
                    return true
                }
                return false
            }, leaveZipped)

        }
        catch {
            console.log("无法下载frp核心文件,请检查代码是否过时")
            return
        }
    }
    if (!filename) {
        console.log("没有找到frp版本下载")
        return
    }
    console.log("frp核心文件下载完毕!!!")
    console.log(path.join(frp_dir, filename))
    console.log("开始解压压缩包")
    const a = new ArchiveTarGz(path.join(frp_dir, filename))
    await a.read(async (entry) => {
        console.log(path.basename(entry.path))
        await entry.extract(path.join(frp_dir, 'extract', path.basename(entry.path)))
    })
    console.log('解压压缩包成功')
    return
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    console.log(mode)
    if (mode == "production") {
        await frpInit()
    }
    return {
        plugins: [
            ...VitePluginNode({
                adapter: 'express',
                appPath: './src/server/server.ts',
            }),
        ]
    }

})