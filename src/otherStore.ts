import { reactive } from "vue";
import type { OtherStoreType } from "./otherStore.type.d";

export const otherStore=reactive(<OtherStoreType>{
    proxyListUpdate:0,
    loadingMsg:""
})