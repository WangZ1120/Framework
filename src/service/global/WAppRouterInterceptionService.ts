import { IWConfig } from '@/config/WConfig'
import { NavigationFailure, NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'
import { IWLoggerService } from '@/service/native/WLoggerService'
import { ServiceContainer, WServiceTypes } from '@/service/native/WService'
import { IWAppLoginService } from '@/service/global/WAppLoginService'
import { AppServiceContainer } from '@/bootstrap/WBootstrap'
import { WAppServiceTypes } from '@/service/global/WAppService'
import { loadMicroApp } from 'qiankun'

export interface IWReadonlyAppRouterInterceptionService {
}

export interface IWAppRouterInterceptionService extends IWReadonlyAppRouterInterceptionService {
  initMainRouter(router: Router): void
}

const TAG = 'WAppRouterInterceptionService'

export class WAppRouterInterceptionService implements IWAppRouterInterceptionService {
  private config: IWConfig
  private router!: Router

  private loggerService: IWLoggerService
  private loginService: IWAppLoginService

  constructor(config: IWConfig) {
    this.config = config
    this.loggerService = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER)
    this.loginService = AppServiceContainer.get<IWAppLoginService>(WAppServiceTypes.APP_LOGIN)
  }

  public initMainRouter(router: Router): void {
    this.router = router

    this.router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      this.loggerService.log(TAG, `beforeEach to: ${to.path} from: ${from.path}`)

      if (!this.loginService.isLogin()) {
        this.loginService.startLogin()
        return
      }

      if (to.path === '/login' && this.loginService.isLogin()) {
        this.loggerService.log(TAG, '已登录，跳转到首页')
        next('/')
        return
      }

      next()
    })
  }
}