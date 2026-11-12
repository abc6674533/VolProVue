// *Author：jxx
// *Contact：283591387@qq.com
// *代码由框架生成,任何更改都可能导致被代码生成器覆盖
export default function(){
    const table = {
        key: 'FormWorkFlowApply_Id',
        footer: "Foots",
        cnName: '流程列表',
        name: 'Sys_FormWorkFlowApply',
        newTabEdit: false,
        url: "/Sys_FormWorkFlowApply/",
        sortName: "CreateDate",
        fixedSearch:false
    };
    const tableName = table.name;
    const tableCNName = table.cnName;
    const newTabEdit = false;
    const key = table.key;
    const editFormFields = {};
    const editFormOptions = [];
    const searchFormFields = {"TitleTemplate":"","Name":"","Code":"","Creator":"","CreateDate":""};
    const searchFormOptions = [[{"title":"标题","field":"TitleTemplate","colSize":20.0,"type":"like"},{"title":"流程名称","field":"Name","colSize":20.0},{"title":"流程编号","field":"Code","colSize":20.0},{"title":"申请人","field":"Creator","colSize":20.0},{"title":"申请时间","field":"CreateDate","colSize":20.0,"type":"date"}]];
    const columns = [{field:'FormWorkFlowApply_Id',title:'FormWorkFlowApply_Id',type:'string',width:110,hidden:true,require:true,align:'left'},
                       {field:'FormWorkFlow_Id',title:'流程实例id',type:'string',width:110,hidden:true,align:'left'},
                       {field:'TitleTemplate',title:'标题',type:'string',width:140,align:'left'},
                       {field:'Name',title:'流程名称',type:'string',width:150,hidden:true,require:true,align:'left'},
                       {field:'Code',title:'流程编号',type:'string',width:90,require:true,align:'left'},
                       {field:'FormType',title:'流程类型',type:'string',width:110,hidden:true,align:'left'},
                       {field:'FormOptions',title:'表单配置',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Config',title:'配置信息',type:'string',width:110,hidden:true,align:'left'},
                       {field:'FormData',title:'表单数据',type:'string',width:110,hidden:true,align:'left'},
                       {field:'DetailOptions',title:'配置信息',type:'string',width:110,hidden:true,align:'left'},
                       {field:'AuditStatus',title:'审批状态',type:'int',bind:{ key:'audit',data:[]},width:110,align:'left'},
                       {field:'CurrentStepId',title:'当前节点id',type:'string',width:120,align:'left'},
                       {field:'StepName',title:'当前节点',type:'string',width:110,align:'left'},
                       {field:'CurrentOrderId',title:'CurrentOrderId',type:'int',width:110,hidden:true,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'申请人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'申请时间',type:'datetime',width:110,align:'left'},
                       {field:'Enable',title:'Enable',type:'byte',width:110,hidden:true,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,hidden:true,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'DbServiceId',title:'DbServiceId',type:'string',width:110,hidden:true,align:'left'}];
    const detail ={columns:[]};
    const details = [  { 
                    cnName: '流程明细',
                    table: 'Sys_FormWorkFlowApplyStep',
                    columns: [{field:'WorkFlowApplyStep_Id',title:'WorkFlowApplyStep_Id',type:'string',width:110,hidden:true,require:true,align:'left'},
                       {field:'FormWorkFlowApply_Id',title:'FormWorkFlowApply_Id',type:'string',width:110,require:true,align:'left'},
                       {field:'FormWorkFlow_Id',title:'FormWorkFlow_Id',type:'string',width:110,align:'left'},
                       {field:'StepId',title:'StepId',type:'string',width:120,align:'left'},
                       {field:'StepName',title:'StepName',type:'string',width:180,align:'left'},
                       {field:'StepType',title:'StepType',type:'int',width:110,align:'left'},
                       {field:'StepValue',title:'StepValue',type:'string',width:110,align:'left'},
                       {field:'OrderId',title:'OrderId',type:'int',width:110,align:'left'},
                       {field:'AuditId',title:'审核人id',type:'int',width:110,align:'left'},
                       {field:'Auditor',title:'审核人',type:'string',width:110,align:'left'},
                       {field:'AuditStatus',title:'审核状态',type:'int',width:110,align:'left'},
                       {field:'AuditDate',title:'AuditDate',type:'datetime',width:110,align:'left'},
                       {field:'Remark',title:'Remark',type:'string',width:110,align:'left'},
                       {field:'CreateDate',title:'CreateDate',type:'datetime',width:110,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'Creator',type:'string',width:100,align:'left'},
                       {field:'Enable',title:'Enable',type:'byte',width:110,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'StepAttrType',title:'StepAttrType',type:'string',width:110,align:'left'},
                       {field:'ParentId',title:'ParentId',type:'string',width:110,align:'left'},
                       {field:'NextStepId',title:'NextStepId',type:'string',width:120,align:'left'},
                       {field:'Weight',title:'Weight',type:'int',width:110,align:'left'},
                       {field:'AuditMethod',title:'AuditMethod',type:'int',width:110,align:'left'},
                       {field:'FormOptions',title:'FormOptions',type:'string',width:110,align:'left'},
                       {field:'SourceType',title:'SourceType',type:'string',width:120,align:'left'},
                       {field:'AttachFile',title:'AttachFile',type:'string',width:150,align:'left'},
                       {field:'AttachType',title:'AttachType',type:'string',width:150,align:'left'},
                       {field:'StepEditForm',title:'StepEditForm',type:'string',width:110,align:'left'},
                       {field:'AttachQty',title:'AttachQty',type:'int',width:110,align:'left'}],
                    sortName: 'CreateDate',
                    key: 'WorkFlowApplyStep_Id',
                    buttons:[],
                    delKeys:[],
                    detail:null
                                            },                    { 
                    cnName: '流程列表明细数据',
                    table: 'Sys_FormWorkFlowApplyData',
                    columns: [{field:'WorkFlowApplyData_Id',title:'WorkFlowApplyData_Id',type:'string',width:110,hidden:true,require:true,align:'left'},
                       {field:'FormWorkFlowApply_Id',title:'FormWorkFlowApply_Id',type:'string',width:110,align:'left'},
                       {field:'FormWorkFlow_Id',title:'FormWorkFlow_Id',type:'string',width:110,align:'left'},
                       {field:'FormData',title:'表单数据',type:'string',width:110,align:'left'},
                       {field:'DetailOptions',title:'配置信息',type:'string',width:110,align:'left'},
                       {field:'Remark',title:'Remark',type:'string',width:110,align:'left'},
                       {field:'CreateDate',title:'CreateDate',type:'datetime',width:110,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'Creator',type:'string',width:100,align:'left'},
                       {field:'Enable',title:'Enable',type:'byte',width:110,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'}],
                    sortName: 'CreateDate',
                    key: 'WorkFlowApplyData_Id',
                    buttons:[],
                    delKeys:[],
                    detail:null
                                            }];

    return {
        table,
        key,
        tableName,
        tableCNName,
        newTabEdit,
        editFormFields,
        editFormOptions,
        searchFormFields,
        searchFormOptions,
        columns,
        detail,
        details
    };
}