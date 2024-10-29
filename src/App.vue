<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from "vue"
import { mainStorage } from "./mainStorage"
import { proxyStore } from './proxyStore';
import { otherStore } from "./otherStore"
import { store } from './store';
import { type ConfigType } from "@/server/type.d"
import { showToast, showConfirmDialog, showLoadingToast, showFailToast } from "vant";
import { domAction } from './domAction';

const active = ref(0)

onMounted(async () => {
  let config: ConfigType = await fetch('/config').then(s => s.json())
  store.crtUrl = config.crtUrl || store.crtUrl
  store.keyUrl = config.keyUrl || store.keyUrl
  if (mainStorage.isStoreBeginlocalStorage()) {
    console.log("读取云端store")
    mainStorage.loadStoreByCloud()
  }
  else {
    console.log("读取localstorage的store")
    mainStorage.loadStoreByLocalStorage()
  }

  if (mainStorage.isProxyStoreBeginlocalStorage()) {
    console.log("读取云端ProxyStore")
    mainStorage.loadPorxyStoreByCloud()
  }
  else {
    console.log("读取localstorage的ProxyStore")
    mainStorage.loadProxyStoreByLocalStorage()
  }


  otherStore.numUpdate++

  let s = await mainStorage.getFrpBackFileDate()
  let t = Number(s || 0)

  let storeTime = mainStorage.loadModifyStoreTimeByLocalStorage()

  let proxyStoreTime = mainStorage.loadModifyProxyStoreTimeByLocalStorage()

  let limitTime = config.updatelimitTime || (1000 * 60 * 60 * 24 * 30)
  // 时间间隔大于更新时间
  if (t - storeTime > limitTime) {
    await showConfirmDialog({
      title: `读取云端主信息`,
      message:
        '当前主信息已经有点旧了,需要更新吗',
    })
      .then(async () => {
        let s = await domAction.loadStoreByCloud()
        if (s) {
          domAction.saveStoreByLocalSotre()
        }
      })
      .catch(() => {
        // on cancel
      });
  }

  // 时间间隔大于更新时间
  if (t - proxyStoreTime > limitTime) {
    await showConfirmDialog({
      title: `读取云端代理信息`,
      message:
        '当前代理信息已经有点旧了,需要更新吗',
    })
      .then(async () => {
        let s = await domAction.loadPorxyStoreByCloud()
        if (s) {
          domAction.saveProxyStoreByLocalStorage()
        }
      })
      .catch(() => {
        // on cancel
      });
  }
})

const onUpdateListView = () => {
  setTimeout(() => {
    otherStore.proxyListUpdate += 1;
  }, 10);
}

const onUpdateOtherView = () => {
  setTimeout(() => {
    otherStore.otherUpdate += 1;
  }, 10);
}

</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->

  <van-config-provider theme="dark">
    <van-tabbar v-model="active" :route="true" :placeholder="true" :safe-area-inset-bottom="true">
      <van-tabbar-item icon="home-o" to="/">主信息</van-tabbar-item>
      <van-tabbar-item icon="bars" to="/list" @click="onUpdateListView">代理列表</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/other">其他</van-tabbar-item>
    </van-tabbar>
    <div class="boxtest">
      <RouterView />
    </div>
  </van-config-provider>



</template>

<style scoped>
.boxtest {
  height: calc(100% - var(--van-tabbar-height));
  position: absolute;
  overflow: auto;
  top: 0px;
  left: 0px;
  width: 100%;
}
</style>
