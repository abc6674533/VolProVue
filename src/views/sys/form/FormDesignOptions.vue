<!--
 *Author：jxx
 *Date：{Date}
 *Contact：283591387@qq.com
 *业务请在@/extension/sys/form/FormDesignOptions.jsx或FormDesignOptions.vue文件编写
 *新版本支持vue或【表.jsx]文件编写业务,文档见:https://doc.volcore.xyz/docs/view-grid、https://doc.volcore.xyz/docs/web
 -->
<template>
    <view-grid ref="grid" :columns="columns" :detail="detail" :details="details" :editFormFields="editFormFields"
        :editFormOptions="editFormOptions" :searchFormFields="searchFormFields" :searchFormOptions="searchFormOptions"
        :table="table" :extend="extend" :onInit="onInit" :onInited="onInited" :searchBefore="searchBefore"
        :searchAfter="searchAfter" :addBefore="addBefore" :updateBefore="updateBefore" :rowClick="rowClick"
        :modelOpenBefore="modelOpenBefore" :modelOpenAfter="modelOpenAfter">
        <!-- 自定义组件数据槽扩展，更多数据槽slot见文档 -->
        <template #gridHeader>
            <gridHeader ref="gridHeaderRef"></gridHeader>
        </template>
    </view-grid>
</template>
<script setup lang="jsx">
import gridHeader from './FormDesignOptions/FormCollectionOptionsGridHeader.vue'
import extend from "@/extension/sys/form/FormDesignOptions.jsx";
import viewOptions from './FormDesignOptions/options.js'
import { ref, reactive, getCurrentInstance, watch, onMounted } from "vue";
const grid = ref(null);
const { proxy } = getCurrentInstance()
//http请求，proxy.http.post/get
const { table, editFormFields, editFormOptions, searchFormFields, searchFormOptions, columns, detail, details } = reactive(viewOptions())

const gridHeaderRef = ref();
let gridRef;//对应[表.jsx]文件中this.使用方式一样
//生成对象属性初始化
const onInit = async ($vm) => {
    gridRef = $vm;

    columns.splice(columns.findIndex(x => { return x.field == 'FormFields' }), 1, ...[{
        title: "操作",
        field: "表单设计",
        with: 80,
        sort: false,
        formatter: () => {
            return '<a style="color: #3a8ee6;">表单设计</a>'
        },
        click: (row) => {
            gridHeaderRef.value.open(row);
        }
    },
    {
        title: "预览",
        field: "预览",
        with: 85,
        sort: false,
        formatter: () => {
            return '<a style="color: #3a8ee6;">预览</a>'
        },
        click: (row) => {
            proxy.$tabs.open({
                path: "/formSubmit", text: row.Title, query: {
                    id: row.FormId
                }
            })
            //  this.$refs.gridHeader.open(row);
        }
    }])
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
