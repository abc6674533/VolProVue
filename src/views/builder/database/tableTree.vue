<template>

  <div class="table-tree">
    <div class="coder-left-title">
      <el-select @change="selectChange" style="width: 125px;margin-right: 4px;" v-model="dbService">
        <el-option v-for="item in dbList" :key="item.key" :label="$ts(item.value)" :value="item.key">
        </el-option>
      </el-select>
      <el-input v-model="searchVal" style="width: 80px" placeholder="搜索..." suffix-icon="Search" />
      <el-button icon="Refresh" @click="refresh"
        style="padding-left: 6px;padding-right: 6px;margin-left: 4px;"></el-button>
    </div>

    <el-scrollbar :width="1" class="coder-left-scrollbar">
      <div class="table-item" @click="itemClick(data)" :class="{ 'table-item-active': currentTable == data.table }"
        v-for="(data, index) in filteredTables" :key="index">
        <div>
          <div class="table-cn"> {{ data.name }}</div>
          <div class="table-name" v-if="data.table != data.name"> {{ data.table }}</div>
          <div class="table-btns"><el-button link size="small" type="success"><span class="el-icon-mobile"></span>{{
            $ts('无代码开发') }}</el-button>
            <el-button type="primary" @click="coderClick(data)" link><span class="el-icon-edit-outline"></span> {{
              $ts('代码生成')
              }}</el-button>
          </div>
        </div>
        <div class="table-icon-right"><span class="el-icon-arrow-right"></span></div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
const emit = defineEmits(["nodeClick", "initDefaulDbService"]);
import { ref, reactive, getCurrentInstance, nextTick, computed } from "vue";
const { proxy } = getCurrentInstance();

const searchVal = ref('');
const dbService = ref('');
const dbType = ref('')
const dbList = ref([]);
const currentTable = ref();
const itemClick = (item) => {
  currentTable.value = item.table;
  emit('nodeClick', item, dbService.value)
}

const coderClick = (data) => {
  let url = location.origin + '/';
  if (location.href.includes('#')) {
    url += '#/'
  }
  url += 'coderV3?table=' + data.table + '&dbService=' + dbService.value;
  window.open(url, '_blank')
}

const tables = ref([]);
const filteredTables = computed(() => {
  if (!searchVal.value) {
    return tables.value;
  }
  const val = searchVal.value.toLowerCase();
  return tables.value.filter((t) => {
    const name = (t.name || '').toLowerCase();
    const table = (t.table || '').toLowerCase();
    return name.includes(val) || table.includes(val);
  });
});
const loadTables = async () => {
  let url = `api/db/table/getAllTables?dbService=${dbService.value}`
  tables.value = await proxy.http.post(url, {}, true).then(res => { return res })
}
const refresh = async () => {
  await loadTables();
  proxy.$message.success('删除成功')
}

const initDefaulDbService = () => {
  dbType.value = dbList.value.find(x => { return x.key == dbService.value }).dbType
  nextTick(() => {
    emit('initDefaulDbService', dbService.value, dbType.value)
  })
}
const getDbList = async () => {
  await proxy.http.post('api/db/table/getDbService', {}, true).then(res => {
    if (!res.length) {
      res = [{ key: "SysDbContext", value: 系统库SysDbContext }]
    }
    dbList.value = res;
    dbService.value = dbList.value[0].key;
    dbType.value = dbList.value[0].dbType;
    initDefaulDbService();
  })
  loadTables();
}
getDbList();

const selectChange = (item) => {

  initDefaulDbService();
  loadTables();
}

const del = (table) => {
  const index = tables.value.findIndex(x => { return x.table == table });
  tables.value.splice(index, 1)
}
defineExpose({ del, loadTables })
// loadTables();
</script>
<style lang="less" scoped>
.table-tree {
  height: 100%;
  display: flex;
  flex-direction: column;

  .coder-left-title {
    display: flex;
    padding: 4px;
    border-bottom: 1px solid #eee;
  }

  .coder-left-scrollbar {
    flex: 1;
  }

  .table-item {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #eee;
    align-items: center;
    border-left: 2px solid #ffffff00;
    word-break: break-all;

    .el-icon-arrow-right {
      font-size: 14px;
      color: #d2d2d2;
    }

    .table-icon-right {
      margin: 0 0 0 auto;
      font-size: 14px;
    }

    .table-cn {
      font-size: 14px;
    }

    .table-name {
      font-size: 13px;
      color: #676767;
      margin-top: 2px;
    }

    .table-btns {
      margin-top: 5px;
    }

    button {
      padding: 2px 2px !important;
      // margin: 0 !important;
    }
  }

  .table-item:hover,
  .table-item-active {
    background: #eaeefd;
    cursor: pointer;
    border-left: 2px solid #284bd8;
    box-sizing: border-box !important;

    .table-cn {
      color: #2f54eb;
    }
  }
}
</style>