<template>
    <div class="workflow-form">
        <!-- label-position="left" -->
        <vol-form ref="formRef" @dicInited="dicInited" :load-key="false" :label-width="100" :formRules="formOptions"
            :formFields="formFields" :select2Count="10000"></vol-form>
        <div v-show="columns.length" style="padding:5px 10px">
            <vol-title style="margin-bottom:4px" :title="detailTile"></vol-title>
            <div>
                <vol-table ref="tableRef" :defaultLoadPage="false" :load-key="false" :paginationHide="false" :ck="false"
                    :column-index="true" :table-data="[]" :height="230" :columns="columns" :color="false"
                    :index="true"></vol-table>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, nextTick, readonly } from "vue";

// const width = ref(600)

const { proxy } = getCurrentInstance();

const tableRef = ref()

const formOptions = ref([]);
const formFields = ref({})
const formRef = ref()
const detailTile = ref('')

const fileType = ['img', 'file', 'excel']

const columns = ref([]);


let currentRow;
const open = async (options, row, tableName) => {
    const data = converForm(options)
    let fields = JSON.parse(row);
    currentRow = fields;
    formFields.value = {}
    data.flat().forEach(x => {
        formFields.value[x.field] = null;
        x.readonly = true;
        x.required = false;
        //x.label=true;
    })

    formOptions.value = data;// res.formOptions;

    const details = data.filter(x => { return x.detail })
    detailTile.value = details[0]?.title;
    let colWd = 0;
    if (details.length) {
        columns.value = details[0].tableData.map(c => {
            colWd += c.columnWidth || 0
            const obj = {
                title: c.columnCnName,
                field: c.columnName,
                width: c.columnWidth,
                hidden: c.isDisplay + '' !== '1'
            }
            if (c.editType) {
                obj.edit = { type: c.editType }
                if (fileType.includes(c.editType)) {
                    obj.edit.url = `api/${tableName}/upload`
                }
            }
            if (c.dropNo) {
                obj.bind = { data: [], key: c.dropNo }
            }
            // obj.hidden = !(c.isDisplay+''!=='0')
            obj.required = c.isNull + '' === '0'
            obj.readonly = !!c.isReadDataset
            //IsImage
            return obj;
        })
        width.value = colWd + 90;
        if (width.value > document.body.clientWidth * 0.95) {
            width.value = document.body.clientWidth * 0.95
        }
        nextTick(() => {
            tableRef.value?.initDicKeys(true);
            tableRef.value?.load({}, true);
        })
    }
    nextTick(() => {
        formRef.value.initSource(true);
    })
}

const dicInited = (result) => {
    setTimeout(() => {
        proxy.base.resetForm(
            formFields, formOptions, currentRow
        );
    }, 200);
}


// 根据长度规则对同一段非 textarea 字段分组
const groupByLength = (items) => {
    const result = [];
    const len = items.length;
    if (len === 0) return result;

    // 确定每组大小
    let size = 0;
    if (len >= 10) {
        size = 4;
    } else if (len >= 6) {
        size = 3;
    } else {
        // 其它情况不再拆分，整体一组
        result.push(items);
        return result;
    }

    for (let i = 0; i < len; i += size) {
        result.push(items.slice(i, i + size));
    }
    return result;
};

const converForm = (options) => {
    if (!options) {
        return [];
    }
    let data = JSON.parse(options)

    const allLengthOne = data.every(arr => Array.isArray(arr) && arr.length === 1);
    if (!allLengthOne) {
        return data;
    }
    const newData = [];
    let buffer = []; //当前段中的非 textarea 字段
    data.forEach(arr => {
        const element = arr[0];
        if (element && element.type === 'textarea') {
            // 先把前面累积的非 textarea 段按规则分组
            if (buffer.length) {
                newData.push(...groupByLength(buffer));
                buffer = [];
            }
            // textarea 自己单独一组，且保持当前位置
            newData.push([element]);
            return;
        }
        buffer.push(element);
    });
    if (buffer.length) {
        newData.push(...groupByLength(buffer));
    }
    return newData;
}
defineExpose({
    open
})

</script>
<style scope>
.workflow-form{
    padding-top: 10px;
}
</style>
