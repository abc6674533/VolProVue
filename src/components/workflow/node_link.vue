<template>
    <vol-box :lazy="true" v-model="model" title="页面跳转" :width="500" :padding="15" :onModelClose="onModelClose">
        <div style="height: 300px">
            <div style="text-align: left; margin-bottom: 15px" v-show="!list.length">
                <el-button @click="addClick" type="primary" plain>
                    <el-icon>
                        <Plus />
                    </el-icon>{{ $ts("添加") }}</el-button>
            </div>
            <div class="fl-link-item" v-for="(item, index) in list" :key="index">
                <div style="width: 300px;">
                    <el-tree-select :placeholder="$ts('跳转菜单')" v-model="item.id" :data="menu" :multiple="false"
                        :render-after-expand="false" :show-checkbox="true" :check-strictly="true" check-on-click-node
                        node-key="key" :props="{ label: 'label' }">
                        <template #default="{ data }">
                            {{ $ts(data.label) }}</template>
                    </el-tree-select>
                </div>
                <div style="margin: 0 10px">
                    <el-input v-model="item.btnName" :placeholder="$ts('跳转按钮名称')" />
                </div>
                <el-button @click="delClick(index)" link type="danger">
                    <el-icon>
                        <Delete />
                    </el-icon>{{ $ts("删除") }}</el-button>
                <el-button @click="addClick" link type="primary">
                    <el-icon>
                        <Plus />
                    </el-icon>{{ $ts("添加") }}</el-button>
            </div>
        </div>
        <template #footer>
            <div style="text-align: center">
                <el-button type="default" size="small" icon="Close" @click="closeModel">关闭</el-button>
                <el-button type="primary" size="small" icon="Check"  @click="save">确定</el-button>
            </div>
        </template>
    </vol-box>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const emit = defineEmits(["linkSave"])
const model = ref(false);
const onModelClose = () => {
   // proxy.$message.success("弹出框右上角点击x关闭事件");
};
const closeModel = () => {
    model.value = false;
};
const open = (linkVal) => {
    if (!linkVal) {
        linkVal = [];
    }
    if (typeof linkVal == 'string') {
        try {
            linkVal = JSON.parse(linkVal)
        } catch (error) {
            console.log(error)
        }
    }
    list.value = linkVal;
    model.value = true;
};

const menu = ref([])
 let source =[];
if (!menu.value.length) {
    // console.log(proxy.$store.getters.getPermission())
     source = proxy.$store.getters.getPermission().filter(x => { return (x.enable || !x.enable) && x.id !== '0' }).map(x => {
        return {
            id: x.id,
            key: x.id,
            name: x.name,
            parentId: x.pid,
            //linkType:x.linkType,
            path: x.path
        }
    })
    // console.log(source)
    menu.value = proxy.base.convertTree(source, (node, data, isRoot) => {
        //添加一些别的属性
        node.value = node.id;
        node.label = node.name;
        node.text = node.name;
    });

}



const delClick = (index) => {
    list.value.splice(index, 1);
};
const addClick = () => {
    list.value.push({ path: "", btnName: "" });
};

const list = ref([{}]);

const save = () => {
    if (list.value.some(x => { return !x.id || !x.btnName })) {
        proxy.$message.error('请选择跳转菜单与输入跳转按钮名称')
        return;
    }
    model.value = false;
    list.value.forEach(x=>{
        x.path=(source.find(c=>{return c.id+''===x.id+''})||{path:''}).path
    })

    emit('linkSave', list.value)

}

defineExpose({
    open,
});
</script>
<style scoped>
.fl-link-item {
    margin-bottom: 10px;
    display: flex;
}
</style>
