<template>
  <a-layout style='height: 100vh'>
    <a-layout-header class='header'>
      <div class='logo' />
    </a-layout-header>
    <a-layout>
      <a-layout-sider width='200' style='background: #fff'>
        <div style='height: 100%; overflow: auto'>
          <a-menu
            v-model:selectedKeys='selectedKeys2'
            v-model:openKeys='openKeys'
            mode='inline'
            :style="{ height: '100%', borderRight: 0 }"
            @click='onClickMenuItem'
          >
            <div v-for='(item, index) in menuList' :key='index'>
              <a-sub-menu :key='item.id'>
                <template #title>
                  <span>
                    <user-outlined />
                    {{ item.name }}
                  </span>
                </template>
                <div v-for='(childrenItem, childrenIndex) in item.children' :key='childrenIndex'>
                  <a-menu-item :key='childrenItem.routePath'>{{ childrenItem.name }}</a-menu-item>
                </div>
              </a-sub-menu>
            </div>
          </a-menu>
        </div>
      </a-layout-sider>
      <a-layout style='padding: 0 12px 12px'>
        <a-breadcrumb style='margin: 12px 0'>
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '12px',
            margin: '0',
            height: '100%',
            overflow: 'auto'
          }"
        >
          <slot></slot>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { IWMenuService } from '@/service/native/WMenuService'
import { WMenuEntity } from '@/entity/WMenuEntity'
import { ServiceContainer, WServiceTypes } from '@/service/native/WService'
import { IWLoggerService } from '@/service/native/WLoggerService'
import { IWRouterService } from '@/service/native/WRouterService'

const TAG = 'WMasterFramework'

const logger = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER)
const router = ServiceContainer.get<IWRouterService>(WServiceTypes.ROUTER)

// const emit = defineEmits<{
//   (e: 'menu-click', data: any): void
// }>()

const menus = ServiceContainer.get<IWMenuService>(WServiceTypes.MENU).getMenus()
logger.log(TAG, 'menus: ', menus)

const selectedKeys2 = ref<string[]>(['1'])
const openKeys = ref<string[]>(['sub1'])

const menuList = reactive<Array<WMenuEntity>>(menus)

function onClickMenuItem(data: any): void {
  logger.log(TAG, 'onClickMenuItem: ', data)
  router.push(data.key)
}
</script>
<style>
body {
  margin: 0;
}

.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
