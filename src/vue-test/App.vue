<template>
  <WFramework>
    <router-view></router-view>
  </WFramework>
</template>
<script lang='ts' setup>
import WMasterFrameWork from '@/vue-test/views/WMasterFrameWork.vue'
import { IWAppLoginService } from '@/service/global/WAppLoginService'
import { ref } from 'vue'
import { WAppServiceTypes } from '@/service/global/WAppService'
import { AppServiceContainer } from '@/bootstrap/WBootstrap'
import WFramework from '@/vue-test/components/ui-components/framework/src/WLayout.vue'

const TAG = 'App.vue'

const loginService = AppServiceContainer.get<IWAppLoginService>(WAppServiceTypes.APP_LOGIN)

const isLogin = ref(loginService.isLogin())
loginService.setLoginListener(() => isLogin.value = loginService.isLogin())

</script>
<style>
body {
  margin: 0;
  padding: 0;
}

</style>
