<template>
  <div class="w-data-table">
    <!-- 头部 -->
    <div class="table-header">
      <!-- 搜索框部分 -->
      <div class="table-search">
        <slot name="search" v-bind="props" />
        <a-button type="primary" :disabled="isLoadingPage" @click="onClickSearch">搜索</a-button>
        <a-button :disabled="isLoadingPage" @click="onClickReset">重置</a-button>
      </div>

      <!-- 扩展按钮部分 -->
      <div style="margin-top: 10px;">
        <slot name="button" />
      </div>
    </div>

    <!-- 中间列表部分 -->
    <div class="table-body">
      <a-table
        :dataSource="dataSource"
        :columns="props.columnData"
        :pagination="false"
        :loading="isLoadingPage"
      />
    </div>

    <!-- 导航部分 -->
    <div class="table-pagination">
      <a-pagination v-model:current="currentPage" :disabled="isLoadingPage" :total="500" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ServiceContainer, WServiceTypes } from '@/service/native/WService'
import { IWLoggerService } from '@/service/native/WLoggerService'

type PropsType = {
  /** 搜索内容 */
  searchData: { [key: string]: any }
  /** 列内容 */
  columnData: Array<{ title: string; dataIndex: string; key: any }>
}

const TAG = 'AdminAccount'
const logger = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER)

let props = defineProps<PropsType>()
let emits = defineEmits(['reset'])

const isLoadingPage = ref(false)
const dataSource = reactive([
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园1号' },
  { key: '2', name: '胡彦祖', age: 42, address: '西湖区湖底公园1号' }
])
const currentPage = ref(1)

const onClickSearch = () => {
  if (isLoadingPage.value) {
    return
  }
  requestList()
}
const onClickReset = () => {
  emits('reset')
}

const requestList = () => {
  isLoadingPage.value = true
  logger.log(TAG, 'onClickSearch props: ', props.searchData)
  setTimeout(() => {
    dataSource.push({
      key: '3',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    })
    dataSource.push({
      key: '4',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    })
    isLoadingPage.value = false
  }, 2000)
}
</script>

<style lang="scss">
.w-data-table {
  display: flex;
  flex-direction: column;

  .ant-form-item {
    margin-bottom: 10px;
    margin-right: 20px;
  }

  .ant-btn {
    margin-right: 10px;
  }

  .table-header {
    border: #2c3e50 solid 1px;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    .table-search {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  .table-body {
    border: #2c3e50 solid 1px;
    margin-bottom: 10px;
  }

  .table-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    border: #2c3e50 solid 1px;
    padding: 10px;
  }
}
</style>
