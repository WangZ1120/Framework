import { NavigationFailure, RouteLocationRaw, Router, RouteRecordRaw } from 'vue-router'
import { AppServiceContainer } from '@/bootstrap/WBootstrap'
import { WAppServiceTypes } from '@/service/global/WAppService'
import { IWAppRouterBuilderService } from '@/service/global/WAppRouterBuilderService'
import { IWConfig } from '@/config/WConfig'
import { IWAppRouterService } from '@/service/global/WAppRouterService'
import { IWLoggerService } from '@/service/native/WLoggerService'
import { ServiceContainer, WServiceTypes } from '@/service/native/WService'

export interface IWReadonlyRouterService {
  pushMain(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>

  push(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;

  getRoutes(): Array<RouteRecordRaw>

  getRouter(): Router;
}

export interface IWRouterService extends IWReadonlyRouterService {
  setRouter(router: Router): void

  buildRoutes(routes: Array<RouteRecordRaw>): Array<RouteRecordRaw>
}

const TAG = 'WRouterService'

export class WRouterService implements IWRouterService {
  private cachedRoutes: Array<RouteRecordRaw> = []
  private config: IWConfig
  private router!: Router
  private appRouterBuilderService: IWAppRouterBuilderService
  private appRouterService: IWAppRouterService
  private loggerService: IWLoggerService

  constructor(config: IWConfig) {
    this.config = config
    this.appRouterBuilderService = AppServiceContainer.get<IWAppRouterBuilderService>(WAppServiceTypes.APP_ROUTER_BUILDER)
    this.appRouterService = AppServiceContainer.get<IWAppRouterService>(WAppServiceTypes.APP_ROUTER)
    this.loggerService = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER)
  }

  public buildRoutes(routes: Array<RouteRecordRaw>): Array<RouteRecordRaw> {
    if (!this.cachedRoutes || this.cachedRoutes.length <= 0) {
      this.cachedRoutes = this.appRouterBuilderService.buildRoutes(routes)
    }
    return this.cachedRoutes
  }

  public setRouter(router: Router): void {
    this.loggerService.log(TAG, '设置路由：', this.config.getRoutePath(), ' | ', router)
    this.router = router
    this.appRouterService.setRouter(this.config.getRoutePath(), router)
  }

  public getRouter(): Router {
    return this.router
  }

  public getRoutes(): Array<RouteRecordRaw> {
    return this.cachedRoutes
  }

  public pushMain(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined> {
    return this.appRouterService.pushMain(to)
  }

  public push(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined> {
    return this.appRouterService.push(this.config.getRoutePath(), to)
  }
}