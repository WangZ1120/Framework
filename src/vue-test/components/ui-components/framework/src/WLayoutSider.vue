<template>
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
</template>
<script lang='ts' setup>
import { UserOutlined } from '@ant-design/icons-vue'
import { ServiceContainer, WServiceTypes } from '@/service/native/WService'
import { IWLoggerService } from '@/service/native/WLoggerService'
import { IWRouterService } from '@/service/native/WRouterService'
import { IWMenuService } from '@/service/native/WMenuService'
import { WMenuEntity } from '@/entity/WMenuEntity'
import { reactive, ref } from 'vue'

const TAG = 'WLayoutSider'

const logger = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER)
const router = ServiceContainer.get<IWRouterService>(WServiceTypes.ROUTER)

const menus = ServiceContainer.get<IWMenuService>(WServiceTypes.MENU).getMenus()

const selectedKeys2 = ref<string[]>(['1'])
const openKeys = ref<string[]>(['sub1'])

const menuList = reactive<Array<WMenuEntity>>(menus)

function onClickMenuItem(data: any): void {
  logger.log(TAG, 'onClickMenuItem: ', data)
  router.push(data.key)
}

</script>
<style scoped lang='scss'>

</style>
