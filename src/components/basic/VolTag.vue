<template>
    <span :class="['tag', `tag-${color}`]" :style="style">
        <slot></slot>
    </span>
</template>

<script setup>
//blue、green、gray、orange、red、purple、teal、yellow、pink、brown、indigo、cyan、magenta、lime、emerald、amber、violet、rose、slate、zinc
const props = defineProps({
    color: {
        type: String,
        default: 'gray'
    },
    style: {
        type: Object,
        default: () => ({})
    }
});
</script>

<style scoped>
.tag {
    display: inline-block;
    padding: 2px 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
}

.tag-blue {
    background-color: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-8);
    color: var(--el-color-primary);
}

.tag-green {
    background-color: var(--el-color-success-light-9);
    color: var(--el-color-success);
    border-color: var(--el-color-success-light-8);
}

.tag-gray {
    background-color: rgba(184, 184, 184, 0.2);
    color: #777;
    border-color: #d9d9d9;
}

.tag-orange {
    background-color: rgba(255, 187, 120, 0.2);
    color: #f59e0b;
    border-color: #ffd699;
}

.tag-red {
    background-color: rgba(255, 175, 175, 0.2);
    color: #ef4444;
    border-color: #fecaca;
}

.tag-purple {
    background-color: rgba(217, 174, 238, 0.2);
    color: #9333ea;
    border-color: #e9d5ff;
}

.tag-teal {
    background-color: rgba(125, 211, 202, 0.2);
    color: #0d9488;
    border-color: #a7f3d0;
}

.tag-yellow {
    background-color: rgba(255, 242, 170, 0.2);
    color: #eab308;
    border-color: #fef3c7;
}

.tag-pink {
    background-color: rgba(255, 192, 203, 0.2);
    color: #ec4899;
    border-color: #fbcfe8;
}

.tag-brown {
    background-color: rgba(219, 169, 136, 0.2);
    color: #9f7655;
    border-color: #f5d7bb;
}

.tag-indigo {
    background-color: rgba(168, 185, 255, 0.2);
    color: #4f46e5;
    border-color: #c7d2fe;
}

.tag-cyan {
    background-color: rgba(175, 238, 238, 0.2);
    color: #0d9488;
    border-color: #b6effb;
}

.tag-magenta {
    background-color: rgba(255, 175, 255, 0.2);
    color: #c026d3;
    border-color: #f0abfc;
}

.tag-lime {
    background-color: rgba(200, 255, 175, 0.2);
    color: #4d7c0f;
    border-color: #dcfce7;
}

.tag-emerald {
    background-color: rgba(167, 243, 208, 0.2);
    color: #059669;
    border-color: #a7f3d0;
}

.tag-amber {
    background-color: rgba(251, 191, 36, 0.2);
    color: #92400e;
    border-color: #fde68a;
}

.tag-violet {
    background-color: rgba(221, 214, 254, 0.2);
    color: #7e22ce;
    border-color: #ddd6fe;
}

.tag-rose {
    background-color: rgba(254, 226, 226, 0.2);
    color: #e11d48;
    border-color: #fee2e2;
}

.tag-slate {
    background-color: rgba(226, 232, 240, 0.2);
    color: #334155;
    border-color: #e2e8f0;
}

.tag-zinc {
    background-color: rgba(228, 228, 231, 0.2);
    color: #52525b;
    border-color: #e4e4e7;
}
</style>
