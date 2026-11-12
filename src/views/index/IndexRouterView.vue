<template>
  <div v-show="!isIframe">
    <router-view v-slot="{ Component }" v-if="useIncludeCache">
      <keep-alive :include="include">
        <component :is="Component" :key="route.name" v-if="
          isRouterAlive &&
          (route.meta?.keepAlive === undefined || route.meta?.keepAlive === true)
        " />
      </keep-alive>
      <component :is="Component" :key="route.name" v-if="route.meta?.keepAlive === false" />
    </router-view>

    <router-view v-slot="{ Component }" v-else>
      <keep-alive>
        <component :is="Component" :key="route.name + componentKey"
          v-if="route.meta?.keepAlive === undefined || route.meta?.keepAlive === true" />
      </keep-alive>
      <component :is="Component" :key="route.name" v-if="route.meta?.keepAlive === false" />
    </router-view>
  </div>
  <div v-show="isIframe">
    <iframe-page :list="list"></iframe-page>
    <!-- <component v-show="page.show" v-for="(page) in item.pages" :key="page.url" :is="dyiframs[item.name]"></component> -->
  </div>
</template>
<script setup>
// import VolLoading from "@/components/basic/VolLoading";
import { useRouter, useRoute } from "vue-router";
import {
  ref,
  getCurrentInstance,
  nextTick,
  computed,
  watch,
  defineAsyncComponent,
} from "vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

import iframePage from "./IFramePage.vue";
// import dyiframs from './DyIFram.js'

//每次打开iframe判断name存在，就再判断pages的参数,不存在就添加,关闭就清除pages的数据，跳转设置show=false
const list = ref([]);
const isIframe = computed(() => {
  if (!route.meta?.isIframe) return false;
  if (!route.query.url) {
    console.log("未配置url");
    return true;
  }
  const item = list.value.find((x) => {
    return x.url == route.query.url;
  });
  list.value.forEach((x) => {
    return (x.show = false);
  });
  if (item) {
    item.show = true;
    return true;
  }
  list.value.push({
    show: true,
    query: route.query,
    params: route.params,
    url: route.query.url,
  });
  return true;
});

const isRouterAlive = ref(true);

const useIncludeCache = ref(true);
useIncludeCache.value =
  proxy.$global.useIncludeCache || proxy.$global.useIncludeCache === undefined;

const componentKey = ref("");

const refreshPage = (routeName, _callback) => {
  routeName = routeName || router.currentRoute.value.name;
  //旧版缓存
  if (!useIncludeCache.value) {
    setTimeout(() => {
      // if ((routeName && typeof (routeName) == 'string')) {
      routeName = route.name;
      //}
      componentKey.value = routeName + Date.now();

      router.replace({ ...route });
      if (_callback && typeof _callback == "function") {
        setTimeout(() => {
          _callback();
        }, 300);
      }
    }, 50);
    return;
  }
  const name = routeName || router.currentRoute.value.name;
  clearCache(name);
  //刷新当前页面
  if (routeName && routeName === router.currentRoute.value.name) {
    isRouterAlive.value = false;
    nextTick(() => {
      isRouterAlive.value = true;
      include.value.push(name);
    });
  }
};

const clearCache = (name) => {
  if (!name) {
    name = router.currentRoute.value.name;
  }
  const index = include.value.indexOf(name);
  if (index != -1) {
    include.value.splice(index, 1);
  }
};

proxy.$tabs.clearCache = (name) => {
  clearCache(name);
};
const include = ref([]);
router.beforeEach((to, from, next) => {
  if (!to.meta || to.meta?.edit || to.meta.keepAlive !== false) {
    if (!include.value.includes(to.name)) {
      include.value.push(to.name);
    }
  }
  next();
});

proxy.$tabs.reload = refreshPage;
proxy.$tabs.clearCache = clearCache;
include.value.push(router.currentRoute.value.name);


const tabsObserverFun = {};
//监听tabs关闭事件
proxy.$tabs.$onClose = (fun) => {
  tabsObserverFun[route.path] = fun;
};
proxy.$tabs.$closeObserver = (key, item) => {
  if (typeof tabsObserverFun[key] == 'function') {
    tabsObserverFun[key]()
  }
};
// watch(
//    () => route.query.id, // 监听的目标：路由参数 id
//    (newId, oldId) => {
//       currentId.value = newId;
//       if (ids.value.includes(newId)) {
//          return;
//       }
//       ids.value.push(newId)
//    }
// )
</script>
