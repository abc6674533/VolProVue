<template>
    <div class="priview-grid">
        <div class="priview-grid-content">
            <view-grid ref="grid" :onInit="onInit" :onInited="onInited" :searchBefore="searchBefore"
                :searchAfter="searchAfter" :addBefore="addBefore" :updateBefore="updateBefore" :rowClick="rowClick"
                :searchFormFields="searchFormFields" :editFormFields="editFormFields" :modelOpenBefore="modelOpenBefore"
                :modelOpenAfter="modelOpenAfter" :detailSortEnd="detailSortEnd" :priview="true"
                :coderTableId="coderTableId">
                <!-- 自定义组件数据槽扩展，更多数据槽slot见文档 -->
                <template #gridBody>
                    <div style="margin-bottom: 5px;">
                        <el-alert style="margin-bottom: -1px"
                            title="1、预览看不到最新效果：请点保存再预览； 2、打开页面提示未找到请求地址：代码生成器点击[生成model]、[生成业务类]，然后重开后台"
                            class="alert-primary" :closable="false"></el-alert>
                    </div>
                </template>
            </view-grid>
        </div>
    </div>
</template>
<script setup lang="jsx">
import { ref, reactive, getCurrentInstance, watch, onMounted } from 'vue'
const grid = ref(null)
const { proxy } = getCurrentInstance()
//http请求，proxy.http.post/get

const coderTableId = ref((proxy.$route.query.id * 1) || 0)

const searchFormFields = reactive({})

const editFormFields = reactive({})

let gridRef //对应[表.jsx]文件中this.使用方式一样
//生成对象属性初始化
const onInit = async ($vm) => {
    gridRef = $vm
    //这里会影响表格滚动条显示
    //gridRef.setFixedSearchForm(true);

    //与jsx中的this.xx使用一样，只需将this.xx改为gridRef.xx
    //更多属性见：https://doc.volcore.xyz/docs/view-grid
}
//生成对象属性初始化后,操作明细表配置用到
const onInited = async () => {
    // gridRef.tableMaxHeight = gridRef.height- 125

    // gridRef.height = 0;
}
let hasWheres = false;
const searchBefore = async (param) => {
    //界面查询前,可以给param.wheres添加查询参数
    //返回false，则不会执行查询
    hasWheres = !!param.wheres.length
    return true
}
const searchAfter = async (rows, result) => {
    if (!rows.length && !hasWheres) {
        rows.push(...[{}, {}, {}])
    }
    return true
}
const addBefore = async (formData) => {
    //新建保存前formData为对象，包括明细表，可以给给表单设置值，自己输出看formData的值
    return true
}
const updateBefore = async (formData) => {
    //编辑保存前formData为对象，包括明细表、删除行的Id
    return true
}
const footerRef = ref()
//查询界面点击行事件,加载明细表数据
const rowClick = ({ row, column, event }) => {
    // grid.value.toggleRowSelection(row); //单击行时选中当前行;
    footerRef.value.gridRowClick(row)
}
const modelOpenBefore = async (row) => {
    //弹出框打开后方法
    return true //返回false，不会打开弹出框
}
const modelOpenAfter = (row) => {
    //弹出框打开后方法,设置表单默认值,按钮操作等
}
//明细表拖动排序
const detailSortEnd = (rows, newIndex, oldIndex, table) => {
    rows.forEach((x, index) => {
        x.RouteSequence = index + 1
    })
}
//监听表单输入，做实时计算
//watch(() => editFormFields.字段,(newValue, oldValue) => {	})
//对外暴露数据
defineExpose({})
</script>
<style scoped lang="less">
.priview-grid {
    position: absolute;
    height: 100%;
    width: 100%;
    padding: 15px;
    background: #f8f7f7;

}

.priview-grid-content {
    padding: 5px 5px 20px 5px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #e7e7e7;
    max-width: 1400px;
    align-items: center;
    margin: 0 auto;
}
</style>
