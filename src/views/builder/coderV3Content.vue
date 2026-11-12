<template>
  <div class="coder-content">
    <div class="coder-content-header">
      <div class="fx-1">
        <vol-title icon="" title="代码生成配置">
          <!-- <span class="desc">支持拖拽配置、实时预览、动态生成;</span> -->
        </vol-title>
      </div>

      <div class="corder-content-btns">
        <el-popover title="操作说明" :width="420">
          <template #reference>
            <span style="color: #0247de; font-size: 13px" class="el-icon-info">操作说明</span>
          </template>
          <div style="line-height: 2">
            <div>1.点击新建，填写数据表信息</div>
            <div>2.配置表结构信息</div>
            <div>3.配置查询表单</div>
            <div>4.配置编辑表单</div>
            <div>支持批量生成：可一键生成100张表全部后台代码</div>
          </div>
        </el-popover>

        <el-button :type="btn.type" :color="btn.color" v-for="(btn, index) in buttons" :key="index"
          @click="btnClick(btn)">
          <el-icon>
            <component :is="btn.icon" />
          </el-icon>
          {{ $ts(btn.name) }}
        </el-button>
      </div>
    </div>
    <div class="coder-tabs">
      <el-tabs v-model="activeName" @tab-click="tabsClick">
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <div class="desc">
        <div class="ck">
          <el-checkbox :true-value="1" :false-value="0" v-model="formFields.dyPage">动态渲染页面
            <el-popover title="" :width="380">
              <template #reference>
                <span style="color: #0247de; font-size: 13px" class="el-icon-info"></span>
              </template>
              <div style="line-height: 2">
                1. 动态渲染页面：前端不需要发布、编译。
                <div>2. 支持代码生成器写js脚本处理基础业务。</div>
                <div>3. 点击保存后页面实时生效。</div>
              </div>
            </el-popover>
          </el-checkbox>
        </div>
        <div class="ck">
          <el-checkbox :true-value="1" :false-value="0" v-model="formFields.actionLog">审计日志
            <el-popover title="" :width="610">
              <template #reference>
                <span style="color: #0247de; font-size: 13px" class="el-icon-info"></span>
              </template>
              <div style="line-height: 2">
                1.
                勾选后生成的页面新建、编辑、删除操作会完整记录原始与修改后数据(也可手动记录)。
                <div>
                  2.
                  正式环境需要把sys_tableinfo、sys_tablecolumn两张表从测试数据库同步到正式数据库(否则功能无效)
                </div>
              </div>
            </el-popover>
          </el-checkbox>
        </div>
        <div class="ck">
          <el-checkbox :true-value="1" :false-value="0" v-model="formFields.fixedSearch">显示所有查询条件</el-checkbox>
        </div>
        <span class="el-icon-info">支持拖拽配置、实时预览、动态加载</span>
      </div>
    </div>

    <div class="coder-content-el">
      <div v-show="activeName == 'info'">
        <coderV3TableInfo :formOptions="formOptions" :formFields="formFields" :tableData="tableData" :columns="columns"
          :syncClick="nodeClick" ref="tableInfoRef">
        </coderV3TableInfo>
      </div>
      <div v-show="activeName == 'search'">
        <coderV3Form current-action="search" :height="height" ref="formRef">
        </coderV3Form>
      </div>
      <div v-show="activeName == 'edit'">
        <coderV3Form current-action="edit" :height="height" ref="editRef"> </coderV3Form>
      </div>
      <div v-show="activeName == 'app'">
        <codeV3App :height="height" ref="appRef"> </codeV3App>
      </div>

      <div v-show="activeName == 'scriptText'">
        <codeV3Script :height="height" ref="scriptRef"> </codeV3Script>
      </div>
    </div>
  </div>
  <vol-box ref="add" :width="750" title="代码生成" :padding="0" v-model="addModel">
    <div style="padding: 0">
      <el-alert title="如果只是创建目录，父级目录ID选择无,其他随便填写;" class="alert-primary" :closable="false"></el-alert>
    </div>
    <div class="add-model">
      <vol-form ref="addFormRef" :label-width="105" label-position="left" :formRules="addOptions"
        :formFields="addFields">
      </vol-form>
      <div class="multi-table-tip">
        <div class="multi-table-tip-header">
          <span class=" el-icon-warning-outline"></span>
          <span class="multi-table-tip-title">关联sql(表关联)说明,没有表关联的请忽略下面说明</span>
        </div>
        <ol class="multi-table-tip-list">
          <li>有实际表：关联显示其他表的字段,[实际表名]正常填写数据库表，上面填写关联sql并返回完整字段</li>
          <li>无实际表(仅做查询、导出)：[实际表名]任意填写,并且表名是唯一不能重复，[实际表名]不要使用中文或特殊字符</li>
          <li>数据库视图：在数据库写好关联sql并创建为视图，上面[实际表名]填写视图名</li>
        </ol>
      </div>
    </div>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="default" size="small" @click="addModel = false"><i class="el-icon-close"></i> 关闭</el-button>
        <el-button type="primary" color="#4f58d2" size="small" @click="addClick"><i class="el-icon-check"></i>
          确定</el-button>
      </div>
    </template>
  </vol-box>
