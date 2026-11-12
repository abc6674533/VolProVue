<template>
  <div class="coder-v3">
    <!-- 左边树结构 -->
    <div class="coder-left">
      <table-tree ref="treeRef" @initDefaulDbService="initDefaulDbService" @node-click="nodeClick"></table-tree>
    </div>
    <div class="tree-content">
      <div class="coder-content-header fx">
        <div class="fx-1">
          <vol-title icon="Edit" :title="tableText">
            <!-- <span class="desc">支持拖拽配置、实时预览、动态生成;</span> -->
          </vol-title>
        </div>
        <div class="corder-content-btns">
          <el-button :type="btn.type" :color="btn.color" v-for="(btn, index) in buttons" :key="index"
            @click="btn.click">
            <el-icon>
              <component :is="btn.icon" />
            </el-icon>
            {{ $ts(btn.name) }}
          </el-button>
        </div>
      </div>
      <div> <el-alert :show-icon="true" type="info" class="alert-primary"
          title="只有【超级管理员】登录并且后台【appsettings.json】开启了配置【DbTable】才能操作数据库表" :closable="false"></el-alert></div>
      <div class="table-content">
        <vol-table ref="tableRef" sortable :ck="false" :table-data="tableData" index :columns="columns"
          :height="maxHeight" :pagination-hide="true" :load-key="false" :column-index="true"></vol-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
defineOptions({ name: "db_table" })
import dataTypes from './dataTypes.js'
import tableTree from './tableTree.vue'
const emit = defineEmits(["nodeClick"]);
import { ref, reactive, getCurrentInstance, nextTick, watch, computed } from "vue";
const { proxy } = getCurrentInstance();
const treeRef = ref();
const tableRef = ref();
const maxHeight = ref(0);
const currentTable = ref({});
const dbService = ref();
//数据库类型：MsSql、MySql、PgSql
const dbType = ref('')
const isAdd = ref(true)
maxHeight.value = document.body.clientHeight - 194

const tableText = computed(() => {
  if (isAdd.value) {
    return `表信息(新建表), 当前数据库：${dbService.value}`
  }
  return `${currentTable.value.name||''}${currentTable.value.name != currentTable.value.table ? ('/' + currentTable.value.table) : ''}, 当前数据库：${dbService.value}`
  // '表信息' + '(' + (isAdd ? '新建表' : (currentTable.name || '请选择表')) + ')' + ' ,当前数据库：' + dbService
})

// 支持自增的数值类型（MsSql: int/bigint；MySql: int/bigint/tinyint 等；PgSql: int4/int8/integer）
const numberArr = ['int', 'bigint', 'int4', 'int8', 'integer', 'tinyint', 'smallint', 'mediumint'];

// 按数据库类型定义的字段类型选项（key/value 均为该库下的类型名）
const DATA_TYPE_OPTIONS = dataTypes();

const tableData = ref([]);

const DATA_TYPE_COLUMN_INDEX = 2; // 字段类型列在 columns 中的下标

const columns = ref([
  {
    "title": "字段名",
    "field": "columnName",
    "width": 100,
    required: true,
    edit: { type: 'text' }
  },
  {
    "title": "中文名",
    "width": 100,
    "field": "comment",
    edit: { type: 'text' }
  },
  {
    "title": "字段类型",
    "field": "dataType",
    required: true,
    edit: { type: 'select' },
    "bind": { data: DATA_TYPE_OPTIONS.MsSql },
    "width": 100
  }, {
    "title": "主键",
    "field": "isPrimaryKey",
    "width": 55,
    "align": "center",
    render: (h, { row, column, index }) => {
      return (
        <el-checkbox
          v-model={row.isPrimaryKey}
          onChange={(val) => {
            if (val) {
              row.isNullable = false;
            }
            if (!numberArr.includes(row.dataType)) {
              row.isIdentity = false;
            }
          }}
        ></el-checkbox>
      )
    }
  },
  {
    "title": "自增",
    "field": "isIdentity",
    "width": 55,
    "align": "center",
    render: (h, { row, column, index }) => {
      return (
        <el-checkbox
          v-model={row.isIdentity}
          disabled={!numberArr.includes(row.dataType)}
          onChange={(val) => {
          }}
        ></el-checkbox>
      )
    }
  },
  {
    "title": "可为空",
    "field": "isNullable",
    "width": 55,
    "align": "center",
    render: (h, { row, column, index }) => {
      return (
        <el-checkbox
          v-model={row.isNullable}
          disabled={!!row.isPrimaryKey}
          onChange={(val) => {
          }}
        ></el-checkbox>
      )
    }
  },
  {
    "title": "长度",
    "field": "length",
    "width": 90,
    min: 0,
    max: 999999,
    edit: { type: 'number' },
    formatter: (row) => {
      if (row.length <= 0) {
        return ''
      }
      return row.length
    }
  },
  {
    "title": "小数位",
    "field": "scale",
    min: 0,
    max: 10,
    "width": 80,
    edit: { type: 'number' },
    formatter: (row) => {
      if (['decimal', 'numeric'].includes(row.dataType)) {
        return row.scale || ''
      }
      return ''
    }
  },
  {
    "title": "默认值",
    "field": "defaultValue",
    //mysql8.x以下版本的guid默认值需要单独处理
    min: 0,
    max: 10,
    "width": 90,
    edit: { type: 'input' }
  },
  {
    "title": "操作",
    "field": "action",
    "width": 110,
    "align": "center",
    render: (h, { row, column, index }) => {
      return (<div>
        <el-popconfirm
          class="box-item"
          title="确定要删除吗?"
          placement="left"
          onConfirm={() => { tableRef.value.delRow(row) }}
          hide-after={0}
        >
          {{
            reference: () => {
              return <el-button plain link color="#0425dd">
                <i style="font-size:13px" class="el-icon-delete"></i>{proxy.$ts("删除")}
              </el-button>
            }
          }}
        </el-popconfirm>
        <el-button onClick={() => { addRow() }} plain link color="#0425dd" style="margin-left:2px">
          <i style="font-size:13px" class="el-icon-plus"></i>{proxy.$ts("添加")}
        </el-button>
      </div>)
    }
  }
]);

