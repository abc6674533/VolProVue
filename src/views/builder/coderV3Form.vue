<template>
  <div class="form-content" :style="{ height: isCoder ? height + 'px' : '100%' }">
    <div class="vol-custom-fields">
      <div class="custom-title">
        <div style="flex: 1">
          <i class="el-icon-edit-outline"></i> {{ $ts("字段列表") }}
        </div>
        <div style="margin-left: 10px">
          <el-checkbox v-model="all" @change="allChange">
            {{ $ts(all ? "取消" : "全选") }}</el-checkbox>
        </div>
      </div>
      <el-scrollbar style="flex: 1">
        <coderV3FormFields :dyForm="dyForm" ref="fieldsRef" :checkEnd="checkEnd" @end="end"></coderV3FormFields>
      </el-scrollbar>
    </div>
    <div class="form-content-options">
      <div class="custom-title">
        <div v-if="isCoder" style="flex: 1">
          <i class="el-icon-receiving" style="margin-right: 3px"></i>{{ currentAction == "search" ? "查询" : "编辑"
          }}{{ $ts("表单布局") }}
          <el-popover title="配置说明" :width="480">
            <template #reference>
              <span style="color: #0247de; font-size: 13px" class="el-icon-info">一对多明细表</span>
            </template>
            <div style="line-height: 2">
              <div>1.主表与明细表分开配置生成代码</div>
              <div>
                2.主表【基础信息】填写【明细表】,点击:保存->预览即可实时看到效果
              </div>
              <!-- <p>2.配置表结构信息</p>
            <p>3.配置查询表单</p>
            <p>4.配置编辑表单</p> -->
            </div>
          </el-popover>
        </div>
        <!-- <span class="desc" v-show="currentTabs == 'edit'">
                    <span class="el-icon-info">主表与明细表分开维护,主表表单配置填写明细表信息,点击预览即可查看。。。</span>
                </span> -->

        <div class="attr-item">
          <div class="attr-item-title" v-if="!dyForm">
            <span class="el-icon-info"></span>批量设置表单字段数量
          </div>
          <el-select style="width: 180px" v-model="bacthItemWidth" @change="batchWidthChange"
            :placeholder="$ts('表单字段数量')">
            <el-option v-for="item in batchWidth" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <el-button color="#626aef" icon="Refresh" plain @click="clearClick">清除表单</el-button>
        <el-button v-if="formType == 'workflow'" type="danger" icon="Check" size="small"
          @click="saveClick">保存</el-button>
        <el-button v-if="downForm" type="default" icon="Download" size="small"
          @click="showPriviewBox">下载
        </el-button>
        <el-button v-if="dyForm" type="default" icon="Monitor" size="small" @click="showPriviewBox">预览
        </el-button>
      </div>
      <div v-if="dyForm && formType != 'workflow'"> <el-alert show-icon style="margin-bottom: -1px"
          title="表单设计可同时用于快速构建自定义表单功能,设计好表单点下载" class="alert-primary" :closable="false"></el-alert></div>
      <el-scrollbar style="height: 100%">
        <div class="ep-text" v-if="!formOptions.length">
          <div><i class="el-icon-receiving"></i></div>
          请将左边字段拖到此处
        </div>
        <el-form label-position="top">
          <draggable class="draggable-container" v-model="formOptions" @add="onAdd" @end="formEnd" animation="300"
            :move="onMove" style="min-height: 300px" group="componentsGroup">
            <transition-group>
              <template v-for="(item, index) in formOptions" :key="index">
                <div class="vol-custom-form-item" @click="itemClick(item, index)" :class="{
                  actived: index === currentIndex,
                  'vol-custom-form-item-editor': item.formType == 'editor',
                  'vol-custom-form-item-table': item.detail,
                  'vol-custom-form-item-break':
                    currentAction == 'edit' &&
                    index > 0 &&
                    formOptions[index - 1]?.columnformat?.editBreak == 1,
                }" :style="{
                  width: (item.detail ? 100 : item.width || 25) + '%',
                }">
                  <i class="el-icon-delete" @click.stop="removeItem(index)">
                  </i>
                  <el-form-item :required="item.required" label-position="top" style="width: 100%"
                    :label="$ts(item.title)">
                    <coderV3FormItem :typeField="typeField" :item="item"></coderV3FormItem>
                  </el-form-item>
                </div>
                <!-- <div
                  style="width: 100%; height: 0; padding: 0; overflow: hidden"
                  v-if="currentAction == 'edit' && item.columnformat?.editBreak == 1"
                >
                </div> -->
              </template>
            </transition-group>
          </draggable>
        </el-form>
      </el-scrollbar>
    </div>
    <div class="form-content-attr">
      <div class="custom-title">
        <i class="el-icon-paperclip"></i> {{ $ts("属性设置") }}
      </div>
      <el-scrollbar style="height: 100%">
        <coderV3FormAttr :show-dic="isCoder" :currentTabs="currentAction" ref="formAttrRef"
          @batchWidthChange="batchWidthChange" :currentItem="currentItem" :dyForm="dyForm">
        </coderV3FormAttr>
      </el-scrollbar>
    </div>
  </div>
  <priview-box :downForm="downForm" :readonly="formType == 'workflow'" ref="priviewBoxRef"></priview-box>
