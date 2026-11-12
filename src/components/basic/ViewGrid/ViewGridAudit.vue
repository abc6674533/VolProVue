<template>
  <vol-box :footer="false" v-model="model" :width="width" :padding="0" :lazy="true" :title="isAnti ? '反审' : '审核'">
    <template #header>
      <!-- <div @click="showEditForm" class="btns" v-show="isCurrentUser && hasEditForm">
        <el-button link type="primary" @click="showEditForm"><i class="el-icon-edit"></i> {{ $ts('修改表单') }}</el-button>
      </div> -->
    </template>

    <div ref="auditContentRef" class="audit-model-content" style="max-height: 600px" :style="{
      height: (isAnti && !hasFlow) || logs.length ? 'auto' : height - 30 + 'px'
    }">
      <vol-title style="padding-left: 10px;color: #000;" icon="Edit" v-if="isForm || Object.keys(formData).length"
        :title="workName || '表单信息'"></vol-title>
      <div v-if="isForm">
        <ViewGridForm ref="gridFormRef"></ViewGridForm>
      </div>
      <el-descriptions v-else class="desc-top" :column="3" size="default" :border="true">
        <el-descriptions-item v-for="(data, key) in formData" :key="key" :span="data.formType == 'editor' ? 3 : 1">
          <template #label>
            <div class="cell-item">{{ $ts(data.name) }}</div>
          </template>
          <div class="form-file" v-if="data.formType == 'file' || data.formType == 'excel'">
            <a @click="fileClick(file)" v-for="(file, findex) in getFilePath(data.value)" :key="findex">{{ file.name
            }}</a>
          </div>

          <div class="form-img" v-else-if="data.formType == 'img'">
            <img @click="imgClick(file, data, findex)" v-for="(file, findex) in getFilePath(data.value)" :key="findex"
              :src="file.path + access_token" />
          </div>
          <div class="form-editor" v-else-if="data.formType == 'editor'" v-html="data.value"></div>
          <div v-else>
            {{ formatValue(data) }}
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <div class="audit-detail-table" v-if="formDetail.name && formDetail.data && formDetail.data.length">
        <div class="audit-detail-title">
          <vol-title style="color: #000;" :title="formDetail.name"></vol-title>
          <!-- {{ $ts(formDetail.name) }} -->
        </div>
        <table class="step-table">
          <thead>
            <tr>
              <td v-for="(itemDetail, key) in formDetail.data[0]" :key="key">
                {{ $ts(itemDetail.name) }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(itemDetail, aindex) in formDetail.data" :key="aindex">
              <td v-for="(data, key) in itemDetail" :key="key">
                <!-- {{data.value}} -->
                <div class="form-file" v-if="data.formType == 'file' || data.formType == 'excel'">
                  <a @click="fileClick(file)" v-for="(file, findex) in getFilePath(data.value)" :key="findex">{{
                    file.name
                  }}</a>
                </div>
                <div class="form-img" v-else-if="data.formType == 'img'">
                  <img @click="imgClick(file, data, findex)" v-for="(file, findex) in getFilePath(data.value)"
                    :key="findex" :src="file.path + access_token" />
                </div>
                <!-- <div v-else-if="data.formType == 'editor'" v-html="data.value"></div> -->
                <!-- <div v-else>
                  {{ data.value }}
                </div> -->
                <div v-else v-html="formatValue(data)"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <slot name="auditContent"></slot>
      <div class="audit-btn" v-show="hasFlow">
        <el-radio-group style="padding-left: 15px" v-model="activeName" class="ml-4">
          <el-radio label="audit" value="audit" size="large">{{ $ts('审核') }}</el-radio>
          <el-radio label="log" value="log" size="large">{{ $ts('审核记录') }}</el-radio>
        </el-radio-group>
        <el-button type="primary" v-show="activeName == 'log'" @click="exportPDF"
          style="margin-left: 30px; font-size: 15px" link icon="Sort">{{ $ts('导出PDF') }}</el-button>

        <el-button type="primary" v-for="(item, index) in linkMenu" :key="index" @click="linkMenuClick(item)"
          style="margin-left: 30px; font-size: 15px" link icon="Position">{{ $ts(item.btnName) }}</el-button>
      </div>
      <div v-show="activeName == 'audit' || !hasFlow" class="audit-content">
        <div class="fx-left" v-if="hasFlow">
          <!-- v-model:edit="editFormOptions"  -->
          <audit-list :workFlowSteps="workFlowSteps" :auditDic="auditDic"></audit-list>
        </div>
        <div class="fx-right" :style="{ width: !hasFlow ? '100%' : '420px' }"
          v-if="isCurrentUser || isAnti || !hasFlow">
          <div v-show="(!isView && !hasFlow) || hasFlow">
            <div v-show="isAnti && hasFlow" style="margin-bottom: 10px">
              <div><span class="item-require">*</span> {{ $ts('退回节点') }}</div>
              <el-select style="width: 100%" v-model="antiNodeValue" filterable :placeholder="$ts('请选择')">
                <el-option v-for="item in antiNodes" :key="item.key" :label="$ts(item.value)" :value="item.key">
                </el-option>
              </el-select>
            </div>
            <div v-if="!hasFlow && !isAnti">
              <el-alert :title="$tst('当前选中【{$ts}】条记录待审核..', rowLen)" type="success" :closable="false" />
            </div>
            <div v-if="!isAnti" class="rd">
              <span>{{ $ts('审批') }}：</span>
              <el-radio-group style="margin-left: 15px" v-model="auditParam.value">
                <el-radio v-for="item in auditParam.data" :key="item.value" :label="item.value" :value="item.value">
                  <span>{{ item.text }}</span>
                </el-radio>
              </el-radio-group>
            </div>

            <div class="rd" v-else>{{ $ts('审批意见') }}</div>

            <el-input style="padding-top: 3px" v-model="auditParam.reason" type="textarea"
              :autosize="{ minRows: 4, maxRows: 10 }" :placeholder="$ts('审批意见') + '...'"></el-input>
            <div v-if="attachInfo && attachInfo.allowUpload">
              <audit-attach ref="attachRef"></audit-attach>
            </div>
            <div class="btn">
              <el-button type="primary" @click="auditClick" icon="Check">{{
                $ts(isAnti ? '反审' : '审核')
              }}</el-button>

              <el-button @click="showEditForm" v-if="showEditBtn" type="danger" icon="Edit">{{ $ts('编辑表单')
              }}</el-button>

              <el-button type="default" @click="signClick" icon="Plus" v-if="isCurrentUser && !isAnti && hasFlow">{{
                $ts('加签') }}</el-button>
            </div>
          </div>
          <slot name="auditButton"></slot>
          <!-- v-if="!hasFlow && isAnti" -->
          <div v-if="!hasFlow">
            <div>{{ $ts('审核记录') }}</div>
            <table class="step-table anti-table">
              <thead>
                <tr>
                  <td class="step-table-user">{{ $ts('审批人') }}</td>
                  <td class="step-table-status">{{ $ts('状态') }}</td>
                  <td class="step-table-date">{{ $ts('审批时间') }}</td>
                  <td>{{ $ts('审批意见') }}</td>
                </tr>
              </thead>
              <tbody>
                <tr v-show="logs.length" v-for="(data, aindex) in logs" :key="aindex">
                  <td>
                    {{ data.auditor }}
                  </td>
                  <td>
                    {{ data.auditStatus ? getAuditStatus(data.auditStatus) : '' }}
                  </td>
                  <td class="step-table-date">
                    {{ data.createDate || '' }}
                  </td>
                  <td>
                    {{ data.remark }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-show="activeName == 'log'">
        <vol-table :tableData="tableData" :columns="columns" :max-height="400" :pagination-hide="true" :load-key="false"
          :text-inline="false" :ck="false"></vol-table>
      </div>
    </div>
  </vol-box>
  <AuditEditForm @saveEditForm="saveEditForm" ref="editForm"></AuditEditForm>
  <!-- 加签 -->
  <AuditSign @signAfter="signAfter" ref="signRef"></AuditSign>
  <VolImageViewer ref="viewer"></VolImageViewer>

</template>
<script setup>
// import VolImageViewer from '@/components/basic/VolImageViewer.vue'
import AuditEditForm from './ViewGridAuditEditForm.vue'
import AuditSign from './ViewGridAuditSign.vue'
import AuditAttach from './ViewGridAuditAttach.vue'
import AuditList from './ViewGridAuditNodeList.vue'
import ViewGridForm from './ViewGridForm.vue'
import { ref, reactive, getCurrentInstance, computed, nextTick } from 'vue'
import html2canvas from 'html2canvas'
import { defineAsyncComponent } from 'vue'
import jsPDF from 'jspdf'

const VolImageViewer = defineAsyncComponent(() => import('@/components/basic/VolImageViewer.vue'))

const props = defineProps({
  option: {
    //生成vue文件的table参数
    type: Object,
    default: () => ({
      key: '',
      cnName: '',
      name: '',
      url: ''
    })
  }
})

const emit = defineEmits(['auditClick', 'auditAfter', 'antiAfter', 'signAfter', 'parentCall', 'flowLoadAfter'])

const auditContentRef = ref(null)

const attachInfo = ref({
  allowUpload: null,
  attachQty: null,
  attachType: null
})

const linkMenu = ref([]);
const height = ref(500)
const width = ref(920)
const model = ref(false)
const workFlowSteps = reactive([])

const antiNodeValue = ref(null)
const hasFlow = ref(false)

//编辑表单配置
const editFormOptions = ref();

const formData = ref({})

const formDetail = ref({ name: '', data: [] })

const auditParam = reactive({
  //审核对象
  rows: 0, //当前选中审核的行数
  model: false, //审核弹出框
  value: -1, //审核结果
  reason: '', //审核原因
  //审核选项(main.js里面可以添加其他选项)
  data: []
})
const { proxy } = getCurrentInstance()
auditParam.data = proxy.$global.audit.data
const tableData = reactive([])
const columns = reactive([
  { title: '节点', field: 'stepName', width: 100 },
  { title: '审批人', field: 'auditor', width: 70 },
  {
    title: '审批结果',
    field: 'auditStatus',
    width: 70,
    bind: { data: [] },
    normal: true
  },
  { title: '审批附件', field: 'attachFile', width: 80, type: 'file' },
  // <td>{{ data.attachFile }}</td>
  { title: '审批时间', field: 'auditDate', width: 140 },
  { title: '审批意见', field: 'remark', width: 150 }
])

const hasEditForm = ref(false)
const isCurrentUser = ref(false)
const activeName = ref('audit')

const auditDic = reactive([])
const getAuditStatus = (key) => {
  return (
    auditDic.find((x) => {
      return x.key === key + ''
    }) || { value: key }
  ).value
}

const gridFormRef = ref()
const rowLen = ref(0)
const logs = ref([])
let currentRows = []

const showEditBtn = ref(false)
const attachRef = ref()

let _option
let tableKey
let currentTable
const workName = ref()
const getAuditInfo = (option, view) => {
  _option = option
  const table = option.table //props.option.url.replaceAll('/', '');
  currentTable = table
  //console.log('currentTable',currentTable)
  const url = formUrl || `api/Sys_WorkFlow/getSteps?tableName=${table}&isAnti=${isAnti.value}`
  //  let ids = currentRows.map(x => { return x[props.option.key] });
  let ids = currentRows.map((x) => {
    return x[option.key]
  })
  showEditBtn.value = false;
  // ['498043c1-fbd0-4a35-a870-523823912a9b']
  proxy.http.post(url, ids, true).then((result) => {
    linkMenu.value = [];
    if (!result.status) {
      proxy.$message.error(result.message)
      return
    }
    if (!auditDic.length && result.auditDic) {
      auditDic.push(...(result.auditDic || []))
      columns.forEach((item) => {
        if (item.field == 'auditStatus') {
          item.bind.data = auditDic
        }
      })
    }
    hasFlow.value = !!(result.list || []).length

    if (!hasFlow.value) {
      let auditStatus = Object.keys(currentRows[0]).find((x) => {
        return x.toLowerCase() === 'auditstatus'
      })

      let checkStatus = currentRows.every((x) => {
        return proxy.$global.audit.status.some((c) => {
          return c + '' === x[auditStatus] + '' || !x[auditStatus]
        })
      })
      if (!isView.value && !checkStatus && !isAnti.value) {
        proxy.$message.error('只能选择待审批或审核中的数据')
        return
      }
      formDetail.value = { name: '', data: [] }
      formData.value = {}
      rowLen.value = currentRows.length
      model.value = true
      width.value = isAnti ? 550 : 450
      height.value = 350
      // isCurrentUser.value = true;
      logs.value = result.logs || []
      //没有审批流程的数据只显示
      return
    }
    workName.value = result.workName || ''
    model.value = true
    width.value = 920
    height.value = document.body.clientHeight * 0.8
    if (result.form?.detail?.data?.length) {
      let wd = Object.keys(result.form.detail.data[0]).length * 100
      const bodyWd = document.body.clientWidth * 0.80
      // console.log(wd)
      if (wd > bodyWd) {
        wd = bodyWd
      } else if (wd <= 920) {
        wd = 920
      }
      width.value = wd;
    }

    tableKey = result.form.key
    isCurrentUser.value = result.list.some((x) => {
      return x.isCurrentUser
    })
    workFlowSteps.length = 0
    workFlowSteps.push(...result.list)
    tableData.length = 0
    tableData.push(...result.logs)

    let isCurrentNode = result.list?.some(x => { return x.isCurrentUser && x.isCurrent })
    //编辑表单
    editFormOptions.value = result.editForm
    if (editFormOptions.value && isCurrentNode && editFormOptions.value != '{}') {
      showEditBtn.value = true;
    }

    if (!result.form.data) {
      result.form.data = {}
    }

    attachInfo.value = result.attachInfo
    nextTick(() => {
      attachRef.value?.show(attachInfo.value)
    })



    emit('flowLoadAfter', result.form, result)
    //表单流程
    if (isForm.value) {
      nextTick(() => {
        gridFormRef.value.open(result.form.options, result.form.data, table)
      })
    } else {
      formData.value = result.form.data
      formDetail.value = result.form.detail || { name: '', data: [] }
      try {
        hasEditForm.value = Object.keys(result.form.data).some((k) => {
          return result.form.data[k].isEdit
        })
      } catch (error) {
        console.log(error)
      }
    }


    if (result.linkMenu && isCurrentNode) {
      try {
        linkMenu.value = JSON.parse(result.linkMenu)
      } catch (error) {
        console.log('解析跳转按钮异常', error)
      }
    }
    // formData.push(...(result.form.data || []));
  })
}
//

const isFlow = ref(false)
let currentOption = {}
const isAnti = ref(false)
//2023.11.10增加获取指定审批流程的表名
//isAnti反审
const isView = ref(false)

const auditClick = () => {
  if (!isAnti.value && auditParam.value == -1) {
    proxy.$message.error('请选择审批项')
    return
  }
  if (hasFlow.value && isAnti.value && !antiNodeValue.value) {
    proxy.$message.error('请选择退回节点')
    return
  }
  const attachFile = attachRef.value?.getFile()
  if (!isFlow.value && !isAnti.value) {
    emit('auditClick', auditParam, currentRows, attachFile, (result) => {
      if (result.status) {
        model.value = false
        tableData.length = 0
      }
    })
    return
  }
  //我的流程中点击审批
  //保存审核
  let keys = currentRows.map((x) => {
    return x[currentOption.key]
  })
  const mh = isAnti.value ? 'antiAudit' : 'audit'

  let url
  let params
  //反审
  if (isAnti.value) {
    url = `api/${currentOption.table}/antiAudit`
    params = {
      key: hasFlow.value ? keys[0] : keys.join(','),
      isFlow: hasFlow.value,
      auditReason: auditParam.reason,
      stepId: antiNodeValue.value
    }
  } else if (auditUrl) {
    url = auditUrl
    params = {
      ids: keys,
      isFlow: hasFlow.value,
      auditReason: auditParam.reason,
      attach: attachFile,
      //  stepId: antiNodeValue.value
    }
  } else {
    url = `api/${currentOption.table}/${mh}?auditReason=${auditParam.reason}&auditStatus=${auditParam.value < 0 ? 0 : auditParam.value
      }`
    if (attachFile) {
      url += '&attach=' + attachFile
    }
    params = keys
  }
  // console.log(url);
  // return;

  proxy.http.post(url, params, '审核中....').then((x) => {
    if (!x.status) {
      proxy.$message.error(x.message)
      return
    }
    model.value = false
    proxy.$parent.search ? proxy.$parent.search(null, false) : proxy.$parent?.$parent?.search?.(null, false)
    proxy.$message.success(x.message)
    emit(isAnti.value ? 'antiAfter' : 'auditAfter', x, auditParam, currentRows, attachFile)
  })
}
const isForm = ref(false)
let formUrl = '';
let auditUrl = '';

const open = (rows, flow, table, anti, view) => {
  openForm({ rows, flow, table, anti, view })
}
//表单审批
const openForm = (ops) => {
  const { rows, flow, table, tableKey, anti, view, url } = ops
  formUrl = url
  auditUrl = ops.auditUrl;
  isForm.value = !!url;
  antiNodeValue.value = null
  isView.value = !!view
  isCurrentUser.value = false
  logs.value.length = 0
  isAnti.value = typeof anti == 'boolean' && anti
  isFlow.value = !!flow
  currentRows = rows
  activeName.value = 'audit'
  auditParam.reason = ''
  auditParam.value = -1

  if (flow) {
    currentOption = {
      table: table || rows[0].WorkTable,
      key: tableKey || 'WorkTableKey' // rows[0].WorkTableKey
    }
  } else {
    currentOption = {
      table: table || props.option.url.replaceAll('/', ''),
      key: props.option.key
    }
  }
  getAuditInfo(currentOption)
}

const getFilePath = (pathSring) => {
  if (!pathSring) return []
  let filePath = pathSring.replace(/\\/g, '/').split(',')
  let fileInfo = []
  for (let index = 0; index < filePath.length; index++) {
    let path = filePath[index]
    if (path.indexOf('.') != -1) {
      let splitFile = path.split('/')
      if (splitFile.length > 0) {
        fileInfo.push({
          name: splitFile[splitFile.length - 1],
          path: proxy.base.isUrl(path)
            ? path
            : (proxy.$global.oss?.url || proxy.http.ipAddress) + path
        })
      }
    }
  }
  return fileInfo
}

const access_token = ref('')
const tk = (proxy.$store.getters.getUserInfo() || { accessToken: '' }).accessToken
if (tk) {
  access_token.value = '?access_token=' + tk
}
const viewer = ref(null)

const fileClick = (file) => {
  proxy.base.dowloadFile(
    file.path,
    file.name + access_token.value,
    {
      Authorization: proxy.$store.getters.getToken()
    },
    proxy.http.ipAddress
  )
}

const imgClick = (file, data, index) => {
  let fileInfo = getFilePath(data.value)
  const imgs = fileInfo.map((x) => {
    return x.path + proxy.access_token
  })
  viewer.value.show(imgs, index)
}

const editForm = ref(null)
const showEditForm = () => {
  editForm.value.open(editFormOptions.value,
    isFlow.value
      ? null : currentRows[0],
    tableKey || currentOption.key,
    currentRows[0][currentOption.key],
    currentTable || props.option.url.replaceAll('/', ''))
}

const saveEditForm = (formFields, callback) => {
  getAuditInfo(_option)
  try {
    proxy.$parent?.search;
    proxy.$parent?.$parent?.search()
  } catch (error) {

  }
}

const antiNodes = computed(() => {
  return workFlowSteps
    .filter((c) => {
      return c.auditStatus
    })
    .map((c) => {
      return {
        key: c.stepId,
        value: c.stepName
      }
    })
})

const signRef = ref(null)
const signClick = () => {
  signRef.value.open(workFlowSteps, currentRows[0])
}

//加签后
const signAfter = () => {
  //emit("signAfter");
  proxy.$parent.search ? proxy.$parent.search() : proxy.$parent.$parent.search()
  model.value = false
}

const exportPDF = async () => {
  const element = auditContentRef.value
  // 保存原始样式
  const originalStyles = {
    height: element.style.height,
    overflow: element.style.overflow
  }
  // 临时移除滚动条并展开内容
  element.style.height = 'auto'
  element.style.overflow = 'visible'

  const canvas = await html2canvas(auditContentRef.value)
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF()
  const imgProps = pdf.getImageProperties(imgData)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save(proxy.$ts('审核信息') + '.pdf')
  // 还原样式
  element.style.height = originalStyles.height
  element.style.overflow = originalStyles.overflow
}

const formatValue = (data) => {
  if (data.formType == 'decimal' && data.value) {
    return (data.value * 1.0).toFixed(4) * 1.0
  }
  return data.value
}


const linkMenuClick = (item) => {
  if (!item.path) {
    return proxy.$message.error('未获取到菜单配置,请重新配置流程跳转的菜单')
  }
  const data = proxy.$store.getters.getPermission().find(x => { return x.path == item.path });
  if (!data) {
    return proxy.$message.error('未获取到跳转菜单,请检查当前帐号是否有菜单页面权限')
  }
  proxy.$tabs.open({
    path: item.path,
    text: data.name,
    query: { flowLink: 1, id: currentRows[0][currentOption.key] }
  })
  // proxy.$store.getters.getPermission().filter(x => { return (x.enable || !x.enable) && x.id !== '0' })
}

defineExpose({ open, openForm })
</script>

<style lang="less" scoped>
.audit-model-content {
  padding: 10px;
}

.audit-content {
  // background: #f9f9f9;
  padding: 0 10px 10px 10px;
  border-radius: 4px;
  display: flex;

  .fx-left {
    flex: 1;
    width: 0;

    .rd {
      display: flex;
      align-items: baseline;
    }
  }

  .fx-right {
    // width: 400px;

    .btn {
      margin-top: 10px;
      text-align: center;
    }
  }
}

.cell-item {
  font-weight: 500;
}

.desc-top {
  padding: 5px 10px 0 10px;
}

.step-item-ad {
  * {
    color: #9f9898 !important;
  }
}


.step-table-text {
  font-size: 13px;
  padding-top: 6px;
  color: #585858 !important;
}

.step-item-gray {
  color: #9f9f9f;

  div,
  .left-date {
    color: #b0b0b0;
  }
}

.audit-detail-table {
  padding: 5px 10px 0 10px;

  table {
    width: 100%;
  }

  .audit-detail-title {
    font-weight: bold;
    margin-top: 7px;
    padding-bottom: 5px;
  }

  table td {
    padding: 10px 8px;
    font-size: 14px;
  }
}

.anti-table {
  width: 100%;
  margin-top: 10px;

  td {
    padding: 9px 7px;
    font-size: 14px;
  }

  .step-table-date {
    width: 150px;
  }

  .step-table-user {
    width: 100px;
  }
}


.step-table {
  border-collapse: collapse;
  border-spacing: 0;

  tr:first-child {
    background: #f5f7fa;
  }

  tr:last-child {
    border-bottom: none;
  }

  td {
    padding: 8px 8px;
    color: #444242;
    font-size: 12px;
    border-style: solid;
    border-width: 1px;
    border-color: #ebeef5;
  }

  .step-table-user {
    width: 80px;
  }

  .step-table-status {
    width: 80px;
  }

  .step-table-date {
    width: 130px;
  }

  thead td {
    color: #000 !important;
    font-weight: bold;
    font-size: 13px !important;
  }
}

.form-img img,
.form-file a {
  color: #0101ee;
  cursor: pointer;
  margin-right: 10px;
}

.form-img img:last-child,
.form-file a:last-child {
  margin-right: 0px;
}

.form-img img {
  width: 45px;
  height: 45px;
  border-radius: 4px;
  object-fit: cover;
}

.form-editor {
  word-wrap: break-word;
  word-break: break-all;
}

.btns {
  position: absolute;
  top: 0;
  right: 89px;

  button {
    font-size: 13px !important;
  }
}

.item-require {
  color: #b70404;
}

.audit-btn {
  display: flex;

  button {
    font-size: 13px !important;
  }
}
</style>
