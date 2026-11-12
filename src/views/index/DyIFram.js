import { ref, getCurrentInstance, nextTick, computed, defineAsyncComponent } from 'vue'

export default{
    iframes:defineAsyncComponent(() => import('./IFrames.vue'))
}