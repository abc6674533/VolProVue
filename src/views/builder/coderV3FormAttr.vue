<template>
  <div style="padding: 10px">
    <div class="attr-item-group" style="display: flex">
      <div class="attr-item">
        <div class="attr-item-title">名称</div>
        <!-- {{currentItem.title||currentItem.field}}/{{currentItem.field}} -->
        <el-input v-model="currentItem.title" :placeholder="$ts('字段名称')" :disabled="!dyForm" />
      </div>
      <div class="attr-item" style="margin-left: 10px">
        <div class="attr-item-title">字段</div>
        <!-- {{currentItem.title||currentItem.field}}/{{currentItem.field}} -->
        <el-input v-model="currentItem.field" :placeholder="$ts('字段')" :disabled="!dyForm"  />
      </div>
    </div>
    <div class="attr-item" v-show="currentTabs == 'search'">
      <div class="attr-item-title">查询类型</div>
      <el-select
        style="width: 100%"
        size="default"
        v-model="currentItem.formType"
        :multiple="false"
        filterable
        @clear="
          () => {
            currentItem.formType = '';
          }
        "
        :placeholder="$ts('请选择')"
        clearable
      >
        <el-option
          v-for="item in searchDataType"
          :key="item.key"
          :label="$ts(item.value)"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </div>
    <!-- {{currentTabs||'无'}} -->
    <div class="attr-item" v-show="currentTabs == 'edit'">
      <div class="attr-item-title">编辑类型</div>
      <el-select
        style="width: 100%"
        size="default"
        v-model="currentItem.formType"
        :multiple="false"
        filterable
        @clear="
          () => {
            currentItem.formType = '';
          }
        "
        :placeholder="$ts('请选择')"
        clearable
      >
        <el-option
          v-for="item in editDataType"
          :key="item.key"
          :label="$ts(item.value)"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </div>

    <div class="attr-item">
      <div class="attr-item-title">
        数据源<el-button
          v-if="showDic"
          style="margin-left: 15px"
          link
          type="primary"
          @click="showDicModel"
          >+维护数据源</el-button
        >
      </div>
      <el-select
        style="width: 100%"
        size="default"
        v-model="currentItem.dropNo"
        :multiple="false"
        filterable
        @clear="
          () => {
            currentItem.dropNo = '';
          }
        "
        :placeholder="$ts('请选择')"
        clearable
      >
        <el-option
          v-for="item in dicData"
          :key="item.key"
          :label="$ts(item.value)"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </div>
    <div class="attr-item" style="display: flex" v-show="currentTabs == 'edit'">
      <div>
        <div class="attr-item-title">字段只读</div>
        <!-- <el-radio-group v-model="currentItem.isReadDataset">
                    <el-radio :key="1" label="是" :value="1"></el-radio>
                    <el-radio :key="0" label="否" :value="0"></el-radio>
                </el-radio-group> -->
        <el-switch
          size="default"
          :inline-prompt="false"
          v-model="currentItem.isReadDataset"
          active-color="#0f84ff"
          :active-text="$ts('是')"
          :inactive-text="$ts('否')"
          inactive-color="rgb(194 194 194)"
          :width="40"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </div>
      <div style="margin-left: 20px" v-if="showRequire||dyForm">
        <div class="attr-item-title">字段必填</div>
        <!-- <el-radio-group v-model="currentItem.isNull">
                    <el-radio :key="1" label="是" :value="1"></el-radio>
                    <el-radio :key="0" label="否" :value="0"></el-radio>
                </el-radio-group> -->
        <!-- {{currentItem.isNull}} -->
        <el-switch
          size="default"
          :inline-prompt="false"
          v-model="currentItem.isNull"
          active-color="#0f84ff"
          :active-text="$ts('是')"
          :inactive-text="$ts('否')"
          inactive-color="rgb(194 194 194)"
          :width="40"
          :active-value="0"
          :inactive-value="1"
        >
        </el-switch>
      </div>
    </div>
    <!-- <div class="attr-item">
            <div class="attr-item-title">批量设置表单每行显示字段数量</div>
            <el-select v-model="bacthItemWidth" @change="batchWidthChange" :placeholder="$ts('请选择')">
                <el-option v-for="item in batchWidth" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
            </el-select>
        </div> -->
    <div class="attr-item" v-if="currentTabs == 'edit' && currentItem.columnformat">
      <div class="attr-item-title">
        <!-- <el-popover :width="200">
                    <template #reference>
                      <span>字段换行 <span style="color: #0247de; font-size: 13px;" class="el-icon-info"></span></span> 
                    </template>
