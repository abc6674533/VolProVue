<template>
    <vol-box :lazy="false" v-model="model" :title="title" :width="width" :padding="0">
        <div class="edit-panel-content" :style="{ height: height + 'px' }">
            <coder-form-panel currentAction="edit" ref="formPanelRef" form-type="workflow"
                @saveClick="saveClick"></coder-form-panel>
        </div>
        <template #footer>
            <!-- <div style="text-align: center">
                <el-button type="default" size="small" @click="model = false">取消</el-button>
                <el-button type="primary" size="small" @click="save">保存</el-button>
            </div> -->
        </template>
    </vol-box>
</template>
<script setup>
import coderFormPanel from '@/views/builder/coderV3Form.vue'
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance();
const model = ref(false)
const height = ref(500)
const width = ref(1200)
const title = ref('表单编辑')

const formPanelRef = ref()

height.value = document.body.clientHeight - 200
let clientWidth = document.body.clientWidth * 0.8
width.value = clientWidth > 1700 ? 1700 : clientWidth

const currnetNode = ref({})



const initFieldOptions = (tableData) => {
    return tableData.map((x) => {
        const obj = {
            title: x.columnCnName || x.columnName, //名字
            field: x.columnName, //字段
            formType: x.columnType == "DateTime" || x.columnType == "datetime" ? 'date' : null, //编辑类型
            isNull: x.isNull,
            isReadDataset: x.isReadDataset, //是否只读
        };
        if (x.detail) {
            obj.detail = true;
        }
        if (x.tableData) {
            obj.tableData = x.tableData;
        }
        if (x.line) {
            obj.disabled=true;
            obj.line = x.line;
        }
        return obj;
    })
};

const tableInfo = {}

const showEdit = (node, tableName) => {
    if (node.name === '') {
        return proxy.$message.error('请选中节点并设置节点名称后再点编辑表单')
    }
    if (!tableName) {
        return proxy.$message.error('请选择左侧[流程实例]')
    }
    //console.log(node)
    if (!Array.isArray(node.Config)) {
        node.Config = []
    }
    currnetNode.value = node;

    model.value = true;
    nextTick(async () => {
        //const editOptions = []
        //{"title":"所属仓库","field":"BelongWarehouse","rowNo":1,
        //"colNo":11,"formType":"select",
        //"dropNo":"ERP仓库","width":33.333,
        //"isReadDataset":0,"isNull":1}

        if (!tableInfo[tableName]) {
            const table = tableName;// 'MES_ProductionReporting'
            await proxy.http.post("api/sys_workflow/getTable", [table], true).then(async x => {
                if (!x.data.length) {
                    return proxy.$message.error(`未查到表[${table}]表配置信息,请检查代码生成器中是否存在(如果是正式环境表配置不存在请从本地同步sys_tableinfo、sys_tablecolumn表到服务器)`)
                }
                if (x.detail.detailName) {
                    try {
                        const detailNames = x.detail.detailCnName.replaceAll('，', ',').split(',')
                        const detailTables = x.detail.detailName.replaceAll('，', ',').split(',')
                        const columns = await proxy.http.post("api/sys_workflow/getTable?isDetail=true", detailTables, true).then(x => {
                            return x;
                        })
                        const detailArr = detailNames.map((x, index) => {
                            return {
                                columnCnName: x,
                                columnName: detailTables[index],
                                detail: true,
                                tableData: columns.filter(c => { return c.tableName == detailTables[index] })
                            }
                        })
                        if (detailArr.length) {
                            x.data.push({ line: true })
                            x.data.push(...detailArr)
                        }

                    } catch (error) {
                        console.log('解析明细表异常', error)
                    }
                }
                const fieldOptions = initFieldOptions(x.data);
                //二次过滤校正字段
                currnetNode.value.Config = currnetNode.value.Config
                    .filter(x => {
                        return fieldOptions.some(c => { return x.field == c.field })
                    })
                tableInfo[tableName] = { fieldOptions: fieldOptions, detail: x.detail };
            })
        }
        formPanelRef.value?.initDraggableFields(tableInfo[tableName].fieldOptions, node.Config, 'edit')
    })
}


const saveClick = (formOptions) => {
    currnetNode.value.Config = formOptions
    //console.log(formOptions)
    model.value = false;
}
defineExpose({
    showEdit
})

</script>

<style scoped lang="less">
.edit-panel-content ::v-deep(.el-form-item .el-form-item__label) {
    margin-bottom: 10px !important;
}
</style>