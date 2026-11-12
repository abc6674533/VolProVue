<template>
  <el-scrollbar :max-height="450">
    <div class="msg-item" @click="itemClick(item)"
      v-for="(item, index) in list" :key="index">
      <div class="title">
        <img class="img" :src="getImg(item)" /> {{ item.notificationTitle }}
      </div>
      <div class="desc" v-html="item.notificationContent"></div>
      <div class="bottom">
        <div class="tag">
          <el-tag :type="getTag(item)" size="small">{{
            item.notificationType || '系统'
          }}</el-tag>
        </div>
        <div class="tag">{{ item.creator || '' }}</div>
        <div class="date">{{ item.createDate || '' }}</div>
      </div>
      <div v-if="showStatus" :class="[ item.isRead == 1?'item-read':'item-unread' ]">
        {{$ts(item.isRead?'已读':'未读')}}
      </div>
    </div>
    <vol-empty v-if="!list.length"></vol-empty>
  </el-scrollbar>
</template>
<script setup>
import VolEmpty from '@/components/basic/VolEmpty.vue'
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return []
    }
  },
  showStatus:{
    type:Boolean,
    default:true
  }
})
const icon = { 消息: "msg", 审批: "flow", 抄送: "cc" }

const getImg = (item) => {
  let val = icon[item.notificationType] || 'msg';
  return '/static/icon/' + val + '.png';

}

const emit = defineEmits(['itemClick'])
const itemClick = (item) => {
  emit('itemClick', item, item.isRead)
  if (item.isRead) {
    return
  }
  item.isRead = 1
  const url = 'api/Sys_Notification/read?id=' + item.id
  proxy.http.get(url, {}, false).then((x) => { })
}

const getTag = (item) => {
  if (item.notificationType == '审批') {
    return 'success'
  }
  if (item.notificationType == '抄送') {
    return 'warning'
  }
  return 'primary'
  // item.notificationType == '审批' ? 'success' : item.tag"
}
</script>
<style scoped lang="less">
.msg-item {
  //border-bottom: 1px solid #eee;
  background: #ffffff;
  margin: 7px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  position: relative;

  .title {
    font-weight: bolder;
    font-size: 13px;
    color: #000;
    align-items: center;
    display: flex;

    .img {
      margin-right: 5px;
      height: 25px;
      width: 25px;
    }
  }

  .desc {
    margin-top: 5px;
    margin-bottom: 5px;
    line-height: 1.3;
    font-size: 12px;
    color: #545353;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;

    ::v-deep(> p:first-child) {
      margin: 0;
    }
  }

  .bottom {
    display: flex;
    margin-top: 5px;
    font-size: 12px;
    color: #9f9b9b;
  }

  .tag {
    flex: 1;
    padding-right: 5px;
  }
}

// .item-read {

//   .desc,
//   .title {
//     color: #6e6e6e;
//   }
// }

.msg-item:hover {
  cursor: pointer;
  background: #f4f4f4;
}
.item-read,.item-unread{
    position: absolute;
    right: 4px;
    top: -2px;
    font-size: 11px;
}
.item-read{
  color: #8d8c8c;
}
.item-unread{
  color: #f81515;
}
</style>
