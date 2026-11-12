<template>
    <vol-box :lazy="false" v-model="model" :title="title" :width="width" :padding="0">
        <div :style="{ height: height + 'px' }">
            <flow-panel ref="flow"></flow-panel>
        </div>
        <template #footer>
            <div style="text-align: center">
                <el-button type="default" size="small" @click="model = false">取消</el-button>
                <el-button type="primary" size="small" @click="save">保存</el-button>
            </div>
        </template>
    </vol-box>
</template>
<script setup>
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'
const {proxy}=getCurrentInstance();
const model = ref(false)
const height = ref(500)
const width = ref(1200)
const title = ref('表单编辑')


height.value = document.body.clientHeight - 200
let clientWidth = document.body.clientWidth * 0.8
width.value = clientWidth > 1700 ? 1700 : clientWidth

const currnetNode=ref({})

const showEdit = (node) => {
    if(node.name===''){
        return proxy.$message.error('请选中节点并设置节点名称后再点编辑表单')
    }
    console.log(node)
    currnetNode.value=node;
    model.value = true;
}

defineExpose({
    showEdit
})

</script>

<style scoped lang="less"></style>