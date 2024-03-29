import { RouteRecordRaw } from 'vue-router'
import MainView from '@/vue-test/views/MainView.vue'
import { adminPermissions } from '@/vue-test/router/routes/AdminPermissions'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: MainView
  },
  ...adminPermissions
]

export { routes }