<template>
  <a-layout style='height: 100vh'>
    <w-layout-header />
    <a-layout>
      <w-layout-sider />
      <a-layout style='padding: 0 12px 12px'>
        <w-layout-breadcrumb />
        <w-layout-content>
          <slot></slot>
        </w-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang='ts' setup>
import WLayoutHeader from '@/vue-test/components/ui-components/framework/src/WLayoutHeader.vue'
import WLayoutSider from '@/vue-test/components/ui-components/framework/src/WLayoutSider.vue'
import WLayoutBreadcrumb from '@/vue-test/components/ui-components/framework/src/WLayoutBreadcrumb.vue'
import WLayoutContent from '@/vue-test/components/ui-components/framework/src/WLayoutContent.vue'

const TAG = 'WMasterFramework'

</script>
<style>

</style>
