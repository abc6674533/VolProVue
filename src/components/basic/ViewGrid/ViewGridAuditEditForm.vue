<template>
  <div>
    <vol-box title="表单编辑" v-model="model" :width="width" :padding="0" :lazy="false" draggable :destroyOnClose="true">
      <div style="padding: 10px 5px;">
        <vol-form ref="formRef" @dicInited="dicInited" :load-key="false" :label-width="100" :formRules="formOptions"
          :formFields="formFields" :select2Count="10000"></vol-form>
        <div v-show="columns.length" style="padding:5px 10px">
          <vol-title style="margin-bottom:4px" :title="detailTile"></vol-title>
          <div>
            <vol-table url="none" ref="tableRef" :defaultLoadPage="false" :load-key="false" @loadBefore="loadBefore"
              :paginationHide="false" :ck="false" :column-index="true" :table-data="[]" :height="230" :columns="columns"
              :color="false" :index="true"></vol-table>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="btns">
          <el-button @click="model = false" icon="Close">{{ $ts("关闭") }}</el-button>
          <el-button type="primary" icon="Check" @click="save">{{ $ts("保存") }}</el-button>
        </div>
      </template>
    </vol-box>
  </div>
</template>
<script setup>
import { defineComponent, ref, reactive, getCurrentInstance, nextTick, readonly } from "vue";

const width = ref(600)

const { proxy } = getCurrentInstance();

const tableRef = ref()

const model = ref(false);
const formOptions = ref([]);
const formFields = ref({})
const formRef = ref()
const detailTile = ref('')

const fileType = ['img', 'file', 'excel']
const loadBefore = (params, callback) => {
  //一对多明细表这里还要处理
  params.url = `api/${tableName}/getDetailPage`;
  params.value = idValue;
  callback(true);
}


const columns = ref([]);

let currentRow, tableKey, tableName, idValue;
const open = async (options, row, key, id, table) => {
  if (!row) {
    const url = `api/${table}/getPageData`
    await proxy.http.post(url, { page: 1, rows: 1, filter: [{ name: key, value: id }] }).then(x => {
      if (!x.rows.length) {
        proxy.$message.error(proxy.$ts('未查到数据,请检查数据是否已删除'))
        return;
      }
      if (x.rows.length > 1) {
        proxy.$message.error(proxy.$ts(`查询返回了多少条数据,主键字段:[${key}],值:${id},请检查主键是否正确`))
        return;
      }
      row = x.rows[0];
    })
  }
  if (!row) {
    return;
  }
  currentRow = row;
  tableKey = key;
  tableName = table;
  idValue = id;
  const data = JSON.parse(options).formOptions

  const  res = proxy.base.convertDataToFormOptions(data, tableName)
  formFields.value = res.fields;
  formOptions.value = res.formOptions;
  width.value = res.width;

  model.value = true;

  const details = data.filter(x => { return x.detail })
  detailTile.value = details[0]?.title;
  let colWd = 0;
  if (details.length) {
    columns.value = details[0].tableData.map(c => {
      colWd += c.columnWidth || 0
      const obj = {
        title: c.columnCnName,
        field: c.columnName,
        width: c.columnWidth,
        hidden: c.isDisplay + '' !== '1'
      }
      if (c.editType) {
        obj.edit = { type: c.editType }
        if (fileType.includes(c.editType)) {
          obj.edit.url = `api/${tableName}/upload`
        }
      }
      if (c.dropNo) {
        obj.bind = { data: [], key: c.dropNo }
      }
      // obj.hidden = !(c.isDisplay+''!=='0')
      obj.required = c.isNull + '' === '0'
      obj.readonly = !!c.isReadDataset
      //IsImage
      return obj;
    })
    width.value = colWd + 90;
    if (width.value > document.body.clientWidth * 0.95) {
      width.value = document.body.clientWidth * 0.95
    }
    nextTick(() => {
      tableRef.value?.initDicKeys(true);
      tableRef.value?.load({}, true);
    })
  }

  proxy.base.resetForm(
    formFields, formOptions, row
  );
  nextTick(() => {
    formRef.value.initSource(true);
  })

}

const dicInited = (result) => {
  setTimeout(() => {
    proxy.base.resetForm(
      formFields, formOptions, currentRow
    );
  }, 200);
}

const emit = defineEmits(['saveEditForm'])
const save = () => {
  formRef.value.validate(() => {
    saveData();
  })
}

const saveData = () => {
  if (columns.value.length && !tableRef.value.validate()) {
    return;
  }
  let url = `api/${tableName}/update`
  let editFormFields = proxy.base.getFormValues(
    formFields, formOptions
  );
  editFormFields[tableKey] = idValue;

  const detailData = tableRef.value?.rowData?.map(x => {
    const row = { ...x };
    Object.keys(row).forEach(c => {
      if (Array.isArray(row[c])) {
        row[c] = row[c].join(",");
      }
    })
    return row;
  })


  proxy.http.post(url, { mainData: editFormFields, isFlow: true, detailData }, true).then((x) => {
    if (!x.status) {
      proxy.$message.error(x.message)
      return
    }
    proxy.$message.success(x.message)
    model.value = false;
    emit('saveEditForm')
  })
}

defineExpose({
  open
})

</script>
<style scope>
.btns {
  /* //text-align: center; */
}
</style>
