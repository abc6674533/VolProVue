<template>
    <!-- 如果带有token请求判断请取消下面的注释 -->
    <!-- <div v-if="token">
        <div class="iframe-container" v-for="(item, index) in list" :key="index">
            <iframe v-show="item.url && item.show" :src="getUrl(item)" :key="index" frameborder="0" ref="iframeRef" />
        </div>
    </div> -->

    <!-- 如果带有token请求判断请注释下面的代码-->
    <div class="iframe-container" :style="{'z-index':item.show?99:0}" v-for="(item, index) in list" :key="index">
        <iframe v-show="item.url && item.show" :src="getUrl(item)" :key="index" frameborder="0" ref="iframeRef" />
    </div>
</template>
<script setup>
import { getCurrentInstance, ref } from 'vue'
const { proxy } = getCurrentInstance();
const props = defineProps({
    list: {
        type: Array,
        default: () => {
            return []
            //     [{    show: true,
            // query:route.query,
            // params:route.params,
            // url: route.query.url}]
        }
    }
})
const token = ref();
////获取token
// proxy.http.post('url',{},false).then(x=>{
//        token.value=x.xx拼接url参数
// })
const getUrl = (item) => {
    // return `${decodeURIComponent(item.url)}`
    return `${decodeURIComponent(item.url)}${token.value||''}`
}

const iframeRef = ref();
</script>
<style scoped lang="less">
.iframe-container {
    position: absolute;
    height: 100%;
    width: 100%;

    iframe {

        height: 100%;
        width: 100%;
    }
}
</style>