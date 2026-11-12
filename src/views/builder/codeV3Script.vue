<template>
    <div class="sc-content" :style="{ height: height + 'px' }">

        <!-- <div style="padding:0px;margin-bottom:10px">
            <el-alert style="margin-bottom: -1px" title="配置js脚本处理页面事件逻辑,不需要发布编译实时生效,更多方法配置见生成页面文档" class="alert-primary"
                :closable="false"></el-alert>
        </div> -->
        <div class="code-editor">
            <div class="editor-toolbar">
                <!-- <select v-model="selectedLanguage" @change="handleLanguageChange">
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="python">Python</option>
                    <option value="json">JSON</option>
                </select> -->
                <el-button link icon="Document" @click="setDefaultScript">默认脚本</el-button>
                <el-button link icon="Delete" @click="clearDefaultCode">清除代码</el-button>
            </div>
            <MonacoEditor v-model:value="code" :language="language" :options="editorOptions"
                @editor-mounted="handleEditorMounted" :height="height + 'px'" />
        </div>
    </div>
</template>
<script lang="jsx" setup>
import MonacoEditor from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'
import { ref, reactive, getCurrentInstance, watch, defineAsyncComponent } from "vue";
const pros = defineProps({
    height: {
        type: Number,
        default: 100,
    },
    fieldOptions: {
        type: Array,
        default: () => {
            return [];
        },
    }
});



const defaultScript = `/*
 * @Description:配置js脚本处理页面事件逻辑,不需要编译发布,修改后实时生效,更多方法配置见框架文档
 */

function extension() {
    const onInit = async () => {
        //框架初始化配置前
    }
    const onInited = async () => {
        //框架初始化配置后
        //如果要配置明细表,在此方法操作
        //this.detailOptions.columns.forEach(column=>{ });
    }
    const searchBefore = async (param) => {
        //界面查询前,可以给param.wheres添加查询参数,返回false,则不会执行查询
        return true;
    }
    const searchAfter = async (result) => {
        //查询后result返回的查询数据
        return true;
    }
    const addBefore = async (formData) => {
        //新建保存前formData为对象,包括明细表
        return true;
    }
    const updateBefore = async (formData) => {//编辑保存前formData为对象，包括明细表、删除行的Id
        return true;
    }
    const rowClick = ({ row, column, event }) => {
        //查询界面点击行事件
    }
    const modelOpenAfter = (row, currentAction, isCopyClick) => {
        //点击编辑、新建按钮弹出框后，可以在此处写逻辑，如，从后台获取数据
    }
    return { onInit, onInited, searchBefore, searchAfter, addBefore, updateBefore, rowClick, modelOpenAfter}
}
   `;

// 编辑器内容
const code = ref('')


const setDefaultScript = () => {
    code.value = defaultScript;
}

const clearDefaultCode = () => {
    code.value = ''
}
// 当前语言
const language = ref('javascript')
const selectedLanguage = ref('javascript')

// 保存编辑器实例
let editorInstance = null

// 编辑器配置
const editorOptions = {
    fontSize: 14,
    tabSize: 2,
    autoIndent: true,
    minimap: { enabled: false }, // 隐藏迷你地图
    scrollBeyondLastLine: false,
    'javascript.validate.enable': false,
    // 额外关闭 TypeScript 对 JS 的类型检查（如果有）
    'typescript.validate.enable': false,
    // 禁用内置诊断（错误提示）
    'diagnosticsOptions': {
        'javascript': {
            'validate': false
        }
    },
    roundedSelection: false,
    readOnly: false, // 是否只读
    lineNumbers: 'on', // 显示行号
    lineDecorationsWidth: 10,
    folding: true, // 支持代码折叠
    theme: 'vs-dark' // 主题：vs, vs-dark, hc-black
}

// 编辑器挂载完成
const handleEditorMounted = (editor) => {
    editorInstance = editor
    console.log('编辑器已初始化')
    // 彻底关闭当前编辑器实例的语法校验
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true
    })
}

// 切换语言
const handleLanguageChange = () => {
    language.value = selectedLanguage.value
    // 根据语言重置示例代码
    resetSampleCode()
}

// 重置示例代码
const resetSampleCode = () => {

    code.value = `// JavaScript 示例
function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log(\`计算结果: \${result}\`);`

}

// 格式化代码
const formatCode = () => {
    if (!editorInstance) return

    editorInstance.executeEdits('', [
        {
            range: editorInstance.getModel().getFullModelRange(),
            text: code.value
        }
    ])

    // 触发格式化
    monaco.editor.executeEdits('', [])
    editorInstance.getAction('editor.action.formatDocument').run()
}

// 清空代码
const clearCode = () => {
    code.value = ''
}

// 监听语言变化，动态更新编辑器语言
watch(language, (newLang) => {
    if (editorInstance) {
        monaco.editor.setModelLanguage(editorInstance.getModel(), newLang)
    }
})
</script>
<style lang="less" scoped>
.sc-content {
    background: #fff;
}

.code-editor {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
}

.editor-toolbar {
    padding: 6px;
    background-color: #ffffffc7;
    display: flex;
    // gap: 10px;
    align-items: center;
}

.editor-toolbar {
    position: absolute;
    z-index: 99;
    right: 11px;
    background: #fff;
    border-bottom-left-radius: 5px;
}
</style>