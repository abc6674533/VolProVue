<template>
  <div class="edit-panel-content" :style="{ height: height + 'px' }">
    <coder-form-panel dy-form currentAction="edit" ref="formPanelRef" form-type="workflow"
      @saveClick="saveClick"></coder-form-panel>
  </div>
</template>
<script setup>
// import { components } from './components.js'
import {
  dataType
} from "@/views/builder/coderV3Options.jsx";

const formComponents=dataType.filter(x=>{return !['selectTable'].includes(x.value)}).map(x=>{
   return {
    title:x.value,
    formType:x.key,
    field:x.key
   }
})

import coderFormPanel from '@/views/builder/coderV3Form.vue'
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance();
const height = ref(0)
const width = ref(1200)



const formPanelRef = ref()

height.value = document.body.clientHeight - 96

nextTick(()=>{
     formPanelRef.value?.initDraggableFields(formComponents,[], 'edit')
})


const currnetNode = ref({})


const tableInfo = {}

const showEdit = (node, tableName) => {
  if (node.name === '') {
    return proxy.$message.error('请选中节点并设置节点名称后再点编辑表单')
  }
  if (!tableName) {
    return proxy.$message.error('请选择左侧[流程实例]')
  }
  //console.log(node)
  if (!Array.isArray(node.Config)) {
    node.Config = []
  }
  currnetNode.value = node;

  model.value = true;
  nextTick(async () => {
    //const editOptions = []
    //{"title":"所属仓库","field":"BelongWarehouse","rowNo":1,
    //"colNo":11,"formType":"select",
    //"dropNo":"ERP仓库","width":33.333,
    //"isReadDataset":0,"isNull":1}


    // field: "PurchaseDate", formType:"date",isNull: 0,isReadDataset : 0,title:  "采购日期"

    formPanelRef.value?.initDraggableFields(tableInfo[tableName].fieldOptions, node.Config, 'edit')
  })
}


const saveClick = (formOptions) => {
  currnetNode.value.Config = formOptions
  //console.log(formOptions)
  model.value = false;
}
defineExpose({
  showEdit
})

</script>

<style scoped lang="less">
// .edit-panel-content ::v-deep(.el-form-item .el-form-item__label) {
//   margin-bottom: 10px !important;
// }
.edit-panel-content{
  // padding: 10px;
  // background: #eee;
}
</style>