<template>
    <view-grid ref="grid" :columns="columns" :detail="detail" :details="details" :editFormFields="editFormFields"
        :editFormOptions="editFormOptions" :searchFormFields="searchFormFields" :searchFormOptions="searchFormOptions"
        :table="table" :extend="extend" :onInit="onInit" :onInited="onInited" :searchBefore="searchBefore"
        :searchAfter="searchAfter" :addBefore="addBefore" :updateBefore="updateBefore" :rowClick="rowClick"
        :modelOpenBefore="modelOpenBefore" :modelOpenAfter="modelOpenAfter">
        <!-- 自定义组件数据槽扩展，更多数据槽slot见文档 -->
        <template #gridHeader>
        </template>
    </view-grid> 
    <!-- :title="`${currentRow.TableCNName}(${currentRow.TableName})(${action})`" -->
    <vol-box :padding="10" v-model="model" :width="900" title="审计日志">
        <el-alert style="margin-bottom: 5px" show-icon
            :title="`${currentRow.TableCNName} / ${currentRow.TableName} / ${action}`" class="alert-primary"
            :closable="false"></el-alert>
        <div class="action-tabs" v-show="detailColumns.length"> <el-tabs v-model="activeName" @tab-click="tabsClick">
                <el-tab-pane name="main">
                    <template #label>
                        <span class="custom-tabs-label">
                            <el-icon>
                                <calendar />
                            </el-icon>
                            <span>{{ $ts('主表') }}</span>
                        </span>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="$ts('明细表')" name="detail">
                    <template #label>
                        <span class="custom-tabs-label">
                            <el-icon>
                                <calendar />
                            </el-icon>
                            <span>{{ $ts('明细表') }}</span>
                        </span>
                    </template>
                </el-tab-pane>
            </el-tabs></div>
        <div>
            <el-scrollbar :style="{ height: (height + (detailColumns.length ? 0 : 40)) + 'px' }">
                <table v-show="activeName == 'main'">
                    <thead>
                        <tr>
                            <td class="td-index td-bg">{{ $ts('序号') }}</td>
                            <td class="td-bg">{{ $ts('名称') }}</td>
                            <td class="td-bg">{{ $ts('字段') }}</td>
                            <td class="td-value">{{ $ts('修改前值') }}</td>
                            <td class="td-value">{{ $ts('修改后值') }} <el-popover title="说明" :width="280">
                                    <template #reference>
                                        <span style="color: #0247de; font-size: 13px;" class="el-icon-info"></span>
                                    </template>
                                    <div style="line-height: 2;">
                                        <div>红色字段为修改后的变化的字段值</div>
                                    </div>
                                </el-popover></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in diffColumns" :key="index">
                            <td class="td-index td-bg">{{ index + 1 }}.</td>
                            <td class="td-bg">{{ getTitle(item.field) }}</td>
                            <td class="td-bg">{{ item.field }}</td>
                            <td class="td-value">{{ currentRow.OriginalData[item.field] }}</td>
                            <td class="td-value"
                                :class="{ 'diff-value': currentRow.ChangedData[item.field] != currentRow.OriginalData[item.field] }">
                                {{
                                    currentRow.ChangedData[item.field] }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-show="activeName == 'detail' && detailData" class="detail-content">
                    <div><vol-table :table-data="detailData" :columns="detailColumns" :load-key="false" :ck="false"
                            :column-index="true" :height="height - 5"></vol-table>
                    </div>
                </div>

            </el-scrollbar>
        </div>
    </vol-box>
</template>
<script setup lang="jsx">
import extend from "@/extension/sys/log/Sys_ActionLog.jsx";
import viewOptions from './Sys_ActionLog/options.js'
import { ref, reactive, getCurrentInstance, watch, onMounted, computed } from "vue";
const grid = ref(null);
const { proxy } = getCurrentInstance()
//http请求，proxy.http.post/get
const { table, editFormFields, editFormOptions, searchFormFields, searchFormOptions, columns, detail, details } = reactive(viewOptions())

const model = ref(false);

const dicData = [{ key: "Add", value: "新建" }, { key: "Update", value: "编辑" }, { key: "Delete", value: "删除" }]

const action = computed(() => {
    return dicData.find(x => { return x.key == currentRow.value.OperationType })?.value
})
const height = ref(document.body.clientHeight * 0.67 - 5)
const activeName = ref('main')
const tabsClick = (item) => {
    activeName.value = item.index == 0 ? 'main' : 'detail'
    // initDraggableFields();
};
const tableData = reactive({});
const getTitle = (field) => {
    if (!tableData[currentRow.value.TableName]) {
        return field;
    }
    return tableData[currentRow.value.TableName].columns?.find(x => { return x.field == field })?.title || field;
}

const currentRow = ref({ OriginalData: {}, ChangedData: {} });
const diffColumns = computed(() => {
    if (!currentRow.value.OriginalData) {
        return []
    }

    return Object.keys(currentRow.value.OriginalData).map(x => {
        return {
            field: x,
            title: x
        }
    })

})

columns.forEach(x => {
    if (x.field == 'TableCNName') {
        x.formatter = (row) => {
            return `<a style="color: #1e6fff;cursor: pointer;">${row.TableCNName}(${row.TableName})</a> `
        }
        x.click = (row) => {
            showModel(row)
        }
    } else if (x.field == 'RequestParameter') {
        x.hidden = true;
    } else if (x.field == 'OperationType') {
        x.bind = { data: dicData, type: "select" }
        x.align = 'center'
    } else if (x.field == 'OriginalData' || x.field == 'ChangedData') {
    }
})
searchFormOptions.forEach(x => {
    x.forEach(ops => {
        if (ops.field == 'OperationType') {
            ops.type = 'select';
            ops.data = dicData
        }
    })
})

const detailData = ref([])

const detailColumns = ref([])

const showModel = async (row) => {
    activeName.value = 'main'
    currentRow.value.TableCNName = row.TableCNName;
    currentRow.value.TableName = row.TableName;
    currentRow.value.OperationType = row.OperationType;
    currentRow.value.OriginalData = row.OriginalData ? JSON.parse(row.OriginalData) : {};
    currentRow.value.ChangedData = row.ChangedData ? JSON.parse(row.ChangedData) : {};
    if (!tableData[row.TableName]) {
        tableData[row.TableName] = { columns: [] };
        const url = "api/Sys_ActionLog/getTableInfo?table=" + row.TableName
        await proxy.http.post(url, {}, false).then(x => {
            if (Array.isArray(x)) {
                tableData[row.TableName] = { columns: x };
            } else {
                tableData[row.TableName] = { columns: x.data, detail: x.detail };
            }
        })
    }
    detailData.value = []
    if (row.RequestParameter) {
        try {
            const params = JSON.parse(row.RequestParameter)
            if (params.DetailData) {
                detailData.value = params.DetailData
            }
        } catch (error) {
            console.log(error)
        }
    }
    if (tableData[row.TableName]?.detail?.columns?.length) {
        detailColumns.value = tableData[row.TableName].detail.columns.map(x => {
            return { title: x.title, field: x.field, hidden: x.hidden, showOverflowTooltip: true }
        })
    } else {
        detailColumns.value = []
    }
    if (detailColumns.value.length) {
       try {
         delete  currentRow.value.OriginalData[tableData[row.TableName].detail.table]
       } catch (error) {
          console.log(error)
       }
    }
    //console.log(detailColumns.value)
    model.value = true;
}

const index = columns.findIndex(x => { return x.field == 'ChangedData' });
if (index != -1) {
    columns.splice(index + 1, 0, {
        field: "compare",
        width: 60,
        align: 'center',
        title: "差异",
        formatter: (row) => {
            return '<a class="el-icon-mobile-phone" style="color: #1e6fff;border-bottom: 1px solid;cursor: pointer;">' + (proxy.$ts('查看')) + '</a>'
        },
        click: (row) => {
            showModel(row)
        }
    })
}

let gridRef;//对应[表.jsx]文件中this.使用方式一样
//生成对象属性初始化
const onInit = async ($vm) => {
    gridRef = $vm;
    gridRef.setFixedSearchForm(true);

}
//生成对象属性初始化后,操作明细表配置用到
const onInited = async () => {
}
const searchBefore = async (param) => {
    //界面查询前,可以给param.wheres添加查询参数
    //返回false，则不会执行查询
    return true;
}
const searchAfter = async (rows, result) => {
    return true;
}
const addBefore = async (formData, isCopyClick) => {
    //新建保存前formData为对象，包括明细表，可以给给表单设置值，自己输出看formData的值
    return true;
}
const updateBefore = async (formData) => {
    //编辑保存前formData为对象，包括明细表、删除行的Id
    return true;
}
const rowClick = ({ row, column, event }) => {
    //查询界面点击行事件
    // grid.value.toggleRowSelection(row); //单击行时选中当前行;
}
const modelOpenBefore = async (row, currentAction, isCopyClick) => {
    //弹出框打开前
    return true;//返回false，不会打开弹出框
}
const modelOpenAfter = (row, currentAction, isCopyClick) => {
    //弹出框打开后方法,设置表单默认值,按钮操作等
}
//监听表单输入，做实时计算
//watch(() => editFormFields.字段,(newValue, oldValue) => {	})
//对外暴露数据
defineExpose({})
</script>
<style scoped lang="less">
table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    thead td {
        font-weight: bolder !important;
        color: #000 !important;
        background-color: #f6f6f691;
    }

    // tr {
    // border-width: 1px;
    // border-style: solid;
    // border-color: #c8c8c852;
    // }

    // .td-bg {
    //     color: #000;
    //     //font-weight: bold;
    // }

    .td-bg,
    thead td,
    tr:nth-child(2n) td {
        background-color: #f6f6f691 !important;
    }

    td {
        padding: 0.55rem 0.4rem;
        font-size: 13px;
        word-break: break-all;
        border: 1px solid #c8c8c852;
    }

    .td-index {
        width: 45px;
        text-align: center;
    }

    .td-value {
        width: 300px;
        color: #000;
        //  font-weight: 500;
    }

    .diff-value {
        color: #fc1403;
        font-weight: bolder !important;
    }
}

.action-tabs {
    margin-bottom: 10px;
    top: -2px;
    position: relative;

    ::v-deep(.el-tabs) {
        .el-tabs__nav-wrap:after {
            height: 1px !important;
        }

        .el-tabs__header {
            margin: 0 !important;
        }

        .el-tabs__item {
            padding: 0 2px;
            margin-right: 20px;
        }

        .custom-tabs-label {
            align-items: center;
            display: flex;
        }

        .el-icon {
            margin-right: 3px;
        }  
    }
}
</style>
