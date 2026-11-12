// *Author：jxx
// *Contact：283591387@qq.com
// *代码由框架生成,任何更改都可能导致被代码生成器覆盖
export default function(){
    const table = {
        key: 'FormWorkFlow_Id',
        footer: "Foots",
        cnName: '流程管理',
        name: 'Sys_FormWorkFlow',
        newTabEdit: false,
        url: "/Sys_FormWorkFlow/",
        sortName: "OrderNo",
        fixedSearch:false
    };
    const tableName = table.name;
    const tableCNName = table.cnName;
    const newTabEdit = false;
    const key = table.key;
    const editFormFields = {"Name":"","Code":"","FormType":"","OrderNo":"","Enable":"","Remark":"","Icon":""};
    const editFormOptions = [[{"title":"流程名称","required":true,"field":"Name","colSize":100.0}],
                              [{"title":"流程编号","required":true,"field":"Code","colSize":100.0}],
                              [{"title":"流程类型","field":"FormType","colSize":100.0}],
                              [{"title":"显示排序","field":"OrderNo","colSize":100.0,"type":"number"}],
                              [{"dataKey":"enable","data":[],"title":"是否可用","field":"Enable","colSize":100.0,"type":"switch"}],
                              [{"title":"备注","field":"Remark","colSize":100.0,"type":"textarea"}],
                              [{"title":"图标","field":"Icon","colSize":100.0,"type":"img"}]];
    const searchFormFields = {"Name":"","Code":"","Creator":"","CreateDate":"","Modifier":""};
    const searchFormOptions = [[{"title":"流程名称","field":"Name","colSize":20.0},{"title":"流程编号","field":"Code","colSize":20.0},{"title":"创建时间","field":"CreateDate","colSize":20.0,"type":"date"},{"title":"创建 人","field":"Creator","colSize":20.0},{"title":"修改人","field":"Modifier","colSize":20.0}]];
    const columns = [{field:'FormWorkFlow_Id',title:'FormWorkFlow_Id',type:'string',width:110,hidden:true,require:true,align:'left'},
                       {field:'Name',title:'流程名称',type:'string',link:true,width:110,require:true,align:'left'},
                       {field:'Code',title:'流程编号',type:'string',width:90,require:true,align:'left'},
                       {field:'Icon',title:'图标',type:'img',width:70,align:'left'},
                       {field:'ParentId',title:'父级id',type:'string',width:110,hidden:true,align:'left'},
                       {field:'FormType',title:'流程类型',type:'string',width:90,align:'left'},
                       {field:'TitleTemplate',title:'标题模板',type:'string',width:150,hidden:true,align:'left'},
                       {field:'NodeConfig',title:'节点信息',type:'string',width:110,hidden:true,align:'left'},
                       {field:'LineConfig',title:'连接配置',type:'string',width:110,hidden:true,align:'left'},
                       {field:'FormOptions',title:'表单配置',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Config',title:'配置信息',type:'string',width:110,hidden:true,align:'left'},
                       {field:'DetailOptions',title:'配置信息',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Remark',title:'备注',type:'string',width:110,align:'left'},
                       {field:'Weight',title:'权重',type:'int',width:110,hidden:true,align:'left'},
                       {field:'OrderNo',title:'显示排序',type:'int',sort:true,width:90,align:'left'},
                       {field:'Enable',title:'是否可用',type:'byte',bind:{ key:'enable',data:[]},width:80,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建 人',type:'string',width:90,hidden:true,align:'left'},
                       {field:'CreateDate',title:'创建时间',type:'datetime',width:110,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:100,align:'left'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime',width:110,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'AuditingEdit',title:'AuditingEdit',type:'int',width:110,hidden:true,align:'left'},
                       {field:'DbServiceId',title:'DbServiceId',type:'string',width:110,hidden:true,align:'left'}];
    const detail =  {
                    cnName: '流程节点',
                    table: 'Sys_FormWorkFlowStep',
                    columns: [{field:'FormWorkStepFlow_Id',title:'FormWorkStepFlow_Id',type:'string',width:110,hidden:true,require:true,align:'left'},
                       {field:'FormWorkFlow_Id',title:'流程主表id',type:'string',width:110,align:'left'},
                       {field:'StepId',title:'流程节点Id',type:'string',width:120,align:'left'},
                       {field:'StepName',title:'节点名称',type:'string',width:180,align:'left'},
                       {field:'StepType',title:'节点类型(1=按用户审批,2=按角色审批)',type:'int',width:110,align:'left'},
                       {field:'StepValue',title:'审批用户id或角色id',type:'string',width:110,align:'left'},
                       {field:'OrderId',title:'OrderId',type:'int',width:110,align:'left'},
                       {field:'Remark',title:'备注',type:'string',width:110,align:'left'},
                       {field:'CreateDate',title:'CreateDate',type:'datetime',width:110,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'Creator',type:'string',width:100,align:'left'},
                       {field:'Enable',title:'Enable',type:'byte',width:110,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'NextStepIds',title:'NextStepIds',type:'string',width:110,align:'left'},
                       {field:'ParentId',title:'ParentId',type:'string',width:110,align:'left'},
                       {field:'AuditRefuse',title:'AuditRefuse',type:'int',width:110,align:'left'},
                       {field:'AuditBack',title:'AuditBack',type:'int',width:110,align:'left'},
                       {field:'AuditMethod',title:'AuditMethod',type:'int',width:110,align:'left'},
                       {field:'SendMail',title:'SendMail',type:'int',width:110,align:'left'},
                       {field:'Filters',title:'Filters',type:'string',width:110,align:'left'},
                       {field:'StepAttrType',title:'StepAttrType',type:'string',width:110,align:'left'},
                       {field:'Weight',title:'Weight',type:'int',width:110,align:'left'},
                       {field:'StepEditForm',title:'StepEditForm',type:'string',width:110,align:'left'},
                       {field:'AttachType',title:'AttachType',type:'string',width:150,align:'left'},
                       {field:'AllowUpload',title:'AllowUpload',type:'int',width:110,align:'left'},
                       {field:'AttachQty',title:'AttachQty',type:'int',width:110,align:'left'},
                       {field:'LinkMenu',title:'LinkMenu',type:'string',width:150,align:'left'},
                       {field:'Config',title:'Config',type:'string',width:110,align:'left'}],
                    sortName: 'CreateDate',
                    key: 'FormWorkStepFlow_Id'
                                            };
    const details = [];

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