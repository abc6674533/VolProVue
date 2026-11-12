<template>
  <div class="home-content" data-v-7f6868a7="">
    <el-scrollbar style="height: 100%;">
      <div class="home-list">
        <div class="list-item" @click="itemClick(item, index)" v-for="(item, index) in list" :key="index">
          <div class="content">
            <div class="content-right">
              <div class="name">
                <!-- <i class="el-icon-warning-outline"></i> -->
                {{ item.name }}
              </div>
              <div class="data" data-v-7f2e9c68="">
                <!-- {{ item.desc }} -->
                <el-button type="primary" link> 发起流程</el-button>
              </div>
              <div class="f-icon"><el-icon>
                  <MessageBox />
                </el-icon></div>
            </div>

            <div class="mouse-enter-class"></div>
          </div>
          <div :class="[item.type == '审批' ? 'item-strengthen' : (item.type == '新增' ? 'item-new' : 'item-other')]">{{
            item.formType || '审批' }}</div>
        </div>
      </div>
    </el-scrollbar>
  </div>
  <vol-box :lazy="false" v-model="model" :title="currentItem.name" :width="width" :padding="5">
    <div>
      <vol-form ref="formRef" :load-key="false" :label-width="100" :formRules="formOptions" :formFields="formFields"
        :select2Count="10000"></vol-form>
    </div>
    <template #footer>
      <div style="text-align: center;"><el-button type="default" size="small" icon="Close" @click="model = false">{{
        $ts('关闭') }}</el-button>
        <el-button type="danger" size="small" icon="Check" @click="save">{{ $ts('提交') }}</el-button>
      </div>
    </template>
  </vol-box>
</template>
<script setup>
import {
  ref,
  getCurrentInstance,
  nextTick
} from 'vue';
const { proxy } = getCurrentInstance();

const formRef = ref();
const formOptions = ref([]);
const formFields = ref({})
const width = ref(600)
const model = ref(false);
const save = async () => {
  if (! await formRef.value.validate()) {
    return;
  }
  const options = JSON.parse(JSON.stringify(formOptions.value))
  options.flat().forEach(x => {
    if (x.data) {
      x.data = []
    }
  })

  const fields = {};
  Object.keys(formFields.value).map(key => {
    fields[key] = formFields.value[key];
    if (formOptions.value.flat().some(x => { return x.field == key && x.type == 'cascader' })) {
      fields[key] = fields[key][fields[key].length - 1]
    }
  })

  const url = `api/Sys_FormWorkFlow/submitWorkflow?id=${currentItem.formWorkFlow_Id}`
  const params = {
    FormWorkFlow_Id: currentItem.formWorkFlow_Id,
    FormData: JSON.stringify(fields),
    DetailOptions: JSON.stringify(options)
  }
  // console.log(params); return;
  proxy.http.post(url, params, true).then(result => {
    proxy.$message.success('提交成功')
    model.value = false;
  })
}
let currentItem = {}
const itemClick = (item) => {
  currentItem = item;
  const url = `api/Sys_FormWorkFlow/getData?id=${item.formWorkFlow_Id}`
  proxy.http.get(url).then(result => {
    result = JSON.parse(result.formOptions)
    const res = proxy.base.convertDataToFormOptions(result, 'Sys_FormWorkFlow')
    formFields.value = res.fields;
    formOptions.value = res.formOptions;
    width.value = res.width;
    if (width.value < 500) {
      width.value = 500
    }
    model.value = true;
    nextTick(() => {
      formRef.value.initSource(true);
    })
  })
}
const list = ref([])
proxy.http.get("api/Sys_FormWorkFlow/getFlowList").then(result => {
  list.value = result;
})
</script>
<style lang="less" scoped>
// @import './home/index.less';

.home-content {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #f3f7fb;

  .home-list {
    margin: 12px;
    display: grid;
    -moz-column-gap: 12px;
    column-gap: 12px;
    grid-template-columns: repeat(10, auto);
  }

  .list-item {
    position: relative;
    cursor: pointer;
    margin-bottom: 12px;
    transition: transform 0.8s;

    .content {
      position: relative;
      height: 100px;
      // padding-left: 40px;
      background: #ffffff;
      display: flex;
      align-items: center;
      transition: all 1.5s;
      border-radius: 5px;
      overflow: hidden;

      .content-right {
        color: #1d252f;
        padding: 0 20px;

        .el-icon-warning-outline {
          margin-right: 5px;
        }
      }

      .name {
        transition: transform .5s;
        color: #060606;
        font-size: 16px;
        font-weight: 400;
        padding-bottom: 5px;
      }

      .data {
        font-size: 12px;
        font-family: Source Han Sans CN, sans-serif;
        color: #6f6f6f;
        border: 1px solid #a3d0ff;
        border-radius: 15px;
        padding: 1px 4px;
      }
    }

    .mouse-enter-class {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 40px;
      border-bottom: 3px #0763ee solid;
      transition: 1s;
    }


  }
}

.list-item:hover {
  transform: scale(1.04);

  .content {
    background: #ecf5f9;

    .mouse-enter-class {
      width: 100%;
    }
  }
}

.home-list-content {
  margin: -12px 12px;
  background: #ffff;
  padding: 20px;
  display: flex;
  margin-bottom: 12px;
}

.contact {
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  margin-left: 24px;
  color: #8e8888;

  img {
    height: 15px;
    margin-bottom: -3px;
    margin-right: 5px;
  }
}

.item-strengthen,
.item-new,
.item-other {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  padding: 2px 10px;
  background: #eef9fe;
  border-bottom-left-radius: 6px;
  color: #87c9fe;
  border-top-right-radius: 5px;
}

.item-other {
  background: #e6f6fd;
  color: #2244ff;
}

.item-new {
  background: #e1fae2;
  color: #2ad431;
}

.f-icon {
  position: absolute;
  right: 10px;
  bottom: 2px;

  i {
    font-size: 44px;
    color: #f5f5f5;
  }
}
</style>