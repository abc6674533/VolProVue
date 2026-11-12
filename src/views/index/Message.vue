<template>
  <div>
    <el-dropdown trigger="hover">
      <div class="notification">
        <el-badge :value="msgCount" :max="99" :is-dot="msgCount <= 0" class="item" :offset="[3, -3]" :badge-style="msgCount > 0
          ? 'font-size: 10px; width: 18px; height: 18px;background-color: #ff1b0b;'
          : ''
          ">
          <el-icon size="15">
            <Bell />
          </el-icon>
        </el-badge>
      </div>
      <template #dropdown>
        <el-tabs v-model="activeName" class="msg-tabs" @tab-click="handleClick">
          <el-tab-pane name="msg">
            <template #label>
              <span class="custom-tabs-label">{{ $ts('消息通知') }}</span>
            </template>
            <message-content :list="list" @itemClick="itemClick"></message-content>
          </el-tab-pane>
          <el-tab-pane :label="$ts('审批流程')" name="audit">
            <message-content :list="auditList" @itemClick="itemClick"></message-content>
          </el-tab-pane>
          <el-tab-pane :label="$ts('未读消息')" name="unread">
            <template #label>
              <span class="custom-tabs-label">
                <el-badge :value="msgCount" :show-zero="false" :offset="[-2, 4]"
                  badge-style="background-color: #ff1b0b;width: 18px; ">
                  {{ $ts('未读消息') }} <el-icon size="15"> </el-icon>
                </el-badge>
              </span>
            </template>
            <message-content :show-status="false" :list="unreadList" @itemClick="itemClick"></message-content>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dropdown>
    <ViewGridAudit ref="auditRef"></ViewGridAudit>
    <vol-box :lazy="true" v-model="model" title="消息" :width="700" :padding="10">
      <div v-html="htmlContent"></div>
      <template #footer>
        <div style="text-align: center">
          <el-button type="default" size="small" icon="Close" @click="model = false">{{
            $ts('关闭')
          }}</el-button>
        </div>
      </template>
    </vol-box>
  </div>
</template>

<script setup>
import MessageContent from './MessageContent.vue'
import ViewGridAudit from '@/components/basic/ViewGrid/ViewGridAudit.vue'
import { reactive, ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const htmlContent = ref('')
const title = ref('')
const model = ref(false)
const activeName = ref('msg')
const msgCount = ref(0)
const list = ref([])
const auditCount = ref(0)
const auditList = ref([])
const unreadList = ref([])

proxy.base.setItem('pushMessage', (item) => {
  msgCount.value = msgCount.value + 1
  // list.
  getList()
})

//获取所有消息
const getList = () => {
  proxy.http.post('api/Sys_Notification/getList', {}, false).then((res) => {
    list.value = res.list
    msgCount.value = res.total
    auditCount.value = res.auditTotal || 0
  })
}
getList()
const handleClick = (item) => {
  if (item.paneName == 'audit') {
    if (auditList.value.length) {
      return
    }
    proxy.http.post('api/Sys_Notification/getAuditList', {}, false).then((res) => {
      auditList.value = res.list
    })
  } else if (item.paneName == 'unread') {
    if (unreadList.value.length) {
      return
    }
    proxy.http.post('api/Sys_Notification/getUnreadList', {}, false).then((res) => {
      unreadList.value = res.list
    })
  }
}

const showAudit = (item, isNotify = true) => {
  if (isNotify) {
    item.WorkTable = item.tableName
    item.WorkTableKey = item.tableKey
  }
  auditRef.value.open([item], isNotify)
}

const getRouteData = (str) => {
  // 分割路径和查询参数
  const [path, queryStr] = str.split('?');
  const query = {};

  // 解析查询参数
  if (queryStr) {
    queryStr.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      query[key] = value !== undefined ? value : ''; // 处理没有值的情况
    });
  }

  return { path, query };
}
const auditRef = ref()

const itemClick = (item, isRead) => {
  //item.linkUrl='/ERP_Suppliers/edit?id=e5f6a7b8-c9d0-8e9f-3a4b-1c0d9e8f7a6b'
  //notificationTitle
  if (item.linkUrl?.startsWith('/')) {
    const routedata = getRouteData(item.linkUrl)
    routedata.title = item.notificationTitle;
    proxy.$tabs.open(routedata)
    return;
  }
  const isAudit = (item.notificationType == '审批' || item.notificationType == '抄送')
  if (!isRead) {
    msgCount.value = msgCount.value - 1
    if (msgCount.value < 0) {
      msgCount.value = 0
    }
    if (isAudit) {
      auditCount.value = auditCount - 1
      if (auditCount.value < 0) {
        auditCount.value = 0
      }
    }
  }
  if (item.LinkUrl) {
    window.open(item.LinkUrl, '_blank')
    return
  }
  //审批跳转
  if (isAudit) {
    showAudit(item)
    // proxy.$tabs.open({ text: '我的审批', path: '/Sys_WorkFlowTable' })
    return
  }

  proxy.base.setItem('showAudit', showAudit)


  if (item.notificationType == '通知' && item.notificationContent) {
    model.value = true
    htmlContent.value = item.notificationContent
    return
  }
}
//缓存全局审批弹出框(调用方式):proxy.base.getItem('showAuditModel')(row,true)
//isNotify=true：传Sys_NotificationLog表数据
//isNotify=false：传Sys_Workflowtable表数据
proxy.base.setItem('showAuditModel', (row, isNotify = true) => {
  if (!row) {
    proxy.$message.error(proxy.$ts('请传入要审批的行数据'))
    return
  }
  if (!Array.isArray(row)) {
    row = [row];
  }
  if (isNotify) {
    row[0].WorkTable = item.tableName
    row[0].WorkTableKey = item.tableKey
  }
  auditRef.value.open(row, isNotify)
})
</script>
<style scoped lang="less">
.notification {
  outline: none;
  color: #000;
}

.msg-tabs {
  width: 300px;
}

::v-deep(.el-tabs__header) {
  margin: 0;
}

::v-deep(.el-tabs__content) {
  min-height: 200px;
  background: #fafafa;
}

::v-deep(.el-tabs__nav) {
  width: 100%;
  padding: 0 10px;
}

::v-deep(.el-tabs__item) {
  padding: 0 6px;
  flex: 1;
}
</style>