</template>
<script lang="jsx" setup>
import { VueDraggableNext as draggable } from "vue-draggable-next";
import coderV3FormFields from "./coderV3FormFields.vue";
import PriviewBox from './coderV3PriviewBox.vue'

import coderV3FormItem from "./coderV3FormItem.vue";
import coderV3FormAttr from "./coderV3FormAttr.vue";
import { ref, reactive, getCurrentInstance, nextTick, computed } from "vue";

const priviewBoxRef = ref();

const validate = () => {
  const item = formOptions.value.find(x => { return ['select', 'radio', 'selectList', 'checkbox', 'cascader', 'treeSelect'].includes(x.formType) && !x.dropNo })
  if (item) {
    proxy.$message.error(`请选择[${item.title}]数据源`)
    return false;
  }
  return true
}

const showPriviewBox = () => {

  if (!validate()) {
    return;
  }

  priviewBoxRef.value.open(formOptions.value, '')
}

const emit = defineEmits(["saveClick"]);

const { proxy } = getCurrentInstance();
const tableHeight = ref(0);
tableHeight.value = document.body.clientHeight - 443;
if (tableHeight.value <= 260) {
  tableHeight.value = 260;
}
const pros = defineProps({
  height: {
    type: Number,
    default: 100,
  },
  dyForm: {
    //动态表单
    type: Boolean,
    default: false,
  },
  formType: {
    type: String,
    default: "coder",
  },
  currentAction: {
    type: String,
    default: "",
  },
  downForm:{
    //动态表单
    type: Boolean,
    default: false,
  }
  // fieldOptions: {
  //     type: Array,
  //     default: () => {
  //         return [];
  //     },
  // }
});

const isCoder = computed(() => {
  return pros.formType == "coder";
});

const all = ref(false);
const allChange = () => {
  // console.log(all.value);
  if (all.value) {
    formOptions.value = fieldsRef.value.getAll();
    if (pros.currentAction != "search") {
      formOptions.value = formOptions.value.filter((x) => {
        return ![
          "CreateID",
          "Creator",
          "CreateDate",
          "ModifyID",
          "Modifier",
          "ModifyDate",
        ].includes(x.field);
      });
    }
    if (pros.dyForm) {
      formOptions.value.forEach((x) => {
        x.field = generateField();
      });
    }
    return;
  }

  formOptions.value.splice(0);
};
const formOptions = ref([]);
const formAttrRef = ref();
const fieldsRef = ref();
const currentTabs = ref();
const typeField = ref();
// const batchWidthChange = (val) => {
//    // emit('batchWidthChange', val || 0)
// }
const bacthItemWidth = ref(null);
const batchWidth = reactive([
  { key: 0, value: "自动" },
  { key: 100, value: "表单每行显示1个字段" },
  { key: 50, value: "表单每行显示2个字段" },
  { key: 33.333, value: "表单每行显示3个字段" },
  { key: 25, value: "表单每行显示4个字段" }, //每行显示4个字段
  { key: 20, value: "表单每行显示5个字段" }, //每行显示5个字段
  { key: 16.666, value: "表单每行显示6个字段" }, //每行显示6个字段
  { key: 14.285, value: "表单每行显示7个字段" }, //每行显示7个字段
  { key: 12.5, value: "表单每行显示8个字段" }, //每行显示7个字段
  { key: 11.111, value: "表单每行显示9个字段" }, //每行显示7个字段
  { key: 10, value: "表单每行显示10个字段" }, //每行显示10个字段
]);

const initDraggableFields = (options, searchEditFormOptions, action) => {
  all.value = false;
  currentTabs.value = action || "";
  if (action == "search") {
    typeField.value = "searchType";
  } else if (action == "edit") {
    typeField.value = "editType";
  } else {
    typeField.value = "";
  }
  nextTick(() => {
    formOptions.value = searchEditFormOptions;
    // formOptions.value = options.filter(x => {
    //     return (!action || action == 'search' ? x.searchRowNo : x.editRowNo) > 0
    // })
    fieldsRef.value.initDraggableFields(options, action);
    formAttrRef.value.reset(action);
  });
};

