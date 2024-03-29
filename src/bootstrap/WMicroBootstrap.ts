import { IWRealBootstrap } from './WBootstrap'
import { IWConfig } from '../config/WConfig'
import { RouteRecordRaw } from 'vue-router'
import { IWRouterService, WRouterService } from '../service/native/WRouterService'
import { ServiceContainer, WServiceTypes } from '../service/native/WService'
import { IWLoggerService, WLoggerService } from '../service/native/WLoggerService'

export interface IWMicroHelper {
  appName: string
  routePath: string
  routes: Array<RouteRecordRaw>

  onBootstrap?(config?: IWConfig): void

  onMount(routes: Array<RouteRecordRaw>, props: any, config?: IWConfig): void

  onUnmount?(props: any, config?: IWConfig): void

  onUpdate?(props: any, config?: IWConfig): void
}

const TAG = 'WMicroBootstrap'

export class WMicroBootstrap implements IWRealBootstrap {
  public static MICRO_BOOTSTRAP_INSTANCE: WMicroBootstrap

  private helper: IWMicroHelper
  private config!: IWConfig
  private routes?: Array<RouteRecordRaw>
  private cachedRoutes!: Array<RouteRecordRaw>
  private routerService!: IWRouterService
  private loggerService!: IWLoggerService

  constructor(helper: IWMicroHelper) {
    this.helper = helper
    WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE = this

    ServiceContainer.bind(WServiceTypes.LOGGER, WLoggerService)
    ServiceContainer.bind(WServiceTypes.ROUTER, WRouterService)
  }

  public async run(config: IWConfig): Promise<void> {
    this.config = config
    this.config.setAppName(this.helper.appName)
    this.config.setRoutePath(this.helper.routePath)

    this.routes = this.helper.routes

    this.loggerService = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER, this.config)
    this.routerService = ServiceContainer.get<IWRouterService>(WServiceTypes.ROUTER, this.config)

    this.cachedRoutes = this.routerService.buildRoutes(this.routes)
    if (!this.cachedRoutes || this.cachedRoutes.length <= 0) {
      throw new Error('没有路由，请检查配置')
    }
    this.loggerService.log(TAG, '配置信息：', this.config)
  }

  public onBootstrap(): void {
    if (this.helper.onBootstrap) {
      this.helper.onBootstrap(this.config)
    }
  }

  public async onMount(props: any): Promise<void> {
    this.helper.onMount(this.cachedRoutes, props, this.config)
  }

  public onUnmount(props: any): void {
    if (this.helper.onUnmount) {
      this.helper.onUnmount(props, this.config)
    }
  }

  public onUpdate(props: any): void {
    if (this.helper.onUpdate) {
      this.helper.onUpdate(props, this.config)
    }
  }
}

export async function bootstrap() {
  if (WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE) {
    WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE.onBootstrap()
  }
}

export async function mount(props: any) {
  if (WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE) {
    WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE.onMount(props)
  }
}

export async function unmount(props: any) {
  if (WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE) {
    WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE.onUnmount(props)
  }
}

export async function update(props: any) {
  if (WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE) {
    WMicroBootstrap.MICRO_BOOTSTRAP_INSTANCE.onUpdate(props)
  }
}
