import { NavigationFailure, RouteLocationRaw, Router } from 'vue-router'
import { IWAppWebHistoryService } from '@/service/global/WAppWebHistoryService'
import { AppServiceContainer } from '@/bootstrap/WBootstrap'
import { WAppServiceTypes } from '@/service/global/WAppService'
import { ServiceContainer, WServiceTypes } from '@/service/native/WService'
import { IWLoggerService } from '@/service/native/WLoggerService'
import { WAppRouterInterceptionService } from '@/service/global/WAppRouterInterceptionService'

export interface IWReadonlyAppRouterService {

  pushMain(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>

  push(routePath: string, to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>

  replace(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>
}

export interface IWAppRouterService extends IWReadonlyAppRouterService {
  setRouter(routePath: string, router: Router): void
}

const TAG = 'WAppRouterService'

export class WAppRouterService implements IWAppRouterService {
  private mainRoutePathPrefix: string
  private routers: Map<string, Router>
  private webHistoryService: IWAppWebHistoryService
  private loggerService: IWLoggerService
  private routerInterceptionService: WAppRouterInterceptionService

  private isInitRouterInterception: boolean = false

  constructor() {
    this.routers = new Map()
    this.mainRoutePathPrefix = '/'
    this.webHistoryService = AppServiceContainer.get<IWAppWebHistoryService>(WAppServiceTypes.APP_WEB_HISTORY)
    this.routerInterceptionService = AppServiceContainer.get<WAppRouterInterceptionService>(WAppServiceTypes.APP_ROUTER_INTERCEPTION)
    this.loggerService = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER)
  }

  public setRouter(routePathPrefix: string, router: Router): void {
    this.loggerService.log(TAG, `设置路由: routePathPrefix：${routePathPrefix} router：${router}`)

    if (this.routers.size <= 0) {
      this.mainRoutePathPrefix = routePathPrefix
    }
    const r = this.routers.get(routePathPrefix)
    if (r) {
      return
    }
    this.routers.set(routePathPrefix, router)

    if (!this.isInitRouterInterception) {
      this.routerInterceptionService.initMainRouter(router)
      this.isInitRouterInterception = true
    }
  }

  public pushMain(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined> {
    return this.routers.get(this.mainRoutePathPrefix)!.push(to)
  }

  public push(routePathPrefix: string, to: RouteLocationRaw): Promise<NavigationFailure | void | undefined> {
    this.loggerService.log(TAG, `push 被触发 routePathPrefix: ${routePathPrefix} to: ${to}`)

    let toRouter: Router | undefined
    let toRouterPath: string = to as any
    let lastHistory = this.webHistoryService.getLastHistory()
    let isSameLast: boolean = false

    let isFromMicro: boolean = routePathPrefix !== this.mainRoutePathPrefix && toRouterPath.indexOf(routePathPrefix) === -1
    if (isFromMicro) {
      toRouter = this.routers.get(routePathPrefix)
      this.loggerService.log(TAG, `是子应用:`, toRouterPath)
    }

    if (!toRouter && lastHistory && toRouterPath.indexOf(lastHistory.routePathPrefix) !== -1) {
      let lastRouter = this.routers.get(lastHistory.routePathPrefix)
      if (lastRouter) {
        isSameLast = true
        toRouter = lastRouter
        routePathPrefix = lastHistory.routePathPrefix
        this.loggerService.log(TAG, `是子应用2:`, toRouterPath)
      }
    }

    if (!toRouter) {
      toRouter = this.routers.get(this.mainRoutePathPrefix)!
      this.loggerService.log(TAG, `未找到路由,使用主应用的 Router:`, toRouterPath)
    }

    let historyRoutePrefix
    if (isFromMicro || isSameLast) {
      historyRoutePrefix = routePathPrefix
    } else {
      historyRoutePrefix = '/' + this.parseUri(toRouterPath)[0]
    }
    this.webHistoryService.addHistory(toRouterPath, historyRoutePrefix)

    if (isSameLast) {
      toRouterPath = toRouterPath.replace(new RegExp(routePathPrefix), '')
    }

    this.loggerService.log(TAG, `跳转:`, toRouterPath)
    return toRouter.push(toRouterPath)
  }

  public replace(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined> {
    return this.routers.get(this.mainRoutePathPrefix)!.replace(to)
  }

  private parseUri(uri: string): Array<string> {
    let uris = uri.split('/')
    return uris.slice(1)
  }
}