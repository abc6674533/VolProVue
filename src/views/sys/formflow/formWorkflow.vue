<template>
    <div class="vol-dashboard">
        <div v-for="id in ids" :key="id" v-show="id == currentId">
            <vol-flow :id="id * 1"></vol-flow>
        </div>

    </div>
</template>
<script setup>
import { ref, getCurrentInstance, watch } from 'vue';
// import ViewGridAudit from '@/components/basic/ViewGrid/ViewGridAudit.vue'
import volFlow from './Sys_FormWorkFlowApply.vue'
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const ids = ref([])
const currentId = ref();
if (route.query.v + '') {
    ids.value.push(route.query.v)
    currentId.value = ids.value[0];
}
//关闭时销毁待完
watch(
    () => route.query.v, // 监听的目标：路由参数 id
    (newId, oldId) => {
        currentId.value = newId;
        if (ids.value.includes(newId)) {
            return;
        }
        ids.value.push(newId)
    }
)
</script>
<style scoped lang="less">
.vol-dashboard {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f9f9f9;
}

.vol-dashboard ::v-deep(.grid-layout-content) {
    margin: 0 !important;
}

.vol-dashboard ::v-deep(.grid-box) {
    padding: 0 !important;
}
</style>
