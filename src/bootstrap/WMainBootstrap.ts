import { IWConfig } from '../config/WConfig'
import {
  addGlobalUncaughtErrorHandler, loadMicroApp,
  ObjectType,
  registerMicroApps,
  RegistrableApp,
  setDefaultMountApp,
  start
} from 'qiankun'
import { IWRealBootstrap } from '../bootstrap/WBootstrap'
import { RouteRecordRaw } from 'vue-router'
import { WMenuEntity } from '../entity/WMenuEntity'
import { IWMenuService, WMenuService } from '../service/native/WMenuService'
import { IWMicroLifeCyclesService, WMicroLifeCyclesService } from '../service/native/WMicroLifeCyclesService'
import { ServiceContainer, WServiceTypes } from '../service/native/WService'
import { IWRouterService, WRouterService } from '../service/native/WRouterService'
import { IWLoggerService, WLoggerService } from '../service/native/WLoggerService'

export interface IWMainHelper {
  appName: string
  routes: Array<RouteRecordRaw>

  onStart(routes: Array<RouteRecordRaw>, config?: IWConfig): void

  getRegistrableApp<T extends ObjectType>(): Array<RegistrableApp<T>>
}

const TAG = 'WMainBootstrap'

export class WMainBootstrap implements IWRealBootstrap {
  private helper: IWMainHelper
  private config!: IWConfig
  private apps: Array<RegistrableApp<ObjectType>>
  private routes?: Array<RouteRecordRaw>
  private cachedRoutes?: Array<RouteRecordRaw>
  private cachedMenus?: Array<WMenuEntity>

  private menuService!: IWMenuService
  private routerService!: IWRouterService
  private microLifeCyclesService!: IWMicroLifeCyclesService
  private loggerService!: IWLoggerService

  constructor(helper: IWMainHelper) {
    this.helper = helper
    this.apps = []

    ServiceContainer.bind(WServiceTypes.LOGGER, WLoggerService)
    ServiceContainer.bind(WServiceTypes.MENU, WMenuService)
    ServiceContainer.bind(WServiceTypes.ROUTER, WRouterService)
    ServiceContainer.bind(WServiceTypes.MICRO_LIFE_CYCLES, WMicroLifeCyclesService)
  }

  public async run(config: IWConfig): Promise<void> {
    this.config = config
    this.config.setAppName(this.helper.appName)
    this.config.setRoutePath('/')
    this.routes = this.helper.routes

    this.loggerService = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER, this.config)
    this.menuService = ServiceContainer.get<IWMenuService>(WServiceTypes.MENU, this.config)
    this.routerService = ServiceContainer.get<IWRouterService>(WServiceTypes.ROUTER, this.config)
    this.microLifeCyclesService = ServiceContainer.get<IWMicroLifeCyclesService>(WServiceTypes.MICRO_LIFE_CYCLES, this.config)

    this.cachedMenus = this.menuService.buildMenus()
    if (!this.cachedMenus || this.cachedMenus.length <= 0) {
      throw new Error('没有菜单，请检查配置')
    }

    this.cachedRoutes = this.routerService.buildRoutes(this.routes)
    if (!this.cachedRoutes || this.cachedRoutes.length <= 0) {
      throw new Error('没有路由，请检查配置')
    }

    this.apps = this.apps.concat(this.helper.getRegistrableApp())
    if (this.apps.length <= 0) {
      this.loggerService.warn('未注册 Apps，请在 getRegistrableApp 返回')
    }

    this.loggerService.log(TAG, '配置信息：', this.config)

    this.helper.onStart(this.cachedRoutes, this.config)
    this.startInitQiankun()
  }

  private startInitQiankun(): void {
    registerMicroApps(this.apps, this.microLifeCyclesService.bindLifeCycles())

    addGlobalUncaughtErrorHandler((event) => {
      console.log('全局错误监听：', event)
    })

    start({ sandbox: true })
    this.loggerService.log(TAG, 'qiankun start.')
  }

}