<div style="line-height: 2;">
    <div>字段换行后占满当前行剩余部分</div>
</div>
</el-popover> -->
        字段换行(后面字段显示到下一行)
      </div>
      <el-switch
        size="default"
        :inline-prompt="false"
        v-model="currentItem.columnformat.editBreak"
        active-color="#0f84ff"
        :active-text="$ts('是')"
        :inactive-text="$ts('否')"
        inactive-color="rgb(194 194 194)"
        :width="40"
        :active-value="1"
        :inactive-value="0"
      >
      </el-switch>
    </div>
    <div class="attr-item">
      <div class="attr-item-title">字段在表单上所占宽度</div>
      <el-radio-group v-model="currentItem.width" :placeholder="$ts('请选择')">
        <el-radio
          v-for="item in formWidth"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-radio>
      </el-radio-group>
    </div>
    <div class="dic-ref">
      <dicPage ref="dicRef"></dicPage>
    </div>
  </div>
</template>
<script lang="jsx" setup>
import {
  columnType,
  dataType as editDataType,
  searchDataType,
} from "./coderV3Options.jsx";
import { ref, reactive, getCurrentInstance, watch, defineAsyncComponent } from "vue";

const dicPage = defineAsyncComponent(() =>
  import("@/views/sys/system/Sys_Dictionary.vue")
);

const { proxy } = getCurrentInstance();
const pros = defineProps({
  currentItem: {
    type: Object,
    default: () => {
      return {
        isReadDataset: 0,
        // columnformat:{}
      };
    },
  },
  dyForm:{//动态表单
    type:Boolean,
    default:false
  },
  currentTabs: {
    type: String,
    default: "",
  },
  showDic: {
    type: Boolean,
    default: true,
  },
  // showRequire: {
  //     type: Boolean,
  //     default: true
  // }
});

const showRequire = ref(true);
//流程配置显示必填
showRequire.value = proxy.$route.path == "/Sys_WorkFlow";
const emit = defineEmits(["batchWidthChange"]);
const dicData = ref([]);
const dicRef = ref();
let dicGrid;
const showDicModel = () => {
  dicRef.value.$refs.grid.add();
  if (dicGrid) {
    return;
  }
  setTimeout(() => {
    dicGrid = dicRef.value.$refs.grid;
    dicGrid.addAfter = () => {
      // console.log('initDic')
      proxy.base.getItem("coder:initDic")();
      return true;
    };
    dicGrid.editFormOptions.forEach((x) => {
      x.forEach((ops) => {
        ops.readonly = false;
      });
    });
    dicGrid.detailOptions.columns.forEach((x) => {
      x.readonly = false;
    });
    dicGrid.detailOptions.buttons.splice(0);
    dicGrid.detailOptions.buttons.push(
      ...[
        {
          name: "添加行",
          icon: "el-icon-plus",
          type: "primary",
          hidden: false,
          plain: true,
          onClick() {
            dicGrid.addRow();
          },
        },
        {
          type: "danger",
          plain: true,
          name: "删除行",
          hidden: false,
          icon: "el-icon-delete",
          onClick() {
            dicGrid.delRow();
          },
        },
      ]
    );
    dicGrid.boxButtons.unshift({
      name: "保存",
      icon: "el-icon-check",
      type: "primary",
      onClick: () => {
        dicGrid.save();
      },
    });
  }, 300);
};
const initDic = async () => {
  proxy.http.post("api/Sys_Dictionary/GetBuilderDictionary", {}, true).then((dic) => {
    const data = dic.map((x) => {
      return { key: x, value: x };
    });
    data.unshift({ key: "", value: "请选择" });
    dicData.value = data;
  });
};
if (!pros.showDic) {
  initDic();
}

watch(
  () => proxy.base.getItem("coderDicData"),
  (data) => {
    dicData.value = data;
  }
);

const formWidth = reactive([
  { key: 0, value: "自动" },
  { key: 9.999, value: "10%" }, //每行显示10个字段
  { key: 11.111, value: "11%" }, //每行显示10个字段
  { key: 12.5, value: "12%" }, //每行显示8个字段
  { key: 14.285, value: "14%" }, //每行显示7个字段
  { key: 16.666, value: "16%" }, //每行显示6个字段
  { key: 20, value: "20%" }, //每行显示5个字段
  { key: 25, value: "25%" }, //每行显示4个字段
  { key: 30, value: "30%" },
  { key: 33.333, value: "33%" },
  { key: 40, value: "40%" },
  { key: 50, value: "50%" },
  { key: 60, value: "60%" },
  { key: 66.666, value: "66%" },
  { key: 75, value: "75%" },
  { key: 80, value: "80%" },
  { key: 100, value: "100%" },
]);

