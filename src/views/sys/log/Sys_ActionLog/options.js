// *Author：jxx
// *Contact：283591387@qq.com
// *代码由框架生成,任何更改都可能导致被代码生成器覆盖
export default function(){
    const table = {
        key: 'ActionLogId',
        footer: "Foots",
        cnName: '审计日志',
        name: 'Sys_ActionLog',
        newTabEdit: false,
        url: "/Sys_ActionLog/",
        sortName: "CreateDate",
        fixedSearch:false 
    };
    const tableName = table.name;
    const tableCNName = table.cnName;
    const newTabEdit = false;
    const key = table.key;
    const editFormFields = {};
    const editFormOptions = [];
    const searchFormFields = {"TableName":"","TableCNName":"","OperationType":"","OriginalData":"","ChangedData":"","CreateDate":""};
    const searchFormOptions = [[{"title":"数据库表","field":"TableName","colSize":16.666},{"title":"业务表名","field":"TableCNName","colSize":16.666},{"title":"操作类型","field":"OperationType","colSize":16.666},{"title":"原始数据","field":"OriginalData","colSize":16.666,"type":"like"},{"title":"变更数据","field":"ChangedData","colSize":16.666,"type":"like"},{"title":"创建时间","field":"CreateDate","colSize":16.666,"type":"date"}]];
    const columns = [{field:'ActionLogId',title:'日志Id',type:'guid',width:110,hidden:true,require:true,align:'left'},
                       {field:'TableName',title:'数据库表',type:'string',width:100,hidden:true,align:'left'},
                       {field:'TableCNName',title:'业务表名',type:'string',width:130,align:'left'},
                       {field:'OperationType',title:'操作类型',type:'string',width:70,align:'left'},
                       {field:'OriginalData',title:'原始数据',type:'string',width:240,align:'left'},
                       {field:'ChangedData',title:'变更数据',type:'string',width:150,align:'left'},
                       {field:'RequestParameter',title:'请求参数',type:'string',width:110,align:'left'},
                       {field:'Url',title:'请求接口',type:'string',width:120,hidden:true,align:'left'},
                       {field:'DbServiceId',title:'租户id',type:'guid',width:110,hidden:true,align:'left'},
                       {field:'TenancyId',title:'租户id',type:'string',width:120,hidden:true,align:'left'},
                       {field:'Remark',title:'Remark',type:'string',width:150,hidden:true,align:'left'},
                       {field:'Options',title:'Options',type:'string',width:150,hidden:true,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:80,align:'left'},
                       {field:'CreateDate',title:'创建时间',type:'datetime',width:110,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,hidden:true,align:'left'}];
    const detail ={columns:[]};
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