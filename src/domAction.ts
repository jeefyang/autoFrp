import { showToast, showLoadingToast, showConfirmDialog } from 'vant';
import { mainStorage } from './mainStorage';

class DomAction {

    saveStoreByLocalSotre() {
        mainStorage.saveStoreByLocalStorage()
        mainStorage.saveModifyStoreTimeByLocalStorage()
        showToast("已经保存到localstorage")
    }

    saveProxyStoreByLocalStorage() {
        mainStorage.saveProxyStoreByLocalStorage()
        mainStorage.saveModifyProxyStoreTimeByLocalStorage()
        showToast("已经保存到localstorage")
    }

    async loadPorxyStoreByCloud() {
        let status = await mainStorage.loadPorxyStoreByCloud()
        if (status) {
            showToast("已经从云端读取了代理列表")
            return true
        }
        else {
            showToast("无法从云端读取代理列表")
            return false
        }
        return false
    }

    async loadStoreByCloud() {
        let status = await mainStorage.loadStoreByCloud()
        if (status) {
            showToast("已经从云端读取了主配置信息")
            return true
        }
        else {
            showToast("无法从云端读取主配置信息")
            return false
        }
        return false
    }
}

export const domAction = new DomAction()