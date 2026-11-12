export const columnType = [
  { key: 1, value: "img" },
  { key: 2, value: "excel" },
  { key: 3, value: "file" },
  { key: 6, value: "year(年)" },
  { key: 4, value: "date(年月日)" },
  { key: 5, value: "month(年月)" },
];

export const dataType = [
  { key: "text", value: "输入框" },
  { key: "select", value: "下拉框", requireData: true },
  { key: "selectList", value: "下拉框多选", requireData: true },
  { key: "date", value: "date(年月日)" },
  { key: "datetime", value: "datetime(日期)" },
  { key: "year", value: "年" },
  { key: "month", value: "年月" },
  { key: "time", value: "time(时间)" },
  { key: "switch", value: "switch(单选)" },
  { key: "textarea", value: "textarea多行" },
  { key: "password", value: "密码输入框" },
  { key: "checkbox", value: "checkbox" },
  { key: "radio", value: "radio单选", requireData: true },
  { key: "cascader", value: "级联(单选)", requireData: true },
  { key: "treeSelect", value: "树形级联(多选)", requireData: true },
  { key: "selectTable", value: "下拉框Table搜索" },
  { key: "editor", value: "富文本编辑器" },
  { key: "mail", value: "邮箱" },
  { key: "number", value: "数字" },
  { key: "decimal", value: "小数" },
  { key: "phone", value: "手机号" },
  { key: "color", value: "颜色选择器" },
  { key: "img", value: "图片" },
  { key: "excel", value: "excel" },
  { key: "file", value: "文件" },
  { key: "rate", value: "评分" },
];