// 监听 dbType 变化，切换字段类型列的 bind.data
watch(dbType, (type) => {
  const options = DATA_TYPE_OPTIONS[type] || DATA_TYPE_OPTIONS.MsSql;
  if (columns.value[DATA_TYPE_COLUMN_INDEX]?.bind) {
    columns.value[DATA_TYPE_COLUMN_INDEX].bind.data = options;
  }
}, { immediate: true });


const addRow = () => {
  tableData.value.push({ isDbField: false, originalColumnName: '' })
}

const buttons = ref([
  {
    name: "保存",
    icon: "Check",
    color: "#1e6fff",
    click: () => {
      if (!isAdd.value) {
        save();
        return;
      }
      if (!tableData.value.length) {
        return proxy.$message.error(proxy.$ts('请添加表字段'))
      }
      if (!tableRef.value.validate()) {
        return;
      }
      proxy.$messageBox.prompt('请输入表名', `当前选择[${dbService.value}]数据库,左边下拉框可切换数据库`, {
        confirmButtonText: proxy.$ts('确定'),
        cancelButtonText: proxy.$ts('取消'),
        inputErrorMessage: proxy.$ts('请输入表名'),
        inputValidator: (value) => {
          return !!value;
        }
      }).then(({ value }) => {
        save(value);
      })
    },
  },
  {
    name: "新建表",
    icon: "Plus",
    //  plain:true,
    type: "danger",

    click: () => {
      isAdd.value = true;
      tableData.value = [{}];
      currentTable.value = {};
    },
    // type: "success",
  },
  {
    name: "添加字段",
    icon: "Plus",
    click: () => {
      addRow();
    },
  },
  {
    name: "删除表",
    icon: "Delete",
    click: () => {
      handleDeleteTable();
    },
  }, {
    name: "刷新",
    icon: "Refresh",
    click: async () => {
      await handleViewTable();
      proxy.$message.success(proxy.$ts('刷新成功'))
    },
  },
]);

const nodeClick = (item, db) => {
  isAdd.value = false
  currentTable.value = item;
  dbService.value = db;
  handleViewTable(item)
}

const initDefaulDbService = (db, type) => {
  dbService.value = db;
  dbType.value = type;
}

const handleViewTable = async (row) => {
  row = row || currentTable.value;
  if (!row.table) {
    return;
  }
  const url = `api/db/table/getTableInfo?tableName=${row.table}&dbService=${dbService.value}`
  const response = await proxy.http.post(url, {}, true).then(res => { return res })
  const data = response || {}
  const cols = data.columns ?? data.Columns ?? []
  tableData.value = normalizeColumns(cols)
}
const normalizeColumns = (cols) => {
  const list = cols || []
  return list.map((col, index) => ({
    columnName: col.columnName ?? '',
    originalColumnName: col.originalColumnName ?? "",
    isDbField: col.isDbField ?? col.IsDbField ?? true,
    dataType: (() => {
      const dt = (col.dataType ?? col.DataType ?? 'nvarchar')
      //mysql guid
      if ((col.dataType == 'varchar' || col.dataType == 'char') && col.length == 36 && dbType.value == 'MySql') {
        return 'guid';
      }
      const len = col.length ?? col.Length
      const dtLower = dt?.toString().toLowerCase()
      // PGSql: uuid 在前端统一显示为 uniqueidentifier，便于与 SQL Server 逻辑字段类型统一
      //if (dtLower === 'uuid') return 'uniqueidentifier'
      // PGSql: character varying 统一映射为 varchar，便于前端选择
      if (dtLower === 'character varying') return 'varchar'
      // PGSql: integer 统一映射为 int，保持前端类型一致
      if (dtLower === 'integer') return 'int'
      if (dtLower == 'character') {
        return 'char';
      }
      // SQL Server: nvarchar/varchar + length=-1 表示 (max)，编辑时回显为 nvarchar(max)/varchar(max)
      if ((dtLower === 'nvarchar' || dtLower === 'varchar') && len === -1) return `${dtLower}(max)`
      return dt
    })(),
    length: col.length ?? col.Length,
    scale: col.scale ?? col.Scale ?? 0,
    isNullable: col.isNullable ?? col.IsNullable ?? true,
    isPrimaryKey: col.isPrimaryKey ?? col.IsPrimaryKey ?? false,
    isIdentity: col.isIdentity ?? col.IsIdentity ?? false,
    comment: col.comment ?? col.Comment ?? '',
    defaultValue: col.defaultValue ?? col.DefaultValue ?? '',
    order: index + 1
  }))
}

