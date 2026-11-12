<!--
 *Author：jxx
 *Date：{Date}
 *Contact：283591387@qq.com
 *业务请在@/extension/sys/formflow/Sys_FormWorkFlow.jsx或Sys_FormWorkFlow.vue文件编写
 *新版本支持vue或【表.jsx]文件编写业务,文档见:https://doc.volcore.xyz/docs/view-grid、https://doc.volcore.xyz/docs/web
 -->
<template>
    <view-grid ref="grid" :columns="columns" :editFormFields="editFormFields" :editFormOptions="editFormOptions"
        :searchFormFields="searchFormFields" :searchFormOptions="searchFormOptions" :table="table" :extend="extend"
        :onInit="onInit" :onInited="onInited" :searchBefore="searchBefore" :searchAfter="searchAfter"
        :addBefore="addBefore" :updateBefore="updateBefore" :rowClick="rowClick" :modelOpenBefore="modelOpenBefore"
        :modelOpenAfter="modelOpenAfter">
        <!-- 自定义组件数据槽扩展，更多数据槽slot见文档 -->
        <template #gridBody>
            <el-alert type="primary" style="margin-bottom: 5px;" class="alert-primary " :closable="false">* 操作列的【流程表单】、【流程配置】同时配置后发起流程才会显示</el-alert>
        </template>
    </view-grid>
    <form-model ref="formRef"></form-model>
    <flow-model ref="flowRef"></flow-model>
</template>
<script setup lang="jsx">
import extend from "@/extension/sys/formflow/Sys_FormWorkFlow.jsx";
import viewOptions from './Sys_FormWorkFlow/options.js'
import { ref, reactive, getCurrentInstance, watch, onMounted, defineAsyncComponent } from "vue";

const formModel = defineAsyncComponent(() =>
    import("./Sys_FormWorkFlow/form.vue")
);

const flowModel = defineAsyncComponent(() =>
    import("./Sys_FormWorkFlow/workFlow.vue")
);

const formRef=ref();
const flowRef=ref()

const grid = ref(null);
const { proxy } = getCurrentInstance()
//http请求，proxy.http.post/get
const { table, editFormFields, editFormOptions, searchFormFields, searchFormOptions, columns, detail, details } = reactive(viewOptions())

let gridRef;//对应[表.jsx]文件中this.使用方式一样
//生成对象属性初始化
const onInit = async ($vm) => {
    gridRef = $vm;
    gridRef.queryFields = ['Name', 'Code']
    gridRef.pagination.sortName = "OrderNo";  //设置排序字段,多个字段排序用逗号隔开,如:a,b,c
    gridRef.pagination.order = "asc"; //排序方式desc或者asc
    //与jsx中的this.xx使用一样，只需将this.xx改为gridRef.xx
    //更多属性见：https://doc.volcore.xyz/docs/view-grid
}

//生成对象属性初始化后,操作明细表配置用到
const onInited = async () => {
    gridRef.height=gridRef.height-40;
    const showBtn = gridRef.buttons.some(x => { return x.value == 'Add' || x.value == 'Update' })
    if (!showBtn) {
        return;
    }
    columns.push({
        title: "操作",
        field: "操作",
        width: 160,
        fixed: "right",
        align: "center",
        render: (h, { row, column, index }) => {
            return (
                <div>
                    <el-button
                        link
                        onClick={($e) => {
                            formRef.value.show(row);
                        }}
                        color="#0425dd"
                        plain
                        size="small"
                        style="padding: 5px !important;margin: 0;"
                    >
                        <i style="font-size:13px" class="el-icon-edit-outline"></i>
                        {proxy.$ts("流程表单")}
                    </el-button>
                    <el-button
                        link
                        onClick={($e) => {
                             flowRef.value.show(row);
                        }}
                        color="#0425dd"
                        plain
                        size="small"
                        style="padding: 5px !important;margin: 0;"
                    >
                        <i style="font-size:13px" class="el-icon-document"></i>
                        {proxy.$ts("流程配置")}
                    </el-button>
                </div>
            );
        },
    });
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
    if (currentAction == 'Add') {
        editFormFields.Enable = 1
    }
    //弹出框打开后方法,设置表单默认值,按钮操作等
}
//监听表单输入，做实时计算
//watch(() => editFormFields.字段,(newValue, oldValue) => {	})
//对外暴露数据
defineExpose({})
</script>