export const searchDataType = [
  { key: "=", value: "等于" },
  { key: "!=", value: "不等于" },
  { key: "like", value: "%模糊查询%" },
  { key: "likeStart", value: "模糊查询%" },
  { key: "likeEnd", value: "%模糊查询" },
  { key: "textarea", value: "textarea" },
  { key: "switch", value: "switch" },
  { key: "select", value: "select" },
  { key: "selectList", value: "select多选" },
  { key: "year", value: "年" },
  { key: "date", value: "date(年月日)" },
  { key: "datetime", value: "datetime" },
  { key: "month", value: "年月" },
  { key: "time", value: "time" },
  { key: "cascader", value: "级联" },
  { key: "treeSelect", value: "树形级联(多选)" },
  { key: "selectTable", value: "下拉框Table搜索" },
  { key: "checkbox", value: "checkbox" },
  { key: "radio", value: "radio" },
  { key: "range", value: "区间查询" },
  { key: "mail", value: "mail" },
  { key: "number", value: "number" },
  { key: "decimal", value: "decimal" },
  // { key: 'phone', value: 'phone' }
];
import { ref, reactive } from "vue";
export const tableOptions = (syncTable) => {
  return {
    formFields: ref({
      table_Id: "",
      parentId: null,
      namespace: "",
      columnCNName: "",
      tableName: "",
      tableTrueName: "",
      folderName: "",
      detailCnName: "",
      detailName: "",
      expressField: "",
      sortName: "",
      richtitle: "",
      uploadField: "",
      uploadMaxCount: "",
      enable: 0,
      vuePath: "",
      appPath: "",
      dbServer: "",
      editType: null, //编辑模式
      userPermissionDesc: "",
      foreignKey: null,
      dbSql: null,
      dyPage: 0,
      fixedSearch: 0,
      dyScript: null,
      actionLog: 0,
    }),
    formOptions: ref([
      [
        {
          title: "主 键 ID",
          field: "table_Id",
          dataSource: [],
          readonly: true,
          disabled: true,
          columnType: "int",
        },
        {
          title: "父级ID",
          field: "parentId",
          // min: 0,
          changeOnSelect: true,
          required: true,
          // type: "number",
          dataKey: "",
          data: [],
          type: "cascader",
        },
        {
          title: "项目类库",
          placeholder: "代码生成存放的位置",
          field: "namespace",
          type: "select",
          required: true,
          data: [],
          //  colSize: 6,
        },

        {
          title: "表中文名",
          field: "columnCNName",
          dataSource: [],
          required: true,
        },
        {
          title: "表别名",
          placeholder: "默认与实际表名相同",
          field: "tableName",
          required: true,
        },
        { title: "实际表名", field: "tableTrueName" },
      ],
      [
        {
          title: "文件夹名",
          //placeholder: "生成文件所在类库中的文件夹名(文件夹可以不存在)",
          field: "folderName",
          required: true,
        },

        {
          title: "明细表中文名",
          field: "detailCnName",
          placeholder: "多个名字,隔开",
        },
        {
          title: "明细表(多张表逗号隔开)",
          field: "detailName",
          placeholder: "如：tabl1,table2",
        },
        {
          title: "快捷编辑",
          field: "expressField",
          placeholder: "快捷编辑字段",
        },
        {
          title: "默认排序字段",
          field: "sortName",
          placeholder: "多个排序字段逗号隔开",
        },

        {
          title: "编辑模式",
          field: "editType",
          type: "select",
          data: [
            { key: 0, value: "弹出框编辑" },
            { key: 1, value: "新页面编辑" },
            { key: 2, value: "表格行内编辑" },
          ],
          extra: {
            render: (h) => {
              return (
                <el-popover
                  placement="top-start"
                  title="提示信息"
                  width={350}
                  trigger="hover"
                  content={
                    "1、弹出框编辑：以弹出框形式新建或修改 ；  2、新页面编辑：打开一个新的tab页面编辑或新建；   3、表格行内编辑：在当前查询页面的表格直接编辑"
                  }
                >
                  {{
                    reference: () => {
                      return (
                        <span
                          style="color:#9E9E9E"
                          class="el-icon-warning-outline"
                        ></span>
                      );
                    },
                  }}
                </el-popover>
              );
            },
          },

          //  colSize: 6
        },
      ],
      [
        {
          title: "与主表关联字段",
          field: "foreignKey",
          type: "text",
          readonly: true,
        },
        {
          title: "所在数据库",
          field: "dbServer",
          type: "select",
          required: true,
          dataKey: "dbServer",
          data: [], // dbOptions
          labelRender: (h, { }) => {
            return (
              <el-tooltip effect="dark" placement="top-start">
                {{
                  default: () => {
                    return (
                      <span
                      > 所在数据库<span class="el-icon-warning-outline"></span></span>
                    );
                  },
                  content: () => { return (<div style="font-size:12px">如果不分库，选择【系统库SysDbContext】</div>); },
                }}
              </el-tooltip>
            )
          }
        },
        {
          title: "Vue路径",
          field: "vuePath",
          type: "text",
          placeholder: "路径：E:/app/src/views",
          colSize: 4,
        },
        {
          title: "app路径",
          field: "appPath",
          type: "text",
          placeholder: "路径：E:/uniapp/pages",
          colSize: 4,
        },
      ],
      [
        {
          title: "关联sql",
          field: "dbSql",
          type: "textarea",
          placeholder: `关联其他表字段显示,如：select a.*,(select COUNT(1) from Demo_OrderList as b where a.Order_Id=b.Order_Id) as DetailQty from Demo_Order as a`,
          colSize: 12,
          // readonly: true,
          labelRender: (h, { }) => {
            return (
              <span style="font-size:14px;color: rgb(2, 71, 222);"
              > <span style="margin-right:2px" class="el-icon-warning-outline"></span>多表关联sql
                <el-button style="margin-left:15px;" type="success" link onClick={() => { syncTable() }}>
                  <i class="el-icon-refresh"></i>同步表结构</el-button>
                <span style="margin-left:15px;font-size:12px;color: rgb(227 2 2);">注意：修改sql后请点保存，再点同步表结构、生成model; (没有表关联的忽略此配置)</span>
              </span>
              // <el-tooltip effect="dark" placement="top-start">
              //   {{
              //     default: () => {
              //       return (
              //         <span style="font-size:14px;color: rgb(2, 71, 222);"
              //         > <span style="margin-right:2px" class="el-icon-warning-outline"></span>多表关联sql
              //           <span style="margin-left:15px;font-size:12px;color: #535454;">注意：修改sql后请点保存，再点同步表结构</span>
              //         </span>
              //       );
              //     },
              //     content: () => {
              //       return (<div style="font-size:12px">  <ol style="margin: 5px 10px; padding: 0 5px;" class="multi-table-tip-list">
              //         <li>有实际表：关联显示其他表的字段,[实际表名]正常填写数据库表，上面填写关联sql并返回完整字段</li>
              //         <li>无实际表(仅做查询、导出)：[实际表名]任意填写,并且表名是唯一不能重复，[实际表名]不要使用中文或特殊字符</li>
              //         <li>数据库视图：在数据库写好关联sql并创建为视图，上面[实际表名]填写视图名</li>
              //       </ol></div>);
              //     },
              //   }}
              // </el-tooltip>
            )
          }
        },
      ],
    ]),
    addFields: ref({
      //table_Id: "",
      parentId: [],
      namespace: "",
      columnCNName: "",
      tableName: "",
      tableTrueName: "",
      folderName: "",
      dbServer: "",
      dbSql: ""
      // editType: null, //编辑模式
      // userPermissionDesc: "",
    }),
    addOptions: ref([
      [
        {
          title: "父级ID",
          min: 0,
          field: "parentId",
          required: true,
          type: "number",
          dataKey: "",
          data: [],
          type: "cascader",
          changeOnSelect: true,
          labelRender: (h, { }) => {
            return (
              <div>
                <el-tooltip placement="top-start" title="" trigger="hover">
                  {{
                    default: () => {
                      return (
                        <span>
                          父级目录ID
                          <i
                            style="font-size:12px;margin-left:3px;color:#4f58d2"
                            class="el-icon-warning-outline"
                          ></i>
                        </span>
                      );
                    },
                    content: () => {
                      return (
                        <div>
                          放在左边树形结构的文件夹ID下,如果填入【0】就是一级目录
                        </div>
                      );
                    },
                  }}
                </el-tooltip>
              </div>
            );
          },
        },
      ],
      [
        {
          title: "项目类库",
          field: "namespace",
          type: "select",
          required: true,
          data: [],
          labelRender: (h, { }) => {
            return (
              <div>
                <el-tooltip placement="top-start" title="" trigger="hover">
                  {{
                    default: () => {
                      return (
                        <span>
                          项目类库
                          <i
                            style="font-size:12px;margin-left:3px;color:#4f58d2"
                            class="el-icon-warning-outline"
                          ></i>
                        </span>
                      );
                    },
                    content: () => {
                      return (
                        <div>
                          代码生成的实际文件存放位置(创建自己的项目类库，后台vs； 新建项目=》类库=》版本选择8.0；类库=》依赖项引用VolPro.Core、VolPro.Entity,WebApi类库引用添加的类库)
                        </div>
                      );
                    },
                  }}
                </el-tooltip>
              </div>
            );
          },
        },
      ],
      [
        {
          title: "表中文名",
          field: "columnCNName",
          required: true,
          placeholder: "表对应的中文名字",
          labelRender: (h, { }) => {
            return (
              <div>
                <el-tooltip placement="top-start" title="" trigger="hover">
                  {{
                    default: () => {
                      return (
                        <span>
                          表中文名
                          <i
                            style="font-size:12px;margin-left:3px;color:#4f58d2"
                            class="el-icon-warning-outline"
                          ></i>
                        </span>
                      );
                    },
                    content: () => {
                      return <div>表对应的中文名字,自己填写</div>;
                    },
                  }}
                </el-tooltip>
              </div>
            );
          },
        },
      ],
      [
        {
          title: "实际表名",
          field: "tableName",
          required: true,
          placeholder:
            "数据表/视图名(多表批量生成:多表逗号隔开,后台启动builder_run.bat)",
          labelRender: (h, { }) => {
            return (
              <div>
                <el-tooltip placement="top-start" title="" trigger="hover">
                  {{
                    default: () => {
                      return (
                        <span>
                          实际表名
                          <i
                            style="font-size:12px;margin-left:3px;color:#4f58d2"
                            class="el-icon-warning-outline"
                          ></i>
                        </span>
                      );
                    },
                    content: () => {
                      return (
                        <div>
                          数据库实际表名或者视图名(多表关联请创建视图再生成代码);如果只是创建目录，表名写一个不存在的名字并且没有填过这个名字
                        </div>
                      );
                    },
                  }}
                </el-tooltip>
              </div>
            );
          },
        },
      ],
      [
        {
          title: "文件夹名",
          field: "folderName",
          required: true,
          labelRender: (h, { }) => {
            return (
              <div>
                <el-tooltip placement="top-start" title="" trigger="hover">
                  {{
                    default: () => {
                      return (
                        <span>
                          文件夹名
                          <i
                            style="font-size:12px;margin-left:3px;color:#4f58d2"
                            class="el-icon-warning-outline"
                          ></i>
                        </span>
                      );
                    },
                    content: () => {
                      return (
                        <div>
                          生成文件所在类库中的文件夹名(文件夹可以不存在);注意只需要填写文件夹名，不是路径
                        </div>
                      );
                    },
                  }}
                </el-tooltip>
              </div>
            );
          },
        },
      ],
      [
        {
          title: "数据库",
          field: "dbServer",
          type: "select",
          dataKey: "dbServer",
          required: true,
          data: [],
          labelRender: (h, { }) => {
            return (
              <div>
                <el-tooltip placement="top-start" title="" trigger="hover">
                  {{
                    default: () => {
                      return (
                        <span>
                          所在数据库
                          <i
                            style="font-size:12px;margin-left:3px;color:#4f58d2"
                            class="el-icon-warning-outline"
                          ></i>
                        </span>
                      );
                    },
                    content: () => {
                      return <div>如果不分库，选择【系统库SysDbContext】</div>;
                    },
                  }}
                </el-tooltip>
              </div>
            );
          },
        },
      ],
      [
        {
          title: "关联sql(表关联)",
          field: "dbSql",
          type: "textarea",
          placeholder: `当前表关联其他表字段显示,如：select a.*,(select COUNT(1) from Demo_OrderList as b where a.Order_Id=b.Order_Id) as DetailQty from Demo_Order as a`,
        },
      ],
    ]),
    columns: ref([
      // {
      //   field: "columnId",
      //   title: "ColumnId",
      //   width: 120,
      //   align: "left",
      //   edit: { type: "text"},
      //   hidden: true,
      // },
      // {
      //   field: "table_Id",
      //   title: "Table_Id",
      //   width: 10,
      //   align: "left",
      //   editor: "text",
      //   hidden: true,
      // },
      {
        field: "columnCnName",
        title: "名称",
        fixed: true,
        width: 90,
        placeholder: "请输入",
        align: "left",
        edit: { type: "text", keep: false },
      },
      {
        field: "columnName",
        title: "字段",
        fixed: true,
        width: 90,
        align: "left",
        edit: { type: "text" },
      },
      {
        field: "referenceField",
        title: "关联字段",
        fixed: true,
        width: 70,
        align: "center",
        readonly:true,
        edit: { type: "switch", keep: false },
      },
      {
        field: "isKey",
        title: "主键",
        width: 50,
        align: "center",
        edit: { type: "switch" },
      },
      // {
      //   field: "enable",
      //   title: "app列",
      //   width: 110,
      //   align: "left",
      //   edit: { type: "select" },
      //   bind: {
      //     data: [
      //       { key: 1, value: "显示/查询/编辑" },
      //       { key: 2, value: "显示/编辑" },
      //       { key: 3, value: "显示/查询" },
      //       { key: 4, value: "显示" },
      //       { key: 5, value: "查询/编辑" },
      //       { key: 6, value: "查询" },
      //       { key: 7, value: "编辑" },
      //     ],
      //   },
      // },
      // {
      //   field: "searchRowNo",
      //   title: "查询行",
      //   width: 90,
      //   align: "left",
      //   edit: { type: "text" },
      // },
      // {
      //   field: "searchColNo",
      //   title: "查询列",
      //   width: 90,
      //   align: "left",
      //   edit: { type: "text" },
      // },
      // {
      //   field: "searchType",
      //   title: "查询类型",
      //   width: 150,
      //   align: "left",
      //   edit: { type: "select" },
      //   bind: { data: searchDataType },
      // },
      {
        field: "editRowNo",
        title: "编辑行",
        width: 90,
        hidden: true,
        align: "numberbox",
        edit: { type: "text" },
      },
      // {
      //   field: "editColNo",
      //   title: "编辑列",
      //   width: 90,
      //   align: "numberbox",
      //   edit: { type: "text" },
      // },
      {
        field: "editType",
        title: "编辑类型",
        width: 150,
        hidden: true,
        align: "left",
        edit: { type: "select" },
        bind: { data: dataType },
      },
      {
        field: "dropNo",
        title: "数据源",
        width: 80,
        placeholder: " ",
        align: "center",
        bind: { data: [] },
        edit: { type: "select", data: [], keep: false },
      },
      {
        field: "orderNo",
        title: "显示顺序",
        width: 70,
        align: "center",
        edit: { type: "text", keep: false },
      },

      // {
      //   field: "isReadDataset",
      //   title: "是否只读",
      //   width: 120,
      //   align: "left",
      //   edit: { type: "switch", keep: false },
      // },
      {
        field: "isDisplay",
        title: "是否显示",
        width: 80,
        align: "center",
        edit: { type: "switch", keep: false, keep: false },
      },
      {
        field: "columnWidth",
        title: "表格宽度",
        width: 80,
        align: "center",
        edit: { type: "text", keep: false },
      },
      // {
      //   field: "maxlength",
      //   title: "字段最大长度",
      //   width: 80,
      //   align: "left",
      //   edit: { type: "text" },
      // },
      {
        field: "isNull",
        title: "可为空",
        width: 70,
        align: "center",
        edit: { type: "switch", keep: false, keep: false },
      },
      {
        field: "isImage",
        title: "显示类型",
        hidden: false,
        width: 80,
        align: "center",
        placeholder: " ",
        edit: { type: "select", keep: false },
        bind: { data: columnType },
      },
      {
        field: "sortable",
        title: "表格排序",
        width: 80,
        align: "center",
        edit: { type: "switch", keep: false },
      },
      {
        field: "columnType",
        title: "数据类型",
        width: 70,
        align: "center",
        // edit: { type: "text", keep: false  },
      },
      // {
      //   field: "colSize",
      //   title: "编辑字段宽度colSize",
      //   width: 180,
      //   align: "left",
      //   edit: { type: "select" },
      //   bind: {
      //     data: [
      //       { key: 0, value: "自动宽度" },
      //       { key: 2, value: "20%" },
      //       { key: 3, value: "30%" },
      //       { key: 4, value: "40%" },
      //       { key: 6, value: "50%" },
      //       { key: 8, value: "60%" },
      //       { key: 10, value: "80%" },
      //       { key: 12, value: "100%" },
      //     ],
      //   },
      // },
      //{ field: "createDate", title: "创建时间", width: 120, align: "left" },
    ]),
  };
};
