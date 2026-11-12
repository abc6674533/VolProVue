
//编辑弹出框全局设置页面已经审批的数据是否可以编辑
//row:当前编辑的行数据
const checkFormReadonly = (row, tableInfo) => {
    //1.返回true时，整个编辑设置为只读状态,不可修改数据
    //2.可以判断tableInfo.name对应是哪张单独处理逻辑
    //3.默认AuditStatus=1审批通过的字段不能再编辑，更多状态判断自己接着加

    //取消下面配置可全局设置审批通过的数据不能修改
    // if (row.AuditStatus == 1&&!(tableInfo.name||'').startsWith('sys')) {
    //     return true;
    // }
    return false;
}
//全局判断已经审批的数据是否可以删除
const checkDelRows = (rows, table) => {
    //这里自己判断数据，不能删除就提示
    // if (rows.some(x=>{return x.AuditStatus==1})) {
    //     return '已审批的数据不能删除';
    // }
    return;
}
export {
    checkFormReadonly,
    checkDelRows
}