const batchWidthChange = (val) => {
  emit("batchWidthChange", val || 0);
};

// const bacthItemWidth = ref(null)
// const batchWidth = reactive([
//     { key: 0, value: "自动" },
//     { key: 100, value: "表单每行显示1个字段" },
//     { key: 50, value: "表单每行显示2个字段" },
//     { key: 33.333, value: "表单每行显示3个字段" },
//     { key: 25, value: "表单每行显示4个字段" },//每行显示4个字段
//     { key: 20, value: "表单每行显示5个字段" },//每行显示5个字段
//     { key: 16.666, value: "表单每行显示6个字段" },//每行显示6个字段
//     { key: 14.285, value: "表单每行显示7个字段" },//每行显示7个字段
//     { key: 12.5, value: "表单每行显示8个字段" },//每行显示7个字段
//     { key: 11.111, value: "表单每行显示9个字段" },//每行显示7个字段
//     { key: 10, value: "表单每行显示10个字段" },//每行显示10个字段
// ]);

const dataTypeList = ref([]);
const rangeChange = () => {
  if (currentItem.value.range) {
    currentItem.value.value = [null, null];
  } else {
    currentItem.value.value = null;
  }
};
const selectChange = () => {
  if (currentItem.value.type == "selectList") {
    currentItem.value.value = [];
  } else {
    currentItem.value.value = null;
  }
};
const isDate = (type) => {
  return ["date", "datetime", "month"].indexOf(type) != -1;
};
const isNubmer = (type) => {
  return ["decimal", "number", "int"].indexOf(type) != -1;
};
const reset = (action) => {
  dataTypeList.value = action == "search" ? searchDataType : editDataType;
};
defineExpose({ reset });
</script>
<style lang="less" scoped>
.custom-filter-name {
  height: 40px;
  background: #eee;
}

.custom-fields {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  box-sizing: content-box;
}

.custom-title {
  padding: 13px 10px;
  font-weight: bold;
  height: 45px;
  color: #000;
  border-bottom: 1px solid #eee;
}

.custom-form-title {
  padding: 0 10px;
  display: flex;
  align-items: center;

  .custom-form-title-input {
    margin-left: auto;
    font-weight: 500;

    button {
      margin-left: 10px;
    }
  }
}

.custom-content {
  flex: 1;
  height: 0;
  display: flex;

  .custom-fields {
    width: 220px;
  }

  .custom-form {
    position: relative;
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;

    .custom-form-content {
      flex: 1;
      height: 0;
      position: relative;
    }

    .custom-empty {
      color: #a39f9f;
      position: absolute;
      text-align: center;
      letter-spacing: 1px;
      z-index: 0;
      left: 0;
      right: 0;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 30px;
        color: #bebebe;
      }
    }

    // background: #bfbfbf;
  }
}

.custom-attr {
  width: 220px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #eee;
  box-sizing: content-box;
}

.draggable-container {
  min-height: 300px;
  display: inline-block;
  width: 100%;
}

.vol-custom-form-item {
  position: relative;
  cursor: move;
  padding: 18px 10px 10px 10px;
  text-align: left;
  float: left;
  margin-bottom: 0px;

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

.vol-custom-form-item.actived,
.vol-custom-form-item:hover {
  background: #f3faff;

  .el-icon-delete {
    display: inline-block;
  }
}

.attr-item {
  margin-bottom: 5px;

  .attr-item-title {
    font-size: 13px;
    color: #000;
    padding-bottom: 2px;
  }

  ::v-deep(.el-radio) {
    margin-right: 13px;

    .el-radio__label {
      padding-left: 5px;
    }
  }
}

.filter-bottom {
  display: flex;
  text-align: left;
  align-items: center;
}

.filter-left {
  // flex: 1;
  overflow: hidden;
}

.filter-add-btn {
  flex: 1;
}

.add-filter {
  font-weight: bolder;
  color: #000;
  margin-right: 30px;
}

.input-range {
  display: flex;
  display: flex;
  align-items: center;

  span {
    margin: 0 4px;
    color: #474646;
  }
}

.dic-ref ::v-deep(.layout-container) {
  display: none;
}
</style>