</template>
<script lang="jsx" setup>
import { ref, getCurrentInstance, computed, defineAsyncComponent, nextTick } from "vue";
import coderV3TableInfo from "./coderV3TableInfo.vue";
const coderV3Form = defineAsyncComponent(() => import("./coderV3Form.vue"));
const codeV3Script = defineAsyncComponent(() => import("./codeV3Script.vue"));
const codeV3App = defineAsyncComponent(() => import("./coderV3App.vue"));
const scriptRef = ref();

const { proxy } = getCurrentInstance();

const props = defineProps({
  parentData: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
const emit = defineEmits(["loadTableAfter", "loadTableInfo"]);
const activeName = ref("info"); // ref("search");
const tabs = ref([
  { name: "info", label: "基础信息" },
  { name: "search", label: "查询表单" },
  { name: "edit", label: "编辑表单" },
  { name: "scriptText", label: "动态脚本" },
  { name: "app", label: "移动端(app/小程序)" },
]);

const syncTable = () => {
  tableInfoRef.value.syncTable();
}
const addModel = ref(false);

import { tableOptions } from "./coderV3Options.jsx";
const { formFields, formOptions, columns, addOptions, addFields } = tableOptions(syncTable);

const dicFields = ref([]);

const initDicFields = () => {
  dicFields.value = tableData.value.map((x) => {
    return {
      key: x.columnName,
      value: x.columnCnName ? "(" + x.columnCnName + ")" + x.columnName : x.columnName, // x.columnCnName,
    };
  });
  dicFields.value.unshift({ key: "", value: "请选择" });
};

formOptions.value.forEach((x) => {
  x.forEach((c) => {
    if (c.field == "expressField") {
      // formFields.expressField
      c.type = "select";
      c.data = dicFields;
    } else if (c.field == "sortName") {
      c.type = "select";
      c.data = dicFields;
    }
  });
});

const initDic = async () => {
  proxy.http.post("api/Sys_Dictionary/GetBuilderDictionary", {}, true).then((dic) => {
    let column = columns.value.find((x) => {
      return x.field == "dropNo";
    });
    if (!column) return;

    column.bind.data = dic.map((x) => {
      return { key: x, value: x };
    });
    column.bind.data.unshift({ key: "", value: "请选择" });
    setTimeout(() => {
      proxy.base.setItem("coderDicData", column.bind.data);
    }, 1000);
    // console.log('dic',proxy.base.getItem('coderDicData'))
  });
};
initDic();
proxy.base.setItem("coder:initDic", initDic);

formFields.value.vuePath = localStorage.getItem("vuePath");
formFields.value.appPath = localStorage.getItem("appPath");

const treeOrginData = ref([]);
const addFormRef = ref();
const tableInfoRef = ref();
const formRef = ref();
const editRef = ref();


const getCurrentFormOptions = () => {
  return activeName.value == "search" ? searchFormOptions.value : editFormOptions.value;
};

const initDraggableFields = (init) => {
  nextTick(() => {
    if (activeName.value == "search" || init) {
      formRef.value.initDraggableFields(
        fieldOptions.value,
        searchFormOptions.value,
        activeName.value
      );
    }
    if (activeName.value == "edit" || init) {
      editRef.value.initDraggableFields(
        fieldOptions.value,
        editFormOptions.value,
        activeName.value
      );
    }
  })
};

const tabsClick = (item) => {
  activeName.value = tabs.value[item.index].name;
  // initDraggableFields();
};

const fieldOptions = ref([]);
const searchFormOptions = ref([]);
const editFormOptions = ref([]);

const sortForm = (a, b) => {
  // 先按rowNo排序
  if (a.rowNo !== b.rowNo) {
    return a.rowNo - b.rowNo;
  }

  // rowNo相同则按colNo排序
  // 处理null值，将null视为较大值排在后面
  const colA = a.colNo !== null ? a.colNo : Infinity;
  const colB = b.colNo !== null ? b.colNo : Infinity;

  return colA - colB;
};

const initFieldOptions = () => {
  tableData.value.forEach((x) => {
    if (!x.columnformat) {
      x.columnformat = {};
    } else if (typeof x.columnformat == "string") {
      try {
        x.columnformat = JSON.parse(x.columnformat);
      } catch (error) {
        x.columnformat = {};
        console.log("columnformat", error);
      }
    }
  });

  fieldOptions.value = tableData.value.map((x) => {
    return {
      title: x.columnCnName || x.columnName, //名字
      field: x.columnName, //字段
      formType: x.columnType == "DateTime" || x.columnType == "datetime" ? "date" : null, //编辑类型
      // searchRowNo: x.searchRowNo, //查询行
      // searchColNo: x.searchColNo || x.dropNo, //查询列
      // searchType: x.columnType == "DateTime" && !x.searchType ? 'date' : (x.searchType || ''), //查询类型
      // searchDicNo: x.searchDicNo || '',
      // searchColSize:x.searchColSize,
      // editType: x.columnType == "DateTime" && !x.editType ? 'date' : (x.editType || ''), //编辑类型
      // editRowNo: x.editRowNo, //编辑行
      // editColNo: x.editColNo, //编辑列
      // dropNo: x.dropNo || x.searchColNo, //数据源
      isNull: x.isNull,
      isReadDataset: x.isReadDataset, //是否只读
      columnformat: x.columnformat,
      // colSize: x.colSize,
      // columnType: x.columnType
    };
  });

  const initWidth = (data) => {
    const rowNoCount = {};
    data.forEach((item) => {
      const rowNo = item.rowNo;
      if (rowNoCount[rowNo]) {
        rowNoCount[rowNo]++;
      } else {
        rowNoCount[rowNo] = 1;
      }
    });

    // console.log(Object.values(rowNoCount));
    const count = Math.max(...Object.values(rowNoCount)) || 1;

    data.forEach((item) => {
      item.width = (100 / count).toFixed(3) * 1.0;
    });
  };

  searchFormOptions.value = tableData.value
    .filter((x) => {
      return x.searchRowNo > 0;
    })
    .map((x) => {
      return {
        title: x.columnCnName || x.columnName, //名字
        field: x.columnName, //字段
        rowNo: x.searchRowNo, //查询行
        colNo: x.searchColNo, //查询列
        formType:
          x.columnType == "DateTime" && !x.searchType ? "date" : x.searchType || "", //查询类型
        dropNo: x.searchDropNo || x.dropNo, //数据源
        // colSize: x.searchColSize//查询宽度
        width: x.searchColSize,
        columnformat: x.columnformat,
      };
    })
    .sort(sortForm);

  // sortForm(searchFormOptions.value);
  //这里还有加上默认编辑行排序
  editFormOptions.value = tableData.value
    .filter((x) => {
      return x.editRowNo > 0;
    })
    .map((x) => {
      return {
        title: x.columnCnName || x.columnName, //名字
        field: x.columnName, //字段
        rowNo: x.editRowNo, //查询行
        colNo: x.editColNo, //查询列
        formType: x.columnType == "DateTime" && !x.editType ? "date" : x.editType || "", //编辑类型
        dropNo: x.dropNo || x.searchDropNo, //数据源
        //  colSize: x.colSize,//编辑宽度
        width: x.colSize == 12 ? 100 : x.colSize,
        isReadDataset: x.isReadDataset, //是否只读
        isNull: x.isNull,
        columnformat: x.columnformat,
      };
    })
    .sort(sortForm);

  //重新设置宽度，兼容旧的代码生成器
  let haswd = editFormOptions.value.some((x) => {
    return x.width;
  });
  //没有设置过宽度的
  if (!haswd) {
    initWidth(editFormOptions.value);
  }
  haswd = searchFormOptions.value.some((x) => {
    return x.width;
  });
  //没有设置过宽度的
  //console.log(searchFormOptions.value);
  if (!haswd) {
    initWidth(searchFormOptions.value);
  }

  // console.log(editFormOptions.value)
  //  sortForm(editFormOptions.value);
  //  formRef.value.initDraggableFields(fieldOptions.value, getCurrentFormOptions());
  initDraggableFields(true);
};

const height = ref(0);
height.value = document.body.clientHeight - 117;
const tableData = ref([]);
const tableHeight = ref(0);
tableHeight.value = document.body.clientHeight - 443;
if (tableHeight.value <= 260) {
  tableHeight.value = 260;
}

const nodeClick = async (id) => {
  const url = "/api/builder/LoadTableInfo?table_Id=" + id + "&isTreeLoad=true";
  // localStorage.setItem("vuePath", proxy.layOutOptins.fields.vuePath || "");
  await proxy.http.post(url, {}, true).then((x) => {
    x.data = x.data || {};
    if (!x.data.tableTrueName) {
      x.data.tableTrueName = x.data.tableName;
    }
    const _fields = ["sortable", "isNull", "isReadDataset", "isColumnData", "isDisplay"];
    x.data.tableColumns.forEach((item) => {
      for (let index = 0; index < _fields.length; index++) {
        item[_fields[index]] = item[_fields[index]] || 0;
      }
    });

    tableData.value = x.data.tableColumns;

    initDicFields();
    initFieldOptions();
    x.data.vuePath = localStorage.getItem("vuePath");
    x.data.appPath = localStorage.getItem("appPath");
    proxy.base.resetForm(formFields, formOptions, x.data);
    formFields.value.actionLog = x.data.actionLog || 0;
    formFields.value.dyPage = x.data.dyPage || 0;
    formFields.value.fixedSearch = x.data.fixedSearch || 0;
  });
};

// nodeClick(25);

const btnClick = (btn) => {
  btn?.click();
};

const addClick = async () => {
  const b = await addFormRef.value.validate();
  if (!b) {
    return;
  }
  if (!addFields.value.dbServer) {
    return proxy.$message.error("请选择数据库");
  }
  if (addFields.value.tableTrueName) {
    addFields.value.tableTrueName = addFields.value.tableName;
  }

  let parentId = addFields.value.parentId;
  if (Array.isArray(parentId)) {
    parentId = [...parentId].pop();
  }

  let queryParam =
    "parentId=" +
    parentId +
    "&tableName=" +
    addFields.value.tableName +
    "&columnCNName=" +
    addFields.value.columnCNName +
    "&nameSpace=" +
    addFields.value.namespace +
    "&foldername=" +
    addFields.value.folderName +
    "&isTreeLoad=false&dbServer=" +
    addFields.value.dbServer;
  const url = "api/builder/loadTableInfo?" + queryParam;
  proxy.http.post(url, { dbSql: addFields.dbSql }, true).then((x) => {
    if (!x.status) {
      proxy.$message.error(x.message);
      return;
    }
    x.data = x.data || {};
    proxy.$message.success('加载成功,刷新页面查看最新数据')
    addModel.value = false;
    emit("loadTableAfter", {
      id: x.data.table_Id,
      pId: x.data.parentId,
      parentId: x.data.parentId,
      name: x.data.columnCNName,
      orderNo: x.data.orderNo,
    });
    // }
    if (!x.data.tableTrueName) {
      x.data.tableTrueName = x.data.tableName;
    }
    x.data.vuePath = localStorage.getItem("vuePath");
    x.data.appPath = localStorage.getItem("appPath");
    proxy.base.resetForm(formFields, formOptions, x.data);
    tableData.value = x.data.tableColumns;
    initFieldOptions();
    initDicFields();
  });
};

const loadTableInfo = async () => {
  if (!proxy.$route.query.table) {
    return;
  }
  let queryParam =
    "parentId=0" +
    "&tableName=" +
    proxy.$route.query.table +
    "&isTreeLoad=true&dbServer=" +
    proxy.$route.query.dbService;
  const url = "api/builder/loadTableInfo?" + queryParam;
  proxy.http.post(url, {}, true).then((x) => {
    if (!x.status) {
      proxy.$message.error(x.message);
      return;
    }
    if (!x.data) {
      addModel.value = true;
      addFields.value.tableName = proxy.$route.query.table;
      addFields.value.dbServer = proxy.$route.query.dbService;
      return;
    }
    nextTick(async () => {
      setTimeout(async () => {
        await nodeClick(x.data.table_Id)
        proxy.$message.success('数据加载成功!')
        emit("loadTableAfter", {
          id: x.data.table_Id,
          pId: x.data.parentId,
          parentId: x.data.parentId,
          name: x.data.columnCNName,
          orderNo: x.data.orderNo,
        });
      }, 100);
    })
  })
}


const validateTableInfo = async (callback) => {
  //console.log("validateTableInfo");

  const b = await tableInfoRef.value.validate(); //await formRef.value.validate(); //
  if (!b) {
    return b;
  }
  if (tableData.value.length) {
    // proxy.$message.error({ message: "请先加载数据", offset: 100, duration: 2000 });
    // return false;
    let keyInfo = tableData.value.find((x) => {
      return x.isKey;
    });
    if (!keyInfo) {
      proxy.$message.error({ message: "请勾选设置主键", offset: 100, duration: 2000 });
      return false;
    }
    if (keyInfo.isNull == 1) {
      proxy.$message.error({
        message: "主键【可为空】必须设置为否",
        offset: 100,
        duration: 2000,
      });
      return false;
    }
    if (
      keyInfo.columnType != "int" &&
      keyInfo.columnType != "bigint" &&
      !formFields.value.sortName
    ) {
      proxy.$message.error({
        message: "主键非自增类型,请选择上面表单【默认排序字段】",
        offset: 100,
        duration: 2000,
      });
      return false;
    }
  }

  return true;
};

import { dataType } from "./coderV3Options.jsx";
const save = async () => {
  const vuePath = formFields.value.vuePath || "";
  localStorage.setItem("vuePath", vuePath);
  localStorage.setItem("appPath", formFields.value.appPath || "");
  if (!vuePath.endsWith("\\views") && !vuePath.endsWith("/views")) {
    return proxy.$message.error({
      message: "Vue路径只能填写到前端项目views目录,如E:\\xxx\\web.vite\\scr\\views",
      offset: 100,
      duration: 2000,
    });
  }

  if (
    columns.value.filter((x) => {
      return x.isKey == 1;
    }).length > 1
  ) {
    return proxy.$message.error({
      message: "表结构只能勾选一个主键字段",
      offset: 100,
      duration: 2000,
    });
  }
  if (!(await validateTableInfo())) {
    return;
  }

  const param = getParam();
  // x.searchType = searchItem.formType;
  // x.searchDropNo = searchItem.dropNo;
  const dataMsg = dataType
    .filter((c) => {
      return c.requireData;
    })
    .map((x) => {
      return x.value;
    })
    .join(",");
  let item = param.TableColumns.find((x) => {
    return dataType.some((c) => {
      return c.requireData && c.key == x.searchType && !x.searchDropNo;
    });
  });
  if (item) {
    proxy.$message.error({
      message: `[查询表单]:字段[${item.columnCnName || item.columnName
        }]查询类型为[${dataMsg}]时必须选择数据源`,
      offset: 100,
      duration: 4000,
    });
    return;
  }

  item = param.TableColumns.find((x) => {
    return dataType.some((c) => {
      return c.requireData && c.key == x.editType && !x.dropNo;
    });
  });
  if (item) {
    proxy.$message.error({
      message: `[编辑表单]:字段[${item.columnCnName || item.columnName
        }]编辑类型为[${dataMsg}]时必须选择数据源`,
      offset: 100,
      duration: 4000,
    });
    return;
  }

  proxy.http.post("/api/builder/Save", param, true).then((x) => {
    if (!x.status) {
      proxy.$message.error({ message: x.message, offset: 100, duration: 2000 });
      return;
    }
    proxy.$message.primary({ message: x.message, offset: 100, duration: 2000 });
  });
};

const convertFormColRow = (formOptions, isEdit) => {
  // const rowOptions = [];
  let rowWidth = 0;
  let rowIndex = 1;
  let colIndex = -4;
  formOptions.forEach((item, index) => {
    if (!item.width) {
      item.width = 25;
    }
    rowWidth += item.width;
    if (isEdit && item.field == "Gender") {
      console.log("xx");
    }
    let wd = item.width;
    //前一个换行显示
    const preItem = formOptions[index - 1];
    //换行显示
    if (
      isEdit &&
      preItem &&
      typeof preItem.columnformat == "object" &&
      preItem.columnformat.editBreak
    ) {
      rowWidth = 200;
      wd = item.width;
    }
    if (rowWidth <= 100) {
      //设置查询、编辑列s
      colIndex = colIndex + 5;
    } else {
      //设置查询、编辑行
      rowIndex = rowIndex + 5;
      //设置查询、编辑列
      colIndex = 1;
      rowWidth = wd;
    }
    item.colNo = colIndex;
    item.rowNo = rowIndex;
  });
};

const getParam = () => {
  const param = JSON.parse(JSON.stringify(formFields.value));
  if (param.parentId?.length) {
    param.parentId = param.parentId.pop();
  }
  if (!param.parentId) {
    param.parentId = 0;
  }

  searchFormOptions.value = formRef.value.getFormOptions();
  editFormOptions.value = editRef.value.getFormOptions();
  convertFormColRow(searchFormOptions.value);
  convertFormColRow(editFormOptions.value, true);
  //   convertFormColRow(formRef.value.getFormOptions())
  // convertFormColRow(editRef.value.getFormOptions())
  param.TableColumns = tableData.value.map((x) => {
    return { ...x };
  });
  // title: x.columnCnName || x.columnName, //名字
  //     field: x.columnName, //字段
  //     rowNo: x.searchRowNo, //查询行
  //     colNo: x.searchColNo, //查询列
  //     formType: x.columnType == "DateTime" && !x.searchType ? 'date' : (x.searchType || ''), //查询类型
  //     dropNo: x.searchColNo || x.dropNo,//数据源
  //     // colSize: x.searchColSize//查询宽度
  //     width: x.searchColSize

  param.TableColumns.forEach((x) => {
    let searchItem = searchFormOptions.value.find((c) => {
      return c.field == x.columnName;
    }) || { rowNo: null, colNo: null, formType: null, dropNo: null, width: null };
    x.searchRowNo = searchItem.rowNo;
    x.searchColNo = searchItem.colNo;
    x.searchType = searchItem.formType;
    x.searchDropNo = searchItem.dropNo;
    x.searchColSize = searchItem.width;

    // title: x.columnCnName || x.columnName, //名字
    // field: x.columnName, //字段
    // rowNo: x.editRowNo, //查询行
    // colNo: x.editColNo, //查询列
    // formType: x.columnType == "DateTime" && !x.editType ? 'date' : (x.editType || ''), //编辑类型
    // dropNo: x.dropNo || x.searchColNo,//数据源
    // //  colSize: x.colSize,//编辑宽度
    // width: x.colSize,
    // isReadDataset: x.isReadDataset, //是否只读
    // isNull: x.isNull,
    let editItem = editFormOptions.value.find((c) => {
      return c.field == x.columnName;
    }) || { rowNo: null, colNo: null, formType: null, dropNo: null, width: null };
    x.editRowNo = editItem.rowNo || 0;
    x.editColNo = editItem.colNo;
    x.editType = editItem.formType;
    x.colSize = editItem.width;
    if (!x.dropNo && (editItem.dropNo || searchItem.dropNo)) {
      x.dropNo = editItem.dropNo || searchItem.dropNo;
    }
    x.isReadDataset = editItem.isReadDataset || 0;
    if (x.columnformat && typeof x.columnformat != "string") {
      x.columnformat = JSON.stringify(x.columnformat);
    }
  });

  return param;
};

const ceateVuePage = async (isApp) => {
  if (!(await validateTableInfo())) {
    return;
  }

  let vuePath;
  if (!isApp) {
    vuePath = localStorage.getItem("vuePath");
    if (!vuePath) {
      return proxy.$message.error("请先设置Vue项目对应Views的绝对路径,然后再保存!");
    }
  } else {
    vuePath = localStorage.getItem("appPath");
    if (!vuePath) {
      return proxy.$message.error("请先设置app路径,然后再保存!");
    }
  }

  let url = `/api/builder/createVuePage?vuePath=${vuePath}&vite=1&v3=1&app=${isApp || 0}`;
  const param = getParam();
  proxy.http.post(url, param, true).then((x) => {
    if (x == "页面创建成功!") {
      proxy.$message.success(x);
      return;
    }
    proxy.$message.error(x);
  });
};

const buttons = ref([
  {
    name: "保存",
    icon: "Check",
    color: "#1e6fff",
    click: save,
  },
  {
    name: "新建",
    icon: "Plus",
    //  plain:true,
    type: "danger",

    click: () => {
      proxy.base.resetForm(addFields, addOptions);
      addModel.value = true;
    },
    // type: "success",
  },
  {
    name: "预览",
    icon: "Monitor",
    type: "danger",
    color: "#626aef",
    click: () => {
      if (!formFields.value.table_Id) {
        proxy.$message.error("请先加载表格信息");
        return;
      }
      window.open(location.origin + "/#/coderV3Priview?id=" + formFields.value.table_Id);
    },
  },
  {
    name: "生成vue页面",
    icon: "Document",
    click: () => {
      ceateVuePage(0);
    },
  },
  {
    name: "生成app页面",
    icon: "Cellphone",
    click: () => {
      ceateVuePage(1);
    },
  },
  {
    name: "生成model",
    icon: "Iphone",
    click: async () => {
      if (await validateTableInfo()) {
        const param = getParam();
        proxy.http.post("/api/builder/CreateModel", param, true).then((x) => {
          proxy.$message.info(x);
        });
      }
    },
  },
  {
    name: "生成业务类",
    icon: "Coin",
    click: async () => {
      if (await validateTableInfo()) {
        const param = getParam();
        let queryParam =
          "tableName=" +
          formFields.value.tableName +
          "&nameSpace=" +
          formFields.value.namespace +
          "&foldername=" +
          formFields.value.folderName;
        proxy.http
          .post("/api/builder/CreateServices?" + queryParam, param, true)
          .then((x) => {
            proxy.$message.info(x);
          });
      }
    },
  },
  {
    name: "删除配置",
    icon: "Delete",
    click: () => {
      let tableId = formFields.value.table_Id;
      if (!tableId) return proxy.$message.error("请选择节点");
      proxy
        .$confirm("删除警告?", "确认要删除吗", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
        .then(() => {
          proxy.http
            .post("/api/builder/delTree?table_Id=" + tableId, {}, true)
            .then((x) => {
              if (!x.status) return proxy.$message.error(x.message);
              proxy.$message.error("删除成功,请刷新页面");
              tableData.value.length = 0;
              formFields.value.table_Id = 0;
              formFields.value.tableName = ''
              formFields.value.tableTrueName = ''
              formFields.value.columnCNName = ''
              proxy.base.getItem('del:coder:tree:data')?.(tableId)
            });
        });
    },
  },
]);

const initData = (nameSpace, treeData, orginData, db) => {
  loadTableInfo();
  treeOrginData.value = orginData;
  addOptions.value[0][0].data = treeData;
  addOptions.value[0][0].orginData = orginData;
  addOptions.value[1][0].data = nameSpace;
  formOptions.value[0][2].data = nameSpace;
  formOptions.value[0][1].data = treeData;
  formOptions.value[0][1].orginData = orginData;
  // addOptions.value[addOptions.value.length - 1][0].data = nameSpace;
};

defineExpose({
  nodeClick,
  initData,
});
</script>
<style lang="less" scoped>
@import "./style/coderV3Content.less";

.desc {
  color: #0247de;
  font-size: 13px;
}

/* 多表关联说明 - 参照信息框样式 */
.multi-table-tip {
  margin-top: 12px;
  padding: 12px 16px;
  background-color: #f7f7f9;
  border: 1px solid #c9ccff;
  border-radius: 6px;

  .multi-table-tip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;


    .multi-table-tip-title {
      color: #4f58d2;
      font-weight: bold;
      font-size: 14px;
    }
  }

  .multi-table-tip-list {
    margin: 0;
    padding-left: 22px;
    color: #333;
    font-size: 13px;
    line-height: 1.8;

    li {
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
