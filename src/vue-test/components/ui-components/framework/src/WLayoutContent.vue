<template>
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
</template>
<script lang='ts' setup>
const TAG = 'WLayoutContent'

</script>
<style scoped lang='scss'>

</style>
