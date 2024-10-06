import type { RouteRecordRaw } from 'vue-router'
import BootFrame from 'src/frame/BootFrame.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'boot',
    component: BootFrame,
  },
]
