import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {Switch ,Popup,Picker, Button, Tabbar, TabbarItem, ConfigProvider,Grid, GridItem,Icon,Field, CellGroup  } from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)


app.use(Button)
app.use(Tabbar)
app.use(TabbarItem)
app.use(ConfigProvider)
app.use(Grid);
app.use(GridItem);
app.use(Icon)
app.use(Field);
app.use(CellGroup);
app.use(Popup)
app.use(Picker)
app.use(Switch)
app.use(router)
app.mount('#app')