const currentIndex = ref(-1);
const currentItem = ref({});
const itemClick = (item, index) => {
  // item.isNull=(item.isNull||'1')*1
  // console.log(item);
  currentItem.value = item;
  if (!currentItem.value.width) {
    currentItem.value.width = 25;
  }
  currentIndex.value = index;
};

const removeItem = (index) => {
  formOptions.value.splice(index, 1);
  currentIndex.value = -1;
};
const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const charsLength = chars.length;
const generateField = () => {
  let result = "";
  const timestampPart = Date.now().toString().slice(-6);
  const randomPart = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * charsLength)]
  ).join("");
  result = (timestampPart + randomPart)
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  if (result.length !== 10) {
    result = result.slice(0, 10);
  }

  return result;
};

const onAdd = ({ item, newIndex, to }) => {
  // console.log(item,newIndex)
  //不是动态表单的可能会影响现有的字段配置
  if (pros.dyForm) {
    formOptions.value[newIndex] = Object.assign(
      {},
      formOptions.value[newIndex]
    );
    formOptions.value[newIndex].field = generateField();
  }
};

const end = (ops) => {
  ops = Object.assign({}, ops);
  // const item = formOptions.value.find(x => { return x.field == ops.field })
  // if (item?.columnformat) {
  //     ops.columnformat = item.columnformat
  // } else {
  //     ops.columnformat = {}
  // }
  currentItem.value = ops;
  // console.log(formOptions.value);
  // console.log(ops);
};
const formEnd = (field) => { };
const onMove = () => { };
let timeMsg = false;

const checkEnd = (field) => {
  const b = formOptions.value.some((c) => {
    return c.field == field;
  });
  if (b && !pros.dyForm) {
    if (!timeMsg) {
      timeMsg = true;
      setTimeout(() => {
        timeMsg = false;
      }, 1000);
      proxy.$message.error("字段已存在");
    }
    return false;
  }
  return true;
};

const batchWidthChange = (wd) => {
  formOptions.value.forEach((x) => {
    x.width = wd;
  });
};

const getFormOptions = () => {
  if (!validate()) {
    return;
  }
  return formOptions.value;
};

const clearClick = () => {
  formOptions.value = [];
  proxy.$message.success("清除成功");
};

const saveClick = () => {
  emit("saveClick", formOptions.value);
};

defineExpose({ initDraggableFields, getFormOptions });
</script>
<style lang="less" scoped>
@import "./style/coderV3Content.less";

.form-content {
  display: flex;
  padding: 0 !important;

  .vol-custom-fields {
    width: 222px;
    display: flex;
    flex-direction: column;
    // background: #eee;
    border-right: 1px solid #eee;
  }

  .form-content-options {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 0;
    flex: 1;
    border-right: 1px solid #eee;
  }

  .form-content-attr {
    display: flex;
    flex-direction: column;
    width: 220px;
  }

  ::v-deep(.el-scrollbar__bar.is-vertical) {
    width: 3px !important;
  }
}

.custom-title {
  // background: #ebedff;
  padding: 10px;
  color: #000;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.draggable-container {
  min-height: 300px;
}

.vol-custom-form-item {
  position: relative;
  cursor: move;
  padding: 18px 10px 10px 10px;
  text-align: left;
  float: left;
  margin-bottom: 0px;
  height: 74px;
  overflow: hidden;

  ::v-deep(.el-form-item__label) {
    line-height: 0 !important;
    color: #000;
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 5px !important;
  }

  .el-icon-delete {
    position: absolute;
    right: 10px;
    top: 5px;
    padding: 5px;
    display: none;
    color: red;
    cursor: pointer;
  }
}

.vol-custom-form-item-table {
  height: auto !important;
}

.vol-custom-form-item.actived,
.vol-custom-form-item:hover {
  background: #f3faff;

  .el-icon-delete {
    display: inline-block;
  }
}

.ep-text {
  font-size: 15px;
  color: #737272;
  text-align: center;
  position: absolute;
  width: 100%;
  top: 150px;
  letter-spacing: 1px;

  i {
    margin-top: 10px;
    color: #e2e2e2;
    font-size: 35px;
  }
}

.custom-title {
  display: flex;
  height: 44px;
  align-items: center;

  button {
    margin-left: 15px;
  }

  .attr-item {
    align-items: center;
    display: flex;
    font-weight: 400;
  }

  .attr-item-title {
    color: #0247de;
    margin-right: 10px;
    font-size: 13px;
  }

  ::v-deep(.el-checkbox) {
    .el-checkbox__label {
      padding-left: 4px;
      color: #000;
      position: relative;
      top: 1px;
    }
  }
}

.vol-custom-form-item-break {
  clear: both;
}

.vol-custom-form-item-editor {
  height: auto !important;
}
</style>
