<template>
    <div class="vol-dashboard">
        <div v-for="table in tables" :key="table" v-show="table == currentTable">
            <general></general>
        </div>
    </div>
</template>
<script setup>
import { ref, watch,getCurrentInstance } from 'vue';

import general from './general.vue'
import { useRouter, useRoute } from 'vue-router';
const {proxy}=getCurrentInstance();
const route = useRoute();
const tables = ref([])
const currentTable = ref();
if (route.params.table) {
    tables.value.push(route.params.table)
    currentTable.value = tables.value[0];
}
watch(
    () => route.params.table,
    (newTable, oldTable) => {
        currentTable.value = newTable;
        if (tables.value.includes(newTable)) {
            return;
        }
        tables.value.push(newTable)
    }
)
//关闭时移除页面缓存
proxy.$tabs?.$onClose(() => {
    const index= tables.value.findIndex(x => { return x == route.params.table })
    if (index!=-1) {
        tables.value.splice(index,1)
    }
});
</script>
<style scoped lang="less"></style>
