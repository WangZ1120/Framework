import { IWLibHelper, WBootstrap } from '@/bootstrap/WBootstrap'
import 'reflect-metadata'
import './RegisterServiceWorker'
import { createApp } from 'vue'
import AppView from './vue-test/App.vue'
import {
  Breadcrumb,
  Button,
  Card, DatePicker,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Pagination,
  Select,
  Space,
  Table
} from 'ant-design-vue'
import i18n from './i18n/Index'
import { ObjectType, RegistrableApp } from 'qiankun'
import { IWMainHelper } from '@/bootstrap/WMainBootstrap'
import { routes } from '@/vue-test/router/routes/Index'
import { IWMicroHelper } from './bootstrap/WMicroBootstrap'
import '@/service/native/WService'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { IWConfig } from '@/config/WConfig'
import { ServiceContainer, WServiceTypes } from '@/service/native/WService'
import { IWRouterService } from '@/service/native/WRouterService'
import { IWLoggerService } from '@/service/native/WLoggerService'

const TAG = 'MainBootstrap'

/** 主应用 */
export class MainBootstrap implements IWMainHelper {
  public appName: string = 'Framework'
  public routes: Array<RouteRecordRaw> = routes
  public routerService!: IWRouterService
  public logger!: IWLoggerService

  public onStart(routes: Array<RouteRecordRaw>, config?: IWConfig): void {
    this.logger = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER)
    this.routerService = ServiceContainer.get<IWRouterService>(WServiceTypes.ROUTER)
    this.logger.log(TAG, 'onStart')

    const app = createApp(AppView)
    const router = createRouter({
      history: createWebHistory('/'),
      routes: this.routerService.getRoutes()
    })
    app.use(router)
    this.routerService.setRouter(router)

    app.use(Button)
    app.use(Menu)
    app.use(Layout)
    app.use(Breadcrumb)
    app.use(Card)
    app.use(Modal)
    app.use(Input)
    app.use(Space)
    app.use(Form)
    app.use(Table)
    app.use(Pagination)
    app.use(Select)
    app.use(DatePicker)

    app.use(i18n)
    app.mount('#app')
  }

  public getRegistrableApp<T extends ObjectType>(): Array<RegistrableApp<T>> {
    // return devMicroApps
    return []
  }
}

/** 子应用 */
export class MicroBootstrap implements IWMicroHelper {
  public appName: string = 'Framework'
  public routePath: string = '/framework'
  public routes: Array<RouteRecordRaw> = routes

  public onMount(props: any): void {
    // 子项目的生命周期函数，可在此方法中创建 Vue 实例
  }
}

/** 库 */
export class LibBootstrap implements IWLibHelper {
  public onInstallation(config?: IWConfig | undefined): void {
    // 可在此方法中获取主项目、子项目以及其他库传递过来的信息
    // 如果不需要初始化数据，都可以不实现 IWLibHelper 接口
  }
}

let bootstrap = new WBootstrap(process.env.VUE_APP_MODE)
bootstrap.addBootstrap(LibBootstrap)
bootstrap.addBootstrap(MainBootstrap)
bootstrap.run()
