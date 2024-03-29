<template>
  <button @click='onClickMicroApp'>打开子项目</button>
  <button @click='onClickMicroApp2'>打开子项目2</button>

  <div id='mainapp'></div>
</template>
<script lang='ts' setup>
import { useRouter } from 'vue-router'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'

const router = useRouter()

let microApp: MicroApp | undefined
let microApp2: MicroApp | undefined

const onClickMicroApp = async () => {
  if (microApp === undefined) {
    microApp = await loadMicroApp({
      name: 'demo-children1',
      entry: '//localhost:8888',
      container: '#appmain'
    })
  } else {
    router.push('/children1/')
  }
}

const onClickMicroApp2 = () => {
  if (microApp2 === undefined) {
    microApp2 = loadMicroApp({
      name: 'demo-children2',
      entry: '//localhost:9999',
      container: '#appmain'
    })
  } else {
    router.push('/children2/')
  }
}

</script>
<style></style>
