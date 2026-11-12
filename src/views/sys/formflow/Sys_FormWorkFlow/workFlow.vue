<template>
    <!-- <vol-box :lazy="true" v-model="model" title="流程设置" :width="700" :padding="5" >
        <div style="height:300px">弹出框内容</div>
        <template #footer><el-button type="default" size="small" icon="Close" @click="save">关闭</el-button>
        </template>
</vol-box> -->
    <workFlow from @save="save" form ref="flowRef"></workFlow>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
import workFlow from '@/views/sys/flow/Sys_WorkFlow/WorkFlowGridHeader.vue'

const flowRef = ref();

const model = ref(false)
const save = (params) => {
    // console.log(params)
    Object.assign(currentRow, params.mainData)
    params.Extra = 1;
    proxy.http.post('api/Sys_FormWorkFlow/update', params, true).then(x => {
        if (x.status) {
            proxy.$message.success(x.message)
            flowRef.value.close();
            return;
        }
        proxy.$message.error(x.message)
    })
}

let currentRow = {}
const show = (row) => {
    currentRow = row;
    model.value = true;
    nextTick(() => {
        flowRef.value.open(row);
    })
}
defineExpose({ show })
</script>
