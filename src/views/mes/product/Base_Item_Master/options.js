// *
// *
// *代码由框架生成,任何更改都可能导致被代码生成器覆盖
export default function(){
    const table = {
        key: 'GUID',
        footer: "Foots",
        cnName: '料品信息',
        name: 'Base_Item_Master',
        newTabEdit: false,
        url: "/Base_Item_Master/",
        sortName: "GUID",
        fixedSearch:false
    };
    const tableName = table.name;
    const tableCNName = table.cnName;
    const newTabEdit = false;
    const key = table.key;
    const editFormFields = {"ItemCode":"","ItemName":"","Version":"","Old_ItemCode":"","Old_ItemName":"","StockCategory":"","ItemFeature":"","StorageCode":"","StorageName":"","Specs":"","Unit":"","Department":"","Effective":"","Material":""};
    const editFormOptions = [[{"title":"料号","required":true,"field":"ItemCode","colSize":25.0},
                               {"title":"料名","required":true,"field":"ItemName","colSize":25.0},
                               {"title":"料号版本","field":"Version","colSize":25.0},
                               {"title":"旧的料号","field":"Old_ItemCode","colSize":25.0}],
                              [{"title":"旧的料名","field":"Old_ItemName","colSize":25.0},
                               {"title":"库存分类","field":"StockCategory","colSize":25.0},
                               {"dataKey":"料品属性","data":[],"title":"料品属性","required":true,"field":"ItemFeature","colSize":25.0,"type":"select"},
                               {"title":"存储地点代码","field":"StorageCode","colSize":25.0}],
                              [{"title":"存储地点名","field":"StorageName","colSize":25.0},
                               {"title":"规格","field":"Specs","colSize":25.0},
                               {"dataKey":"单位","data":[],"title":"单位","required":true,"field":"Unit","colSize":25.0,"type":"select"},
                               {"dataKey":"部门级联","data":[],"title":"所属部门","field":"Department","colSize":25.0,"type":"select"}],
                              [{"title":"材质","field":"Material","colSize":25.0},
                               {"dataKey":"enable","data":[],"title":"是否生效","field":"Effective","colSize":25.0,"type":"radio"}]];
    const searchFormFields = {"ItemCode":"","ItemName":"","Old_ItemCode":"","Old_ItemName":"","StockCategory":"","StorageName":"","Specs":""};
    const searchFormOptions = [[{"title":"料号","field":"ItemCode","colSize":25.0,"type":"like"},{"title":"料名","field":"ItemName","colSize":25.0},{"title":"旧的料号","field":"Old_ItemCode","colSize":25.0},{"title":"旧的料名","field":"Old_ItemName","colSize":25.0}],[{"title":"库存分类","field":"StockCategory","colSize":25.0},{"title":"存储地点名","field":"StorageName","colSize":25.0},{"title":"规格","field":"Specs","colSize":25.0}]];
    const columns = [{field:'GUID',title:'guid',type:'string',width:120,hidden:true,require:true,align:'left'},
                       {field:'ItemCode',title:'料号',type:'string',width:100,require:true,align:'left'},
                       {field:'ItemName',title:'料名',type:'string',width:100,require:true,align:'left'},
                       {field:'Version',title:'料号版本',type:'string',width:80,align:'left'},
                       {field:'Old_ItemCode',title:'旧的料号',type:'string',width:100,align:'left'},
                       {field:'Old_ItemName',title:'旧的料名',type:'string',width:100,align:'left'},
                       {field:'StockCategory',title:'库存分类',type:'string',width:100,align:'left'},
                       {field:'ItemFeature',title:'料品属性',type:'string',bind:{ key:'料品属性',data:[]},width:80,require:true,align:'left'},
                       {field:'StorageCode',title:'存储地点代码',type:'string',width:80,hidden:true,align:'left'},
                       {field:'StorageName',title:'存储地点名',type:'string',width:100,align:'left'},
                       {field:'Effective',title:'是否生效',type:'string',bind:{ key:'enable',data:[]},width:80,align:'left'},
                       {field:'Specs',title:'规格',type:'string',width:100,align:'left'},
                       {field:'Unit',title:'单位',type:'string',bind:{ key:'单位',data:[]},width:60,require:true,align:'left'},
                       {field:'Department',title:'所属部门',type:'string',bind:{ key:'部门级联',data:[]},width:100,align:'left'},
                       {field:'DepartmentCode',title:'所属部门代码',type:'string',width:120,hidden:true,align:'left'},
                       {field:'Long',title:'长',type:'decimal',width:110,hidden:true,align:'left'},
                       {field:'Wide',title:'宽',type:'decimal',width:110,hidden:true,align:'left'},
                       {field:'High',title:'高',type:'decimal',width:110,hidden:true,align:'left'},
                       {field:'KDCode',title:'对外销售型号',type:'string',width:120,hidden:true,align:'left'},
                       {field:'CustomerItemCode',title:'客户料号',type:'string',width:120,hidden:true,align:'left'},
                       {field:'Material',title:'材质',type:'string',width:100,align:'left'},
                       {field:'Density',title:'密度',type:'decimal',width:100,hidden:true,align:'left'},
                       {field:'MinPack',title:'最小包装',type:'decimal',width:110,hidden:true,align:'left'},
                       {field:'NetWeight',title:'净重',type:'decimal',width:110,hidden:true,align:'left'},
                       {field:'GrossWeight',title:'毛重',type:'decimal',width:110,hidden:true,align:'left'},
                       {field:'ExtendField1',title:'扩展字段1',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField2',title:'扩展字段2',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField3',title:'扩展字段3',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField4',title:'扩展字段4',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField5',title:'扩展字段5',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField6',title:'扩展字段6',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField7',title:'扩展字段7',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField8',title:'扩展字段8',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField9',title:'扩展字段9',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ExtendField10',title:'扩展字段10',type:'string',width:120,hidden:true,align:'left'},
                       {field:'TenancyId',title:'租户ID',type:'string',width:120,hidden:true,align:'left'},
                       {field:'IsDel',title:'软删除',type:'int',bind:{ key:'enable',data:[]},width:80,hidden:true,require:true,align:'left'},
                       {field:'CreateID',title:'创建人ID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'创建时间',type:'datetime',width:150,align:'left'},
                       {field:'ModifyID',title:'修改人ID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:100,align:'left'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime',width:150,align:'left'}];
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