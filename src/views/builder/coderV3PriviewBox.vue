<template>
    <vol-box title="预览" :width="width" :lazy="false" v-model="model">
        <vol-form ref="formRef" :load-key="false" :label-width="100" :formRules="formOptions" :formFields="formFields"
            :select2Count="10000"></vol-form>
        <template #footer>
            <div class="btns">
                <el-button v-if="!readonly" size="small" type="danger" icon="DocumentAdd"
                    @click="showCode">查看代码</el-button>
                <el-button v-if="downForm" size="small" color="#626aef" icon="Download"
                    @click="download">下载文件</el-button>
                <el-button type="default" size="small" icon="Close" @click="model = false">关闭</el-button>
            </div>
        </template>

    </vol-box>
    <vol-box title="查看代码" :width="width" :lazy="true" v-model="codeModel">
        <source-code></source-code>
    </vol-box>
</template>
<script setup lang="jsx">

import { ref, reactive, getCurrentInstance, watch, nextTick, defineAsyncComponent } from 'vue'

const props = defineProps({
    readonly: {
        type: Boolean,
        default: false
    },
    downForm: {
        //动态表单
        type: Boolean,
        default: false,
    }
})

const sourceCode = defineAsyncComponent(() => import("./coderV3PriviewBoxCode.vue"));
const formRef = ref();
const { proxy } = getCurrentInstance()
const model = ref(false)
const width = ref(0)

const formOptions = ref([]);
const formFields = ref({})

const codeModel = ref(false)

const docWidth = document.body.clientWidth * 0.85

let currentData;
let currentTableName;
const open = (data, tableName) => {
    if (!data.length) {
        return proxy.$message.error('请配置表单')
    }
    currentTableName = tableName
    currentData = data;
    const res = proxy.base.convertDataToFormOptions(data, tableName)
    formFields.value = res.fields;
    formOptions.value = res.formOptions;
    if (res.width > docWidth) {
        width.value = docWidth
    } else {
        width.value = res.width;
    }

    nextTick(() => {
        setTimeout(() => {
            formRef.value?.initDicKeys(true);
        }, 200);
    })
    model.value = true;
}

const showCode = () => {
    codeModel.value = true;
}

const download = () => {
    const res = proxy.base.convertDataToFormOptions(currentData, currentTableName)
    let template = ` 
<template>
  <vol-form
    ref="formRef"
    :load-key="true"
    :label-width="100"
    :formRules="formOptions"
    :formFields="formFields"
    :select2Count="10000"
  ></vol-form>
</template>
<script setup lang="jsx">
    import { ref, reactive, getCurrentInstance, watch, nextTick } from "vue";
    const formRef = ref();
    const { proxy } = getCurrentInstance();
    const formOptions = ref(${JSON.stringify(res.formOptions, null, 2)});
    const formFields = ref(${JSON.stringify(res.fields, null, 2)});
</${"script>"}
<style scoped lang="less">
</style>`

    const name = `volform_${proxy.base.getDate(true).replaceAll(" ", '').replaceAll(':', '').replaceAll('-', '')}.vue`
    const blob = new Blob([template], { type: 'text/plain;charset=utf-8' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = name
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
}

defineExpose({ open })
</script>
<style scoped lang="less">
// .priview-grid-content {
//     padding: 5px 5px 20px 5px;
//     background: #fff;
//     border-radius: 5px;
//     border: 1px solid #e7e7e7;
//     max-width: 1400px;
//     align-items: center;
//     margin: 0 auto;
//}
.btns {
    text-align: center;
}
</style>
