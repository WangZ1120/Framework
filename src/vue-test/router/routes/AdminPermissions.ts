import { RouteRecordRaw } from 'vue-router'

export const adminPermissions: Array<RouteRecordRaw> = [
  {
    path: '/admin/account',
    name: 'AdminAccount',
    component: () => import('../../views/admin-permissions/account/AdminAccount.vue')
  },
  {
    path: '/admin/account/edit',
    name: 'AdminAccountEdit',
    component: () => import('../../views/admin-permissions/account/AdminAccountEdit.vue')
  },
  {
    path: '/admin/roles',
    name: 'AdminRoles',
    component: () => import('../../views/admin-permissions/roles/AdminRoles.vue')
  },
  {
    path: '/admin/menus',
    name: 'AdminMenus',
    component: () => import('../../views/admin-permissions/menus/AdminMenus.vue')
  }
]