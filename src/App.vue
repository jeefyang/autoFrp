<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from "vue"
import { mainStorage } from "./mainStorage"
import { proxyStore } from './proxyStore';
import { otherStore } from "./otherStore"
import { store } from './store';
import { type ConfigType } from "@/server/type.d"

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
