// *Author：jxx
// *Contact：283591387@qq.com
// *代码由框架生成,任何更改都可能导致被代码生成器覆盖
export default function(){
    const table = {
        key: 'FormId',
        footer: "Foots",
        cnName: '表单配置',
        name: 'FormDesignOptions',
        newTabEdit: false,
        url: "/FormDesignOptions/",
        sortName: "CreateDate",
        fixedSearch:false
    };
    const tableName = table.name;
    const tableCNName = table.cnName;
    const newTabEdit = false;
    const key = table.key;
    const editFormFields = {"Title":""};
    const editFormOptions = [[{"title":"表单名称","required":true,"field":"Title","colSize":100.0}]];
    const searchFormFields = {"Title":"","DaraggeOptions":"","Creator":"","CreateDate":""};
    const searchFormOptions = [[{"title":"表单名称","field":"Title","colSize":25.0},{"title":"设计器配置","field":"DaraggeOptions","colSize":25.0},{"title":"创建人","field":"Creator","colSize":25.0},{"title":"创建时间","field":"CreateDate","colSize":25.0,"type":"date"}]];
    const columns = [{field:'FormId',title:'FormId',type:'string',width:110,hidden:true,require:true,align:'left'},
                       {field:'Title',title:'表单名称',type:'string',link:true,width:110,require:true,align:'left'},
                       {field:'DaraggeOptions',title:'设计器配置',type:'string',width:110,align:'left'},
                       {field:'FormOptions',title:'表单参数',type:'string',width:110,align:'left'},
                       {field:'FormConfig',title:'表单配置',type:'string',width:110,align:'left'},
                       {field:'FormFields',title:'FormFields',type:'string',width:110,hidden:true,align:'left'},
                       {field:'TableConfig',title:'表格配置',type:'string',width:110,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'创建时间',type:'datetime',width:110,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,hidden:true,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'}];
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