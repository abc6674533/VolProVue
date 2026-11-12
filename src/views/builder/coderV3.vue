<template>
  <div class="coder-v3">
    <!-- 左边树结构 -->
    <div class="coder-left">
      <div class="coder-left-title">
        <i class="el-icon-receiving title-icon"></i> 代码生成配置
      </div>
      <el-scrollbar :width="1" class="coder-left-scrollbar">
        <el-tree ref="treeRef" highlight-current node-key="id" class="tree-contianer" :data="treeDataValue"
          :expand-on-click-node="false" :default-expanded-keys="defaultExpandedKeys" @node-click="nodeClick"
          icon="ArrowRight">
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="tree-content">
      <coder-content ref="contentRef" @loadTableAfter="loadTableAfter" :parent-data="data"></coder-content>
    </div>
  </div>
</template>

<script setup>
import coderContent from "./coderV3Content.vue";
const emit = defineEmits(["nodeClick"]);
import { ref, reactive, getCurrentInstance, nextTick, computed } from "vue";
const { proxy } = getCurrentInstance();
const contentRef = ref();
const data = ref([]);
const orginData = ref([]); //原始数据
const defaultProps = ref({
  children: "children",
  label: "name", //树形结构显示名称的字段
});
const treeRef = ref();
const defaultExpandedKeys = ref([]);

const treeDataValue = computed(() => {
  return data.value.filter((x) => {
    return x.value != -999;
  });
});

// 在树中递归查找节点
const findNodeInTree = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children?.length) {
      const found = findNodeInTree(node.children, id)
      if (found) return found
    }
  }
  return null
}

const loadTableAfter = (item) => {
  item.label = item.name
  item.value = item.id
  item.key = item.id
  if (!item.parentId) {
    orginData.value.push(item)
    data.value.push(item)
    return
  }

  if (!orginData.value.some(x => x.id == item.id)) {
    orginData.value.push(item)
    const parentId = item.parentId ?? item.pId ?? 0

    if (!parentId || parentId === 0) {
      // 根节点：插入到「无(创建目录)」之后
      const insertIdx = data.value.findIndex((x) => x.value === -999)
      data.value.splice(insertIdx >= 0 ? insertIdx + 1 : 0, 0, item)
    } else {
      const parent = findNodeInTree(data.value, parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(item)
      } else {
        data.value.push(item)
      }
    }
  }

  const nodes = proxy.base.getTreeAllParent(item.id, orginData.value)
  const parentIds = nodes.slice(0, -1).map((n) => n.id)
  defaultExpandedKeys.value = [...new Set([...defaultExpandedKeys.value, ...parentIds, item.id])]

  nextTick(() => {
    treeRef.value?.setCurrentKey(item.id)
  })
};

//节点点击事件
const nodeClick = (data) => {
  //左侧树点击事件
  let ids = [];
  //获取分类的子节点
  //左边树节点的甩有子节点，用于查询数据
  getAllChildrenId(data, ids);
  //获取所有的父节点
  //左侧树选中节点的所有父节点,用于新建时设置级联的默认值
  let nodes = proxy.base.getTreeAllParent(data.id, orginData.value);
  //获取节点的id
  nodes = nodes.map((m) => {
    return m.id;
  });
  contentRef.value.nodeClick(data.id);
  // emit("nodeClick", ids, nodes);
};
const getAllChildrenId = (data, ids) => {
  //获取分类的子节点
  ids.push(data.id);
  if (!data.children || !data.children.length) {
    return;
  }
  data.children.forEach((x) => {
    ids.push(x.id);
    getAllChildrenId(x, ids);
  });
};
// console.log(document.body.clientWidth, document.body.clientHeight);
if (document.body.clientWidth < 1500 || document.body.clientHeight < 700) {
  document.body.style = "zoom:0.9;";
}
//从商品MES_MaterialCatalogController加载左边tree数据
proxy.http.post("api/builder/GetTableTree").then((result) => {
  var treeData = JSON.parse(result.list);
  const nameSpace = JSON.parse(result.nameSpace).map((x) => {
    return {
      key: x,
      value: x,
    };
  });

  //记录原始数据
  orginData.value = treeData;
  //将返回的数据递归转换为tree结构，文档：http://v2.volcore.xyz/document/vueDev【数组对象转换为tree】
  data.value = proxy.base.convertTree(treeData, (node, data, isRoot) => {
    node.label = node.name;
    node.value = node.id;
    node.key = node.id;
  });

  data.value.unshift({
    parentId: null,
    value: -999,
    label: "无(创建目录)",
  });

  nextTick(() => {
    contentRef.value.initData(nameSpace, data.value, orginData.value);
  });
  proxy.base.setItem('del:coder:tree:data', (id) => {
    orginData.value = orginData.value.filter((x) => x.id != id)
    const visited = new Set()
    const removeFromTree = (nodes) => {
      if (!nodes?.length) return false
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (visited.has(node)) continue
        visited.add(node)
        if (node.id == id) {
          nodes.splice(i, 1)
          return true
        }
        if (node.children?.length && removeFromTree(node.children)) return true
      }
      return false
    }
    removeFromTree(data.value)
  })
});
</script>
<style lang="less" scoped>
@import "./style/coderV3.less";
</style>
<style lang="less">
.tree-contianer {

  /* 覆盖 el-tree 的默认样式 */
  .el-tree-node__content:hover {
    .el-button--text {
      color: #2F3133;
    }
  }

  .tree-node-opt {
    margin: 00010px;

    .el-button--text {
      color: #dddddd;
    }
  }

  .el-tree-node {
    position: relative;


    &::before {
      content: '';
      width: 1px;
      height: 100%;
      border-left: 1px solid #d9d9d9;
      position: absolute;
      left: -4px;
      top: -17px;
    }

    &::after {
      content: '';
      width: 20px;
      height: 0px;
      border-top: 1px solid #d9d9d9;
      position: absolute;
      top: 20px;
      left: -4px;
    }

    &:last-child:before {
      height: 38px;
    }

    .el-tree-node__children {
      padding-left: 16px;
    }

    .el-tree-node__expand-icon.is-leaf {
      display: none;
    }
  }

  &>.el-tree-node:before {
    border-left: none;
  }

  &>.el-tree-node:after {
    border-top: none;
  }
}
</style>