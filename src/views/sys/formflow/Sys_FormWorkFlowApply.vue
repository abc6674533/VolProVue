<!--
 *Author：jxx
 *Date：{Date}
 *Contact：283591387@qq.com
 *业务请在@/extension/sys/formflow/Sys_FormWorkFlowApply.jsx或Sys_FormWorkFlowApply.vue文件编写
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
        </template>
    </view-grid>
    <view-grid-audit ref="auditRef" @auditAfter="auditAfter"></view-grid-audit>
</template>
<script setup lang="jsx">
import ViewGridAudit from '@/components/basic/ViewGrid/ViewGridAudit.vue'
import {
    cancelAuditClick,
    urgentAuditClick,
} from "@/components/basic/ViewGrid/ViewGridAuditConfig.jsx";
import extend from "@/extension/sys/formflow/Sys_FormWorkFlowApply.jsx";
import viewOptions from './Sys_FormWorkFlowApply/options.js'
import { ref, reactive, getCurrentInstance, watch, onMounted } from "vue";
const props = defineProps({
    id: {
        type: Number,
        default: 0,
    },
});
const auditRef = ref()
const grid = ref(null);
const { proxy } = getCurrentInstance()
//http请求，proxy.http.post/get
const { table, editFormFields, editFormOptions, searchFormFields, searchFormOptions, columns, detail, details } = reactive(viewOptions())

const auditAfter=()=>{
      gridRef.search();
}

const open = (rows) => {
    //  openForm({ rows, flow, table, anti, view })
    auditRef.value.openForm({
        rows,
        flow: true,
        table: 'Sys_FormWorkFlowApply',
        tableKey: "FormWorkFlowApply_Id",
        url: "api/Sys_FormWorkFlowApply/getSteps",
        auditUrl: "api/Sys_FormWorkFlowApply/auditData",
        anti: false,
        view: false
    })
}

let gridRef;//对应[表.jsx]文件中this.使用方式一样
//生成对象属性初始化
const onInit = async ($vm) => {

    gridRef = $vm;
    gridRef.queryFields = ['TitleTemplate', 'Code']
    gridRef.showTableAudit = false;
    gridRef.buttons.forEach(x => {
        if (x.value != 'Search') {
            x.hidden = true
        }
    })
    let width = 260;
    //表格上添加自定义按钮
    columns.push({
        title: "操作",
        field: "操作",
        width: width,
        fixed: "right",
        align: "center",
        render: (h, { row, column, index }) => {
            // const isAudit=row.
            const btns = proxy.base.getAuthButtons('Sys_FormWorkFlowApply');
            // console.log(btns)
            //console.log(btns);
            const cancelBtn = btns.some((x) => {
                return x.value == "CancelAudit" && (props.id === 0 || props.id === 2);
            });
            const abortBtn = btns.some((x) => {
                return x.value == "AbortAudit" && (props.id === 0 || props.id === 2);
            });
            const urgentBtn = btns.some((x) => {
                return x.value == "UrgentAudit" && (props.id === 0 || props.id === 2);
            });
            return (
                <div>
                    <el-button
                        link
                        onClick={($e) => {
                            open([row])
                            // audit.value.open([row], true);
                        }}

                        plain
                        size="small"
                        color={props.id == 50 ? "#646464" : "#0425dd"}
                        disabled={props.id == 50}
                        style="padding: 5px !important;margin: 0;"
                    >
                        <i style="font-size:13px" class="el-icon-edit-outline"></i>
                        {proxy.$ts("审核")}
                    </el-button>
                    <el-button
                        link
                        onClick={($e) => {
                            open([row], true)
                        }}
                        color="#0425dd"
                        plain
                        size="small"
                        style="padding: 5px !important;margin: 0;"
                    >
                        <i style="font-size:13px" class="el-icon-document"></i>
                        {proxy.$ts("查看")}
                    </el-button>
                    <el-button
                        link
                        onClick={($e) => {
                            // cancelAuditClick(proxy, props, [row], 1, row.WorkTable, [row.WorkTableKey]);
                        }}
                        color={cancelBtn ? "#0425dd" : "#646464"}
                        plain
                        size="small"
                        style="padding: 5px !important;margin: 0;"
                        disabled={!cancelBtn}
                    >
                        <i style="font-size:13px" class="el-icon-refresh"></i>
                        {proxy.$ts("撤销")}
                    </el-button>
                    <el-button
                        link
                        onClick={($e) => {
                            cancelAuditClick(proxy, props, [row], -1, row.WorkTable, [
                                row.WorkTableKey,
                            ]);
                        }}
                        color={abortBtn ? "#0425dd" : "#646464"}
                        plain
                        size="small"
                        style="padding: 5px !important;margin: 0;"
                        disabled={!abortBtn}
                    >
                        <i style="font-size:13px" class="el-icon-switch-button"></i>
                        {proxy.$ts("中止")}
                    </el-button>
                    <el-button
                        link
                        onClick={($e) => {
                            urgentAuditClick(proxy, props, [row], row.WorkTable, [row.WorkTableKey]);
                        }}
                        plain
                        size="small"
                        style="padding: 5px !important;margin: 0;"
                        color={urgentBtn ? "#0425dd" : "#646464"}
                        disabled={!urgentBtn}
                    >
                        <i style="font-size:13px" class="el-icon-message"></i>
                        {proxy.$ts("催办")}
                    </el-button>
                </div>
            );
        },
    });
};
// const isFlow = () => {
//     return proxy.$route.path == "/Sys_WorkFlowTable";
// };

//生成对象属性初始化后,操作明细表配置用到
const onInited = async () => {

}
const searchBefore = async (param) => {
    //界面查询前,可以给param.wheres添加查询参数
    //返回false，则不会执行查询
    param.value = props.id;
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