const checkPrimaryKey = () => {
  const hasPrimaryKey = tableData.value.some(col => col.isPrimaryKey)
  if (!hasPrimaryKey) {
    proxy.$message.error('至少需要勾选一个主键字段')
    return false;
  }
  return true;
}

const save = async (tableName) => {
  if (!checkPrimaryKey()) {
    return;
  }

  if (!tableRef.value.validate()) {
    return;
  }

  for (let index = 0; index < tableData.value.length; index++) {
    const row = tableData.value[index];
    if (row.dataType.includes('char')&&!row.dataType.includes('max') && (!row.length || row.length * 1 <= 0)) {
      return proxy.$message.error(`第输入【${index + 1}】行字段【${row.columnName}】【长度】的值`)
    }
    if (['decimal', 'numeric'].includes(row.dataType) && (!row.scale || !row.length)) {
      return proxy.$message.error(`第输入【${index + 1}】行字段【${row.columnName}】【长度】与【小数位】`)
    }
  }



  tableData.value.forEach(col => {
    col.columnName = col.columnName?.trim()?.replace(/\r?\n|\r/g, '');
    col.comment = col.comment?.trim()?.replace(/\r?\n|\r/g, '');
  })

  const submitPayload = {
    tableName: (tableName || currentTable.value.table)?.trim(),
    columns: tableData.value.map(({ _rowId, ...col }) => {
      const dtLower = col.dataType?.toString().toLowerCase()
      // 兼容前端选择 nvarchar(max)/varchar(max)：提交给后端统一转换为 length=-1
      if (dtLower === 'nvarchar(max)') {
        return { ...col, dataType: 'nvarchar', length: -1 }
      }
      if (dtLower === 'varchar(max)') {
        return { ...col, dataType: 'varchar', length: -1 }
      }
      if (col.dataType == 'guid') {
        col.dataType = 'varchar';
        col.length = 36;
      }
      return col
    })
  }
  let url;
  if (!isAdd.value) {
    url = `api/db/table/updateTable?tableName=${submitPayload.tableName}&dbService=${dbService.value}`
    proxy.http.post(url, submitPayload, true).then(res => {
      if (res.status) {
        handleViewTable();
        return proxy.$message.success(res.message)
      }
      proxy.$message.error(res.message)
    })
    return;
  }

  url = `api/db/table/createTable?dbService=${dbService.value}`
  proxy.http.post(url, submitPayload, true).then(res => {
    if (res.status) {
      isAdd.value = false;
      currentTable.value.table = submitPayload.tableName;
      treeRef.value.loadTables();
      return proxy.$message.success(res.message)
    }
    proxy.$message.error(res.message)
  })
}
const handleDeleteTable = async () => {
  if (!currentTable.value.table) {
    tableData.value.length = 0;
    proxy.$message.success('删除成功');
    return;
  }
  proxy.$confirm('当前操作会删除数据库实际表,删除后不可恢复,确定要删除吗？', proxy.$ts("警告"), {
    confirmButtonText: proxy.$ts("确定"),
    cancelButtonText: proxy.$ts("取消"),
    dangerouslyUseHTMLString: true,
    type: "warning",
    center: true,
  }).then(() => {
    const url = `api/db/table/deleteTable?tableName=${currentTable.value.table}&dbService=${dbService.value}`
    proxy.http.post(url, {}, true).then(res => {
      if (res.status) {
        tableData.value.length = 0;
        treeRef.value.del(currentTable.value.table);
        currentTable.value = {};
        return proxy.$message.success(res.message)
      }
      proxy.$message.error(res.message)
    })
  })

}

</script>
<style lang="less" scoped>
@import "./table.less";
</style>
<style lang="less" scoped>
.tree-content {
  height: 100%;
  background: #fff;
}

.coder-content-header {
  border: 1px solid #eee;
}

.fx {
  display: flex;
  align-items: center;
  padding: 6px 10px;

}

.fx-1 {
  flex: 1;
}

.table-content {
  :deep(.el-checkbox) {
    .el-checkbox__input .el-checkbox__inner {
      border: 1px solid #a0a0a0 !important;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
      border: 0px !important;
    }
  }
}
</style>