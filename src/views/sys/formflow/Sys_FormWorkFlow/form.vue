<template>
    <vol-box :lazy="false" v-model="model" title="表单设置" :width="width" :padding="5">
        <div :style="{ height: height + 'px' }">
            <coder-form-panel dy-form currentAction="edit" ref="formPanelRef" form-type="workflow"
                @saveClick="save"></coder-form-panel>
        </div>
        <template #footer>
            <div style="text-align: center;"><el-button type="default" size="small" icon="Close"
                    @click="model = false">{{ $ts('关闭') }}</el-button>
                <el-button type="danger" size="small" icon="Check" @click="save">{{ $ts('保存') }}</el-button>
            </div>
        </template>
    </vol-box>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, defineAsyncComponent, nextTick } from 'vue'
// const coderFormPanel = defineAsyncComponent(() =>
//     import("@/views/builder/coderV3Form.vue")
// );
import coderFormPanel from '@/views/builder/coderV3Form.vue'
import {
    dataType
} from "@/views/builder/coderV3Options.jsx";
const formComponents = dataType.filter(x => { return !['selectTable', 'time'].includes(x.key) }).map(x => {
    return {
        title: x.value,
        formType: x.key,
        field: x.key
    }
})

const height = ref(0);
const width = ref(0);
height.value = document.body.clientHeight * 0.80;
width.value = document.body.clientWidth * 0.9
if (width.value > 1500) {
    width.value = 1500;
}

const formPanelRef = ref()
const { proxy } = getCurrentInstance()
const model = ref(false)
const save = () => {
    const options = formPanelRef.value.getFormOptions();
    if (!options) {
        return;
    }
    currentRow.FormOptions = JSON.stringify(options)
    proxy.http.post('api/Sys_FormWorkFlow/update', { mainData: currentRow }, true).then(x => {
        if (x.status) {
            proxy.$message.success(x.message)
            return;
        }
        proxy.$message.error(x.message)
    })
    return
    //  model.value = false
}
let currentRow = {};
const show = (row) => {
    //row.FormOptions
    currentRow = row
    model.value = true;
    nextTick(async () => {
        formPanelRef.value?.initDraggableFields(formComponents, JSON.parse(currentRow.FormOptions || '[]'), 'edit')
    })
}
defineExpose({ show })
</script>
