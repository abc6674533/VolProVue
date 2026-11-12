<template>
  <div class="form-content">
    <vol-form :label-width="90" ref="formRef" label-position="top" :form-rules="formOptions"
      :form-fields="formFields"></vol-form>
  </div>
  <div class="table-content">
    <div class="fx">
      <vol-title icon="Monitor" title="表结构信息"> </vol-title>
      <div class="desc"> <span style="color: #0247de; font-size: 13px;" class="el-icon-info">修改后数据库表字段，请点击同步表结构、生成model、生成页面</span>
      </div>
      <div class="btns">
        <el-button link @click="delRow"><i class="el-icon-delete"></i> 删除行数据</el-button>
        <el-button link @click="syncTable">
          <i class="el-icon-refresh"></i>同步表结构</el-button>
      </div>
    </div>
    <vol-table :sortable="true" ref="tableRef" :paginationHide="true" @onSortEnd="onSortEnd" :table-data="tableData"
      :max-height="tableHeight" :columns="columns" :color="false" :column-index="true" :index="true"></vol-table>
  </div>
</template>
<script lang="jsx" setup>
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const formRef = ref();
const tableRef = ref();
const tableHeight = ref(0);
tableHeight.value = document.body.clientHeight - 443;
if (tableHeight.value <= 260) {
  tableHeight.value = 260;
}

const props = defineProps({
  formOptions: {
    type: Array,
    default: () => {
      return [];
    },
  },
  formFields: {
    type: Object,
    default: () => {
      return {};
    },
  },
  columns: {
    type: Array,
    default: () => {
      return [];
    },
  },
  tableData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  syncClick: {
    type: Function,
    default: () => { },
  },
});

const validate = async () => {
  return await formRef.value.validate();
};

const delRow = () => {
  proxy
    .$confirm("删除警告?", "确认要删除选择的数据吗", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    })
    .then(() => {
      tableRef.value.delRow();
      proxy.$message.success("删除成功,点击保存后或生成页面才会生成效");
    });
};

const syncTable = () => {
  if (!props.formFields.tableName) return proxy.$message.error("请选模块");
  const url = "api/builder/syncTable?tableName=" + props.formFields.tableName;
  proxy.http.post(url, {}, true).then((x) => {
    if (!x.status) {
      return proxy.$message.error(x.message);
    }
    proxy.$message.success(x.message);
    props.syncClick(props.formFields.table_Id);
  });
};

const onSortEnd = (rows) => {
  let orderNo = 10000;
  rows.forEach((x) => {
    orderNo = orderNo - 50;
    x.orderNo = orderNo;
  });
};
defineExpose({
  validate,
  syncTable
});
</script>
<style lang="less" scoped>
@import "./style/coderV3Content.less";
.desc{
  display: flex;
    align-items: center;
}
</style>
